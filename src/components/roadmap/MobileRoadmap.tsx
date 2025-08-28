// src/components/roadmap/MobileRoadmap.tsx
import React, { useMemo } from "react";
import { ConnectorConf, QuarterId, QuarterMap } from "../../types/type";
import { polarPoint } from "../../helpers/helper";
import { ringSegmentPath } from "../../helpers/helper";

function SegmentedWheel({
    activeQ,
    onQuarterClick,
    quarters,
}: {
    activeQ: QuarterId;
    onQuarterClick?: (q: QuarterId) => void;
    quarters: QuarterMap;
}) {
    // virtual canvas
    const SIZE = 320;
    const PAD_T = 16,
        PAD_R = 8,
        PAD_B = 320,
        PAD_L = 8;

    const viewBox = `${-PAD_L} ${-PAD_T} ${SIZE + PAD_L + PAD_R} ${SIZE + PAD_T + PAD_B}`;
    const cx = SIZE / 2;
    const cy = SIZE / 3.2;

    const rOuter = 140;
    const rInner = 94;

    // 4 petals across 260°
    const SEG_COUNT = 4;
    const TOTAL_SPAN = 260;
    const START_BASE = 90 - TOTAL_SPAN / 2;
    const GAP = 6;
    const SEG_SPAN = (TOTAL_SPAN - GAP * (SEG_COUNT - 1)) / SEG_COUNT;

    const segments = useMemo(() => {
        return Array.from({ length: SEG_COUNT }).map((_, i) => {
            const start = START_BASE + i * (SEG_SPAN + GAP);
            const end = start + SEG_SPAN;
            return { i, start, end };
        });
        // constants → build once
    }, []);

    // mobile order mapping (reversed as requested)
    const segToQuarter: QuarterId[] = [4, 3, 2, 1];
    const quarterToSeg: Record<QuarterId, number> = useMemo(() => {
        return segToQuarter.reduce((acc, q, idx) => {
            acc[q] = idx;
            return acc;
        }, {} as Record<QuarterId, number>);
    }, []);

    // connector config (kept exactly as existing logic)
    const cfg: Record<QuarterId, ConnectorConf> = {
        1: { anchor: "start", angleBias: 1, radius: "outer", first: "v", dx: 0, dy: 100, dr: 20 },
        2: { anchor: "end", angleBias: -1, radius: "outer", first: "v", dx: 0, dy: 100, dr: 20 },
        3: { anchor: "start", angleBias: 1, radius: "outer", first: "v", dx: 0, dy: 100, dr: 20 },
        4: { anchor: "end", angleBias: -2, radius: "outer", first: "v", dx: 0, dy: 100, dr: 20 },
    };

    const pickRadius = (c: ConnectorConf) => {
        if (c.radius === "inner") return rInner;
        if (c.radius === "thickness") return (rOuter + rInner) / 2;
        return rOuter;
    };

    function anchorPoint(seg: { start: number; end: number }, q: QuarterId) {
        const c = cfg[q];
        const R = pickRadius(c);
        let deg: number;
        if (c.anchor === "angle") {
            deg = c.angle ?? 0;
        } else {
            const base =
                c.anchor === "start" ? seg.start : c.anchor === "end" ? seg.end : (seg.start + seg.end) / 2;
            deg = base + (c.angleBias ?? 0);
        }
        return polarPoint(cx, cy, R, deg);
    }

    const connector = useMemo(() => {
        const q = activeQ;
        const seg = segments[quarterToSeg[q]];
        if (!seg) return null;

        const c = cfg[q];
        const p0 = anchorPoint(seg, q);
        const len = Math.hypot(p0.x - cx, p0.y - cy);
        const ux = (p0.x - cx) / len;
        const uy = (p0.y - cy) / len;
        const p1 = { x: p0.x + ux * (c.dr ?? 12), y: p0.y + uy * (c.dr ?? 12) };

        const p2 = c.first === "h" ? { x: p1.x + c.dx, y: p1.y } : { x: p1.x, y: p1.y + c.dy };
        const p3 = c.first === "h" ? { x: p2.x, y: p2.y + c.dy } : { x: p2.x + c.dx, y: p2.y };

        const path = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`;

        // responsive label box
        const LABEL_W = Math.min(300, SIZE * 0.84);
        const LABEL_H = Math.max(110, SIZE * 0.34);

        const INNER_PAD = 12; // inner padding
        const V_GAP = 6;      // vertical gap from line
        const isRightSide = q === 3 || q === 4;

        // align inner edge of the label to p3.x
        let x = isRightSide ? p3.x - (LABEL_W - INNER_PAD) : p3.x - INNER_PAD;
        let y = p3.y + V_GAP;

        // clamp into viewBox
        const xmin = -PAD_L,
            xmax = SIZE + PAD_R - LABEL_W,
            ymin = -PAD_T,
            ymax = SIZE + PAD_B - LABEL_H;
        x = Math.max(xmin, Math.min(xmax, x));
        y = Math.max(ymin, Math.min(ymax, y));

        const textAlign: "left" | "right" = isRightSide ? "right" : "left";
        return { path, x, y, w: LABEL_W, h: LABEL_H, textAlign, INNER_PAD };
    }, [activeQ, segments, cx, cy]);

    return (
        <svg viewBox={viewBox} className="mx-auto block w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* ring segments */}
            {segments.map(({ i, start, end }) => {
                const q = segToQuarter[i];
                const d = ringSegmentPath(cx, cy, rOuter, rInner, start, end);
                const isActive = q === activeQ;

                return (
                    <path
                        key={i}
                        d={d}
                        fill={isActive ? "#D1D5DB" : "#E5E7EB"}
                        style={{ cursor: "pointer" }}
                        onClick={() => onQuarterClick?.(q)}
                    />
                );
            })}

            {/* connector + label */}
            {connector && (
                <>
                    <path
                        d={connector.path}
                        fill="none"
                        stroke="#111111"
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <foreignObject
                        x={connector.x}
                        y={connector.y - 2}
                        width={connector.w}
                        height={connector.h + 100}
                    >
                        <div
                            style={{
                                fontFamily: "inherit",
                                padding: `0 ${connector.INNER_PAD}px 8px ${connector.INNER_PAD}px`,
                                whiteSpace: "normal",
                                overflowWrap: "anywhere",
                                wordBreak: "break-word",
                                maxWidth: "100%",
                                textAlign: connector.textAlign, // right for Q3/Q4, left for Q1/Q2
                            }}
                        >
                            <p style={{ margin: 0, fontWeight: 800, fontSize: "clamp(14px, 4vw, 18px)" }}>
                                Q{activeQ}
                            </p>
                            <div
                                style={{
                                    fontWeight: 800,
                                    lineHeight: 1.25,
                                    marginTop: 4,
                                    fontSize: "clamp(14px, 4vw, 18px)",
                                }}
                            >
                                {quarters[activeQ].title}
                            </div>
                            <div
                                style={{
                                    marginTop: 8,
                                    color: "#525252",
                                    lineHeight: 1.5,
                                    fontSize: "clamp(12px, 3.4vw, 15px)",
                                }}
                            >
                                {quarters[activeQ].blurb}
                            </div>
                        </div>
                    </foreignObject>
                </>
            )}
        </svg>
    );
}

export default function MobileRoadmap({
    activeQ,
    setActiveQ,
    quarters,
}: {
    activeQ: QuarterId;
    setActiveQ: (q: QuarterId) => void;
    quarters: QuarterMap;
}) {
    return (
        <div className="w-full">
            <SegmentedWheel activeQ={activeQ} onQuarterClick={setActiveQ} quarters={quarters} />
        </div>
    );
}
