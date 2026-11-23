# Kolbatorium — wersja dla developerów

Edukacyjna gra chemiczna: uczeń łączy pierwiastki i związki w kolbie, dobiera warunki reakcji i odkrywa nowe substancje. Interfejs jest dwujęzyczny (PL/EN), ma tryb jasny i ciemny, a postęp zapisuje się w `localStorage` przeglądarki.

Projekt to czysty HTML + CSS + JavaScript. Nie ma frameworka, bundlera ani `npm install`.

## Uruchomienie

- Najprościej: otwórz `index.html` w przeglądarce (działa też z dysku, przez `file://`).
- Wygodniej przy pracy (automatyczne odświeżanie): rozszerzenie *Live Server* w VS Code albo `python3 -m http.server` w katalogu projektu i adres http://localhost:8000.

Skrypty są zwykłymi tagami `<script>`, nie modułami ES, bo moduły nie działają po otwarciu pliku z dysku. Kod dzieli jeden globalny obiekt `window.Kolb`.

## Struktura

```
kolbatorium/
├── index.html                 szkielet strony; tu jest kolejność ładowania CSS i JS
├── assets/
│   └── logo.svg               logo i favicon
├── css/
│   ├── theme.css              zmienne kolorów i fontów: jasny, ciemny, wybór ☀/☾
│   ├── base.css               reset, nagłówek, siatka strony, panele
│   ├── periodic-table.css     poziomy, zakładki, wyszukiwarka, układ okresowy, legenda
│   ├── compounds.css          kafelki odkrytych związków
│   ├── flask.css              kolba, sloty, warunki, przyciski, wynik
│   ├── card.css               karta substancji
│   ├── log.css                dziennik reakcji
│   └── misc.css               toast, stopka, ograniczenie animacji
├── js/
│   ├── data/                  DANE GRY (PL), tu dodaje się treści
│   │   ├── elements.js        118 pierwiastków
│   │   ├── compounds.js       związki
│   │   └── reactions.js       reakcje
│   ├── i18n/                  TŁUMACZENIA
│   │   ├── ui-strings.js      teksty interfejsu PL + EN (Kolb.T)
│   │   ├── elements.en.js     pierwiastki po angielsku
│   │   ├── compounds.en.js    związki po angielsku
│   │   └── reactions.en.js    komentarze do reakcji po angielsku
│   ├── core/                  LOGIKA BEZ DOM
│   │   ├── model.js           parsowanie danych, poziomy związków, mapa reakcji
│   │   └── state.js           stan gry, zapis/odczyt localStorage, pomocnicze
│   ├── ui/                    WIDOKI
│   │   ├── dom.js             $(), esc(), toast, wyszukiwanie, drag & drop
│   │   ├── header.js          język, motyw, statystyki, poziomy, reset
│   │   ├── table.js           zakładka „Układ okresowy”
│   │   ├── compounds.js       zakładka „Związki”
│   │   ├── log.js             zakładka „Dziennik reakcji”
│   │   ├── card.js            karta substancji
│   │   └── flask.js           kolba: dodawanie, reakcja, podpowiedź, wynik
│   └── main.js                start aplikacji, zakładki, renderAll()
└── tools/
    └── build_single_file.py   skleja wszystko w jeden plik dist/kolbatorium.html
```

Kolejność skryptów w `index.html` ma znaczenie: teksty → dane → tłumaczenia → `core` → `ui` → `main.js`.

## Jak dodać treści

**Pierwiastek** (`js/data/elements.js`), jeden wiersz:
`Z|Symbol|Nazwa|poziom|wzór|zastosowania|ciekawostka|ostrzeżenie`
Zastosowania rozdzielasz średnikiem, każde zaczyna się od emoji i spacji: `🚀 paliwo rakietowe;🎈 balony`. Puste pole „wzór” oznacza, że wzorem jest sam symbol.

**Związek** (`js/data/compounds.js`):
`ID:["wzór","Nazwa",punkty,"zastosowania","ciekawostka","ostrzeżenie (opcjonalne)"]`
`ID` to klucz bez znaków specjalnych, np. `CaOH2`. Poziomu związku nie wpisujesz ręcznie. `model.js` liczy go sam: to najniższy poziom, na którym da się ten związek otrzymać.

**Reakcja** (`js/data/reactions.js`):
`["r48",["Al","O"],"heat",["Al2O3"],"4Al + 3O₂ → 2Al₂O₃","synteza","Komentarz"]`
- składniki i produkty to ID z `S` (symbole pierwiastków albo klucze związków), maksymalnie 4 składniki (`Kolb.SLOTS`);
- warunki: `none`, `heat`, `elec`, `light`, `cat`;
- typ musi być jednym z `Kolb.TYPES` (`model.js`);
- **poziom wynika z numeru**: `r1–r99` podstawowy, `r100–r299` średniozaawansowany, `r300+` ekspercki;
- ta sama para „składniki + warunki” może wystąpić tylko raz.

**Tłumaczenie EN**: dopisz odpowiedni wpis w `js/i18n/*.en.js`. Jeśli go nie ma, gra pokaże tekst polski.

**Nowy tekst interfejsu**: dodaj klucz w `js/i18n/ui-strings.js` w obu językach. W HTML wystarczy atrybut `data-t="klucz"` (treść), `data-t-ph` (placeholder) albo `data-t-title` (podpowiedź).

## Najważniejsze miejsca w logice

| Co | Gdzie |
|---|---|
| Sprawdzanie, czy reakcja zachodzi | `react()` w `js/ui/flask.js`, wyszukiwanie w `Kolb.RMAP` |
| Punkty za związek i reakcję (+5) | `react()` w `js/ui/flask.js` |
| Koszt podpowiedzi (5 pkt) | `hint()` w `js/ui/flask.js` |
| Progi stopni (Praktykant → Noblista) | `RANK_PTS` w `js/core/model.js` |
| Klucz zapisu w localStorage | `STORE` w `js/core/state.js` (`lab-zw-v2`, zgodny z opublikowaną wersją) |
| Kolory cieczy dla typów reakcji | `LIQ` w `js/core/model.js` |
| Pełne przerysowanie widoku | `renderAll()` w `js/main.js` |

## Publikacja jako jeden plik

```
python3 tools/build_single_file.py
```

Powstaje `dist/kolbatorium.html` ze wszystkimi stylami, skryptami i logo w środku. Ten plik możesz wgrać tam, gdzie potrzebny jest pojedynczy HTML.

## Uwaga o pochodzeniu kodu

W opublikowanej wersji gry brakowało końcówki skryptu z logiką: plik urywał się w połowie. Dane, tłumaczenia, style i teksty interfejsu przeniesiono stamtąd bez zmian. Logikę w `js/core` i `js/ui` napisano od nowa na ich podstawie. Zachowanie może więc w szczegółach różnić się od pierwotnego zamysłu, np. kolejnością wybierania podpowiedzi albo tym, co dzieje się z kolbą po reakcji.

© 2026 CappySoft.pl
