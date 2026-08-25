# demo/ — a working one-page site built from the kit

Proof that `kalakar/kit/` composes into something real, and a place to *see*
the material and motion before you write your own. Everything on the page —
tokens, glass, reveals, cursor, grain, filters — comes from the kit; `demo.css`
only composes.

## View it

**Just open it:** `demo/standalone.html` — self-contained, no server, no build.

**Or serve it** (this is the canonical source, and how you should develop):

```bash
npx serve .        # from the repo root
# then open http://localhost:3000/demo/index.html
```

`index.html` imports `../kalakar/kit/motion.js` as an ES module. Browsers treat
an external module fetch over `file://` as cross-origin and block it, so
double-clicking `index.html` loads the CSS but silently skips all the
JavaScript. `standalone.html` exists precisely for that case — `build.mjs`
inlines the CSS and JS into it.

## Scripts

```bash
node demo/scripts/gen-assets.mjs   # regenerate noise/grid/favicon/og + CREDITS
node demo/scripts/gen-fonts.mjs    # re-download + self-host the latin font subsets
node kalakar/kit/gen-filters.mjs   # regenerate the SVG filter defs
node demo/scripts/build.mjs        # inline filters into index.html; emit standalone.html
node demo/scripts/verify.mjs       # the QA checks + screenshots at 6 widths
node demo/scripts/contrast.mjs     # pixel-accurate contrast audit
```

`build.mjs` must run after either generator.

## What each section demonstrates

| Section | Shows |
|---|---|
| Hero | Golden-ratio split, line-masked headline entrance, glass panel refracting the mesh gradient, magnetic buttons, count-ups |
| Marquee | Seamless loop reacting to scroll velocity |
| Craft layer | Asymmetric 12-col grid (7/5, 5/7, 4/4/4), interactive glass cards with tilt |
| Material lab | 2019 frosted vs Liquid Glass Tier 1 vs Tier 2 refraction, side by side over the same backdrop — plus clay, brushed metal, raw |
| Proportions | Live type specimen, OKLCH accent ramp, non-linear spacing ramp |
| Motion lab | Five easing curves plotted to scale, and a runner that plays the same 900ms travel through four different curves |
| Process | The 14-phase SOP with its five gates |
| Rubric | The 10 scoring categories |

## Assets

Every **image** is generated — see `scripts/gen-assets.mjs`. The typefaces are
the only third-party thing on the page (SIL OFL). `assets/CREDITS.md` records
all of it in the shape every project should keep.

- `noise-256.png` — seeded value noise, written by a ~50-line pure-JS PNG
  encoder (zlib + CRC32, no `sharp`)
- `grid.svg` — radially-masked dot grid
- `favicon.svg`, `og.svg` — generated marks
- `../kalakar/kit/filters.svg` — grain + three refraction filters

The mesh gradient, aurora, grain overlay, glass rim and easing plots are all
pure CSS/SVG. There are no photographs and no icon fonts on this page.

## Verification

`verify.mjs` runs the automated checks from `references/qa-rubric.md` §5:
console errors, horizontal overflow at 6 widths, meta/OG/favicon/lang/skip-link,
heading order, alt text, no Lorem, glass tier detection, reveal firing, reduced
motion, keyboard focus visibility, and `standalone.html` loading from `file://`.

`contrast.mjs` measures **rendered pixels**. axe-core reports `incomplete`
rather than a ratio whenever the background is a gradient, a `backdrop-filter`,
or an image — which on this page is essentially all of it, so a clean axe run
would prove nothing. Instead it screenshots each text run's glyph bounds, takes
the median luminance as background and the further extreme as text, and
computes WCAG contrast from that. Approximate, but it caught 15 real failures
that axe passed silently.

Current state: all checks pass; 19/19 text runs at or above 4.5:1 with margin.

**Lighthouse (mobile, simulated throttling):**

| | |
|---|---|
| Performance | **99** |
| Accessibility | **100** |
| Best Practices | **100** |
| SEO | **100** |
| FCP | 1.4 s |
| LCP | 1.8 s |
| CLS | 0 |
| TBT | 110 ms |

It scored 89 with the fonts on the Google CDN — Lighthouse attributed ~2.0 s of
render-blocking to that one `<link>`. `scripts/gen-fonts.mjs` self-hosts the
latin subsets with metric overrides, which took LCP from 2.8 s to 1.8 s. That is
`references/assets.md` §4 applied to its own demo, and the delta is why the rule
is in there.

## Known limitations

- **Tier 2 refraction is Chromium-only.** Safari and Firefox support
  `backdrop-filter` but ignore SVG filter references inside it. The page
  detects this and says so, in the third material-lab caption. Tier 1 is the
  design; Tier 2 is a bonus.
- **`og.svg` is SVG.** Several social crawlers will not render it — rasterize
  to PNG for a real deployment (satori + resvg, or a Playwright screenshot).
- **`noise-256.png` is 64 KB.** Random data does not compress; that is the
  honest cost. A real project would use a smaller tile or a `feTurbulence`
  filter instead, which is what the grain overlay already does.

## Rubric score

Scored against `references/qa-rubric.md`, honestly, after the fix loop:

| Category | Score | Why not 10 |
|---|---|---|
| Typography | 9 | Two-ratio scale, −0.04em display tracking, 0.88 leading, 68ch measure, self-hosted subsets. The specimen section carries inline `font-size` overrides (justified there, still overrides). |
| Layout & proportion | 9 | Golden-ratio hero split, asymmetric 7/5 and 5/7 grid, generous rhythm. The material lab is a deliberately uniform auto-fit grid so the comparison is fair — but it is still symmetric. |
| Colour & material | 10 | OKLCH ramps, tinted neutrals, one accent, one light direction, glass across three tiers with real degradation, five materials shown side by side. |
| Motion | 9 | Duration ladder, correct ease directions, line-mask reveals, stagger budget, velocity marquee, magnetic, cursor lag, one rAF, catch-up sweep. No page transitions and no scrub-pinned section — it is one page. |
| Signature moment | 8 | The refracting glass panel over the mesh, and the frosted-vs-Tier-1-vs-Tier-2 comparison, are genuinely distinctive and non-trivial. But there is no WebGL and no bespoke hero effect; this is not an SOTD hero. |
| Content & copy | 9 | Specific, opinionated, no Lorem, microcopy written, console signature. No designed 404 — single page. |
| Responsiveness | 9 | Verified 320→2560, zero overflow, cursor and hover gated, height-aware hero type. Mobile is a well-behaved reflow rather than a distinct composition. |
| Performance | 10 | Measured, not estimated: Lighthouse mobile 99, LCP 1.8 s, CLS 0, TBT 110 ms. |
| Accessibility | 9 | 0 axe violations, 19/19 pixel-measured contrast, visible focus on all 13 stops, skip link, reduced motion and reduced transparency both handled. No screen-reader pass was run, so it is not a 10. |
| Craft & finish | 9 | Meta, OG, favicon, theme-color, canonical, styled selection, print stylesheet, generated licence manifest. `og.svg` should be a PNG; no 404. |

**Total 91/100, no category below 7** — clears Gate E in `SOP.md`.

The loop that got there is the point. The first build measured 84: the hero CTA
fell below the fold at 1440×900, `splitLines` was silently flattening the
gradient `<em>` out of the headline, the clay swatch rendered as a black box on
a dark theme, the back-out easing curve was clipped by its own viewBox, 15 text
runs failed contrast, and the mobile nav CTA wrapped to three lines and
collided with the hero. Every one of those was found by looking at a screenshot
or running a measurement — none by reading the code.
