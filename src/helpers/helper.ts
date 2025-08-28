// src/helpers/helper.ts

export function polarPoint(cx: number, cy: number, r: number, deg: number) {
    const rad = (Math.PI / 180) * deg;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}



export function ringSegmentPath(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startDeg: number,
    endDeg: number
  ) {
    const large = endDeg - startDeg <= 180 ? 0 : 1;
    const a0 = polarPoint(cx, cy, rOuter, startDeg);
    const a1 = polarPoint(cx, cy, rOuter, endDeg);
    const b1 = polarPoint(cx, cy, rInner, endDeg);
    const b0 = polarPoint(cx, cy, rInner, startDeg);
    return [
      `M ${a0.x} ${a0.y}`,
      `A ${rOuter} ${rOuter} 0 ${large} 1 ${a1.x} ${a1.y}`,
      `L ${b1.x} ${b1.y}`,
      `A ${rInner} ${rInner} 0 ${large} 0 ${b0.x} ${b0.y}`,
      "Z",
    ].join(" ");
  }

