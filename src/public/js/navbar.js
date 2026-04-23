/**
 * navbar.js — Vyshnav P C Portfolio
 * Handles: mobile menu toggle, scroll effects, active link spy, outside-click close
 */

(function () {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  if (!navbar || !hamburger || !mobileMenu) return; // guard: exit if navbar not in DOM

  const mobileLinks = mobileMenu.querySelectorAll(".navbar__mobile-link");
  const desktopLinks = navbar.querySelectorAll(".navbar__link");

  // ── Helpers ───────────────────────────────────────────────────────────────
  function openMenu() {
    mobileMenu.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // prevent background scroll
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function isMenuOpen() {
    return mobileMenu.classList.contains("is-open");
  }

  // ── Mobile menu toggle ────────────────────────────────────────────────────
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Close when any mobile nav link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (isMenuOpen() && !navbar.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen()) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ── Scroll: navbar shadow + active link spy ───────────────────────────────
  var allSections = Array.from(
    document.querySelectorAll("section[id], div[id]"),
  );

  function updateNavbar() {
    // Scrolled shadow
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 20);

    // Active section highlight
    var scrollPos = window.scrollY + navbar.offsetHeight + 48;

    allSections.forEach(function (sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id = sec.id;

      // Update desktop links
      desktopLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.classList.toggle(
            "is-active",
            scrollPos >= top && scrollPos < bottom,
          );
        }
      });

      // Update mobile links
      mobileLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.classList.toggle(
            "is-active",
            scrollPos >= top && scrollPos < bottom,
          );
        }
      });
    });
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  window.addEventListener("resize", updateNavbar, { passive: true });
  updateNavbar(); // run once on load

  // ── Smooth scroll for hash links (fallback for older browsers) ─────────────
  navbar.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      var offsetTop = target.offsetTop - navbar.offsetHeight - 8;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });

      // Update URL hash without jump
      history.pushState(null, "", "#" + targetId);
    });
  });
})();
