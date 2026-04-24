/**
 * navbar.js — Vyshnav P C Portfolio
 * Handles: mobile menu toggle, overlay, scroll effects,
 *          active link spy, outside-click close, smooth scroll
 */

(function () {
  "use strict";

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("navOverlay");

  if (!navbar || !hamburger || !mobileMenu) return;

  const mobileLinks = mobileMenu.querySelectorAll(".navbar__mobile-link");
  const mobileCta = mobileMenu.querySelector(".navbar__cta--mobile");
  const desktopLinks = navbar.querySelectorAll(".navbar__link");

  // ── Helpers ───────────────────────────────────────────────────────────────
  function openMenu() {
    mobileMenu.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    if (overlay) overlay.classList.add("is-open");
    document.documentElement.classList.add("nav-open");
  }

  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    if (overlay) overlay.classList.remove("is-open");
    document.documentElement.classList.remove("nav-open");
  }

  function isMenuOpen() {
    return mobileMenu.classList.contains("is-open");
  }

  // ── Mobile menu toggle ────────────────────────────────────────────────────
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  // Close on mobile link click
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // Close on mobile CTA click
  if (mobileCta) {
    mobileCta.addEventListener("click", closeMenu);
  }

  // Close on overlay click
  if (overlay) {
    overlay.addEventListener("click", closeMenu);
  }

  // ── Outside click ─────────────────────────────────────────────────────────
  // mobileMenu is a SIBLING of navbar — must check both
  document.addEventListener("click", function (e) {
    if (!isMenuOpen()) return;
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen()) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ── Scroll: shadow + active link spy ─────────────────────────────────────
  var allSections = Array.from(
    document.querySelectorAll("section[id], div[id]"),
  );

  function updateNavbar() {
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 20);

    var scrollPos = window.scrollY + navbar.offsetHeight + 48;

    allSections.forEach(function (sec) {
      var top = sec.offsetTop;
      var bottom = top + sec.offsetHeight;
      var id = sec.id;

      desktopLinks.forEach(function (link) {
        if (link.getAttribute("href") === "#" + id) {
          link.classList.toggle(
            "is-active",
            scrollPos >= top && scrollPos < bottom,
          );
        }
      });

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
  window.addEventListener(
    "resize",
    function () {
      // Close menu if viewport expands past mobile breakpoint
      if (window.innerWidth > 768 && isMenuOpen()) {
        closeMenu();
      }
      updateNavbar();
    },
    { passive: true },
  );

  updateNavbar();

  // ── Smooth scroll ─────────────────────────────────────────────────────────
  // Query both navbar AND mobileMenu (sibling) for hash links
  var allHashLinks = Array.from(
    document.querySelectorAll('#navbar a[href^="#"], #mobileMenu a[href^="#"]'),
  );

  allHashLinks.forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = anchor.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      var offsetTop = target.offsetTop - navbar.offsetHeight - 8;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });

      history.pushState(null, "", "#" + targetId);
    });
  });
})();
