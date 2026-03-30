import Link from "next/link";
import { DailyButton } from "../components/DailyButton";

// インラインSVG忍者キャラ
function NinjaSvg() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width={64} height={64}>
      <rect x="0" y="0" width="40" height="40" fill="#1a1a1a" rx="4"/>
      <ellipse cx="20" cy="14" rx="10" ry="10" fill="#1a1a1a"/>
      <rect x="4" y="10" width="32" height="8" fill="#CC0000" rx="2"/>
      <ellipse cx="16" cy="14" rx="3" ry="3" fill="white"/>
      <ellipse cx="24" cy="14" rx="3" ry="3" fill="white"/>
      <ellipse cx="16" cy="14" rx="1.5" ry="1.5" fill="#333"/>
      <ellipse cx="24" cy="14" rx="1.5" ry="1.5" fill="#333"/>
      <rect x="8" y="24" width="24" height="16" fill="#1a1a1a" rx="2"/>
    </svg>
  );
}

/* --- Floating particles --- */
function FloatingParticles() {
  return (
    <>
      <style>{`
        @keyframes cosmicFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-50px) scale(1.5); opacity: 0.7; }
          100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
        }
      `}</style>
      {[10, 25, 40, 60, 75, 90].map((left, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          left: `${left}%`, bottom: `${5 + i * 8}%`,
          width: 3 + i % 3 * 2, height: 3 + i % 3 * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${['#f59e0b', '#667eea', '#764ba2', '#f59e0b', '#667eea', '#764ba2'][i]}, transparent)`,
          animation: `cosmicFloat ${4 + i}s ease-in-out ${i * 0.6}s infinite`,
          boxShadow: `0 0 8px ${['rgba(245,158,11,0.5)', 'rgba(102,126,234,0.5)', 'rgba(118,75,162,0.5)'][i % 3]}`,
        }} />
      ))}
    </>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 50%, rgba(102,126,234,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(118,75,162,0.1) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(245,158,11,0.08) 0%, transparent 50%), linear-gradient(160deg, #0f0c29, #302b63, #0f0c29)',
      }}>
      <FloatingParticles />
      {/* ヒーローセクション */}
      <div className="text-center mb-12 w-full max-w-lg relative z-10">
        <div className="rounded-3xl p-8 mb-8" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '24px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
          <div className="flex justify-center mb-6 animate-[float_3s_ease-in-out_infinite]">
            <NinjaSvg />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight" style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #FF6B6B 50%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.4))',
          }}>
            顔だけで操作する
            <br />
            エンドレスランナー
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
            カメラがあれば顔の動きだけで操作できる、全く新しいゲーム体験。
            カメラなしでもキーボード・タップで遊べます。
          </p>
          <Link
            href="/game"
            className="inline-block text-[#0f0c29] font-black text-xl px-10 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.95] mb-4 min-h-[56px]"
            aria-label="フェイスランのゲームを今すぐ遊ぶ"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
              boxShadow: '0 0 30px rgba(245,158,11,0.5), 0 6px 20px rgba(0,0,0,0.4)',
            }}
          >
            遊んでみる
          </Link>
          <div className="w-full max-w-xs mx-auto">
            <DailyButton />
          </div>
        </div>
      </div>

      {/* 操作方法 */}
      <div className="w-full max-w-lg mb-12">
        <h2 className="text-2xl font-bold text-center text-[#f59e0b] mb-6">操作方法</h2>
        <div className="grid grid-cols-1 gap-4">
          {/* カメラ操作 */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}>
            <h3 className="text-sm font-semibold text-[#f59e0b] mb-3 uppercase tracking-wider">
              FACE カメラモード（顔認識）
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                {/* 絵文字 -> テキストラベル */}
                <div className="text-sm font-bold text-[#f59e0b] w-12 text-center">OPEN</div>
                <div>
                  <div className="font-semibold text-white">口を開ける</div>
                  <div className="text-sm text-gray-400">ジャンプ</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-[#f59e0b] w-12 text-center">BROW</div>
                <div>
                  <div className="font-semibold text-white">眉を大きく上げる</div>
                  <div className="text-sm text-gray-400">二段ジャンプ（空中で追加ジャンプ）</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-[#f59e0b] w-12 text-center">TILT</div>
                <div>
                  <div className="font-semibold text-white">頭を左右に傾ける</div>
                  <div className="text-sm text-gray-400">レーン移動（左右）</div>
                </div>
              </div>
            </div>
          </div>

          {/* キーボード操作 */}
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }}>
            <h3 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              RUN キーボード / タップモード
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">スペースキー / タップ</span>
                <span className="text-white font-semibold">ジャンプ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">スペース x 2連打 / ダブルタップ</span>
                <span className="text-white font-semibold">二段ジャンプ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">左右矢印キー / 左右スワイプ</span>
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
            { icon: "TAP", title: "簡単操作", desc: "顔の動きだけ" },
            { icon: "RUN", title: "エンドレス", desc: "どこまでも続く" },
            { icon: "SP", title: "スマホ対応", desc: "タッチ操作OK" },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}
            >
              <div className="text-xs font-bold text-[#f59e0b] mb-2">{f.icon}</div>
              <div className="font-semibold text-white text-sm">{f.title}</div>
              <div className="text-xs text-gray-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <Link
        href="/game"
        className="inline-block text-[#0f0c29] font-black text-xl px-10 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-1 active:scale-[0.95] mb-12 min-h-[56px] relative z-10"
        aria-label="フェイスランのゲームを今すぐ遊ぶ"
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)',
          boxShadow: '0 0 30px rgba(245,158,11,0.5), 0 6px 20px rgba(0,0,0,0.4)',
        }}
      >
        今すぐ遊ぶ
      </Link>

      {/* フッター */}
      <footer className="text-center text-gray-500 text-sm pb-8">
        <div className="flex gap-4 justify-center mb-2">
          <Link href="/legal" aria-label="特定商取引法に基づく表示" className="hover:text-gray-300">
            特定商取引法
          </Link>
          <Link href="/privacy" aria-label="プライバシーポリシーを見る" className="hover:text-gray-300">
            プライバシーポリシー
          </Link>
        </div>
        <div>© 2026 ポッコリラボ</div>
      </footer>
    </main>
  );
}
