export async function generateScoreCard(
  score: number,
  isHighScore: boolean,
  combo: number
): Promise<Blob | null> {
  if (typeof document === 'undefined') return null;
  const W = 1200, H = 630;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 背景グラデーション
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#0f0c29');
  grad.addColorStop(1, '#302b63');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // 上部6px 金色帯
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(0, 0, W, 6);

  // タイトル
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('フェイスラン', W / 2, 120);

  // NEW RECORD バナー
  if (isHighScore) {
    ctx.fillStyle = 'rgba(255,215,0,0.15)';
    ctx.fillRect(W / 2 - 140, 140, 280, 44);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('NEW RECORD', W / 2, 170);
  }

  // スコア
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px sans-serif';
  ctx.fillText(String(score), W / 2, 310);

  // 「点」ラベル
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '36px sans-serif';
  ctx.fillText('点', W / 2, 370);

  // コンボ & ハッシュタグ
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '28px sans-serif';
  ctx.fillText(`COMBO x${combo} | #フェイスラン`, W / 2, 440);

  // URL
  ctx.fillStyle = 'rgba(245,158,11,0.6)';
  ctx.font = '24px sans-serif';
  ctx.fillText('face-run.vercel.app', W / 2, 590);

  return new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png')
  );
}
