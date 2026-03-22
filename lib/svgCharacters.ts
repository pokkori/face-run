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

export type ObstacleType = 'rock' | 'flame' | 'enemy';

export const OBSTACLE_TYPES: ObstacleType[] = ['rock', 'flame', 'enemy'];

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
}

export async function loadAllSvgImages(): Promise<SvgImages> {
  const [player, rock, flame, enemy] = await Promise.all([
    svgToImage(SVG_PLAYER, 40),
    svgToImage(SVG_OBSTACLE_ROCK, 40),
    svgToImage(SVG_OBSTACLE_FLAME, 40),
    svgToImage(SVG_OBSTACLE_ENEMY, 40),
  ]);
  return { player, rock, flame, enemy };
}
