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

// 404 page (served by Cloudflare Workers assets via not_found_handling: "404-page")
await writeFile(
  join(dist, '404.html'),
  `<!doctype html>
<html lang="nb">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Siden finnes ikke | Sky Ink Tattoo</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/css/main.css?v=${version}">
</head>
<body class="page-legal">
<main class="legal" id="main">
  <div class="container legal__inner">
    <h1 class="legal__title">Siden finnes ikke</h1>
    <p>Lenken kan være feil, eller siden er flyttet. <span lang="en">This page doesn’t exist.</span></p>
    <p style="margin-top:2rem"><a class="btn btn--gold" href="/">Til forsiden</a> <a class="btn btn--ghost" href="/en/" lang="en">English</a></p>
  </div>
</main>
</body>
</html>
`,
);

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
