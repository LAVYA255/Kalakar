/**
 * demo/scripts/gen-assets.mjs
 *
 * Generates every raster/vector asset the demo needs — with zero npm
 * dependencies. This is `references/assets.md` section 1 in practice:
 * GENERATE before you SOURCE.
 *
 *   assets/noise-256.png   grayscale noise tile (pure-JS PNG encoder)
 *   assets/grid.svg        dot grid, radially masked
 *   assets/favicon.svg     mark
 *   assets/og.svg          1200x630 social card
 *   assets/CREDITS.md      licence manifest
 *
 * Run: node demo/scripts/gen-assets.mjs
 */

import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
mkdirSync(OUT, { recursive: true });

/* ==========================================================================
   Minimal PNG encoder — grayscale, 8-bit, no dependencies.
   PNG = signature + IHDR + IDAT (zlib of filtered scanlines) + IEND,
   each chunk length-prefixed and CRC32-suffixed.
   ========================================================================== */

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** @param {number} size @param {(x:number,y:number)=>number} fn 0-255 */
function grayPng(size, fn) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 0;   // colour type 0 = grayscale
  ihdr[10] = 0;  // deflate
  ihdr[11] = 0;  // adaptive filtering
  ihdr[12] = 0;  // no interlace

  // each scanline is prefixed with its filter byte (0 = None)
  const raw = Buffer.alloc(size * (size + 1));
  let p = 0;
  for (let y = 0; y < size; y++) {
    raw[p++] = 0;
    for (let x = 0; x < size; x++) raw[p++] = fn(x, y) & 0xff;
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* Deterministic PRNG — a fixed seed means the asset is reproducible, which
   matters when it is committed to a repo. Math.random() would produce a diff
   on every build. */
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(0x4b414c41); // "KALA"

// Value noise, 2 octaves — clumpier and more film-like than flat white noise,
// without implementing full void-and-cluster blue noise.
const SIZE = 256;
const lattice = (n) => {
  const g = new Float32Array(n * n);
  for (let i = 0; i < g.length; i++) g[i] = rand();
  return g;
};
const L1 = lattice(64), L2 = lattice(256);
const sample = (g, n, x, y) => g[(y % n) * n + (x % n)];

writeFileSync(
  join(OUT, "noise-256.png"),
  grayPng(SIZE, (x, y) => {
    const a = sample(L2, 256, x, y);
    const b = sample(L1, 64, x >> 2, y >> 2);
    return Math.round((a * 0.72 + b * 0.28) * 255);
  })
);

/* ==========================================================================
   Vector assets
   ========================================================================== */

// Dot grid, radially masked so it fades out instead of stopping at a hard edge
writeFileSync(join(OUT, "grid.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
  <defs>
    <pattern id="d" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor"/>
    </pattern>
    <radialGradient id="fade" cx="50%" cy="42%" r="62%">
      <stop offset="0%" stop-color="#fff" stop-opacity="1"/>
      <stop offset="55%" stop-color="#fff" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="1600" height="900" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1600" height="900" fill="url(#d)" mask="url(#m)"/>
</svg>
`);

// Favicon — concentric refracting rings, the "lens" idea reduced to a mark
writeFileSync(join(OUT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8b7cf6"/>
      <stop offset="100%" stop-color="#22d3ee"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="16" fill="#12101a"/>
  <circle cx="32" cy="32" r="19" fill="none" stroke="url(#g)" stroke-width="2.5" opacity="0.95"/>
  <circle cx="32" cy="32" r="12" fill="none" stroke="url(#g)" stroke-width="2" opacity="0.6"/>
  <circle cx="32" cy="32" r="5"  fill="url(#g)"/>
</svg>
`);

// OG card 1200x630. In production, rasterize to PNG (satori + resvg, or a
// Playwright screenshot) — several social crawlers will not render SVG.
writeFileSync(join(OUT, "og.svg"), `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="a" cx="18%" cy="22%" r="70%">
      <stop offset="0%" stop-color="#6d5cf0" stop-opacity="0.85"/><stop offset="100%" stop-color="#6d5cf0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="b" cx="84%" cy="12%" r="60%">
      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.55"/><stop offset="100%" stop-color="#22d3ee" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="c" cx="70%" cy="92%" r="65%">
      <stop offset="0%" stop-color="#e879f9" stop-opacity="0.45"/><stop offset="100%" stop-color="#e879f9" stop-opacity="0"/>
    </radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
  </defs>
  <rect width="1200" height="630" fill="#0d0b14"/>
  <rect width="1200" height="630" fill="url(#a)"/>
  <rect width="1200" height="630" fill="url(#b)"/>
  <rect width="1200" height="630" fill="url(#c)"/>
  <rect width="1200" height="630" filter="url(#n)" opacity="0.06"/>
  <text x="80" y="300" font-family="Georgia,serif" font-size="132" letter-spacing="-5" fill="#f5f3ff">Kalakar</text>
  <text x="86" y="366" font-family="system-ui,sans-serif" font-size="27" letter-spacing="1" fill="#a9a3c4">Award-grade websites, for any domain.</text>
  <text x="86" y="418" font-family="system-ui,sans-serif" font-size="19" letter-spacing="3" fill="#6d5cf0">DESIGN SYSTEM · LIQUID GLASS · MOTION SPEC · SOP · QA RUBRIC</text>
  <rect x="80" y="470" width="184" height="3" fill="#6d5cf0"/>
</svg>
`);

writeFileSync(join(OUT, "CREDITS.md"), `# Asset credits

Every IMAGE on this page is generated — see \`scripts/gen-assets.mjs\` and
\`kalakar/kit/gen-filters.mjs\`. The typefaces are third-party and are the only
thing here carrying an external licence.

| File | Origin | Licence | Attribution required |
|---|---|---|---|
| assets/noise-256.png | generated (pure-JS PNG encoder, seeded value noise) | MIT (this repo) | No |
| assets/grid.svg | generated | MIT (this repo) | No |
| assets/favicon.svg | generated | MIT (this repo) | No |
| assets/og.svg | generated | MIT (this repo) | No |
| kalakar/kit/filters.svg | generated (gen-filters.mjs) | MIT (this repo) | No |
| assets/fonts/inter-latin.woff2 | Inter, Rasmus Andersson (via Google Fonts) | SIL Open Font License 1.1 | No, but OFL text must ship if the font is redistributed |
| assets/fonts/instrument-serif-*.woff2 | Instrument Serif, Rodrigo Fuenzalida + Jordan Egstad (via Google Fonts) | SIL Open Font License 1.1 | Same |

**OFL in practice:** free for commercial use, embedding, and web serving. You
may not sell the font files on their own, and a derivative must not use the
Reserved Font Name. Self-hosting as done here is explicitly permitted.

Keep a table in this shape on every project. Six months later, when someone
asks whether the site's imagery can be used in print, this file is the
difference between a five-minute answer and a re-shoot.
`);

console.log("generated:");
for (const f of ["noise-256.png", "grid.svg", "favicon.svg", "og.svg", "CREDITS.md"]) {
  console.log("  assets/" + f);
}
