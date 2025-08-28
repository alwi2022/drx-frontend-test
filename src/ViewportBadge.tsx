// ViewportBadge.tsx
import React, { useEffect, useState } from "react";

type DeviceLabel = "HP" | "Tablet" | "Desktop";

const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
} as const;

function getViewport() {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  return { width: window.innerWidth, height: window.innerHeight };
}

function getDeviceLabel(width: number): DeviceLabel {
  if (width < BREAKPOINTS.sm) return "HP";
  if (width < BREAKPOINTS.lg) return "Tablet";
  return "Desktop";
}

function useViewportSize() {
  const [size, setSize] = useState(getViewport());

  useEffect(() => {
    let rafId: number | null = null;

    const onResize = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setSize(getViewport());
      });
    };

    // initial sync (SSR safe: no-op on server)
    onResize();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  return size;
}

export default function ViewportBadge() {
  const { width, height } = useViewportSize();
  const label = getDeviceLabel(width);

  return (
    <div className="pointer-events-none fixed left-2 top-2 z-[9999]">
      <div className="rounded-md border border-zinc-300 bg-white/90 px-2 py-1 text-[11px] leading-tight text-zinc-700 shadow-sm backdrop-blur">
        <div className="font-semibold">{label}</div>
        <div className="tabular-nums">
          {width}×{height}px
        </div>
        <div className="mt-0.5 text-[10px] text-zinc-500">
          {/* Info breakpoint (Tailwind default – min-width) */}
          sm≥{BREAKPOINTS.sm} • md≥{BREAKPOINTS.md} • lg≥{BREAKPOINTS.lg}
        </div>
      </div>
    </div>
  );
}
