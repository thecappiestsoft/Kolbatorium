/* Stan gry, zapis w localStorage i funkcje pomocnicze zależne od stanu (język, poziom, dostępność). */
(function (K) {
  "use strict";
  const STORE = "lab-zw-v2"; // ten sam klucz co w opublikowanej wersji — postęp uczniów się zachowa

  const st = { found: [], rx: [], score: 0, fresh: [], lvl: 1, lang: null, theme: null };
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || localStorage.getItem("lab-zw-v1") || "null");
    if (s && Array.isArray(s.found)) Object.assign(st, s);
  } catch (e) { /* brak dostępu do localStorage — gra działa bez zapisu */ }
  st.found = (st.found || []).filter(id => K.S[id] && !K.S[id].el);
  st.rx = (st.rx || []).filter(id => K.R.some(r => r.id === id));
  st.fresh = (st.fresh || []).filter(id => st.found.includes(id));
  if (![1, 2, 3].includes(st.lvl)) st.lvl = 1;
  if (st.lang !== "pl" && st.lang !== "en") st.lang = (navigator.language || "pl").toLowerCase().startsWith("pl") ? "pl" : "en";
  if (st.theme !== "light" && st.theme !== "dark") st.theme = null;

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) { /* ignoruj */ }
  }
  function reset() {
    Object.assign(st, { found: [], rx: [], score: 0, fresh: [] });
    save();
  }

  // Stan sesji (niezapisywany): zawartość kolby, warunki, aktywna zakładka, wybrana substancja
  const ui = { flask: [], cond: "none", tab: "el", sel: "H", q: "" };

  const t = () => K.T[st.lang];                       // teksty interfejsu w bieżącym języku
  const txt = id => K.S[id][st.lang];                  // {n,u,fact,warn} substancji
  const nameOf = id => txt(id).n;
  const levelName = L => t().levels[L];
  const isFound = id => K.S[id].el || st.found.includes(id);
  const isLocked = id => K.S[id].lvl > st.lvl;
  const rankIndex = () => { let i = 0; K.RANK_PTS.forEach((p, k) => { if (st.score >= p) i = k; }); return i; };

  Object.assign(K, { st, ui, save, reset, t, txt, nameOf, levelName, isFound, isLocked, rankIndex });
})(window.Kolb);
