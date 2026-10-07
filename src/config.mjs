// ─────────────────────────────────────────────────────────────
//  Sky Ink Tattoo – business details.
//  Change values here and run `npm run build`. Everything on the
//  site (both languages, schema markup, footer) reads from this file.
// ─────────────────────────────────────────────────────────────

export default {
  // Final public address of the site, without trailing slash.
  // Used for canonical / hreflang URLs, sitemap and schema markup.
  siteUrl: 'https://www.skyinktattoo.no',

  name: 'Sky Ink Tattoo',
  legalName: 'Sky Ink by Skaiste Juskiene',
  owner: 'Skaiste Juskiene',
  orgNr: '922 093 369 MVA',
  founded: 2019,

  // Studio address (shown to visitors, used for map and directions).
  address: {
    street: 'Guderudgata 9a',
    postalCode: '1830',
    city: 'Askim',
    region: 'Østfold',
    country: 'NO',
  },
  // Registered business address – only used in the privacy policy.
  registeredAddress: 'Veibyveien 4, 1866 Båstad',

  phone: {
    display: '917 96 954',
    href: '+4791796954',
  },

  // No email yet. Add one here (e.g. 'post@skyinktattoo.no') and it
  // appears automatically in contact, footer, booking and schema.
  email: '',

  // Opening hours. Shown as text – keep it short.
  hours: {
    no: 'Etter avtale',
    en: 'By appointment',
  },

  social: {
    instagram: 'https://www.instagram.com/sky.ink.tattoo.askim',
    instagramHandle: '@sky.ink.tattoo.askim',
    facebook: 'https://www.facebook.com/share/1EbCafyCVk/',
    // Replace with the page's m.me link (e.g. 'https://m.me/skyinktattoo')
    // once the Facebook page username is known. Until then, the
    // Messenger buttons open the Facebook page.
    messenger: 'https://www.facebook.com/share/1EbCafyCVk/',
  },

  // Trust signals
  reviews: {
    recommendPercent: 100,
    count: 19,
  },
  followers: 3000,
  // Number of finished tattoos for the stats row. Leave null until
  // Skaiste has a real figure – the row then shows the review count.
  tattoosDone: null,

  // Where the booking form is sent. Works with Formspree, Getform,
  // Basin and similar services that accept multipart form posts
  // (e.g. 'https://formspree.io/f/abcdwxyz'). Leave empty and the form
  // instead prepares the inquiry for SMS or Messenger.
  formEndpoint: '',

  // Logo files. Put the original watercolour logo and/or a monochrome
  // version in public/assets/img/brand/ and set the paths here. While
  // null, the site uses the built-in typographic wordmark.
  logo: {
    mono: null, // e.g. '/assets/img/brand/logo-mono.svg' (light, for dark header)
    color: null, // e.g. '/assets/img/brand/logo-watercolor.webp'
  },

  // Photo slots. Drop files in public/assets/img/studio/ and set paths.
  photos: {
    portrait: null, // e.g. '/assets/img/studio/skaiste.webp' (portrait, ~4:5)
    studio: [], // e.g. ['/assets/img/studio/interior-1.webp']
  },
};
