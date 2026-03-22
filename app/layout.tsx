import type { Metadata } from "next";
import Script from 'next/script';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://face-run.vercel.app"),
  title: "フェイスラン - 顔で操作するゲーム",
  description:
    "口を開けてジャンプ！眉を上げて二段ジャンプ！頭を傾けて左右移動！顔の動きだけで遊べるユニークなエンドレスランナー",
  icons: { icon: "/favicon.ico" },
  openGraph: {
    title: "フェイスラン - 顔で操作するゲーム",
    description:
      "カメラで顔認識！口・眉・頭の動きで操作する新感覚ゲーム",
    type: "website",
    siteName: "フェイスラン",
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
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
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return (
    <html lang="ja">
      <body className="min-h-screen bg-[#0f0c29] text-[#f3f4f6]">
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {children}
      </body>
    </html>
  );
}
