/* ════════════════════════════════════════
   post.js — individual post page only
════════════════════════════════════════ */

// ─── Event loop diagram: Prev / Next buttons ───
// The CSS-only radio tabs handle click-on-label switching.
// These buttons find the current :checked radio and step to a neighbour.
(function () {
  // Dynamically count how many loop-phase radios exist on the page
  // so this works for both the Node.js post (6 phases) and any future post.
  function getTotal() {
    let i = 0;
    while (document.getElementById("ph-" + i)) i++;
    return i;
  }

  window.stepPhase = function (dir) {
    const total = getTotal();
    if (total === 0) return;

    for (let i = 0; i < total; i++) {
      const r = document.getElementById("ph-" + i);
      if (r && r.checked) {
        const next = document.getElementById(
          "ph-" + ((i + dir + total) % total),
        );
        if (next) next.checked = true;
        return;
      }
    }
  };
})();
