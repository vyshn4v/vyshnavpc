(() => {
  "use strict";

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const progress = qs("#progress");
  if (progress) {
    window.addEventListener(
      "scroll",
      () => {
        const page = document.documentElement;
        const max = page.scrollHeight - page.clientHeight;
        progress.style.width = max > 0 ? `${(page.scrollTop / max) * 100}%` : "0%";
      },
      { passive: true },
    );
  }

  const modalBackdrop = qs("#modalBackdrop");
  const openContact = qs("#openContact");
  const closeContact = qs("#closeContact");
  const cancelContact = qs("#cancelContact");
  const sendContact = qs("#sendContact");
  const contactFields = ["fname", "lname", "femail", "fsubject", "fmessage"];

  const setModalOpen = (open) => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.toggle("is-open", open);
    document.body.classList.toggle("modal-open", open);
  };

  const clearContactErrors = () => {
    contactFields.forEach((id) => {
      qs(`#${id}`)?.classList.remove("error");
      const error = qs(`#err-${id}`);
      if (error) {
        error.classList.remove("show");
        error.textContent = "";
      }
    });
  };

  const resetContactButton = () => {
    if (!sendContact) return;
    sendContact.textContent = "Send Message";
    sendContact.disabled = false;
  };

  const closeModal = () => {
    setModalOpen(false);
    clearContactErrors();
    window.setTimeout(resetContactButton, 250);
  };

  openContact?.addEventListener("click", () => setModalOpen(true));
  closeContact?.addEventListener("click", closeModal);
  cancelContact?.addEventListener("click", closeModal);
  modalBackdrop?.addEventListener("click", (event) => {
    if (event.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
  });

  const showFieldError = (id, message) => {
    qs(`#${id}`)?.classList.add("error");
    const error = qs(`#err-${id}`);
    if (error) {
      error.textContent = message;
      error.classList.add("show");
    }
  };

  sendContact?.addEventListener("click", async () => {
    const firstName = qs("#fname")?.value.trim() || "";
    const lastName = qs("#lname")?.value.trim() || "";
    const email = qs("#femail")?.value.trim() || "";
    const subject = qs("#fsubject")?.value.trim() || "";
    const message = qs("#fmessage")?.value.trim() || "";
    const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    clearContactErrors();
    let hasError = false;

    if (!firstName) {
      showFieldError("fname", "First name is required.");
      hasError = true;
    } else if (firstName.length > 50) {
      showFieldError("fname", "Max 50 characters allowed.");
      hasError = true;
    }

    if (lastName.length > 50) {
      showFieldError("lname", "Max 50 characters allowed.");
      hasError = true;
    }

    if (!email) {
      showFieldError("femail", "Email is required.");
      hasError = true;
    } else if (!emailRe.test(email) || email.length > 100) {
      showFieldError("femail", "Enter a valid email address.");
      hasError = true;
    }

    if (!subject) {
      showFieldError("fsubject", "Subject is required.");
      hasError = true;
    } else if (subject.length > 100) {
      showFieldError("fsubject", "Max 100 characters allowed.");
      hasError = true;
    }

    if (!message) {
      showFieldError("fmessage", "Message is required.");
      hasError = true;
    } else if (message.length < 10) {
      showFieldError("fmessage", "Message must be at least 10 characters.");
      hasError = true;
    } else if (message.length > 2000) {
      showFieldError("fmessage", "Max 2000 characters allowed.");
      hasError = true;
    }

    const cfContainer = qs(".cf-turnstile");
    const turnstileToken =
      (typeof turnstile !== "undefined" && turnstile.getResponse(cfContainer)) ||
      qs('[name="cf-turnstile-response"]')?.value ||
      "";

    if (cfContainer && !turnstileToken) {
      showFieldError("fmessage", "Please complete the captcha.");
      hasError = true;
    }

    if (hasError) {
      sendContact.textContent = "Check errors above";
      window.setTimeout(resetContactButton, 2500);
      return;
    }

    sendContact.disabled = true;
    sendContact.textContent = "Sending...";

    try {
      const response = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          subject,
          message,
          "cf-turnstile-response": turnstileToken,
        }),
      });
      const data = await response.json();

      if (!data.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      sendContact.textContent = "Message sent";
      contactFields.forEach((id) => {
        const field = qs(`#${id}`);
        if (field) field.value = "";
      });
      window.setTimeout(closeModal, 1600);
    } catch (error) {
      sendContact.textContent = error.message || "Network error";
      sendContact.disabled = false;
      if (typeof turnstile !== "undefined") turnstile.reset();
      window.setTimeout(resetContactButton, 3000);
    }
  });

  const nav = qs(".premium-navbar");
  const navToggle = qs("#navToggle");
  if (nav) {
    window.addEventListener(
      "scroll",
      () => nav.classList.toggle("premium-navbar--scrolled", window.scrollY > 12),
      { passive: true },
    );
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("mobile-open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open);
    });
  }

  qsa('.premium-nav-links a').forEach((link) => {
    link.addEventListener("click", () => {
      if (nav && nav.classList.contains("mobile-open")) {
        nav.classList.remove("mobile-open");
        if (navToggle) {
          navToggle.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  qsa('a[href^="/#"]').forEach((link) => {
    link.addEventListener("click", () => setModalOpen(false));
  });
})();
