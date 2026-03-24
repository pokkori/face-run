import type { Metadata } from "next";
import Script from 'next/script';
import { A2HSBanner } from '../components/A2HSBanner';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://face-run.vercel.app"),
  manifest: "/manifest.json",
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

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  "name": "フェイスラン",
  "url": "https://face-run.vercel.app",
  "description": "顔の動きでキャラクターを操作するWebゲーム。口を開けてジャンプ、眉を上げて二段ジャンプ、頭を傾けてレーン移動。",
  "genre": ["Action", "Endless Runner"],
  "applicationCategory": "Game",
  "operatingSystem": "Web",
  "inLanguage": "ja",
  "author": {
    "@type": "Organization",
    "name": "ポッコリラボ"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
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
        <A2HSBanner />
      </body>
    </html>
  );
}
