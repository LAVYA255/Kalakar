# Kalakar — Design-Forward Website Skill

A Claude Code skill for building **NEW award-winning, design-forward websites** for any domain — Awwwards / FWA / SOTD caliber, heavily aesthetic, animated, AND optimized.

This is a **creator** skill, not a cloner. Reference sites (Floema, Shopify Editions, Linear, Vercel, Hashgraph VC, ref.digital, Obsidian Assembly, Simon Holm Studio) are inspiration — you mix building blocks to produce original work.

**Kalakar** (कलाकार) — *artist*.

---

## What it knows

### The catalog — what to build

- **12 site archetypes** — Editorial Product Launch, VC Firm, Designer Portfolio, Studio Showreel, Case-Study Microsite, Brand Microsite, Conference, Cinematic Lookbook, Net-Art One-Pager, Minimalist Brutalist, WebGL Hero SaaS, Design-Forward Docs.
- **40+ business verticals** with aesthetic elevation paths — restaurants, dentists, photographers, law firms, real estate, fashion, music artists, NGOs, SaaS, AI startups, agencies, conferences, museums, weddings, hotels, gyms, e-commerce, and more.
- **240+ libraries** catalogued by category and tier, including the niche gems average AIs miss: OGL, Lygia, troika-three-text, curtains.js, Mouse Follower, Lenis, `@darkroom.engineering/tempus`, hamo, SplitType, Theatre.js, Tweakpane, leva, Paper Shaders, Unicorn Studio, TresJS + Cientos, gltf-transform, Spector.js, VFX-JS, Mediabunny, Rive, Spline.
- **14 proven combo recipes** — Classic Awwwards, darkroom.engineering, Floema, Codrops, Linear/Vercel Marketing, Paper Shaders SaaS, European Nuxt Agency, and more.
- **Mixable building blocks** — 9 loaders, 13 hero patterns, 9 nav styles, 7 transitions, 8 cursors, 10 scroll signatures, 8 footers, plus audio/form/image/type/theme/404/easter-egg patterns. Pick ONE per slot — constraint is the design.
- **Stack decisions** — Astro vs Next vs Nuxt vs Vite-React vs SvelteKit vs Hydrogen vs Webflow vs 11ty.
- **Agency wiring patterns** — the persistent-canvas-across-page-transitions trick, the single-RAF rule, studios worth studying, the Spector.js reverse-engineering workflow.

### The craft layer — why it looks expensive

Two sites can ship the identical component list and one reads as a studio project. The difference lives here.

- **Proportions & design system** — modular type scales (a *different* ratio for body and display), the solved `clamp()` formula, tracking and leading tables, a non-linear 4pt spacing ramp, 12-col grids and asymmetric composition, the aspect-ratio canon, optical alignment, nested-radius math, OKLCH colour ramps with tinted neutrals, layered shadows with one committed light direction, focus states, responsive strategy.
- **Liquid Glass & material language** — what Liquid Glass actually is (refraction, not blur), in three tiers: CSS baseline, real SVG `feDisplacementMap` lensing with chromatic aberration, and WebGL transmission. Plus the legibility problem most glass UI fails, the performance budget, when *not* to use it, and nine cousin materials (brushed metal, riso, clay, holographic, dithered, neon, raw, chrome, soft-body).
- **Motion specification** — the actual numbers. Duration ladder, easing per motion type, spring parameters mapped to feel, stagger math, choreography (overlap, lead-and-follow, the counter-scale reveal), scroll-driven motion, the single-RAF rule, a signature-move cookbook, reduced-motion policy, frame budget.
- **Assets** — generate before you source. Grain, mesh gradients, dither, noise; where to get free-and-licensed photography, type, icons, 3D, motion and audio; the full optimization pipeline with real `sharp` / `ffmpeg` / `svgo` / `glyphhanger` / `gltf-transform` commands; licence manifests; placeholder discipline.
- **Performance playbook** — LCP for WebGL heroes, GPU tiering with `detect-gpu`, font CLS, INP, audio rules, OG image generation.

### The process — knowing when to build and when you're done

- **`SOP.md`** — 14 phases, 5 gates, end to end. The critical one is **Gate B: do not start building until direction confidence clears 90/100**, scored across seven dimensions. Building before you know what you're building is the largest source of wasted work.
- **`qa-rubric.md`** — a **100-point rubric** across 10 categories, an "amateur tells" hit list (the things that instantly mark work as templated), a self-critique loop, the automated check commands, a device matrix, and a pre-ship checklist. **Exit at ≥ 90 with no category below 7.**

### The kit — running code

`kalakar/kit/` is a copy-paste foundation, zero dependencies, no build step:

| File | What it is |
|---|---|
| `tokens.css` | Tokens (type/space/colour/radius/depth/motion/z), modern reset, layout primitives, reveal primitive, grain overlay, preference gates |
| `glass.css` | Liquid Glass — 4 layers, 3 tiers, on-light/on-dark, legibility scrim, a11y gates, mobile blur reduction, 6 cousin materials |
| `filters.svg` | Generated SVG filter defs: grain + three refraction lenses |
| `gen-filters.mjs` | Regenerates the above |
| `motion.js` | Single-rAF ticker, reveals, line-mask split, magnetic, cursor, counters, parallax, tilt, marquee, scroll progress, glass feature detection |

---

## The demo

`demo/` is a complete one-page site built entirely from the kit — and the
easiest way to see the material and motion.

**Open `demo/standalone.html`.** No server, no build step.

It carries a material lab (2019 frosted vs Liquid Glass Tier 1 vs real
refraction, side by side over the same backdrop), a live type and spacing
specimen, five easing curves plotted to scale with a runner that plays the same
travel through each, and the SOP and rubric as editorial sections.

Every image on it is generated — including the noise tile, written by a
~50-line pure-JS PNG encoder. The typefaces are self-hosted OFL subsets, which
is the difference between Lighthouse 89 and **99**.

```bash
npm run check      # build + QA checks + screenshots + pixel contrast audit
```

Measured on the demo: **Lighthouse mobile 99 / 100 / 100 / 100**, LCP 1.8 s,
CLS 0, zero axe violations, 19/19 text runs above 4.5:1 by pixel measurement.

See `demo/README.md` for details and known limitations.

---

## Install

### Option 1 — Drop-in (Claude Code)

Copy the `kalakar` folder into your skills directory:

**Windows:** `%USERPROFILE%\.claude\skills\kalakar\`
**macOS / Linux:** `~/.claude/skills/kalakar/`

Restart Claude Code. It triggers automatically on prompts like "build a website for X", and on `/kalakar`.

### Option 2 — Packaged `.skill`

Use `kalakar.skill` and import it via Claude Code's skill installer.

---

## Usage

Describe what you want:

- "Build a website for my dentist clinic, but make it feel like Hashgraph VC."
- "Create a site for an indie perfume brand I'm launching."
- "Landing page for an AI vector database startup, liquid glass UI."
- "Wedding invitation site, design-forward, ambient sound, custom cursor."
- "Portfolio site for a film director."

The skill walks Claude through: identify domain → pick archetype → choose stack
→ plan the signature moment → **score direction confidence, and stop below 90**
→ define tokens → produce real assets → scaffold with perf and reduced-motion
built in → build → **score against the rubric and iterate until ≥ 90**.

---

## File map

```
kalakar/
├── SKILL.md                     # workflow, craft rules, niche-gem hit list
├── SOP.md                       # 14 phases, 5 gates, brief template
├── references/
│   ├── design-system.md         # proportions, type, space, colour, depth
│   ├── liquid-glass.md          # the material language, 3 tiers + 9 cousins
│   ├── motion-spec.md           # durations, easings, choreography
│   ├── assets.md                # generate > source > optimize
│   ├── qa-rubric.md             # 100-point rubric + self-critique loop
│   ├── domain-playbook.md       # 40+ verticals × elevation paths
│   ├── archetypes.md            # 12 site archetypes
│   ├── building-blocks.md       # mixable UI/UX patterns
│   ├── libraries.md             # 240+ library catalog
│   ├── recipes.md               # 14 proven combos
│   ├── stack-decisions.md       # meta-framework picker
│   ├── performance.md           # perf playbook
│   └── agency-wiring.md         # the canonical agency pattern
└── kit/                         # copy-paste foundation (see table above)

demo/                            # working one-page site built from the kit
├── standalone.html              # ← open this
├── index.html  demo.css
├── assets/                      # all generated
├── screenshots/
└── scripts/                     # gen-assets · build · verify · contrast
```

---

## Author

Made by **Lavya** ([@LAVYA255](https://github.com/LAVYA255)) with Claude.

## License

MIT — use it, fork it, remix it. Credit appreciated, not required.
