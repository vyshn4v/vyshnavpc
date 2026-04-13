/* ════════════════════════════════════════
   main.js — runs on every page
════════════════════════════════════════ */

// ─── Scroll progress bar ───
(function () {
  const bar = document.getElementById("progress");
  if (!bar) return;

  window.addEventListener(
    "scroll",
    () => {
      const h = document.documentElement;
      bar.style.width =
        (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
    },
    { passive: true },
  );
})();

// ─── Mobile nav toggle ───
(function () {
  const btn = document.getElementById("menuBtn");
  const links = document.querySelector(".nav-links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    const open = links.classList.toggle("nav-links--open");
    btn.setAttribute("aria-expanded", open);
  });
})();
