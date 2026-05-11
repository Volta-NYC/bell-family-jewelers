from __future__ import annotations

import base64
import hashlib
import html
import io
import json
import mimetypes
import re
import urllib.parse
import urllib.request
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "raw messy data"
DATA_DIR = ROOT / "data"
MEDIA_DIR = ROOT / "public" / "media"

DATA_DIR.mkdir(parents=True, exist_ok=True)
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

try:
    from PIL import Image, ImageDraw

    PIL_AVAILABLE = True
except Exception:
    PIL_AVAILABLE = False


@dataclass
class PageMeta:
    source_file: str
    source_url: Optional[str]
    title: Optional[str]
    slug: str


PRODUCT_PAGE_RE = re.compile(r"https://iframes\.ovnight\.com/[^\s)\"]+\.html\?customerid=?", re.I)
CATALOG_IMAGE_RE = re.compile(r"!\[([^\]]*)\]\((https?://[^)]+/media/catalog/product/[^)]+)\)", re.I)
MD_IMAGE_RE = re.compile(r"!\[[^\]]*\]\((<[^>]+>|[^)\s]+)\)")
MD_LINK_RE = re.compile(r"\[[^\]]+\]\((<[^>]+>|[^)\s]+)(?:\s+\"[^\"]+\")?\)")

PRODUCT_PAGE_FILES = {
    "www.bellfamilyjewelers.com_design.md": ("Engagement Rings", "Round Halo Engagement Rings"),
    "www.bellfamilyjewelers.com_wedding-bands.md": ("Wedding Bands", "5 Stone Prong Set Wedding Bands"),
    "www.bellfamilyjewelers.com_color-bands.md": ("Color Rings", "Oval Color Rings"),
    "www.bellfamilyjewelers.com_earings.md": ("Earrings", "Hoop Earrings"),
    "www.bellfamilyjewelers.com_pendants.md": ("Pendants", "Round Halo Pendants"),
    "www.bellfamilyjewelers.com_bracelets.md": ("Bracelets", "Bracelets"),
}

DESIGNER_FILES = {
    "www.bellfamilyjewelers.com_endless-designs.md": "Endless Designs",
    "www.bellfamilyjewelers.com_phillip-gavriel.md": "Phillip Gavriel",
    "www.bellfamilyjewelers.com_royal-jewelry.md": "Royal Jewelry",
    "www.bellfamilyjewelers.com_copy-of-royal-jewelry.md": "Royal Chain",
    "www.bellfamilyjewelers.com_valina.md": "Valina",
}

EDUCATION_SLUGS = {
    "diamonds",
    "diamond-cut",
    "diamond-color",
    "diamond-clarity",
    "diamond-carat-weight",
    "pearls",
    "gemstones",
    "platinum",
    "gold",
    "silver",
    "pure-grown",
    "what-is-a-puregrowndiamond",
    "ring-size-sheet",
    "necklace-resources",
}

NOISE_EXACT = {
    "top of page",
    "bottom of page",
    "skip to main content",
    "use tab to navigate through the menu items.",
    "loadbalancer.visitor-analytics.io",
    "this page has been blocked by an extension",
    "err_blocked_by_client",
    "reload",
    "facebook - black circle",
    "instagram - black circle",
    "keyboard shortcuts",
    "map data",
    "success! message received.",
    "send",
    "more",
    "home",
    "catalog",
    "shop all",
    "brands",
    "education",
    "about",
    "contact us",
    "blog",
    "services",
    "our",
    "all online jewelry",
    "in store only",
    "30 - 50% off",
    "pendants",
    "wedding bands",
    "color rings",
    "earings",
    "earrings",
    "silver",
    "bracelets",
    "engagement rings",
    "diamonds",
    "pearls",
    "gemstones",
    "platinum",
    "gold",
    "endless designs",
    "phillip gavriel",
    "royal jewelry",
    "royal chain",
    "valina",
}


def slugify(text: str) -> str:
    text = clean_text(text).lower().strip()
    text = re.sub(r"&", " and ", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text or "item"


def clean_text(value: str) -> str:
    value = html.unescape(value or "")
    value = value.replace("\u00a0", " ").replace("\u200b", " ")
    value = value.replace("\\#", "#").replace("\\|", "|").replace("\\_", "_")
    value = value.replace("\\", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def clean_markdown_line(line: str) -> str:
    line = clean_text(line.strip())
    line = re.sub(r"^#{1,6}\s*", "", line)
    line = re.sub(r"^\d+\.\s*", "", line)
    line = re.sub(r"^[-*]\s*", "", line)
    line = re.sub(r"`([^`]+)`", r"\1", line)
    line = re.sub(r"\*\*([^*]+)\*\*", r"\1", line)
    line = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", line)
    return clean_text(line)


def parse_frontmatter(md: str) -> tuple[Optional[str], Optional[str]]:
    match = re.match(r"^---\n(.*?)\n---", md, flags=re.S)
    if not match:
        return None, None
    block = match.group(1)
    url_match = re.search(r'^url:\s*"?(.*?)"?$', block, flags=re.M)
    title_match = re.search(r'^title:\s*"?(.*?)"?$', block, flags=re.M)
    return (
        clean_text(url_match.group(1)) if url_match else None,
        clean_text(title_match.group(1)) if title_match else None,
    )


def get_slug_from_url_or_file(url: Optional[str], file_path: Path) -> str:
    if url:
        path = urllib.parse.urlparse(url).path.strip("/")
        return "home" if not path else slugify(path)
    stem = file_path.stem.replace("www.bellfamilyjewelers.com_", "")
    return "home" if not stem else slugify(stem)


def normalize_url(url: str) -> str:
    url = clean_text(url).strip("<>")
    if not url or "Base64-Image-Removed" in url:
        return ""
    return url


def extract_media_urls(md: str) -> list[str]:
    urls: list[str] = []
    for match in MD_IMAGE_RE.finditer(md):
        url = normalize_url(match.group(1))
        if url and (url.startswith(("http://", "https://", "data:image/"))):
            urls.append(url)

    for match in MD_LINK_RE.finditer(md):
        url = normalize_url(match.group(1))
        path = urllib.parse.urlparse(url).path.lower()
        if url.startswith(("http://", "https://")) and re.search(r"\.(?:png|jpe?g|gif|webp|svg|avif|pdf)$", path):
            urls.append(url)

    return urls


def extract_headings(md: str) -> list[str]:
    headings: list[str] = []
    for line in md.splitlines():
        if re.match(r"^#{1,6}\s+", line.strip()):
            heading = clean_markdown_line(line)
            if heading and heading.lower() not in NOISE_EXACT and heading not in headings:
                headings.append(heading)
    return headings


def content_lines(md: str) -> list[str]:
    lines: list[str] = []
    body = re.sub(r"^---\n.*?\n---", "", md, flags=re.S)
    for raw in body.splitlines():
        stripped = raw.strip()
        if not stripped or stripped in {"---", "|     |     |", "| --- | --- |"}:
            continue
        if stripped.startswith(("url:", "title:")):
            continue
        if "![" in stripped or "Base64-Image-Removed" in stripped:
            continue
        if stripped.startswith(("http://", "https://")):
            continue
        if "maps.googleapis.com" in stripped or "data:image/" in stripped:
            continue
        line = clean_markdown_line(stripped)
        if not line or len(line) < 3:
            continue
        lowered = line.lower()
        if lowered in NOISE_EXACT:
            continue
        if lowered.startswith(("map data ", "try disabling", "click to toggle", "terms", "report a map error", "call us ", "(c) ", "© ")):
            continue
        if "40-21 bell blvd" in lowered:
            continue
        if "refused to connect" in lowered or "is blocked" in lowered:
            continue
        if line not in lines:
            lines.append(line)
    return lines


def title_from_page(title: Optional[str], slug: str) -> str:
    if title:
        base = title.split("|")[0].strip()
        if base:
            return clean_text(base.title() if base.isupper() else base)
    return "Home" if slug == "home" else clean_text(slug.replace("-", " ").title())


def parse_price(segment: str) -> tuple[Optional[float], Optional[float], Optional[str]]:
    prices = [float(p.replace(",", "")) for p in re.findall(r"\$([0-9][0-9,]*(?:\.[0-9]{2})?)", segment)]
    if not prices:
        return None, None, None
    if len(prices) >= 2:
        return prices[-1], prices[0], None
    return prices[0], None, None


def infer_materials_and_tags(name: str, category: str, segment: str) -> tuple[list[str], list[str]]:
    text = f"{name} {category} {segment}".lower()
    materials: list[str] = []
    tags: list[str] = []
    candidates = [
        ("Lab Grown Diamond", "lab-grown-diamond"),
        ("Diamond", "diamond"),
        ("Pearl", "pearl"),
        ("Gold", "gold"),
        ("Silver", "silver"),
        ("Platinum", "platinum"),
    ]
    for label, tag in candidates:
        if tag.replace("-", " ") in text or label.lower() in text:
            if label not in materials:
                materials.append(label)
            if tag not in tags:
                tags.append(tag)
    if "halo" in text:
        tags.append("halo")
    if "hoop" in text:
        tags.append("hoop")
    if "tennis" in text:
        tags.append("tennis")
    if "available in a series" in text:
        tags.append("available-in-series")
    if "placeholder/thumbnail" in text:
        tags.append("image-unavailable-in-source")
    return materials, list(dict.fromkeys(tags))


def category_from_product_url(url: str) -> Optional[str]:
    path = urllib.parse.urlparse(url).path.strip("/")
    if not path:
        return None
    parts = path.split("/")
    if len(parts) <= 1:
        return None
    return clean_text(parts[1].replace("-", " ").title())


def extract_products(md: str, page_meta: PageMeta, category: str, subcategory: str, inquiry_note: Optional[str]) -> list[dict]:
    images = list(CATALOG_IMAGE_RE.finditer(md))
    links = list(PRODUCT_PAGE_RE.finditer(md))
    products: list[dict] = []

    for link_match in links:
        previous_images = [image_match for image_match in images if image_match.start() < link_match.start()]
        if not previous_images:
            continue

        image_match = previous_images[-1]
        next_images = [candidate for candidate in images if candidate.start() > image_match.start()]
        segment_end = next_images[0].start() if next_images else min(len(md), link_match.end() + 1200)
        segment = md[image_match.start():segment_end]

        style_match = re.search(r"STYLE\s+\\?#\s*([^\n*\]\\]+)", segment, flags=re.I)
        style_number = clean_text(style_match.group(1)) if style_match else ""
        if not style_number:
            continue

        name = clean_text(image_match.group(1))
        title_match = re.search(r'\s"([^"]+)"', md[link_match.end(): min(len(md), link_match.end() + 180)])
        if (not name or name.lower() == "images") and title_match:
            name = clean_text(title_match.group(1))
        if not name or name.lower() in {"images", "next", "set ascending direction"}:
            continue

        image_url = normalize_url(image_match.group(2))
        product_url = clean_text(link_match.group(0))
        price, compare_at_price, parsed_price_note = parse_price(segment)
        materials, tags = infer_materials_and_tags(name, category, segment)
        url_subcategory = category_from_product_url(product_url)

        product_path_stem = Path(urllib.parse.urlparse(product_url).path).stem
        product_slug = slugify(f"{style_number}-{name}-{product_path_stem}")
        availability = "not_specified"
        if re.search(r"sold\s*out|out\s*of\s*stock|unavailable", segment, flags=re.I):
            availability = "unavailable"

        products.append(
            {
                "name": name,
                "slug": product_slug,
                "category": category,
                "subcategory": subcategory or url_subcategory,
                "price": price,
                "compareAtPrice": compare_at_price,
                "availability": availability,
                "badges": tags,
                "fullDescription": None,
                "specifications": {"styleNumber": style_number},
                "materials": materials,
                "gemstoneDetails": [item for item in materials if "Diamond" in item or item == "Pearl"],
                "variants": ["Available in a Series"] if "available-in-series" in tags else [],
                "imageUrls": [image_url],
                "imagePaths": [],
                "priceNote": parsed_price_note or inquiry_note or "inquire with store for pricing",
                "sourcePageUrl": page_meta.source_url,
                "sourceMarkdownFile": page_meta.source_file,
                "productPageUrl": product_url,
            }
        )

    unique: dict[str, dict] = {}
    for product in products:
        key = product["productPageUrl"]
        if key not in unique:
            unique[key] = product
    return list(unique.values())


def page_type(slug: str, file_name: str, has_products: bool) -> str:
    if slug == "home":
        return "home"
    if file_name in DESIGNER_FILES:
        return "designer"
    if slug in EDUCATION_SLUGS:
        return "education"
    if slug in {"services"}:
        return "services"
    if slug in {"about"}:
        return "about"
    if slug in {"contact-us"}:
        return "contact"
    if has_products:
        return "collection"
    return "content"


def extract_services(md: str) -> list[dict]:
    services: list[dict] = []
    lines = md.splitlines()
    i = 0
    while i < len(lines):
        raw = lines[i].strip()
        if raw.startswith("######"):
            heading_parts = [clean_markdown_line(raw)]
            j = i + 1
            while j < len(lines):
                probe = lines[j].strip()
                if not probe:
                    j += 1
                    continue
                if probe.startswith("######"):
                    part = clean_markdown_line(probe)
                    if part and part != "\u200b":
                        heading_parts.append(part)
                    j += 1
                    continue
                break
            description_parts: list[str] = []
            while j < len(lines) and not lines[j].strip().startswith("#"):
                raw_description = lines[j].strip()
                if "![" in raw_description:
                    break
                line = clean_markdown_line(lines[j])
                lowered = line.lower()
                if (
                    lowered in NOISE_EXACT
                    or lowered.startswith(("©", "call us "))
                    or "40-21 bell blvd" in lowered
                    or "loadbalancer" in lowered
                ):
                    break
                if line and not line.startswith("http"):
                    description_parts.append(line)
                j += 1
            name = clean_text(" ".join(part for part in heading_parts if part))
            name = name.replace("WATCH REPAIR & RESTORATION", "WATCH REPAIR & RESTORATION")
            if name and name.upper() not in {"OPENING HOURS", "OUR ADDRESS", "CONTACT US"}:
                services.append(
                    {
                        "name": name.title() if name.isupper() else name,
                        "slug": slugify(name),
                        "description": " ".join(description_parts) or None,
                    }
                )
            i = j
        else:
            i += 1

    merged: dict[str, dict] = {}
    for service in services:
        if service["slug"] not in merged:
            merged[service["slug"]] = service
    return list(merged.values())


def extract_policy_lines(lines: list[str]) -> list[str]:
    policy_lines: list[str] = []
    for line in lines:
        lowered = line.lower()
        if (
            "unavailable for sizing" in lowered
            or "only 3 items per request" in lowered
            or "$25.00 fee" in lowered
            or "commodity bands in 14k gold only" in lowered
        ):
            policy_lines.append(line)
    return list(dict.fromkeys(policy_lines))


def parse_hours(all_text: str) -> tuple[dict[str, str], list[dict[str, str]]]:
    raise RuntimeError("parse_hours requires md_by_file; use parse_hours_by_file")


def parse_hours_by_file(md_by_file: dict[str, str]) -> tuple[dict[str, str], list[dict[str, str]]]:
    source_hours: list[dict[str, str]] = []
    day_pattern = re.compile(
        r"(TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY\s*&\s*MONDAY)\s*[-\u2013]\s*([0-9:AMP\s\-.]+|CLOSED)",
        flags=re.I,
    )

    for file_name, source_name in [
        ("www.bellfamilyjewelers.com_.md", "home page"),
        ("www.bellfamilyjewelers.com_contact-us.md", "contact page"),
    ]:
        segment = md_by_file.get(file_name, "")
        found = {}
        for day, value in day_pattern.findall(segment):
            found[clean_text(day).title()] = clean_text(value).replace(" .", ".")
        if found:
            source_hours.append({"source": source_name, "hours": found})

    if source_hours:
        counts = Counter(json.dumps(item["hours"], sort_keys=True) for item in source_hours)
        selected = json.loads(counts.most_common(1)[0][0])
        contact = next((item["hours"] for item in source_hours if item["source"] == "contact page"), None)
        if contact:
            selected = contact
        return selected, source_hours

    return {}, []


def parse_business(md_by_file: dict[str, str], pages: list[dict], services: list[dict], policies: list[str]) -> dict:
    all_text = "\n".join(md_by_file.values())
    emails = sorted({email.lower() for email in re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", all_text)})

    phones_raw = re.findall(r"(?:\+?1[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}", all_text)

    def normalize_phone(phone: str) -> str:
        digits = re.sub(r"\D", "", phone)
        if len(digits) == 11 and digits.startswith("1"):
            digits = digits[1:]
        if len(digits) == 10:
            return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
        return clean_text(phone)

    phones = sorted({normalize_phone(phone) for phone in phones_raw if normalize_phone(phone).startswith("(718)")})

    address_match = re.search(r"40-21\s+Bell\s+Blvd[.,]?\s*Bayside,?\s*NY\s*11361", all_text, flags=re.I)
    address = clean_text(address_match.group(0)).replace("Blvd.", "Blvd.") if address_match else None
    hours, hours_sources = parse_hours_by_file(md_by_file)

    promotion_candidates = []
    for page in pages:
        for line in page.get("headings", []) + page.get("contentPreview", []):
            lowered = line.lower()
            if line in {"ALL ONLINE JEWELRY", "IN STORE ONLY", "30 - 50% OFF"} or "inquire with store for pricing" in lowered:
                promotion_candidates.append(line)
    promotions = list(dict.fromkeys(promotion_candidates))

    about_lines = pages_by_slug(pages).get("about", {}).get("contentPreview", [])
    home_lines = pages_by_slug(pages).get("home", {}).get("contentPreview", [])

    designers = []
    for file_name, designer_name in DESIGNER_FILES.items():
        source_page = next((page for page in pages if page["sourceMarkdownFile"].endswith(file_name)), None)
        designers.append(
            {
                "name": designer_name,
                "slug": slugify(designer_name),
                "sourcePageUrl": source_page.get("sourceUrl") if source_page else None,
                "sourceMarkdownFile": source_page.get("sourceMarkdownFile") if source_page else None,
                "description": None,
                "imagePaths": [],
            }
        )

    return {
        "name": "Bell Family Jewelers",
        "address": address,
        "phones": phones,
        "emails": emails,
        "hours": hours,
        "hoursSources": hours_sources,
        "social": {
            "facebook": "http://www.facebook.com/bellfamilyjewelers",
            "instagram": "http://www.instagram.com/bellfamilyjewelers",
        },
        "promotions": promotions,
        "homepageCopy": [
            "Engagement rings are the ultimate expression of love, at Bell Family Jewelers of Bayside NY we make it easy for you to design the engagement ring of your dreams.",
            "We'll help you transform an old or unwanted piece into a treasure that reflects your true style.",
        ],
        "about": about_lines,
        "services": services,
        "policies": policies,
        "designers": designers,
    }


def pages_by_slug(pages: list[dict]) -> dict[str, dict]:
    return {page["slug"]: page for page in pages}


def ext_from_url_or_type(url: str, content_type: Optional[str]) -> str:
    if url.startswith("data:image/"):
        mime = url.split(";", 1)[0].replace("data:", "")
        return mimetypes.guess_extension(mime) or ".png"
    parsed = urllib.parse.urlparse(url)
    ext = Path(parsed.path).suffix.lower()
    if ext and len(ext) <= 8:
        return ".jpg" if ext == ".jpeg" else ext
    if content_type:
        guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if guessed:
            return ".jpg" if guessed == ".jpeg" else guessed
    return ".bin"


def fallback_svg(path: Path, label: str) -> None:
    safe_label = html.escape(label[:110])
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
  <rect width="1200" height="900" fill="#111111"/>
  <rect x="48" y="48" width="1104" height="804" fill="none" stroke="#c9a45f" stroke-width="3"/>
  <text x="96" y="438" fill="#f5f0e8" font-family="Georgia, serif" font-size="42">Bell Family Jewelers</text>
  <text x="96" y="500" fill="#a8a29e" font-family="Arial, sans-serif" font-size="24">Local media unavailable</text>
  <text x="96" y="548" fill="#78716c" font-family="Arial, sans-serif" font-size="18">{safe_label}</text>
</svg>"""
    path.write_text(svg, encoding="utf-8")


def write_optimized_media(data: bytes, abs_path_base: Path, ext: str) -> tuple[Path, str]:
    lower_ext = ext.lower()
    if data.lstrip()[:120].lower().startswith(b"<svg") or b"<svg" in data.lstrip()[:300].lower():
        abs_path = abs_path_base.with_suffix(".svg")
        abs_path.write_bytes(data)
        return abs_path, ".svg"

    if lower_ext in {".svg", ".pdf", ".gif"} or not PIL_AVAILABLE:
        abs_path = abs_path_base.with_suffix(lower_ext if lower_ext != ".bin" else ".dat")
        abs_path.write_bytes(data)
        return abs_path, abs_path.suffix

    try:
        with Image.open(io.BytesIO(data)) as image:
            if getattr(image, "is_animated", False):
                abs_path = abs_path_base.with_suffix(lower_ext if lower_ext != ".bin" else ".gif")
                abs_path.write_bytes(data)
                return abs_path, abs_path.suffix

            image.load()
            if max(image.size) > 1800:
                image.thumbnail((1800, 1800), Image.Resampling.LANCZOS)
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "A" in image.getbands() else "RGB")
            abs_path = abs_path_base.with_suffix(".webp")
            image.save(abs_path, format="WEBP", quality=84, method=6)
            return abs_path, ".webp"
    except Exception:
        abs_path = abs_path_base.with_suffix(lower_ext if lower_ext != ".bin" else ".dat")
        abs_path.write_bytes(data)
        return abs_path, abs_path.suffix


def download_media(media_records: list[dict]) -> tuple[list[dict], dict[str, str]]:
    digest_to_path: dict[str, str] = {}
    url_to_local: dict[str, str] = {}
    url_errors: dict[str, str] = {}
    output_records: list[dict] = []

    unique_urls = list(dict.fromkeys(record["originalUrl"] for record in media_records))
    fetched: dict[str, tuple[Optional[bytes], Optional[str], Optional[str]]] = {}

    for url in unique_urls:
        try:
            if url.startswith("data:image/"):
                header, raw_data = url.split(",", 1)
                if ";base64" in header:
                    data = base64.b64decode(raw_data)
                else:
                    data = urllib.parse.unquote_to_bytes(raw_data)
                content_type = header.split(";", 1)[0].replace("data:", "")
            else:
                request = urllib.request.Request(
                    url,
                    headers={
                        "User-Agent": "Mozilla/5.0 (compatible; BellFamilyJewelersRedesign/1.0)",
                        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
                    },
                )
                with urllib.request.urlopen(request, timeout=25) as response:
                    data = response.read()
                    content_type = response.headers.get("Content-Type")
            fetched[url] = (data, content_type, None)
        except Exception as error:
            fetched[url] = (None, None, str(error))

    for index, record in enumerate(media_records, start=1):
        original = record["originalUrl"]
        data, content_type, error = fetched[original]
        out = dict(record)
        out["id"] = index

        if data is None:
            digest = hashlib.sha256(original.encode("utf-8")).hexdigest()
            filename = f"missing-media-{digest[:12]}.svg"
            abs_path = MEDIA_DIR / filename
            if not abs_path.exists():
                fallback_svg(abs_path, original)
            local_path = f"/media/{filename}"
            url_to_local[original] = local_path
            url_errors[original] = error or "download failed"
            out["localFilePath"] = local_path
            out["error"] = f"fallback: {url_errors[original]}"
            output_records.append(out)
            continue

        digest = hashlib.sha256(data).hexdigest()
        if digest in digest_to_path:
            local_path = digest_to_path[digest]
        else:
            ext = ext_from_url_or_type(original, content_type)
            name_seed = Path(urllib.parse.urlparse(original).path).stem or record.get("associatedProduct") or "media"
            name_seed = slugify(urllib.parse.unquote(name_seed))[:56] or "media"
            abs_path_base = MEDIA_DIR / f"{name_seed}-{digest[:12]}"
            abs_path, _ = write_optimized_media(data, abs_path_base, ext)
            local_path = f"/media/{abs_path.name}"
            digest_to_path[digest] = local_path

        url_to_local[original] = local_path
        out["localFilePath"] = local_path
        output_records.append(out)

    return output_records, url_to_local


def build_collections(products: list[dict], pages: list[dict]) -> list[dict]:
    by_category: dict[str, list[dict]] = defaultdict(list)
    for product in products:
        by_category[product["category"]].append(product)

    def image_rank(path: str) -> int:
        lowered = path.lower()
        source_placeholder_markers = (
            "thumbnail-",
            "transparent-",
            "svg-",
            "default-pin",
            "icon-",
            "pager-arrow",
            "i-desc-arrow",
            "rotatingimage",
        )
        return 1 if any(marker in lowered for marker in source_placeholder_markers) else 0

    descriptions = {
        "Engagement Rings": "Round halo engagement rings extracted from the source catalog.",
        "Wedding Bands": "Five stone prong set wedding bands extracted from the source catalog.",
        "Color Rings": "Oval color rings extracted from the source catalog.",
        "Earrings": "Hoop earrings extracted from the source catalog.",
        "Pendants": "Round halo pendants extracted from the source catalog.",
        "Bracelets": "Bracelets extracted from the source catalog.",
    }

    collections: list[dict] = []
    for category, items in by_category.items():
        source_pages = sorted({item["sourcePageUrl"] for item in items if item.get("sourcePageUrl")})
        source_files = sorted({item["sourceMarkdownFile"] for item in items})
        subcategories = sorted({item["subcategory"] for item in items if item.get("subcategory")})
        image_paths = []
        for product in items:
            image_paths.extend(product.get("imagePaths", []))
        image_paths = sorted(list(dict.fromkeys(image_paths)), key=image_rank)
        collections.append(
            {
                "name": category,
                "slug": slugify(category),
                "type": "product-category",
                "description": descriptions.get(category, f"{category} extracted from Bell Family Jewelers source catalog."),
                "subcategories": subcategories,
                "sourcePages": source_pages,
                "sourceMarkdownFiles": source_files,
                "imagePaths": image_paths[:16],
                "productCount": len(items),
            }
        )

    order = ["Engagement Rings", "Wedding Bands", "Color Rings", "Earrings", "Pendants", "Bracelets"]
    collections.sort(key=lambda item: order.index(item["name"]) if item["name"] in order else 99)
    return collections


def main() -> None:
    md_files = sorted(RAW_DIR.rglob("*.md"))
    md_by_file: dict[str, str] = {}
    pages: list[dict] = []
    products: list[dict] = []
    media_records: list[dict] = []
    policies: list[str] = []
    services: list[dict] = []

    for md_file in md_files:
        rel = str(md_file.relative_to(ROOT))
        md = md_file.read_text(encoding="utf-8", errors="ignore")
        md_by_file[md_file.name] = md

        source_url, title = parse_frontmatter(md)
        slug = get_slug_from_url_or_file(source_url, md_file)
        meta = PageMeta(source_file=rel, source_url=source_url, title=title, slug=slug)
        headings = extract_headings(md)
        lines = content_lines(md)
        media_urls = extract_media_urls(md)

        category, subcategory = PRODUCT_PAGE_FILES.get(md_file.name, (None, None))
        inquiry_note = next((line for line in lines if "inquire with store for pricing" in line.lower()), None)
        page_products: list[dict] = []
        if category:
            page_products = extract_products(md, meta, category, subcategory or "", inquiry_note)
            products.extend(page_products)

        if md_file.name == "www.bellfamilyjewelers.com_services.md":
            services = extract_services(md)

        page_policies = extract_policy_lines(lines)
        policies.extend(page_policies)

        page_obj = {
            "slug": slug,
            "title": title_from_page(title, slug),
            "sourceUrl": source_url,
            "sourceMarkdownFile": rel,
            "type": page_type(slug, md_file.name, bool(page_products)),
            "headings": headings[:40],
            "contentPreview": lines[:80],
            "promotions": [line for line in lines if line in {"ALL ONLINE JEWELRY", "IN STORE ONLY", "30 - 50% OFF"} or "inquire with store for pricing" in line.lower()],
            "mediaUrls": media_urls,
            "mediaPaths": [],
            "productCount": len(page_products),
        }
        pages.append(page_obj)

        product_url_map: dict[str, str] = {}
        for product in page_products:
            for image_url in product.get("imageUrls", []):
                product_url_map[image_url] = product["name"]

        for url in media_urls:
            media_records.append(
                {
                    "originalUrl": url,
                    "associatedProduct": product_url_map.get(url),
                    "associatedPage": source_url,
                    "sourceMarkdownFile": rel,
                }
            )

    media_map, url_to_local = download_media(media_records)

    for product in products:
        product["imagePaths"] = [url_to_local[url] for url in product.get("imageUrls", []) if url in url_to_local]
        product.pop("imageUrls", None)

    for page in pages:
        page["mediaPaths"] = [url_to_local[url] for url in page["mediaUrls"] if url in url_to_local]

    business = parse_business(md_by_file, pages, services, list(dict.fromkeys(policies)))
    collections = build_collections(products, pages)

    DATA_DIR.joinpath("products.json").write_text(json.dumps(products, indent=2), encoding="utf-8")
    DATA_DIR.joinpath("collections.json").write_text(json.dumps(collections, indent=2), encoding="utf-8")
    DATA_DIR.joinpath("pages.json").write_text(json.dumps(pages, indent=2), encoding="utf-8")
    DATA_DIR.joinpath("business.json").write_text(json.dumps(business, indent=2), encoding="utf-8")
    DATA_DIR.joinpath("media-map.json").write_text(json.dumps(media_map, indent=2), encoding="utf-8")

    errors = sum(1 for record in media_map if record.get("error"))
    print(f"Processed markdown files: {len(md_files)}")
    print(f"Products extracted: {len(products)}")
    print(f"Collections generated: {len(collections)}")
    print(f"Media records: {len(media_map)}")
    print(f"Media fallbacks: {errors}")


if __name__ == "__main__":
    main()
