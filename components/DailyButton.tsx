"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStreak } from '../lib/dailyChallenge';

export function DailyButton() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  const isMilestone = streak === 7 || streak === 14 || streak === 30;

  return (
    <div className="flex flex-col items-center gap-2">
      {isMilestone && (
        <div className="bg-gradient-to-r from-amber-500 to-yellow-300 text-black text-sm font-bold px-4 py-1 rounded-full animate-pulse">
          {streak}日連続達成！おめでとう！
        </div>
      )}
      <Link
        href="/daily"
        className={`min-h-[44px] hover:bg-white/20 border rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-all ${streak >= 7 ? 'bg-amber-500/20 border-amber-400/50' : 'bg-white/10 border-white/20'}`}
        aria-label={`デイリーチャレンジを開く${streak > 0 ? ` ${streak}日連続中` : ''}`}
      >
        {streak >= 7 && (
          <svg viewBox="0 0 20 20" width={18} height={18} fill="#f59e0b">
            <polygon points="10,2 12.6,7.3 18.5,8.2 14.3,12.3 15.3,18.2 10,15.4 4.7,18.2 5.7,12.3 1.5,8.2 7.4,7.3" />
          </svg>
        )}
        <span className="font-semibold text-white">デイリーチャレンジ</span>
        {streak > 0 && (
          <span className={`text-sm font-bold ${streak >= 7 ? 'text-amber-400' : 'text-gray-300'}`}>
            {streak}日連続
          </span>
        )}
      </Link>
    </div>
  );
}
