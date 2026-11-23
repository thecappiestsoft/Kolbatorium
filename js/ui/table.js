/* Zakładka „Układ okresowy”: siatka 18 kolumn, numery grup, lantanowce i aktynowce w osobnych wierszach. */
(function (K) {
  "use strict";
  const { $, st, ui, S } = K;

  function cell(row, col, el) {
    el.style.gridRow = row;
    el.style.gridColumn = col;
    return el;
  }

  function renderTable() {
    const T = K.t();
    const pt = $("pt");
    const q = K.norm(ui.q);
    const frag = document.createDocumentFragment();

    // Wiersz 1: numery grup
    for (let g = 1; g <= 18; g++) {
      const d = document.createElement("div");
      d.className = "gnum"; d.textContent = g;
      frag.appendChild(cell(1, g, d));
    }
    // Miejsca na lantanowce i aktynowce w głównej tablicy
    [[7, "57–71"], [8, "89–103"]].forEach(([row, label]) => {
      const d = document.createElement("div");
      d.className = "el ph"; d.textContent = label;
      frag.appendChild(cell(row, 3, d));
    });

    K.ELS.forEach(id => {
      const s = S[id];
      const [r, c] = K.posOf(s.z);
      const b = document.createElement("button");
      const cls = ["el", "cat-" + s.cat];
      if (K.elInRx[st.lvl].has(id)) cls.push("rx");
      if (K.isLocked(id)) cls.push("locked");
      if (!K.matches(id, q)) cls.push("dim");
      if (ui.flask.includes(id) || ui.sel === id) cls.push("sel");
      b.className = cls.join(" ");
      b.title = s[st.lang].n + (K.isLocked(id) ? " — " + T.lockedTitle(K.levelName(s.lvl)) : "");
      b.innerHTML = `<span class="z">${s.z}</span><span class="s">${s.sym}</span><span class="n">${K.esc(s[st.lang].n)}</span>`;
      b.addEventListener("click", () => K.pick(id));
      K.makeDraggable(b, id);
      // wiersz +1, bo pierwszy wiersz siatki to numery grup
      frag.appendChild(cell(r + 1, c, b));
    });

    pt.innerHTML = "";
    pt.appendChild(frag);
  }

  K.renderTable = renderTable;
})(window.Kolb);
