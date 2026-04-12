/* app.js — minimal JS: scroll reveal, skill bars, nav highlight, mobile menu */
(function () {
  "use strict";

  /* ── Reveal on scroll ── */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("v");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.1 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ── Skill bars fire when card is visible ── */
  const sio = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("v");
          sio.unobserve(e.target);
        }
      }),
    { threshold: 0.2 },
  );
  document.querySelectorAll(".skill-card").forEach((el) => sio.observe(el));

  /* ── Active nav link on scroll ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const sectionObserver = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          const active = document.querySelector(
            `.nav-links a[href="#${e.target.id}"]`,
          );
          if (active) active.classList.add("active");
        }
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ── Mobile nav toggle ── */
  const toggle = document.getElementById("navToggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ── Sticky nav shadow on scroll ── */
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.style.boxShadow =
        window.scrollY > 10 ? "0 1px 30px rgba(0,0,0,.4)" : "";
    },
    { passive: true },
  );
})();
