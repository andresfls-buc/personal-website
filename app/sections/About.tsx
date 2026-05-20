"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 })
        .fromTo(photoRef.current,   { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, "-=0.6");
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full bg-[#efede7] py-32 md:py-40 lg:py-48"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center px-8 md:px-12">
        {/* H2 — Bricolage Grotesque, fluid 32→64px */}
        <h2
          ref={headingRef}
          className="max-w-3xl text-center font-display font-semibold leading-[1.05] tracking-[-0.02em] text-[#141414] [font-size:clamp(2rem,4.5vw,4rem)]"
        >
          8+ years of experience shipping{" "}
          <span className="font-bold text-[#5046e5]">AI-powered systems.</span>
        </h2>

        {/* Photo placeholder */}
        <div
          ref={photoRef}
          className="relative mt-14 aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-sm border border-[#141414]/10 bg-[#ffffff] md:mt-16"
        >
          {/* TODO: replace with real photo at /public/me.jpg via next/image */}
          <div className="absolute inset-0 flex items-center justify-center font-sans text-xs font-semibold uppercase tracking-[0.25em] text-[#141414]/35">
            Photo placeholder
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0.05)_100%)]" />
        </div>
      </div>
    </section>
  );
}
