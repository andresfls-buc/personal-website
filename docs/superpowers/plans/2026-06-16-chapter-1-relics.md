# Chapter I Relic Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tool-card grid in Chapter I (`app/sections/Craft.tsx`) with an asymmetric scatter of 5 placeholder "relic" image plates that drift via scroll-linked parallax on desktop, matching the site's dark-storybook GSAP/ScrollTrigger conventions.

**Architecture:** A new `RelicGallery` component renders 5 bordered placeholder plates (same visual language as the existing About photo placeholder) positioned in an asymmetric scatter via static Tailwind classes. On `md`+ screens, each plate gets an independent GSAP `ScrollTrigger` scrub tween whose magnitude is set by a per-plate `depth` value, creating a parallax effect. Below `md`, plates stack vertically with no parallax. `prefers-reduced-motion` disables all scrub tweens. `Craft.tsx` drops its old tool list and renders `<RelicGallery />` instead, with updated intro copy.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger (via `lib/gsap.ts`). No test framework in this repo — verification is via `npm run lint`, `npx tsc --noEmit`, and manual browser check (per project convention for UI work).

This repo has no automated test suite, so steps use lint/typecheck/build as the verification gate instead of unit tests, finishing with a manual browser check.

---

### Task 1: Build the static `RelicGallery` component (no animation yet)

**Files:**
- Create: `app/components/layout/RelicGallery.tsx`

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Relic {
  id: string;
  label: string;
  size: "lg" | "md" | "sm";
  position: string;
  depth: number;
  tone: "ember" | "arcane";
}

const RELICS: Relic[] = [
  { id: "relic-1", label: "Relic I", size: "lg", position: "md:absolute md:left-0 md:top-0", depth: 0.4, tone: "ember" },
  { id: "relic-2", label: "Relic II", size: "md", position: "md:absolute md:right-0 md:top-16", depth: 0.9, tone: "arcane" },
  { id: "relic-3", label: "Relic III", size: "sm", position: "md:absolute md:left-[38%] md:top-56", depth: 1.2, tone: "ember" },
  { id: "relic-4", label: "Relic IV", size: "md", position: "md:absolute md:left-4 md:bottom-0", depth: 0.6, tone: "arcane" },
  { id: "relic-5", label: "Relic V", size: "sm", position: "md:absolute md:right-8 md:bottom-4", depth: 1.0, tone: "ember" },
];

const SIZE_CLASSES: Record<Relic["size"], string> = {
  lg: "h-64 w-64 md:h-80 md:w-80",
  md: "h-48 w-48 md:h-60 md:w-60",
  sm: "h-32 w-32 md:h-40 md:w-40",
};

const TONE_GRADIENTS: Record<Relic["tone"], string> = {
  ember: "radial-gradient(circle at 50% 35%, #5c3326 0%, #1b1f23 70%, #14171a 100%)",
  arcane: "radial-gradient(circle at 50% 35%, #424a55 0%, #21262b 70%, #14171a 100%)",
};

const TONE_BORDER: Record<Relic["tone"], string> = {
  ember: "border-ember/30",
  arcane: "border-arcane/40",
};

export default function RelicGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const plateRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Animation wired in Task 2
  }, []);

  const setPlateRef = (id: string) => (el: HTMLDivElement | null) => {
    if (el) plateRefs.current.set(id, el);
    else plateRefs.current.delete(id);
  };

  return (
    <div ref={containerRef} className="relative flex flex-col gap-8 md:min-h-[640px] md:gap-0">
      {RELICS.map((relic) => (
        <div
          key={relic.id}
          ref={setPlateRef(relic.id)}
          className={`relative overflow-hidden border ${TONE_BORDER[relic.tone]} bg-void-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ${SIZE_CLASSES[relic.size]} ${relic.position}`}
        >
          <div className="absolute inset-0" style={{ background: TONE_GRADIENTS[relic.tone] }} />
          <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.3em] text-bone-3">
            {relic.label}
          </div>
          <div className="pointer-events-none absolute inset-3 border border-ember/30" />
          {/* TODO: swap placeholder for <Image src={`/relics/${relic.id}.png`} alt={relic.label} fill className="object-cover" /> once real assets exist */}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `cd /Users/andreslandazabal/personal-website && npx tsc --noEmit && npm run lint`
Expected: no errors (unused `gsap`/`ScrollTrigger`/`useRef`-for-animation imports are fine since they're already referenced; `useEffect` body is empty but the import is used).

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/RelicGallery.tsx
git commit -m "feat: add static relic gallery placeholder component"
```

---

### Task 2: Wire `RelicGallery` into Chapter I and remove the old tool grid

**Files:**
- Modify: `app/sections/Craft.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client";

import Chapter from "@/app/components/layout/Chapter";
import RelicGallery from "@/app/components/layout/RelicGallery";

export default function Craft() {
  return (
    <Chapter
      id="craft"
      numeral="I"
      eyebrow="Chapter I"
      title={
        <>
          The Craft —{" "}
          <span className="text-ember-glow">intelligent systems, shipped.</span>
        </>
      }
      intro="Some things resist a clean list. These are fragments of the craft — texture, not inventory."
    >
      <RelicGallery />
    </Chapter>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `cd /Users/andreslandazabal/personal-website && npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/sections/Craft.tsx
git commit -m "feat: replace Chapter I tool grid with relic gallery"
```

---

### Task 3: Add scroll-linked parallax to the relic plates

**Files:**
- Modify: `app/components/layout/RelicGallery.tsx`

- [ ] **Step 1: Replace the empty `useEffect` with the parallax setup**

```tsx
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tweens = RELICS.map((relic) => {
        const el = plateRefs.current.get(relic.id);
        if (!el) return null;
        return gsap.fromTo(
          el,
          { y: -40 * relic.depth },
          {
            y: 40 * relic.depth,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        tweens.forEach((tween) => tween?.scrollTrigger?.kill());
        tweens.forEach((tween) => tween?.kill());
      };
    });

    return () => mm.revert();
  }, []);
```

- [ ] **Step 2: Typecheck and lint**

Run: `cd /Users/andreslandazabal/personal-website && npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/components/layout/RelicGallery.tsx
git commit -m "feat: add scroll-linked parallax to relic plates"
```

---

### Task 4: Manual verification in the browser

- [ ] **Step 1: Start the dev server**

Run: `cd /Users/andreslandazabal/personal-website && npm run dev`

- [ ] **Step 2: Open `http://localhost:3000` and scroll to Chapter I ("The Craft")**

Confirm:
- The old 3-column tool grid is gone; 5 bordered placeholder plates are visible, scattered asymmetrically (desktop width) or stacked vertically (mobile width, resize browser or use device toolbar).
- On desktop width, scrolling the chapter into and out of view causes the plates to drift at visibly different speeds (parallax).
- No console errors related to GSAP/ScrollTrigger.
- Toggling OS-level "reduce motion" (or `prefers-reduced-motion: reduce` via browser devtools rendering emulation) stops the plates from moving on scroll.

- [ ] **Step 3: Run a full build to catch anything lint/typecheck missed**

Run: `cd /Users/andreslandazabal/personal-website && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Stop the dev server**

Run: kill the `npm run dev` process started in Step 1.
