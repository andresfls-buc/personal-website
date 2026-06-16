"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import GoldDust from "@/app/components/layout/GoldDust";

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/andresfls-buc" },
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);
    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border-t border-border py-28 text-center"
    >
      {/* ember rising from the page's edge */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 120%, #a85841 0%, #7a4030 22%, #21262b 45%, #14171a 72%)",
        }}
      />
      <GoldDust count={32} />

      <div ref={innerRef} className="relative z-10 mx-auto max-w-3xl px-8">
        <span className="eyebrow text-ember">The Call</span>
        <h2 className="h1 mt-6 font-[family-name:var(--font-display)] font-semibold text-bone">
          Let us speak of <span className="text-ember-glow">the work to come.</span>
        </h2>
        <p className="lead mt-7 font-[family-name:var(--font-body)] text-bone-2">
          Building something at the edge of AI, physics, or the merely
          impossible? Send word.
        </p>

        <a
          href="mailto:andresflsxx@gmail.com"
          className="group mt-12 inline-flex items-center gap-3 rounded-full border border-ember bg-ember/10 px-10 py-4 font-[family-name:var(--font-body)] text-base uppercase tracking-[0.1em] text-ember-bright transition-all duration-300 hover:gap-5 hover:bg-ember hover:text-void"
        >
          andresflsxx@gmail.com
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>

        <div className="mt-14 flex items-center justify-center gap-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="font-[family-name:var(--font-body)] text-sm uppercase tracking-[0.18em] text-bone-3 transition hover:text-ember-bright"
            >
              {s.label}
            </a>
          ))}
        </div>

        <p className="mt-20 font-[family-name:var(--font-fell)] text-sm italic text-bone-3">
          Andres Landazabal — MMXXVI
        </p>
      </div>
    </section>
  );
}
