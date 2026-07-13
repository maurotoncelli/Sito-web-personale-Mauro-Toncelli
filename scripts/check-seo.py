#!/usr/bin/env python3
"""Check SEO delle pagine: title, description, canonical, hreflang, OG, JSON-LD, H1."""
import re
import sys
import urllib.request

BASE = "http://localhost:3000"
LOCALES = ["it", "en", "de", "fr", "es"]
PATHS = [
    "",
    "/portfolio",
    "/servizi",
    "/servizi/moda",
    "/servizi/e-commerce-prodotto",
    "/servizi/architettura-interni",
    "/servizi/corporate-brand",
    "/servizi/matrimoni",
    "/servizi/eventi",
    "/servizi/drone",
    "/servizi/drone/ispezioni",
    "/servizi/drone/sal-cantiere",
    "/servizi/drone/rilievi",
    "/servizi/drone/perizie",
    "/about",
    "/contatti",
    "/journal",
    "/journal/alessandro-pasquinucci",
]

def get(url):
    with urllib.request.urlopen(url, timeout=30) as r:
        return r.read().decode()

issues = []
seen_titles = {}

def check(locale, path):
    url = f"{BASE}/{locale}{path}"
    try:
        html = get(url)
    except Exception as e:
        issues.append(f"{locale}{path}: NON RAGGIUNGIBILE ({e})")
        return

    where = f"/{locale}{path or '/'}"

    m = re.search(r"<title>([^<]*)</title>", html)
    title = m.group(1).strip() if m else ""
    if not title:
        issues.append(f"{where}: <title> mancante")
    elif len(title) > 65:
        issues.append(f"{where}: title lungo ({len(title)}): {title[:60]}…")
    key = (locale, title)
    if title and key in seen_titles:
        issues.append(f"{where}: title duplicato con {seen_titles[key]}: \"{title}\"")
    seen_titles[key] = where

    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    desc = m.group(1) if m else ""
    if not desc:
        issues.append(f"{where}: meta description mancante")
    elif len(desc) > 165:
        issues.append(f"{where}: description lunga ({len(desc)})")

    m = re.search(r'<link rel="canonical" href="([^"]*)"', html)
    if not m:
        issues.append(f"{where}: canonical mancante")
    elif f"/{locale}{path}" not in m.group(1):
        issues.append(f"{where}: canonical errato: {m.group(1)}")

    hreflangs = re.findall(r'<link rel="alternate" hreflang="([^"]*)"', html, re.I)
    missing = [l for l in LOCALES if l not in hreflangs]
    if missing:
        issues.append(f"{where}: hreflang mancanti: {missing} (trovati: {hreflangs})")
    if "x-default" not in hreflangs:
        issues.append(f"{where}: hreflang x-default mancante")

    if 'property="og:title"' not in html:
        issues.append(f"{where}: og:title mancante")
    if 'property="og:image"' not in html and path == "":
        issues.append(f"{where}: og:image mancante in home")

    h1s = re.findall(r"<h1[\s>]", html)
    if len(h1s) != 1:
        issues.append(f"{where}: {len(h1s)} tag H1 (atteso 1)")

    if f'lang="{locale}"' not in html:
        issues.append(f"{where}: attributo lang errato")

    if path.startswith("/servizi/") and "application/ld+json" not in html:
        issues.append(f"{where}: JSON-LD Service mancante")

# tutte le pagine per locale it, home+servizio per le altre lingue
for path in PATHS:
    check("it", path)
for locale in ["en", "de", "fr", "es"]:
    for path in ["", "/servizi/moda", "/journal"]:
        check(locale, path)

# sitemap e robots
try:
    sm = get(f"{BASE}/sitemap.xml")
    n_urls = sm.count("<url>")
    print(f"sitemap.xml: {n_urls} URL")
    if "/proof" in sm:
        issues.append("sitemap: contiene pagine /proof (devono restare fuori)")
    for l in LOCALES:
        if f"/{l}</loc>" not in sm and f"/{l}/" not in sm:
            issues.append(f"sitemap: manca la lingua {l}")
except Exception as e:
    issues.append(f"sitemap.xml non raggiungibile: {e}")

try:
    rb = get(f"{BASE}/robots.txt")
    if "sitemap" not in rb.lower():
        issues.append("robots.txt: manca riferimento sitemap")
    if "proof" not in rb:
        issues.append("robots.txt: manca disallow /proof")
except Exception as e:
    issues.append(f"robots.txt non raggiungibile: {e}")

print(f"\nPagine controllate: {len(PATHS) + 4 * 3}")
if issues:
    print(f"\n⚠ {len(issues)} problemi:\n")
    for i in issues:
        print(" -", i)
    sys.exit(1)
print("\n✓ Nessun problema SEO rilevato")
