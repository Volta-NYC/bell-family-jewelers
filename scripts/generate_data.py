from __future__ import annotations

import base64
import hashlib
import json
import mimetypes
import os
import re
import urllib.parse
import urllib.request
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

ROOT = Path('/home/runner/work/bell-family-jewelers/bell-family-jewelers')
RAW_DIR = ROOT / 'raw messy data'
DATA_DIR = ROOT / 'data'
MEDIA_DIR = ROOT / 'public' / 'media'

DATA_DIR.mkdir(parents=True, exist_ok=True)
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

try:
    from PIL import Image
    PIL_AVAILABLE = True
except Exception:
    PIL_AVAILABLE = False


@dataclass
class PageMeta:
    source_file: str
    source_url: Optional[str]
    title: Optional[str]
    slug: str


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'-+', '-', text).strip('-')
    return text or 'item'


def parse_frontmatter(md: str) -> tuple[Optional[str], Optional[str]]:
    m = re.match(r'^---\n(.*?)\n---', md, flags=re.S)
    if not m:
        return None, None
    block = m.group(1)
    url_m = re.search(r'^url:\s*"?(.*?)"?$', block, flags=re.M)
    title_m = re.search(r'^title:\s*"?(.*?)"?$', block, flags=re.M)
    return (url_m.group(1).strip() if url_m else None, title_m.group(1).strip() if title_m else None)


def get_slug_from_url_or_file(url: Optional[str], file_path: Path) -> str:
    if url:
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.strip('/')
        return 'home' if not path else slugify(path)
    stem = file_path.stem.replace('www.bellfamilyjewelers.com_', '')
    return 'home' if stem == '' else slugify(stem)


def normalize_url(url: str) -> str:
    url = url.strip().strip('<>').strip()
    if url.endswith('"') and '(' in url:
        url = url.split('"')[0]
    return url


def extract_image_urls(md: str) -> list[str]:
    urls = []
    for u in re.findall(r'!\[[^\]]*\]\(([^)]+)\)', md):
        u = normalize_url(u)
        if not u or 'Base64-Image-Removed' in u:
            continue
        if u.startswith('http://') or u.startswith('https://') or u.startswith('data:image/'):
            urls.append(u)
    return urls


def content_lines(md: str) -> list[str]:
    lines = []
    for line in md.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.startswith(('---', '#', '- [', '![', '|', '`')):
            continue
        if s.lower() in {'top of page', 'bottom of page', 'skip to main content'}:
            continue
        if len(s) < 3:
            continue
        lines.append(s)
    return lines


def extract_products(md: str, page_meta: PageMeta, page_category: str, inquiry_note: Optional[str]) -> list[dict]:
    products = []
    pattern = re.compile(
        r'\[!\[(?P<name>[^\]]+)\]\((?P<img>https?://[^)]+)\)'
        r'(?P<segment>[\s\S]{0,900}?)'
        r'(?:\*\*STYLE\s+\\#\s*(?P<style1>[^*\\\n]+)\*\*|####\s+STYLE\s+\\#\s*(?P<style2>[^\n]+))'
        r'(?P<tail>[\s\S]{0,320})',
        flags=re.S,
    )

    for m in pattern.finditer(md):
        name = re.sub(r'\\+', ' ', m.group('name')).strip()
        img = m.group('img').strip()
        segment = m.group('segment')
        tail = m.group('tail')
        link_match = re.search(r'https://iframes\.ovnight\.com/[^\s)\"]+\.html\?customerid=', tail)
        if not link_match:
            link_match = re.search(r'https://bellfamilyjewelers-frame\.jewelershowcase\.com/[^\s)\"]+', tail)
        if not link_match:
            continue
        link = link_match.group(0).strip()
        style_number = (m.group('style1') or m.group('style2') or '').strip()

        blocked_name_tokens = {'facebook', 'instagram', 'google', 'next', 'set ascending direction'}
        lowered_name = name.lower()
        if any(token in lowered_name for token in blocked_name_tokens):
            continue
        if not style_number:
            continue
        if '/media/catalog/product/' not in img and 'placeholder/thumbnail.jpg' not in img:
            continue

        availability = 'in_stock_or_unspecified'
        tags = []
        if 'Available in a Series' in segment:
            tags.append('available-in-series')
        if 'placeholder/thumbnail.jpg' in img:
            tags.append('placeholder-image')

        product_slug_basis = style_number or name
        product_slug = slugify(product_slug_basis)

        products.append(
            {
                'name': name,
                'slug': product_slug,
                'category': page_category,
                'subcategory': None,
                'price': None,
                'compareAtPrice': None,
                'availability': availability,
                'badges': tags,
                'fullDescription': None,
                'specifications': {'styleNumber': style_number} if style_number else {},
                'materials': [],
                'variants': [],
                'imageUrls': [img],
                'imagePaths': [],
                'priceNote': inquiry_note,
                'sourcePageUrl': page_meta.source_url,
                'sourceMarkdownFile': page_meta.source_file,
                'productPageUrl': link,
            }
        )

    unique = {}
    for p in products:
        key = (p['slug'], p['productPageUrl'])
        if key not in unique:
            unique[key] = p
    return list(unique.values())


def detect_category(file_name: str, title: Optional[str]) -> str:
    f = file_name.lower()
    if 'wedding-bands' in f:
        return 'Wedding Bands'
    if 'pendants' in f:
        return 'Pendants'
    if 'bracelets' in f:
        return 'Bracelets'
    if 'earings' in f or 'earrings' in f:
        return 'Earrings'
    if 'color-bands' in f:
        return 'Color Rings'
    if 'design' in f:
        return 'Engagement Rings'
    if title:
        t = title.split('|')[0].strip().title()
        return t
    return 'Jewelry'


def parse_business(all_text: str, pages: list[dict]) -> dict:
    emails = sorted(set(re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', all_text, flags=re.I)))

    phones_raw = re.findall(r'(?:\+?1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}', all_text)
    def normalize_phone(p: str) -> str:
        digits = re.sub(r'\D', '', p)
        if len(digits) == 11 and digits.startswith('1'):
            digits = digits[1:]
        if len(digits) == 10:
            return f'({digits[:3]}) {digits[3:6]}-{digits[6:]}'
        return p.strip()

    phones = sorted(
        set(
            normalize_phone(p)
            for p in phones_raw
            if normalize_phone(p).startswith('(718)')
        )
    )

    address_match = re.search(r'40-21\s+Bell\s+Blvd[.,]?\s*Bayside,?\s*NY\s*11361', all_text, flags=re.I)
    address = address_match.group(0).replace('  ', ' ') if address_match else None

    hours = {}
    day_pattern = re.compile(r'(TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY\s*&\s*MONDAY)\s*-\s*([0-9:AMP\s\-\.]+|CLOSED)', flags=re.I)
    for day, val in day_pattern.findall(all_text):
        hours[day.title()] = ' '.join(val.split())

    promotions = []
    for p in pages:
        for line in p.get('headings', []) + p.get('promotions', []):
            if (
                ('%' in line or 'inquire with store for pricing' in line.lower() or 'off' in line.lower())
                and len(line) < 140
                and 'data:image' not in line
                and 'http' not in line
            ):
                if line not in promotions:
                    promotions.append(line)

    return {
        'name': 'Bell Family Jewelers',
        'address': address,
        'phones': phones,
        'emails': emails,
        'hours': hours,
        'social': {
            'facebook': 'http://www.facebook.com/bellfamilyjewelers',
            'instagram': 'http://www.instagram.com/bellfamilyjewelers',
        },
        'promotions': promotions,
        'homepageCopy': [
            'Engagement rings are the ultimate expression of love, and Bell Family Jewelers helps you design the engagement ring of your dreams.',
            'We help transform old or unwanted jewelry into treasures that reflect your true style.',
        ],
    }


def optimize_image(path: Path) -> None:
    if not PIL_AVAILABLE:
        return
    try:
        suffix = path.suffix.lower()
        if suffix not in {'.jpg', '.jpeg', '.png', '.webp'}:
            return
        with Image.open(path) as img:
            if suffix in {'.jpg', '.jpeg'}:
                img = img.convert('RGB')
                img.save(path, format='JPEG', quality=82, optimize=True)
            elif suffix == '.png':
                img.save(path, format='PNG', optimize=True)
            elif suffix == '.webp':
                img.save(path, format='WEBP', quality=82, method=6)
    except Exception:
        return


def make_fallback_image(path: Path, text_seed: str) -> None:
    if PIL_AVAILABLE:
        try:
            from PIL import ImageDraw

            img = Image.new('RGB', (1200, 800), color=(25, 25, 30))
            draw = ImageDraw.Draw(img)
            draw.rectangle((40, 40, 1160, 760), outline=(170, 145, 95), width=3)
            short = text_seed[:64]
            draw.text((80, 370), f'Media unavailable\\n{short}', fill=(225, 225, 225))
            img.save(path, format='PNG', optimize=True)
            return
        except Exception:
            pass
    path.write_bytes(base64.b64decode(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO5Qk5UAAAAASUVORK5CYII='
    ))


def ext_from_url_or_type(url: str, content_type: Optional[str]) -> str:
    parsed = urllib.parse.urlparse(url)
    ext = Path(parsed.path).suffix.lower()
    if ext and len(ext) <= 6:
        return ext
    if content_type:
        guessed = mimetypes.guess_extension(content_type.split(';')[0].strip())
        if guessed:
            return guessed
    return '.bin'


def download_media(media_records: list[dict]) -> tuple[list[dict], dict[str, str]]:
    seen_hash_to_path: dict[str, str] = {}
    url_to_local: dict[str, str] = {}
    output_records = []

    for rec in media_records:
        original = rec['originalUrl']
        local_path = None

        try:
            if original.startswith('data:image/'):
                header, raw_data = original.split(',', 1)
                mime = header.split(';')[0].replace('data:', '').strip()
                if ';base64' in header:
                    data = base64.b64decode(raw_data)
                else:
                    data = urllib.parse.unquote_to_bytes(raw_data)
                ext = mimetypes.guess_extension(mime) or '.png'
            else:
                req = urllib.request.Request(original, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=20) as resp:
                    data = resp.read()
                    ctype = resp.headers.get('Content-Type')
                ext = ext_from_url_or_type(original, ctype)

            digest = hashlib.sha256(data).hexdigest()
            if digest in seen_hash_to_path:
                local_path = seen_hash_to_path[digest]
            else:
                name_part = Path(urllib.parse.urlparse(original).path).stem or 'media'
                filename = f"{slugify(name_part)[:40]}-{digest[:12]}{ext}"
                abs_path = MEDIA_DIR / filename
                abs_path.write_bytes(data)
                optimize_image(abs_path)
                local_path = f"/media/{filename}"
                seen_hash_to_path[digest] = local_path

            url_to_local[original] = local_path
            out = dict(rec)
            out['localFilePath'] = local_path
            output_records.append(out)
        except Exception as e:
            digest = hashlib.sha256(original.encode('utf-8')).hexdigest()
            filename = f"fallback-{digest[:12]}.png"
            abs_path = MEDIA_DIR / filename
            if not abs_path.exists():
                make_fallback_image(abs_path, original)
            fallback_path = f"/media/{filename}"
            url_to_local[original] = fallback_path
            out = dict(rec)
            out['localFilePath'] = fallback_path
            out['error'] = f'fallback: {e}'
            output_records.append(out)

    return output_records, url_to_local


def main() -> None:
    md_files = sorted(RAW_DIR.rglob('*.md'))

    pages = []
    all_products = []
    media_records = []
    all_text_parts = []
    collections_map = {}

    for md_file in md_files:
        rel = str(md_file.relative_to(ROOT))
        md = md_file.read_text(encoding='utf-8', errors='ignore')
        all_text_parts.append(md)

        source_url, title = parse_frontmatter(md)
        slug = get_slug_from_url_or_file(source_url, md_file)
        page_meta = PageMeta(source_file=rel, source_url=source_url, title=title, slug=slug)

        headings = [h.strip() for _, h in re.findall(r'^(#{1,6})\s+(.+)$', md, flags=re.M)]
        clean_lines = content_lines(md)
        promos = [line for line in clean_lines if '%' in line or 'inquire with store for pricing' in line.lower()]
        images = extract_image_urls(md)

        page_obj = {
            'slug': slug,
            'title': title,
            'sourceUrl': source_url,
            'sourceMarkdownFile': rel,
            'headings': headings[:30],
            'contentPreview': clean_lines[:40],
            'promotions': promos,
            'mediaUrls': images,
        }
        pages.append(page_obj)

        category = detect_category(md_file.name, title)
        if category not in collections_map:
            collections_map[category] = {
                'name': category,
                'slug': slugify(category),
                'description': f'{category} collection from Bell Family Jewelers source catalog.',
                'sourcePages': [],
                'imageUrls': [],
            }
        if source_url and source_url not in collections_map[category]['sourcePages']:
            collections_map[category]['sourcePages'].append(source_url)

        inquiry_note = None
        for line in clean_lines:
            if 'inquire with store for pricing' in line.lower():
                inquiry_note = line
                break

        products = extract_products(md, page_meta, category, inquiry_note)
        all_products.extend(products)

        product_url_map = {p['imageUrls'][0]: p['name'] for p in products if p.get('imageUrls')}
        for img in images:
            media_records.append(
                {
                    'originalUrl': img,
                    'associatedProduct': product_url_map.get(img),
                    'associatedPage': source_url,
                    'sourceMarkdownFile': rel,
                }
            )

    media_map, url_to_local = download_media(media_records)

    for p in all_products:
        p['imagePaths'] = [url_to_local[u] for u in p['imageUrls'] if u in url_to_local and url_to_local[u]]
        p.pop('imageUrls', None)

    for c in collections_map.values():
        c_products = [p for p in all_products if p['category'] == c['name']]
        imgs = []
        for p in c_products[:12]:
            imgs.extend(p['imagePaths'])
        c['imagePaths'] = list(dict.fromkeys([i for i in imgs if i]))
        c['productCount'] = len(c_products)

    all_text = '\n'.join(all_text_parts)
    business = parse_business(all_text, pages)

    services_page = next((p for p in pages if p['slug'] == 'services'), None)
    if services_page:
        service_items = [
            h for h in services_page['headings']
            if h.upper() == h and h not in {'ALL ONLINE JEWELRY', 'IN STORE ONLY', '30 - 50% OFF', 'SERVICES'}
        ]
        business['services'] = list(dict.fromkeys(service_items))

    designers = []
    for name in ['Endless Designs', 'Phillip Gavriel', 'Royal Jewelry', 'Royal Chain', 'Valina']:
        designers.append({'name': name, 'slug': slugify(name)})

    business['designers'] = designers

    DATA_DIR.joinpath('products.json').write_text(json.dumps(all_products, indent=2), encoding='utf-8')
    DATA_DIR.joinpath('collections.json').write_text(json.dumps(list(collections_map.values()), indent=2), encoding='utf-8')
    DATA_DIR.joinpath('pages.json').write_text(json.dumps(pages, indent=2), encoding='utf-8')
    DATA_DIR.joinpath('business.json').write_text(json.dumps(business, indent=2), encoding='utf-8')
    DATA_DIR.joinpath('media-map.json').write_text(json.dumps(media_map, indent=2), encoding='utf-8')

    print(f'Processed markdown files: {len(md_files)}')
    print(f'Products extracted: {len(all_products)}')
    print(f'Media records: {len(media_map)}')


if __name__ == '__main__':
    main()
