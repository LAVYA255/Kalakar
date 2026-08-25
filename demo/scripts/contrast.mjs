/**
 * demo/scripts/contrast.mjs
 *
 * Pixel-accurate contrast audit.
 *
 * WHY NOT JUST axe-core: axe resolves contrast from computed background-color.
 * Over a mesh gradient, a backdrop-filter, or an image it reports "incomplete"
 * rather than a ratio — which on a design-forward site is most of the page.
 * A clean axe run there proves nothing.
 *
 * So: screenshot the real page, read the actual pixels behind each text run,
 * and compute WCAG contrast from the rendered result. Text pixels are taken as
 * the 96th luminance percentile within the element's box and background as the
 * 20th (or inverted for dark-on-light), which tolerates antialiasing.
 *
 * Approximate by nature — treat a fail as "go look at this", not gospel.
 *
 * Run: node demo/scripts/contrast.mjs
 */

import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

const MIME = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };
const server = createServer((req, res) => {
  const rel = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^([/\\])+/, "");
  const f = join(ROOT, rel);
  if (!f.startsWith(ROOT) || !existsSync(f) || statSync(f).isDirectory()) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const URL = `http://127.0.0.1:${server.address().port}/demo/index.html`;

const SELECTORS = [
  ".hero__lede", ".hero__stat dt", ".hero__stat dd", ".eyebrow",
  ".nav__links a", ".sec__lede", ".feature p", ".feature h3",
  ".lab__caption", ".specimen__meta", ".curve__label", ".curve__label b",
  ".phase__name", ".phase__note", ".phase__id", ".score__val",
  ".space-scale figcaption", ".footer__meta", ".runner__name", "p.prose",
];

const browser = await chromium.launch({ channel: "chrome" }).catch(() => chromium.launch());
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await page.goto(URL, { waitUntil: "load" });
await page.waitForTimeout(1200);

// Reveal everything first — measuring an element mid-fade reports a false fail.
await page.evaluate(() => {
  document.querySelectorAll("[data-reveal]").forEach((e) => {
    e.style.setProperty("--reveal-delay", "0ms");
    e.classList.add("is-revealed");
  });
  document.querySelectorAll(".line-mask").forEach((e) => e.classList.add("is-revealed"));
});
await page.waitForTimeout(900);

const results = [];
let fails = 0;

for (const sel of SELECTORS) {
  const nodes = await page.$$(sel);
  if (!nodes.length) continue;

  // First on-screen instance of each selector
  let handled = false;
  for (const node of nodes) {
    if (handled) break;
    const box = await node.boundingBox();
    if (!box || box.width < 8 || box.height < 6) continue;

    await node.scrollIntoViewIfNeeded();
    await page.waitForTimeout(450);

    // Tight glyph bounds, not the element box. A wide grid cell containing one
    // short label is >95% background, and any percentile you pick lands on the
    // background for BOTH samples — which is how you get a bogus 1.2:1.
    const rect = await node.evaluate((el) => {
      const r = document.createRange();
      r.selectNodeContents(el);
      const rects = [...r.getClientRects()].filter((x) => x.width > 4 && x.height > 4);
      if (!rects.length) return null;
      const first = rects[0];
      return { x: first.x, y: first.y, width: first.width, height: first.height };
    });
    if (!rect || rect.y < 0 || rect.y + rect.height > 900 || rect.x < 0) continue;

    const shot = await page.screenshot({
      clip: {
        x: Math.max(0, rect.x), y: Math.max(0, rect.y),
        width: Math.max(4, Math.min(rect.width, 1440 - rect.x)),
        height: Math.max(4, rect.height),
      },
    });
    const b64 = shot.toString("base64");

    const stat = await page.evaluate(async (d) => {
      const img = new Image();
      img.src = "data:image/png;base64," + d;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const { data } = ctx.getImageData(0, 0, c.width, c.height);
      const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      const lums = [];
      for (let i = 0; i < data.length; i += 4) {
        lums.push(0.2126 * f(data[i]) + 0.7152 * f(data[i + 1]) + 0.0722 * f(data[i + 2]));
      }
      lums.sort((a, z) => a - z);
      const pct = (p) => lums[Math.min(lums.length - 1, Math.max(0, Math.floor(lums.length * p)))];
      // Background is the median: text is always the minority of pixels.
      // Text is whichever extreme sits further from it — works for
      // light-on-dark and dark-on-light without knowing which it is.
      const bg = pct(0.5);
      const lo = pct(0.02), hi = pct(0.98);
      const text = Math.abs(hi - bg) >= Math.abs(bg - lo) ? hi : lo;
      return { bg, text };
    }, b64);

    const L1 = Math.max(stat.bg, stat.text);
    const L2 = Math.min(stat.bg, stat.text);
    const ratio = (L1 + 0.05) / (L2 + 0.05);
    const cs = await node.evaluate((el) => {
      const s = getComputedStyle(el);
      return { size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight, 10) };
    });
    const large = cs.size >= 24 || (cs.size >= 18.66 && cs.weight >= 700);
    const min = large ? 3 : 4.5;
    const ok = ratio >= min;
    if (!ok) fails++;
    results.push({ sel, size: cs.size, ratio: +ratio.toFixed(2), min, ok });
    handled = true;
  }
}

console.log("\nselector".padEnd(28) + "px".padEnd(7) + "ratio".padEnd(8) + "need   result");
console.log("-".repeat(60));
for (const r of results) {
  console.log(
    r.sel.padEnd(28) +
    String(r.size).padEnd(7) +
    String(r.ratio).padEnd(8) +
    String(r.min).padEnd(7) +
    (r.ok ? "ok" : "LOW")
  );
}
console.log(`\n${results.length} measured, ${fails} below threshold\n`);

await browser.close();
server.close();
process.exit(fails ? 1 : 0);
