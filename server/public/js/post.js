/* ════════════════════════════════════════
   post.js — individual post page only
════════════════════════════════════════ */

// ─── Event loop diagram: Prev / Next buttons ───
// The CSS-only radio tabs handle click-on-label switching.
// These buttons just need to find the current :checked radio and step to a neighbour.
(function () {
  const TOTAL = 6; // matches number of loop phases in data

  window.stepPhase = function (dir) {
    for (let i = 0; i < TOTAL; i++) {
      const r = document.getElementById("ph-" + i);
      if (r && r.checked) {
        const next = document.getElementById(
          "ph-" + ((i + dir + TOTAL) % TOTAL),
        );
        if (next) next.checked = true;
        return;
      }
    }
  };
})();
