"use client";

import Chapter from "@/app/components/layout/Chapter";
import RelicGallery from "@/app/components/layout/RelicGallery";

export default function Craft() {
  return (
    <Chapter
      id="craft"
      numeral="I"
      eyebrow="Chapter I"
      title={
        <>
          The Craft —{" "}
          <span className="text-ember-glow">intelligent systems, shipped.</span>
        </>
      }
      intro="Some things resist a clean list. These are fragments of the craft — texture, not inventory."
    >
      <RelicGallery />
    </Chapter>
  );
}
