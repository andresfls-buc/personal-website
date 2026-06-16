"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(photoRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 })
        .fromTo(headingRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, "-=0.8")
        .fromTo(bodyRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, "-=0.7");
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
      className="relative w-full overflow-hidden bg-void-2 py-28 md:py-40"
    >
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-8 md:grid-cols-12 md:px-12">
        {/* Aged portrait frame */}
        <div ref={photoRef} className="md:col-span-5">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px] overflow-hidden border border-border-strong bg-void-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
            {/* TODO: drop /public/me.jpg and swap for next/image (sepia-toned) */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 35%, #5c3326 0%, #1b1f23 70%, #14171a 100%)",
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-body)] text-xs uppercase tracking-[0.3em] text-bone-3">
              Portrait
            </div>
            {/* inner gold hairline frame */}
            <div className="pointer-events-none absolute inset-3 border border-ember/30" />
          </div>
        </div>

        {/* Copy */}
        <div className="md:col-span-7">
          <span className="eyebrow text-ember">The Awakening</span>
          <h2
            ref={headingRef}
            className="h2 mt-5 max-w-2xl font-[family-name:var(--font-display)] font-semibold text-bone"
          >
            An engineer drawn to{" "}
            <span className="text-ember-glow">what machines cannot yet name.</span>
          </h2>
          <div
            ref={bodyRef}
            className="lead mt-8 max-w-xl space-y-5 font-[family-name:var(--font-body)] text-bone-2"
          >
            <p>
              I build AI software that reasons, perceives and ships to
              production — and I chase the same rigor into physics, from quantum
              systems to the old certainties of classical mechanics.
            </p>
            <p className="font-[family-name:var(--font-fell)] italic text-bone">
              &ldquo;The night, and the dream, were long.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
