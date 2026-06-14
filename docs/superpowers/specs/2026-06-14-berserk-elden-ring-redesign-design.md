# Elden Ring / Berserk Redesign — Design Spec
Date: 2026-06-14

## Overview
Full site overhaul to a dark fantasy aesthetic inspired by Elden Ring and Berserk. Dark near-black backgrounds, aged gold accents, gothic serif typography, and a Blender-built animated 3D hero scene.

---

## 1. Design System

### Colors (replace all current tokens in `globals.css`)
| Token | Value | Use |
|---|---|---|
| `--background` | `#0a0806` | page bg |
| `--background-alt` | `#110e09` | section variation |
| `--card` | `#1a1510` | elevated surfaces |
| `--foreground` | `#e8dcc8` | body text |
| `--foreground-2` | `#a89880` | secondary text |
| `--foreground-3` | `#6b5e4a` | muted/meta |
| `--border` | `#2a2318` | hairlines |
| `--border-strong` | `#3d3426` | dividers |
| `--accent` | `#c9a84c` | gold (CTAs, highlights) |
| `--accent-hover` | `#e0bc5a` | gold hover |
| `--accent-soft` | `#2a2010` | gold wash |

### Typography
- **Headings**: Cinzel (Google Fonts) — weights 400, 600, 700
- **Body**: Outfit — keep as-is
- Replace `font-display` CSS var to point to Cinzel
- Letter-spacing on headings: `+0.05em` (Cinzel reads better with slight tracking)

---

## 2. Hero Section — 3D Blender Scene

### Blender Scene (built via MCP, exported as `/public/models/hero_scene.glb`)

**Objects:**
- `RockyCrag` — jagged rock/stump form, center-left
- `SilhouetteFigure` — dark warrior seated against crag, facing away, cloak draping down
- `Sword` — long blade resting at figure's side (silhouette shape only)
- `FlagPole` — wooden pole, mid-right distance
- `Flag` — cloth sim mesh parented to pole, looping 120-frame wind animation
- `Trees` (x4–6) — bare dead tree shapes, scattered left and right
- `Mountains` — low-poly distant range, horizon right
- `Castle` — tiny silhouette on horizon between mountains
- `SkyPlane` — large backdrop plane with emission gradient (dark top → pale amber glow at horizon)

**Materials:**
- Figure, rock, trees, mountains, castle: near-black (`#0d0b09`), shadeless/emission
- Flag: dark grey (`#1a1614`), shadeless
- Sky glow: emission, color ramp from `#0a0806` (top) → `#3d2d10` (mid) → `#c9a84c` (horizon)

**Animation:**
- Flag cloth sim baked, looping at 120 frames / 24fps
- Cloak on figure: subtle secondary cloth (24-frame loop), same timeline

**Camera:** Fixed. Low angle, slightly off-center left, looking toward horizon. FOV ~40.

**Export:** GLB with baked animations, Draco compression if available.

### Web Component (`app/components/three/HeroScene.tsx`)
- Load GLB via `useGLTF`
- Play flag + cloak animations via `AnimationMixer` (looping)
- Canvas: `position: absolute, inset: 0`, background `#0a0806`
- No OrbitControls, no user interaction
- Loaded via `next/dynamic` with `ssr: false`

### Hero Section (`app/sections/Hero.tsx`)
- Remove all black hole / skull references
- Full-bleed `HeroScene` as background
- Text overlay (bottom-center, `z-10`, `pointer-events-none`):
  - Eyebrow: "AI Software Engineer" — Outfit, 12px, `--accent` color, uppercase, wide tracking
  - Name: "Andres Landazabal" — Cinzel 700, `clamp(3rem, 7vw, 6rem)`, `--foreground` color
- GSAP entrance: text fades up on load (simple, no scroll pin)
- Scroll behavior: section scrolls normally off screen (no pin/zoom)

---

## 3. Remaining Sections — Color + Typography Updates

Apply new design tokens to:
- `app/sections/About.tsx` — dark bg, gold accent on heading highlight
- `app/layout.tsx` — update body class to `bg-background text-foreground`, load Cinzel font
- `app/globals.css` — replace all color tokens, update `--font-display` to Cinzel

Skills / Work / Contact sections: apply tokens when built.

---

## 4. Files Changed
| File | Change |
|---|---|
| `app/globals.css` | Replace color tokens, add Cinzel to `--font-display` |
| `app/layout.tsx` | Add Cinzel to `next/font/google`, update body classes |
| `app/sections/Hero.tsx` | Full rewrite — HeroScene + text overlay |
| `app/sections/About.tsx` | Color token updates |
| `app/components/three/HeroScene.tsx` | New — GLB loader + AnimationMixer |
| `public/models/hero_scene.glb` | New — exported from Blender via MCP |
| `blender-scripts/hero_scene.py` | New — Blender Python script (MCP-generated) |

## 5. Out of Scope
- Replacing skull.glb or BlackHoleScene (keep files, just not used)
- Skills / Work / Contact section builds (future)
- Top nav
