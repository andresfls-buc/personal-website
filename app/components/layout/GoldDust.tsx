"use client";

import { useEffect, useState } from "react";

interface Mote {
  left: number;
  bottom: number;
  size: number;
  delay: number;
  duration: number;
  bright: boolean;
}

/**
 * Drifting gold dust motes — the embers floating in Finnstark's ember-light.
 * Pure CSS. Math.sin isn't bit-identical across JS engines, so the motes are
 * generated client-side only (after mount) to avoid SSR/CSR hydration mismatches.
 */
export default function GoldDust({ count = 26 }: { count?: number }) {
  const [motes, setMotes] = useState<Mote[]>([]);

  useEffect(() => {
    setMotes(
      Array.from({ length: count }, (_, i) => {
        // deterministic pseudo-random from index
        const r = (n: number) => {
          const x = Math.sin((i + 1) * n) * 10000;
          return x - Math.floor(x);
        };
        return {
          left: r(12.9898) * 100,
          bottom: r(78.233) * 40,
          size: 1 + r(37.719) * 2.5,
          delay: r(4.123) * 12,
          duration: 9 + r(91.21) * 10,
          bright: r(8.7) > 0.7,
        };
      })
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {motes.map((m, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${m.left}%`,
            bottom: `${m.bottom}%`,
            width: `${m.size}px`,
            height: `${m.size}px`,
            background: m.bright ? "#ecd49b" : "#a85841",
            boxShadow: m.bright
              ? "0 0 6px 1px rgba(236,212,155,0.7)"
              : "0 0 4px rgba(168,88,65,0.6)",
            animation: `drift ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
