/* Verifica i due fix segnalati:
   1. il menu hamburger si chiude anche toccando la voce della pagina corrente;
   2. l'iris loader copre la pagina fin dal primo paint (niente flash
      pagina → animazione → pagina) e non riappare nella stessa sessione. */
import { chromium, webkit, devices } from "playwright";

const BASE = "http://localhost:3000";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const targets = [
  ["Chrome Android", chromium, devices["Pixel 7"]],
  ["iPhone Safari", webkit, devices["iPhone 14"]],
  ["iPad portrait", chromium, devices["iPad (gen 7)"]],
  ["Desktop 1440", chromium, { viewport: { width: 1440, height: 900 } }],
];

for (const [label, engine, device] of targets) {
  const browser = await engine.launch();
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();

  // ── 2. Iris — la garanzia "niente flash" sta nell'HTML del server: l'overlay
  // è nel markup prima del contenuto, quindi al primo paint la pagina nasce
  // già coperta. Qui verifichiamo lo stato del DOM appena parsato e a fine corsa.

  // Snapshot del loader al momento in cui il DOM è disponibile, prima
  // di qualsiasi hydration React (init script = gira a document_start).
  await page.addInitScript(() => {
    document.addEventListener("DOMContentLoaded", () => {
      const el = document.querySelector(".iris-loader");
      const cs = el && getComputedStyle(el);
      window.__irisAtDCL = {
        present: !!el,
        visible: !!cs && cs.display !== "none" && cs.visibility !== "hidden",
        irisOff: document.documentElement.getAttribute("data-iris") === "off",
      };
    });
  });

  await page.goto(`${BASE}/it`, { waitUntil: "domcontentloaded" });
  const first = await page.evaluate(() => window.__irisAtDCL);
  ok(`${label} iris: overlay presente e visibile al primo parse`,
    first?.present && first?.visible, JSON.stringify(first));
  ok(`${label} iris: prima visita non marcata off`, !first?.irisOff);

  // dopo l'animazione (1.2s apertura + 0.4s fade) l'overlay sparisce
  await page.waitForLoadState("load");
  await page.waitForTimeout(2200);
  const gone = await page.evaluate(() => {
    const el = document.querySelector(".iris-loader");
    if (!el) return true;
    const cs = getComputedStyle(el);
    return cs.visibility === "hidden" || Number(cs.opacity) === 0 || cs.display === "none";
  });
  ok(`${label} iris: overlay sparisce dopo l'animazione`, gone);

  // seconda pagina nella stessa sessione: lo script inline marca <html
  // data-iris="off"> e il CSS spegne il loader prima che sia visibile
  await page.goto(`${BASE}/it/about`, { waitUntil: "domcontentloaded" });
  const second = await page.evaluate(() => window.__irisAtDCL);
  ok(`${label} iris: non riappare nella stessa sessione`,
    second?.irisOff && !second?.visible, JSON.stringify(second));

  // ── 1. Hamburger (solo dove esiste: sotto lg / 1024px)
  const isMobile = (device.viewport?.width ?? 1440) < 1024;
  if (isMobile) {
    await page.goto(`${BASE}/it/portfolio`, { waitUntil: "networkidle" });
    const burger = page.locator('header button[aria-label="Menu"]');
    await burger.click();
    await page.waitForTimeout(300);
    const menu = page.locator('nav[aria-label="Menu mobile"]');
    ok(`${label} menu: si apre`, await menu.isVisible());

    // tocco la voce della pagina CORRENTE (Portfolio): l'URL non cambia
    await menu.locator('a[href="/it/portfolio"]').click();
    await page.waitForTimeout(400);
    ok(`${label} menu: si chiude toccando la pagina corrente`, !(await menu.isVisible()));

    // e ovviamente si chiude anche navigando verso un'altra pagina
    await burger.click();
    await page.waitForTimeout(300);
    await menu.locator('a[href="/it/contatti"]').click();
    await page.waitForURL("**/it/contatti");
    await page.waitForTimeout(400);
    ok(`${label} menu: si chiude navigando altrove`, !(await menu.isVisible()));
  }

  await ctx.close();
  await browser.close();
}

console.log(results.join("\n"));
const fails = results.filter((r) => r.startsWith("FAIL")).length;
console.log(`\n${fails} FAIL su ${results.length}`);
process.exit(fails ? 1 : 0);
