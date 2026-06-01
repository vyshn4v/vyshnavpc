/**
 * smooth-scroll.js — Vyshnav PC Portfolio
 * Adds momentum-based smooth scrolling to mouse wheel events.
 * Works on all browsers. Lightweight, no dependencies.
 */
(function () {
  const DURATION = 600;   // ms per scroll step
  const EASE = 0.08;       // lower = smoother/slower momentum

  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let rafId = null;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animate() {
    const diff = targetY - currentY;
    if (Math.abs(diff) < 0.5) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      rafId = null;
      return;
    }
    currentY += diff * EASE;
    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener("wheel", function (e) {
    e.preventDefault();
    targetY = Math.max(0, Math.min(
      document.body.scrollHeight - window.innerHeight,
      targetY + e.deltaY * 1.2
    ));
    if (!rafId) rafId = requestAnimationFrame(animate);
  }, { passive: false });

  // Keep currentY in sync when scrolled by other means (keyboard, navbar links etc.)
  window.addEventListener("scroll", function () {
    if (!rafId) {
      currentY = window.scrollY;
      targetY = window.scrollY;
    }
  }, { passive: true });
})();
