---
name: kalakar
description: >-
  Build NEW award-winning websites for ANY domain — Awwwards / FWA caliber,
  heavily aesthetic, animated, AND optimized. Creator skill; reference sites
  (Floema, Shopify Editions, Linear, Vercel, ref.digital) are inspiration.
  Works for every vertical — restaurants, dentists, photographers, law firms,
  real estate, fashion, music artists, NGOs, SaaS, AI startups, agencies,
  conferences, museums, weddings, hotels, gyms, e-commerce. Use whenever the
  user wants to create or rebuild a site with motion, WebGL, smooth scroll,
  kinetic typography, page transitions, custom cursors, audio, or studio
  polish. Triggers on "build a website", "create a site for X",
  "design-forward", "portfolio", "landing page", "WebGL hero", "site like
  Linear/Vercel/Floema", "make it look better", "liquid glass", "glassmorphism",
  "glass UI", "design system", "type scale", "spacing/proportions", "OKLCH
  palette", "easing/animation timing", "micro-interactions", or any brief
  implying bespoke craft over generic CRUD UI. Carries a full craft layer
  (proportions, modular type scales, OKLCH colour, layered depth, motion
  timing specs), the Liquid Glass material language with real refraction, an
  asset generation + optimization pipeline, a copy-paste code kit, a 14-phase
  SOP with a build-confidence gate, and a 100-point QA rubric to score against
  before shipping. Knows niche libs (OGL, Lygia, troika-three-text,
  curtains.js, Lenis, tempus, SplitType, Paper Shaders, TresJS, Rive) average
  AIs miss, plus how to elevate ANY business domain.
---

# Design-Forward Website

**This is a creator skill.** You build NEW sites in the aesthetic spirit of Floema, Shopify Editions, Linear, Vercel, ref.digital, Obsidian Assembly, Hashgraph VC, Simon Holm Studio, Apple product pages, Stripe Press — sites that get featured on Awwwards, FWA, SiteSee, Godly, CSSDA. You do **not** clone them. Reference sites are inspiration, not blueprints. The user gives you a brief; you compose a fresh result by mixing building blocks.

**The job is to:**
1. Identify the **domain** (restaurant? law firm? AI startup? designer portfolio? museum? wedding?).
2. Pick the right **archetype** (12 of them — see `archetypes.md`).
3. Pick the right **base stack** (Astro / Next / Nuxt / Vite-React / Hydrogen / SvelteKit / Webflow — see `stack-decisions.md`).
4. Choose the **signature moment** — the ONE thing that makes the site memorable.
5. Define the **design system** — type scale, spacing ramp, OKLCH colour, proportions (`design-system.md`). Tokens before components, always.
6. Choose the **material language** — liquid glass, grain-and-paper, brutalist-raw, metal, clay (`liquid-glass.md`).
7. Compose **building blocks** (`building-blocks.md`) — one loader + one hero + one nav + one scroll signature + one cursor + one transition + one footer. Constraint is the design.
8. Assemble the **library combo** (`recipes.md` for proven combos, `libraries.md` for substitutions).
9. Produce **real assets** — never Lorem, never gray boxes (`assets.md`).
10. Build it **aesthetic, animated, AND optimized**. All three. Non-negotiable.
11. **Score it against the rubric and iterate until >= 90/100** (`qa-rubric.md`). This is not optional; it is how you know you are done.

**Every domain deserves this treatment.** A dentist site can be Awwwards-grade. A bakery, a law firm, a gym, an NGO. Domain doesn't determine taste — the application of taste to the domain is what makes work memorable. See `domain-playbook.md` for the elevation path on 40+ business verticals.

## The two rules that override everything

**1. Don't build before you know what you're building.** `SOP.md` Phase 1 defines a confidence score across seven dimensions. **Below 90, stop and close the gap** — ask the specific question, propose two directions, or spike the risky technique in isolation. A 30-minute spike beats a 6-hour wrong build. If you're below 90 and the user is waiting, say so and name what's missing; a confidently wrong build is worse than a question.

**2. Don't call it done before you've scored it.** `references/qa-rubric.md` is a 100-point rubric across 10 categories. Build, observe, measure, score, fix the lowest category, re-score. **Exit at >= 90 total with no category below 7.** Report the real number. Never report "done" for an 84.

## How to use this skill

For a full end-to-end build, follow **`SOP.md`** — 14 phases, 5 gates, with the confidence gate at Phase 1 and the QA gate at Phase 11. The short version:

1. **Identify the domain.** See `references/domain-playbook.md` for 40+ verticals (hospitality, fashion, beauty, creative pros, professional services, health, real estate, education, tech, commerce, special). Even if the user says "build a site," you must place it in a domain — every domain has an aesthetic elevation path.
2. **Pick the archetype.** Map the domain to one of the 12 in `references/archetypes.md`. A dentist might be a "Brand Microsite." A bakery is also Brand Microsite. A law firm is "VC Firm aesthetic." A photographer is "Designer Portfolio." If the brief straddles two, name both and pick the dominant one.
3. **Pick the base stack.** Astro / Next / Nuxt / Vite-React / Hydrogen / SvelteKit / Webflow — see `references/stack-decisions.md`. The archetype usually dictates this. European craft → Nuxt. US SaaS → Next. Content + speed → Astro. Commerce → Hydrogen.
4. **Plan the signature moment.** ONE thing that makes the site memorable. For a jewelry brand: 3D gem viewer. For a music artist: audio-reactive hero. For a museum: virtual walking tour. For a law firm: animated case-resolution timeline. See `domain-playbook.md` for ideas per domain. **Score your confidence (`SOP.md` Gate B) before proceeding.**
5. **Define the design system.** `references/design-system.md` — modular type scale with a *different ratio for body and display*, negative tracking on display type, non-linear spacing ramp, OKLCH colour with one accent and tinted neutrals, layered shadows with one committed light direction, ratios from the canon. This is the file that decides whether the site looks expensive. `kit/tokens.css` is a working starting point.
6. **Choose the material.** `references/liquid-glass.md` — glass (with real refraction, not 2019 frosted blur), or one of the eight cousin materials. Glass is currently the default *and* the cliché; pick what fits the brand.
7. **Compose building blocks.** From `references/building-blocks.md`, pick ONE pattern per slot: loader, hero, navigation, scroll signature, cursor, transition, footer. Plus content-section patterns as the brief demands. Resist adding more — constraint is the design.
8. **Assemble the library combo.** Pull from `references/recipes.md` first (14 proven combos) and `references/libraries.md` for replacements. Cite specific npm package names.
9. **Produce assets.** `references/assets.md` — generate what you can (grain, mesh gradients, patterns, OG images), source the rest with licences recorded, optimize with the real commands. **Write real copy.** Never show a review a page with Lorem ipsum or a gray box.
10. **Specify the motion.** `references/motion-spec.md` — the actual numbers. Duration ladder, easing per motion type, stagger math, choreography, single-RAF rule. Motion that feels expensive is a 340ms duration and a `cubic-bezier(0.16, 1, 0.3, 1)`, not a bigger library.
11. **Build perf in from day 1.** Aesthetic + animated + optimized — all three, simultaneously. See `references/performance.md`.
12. **Scaffold.** Create the project, install dependencies, set up smooth scroll + GSAP context + reduced-motion gating + design tokens BEFORE feature work. `kit/` has this foundation already built.
13. **Score and iterate.** `references/qa-rubric.md` until >= 90.

## Selection matrix (rough first cut)

| Brief says... | Archetype | Default stack |
|---|---|---|
| "Launching a product / feature" | Editorial Product Launch | Next.js + GSAP + R3F |
| "VC / investment firm / law firm / accountant" | VC Firm | Astro + Motion One |
| "Freelance designer / dev / photographer / illustrator" | Designer Portfolio | Vite + React + GSAP + R3F |
| "Creative studio / agency" | Studio Showreel | Next.js OR Nuxt 3 + full GSAP + R3F + shaders |
| "Deep dive on one big project" | Case-Study Microsite | Astro + GSAP ScrollTrigger |
| "Campaign / limited-run drop / wedding site" | Brand Microsite | Vite + GSAP + Tone.js |
| "Conference / event / hackathon" | Conference | Next.js + Sanity + Framer Motion |
| "Fashion / lookbook / hotel / restaurant / luxury real estate" | Cinematic Lookbook | Next.js + Mux + Hydrogen |
| "Art piece / experimental / generative" | Net-Art One-Pager | Vite + raw Three.js |
| "Personal site, fast & clean / author / writer" | Minimalist Brutalist | Astro + Markdown |
| "B2B SaaS / AI startup / dev tool marketing" | WebGL Hero SaaS | Next.js + R3F + Framer Motion |
| "Docs site / API reference" | Design-Forward Docs | Astro Starlight / Nextra |
| "Dentist / clinic / gym / local business / NGO / café" | Brand Microsite (elevated) | Astro + motion + Rive |
| "Music artist / band / podcast / film" | Studio Showreel + audio-reactive | Next.js + R3F + Tone.js + Howler |
| "Museum / gallery / university / cultural" | Editorial Astro + Case Study | Astro + GSAP + Sanity |
| "E-commerce / D2C / single-product brand" | Cinematic Lookbook + Editorial Launch | Hydrogen + R3F + Mux |

When the user names a reference site, map it (don't clone it): Shopify Editions → Editorial Product Launch energy. Floema → Case-Study Microsite / Studio Showreel. Linear / Vercel / Resend → WebGL Hero SaaS. Simon Holm → Designer Portfolio. ref.digital / Obsidian → Studio Showreel. Hashgraph VC → VC Firm with a signature WebGL moment. Apple product page → Editorial Product Launch.

For domain-specific elevation paths (40+ verticals from dentist to opera house), see `references/domain-playbook.md` — it's the first file to read for any concrete brief.

## The default modern stack (when in doubt)

Most design-forward work today reaches for some shape of this:

- **Meta-framework:** Astro for content-heavy / mostly static; Next.js (App Router) for interactive + ISR; Nuxt 3 if Vue (lots of agency sites — Obsidian, Hashgraph, ref, Floema — use it); Vite + React for pure SPA / experimental.
- **Smooth scroll:** `lenis` (was `@studio-freight/lenis`) — the current king. Use `lenis/react` if React. Skip Lenis for minimalist / VC / docs archetypes where "feel fast" beats "feel smooth."
- **Animation:** `gsap` + `ScrollTrigger` for timelines and scroll-driven choreography. `motion` (formerly `framer-motion`) for React component-level state + layout animations. They coexist; don't pick one.
- **Text splitting:** `split-type` (free) or GSAP `SplitText` (free since 3.13) for line/word/char reveals.
- **3D:** `three` + `@react-three/fiber` + `@react-three/drei` + `@react-three/postprocessing`. For lighter, shader-first work (Floema-style), reach for `ogl` instead of three.
- **Page transitions:** Built-in View Transitions API (Astro / `next-view-transitions`). For Nuxt or MPA studios: `@barba/core` or `swup`.
- **Cursor:** `mouse-follower` (Cuberto) for the magnetic / sticky cursor that 60% of Awwwards SOTDs ship. Or hand-roll for brand specificity.
- **CMS:** Sanity (most common in studio work — Hashgraph, Floema), Storyblok (ref.digital), Prismic (slice machine — great for Nuxt agencies), Keystatic / MDX for code-as-content.
- **Type:** Variable fonts via `@fontsource-variable/*`. `react-wrap-balancer` for headlines. `fontaine` for fallback metric overrides (kills layout shift).
- **UI primitives (when needed):** Radix / shadcn, plus the Emil Kowalski / pacocoursey kit: `vaul`, `sonner`, `cmdk`, `input-otp`.
- **Image polish:** `plaiceholder` or `thumbhash` for LQIP; `sharp` server-side; AVIF first.
- **Debug:** `leva` for live-tuning R3F scenes; `tweakpane` for vanilla. `r3f-perf` HUD.

## Niche gems an average AI won't suggest (memorize these)

These are the libraries that separate a studio site from a Bootstrap site. Reach for them when the brief calls for distinctive motion, not when you want safe defaults.

- **OGL** — lighter Three alternative. Floema, Damien Mortini, Locomotive client work. Pick when you want shader-first, single-mesh hero with no scene-graph overhead.
- **Lygia** — composable GLSL function library (noise, sdf, color, generative). Imports via `glslify`.
- **troika-three-text** — only way to render crisp, SDF-based 3D text in Three. Non-negotiable if you have text inside a WebGL scene.
- **curtains.js** — turns DOM `<img>` / `<video>` into WebGL planes you can apply shaders to. Used for hover image distortion heroes.
- **Paper Shaders** (`@paper-design/shaders-react`) — drop-in shader components (MeshGradient, Warp, DotOrbit, Halftone, Dithering). Stripe/Linear-grade hero gradient in 30 minutes, no GLSL required.
- **Unicorn Studio** — no-code WebGL editor; designer authors, you embed a 29kb runtime. Escape hatch for design-led teams.
- **TresJS + Cientos** — Vue/Nuxt equivalents of R3F + drei. Critical for the European agency Nuxt stack.
- **Mouse Follower** (Cuberto) — `mouse-follower` npm. The cursor effect on countless Awwwards SOTDs.
- **darkroom.engineering ecosystem** — `lenis` + `@darkroom.engineering/tempus` (centralized RAF) + `hamo` (React hooks for raf/scroll/visibility). Use tempus when Lenis, GSAP, and R3F coexist to prevent jank. Clone **Satūs** or **Novus** as a starter.
- **SplitType** — modern free replacement for GSAP SplitText (GSAP's SplitText is also free now since 3.13).
- **Theatre.js** + **Motion Canvas** — visual / code-driven keyframing editors. Export R3F animations as JSON. The way to do cinematics without writing tweens by hand.
- **leva** + **tweakpane** — live GUI tuning for shaders / scenes. Wire behind `NODE_ENV === 'development'`. You will hate yourself if you tweak uniforms by reload-and-pray.
- **vite-plugin-glsl** — `import frag from './x.glsl'` with HMR. Foundation of any custom-shader workflow.
- **gltf-transform** CLI — `@gltf-transform/cli`. Cuts glTF model file sizes 80%+. Must-have if shipping any 3D model.
- **maath** — math utilities for R3F (easing, random, buffer helpers). By Paul Henschel.
- **detect-gpu** — gate WebGL quality / features by device tier. Mobile saves.
- **normalize-wheel** + **virtual-scroll** + **lethargy** — the trio for hand-rolled custom scroll (horizontal galleries, momentum on touchpad vs mouse).
- **Splitting.js** — older but still everywhere; wraps chars/words/lines with `--char-index` CSS vars for stagger.
- **VFX-JS / react-vfx** — bind GLSL effects directly to DOM `<img>` / `<video>` / text. Awwwards bait.
- **simplex-noise** + **alea** + **eases** + **bezier-easing** + **gl-matrix** — the generative-math kitbag every R3F site quietly depends on.
- **three-mesh-line** — thick WebGL lines (Three's default can't do thickness in WebGL2).
- **Spector.js** (Chrome extension) — capture WebGL draw calls on any site. How you reverse-engineer effects you admire.
- **Hydra** (`hydra-synth`) — live-coded visuals, installation work.
- **Mediabunny** — browser-native video processing (cut, transcode). New, niche.
- **Rive** — interactive vector runtime with state machines. What Shopify Editions and ref.digital use instead of Lottie for stateful motion.
- **Spline** — embed-friendly 3D for teams who don't want to write R3F. Escape hatch for campaign / SaaS hero work.
- **dotLottie** (`@lottiefiles/dotlottie-web`) — 70% smaller than `lottie-web`, the modern player.
- **Embla Carousel** — the studio favorite slider; low-level, plugin-rich; pick over Swiper for custom-feeling galleries.
- **react-wrap-balancer** — fixes orphaned words in headlines. Shu Ding.
- **Capsize** + **fontaine** — pixel-perfect typography metrics; kill CLS from font swaps.
- **Partytown** — run third-party scripts (GTM, analytics) off-main-thread. Critical when CWV matters and marketing wants 12 trackers.
- **Pagefind** — static-site search; beats Algolia on cost for docs / portfolios.
- **es-toolkit** — modern, lighter lodash replacement. Default to this over `lodash-es`.
- **unjs ecosystem** — `ofetch`, `defu`, `destr`, `consola`, `unstorage`, `pathe`, `scule`, `h3`. Studio toolkits depend on these.

For the full catalog see `references/libraries.md`. For 14 proven combo recipes (Classic Awwwards, darkroom.engineering, Floema, Codrops, Cuberto, Generative Hero, Linear/Vercel, Custom Scroll-Driven, Image-Distortion, Paper Shaders SaaS, European Nuxt Agency, etc.) see `references/recipes.md`. For the canonical agency-wiring pattern (persistent-canvas trick, single-RAF rule, who to study, Spector.js reverse-engineering) see `references/agency-wiring.md`.

## The signature-moment principle

Every site in this aesthetic has one moment that's "the thing." Hashgraph: depth-mapped portrait shaders. Floema: hand-illustrated parallax bike + multi-track ambient audio. Shopify Editions: Rive-driven titlecard animations. Simon Holm: GSAP Observer-driven curtain transitions. Obsidian Assembly: bespoke custom-cursor + scoped Vue scroll choreography.

**Before writing code, decide what yours is.** Ask the user if they don't know. Without a signature moment the site is just "fast and clean," not "memorable." Bake the moment into the hero or the first scroll-section so it sells the rest of the site.

## Workflow for actually scaffolding

When the user is ready to start the project:

1. Confirm the archetype + signature moment in one sentence.
2. State the stack: meta-framework + animation + scroll + 3D (if any) + cursor + type + CMS. Quote npm package names.
3. Run scaffold: `npm create astro@latest` / `npx create-next-app@latest` / `npm create vite@latest`. Match TS + the user's package manager.
4. Install deps in one shot. Group by category in the install command so the user can see what each does.
5. Set up the foundation files BEFORE feature work:
   - Lenis instance + GSAP ScrollTrigger sync (via `tempus` or a shared `useLenis` hook)
   - `prefers-reduced-motion` global gate
   - Font loading with metric override (`fontaine` or `next/font`)
   - CSS reset + design tokens (color, type scale, spacing) as CSS custom properties
   - Reduced-motion-safe base transitions
6. Then the hero / signature moment.
7. Then everything else.

## Reduced motion and performance — non-negotiable

Design-forward doesn't mean inaccessible. Every animation must respect `prefers-reduced-motion`. Every WebGL hero needs a static poster fallback for LCP. Every audio layer needs a default-muted state with a visible toggle. See `references/performance.md` for the playbook including: LCP strategies for WebGL heroes, when to lazy-mount R3F, GPU-tiering with detect-gpu, audio autoplay rules, OG image generation, font CLS, INP targets for ScrollTrigger-heavy pages.

## When the user names a reference site

If they say "build something like {site}", do this:
- Recognize the archetype. Don't try to clone the site; clone the recipe.
- If you genuinely don't know the site, fetch the homepage HTML and look for signatures: `_nuxt/` (Nuxt), `__NEXT_DATA__` (Next), `astro-` (Astro), `data-wf-page` (Webflow), `GSAP` / `ScrollTrigger` / `Lenis` strings in entry chunks, `cdn.sanity.io` / `prismic.io` / `storyblok` for CMS, `cdn.shopify.com/oxygen-v2` for Hydrogen.
- Surface what you found. Then propose your version.

## The craft rules — memorize these, they cost nothing and change everything

The highest leverage per keystroke in the whole skill. Most "AI-generated site" tells are on this list.

**Type**
- Display type over 48px gets **negative tracking** (`-0.02em` to `-0.05em`). Untracked 100px type is the single loudest amateur tell.
- Display line-height is **0.9–1.1**, never 1.5.
- Body copy is **45–75ch**. Never full-width.
- Two font families maximum. Three is a warning sign.
- Use `clamp()` for fluid type, solved from two points — never raw `vw`.

**Colour**
- Build ramps in **OKLCH**, not HSL. Peak chroma in the middle.
- **Tint your grays** with the brand hue. Never `#808080`.
- Never `#000` on `#fff` for body copy.
- **One accent.** One.
- No purple-to-pink gradients unless the brand genuinely is that.

**Space & layout**
- Non-linear spacing ramp on a 4pt base. Nothing off-scale.
- **Space between groups > space within groups**, by a clear factor.
- Section gaps of **96–192px** on desktop. Be more generous than feels right.
- Break symmetry at least twice per page. Three equal cards is a Bootstrap page.
- Nested radius: `inner = outer − padding`.

**Depth**
- **Layered shadows** (2–4 stacked), tinted with the surface hue. One flat `box-shadow` is a template.
- Commit to one light direction and make every highlight, rim, and shadow agree.

**Motion**
- Entrances **ease out**, exits **ease in**, exits are **60–75% the duration** of entrances.
- `cubic-bezier(0.16, 1, 0.3, 1)` at 340ms is the default that beats 90% of the web.
- Never `transition: all`. Never `linear` on positional motion. Never easing on a scrub.
- Reveal at **`top 85%`**, not the viewport edge.
- Total stagger under **800ms**. Grids stagger `from: "center"`.
- **One rAF loop** for Lenis + GSAP + R3F.
- Only `transform` and `opacity` in hot paths. `gsap.quickTo`, not `gsap.to`, on pointermove.

**Non-negotiables**
- `prefers-reduced-motion` gating built on **day one** — and the page must be **fully readable** with it on. A blank page under reduced motion is a total failure and an extremely common one.
- `:focus-visible` on everything. Never `outline: none` without a designed replacement.
- Every `<img>` has `width`, `height`, and real `alt`.
- LCP image: preloaded, `fetchpriority="high"`, never lazy.
- No Lorem ipsum, no gray boxes, no `placeholder.com`, ever — not even in a work-in-progress review.

## Reference files

**Process**
- `SOP.md` — **the end-to-end procedure.** 14 phases, 5 gates. Includes the Phase-1 confidence score (don't build below 90) and the brief template. **READ FIRST for any full-site build.**
- `references/qa-rubric.md` — the 100-point rubric across 10 categories, the amateur-tells hit list, the self-critique loop, automated check commands, device matrix, pre-ship checklist. **READ BEFORE calling anything done.**

**Craft**
- `references/design-system.md` — proportions and the craft layer: modular type scales, the fluid-clamp formula, tracking/leading tables, the 4pt spacing ramp, grids, aspect-ratio canon, optical alignment, nested radius, OKLCH colour construction, layered shadows, focus states, responsive strategy. **READ BEFORE writing any CSS.**
- `references/liquid-glass.md` — Liquid Glass: what it actually is (lensing, not blur), CSS-only tier, SVG `feDisplacementMap` refraction with chromatic aberration, WebGL transmission, the legibility problem, performance budget, when NOT to use it, and 9 cousin materials (metal, riso, clay, holographic, dithered, neon, raw, chrome, soft-body).
- `references/motion-spec.md` — the numbers: duration ladder, easing values and when each applies, spring parameters, stagger math, choreography (overlap/lead-follow/anticipation), scroll-driven motion, the single-RAF rule, a signature-move cookbook, reduced-motion policy, frame budget.
- `references/assets.md` — generate > source > commission. Grain, mesh gradients, noise, patterns; where to get free-and-licensed photography, type, icons, 3D, motion, audio; the full optimization pipeline with real `sharp` / `ffmpeg` / `svgo` / `glyphhanger` / `gltf-transform` commands; licence manifests; placeholder discipline.

**Catalog**
- `references/domain-playbook.md` — 40+ business verticals × aesthetic elevation path. Restaurant, café, brewery, hotel, fashion, beauty, jewelry, photographer, filmmaker, illustrator, music artist, podcast, law firm, accountant, consultancy, dentist, therapist, gym, doctor, real estate, architect, furniture, university, museum, NGO, author, B2B SaaS, AI startup, crypto, dev tool, indie hacker, single-product brand, marketplace, D2C, personal portfolio, wedding, travel, newsletter, recruiting, religious community, local service. **READ FIRST** when the brief is for any specific business domain.
- `references/archetypes.md` — 12 site archetypes with full recipes (READ when mapping domain → archetype)
- `references/building-blocks.md` — mixable UI/UX patterns: loaders, heroes, navigation, page transitions, cursors, scroll signatures, footers, audio UI, forms, image patterns, typography patterns, themes, 404s, easter eggs (READ when composing the actual site — pick ONE per slot)
- `references/libraries.md` — 240+ library catalog by category, tiered essential / popular / niche-gem (READ when assembling a stack)
- `references/recipes.md` — 14 proven combos: Classic Awwwards, React Spatial, darkroom.engineering, Floema, Codrops, Editorial Astro, Generative Hero, Linear/Vercel Marketing, Custom Scroll-Driven, Image-Distortion Hero, Cuberto Showcase, Generative Art Portfolio, Paper Shaders SaaS, European Nuxt Agency (READ when you want a starting combo)
- `references/stack-decisions.md` — Astro vs Next vs Nuxt vs Vite-React vs SvelteKit vs Hydrogen vs Webflow vs 11ty, when each wins (READ when the meta-framework is unclear)
- `references/performance.md` — perf playbook: LCP for WebGL heroes, GPU tiering, font CLS, INP, audio rules (READ before shipping)
- `references/agency-wiring.md` — the canonical agency pattern: persistent-canvas-across-page-transitions trick, single-RAF rule, studios + people worth studying (Damien Mortini, darkroom.engineering, Bürocratik, Luis Bizzaro, Bruno Simon, Poimandres), Spector.js reverse-engineering workflow, Paper Shaders / Unicorn Studio tier, the Nuxt-vs-Next geographic split (READ when working on a high-craft agency-style site)

**Code**
- `kit/` — copy-paste foundation. `tokens.css` (tokens + reset + layout + reveal + grain + preference gates), `glass.css` (liquid glass, 3 tiers + 6 cousin materials), `filters.svg` (generated SVG filter defs), `gen-filters.mjs` (regenerator), `motion.js` (zero-dependency: single-rAF ticker, reveals, line-mask split, magnetic, cursor, counters, parallax, tilt, marquee, glass feature detection). Retune the tokens to the brand — shipping the defaults unchanged means nobody made a decision.
- `demo/` — a complete working one-page site built from the kit. Open `demo/index.html` in a browser; no build step. Use it to see the material and motion before writing your own, and as a reference for how the pieces wire together.
