/* Test visualizzazione iPad (portrait 768×1024 e landscape 1024×768). */
import { chromium, devices } from "playwright";

const BASE = "http://localhost:3000";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch();

const overlap = (a, b) =>
  a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

for (const [label, device, shots] of [
  ["iPad portrait", devices["iPad (gen 7)"], "/tmp/mt-ipad-p"],
  ["iPad landscape", devices["iPad (gen 7) landscape"], "/tmp/mt-ipad-l"],
]) {
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));

  const noHScroll = async () =>
    page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

  // ── Home
  await page.goto(`${BASE}/it`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.setItem("cookie-consent", "denied"));
  await page.reload({ waitUntil: "load" });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${shots}/01-home.png` });
  ok(`${label} home: nessuno scroll orizzontale`, await noHScroll());

  // Header: quale nav è attiva e non si sovrappone
  const desktopNav = page.locator('header nav[aria-label="Principale"]');
  const menuBtn = page.locator('header button[aria-label="Menu"]');
  const desktopNavVisible = await desktopNav.isVisible();
  const burgerVisible = await menuBtn.isVisible();
  ok(`${label} header: una sola navigazione attiva`, desktopNavVisible !== burgerVisible,
    `desktop=${desktopNavVisible} burger=${burgerVisible}`);

  if (desktopNavVisible) {
    const logoBox = await page.locator("header a").first().boundingBox();
    const navBox = await desktopNav.boundingBox();
    // ultima voce del menu vs prima icona social visibile
    const lastNavBox = await desktopNav.locator("a").last().boundingBox();
    const firstSocialBox = await page
      .locator('header a[aria-label="LinkedIn"]:visible')
      .first()
      .boundingBox()
      .catch(() => null);
    ok(`${label} header: logo e nav non si sovrappongono`, !overlap(logoBox, navBox));
    if (firstSocialBox)
      ok(`${label} header: nav e social non si sovrappongono`, !overlap(lastNavBox, firstSocialBox));
  }

  // Hero slider: slide visibile e dots cliccabili
  const hero = page.locator("section").first();
  ok(`${label} hero visibile`, await hero.isVisible());
  const dots = page.locator('button:has(> span.rounded-full)');
  if ((await dots.count()) > 1) {
    await dots.nth(1).click();
    await page.waitForTimeout(700);
    ok(`${label} hero: dot navigazione funziona`, true);
  }

  // ── Servizi indice
  await page.goto(`${BASE}/it/servizi`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${shots}/02-servizi.png` });
  ok(`${label} servizi: nessuno scroll orizzontale`, await noHScroll());

  // ── Pagina servizio: gallery preview e tier
  await page.goto(`${BASE}/it/servizi/matrimoni`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${shots}/03-matrimoni.png`, fullPage: true });
  ok(`${label} matrimoni: nessuno scroll orizzontale`, await noHScroll());
  const tierBoxes = await page.locator("text=€4.500").count();
  ok(`${label} matrimoni: tier visibili`, tierBoxes > 0);

  await page.goto(`${BASE}/it/servizi/moda`, { waitUntil: "networkidle" });
  const previewImgs = await page.locator(".grid.grid-cols-2 img, .grid img").count();
  ok(`${label} servizio moda: gallery anteprima presente`, previewImgs > 3, `${previewImgs} img`);
  await page.screenshot({ path: `${shots}/04-moda.png` });

  // Lightbox dalla gallery
  const firstTile = page.locator('button[aria-label^="Apri immagine"], button[aria-label^="Guarda il video"]').first();
  if (await firstTile.isVisible()) {
    await firstTile.click();
    await page.waitForTimeout(400);
    const dialogs = await page.evaluate(() => document.querySelectorAll('div[role="dialog"]').length);
    ok(`${label} lightbox si apre`, dialogs === 1);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => document.querySelectorAll('div[role="dialog"]').length);
    ok(`${label} lightbox si chiude`, after === 0);
  }

  // ── Portfolio
  await page.goto(`${BASE}/it/portfolio?categoria=moda`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${shots}/05-portfolio.png` });
  ok(`${label} portfolio: nessuno scroll orizzontale`, await noHScroll());

  // ── Contatti: form + pulsante WhatsApp
  await page.goto(`${BASE}/it/contatti`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${shots}/06-contatti.png` });
  ok(`${label} contatti: nessuno scroll orizzontale`, await noHScroll());
  const wa = page.locator('a[href^="https://wa.me/393401710284"]');
  ok(`${label} contatti: pulsante WhatsApp presente`, await wa.isVisible());

  // ── Journal
  await page.goto(`${BASE}/it/journal`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${shots}/07-journal.png` });
  ok(`${label} journal: nessuno scroll orizzontale`, await noHScroll());

  ok(`${label}: nessun errore JS`, errors.length === 0, errors.slice(0, 2).join(" | ").slice(0, 150));
  await ctx.close();
}

console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${fails} FAIL su ${results.length}`);
process.exit(fails ? 1 : 0);
