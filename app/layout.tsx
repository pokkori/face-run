import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from 'next/script';
import { A2HSBanner } from '../components/A2HSBanner';
import "./globals.css";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"], display: "swap" });

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
  other: { "theme-color": "#0f0c29" },
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


const _faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "このゲームは無料で遊べますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、基本プレイは完全無料でお楽しみいただけます。ブラウザから即座にプレイ開始できます。"
      }
    },
    {
      "@type": "Question",
      "name": "スマートフォンでも遊べますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "はい、スマートフォン・タブレット・PCすべてに対応しています。ブラウザからそのままプレイできます。"
      }
    },
    {
      "@type": "Question",
      "name": "アプリのダウンロードは必要ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ダウンロード不要です。ブラウザを開いてアクセスするだけですぐに遊べます。"
      }
    }
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(_faqLd) }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body className={`${notoSansJP.className} min-h-screen bg-[#0f0c29] text-slate-100 antialiased`}>
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
