"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ChapterProps {
  id: string;
  numeral: string; // "I", "II", "III"
  eyebrow: string; // "Chapter I"
  title: ReactNode;
  intro?: ReactNode;
  children: ReactNode;
  /** arcane = cold violet accent world (physics); ember = warm default */
  accent?: "ember" | "arcane";
}

export default function Chapter({
  id,
  numeral,
  eyebrow,
  title,
  intro,
  children,
  accent = "ember",
}: ChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const accentText = accent === "arcane" ? "text-arcane" : "text-ember";
  const numeralColor = accent === "arcane" ? "var(--arcane-deep)" : "var(--ember-deep)";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
            toggleActions: "play none none reverse",
          },
        })
        .fromTo(headRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 })
        .fromTo(bodyRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, "-=0.7");
    }, sectionRef);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full overflow-hidden border-t border-border py-28 md:py-40"
    >
      {/* faint ghost numeral behind the chapter */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-6 right-4 select-none font-[family-name:var(--font-display)] font-bold leading-none md:right-16"
        style={{ fontSize: "clamp(8rem,28vw,22rem)", color: numeralColor, opacity: 0.5 }}
      >
        {numeral}
      </span>

      <div className="relative z-10 mx-auto max-w-6xl px-8 md:px-12">
        <div ref={headRef} className="max-w-3xl">
          <span className={`eyebrow ${accentText}`}>{eyebrow}</span>
          <h2 className="h2 mt-5 font-[family-name:var(--font-display)] font-semibold text-bone">
            {title}
          </h2>
          {intro && (
            <p className="lead mt-7 max-w-xl font-[family-name:var(--font-body)] text-bone-2">
              {intro}
            </p>
          )}
        </div>

        <div ref={bodyRef} className="mt-14">
          {children}
        </div>
      </div>
    </section>
  );
}
