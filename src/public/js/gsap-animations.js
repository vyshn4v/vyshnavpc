document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger not loaded.");
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // --- Hero Section Animation ---
  // We'll target the elements we want to stagger in the hero area.
  // Using .gsap-hero-item class for elements inside the hero header.
  const heroItems = document.querySelectorAll(".gsap-hero-item");
  if (heroItems.length > 0) {
    gsap.from(heroItems, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.1 // slight delay on initial load
    });
  }

  // --- Scroll-Triggered Section Reveals ---
  // Target all sections or cards that should fade/slide up on scroll.
  const sections = document.querySelectorAll(".gsap-reveal");
  sections.forEach((section) => {
    gsap.fromTo(section, 
      { 
        y: 40, 
        opacity: 0 
      },
      {
        scrollTrigger: {
          trigger: section,
          start: "top 85%", // when the top of the section hits 85% from the top of the viewport
          toggleActions: "play none none reverse" // play on enter, reverse on leave back
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power2.out"
      }
    );
  });

  // --- Premium Card Hover Effects (Optional Enhancement) ---
  // GSAP can handle smooth hovers if CSS is not enough, but CSS is usually more performant for simple hover states.
  // For a premium feel, let's just make sure cards tilt or lift slightly via CSS in premium-theme.css
});
