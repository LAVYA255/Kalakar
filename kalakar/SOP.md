# SOP — Building a Full Website, End to End

The standard operating procedure for taking a brief to a shipped, award-grade site. Fourteen phases, five gates. **Each gate has a hard exit condition. Do not pass a gate you have not met** — every hour spent past an unmet gate is an hour you will spend again.

The most important gate is **Gate B: Direction Confidence >= 90%**. Building before you know what you are building is the single largest source of wasted work, and it is the failure an AI agent is most prone to, because generating plausible code is easy and knowing what to generate is not.

```
P0 Intake ─── GATE A: Brief complete
P1 Direction ─ GATE B: Confidence >= 90%   <-- the critical gate
P2 Tokens
P3 Assets ──── GATE C: Foundation ready
P4 Scaffold
P5 Signature
P6 Sections
P7 Responsive
P8 Content ─── GATE D: Feature complete
P9 Performance
P10 A11y
P11 QA loop ── GATE E: Rubric >= 90
P12 Ship
P13 Handoff
```

---

## Phase 0 — Intake

**Goal:** know what is being built, for whom, and what "good" means to the person paying.

Ask these. Do not skip because you can guess — a wrong guess here costs the whole build.

**Essential (blocking — cannot proceed without answers or explicit assumptions):**
1. What is the business/project, in one sentence?
2. Who is the audience, and what is the one action you want them to take?
3. Do you have brand assets — logo, fonts, colors, photography? Or am I creating the identity?
4. What content exists today? (Copy, images, video, product data.)
5. How many pages/routes?
6. Any hard constraints — deadline, budget, CMS the client must use, hosting, accessibility/legal requirements?

**Directional (can be assumed and stated, but better answered):**
7. Name three sites you love. What specifically about each?
8. Name a site in your industry you do **not** want to look like.
9. Should this feel: restrained and expensive, or loud and energetic?
10. Who maintains this after launch — you, a developer, or nobody?

**If the user cannot answer 7–9**, propose two or three directions with reference sites and let them react. Reacting is far easier than specifying, and a reaction is real data.

> **GATE A — Brief complete.** All six essential questions answered or explicitly assumed in writing. Write the brief down (see the template at the end) and reflect it back in 5 lines. If the user corrects you, you just saved a rebuild.

---

## Phase 1 — Direction

**Goal:** decide *what this site is* before deciding how to build it.

1. **Domain** — place it. `references/domain-playbook.md`, 40+ verticals.
2. **Archetype** — map domain to one of 12. `references/archetypes.md`. If it straddles two, name both and commit to the dominant one.
3. **Signature moment** — the ONE thing. Write it as a single sentence a non-technical person understands. *"Scrolling the hero peels back layers of the building's structural drawing until the finished photograph is revealed."*
4. **Material language** — glass / grain-and-paper / brutalist-raw / metal / clay / holographic / flat-editorial. One. `references/liquid-glass.md` section 8.
5. **Art direction** — 6–9 reference images (not websites — *images*: photography style, texture, type specimen, color). This is a mood board and it is not optional; it is how you and the client agree on taste without arguing in the abstract.
6. **Stack** — `references/stack-decisions.md`. The archetype usually dictates it.
7. **Building blocks** — one per slot from `references/building-blocks.md`: loader, hero, nav, scroll signature, cursor, transition, footer.
8. **Sitemap and per-page section list.**

### The confidence score

Before writing a line of code, score your confidence 0–100. Sum these:

| Dimension | Max | You have 90%+ of it when... |
|---|---|---|
| Brief clarity | 15 | You can state the business, audience, and desired action without hedging |
| Content availability | 15 | You know what copy and imagery exist, or have a concrete plan to create them |
| Visual direction | 20 | You have references and can predict which of two mockups the client picks |
| Signature moment | 15 | You can describe it in one sentence AND name the technique to build it |
| Technical feasibility | 15 | You have built each required technique before or have read a working example |
| Scope boundaries | 10 | You know the page count and what is explicitly out of scope |
| Success criteria | 10 | You know what the client will judge it on |

> **GATE B — Confidence >= 90.**
>
> **Below 90: do not start building.** Identify which dimension is lowest and close it:
> - Brief/scope low -> ask the specific question. One message, five minutes.
> - Direction low -> produce two or three moodboard directions and get a reaction.
> - Signature moment low -> prototype **just that moment** in a standalone file. A 30-minute spike beats a 6-hour wrong build.
> - Feasibility low -> spike it, or pick the fallback technique now and say so.
> - Content low -> agree who writes it and by when. Content is the #1 cause of stalled sites.
>
> Re-score. Loop until >= 90. **Report the score to the user** when it is below 90 rather than silently guessing — "I'm at 72% because I don't know X" is useful; a confidently wrong build is not.

**Deliverable:** a one-page direction doc — archetype, signature moment, material, stack with package names, block choices, sitemap, confidence score.

---

## Phase 2 — Design tokens

**Goal:** the system exists before any component does.

Follow `references/design-system.md`. Produce `tokens.css` (or the Tailwind theme equivalent) containing:

- Type scale (two ratios: body and display), fluid `clamp()` values, tracking and leading per step
- Spacing ramp (non-linear, 4pt base)
- Color: OKLCH ramps, tinted neutrals, one accent, semantic aliases, dark mode block
- Radii ladder, layered shadow ladder with a committed light direction
- Motion tokens (`references/motion-spec.md` section 10)
- Containers, gutters, breakpoints, z-index scale

**Validate before moving on:** render a token specimen page — every type step, every color swatch with its contrast ratio, every shadow, every spacing value. Ten minutes of work; catches a muddy ramp before it is baked into 40 components.

`kit/tokens.css` is a working starting point — retune the hue, ratios, and radii to the brand rather than shipping the defaults.

---

## Phase 3 — Assets

**Goal:** nothing gray, nothing Lorem, ever.

Per `references/assets.md`:

1. Inventory what exists vs what is needed.
2. **Generate** what you can: grain, mesh gradients, patterns, noise textures, OG images, favicons.
3. **Source** the rest with licenses recorded in `assets/CREDITS.md` as you go, not after.
4. **Treat** all photography to one grade so it reads as a single shoot.
5. **Optimize**: AVIF+WebP at 5 widths, video under 2MB with a poster, fonts subset to woff2, models through `gltf-transform`.
6. **Write real copy** — even provisional. Real lengths, real names, real numbers.

> **GATE C — Foundation ready.** Tokens validated on a specimen page. Fonts loading with metric overrides. At least the hero and first-section assets optimized and in `public/`. Copy for the hero and first section written for real.

---

## Phase 4 — Scaffold

**Goal:** the plumbing, correct on day one. Retrofitting any of this later is painful.

```bash
npm create astro@latest       # or create-next-app / create vite / nuxi init
```

Install grouped so the reasoning is visible:

```bash
npm i gsap lenis split-type              # motion + scroll + text
npm i three @react-three/fiber @react-three/drei   # 3D, only if needed
npm i @fontsource-variable/inter          # type
npm i -D sharp svgo @axe-core/cli lighthouse       # asset + QA pipeline
```

**Build these before any feature work — in this order:**

1. `tokens.css` imported globally; CSS reset.
2. **Reduced-motion gate**, global. Not later. `references/motion-spec.md` section 8.
3. Font loading with `ascent-override` / `descent-override`; preload exactly one.
4. Lenis + GSAP + (R3F) on **one RAF** via `tempus`. `motion-spec.md` section 6.
5. A `useReveal` / `data-reveal` primitive so every reveal on the site shares one implementation.
6. Layout shell: grid container, nav, footer, skip link, `<main id="main">`.
7. Meta/SEO component: title, description, OG, canonical, favicon.
8. `prefers-reduced-transparency` and `prefers-contrast` handling if using glass.

**Commit here.** This is a clean, reusable baseline.

---

## Phase 5 — The signature moment

**Build it first, not last.** Three reasons: it is the highest-risk item so failure should surface early; everything else is art-directed *around* it; and if it is not achievable you need to know now, not on day nine.

1. Prototype in isolation (a standalone route or HTML file).
2. Get it to 80% and check the feel. Feel is not visible in a plan.
3. **Build the fallback at the same time** — reduced-motion version, low-GPU version, no-JS version. Not afterwards.
4. Measure its cost immediately: bundle delta, frame time, LCP impact.
5. Integrate into the page.

If after a reasonable spike it is not working, **change the signature moment** rather than shipping a weak version of it. A different well-executed idea beats the original idea done badly.

---

## Phase 6 — Sections

Now the bulk. Work section by section, top to bottom. **Finish each section before starting the next** — a page of eight half-built sections is unassessable and demoralizing.

Per section:
1. Structure — semantic HTML, correct heading level, grid placement.
2. Composition — apply the proportion rules. Break symmetry at least twice per page.
3. Content — real copy, real images at the right ratio.
4. Motion — reveal at `top 85%`, staggered, correct easing.
5. States — hover, focus-visible, active on every interactive element.
6. Check at 375 and 1440 before moving on.

**Every 2–3 sections, step back and look at the whole page at 25% zoom.** Sections built in isolation drift; catching it at three sections is cheap, at eight it is a re-layout.

---

## Phase 7 — Responsive pass

Full sweep at 320 / 375 / 768 / 1024 / 1440 / 2560.

- Type rescales via `clamp()`; check the extremes actually look right, not just legal.
- Pinned/horizontal sections restructured for mobile via `ScrollTrigger.matchMedia`, not hidden.
- Custom cursor disabled under `@media (hover: hover) and (pointer: fine)`.
- WebGL drops a tier or falls back to poster on mobile.
- Touch targets 44px+. Hover-only affordances have a tap equivalent.
- `100dvh` not `100vh` for anything full-height (iOS address bar).
- Assert zero horizontal overflow at every width (the Playwright test in `qa-rubric.md`).

---

## Phase 8 — Content pass

- Replace every remaining placeholder. Search the codebase for `lorem`, `placeholder`, `TODO`, `Company 1`, `#` hrefs.
- Proofread aloud.
- Write the microcopy nobody assigns: button labels, form errors, empty states, the 404, the loading state, the success message, the OG description.
- Alt text on every image — describing the content, not the filename. Decorative images get `alt=""`.
- Length-test each text component with the shortest and longest plausible content.

> **GATE D — Feature complete.** Every section built, every string real, every route reachable, all breakpoints clean. Now, and only now, optimize.

---

## Phase 9 — Performance

Per `references/performance.md` and `references/assets.md` section 4.

1. Measure first: `npx lighthouse --form-factor=mobile`. Record the actual numbers.
2. LCP: confirm the LCP element is what you intended (DevTools shows it). Preload it. `fetchpriority="high"`. Never lazy.
3. CLS: `width`/`height` on all media, `aspect-ratio` on containers, font metric overrides.
4. INP: Performance panel trace during scroll. No frame over 16.7ms. `quickTo` not `to` on pointer handlers.
5. JS: code-split the heavy stuff (Three.js, Rive, video players). `npx knip` for dead code.
6. Third-party scripts to Partytown.
7. Re-measure. **Targets: LCP < 1.8s, CLS < 0.05, INP < 100ms on 4x CPU throttle.**

---

## Phase 10 — Accessibility

1. `npx @axe-core/cli <url> --exit` — zero violations.
2. Keyboard: tab the entire page. Focus always visible, order matches visuals, no traps, skip link works, modals trap and restore focus.
3. Screen reader: one real flow with VoiceOver or NVDA. Landmarks, headings, labels, live regions.
4. Contrast: verify every text/background pair. Body 4.5:1 minimum, target 7:1.
5. Reduced motion: enable it, reload, confirm the page is **complete and readable** — not blank because reveals never fired.
6. Reduced transparency and increased contrast if using glass.
7. Zoom to 200%. Nothing overlaps or clips.
8. Forms: real `<label>`s, errors associated via `aria-describedby`, errors announced.

---

## Phase 11 — QA loop

Run the loop from `references/qa-rubric.md` section 4:

```
observe -> measure -> score -> diagnose lowest -> fix three defects -> re-score
```

> **GATE E — Rubric >= 90 total AND no category below 7.**
>
> Report the score. If shipping below 90 for a deadline, say so explicitly and list what is unfinished. Do not report "done" for an 84.

---

## Phase 12 — Ship

- [ ] Build passes clean. Zero console errors in production.
- [ ] Deploy (Vercel / Netlify / Cloudflare Pages). Custom domain, HTTPS, HSTS.
- [ ] `robots.txt`, `sitemap.xml`, canonical URLs.
- [ ] OG image renders — test with the real URL in Slack or a card validator.
- [ ] Favicon set complete; check the actual browser tab.
- [ ] Analytics firing; verify a real pageview.
- [ ] Forms deliver to a real inbox. **Send a test submission.**
- [ ] 404 reachable and designed.
- [ ] Redirects from any old URLs.
- [ ] Lighthouse **against production**, not localhost.
- [ ] Open it on a real phone, on cellular.

---

## Phase 13 — Handoff

- `README.md`: install, dev, build, deploy, env vars, where content lives.
- `assets/CREDITS.md`: every asset, source, license.
- Design tokens documented — how to change the brand color, the type, the spacing.
- CMS access + a short guide, or a documented path for how the client edits copy.
- Known limitations and the browser support matrix.
- What was deliberately left out and what it would take to add.

---

## Timeboxing

Rough proportions for a 5–8 page design-forward marketing site. Scale to your actual budget; the **ratios** are the point.

| Phase | Share | Notes |
|---|---|---|
| P0–P1 Intake + direction | 15% | Underinvested by almost everyone. This is where quality is decided. |
| P2–P3 Tokens + assets | 15% | Feels like not-building. It is the build. |
| P4 Scaffold | 5% | |
| P5 Signature moment | 15% | High variance. Timebox the spike explicitly. |
| P6 Sections | 25% | The visible bulk |
| P7–P8 Responsive + content | 10% | |
| P9–P10 Perf + a11y | 8% | |
| P11 QA loop | 5% | |
| P12–P13 Ship + handoff | 2% | |

If you are more than 40% through the budget and have not passed Gate B, stop and close the direction. Building faster does not fix building the wrong thing.

---

## Brief template

```markdown
# {Project} — Brief

## Business
One sentence:
Audience:
Primary action:
Competitors / adjacent sites:

## Direction
Domain:                 (domain-playbook.md)
Archetype:              (archetypes.md)
Signature moment:       (one sentence, non-technical)
Material language:      (glass / grain / brutalist / metal / clay / flat)
Tone:                   (3 adjectives, none of them "clean" or "modern")
References:             (3 sites + what specifically about each)
Anti-reference:         (1 site to not resemble)

## Stack
Meta-framework:
Motion:
Scroll:
3D / shaders:
Cursor:
Type:                   (display + body, source, license)
CMS:
Host:

## Blocks
Loader:      Hero:        Nav:
Scroll sig:  Cursor:      Transition:      Footer:

## Sitemap
- / ................ sections: hero, …
- /work ............
- /about ...........
- /contact .........

## Content
Copy:        exists / to write / client provides by {date}
Photography: exists / source / shoot
Video:       n/a / exists / source

## Constraints
Deadline:    Budget:    Must use:    Must support:

## Confidence: __/100
Lowest dimension:
Action to close it:

## Success criteria
The client will judge this on:
```

---

## Rules that override everything else

1. **Do not build past Gate B.** Unknown direction is the most expensive problem in the process.
2. **Signature moment first.** Highest risk, highest value, and everything else composes around it.
3. **Tokens before components.** Always. No exceptions.
4. **Never ship a placeholder to a review.** Real content or a designed empty state.
5. **Reduced motion and focus states from day one.** Both are rewrites if retrofitted.
6. **Measure, do not estimate.** A performance number you did not read off a tool is not a number.
7. **Finish sections before starting new ones.**
8. **Score honestly.** An inflated score is a bug in the process, and the one that costs the most.
