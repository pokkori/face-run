"use client";
import React from "react";

// 宇宙テーマ: 紫・ピンク・青の8オーブ
const orbs = [
  { size: 350, left: 8,  top: 5,  color: "rgba(147,51,234,0.14)",  duration: 9,  delay: 0,   blur: 90  },
  { size: 260, left: 78, top: 8,  color: "rgba(236,72,153,0.10)",  duration: 12, delay: 1.5, blur: 75  },
  { size: 300, left: 42, top: 58, color: "rgba(59,130,246,0.12)",  duration: 8,  delay: 0.8, blur: 88  },
  { size: 210, left: 87, top: 58, color: "rgba(147,51,234,0.10)",  duration: 7,  delay: 2.2, blur: 65  },
  { size: 370, left: 5,  top: 72, color: "rgba(236,72,153,0.07)",  duration: 13, delay: 0.3, blur: 100 },
  { size: 185, left: 55, top: 22, color: "rgba(59,130,246,0.09)",  duration: 6,  delay: 1.0, blur: 65  },
  { size: 275, left: 28, top: 42, color: "rgba(147,51,234,0.08)",  duration: 10, delay: 3.0, blur: 82  },
  { size: 230, left: 66, top: 82, color: "rgba(236,72,153,0.10)",  duration: 8,  delay: 0.6, blur: 75  },
];

const OrbBackground = React.memo(function OrbBackground() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes cosmicOrbFloat {
          0%   { transform: translate(0, 0) scale(1);       opacity: 0.5; }
          20%  { transform: translate(14px, -22px) scale(1.06); opacity: 0.85; }
          50%  { transform: translate(-10px, -38px) scale(0.95); opacity: 0.65; }
          75%  { transform: translate(20px, -14px) scale(1.04); opacity: 0.80; }
          100% { transform: translate(0, 0) scale(1);       opacity: 0.5; }
        }
      `}</style>
      {orbs.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${orb.left}%`,
            top: `${orb.top}%`,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
            animation: `cosmicOrbFloat ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
            willChange: "transform, opacity",
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
});

export default OrbBackground;
