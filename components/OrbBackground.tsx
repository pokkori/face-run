"use client";

import { memo } from "react";

export type OrbTheme =
  | "legal"
  | "life"
  | "business"
  | "betting"
  | "game"
  | "kanji"
  | "green"
  | "purple"
  | "blue"
  | "finance";

const THEME_ORBS: Record<OrbTheme, string[]> = {
  legal: [
    "rgba(59,130,246,0.18)", "rgba(99,102,241,0.14)",
    "rgba(37,99,235,0.16)",  "rgba(139,92,246,0.15)",
    "rgba(59,130,246,0.10)", "rgba(99,102,241,0.12)",
    "rgba(139,92,246,0.13)", "rgba(37,99,235,0.11)",
  ],
  life: [
    "rgba(16,185,129,0.18)", "rgba(52,211,153,0.14)",
    "rgba(5,150,105,0.16)",  "rgba(99,179,237,0.15)",
    "rgba(16,185,129,0.10)", "rgba(52,211,153,0.12)",
    "rgba(99,179,237,0.13)", "rgba(5,150,105,0.11)",
  ],
  business: [
    "rgba(245,158,11,0.18)", "rgba(251,191,36,0.14)",
    "rgba(217,119,6,0.16)",  "rgba(99,102,241,0.15)",
    "rgba(245,158,11,0.10)", "rgba(251,191,36,0.12)",
    "rgba(99,102,241,0.13)", "rgba(217,119,6,0.11)",
  ],
  betting: [
    "rgba(220,38,38,0.18)",  "rgba(251,191,36,0.14)",
    "rgba(185,28,28,0.16)",  "rgba(234,179,8,0.15)",
    "rgba(220,38,38,0.10)",  "rgba(251,191,36,0.12)",
    "rgba(185,28,28,0.13)",  "rgba(234,179,8,0.11)",
  ],
  game: [
    "rgba(168,85,247,0.20)", "rgba(236,72,153,0.16)",
    "rgba(99,102,241,0.18)", "rgba(245,158,11,0.15)",
    "rgba(168,85,247,0.12)", "rgba(236,72,153,0.10)",
    "rgba(99,102,241,0.14)", "rgba(245,158,11,0.11)",
  ],
  kanji: [
    "rgba(220,38,38,0.18)",  "rgba(217,119,6,0.14)",
    "rgba(194,65,12,0.16)",  "rgba(124,58,237,0.15)",
    "rgba(220,38,38,0.10)",  "rgba(217,119,6,0.12)",
    "rgba(124,58,237,0.13)", "rgba(194,65,12,0.11)",
  ],
  green: [
    "rgba(16,185,129,0.20)", "rgba(52,211,153,0.16)",
    "rgba(5,150,105,0.18)",  "rgba(16,185,129,0.14)",
    "rgba(52,211,153,0.10)", "rgba(5,150,105,0.12)",
    "rgba(16,185,129,0.08)", "rgba(52,211,153,0.09)",
  ],
  purple: [
    "rgba(139,92,246,0.20)", "rgba(168,85,247,0.16)",
    "rgba(124,58,237,0.18)", "rgba(139,92,246,0.14)",
    "rgba(168,85,247,0.10)", "rgba(124,58,237,0.12)",
    "rgba(139,92,246,0.08)", "rgba(168,85,247,0.09)",
  ],
  blue: [
    "rgba(59,130,246,0.20)", "rgba(99,102,241,0.16)",
    "rgba(37,99,235,0.18)",  "rgba(59,130,246,0.14)",
    "rgba(99,102,241,0.10)", "rgba(37,99,235,0.12)",
    "rgba(59,130,246,0.08)", "rgba(99,102,241,0.09)",
  ],
  finance: [
    "rgba(16,185,129,0.20)", "rgba(245,158,11,0.16)",
    "rgba(14,165,233,0.18)", "rgba(16,185,129,0.14)",
    "rgba(245,158,11,0.10)", "rgba(14,165,233,0.12)",
    "rgba(16,185,129,0.08)", "rgba(245,158,11,0.09)",
  ],
};

const ORB_POSITIONS = [
  { size: 340, left: 8,  top: 5,  duration: 9,  delay: 0,   blur: 90  },
  { size: 260, left: 78, top: 12, duration: 12, delay: 1.5, blur: 80  },
  { size: 300, left: 42, top: 60, duration: 10, delay: 0.8, blur: 95  },
  { size: 210, left: 88, top: 55, duration: 7,  delay: 2.2, blur: 65  },
  { size: 380, left: 5,  top: 72, duration: 13, delay: 0.3, blur: 105 },
  { size: 190, left: 58, top: 18, duration: 6,  delay: 1.0, blur: 70  },
  { size: 270, left: 28, top: 38, duration: 11, delay: 3.0, blur: 88  },
  { size: 230, left: 68, top: 82, duration: 8,  delay: 0.6, blur: 78  },
];

const BG_BASE: Record<OrbTheme, string> = {
  legal:    "linear-gradient(135deg, #0B0F1E 0%, #0d1220 40%, #0a1030 100%)",
  life:     "linear-gradient(135deg, #0A1A14 0%, #0d1a12 40%, #0a1424 100%)",
  business: "linear-gradient(135deg, #0F0E0A 0%, #14120a 40%, #0e0d18 100%)",
  betting:  "linear-gradient(135deg, #0F0A1E 0%, #1a0a1e 40%, #0d0a1a 100%)",
  game:     "linear-gradient(135deg, #0A0A1E 0%, #120a1e 40%, #0a0d1e 100%)",
  kanji:    "linear-gradient(135deg, #0f0a1e 0%, #1a0a2e 40%, #0d1a2e 100%)",
  green:    "linear-gradient(135deg, #061A10 0%, #0a1a10 40%, #061410 100%)",
  purple:   "linear-gradient(135deg, #0f0a1e 0%, #180a2e 40%, #0d0a1e 100%)",
  blue:     "linear-gradient(135deg, #060b1e 0%, #0a0f20 40%, #060a1c 100%)",
  finance:  "linear-gradient(135deg, #061A10 0%, #0a160c 40%, #061018 100%)",
};

interface OrbBackgroundProps {
  theme?: OrbTheme;
}

const OrbBackground = memo(function OrbBackground({ theme = "legal" }: OrbBackgroundProps) {
  const orbs = THEME_ORBS[theme];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        background: BG_BASE[theme],
      }}
      aria-hidden="true"
    >
      {ORB_POSITIONS.map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${pos.left}%`,
            top: `${pos.top}%`,
            width: pos.size,
            height: pos.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orbs[i]} 0%, transparent 70%)`,
            filter: `blur(${pos.blur}px)`,
            animation: `orbFloat ${pos.duration}s ease-in-out ${pos.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
