/* ════════════════════════════════════════
   home.js — blog listing page only
════════════════════════════════════════ */

// ─── Category filter ───
(function () {
  const bar = document.getElementById("filterBar");
  const grid = document.getElementById("postsGrid");
  if (!bar || !grid) return;

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    // Update active button
    bar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;
    const cards = grid.querySelectorAll(".blog-card");

    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
    });
  });
})();
