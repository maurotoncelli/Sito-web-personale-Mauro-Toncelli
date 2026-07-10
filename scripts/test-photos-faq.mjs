/* Verifica: gallerie complete, cover moda, FAQ nelle pagine servizio. */
import { chromium, devices } from "playwright";

const BASE = "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();
const out = [];

await page.goto(`${BASE}/it/portfolio?categoria=eventi`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const eventiCount = await page.locator("img[src*='portfolio%2Feventi'], img[src*='portfolio/eventi']").count();
out.push(`portfolio eventi: ${eventiCount} img nel DOM`);

await page.goto(`${BASE}/it/portfolio?categoria=interior`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const interiorCount = await page.locator("img[src*='interior']").count();
out.push(`portfolio interior: ${interiorCount} img nel DOM`);

await page.goto(`${BASE}/it/servizi`, { waitUntil: "networkidle" });
const modaCover = await page.locator("img[src*='DSC7090']").count();
out.push(`cover moda (ragazza in bianco): ${modaCover > 0 ? "OK" : "MANCA"}`);
await page.screenshot({ path: "/tmp/mt-mobile/check-servizi.png" });

await page.goto(`${BASE}/it/servizi/matrimoni`, { waitUntil: "networkidle" });
const faqCount = await page.locator("details").count();
out.push(`FAQ matrimoni: ${faqCount} domande`);
await page.locator("details").first().click();
await page.waitForTimeout(300);
await page.locator("details").first().scrollIntoViewIfNeeded();
await page.screenshot({ path: "/tmp/mt-mobile/check-faq.png" });

console.log(out.join("\n"));
await browser.close();
