import { icon, rose, roseSymbol } from './icons.mjs';

// Section anchors per language (readable URLs: /#arbeider, /en/#work).
export const ids = {
  no: {
    work: 'arbeider', services: 'tjenester', about: 'om-meg', giftcards: 'gavekort',
    book: 'bestill', faq: 'sporsmal', aftercare: 'etterbehandling', contact: 'kontakt',
  },
  en: {
    work: 'work', services: 'services', about: 'about', giftcards: 'gift-cards',
    book: 'book', faq: 'faq', aftercare: 'aftercare', contact: 'contact',
  },
};

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const fmt = (n, lang) => new Intl.NumberFormat(lang === 'no' ? 'nb-NO' : 'en-GB').format(n);

const heading = ([plain, gold], tag = 'h2', id = '') =>
  `<${tag} class="h-section"${id ? ` id="${id}"` : ''}><span>${esc(plain)}</span> <span class="gold">${esc(gold)}</span></${tag}>`;

function img(manifest, id, alt, { sizes = '100vw', eager = false, cls = '', width } = {}) {
  const m = manifest[id];
  const src = (w) => `/assets/img/work/${id}-${w}.webp`;
  const widths = width ? m.widths.filter((w) => w <= width) : m.widths;
  const largest = widths[widths.length - 1];
  return `<img${cls ? ` class="${cls}"` : ''} src="${src(Math.min(800, largest))}" srcset="${widths
    .map((w) => `${src(w)} ${w}w`)
    .join(', ')}" sizes="${sizes}" width="${m.w}" height="${m.h}" alt="${esc(alt)}" ${
    eager ? 'fetchpriority="high"' : 'loading="lazy"'
  } decoding="async" style="background:${m.color}">`;
}

function wordmark(cfg, t) {
  if (cfg.logo.mono) {
    return `<img class="logo-img" src="${cfg.logo.mono}" alt="Sky Ink Tattoo" width="160" height="48">`;
  }
  return `<span class="wordmark" aria-hidden="true"><span class="wordmark__script">Sky Ink</span><span class="wordmark__sub">Tattoo</span></span><span class="sr-only">Sky Ink Tattoo</span>`;
}

function schema(cfg, t, works) {
  const a = cfg.address;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    '@id': `${cfg.siteUrl}/#studio`,
    name: cfg.name,
    legalName: cfg.legalName,
    alternateName: 'Sky Ink',
    description: t.meta.description,
    url: `${cfg.siteUrl}${t.path}`,
    telephone: `+47 ${cfg.phone.display}`,
    ...(cfg.email ? { email: cfg.email } : {}),
    image: works.slice(0, 4).map((w) => `${cfg.siteUrl}/assets/img/work/${w.id}-1200.webp`),
    logo: `${cfg.siteUrl}/assets/img/brand/og-image.jpg`,
    foundingDate: String(cfg.founded),
    founder: { '@type': 'Person', name: cfg.owner, jobTitle: t.about.role },
    vatID: `NO${cfg.orgNr.replace(/\D/g, '')}MVA`,
    taxID: cfg.orgNr.replace(/\D/g, ''),
    identifier: { '@type': 'PropertyValue', propertyID: 'Organisasjonsnummer', value: cfg.orgNr.replace(/\D/g, '') },
    address: {
      '@type': 'PostalAddress',
      streetAddress: a.street,
      postalCode: a.postalCode,
      addressLocality: a.city,
      addressRegion: a.region,
      addressCountry: a.country,
    },
    areaServed: ['Askim', 'Indre Østfold', 'Mysen', 'Østfold'].map((n) => ({ '@type': 'Place', name: n })),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.street}, ${a.postalCode} ${a.city}`)}`,
    sameAs: [cfg.social.instagram, cfg.social.facebook],
    knowsAbout: t.about.specialties,
    inLanguage: t.htmlLang,
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;
}

function head(cfg, t, { title, description, path, alternates, robots = 'index,follow' }) {
  const url = `${cfg.siteUrl}${path}`;
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${url}">
${alternates
  .map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${cfg.siteUrl}${a.path}">`)
  .join('\n')}
<meta name="theme-color" content="#0A0A0C">
<meta name="color-scheme" content="dark">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Sky Ink Tattoo">
<meta property="og:locale" content="${t.locale}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${cfg.siteUrl}/assets/img/brand/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/bodoni-moda-latin-opsz-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/jost-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css?v=__V__">
<script>
  document.documentElement.classList.add('js');
  try { if (sessionStorage.getItem('skyink-intro')) document.documentElement.classList.add('no-intro'); } catch (e) {}
</script>`;
}

function header(cfg, t, langPaths, I) {
  const nav = [
    ['work', t.nav.work],
    ['services', t.nav.services],
    ['about', t.nav.about],
    ['giftcards', t.nav.giftcards],
    ['faq', t.nav.faq],
    ['contact', t.nav.contact],
  ];
  const links = nav.map(([k, label]) => `<li><a href="${t.path}#${I[k]}">${esc(label)}</a></li>`).join('');
  const lang = `<div class="lang" role="group" aria-label="${t.nav.langLabel}">
      <a href="${langPaths.no}" hreflang="nb" lang="nb"${t.lang === 'no' ? ' aria-current="true"' : ''}>NO<span class="sr-only"> – norsk</span></a>
      <span aria-hidden="true">/</span>
      <a href="${langPaths.en}" hreflang="en" lang="en"${t.lang === 'en' ? ' aria-current="true"' : ''}>EN<span class="sr-only"> – English</span></a>
    </div>`;
  return `<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="${t.path}" aria-label="${t.nav.home}">${wordmark(cfg, t)}</a>
    <nav class="nav" aria-label="${t.nav.label}">
      <ul class="nav__list">${links}</ul>
    </nav>
    <div class="header-actions">
      ${lang}
      <a class="btn btn--gold btn--sm" href="${t.path}#${I.book}">${esc(t.nav.book)}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        ${icon('menu', 'icon--open')}${icon('close', 'icon--close')}
        <span class="sr-only" data-open-label="${t.nav.open}" data-close-label="${t.nav.close}">${t.nav.open}</span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden data-menu>
    <nav aria-label="${t.nav.label}">
      <ul>${links}<li><a href="${t.path}#${I.book}">${esc(t.nav.book)}</a></li></ul>
    </nav>
    <div class="mobile-menu__foot">
      ${lang}
      <a href="tel:${cfg.phone.href}">${icon('phone')} ${cfg.phone.display}</a>
    </div>
  </div>
</header>`;
}

function hero(cfg, t, works, manifest, I) {
  const cards = works
    .filter((w) => w.hero)
    .map(
      (w, i) => `<li class="arc__card" data-arc-card>
        <button class="arc__btn" type="button" data-open-work="${w.id}" data-cursor="view" aria-label="${esc(`${t.hero.open} ${w.title[t.lang]}`)}">
          <span class="arc__media">${img(manifest, w.id, w.alt[t.lang], {
            sizes: '(min-width: 900px) 240px, 68vw',
            eager: i < 3,
            width: 800,
          })}<span class="arc__shade" aria-hidden="true"></span></span>
        </button>
      </li>`,
    )
    .join('');
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="sky" aria-hidden="true">
    <div class="sky__stars"></div>
    <div class="sky__rays"></div>
    <div class="smoke smoke--a" data-parallax="-0.12"></div>
    <div class="smoke smoke--b" data-parallax="0.08"></div>
  </div>
  <div class="hero__inner">
    <p class="hero__kicker">${rose('rose rose--inline')}<span>${esc(t.hero.kicker)}</span></p>
    <h1 class="hero__title" id="hero-title">${t.hero.lines
      .map((l, i) => `<span class="hero__line" style="--i:${i}">${esc(l)}</span>`)
      .join(' ')}</h1>
    <p class="hero__lead">${esc(t.hero.lead)}</p>
    <ul class="hero__trust" role="list">
      <li><span class="hero__trust-strong">${esc(t.hero.since)}</span></li>
      <li><a href="${cfg.social.facebook}" target="_blank" rel="noopener"><span class="hero__trust-strong">${esc(
        t.hero.trust,
      )}</span> <span class="hero__trust-dim">${esc(t.hero.trustDetail)}</span></a></li>
    </ul>
  </div>
  <div class="arc" data-arc aria-roledescription="carousel" aria-label="${esc(t.hero.carouselLabel)}" role="region">
    <ul class="arc__ring" data-arc-ring role="list">${cards}</ul>
    <div class="arc__controls">
      <span class="arc__hint" aria-hidden="true">${esc(t.hero.carouselHint)}</span>
      <button class="icon-btn icon-btn--sm" type="button" data-arc-toggle aria-pressed="false" data-pause-label="${t.hero.pause}" data-play-label="${t.hero.play}">
        ${icon('pause', 'icon--pause')}${icon('play', 'icon--play')}<span class="sr-only">${t.hero.pause}</span>
      </button>
    </div>
  </div>
  <div class="hero__cta">
    <a class="btn btn--gold" href="${t.path}#${I.book}">${esc(t.hero.book)}</a>
    <a class="btn btn--ghost" href="${t.path}#${I.work}">${esc(t.hero.portfolio)}</a>
  </div>
</section>`;
}

function services(t, I) {
  return `<section class="section services" id="${I.services}" aria-labelledby="${I.services}-title">
  <div class="container">
    <div class="section-head" data-reveal>
      ${heading(t.services.title, 'h2', `${I.services}-title`)}
      <p class="section-lead">${esc(t.services.lead)}</p>
    </div>
    <ul class="service-grid" role="list">
      ${t.services.items
        .map(
          (s) => `<li class="service" data-reveal>
        ${icon(s.icon, 'service__icon')}
        <h3 class="service__title">${esc(s.title)}</h3>
        <p class="service__text">${esc(s.text)}</p>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

function about(cfg, t, I) {
  const portrait = cfg.photos.portrait
    ? `<img src="${cfg.photos.portrait}" alt="${esc(t.about.portraitAlt)}" width="1000" height="1250" loading="lazy" decoding="async">`
    : `<div class="portrait-slot" role="img" aria-label="${esc(t.about.portraitPlaceholder)}">
        ${rose('rose rose--slot')}
        <span>${esc(t.about.portraitPlaceholder)}</span>
      </div>`;
  return `<section class="section about" id="${I.about}" aria-labelledby="${I.about}-title">
  <div class="container about__grid">
    <figure class="about__portrait reveal-img" data-reveal-img>
      <div class="about__frame" data-parallax="-0.06">${portrait}</div>
      <figcaption><span class="about__name">${esc(cfg.owner)}</span><span class="about__role">${esc(t.about.role)}</span></figcaption>
    </figure>
    <div class="about__text">
      ${heading(t.about.title, 'h2', `${I.about}-title`)}
      <p class="about__hello" data-reveal>${esc(t.about.hello)}</p>
      ${t.about.paragraphs.map((p) => `<p data-reveal>${esc(p)}</p>`).join('')}
      <h3 class="about__label" data-reveal>${esc(t.about.specialtiesLabel)}</h3>
      <ul class="tags" role="list" data-reveal>${t.about.specialties.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <div class="about__sign" data-reveal>
        <span class="signature">${esc(t.about.signature)}</span>
        ${rose('rose rose--sign')}
      </div>
      <a class="btn btn--ghost" href="${t.path}#${I.book}" data-reveal>${esc(t.about.cta)}</a>
    </div>
  </div>
</section>`;
}

function stats(cfg, t) {
  const year = cfg.founded;
  const items = [
    { value: year, plain: true, label: t.stats.since },
    { value: cfg.reviews.recommendPercent, suffix: t.lang === 'no' ? ' %' : '%', label: t.stats.recommend },
    { value: cfg.followers, suffix: '+', label: t.stats.followers },
    cfg.tattoosDone
      ? { value: cfg.tattoosDone, suffix: '+', label: t.stats.tattoos }
      : { value: cfg.reviews.count, label: t.stats.reviews },
  ];
  return `<section class="stats" aria-label="${esc(t.stats.label)}">
  <div class="container">
    <ul class="stat-grid" role="list">
      ${items
        .map(
          (s) => `<li class="stat" data-reveal>
        <span class="stat__value"><span data-count="${s.value}"${s.plain ? ' data-plain' : ''}>${
            s.plain ? s.value : fmt(s.value, t.lang)
          }</span>${s.suffix ? `<span class="stat__suffix">${esc(s.suffix)}</span>` : ''}</span>
        <span class="stat__label">${esc(s.label)}</span>
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</section>`;
}

function marquee(t) {
  const words = t.marquee.map((w) => `<span>${esc(w)}</span>${icon('star', 'marquee__star')}`).join('');
  return `<div class="marquee" aria-hidden="true" data-marquee>
  <div class="marquee__track" data-marquee-track><div class="marquee__group">${words}</div><div class="marquee__group">${words}</div></div>
</div>`;
}

function portfolio(cfg, t, works, manifest, I) {
  const f = t.portfolio.filters;
  const filters = Object.entries(f)
    .map(
      ([k, label]) =>
        `<li><button type="button" class="chip" data-filter="${k}" aria-pressed="${k === 'all'}">${esc(label)}</button></li>`,
    )
    .join('');
  const items = works
    .map(
      (w, i) => `<li class="work" data-styles="${w.styles.join(' ')}" data-work="${w.id}">
      <button class="work__btn reveal-img" type="button" data-open-work="${w.id}" data-cursor="view" data-reveal-img aria-label="${esc(
        `${t.hero.open} ${w.title[t.lang]}`,
      )}">
        ${img(manifest, w.id, w.alt[t.lang], { sizes: '(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw' })}
        <span class="work__caption" aria-hidden="true"><span class="work__title">${esc(w.title[t.lang])}</span><span class="work__styles">${w.styles
          .map((s) => esc(f[s]))
          .join(', ')}</span></span>
      </button>
    </li>`,
    )
    .join('');
  return `<section class="section portfolio" id="${I.work}" aria-labelledby="${I.work}-title">
  <div class="container">
    <div class="section-head section-head--row" data-reveal>
      <div>
        ${heading(t.portfolio.title, 'h2', `${I.work}-title`)}
        <p class="section-lead">${esc(t.portfolio.lead)}</p>
      </div>
      <a class="link-ig" href="${cfg.social.instagram}" target="_blank" rel="noopener">${icon('instagram')}<span>${esc(
        t.portfolio.instagram,
      )}</span></a>
    </div>
    <ul class="filters" role="list" aria-label="${esc(t.portfolio.filterLabel)}" data-reveal>${filters}</ul>
    <p class="sr-only" role="status" data-filter-status></p>
  </div>
  <ul class="work-grid" role="list" data-work-grid>${items}</ul>
  <p class="work-empty" hidden data-work-empty>${esc(t.portfolio.empty)} <a href="${cfg.social.instagram}" target="_blank" rel="noopener">${esc(
    cfg.social.instagramHandle,
  )}</a></p>
  <div class="container portfolio__more">
    <a class="btn btn--ghost" href="${cfg.social.instagram}" target="_blank" rel="noopener">${icon('instagram')}<span>${esc(t.portfolio.instagram)}</span></a>
  </div>
</section>`;
}

function lightbox(t) {
  const L = t.portfolio.lightbox;
  return `<dialog class="lightbox" data-lightbox aria-label="${esc(L.label)}">
  <figure class="lightbox__figure">
    <img class="lightbox__img" alt="" data-lb-img>
    <figcaption class="lightbox__caption"><span data-lb-title></span><span class="lightbox__count" data-lb-count data-of="${esc(L.of)}"></span></figcaption>
  </figure>
  <button class="icon-btn lightbox__close" type="button" data-lb-close>${icon('close')}<span class="sr-only">${esc(L.close)}</span></button>
  <button class="icon-btn lightbox__prev" type="button" data-lb-prev>${icon('arrowLeft')}<span class="sr-only">${esc(L.prev)}</span></button>
  <button class="icon-btn lightbox__next" type="button" data-lb-next>${icon('arrowRight')}<span class="sr-only">${esc(L.next)}</span></button>
</dialog>`;
}

function reviewsSection(cfg, t, reviews) {
  const badge = `<div class="badge" data-reveal>
      <span class="badge__ring" aria-hidden="true"></span>
      <span class="badge__value">${esc(t.reviews.badge)}</span>
      <span class="badge__detail">${esc(t.reviews.badgeDetail)}</span>
      <a class="badge__link" href="${cfg.social.facebook}" target="_blank" rel="noopener">${icon('facebook')}<span>${esc(t.reviews.readAll)}</span></a>
    </div>`;
  const slider = reviews.length
    ? `<div class="reviews__slider" data-reveal>
      <ul class="review-track" role="list" data-review-track tabindex="0" aria-label="${esc(t.reviews.title.join(' '))}">
        ${reviews
          .map(
            (r) => `<li class="review">
          <blockquote lang="${r.lang === 'en' ? 'en' : 'nb'}"><p>${esc(r.text)}</p></blockquote>
          <p class="review__by"><span class="review__name">${esc(r.name)}</span><span class="review__src">${icon('facebook')}${esc(t.reviews.from)}</span></p>
        </li>`,
          )
          .join('')}
      </ul>
      <div class="reviews__nav">
        <button class="icon-btn" type="button" data-review-prev>${icon('arrowLeft')}<span class="sr-only">${esc(t.reviews.prev)}</span></button>
        <button class="icon-btn" type="button" data-review-next>${icon('arrowRight')}<span class="sr-only">${esc(t.reviews.next)}</span></button>
      </div>
    </div>`
    : '';
  return `<section class="section reviews${reviews.length ? '' : ' reviews--badge-only'}" aria-labelledby="reviews-title">
  <div class="container reviews__grid">
    <div class="reviews__head" data-reveal>
      ${heading(t.reviews.title, 'h2', 'reviews-title')}
      <p class="section-lead">${esc(t.reviews.lead)}</p>
    </div>
    ${badge}
    ${slider}
  </div>
</section>`;
}

function giftcard(cfg, t, I) {
  return `<section class="section giftcard" id="${I.giftcards}" aria-labelledby="${I.giftcards}-title">
  <div class="sky sky--soft" aria-hidden="true"><div class="sky__stars"></div><div class="smoke smoke--b" data-parallax="0.1"></div></div>
  <div class="container giftcard__grid">
    <div class="giftcard__visual" data-reveal>
      <div class="gcard" data-tilt role="img" aria-label="${esc(t.giftcard.cardAlt)}">
        <div class="gcard__sky" aria-hidden="true"></div>
        <div class="gcard__content" aria-hidden="true">
          <div class="gcard__top"><span class="gcard__script">Sky Ink</span><span class="gcard__label">${esc(t.giftcard.cardLabel)}</span></div>
          ${rose('rose rose--card')}
          <div class="gcard__lines">
            <span>${esc(t.giftcard.cardFor)}</span><span class="gcard__rule"></span>
            <span>${esc(t.giftcard.cardValue)}</span><span class="gcard__rule"></span>
          </div>
          <div class="gcard__foot">Tattoo – kunst på din kropp</div>
        </div>
      </div>
    </div>
    <div class="giftcard__text">
      <div data-reveal>${heading(t.giftcard.title, 'h2', `${I.giftcards}-title`)}</div>
      <p class="section-lead" data-reveal>${esc(t.giftcard.lead)}</p>
      <ol class="steps-mini" data-reveal>${t.giftcard.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <div class="btn-row" data-reveal>
        <a class="btn btn--gold" href="${cfg.social.messenger}" target="_blank" rel="noopener">${icon('gift')}<span>${esc(t.giftcard.buy)}</span></a>
        <a class="btn btn--ghost" href="tel:${cfg.phone.href}">${icon('phone')}<span>${esc(t.giftcard.call)} ${cfg.phone.display}</span></a>
      </div>
    </div>
  </div>
</section>`;
}

function booking(cfg, t, I) {
  const B = t.booking;
  const F = B.fields;
  const req = `<span class="req" aria-hidden="true">*</span>`;
  const field = (name, label, input, { hint, required } = {}) => `<div class="field" data-field="${name}">
      <label for="f-${name}">${esc(label)}${required ? req : ''}${hint && !required ? ` <span class="field__opt">${esc(hint)}</span>` : ''}</label>
      ${input}
      ${hint && required ? `<p class="field__hint" id="f-${name}-hint">${esc(hint)}</p>` : ''}
      <p class="field__error" id="f-${name}-error" hidden></p>
    </div>`;
  const desc = (name, hint) => `aria-describedby="${hint ? `f-${name}-hint ` : ''}f-${name}-error"`;
  const select = (name, opts) => `<div class="select"><select id="f-${name}" name="${name}" ${desc(name)}>
      <option value="">${esc(F.choose)}</option>${opts.map((o) => `<option>${esc(o)}</option>`).join('')}
    </select></div>`;

  return `<section class="section booking" id="${I.book}" aria-labelledby="${I.book}-title">
  <div class="container booking__grid">
    <div class="booking__intro">
      <div data-reveal>${heading(B.title, 'h2', `${I.book}-title`)}</div>
      <p class="section-lead" data-reveal>${esc(B.lead)}</p>
      <dl class="notes" data-reveal>
        ${B.notes.map((n) => `<div class="note"><dt>${esc(n.title)}</dt><dd>${esc(n.text)}</dd></div>`).join('')}
      </dl>
      <div class="booking__alt" data-reveal>
        <h3>${esc(B.alt)}</h3>
        <p>${esc(B.altText)}</p>
        <ul class="contact-chips" role="list">
          <li><a href="tel:${cfg.phone.href}">${icon('phone')}<span>${cfg.phone.display}</span></a></li>
          <li><a href="${cfg.social.messenger}" target="_blank" rel="noopener">${icon('messenger')}<span>Messenger</span></a></li>
          <li><a href="${cfg.social.instagram}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a></li>
          ${cfg.email ? `<li><a href="mailto:${cfg.email}">${icon('mail')}<span>${esc(cfg.email)}</span></a></li>` : ''}
        </ul>
      </div>
    </div>

    <div class="booking__panel" data-reveal>
      <form class="form" data-booking-form novalidate
        ${cfg.formEndpoint ? `action="${esc(cfg.formEndpoint)}" method="post" enctype="multipart/form-data"` : ''}
        data-endpoint="${esc(cfg.formEndpoint)}">
        <div class="form__summary" role="alert" hidden data-form-summary>${icon('alert')}<span></span></div>
        <input type="hidden" name="_subject" value="${esc(B.fallback.heading)} – Sky Ink">
        <input type="hidden" name="language" value="${t.lang}">
        <div class="hp" aria-hidden="true"><label>Website <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
        <div class="form__row">
          ${field('name', F.name, `<input id="f-name" name="name" type="text" autocomplete="name" required ${desc('name')}>`, { required: true })}
          ${field('phone', F.phone, `<input id="f-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required ${desc('phone')}>`, { required: true })}
        </div>
        ${field('email', F.email, `<input id="f-email" name="email" type="email" autocomplete="email" ${desc('email')}>`, { hint: F.emailHint })}
        ${field('placement', F.placement, `<input id="f-placement" name="placement" type="text" required ${desc('placement', true)}>`, { hint: F.placementHint, required: true })}
        <div class="form__row">
          ${field('size', F.size, select('size', F.sizes))}
          ${field('style', F.style, select('style', F.styles))}
        </div>
        ${field('description', F.description, `<textarea id="f-description" name="description" rows="5" required ${desc('description', true)}></textarea>`, { hint: F.descriptionHint, required: true })}
        <div class="field field--file" data-field="files">
          <span class="label" id="f-files-label">${esc(F.files)} <span class="field__opt">${esc(F.emailHint)}</span></span>
          <label class="file" for="f-files">
            ${icon('upload')}
            <span class="file__btn">${esc(F.filesButton)}</span>
            <span class="file__names" data-file-names data-none="${esc(F.filesNone)}">${esc(F.filesNone)}</span>
          </label>
          <input class="sr-only" id="f-files" name="attachments" type="file" accept="image/*" multiple aria-labelledby="f-files-label" aria-describedby="f-files-hint f-files-error">
          <p class="field__hint" id="f-files-hint">${esc(F.filesHint)}</p>
          <p class="field__error" id="f-files-error" hidden></p>
        </div>
        <div class="field field--check" data-field="age">
          <input id="f-age" name="age_confirmed" type="checkbox" value="yes" required aria-describedby="f-age-error">
          <label for="f-age">${esc(F.age)}${req}</label>
          <p class="field__error" id="f-age-error" hidden></p>
        </div>
        <div class="field field--check" data-field="consent">
          <input id="f-consent" name="consent" type="checkbox" value="yes" required aria-describedby="f-consent-error">
          <label for="f-consent">${esc(F.consent)}${req} <a href="${t.privacyPath}">${esc(F.privacy)}</a></label>
          <p class="field__error" id="f-consent-error" hidden></p>
        </div>
        <p class="form__req"><span class="req" aria-hidden="true">*</span> ${esc(F.required)}</p>
        <button class="btn btn--gold btn--block" type="submit" data-submit data-sending="${esc(B.sending)}">${esc(B.submit)}</button>
      </form>

      <div class="form-result" hidden tabindex="-1" data-form-success>
        ${icon('check', 'form-result__icon')}
        <h3>${esc(B.success.title)}</h3>
        <p>${esc(B.success.text)}</p>
      </div>

      <div class="form-result" hidden tabindex="-1" data-form-fallback>
        <h3>${esc(B.fallback.title)}</h3>
        <p>${esc(B.fallback.text)}</p>
        <div class="btn-col">
          <a class="btn btn--gold btn--block" href="#" data-fallback-sms>${icon('sms')}<span>${esc(B.fallback.sms)}</span></a>
          <button class="btn btn--ghost btn--block" type="button" data-fallback-copy data-messenger="${cfg.social.messenger}">${icon('messenger')}<span>${esc(
            B.fallback.copy,
          )}</span></button>
          <p class="form-result__note" role="status" data-copied-msg data-text="${esc(B.fallback.copied)}"></p>
          <button class="link-btn" type="button" data-fallback-back>${esc(B.fallback.back)}</button>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function faq(t, I) {
  return `<section class="section faq" id="${I.faq}" aria-labelledby="${I.faq}-title">
  <div class="container faq__grid">
    <div data-reveal>${heading(t.faq.title, 'h2', `${I.faq}-title`)}</div>
    <div class="accordion" data-reveal>
      ${t.faq.items
        .map((it) => {
          const link = it.link
            ? ` <a href="${t.path}${it.link.href.replace('#etterbehandling', `#${I.aftercare}`).replace('#aftercare', `#${I.aftercare}`)}">${esc(it.link.text)}</a>`
            : '';
          return `<details class="qa">
        <summary><span>${esc(it.q)}</span>${icon('plus', 'qa__icon')}</summary>
        <div class="qa__a"><p>${esc(it.a)}${link}</p></div>
      </details>`;
        })
        .join('')}
    </div>
  </div>
</section>`;
}

function aftercare(t, I) {
  return `<section class="section aftercare" id="${I.aftercare}" aria-labelledby="${I.aftercare}-title">
  <div class="container">
    <div class="section-head" data-reveal>
      ${heading(t.aftercare.title, 'h2', `${I.aftercare}-title`)}
      <p class="section-lead">${esc(t.aftercare.lead)}</p>
    </div>
    <ol class="care-steps">
      ${t.aftercare.steps
        .map(
          (s, i) => `<li class="care" data-reveal>
        <span class="care__n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <h3 class="care__title">${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
      </li>`,
        )
        .join('')}
    </ol>
    <p class="care-warning" data-reveal>${icon('alert')}<span>${esc(t.aftercare.warning)}</span></p>
  </div>
</section>`;
}

function contact(cfg, t, I) {
  const a = cfg.address;
  const full = `${a.street}, ${a.postalCode} ${a.city}`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`Sky Ink Tattoo, ${full}`)}`;
  const embed = `https://www.google.com/maps?q=${encodeURIComponent(full)}&z=16&output=embed`;
  return `<section class="section contact" id="${I.contact}" aria-labelledby="${I.contact}-title">
  <div class="container contact__grid">
    <div class="contact__info">
      <div data-reveal>${heading(t.contact.title, 'h2', `${I.contact}-title`)}</div>
      <p class="section-lead" data-reveal>${esc(t.contact.lead)}</p>
      <dl class="info-list" data-reveal>
        <div>${icon('pin')}<dt>${esc(t.contact.address)}</dt><dd><address>${esc(a.street)}<br>${esc(a.postalCode)} ${esc(a.city)}</address>
          <a class="text-link" href="${directions}" target="_blank" rel="noopener">${esc(t.contact.directions)}</a></dd></div>
        <div>${icon('clock')}<dt>${esc(t.contact.hours)}</dt><dd>${esc(cfg.hours[t.lang])}</dd></div>
        <div>${icon('phone')}<dt>${esc(t.contact.phone)}</dt><dd><a class="text-link text-link--big" href="tel:${cfg.phone.href}">${cfg.phone.display}</a></dd></div>
        ${cfg.email ? `<div>${icon('mail')}<dt>${esc(t.contact.email)}</dt><dd><a class="text-link" href="mailto:${cfg.email}">${esc(cfg.email)}</a></dd></div>` : ''}
      </dl>
      <h3 class="contact__social-title" data-reveal>${esc(t.contact.social)}</h3>
      <ul class="contact-chips" role="list" data-reveal>
        <li><a href="${cfg.social.instagram}" target="_blank" rel="noopener">${icon('instagram')}<span>Instagram</span></a></li>
        <li><a href="${cfg.social.facebook}" target="_blank" rel="noopener">${icon('facebook')}<span>Facebook</span></a></li>
        <li><a href="${cfg.social.messenger}" target="_blank" rel="noopener">${icon('messenger')}<span>${esc(t.contact.messenger)}</span></a></li>
      </ul>
    </div>
    <div class="map reveal-img" data-reveal-img>
      <div class="map__consent" data-map data-src="${esc(embed)}" data-title="${esc(t.contact.mapTitle)}">
        <div class="map__art" aria-hidden="true">${icon('pin', 'map__pin')}</div>
        <p class="map__addr">${esc(full)}</p>
        <button class="btn btn--ghost btn--sm" type="button" data-map-load>${esc(t.contact.mapLoad)}</button>
        <p class="map__notice">${esc(t.contact.mapNotice)}</p>
        <a class="text-link" href="${directions}" target="_blank" rel="noopener">${esc(t.contact.directions)}</a>
      </div>
    </div>
  </div>
</section>`;
}

function footer(cfg, t, year) {
  const a = cfg.address;
  return `<footer class="site-footer">
  <div class="container site-footer__inner">
    <div class="site-footer__brand">
      <a class="brand brand--footer" href="${t.path}" aria-label="${t.nav.home}">${wordmark(cfg, t)}</a>
      <p class="site-footer__tagline">Tattoo – ${t.lang === 'no' ? 'kunst på din kropp' : 'art on your body'}</p>
    </div>
    <address class="site-footer__addr">
      ${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}<br>
      <a href="tel:${cfg.phone.href}">${cfg.phone.display}</a>${cfg.email ? `<br><a href="mailto:${cfg.email}">${esc(cfg.email)}</a>` : ''}
    </address>
    <ul class="site-footer__social" role="list">
      <li><a class="icon-btn" href="${cfg.social.instagram}" target="_blank" rel="noopener">${icon('instagram')}<span class="sr-only">Instagram</span></a></li>
      <li><a class="icon-btn" href="${cfg.social.facebook}" target="_blank" rel="noopener">${icon('facebook')}<span class="sr-only">Facebook</span></a></li>
      <li><a class="icon-btn" href="${cfg.social.messenger}" target="_blank" rel="noopener">${icon('messenger')}<span class="sr-only">Messenger</span></a></li>
    </ul>
  </div>
  <div class="container site-footer__legal">
    <p>${esc(cfg.legalName)} · Org.nr ${esc(cfg.orgNr)}</p>
    <ul role="list">
      <li><a href="${t.privacyPath}">${esc(t.footer.privacy)}</a></li>
      <li><a href="${t.privacyPath}#cookies">${esc(t.footer.cookies)}</a></li>
      <li>© ${year} Sky Ink Tattoo</li>
    </ul>
  </div>
</footer>`;
}

function cookieNotice(t) {
  return `<div class="cookie" role="region" aria-label="${esc(t.footer.cookies)}" hidden data-cookie>
  <p>${esc(t.cookie.text)} <a href="${t.privacyPath}#cookies">${esc(t.cookie.more)}</a></p>
  <button class="btn btn--gold btn--sm" type="button" data-cookie-ok>${esc(t.cookie.ok)}</button>
</div>`;
}

function scripts(t, works, manifest) {
  const data = works.map((w) => ({
    id: w.id,
    title: w.title[t.lang],
    alt: w.alt[t.lang],
    w: manifest[w.id].w,
    h: manifest[w.id].h,
    src: `/assets/img/work/${w.id}-${manifest[w.id].widths[manifest[w.id].widths.length - 1]}.webp`,
  }));
  return `<script>window.SKYINK=${JSON.stringify({
    lang: t.lang,
    works: data,
    view: t.cursorView,
    count: works.map((_, i) => t.portfolio.count(i)),
    files: { none: t.booking.fields.filesNone, chosen: [0, 1, 2, 3, 4, 5].map((n) => t.booking.fields.filesChosen(n)) },
    errors: t.booking.errors,
    fallbackHeading: t.booking.fallback.heading,
    labels: {
      name: t.booking.fields.name, phone: t.booking.fields.phone, email: t.booking.fields.email,
      placement: t.booking.fields.placement, size: t.booking.fields.size, style: t.booking.fields.style,
      description: t.booking.fields.description,
    },
  }).replace(/</g, '\\u003c')};</script>
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/lenis.min.js" defer></script>
<script src="/assets/js/main.js?v=__V__" defer></script>`;
}

const alternatesHome = [
  { hreflang: 'nb', path: '/' },
  { hreflang: 'no', path: '/' },
  { hreflang: 'en', path: '/en/' },
  { hreflang: 'x-default', path: '/' },
];
const alternatesPrivacy = [
  { hreflang: 'nb', path: '/personvern/' },
  { hreflang: 'no', path: '/personvern/' },
  { hreflang: 'en', path: '/en/privacy/' },
  { hreflang: 'x-default', path: '/personvern/' },
];

export function renderHome(cfg, t, { works, manifest, reviews, year }) {
  const I = ids[t.lang];
  return `${head(cfg, t, { title: t.meta.title, description: t.meta.description, path: t.path, alternates: alternatesHome })}
${schema(cfg, t, works)}
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${roseSymbol}</svg>
<a class="skip-link" href="#main">${esc(t.skip)}</a>
<div class="intro" aria-hidden="true" data-intro>
  <div class="intro__smoke"></div>
  <div class="intro__mark"><span class="intro__word">Sky Ink</span>${rose('rose rose--intro')}</div>
</div>
${header(cfg, t, { no: '/', en: '/en/' }, I)}
<main id="main" tabindex="-1">
${hero(cfg, t, works, manifest, I)}
${services(t, I)}
${about(cfg, t, I)}
${stats(cfg, t)}
${marquee(t)}
${portfolio(cfg, t, works, manifest, I)}
${reviewsSection(cfg, t, reviews)}
${giftcard(cfg, t, I)}
${booking(cfg, t, I)}
${faq(t, I)}
${aftercare(t, I)}
${contact(cfg, t, I)}
</main>
${footer(cfg, t, year)}
${lightbox(t)}
${cookieNotice(t)}
<div class="cursor" aria-hidden="true" data-cursor-el><span class="cursor__label"></span></div>
${scripts(t, works, manifest)}
</body>
</html>
`;
}

export function renderPrivacy(cfg, t, { year, updated }) {
  const P = t.privacy;
  const I = ids[t.lang];
  const path = t.privacyPath;
  return `${head(cfg, t, { title: P.metaTitle, description: P.metaDescription, path, alternates: alternatesPrivacy })}
</head>
<body class="page-legal">
<svg width="0" height="0" style="position:absolute" aria-hidden="true">${roseSymbol}</svg>
<a class="skip-link" href="#main">${esc(t.skip)}</a>
${header(cfg, t, { no: '/personvern/', en: '/en/privacy/' }, I).replace('class="site-header"', 'class="site-header is-solid"')}
<main id="main" tabindex="-1" class="legal">
  <div class="container legal__inner">
    <p><a class="text-link" href="${t.path}">${icon('arrowLeft')} ${esc(P.back)}</a></p>
    <h1 class="legal__title">${esc(P.title)}</h1>
    <p class="legal__updated">${esc(P.updated)}: ${updated}</p>
    ${P.sections(cfg)
      .map(
        (s) => `<section${s.id ? ` id="${s.id}"` : ''}>
      <h2>${esc(s.h)}</h2>
      ${s.p.map((p) => `<p>${esc(p)}</p>`).join('')}
    </section>`,
      )
      .join('')}
  </div>
</main>
${footer(cfg, t, year)}
${cookieNotice(t)}
<script>window.SKYINK={lang:${JSON.stringify(t.lang)},works:[],legal:true};</script>
<script src="/assets/js/main.js?v=__V__" defer></script>
</body>
</html>
`;
}
