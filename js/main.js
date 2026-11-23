/* Punkt wejścia: zakładki, wyszukiwarka, zmiana poziomu i pełne przerysowanie (renderAll). */
(function (K) {
  "use strict";
  const { $, st, ui } = K;

  const TABS = { el: ["t-el", "elwrap"], cmp: ["t-cmp", "cmpwrap"], log: ["t-log", "logwrap"] };

  function showTab(name) {
    ui.tab = name;
    Object.entries(TABS).forEach(([k, [tabId, paneId]]) => {
      $(tabId).setAttribute("aria-selected", String(k === name));
      $(paneId).hidden = k !== name;
    });
  }

  function setLevel(L) {
    st.lvl = L;
    ui.flask = ui.flask.filter(id => !K.isLocked(id)); // usuń z kolby to, co niedostępne na nowym poziomie
    K.save();
    renderAll();
  }

  function renderAll() {
    K.applyStaticTexts();
    K.applyTheme();
    K.renderStats();
    K.renderLevels();
    K.renderTable();
    K.renderCompounds();
    K.renderLog();
    K.renderSlots();
    K.renderConds();
    K.renderCard();
    K.renderResult();
    K.renderReset(false);
  }

  function init() {
    Object.entries(TABS).forEach(([k, [tabId]]) => $(tabId).addEventListener("click", () => showTab(k)));
    $("q").addEventListener("input", e => { ui.q = e.target.value; K.renderTable(); K.renderCompounds(); });
    K.bindHeader();
    K.bindFlask();
    showTab("el");
    renderAll();
  }

  Object.assign(K, { setLevel, renderAll, showTab });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window.Kolb);
