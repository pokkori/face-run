import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#0f0c29] text-[#f3f4f6] px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#f59e0b] mb-8">特定商取引法に基づく表示</h1>
      <table className="w-full text-sm border-collapse">
        <tbody>
          {[
            ['屋号', 'ポッコリラボ'],
            ['運営責任者', 'ポッコリラボ 代表 新美'],
            ['住所', '〒475-0077 愛知県半田市元山町'],
            ['電話番号', '090-6093-5290'],
            ['問い合わせ', 'X(Twitter) @levona_design へのDDM'],
            ['サービス内容', 'フェイスラン — 顔認識を使ったアプリゲーム'],
            ['販売価格', '無料'],
            ['返品・返金', 'デジタルコンテンツの性質上、返品・返金は対応しておりません'],
          ].map(([label, value]) => (
            <tr key={label} className="border-b border-white/10">
              <th className="text-left py-3 pr-4 text-gray-400 font-normal w-1/3">{label}</th>
              <td className="py-3 text-white">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8">
        <Link href="/" className="text-[#f59e0b] hover:underline text-sm">← ホームに戻る</Link>
      </div>
    </div>
  );
}