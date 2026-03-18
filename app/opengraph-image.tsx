import { ImageResponse } from "next/og";
export const alt = "フェイスラン - 顔で操作するランニングゲーム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white" }}>
      <div style={{ fontSize: 80 }}>😲</div>
      <div style={{ fontSize: 48, fontWeight: "bold", marginTop: 20 }}>フェイスラン</div>
      <div style={{ fontSize: 24, opacity: 0.7, marginTop: 10 }}>カメラで顔認識！表情で操作するランニングゲーム</div>
    </div>
  );
}
