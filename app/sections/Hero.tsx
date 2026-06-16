"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GoldDust from "@/app/components/layout/GoldDust";

const SkullScene = dynamic(() => import("@/app/components/three/SkullScene"), {
  ssr: false,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const skullRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([tagRef.current, headingRef.current, subRef.current], {
        y: 40,
        opacity: 0,
      });

      gsap
        .timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=70%",
            scrub: true,
            pin: true,
            anticipatePin: 1,
          },
        })
        .to(tagRef.current, { y: 0, opacity: 1, duration: 1 })
        .to(headingRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
        .to(subRef.current, { y: 0, opacity: 1, duration: 1 }, "-=0.6")
        .to(scrollRef.current, { opacity: 1, duration: 0.6 }, "-=0.3");
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      scrollProgressRef.current = window.scrollY * 0.0015;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden py-20 md:py-24"
    >
      {/* ── Ember light from the upper-right "rose window" ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 78% 18%, #f3c98a 0%, #a85841 9%, #7a4030 24%, #21262b 46%, #14171a 70%)",
        }}
      />
      {/* ── Fog rising from the floor ── */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, #14171a 6%, rgba(92,51,38,0.25) 42%, transparent 68%)",
        }}
      />
      <GoldDust />

      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 px-8 md:px-20 lg:grid-cols-12 lg:px-28">
        {/* ── Left: typography ── */}
        <div className="lg:col-span-7">
          <div ref={tagRef} className="mb-8">
            <span className="eyebrow inline-block border-l-[3px] border-ember pl-3.5">
              AI Software Engineer · Physics
            </span>
          </div>

          <h1
            ref={headingRef}
            className="display-xl max-w-3xl font-[family-name:var(--font-display)] font-semibold text-bone"
            style={{ textShadow: "0 4px 40px rgba(0,0,0,0.7)" }}
          >
            Andres
            <br />
            <span className="text-ember-glow">Landazabal</span>
          </h1>

          <p
            ref={subRef}
            className="lead mt-8 max-w-lg font-[family-name:var(--font-body)] text-bone-2"
          >
            Building intelligent systems at the edge of physics and machines —
            <span className="italic text-bone"> where the engineered meets the unknowable.</span>
          </p>
        </div>

        {/* ── Right: silver skull, candle-lit ── */}
        <div ref={skullRef} className="relative lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <SkullScene scrollRotationRef={scrollProgressRef} />
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="eyebrow text-[10px] text-bone-3">Descend</span>
        <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-ember to-transparent" />
      </div>
    </section>
  );
}
