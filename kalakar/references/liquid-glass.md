# Liquid Glass & Material Design Language

The dominant surface language of 2025–2026. Apple shipped it across all platforms at WWDC 2025; the web caught up within weeks. It is now the fastest way to make an interface read as *current* — and the fastest way to make it read as *derivative* if you apply it without understanding what it is.

**Read this when the brief calls for depth, translucency, premium hardware feel, or "make it look like the new Apple UI."** Also read the "Cousin materials" section at the bottom before defaulting to glass — glass is one material among nine, and it is currently the most over-used.

---

## 1. What Liquid Glass actually is

Most "glassmorphism" on the web is one line: `backdrop-filter: blur(12px)` plus a white tint. That is **frosted glass** — light passing through a diffuser. It is flat, and it has looked dated since about 2021.

Liquid Glass is a *lens*, not a filter. Real glass does four things a blur does not:

| Property | What it means | How you fake it |
|---|---|---|
| **Refraction (lensing)** | Light bends at the edges — the backdrop appears *displaced and magnified* near the rim, undistorted in the middle | SVG `feDisplacementMap` on the backdrop, or a WebGL transmission material |
| **Specular highlight** | A bright rim where the light source grazes the curved edge | Layered `inset` box-shadows, brightest on the light-source side |
| **Adaptive tint** | The material samples what is behind it and shifts its own tint and contrast to stay legible | `saturate()` + `brightness()` in the backdrop filter, plus a light/dark variant |
| **Motion response** | It squishes, flexes, and re-lenses as it moves or as you drag across it | Animating displacement `scale` and highlight angle |

The **refraction at the edge** is the single thing that separates it from 2019 glassmorphism. If you only implement one thing beyond blur, implement the edge.

### The anatomy, back to front

```
  [4] Content            <- text/icons, must clear contrast on their own
  [3] Specular rim       <- inset highlights, gradient border, light-source-aware
  [2] Tint + saturation  <- thin color wash, adaptive to backdrop luminance
  [1] Refraction + blur  <- backdrop-filter: url(#displace) blur() saturate()
  ---------------------------------------------------------------
  [0] Backdrop           <- whatever is behind: image, gradient, WebGL, video
```

**Glass over nothing is invisible.** The material only exists in relation to a backdrop with structure. Glass panels on a flat white page are just gray boxes — you need an image, a mesh gradient, a video, or a WebGL scene behind them or the whole effect is wasted.

---

## 2. Tier 1 — CSS only (ship this as the baseline, always)

Works everywhere `backdrop-filter` works, which is all current browsers. This is your floor.

```css
.glass {
  position: relative;
  isolation: isolate;
  border-radius: var(--radius-2xl, 28px);

  /* [1] the backdrop treatment */
  -webkit-backdrop-filter: blur(16px) saturate(180%) brightness(1.06);
          backdrop-filter: blur(16px) saturate(180%) brightness(1.06);

  /* [2] the tint — thin. If you can obviously see the color, it is too much */
  background: color-mix(in oklab, var(--glass-tint, white) 12%, transparent);

  /* [3] the specular rim — light from the top-left */
  box-shadow:
    inset  1px  1px 0 0 rgb(255 255 255 / 0.55),   /* hot edge, light side  */
    inset -1px -1px 0 0 rgb(255 255 255 / 0.18),   /* cool edge, shade side */
    inset  0    0   24px 0 rgb(255 255 255 / 0.06),/* interior bloom        */
    0 2px 8px   -2px rgb(0 0 0 / 0.16),            /* contact shadow        */
    0 16px 48px -12px rgb(0 0 0 / 0.22);           /* ambient shadow        */

  border: 1px solid rgb(255 255 255 / 0.14);
}
```

Three details that do most of the work and that almost every implementation misses:

1. **`saturate(180%)`.** Blur desaturates. Pushing saturation back up is what makes the backdrop read as *seen through glass* rather than *fogged out*. This one function is the difference between "premium" and "muddy."
2. **Asymmetric inset highlights.** `0.55` alpha on the light side, `0.18` on the shade side. A symmetric rim reads as a flat stroke; an asymmetric one reads as a curved bevel catching a light source.
3. **Two shadows, not one.** A tight contact shadow plus a wide ambient shadow. See `design-system.md` section 6.

### The gradient rim (better than a flat border)

A real bead of glass catches light unevenly along its edge. Use a masked gradient border:

```css
.glass::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    var(--rim-angle, 135deg),
    rgb(255 255 255 / 0.7) 0%,
    rgb(255 255 255 / 0.1) 35%,
    rgb(255 255 255 / 0.05) 65%,
    rgb(255 255 255 / 0.45) 100%
  );
  /* punch out the middle so only the 1px ring paints */
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
```

### Making the rim track the pointer

Register the angle as a typed custom property so it can be animated by the compositor rather than re-parsed each frame:

```css
@property --rim-angle {
  syntax: "<angle>";
  inherits: false;
  initial-value: 135deg;
}
.glass { transition: --rim-angle 400ms cubic-bezier(0.16, 1, 0.3, 1); }
```

```js
card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  const x = e.clientX - r.left - r.width / 2;
  const y = e.clientY - r.top - r.height / 2;
  const deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
  card.style.setProperty("--rim-angle", `${deg}deg`);
});
```

Now the highlight sweeps around the rim as the cursor circles it. This is the "liquid" in Liquid Glass — the material responds.

---

## 3. Tier 2 — Real refraction with an SVG displacement filter

This is the actual technique. `backdrop-filter` accepts a `url()` reference to an SVG filter, which means you can run `feDisplacementMap` **over the backdrop**, physically bending what is behind the panel.

### The displacement map

`feDisplacementMap` reads two channels as a vector field. Neutral is `128` (mid-gray) — no displacement. Higher red pushes right, lower pushes left; green does the same vertically.

So the map you want is: **neutral in the middle, ramping to extremes at the edges.** Build it as an inline SVG:

```html
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <!-- the displacement map, drawn as an image -->
    <filter id="lens" x="0%" y="0%" width="100%" height="100%"
            color-interpolation-filters="sRGB">
      <feImage
        href="data:image/svg+xml;utf8,
          <svg xmlns='http://www.w3.org/2000/svg' width='300' height='200'>
            <defs>
              <linearGradient id='rx' x1='0' y1='0' x2='1' y2='0'>
                <stop offset='0%' stop-color='%23000000'/>
                <stop offset='100%' stop-color='%23FF0000'/>
              </linearGradient>
              <linearGradient id='gy' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stop-color='%23000000'/>
                <stop offset='100%' stop-color='%2300FF00'/>
              </linearGradient>
            </defs>
            <rect width='300' height='200' fill='%23808080'/>
            <rect width='300' height='200' fill='url(%23rx)' style='mix-blend-mode:screen'/>
            <rect width='300' height='200' fill='url(%23gy)' style='mix-blend-mode:screen'/>
            <rect x='16' y='16' width='268' height='168' rx='28' fill='%23808080'/>
          </svg>"
        result="map" />
      <feGaussianBlur in="map" stdDeviation="6" result="softmap" />
      <feDisplacementMap
        in="SourceGraphic" in2="softmap"
        scale="44"
        xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>
```

```css
.glass--refract {
  backdrop-filter: url(#lens) blur(6px) saturate(180%);
}
```

**How the map works, line by line:**
- `#808080` base = neutral, no displacement.
- Red gradient screened across X = displacement ramps left-to-right.
- Green gradient screened down Y = displacement ramps top-to-bottom.
- The **inner rounded rect back to `#808080`** flattens the center — so only a ~16px rim displaces. That is the lens.
- `feGaussianBlur` on the map softens the transition so the refraction eases instead of stepping.
- `scale` is the refraction strength. 20 = subtle. 44 = clearly glass. 90+ = funhouse mirror.

### Chromatic aberration (the finishing touch)

Real lenses split wavelengths at the edge. Run the displacement three times at slightly different scales and recombine per channel:

```xml
<filter id="lens-chroma" color-interpolation-filters="sRGB">
  <feImage href="...same map..." result="map"/>
  <feGaussianBlur in="map" stdDeviation="6" result="m"/>

  <feDisplacementMap in="SourceGraphic" in2="m" scale="48"
    xChannelSelector="R" yChannelSelector="G" result="dR"/>
  <feDisplacementMap in="SourceGraphic" in2="m" scale="44"
    xChannelSelector="R" yChannelSelector="G" result="dG"/>
  <feDisplacementMap in="SourceGraphic" in2="m" scale="40"
    xChannelSelector="R" yChannelSelector="G" result="dB"/>

  <feColorMatrix in="dR" type="matrix" result="rOnly"
    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feColorMatrix in="dG" type="matrix" result="gOnly"
    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feColorMatrix in="dB" type="matrix" result="bOnly"
    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>

  <feBlend in="rOnly" in2="gOnly" mode="screen" result="rg"/>
  <feBlend in="rg"    in2="bOnly" mode="screen"/>
</filter>
```

A 4-unit spread between channels is plenty. More than about 10 and it stops looking like glass and starts looking like a broken monitor.

### Browser reality — this is the part you must handle

`backdrop-filter: url(#svg-filter)` is **Chromium-only** as of early 2026. Safari supports `backdrop-filter` but ignores SVG filter references in it. Firefox likewise.

So: **Tier 1 is the design. Tier 2 is a bonus.** Never build a layout whose legibility depends on refraction. Feature-detect and opt in:

```js
const supportsSvgBackdrop =
  CSS.supports("backdrop-filter", "url(#lens)") &&
  !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);

if (supportsSvgBackdrop) document.documentElement.classList.add("has-refraction");
```

```css
.glass { backdrop-filter: blur(16px) saturate(180%); }          /* everyone */
.has-refraction .glass { backdrop-filter: url(#lens) blur(6px) saturate(180%); }
```

`CSS.supports` returns true optimistically in some engines that then no-op, which is why the UA check is there. It is ugly; it is also the only thing that works today. Re-test when Safari ships it and delete the branch.

---

## 4. Tier 3 — WebGL transmission (the real thing)

When glass is the *signature moment* rather than chrome — a 3D object, a hero centerpiece, a product render — use actual transmission in R3F. This gives you true IOR, thickness-based absorption, roughness, and dispersion.

```jsx
import { MeshTransmissionMaterial, Environment, Float } from "@react-three/drei";

<Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
  <mesh geometry={geometry}>
    <MeshTransmissionMaterial
      transmission={1}
      thickness={1.4}
      roughness={0.08}
      ior={1.48}            /* 1.5 = crown glass, 1.33 = water, 2.4 = diamond */
      chromaticAberration={0.06}
      anisotropy={0.15}
      distortion={0.35}
      distortionScale={0.4}
      temporalDistortion={0.15}
      backside
      samples={8}           /* 4 on mobile, 16 for stills */
      resolution={512}
    />
  </mesh>
</Float>
<Environment preset="city" />
```

Non-negotiables for WebGL glass:

- **It needs an environment map.** Transmission with no `<Environment>` renders as a gray blob — there is nothing to refract. An HDRI from Poly Haven, or `<Environment preset="city" />`, or a `<Lightformer>` rig.
- **`backside` doubles the render cost.** Gorgeous on a hero object, unaffordable on twenty.
- **`samples` and `resolution` are your perf dials.** Drop both a tier on `detect-gpu` tier < 3.
- **Never put HTML text behind it and expect it to be readable.** Refracted text is illegible by definition.

For a cheap non-3D approximation of the same look, `@paper-design/shaders-react` has drop-in components you can put behind a Tier-1 glass panel — that combination gets you 80% of the impression for 5% of the cost.

---

## 5. Legibility — the hard part, and where most glass UI fails

Glass is a variable background. Text over a variable background has variable contrast. **This is an accessibility failure waiting to happen**, and it is why Apple's own first betas were criticized and then walked back.

### The rules

1. **Never put body copy directly on glass over an arbitrary backdrop.** Glass is for chrome — nav bars, floating controls, badges, cards over a *known* backdrop you control.

2. **Give the text its own contrast floor.** A scrim under the text, inside the glass:

```css
.glass__content {
  position: relative;
}
.glass__content::before {
  content: "";
  position: absolute;
  inset: -8% -4%;
  border-radius: inherit;
  background: radial-gradient(120% 100% at 50% 50%,
    rgb(0 0 0 / 0.34) 0%, rgb(0 0 0 / 0) 70%);
  z-index: -1;
}
```

3. **Increase blur until contrast is guaranteed.** Blur radius is a contrast dial: a 40px blur flattens the backdrop into near-uniform color and the text becomes reliable. 8px blur over a photo is unreadable. If you need legibility, blur harder.

4. **Ship an on-light and an on-dark variant.** True adaptivity needs backdrop sampling; variants are 95% as good for 1% of the cost.

```css
.glass--on-dark {
  --glass-tint: white;
  background: rgb(255 255 255 / 0.10);
  backdrop-filter: blur(20px) saturate(180%) brightness(1.35);
  color: oklch(0.98 0.005 258);
}
.glass--on-light {
  --glass-tint: black;
  background: rgb(255 255 255 / 0.55);
  backdrop-filter: blur(20px) saturate(180%) brightness(0.94);
  color: oklch(0.22 0.014 258);
}
```

5. **If you genuinely need adaptivity**, sample the backdrop once (not per frame) with a small canvas, compute relative luminance, and swap the variant class:

```js
// Sample on load + on scroll-end / resize. NEVER inside rAF.
function backdropIsDark(canvasCtx, x, y, w, h) {
  const { data } = canvasCtx.getImageData(x, y, w, h);
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
  }
  return sum / (data.length / 4) < 128;
}
```

6. **Honor `prefers-reduced-transparency`.** Real users turn this on because translucency makes them nauseous or because they cannot read it.

```css
@media (prefers-reduced-transparency: reduce) {
  .glass {
    backdrop-filter: none;
    background: var(--surface-raised);
    border-color: var(--hairline-color);
  }
}
@media (prefers-contrast: more) {
  .glass {
    backdrop-filter: blur(24px);
    background: var(--surface);
    border: 1px solid var(--ink);
  }
}
```

---

## 6. Performance — glass is genuinely expensive

`backdrop-filter` forces the compositor to snapshot everything behind the element, run a filter over it, and composite the result — **every frame the backdrop changes.** With a moving backdrop (video, WebGL, parallax) that is 60 full-viewport filter passes per second.

### Budget

- **Aim for 1–3 glass surfaces on screen at once.** A nav bar plus a floating card. Not a grid of twelve glass tiles.
- **Never animate an element that has `backdrop-filter` across a moving backdrop** unless you have measured it. Animating the glass *and* the backdrop is the single most reliable way to drop to 20fps on a mid-tier laptop.
- A glass nav over static content is nearly free. A glass card over a playing video is not.

### Mitigations

```css
.glass {
  /* stop the browser re-filtering things it does not need to */
  contain: paint;
  /* promote once, deliberately */
  will-change: backdrop-filter;
  /* fixes the Safari overflow/rounded-corner bleed bug */
  -webkit-transform: translateZ(0);
}
```

- Drop `blur()` radius on mobile — blur cost scales with radius *and* device pixel ratio. `blur(16px)` at DPR 3 is a 48px kernel.
- Gate refraction (Tier 2) and transmission (Tier 3) behind `detect-gpu` tier >= 3.
- If a glass panel is over a static backdrop and never moves, consider baking it: screenshot the composite once and ship an image. Unglamorous; sometimes correct.
- Watch for the Safari bug where `backdrop-filter` on a child of an element with `border-radius` + `overflow: hidden` leaks past the corners. Fix with `isolation: isolate` on the parent, or `translateZ(0)` on the glass.

### Known-good defaults

| Context | blur | saturate | Notes |
|---|---|---|---|
| Nav bar over content | 12–16px | 180% | Cheapest, most useful glass on the web |
| Floating card over image | 20–28px | 170% | Blur high enough for text |
| Modal / sheet backdrop | 32–48px | 120% | Blur is the point; near-opaque |
| Small badge / pill | 8–12px | 200% | Small area, can afford saturation |
| Over playing video | 24px+ | 150% | Measure. Consider a static poster behind instead |

---

## 7. When NOT to use glass

Glass is a *chrome* material. It fails as a *content* material.

**Do not use it:**
- For long-form reading surfaces. Body copy needs a stable background.
- In dense data UI — tables, dashboards, forms. Translucency destroys row scanability.
- Over busy photography without a heavy blur and a scrim.
- On more than a handful of surfaces at once. Everything translucent means no hierarchy — translucency *is* the hierarchy signal.
- When the brand is editorial, brutalist, print-led, or craft/handmade. Glass reads as "tech product." It will actively fight a bakery, a law firm, a literary magazine, a ceramics studio.
- When there is no interesting backdrop. Glass over flat white is a gray rectangle with extra GPU cost.

**Do use it:**
- Floating navigation and toolbars over scrolling content.
- Media controls over video.
- Cards floating over a WebGL / mesh-gradient hero.
- Modals and sheets.
- Anything meant to read as hardware, spatial, OS-like, or premium-device.

---

## 8. Cousin materials — the rest of the palette

Glass is 2026's default, which means it is also 2026's cliche. These give you the same "considered material" quality without the sameness. Pick the one that matches the brand, not the one that is trending.

### Soft-body / squish
Objects deform on interaction. Reads playful, tactile, toy-like.
```css
.squish { transition: transform 420ms cubic-bezier(0.34, 1.56, 0.64, 1); }
.squish:active { transform: scale(0.94) scaleY(0.9); }
```
Pair with a spring easing that overshoots. Great for consumer apps, kids' brands, food, games.

### Brushed metal
Anisotropic highlight — a bright band perpendicular to the grain.
```css
.metal {
  background:
    repeating-linear-gradient(96deg,
      rgb(255 255 255 / 0.035) 0 1px, transparent 1px 3px),
    linear-gradient(96deg, #6f7480 0%, #cfd4dd 42%, #8c929e 58%, #5b606b 100%);
}
```
Audio hardware, watches, automotive, industrial, crypto-serious.

### Paper / riso
Grain, slight misregistration, limited spot colors, multiply blending.
```css
.riso { mix-blend-mode: multiply; filter: contrast(1.1); }
/* + an SVG feTurbulence grain overlay at 6-10% opacity */
```
Publishing, culture, NGOs, music, indie, anything anti-tech.

### Holographic / iridescent
Hue shifts with viewing angle. `conic-gradient` plus a hue-rotating overlay.
```css
.holo {
  background: conic-gradient(from var(--a, 0deg),
    #ff6ec7, #7873f5, #4ade80, #fde047, #ff6ec7);
  filter: saturate(1.4) blur(0.5px);
  mix-blend-mode: color-dodge;
}
```
Sneakers, streetwear, web3, music, collectibles. Wears out fast — use once.

### Dithered / halftone
Bayer or blue-noise dithering to a 2–4 color palette. Retro-technical, print-derived.
Use `@paper-design/shaders-react` `Dithering`, or a GLSL 8x8 Bayer matrix.
Games, dev tools, terminal-aesthetic brands, experimental.

### Clay / soft 3D
Matte, high-radius, soft double shadows, no specular. The Blender-render look.
```css
.clay {
  border-radius: 28px;
  background: linear-gradient(160deg, #f0eefb, #dcd8f0);
  box-shadow:
     18px 18px 36px rgb(180 176 205 / 0.55),
    -14px -14px 30px rgb(255 255 255 / 0.9),
    inset -4px -4px 12px rgb(255 255 255 / 0.55),
    inset  4px  4px 12px rgb(180 176 205 / 0.35);
}
```
Fintech consumer, education, health, wellness. Note: this is neumorphism, which has real contrast problems — keep it decorative, never load-bearing for controls.

### Neon / bloom
Emissive edges with a colored glow, on near-black.
```css
.neon {
  color: oklch(0.9 0.2 195);
  text-shadow: 0 0 8px currentColor, 0 0 28px currentColor, 0 0 60px currentColor;
  box-shadow: 0 0 0 1px currentColor, 0 0 32px -4px currentColor;
}
```
Nightlife, gaming, esports, music. Real bloom needs WebGL postprocessing (`@react-three/postprocessing` `Bloom`).

### Raw / brutalist
No material at all. Hairline rules, system-adjacent type, hard edges, zero radius, monospace metadata, visible grid. The strongest counter-move when everyone else is doing glass.

### Liquid metal / chrome
Mirror-like reflection of a distorted environment. Real version is `MeshReflectorMaterial` or a high-metalness / low-roughness PBR material with a strong HDRI. Fake version is an animated conic gradient with heavy blur and contrast. The Y2K revival material.

---

## 9. Copy-paste starter

A complete, self-contained glass component with all four layers, pointer-reactive rim, and graceful degradation lives in `kit/glass.css` and `kit/glass-filters.svg`. Import it and you have Tier 1 + Tier 2 with feature detection already wired.

```html
<link rel="stylesheet" href="kit/tokens.css">
<link rel="stylesheet" href="kit/glass.css">
<div hidden id="glass-filters"><!-- inline glass-filters.svg here --></div>

<div class="glass glass--on-dark" data-glass-reactive>
  <div class="glass__content">…</div>
</div>
```

```js
import { initGlass } from "./kit/glass.js";
initGlass(); // feature-detects refraction, wires pointer-reactive rims
```
