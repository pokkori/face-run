export function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getDailyTarget(dateKey: string): number {
  const seed = dateKey.split('-').reduce((a, b) => a + parseInt(b, 10), 0);
  return 100 + (seed % 10) * 50; // 100〜550点
}

export function getDailyResult(): { completed: boolean; score: number; dateKey: string } | null {
  if (typeof localStorage === 'undefined') return null;
  const key = getTodayKey();
  const raw = localStorage.getItem(`facerun_daily_${key}`);
  return raw ? JSON.parse(raw) : null;
}

export function saveDailyResult(score: number): void {
  if (typeof localStorage === 'undefined') return;
  const key = getTodayKey();
  const target = getDailyTarget(key);
  const result = getDailyResult();
  const existing = result?.score ?? 0;
  const completed = score >= target || result?.completed === true;
  localStorage.setItem(`facerun_daily_${key}`, JSON.stringify({
    completed,
    score: Math.max(score, existing),
    dateKey: key,
  }));
  if (completed) updateStreak();
}

export function getStreak(): number {
  if (typeof localStorage === 'undefined') return 0;
  const streak = parseInt(localStorage.getItem('facerun_streak') || '0', 10);
  const lastDate = localStorage.getItem('facerun_streak_date') || '';
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  if (lastDate === today || lastDate === yesterdayKey) return streak;
  // ストリークリカバリー（1日ミスをカバー）使用済みか確認
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  const twoDaysAgoKey = twoDaysAgo.toISOString().slice(0, 10);
  const recoveryUsed = localStorage.getItem('facerun_streak_recovery') === today;
  if (!recoveryUsed && lastDate === twoDaysAgoKey) return streak; // リカバリー可能状態で保持
  return 0;
}

export function useStreakRecovery(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const today = getTodayKey();
  if (localStorage.getItem('facerun_streak_recovery') === today) return false; // 今日既に使用
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);
  const lastDate = localStorage.getItem('facerun_streak_date') || '';
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  if (lastDate !== twoDaysAgo.toISOString().slice(0, 10)) return false;
  // リカバリー実行
  localStorage.setItem('facerun_streak_recovery', today);
  localStorage.setItem('facerun_streak_date', yesterdayKey); // 昨日としてカウントさせる
  return true;
}

export function getTomorrowTarget(): number {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const key = tomorrow.toISOString().slice(0, 10);
  return getDailyTarget(key);
}

export function updateStreak(): void {
  if (typeof localStorage === 'undefined') return;
  const today = getTodayKey();
  if (localStorage.getItem('facerun_streak_date') === today) return; // already updated today
  const current = getStreak();
  localStorage.setItem('facerun_streak', String(current + 1));
  localStorage.setItem('facerun_streak_date', today);
}

// マイルストーン定義
export const STREAK_MILESTONES = [
  { days: 30, label: '1ヶ月連続！チャンピオン！', color: '#ef4444', reward: '伝説のランナー称号' },
  { days: 14, label: '2週間連続！すごい！', color: '#a855f7', reward: 'スペシャルスキン解放' },
  { days: 7,  label: '7日連続達成！', color: '#f59e0b', reward: 'フィーバーモード解放' },
] as const;

export function getMilestoneReached(streak: number): { days: number; label: string; color: string; reward: string } | null {
  return STREAK_MILESTONES.find(m => streak === m.days) ?? null;
}

// 今日まだデイリーをプレイしていない && ストリークが1以上 = 失効リスクあり
export function isAtRiskOfStreakBreak(): boolean {
  if (typeof localStorage === 'undefined') return false;
  const streak = getStreak();
  if (streak === 0) return false;
  const lastDate = localStorage.getItem('facerun_streak_date') || '';
  const today = getTodayKey();
  // 今日まだプレイしていない（かつストリーク継続中）= リスクあり
  return lastDate !== today;
}
