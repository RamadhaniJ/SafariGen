// ── PdfShared.jsx ──
import React from "react";

export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function GrainOverlay({ opacity = 0.05, blend = "multiply" }) {
  // Temporarily disabled for print performance
  return null;
}

/* ── Compass rose watermark ── */
export function CompassRose({
  className = "absolute -bottom-28 -right-28 h-[440px] w-[440px] opacity-[0.10]",
  stroke = "#B98B3E",
}) {
  return (
    <svg viewBox="0 0 400 400" className={`z-[1] ${className}`} aria-hidden="true">
      {[190, 152, 112, 62].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} fill="none" stroke={stroke} strokeWidth="0.7" />
      ))}
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1="200"
          y1="10"
          x2="200"
          y2={i % 6 === 0 ? "26" : "18"}
          stroke={stroke}
          strokeWidth="0.7"
          transform={`rotate(${i * 5} 200 200)`}
        />
      ))}
      <path
        d="M200 18 L216 184 L382 200 L216 216 L200 382 L184 216 L18 200 L184 184 Z"
        fill={stroke}
        opacity="0.45"
      />
      <circle cx="200" cy="200" r="3.5" fill={stroke} opacity="0.8" />
    </svg>
  );
}

/* ── Ornament divider ── */
export function Ornament({ className = "", tone = "gold" }) {
  const color = tone === "gold" ? "#B98B3E" : "#F8F4EA";
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span
        className="h-px w-12"
        style={{ background: `linear-gradient(to right, transparent, ${color}88)` }}
      />
      <span className="h-1 w-1 rotate-45" style={{ background: `${color}B3` }} />
      <span
        className="h-1.5 w-1.5 rotate-45 border"
        style={{ borderColor: `${color}D9` }}
      />
      <span className="h-1 w-1 rotate-45" style={{ background: `${color}B3` }} />
      <span
        className="h-px w-12"
        style={{ background: `linear-gradient(to left, transparent, ${color}88)` }}
      />
    </div>
  );
}

/* ── Vertical editorial rails (themeable) ── */
export function PageRails({
  leftLabel = "",
  rightTop = "Reference",
  rightValue = "",
  theme = "dark", // "dark" = hero (gold on dark), "cream" = day pages (gold on cream)
}) {
  const isDark = theme === "dark";
  const gold = "#B98B3E";
  const labelColor = isDark ? "rgba(185,139,62,0.75)" : "rgba(138,101,40,0.75)";
  const faintColor = isDark ? "rgba(248,244,234,0.40)" : "rgba(138,101,40,0.55)";
  const chipBg = isDark ? "rgba(11,20,16,0.70)" : "transparent";
  const chipText = "#8A6528";
  const chipBorder = isDark ? "rgba(185,139,62,0.55)" : "rgba(185,139,62,0.85)";

  return (
    <>
      {/* LEFT rail */}
      {leftLabel && (
        <div className="absolute left-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-4">
          <span
            className="h-12 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${gold}99)`,
            }}
          />
          <span
            className="rotate-180 text-[8.5px] uppercase tracking-[0.55em] [writing-mode:vertical-rl]"
            style={{ color: labelColor }}
          >
            {leftLabel}
          </span>
          <span
            className="h-12 w-px"
            style={{ background: `linear-gradient(to top, transparent, ${gold}99)` }}
          />
        </div>
      )}

      {/* RIGHT rail */}
      {rightValue && (
        <div className="absolute right-[4mm] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
          <span
            className="h-10 w-px"
            style={{ background: `linear-gradient(to bottom, transparent, ${gold}99)` }}
          />
          <span
            className="text-[8px] uppercase tracking-[0.42em] [writing-mode:vertical-rl]"
            style={{ color: faintColor }}
          >
            {rightTop}
          </span>
          <span
            className="border px-1.5 py-2.5 text-[9px] font-bold tracking-[0.32em] backdrop-blur-sm [writing-mode:vertical-rl]"
            style={{
              color: chipText,
              background: chipBg,
              borderColor: chipBorder,
              boxShadow: isDark
                ? "0 0 12px -4px rgba(185,139,62,0.55)"
                : "0 0 10px -6px rgba(138,101,40,0.35)",
            }}
          >
            {rightValue}
          </span>
          <span
            className="h-10 w-px"
            style={{ background: `linear-gradient(to top, transparent, ${gold}99)` }}
          />
        </div>
      )}
    </>
  );
}