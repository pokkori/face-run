"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getStreak } from '../lib/dailyChallenge';

export function DailyButton() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreak());
  }, []);

  return (
    <Link
      href="/daily"
      className="min-h-[44px] bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-6 py-3 flex items-center justify-center gap-2 transition-all"
      aria-label="デイリーチャレンジを開く"
    >
      <span className="font-semibold text-white">デイリーチャレンジ</span>
      {streak > 0 && <span className="text-amber-400 text-sm">{streak}日連続</span>}
    </Link>
  );
}
