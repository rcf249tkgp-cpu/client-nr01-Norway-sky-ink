// Static site build: `npm run build` → dist/
// Pages: / (norsk), /en/, /personvern/, /en/privacy/ + sitemap and robots.
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import cfg from './src/config.mjs';
import no from './src/i18n/no.mjs';
import en from './src/i18n/en.mjs';
import works from './src/data/works.mjs';
import reviews from './src/data/reviews.mjs';
import { renderHome, renderPrivacy } from './src/render.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const manifest = JSON.parse(await readFile(join(root, 'src/data/images.json'), 'utf8'));

for (const w of works) {
  if (!manifest[w.id]) throw new Error(`Missing image "${w.id}" – run: python3 scripts/images.py build`);
}

const version = Date.now().toString(36);
const today = new Date().toISOString().slice(0, 10);
const year = new Date().getFullYear();
const ctx = { works, manifest, reviews, year, updated: today };

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });

// Vendor scripts and self-hosted fonts (no third-party requests on load – GDPR friendly).
const copies = [
  ['node_modules/gsap/dist/gsap.min.js', 'assets/vendor/gsap.min.js'],
  ['node_modules/gsap/dist/ScrollTrigger.min.js', 'assets/vendor/ScrollTrigger.min.js'],
  ['node_modules/lenis/dist/lenis.min.js', 'assets/vendor/lenis.min.js'],
  ['node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-normal.woff2', 'assets/fonts/bodoni-moda-latin-opsz-normal.woff2'],
  ['node_modules/@fontsource-variable/bodoni-moda/files/bodoni-moda-latin-opsz-italic.woff2', 'assets/fonts/bodoni-moda-latin-opsz-italic.woff2'],
  ['node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2', 'assets/fonts/jost-latin-wght-normal.woff2'],
  ['node_modules/@fontsource/pinyon-script/files/pinyon-script-latin-400-normal.woff2', 'assets/fonts/pinyon-script-latin-400-normal.woff2'],
];
for (const [from, to] of copies) {
  if (!existsSync(join(root, from))) throw new Error(`Missing ${from} – run: npm install`);
  await mkdir(dirname(join(dist, to)), { recursive: true });
  await cp(join(root, from), join(dist, to));
}

const pages = [
  ['index.html', renderHome(cfg, no, ctx)],
  ['en/index.html', renderHome(cfg, en, ctx)],
  ['personvern/index.html', renderPrivacy(cfg, no, ctx)],
  ['en/privacy/index.html', renderPrivacy(cfg, en, ctx)],
];
for (const [file, html] of pages) {
  const out = join(dist, file);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, html.replaceAll('__V__', version));
}

const urls = [
  ['/', '/en/', '1.0'],
  ['/personvern/', '/en/privacy/', '0.3'],
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .flatMap(([nb, enPath, prio]) =>
    [nb, enPath].map(
      (loc) => `  <url>
    <loc>${cfg.siteUrl}${loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${prio}</priority>
    <xhtml:link rel="alternate" hreflang="nb" href="${cfg.siteUrl}${nb}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${cfg.siteUrl}${enPath}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${cfg.siteUrl}${nb}"/>
  </url>`,
    ),
  )
  .join('\n')}
</urlset>
`;
await writeFile(join(dist, 'sitemap.xml'), sitemap);
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${cfg.siteUrl}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages → dist/ (v${version})`);
