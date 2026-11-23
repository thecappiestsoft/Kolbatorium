/* Model gry: przygotowanie danych z plików js/data/* i js/i18n/*.en.js.
 * Wynik trafia do obiektu Kolb (S, R, RMAP, ELS, CMPS, ...). Ten plik nie dotyka DOM-u.
 */
(function (K) {
  "use strict";

  // Kategoria pierwiastka -> klasa CSS cat-<kategoria> (kolory w css/theme.css)
  function catOf(z) {
    if ([1, 6, 7, 8, 15, 16, 34].includes(z)) return "niem";
    if ([9, 17, 35, 53, 85, 117].includes(z)) return "halo";
    if ([2, 10, 18, 36, 54, 86, 118].includes(z)) return "szl";
    if ([3, 11, 19, 37, 55, 87].includes(z)) return "alk";
    if ([4, 12, 20, 38, 56, 88].includes(z)) return "ziem";
    if ([5, 14, 32, 33, 51, 52].includes(z)) return "pol";
    if (z >= 57 && z <= 71) return "lan";
    if (z >= 89 && z <= 103) return "akt";
    if ((z >= 21 && z <= 30) || (z >= 39 && z <= 48) || (z >= 72 && z <= 80) || (z >= 104 && z <= 112)) return "przej";
    return "pomet";
  }

  // Pozycja w siatce układu okresowego: [wiersz, kolumna]. Wiersze 9 i 10 to lantanowce i aktynowce.
  function posOf(z) {
    if (z === 1) return [1, 1]; if (z === 2) return [1, 18];
    if (z <= 10) return [2, z <= 4 ? z - 2 : z + 8];
    if (z <= 18) return [3, z <= 12 ? z - 10 : z];
    if (z <= 36) return [4, z - 18];
    if (z <= 54) return [5, z - 36];
    if (z <= 56) return [6, z - 54];
    if (z <= 71) return [9, z - 54];
    if (z <= 86) return [6, z - 68];
    if (z <= 88) return [7, z - 86];
    if (z <= 103) return [10, z - 86];
    return [7, z - 100];
  }

  // Grupa i okres do karty substancji (lantanowce/aktynowce liczymy do grupy 3)
  function groupPeriod(z) {
    const [r, c] = posOf(z);
    if (r === 9) return [3, 6];
    if (r === 10) return [3, 7];
    return [c, r];
  }

  // "🚀 paliwo;🎈 balony" -> [["🚀","paliwo"],["🎈","balony"]]
  const parseUses = s => (s || "").split(";").filter(Boolean).map(u => { const i = u.indexOf(" "); return [u.slice(0, i), u.slice(i + 1)]; });

  // ---------- Substancje: S[id] ----------
  const S = {};
  const EN_EL = {};
  (typeof ELEMENT_EN !== "undefined" ? ELEMENT_EN : "").trim().split("\n").filter(Boolean).forEach(l => {
    const [sym, n, u, fact, warn] = l.split("|");
    EN_EL[sym] = { n, u: parseUses(u), fact, warn: warn || "" };
  });
  ELEMENT_DATA.trim().split("\n").forEach(line => {
    const [z, sym, n, lvl, f, u, fact, warn] = line.split("|");
    const pl = { n, u: parseUses(u), fact, warn: warn || "" };
    S[sym] = { id: sym, el: true, z: +z, sym, lvl: +lvl, f: f || sym, cat: catOf(+z), pl, en: EN_EL[sym] || pl };
  });
  const ELS = Object.keys(S);

  const CEN = typeof COMPOUND_EN !== "undefined" ? COMPOUND_EN : {};
  Object.entries(COMPOUND_DATA).forEach(([id, [f, n, p, u, fact, warn]]) => {
    const pl = { n, u: parseUses(u), fact, warn: warn || "" };
    const e = CEN[id];
    S[id] = { id, el: false, f, p, pl, en: e ? { n: e[0], u: parseUses(e[1]), fact: e[2], warn: e[3] || "" } : pl };
  });
  const CMPS = Object.keys(COMPOUND_DATA);

  // ---------- Reakcje ----------
  const REN = typeof REACTION_EN !== "undefined" ? REACTION_EN : {};
  const rLevel = id => { const k = +id.slice(1); return k < 100 ? 1 : k < 300 ? 2 : 3; };
  const R = REACTION_DATA.map(a => ({
    id: a[0], in: a[1], c: a[2], out: a[3], eq: a[4], type: a[5],
    note: { pl: a[6], en: REN[a[0]] || a[6] }, lvl: rLevel(a[0])
  }));
  const key = (ins, c) => ins.slice().sort().join("+") + "|" + c;
  const RMAP = new Map(R.map(r => [key(r.in, r.c), r]));

  // Poziom związku = najniższy poziom, na którym da się go otrzymać z dostępnych pierwiastków
  for (const L of [1, 2, 3]) {
    const have = new Set(ELS.filter(e => S[e].lvl <= L)); let ch = true;
    while (ch) {
      ch = false;
      for (const r of R) {
        if (r.lvl > L || !r.in.every(x => have.has(x))) continue;
        for (const o of r.out) if (!have.has(o)) { have.add(o); ch = true; if (!S[o].el && !S[o].lvl) S[o].lvl = L; }
      }
    }
  }
  CMPS.forEach(id => { if (!S[id].lvl) S[id].lvl = 3; }); // zabezpieczenie: związek nieosiągalny trafia na poziom 3

  // Pierwiastki biorące udział w reakcjach na danym poziomie (kropka w rogu kafelka)
  const elInRx = { 1: new Set(), 2: new Set(), 3: new Set() };
  R.forEach(r => { for (const L of [1, 2, 3]) if (r.lvl <= L) r.in.forEach(x => { if (S[x].el) elInRx[L].add(x); }); });

  Object.assign(K, {
    catOf, posOf, groupPeriod, parseUses, key,
    S, ELS, CMPS, R, RMAP, elInRx,
    COND_IC: { none: "·", heat: "🔥", elec: "⚡", light: "☀️", cat: "⚙️" },
    CONDS: ["none", "heat", "elec", "light", "cat"],
    TYPES: ["synteza", "rozkład", "spalanie", "wymiana pojedyncza", "wymiana podwójna", "zobojętnianie", "redoks", "biochemiczna", "polimeryzacja", "estryfikacja", "substytucja"],
    LIQ: { synteza: "#7fb2ff", rozkład: "#c7a6f0", spalanie: "#f59a5b", "wymiana pojedyncza": "#6cd3a8", "wymiana podwójna": "#5fc7d6", zobojętnianie: "#9be27a", redoks: "#e57b7b", biochemiczna: "#b5d65a", polimeryzacja: "#d6d6d6", estryfikacja: "#f2c46b", substytucja: "#9fb0ff" },
    RANK_PTS: [0, 150, 500, 1200, 2500, 5000],
    SLOTS: 4
  });
})(window.Kolb);
