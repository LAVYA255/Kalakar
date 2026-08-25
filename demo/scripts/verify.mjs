/**
 * demo/scripts/verify.mjs
 *
 * Runs the automated craft checks from references/qa-rubric.md section 5
 * against the demo, and captures screenshots at every breakpoint.
 *
 * Run: node demo/scripts/verify.mjs
 */

import { chromium } from "playwright";
import { mkdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { dirname, join, resolve, extname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const DEMO = join(HERE, "..");
const ROOT = join(DEMO, "..");
const SHOTS = join(DEMO, "screenshots");
mkdirSync(SHOTS, { recursive: true });

/* Serve over HTTP, not file://. Browsers block external ES module fetches on
   file:// as cross-origin, so index.html would silently run without any of
   its JavaScript — and every motion check would "pass" for the wrong reason.
   (demo/standalone.html exists for the double-click case; see build.mjs.) */
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png",
  ".json": "application/json",
};
const server = createServer((req, res) => {
  const rel = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^([/\\])+/, "");
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;
const URL = `http://127.0.0.1:${PORT}/demo/index.html`;
console.log(`serving ${ROOT} at ${URL}`);

const WIDTHS = [320, 375, 768, 1024, 1440, 2560];

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "  PASS" : "  FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
};

let browser;
try {
  browser = await chromium.launch();
} catch {
  console.log("bundled chromium unavailable, using installed Chrome");
  browser = await chromium.launch({ channel: "chrome" });
}

/* ---------------------------------------------------------------- console */
console.log("\n[1] console errors");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  // font CDN may be unreachable offline; that is an environment fact, not a
  // defect in the page — report it separately rather than failing the check.
  const real = errors.filter((e) => !/fonts\.(googleapis|gstatic)/.test(e));
  check("no console errors", real.length === 0, real.slice(0, 3).join(" | "));
  if (errors.length !== real.length) console.log("        (font CDN unreachable — offline environment)");
  await ctx.close();
}

/* ------------------------------------------------------- horizontal scroll */
console.log("\n[2] no horizontal overflow");
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check(`${width}px`, over <= 0, over > 0 ? `${over}px overflow` : "");
  await ctx.close();
}

/* ------------------------------------------------------------ meta / craft */
console.log("\n[3] meta, assets, semantics");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const title = await page.title();
  check("title is real", !!title && !/vite|create next app|document|untitled/i.test(title), title);
  check("meta description", (await page.locator('meta[name="description"]').count()) === 1);
  check("og:image", (await page.locator('meta[property="og:image"]').count()) === 1);
  check("favicon", (await page.locator('link[rel~="icon"]').count()) > 0);
  check("html lang", (await page.getAttribute("html", "lang")) === "en");
  check("skip link", (await page.locator("a.skip-link").count()) === 1);
  check("single h1", (await page.locator("h1").count()) === 1);
  check("filter defs inlined", (await page.locator("#kalakar-lens").count()) === 1);

  const noAlt = await page.$$eval("img", (els) => els.filter((e) => !e.hasAttribute("alt")).length);
  check("every img has alt", noAlt === 0, noAlt ? `${noAlt} missing` : "");

  const bodyText = await page.textContent("body");
  check("no Lorem ipsum", !/lorem ipsum/i.test(bodyText));

  // heading order — an h3 must not follow an h1 without an h2 between
  const order = await page.$$eval("h1,h2,h3,h4", (els) => els.map((e) => +e.tagName[1]));
  let jump = null;
  for (let i = 1; i < order.length; i++) {
    if (order[i] - order[i - 1] > 1) { jump = `h${order[i - 1]} -> h${order[i]}`; break; }
  }
  check("heading order", !jump, jump || "");

  await ctx.close();
}

/* ------------------------------------------------------------ glass tiers */
console.log("\n[4] material");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(800);

  const refraction = await page.evaluate(() =>
    document.documentElement.classList.contains("has-refraction")
  );
  console.log(`  INFO  Tier 2 refraction active: ${refraction} (Chromium: expected true)`);

  const bf = await page.evaluate(() =>
    getComputedStyle(document.querySelector(".hero__panel")).backdropFilter
  );
  check("glass panel has a backdrop-filter", !!bf && bf !== "none", bf?.slice(0, 60));
  check("backdrop-filter includes saturate", /saturate/.test(bf || ""));

  const rim = await page.evaluate(() =>
    getComputedStyle(document.querySelector(".hero__panel"), "::before").maskComposite ||
    getComputedStyle(document.querySelector(".hero__panel"), "::before").webkitMaskComposite
  );
  check("gradient rim is masked to a ring", !!rim && rim !== "add", rim);

  await ctx.close();
}

/* -------------------------------------------------------------- motion QA */
console.log("\n[5] motion");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(1200);

  // Only assert for elements genuinely inside the viewport — a reveal below
  // the fold SHOULD still be waiting.
  const inView = await page.evaluate(() =>
    [...document.querySelectorAll(".hero [data-reveal]")]
      .filter((e) => e.getBoundingClientRect().bottom < innerHeight * 0.85)
      .map((e) => ({ cls: e.className, ok: e.classList.contains("is-revealed") }))
  );
  check(
    "in-view reveals fired",
    inView.length > 0 && inView.every((e) => e.ok),
    inView.filter((e) => !e.ok).map((e) => e.cls).join(", ")
  );

  // The hero CTA below the fold at the most common desktop size is a real
  // composition defect, so assert against it rather than hoping.
  const ctaBottom = await page.evaluate(
    () => document.querySelector(".hero__actions").getBoundingClientRect().bottom
  );
  check("hero CTA above the fold at 1440x900", ctaBottom < 900, `bottom ${Math.round(ctaBottom)}px`);

  const split = await page.locator(".hero__title .line-mask").count();
  check("headline split into masked lines", split > 0, `${split} lines`);

  // scroll the whole page and confirm nothing is left stuck invisible
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    scrollTo(0, document.body.scrollHeight);
  });
  // Wait past the worst-case reveal: max stagger (800ms) + duration (640ms).
  // Anything still transparent after that is genuinely stuck, not in flight.
  await page.waitForTimeout(2600);
  const stuck = await page.$$eval("[data-reveal]", (els) =>
    els
      .filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9)
      .map((e) => e.className.split(" ")[0])
  );
  check("no reveal left stuck invisible after full scroll", stuck.length === 0, stuck.join(", "));

  await ctx.close();
}

/* ----------------------------------------------------------- reduced motion */
console.log("\n[6] prefers-reduced-motion");
{
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const hidden = await page.$$eval("[data-reveal]", (els) =>
    els.filter((e) => parseFloat(getComputedStyle(e).opacity) < 0.9).length
  );
  check("page fully visible under reduced motion", hidden === 0, hidden ? `${hidden} invisible` : "");

  const cursorShown = await page.evaluate(
    () => getComputedStyle(document.getElementById("cursor-dot")).display !== "none"
  );
  check("custom cursor disabled under reduced motion", !cursorShown);

  await page.screenshot({ path: join(SHOTS, "reduced-motion.png"), fullPage: false });
  await ctx.close();
}

/* --------------------------------------------------- reduced transparency */
console.log("\n[7] prefers-reduced-transparency");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.emulateMedia({ reducedTransparency: "reduce" }).catch(() => {});
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(700);
  const bf = await page.evaluate(
    () => getComputedStyle(document.querySelector(".hero__panel")).backdropFilter
  );
  // Playwright may not expose this media feature; report rather than fail.
  console.log(`  INFO  backdrop-filter under reduced transparency: ${bf}`);
  await ctx.close();
}

/* --------------------------------------------------------------- keyboard */
console.log("\n[8] keyboard");
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(700);

  const seen = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    seen.push(await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      return {
        tag: el.tagName.toLowerCase(),
        outline: s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0,
      };
    }));
  }
  const focusable = seen.filter(Boolean);
  check("focusable elements reachable by Tab", focusable.length >= 6, `${focusable.length} stops`);
  check("every focus stop shows a visible ring", focusable.every((f) => f.outline));

  await ctx.close();
}

/* ------------------------------------------------------------ screenshots */
console.log("\n[9] screenshots");
for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: Math.round(width * 0.62) + 400 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(2400); // let count-ups settle before capture
  await page.screenshot({ path: join(SHOTS, `hero-${width}.png`) });
  console.log(`  saved screenshots/hero-${width}.png`);
  await ctx.close();
}
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "load" });
  await page.waitForTimeout(800);
  for (const [name, sel] of [
    ["material", "#material"],
    ["type", "#type"],
    ["motion", "#motion"],
    ["process", "#process"],
  ]) {
    await page.locator(sel).scrollIntoViewIfNeeded();
    await page.waitForTimeout(1300);
    await page.screenshot({ path: join(SHOTS, `${name}.png`) });
    console.log(`  saved screenshots/${name}.png`);
  }
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(SHOTS, "footer.png") });
  console.log("  saved screenshots/footer.png");
  await ctx.close();
}

/* --------------------------------------------- standalone.html on file:// */
console.log("\n[10] standalone.html opens directly from disk");
{
  const { pathToFileURL } = await import("node:url");
  const sa = resolve(DEMO, "standalone.html");
  if (!existsSync(sa)) {
    check("standalone.html exists", false, "run scripts/build.mjs");
  } else {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(pathToFileURL(sa).href, { waitUntil: "load" });
    await page.waitForTimeout(1600);
    check("no page errors from file://", errors.length === 0, errors[0] || "");
    check("kit JS ran", await page.evaluate(() => document.documentElement.classList.contains("js")));
    check("headline split", (await page.locator(".hero__title .line-mask").count()) > 0);
    await ctx.close();
  }
}

await browser.close();
server.close();

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : failures + " CHECK(S) FAILED"}\n`);
process.exit(failures === 0 ? 0 : 1);
