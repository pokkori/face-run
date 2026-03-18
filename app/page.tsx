import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#0f0c29] flex flex-col items-center justify-center px-4">
      {/* ヒーローセクション */}
      <div className="text-center mb-12">
        <div className="text-8xl mb-6 animate-[float_3s_ease-in-out_infinite]">🥷</div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
          <span className="text-[#f59e0b]">顔だけ</span>で操作する
          <br />
          エンドレスランナー
        </h1>
        <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
          カメラがあれば顔の動きだけで操作できる、全く新しいゲーム体験。
          カメラなしでもキーボード・タップで遊べます。
        </p>
        <Link
          href="/game"
          className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold text-xl px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-[#f59e0b]/30"
        >
          🎮 遊んでみる
        </Link>
      </div>

      {/* 操作方法 */}
      <div className="w-full max-w-lg mb-12">
        <h2 className="text-2xl font-bold text-center text-[#f59e0b] mb-6">操作方法</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* カメラ操作 */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-sm font-semibold text-[#f59e0b] mb-3 uppercase tracking-wider">
              📷 カメラモード（顔認識）
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="text-4xl w-12 text-center">😮</div>
                <div>
                  <div className="font-semibold text-white">口を開ける</div>
                  <div className="text-sm text-gray-400">ジャンプ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl w-12 text-center">🙆</div>
                <div>
                  <div className="font-semibold text-white">眉を大きく上げる</div>
                  <div className="text-sm text-gray-400">二段ジャンプ（空中で追加ジャンプ）</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-4xl w-12 text-center">🤸</div>
                <div>
                  <div className="font-semibold text-white">頭を左右に傾ける</div>
                  <div className="text-sm text-gray-400">レーン移動（左右）</div>
                </div>
              </div>
            </div>
          </div>

          {/* キーボード操作 */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              ⌨️ キーボード / タップモード
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">スペースキー / タップ</span>
                <span className="text-white font-semibold">ジャンプ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">スペース × 2連打 / ダブルタップ</span>
                <span className="text-white font-semibold">二段ジャンプ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">← → 矢印キー / 左右スワイプ</span>
                <span className="text-white font-semibold">レーン移動</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 特徴 */}
      <div className="w-full max-w-lg mb-12">
        <h2 className="text-2xl font-bold text-center text-[#f59e0b] mb-6">特徴</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "🎯", title: "簡単操作", desc: "顔の動きだけ" },
            { icon: "🏃", title: "エンドレス", desc: "どこまでも続く" },
            { icon: "📱", title: "スマホ対応", desc: "タッチ操作OK" },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/5 rounded-xl p-4 text-center border border-white/10"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-semibold text-white text-sm">{f.title}</div>
              <div className="text-xs text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/game"
        className="inline-block bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold text-xl px-10 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-lg shadow-[#f59e0b]/30 mb-12"
      >
        🥷 今すぐ遊ぶ
      </Link>

      {/* フッター */}
      <footer className="text-center text-gray-500 text-sm pb-8">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/legal" className="hover:text-gray-300">
            特定商取引法
          </Link>
          <Link href="/privacy" className="hover:text-gray-300">
            プライバシーポリシー
          </Link>
        </div>
        <div>© 2026 ポッコリラボ</div>
      </footer>
    </main>
  );
}
