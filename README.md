# Kalakar — Design-Forward Website Skill

A Claude Code skill for building **NEW award-winning, design-forward websites** for any domain — Awwwards / FWA / SOTD caliber, heavily aesthetic, animated, AND optimized.

This is a **creator** skill, not a cloner. Reference sites (Floema, Shopify Editions, Linear, Vercel, Hashgraph VC, ref.digital, Obsidian Assembly, Simon Holm Studio) are inspiration — you mix building blocks to produce original work.

## What it knows

- **12 site archetypes** — Editorial Product Launch, VC Firm, Designer Portfolio, Studio Showreel, Case-Study Microsite, Brand Microsite, Conference, Cinematic Lookbook, Net-Art One-Pager, Minimalist Brutalist, WebGL Hero SaaS, Design-Forward Docs.
- **40+ business verticals** with aesthetic elevation paths — restaurants, dentists, photographers, law firms, real estate, fashion, music artists, NGOs, SaaS, AI startups, agencies, conferences, museums, weddings, hotels, gyms, e-commerce, and more.
- **240+ libraries** catalogued by category and tier (essential / popular / niche-gem), including the niche gems average AIs miss: OGL, Lygia, troika-three-text, curtains.js, Mouse Follower, Lenis, `@darkroom.engineering/tempus`, hamo, SplitType, Theatre.js, Tweakpane, leva, Paper Shaders, Unicorn Studio, TresJS + Cientos, gltf-transform, Spector.js, VFX-JS, Mediabunny, Rive, Spline, and many more.
- **14 proven combo recipes** — Classic Awwwards, React Spatial, darkroom.engineering, Floema, Codrops, Editorial Astro, Generative Hero, Linear/Vercel Marketing, Custom Scroll-Driven, Image-Distortion Hero, Cuberto Showcase, Generative Art Portfolio, Paper Shaders SaaS, European Nuxt Agency.
- **Mixable building blocks** — 9 loaders, 13 hero patterns, 9 nav styles, 7 transitions, 8 cursors, 10 scroll signatures, 8 footers + audio/form/image/type/theme/404/easter-egg patterns. Pick ONE per slot — constraint is the design.
- **Stack decisions** — Astro vs Next vs Nuxt vs Vite-React vs SvelteKit vs Hydrogen vs Webflow vs 11ty.
- **Performance playbook** — LCP for WebGL heroes, GPU tiering with `detect-gpu`, font CLS, INP targets, audio rules, OG image generation.
- **Agency wiring patterns** — the persistent-canvas-across-page-transitions trick, single-RAF rule with `tempus`, studios + people worth studying (Damien Mortini, darkroom.engineering, Bürocratik, Luis Bizzaro, Bruno Simon, Poimandres), Spector.js reverse-engineering workflow.

## Install

### Option 1 — Drop-in install (Claude Code)

Copy the `design-forward-website` folder into your Claude Code skills directory:

**Windows:**
```
%USERPROFILE%\.claude\skills\design-forward-website\
```

**macOS / Linux:**
```
~/.claude/skills/design-forward-website/
```

Restart Claude Code. The skill triggers automatically on prompts like "build a website for X" or "create a portfolio site."

### Option 2 — Install the packaged `.skill` file

Use `design-forward-website.skill` (zip-packaged) and import it via Claude Code's plugin / skill installer.

## Usage

Once installed, just describe what you want:

- "Build a website for my dentist clinic, but make it feel like Hashgraph VC."
- "Create a site for an indie perfume brand I'm launching."
- "Landing page for an AI vector database startup."
- "Wedding invitation site, design-forward, ambient sound, custom cursor."
- "Portfolio site for a film director."

The skill walks Claude through: identify domain → pick archetype → choose stack → plan signature moment → compose building blocks → assemble library combo → scaffold with perf + reduced-motion baked in from day 1.

## File map

```
design-forward-website/
├── SKILL.md                          # workflow + niche-gem hit list
└── references/
    ├── domain-playbook.md            # 40+ verticals × elevation paths
    ├── archetypes.md                 # 12 site archetypes
    ├── building-blocks.md            # mixable UI/UX patterns
    ├── libraries.md                  # 240+ library catalog
    ├── recipes.md                    # 14 proven combos
    ├── stack-decisions.md            # meta-framework picker
    ├── performance.md                # perf playbook
    └── agency-wiring.md              # canonical agency pattern
```

## Author

Made by **Lavya** ([@LAVYA255](https://github.com/LAVYA255)) with Claude.

## License

MIT — use it, fork it, remix it. Credit appreciated, not required.
