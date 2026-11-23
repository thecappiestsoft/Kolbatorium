/* Drobne narzędzia DOM: wyszukiwanie elementów, escapowanie, toast, normalizacja wyszukiwania. */
(function (K) {
  "use strict";
  const $ = id => document.getElementById(id);

  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Wyszukiwanie bez polskich znaków i z cyframi zamiast indeksów dolnych (H₂O == h2o)
  const SUB = "₀₁₂₃₄₅₆₇₈₉";
  const norm = s => String(s || "").toLowerCase()
    .replace(/[₀-₉]/g, c => String(SUB.indexOf(c)))
    .replace(/ł/g, "l")
    .normalize("NFD").replace(/[̀-ͯ]/g, "");

  function matches(id, q) {
    if (!q) return true;
    const s = K.S[id];
    return [id, s.f, s.sym, s.pl.n, s.en.n].some(v => v && norm(v).includes(q));
  }

  // Klasa koloru dla chipu/kwadratu substancji
  const colorClass = id => K.S[id].el ? "cat-" + K.S[id].cat : "cat-zw";

  let toastTimer = 0;
  function toast(html) {
    const el = $("toast");
    el.innerHTML = html;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // Przeciąganie substancji do kolby (wspólne dla układu okresowego i zakładki Związki)
  function makeDraggable(btn, id) {
    btn.draggable = true;
    btn.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", id);
      e.dataTransfer.effectAllowed = "copy";
    });
  }

  Object.assign(K, { $, esc, norm, matches, colorClass, toast, makeDraggable });
})(window.Kolb);
