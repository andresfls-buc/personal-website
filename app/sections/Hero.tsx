"use client";

import { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const HeroScene = dynamic(
  () => import("@/app/components/three/HeroScene"),
  { ssr: false }
);

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 0.5,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen w-full items-end justify-center pb-20">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0a0806]" />}>
          <HeroScene />
        </Suspense>
      </div>

      <div
        ref={textRef}
        className="pointer-events-none relative z-10 flex flex-col items-center text-center"
      >
        <span className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-accent">
          AI Software Engineer
        </span>
        <h1 className="font-display font-bold leading-[1.05] tracking-[0.05em] text-foreground [font-size:clamp(2.8rem,7vw,6rem)]">
          Andres<br />Landazabal
        </h1>
      </div>
    </section>
  );
}
