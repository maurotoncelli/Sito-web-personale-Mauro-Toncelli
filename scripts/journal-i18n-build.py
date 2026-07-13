#!/usr/bin/env python3
"""Ricompone gli articoli tradotti del journal.

Input:
  src/data/journal-i18n/segments.json          (da journal-i18n-extract.py)
  src/data/journal-i18n/map-<lang>.json        {"titles": {slug: str}, "segments": {originale: traduzione}}
Output:
  src/data/journal-i18n/<lang>.json            {slug: {title, excerpt, content}}
"""
import html as htmllib
import json
import os
import re
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIR = os.path.join(BASE, "src", "data", "journal-i18n")
LANGS = ["en", "de", "fr", "es"]

segments = json.load(open(os.path.join(DIR, "segments.json")))

def make_excerpt(text_segments, max_words=32):
    words = []
    for s in text_segments:
        words += s.split()
        if len(words) >= max_words:
            break
    if len(words) <= max_words:
        return " ".join(words)
    return " ".join(words[:max_words]) + " […]"

exit_code = 0
for lang in LANGS:
    map_path = os.path.join(DIR, f"map-{lang}.json")
    if not os.path.exists(map_path):
        print(f"[{lang}] map-{lang}.json mancante, salto")
        continue
    mapping = json.load(open(map_path))
    titles = mapping["titles"]
    seg_map = mapping["segments"]

    out = {}
    missing = set()
    for slug, data in segments.items():
        translated = []
        for seg in data["segments"]:
            key = seg.strip()
            t = seg_map.get(key)
            if t is None:
                # segmento non tradotto: resta in originale (nomi, didascalie, url)
                if len(key.split()) > 4 and re.search(r"[a-zà-ù]{4}", key, re.I):
                    missing.add(key[:60])
                t = key
            # ripristina gli spazi originali attorno al testo
            lead = seg[: len(seg) - len(seg.lstrip())]
            trail = seg[len(seg.rstrip()):]
            translated.append(lead + t + trail)

        content = data["template"]
        for i, t in enumerate(translated):
            content = content.replace(f"@@{i}@@", htmllib.escape(t, quote=False))

        if "@@" in re.sub(r"@@\d+@@", "", content) is None:
            pass
        leftover = re.findall(r"@@\d+@@", content)
        if leftover:
            print(f"[{lang}] {slug}: placeholder non risolti: {leftover}")
            exit_code = 1

        text_only = [t.strip() for t in translated if t.strip() and not t.strip().startswith("http")]
        out[slug] = {
            "title": titles.get(slug, data["title"]),
            "excerpt": make_excerpt(text_only),
            "content": content,
        }

    with open(os.path.join(DIR, f"{lang}.json"), "w") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print(f"[{lang}] scritti {len(out)} articoli" + (f" — {len(missing)} segmenti NON tradotti" if missing else ""))
    for m in sorted(missing):
        print(f"   manca: {m}")
        exit_code = 1

sys.exit(exit_code)
