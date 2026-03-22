"use client";
import { getTodayKey, getDailyTarget, getDailyResult, getStreak } from '../../lib/dailyChallenge';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DailyPage() {
  const [result, setResult] = useState<ReturnType<typeof getDailyResult>>(null);
  const [streak, setStreak] = useState(0);
  const todayKey = getTodayKey();
  const target = getDailyTarget(todayKey);

  useEffect(() => {
    setResult(getDailyResult());
    setStreak(getStreak());
  }, []);

  return (
    <main className="min-h-screen bg-[#0f0c29] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-amber-400 mb-2">デイリーチャレンジ</h1>
      <p className="text-gray-400 text-sm mb-6">{todayKey}</p>
      {streak > 0 && (
        <div className="bg-amber-500/20 border border-amber-400/30 rounded-lg px-6 py-3 mb-6">
          <p className="text-amber-300 font-bold">{streak}日連続チャレンジ中！</p>
        </div>
      )}
      <div className="bg-white/5 rounded-2xl p-8 text-center mb-8 w-full max-w-sm">
        <p className="text-gray-400 text-sm mb-2">今日の目標スコア</p>
        <p className="text-6xl font-bold text-amber-400 mb-2">{target}</p>
        <p className="text-gray-400 text-sm">点</p>
      </div>
      {result ? (
        <div className={`rounded-xl p-4 mb-6 text-center w-full max-w-sm ${result.completed ? 'bg-green-500/20 border border-green-400/30' : 'bg-white/5'}`}>
          <p className="text-sm text-gray-400">自己ベスト: {result.score}点</p>
          {result.completed ? (
            <p className="text-green-400 font-bold mt-1">達成！</p>
          ) : (
            <p className="text-gray-400 mt-1">あと{target - result.score}点</p>
          )}
        </div>
      ) : null}
      <Link href={`/game?mode=daily&target=${target}`}
        className="min-h-[44px] bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-3 rounded-xl flex items-center justify-center"
        aria-label="デイリーチャレンジを開始する">
        {result?.completed ? 'もう一度挑戦' : 'チャレンジする'}
      </Link>
      <Link href="/" className="mt-4 text-gray-400 text-sm hover:text-gray-300">
        ホームに戻る
      </Link>
    </main>
  );
}
