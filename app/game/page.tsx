"use client";

import { useRef, useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useBGM } from '@/hooks/useAudio';
import { generateScoreCard } from '../../lib/generateScoreCard';
import { saveDailyResult } from '../../lib/dailyChallenge';
import { AdBanner } from '../../components/AdBanner';

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0c29] flex items-center justify-center text-white">読み込み中...</div>}>
      <GamePageInner />
    </Suspense>
  );
}

function GamePageInner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [sensitivity, setSensitivity] = useState(0.5);

  const searchParams = useSearchParams();
  const isDailyMode = searchParams.get('mode') === 'daily';
  const dailyTarget = isDailyMode ? Number(searchParams.get('target') ?? 0) : 0;

  // localStorage から sensitivity を復元
  useEffect(() => {
    const saved = localStorage.getItem('facerun_sensitivity');
    if (saved) setSensitivity(Number(saved));
  }, []);

  // sensitivity を保存
  useEffect(() => {
    localStorage.setItem('facerun_sensitivity', String(sensitivity));
  }, [sensitivity]);

  const { isLoaded: faceLoaded, isLoading: faceLoading, error: faceError, faceInputRef, loadModels } = useFaceDetection(videoRef, sensitivity);
  const { gameState, score, highScore, maxCombo, startGame } = useGameLoop(canvasRef, faceInputRef);
  const { startBGM, stopBGM, toggleMute } = useBGM();
  const [isMuted, setIsMuted] = useState(false);

  // ゲームオーバー時: BGM停止 & デイリー結果保存
  useEffect(() => {
    if (gameState === 'dead') {
      stopBGM();
      if (isDailyMode) {
        saveDailyResult(score);
      }
    }
  }, [gameState, score, isDailyMode, stopBGM]);

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

  const handleStart = () => {
    setShowControls(false);
    startGame();
    startBGM();
  };

  const handleShare = async () => {
    const isHigh = score > 0 && score >= (highScore ?? 0);
    const blob = await generateScoreCard(score, isHigh, maxCombo);
    const shareText = `フェイスランで${score}点達成！ #フェイスラン\nhttps://face-run.vercel.app`;

    if (blob && navigator.canShare?.({ files: [new File([blob], 'facerun.png', { type: 'image/png' })] })) {
      const file = new File([blob], 'facerun.png', { type: 'image/png' });
      await navigator.share({ files: [file], text: shareText }).catch(() => {});
    } else if (navigator.share) {
      await navigator.share({ text: shareText }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(shareText).catch(() => {});
      alert('テキストをコピーしました');
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] flex flex-col items-center justify-start pt-2 px-2">
      <div className="w-full max-w-sm flex items-center justify-between mb-2">
        <Link href="/" className="text-[#f59e0b] text-sm hover:underline min-h-[44px] flex items-center" aria-label="ホームに戻る">← ホーム</Link>
        <span className="text-white font-bold">フェイスラン</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { const muted = toggleMute(); setIsMuted(muted); }}
            className="text-gray-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label={isMuted ? '音をオンにする' : '音をオフにする'}
          >
            {isMuted ? (
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            )}
          </button>
          <div className="text-xs text-gray-400">Best: <span className="text-[#f59e0b] font-bold">{highScore}</span></div>
        </div>
      </div>

      <div className="relative" style={{ width: 360, height: 640 }}>
        <canvas ref={canvasRef} width={360} height={640}
          className="rounded-xl border border-white/20 shadow-2xl shadow-purple-900/50"
          style={{ touchAction: "none" }}
          role="img"
          aria-label={gameState === 'playing' ? `フェイスラン ゲームプレイ中 スコア${score}` : gameState === 'dead' ? `ゲームオーバー 最終スコア${score}` : 'フェイスラン ゲーム画面'}
        />

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
            <div className="text-center px-6 w-full">
              <h2 className="text-2xl font-bold text-[#f59e0b] mb-4">フェイスラン</h2>

              {isDailyMode && (
                <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg px-4 py-2 mb-4">
                  <p className="text-amber-300 text-sm font-bold">デイリーチャレンジ: 目標 {dailyTarget} 点</p>
                </div>
              )}

              {/* チュートリアル */}
              <div className="bg-black/40 rounded-xl p-3 mb-4 text-left space-y-1">
                <p className="text-white text-sm">口を開ける = ジャンプ</p>
                <p className="text-white text-sm">頭を傾ける = 左右移動</p>
                <p className="text-white text-sm">眉を上げる = 二段ジャンプ</p>
              </div>

              {/* 感度スライダー */}
              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">
                  顔認識感度: {Math.round(sensitivity * 100)}%
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.1}
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="w-full h-3 accent-amber-400 cursor-pointer"
                  aria-label="顔認識感度を調整"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>低（大きな動作）</span>
                  <span>高（小さな動作）</span>
                </div>
              </div>

              {!cameraEnabled && (
                <>
                  <button onClick={enableCamera}
                    className="w-full mb-2 min-h-[44px] bg-white/10 hover:bg-white/20 border border-white/30 text-white py-3 px-4 rounded-xl text-sm transition-all"
                    aria-label="カメラを有効にして顔認識を使う">
                    カメラで顔認識を使う
                  </button>
                  <div className="flex items-center justify-center gap-1.5 mb-3 text-xs text-green-400/80" role="note" aria-label="プライバシー保護の説明">
                    <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor"><path d="M8 1L2 3.5v5C2 12 5 14.5 8 15c3-0.5 6-3 6-6.5v-5L8 1z"/></svg>
                    <span>端末内のみで処理 · 外部サーバー送信なし</span>
                  </div>
                </>
              )}
              {cameraEnabled && faceLoaded && (
                <div className="text-green-400 text-sm mb-3">顔認識有効 - 口を開けてジャンプ！</div>
              )}
              {cameraError && <p className="text-yellow-400 text-xs mb-3">{cameraError}</p>}
              {faceError && <p className="text-red-400 text-xs mb-3">{faceError}</p>}
              <button onClick={handleStart}
                className="w-full min-h-[44px] bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 shadow-lg"
                aria-label="ゲームをスタートする">
                ゲームスタート
              </button>
              <div className="mt-4 text-xs text-gray-400 space-y-1">
                <p>キーボード: スペース=ジャンプ / 左右矢印=レーン変更</p>
                <p>タッチ: タップ=ジャンプ / スワイプ=レーン変更</p>
              </div>
            </div>
          </div>
        )}

        {gameState === 'dead' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl">
            <div className="text-center px-6 w-full">
              <h2 className="text-3xl font-bold text-red-400 mb-2">ゲームオーバー</h2>
              <p className="text-[#f59e0b] text-5xl font-bold mb-1">{score}</p>
              <p className="text-gray-400 text-sm mb-1">点</p>
              {score >= highScore && score > 0 && (
                <p className="text-[#f59e0b] text-sm font-bold mb-2 animate-pulse">NEW RECORD!</p>
              )}
              {score < highScore && (
                <div className="mb-2">
                  <p className="text-gray-400 text-xs">Best: {highScore}</p>
                  <p className="text-amber-300 text-sm font-bold">あと {highScore - score} 点で自己ベスト更新！</p>
                </div>
              )}

              {/* デイリーチャレンジ達成バナー */}
              {isDailyMode && score >= dailyTarget && (
                <div className="bg-green-500/20 border border-green-400/30 rounded-lg px-4 py-2 mb-3">
                  <p className="text-green-400 font-bold">目標達成！</p>
                </div>
              )}
              {isDailyMode && score < dailyTarget && (
                <div className="bg-white/5 rounded-lg px-4 py-2 mb-3">
                  <p className="text-gray-400 text-sm">目標まであと{dailyTarget - score}点</p>
                </div>
              )}

              <button onClick={() => { setShowControls(false); startGame(); startBGM(); }}
                className="w-full min-h-[44px] bg-[#f59e0b] hover:bg-[#d97706] text-[#0f0c29] font-bold py-3 px-6 rounded-xl text-lg mb-3 transition-all hover:scale-105"
                aria-label="もう一度プレイする">
                もう一度プレイ
              </button>
              <button onClick={handleShare}
                className="block w-full min-h-[44px] bg-black hover:bg-gray-900 text-white border border-white/30 py-3 px-6 rounded-xl text-sm text-center transition-all mb-3"
                aria-label="スコアをシェアする">
                スコアをシェア
              </button>
              <Link href="/daily"
                className="block w-full min-h-[44px] bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 py-3 px-6 rounded-xl text-sm text-center transition-all mb-3"
                aria-label="デイリーチャレンジに挑戦する">
                デイリーチャレンジに挑戦 →
              </Link>

              <div className="mt-2">
                <AdBanner />
              </div>
            </div>
          </div>
        )}
      </div>

      {gameState === 'playing' && (
        <div className="mt-3 text-center">
          <span className="text-[#f59e0b] font-bold text-2xl">{score}</span>
          <span className="text-gray-400 text-sm ml-1">点</span>
          {isDailyMode && (
            <span className="text-gray-500 text-xs ml-2">目標: {dailyTarget}</span>
          )}
        </div>
      )}
    </div>
  );
}
