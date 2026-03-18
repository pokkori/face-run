import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "フェイスラン - 顔で操作するゲーム",
  description:
    "口を開けてジャンプ！眉を上げて二段ジャンプ！頭を傾けて左右移動！顔の動きだけで遊べるユニークなエンドレスランナー",
  icons: { icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🥷</text></svg>" },
  openGraph: {
    title: "フェイスラン - 顔で操作するゲーム",
    description:
      "カメラで顔認識！口・眉・頭の動きで操作する新感覚ゲーム",
    type: "website",
    siteName: "フェイスラン",
  },
  twitter: {
    card: "summary_large_image",
    title: "フェイスラン - 顔で操作するゲーム",
    description: "カメラで顔認識！口・眉・頭の動きで操作する新感覚ゲーム",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#0f0c29] text-[#f3f4f6]">
        {children}
      </body>
    </html>
  );
}
