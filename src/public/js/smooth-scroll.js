/**
 * smooth-scroll.js — Vyshnav PC Portfolio
 * Fluid momentum-based mouse wheel scrolling.
 */
(function () {
  const EASE = 0.1;     // higher = faster catch-up

  let currentY = window.scrollY;
  let targetY  = window.scrollY;
  let rafId    = null;

  function tick() {
    const diff = targetY - currentY;
    if (Math.abs(diff) < 0.3) {
      currentY = targetY;
      window.scrollTo(0, Math.round(currentY));
      rafId = null;
      return;
    }
    currentY += diff * EASE;
    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(tick);
  }

  window.addEventListener("wheel", function (e) {
    e.preventDefault();
    const maxY = document.body.scrollHeight - window.innerHeight;
    targetY = Math.max(0, Math.min(maxY, targetY + e.deltaY * 1.8));
    if (!rafId) rafId = requestAnimationFrame(tick);
  }, { passive: false });

  window.addEventListener("scroll", function () {
    if (!rafId) {
      currentY = window.scrollY;
      targetY  = window.scrollY;
    }
  }, { passive: true });
})();
