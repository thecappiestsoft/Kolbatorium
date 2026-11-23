/* Zakładka „Związki”: odkryte związki pogrupowane według poziomu. */
(function (K) {
  "use strict";
  const { $, st, ui, S } = K;

  function renderCompounds() {
    const T = K.t();
    const box = $("cmpwrap");
    const q = K.norm(ui.q);
    $("cmpn").textContent = st.found.length ? `(${st.found.length})` : "";
    box.innerHTML = "";

    if (!st.found.length) {
      box.innerHTML = `<div class="empty">${K.esc(T.noCompounds)}</div>`;
      return;
    }
    const list = K.CMPS.filter(id => st.found.includes(id) && K.matches(id, q));
    if (!list.length) {
      box.innerHTML = `<div class="empty">${K.esc(T.noMatch)}</div>`;
      return;
    }
    [1, 2, 3].forEach(L => {
      const ids = list.filter(id => S[id].lvl === L);
      if (!ids.length) return;
      const h = document.createElement("div");
      h.className = "grouph"; h.textContent = T.levels[L];
      box.appendChild(h);
      ids.forEach(id => {
        const s = S[id];
        const b = document.createElement("button");
        b.className = "tile" + (st.fresh.includes(id) ? " new" : "") + (ui.flask.includes(id) ? " sel" : "");
        if (K.isLocked(id)) b.style.opacity = ".4";
        b.dataset.new = st.lang === "pl" ? "nowy" : "new";
        b.title = s[st.lang].n;
        b.innerHTML = `<span class="z">${s.p} ${K.esc(T.pts)}</span><span class="sym">${K.esc(s.f)}</span><span class="nm">${K.esc(s[st.lang].n)}</span>`;
        b.addEventListener("click", () => K.pick(id));
        K.makeDraggable(b, id);
        box.appendChild(b);
      });
    });
  }

  K.renderCompounds = renderCompounds;
})(window.Kolb);
