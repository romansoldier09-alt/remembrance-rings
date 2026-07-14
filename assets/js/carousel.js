// carousel.js — vanilla product gallery carousel.
// Works with any number of slides; no dependencies.
// A11y: arrow buttons labelled, thumbnails are a tablist, slide counter is a
// polite live region, left/right arrow keys navigate while focus is inside.
// Perf: only the first image loads eagerly; the rest load on demand
// (thumbnails are lazy). Fixed 3:2 stage prevents layout shift.

(function () {
  document.querySelectorAll('[data-carousel]').forEach(initCarousel);

  function initCarousel(root) {
    const main = root.querySelector('[data-carousel-main]');
    const count = root.querySelector('[data-carousel-count]');
    const prev = root.querySelector('[data-carousel-prev]');
    const next = root.querySelector('[data-carousel-next]');
    const thumbs = [...root.querySelectorAll('[data-carousel-thumb]')];
    if (!main || thumbs.length === 0) return;

    const slides = thumbs.map((t) => ({ src: t.dataset.image, alt: t.dataset.alt || '' }));
    let index = 0;

    // Single-photo galleries: hide navigation entirely.
    if (slides.length < 2) {
      prev?.remove(); next?.remove(); count?.remove();
      return;
    }

    function goTo(i, { focusThumb = false } = {}) {
      index = (i + slides.length) % slides.length; // wraps; any photo count
      main.src = slides[index].src;                // browser lazy-fetches on demand
      main.alt = slides[index].alt;
      if (count) count.textContent = `${index + 1} of ${slides.length}`;
      thumbs.forEach((t, ti) => {
        const active = ti === index;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
        t.tabIndex = active ? 0 : -1;
        if (active && focusThumb) t.focus();
      });
    }

    prev?.addEventListener('click', () => goTo(index - 1));
    next?.addEventListener('click', () => goTo(index + 1));
    thumbs.forEach((t, ti) => t.addEventListener('click', () => goTo(ti)));

    // Keyboard: arrows work anywhere inside the carousel (stage or thumbs).
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1, { focusThumb: document.activeElement?.hasAttribute('data-carousel-thumb') }); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1, { focusThumb: document.activeElement?.hasAttribute('data-carousel-thumb') }); }
      if (e.key === 'Home') { e.preventDefault(); goTo(0); }
      if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
    });

    // Swipe: Pointer Events cover touch, pen, and mouse-drag.
    const stage = root.querySelector('.carousel-stage') || main;
    let startX = null, startY = null, pointerId = null;
    stage.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button')) return;
      startX = e.clientX; startY = e.clientY; pointerId = e.pointerId;
    });
    stage.addEventListener('pointerup', (e) => {
      if (pointerId !== e.pointerId || startX === null) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      startX = startY = pointerId = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        goTo(index + (dx < 0 ? 1 : -1));
      }
    });
    stage.addEventListener('pointercancel', () => { startX = startY = pointerId = null; });
    // Stop vertical-scroll hijack but allow horizontal swipes.
    stage.style.touchAction = 'pan-y';

    goTo(0);
  }
})();
