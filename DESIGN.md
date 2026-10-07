# Sky Ink – design system

Concept: **ink and night sky**. A dark, cinematic luxury art studio, not a street shop. One memorable
element (the 3D arc of tattoos floating in a smoky night sky) with everything around it kept quiet.

## Color

| Token | Hex | Use |
| --- | --- | --- |
| `--night` | `#0A0A0C` | page background |
| `--charcoal` | `#15161A` | alternate sections, inputs |
| `--raised` | `#1C1D22` | placeholders |
| `--ink` | `#EDE6DA` | warm off-white text (15.9:1 on night) |
| `--ink-muted` | `#AAA398` | body copy (7.9:1) |
| `--ink-faint` | `#8F897F` | hints, meta (≥ 5.2:1 on charcoal) |
| `--gold` | `#C9A45C` | highlight word, CTAs, hovers, icons (8.4:1) |
| `--rose` / `--rose-line` | `#8E1B24` / `#B2323D` | the rose motif only (decorative) |

## Type

- **Bodoni Moda** (variable, optical size): hero, service titles, quotes, numbers. High contrast, majestic.
- **Jost** (geometric sans): body, labels, bold uppercase section headings with one gold word.
- **Pinyon Script**: the “Sky Ink” wordmark and Skaiste's signature only.

## Layout

- Hero: centered (Rowan Black reference). Kicker, two-line serif headline, lead, trust line, then the arc, then pill CTAs.
- Sections: left-aligned uppercase headings (Tattoon reference), thin 1px hairline grids for services, stats and aftercare, and a full-bleed portfolio grid.
- 8pt spacing, 1240px container, mobile-first breakpoints at 560 / 640 / 900 / 1000 / 1100.

## Motion

Slow and smooth, never bouncy. Shared easing `cubic-bezier(.22, 1, .36, 1)`.

- Intro: “SKY INK” sharpens out of drifting smoke (≈1.5 s, once per session).
- Hero: lines go from blur to sharp with a 160ms stagger (CSS only).
- Arc: auto-rotates slowly, can be dragged with inertia, slows down on hover, and has a pause button. On phones and with reduced motion it is a swipe carousel.
- Scroll: staggered fade/rise, curtain-wipe image reveals with a zoom-out, and parallax on smoke and the portrait.
- Marquee: outlined text that speeds up with scroll velocity.
- Cursor: gold dot that grows into “Se” / “View” over images.

## Skills used

- **UI UX Pro Max**: priority rules (accessibility, touch targets, performance, reduced motion, forms, z-index scale) and the pre-delivery checklist (`references/quick-reference.md`, `references/pro-rules.md`). The `--design-system` search script was not run in this environment, so the palette and typography come from the brief.
- **frontend-design**: plan-then-build process, one bold element, typographic hierarchy, avoiding templated tells, and copy guidance.
