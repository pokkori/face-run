"use client";
import { getTodayKey, getDailyTarget, getDailyResult, getStreak, getMilestoneReached, isAtRiskOfStreakBreak } from '../../lib/dailyChallenge';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import OrbBackground from '../../components/OrbBackground';

export default function DailyPage() {
  const [result, setResult] = useState<ReturnType<typeof getDailyResult>>(null);
  const [streak, setStreak] = useState(0);
  const [atRisk, setAtRisk] = useState(false);
  const todayKey = getTodayKey();
  const target = getDailyTarget(todayKey);

  useEffect(() => {
    setResult(getDailyResult());
    const s = getStreak();
    setStreak(s);
    setAtRisk(isAtRiskOfStreakBreak());
  }, []);

  const milestone = getMilestoneReached(streak);

  return (
    <main
      className="min-h-screen text-white flex flex-col items-center justify-center p-6 relative"
      style={{ background: "linear-gradient(160deg, #0f0c29, #1a0a3e, #0f0c29)" }}
    >
      <OrbBackground />
      <h1
        className="text-3xl font-bold text-amber-400 mb-2 relative z-10"
        style={{ textShadow: "0 0 16px rgba(245,158,11,0.6)" }}
      >
        デイリーチャレンジ
      </h1>
      <p className="text-gray-400 text-sm mb-6 relative z-10">{todayKey}</p>

      {/* ストリーク失効警告 */}
      {atRisk && streak > 0 && (
        <div className="bg-red-500/15 border border-red-400/40 rounded-lg px-4 py-2 mb-4 text-center w-full max-w-sm">
          <p className="text-red-300 text-sm font-bold">
            今日プレイしないと {streak}日ストリークが消えます！
          </p>
        </div>
      )}

      {/* ストリーク表示（マイルストーン対応） */}
      {streak > 0 && (
        <div className={`rounded-lg px-6 py-3 mb-6 w-full max-w-sm text-center ${
          milestone
            ? 'bg-gradient-to-r from-amber-500/30 to-purple-500/30 border-2 border-amber-400 animate-pulse'
            : 'bg-amber-500/20 border border-amber-400/30'
        }`}>
          <p className="text-amber-300 font-bold">
            {milestone ? ` ${milestone.label} ` : `${streak}日連続チャレンジ中！`}
          </p>
          {milestone && (
            <p className="text-amber-200 text-sm mt-1">{milestone.reward}</p>
          )}
          {!milestone && streak > 0 && streak < 7 && (
            <p className="text-amber-400/70 text-xs mt-1">あと{7 - streak}日で7日達成！</p>
          )}
        </div>
      )}
      <div
        className="rounded-2xl p-8 text-center mb-8 w-full max-w-sm relative z-10"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 0 24px rgba(147,51,234,0.12)",
        }}
      >
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
