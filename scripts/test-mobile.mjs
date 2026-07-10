/* Test mobile end-to-end (iPhone 13) contro il server di produzione locale. */
import { chromium, devices } from "playwright";

const BASE = "http://localhost:3000";
const SHOTS = "/tmp/mt-mobile";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => m.type() === "error" && errors.push(`console: ${m.text()}`));

const noHScroll = async () =>
  page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

// ── Home
await page.goto(`${BASE}/it`, { waitUntil: "networkidle" });
await page.screenshot({ path: `${SHOTS}/01-home-banner.png` });

// Cookie banner
const banner = page.locator('[aria-label="Cookie e privacy"]');
ok("cookie banner visibile al primo accesso", await banner.isVisible());
await page.getByRole("button", { name: "Gestisci impostazioni" }).click();
await page.screenshot({ path: `${SHOTS}/02-cookie-manage.png` });
ok("pannello gestisci: toggle statistiche", await page.locator('input[aria-label="Statistiche"]').isVisible());
await page.getByRole("button", { name: "Salva preferenze" }).click();
ok("banner si chiude dopo salvataggio", !(await banner.isVisible()));
ok("consenso persistito", (await page.evaluate(() => localStorage.getItem("cookie-consent"))) === "granted");

// Hero slider
await page.waitForTimeout(600);
ok("hero slider presente", await page.locator("section").first().isVisible());
await page.screenshot({ path: `${SHOTS}/03-home.png` });
ok("home: nessuno scroll orizzontale", await noHScroll());

// Footer: riapertura preferenze cookie
await page.getByRole("button", { name: "Preferenze cookie" }).click();
ok("preferenze cookie riapribili dal footer", await banner.isVisible());
await page.getByRole("button", { name: "Salva preferenze" }).click();

// ── Menu mobile e navigazione
const menuBtn = page.locator('header button[aria-label="Menu"]');
await menuBtn.click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${SHOTS}/04-menu.png` });
const serviziLink = page.getByRole("link", { name: "Servizi", exact: true }).first();
ok("menu mobile: link Servizi visibile", await serviziLink.isVisible());
await serviziLink.click();
await page.waitForURL("**/it/servizi");
ok("navigazione a /it/servizi", page.url().endsWith("/it/servizi"));
await page.screenshot({ path: `${SHOTS}/05-servizi.png` });
ok("servizi: nessuno scroll orizzontale", await noHScroll());

// ── Pagina servizio con tier
await page.goto(`${BASE}/it/servizi/matrimoni`, { waitUntil: "networkidle" });
ok("matrimoni: 4 tier visibili", (await page.locator("text=€4.500").count()) > 0);
await page.screenshot({ path: `${SHOTS}/06-matrimoni.png`, fullPage: false });
ok("matrimoni: nessuno scroll orizzontale", await noHScroll());

// ── Portfolio con filtro
await page.goto(`${BASE}/it/portfolio?categoria=moda`, { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const imgs = await page.locator("img").count();
ok("portfolio moda: immagini presenti", imgs > 3, `${imgs} img`);
await page.screenshot({ path: `${SHOTS}/07-portfolio.png` });
ok("portfolio: nessuno scroll orizzontale", await noHScroll());

// ── Drone
await page.goto(`${BASE}/it/servizi/drone/ispezioni`, { waitUntil: "networkidle" });
ok("drone ispezioni: prezzo visibile", await page.locator("text=€200").first().isVisible());
await page.screenshot({ path: `${SHOTS}/08-drone.png` });

// ── Contatti + form
await page.goto(`${BASE}/it/contatti`, { waitUntil: "networkidle" });
ok("contatti: form presente", await page.locator("form").first().isVisible());
await page.screenshot({ path: `${SHOTS}/09-contatti.png` });
ok("contatti: nessuno scroll orizzontale", await noHScroll());

// ── Dark mode
await page.goto(`${BASE}/it`, { waitUntil: "networkidle" });
const themeBtn = page
  .locator('header button[aria-label^="Attiva tema"]')
  .filter({ visible: true })
  .first();
const before = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
await themeBtn.click();
await page.waitForTimeout(400);
const after = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
ok("dark mode toggle funziona", before !== after, `${before} → ${after}`);
await page.screenshot({ path: `${SHOTS}/10-dark.png` });

// ── Lingua EN
await page.goto(`${BASE}/en/servizi/matrimoni`, { waitUntil: "networkidle" });
ok("EN: tier tradotti", await page.locator("text=Full day, team of 4").first().isVisible());

console.log(results.join("\n"));
console.log(`\nJS errors: ${errors.length}`);
errors.slice(0, 5).forEach((e) => console.log("  ", e.slice(0, 150)));
await browser.close();
