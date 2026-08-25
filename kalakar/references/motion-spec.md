# Motion Specification — Durations, Easings, Choreography

`libraries.md` tells you *what to animate with*. This file tells you *what the numbers are*. Motion that feels expensive is not about using GSAP instead of CSS — it is about a 340ms duration instead of 300ms, an ease-out instead of an ease-in-out, and a 60ms stagger instead of 100ms.

**The rule that governs everything below: motion should feel like physics, not like a timer.** Real things have mass, accelerate, and settle. Linear motion and symmetric easing are the sound of a computer.

---

## 1. The duration ladder

Duration scales with **distance travelled and area changed**, not with importance.

| Token | ms | Use for |
|---|---|---|
| `--dur-1` | 120 | Color/opacity on small elements, icon swaps, checkbox |
| `--dur-2` | 180 | Button hover, tooltip in, small tap feedback |
| `--dur-3` | 260 | Dropdown, popover, small card lift, tab switch |
| `--dur-4` | 340 | **The default.** Card enter, section reveal, accordion |
| `--dur-5` | 480 | Modal, drawer, large panel, page-level element |
| `--dur-6` | 640 | Full-screen overlay, nav takeover |
| `--dur-7` | 900 | Page transition, hero choreography step |
| `--dur-8` | 1400 | Cinematic — loader outro, signature moment |

**Calibration points:**
- Under 100ms reads as *instant* — the eye does not perceive it as motion. Fine for feedback, useless for delight.
- 200–500ms is the perceptual sweet spot. Almost everything on a marketing site lives here.
- Over 800ms feels slow **unless** the element travels a long distance or covers a lot of screen. A full-screen wipe at 900ms feels right; a button hover at 900ms feels broken.
- **Exits are 60–75% of entrances.** Entering wants to be seen; leaving wants to get out of the way. A modal that opens in 480ms should close in 320ms. Symmetric open/close is one of the most common tells of un-designed motion.

**Mobile:** cut durations about 20%. Smaller screens mean shorter travel distances; the same duration reads as sluggish.

---

## 2. Easing — the actual values

### The law

| Motion type | Easing | Why |
|---|---|---|
| **Entering** (appear, expand, fly in) | `ease-out` | Fast start, gentle settle. Arrives with confidence. |
| **Exiting** (dismiss, collapse, fly out) | `ease-in` | Gentle start, accelerates away. Gets out of the way. |
| **Moving** (reposition, morph, reorder) | `ease-in-out` | Accelerates and decelerates. Reads as a physical move. |
| **Scrubbed** (scroll-driven) | `linear` (`none`) | Position is already controlled by the user's input curve. |
| **Looping** (marquee, rotation, ambient) | `linear` | Any easing creates a visible pulse at the loop seam. |

**Getting this backwards is the most common motion bug on the web.** A menu that eases *in* on open feels laggy; a menu that eases *out* on close feels like it is fighting you.

### The curves worth knowing

```css
:root {
  /* --- standard --- */
  --ease-out-quad:   cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic:  cubic-bezier(0.33, 1, 0.68, 1);
  --ease-out-quart:  cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-expo:   cubic-bezier(0.16, 1, 0.3, 1);      /* THE studio ease */
  --ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-in-cubic:   cubic-bezier(0.32, 0, 0.67, 0);

  /* --- expressive --- */
  --ease-back-out:   cubic-bezier(0.34, 1.56, 0.64, 1);  /* overshoot, settles back */
  --ease-spring:     cubic-bezier(0.16, 1.36, 0.3, 1);   /* springier overshoot */
  --ease-anticipate: cubic-bezier(0.68, -0.55, 0.27, 1.55); /* pulls back, then goes */

  /* --- system --- */
  --ease-ios:        cubic-bezier(0.4, 0, 0.2, 1);       /* Material/iOS standard */
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);         /* Material 3 emphasized */
}
```

**`cubic-bezier(0.16, 1, 0.3, 1)` is the single highest-value curve in this file.** Near-instant start, long luxurious settle. It is on more Awwwards sites than any other easing. When in doubt, use it with `--dur-4` and you are already ahead of 90% of the web.

**`--ease-back-out` (overshoot) is for things that *land*** — a card snapping into place, a toggle flipping, a badge popping in. Never for something exiting; overshooting on the way out looks like a bug.

**Never `linear` on positional motion.** Never `ease` (the CSS default) — it is a mushy `ease-in-out` that suits nothing.

### Springs — when they beat bezier

Use a spring when the motion is **interruptible** (drag, gesture, rapid toggle) or when velocity should carry over. A bezier tween restarted mid-flight snaps; a spring absorbs it.

`motion` / Framer Motion:

```js
// physical model — preferred, tune stiffness/damping
{ type: "spring", stiffness: 260, damping: 26, mass: 1 }
```

| Feel | stiffness | damping | mass | Use |
|---|---|---|---|---|
| Stiff & snappy | 400 | 32 | 1 | Toggles, tabs, small UI |
| **Default UI** | 260 | 26 | 1 | Cards, popovers, most things |
| Soft & gentle | 170 | 22 | 1 | Large panels, modals |
| Bouncy | 300 | 14 | 1 | Playful, consumer, toy-like |
| Heavy | 200 | 30 | 2.5 | Big, weighty objects |

Rules of thumb:
- **Damping below about 20 visibly bounces.** Above 30 is basically a bezier.
- **Critical damping** (no overshoot at all) is `damping = 2 * sqrt(stiffness * mass)`. For `stiffness: 260, mass: 1` that is about 32.
- Do not set `duration` on a spring — the physics decides. If you need an exact duration, you want a bezier.
- **Springs on `opacity` are pointless.** Opacity cannot overshoot meaningfully. Spring the transform, tween the fade.

---

## 3. Stagger — the math

Stagger turns "several things appeared" into "a wave passed through." But total stagger time is a budget you can blow.

```
total = base_duration + (count - 1) * step
```

**Keep total under about 800ms.** A 20-item list at 100ms step is 1.9s of waiting for the last item — the user has already scrolled past.

| Count | Step | Total (base 340) |
|---|---|---|
| 3 | 90ms | 520ms |
| 5 | 70ms | 620ms |
| 8 | 50ms | 690ms |
| 12 | 35ms | 725ms |
| 20+ | **do not stagger sequentially** | — |

For 20+ items, either (a) stagger only the first 6 and let the rest fade in together, or (b) use distance-based stagger so the wave crosses the grid in a fixed time regardless of count:

```js
gsap.from(".tile", {
  y: 40, opacity: 0, duration: 0.6, ease: "power3.out",
  stagger: { each: 0.04, from: "center", grid: "auto", amount: 0.6 }
  // `amount` = total stagger time, distributed. Count-independent.
});
```

`from: "center"` / `"edges"` / `"random"` / `[0.5, 0.5]` are the difference between a list animation and a composition animation. `from: "start"` on a grid always looks like a spreadsheet.

**Character stagger for text:** 12–25ms. Word stagger: 40–60ms. Line stagger: 80–120ms. Anything slower and the sentence becomes unreadable while it animates.

---

## 4. Choreography — the part that separates good from great

### Overlap, do not sequence

Amateur motion runs A, then B, then C. Professional motion starts B when A is ~60% done. The eye reads it as one gesture instead of three events.

```js
const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
tl.to(".panel", { y: 0, duration: 0.7 })
  .from(".panel__title", { y: 30, opacity: 0, duration: 0.6 }, "-=0.45")   // overlap
  .from(".panel__body",  { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
  .from(".panel__cta",   { scale: 0.9, opacity: 0, duration: 0.4 }, "-=0.35");
```

Use **relative position labels** (`"-=0.45"`) or named labels, never a chain of `delay:` values — delays do not survive a duration change.

### Lead and follow

Within a composition, one element leads and the rest follow with slightly different timing. Equal timing on everything reads as a slide transition. Give the hero element a longer duration and the supporting elements shorter ones, all starting near-together.

### Anticipation and follow-through

- **Anticipation**: a tiny move *against* the direction of travel before the main move. 40–80ms, 4–8px. Makes motion feel intentional.
- **Follow-through**: secondary elements keep moving slightly after the primary settles. `--ease-back-out` on children, offset 60ms after the parent.

Use sparingly. Anticipation on every element is exhausting.

### The counter-scale reveal (highest-value single trick)

Parent scales down while the image inside scales up by the inverse. The image appears to be revealed by an expanding window rather than growing. This is on nearly every high-craft site and almost nobody implements it.

```js
gsap.timeline({ scrollTrigger: { trigger: el, start: "top 82%" } })
  .fromTo(el, { scale: 1.12 }, { scale: 1, duration: 1.2, ease: "power3.out" })
  .fromTo(el.querySelector("img"),
          { scale: 1.28 }, { scale: 1, duration: 1.4, ease: "power3.out" }, 0);
```

Pair with a `clip-path: inset()` wipe for the full studio version.

### Line-mask text reveal (the canonical headline entrance)

Each line lives in an `overflow: hidden` wrapper; the line slides up from below its own mask. Crucially it is `110%`, not `100%` — descenders poke out at exactly 100%.

```js
import SplitType from "split-type";
const split = new SplitType(h1, { types: "lines" });
split.lines.forEach((line) => {
  const wrap = document.createElement("span");
  wrap.style.cssText = "display:block;overflow:hidden;";
  line.parentNode.insertBefore(wrap, line);
  wrap.appendChild(line);
  line.style.display = "block";
});
gsap.from(split.lines, {
  yPercent: 110, duration: 1.05, ease: "power4.out", stagger: 0.09,
  scrollTrigger: { trigger: h1, start: "top 85%" },
});
```

Add `rotate: 4` and `transformOrigin: "left top"` to the lines for the subtle "pivot up" variant.

---

## 5. Scroll-driven motion

### Trigger vs scrub — pick deliberately

- **Trigger** (fire once when it enters): reveals, counters, one-shot moments. Use eased curves. `once: true` unless there is a reason.
- **Scrub** (tied to scroll position): pins, parallax, horizontal pans, video scrub. **Use `ease: "none"`** — the scroll input already has a curve; adding another double-eases and feels rubbery.

```js
// Trigger
ScrollTrigger.create({
  trigger: ".section", start: "top 80%", once: true,
  onEnter: () => gsap.to(".section", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }),
});

// Scrub — note ease: "none"
gsap.to(".track", {
  x: () => -(track.scrollWidth - innerWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".pin-wrap", pin: true, scrub: 1,
    end: () => "+=" + (track.scrollWidth - innerWidth),
    invalidateOnRefresh: true,
  },
});
```

**`scrub` values:** `true` = locked 1:1 (mechanical, good for video scrub). `0.5`–`1.5` = smoothed catch-up in seconds — this is what makes scrub motion feel liquid. `1` is the default worth reaching for. Anything above 2 feels disconnected from the input.

**`invalidateOnRefresh: true`** on any scrub whose distance is computed from layout. Without it, resize breaks everything. Function-based values (`() => ...`) recompute on refresh; static values do not.

### Trigger positions

```
start: "top 85%"   // element top hits 85% down the viewport — the reveal default
start: "top 60%"   // later, more deliberate
start: "top top"   // pin start
end:   "bottom 20%"
```

**Reveal at `top 85%`, not `top bottom`.** Triggering the instant an element touches the viewport edge means the animation is over before the user has looked at it. 80–88% is the window where the reveal happens *as it enters attention*.

### Parallax that does not look cheap

Keep total travel under about 15% of element height, and always give parallaxed images extra bleed so no gap appears:

```js
gsap.to(".bg-layer", {
  yPercent: -12, ease: "none",
  scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1 },
});
```
```css
.bg-layer { height: 124%; top: -12%; } /* bleed so the parallax never exposes an edge */
```

### Velocity-reactive motion

Scroll velocity driving skew or marquee direction is a cheap, high-impact signature:

```js
import Lenis from "lenis";
const lenis = new Lenis();
let skew = 0;
lenis.on("scroll", ({ velocity }) => {
  skew = gsap.utils.clamp(-6, 6, velocity * 0.35);
  gsap.to(".skewable", { skewY: skew, duration: 0.6, ease: "power3.out", overwrite: true });
});
```

---

## 6. The single-RAF rule

Lenis, GSAP, and R3F each run their own `requestAnimationFrame`. Three loops means three different moments in the frame reading and writing layout — the result is a subtle, untraceable jitter that people describe as "it feels a bit off."

**Route everything through one ticker.** With `tempus`:

```js
import { tempus } from "tempus";
import gsap from "gsap";
import Lenis from "lenis";

const lenis = new Lenis({ autoRaf: false });

gsap.ticker.lagSmoothing(0);
gsap.ticker.remove(gsap.updateRoot);

tempus.add((time) => {
  lenis.raf(time);
  gsap.updateRoot(time / 1000);
}, 0);
```

For R3F, set `frameloop="never"` on the `<Canvas>` and call `advance()` from the same tempus tick. Minimum viable version without tempus:

```js
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

---

## 7. Signature move cookbook

### Magnetic button

```js
function magnetic(el, strength = 0.35) {
  const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
  el.addEventListener("pointermove", (e) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  });
  el.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
}
```

`gsap.quickTo` is the point — it reuses one tween instead of allocating a new one per pointermove. Using `gsap.to` here is a classic INP killer.

### Dot-and-ring cursor with lag

```js
const dotX  = gsap.quickTo(dot,  "x", { duration: 0.15, ease: "power3" });
const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3" });
// ...same for y. The duration delta IS the effect.
```

The ring lagging behind the dot by ~400ms is the entire trick. Both at the same duration looks like one object.

### Number counter

```js
const obj = { v: 0 };
gsap.to(obj, {
  v: 2847, duration: 2, ease: "power2.out",
  onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString()),
  scrollTrigger: { trigger: el, start: "top 85%", once: true },
});
```

Set `font-variant-numeric: tabular-nums` on the element or the width jitters on every frame.

### Stacked cards

```js
cards.forEach((card, i) => {
  gsap.to(card, {
    scale: 1 - (cards.length - i) * 0.04,
    ease: "none",
    scrollTrigger: { trigger: card, start: "top 12%", end: "bottom top", scrub: 1 },
  });
});
```
```css
.card { position: sticky; top: 12vh; transform-origin: center top; }
```

### Marquee that reacts to scroll direction

```js
const loop = gsap.to(".marquee__inner", {
  xPercent: -50, repeat: -1, duration: 22, ease: "none",
});
lenis.on("scroll", ({ velocity }) => {
  loop.timeScale(gsap.utils.clamp(-4, 4, 1 + velocity * 0.25));
});
```

Duplicate the content exactly once and animate to `-50%` — that is what makes the loop seamless.

---

## 8. Reduced motion — what to keep, what to kill

`prefers-reduced-motion: reduce` does **not** mean "no motion." It means no large, fast, parallax, or spinning motion — the things that trigger vestibular symptoms. Opacity fades are fine and preserve the sense that something changed.

**Kill:** parallax, scrub-pinning, auto-playing loops, spin/rotate, large translations, scale-ups, smooth scroll, WebGL heroes, marquees, counter-scale reveals.
**Keep:** opacity crossfades (150–250ms), color transitions, tiny translations (<8px), focus rings, loading spinners (functional).

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .allow-fade { transition-duration: 200ms !important; }
}
```

```js
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
function setup() {
  if (reduced.matches) {
    gsap.set("[data-reveal]", { opacity: 1, y: 0, clearProps: "all" });
    lenis?.destroy();
    return;
  }
  buildAnimations();
}
setup();
reduced.addEventListener("change", () => location.reload()); // simplest correct handling
```

**Check it at build time, not as a final pass.** Retrofitting reduced motion into a scroll-choreographed site is a rewrite. And test it — a site that renders blank under reduced motion (because reveals never fire) is a total failure, and it is an extremely common one.

---

## 9. Frame budget & what actually janks

60fps = **16.7ms per frame**, and the browser needs some of that. Budget ~10ms for your JS.

**Animate only `transform` and `opacity`.** They run on the compositor, off the main thread. `width`, `height`, `top`, `left`, `margin`, `padding` trigger layout on every frame — this is the number one cause of scroll jank.

| Property | Cost |
|---|---|
| `transform`, `opacity` | Composite only — free |
| `filter`, `backdrop-filter` | GPU, moderate-to-expensive |
| `color`, `background-color`, `box-shadow` | Paint — moderate |
| `width`, `height`, `top`, `left`, `margin` | **Layout — avoid in hot paths** |
| `clip-path` | Paint; animatable but measure it |

**Layout thrash:** never interleave reads and writes.

```js
// BAD — forced synchronous layout on every iteration
els.forEach((el) => { el.style.height = el.offsetHeight * 2 + "px"; });

// GOOD — batch reads, then batch writes
const heights = els.map((el) => el.offsetHeight);
els.forEach((el, i) => { el.style.height = heights[i] * 2 + "px"; });
```

**`will-change`:** only on elements animating *right now*. `will-change: transform` on 200 tiles allocates 200 GPU layers and destroys memory. Add it on interaction start, remove on complete — or just let GSAP handle it (it promotes automatically).

**ScrollTrigger callbacks run every frame.** Do not query the DOM, allocate objects, or call `getBoundingClientRect` inside `onUpdate`. Cache in `onRefresh`.

**Debug:** DevTools Performance panel, record a scroll, look for long purple (layout) and green (paint) bars. Enable "Paint flashing" and "Layer borders" in the Rendering tab. If the whole viewport flashes green during scroll, something is repainting that should be composited.

---

## 10. Motion tokens

Declare these once; reference them everywhere. Motion tokens are as much a design system as color tokens, and almost nobody treats them that way.

```css
:root {
  --dur-1: 120ms;  --dur-2: 180ms;  --dur-3: 260ms;  --dur-4: 340ms;
  --dur-5: 480ms;  --dur-6: 640ms;  --dur-7: 900ms;  --dur-8: 1400ms;

  --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:     cubic-bezier(0.32, 0, 0.67, 0);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-back:   cubic-bezier(0.34, 1.56, 0.64, 1);

  /* semantic */
  --motion-enter: var(--dur-4) var(--ease-out);
  --motion-exit:  var(--dur-3) var(--ease-in);
  --motion-move:  var(--dur-4) var(--ease-in-out);
  --motion-press: var(--dur-1) var(--ease-out);
}

.button { transition: transform var(--motion-press), background-color var(--motion-enter); }
.button:active { transform: scale(0.97); }
```

---

## 11. Motion QA checklist

- [ ] Entrances ease out, exits ease in, exits are shorter than entrances.
- [ ] No `linear` on positional motion; no easing on scrub or loop.
- [ ] Display type reveals with a line mask, not a plain fade.
- [ ] Total stagger under 800ms; grids use `from: "center"` or `amount`.
- [ ] Timelines overlap (`-=`), not sequence.
- [ ] All scrubbed layout distances use function values + `invalidateOnRefresh`.
- [ ] One RAF loop. Lenis, GSAP, R3F all ticked from the same source.
- [ ] Only `transform`/`opacity` in hot paths. `quickTo`, not `to`, on pointermove.
- [ ] `prefers-reduced-motion` tested — page is fully readable and nothing is stuck invisible.
- [ ] Recorded a scroll in the Performance panel; no frames over 16.7ms.
- [ ] Tested with a 4x CPU throttle. Still smooth.
- [ ] Every animation can be interrupted without leaving an element mid-state.
