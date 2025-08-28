

export type QuarterId = 1 | 2 | 3 | 4;
export type QuarterInfo = { title: string; blurb: string };
export type QuarterMap = Record<QuarterId, QuarterInfo>;

export type TextAlign = "left" | "center" | "right";
export type ConnectorConfig = {
    first: "h" | "v"; // belok dulu horizontal / vertical
    dx: number;       // langkah horizontal
    dy: number;       // langkah vertical
    dr: number;       // dorong keluar dari ring
  };
  

  export type AnchorMode = "start" | "mid" | "end" | "angle";
  export type RadiusMode = "outer" | "inner" | "thickness";
  export type TurnFirst = "h" | "v";
  
  export type ConnectorConf = {
    anchor: AnchorMode;
    angle?: number;      // only used when anchor="angle"
    angleBias?: number;  // small +/- offset
    radius?: RadiusMode;
    first: TurnFirst;    // first turn: horizontal/vertical
    dx: number;          // horizontal length
    dy: number;          // vertical length
    dr?: number;         // push outward from ring
  };
  