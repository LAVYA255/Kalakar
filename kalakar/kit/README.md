# kit/ — Copy-paste foundation

Working code, not documentation. Drop these into a project and you have the
foundation from `SOP.md` Phase 4 already built: tokens, glass, motion,
reduced-motion gating, reveal primitives, generated filter assets.

**These are a starting point, not a house style.** Retune them to the brand —
a project that ships the defaults unchanged is a project where nobody made a
decision. At minimum change `--brand-h`, the type families, and the radius
ladder.

## Files

| File | What it is |
|---|---|
| `tokens.css` | Design tokens (type / space / colour / radius / depth / motion / z), modern reset, layout primitives, reveal primitive, grain overlay, preference gates. **Import first.** |
| `glass.css` | Liquid Glass — 4 layers, 3 tiers, on-light/on-dark variants, legibility scrim, a11y gates, mobile blur reduction, plus 6 cousin materials. |
| `filters.svg` | **Generated.** SVG filter defs: `#kalakar-grain`, `#kalakar-lens`, `#kalakar-lens-strong`, `#kalakar-lens-chroma`. Must be inlined into the DOM. |
| `gen-filters.mjs` | Regenerates `filters.svg`. Edit rim width / displacement scale here. |
| `motion.js` | Zero-dependency motion: single-rAF ticker, reveals, line-mask split, magnetic, cursor, counters, parallax, tilt, marquee, scroll progress, glass feature detection. |

## Wiring

```html
<link rel="stylesheet" href="kit/tokens.css">
<link rel="stylesheet" href="kit/glass.css">

<body class="grain">
  <!-- filters.svg contents pasted inline — url(#id) only resolves
       against defs in the same document -->
  <svg width="0" height="0" style="position:absolute" aria-hidden="true">…</svg>

  <a class="skip-link" href="#main">Skip to content</a>
  <main id="main">…</main>

  <script type="module">
    import { initKalakar } from "./kit/motion.js";
    initKalakar({
      cursor: { dot: document.querySelector("#dot"), ring: document.querySelector("#ring") },
    });
  </script>
</body>
```

`filters.svg` **cannot** be referenced via `<img src>` or `<use>`. CSS
`url(#id)` only resolves against filter defs in the same document, so paste
the contents inline (a build step or server include is fine).

## Markup contracts

```html
<!-- reveal on scroll; siblings auto-stagger within the 800ms budget -->
<div data-reveal>…</div>
<div data-reveal data-reveal-delay="200">…</div>
<div data-reveal data-reveal-group="hero">…</div>

<!-- line-masked headline entrance -->
<h1 data-split>Long headline that wraps to several lines</h1>

<!-- glass -->
<div class="glass glass--card glass--on-dark glass--interactive" data-glass-reactive>
  <div class="glass__content">…</div>
</div>

<!-- interactions -->
<button data-magnetic="0.4">Hover me</button>
<div data-tilt="8">…</div>
<span data-count="2847" data-count-suffix="+">0</span>
<div data-parallax="0.12">…</div>
<div data-marquee="40"><div>… repeated content …</div></div>
```

## Regenerating filters

```bash
node kalakar/kit/gen-filters.mjs
```

Tuning knobs in `gen-filters.mjs`: `rim` (width of the refracting band),
`radius` (corner of the flat centre), and `scale` on each
`feDisplacementMap` (refraction strength — 20 subtle, 44 clearly glass,
90 funhouse mirror).

## Deliberate constraints

- **Zero dependencies.** Runs from a plain `.html` file with no build step.
  See the upgrade notes at the bottom of `motion.js` for the GSAP + Lenis
  swap — the timing values do not change, only the engine.
- **One rAF loop.** Every continuous animation registers with `addTicker`.
  Three competing rAF loops is the classic source of untraceable jitter.
- **`prefers-reduced-motion` is checked before anything is built**, not
  patched afterwards. Reveals end visible under reduced motion — a page
  that renders blank is the most common and most severe failure here.
- **No-JS renders fully.** Reveal styles are gated behind `.js`, which only
  JavaScript adds.
