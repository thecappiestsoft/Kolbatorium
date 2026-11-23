/* Nagłówek i elementy globalne: teksty statyczne (data-t), język, motyw, statystyki, poziomy, reset. */
(function (K) {
  "use strict";
  const { $, st } = K;

  // Teksty w HTML oznaczone data-t / data-t-ph / data-t-title
  function applyStaticTexts() {
    const T = K.t();
    document.documentElement.lang = st.lang;
    document.querySelectorAll("[data-t]").forEach(el => { const v = T[el.dataset.t]; if (typeof v === "string") el.textContent = v; });
    document.querySelectorAll("[data-t-ph]").forEach(el => { el.placeholder = T[el.dataset.tPh]; });
    document.querySelectorAll("[data-t-title]").forEach(el => { el.title = T[el.dataset.tTitle]; });
    document.querySelectorAll(".langbtn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === st.lang)));
    $("levels").setAttribute("aria-label", T.levelsAria);
    $("themegrp").setAttribute("aria-label", T.themeAria);
  }

  // Motyw: null = jak w systemie, "light"/"dark" = wybór ucznia
  function applyTheme() {
    document.body.classList.toggle("app-light", st.theme === "light");
    document.body.classList.toggle("app-dark", st.theme === "dark");
    if (st.theme) document.documentElement.dataset.theme = st.theme;
    else delete document.documentElement.dataset.theme;
    document.querySelectorAll(".themebtn").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.setTheme === st.theme)));
  }

  function renderStats() {
    const T = K.t();
    $("score").textContent = st.score;
    $("count").textContent = `${st.found.length}/${K.CMPS.length}`;
    $("bar").style.width = (100 * st.found.length / K.CMPS.length) + "%";
    $("rank").textContent = T.ranks[K.rankIndex()];
  }

  function renderLevels() {
    const T = K.t();
    const box = $("levels");
    box.innerHTML = "";
    [1, 2, 3].forEach(L => {
      const all = K.CMPS.filter(id => K.S[id].lvl === L);
      const got = all.filter(id => st.found.includes(id)).length;
      const b = document.createElement("button");
      b.className = "lvl";
      b.setAttribute("aria-pressed", String(st.lvl === L));
      b.innerHTML = `<b>${K.esc(T.levels[L])}</b><small>${K.esc(T.ofCompounds(got, all.length))}</small>`;
      b.onclick = () => K.setLevel(L);
      box.appendChild(b);
    });
    $("lvlnote").textContent = T.levelNotes[st.lvl];
  }

  function renderReset(confirming) {
    const T = K.t();
    const box = $("resetbox");
    box.innerHTML = "";
    if (!confirming) {
      const b = document.createElement("button");
      b.className = "btn"; b.textContent = T.reset;
      b.onclick = () => renderReset(true);
      box.appendChild(b);
      return;
    }
    const wrap = document.createElement("span");
    wrap.className = "confirm";
    wrap.innerHTML = `<span>${K.esc(T.resetQ)}</span>`;
    const yes = document.createElement("button"); yes.className = "btn"; yes.textContent = T.yes;
    const no = document.createElement("button"); no.className = "btn"; no.textContent = T.no;
    yes.onclick = () => { K.reset(); K.clearFlask(); K.renderAll(); K.toast(K.esc(T.resetDone)); };
    no.onclick = () => renderReset(false);
    wrap.append(yes, no);
    box.appendChild(wrap);
    no.focus();
  }

  function bindHeader() {
    document.querySelectorAll(".langbtn").forEach(b => b.addEventListener("click", () => {
      st.lang = b.dataset.lang; K.save(); K.renderAll();
    }));
    document.querySelectorAll(".themebtn").forEach(b => b.addEventListener("click", () => {
      // ponowne kliknięcie aktywnego przycisku wraca do motywu systemowego
      st.theme = st.theme === b.dataset.setTheme ? null : b.dataset.setTheme;
      K.save(); applyTheme();
    }));
  }

  Object.assign(K, { applyStaticTexts, applyTheme, renderStats, renderLevels, renderReset, bindHeader });
})(window.Kolb);
