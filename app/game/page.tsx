"use client";

import { useRef, useState } from 'react';
import Link from 'next/link';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useGameLoop } from '@/hooks/useGameLoop';

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  const { isLoaded: faceLoaded, isLoading: faceLoading, error: faceError, faceInputRef, loadModels } = useFaceDetection(videoRef);
  const { gameState, score, highScore, startGame } = useGameLoop(canvasRef, faceInputRef);

  const enableCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraEnabled(true);
        await loadModels();
      }
    } catch (e) {
      setCameraError('カメラへのアクセスが拒否されました。キーボード/タップで遊べます。');
      console.error(e);
    }
  };

  const handleStart = () => { setShowControls(false); startGame(); };

  const shareScore = score;
  const shareText = encodeURIComponent('フェイスランで ' + shareScore + ' 点取ったよ！顔の動きで操作するゲーム！ #フェイスラン');
  const shareUrl = encodeURIComponent('https://face-run.vercel.app/game');

  return (
    <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-start pt-2 px-2">
      <div className="w-full max-w-sm flex items-center justify-between mb-2">
        <Link href="/" className="text-[#f59e0b] text-sm hover:underline">← ホーム</Link>
        <span className="text-white font-bold">フェイスラン</span>
        <div className="text-xs text-gray-400">Best: <span className="text-[#f59e0b] font-bold">{highScore}</span></div>
      </div>

      <div className="relative" style={{ width: 360, height: 640 }}>
        <canvas ref={canvasRef} width={360} height={640}
          className="rounded-xl border border-white/20 shadow-2xl shadow-purple-900/50"
          style={{ touchAction: "none" }} />

        {cameraEnabled && (
          <div className="absolute bottom-4 right-4 opacity-60 rounded-lg overflow-hidden border border-white/30">
            <video ref={videoRef} width={128} height={96} autoPlay muted playsInline className="scale-x-[-1]" />
            {faceLoading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><span className="text-white text-xs">読込中...</span></div>}
            {faceLoaded && <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
          </div>
        )}
        {!cameraEnabled && <video ref={videoRef} className="hidden" autoPlay muted playsInline />}

        {showControls && gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-xl">
            <div className="text-center px-6">
              <div className="text-6xl mb-4">🥷</div>
              <h2 className="text-2xl font-bold text-[#f59e0b] mb-6">フェイスラン</h2>
              {!cameraEnabled && (
                <button onClick={enableCamera}
                  className="w-full mb-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-xl text-sm transition-all">
                  📷 カメラで顔認識を使う
                </button>
              )}
              {cameraEnabled && faceLoaded && (
                <div className="text-green-400 text-sm mb-3">✅ 顔認識有効 — 口を開けてジャンプ！</div>
              )}
              {cameraError && <p className="text-yellow-400 text-xs mb-3">{cameraError}</p>}
              {faceError && <p className="text-red-400 text-xs mb-3">{faceError}</p>}
              <button onClick={handleStart}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 shadow-lg">
                ▶ ゲームスタート
              </button>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>キーボード: スペース=ジャンプ / ←→=レーン変更</p>
                <p>タッチ: タップ=ジャンプ / スワイプ=レーン変更</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <div className="text-center px-6">
              <div className="text-5xl mb-3">💥</div>
              <h2 className="text-3xl font-bold text-red-400 mb-2">ゲームオーバー</h2>
              <p className="text-[#f59e0b] text-5xl font-bold mb-1">{score}</p>
              <p className="text-gray-400 text-sm mb-1">点</p>
              {score >= highScore && score > 0 && (
                <p className="text-[#f59e0b] text-sm font-bold mb-4">🏆 ハイスコア更新!</p>
              )}
              {score < highScore && <p className="text-gray-400 text-xs mb-4">Best: {highScore}</p>}
              <button onClick={() => { setShowControls(false); startGame(); }}
                className="w-full bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold py-3 px-6 rounded-xl text-lg mb-3 transition-all hover:scale-105">
                ↺ もう一度プレイ
              </button>
              <a href={`https://twitter.com/intent/tweet?text=&url=`}
                target="_blank" rel="noopener noreferrer"
                className="block w-full bg-black hover:bg-gray-900 text-white border border-white/30 py-3 px-6 rounded-xl text-sm text-center transition-all">
                🐦 Xでシェア
              </a>
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="mt-3 text-center">
          <span className="text-[#f59e0b] font-bold text-2xl">{score}</span>
          <span className="text-gray-400 text-sm ml-1">点</span>
        </div>
      )}
    </div>
  );
}
