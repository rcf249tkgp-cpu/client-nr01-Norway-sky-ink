// English.
export default {
  lang: 'en',
  htmlLang: 'en',
  locale: 'en_GB',
  path: '/en/',
  privacyPath: '/en/privacy/',

  meta: {
    title: 'Tattoo Studio in Askim, Norway | Sky Ink Tattoo – realism, fine line, cover-ups',
    description:
      'Sky Ink Tattoo in Askim, Norway: black and grey realism, fine line, memorial tattoos and cover-ups by tattoo artist Skaiste Juskiene. Since 2019. Book an appointment.',
    ogAlt: 'Black and grey realism tattoo by Sky Ink Tattoo in Askim',
  },

  skip: 'Skip to content',
  nav: {
    label: 'Main menu',
    work: 'Work',
    services: 'Services',
    about: 'About',
    giftcards: 'Gift cards',
    faq: 'FAQ',
    contact: 'Contact',
    book: 'Book now',
    open: 'Open menu',
    close: 'Close menu',
    langLabel: 'Language',
    home: 'Sky Ink Tattoo – home',
  },

  intro: 'Loading Sky Ink',

  hero: {
    kicker: 'Tattoo artist in Askim, Norway',
    lines: ['Tattoo –', 'art on your body'],
    lead: 'Black and grey realism, fine line, memorial pieces and cover-ups. Every tattoo is a small artwork I put my whole heart into.',
    since: 'Since 2019',
    trust: '100% recommend',
    trustDetail: '19 reviews on Facebook',
    book: 'Book an appointment',
    portfolio: 'View portfolio',
    carouselLabel: 'Selected tattoos',
    carouselHint: 'Drag to spin',
    pause: 'Pause rotation',
    play: 'Play rotation',
    open: 'View larger:',
  },

  services: {
    title: ['My', 'services'],
    lead: 'From a small fine line flower to a full realism sleeve. We always start with a conversation about your idea.',
    items: [
      {
        icon: 'machine',
        title: 'Tattoos',
        text: 'From the first sketch to the finished piece. We choose the motif, size and placement together, without rushing.',
      },
      {
        icon: 'flower',
        title: 'Fine line',
        text: 'Thin, precise lines and soft shading. For florals, small motifs and delicate details.',
      },
      {
        icon: 'eye',
        title: 'Realism',
        text: 'Black and grey realism with depth and contrast. Animals, mythology, angels and dark themes.',
      },
      {
        icon: 'heart',
        title: 'Memorial tattoos',
        text: 'A memory you carry with you. Hands, silhouettes and symbols for the people you love.',
      },
      {
        icon: 'cycle',
        title: 'Cover-ups',
        text: 'An old tattoo you no longer like can become something completely new. Send a photo and we’ll look at the options.',
      },
      {
        icon: 'pen',
        title: 'Custom designs',
        text: 'No copies. I draw a unique design from your idea, your references and the shape of your body.',
      },
    ],
  },

  about: {
    title: ['Who is behind', 'Sky Ink?'],
    role: 'Founder and tattoo artist',
    hello: 'Hi, I’m Skaiste',
    paragraphs: [
      'I opened Sky Ink in Askim in 2019. Since then I’ve tattooed everything from tiny fine line flowers to full black and grey realism sleeves.',
      'Realism, fine line and memorial tattoos are closest to my heart – pieces that mean something to the person wearing them. Many people also come to me with an old tattoo they want to bring back to life, and cover-ups are some of my favourite projects.',
      'To me, every tattoo, whether it’s new or a cover-up, is a small artwork. I put my whole heart into each one, and I take my time so you feel comfortable all the way.',
    ],
    specialtiesLabel: 'Specialties',
    specialties: ['Black and grey realism', 'Fine line', 'Memorial tattoos', 'Cover-ups', 'Dark realism'],
    signature: 'Skaiste',
    portraitAlt: 'Portrait of tattoo artist Skaiste Juskiene in the studio',
    portraitPlaceholder: 'Portrait of Skaiste coming soon',
    cta: 'Book a consultation',
  },

  stats: {
    label: 'Sky Ink in numbers',
    since: 'Tattooing in Askim since',
    recommend: 'recommend Sky Ink on Facebook',
    followers: 'followers on Instagram and Facebook',
    tattoos: 'tattoos done',
    reviews: 'reviews on Facebook',
  },

  marquee: ['Tattoo', 'Fine line', 'Realism', 'Cover-up'],

  portfolio: {
    title: ['Selected', 'work'],
    lead: 'A selection of recent pieces. Tap an image to see it larger.',
    filterLabel: 'Filter by style',
    filters: {
      all: 'All',
      realisme: 'Realism',
      fineline: 'Fine line',
      minne: 'Memorial',
      coverup: 'Cover-up',
      mork: 'Dark',
    },
    count: (n) => (n === 1 ? 'Showing 1 piece' : `Showing ${n} pieces`),
    empty: 'No photos in this category here yet. See more work on Instagram.',
    instagram: 'See more on Instagram',
    view: 'View',
    lightbox: {
      label: 'Image viewer',
      close: 'Close',
      prev: 'Previous image',
      next: 'Next image',
      of: 'of',
    },
  },

  reviews: {
    title: ['What clients', 'say'],
    lead: 'Everyone who has reviewed Sky Ink on Facebook recommends the studio. Read what they write, and see why many come back for their next tattoo.',
    badge: '100% recommend',
    badgeDetail: 'Based on 19 reviews on Facebook',
    readAll: 'Read the reviews on Facebook',
    prev: 'Previous review',
    next: 'Next review',
    from: 'Review on Facebook',
  },

  giftcard: {
    title: ['Give the gift of', 'art'],
    lead: 'A Sky Ink gift card is a gift that lasts. Perfect for a birthday, Christmas or someone who has talked about getting a tattoo for ages.',
    steps: [
      'Call or send a message with the amount you’d like.',
      'I’ll get the gift card ready for you.',
      'The recipient books a time that suits them.',
    ],
    buy: 'Buy a gift card',
    call: 'Call',
    cardLabel: 'Gift card',
    cardValue: 'Value',
    cardFor: 'For',
    cardAlt: 'Illustration of a Sky Ink Tattoo gift card',
  },

  booking: {
    title: ['Book an', 'appointment'],
    lead: 'Tell me about your idea and I’ll get back to you to agree on price and time. The more you tell me, the better.',
    notes: [
      { title: 'Deposit', text: 'Your appointment is confirmed with a deposit, which is deducted from the price of the tattoo.' },
      { title: 'Age limit 18', text: 'I only tattoo people aged 18 or over. Please bring valid ID.' },
    ],
    alt: 'Rather call or message?',
    altText: 'You can also call, or send a message on Facebook or Instagram.',
    fields: {
      name: 'Name',
      phone: 'Phone',
      email: 'Email',
      emailHint: 'Optional',
      placement: 'Placement on the body',
      placementHint: 'For example forearm, calf or shoulder',
      size: 'Size',
      sizes: ['Small (under 5 cm)', 'Medium (5–15 cm)', 'Large (15–30 cm)', 'Sleeve / large project', 'Not sure yet'],
      style: 'Style',
      styles: ['Realism', 'Fine line', 'Memorial tattoo', 'Cover-up', 'Dark realism', 'Not sure yet'],
      choose: 'Choose …',
      description: 'Describe your idea',
      descriptionHint: 'Motif, mood, details, and whether it’s a cover-up of an existing tattoo.',
      files: 'Reference images',
      filesHint: 'Photos of your idea and of the spot on your body. Up to 5 images, 10 MB in total.',
      filesButton: 'Choose images',
      filesNone: 'No images chosen',
      filesChosen: (n) => (n === 1 ? '1 image chosen' : `${n} images chosen`),
      age: 'I confirm that I am 18 or older',
      consent: 'I agree that Sky Ink may store this information to reply to my inquiry.',
      privacy: 'Read the privacy policy',
      required: 'required',
    },
    errors: {
      name: 'Enter your name.',
      phone: 'Enter a phone number we can reach you on.',
      placement: 'Tell me where on your body you want the tattoo.',
      description: 'Describe your idea in a few words.',
      age: 'You must be 18 or older to book.',
      consent: 'We need your consent to be able to reply.',
      files: 'The images are too large in total. Choose fewer or smaller images (10 MB max).',
      tooMany: 'Choose 5 images at most.',
      summary: 'Something is missing. Check the highlighted fields.',
      send: 'The inquiry wasn’t sent. Try again, or call +47 917 96 954.',
    },
    submit: 'Send inquiry',
    sending: 'Sending …',
    success: {
      title: 'Thank you! Your inquiry has been sent.',
      text: 'I’ll get back to you as soon as I can. – Skaiste',
    },
    fallback: {
      title: 'Almost done',
      text: 'Choose how to send your inquiry. The text is ready – attach your reference images to the message.',
      sms: 'Send as text message',
      copy: 'Copy text and open Messenger',
      copied: 'Text copied. Paste it into Messenger.',
      back: 'Edit inquiry',
      heading: 'Tattoo inquiry',
    },
  },

  faq: {
    title: ['Frequently asked', 'questions'],
    items: [
      {
        q: 'How much does a tattoo cost?',
        a: 'The price depends on size, level of detail and placement. Send an inquiry with a picture of your idea and the spot on your body, and you’ll get an estimate before we book.',
      },
      {
        q: 'Do I need to pay a deposit?',
        a: 'Yes. Your appointment is confirmed once the deposit is paid, and the amount is deducted from the price of the tattoo.',
      },
      {
        q: 'Does it hurt?',
        a: 'You’ll feel it, but most people find it easier than they expected. Some areas, like ribs, feet and the inner arm, are more sensitive. Sleep well, eat before your appointment and drink water for the best experience. We take breaks whenever you need.',
      },
      {
        q: 'Can you cover up an old tattoo?',
        a: 'Yes, cover-ups are one of my specialties. Send a photo of the tattoo you want covered. Dark, dense tattoos often need a larger and darker design, and sometimes a few laser sessions first pay off. We’ll figure it out together.',
      },
      {
        q: 'How old do I have to be?',
        a: 'You must be 18 or older, even with parental consent. Please bring valid ID to your appointment.',
      },
      {
        q: 'How do I look after my new tattoo?',
        a: 'You’ll get aftercare advice to take home. There’s also a guide further down this page.',
        link: { href: '#aftercare', text: 'Go to the aftercare guide' },
      },
      {
        q: 'Can I bring my own drawing?',
        a: 'Absolutely. Upload your references in the form and I’ll draw a design that fits your body and ages well.',
      },
    ],
  },

  aftercare: {
    title: ['Tattoo', 'aftercare'],
    lead: 'A tattoo heals in 2–4 weeks. Good care in the first weeks keeps the lines crisp and the shading soft for years.',
    steps: [
      { title: 'Keep the wrap on', text: 'Leave the bandage or protective film on for as long as I recommended. Wash your hands before removing it.' },
      { title: 'Wash gently', text: 'Wash with lukewarm water and a mild, fragrance-free soap. Pat dry with clean paper – don’t rub.' },
      { title: 'A thin layer of cream', text: 'Apply a thin layer of tattoo balm or fragrance-free moisturiser 2–3 times a day. Your skin needs to breathe.' },
      { title: 'Don’t scratch or pick', text: 'It will itch and flake a little as it heals. That’s completely normal. Let the flakes fall off on their own.' },
      { title: 'Avoid water and sun', text: 'Stay away from baths, pools, sea swimming, saunas, tanning beds and direct sun until the skin has healed.' },
      { title: 'Sunscreen for life', text: 'Once healed, use high-factor sunscreen (SPF 50). That keeps your tattoo sharp for a long time.' },
    ],
    warning: 'If the area becomes more red, warm or swollen after a few days, or you get a fever, contact a doctor.',
  },

  contact: {
    title: ['Find the', 'studio'],
    lead: 'The studio is in Askim, a short drive from Mysen and the rest of Indre Østfold. All appointments are by arrangement.',
    address: 'Address',
    hours: 'Opening hours',
    phone: 'Phone',
    email: 'Email',
    social: 'Follow and message me',
    directions: 'Get directions',
    call: 'Call',
    messenger: 'Messenger',
    mapTitle: 'Map showing Sky Ink Tattoo at Guderudgata 9a, Askim',
    mapLoad: 'Show map',
    mapNotice: 'The map loads from Google Maps, which may set its own cookies.',
  },

  footer: {
    rights: 'All rights reserved.',
    privacy: 'Privacy',
    cookies: 'Cookies',
    top: 'Back to top',
  },

  cookie: {
    text: 'We don’t use tracking or advertising cookies. The map only loads when you choose to show it.',
    more: 'Read more',
    ok: 'OK',
  },

  cursorView: 'View',

  privacy: {
    metaTitle: 'Privacy and cookies | Sky Ink Tattoo',
    metaDescription: 'How Sky Ink Tattoo in Askim handles personal data and cookies.',
    title: 'Privacy',
    updated: 'Last updated',
    back: 'Back to the home page',
    sections: (c) => [
      {
        h: 'Who is responsible',
        p: [
          `${c.legalName} (org. no. ${c.orgNr}), ${c.registeredAddress}, Norway, is the data controller for personal data collected through this website.`,
          `Questions about privacy can be sent to us by phone on +47 ${c.phone.display}${c.email ? ` or by email to ${c.email}` : ''}.`,
        ],
      },
      {
        h: 'What we collect and why',
        p: [
          'When you send an inquiry through the form, we receive your name, phone number, email if given, preferred placement, size and style, your description and any reference images.',
          'We only use this information to reply to your inquiry, give a price estimate and book your appointment. The legal basis is your consent and the agreement we enter into (GDPR Art. 6(1)(a) and (b)).',
          'Confirming that you are 18 or older is necessary because we do not tattoo minors.',
        ],
      },
      {
        h: 'How long we keep it',
        p: [
          'Inquiries that don’t lead to an appointment are deleted no later than 12 months after the last contact. Information related to completed appointments and payments is kept for as long as Norwegian accounting law requires.',
        ],
      },
      {
        h: 'Who we share it with',
        p: [
          `We never sell your information.${c.formEndpoint ? ' The form is delivered through an external form service that processes data on our behalf under a data processing agreement.' : ''} If you choose to send your inquiry by text message or Messenger, the terms of your mobile operator or Meta apply.`,
          'Photos of tattoos are only published on the website and social media with your agreement. Names and dates on memorial tattoos are not shown without approval.',
        ],
      },
      {
        id: 'cookies',
        h: 'Cookies',
        p: [
          'This website does not use analytics, tracking or advertising cookies.',
          'We store two small settings locally in your browser: that you have closed the cookie notice, and that the intro animation has been shown. They are not used to identify you.',
          'The map on the contact section only loads from Google Maps when you press “Show map”. Google may then set its own cookies under its terms.',
          'Links to Instagram, Facebook and Messenger take you to Meta’s services, which have their own privacy terms.',
        ],
      },
      {
        h: 'Your rights',
        p: [
          'You have the right to access, correct and delete your information, and you can withdraw your consent at any time. Get in touch and we’ll help.',
          'If you believe we process your data unlawfully, you can complain to the Norwegian Data Protection Authority, Datatilsynet (datatilsynet.no).',
        ],
      },
    ],
  },
};
