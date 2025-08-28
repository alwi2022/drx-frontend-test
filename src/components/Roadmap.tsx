// src/components/Roadmap.tsx
import React, { useState } from "react";
import MobileRoadmap from "./roadmap/MobileRoadmap";
import DesktopRoadmap from "./roadmap/DesktopRoadmap";
import { QuarterId, QuarterMap } from "../types/type";

const QUARTERS: QuarterMap = {
  1: {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    blurb:
      "Vestibulum in tortor at massa faucibus dictum a a metus. Integer maximus quam vitae lacus ultricies, eget blandit massa bibendum.",
  },
  2: {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    blurb:
      "Vestibulum in tortor at massa faucibus dictum a a metus. Integer maximus quam vitae lacus ultricies, eget blandit massa bibendum.",
  },
  3: {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    blurb:
      "Vestibulum in tortor at massa faucibus dictum a a metus. Integer maximus quam vitae lacus ultricies, eget blandit massa bibendum.",
  },
  4: {
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    blurb:
      "Vestibulum in tortor at massa faucibus dictum a a metus. Integer maximus quam vitae lacus ultricies, eget blandit massa bibendum.",
  },
} as const;

export default function Roadmap() {
  const [activeQuarter, setActiveQuarter] = useState<QuarterId>(1);

  return (
    <section className="w-full bg-white text-neutral-900">
      {/* Desktop / Large screens */}
      <div className="hidden lg:block">
        <DesktopRoadmap
          activeQ={activeQuarter}
          setActiveQ={setActiveQuarter}
          quarters={QUARTERS}
        />
      </div>

      {/* Mobile & Tablet */}
      <div className="block lg:hidden">
        <MobileRoadmap
          activeQ={activeQuarter}
          setActiveQ={setActiveQuarter}
          quarters={QUARTERS}
        />
      </div>
    </section>
  );
}
