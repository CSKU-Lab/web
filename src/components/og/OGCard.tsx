const ACCENT = "#6366f1";

const PIXEL_SIZE = 8;
const PIXEL_GAP = 2;
const TILE_GAP = 4;

// Concentric ring — the "loop" pattern
const LOOP: number[][] = [
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
];

// Opacity map for 3×3 tile cluster — higher toward corner
const TOP_RIGHT_OPS = [
  [0.2, 0.35, 0.55],
  [0.1, 0.2, 0.35],
  [0.04, 0.1, 0.2],
];
const BOTTOM_LEFT_OPS = [
  [0.2, 0.1, 0.04],
  [0.35, 0.2, 0.1],
  [0.55, 0.35, 0.2],
];

function PixelTile({ opacity }: { opacity: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: PIXEL_GAP, opacity }}>
      {LOOP.map((row, i) => (
        <div key={i} style={{ display: "flex", gap: PIXEL_GAP }}>
          {row.map((cell, j) => (
            <div
              key={j}
              style={{
                width: PIXEL_SIZE,
                height: PIXEL_SIZE,
                backgroundColor: cell ? ACCENT : "transparent",
                borderRadius: 1,
                display: "flex",
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PixelCluster({ ops }: { ops: number[][] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: TILE_GAP }}>
      {ops.map((row, r) => (
        <div key={r} style={{ display: "flex", gap: TILE_GAP }}>
          {row.map((op, c) => (
            <PixelTile key={c} opacity={op} />
          ))}
        </div>
      ))}
    </div>
  );
}

interface OGCardProps {
  title: string;
  subtitle?: string;
  tag?: string;
}

export function OGCard({ title, subtitle, tag }: OGCardProps) {
  const titleSize = title.length > 50 ? 52 : title.length > 30 ? 64 : 76;

  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: "#0d0d0d",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        fontFamily: "Boon",
      }}
    >
      {/* Top-right pixel cluster */}
      <div style={{ position: "absolute", top: -10, right: -10, display: "flex" }}>
        <PixelCluster ops={TOP_RIGHT_OPS} />
      </div>

      {/* Bottom-left pixel cluster */}
      <div style={{ position: "absolute", bottom: -10, left: -10, display: "flex" }}>
        <PixelCluster ops={BOTTOM_LEFT_OPS} />
      </div>

      {/* Subtle accent line on left */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 120,
          bottom: 120,
          width: 3,
          backgroundColor: ACCENT,
          borderRadius: 2,
          opacity: 0.8,
          display: "flex",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "56px 80px 52px 88px",
          justifyContent: "space-between",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                backgroundColor: ACCENT,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <span
              style={{
                color: "#ffffff",
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.3px",
                display: "flex",
              }}
            >
              CS Lab
            </span>
          </div>
          {tag && (
            <div
              style={{
                display: "flex",
                backgroundColor: "#18182a",
                border: "1px solid #2d2d5e",
                borderRadius: 8,
                padding: "6px 18px",
                color: ACCENT,
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "0.3px",
              }}
            >
              {tag}
            </div>
          )}
        </div>

        {/* Main text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              color: "#f4f4f5",
              fontSize: titleSize,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-1.5px",
              maxWidth: 920,
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                color: "#71717a",
                fontSize: 26,
                fontWeight: 400,
                letterSpacing: "-0.3px",
                maxWidth: 680,
                display: "flex",
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#3f3f46", fontSize: 17, fontWeight: 400, display: "flex" }}>
            Computer Science · Kasetsart University
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 6,
                height: 6,
                backgroundColor: ACCENT,
                borderRadius: 2,
                display: "flex",
                opacity: 0.7,
              }}
            />
            <span style={{ color: "#3f3f46", fontSize: 15, display: "flex" }}>lab.cs.sci.ku.ac.th</span>
          </div>
        </div>
      </div>
    </div>
  );
}
