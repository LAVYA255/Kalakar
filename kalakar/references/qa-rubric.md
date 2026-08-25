# QA Rubric — Scoring, Self-Critique, and the 90% Confidence Gate

The hardest problem in building design-forward work is not producing it — it is **knowing whether what you produced is any good.** Without a measurable standard, "make it look better" is an infinite loop and "it's done" is a guess.

This file is the standard. Score honestly, fix the lowest category, re-score. **Do not declare a build finished below 90/100.**

---

## 1. The 100-point rubric

Ten categories, ten points each. Score each 0–10 against the criteria. **Score what is on screen, not what you intended.**

| # | Category | Weight |
|---|---|---|
| 1 | Typography | 10 |
| 2 | Layout & proportion | 10 |
| 3 | Color & material | 10 |
| 4 | Motion | 10 |
| 5 | Signature moment | 10 |
| 6 | Content & copy | 10 |
| 7 | Responsiveness | 10 |
| 8 | Performance | 10 |
| 9 | Accessibility | 10 |
| 10 | Craft & finish | 10 |

### 1. Typography (10)

| Pts | Standard |
|---|---|
| 0–3 | Default system font or one unstyled webfont. No scale. Everything 16px-ish. |
| 4–6 | A real typeface, a scale exists, but display type is untracked, line-heights are uniform, measure is unbounded. |
| 7–8 | Modular scale, negative tracking on display, line-height inverse to size, measure 45–75ch, two families max. |
| 9–10 | All of the above, plus fluid `clamp()` type, deliberate hierarchy with at least a 4x contrast between display and body, optical alignment fixes, no widows/orphans in headlines. |

**Auto-fail to 6 or below:** display type over 60px with `letter-spacing: normal`, or body copy wider than 90ch.

### 2. Layout & proportion (10)

| Pts | Standard |
|---|---|
| 0–3 | Everything centered in one column. Uniform padding. Three equal cards. |
| 4–6 | A grid exists but is used symmetrically throughout. Spacing is inconsistent (values off the scale). |
| 7–8 | Consistent spacing scale, clear proximity grouping, generous section rhythm (96px+), at least one asymmetric composition. |
| 9–10 | Deliberate use of the full grid — full-bleed, offset, overlap, subgrid. Ratios chosen from the canon. Whitespace used as a compositional element, not leftover space. The eye has a clear path. |

**Auto-fail to 5:** every section is a centered `max-width` container with the same padding.

### 3. Color & material (10)

| Pts | Standard |
|---|---|
| 0–3 | Default framework palette. Pure `#000`/`#fff`. Untinted grays. Multiple competing accents. |
| 4–6 | A chosen palette, but built in sRGB with an uneven ramp; contrast unverified. |
| 7–8 | OKLCH ramp, tinted neutrals, one accent, verified contrast, layered shadows with a consistent light source. |
| 9–10 | A material point of view — glass, grain, riso, metal, clay, or deliberate flatness — applied consistently. Dark mode is designed, not inverted. Color carries meaning. |

**Auto-fail to 4:** a purple-to-pink or blue-to-cyan linear gradient on a hero, unless the brand genuinely is that.

### 4. Motion (10)

| Pts | Standard |
|---|---|
| 0–3 | No motion, or CSS `transition: all 0.3s ease` on everything. |
| 4–6 | Fade-in-on-scroll exists but is uniform: same duration, same easing, same direction, everything at once. |
| 7–8 | Duration ladder, correct ease direction (out/in/in-out), staggered reveals under 800ms, scroll reveals at `top 85%`. |
| 9–10 | Choreography — overlapping timelines, lead/follow, line-masked text reveals, velocity or pointer reactivity, one interruptible spring interaction. Feels physical. Single RAF. |

**Auto-fail to 5:** `transition: all`, or reveals that fade in with `ease-in`.

### 5. Signature moment (10)

| Pts | Standard |
|---|---|
| 0–3 | Nothing memorable. A competent template. |
| 4–6 | A nice hero, but nothing you would screenshot or describe to someone. |
| 7–8 | One clearly-authored moment — a distinct hero effect, a bespoke transition, an unusual scroll behavior. |
| 9–10 | The moment is specific to *this* brand, technically non-trivial, positioned where it sells the rest of the site, and degrades gracefully. Someone would send it to a friend. |

**The test:** describe the site in one sentence to a stranger without using the words "clean," "modern," or "minimal." If you cannot, score below 6.

### 6. Content & copy (10)

| Pts | Standard |
|---|---|
| 0–3 | Lorem ipsum, placeholder images, "Your Company Here." |
| 4–6 | Real but generic — "innovative solutions," "we help businesses grow," stock photography of handshakes. |
| 7–8 | Specific, concrete, in a consistent voice. Real names, numbers, dates. Images treated to a common grade. |
| 9–10 | The copy has a point of view and could not be swapped onto a competitor's site. Headlines are short and confident. Microcopy (buttons, empty states, 404, form errors) is written, not defaulted. |

**Auto-fail to 3:** any `Lorem ipsum` or `placeholder.com` URL remaining.

### 7. Responsiveness (10)

| Pts | Standard |
|---|---|
| 0–3 | Horizontal scroll or broken layout at 375px. |
| 4–6 | Works at 375 and 1440, breaks or looks unconsidered between 768–1024. |
| 7–8 | All breakpoints clean. Type rescales. Touch targets 44px+. Hover-only interactions have tap equivalents. |
| 9–10 | Mobile is *designed*, not squeezed — different composition where warranted, pinned sections restructured, cursor and WebGL correctly disabled, tested at 320px and 2560px. |

**Auto-fail to 3:** `document.body.scrollWidth > window.innerWidth` at any tested width.

### 8. Performance (10)

| Pts | Standard |
|---|---|
| 0–3 | LCP > 4s, unoptimized images, layout shift on load. |
| 4–6 | LCP 2.5–4s, CLS > 0.1, or visible jank while scrolling. |
| 7–8 | LCP < 2.5s, CLS < 0.1, INP < 200ms. Images AVIF/WebP with srcset. Fonts subset and self-hosted. |
| 9–10 | LCP < 1.8s, CLS < 0.05, INP < 100ms **on 4x CPU throttle / Slow 4G**. Lighthouse 90+ on mobile. WebGL gated behind GPU tier with a poster fallback. |

**Measure, do not estimate.** A number you did not read off a tool is not a score.

### 9. Accessibility (10)

| Pts | Standard |
|---|---|
| 0–3 | No focus states, no alt text, contrast failures, keyboard traps. |
| 4–6 | Basic semantics, but custom controls are `div`s, focus is invisible somewhere, reduced-motion untested. |
| 7–8 | Semantic HTML, visible `:focus-visible` everywhere, all contrast passes, alt text on all images, reduced-motion respected, zero axe violations. |
| 9–10 | Full keyboard operability including custom cursor/menu/carousel, screen-reader tested on one real flow, skip link, `prefers-reduced-transparency` and `prefers-contrast` handled, motion can be disabled in-UI, focus order matches visual order. |

**Auto-fail to 2:** `outline: none` without a replacement, or a page that renders blank/invisible under `prefers-reduced-motion`.

### 10. Craft & finish (10)

| Pts | Standard |
|---|---|
| 0–3 | Console errors. Broken links. Default 404. No favicon. Untouched `<title>`. |
| 4–6 | Ships, but the edges are unfinished — no OG image, generic meta, unstyled selection, default scrollbar. |
| 7–8 | Meta + OG complete, favicon set, designed 404, styled selection, consistent hover states on every interactive element, no console output. |
| 9–10 | The details nobody asked for: designed empty/loading/error states, a considered `::selection` color, smooth anchor offsets under a fixed nav, print stylesheet, one easter egg, and a `console.log` signature. Nothing feels defaulted. |

---

## 2. Scoring bands

| Score | Meaning | Action |
|---|---|---|
| 90–100 | Award-submittable. Ship it. | Ship |
| 80–89 | Good professional work. Not distinctive. | Fix the two lowest categories |
| 65–79 | Competent. Reads as a template. | Fix the four lowest categories |
| < 65 | Not ready to show anyone. | Re-examine the direction, not the details |

**The 90% gate: do not report a build as complete below 90.** If you are at 84, say so, name the categories costing you the points, and fix them.

---

## 3. The amateur tells — instant recognition list

These are the things that mark work as templated or machine-generated, regardless of how much effort went in elsewhere. **Scan for these first; each one is worth more than an hour of polish.**

### Typography
- Display type with default letter-spacing (worst offender by a wide margin)
- Display type with `line-height: 1.5`
- Body copy running the full width of a 1440px screen
- Three or more font families
- Everything at 400 weight, or everything at 700
- `text-align: center` on a paragraph longer than three lines
- Arbitrary sizes: `17px`, `22px`, `31px`

### Color
- `#000` on `#ffffff`
- Untinted `#808080` grays
- Purple-to-pink gradients (`#667eea -> #764ba2` and its cousins)
- Default framework blue (`#3b82f6`, `#0070f3`) used as the brand
- Three or more accent colors
- One flat `box-shadow: 0 4px 6px rgba(0,0,0,0.1)` on everything

### Layout
- Three equal feature cards in a row, each with an icon, a bold title, and two lines of gray text
- Every section a centered container with identical padding
- `border-radius: 8px` on every element
- Uniform 16px gaps everywhere
- A hero that is a centered H1 + subtitle + two buttons, and nothing else
- Emoji used as icons
- Icons from three different sets

### Motion
- `transition: all 0.3s ease`
- Every element fading in from the bottom by 20px with identical timing
- Elements animating in only when they are already fully visible (trigger at `top bottom`)
- A loading screen longer than the load
- Autoplay carousels
- Parallax on everything

### Content
- "Lorem ipsum"
- "Innovative solutions for modern businesses"
- Stock photo: smiling team around a laptop / handshake / arrow hitting a target
- Placeholder logos labelled "Company 1..5"
- "Lorem" in the meta description
- A testimonial from "John D., CEO"

### Technical
- Console errors or React key warnings on load
- Default `<title>Vite + React</title>` or `Create Next App`
- No favicon (the browser default icon in the tab)
- Missing OG image — the link preview is a blank card
- Fonts loaded from the Google CDN
- Images that are 3000px wide served into a 400px slot

**A single pass removing these from an otherwise-average build typically moves the score 15–20 points.** Do this pass before any other polish.

---

## 4. The self-critique loop

This is the mechanism. Run it until you cross 90.

```
1. BUILD      — implement the current scope
2. OBSERVE    — actually look at it. Screenshot 375 / 768 / 1440.
                Scroll it. Tab through it. Do not skip this.
3. MEASURE    — run the automated checks (section 5). Record real numbers.
4. SCORE      — all 10 categories, honestly, against what is on screen.
5. DIAGNOSE   — take the LOWEST category. Name three specific defects.
6. FIX        — fix those three. Nothing else. Do not scope-creep into
                a category that is already at 8.
7. RE-SCORE   — repeat from 2.

Exit when: total >= 90 AND no single category < 7.
```

**Both conditions matter.** A site scoring 91 with accessibility at 4 is not shippable — it is a lawsuit with nice typography. Cap any total at 85 if a category is below 6, regardless of the sum.

### Observing honestly

The failure mode is scoring your intent instead of your output. Counters:

- **Screenshot and look at the image, not the browser.** A static frame removes the memory of what you meant.
- **Squint or blur it.** Hierarchy problems become obvious; detail disappears.
- **Flip it horizontally** (`transform: scaleX(-1)` on `<body>`). Balance problems you have gone blind to jump out.
- **View it at 25% zoom.** Composition and rhythm only.
- **Read the copy aloud.** Generic writing is unbearable out loud.
- **Come back after doing something else.** Even ten minutes of context switch restores judgment.

### Diagnosing precisely

"Typography needs work" is not a diagnosis. These are:

- "The h1 is 72px with `letter-spacing: normal`; it needs `-0.035em`."
- "Section padding is 48px; the design calls for `clamp(4rem, 10vw, 12rem)`."
- "The reveal fires at `top bottom` so it completes before it is visible; move to `top 85%`."
- "`--gray-500` is `#6b7280`, untinted; retune to `oklch(0.60 0.012 258)`."

If you cannot state the defect as a property, a current value, and a target value, you have not diagnosed it yet.

---

## 5. Automated checks

Run these; do not estimate the numbers.

```bash
# Lighthouse — mobile, throttled. The number that matters.
npx lighthouse http://localhost:3000 \
  --preset=desktop --output=json --output-path=./lh-desktop.json --quiet
npx lighthouse http://localhost:3000 \
  --form-factor=mobile --throttling-method=simulate \
  --output=html --output-path=./lh-mobile.html --quiet

# Accessibility — must be zero violations
npx @axe-core/cli http://localhost:3000 --exit

# Multi-page Lighthouse without burning API quota
npx unlighthouse --site http://localhost:3000

# Unused CSS/JS
npx knip

# Bundle composition
npx vite-bundle-visualizer      # Vite
ANALYZE=true npm run build      # Next with @next/bundle-analyzer
```

Playwright checks worth writing once and reusing on every project:

```js
// tests/craft.spec.js
import { test, expect } from "@playwright/test";

for (const w of [320, 375, 768, 1024, 1440, 2560]) {
  test(`no horizontal scroll at ${w}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

test("no console errors", async ({ page }) => {
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  expect(errors).toEqual([]);
});

test("page is readable with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // every reveal target must end up visible, not stuck at opacity 0
  const hidden = await page.$$eval("[data-reveal]", (els) =>
    els.filter((el) => getComputedStyle(el).opacity === "0").length
  );
  expect(hidden).toBe(0);
});

test("meta and OG are set", async ({ page }) => {
  await page.goto("/");
  await expect(page).not.toHaveTitle(/vite|create next app|document/i);
  expect(await page.locator('meta[property="og:image"]').count()).toBe(1);
  expect(await page.locator('link[rel~="icon"]').count()).toBeGreaterThan(0);
});
```

### Manual checks no tool catches

- [ ] Tab from the top of the page to the bottom. Focus is **always** visible and the order matches the visual order.
- [ ] `Cmd/Ctrl +` to 200% zoom. Nothing overlaps, nothing is cut off.
- [ ] Turn on OS "reduce motion." Reload. The page is complete and readable.
- [ ] Throttle to Slow 4G with 4x CPU. Scroll. Still usable.
- [ ] Disable JavaScript. Is there content? (Matters for Astro/Next; not for a WebGL art piece.)
- [ ] Paste the URL into Slack/iMessage. Does the preview card look intentional?
- [ ] Print preview. Is it a disaster?
- [ ] Read every string on the page out loud.

---

## 6. Device & browser matrix

| Tier | Test on | Non-negotiable |
|---|---|---|
| Must | Chrome desktop 1440, Safari desktop, iOS Safari (real device or simulator), Android Chrome | Layout, motion, glass fallbacks |
| Should | Firefox desktop, iPad, 2560 wide | Filter support, wide-screen composition |
| Nice | Older Android mid-tier, Safari 16 | GPU tiering, feature detection |

**iOS Safari is where design-forward sites break.** Specifically: `backdrop-filter` + `overflow: hidden` corner bleed, `100vh` including the address bar (use `100dvh`), video autoplay needing `playsinline`, `position: fixed` jumping during momentum scroll, and no SVG-filter support in `backdrop-filter`. Test on a real device, not just responsive mode.

---

## 7. Pre-ship checklist

**Content**
- [ ] Every string is real. No Lorem, no "Company 1."
- [ ] Every link goes somewhere. No `href="#"` placeholders.
- [ ] Copy proofread. Client/brand name spelled correctly everywhere.

**Meta & social**
- [ ] Unique `<title>` and `<meta name="description">` per page
- [ ] OG image 1200x630, `og:title`, `og:description`, `og:url`, `twitter:card`
- [ ] Favicon set: `.ico`, 180 apple-touch, 192/512 PNG, `site.webmanifest`, `theme-color`
- [ ] `<html lang>` set correctly
- [ ] Canonical URL

**Technical**
- [ ] `robots.txt` and `sitemap.xml`
- [ ] 404 page designed and reachable
- [ ] No console errors or warnings
- [ ] Analytics installed (and off-main-thread via Partytown if heavy)
- [ ] HTTPS, HSTS, sensible security headers
- [ ] Forms submit, validate, and show success/error states

**Quality**
- [ ] Lighthouse mobile 90+ on Performance, Accessibility, Best Practices, SEO
- [ ] Zero axe violations
- [ ] Rubric total >= 90, no category below 7

**Handoff**
- [ ] README: install, dev, build, deploy, env vars
- [ ] `assets/CREDITS.md` with every license
- [ ] Design tokens documented
- [ ] Client can edit content (CMS access or a documented path)
