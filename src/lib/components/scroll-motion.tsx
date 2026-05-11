const scrollMotionScript = `
(() => {
  const clamp = (value) => Math.min(1, Math.max(0, value));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let elements = [];

  const collect = () => {
    elements = Array.from(document.querySelectorAll('.scroll-reveal, .scroll-card, .scroll-image, .scroll-sticky'));
  };

  const update = () => {
    frame = 0;

    if (reducedMotion.matches) {
      document.documentElement.dataset.scrollMotion = 'reduced';
      return;
    }

    document.documentElement.dataset.scrollMotion = 'js';

    const viewportHeight = window.innerHeight || 1;
    const documentHeight = Math.max(document.documentElement.scrollHeight - viewportHeight, 1);
    const pageProgress = clamp(window.scrollY / documentHeight);
    document.documentElement.style.setProperty('--page-scroll-progress', pageProgress.toFixed(4));

    for (const element of elements) {
      const rect = element.getBoundingClientRect();
      const totalTravel = viewportHeight + rect.height;
      const rawProgress = clamp((viewportHeight - rect.top) / totalTravel);
      const isImage = element.classList.contains('scroll-image');
      const isCard = element.classList.contains('scroll-card');
      const isSticky = element.classList.contains('scroll-sticky');
      const revealDistance = viewportHeight * (isCard ? 0.34 : 0.3);
      const revealProgress = isImage ? rawProgress : clamp((viewportHeight * 0.98 - rect.top) / revealDistance);
      const opacity = 0.001 + revealProgress * 0.999;
      const y = (1 - revealProgress) * (isCard ? 28 : 34);
      const stickyY = (1 - revealProgress) * 18;
      const blur = (1 - revealProgress) * (isCard ? 7 : 8);
      const rotate = (1 - revealProgress) * (isCard ? 3 : 0);
      const imageY = rawProgress * 36 - 18;

      element.style.setProperty('--scroll-progress', revealProgress.toFixed(4));
      element.style.setProperty('--scroll-raw-progress', rawProgress.toFixed(4));
      element.style.setProperty('--scroll-opacity', opacity.toFixed(4));
      element.style.setProperty('--scroll-y', (isSticky ? stickyY : y).toFixed(2) + 'px');
      element.style.setProperty('--scroll-blur', blur.toFixed(2) + 'px');
      element.style.setProperty('--scroll-rotate', rotate.toFixed(2) + 'deg');
      element.style.setProperty('--scroll-image-y', imageY.toFixed(2) + 'px');
    }
  };

  const requestUpdate = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(update);
  };

  const start = () => {
    collect();
    requestUpdate();

    const observer = new MutationObserver(() => {
      collect();
      requestUpdate();
    });

    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('orientationchange', requestUpdate);
    reducedMotion.addEventListener('change', requestUpdate);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
`

export default function ScrollMotion() {
  return <script dangerouslySetInnerHTML={{ __html: scrollMotionScript }} />
}
