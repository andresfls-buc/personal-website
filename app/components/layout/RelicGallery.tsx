"use client";

import { useEffect, useRef } from "react";

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
