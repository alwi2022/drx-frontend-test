// src/components/roadmap/DesktopRoadmap.tsx
import React, { useMemo } from "react";
import { ConnectorConfig, QuarterId, QuarterMap, TextAlign } from "../../types/type";
import { polarPoint, ringSegmentPath } from "../../helpers/helper";

function SegmentedWheelDesktop({
    activeQ,
    onQuarterClick,
    quarters,
    className = "w-full",
}: {
    activeQ: QuarterId;
    onQuarterClick?: (q: QuarterId) => void;
    quarters: QuarterMap;
    className?: string;
}) {
    // base geometry
    const OUTER = 420;
    const THICKNESS = Math.round(OUTER * 0.3);
    const STROKE = Math.max(16, Math.round(OUTER * 0.055));
    const size = OUTER * 2;

    // viewBox paddings (relatif)
    const PAD_T = Math.round(OUTER * 0.28);
    const PAD_B = Math.round(OUTER * 0.85);
    const PAD_L = Math.round(OUTER * 1.05);
    const PAD_R = Math.round(OUTER * 1.05);

    const viewBox = `${-PAD_L} ${-PAD_T} ${size + PAD_L + PAD_R} ${size + PAD_T + PAD_B}`;

    // center & radii
    const cx = size / 2;
    const cy = size / 4.5 + 8;
    const rOuter = OUTER;
    const rInner = OUTER - THICKNESS;

    // segments (4 petals, 260° total)
    const SEG_COUNT = 4;
    const TOTAL_SPAN = 260;
    const START_BASE = 90 - TOTAL_SPAN / 2;
    const GAP = 8;
    const SEG_SPAN = (TOTAL_SPAN - GAP * (SEG_COUNT - 1)) / SEG_COUNT;

    const segments = useMemo(() => {
        return Array.from({ length: SEG_COUNT }).map((_, i) => {
            const start = START_BASE + i * (SEG_SPAN + GAP);
            const end = start + SEG_SPAN;
            return { i, start, end, mid: (start + end) / 2 };
        });
    }, []);

    // urutan quarter pada layar (kiri-atas → kiri-bawah → kanan-bawah → kanan-atas)
    const segToQuarter: QuarterId[] = [4, 3, 2, 1];
    const quarterToSeg: Record<QuarterId, number> = useMemo(() => {
        return segToQuarter.reduce((acc, q, idx) => {
            acc[q] = idx;
            return acc;
        }, {} as Record<QuarterId, number>);
    }, []);

    // garis penghubung
    const connectorConfig: Record<QuarterId, ConnectorConfig> = {
        1: { first: "h", dx: -30, dy: 300, dr: 0 },
        2: { first: "v", dx: 0, dy: 300, dr: 30 },
        3: { first: "v", dx: 0, dy: 300, dr: 30 },
        4: { first: "h", dx: 30, dy: 300, dr: 0 },
    };

    const connectors = useMemo(() => {
        const LABEL_W = Math.min(360, Math.round(OUTER * 0.82));
        const LABEL_H = Math.max(110, Math.round(OUTER * 0.32));
        const LABEL_GAP = Math.round(OUTER * 0.03);

        return segToQuarter.map((q) => {
            const seg = segments[quarterToSeg[q]];
            const conf = connectorConfig[q];

            // P0: anchor di tengah segmen luar, dorong menjadi P1
            const P0 = polarPoint(cx, cy, rOuter, seg.mid);
            const len = Math.hypot(P0.x - cx, P0.y - cy);
            const ux = (P0.x - cx) / len;
            const uy = (P0.y - cy) / len;
            const P1 = { x: P0.x + ux * conf.dr, y: P0.y + uy * conf.dr };

            // tekuk garis
            const P2 = conf.first === "h" ? { x: P1.x + conf.dx, y: P1.y } : { x: P1.x, y: P1.y + conf.dy };
            const P3 = conf.first === "h" ? { x: P2.x, y: P2.y + conf.dy } : { x: P2.x + conf.dx, y: P2.y };

            const path = `M ${P0.x} ${P0.y} L ${P1.x} ${P1.y} L ${P2.x} ${P2.y} L ${P3.x} ${P3.y}`;

            // label pos: selalu di sisi luar batang vertikal
            const xVert = conf.first === "h" ? P2.x : P1.x;
            const midY = conf.first === "h" ? (P2.y + P3.y) / 2 : (P1.y + P2.y) / 2;
            const isLeft = xVert < cx;

            let x = isLeft ? xVert - LABEL_W - LABEL_GAP : xVert + LABEL_GAP;
            let y = midY - LABEL_H / 2;
            const textAlign: TextAlign = isLeft ? "right" : "left";

            // clamp agar aman di viewBox
            const xmin = -PAD_L;
            const xmax = size + PAD_R - LABEL_W;
            const ymin = -PAD_T;
            const ymax = size + PAD_B - LABEL_H;
            x = Math.max(xmin, Math.min(xmax, x));
            y = Math.max(ymin, Math.min(ymax, y));

            return { q, path, x, y, w: LABEL_W, h: LABEL_H, textAlign };
        });
    }, [segments]);

    return (
        <svg viewBox={viewBox} className={`mx-auto block ${className}`} preserveAspectRatio="xMidYMid meet">
            {/* petals */}
            {segments.map(({ i, start, end }) => {
                const d = ringSegmentPath(cx, cy, rOuter, rInner, start, end);
                const q = segToQuarter[i];
                const isActive = q === activeQ;
                return (
                    <path
                        key={i}
                        d={d}
                        fill={isActive ? "#D1D5DB" : "#E5E7EB"}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        style={{ cursor: "pointer" }}
                        onClick={() => onQuarterClick?.(q)}
                    />
                );
            })}

            {/* connectors + labels */}
            {connectors.map(({ q, path, x, y, w, h, textAlign }) => (
                <g key={`c-${q}`}>
                    <path d={path} fill="none" stroke="#111111" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
                    <foreignObject x={x} y={y - 60} width={w} height={h + 40}>
                        <div style={{ fontFamily: "inherit", textAlign }}>
                            <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>Q{q}</p>
                            <div style={{ fontWeight: 800, lineHeight: 1.2, marginTop: 2, fontSize: 20, marginBottom: 10 }}>
                                {quarters[q].title}
                            </div>
                            <div style={{ marginTop: 8, fontSize: 17, color: "#525252", lineHeight: 1.5 }}>
                                {quarters[q].blurb}
                            </div>
                        </div>
                    </foreignObject>
                </g>
            ))}
        </svg>
    );
}


export default function DesktopRoadmap({
    activeQ,
    setActiveQ,
    quarters,
}: {
    activeQ: QuarterId;
    setActiveQ: (q: QuarterId) => void;
    quarters: QuarterMap;
}) {
    return (
        <div className="mx-auto px-8 py-14 w-[84vw] max-w-[1000px]">
            <div className="-mt-40">
                <SegmentedWheelDesktop
                    activeQ={activeQ}
                    onQuarterClick={setActiveQ}
                    quarters={quarters}
                    className="w-full"
                />
            </div>
        </div>
    );
}
