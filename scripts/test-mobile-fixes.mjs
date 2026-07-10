/* Verifica dei 3 fix mobile: menu hamburger, crop verticale hero, autoplay video. */
import { chromium, devices } from "playwright";

const BASE = "http://localhost:3000";
const SHOTS = "/tmp/mt-mobile";
const results = [];
const ok = (name, cond, extra = "") =>
  results.push(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
const page = await ctx.newPage();

await page.goto(`${BASE}/it`, { waitUntil: "networkidle" });
await page.evaluate(() => localStorage.setItem("cookie-consent", "denied"));
await page.reload({ waitUntil: "networkidle" });

// ── 1. Menu hamburger: pannello visibile e con altezza reale
await page.locator('header button[aria-label="Menu"]').click();
await page.waitForTimeout(400);
const menuBox = await page.locator('nav[aria-label="Menu mobile"]').boundingBox();
ok("menu mobile: pannello con altezza reale", menuBox !== null && menuBox.height > 400, `h=${menuBox?.height}`);
const firstLink = page.locator('nav[aria-label="Menu mobile"] a').first();
ok("menu mobile: primo link visibile", await firstLink.isVisible());
await page.screenshot({ path: `${SHOTS}/fix-01-menu.png` });
await page.locator('header button[aria-label="Menu"]').click();

// ── 2. Hero: su mobile viene servito il crop verticale 9:16
await page.waitForTimeout(300);
const currentSrc = await page.evaluate(() => {
  const img = document.querySelector("section picture img");
  return img ? img.currentSrc : null;
});
ok("hero: crop verticale servito su mobile", !!currentSrc && currentSrc.includes("mobile"), (currentSrc || "").split("url=")[1]?.slice(0, 60) || currentSrc);
await page.screenshot({ path: `${SHOTS}/fix-02-hero.png` });

// ── 3. Slide video: su mobile usa il reel verticale
for (let i = 0; i < 6; i++) await page.locator('section [aria-label]').first().evaluate(() => {});
// vai direttamente all'ultima slide (dot)
await page.locator("section .absolute.bottom-3 button").last().click();
await page.waitForTimeout(900);
const heroVideoSrc = await page.evaluate(() => document.querySelector("section video")?.getAttribute("src"));
ok("hero video: reel verticale su mobile", heroVideoSrc === "/videos/reel-beach.mp4", heroVideoSrc ?? "nessun video");
await page.screenshot({ path: `${SHOTS}/fix-03-hero-video.png` });

// ── 4. Sezione video: anteprime in autoplay
await page.evaluate(() => document.querySelector("#video")?.scrollIntoView());
await page.waitForTimeout(1500);
const playing = await page.evaluate(() => {
  const vids = [...document.querySelectorAll("#video video, section video")].filter((v) =>
    v.src.includes("previews")
  );
  return vids.filter((v) => !v.paused).length + "/" + vids.length;
});
ok("video home: anteprime in autoplay", parseInt(playing) > 0, `${playing} in riproduzione`);
await page.screenshot({ path: `${SHOTS}/fix-04-video-autoplay.png` });

console.log(results.join("\n"));
await browser.close();
