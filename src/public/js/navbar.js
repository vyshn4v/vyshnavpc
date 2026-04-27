/**
 * navbar.js — Vyshnav P C Portfolio
 * Priority+ overflow navigation:
 *   - Links hide from END one by one as screen shrinks
 *   - Hamburger appears only when at least one link is hidden
 *   - Hidden links + CTA appear in the overflow drawer
 *   - Below MOBILE_BP (480px): everything goes into drawer
 */

(function () {
  "use strict";

  const MOBILE_BP = 480; // px — below this ALL items collapse into drawer

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const overflowList = document.getElementById("overflowLinks");
  const overlay = document.getElementById("navOverlay");
  const navLinks = document.getElementById("navLinks");
  const navCta = document.getElementById("navCta");

  if (!navbar || !hamburger || !mobileMenu || !navLinks || !overflowList)
    return;

  const linkItems = Array.from(navLinks.querySelectorAll("li"));

  // ── Helper: extract section id from href="#id" or href="/#id" ────────────
  function extractId(href) {
    if (!href) return null;
    var m = href.match(/\/?#(.+)$/);
    return m ? m[1] : null;
  }

  // ── Menu open / close ─────────────────────────────────────────────────────
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

  // ── Rebuild overflow drawer ───────────────────────────────────────────────
  function rebuildDrawer(hiddenItems, ctaInDrawer) {
    overflowList.innerHTML = "";

    hiddenItems.forEach(function (li) {
      var orig = li.querySelector("a");
      if (!orig) return;

      var newLi = document.createElement("li");
      var newLink = document.createElement("a");
      newLink.href = orig.getAttribute("href");
      newLink.className = "navbar__mobile-link";
      newLink.textContent = orig.dataset.label || orig.textContent.trim();
      if (orig.classList.contains("is-active"))
        newLink.classList.add("is-active");

      newLi.appendChild(newLink);
      overflowList.appendChild(newLi);
    });

    // Show/hide the ghost CTA inside the drawer
    var drawerCta = mobileMenu.querySelector(".navbar__cta--mobile");
    if (drawerCta) {
      drawerCta.style.display = ctaInDrawer ? "" : "none";
    }
  }

  // ── Priority+ measure ─────────────────────────────────────────────────────
  function measureNavbar() {
    var vw = window.innerWidth;

    // ── Full collapse at small screen ────────────────────────────────────
    if (vw <= MOBILE_BP) {
      // Hide all links from bar
      linkItems.forEach(function (li) {
        li.classList.add("is-hidden");
      });
      // Hide desktop CTA
      if (navCta) navCta.style.display = "none";
      // Show hamburger always
      hamburger.removeAttribute("hidden");
      // All links + CTA in drawer
      rebuildDrawer(linkItems, true);
      return;
    }

    // ── Priority+ for larger screens ─────────────────────────────────────
    // Show CTA in bar
    if (navCta) navCta.style.display = "";

    var container = navbar.querySelector(".navbar__container");
    var logo = navbar.querySelector(".navbar__logo");
    var actions = navbar.querySelector(".navbar__actions");

    // Temporarily show all links for measurement
    linkItems.forEach(function (li) {
      li.classList.remove("is-hidden");
      li.style.position = "";
    });

    var containerW = container.offsetWidth;
    var logoStyles = window.getComputedStyle(logo);
    var logoMarginRight = parseFloat(logoStyles.marginRight) || 0;
    var logoW = logo.offsetWidth + logoMarginRight;

    // Reserve space for the CTA + hamburger combo even when the button is hidden.
    var ctaW = navCta ? navCta.offsetWidth : 0;
    var burgerW = 34; // actual hamburger button width
    var actionsGap = navCta ? 8 : 0; // gap between CTA and hamburger when both are present
    var actionsW = ctaW + actionsGap + burgerW;
    var available = containerW - logoW - actionsW;

    var totalW = 0;
    var firstHiddenIdx = -1;

    for (var i = 0; i < linkItems.length; i++) {
      var linkWidth = linkItems[i].getBoundingClientRect().width;
      totalW += linkWidth + 2;
      if (totalW > available && firstHiddenIdx === -1) {
        firstHiddenIdx = i;
        break;
      }
    }

    // Apply hidden state
    var hiddenItems = [];
    linkItems.forEach(function (li, idx) {
      if (firstHiddenIdx !== -1 && idx >= firstHiddenIdx) {
        li.classList.add("is-hidden");
        hiddenItems.push(li);
      }
    });

    if (hiddenItems.length > 0) {
      hamburger.removeAttribute("hidden");
      // CTA stays in bar; ghost CTA hidden in drawer (not needed alongside visible bar CTA)
      rebuildDrawer(hiddenItems, false);
    } else {
      hamburger.setAttribute("hidden", "");
      closeMenu();
      rebuildDrawer([], false);
    }
  }

  // ── Event wiring ──────────────────────────────────────────────────────────
  hamburger.addEventListener("click", function (e) {
    e.stopPropagation();
    isMenuOpen() ? closeMenu() : openMenu();
  });

  var mobileCta = mobileMenu.querySelector(".navbar__cta--mobile");
  if (mobileCta) mobileCta.addEventListener("click", closeMenu);
  if (overlay) overlay.addEventListener("click", closeMenu);

  document.addEventListener("click", function (e) {
    if (!isMenuOpen()) return;
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target))
      closeMenu();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isMenuOpen()) {
      closeMenu();
      hamburger.focus();
    }
  });

  // ── Scroll spy ────────────────────────────────────────────────────────────
  var allSections = Array.from(
    document.querySelectorAll("section[id], div[id]"),
  );

  function updateNavbar() {
    navbar.classList.toggle("navbar--scrolled", window.scrollY > 20);
    var scrollPos = window.scrollY + navbar.offsetHeight + 48;

    allSections.forEach(function (sec) {
      var active =
        scrollPos >= sec.offsetTop &&
        scrollPos < sec.offsetTop + sec.offsetHeight;
      var id = sec.id;

      navLinks.querySelectorAll(".navbar__link").forEach(function (link) {
        if (extractId(link.getAttribute("href")) === id)
          link.classList.toggle("is-active", active);
      });

      overflowList
        .querySelectorAll(".navbar__mobile-link")
        .forEach(function (link) {
          if (extractId(link.getAttribute("href")) === id)
            link.classList.toggle("is-active", active);
        });
    });
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });

  // ── Smooth scroll — delegated ─────────────────────────────────────────────
  function handleHashClick(e) {
    var anchor = e.target.closest("a[href]");
    if (!anchor) return;
    var targetId = extractId(anchor.getAttribute("href"));
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    window.scrollTo({
      top: target.offsetTop - navbar.offsetHeight - 8,
      behavior: "smooth",
    });
    history.pushState(null, "", "#" + targetId);
  }

  navLinks.addEventListener("click", handleHashClick);
  overflowList.addEventListener("click", handleHashClick);

  // ── Resize ────────────────────────────────────────────────────────────────
  var resizeTimer;
  window.addEventListener(
    "resize",
    function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        measureNavbar();
        updateNavbar();
      }, 60);
    },
    { passive: true },
  );

  // ── Init ──────────────────────────────────────────────────────────────────
  if (window.ResizeObserver) {
    new ResizeObserver(function () {
      measureNavbar();
      updateNavbar();
    }).observe(navbar);
  } else {
    measureNavbar();
    updateNavbar();
  }
})();
