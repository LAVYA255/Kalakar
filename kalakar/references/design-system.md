# Design System — Proportions, Type, Space, Color, Depth

The catalog files (`archetypes`, `building-blocks`, `recipes`) tell you **what** to build. This file is **why it looks expensive**. Two sites can ship the identical component list and one reads as a studio project while the other reads as a template. The difference is almost always in this file: scale ratios, tracking, optical alignment, spacing rhythm, and a color ramp built in a perceptual space.

**Read this before writing the first line of CSS.** Tokens come before components. Always.

---

## 1. The token architecture

Three tiers. Never skip the middle one — it is what lets you re-theme without a rewrite.

```
PRIMITIVE          SEMANTIC                COMPONENT
--gray-900   ->    --surface-inverse  ->   --btn-bg
--space-5    ->    --gutter           ->   --card-pad
--dur-4      ->    --dur-enter        ->   --nav-open-dur
```

- **Primitive** — raw values with no opinion. `--gray-700`, `--space-6`, `--text-4`.
- **Semantic** — role names. `--surface`, `--surface-raised`, `--ink`, `--ink-muted`, `--accent`, `--gutter`, `--measure`.
- **Component** — only when a component genuinely deviates. Most should not need this tier.

Rule: **components only ever reference semantic tokens.** If a component reads `--gray-700` directly, dark mode will break and you will fix it by hand 40 times.

---

## 2. Type scale — the modular scale

Pick ONE ratio and generate every size from it. Arbitrary sizes (`17px`, `23px`, `31px`) are the loudest amateur tell in a codebase.

| Ratio | Name | Feel | Use for |
|---|---|---|---|
| 1.125 | Major second | Tight, dense | Dashboards, docs, data UI |
| 1.200 | Minor third | Calm, safe | SaaS marketing, corporate |
| 1.250 | Major third | Balanced — **best default** | Most marketing sites |
| 1.333 | Perfect fourth | Editorial, confident | Magazines, case studies, VC |
| 1.414 | Augmented fourth | Dramatic | Fashion, luxury, portfolio |
| 1.500 | Perfect fifth | Very dramatic | Studio showreel, art-led |
| 1.618 | Golden | Extreme; only 4-5 usable steps | Net-art, brutalist, one-pagers |

**The trick nobody does:** use a *different ratio for body vs display*. Body steps at 1.2 (readable increments), display steps at 1.414+ (drama). One scale for everything either makes your h1 too small or your captions absurd.

```css
:root {
  /* body ramp — ratio 1.2, base 16px */
  --text-xs:   0.694rem;  /* 11.1 */
  --text-sm:   0.833rem;  /* 13.3 */
  --text-base: 1rem;      /* 16   */
  --text-md:   1.2rem;    /* 19.2 */
  --text-lg:   1.44rem;   /* 23   */

  /* display ramp — ratio 1.414, base 1.75rem */
  --display-1: 1.75rem;
  --display-2: 2.474rem;
  --display-3: 3.498rem;
  --display-4: 4.946rem;
  --display-5: 6.994rem;
}
```

### Fluid type — the clamp formula

Do not hand-guess `clamp()`. It is a line through two points; solve it.

Given size `y1` at viewport `x1` and `y2` at `x2` (all px):

```
slope      = (y2 - y1) / (x2 - x1)
intercept  = y1 - slope * x1
preferred  = calc({intercept/16}rem + {slope*100}vw)
clamp(min, preferred, max)
```

Example — 40px at 375 viewport, 96px at 1440 viewport:

```
slope     = (96-40)/(1440-375) = 0.05258
intercept = 40 - 0.05258*375   = 20.28px = 1.2675rem
```
```css
--display-4: clamp(2.5rem, 1.2675rem + 5.258vw, 6rem);
```

**Always pin with `clamp()`, never raw `vw`.** Raw `vw` type is unreadable at 320px and comical at 2560px, and it breaks browser zoom (a WCAG 1.4.4 failure).

### Tracking (letter-spacing) — the single highest-leverage rule

Type designers space fonts for roughly 16px. At display sizes the counters get too airy; at tiny sizes too tight. **Optical sizing is not automatic** unless the font has an `opsz` axis.

| Size | Tracking | Why |
|---|---|---|
| 10–12px | `+0.04em` to `+0.08em` | Small text needs air; also for ALL-CAPS labels |
| 14–18px | `0` | As designed |
| 24–40px | `-0.01em` to `-0.02em` | Starting to loosen |
| 48–80px | `-0.02em` to `-0.035em` | Noticeably loose without it |
| 80px+ | `-0.03em` to `-0.05em` | **Mandatory.** Untracked 100px type is the #1 amateur tell |

```css
h1, .display { letter-spacing: -0.035em; }
.eyebrow     { letter-spacing: 0.12em; text-transform: uppercase; font-size: var(--text-xs); }
```

If the font ships a variable `opsz` axis (Inter Variable, Roboto Flex, Fraunces), set `font-optical-sizing: auto` and ease off manual tracking — but still tighten display by about `-0.02em`.

### Line-height — inverse to size, always

```css
--leading-display: 0.95;  /* 60px+  — can go 0.85 for tight stacked headlines */
--leading-tight:   1.15;  /* 32-48  */
--leading-snug:    1.35;  /* 20-28  */
--leading-normal:  1.55;  /* body   */
--leading-loose:   1.75;  /* small print, long-form at large measure */
```

Body copy at `1.5–1.6` is the readability window. **Display type at `1.5` is the second-loudest amateur tell** — big type wants `0.9–1.1`.

### Measure (line length)

**45–75 characters.** Non-negotiable for body copy.

```css
.prose { max-width: 68ch; }
```

Above 75ch the eye loses its return line. Below 45ch the rhythm breaks. If a design demands a full-bleed text block, go two columns rather than one 120ch line.

### Font pairing that works

| Display | Body | Feel | Source |
|---|---|---|---|
| Clash Display | Satoshi | Modern studio | Fontshare (free, commercial) |
| Editorial New | Inter | Editorial luxury | Pangram (paid) / sub Instrument Serif |
| Instrument Serif | Geist | Contrast editorial | Google + Vercel (free) |
| Bebas Neue | Inter | Poster / sport | Google (free) |
| Fraunces (var) | Inter | Warm, opinionated | Google (free) |
| PP Neue Montreal | PP Neue Montreal | Swiss mono-family | Pangram (paid) — sub General Sans |
| Sohne | Sohne | The agency default | Klim (paid) — sub Inter/Satoshi |
| One family, 3 weights | same | Most restrained, hardest to get wrong | any |

**Never more than two families.** A third is only ever a mono for code/labels. Two families at 3 weights each beats five families every time.

---

## 3. Spacing — the 4pt grid and the non-linear ramp

Use a **4px base with an 8px preference**. Every gap, pad, and margin snaps to it. A `13px` gap next to a `16px` gap is invisible individually and slop in aggregate.

The ramp is **non-linear** — linear ramps give you 12 nearly-identical mid values you will never distinguish:

```css
:root {
  --space-0:  0;
  --space-1:  0.25rem;  /*  4 */
  --space-2:  0.5rem;   /*  8 */
  --space-3:  0.75rem;  /* 12 */
  --space-4:  1rem;     /* 16 */
  --space-5:  1.5rem;   /* 24 */
  --space-6:  2rem;     /* 32 */
  --space-7:  3rem;     /* 48 */
  --space-8:  4rem;     /* 64 */
  --space-9:  6rem;     /* 96 */
  --space-10: 8rem;     /* 128 */
  --space-11: 12rem;    /* 192 */
  --space-12: 16rem;    /* 256 */
}
```

### Proximity: the law that does the most work

**Space between groups must exceed space within a group — by a clear factor, not a hair.**

```
label -> input      : --space-2   (8)
input -> next field : --space-5   (24)    3x
field group -> next : --space-7   (48)    2x
section -> section  : --space-10  (128)
```

If a heading looks equally attached to the paragraph above and below it, the page reads as mush. Tighten to the thing it owns. `margin-top: 3em; margin-bottom: 0.6em` on headings, always — never symmetric.

### Section rhythm

```css
--section-y: clamp(4rem, 10vw, 12rem);
```

Award-grade sites are **more generous than you think**. 128–192px of vertical air between sections on desktop is normal. The instinct to fill the viewport is what makes a page feel cheap. White space reads as confidence; density reads as anxiety.

---

## 4. Layout & proportion

### Container ladder

```css
--container-xs:   30rem;  /* 480  — forms, single column */
--container-sm:   40rem;  /* 640  — prose */
--container-md:   48rem;  /* 768  — prose + media */
--container-lg:   64rem;  /* 1024 — standard content */
--container-xl:   80rem;  /* 1280 — wide marketing */
--container-2xl:  90rem;  /* 1440 — full studio grid */
--gutter: clamp(1rem, 4vw, 3rem);
```

### The grid

12 columns is the default because it divides by 2, 3, 4, and 6. Use **CSS subgrid** so nested content aligns to the parent grid instead of re-declaring it.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--gutter);
  max-width: var(--container-2xl);
  margin-inline: auto;
  padding-inline: var(--gutter);
}
.grid > .subgrid { grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; }
```

**Asymmetric placement is the whole game.** A 12-col grid used as three equal 4-col cards is a Bootstrap page. The same grid used as `2/8`, `1/6`, `7/12` is an editorial page. Break the symmetry deliberately at least twice per page.

### Aspect ratios — pick from the canon

| Ratio | Value | Reads as |
|---|---|---|
| 1:1 | `1` | Neutral, systematic, grid-native |
| 4:5 | `0.8` | Portrait editorial — **the fashion/lookbook default** |
| 2:3 | `0.667` | Classic photography portrait |
| 3:2 | `1.5` | Classic photography landscape |
| 16:9 | `1.778` | Video, screens |
| 2:1 | `2` | Wide banner |
| 2.39:1 | `2.39` | **Anamorphic — instant "cinematic"** |
| 1.618:1 | `1.618` | Golden — quietly pleasant |

Set `aspect-ratio` on every media container. It is free CLS prevention *and* it forces you to make a compositional decision instead of letting the image dictate layout.

### Golden section & rule of thirds

For a hero split, `1fr 1.618fr` beats `1fr 1fr` almost every time — asymmetry creates a focal point, symmetry creates a stalemate.

```css
.hero { display: grid; grid-template-columns: 1fr 1.618fr; }
```

Place the focal point of a hero image at a third-intersection, not dead center. `object-position: 33% 40%` is a more interesting crop than `center` and costs nothing.

### Optical alignment — where math lies to you

Mathematical centering is frequently *visually* wrong. Fix by eye, then encode the fix.

- **Play icons** in circular buttons need `translateX(~8%)` — a triangle's visual mass sits left of its bounding box.
- **Circles overshoot.** A circular badge next to a square one must be 2–3% larger to read the same size.
- **Punctuation hangs.** Quotes and bullets should sit *outside* the text column: `text-indent: -0.4em` on a pull-quote.
- **Uppercase looks high.** All-caps text in a button needs about 1px more bottom padding than top — no descenders to balance it.
- **Text in a box is bottom-heavy.** A card with equal padding looks bottom-heavy because line-height adds space above the cap-height. Reduce top padding about 4px, or use `text-box` where supported.

```css
/* modern optical trim — progressive enhancement */
@supports (text-box: trim-both cap alphabetic) {
  h1, h2, h3 { text-box: trim-both cap alphabetic; }
}
```

### Nested border radius

Concentric radii must be computed, not copied. Same radius inside and out makes the inner corner look pinched.

```
inner-radius = outer-radius - padding
```

```css
.card       { --r: 24px; border-radius: var(--r); padding: 12px; }
.card > img { border-radius: calc(var(--r) - 12px); } /* 12px */
```

Radius ladder — and **pick a personality, do not mix**:

```css
--radius-none: 0;      /* brutalist, editorial, swiss */
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   16px;
--radius-xl:   24px;
--radius-2xl:  32px;   /* soft / glass / iOS-adjacent */
--radius-full: 9999px;
```

Sharp (0) and very soft (24–32) both read as intentional. `8px on everything` reads as a default nobody chose.

---

## 5. Color — build it in OKLCH

sRGB/HSL lie about lightness: `hsl(60 100% 50%)` (yellow) and `hsl(240 100% 50%)` (blue) are the "same" lightness and are wildly different. Every hand-built HSL ramp has a muddy middle for this reason.

**OKLCH is perceptually uniform.** Equal `L` means equal perceived lightness. Ramps built in OKLCH are even on the first try, and hue shifts stay controlled.

```css
/* oklch(Lightness Chroma Hue) — L 0-1, C 0-0.4ish, H 0-360 */
--accent-500: oklch(0.62 0.19 258);
```

### Building a ramp

Hold hue roughly constant, walk L in even steps, and **peak chroma in the middle** (the ends are near-white and near-black where chroma cannot survive):

```css
:root {
  --accent-50:  oklch(0.97 0.02 258);
  --accent-100: oklch(0.94 0.04 258);
  --accent-200: oklch(0.88 0.08 258);
  --accent-300: oklch(0.80 0.13 258);
  --accent-400: oklch(0.71 0.17 258);
  --accent-500: oklch(0.62 0.19 258);  /* peak chroma */
  --accent-600: oklch(0.54 0.18 258);
  --accent-700: oklch(0.45 0.15 258);
  --accent-800: oklch(0.36 0.11 258);
  --accent-900: oklch(0.27 0.07 258);
}
```

**Hue-shift for realism:** drift hue slightly warm in the lights and cool in the darks (or vice-versa). Nature does this; flat-hue ramps look synthetic. `258 -> 262` at the dark end is enough.

### Tinted neutrals — never pure gray

Pure `#808080` neutrals look dead next to any chromatic accent. Give grays a whisper of the brand hue (`C` around `0.005–0.02`):

```css
--gray-50:  oklch(0.985 0.002 258);
--gray-500: oklch(0.60  0.012 258);
--gray-950: oklch(0.16  0.014 258);
```

Same for "black" and "white": `oklch(0.16 0.014 258)` reads richer than `#000`, and pure `#000` next to a colored surface produces a harsh optical edge. **Never `#000` on `#fff` for body copy** — `oklch(0.25 ...)` on `oklch(0.98 ...)` is calmer and still passes AAA.

### The one-accent rule

**One accent. One.** Plus semantic states (success / warning / danger) which are functional, not decorative. Sites that read as designed use a single chromatic voice against a tinted-neutral field. Two accents needs a reason; three is a rainbow.

If you need more range, get it from **chroma and lightness within one hue**, not from new hues.

### Contrast targets

| Content | Minimum | Target |
|---|---|---|
| Body text | 4.5:1 | 7:1 |
| Display text (24px+ / 19px bold) | 3:1 | 4.5:1 |
| UI borders, icons, focus rings | 3:1 | 3:1+ |
| Disabled | — | still keep 3:1 if it conveys meaning |

Use **APCA** (`Lc`) if you can — it models real perception far better than WCAG 2's ratio, especially on dark backgrounds where WCAG 2 systematically over-rewards. Target `Lc 75+` for body, `Lc 60+` for large.

### `color-mix()` — stop hand-authoring alpha variants

```css
--surface-hover: color-mix(in oklab, var(--surface) 92%, var(--ink));
--accent-ghost:  color-mix(in oklab, var(--accent) 12%, transparent);
--hairline:      color-mix(in oklab, var(--ink) 12%, transparent);
```

Mix `in oklab` (not the default sRGB) — sRGB mixes pass through gray mud.

### Dark mode is not an inversion

- Dark surfaces **elevate with lightness**, not shadow. Shadows are near-invisible on dark; a raised card is a *lighter* surface.
- **Reduce chroma 10–20%** in dark mode. Saturated color on dark vibrates and induces halation.
- **Reduce text weight.** Light-on-dark optically bloats; if body is 400 in light, try 350 (variable) or a slightly lower opacity in dark.
- Large flat pure-black backgrounds smear on OLED during scroll. `oklch(0.15 ...)` is safer than `oklch(0 0 0)`.

---

## 6. Depth — shadows, elevation, hairlines

### Layered shadows (the entire secret)

One shadow is a Bootstrap card. Real objects cast a **tight contact shadow plus a wide ambient shadow**. Stack 2–4, increasing blur while decreasing alpha:

```css
--shadow-sm:
  0 1px 2px  -1px  oklch(0.16 0.014 258 / 0.10),
  0 1px 3px  0     oklch(0.16 0.014 258 / 0.06);

--shadow-md:
  0 1px 2px  -1px  oklch(0.16 0.014 258 / 0.08),
  0 4px 8px  -2px  oklch(0.16 0.014 258 / 0.08),
  0 10px 20px -4px oklch(0.16 0.014 258 / 0.06);

--shadow-lg:
  0 1px 2px   -1px oklch(0.16 0.014 258 / 0.06),
  0 8px 16px  -4px oklch(0.16 0.014 258 / 0.08),
  0 24px 48px -12px oklch(0.16 0.014 258 / 0.12),
  0 48px 96px -24px oklch(0.16 0.014 258 / 0.10);
```

**Tint the shadow with the surface hue** (note the `258` above). Pure-black shadows on a colored page look like a hole punched in it.

**Direction implies a light source — commit to one.** If shadows fall down-right, every specular highlight, inner glow, and glass edge on the page must agree. Inconsistent light direction is subliminally wrong and nobody can tell you why.

### Hairlines beat borders

```css
--hairline: 1px solid color-mix(in oklab, var(--ink) 10%, transparent);
```

A `1px solid #e5e5e5` border is opaque and fights every background. A translucent hairline adapts. On retina, consider `0.5px` for genuinely fine rules.

### Z-index scale

Name your layers. Never write `z-index: 9999`.

```css
--z-base:     0;
--z-raised:   10;
--z-sticky:   100;
--z-nav:      200;
--z-overlay:  300;
--z-modal:    400;
--z-toast:    500;
--z-cursor:   9000;  /* custom cursor is genuinely always on top */
```

---

## 7. States & focus

Every interactive element needs five states designed, not defaulted: **rest, hover, active/pressed, focus-visible, disabled**. Plus loading if async.

```css
:where(a, button, [role="button"], input, select, textarea):focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
```

- Use `:focus-visible`, never `:focus` — mouse users should not see rings, keyboard users must.
- **Never `outline: none` without a designed replacement.** This is the most common accessibility failure on design-forward sites.
- `outline-offset` is what makes a focus ring look designed rather than bolted on.
- Hit targets **44x44px minimum** (WCAG 2.5.5). A 20px icon button needs invisible padding or a `::before` expander.
- Pressed state should move: `transform: scale(0.97)` or `translateY(1px)`. Motion confirms the press faster than color.

---

## 8. Responsive strategy

**Design the 1440 and the 375 first**, then verify the awkward middle (768–1024) where most layouts break.

Prefer **intrinsic** layout over breakpoints — fewer media queries is a quality signal:

```css
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
  gap: var(--space-5);
}
```

Use **container queries** for components that appear in multiple widths:

```css
.card-wrap { container-type: inline-size; }
@container (min-width: 480px) { .card { grid-template-columns: 1fr 2fr; } }
```

Breakpoints, when you do need them: `640 / 768 / 1024 / 1280 / 1536`.

**What actually changes at mobile on a design-forward site:**
- Display type drops about 40%, tracking loosens toward `-0.02em`.
- Section padding halves.
- Horizontal-pin sections become vertical stacks (`ScrollTrigger.matchMedia`, not CSS).
- Custom cursor is disabled entirely (`@media (hover: hover) and (pointer: fine)`).
- WebGL either drops a quality tier or falls back to the poster.
- Anything hover-dependent gets a tap-visible equivalent.

---

## 9. The 60-second sanity check

Before you call a layout done:

1. Squint. Does one thing clearly dominate? If everything is equally loud, nothing is.
2. Is there **any** display type over 60px? Award sites are not shy.
3. Is display tracking negative? Is display line-height under 1.1?
4. Is body copy between 45–75ch?
5. Count colors. More than one accent plus tinted neutrals? Cut.
6. Are section gaps at least 96px on desktop?
7. Is anything symmetric that could be asymmetric?
8. Do all shadows imply the same light source?
9. Tab through it. Can you see where you are, always?
10. Is there one moment on the page that a person would screenshot?

If you cannot answer 10 with something specific, you have a template, not a site.
