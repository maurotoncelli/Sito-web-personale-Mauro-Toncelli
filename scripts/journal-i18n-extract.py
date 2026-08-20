#!/usr/bin/env python3
"""Estrae i nodi di testo dagli articoli journal per la traduzione.

Output: src/data/journal-i18n/segments.json
  { slug: { "title": str, "excerpt": str, "template": html con @@n@@, "segments": [str] } }
"""
import html as htmllib
import json
import os
import re

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CMS = os.path.join(BASE, "src", "data", "journal-cms.json")
LEGACY = os.path.join(BASE, "src", "data", "journal.json")
SRC = CMS if os.path.exists(CMS) else LEGACY
OUT_DIR = os.path.join(BASE, "src", "data", "journal-i18n")
os.makedirs(OUT_DIR, exist_ok=True)

posts = json.load(open(SRC))
result = {}

for p in posts:
    content = p["content"]
    segments = []

    def repl(m):
        text = m.group(0)
        # solo testo con almeno una lettera (salta spazi, numeri, punteggiatura)
        if not re.search(r"[A-Za-zÀ-ÿ]", text):
            return text
        segments.append(htmllib.unescape(text))
        return f"@@{len(segments) - 1}@@"

    # testo tra i tag (non dentro attributi)
    template = re.sub(r"(?<=>)[^<>]+(?=<)", repl, content)

    result[p["slug"]] = {
        "title": p["title"],
        "excerpt": p["excerpt"],
        "template": template,
        "segments": segments,
    }
    print(f"{p['slug'][:45]:45s} segmenti: {len(segments):3d}  parole: {sum(len(s.split()) for s in segments)}")

with open(os.path.join(OUT_DIR, "segments.json"), "w") as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
print("\nScritto src/data/journal-i18n/segments.json")
