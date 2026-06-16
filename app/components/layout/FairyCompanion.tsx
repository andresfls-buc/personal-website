"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const FairyScene = dynamic(() => import("@/app/components/three/FairyScene"), {
  ssr: false,
});

const BOX_SIZE = 160;
const EDGE_MARGIN = 0.1;

function randomTarget() {
  const x = (EDGE_MARGIN + Math.random() * (1 - EDGE_MARGIN * 2)) * window.innerWidth - BOX_SIZE / 2;
  const y = (EDGE_MARGIN + Math.random() * (1 - EDGE_MARGIN * 2)) * window.innerHeight - BOX_SIZE / 2;
  return { x, y };
}

export default function FairyCompanion() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollDeltaRef = useRef(0);
  const lastScrollY = useRef(0);
  const roamEnergy = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      scrollDeltaRef.current += delta;
      roamEnergy.current = Math.min(roamEnergy.current + Math.abs(delta) * 0.01, 2);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;
    gsap.set(wrapperRef.current, { opacity: 0 });
    gsap.to(wrapperRef.current, { opacity: 1, duration: 1.2, ease: "power2.out" });

    // she roams freely around the viewport instead of sitting pinned in a
    // corner; scroll energy makes her retarget faster and travel quicker,
    // like she's actively flying alongside you as you explore the page
    const pos = {
      x: window.innerWidth - BOX_SIZE - 24,
      y: window.innerHeight - BOX_SIZE - 40,
    };
    let target = randomTarget();
    let retargetTimer = 1.5;
    let last = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      roamEnergy.current *= 0.96;

      retargetTimer -= dt;
      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4 || retargetTimer <= 0) {
        target = randomTarget();
        retargetTimer = Math.max(2.8 - roamEnergy.current * 1.4, 0.8) + Math.random() * 1.5;
      }

      const speed = 0.5 + roamEnergy.current * 1.6;
      const lerp = 1 - Math.exp(-speed * dt);
      pos.x += dx * lerp;
      pos.y += dy * lerp;

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const handleResize = () => {
      target = randomTarget();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed left-0 top-0 z-40 h-32 w-32 md:h-40 md:w-40"
    >
      <FairyScene scrollDeltaRef={scrollDeltaRef} />
    </div>
  );
}
