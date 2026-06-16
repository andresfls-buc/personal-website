# Chapter I (Craft) redesign: relic gallery

## Background

Chapter I (`app/sections/Craft.tsx`) currently shows a 3-column grid of 9 tech-stack cards ("instruments of the hunt"). The user doesn't like the layout and doesn't see the point of a standalone tech list in a portfolio — tools should earn their place attached to real work, not floated alone. Real projects will live in Chapter II (Hunts), which is currently an empty placeholder the user plans to fill with actual shipped work later (separate, not part of this spec).

For Chapter I, the user wants to keep the chapter slot but replace the tool grid with abstract/mood imagery — fragments that set tone rather than show specifics (not logos, not screenshots). Images aren't sourced yet; the user will drop in real PNGs later. This spec covers building the section now with placeholders, ready for that swap.

## Goal

Replace the tool-card grid in Chapter I with an asymmetric scatter of "relic" image plates that drift via scroll-linked parallax, matching the site's existing dark-storybook tone and GSAP/ScrollTrigger conventions. Use placeholders today; real PNGs drop in later without restructuring.

## Design

### Content change

- Delete the `INSTRUMENTS` array and the tool-card grid JSX from `app/sections/Craft.tsx`.
- Keep the `Chapter` wrapper as-is: `numeral="I"`, `eyebrow="Chapter I"`, title "The Craft — intelligent systems, shipped."
- Replace the `intro` copy (current text references "instruments of the hunt", which no longer fits):
  > "Some things resist a clean list. These are fragments of the craft — texture, not inventory."
  (User can edit wording later; this just needs to stop referencing the removed tool list.)

### New component: `RelicGallery`

New file: `app/components/layout/RelicGallery.tsx`. Renders inside `Craft.tsx` as the `Chapter` children, replacing the grid.

A fixed array of 5 relic plates, each with:
- `id` (string)
- `size`: `"lg" | "md" | "sm"` — controls plate dimensions
- `position`: a className fragment controlling absolute placement within the scatter container (desktop only)
- `depth`: number 0.3–1.2 — parallax multiplier (higher = more scroll movement)
- `tone`: `"ember" | "arcane"` — picks which gradient/border treatment from the existing design tokens

Example layout (desktop, asymmetric scatter inside a `relative` container with generous min-height, e.g. `min-h-[640px]`):

| Plate | size | position | depth | tone |
|---|---|---|---|---|
| relic-1 | lg | top-left | 0.4 | ember |
| relic-2 | md | top-right, offset down | 0.9 | arcane |
| relic-3 | sm | center, overlapping relic-1/2 | 1.2 | ember |
| relic-4 | md | bottom-left | 0.6 | arcane |
| relic-5 | sm | bottom-right | 1.0 | ember |

Each plate placeholder reuses the visual language already established for the About photo placeholder: bordered box (`border-border-strong`), radial-gradient fill matching its `tone` (ember: warm rust/void gradient already used in Contact/About; arcane: cold violet gradient matching Cosmos's arcane tokens), centered uppercase label text (e.g. "Relic I"), and an inner hairline border. Each plate carries a one-line comment marking where a real `<Image>` swaps in later (path TBD, e.g. `/public/relics/relic-1.png`).

### Mobile / responsive behavior

- Below `md`, the scatter collapses to a simple vertical stack (no absolute positioning, no overlap) — same degrade pattern the rest of the site uses (e.g. About's grid going single-column).
- No parallax below `md` — plates are static, relying only on the existing `Chapter` body fade-in (already in `Chapter.tsx`, untouched).

### Scroll animation

- At `md` and up, each plate gets a GSAP `ScrollTrigger` with `scrub: true`, translating the plate on the Y axis by an amount derived from its `depth` value as the section scrolls through the viewport (e.g. `yPercent` or `y` animated between two values scaled by `depth`).
- Reuses the existing `gsap`/`ScrollTrigger` import from `lib/gsap.ts` (same pattern as `Chapter.tsx`).
- Respect `prefers-reduced-motion`: if set, skip creating the scrub tweens entirely — plates render statically in their scattered positions.
- Effects are set up in a `useEffect` + `gsap.context` scoped to the gallery's container ref, matching the cleanup pattern (`ctx.revert()` on unmount) already used in `Chapter.tsx` and `About.tsx`.

### Files touched

- `app/sections/Craft.tsx` — remove `INSTRUMENTS` + grid, update intro copy, render `<RelicGallery />`.
- `app/components/layout/RelicGallery.tsx` — new file, plates + parallax logic.

## Out of scope

- Sourcing or generating the real PNG assets — placeholders only.
- Changes to Chapter II (Hunts) or any other section.
- Renumbering or merging chapters.
