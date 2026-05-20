"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const SkullScene = dynamic(
  () => import("@/app/components/three/SkullScene"),
  { ssr: false }
);

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLAnchorElement>(null);
  const tagRef     = useRef<HTMLDivElement>(null);
  const skullRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(tagRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 })
        .fromTo(headingRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.4")
        .fromTo(skullRef.current,   { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" }, "-=1.0")
        .fromTo(subRef.current,     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.9")
        .fromTo(ctaRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6");
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen w-full flex-col justify-center bg-[#f7f5f2] py-20 md:py-24 lg:py-28">
      <div className="relative z-10 grid w-full grid-cols-1 items-center gap-10 px-8 md:px-20 lg:grid-cols-12 lg:px-32">
        {/* ── Left: typography ─────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          {/* Eyebrow tag — Outfit 600 uppercase */}
          <div ref={tagRef} className="mb-8">
            <span className="inline-block border-l-[3px] border-[#5046e5] pl-3.5 font-sans text-[13px] font-semibold uppercase tracking-[0.18em] text-[#141414] sm:text-sm">
              AI Software Engineer
            </span>
          </div>

          {/* H1 — Bricolage Grotesque display-xl */}
          <h1
            ref={headingRef}
            className="max-w-3xl font-display font-bold leading-[0.92] tracking-[-0.04em] text-[#141414] [font-size:clamp(3.5rem,9vw,8rem)]"
          >
            Andres<br />Landazabal
          </h1>

          {/* Lead — Outfit 300, 18→22px */}
          <p
            ref={subRef}
            className="mt-7 max-w-md font-sans font-light leading-[1.55] text-[#141414]/65 [font-size:clamp(1.125rem,1.4vw,1.375rem)]"
          >
            Engineering intelligent systems.
            <br />
            Building worlds in code.
          </p>

          {/* CTA row — Outfit 500 button + 500 link */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              ref={ctaRef}
              href="#about"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#141414] px-7 py-3.5 font-sans text-[15px] font-medium tracking-[0.01em] text-[#f7f5f2] transition-all duration-300 hover:gap-5 hover:bg-[#5046e5]"
            >
              Explore work
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="font-sans text-[15px] font-medium tracking-[0.01em] text-[#141414]/65 underline-offset-4 transition hover:text-[#5046e5] hover:underline"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* ── Right: silver skull ──────────────────────────────────────── */}
        <div
          ref={skullRef}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            <SkullScene />
          </div>
        </div>
      </div>

    </section>
  );
}
