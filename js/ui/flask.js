/* Kolba reakcyjna: sloty na składniki, warunki, przeprowadzanie reakcji, podpowiedzi i komunikat wyniku. */
(function (K) {
  "use strict";
  const { $, st, ui, S, esc } = K;

  // ---------- Komunikat wyniku ----------
  // Wynik zapisujemy jako funkcję (T) => {cls, html}, żeby po zmianie języka dało się go przerysować.
  let resultFn = T => ({ cls: "", html: `<div class="msg">${esc(T.start)}</div>` });
  function setResult(fn) { resultFn = fn; renderResult(); }
  function renderResult() {
    const { cls, html } = resultFn(K.t());
    const el = $("result");
    el.className = "result" + (cls ? " " + cls : "");
    el.innerHTML = html;
  }

  // ---------- Kolba: dodawanie i usuwanie ----------
  function pick(id) {
    ui.sel = id;
    if (K.isLocked(id)) {
      setResult(T => ({ cls: "hint", html: `<div class="msg">${T.needLevel(esc(K.nameOf(id)), esc(K.levelName(S[id].lvl)))}</div>` }));
      K.renderCard(); K.renderTable();
      return;
    }
    addToFlask(id);
  }

  function addToFlask(id, index) {
    if (K.isLocked(id) || !K.isFound(id)) return;
    if (ui.flask.includes(id)) { ui.sel = id; K.renderCard(); return; } // każda substancja tylko raz
    if (ui.flask.length >= K.SLOTS) {
      setResult(T => ({ cls: "hint", html: `<div class="msg">${esc(T.full(K.SLOTS))}</div>` }));
      return;
    }
    if (index != null && index < ui.flask.length) ui.flask.splice(index, 0, id);
    else ui.flask.push(id);
    ui.sel = id;
    refresh();
  }

  function removeAt(i) { ui.flask.splice(i, 1); refresh(); }

  function clearFlask() {
    ui.flask = [];
    $("liq").style.fill = "";
    $("flask").classList.remove("go", "shake");
  }

  function refresh() { renderSlots(); K.renderTable(); K.renderCompounds(); K.renderCard(); }

  // ---------- Widok slotów i warunków ----------
  function renderSlots() {
    const T = K.t();
    const box = $("slots");
    box.innerHTML = "";
    for (let i = 0; i < K.SLOTS; i++) {
      const id = ui.flask[i];
      const b = document.createElement("button");
      b.className = "slot" + (id ? " filled" : "");
      if (id) {
        b.title = T.removeTitle;
        b.innerHTML = `<span class="chip ${K.colorClass(id)}">${esc(S[id].f)}</span><span class="lab">${esc(K.nameOf(id))}</span><span class="x">${esc(T.remove)}</span>`;
        b.onclick = () => removeAt(i);
      } else {
        b.innerHTML = `<span class="lab">${esc(T.slot(i))}</span>`;
        b.tabIndex = -1;
      }
      // przeciągnij i upuść
      b.addEventListener("dragover", e => { e.preventDefault(); b.classList.add("over"); });
      b.addEventListener("dragleave", () => b.classList.remove("over"));
      b.addEventListener("drop", e => {
        e.preventDefault(); b.classList.remove("over");
        const dropped = e.dataTransfer.getData("text/plain");
        if (S[dropped]) K.isLocked(dropped) ? pick(dropped) : addToFlask(dropped, i);
      });
      box.appendChild(b);
    }
    $("react").disabled = ui.flask.length === 0;
  }

  function renderConds() {
    const T = K.t();
    const box = $("conds");
    box.innerHTML = "";
    K.CONDS.forEach(c => {
      const b = document.createElement("button");
      b.className = "cond";
      b.setAttribute("aria-pressed", String(ui.cond === c));
      b.innerHTML = `<span aria-hidden="true">${K.COND_IC[c]}</span>${esc(T.cond[c])}`;
      b.onclick = () => { ui.cond = c; renderConds(); };
      box.appendChild(b);
    });
  }

  // ---------- Reakcja ----------
  function animate(cls) {
    const f = $("flask");
    f.classList.remove("go", "shake");
    void f.offsetWidth; // restart animacji
    f.classList.add(cls);
    if (cls === "shake") setTimeout(() => f.classList.remove("shake"), 450);
    else setTimeout(() => f.classList.remove("go"), 1800);
  }

  function react() {
    if (!ui.flask.length) return;
    const r = K.RMAP.get(K.key(ui.flask, ui.cond));

    if (!r) {
      // Dlaczego nie działa? Inne warunki / brakuje składnika / brak reakcji
      const sorted = ui.flask.slice().sort().join("+");
      const otherCond = K.R.some(x => x.in.slice().sort().join("+") === sorted);
      const missing = !otherCond && K.R.some(x => x.in.length === ui.flask.length + 1 && ui.flask.every(i => x.in.includes(i)));
      setResult(T => ({ cls: "no", html: `<div class="msg">${esc(otherCond ? T.otherCond : missing ? T.missing : T.noReaction)}</div>` }));
      animate("shake");
      return;
    }
    if (r.lvl > st.lvl) {
      setResult(T => ({ cls: "hint", html: `<div class="msg">${T.rxLevel(esc(K.levelName(r.lvl)))}</div>` }));
      animate("shake");
      return;
    }

    // Sukces
    const newCmps = r.out.filter(o => !S[o].el && !st.found.includes(o));
    const newRx = !st.rx.includes(r.id);
    const levelWasDone = levelDone(st.lvl);
    let gained = 0;
    newCmps.forEach(o => { st.found.push(o); gained += S[o].p; });
    if (newRx) { st.rx.push(r.id); gained += 5; }
    st.score += gained;
    if (newCmps.length) st.fresh = newCmps.slice();
    K.save();

    $("liq").style.fill = K.LIQ[r.type] || "";
    animate("go");
    ui.sel = r.out.find(o => !S[o].el) || r.out[0];

    const cmpPts = newCmps.reduce((a, o) => a + S[o].p, 0);
    setResult(T => {
      let msg;
      if (newCmps.length) msg = T.newCmp(newCmps.map(o => esc(K.nameOf(o))).join(", "), cmpPts);
      else if (newRx) msg = esc(T.newRx);
      else msg = esc(T.known);
      return {
        cls: "ok",
        html: `<div class="eq">${esc(r.eq)}</div>
          <div class="msg"><span class="badge l${r.lvl}">${esc(T.types[r.type])}</span>${msg}</div>
          <div class="msg meta">${esc(r.note[st.lang])}</div>`
      };
    });

    const T = K.t();
    if (newCmps.length) K.toast(esc(T.toastCmp(gained, newCmps.map(o => K.nameOf(o)).join(", "))));
    else if (newRx) K.toast(esc(T.toastRx(gained)));
    if (!levelWasDone && levelDone(st.lvl)) setTimeout(() => K.toast(esc(T.levelDone(K.levelName(st.lvl)))), 2700);

    K.renderAll();
  }

  // Czy wszystkie reakcje danego poziomu zostały przeprowadzone
  function levelDone(L) {
    return K.R.filter(r => r.lvl === L).every(r => st.rx.includes(r.id));
  }

  // ---------- Podpowiedź ----------
  function hint() {
    const avail = id => !K.isLocked(id) && K.isFound(id);
    const cand = K.R.find(r => r.lvl <= st.lvl && !st.rx.includes(r.id) && r.in.every(avail));
    if (!cand) { setResult(T => ({ cls: "hint", html: `<div class="msg">${esc(T.hintNone)}</div>` })); return; }
    if (st.score < 5) { setResult(T => ({ cls: "hint", html: `<div class="msg">${esc(T.hintCost)}</div>` })); return; }
    st.score -= 5;
    K.save();
    K.renderStats();
    setResult(T => ({
      cls: "hint",
      html: `<div class="msg">${T.hintText(esc(K.nameOf(cand.in[0])), cand.in.length - 1, esc(T.cond[cand.c]), esc(T.types[cand.type]))}</div>`
    }));
  }

  function bindFlask() {
    $("react").addEventListener("click", react);
    $("clear").addEventListener("click", () => { clearFlask(); refresh(); setResult(T => ({ cls: "", html: `<div class="msg">${esc(T.start)}</div>` })); });
    $("hint").addEventListener("click", hint);
    // upuszczenie na samą kolbę dodaje składnik na koniec
    const f = $("flask");
    f.addEventListener("dragover", e => e.preventDefault());
    f.addEventListener("drop", e => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (S[id]) pick(id); });
  }

  Object.assign(K, { pick, addToFlask, clearFlask, renderSlots, renderConds, renderResult, setResult, bindFlask });
})(window.Kolb);
