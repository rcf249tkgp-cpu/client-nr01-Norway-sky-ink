// Line icons – one family: 32px grid, 1.25 stroke, round caps/joins.
// Decorative by default (aria-hidden); controls carry their own labels.

const paths = {
  // services
  machine:
    '<path d="M7.5 24.5 20 12l3.5 3.5L11 28H7.5z"/><path d="m18 14 3.5 3.5"/><path d="M22.5 9.5 26 6l3 3-3.5 3.5"/><path d="M4 28h3.5"/><path d="m20 12 2.5-2.5 3 3L23 15"/>',
  flower:
    '<path d="M16 29V17"/><path d="M16 17c-4.5 0-7-3.2-7-7 3.8 0 7 2.6 7 7z"/><path d="M16 17c4.5 0 7-3.2 7-7-3.8 0-7 2.6-7 7z"/><path d="M16 17c-2-3.4-1.4-7.4 0-11 1.4 3.6 2 7.6 0 11z"/><path d="M16 24c-2.8 0-5-1.3-6.2-3.5M16 26c2.8 0 5-1.3 6.2-3.5"/>',
  eye: '<path d="M3 16s5-8.5 13-8.5S29 16 29 16s-5 8.5-13 8.5S3 16 3 16z"/><circle cx="16" cy="16" r="4.5"/><path d="M16 13.5v5"/>',
  heart:
    '<path d="M16 27S5 20.6 5 12.8A5.8 5.8 0 0 1 16 10a5.8 5.8 0 0 1 11 2.8C27 20.6 16 27 16 27z"/><path d="M16 21.5s-4.6-2.8-4.6-6.1a2.4 2.4 0 0 1 4.6-1.2 2.4 2.4 0 0 1 4.6 1.2c0 3.3-4.6 6.1-4.6 6.1z"/>',
  cycle:
    '<path d="M26.5 12.5A11 11 0 0 0 7 9.5"/><path d="M6.5 4.5v5.5H12"/><path d="M5.5 19.5A11 11 0 0 0 25 22.5"/><path d="M25.5 27.5V22H20"/><path d="m16 12 1.2 2.8 2.8 1.2-2.8 1.2L16 20l-1.2-2.8L12 16l2.8-1.2z"/>',
  pen: '<path d="M5 27l2.5-8.5L21 5l6 6-13.5 13.5z"/><path d="m18 8 6 6"/><path d="M7.5 18.5l6 6"/><path d="M5 27l5-1.5"/>',

  // ui
  phone:
    '<path d="M11.5 4.5H8A2.5 2.5 0 0 0 5.5 7c0 11 8.5 19.5 19.5 19.5a2.5 2.5 0 0 0 2.5-2.5v-3.5l-5.5-2-2.5 2.5a14 14 0 0 1-6-6L16 13.5z"/>',
  pin: '<path d="M16 28.5s-9-8.4-9-15a9 9 0 0 1 18 0c0 6.6-9 15-9 15z"/><circle cx="16" cy="13.5" r="3.2"/>',
  clock: '<circle cx="16" cy="16" r="12"/><path d="M16 9v7l4.5 3"/>',
  mail: '<rect x="4" y="7" width="24" height="18" rx="2"/><path d="m4.5 8 11.5 9 11.5-9"/>',
  instagram:
    '<rect x="4.5" y="4.5" width="23" height="23" rx="6.5"/><circle cx="16" cy="16" r="5.3"/><circle cx="22.8" cy="9.2" r=".9" fill="currentColor" stroke="none"/>',
  facebook:
    '<path d="M18.5 28V17h3.7l.6-4.3h-4.3V10c0-1.2.4-2.1 2.2-2.1H23V4.1c-.4-.1-1.8-.2-3.3-.2-3.3 0-5.5 2-5.5 5.6v3.2h-3.7V17h3.7v11"/>',
  messenger:
    '<path d="M16 4C9.2 4 4 9 4 15.4c0 3.4 1.5 6.4 4 8.4V28l3.7-2c1.3.4 2.8.6 4.3.6 6.8 0 12-5 12-11.4S22.8 4 16 4z"/><path d="m9.5 18.5 4.5-5 3 3 5.5-4-4.5 5-3-3z"/>',
  arrowLeft: '<path d="M26 16H6"/><path d="m13 9-7 7 7 7"/>',
  arrowRight: '<path d="M6 16h20"/><path d="m19 9 7 7-7 7"/>',
  arrowUp: '<path d="M16 26V6"/><path d="m9 13 7-7 7 7"/>',
  close: '<path d="m8 8 16 16M24 8 8 24"/>',
  menu: '<path d="M5 11h22M5 21h22"/>',
  plus: '<path d="M16 7v18M7 16h18"/>',
  upload: '<path d="M16 21V6"/><path d="m10 12 6-6 6 6"/><path d="M5 21v4.5A1.5 1.5 0 0 0 6.5 27h19a1.5 1.5 0 0 0 1.5-1.5V21"/>',
  pause: '<path d="M12 8v16M20 8v16"/>',
  play: '<path d="M10 7v18l15-9z"/>',
  check: '<path d="m6 16.5 6.5 6.5L26 9.5"/>',
  alert: '<circle cx="16" cy="16" r="12"/><path d="M16 9.5v8"/><circle cx="16" cy="22" r=".9" fill="currentColor" stroke="none"/>',
  gift: '<rect x="5" y="12" width="22" height="15" rx="1.5"/><path d="M3.5 8.5h25V12h-25zM16 8.5V27"/><path d="M16 8.5c-1.5-3.5-6.5-5-6.5-2s4 2 6.5 2c2.5 0 6.5 1 6.5-2s-5-1.5-6.5 2z"/>',
  sms: '<path d="M5 6.5h22a1.5 1.5 0 0 1 1.5 1.5v13a1.5 1.5 0 0 1-1.5 1.5H13l-6 4.5v-4.5H5A1.5 1.5 0 0 1 3.5 21V8A1.5 1.5 0 0 1 5 6.5z"/><path d="M10 14.5h.01M16 14.5h.01M22 14.5h.01"/>',
  star: '<path d="m16 4 2.6 9.4L28 16l-9.4 2.6L16 28l-2.6-9.4L4 16l9.4-2.6z"/>',
};

export function icon(name, cls = '') {
  return `<svg class="icon${cls ? ' ' + cls : ''}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}

// The recurring rose – a fine-line bloom with a deep red heart.
export const roseSymbol = `
<symbol id="rose" viewBox="0 0 64 100">
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="var(--rose-line, #b2323d)" stroke-width="1.4">
      <path d="M33 21.5c2.6-1.6 5.6.6 4.4 3.4-1.3 3-6.6 2.6-7-.8-.5-4 4.6-7.4 9.2-5.3 4.8 2.2 5.2 9.3.4 12.6"/>
      <path d="M23.6 18.6c-4.6 5.6-3.4 15.4 4.6 19.2 7.6 3.6 16 .4 18.4-6.6 1.8-5.4-.6-10.8-4-13.2"/>
      <path d="M25.4 15.2c2.6-5 9.8-7.8 15.2-4.6 2.2 1.3 3.4 3.2 3.8 5.2"/>
      <path d="M23.2 23.4c-3.6-1.8-5-6.2-3-9.6 1.2-2 3.2-3 5.2-3"/>
      <path d="M46.4 17.6c3.2.6 5.2 3.8 4.4 7.2-.8 3.4-3.2 5.6-5.6 6.4"/>
      <path d="M28 37.8c3 2.6 8.4 2.8 12 0"/>
    </g>
    <g stroke="var(--rose-stem, rgba(237,230,218,.55))" stroke-width="1.1">
      <path d="M34 40.5c-1.2 14 1.4 28-1.2 52"/>
      <path d="M33.6 62c-8.4-1.4-14.4-7.4-15.6-14 7.2-.2 13.6 5 15.6 14z"/>
      <path d="M33.6 62c-5.2-3.6-9.6-7.4-13-11.6"/>
      <path d="M33.8 74c6.2-1.8 11.4-6.6 12.6-12.4-6.4-.2-11.6 4.8-12.6 12.4z"/>
      <path d="M33.8 74c3.4-3.6 7-7.4 10.4-10.4"/>
      <path d="M33 53.5l3-2.2M32.6 84.5l-2.8-1.8"/>
    </g>
  </g>
</symbol>`;

export const rose = (cls = 'rose') =>
  `<svg class="${cls}" viewBox="0 0 64 100" aria-hidden="true" focusable="false"><use href="#rose"/></svg>`;
