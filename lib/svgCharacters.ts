// lib/svgCharacters.ts
export const SVG_PLAYER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <!-- 忍者: 黒装束・白目・赤スカーフ -->
  <rect x="0" y="0" width="40" height="40" fill="#1a1a1a" rx="4"/>
  <ellipse cx="20" cy="14" rx="10" ry="10" fill="#1a1a1a"/>
  <rect x="4" y="10" width="32" height="8" fill="#CC0000" rx="2"/>
  <ellipse cx="16" cy="14" rx="3" ry="3" fill="white"/>
  <ellipse cx="24" cy="14" rx="3" ry="3" fill="white"/>
  <ellipse cx="16" cy="14" rx="1.5" ry="1.5" fill="#333"/>
  <ellipse cx="24" cy="14" rx="1.5" ry="1.5" fill="#333"/>
  <rect x="8" y="24" width="24" height="16" fill="#1a1a1a" rx="2"/>
</svg>`;

export const SVG_OBSTACLE_ROCK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <polygon points="20,4 38,36 2,36" fill="#666" stroke="#444" stroke-width="2"/>
  <polygon points="20,10 33,32 7,32" fill="#888"/>
</svg>`;

export const SVG_OBSTACLE_FLAME = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <ellipse cx="20" cy="30" rx="10" ry="8" fill="#FF4500"/>
  <path d="M14,28 Q16,16 20,12 Q18,20 22,18 Q24,10 20,4 Q30,14 26,24 Q30,20 28,28 Z" fill="#FF6B35"/>
  <path d="M17,26 Q19,20 20,16 Q21,20 22,18 Q24,22 22,26 Z" fill="#FFD700"/>
</svg>`;

export const SVG_OBSTACLE_ENEMY = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <rect x="2" y="2" width="36" height="36" fill="#8B0000" rx="4"/>
  <ellipse cx="20" cy="16" rx="8" ry="8" fill="#CC2222"/>
  <line x1="14" y1="12" x2="10" y2="8" stroke="#333" stroke-width="2"/>
  <line x1="26" y1="12" x2="30" y2="8" stroke="#333" stroke-width="2"/>
  <rect x="6" y="24" width="28" height="14" fill="#8B0000" rx="2"/>
</svg>`;

export const SVG_OBSTACLE_BIRD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <!-- 鳥シルエット: 横長ボディ + 両翼 + くちばし + 尾 -->
  <ellipse cx="20" cy="22" rx="10" ry="6" fill="#60a5fa"/>
  <!-- 左翼（上方に広がる） -->
  <path d="M14,22 Q6,10 2,14 Q8,18 14,20 Z" fill="#3b82f6"/>
  <!-- 右翼（上方に広がる） -->
  <path d="M26,22 Q34,10 38,14 Q32,18 26,20 Z" fill="#3b82f6"/>
  <!-- くちばし -->
  <polygon points="10,21 4,20 10,23" fill="#fbbf24"/>
  <!-- 尾 -->
  <path d="M30,22 Q36,18 38,22 Q36,26 30,24 Z" fill="#2563eb"/>
  <!-- 目 -->
  <circle cx="13" cy="21" r="2" fill="white"/>
  <circle cx="13" cy="21" r="1" fill="#1e3a5f"/>
</svg>`;

export const SVG_OBSTACLE_SPIKE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
  <!-- トゲ: 中央の大トゲ + 左右の小トゲ -->
  <!-- ベース台座 -->
  <rect x="2" y="32" width="36" height="6" fill="#b91c1c" rx="2"/>
  <!-- 中央大トゲ -->
  <polygon points="20,4 26,32 14,32" fill="#ef4444"/>
  <polygon points="20,8 25,32 15,32" fill="#fca5a5"/>
  <!-- 左トゲ -->
  <polygon points="8,14 12,32 4,32" fill="#dc2626"/>
  <!-- 右トゲ -->
  <polygon points="32,14 36,32 28,32" fill="#dc2626"/>
</svg>`;

export type ObstacleType = 'rock' | 'flame' | 'enemy' | 'bird' | 'spike';

export const OBSTACLE_TYPES: ObstacleType[] = ['rock', 'flame', 'enemy', 'bird', 'spike'];

export function svgToImage(svgString: string, size: number): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.src = url;
  });
}

export interface SvgImages {
  player: HTMLImageElement;
  rock: HTMLImageElement;
  flame: HTMLImageElement;
  enemy: HTMLImageElement;
  bird: HTMLImageElement;
  spike: HTMLImageElement;
}

export async function loadAllSvgImages(): Promise<SvgImages> {
  const [player, rock, flame, enemy, bird, spike] = await Promise.all([
    svgToImage(SVG_PLAYER, 40),
    svgToImage(SVG_OBSTACLE_ROCK, 40),
    svgToImage(SVG_OBSTACLE_FLAME, 40),
    svgToImage(SVG_OBSTACLE_ENEMY, 40),
    svgToImage(SVG_OBSTACLE_BIRD, 40),
    svgToImage(SVG_OBSTACLE_SPIKE, 40),
  ]);
  return { player, rock, flame, enemy, bird, spike };
}
