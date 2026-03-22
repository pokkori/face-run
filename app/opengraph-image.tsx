import { ImageResponse } from "next/og";
export const alt = "フェイスラン - 顔で操作するランニングゲーム";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div style={{
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontFamily: "system-ui, sans-serif",
      position: "relative",
    }}>
      {/* メインタイトル */}
      <div style={{
        fontSize: 80,
        fontWeight: "bold",
        color: "#f59e0b",
        letterSpacing: "-2px",
        marginBottom: 16,
        display: "flex",
      }}>
        フェイスラン
      </div>
      {/* サブタイトル */}
      <div style={{
        fontSize: 32,
        color: "#e5e7eb",
        marginBottom: 24,
        letterSpacing: "1px",
        display: "flex",
      }}>
        FACE RUN
      </div>
      {/* 説明テキスト */}
      <div style={{
        fontSize: 24,
        color: "rgba(255,255,255,0.75)",
        textAlign: "center",
        maxWidth: 700,
        lineHeight: 1.5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <span>カメラで顔認識！表情だけで操作する</span>
        <span>新感覚エンドレスランナー</span>
      </div>
    </div>
  );
}
