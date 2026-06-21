/* ════════════════════════════════════════
   post.js — individual post page only
════════════════════════════════════════ */

// ─── Dynamic table renderer ───
// Reads data-table JSON from each .compare-table element and
// builds thead + tbody entirely on the client — no server helpers needed.
(function () {
  function buildTables() {
    document
      .querySelectorAll(".compare-table[data-table]")
      .forEach(function (table) {
        var data;
        try {
          data = JSON.parse(table.dataset.table);
        } catch (e) {
          return;
        }

        var columns = data.columns; // [{ header, key, type, badgeKey? }]
        var rows = data.rows; // [{ key: value, ... }]
        if (!columns || !rows) return;

        // ── thead ──
        var thead = document.createElement("thead");
        var hr = document.createElement("tr");
        columns.forEach(function (col) {
          var th = document.createElement("th");
          th.textContent = col.header;
          hr.appendChild(th);
        });
        thead.appendChild(hr);
        table.appendChild(thead);

        // ── tbody ──
        var tbody = document.createElement("tbody");
        rows.forEach(function (row) {
          var tr = document.createElement("tr");
          columns.forEach(function (col) {
            var td = document.createElement("td");
            var val = row[col.key] || "";

            if (col.type === "code") {
              var span = document.createElement("span");
              span.className = "fn-name";
              span.textContent = val;
              td.appendChild(span);
            } else if (col.type === "badge") {
              var badge = document.createElement("span");
              badge.className = "badge " + (row[col.badgeKey] || "");
              badge.textContent = val;
              td.appendChild(badge);
            } else {
              td.textContent = val;
            }

            tr.appendChild(td);
          });
          tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        // Remove attribute so it won't re-render if called again
        table.removeAttribute("data-table");
      });
  }

  // Run after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildTables);
  } else {
    buildTables();
  }
})();

// ─── Event loop diagram: Prev / Next buttons ───
(function () {
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

// ─── Copy code button ───
function copyCode(btn) {
  const codeBlock = btn.closest('.code-block');
  const pre = codeBlock.querySelector('pre');
  const text = pre.textContent;

  navigator.clipboard.writeText(text).then(() => {
    const label = btn.querySelector('.copy-label');
    const originalText = label.textContent;
    label.textContent = 'Copied!';
    btn.classList.add('copied');

    setTimeout(() => {
      label.textContent = originalText;
      btn.classList.remove('copied');
    }, 2000);
  }).catch(() => {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const label = btn.querySelector('.copy-label');
    label.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      label.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}
