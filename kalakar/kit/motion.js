/* ==========================================================================
   kalakar/kit/motion.js
   Zero-dependency motion primitives. ES module, no build step required.

   Deliberately dependency-free so it runs in a plain HTML file. In a real
   project you will usually swap the internals for GSAP + Lenis + ScrollTrigger
   (see upgradeNotes at the bottom) — but the API and, more importantly, the
   TIMING VALUES stay the same. The numbers are the design.

   Everything here follows references/motion-spec.md:
     - entrances ease out, exits ease in, exits are shorter
     - total stagger stays under ~800ms
     - reveals fire at "top 85%", not the viewport edge
     - only transform/opacity in hot paths
     - one rAF loop for all continuous motion
     - prefers-reduced-motion is a hard gate, checked first

   Usage:
     import { initKalakar } from "./kit/motion.js";
     initKalakar();
   ========================================================================== */

/* --------------------------------------------------------------------------
   Environment
   -------------------------------------------------------------------------- */
const mqReduced = matchMedia("(prefers-reduced-motion: reduce)");
const mqFinePointer = matchMedia("(hover: hover) and (pointer: fine)");

export const env = {
  get reduced() { return mqReduced.matches; },
  get finePointer() { return mqFinePointer.matches; },
};

/* --------------------------------------------------------------------------
   ONE rAF LOOP. Lenis, GSAP and R3F each running their own rAF is the
   classic source of untraceable jitter — three different moments in the
   frame reading and writing layout. Everything continuous registers here.
   -------------------------------------------------------------------------- */
const tickers = new Set();
let running = false;

function frame(now) {
  for (const fn of tickers) fn(now);
  if (tickers.size) requestAnimationFrame(frame);
  else running = false;
}

export function addTicker(fn) {
  tickers.add(fn);
  if (!running) { running = true; requestAnimationFrame(frame); }
  return () => tickers.delete(fn);
}

/** Frame-rate-independent lerp. Without the dt correction, motion is faster
 *  on 120Hz displays than on 60Hz — a real and commonly-shipped bug. */
export function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/* --------------------------------------------------------------------------
   1. REVEAL — IntersectionObserver at "top 85%".
      Triggering the instant an element touches the viewport edge means the
      animation finishes before the user has looked at it. 85% is where the
      reveal lands as the element enters attention.
   -------------------------------------------------------------------------- */
export function initReveals({
  selector = "[data-reveal]",
  threshold = 0.15,
  rootMargin = "0px 0px -15% 0px", // ~ "top 85%"
  stagger = 70,                    // ms between siblings
  maxStagger = 800,                // total budget — motion-spec.md section 3
} = {}) {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return () => {};

  if (env.reduced) {
    els.forEach((el) => el.classList.add("is-revealed"));
    return () => {};
  }

  // Group by parent so siblings stagger as a wave, not the whole page at once.
  const groups = new Map();
  els.forEach((el) => {
    const key = el.dataset.revealGroup || el.parentElement;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(el);
  });
  groups.forEach((group) => {
    // clamp the step so a long list never blows the 800ms budget
    const step = Math.min(stagger, maxStagger / Math.max(group.length - 1, 1));
    group.forEach((el, i) => {
      const own = el.dataset.revealDelay;
      el.style.setProperty("--reveal-delay", own ? `${own}ms` : `${Math.round(i * step)}ms`);
    });
  });

  const pending = new Set(els);

  const reveal = (el, immediate = false) => {
    // A catch-up reveal has already been scrolled past, so the stagger delay
    // is not choreography any more — it is just latency before the content
    // appears. Drop it.
    if (immediate) el.style.setProperty("--reveal-delay", "0ms");
    el.classList.add("is-revealed");
    pending.delete(el);
    io.unobserve(el); // reveals fire once
    if (!pending.size) teardown();
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    },
    { threshold, rootMargin }
  );
  els.forEach((el) => io.observe(el));

  /* Safety sweep. IntersectionObserver callbacks are delivered at rendering
     opportunities, so a fast flick, an anchor jump, or a scroll restoration
     can carry an element past the viewport between two deliveries — and it
     stays at opacity 0 forever. Content that is permanently invisible is a
     far worse failure than a missed animation, so sweep anything we have
     already scrolled past and reveal it outright. */
  let scheduled = false;
  const sweep = () => {
    scheduled = false;
    const vh = innerHeight;
    for (const el of [...pending]) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0) reveal(el, true);       // scrolled clean past — snap it in
      else if (r.top < vh * 0.9) reveal(el);    // in view — normal choreography
    }
  };
  const onScroll = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(sweep);
  };

  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll, { passive: true });

  function teardown() {
    io.disconnect();
    removeEventListener("scroll", onScroll);
    removeEventListener("resize", onScroll);
  }

  return teardown;
}

/* --------------------------------------------------------------------------
   2. LINE-MASK SPLIT — the canonical headline entrance.
      Wraps each rendered line in an overflow:hidden block so the line slides
      up from behind its own mask. Re-splits on resize because line breaks
      change with width.

      Note the 110% in tokens.css, not 100% — at exactly 100% descenders
      (g, y, p) poke out below the mask.
   -------------------------------------------------------------------------- */
export function splitLines(el) {
  if (!el || env.reduced) return;

  const original = el.dataset.splitOriginal ?? el.innerHTML;
  el.dataset.splitOriginal = original;
  el.innerHTML = original;

  // 1. Wrap every word so we can measure per-word offsetTop. Record the chain
  //    of ancestor elements above each word — without it, rebuilding flattens
  //    <em>, <a>, <strong> and <span class="gradient"> straight out of the
  //    headline, which silently kills any inline styling.
  const words = [];
  const walk = (node, chain) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok.trim()) { frag.appendChild(document.createTextNode(tok)); return; }
          const w = document.createElement("span");
          w.style.display = "inline-block";
          w.textContent = tok;
          words.push({ span: w, chain });
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child, [...chain, child]);
      }
    });
  };
  walk(el, []);
  if (!words.length) return;

  // 2. group words by offsetTop — that IS the line
  const lines = [];
  let currentTop = null;
  words.forEach((w) => {
    const top = w.span.offsetTop;
    if (currentTop === null || Math.abs(top - currentTop) > 2) {
      currentTop = top;
      lines.push([]);
    }
    lines[lines.length - 1].push(w);
  });

  // 3. Rebuild as masked lines, reconstructing each word's ancestor chain.
  //    Consecutive words sharing a chain share one cloned ancestor, so an
  //    <em> spanning three words stays a single <em> — which matters for
  //    background-clip:text gradients and for underline continuity.
  const frag = document.createDocumentFragment();
  lines.forEach((line) => {
    const mask = document.createElement("span");
    mask.className = "line-mask";
    const inner = document.createElement("span");

    let openSrc = [];   // source ancestors currently open
    let openNew = [];   // their clones

    line.forEach((w, i) => {
      let common = 0;
      while (
        common < openSrc.length && common < w.chain.length &&
        openSrc[common] === w.chain[common]
      ) common++;

      openSrc.length = common;
      openNew.length = common;
      let cursor = common ? openNew[common - 1] : inner;

      for (let k = common; k < w.chain.length; k++) {
        const clone = w.chain[k].cloneNode(false); // shallow — no children
        cursor.appendChild(clone);
        cursor = clone;
        openSrc.push(w.chain[k]);
        openNew.push(clone);
      }

      if (i) cursor.appendChild(document.createTextNode(" "));
      w.span.style.display = "inline";
      cursor.appendChild(w.span);
    });

    mask.appendChild(inner);
    frag.appendChild(mask);
  });
  el.innerHTML = "";
  el.appendChild(frag);

  // stagger the lines: 80-120ms reads as a wave, faster reads as one block
  [...el.querySelectorAll(".line-mask")].forEach((m, i) => {
    m.style.setProperty("--reveal-delay", `${i * 90}ms`);
  });
}

export function initSplitHeadings(selector = "[data-split]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length || env.reduced) return;

  const apply = () => els.forEach(splitLines);
  apply();

  // re-split on resize (line breaks move); debounced, width-only
  let lastW = innerWidth, t;
  addEventListener("resize", () => {
    if (innerWidth === lastW) return;   // ignore iOS address-bar height changes
    lastW = innerWidth;
    clearTimeout(t);
    t = setTimeout(() => {
      apply();
      els.forEach((el) => {
        const host = el.closest("[data-reveal]") || el;
        if (host.classList.contains("is-revealed")) {
          el.querySelectorAll(".line-mask").forEach((m) => m.classList.add("is-revealed"));
        }
      });
    }, 180);
  }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. GLASS — feature-detect real refraction, wire the pointer-reactive rim.

      backdrop-filter: url(#svg) is Chromium-only as of early 2026. Safari
      and Firefox support backdrop-filter but silently ignore SVG filter
      references inside it — so CSS.supports() returns true and then does
      nothing. Hence the UA check. It is ugly; it is also what works today.
      Delete the branch when Safari ships it.
   -------------------------------------------------------------------------- */
export function initGlass({ reactive = true } = {}) {
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  const isFirefox = /firefox|fxios/i.test(navigator.userAgent);
  const supports =
    CSS.supports("backdrop-filter", "url(#kalakar-lens)") ||
    CSS.supports("-webkit-backdrop-filter", "url(#kalakar-lens)");

  const hasFilterDefs = !!document.getElementById("kalakar-lens");

  if (supports && hasFilterDefs && !isSafari && !isFirefox) {
    document.documentElement.classList.add("has-refraction");
  }

  if (!reactive || !env.finePointer || env.reduced) return;

  document.querySelectorAll("[data-glass-reactive]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const deg = (Math.atan2(y, x) * 180) / Math.PI + 90;
      el.style.setProperty("--rim-angle", `${deg.toFixed(1)}deg`);
    }, { passive: true });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rim-angle", "135deg");
    }, { passive: true });
  });
}

/* --------------------------------------------------------------------------
   4. MAGNETIC — element is pulled toward the cursor.
      Everything runs off the shared ticker; pointermove only writes a target.
      Doing the tween inside the pointermove handler is a classic INP killer.
   -------------------------------------------------------------------------- */
export function magnetic(el, { strength = 0.32, lambda = 9, radius = 1.6 } = {}) {
  if (!env.finePointer || env.reduced) return () => {};

  let tx = 0, ty = 0, cx = 0, cy = 0, last = performance.now(), active = false;

  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    const within =
      Math.abs(mx) < (r.width / 2) * radius && Math.abs(my) < (r.height / 2) * radius;
    tx = within ? mx * strength : 0;
    ty = within ? my * strength : 0;
    active = true;
  };
  const onLeave = () => { tx = 0; ty = 0; };

  const zone = el.closest("[data-magnetic-zone]") || el;
  zone.addEventListener("pointermove", onMove, { passive: true });
  zone.addEventListener("pointerleave", onLeave, { passive: true });

  const stop = addTicker((now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!active) return;
    cx = damp(cx, tx, lambda, dt);
    cy = damp(cy, ty, lambda, dt);
    if (Math.abs(cx - tx) < 0.01 && Math.abs(cy - ty) < 0.01 && tx === 0 && ty === 0) {
      cx = cy = 0; active = false;
    }
    el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
  });

  return () => {
    stop();
    zone.removeEventListener("pointermove", onMove);
    zone.removeEventListener("pointerleave", onLeave);
  };
}

export function initMagnetic(selector = "[data-magnetic]") {
  document.querySelectorAll(selector).forEach((el) =>
    magnetic(el, { strength: parseFloat(el.dataset.magnetic) || 0.32 })
  );
}

/* --------------------------------------------------------------------------
   5. CURSOR — dot + lagging ring.
      The lag delta between dot and ring IS the effect. Same speed on both
      and it reads as one object.

      Never hide the native cursor without a visible replacement, and never
      on touch/coarse pointers.
   -------------------------------------------------------------------------- */
export function initCursor({ dot, ring } = {}) {
  if (!env.finePointer || env.reduced) return () => {};
  if (!dot || !ring) return () => {};

  document.documentElement.classList.add("has-custom-cursor");

  let mx = innerWidth / 2, my = innerHeight / 2;
  let dx = mx, dy = my, rx = mx, ry = my;
  let last = performance.now();

  // Hide until the pointer actually moves — otherwise both elements sit
  // parked in the middle of the viewport on load, which reads as a bug.
  addEventListener("pointermove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!dot.classList.contains("is-ready")) {
      dx = rx = mx; dy = ry = my;                 // jump, do not glide in
      dot.classList.add("is-ready");
      ring.classList.add("is-ready");
    }
  }, { passive: true });

  // hover targets grow the ring and show a label
  document.querySelectorAll("a, button, [data-cursor-label]").forEach((el) => {
    el.addEventListener("pointerenter", () => {
      ring.classList.add("is-active");
      const label = el.dataset.cursorLabel;
      if (label) { ring.textContent = label; ring.classList.add("has-label"); }
    });
    el.addEventListener("pointerleave", () => {
      ring.classList.remove("is-active", "has-label");
      ring.textContent = "";
    });
  });

  return addTicker((now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    dx = damp(dx, mx, 30, dt);   // dot: fast
    dy = damp(dy, my, 30, dt);
    rx = damp(rx, mx, 9, dt);    // ring: slow — the lag is the whole trick
    ry = damp(ry, my, 9, dt);
    dot.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) translate(-50%,-50%)`;
    ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0) translate(-50%,-50%)`;
  });
}

/* --------------------------------------------------------------------------
   6. COUNTER — animate a number into view.
      Set font-variant-numeric: tabular-nums on the element or the width
      jitters every frame.
   -------------------------------------------------------------------------- */
export function initCounters(selector = "[data-count]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return;

  const run = (el) => {
    const to = parseFloat(el.dataset.count);
    const dp = parseInt(el.dataset.countDecimals || "0", 10);
    const prefix = el.dataset.countPrefix || "";
    const suffix = el.dataset.countSuffix || "";
    if (env.reduced) { el.textContent = prefix + to.toFixed(dp) + suffix; return; }

    const dur = parseInt(el.dataset.countDuration || "1800", 10);
    const start = performance.now();
    const stop = addTicker((now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = prefix + (to * eased).toFixed(dp) + suffix;
      if (t >= 1) stop();
    });
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      run(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  els.forEach((el) => io.observe(el));
}

/* --------------------------------------------------------------------------
   7. PARALLAX — scroll-linked, transform-only.
      Keep travel under ~15% of element height and give the layer bleed so
      the parallax never exposes an edge.
   -------------------------------------------------------------------------- */
export function initParallax(selector = "[data-parallax]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length || env.reduced) return () => {};

  // cache layout once per resize, not per frame — reading getBoundingClientRect
  // inside the ticker is layout thrash
  let items = [];
  const measure = () => {
    items = els.map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.15,
      top: el.getBoundingClientRect().top + scrollY,
      h: el.offsetHeight,
      y: 0,
    }));
  };
  measure();
  addEventListener("resize", measure, { passive: true });

  let last = performance.now();
  return addTicker((now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const vh = innerHeight;
    for (const it of items) {
      const centre = it.top + it.h / 2 - (scrollY + vh / 2);
      if (Math.abs(centre) > vh * 1.5) continue; // offscreen — skip
      const target = -centre * it.speed;
      it.y = damp(it.y, target, 12, dt);
      it.el.style.transform = `translate3d(0, ${it.y.toFixed(2)}px, 0)`;
    }
  });
}

/* --------------------------------------------------------------------------
   8. TILT — 3D perspective tilt on hover.
   -------------------------------------------------------------------------- */
export function initTilt(selector = "[data-tilt]") {
  if (!env.finePointer || env.reduced) return;
  document.querySelectorAll(selector).forEach((el) => {
    const max = parseFloat(el.dataset.tilt) || 6;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`;
    }, { passive: true });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    }, { passive: true });
  });
}

/* --------------------------------------------------------------------------
   9. MARQUEE — seamless loop, optionally reactive to scroll velocity.
      Duplicate the content EXACTLY once and travel to -50%. That is what
      makes the seam invisible.
   -------------------------------------------------------------------------- */
export function initMarquee(selector = "[data-marquee]") {
  const els = [...document.querySelectorAll(selector)];
  if (!els.length) return () => {};

  const tracks = els.map((el) => {
    const inner = el.firstElementChild;
    if (!inner) return null;

    // Duplicate the content exactly once, then travel to -50%. Measure the
    // single-copy width BEFORE cloning — that is the seamless wrap distance.
    let width;
    if (inner.dataset.duplicated) {
      width = inner.scrollWidth / 2;
    } else {
      width = inner.scrollWidth;
      const copy = inner.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");  // do not read the loop twice
      while (copy.firstChild) inner.appendChild(copy.firstChild);
      inner.dataset.duplicated = "1";
    }

    return {
      el: inner,
      speed: parseFloat(el.dataset.marquee) || 30, // px/sec
      x: 0,
      width,
    };
  }).filter(Boolean);

  if (env.reduced) return () => {};

  let last = performance.now();
  let boost = 1;
  let lastScroll = scrollY;
  addEventListener("scroll", () => {
    const v = scrollY - lastScroll;
    lastScroll = scrollY;
    boost = Math.max(-4, Math.min(4, 1 + v * 0.06));
  }, { passive: true });

  return addTicker((now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    boost = damp(boost, 1, 3, dt);
    for (const t of tracks) {
      t.x -= t.speed * boost * dt;
      if (t.width && Math.abs(t.x) >= t.width) t.x += t.width;
      t.el.style.transform = `translate3d(${t.x.toFixed(2)}px,0,0)`;
    }
  });
}

/* --------------------------------------------------------------------------
   10. SCROLL PROGRESS — sets --scroll-progress (0..1) on <html>.
       Cheap, and unlocks a lot: progress bars, colour shifts, nav states.
   -------------------------------------------------------------------------- */
export function initScrollProgress() {
  const root = document.documentElement;
  const update = () => {
    const max = root.scrollHeight - innerHeight;
    root.style.setProperty("--scroll-progress", max > 0 ? (scrollY / max).toFixed(4) : "0");
    root.classList.toggle("is-scrolled", scrollY > 40);
  };
  addEventListener("scroll", update, { passive: true });
  addEventListener("resize", update, { passive: true });
  update();
}

/* --------------------------------------------------------------------------
   BOOTSTRAP
   -------------------------------------------------------------------------- */
export function initKalakar(opts = {}) {
  const root = document.documentElement;

  // .js gates the reveal styles so a no-JS visitor sees everything.
  // .reduced-motion is belt-and-braces alongside the media query.
  root.classList.add("js");
  if (env.reduced) root.classList.add("reduced-motion");

  initScrollProgress();
  initGlass(opts.glass);
  initSplitHeadings();
  initReveals(opts.reveal);
  initMagnetic();
  initCounters();
  initTilt();
  if (opts.parallax !== false) initParallax();
  if (opts.marquee !== false) initMarquee();
  if (opts.cursor) initCursor(opts.cursor);

  // Preference changes mid-session: a reload is the only reliably correct
  // handling once timelines have been built.
  mqReduced.addEventListener("change", () => location.reload());
}

/* ==========================================================================
   UPGRADE PATH — swapping in GSAP + Lenis
   ==========================================================================

   This file is intentionally dependency-free. On a real project you will
   usually want GSAP's ScrollTrigger and Lenis. The values do not change,
   only the engine.

     npm i gsap lenis split-type @darkroom.engineering/tempus

     import gsap from "gsap";
     import ScrollTrigger from "gsap/ScrollTrigger";
     import Lenis from "lenis";
     import { tempus } from "@darkroom.engineering/tempus";

     gsap.registerPlugin(ScrollTrigger);

     const lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
     lenis.on("scroll", ScrollTrigger.update);

     // ONE rAF for everything — this is the single most important line
     gsap.ticker.lagSmoothing(0);
     gsap.ticker.remove(gsap.updateRoot);
     tempus.add((time) => {
       lenis.raf(time);
       gsap.updateRoot(time / 1000);
     }, 0);

   Then replace:
     initReveals()      -> ScrollTrigger.batch("[data-reveal]", {
                             start: "top 85%", once: true,
                             onEnter: b => gsap.to(b, { opacity:1, y:0,
                               duration:0.8, ease:"power4.out", stagger:0.07 })
                           })
     splitLines()       -> SplitType + gsap.from(lines, { yPercent:110, ... })
     magnetic()         -> gsap.quickTo(el, "x", {duration:0.6, ease:"power3"})
     initParallax()     -> gsap.to(el, { yPercent:-12, ease:"none",
                             scrollTrigger:{ scrub:1, invalidateOnRefresh:true }})

   Keep the reduced-motion gate exactly as it is — GSAP will happily animate
   straight through a user's accessibility preference if you let it.
   ========================================================================== */
