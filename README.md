# Sky Ink Tattoo – website

Website for **Sky Ink Tattoo**, the tattoo studio of Skaiste Juskiene in Askim (since 2019).
Norwegian (bokmål) at `/`, English at `/en/`, plus privacy pages at `/personvern/` and `/en/privacy/`.

Static HTML/CSS/JS with no framework or server needed. GSAP + ScrollTrigger and Lenis handle the motion layer, and fonts are self-hosted (no Google requests, which is better for GDPR).

## Quick start

```bash
npm install
npm run build     # → dist/
npm run preview   # http://localhost:4173
```

Deploy by uploading `dist/` to any static host (Cloudflare Pages, Netlify, Vercel, one.com …).
Build command: `npm run build`, output directory: `dist`.

## Where to change things

| What | File |
| --- | --- |
| Phone, address, opening hours, email, social links, domain, form endpoint, logo, photos | `src/config.mjs` |
| All Norwegian text | `src/i18n/no.mjs` |
| All English text | `src/i18n/en.mjs` |
| Portfolio pieces (title, alt text, style filters) | `src/data/works.mjs` |
| Facebook reviews for the slider | `src/data/reviews.mjs` |
| Page structure | `src/render.mjs` |
| Styles / animations | `public/assets/css/main.css`, `public/assets/js/main.js` |

Run `npm run build` after every change.

### Before going live

- [ ] **Domain**: set `siteUrl` in `src/config.mjs`. It's a placeholder (`https://www.skyinktattoo.no`) and is used for canonical, hreflang, sitemap and schema.
- [ ] **Booking form**: create a free form endpoint (e.g. Formspree) and set `formEndpoint`. Until then the form validates the inquiry and gives the visitor a ready-written SMS or Messenger message instead of sending it.
- [ ] **Messenger**: set `social.messenger` to the page's `https://m.me/<username>` link. For now it opens the Facebook page.
- [ ] **Reviews**: paste real Facebook reviews into `src/data/reviews.mjs`. Until then the section shows the “100 % anbefaler” badge with a link to Facebook.
- [ ] **Portrait / logo / studio photos**: add files to `public/assets/img/…` and set the paths in `config.photos` / `config.logo`. Placeholders are shown until then.
- [ ] **Tattoos done**: set `tattoosDone` once Skaiste has a real number. Until then the 4th stat shows the review count.
- [ ] **About text**: Skaiste should read the first-person intro (`about.paragraphs`) and adjust it to her own story.
- [ ] **Privacy policy**: the retention period (12 months) is a suggested default. Confirm it.
- [ ] Email: add `email` in config whenever there is one. It then appears in contact, footer, schema and privacy.

## Images

Client photos go through `scripts/images.py`:

```bash
python3 scripts/images.py redact <folder-with-original-photos>   # → src/images/masters/
python3 scripts/images.py build                                  # → public/assets/img/work/*.webp
python3 scripts/textures.py                                      # smoke textures (already generated)
```

`redact` removes client names and dates from memorial pieces (lettering is painted out or cropped
away). **Only redacted masters are in the repo** – keep the original photos outside it. If a client approves showing their name, re-export that photo without the redaction.

To add a new portfolio piece: add it to `SOURCES` in `scripts/images.py` (or drop a JPG straight into
`src/images/masters/`), run `build`, then add an entry to `src/data/works.mjs`.

## Accessibility and performance notes

- WebP in 480/800/1200 widths with `srcset`, lazy loading below the fold, and width/height set to avoid layout shift.
- Respects `prefers-reduced-motion`: no intro, no smoke drift, a plain swipe carousel instead of the 3D arc, and no smooth scroll.
- The 3D arc only runs on screens ≥ 900px. Phones get a native scroll-snap swipe carousel.
- Keyboard: skip link, visible focus, focus rotates the arc to the focused card, the lightbox supports arrow keys and Escape, and the carousel has a pause button.
- The Google Map only loads after “Vis kart” (no third-party cookies before consent).
