import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0f0c29] text-[#f3f4f6] px-4 py-12 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#f59e0b] mb-8">プライバシーポリシー</h1>
      <div className="space-y-6 text-sm text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">収集する情報</h2>
          <p>本アプリは、カメラからの映像をリアルタイムで処理しますが、映像データはサーバーへ送信・保存されません。スコアはお使いの端末の localStorage にのみ保存されます。</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white mb-2">カメラの使用</h2>
          <p>顔認識機能はブラウザー上でのみ処理されます。カメラの許可を与えない場合でも、キーボード・タッチ操作でゲームを楽しむことができます。</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white mb-2">データの共有</h2>
          <p>第三者への個人情報の提供はいたしません。</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-white mb-2">お問い合わせ</h2>
          <p>X(Twitter) @levona_design へのDDMにてお問い合わせください。</p>
        </section>
        <p className="text-gray-500 text-xs">ポッコリラボ © 2026</p>
      </div>
      <div className="mt-8">
        <Link href="/" className="text-[#f59e0b] hover:underline text-sm">← ホームに戻る</Link>
      </div>
    </div>
  );
}