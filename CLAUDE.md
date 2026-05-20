@AGENTS.md

# Andres Landazabal — Personal Website

Personal portfolio for **Andres Landazabal**, positioning as **AI Software Engineer**.
Built with Next.js 16 App Router. Dev server runs on `:3000` (`npm run dev`).

---

## Stack

- **Next.js 16.2.6** (App Router, Turbopack) — see `AGENTS.md`; read `node_modules/next/dist/docs/` before writing framework code, APIs may differ from training data.
- **TypeScript** strict, **Tailwind CSS v4** (uses `@theme inline` in `globals.css` — no `tailwind.config.js`).
- **3D**: `@react-three/fiber` + `@react-three/drei` + `three` (0.184).
- **Animation**: GSAP + `ScrollTrigger` (registered in `lib/gsap.ts`), Lenis smooth-scroll synced via `app/components/layout/SmoothScroll.tsx`.
- **Fonts**: `next/font/google` — Bricolage Grotesque + Outfit, exposed via CSS vars.

---

## Design System

### Identity: "Warm Minimalist + Electric Indigo"

Inspired by Anthropic / Hugging Face — warm paper canvas + true deep ink + a single saturated indigo accent. Reads "intelligent, deliberate, human" without the corporate cool-grey of consulting sites. Indigo is used **scarcely** (<5% of viewport) — its scarcity is its power.

**Previously tried and rejected:**
- "Sunset Terracotta" (cream + cocoa + burnt orange) — felt too "restaurant-menu personal" for an AI engineer.
- Gold skull material — user preferred the silver default.
- Dark theme — explicitly rejected, site must stay light.

### Color tokens (in `app/globals.css` via Tailwind v4 `@theme`)

```
--background       #f7f5f2   warm paper canvas         (bg-background)
--background-alt   #efede7   section variation         (bg-background-alt)
--card             #ffffff   elevated surfaces         (bg-card)
--foreground       #141414   deep ink (headings/body)  (text-foreground)
--foreground-2     #4f4d49   secondary body            (text-foreground-2)
--foreground-3     #8a8782   muted / meta              (text-foreground-3)
--border           #e5e2da   1px hairlines             (border-border)
--border-strong    #d2cec4   dividers, focused inputs  (border-border-strong)
--accent           #5046e5   electric indigo (CTAs)    (bg-accent / text-accent)
--accent-hover     #3f38c7   indigo deepened           (hover:bg-accent-hover)
--accent-soft      #e8e6ff   indigo wash (pills)       (bg-accent-soft)
```

### Section background rotation (planned)

```
Hero        canvas        (#f7f5f2)
About       canvas-alt    (#efede7)   ← break, white photo card pops
Skills      canvas        (#f7f5f2)
Work        canvas        (#f7f5f2)   ← cards do the work
Contact     ink           (#141414)   ← inversion finisher; indigo CTA gets full prominence here
```

### Typography

- **Bricolage Grotesque** (`font-display`) — H1, H2, H3. Expressive, ink-traps. Weights loaded: 500, 600, 700, 800.
- **Outfit** (`font-sans`, default body font) — body, buttons, nav, eyebrows. Weights loaded: 300, 400, 500, 600, 700.

Type scale uses `clamp()` for fluid responsive sizing. Full spec lives in chat history / can be re-derived from existing component classes:

```
display-xl  clamp(3.5rem, 9vw, 8rem)       weight 700  lh 0.92  ls -0.04em   ← Hero name
h1          clamp(2.75rem, 6.5vw, 5.5rem)  weight 700  lh 0.98  ls -0.03em
h2          clamp(2rem, 4.5vw, 4rem)       weight 600  lh 1.05  ls -0.02em   ← About headline
lead        clamp(1.125rem, 1.4vw, 1.375rem) weight 300 lh 1.55              ← Hero subhead
body        16px   weight 400  lh 1.65
eyebrow     13px   weight 600 uppercase  ls +0.18em                         ← "AI SOFTWARE ENGINEER" tag
button      15px   weight 500  ls +0.01em
```

**Pairing rules:** never set body in Bricolage, never headings in Outfit. Tighten letter-spacing as size grows. Mix `700` + lighter-weight Bricolage within a single heading to show personality (e.g. "shipping **AI-powered systems**" — last span is `font-bold text-accent`).

---

## What's Built

### Sections
- **Hero** (`app/sections/Hero.tsx`) — eyebrow tag with indigo left-bar, Bricolage H1 ("Andres / Landazabal"), Outfit-light lead, filled cocoa→indigo CTA + "Get in touch" link. Two-col grid; skull right on lg, stacks on mobile. GSAP entrance timeline.
- **About** (`app/sections/About.tsx`) — centered Bricolage H2 with indigo highlight on "AI-powered systems.", photo placeholder card (4:5, white, on `canvas-alt` bg). ScrollTrigger fade-in.

### 3D — Silver Skull (`app/components/three/SkullScene.tsx`)
- Loads `/public/models/skull.glb` (silver material baked in from `blender-scripts/skull.py`).
- **OrbitControls** with `target={[0,-0.15,0]}` and `minDistance===maxDistance` — this combo was the fix for a glitch where dragging visually scaled the skull (was orbiting world origin, not skull). Don't change without re-testing.
- AutoRotate ~0.6 speed, polar clamped 0.25π–0.75π, no zoom, no pan.
- Studio environment for chrome reflections, ContactShadows beneath in `#141414`.
- Loaded via `next/dynamic` with `ssr: false` from Hero.

### Other files of note
- `app/layout.tsx` — loads `next/font/google` (Bricolage + Outfit), exposes CSS vars, sets default body classes (`bg-background font-sans text-foreground`).
- `app/components/three/BlackHoleScene.tsx` — built earlier, **not used**. Kept in case it's needed elsewhere (was removed from Hero because the site needs to stay light).
- `blender-scripts/skull.py` — regenerates `skull.glb` from scratch via Blender. Silver material baked at material-create time.
- `lib/gsap.ts` — single source for `gsap` + `ScrollTrigger`. Import from here, never from `gsap` directly (avoids double-registration).

---

## Still Missing

### High priority
- **Real photo** — user has one but hasn't dropped it yet. Drop in `/public/` (e.g. `/public/me.jpg`), then swap the placeholder div in `app/sections/About.tsx` for `next/image`.
- **Skills section** — confirmed flow is Hero → About → **Skills** → Work → Contact. Tech list to display: Three.js, Blender, React, GSAP, Next.js, TypeScript, plus AI/ML stack (TBD — ask user).
- **Work / Selected Projects section** — 3-5 project cards; AI projects first since that's the headline identity.
- **Contact section** — should invert to ink (`#141414`) background. This is where the indigo CTA gets its full moment. Email + socials.

### Polish / nice-to-have
- **Top nav** — none yet. Consider when site has 4+ sections.
- **Metadata / OG image** — `app/layout.tsx` has title + description; no OG image yet.
- **Favicon** — using Next's default.
- **The "Available for work" status** was removed from the eyebrow on user feedback — don't put it back without asking.

---

## Conventions / Don'ts learned this session

- Don't use a green pulsing dot anywhere — user explicitly rejected.
- Don't add "Portfolio / 2026" or any other meta strip in the hero.
- Don't hide content on mobile via `sm:inline` patterns — the user noticed and pushed back on labels disappearing at narrow viewports.
- Section heights: use `min-h-screen` + `justify-center` with padding, NOT `h-screen min-h-[720px]` + `items-center` + `overflow-hidden` — the latter clips top content on short viewports.
- When changing colors, sweep all of: `globals.css`, `app/layout.tsx` body classes, every section component, and `SkullScene.tsx` (ContactShadows color).
