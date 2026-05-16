"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);
  const tagRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(tagRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
        .fromTo(headingRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.4")
        .fromTo(subRef.current,     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.6")
        .fromTo(ctaRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5");
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex h-screen w-full flex-col justify-center px-8 md:px-20 lg:px-32 bg-[#f5f5f0]">
      <p
        ref={tagRef}
        className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#111111]/40"
      >
        Creative Developer
      </p>

      <h1
        ref={headingRef}
        className="max-w-3xl text-6xl font-bold leading-[1.02] tracking-tight text-[#111111] md:text-8xl lg:text-9xl"
      >
        Andres<br />Landazabal
      </h1>

      <p
        ref={subRef}
        className="mt-6 max-w-sm text-base text-[#111111]/50 md:text-lg"
      >
        {/* Hero content coming soon — you decide what goes here */}
        Engineering solutions. Building worlds.
      </p>

      <a
        ref={ctaRef}
        href="#about"
        className="mt-10 inline-flex w-fit items-center gap-3 rounded-full border border-[#111111]/15 bg-[#111111]/5 px-7 py-3.5 text-sm font-medium text-[#111111] transition-all duration-300 hover:bg-[#111111]/10 hover:gap-5"
      >
        Explore
        <span>→</span>
      </a>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-[#111111]/25">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-[#111111]/20 to-transparent" />
      </div>
    </section>
  );
}
