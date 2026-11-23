/* Zakładka „Dziennik reakcji”: poznane typy reakcji i lista przeprowadzonych reakcji (najnowsze na górze). */
(function (K) {
  "use strict";
  const { $, st } = K;

  function renderLog() {
    const T = K.t();
    const done = st.rx.map(id => K.R.find(r => r.id === id)).filter(Boolean);
    const known = new Set(done.map(r => r.type));

    $("types").innerHTML = K.TYPES.map(ty => `<span class="${known.has(ty) ? "on" : ""}">${K.esc(T.types[ty])}</span>`).join("");

    const log = $("log");
    if (!done.length) { log.innerHTML = `<div class="empty">${K.esc(T.noLog)}</div>`; return; }
    log.innerHTML = done.slice().reverse().map(r => `
      <div class="logitem">
        <div class="eq">${K.esc(r.eq)}</div>
        <div class="meta"><span class="badge l${r.lvl}">${K.esc(T.levels[r.lvl])}</span>${K.esc(T.types[r.type])} · ${K.COND_IC[r.c]} ${K.esc(T.cond[r.c])}</div>
        <div class="meta">${K.esc(r.note[st.lang])}</div>
      </div>`).join("");
  }

  K.renderLog = renderLog;
})(window.Kolb);
