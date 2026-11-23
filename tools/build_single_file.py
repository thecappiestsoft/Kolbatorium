#!/usr/bin/env python3
"""Skleja projekt w jeden plik dist/kolbatorium.html (CSS, JS i logo wstawione do środka).
Użycie: python3 tools/build_single_file.py
Przydatne, gdy grę trzeba opublikować jako pojedynczy plik HTML (np. artefakt Claude albo e-dziennik)."""
import base64, re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")
logo = "data:image/svg+xml;base64," + base64.b64encode((root / "assets/logo.svg").read_bytes()).decode()
html = html.replace('href="assets/logo.svg"', f'href="{logo}"').replace('src="assets/logo.svg"', f'src="{logo}"')
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
              lambda m: "<style>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "</style>", html)
html = re.sub(r'<script src="(js/[^"]+)"></script>',
              lambda m: "<script>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "</script>", html)
out = root / "dist" / "kolbatorium.html"
out.parent.mkdir(exist_ok=True)
out.write_text(html, encoding="utf-8")
print(f"Zapisano {out} ({out.stat().st_size // 1024} KB)")
