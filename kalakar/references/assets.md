# Assets — Generate, Source, Optimize

A design-forward site is 80% assets by weight and roughly 100% by perceived quality. The most common failure mode when an agent builds a site is not bad CSS — it is **gray placeholder boxes and Lorem ipsum**, which make even excellent layout read as unfinished.

**The hierarchy: generate > source > commission > placeholder.** Reach for the leftmost option you can.

---

## 1. Generate — assets you can produce with zero dependencies

These cost nothing, ship as text, scale infinitely, and are unique to the project. Prefer them.

### Grain / film noise

The single highest-impact-per-byte asset in existence. A 4–8% grain overlay makes flat gradients look like film, kills banding, and adds instant "designed" texture.

```html
<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0">
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
    <feColorMatrix type="saturate" values="0"/>
  </filter>
</svg>
```

```css
.grain::after {
  content: "";
  position: fixed;
  inset: -50%;               /* oversize so the animated jitter never exposes an edge */
  pointer-events: none;
  z-index: 9999;
  opacity: 0.055;
  filter: url(#grain);
  background: #fff;
  mix-blend-mode: overlay;
}
```

Animated grain (steps the position 8x/sec so it reads as film, not a static texture):

```css
@keyframes grain-shift {
  0%,100% { transform: translate(0,0) }      10% { transform: translate(-3%,-4%) }
  20% { transform: translate(-8%,2%) }       30% { transform: translate(3%,-9%) }
  40% { transform: translate(-3%,7%) }       50% { transform: translate(-8%,3%) }
  60% { transform: translate(6%,0) }         70% { transform: translate(0,6%) }
  80% { transform: translate(4%,-3%) }       90% { transform: translate(-4%,4%) }
}
.grain::after { animation: grain-shift 0.9s steps(1) infinite; }
```

`steps(1)` is essential — smooth interpolation makes it look like a sliding texture instead of film grain.

**Baseline values:** `baseFrequency` 0.6–0.9 (higher = finer), opacity 0.03–0.08. Above 0.1 it reads as a broken screen. Disable under `prefers-reduced-motion` (the animation, not the grain).

### Mesh gradients

```css
.mesh {
  background-color: oklch(0.22 0.03 265);
  background-image:
    radial-gradient(at 18% 22%, oklch(0.55 0.20 275 / 0.55) 0px, transparent 55%),
    radial-gradient(at 82% 12%, oklch(0.62 0.17 200 / 0.45) 0px, transparent 50%),
    radial-gradient(at 68% 82%, oklch(0.48 0.22 320 / 0.40) 0px, transparent 55%),
    radial-gradient(at 12% 78%, oklch(0.58 0.15 165 / 0.30) 0px, transparent 45%);
}
```

Four to six radial stops, each `at` a different percentage, each fading to `transparent`. Layer grain on top or it will band on gradients. Animate by tweening the `at` positions with `@property`-registered custom properties.

For a shader-quality version with zero GLSL: `@paper-design/shaders-react` `<MeshGradient />`.

### Dot / line / cross grids

```css
.dots {
  background-image: radial-gradient(circle at 1px 1px,
    color-mix(in oklab, var(--ink) 18%, transparent) 1px, transparent 0);
  background-size: 24px 24px;
}
.hatch {
  background-image: repeating-linear-gradient(45deg,
    transparent 0 6px, color-mix(in oklab, var(--ink) 8%, transparent) 6px 7px);
}
```

Mask them with a radial gradient so they fade out rather than stopping at a hard edge:

```css
.dots { mask-image: radial-gradient(ellipse 80% 60% at 50% 40%, #000 30%, transparent 75%); }
```

### Noise / texture PNG at build time

When you need a raster noise texture (for WebGL, or to avoid an SVG filter's cost), generate it in Node once:

```js
// scripts/gen-noise.mjs
import sharp from "sharp";
const S = 256;
const buf = Buffer.alloc(S * S * 4);
for (let i = 0; i < S * S; i++) {
  const v = Math.floor(Math.random() * 256);
  buf[i * 4] = buf[i * 4 + 1] = buf[i * 4 + 2] = v;
  buf[i * 4 + 3] = 255;
}
await sharp(buf, { raw: { width: S, height: S, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile("public/textures/noise-256.png");
```

**Blue noise** beats white noise for dithering (no visible clumping) — grab a pre-generated tile from Christoph Peters' public-domain set rather than implementing void-and-cluster.

### Everything else you can generate

| Asset | Technique |
|---|---|
| Duotone / halftone images | CSS `filter: grayscale(1)` + `mix-blend-mode` over a colored layer, or a GLSL halftone pass |
| Dithered images | 8x8 Bayer matrix in GLSL, or `@paper-design/shaders-react` `Dithering` |
| Blurred "orbs" | `filter: blur(80px)` on a colored circle. Cheap, effective, everywhere |
| SVG blob shapes | Cubic beziers around a circle with jittered radii; animate control points |
| ASCII art | `figlet` at build time, or canvas luminance sampling to characters |
| Favicons / OG images | `satori` + `resvg` (Vercel OG), or Playwright screenshot of an HTML template |
| Displacement maps | See `liquid-glass.md` section 3 |
| Waveforms | Web Audio `AnalyserNode` -> canvas, or `wavesurfer.js` |
| Placeholder portraits | Generative geometric avatars (`boring-avatars`) beat stock faces |

---

## 2. Source — where to actually get things, with licenses

### Photography (free, commercial-safe)

| Source | License | Notes |
|---|---|---|
| **Unsplash** | Unsplash License — free commercial, no attribution required | Largest, but the popular images are *everywhere*. Go 5 pages deep. |
| **Pexels** | Pexels License — free commercial | Better for lifestyle/people |
| **Openverse** | Aggregates CC — **check each result** | Some require attribution or forbid commercial use |
| **Wikimedia Commons** | Mixed CC / PD | Best for historical, architectural, scientific |
| **NASA Image Library** | Public domain | Space, earth, technical. Genuinely unused. |
| **Rijksmuseum / Met Open Access** | Public domain | Fine art at very high resolution. Excellent for editorial and luxury. |

**The stock-photo tell:** a smiling team around a laptop, a handshake, an arrow hitting a bullseye. If the image would work for any company, it works for none. Prefer abstract texture, architecture, materials, and detail crops over people, unless the people are the actual client.

**Make sourced photos yours:** apply a duotone, a grain overlay, a consistent crop ratio, and a unified grade. Six Unsplash photos with the same treatment read as a shoot; six untreated ones read as a mood board.

### 3D & HDRI

| Source | License |
|---|---|
| **Poly Haven** | CC0 — HDRIs, textures, models. The default. |
| **ambientCG** | CC0 — PBR materials |
| **Sketchfab** (CC filter) | Varies — filter to CC-BY/CC0 |
| **Quaternius** | CC0 — low-poly game-style |

Always run models through `@gltf-transform/cli` before shipping (section 4).

### Icons

| Source | License | Feel |
|---|---|---|
| **Lucide** | ISC | Clean, consistent, the safe default |
| **Phosphor** | MIT | 6 weights — thin weight is excellent for luxury |
| **Radix Icons** | MIT | 15px-optimized, crisp UI icons |
| **Tabler** | MIT | Huge set (4000+) |
| **Iconoir** | MIT | Distinctive, slightly editorial |

**Never mix icon families.** Stroke widths and corner treatments will not match and the inconsistency is visible even to non-designers. And **never use emoji as icons** on a design-forward site — they render differently on every OS and instantly cheapen the page.

### Type

| Source | Notes |
|---|---|
| **Fontshare** | Free for commercial use. **Satoshi, Clash Display, General Sans, Switzer, Cabinet Grotesk** — this is the single biggest free-type unlock for design-forward work. |
| **Google Fonts** | Free. Prefer variable versions. Instrument Serif, Fraunces, Inter, Bricolage Grotesque, Geist. |
| **Fontsource** | npm packages for self-hosting Google Fonts. `@fontsource-variable/inter`. |
| **Velvetyne / Collletttivo / Uncut.wtf** | Free, weird, characterful. Where you go when everything looks the same. |
| **Klim / Pangram / Grilli / Displaay** | Paid. Where the actual agency sites get their type. Budget $200–600/family. |

**Self-host. Always.** Google Fonts' CDN adds a DNS lookup, a connection, and a render-blocking request, and it is a GDPR problem in the EU. `npm i @fontsource-variable/inter` and it is a local file.

### Motion & illustration

| Source | Notes |
|---|---|
| **Rive Community** | Free `.riv` files. Stateful, interactive, tiny. Better than Lottie for anything reactive. |
| **LottieFiles** | Large free library. Serve as `.lottie` via `@lottiefiles/dotlottie-web` — 70% smaller than `lottie-web`. |
| **Blush / DrawKit / Humaaans** | Free illustration sets. Recolor to brand or they look borrowed. |

### Video

| Source | Notes |
|---|---|
| **Pexels Video / Coverr / Mixkit** | Free commercial background loops |
| **Mux** | Paid hosting + adaptive streaming. What studios actually use for hero video. |
| **Cloudflare Stream** | Cheaper alternative, good enough |

Never serve a raw `.mp4` over 3MB from your own origin as a hero. See section 4 for the encode.

### Sound

| Source | Notes |
|---|---|
| **Freesound** | CC — check per-sound license |
| **Zapsplat / Pixabay Audio** | Free with terms |
| **Soundstripe / Artlist** | Paid, cleared for commercial |

UI sound effects must be **under 200ms and under 20KB**. Default muted, always. See `building-blocks.md`.

---

## 3. AI-generated imagery — when and how

**Fine for:** abstract textures, backgrounds, material studies, mood/atmosphere plates, concept illustration, pattern generation.
**Risky for:** anything the user will read as documentary — people, products, food, real places, team photos. If it depicts something claimed to be real, do not generate it.

If you do generate:
- **Consistency beats quality.** Six images from one prompt template with one seed family look like art direction. Six great images in six styles look like a demo of an image generator.
- Push toward **texture, macro, abstraction, and material** rather than scenes with people. The tells (hands, text, symmetry, eyes) live in scenes.
- Always post-process: grade, grain, crop to your ratio canon. Raw output has a recognizable look.
- Check the model's commercial terms, and disclose to the client.

---

## 4. Optimize — the pipeline with actual commands

### Raster images

Order of preference: **AVIF -> WebP -> JPEG**. Always in a `<picture>` with responsive `srcset`.

```bash
npm i -D sharp
```

```js
// scripts/images.mjs — resize + encode a whole directory
import sharp from "sharp";
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";

const WIDTHS = [480, 768, 1200, 1920, 2560];
const SRC = "assets/raw", OUT = "public/img";
await mkdir(OUT, { recursive: true });

for (const file of await readdir(SRC)) {
  const name = path.parse(file).name;
  const img = sharp(path.join(SRC, file));
  const meta = await img.metadata();
  for (const w of WIDTHS) {
    if (w > meta.width) continue;
    await img.clone().resize(w).avif({ quality: 55, effort: 6 })
      .toFile(`${OUT}/${name}-${w}.avif`);
    await img.clone().resize(w).webp({ quality: 76 })
      .toFile(`${OUT}/${name}-${w}.webp`);
  }
  // LQIP: 20px wide, blurred, inlined as a data URI
  const lqip = await img.clone().resize(20).blur(1.2).webp({ quality: 25 }).toBuffer();
  console.log(name, `data:image/webp;base64,${lqip.toString("base64")}`);
}
```

**Quality settings that hold up:** AVIF `q 50–60` is visually lossless for photos and roughly half the size of WebP `q 80`. Do not ship AVIF above `q 70` — you lose the whole advantage. Use `effort: 6+` for build-time encodes (slow to encode, smaller output, free at runtime).

```html
<picture>
  <source type="image/avif" srcset="/img/hero-768.avif 768w, /img/hero-1200.avif 1200w, /img/hero-1920.avif 1920w" sizes="100vw">
  <source type="image/webp" srcset="/img/hero-768.webp 768w, /img/hero-1200.webp 1200w, /img/hero-1920.webp 1920w" sizes="100vw">
  <img src="/img/hero-1200.webp" alt="…" width="1920" height="1080"
       fetchpriority="high" decoding="async">
</picture>
```

- `width`/`height` on **every** `<img>`. Free CLS prevention.
- `fetchpriority="high"` on the LCP image, `loading="lazy"` on everything below the fold. Never `loading="lazy"` on the LCP image — it delays it.
- `decoding="async"` everywhere except the LCP image.

### SVG

```bash
npx svgo -f assets/svg -o public/svg --multipass
```

Then by hand: strip `width`/`height` (keep `viewBox`), set `fill="currentColor"` so CSS can drive it, and give it a `<title>` if it is meaningful or `aria-hidden="true"` if decorative. Inline SVGs under ~2KB directly in the markup — a request costs more than the bytes.

### Video

```bash
# Hero background loop: silent, 1080p, small
ffmpeg -i input.mov \
  -vf "scale=1920:-2,fps=25" \
  -c:v libx264 -profile:v high -crf 26 -preset slow \
  -movflags +faststart -pix_fmt yuv420p -an \
  public/video/hero.mp4

# Modern codec, ~40% smaller — serve first with <source>
ffmpeg -i input.mov -vf "scale=1920:-2,fps=25" \
  -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -an \
  public/video/hero.webm

# The poster — this is your LCP element, not the video
ffmpeg -i input.mov -ss 00:00:01 -vframes 1 -q:v 2 assets/raw/hero-poster.jpg
```

`-movflags +faststart` moves the MP4 index to the front so playback starts before the file finishes downloading. Without it, a hero video can hang for seconds. **A hero loop should be under 2MB.** If it is not, shorten it — 6 seconds looping well beats 20 seconds buffering.

```html
<video autoplay muted loop playsinline preload="metadata" poster="/img/hero-poster.avif">
  <source src="/video/hero.webm" type="video/webm">
  <source src="/video/hero.mp4" type="video/mp4">
</video>
```

`muted` **and** `playsinline` are both required for iOS autoplay. Missing `playsinline` means the video opens fullscreen on iPhone.

### Fonts

```bash
# Subset a variable font to latin + the glyphs you use — often 400KB -> 60KB
npx glyphhanger --subset="fonts/Satoshi-Variable.ttf" --formats=woff2 \
  --whitelist="U+0020-007E,U+00A0-00FF,U+2018,U+2019,U+201C,U+201D,U+2013,U+2014"
```

```css
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/satoshi-var.woff2") format("woff2-variations");
  font-weight: 300 900;
  font-display: swap;
  unicode-range: U+0000-00FF, U+2013-2014, U+2018-201D;
  /* metric overrides kill CLS on swap — generate with `fontaine` or `capsize` */
  ascent-override: 96%;
  descent-override: 24%;
  line-gap-override: 0%;
}
```

```html
<link rel="preload" href="/fonts/satoshi-var.woff2" as="font" type="font/woff2" crossorigin>
```

Preload **only** the fonts used above the fold — usually one. Preloading five fonts competes with your LCP image for bandwidth and makes things worse.

### 3D models

```bash
npm i -D @gltf-transform/cli
npx gltf-transform optimize input.glb output.glb \
  --compress draco --texture-compress webp --texture-size 1024
```

Routinely 80–95% size reduction. A 12MB `.glb` becomes 800KB with no visible difference at web scale. Ship Draco and lazy-load the decoder.

---

## 5. Directory structure

```
assets/                  # sources, NOT shipped
  raw/                   # original photos/video
  fonts/                 # original font files
  models/                # original .glb/.blend
public/
  img/                   # generated avif/webp at all widths
  video/                 # encoded mp4/webm + posters
  fonts/                 # subset woff2 only
  models/                # optimized .glb
  textures/              # generated noise, HDRIs
scripts/
  images.mjs  gen-noise.mjs  og.mjs
```

Never ship `assets/`. Add it to `.gitignore` if the sources are large, and keep a manifest of where each came from + its license.

### The license manifest — do this, it takes 5 minutes

```
# assets/CREDITS.md
| File | Source | URL | License | Attribution required |
|---|---|---|---|---|
| hero.jpg | Unsplash | unsplash.com/photos/abc | Unsplash License | No |
| Satoshi | Fontshare | fontshare.com/fonts/satoshi | Fontshare (free commercial) | No |
| studio.hdr | Poly Haven | polyhaven.com/a/studio | CC0 | No |
```

Six months later, when a client asks whether they can use the site in print, this file is the difference between a five-minute answer and a re-shoot.

---

## 6. Placeholder discipline

**Never show a client, a stakeholder, or a review a page containing `Lorem ipsum` or gray boxes.** People cannot evaluate layout through placeholder content; they will read "unfinished" as "bad."

Instead:
- **Write real-sounding copy.** Even if it is provisional, make it about the actual business, in the actual voice, at the actual length. Wrong-length copy breaks layouts you thought worked.
- **Use real images** from the sourcing list, treated to the brand grade. Even approximate imagery communicates the direction.
- **Real names, real numbers, real dates.** `"Meridian Structural, Kolkata — 2024"` teaches you more about your layout than `"Project Title — Year"`.
- If content genuinely does not exist yet, design the **empty state** deliberately. That is a real design artifact.

Length-testing rule: build every text component with **the shortest and the longest plausible content**. A card designed around a 4-word title will break on the 11-word one that ships.

---

## 7. Asset checklist before ship

- [ ] Every image has `width`, `height`, and meaningful `alt` (or `alt=""` if decorative).
- [ ] LCP image is `fetchpriority="high"`, preloaded, and **not** lazy.
- [ ] AVIF + WebP with `srcset`/`sizes` for every non-trivial image.
- [ ] Total image weight above the fold under 500KB.
- [ ] Hero video under 2MB, `muted playsinline`, poster is the LCP element.
- [ ] Fonts subset, self-hosted, woff2, metric-overridden, max 2 families.
- [ ] Exactly one font preloaded.
- [ ] All SVGs run through svgo; decorative ones `aria-hidden`.
- [ ] 3D models through `gltf-transform`, under 1.5MB.
- [ ] Grain/texture overlays are `pointer-events: none` and do not intercept clicks.
- [ ] OG image (1200x630) and favicon set (`.ico`, 180 apple-touch, 192/512 PNG, `site.webmanifest`) exist.
- [ ] `assets/CREDITS.md` complete; nothing shipped without a license you have verified.
- [ ] No `Lorem ipsum`, no `placeholder.com`, no `via.placeholder`, no gray boxes anywhere.
