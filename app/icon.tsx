import { ImageResponse } from "next/og";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";
export default function Icon() {
  return new ImageResponse(
    <div style={{ fontSize: 10, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a", borderRadius: 4 }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width={28} height={28}>
        <rect x="0" y="0" width="40" height="40" fill="#1a1a1a" rx="4"/>
        <ellipse cx="20" cy="14" rx="10" ry="10" fill="#1a1a1a"/>
        <rect x="4" y="10" width="32" height="8" fill="#CC0000" rx="2"/>
        <ellipse cx="16" cy="14" rx="3" ry="3" fill="white"/>
        <ellipse cx="24" cy="14" rx="3" ry="3" fill="white"/>
        <ellipse cx="16" cy="14" rx="1.5" ry="1.5" fill="#333"/>
        <ellipse cx="24" cy="14" rx="1.5" ry="1.5" fill="#333"/>
        <rect x="8" y="24" width="24" height="16" fill="#1a1a1a" rx="2"/>
      </svg>
    </div>
  );
}
