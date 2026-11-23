/* Karta substancji: opis wybranego pierwiastka lub związku. */
(function (K) {
  "use strict";
  const { $, st, ui, S, esc } = K;

  function renderCard() {
    const T = K.t();
    const id = ui.sel;
    const box = $("card");
    if (!id || !S[id]) { box.innerHTML = ""; return; }
    const s = S[id];
    const tx = s[st.lang];

    let meta, extra = "";
    if (s.el) {
      const [g, p] = K.groupPeriod(s.z);
      meta = T.elMeta(T.cat[s.cat], s.z, g, p);
      const inRx = K.R.filter(r => r.lvl <= st.lvl && r.in.includes(id));
      const done = inRx.filter(r => st.rx.includes(r.id)).length;
      extra = `<p class="meta" style="margin-top:10px">${esc(inRx.length ? T.inRx(inRx.length, done) : T.noRx)}</p>`;
    } else {
      meta = T.cmpMeta(s.p);
      const how = K.R.filter(r => st.rx.includes(r.id) && r.out.includes(id));
      if (how.length) extra = `<div class="from"><div class="label">${esc(T.howGot)}</div>${how.map(r => `<div>${esc(r.eq)}</div>`).join("")}</div>`;
    }

    box.innerHTML = `
      <div class="big">
        <div class="sq ${K.colorClass(id)}">${esc(s.f)}</div>
        <div><h3>${esc(tx.n)}</h3><div class="meta">${esc(meta)}</div></div>
      </div>
      <div class="uses">${tx.u.map(([ic, txt]) => `<div class="use"><span class="ic" aria-hidden="true">${ic}</span><span>${esc(txt)}</span></div>`).join("")}</div>
      <p class="fact">${esc(tx.fact)}</p>
      ${tx.warn ? `<div class="warnbox"><b>${esc(T.safety)}</b> ${esc(tx.warn)}</div>` : ""}
      ${extra}`;
  }

  K.renderCard = renderCard;
})(window.Kolb);
