"use client";

import Chapter from "@/app/components/layout/Chapter";

const ARCANA: { title: string; body: string }[] = [
  {
    title: "Superposition",
    body: "A system holds every possibility at once — until the world insists on an answer.",
  },
  {
    title: "Entanglement",
    body: "Two things, once joined, answer for each other across any distance. The eldritch made literal.",
  },
  {
    title: "Decoherence",
    body: "The quiet violence of observation. The dream collapses into the measured.",
  },
];

const LAWS: { n: string; title: string; body: string }[] = [
  { n: "i.", title: "Lagrangian & Hamiltonian", body: "Motion as the path of least action — the elegant bones beneath the world." },
  { n: "ii.", title: "Orbital dynamics", body: "Bodies bound by gravity, tracing the same ellipses Kepler drew by candlelight." },
  { n: "iii.", title: "Chaos & the n-body", body: "Determinism that refuses prediction. Order and dread, one and the same." },
];

export default function Cosmos() {
  return (
    <Chapter
      id="cosmos"
      numeral="III"
      eyebrow="Chapter III"
      accent="arcane"
      title={
        <>
          The Cosmos &amp; The Mechanics —{" "}
          <span className="text-arcane">quantum systems &amp; the old certainties.</span>
        </>
      }
      intro="Where intuition fails and mathematics keeps walking. I study physics for the same reason I build AI: to make the incomprehensible compute — from the quantum strangeness down to the clockwork beneath it."
    >
      <div className="space-y-20">
        {/* Quantum systems */}
        <div>
          <span className="eyebrow text-arcane">Quantum Systems</span>
          <div className="mt-7 grid grid-cols-1 gap-6 md:grid-cols-3">
            {ARCANA.map((a) => (
              <div
                key={a.title}
                className="group relative overflow-hidden rounded-sm border border-arcane-deep bg-void-2 p-8 transition-all duration-500 hover:border-arcane"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                  style={{ background: "var(--arcane)" }}
                />
                <h3 className="relative font-[family-name:var(--font-display)] text-xl tracking-[0.04em] text-arcane">
                  {a.title}
                </h3>
                <p className="relative mt-4 font-[family-name:var(--font-body)] leading-relaxed text-bone-2">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Classical mechanics */}
        <div>
          <span className="eyebrow text-ember">Classical Mechanics</span>
          <div className="mt-7 grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
            {/* Animated orbit diagram */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto aspect-square w-full max-w-[340px]">
                <div className="absolute inset-0 rounded-full border border-border" />
                <div className="absolute inset-[14%] rounded-full border border-dashed border-ember/30" />
                <div className="absolute inset-[34%] rounded-full border border-border" />
                {/* central sun */}
                <div
                  className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ background: "radial-gradient(circle,#ecd49b,#a85841)", boxShadow: "0 0 28px 6px rgba(232,168,92,0.5)" }}
                />
                {/* orbiting body */}
                <div className="absolute inset-[14%] animate-[spin_14s_linear_infinite]">
                  <div
                    className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-bone"
                    style={{ boxShadow: "0 0 12px rgba(183,190,174,0.8)" }}
                  />
                </div>
                <div className="absolute inset-[34%] animate-[spin_9s_linear_infinite_reverse]">
                  <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-arcane" />
                </div>
              </div>
            </div>

            {/* Laws */}
            <div className="lg:col-span-7">
              <ul className="divide-y divide-border">
                {LAWS.map((l) => (
                  <li key={l.title} className="group flex gap-6 py-6">
                    <span className="font-[family-name:var(--font-fell)] text-2xl italic text-ember/60">
                      {l.n}
                    </span>
                    <div>
                      <h3 className="font-[family-name:var(--font-display)] text-lg tracking-[0.04em] text-bone transition-colors group-hover:text-ember-bright">
                        {l.title}
                      </h3>
                      <p className="mt-2 font-[family-name:var(--font-body)] text-bone-2">
                        {l.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
