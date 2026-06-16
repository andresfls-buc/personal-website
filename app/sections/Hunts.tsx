"use client";

import Chapter from "@/app/components/layout/Chapter";

export default function Hunts() {
  return (
    <Chapter
      id="hunts"
      numeral="II"
      eyebrow="Chapter II"
      title={
        <>
          The Hunts —{" "}
          <span className="text-ember-glow">trophies brought back from the dark.</span>
        </>
      }
      intro="Every hunt leaves a mark. These are the systems I tracked down, built, and shipped — proof carried back from the dark."
    >
      {/* TODO: 3D scene goes here */}
      <div className="flex h-[480px] w-full items-center justify-center">
        <span className="font-[family-name:var(--font-fell)] text-sm italic text-bone-3">
          The hunt awaits its trophy.
        </span>
      </div>
    </Chapter>
  );
}
