/* app.js — scroll reveal, nav highlight, mobile menu, contact modal */
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
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ── Active nav on scroll ── */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navLinks.forEach((a) => a.classList.remove("active"));
          const a = document.querySelector(
            `.nav-links a[href="#${e.target.id}"]`,
          );
          if (a) a.classList.add("active");
        }
      }),
    { rootMargin: "-40% 0px -55% 0px" },
  ).observe &&
    sections.forEach((s) =>
      new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            navLinks.forEach((a) => a.classList.remove("active"));
            const a = document.querySelector(
              `.nav-links a[href="#${e.target.id}"]`,
            );
            if (a) a.classList.add("active");
          }),
        { rootMargin: "-40% 0px -55% 0px" },
      ).observe(s),
    );

  /* ── Mobile nav toggle ── */
  // const toggle = document.getElementById("navToggle");
  // const links = document.querySelector(".nav-links");
  // if (toggle && links) {
  //   toggle.addEventListener("click", () => links.classList.toggle("open"));
  //   links.addEventListener("click", (e) => {
  //     if (e.target.tagName === "A") links.classList.remove("open");
  //   });
  // }

  /* ── Sticky nav shadow ── */
  const nav = document.getElementById("nav");
  window.addEventListener(
    "scroll",
    () => {
      nav.style.boxShadow =
        window.scrollY > 10 ? "0 1px 30px rgba(0,0,0,.4)" : "";
    },
    { passive: true },
  );

  /* ── Contact modal ── */
  const backdrop = document.getElementById("modalBackdrop");
  const openBtn = document.getElementById("openContact");
  const closeBtn = document.getElementById("closeContact");
  const cancelBtn = document.getElementById("cancelContact");
  const sendBtn = document.getElementById("sendContact");

  function openModal() {
    if (backdrop) backdrop.classList.add("open");
  }
  function closeModal() {
    if (backdrop) backdrop.classList.remove("open");
    // Ensure button resets its state anytime modal is closed
    if (sendBtn) {
      setTimeout(() => {
        sendBtn.innerHTML = "✉ Send Message";
        sendBtn.disabled = false;
      }, 300); // Wait for CSS transition
    }
  }

  if (openBtn) openBtn.addEventListener("click", openModal);
  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (cancelBtn) cancelBtn.addEventListener("click", closeModal);
  if (backdrop)
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });

  if (sendBtn) {
    sendBtn.addEventListener("click", async () => {
      const firstName = document.getElementById("fname")?.value.trim();
      const lastName  = document.getElementById("lname")?.value.trim() || "";
      const email     = document.getElementById("femail")?.value.trim();
      const subject   = document.getElementById("fsubject")?.value.trim() || "";
      const message   = document.getElementById("fmessage")?.value.trim();

      // ── Client-side validation ──────────────────────────────────────────
      if (!firstName || !email || !message) {
        sendBtn.textContent = "⚠ Fill required fields";
        setTimeout(() => { sendBtn.innerHTML = "✉ Send Message"; }, 2000);
        return;
      }

      // ── Show Facebook-style scale-pulse loading animation ───────────────
      sendBtn.disabled = true;
      sendBtn.innerHTML = `<span class="fb-loader"></span>`;

      // Inject keyframe CSS once
      if (!document.getElementById("fb-loader-style")) {
        const style = document.createElement("style");
        style.id = "fb-loader-style";
        style.textContent = `
          .fb-loader {
            display: inline-block;
            width: 18px; height: 18px;
            border-radius: 4px;
            background: currentColor;
            opacity: 0.9;
            animation: fb-scale-pulse 0.75s ease-in-out infinite alternate;
            vertical-align: middle;
          }
          @keyframes fb-scale-pulse {
            0%   { transform: scale(0.35); opacity: 0.5; }
            100% { transform: scale(1);    opacity: 1;   }
          }
        `;
        document.head.appendChild(style);
      }

      // ── Call the API ────────────────────────────────────────────────────
      try {
        const res  = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, subject, message }),
        });
        const data = await res.json();

        if (data.ok) {
          sendBtn.innerHTML = "✅ Message Sent!";
          // Clear the form fields
          ["fname","lname","femail","fsubject","fmessage"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.value = "";
          });
          setTimeout(closeModal, 1800);
        } else {
          sendBtn.innerHTML = `⚠ ${data.error || "Failed — try again"}`;
          sendBtn.disabled = false;
          setTimeout(() => { sendBtn.innerHTML = "✉ Send Message"; }, 3000);
        }
      } catch {
        sendBtn.innerHTML = "⚠ Network error — try again";
        sendBtn.disabled = false;
        setTimeout(() => { sendBtn.innerHTML = "✉ Send Message"; }, 3000);
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();

// nav bar
(() => {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburgerBtn");
  const navLinks = document.getElementById("navLinks");
  const links = navLinks.querySelectorAll(".navbar__link");
  /* Scroll-shrink */
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("navbar--scrolled", window.scrollY > 40);
    },
    {
      passive: true,
    },
  );
  /* Mobile toggle */
  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("navbar__links--open");
    hamburger.classList.toggle("navbar__hamburger--open", open);
    hamburger.setAttribute("aria-expanded", open);
  });
  /* Close on link click (mobile) */
  links.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("navbar__links--open");
      hamburger.classList.remove("navbar__hamburger--open");
      hamburger.setAttribute("aria-expanded", false);
    });
  });
  /* Active-section highlight */
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("navbar__link--active"));
          const active = navLinks.querySelector(
            `a[href="#${entry.target.id}"]`,
          );
          if (active) active.classList.add("navbar__link--active");
        }
      });
    },
    { threshold: 0.4 },
  );
  sections.forEach((s) => observer.observe(s));
})();
