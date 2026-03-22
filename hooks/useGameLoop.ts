"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import type { FaceInput } from './useFaceDetection';
import { type ObstacleType, OBSTACLE_TYPES, type SvgImages, loadAllSvgImages } from '@/lib/svgCharacters';
import { useAudio } from './useAudio';

const CANVAS_W = 360;
const CANVAS_H = 640;
const LANE_COUNT = 3;
const LANE_WIDTH = CANVAS_W / LANE_COUNT;
const GROUND_Y = CANVAS_H - 80;
const PLAYER_SIZE = 48;
const OBSTACLE_SIZE = 44;
const JUMP_HEIGHT = 160;
const JUMP_DURATION = 0.4;
const INITIAL_SPEED = 300;
const SPEED_INCREMENT = 20;
const OBSTACLE_INTERVAL_MIN = 0.8;
const OBSTACLE_INTERVAL_MAX = 2.0;
const PARTICLES_PER_HIT = 12;

type Lane = 0 | 1 | 2;

interface Player {
  lane: Lane; y: number; vy: number;
  isJumping: boolean; canDoubleJump: boolean; isAlive: boolean;
}
interface Obstacle { id: number; lane: Lane; y: number; type: ObstacleType; dodged: boolean; }
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; text?: string; }
export type GameState = 'idle' | 'playing' | 'dead';

interface ComboDisplay {
  text: string;
  timeLeft: number;
  multiplier: number;
}

interface GameData {
  player: Player;
  obstacles: Obstacle[];
  particles: Particle[];
  score: number;
  speed: number;
  nextObstacleIn: number;
  obstacleId: number;
  elapsed: number;
  combo: number;
  maxCombo: number;
  comboDisplay: ComboDisplay | null;
  shakeTime: number;
}

function laneX(lane: Lane): number { return LANE_WIDTH * lane + LANE_WIDTH / 2; }
function randomLane(): Lane { return Math.floor(Math.random() * LANE_COUNT) as Lane; }
function randomObstacleInterval(): number {
  return OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN);
}
function randomObstacleType(): ObstacleType {
  return OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
}

function initGame(): GameData {
  return {
    player: { lane: 1, y: GROUND_Y, vy: 0, isJumping: false, canDoubleJump: false, isAlive: true },
    obstacles: [], particles: [], score: 0, speed: INITIAL_SPEED,
    nextObstacleIn: 1.5, obstacleId: 0, elapsed: 0,
    combo: 0, maxCombo: 0, comboDisplay: null, shakeTime: 0,
  };
}

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  faceInputRef: React.RefObject<FaceInput>
) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const gameDataRef = useRef<GameData>(initGame());
  const gameStateRef = useRef<GameState>('idle');
  const prevScoreRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const touchStartXRef = useRef<number | null>(null);
  const jumpQueueRef = useRef({ jump: false, doubleJump: false });
  const svgImagesRef = useRef<SvgImages | null>(null);
  const { playDodge, playCombo, playGameOver, resume } = useAudio();

  // SVG画像を事前ロード
  useEffect(() => {
    loadAllSvgImages().then((imgs) => { svgImagesRef.current = imgs; });
  }, []);

  useEffect(() => {
    const hs = localStorage.getItem('facerun_highscore');
    if (hs) setHighScore(parseInt(hs, 10));
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jumpQueueRef.current.jump = true; }
      keysRef.current.add(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => { keysRef.current.delete(e.code); };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => { window.removeEventListener('keydown', onKeyDown); window.removeEventListener('keyup', onKeyUp); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchStartXRef.current = e.touches[0].clientX;
      jumpQueueRef.current.jump = true;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartXRef.current;
      if (Math.abs(dx) > 40) {
        const gd = gameDataRef.current;
        if (dx < 0 && gd.player.lane > 0) gd.player.lane = (gd.player.lane - 1) as Lane;
        else if (dx > 0 && gd.player.lane < 2) gd.player.lane = (gd.player.lane + 1) as Lane;
        jumpQueueRef.current.jump = false;
      }
      touchStartXRef.current = null;
    };
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    return () => { canvas.removeEventListener('touchstart', onTouchStart); canvas.removeEventListener('touchend', onTouchEnd); };
  }, [canvasRef]);

  const doJump = useCallback((gd: GameData) => {
    const p = gd.player; if (!p.isAlive) return;
    if (!p.isJumping) {
      p.isJumping = true; p.canDoubleJump = true;
      p.vy = -(2 * JUMP_HEIGHT) / JUMP_DURATION;
    } else if (p.canDoubleJump) {
      p.canDoubleJump = false;
      p.vy = -(2 * JUMP_HEIGHT) / JUMP_DURATION;
    }
  }, []);

  const spawnParticles = useCallback((gd: GameData, x: number, y: number) => {
    const colors = ['#f59e0b', '#ef4444', '#f97316', '#fbbf24'];
    for (let i = 0; i < PARTICLES_PER_HIT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLES_PER_HIT + Math.random() * 0.5;
      const spd = 100 + Math.random() * 150;
      gd.particles.push({ x, y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, alpha: 1, color: colors[Math.floor(Math.random() * colors.length)] });
    }
  }, []);

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, elapsed: number) => {
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#0f0c29'); grad.addColorStop(0.6, '#302b63'); grad.addColorStop(1, '#24243e');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const stars = [[30,40],[80,20],[150,60],[220,30],[300,50],[50,90],[130,110],[250,80],[320,100],[10,130],[180,140],[340,20],[70,160],[210,170],[280,130]];
    stars.forEach(([sx, sy]) => { const t = Math.sin(elapsed * 2 + sx) * 0.3 + 0.7; ctx.globalAlpha = t; ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(sx, sy, 2, 2); });
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.setLineDash([10, 15]);
    for (let i = 1; i < LANE_COUNT; i++) { ctx.beginPath(); ctx.moveTo(LANE_WIDTH * i, 0); ctx.lineTo(LANE_WIDTH * i, GROUND_Y); ctx.stroke(); }
    ctx.setLineDash([]);
    const gg = ctx.createLinearGradient(0, GROUND_Y, 0, CANVAS_H);
    gg.addColorStop(0, '#16a34a'); gg.addColorStop(0.3, '#15803d'); gg.addColorStop(1, '#052e16');
    ctx.fillStyle = gg; ctx.fillRect(0, GROUND_Y, CANVAS_W, CANVAS_H - GROUND_Y);
    ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 2; ctx.shadowColor = '#4ade80'; ctx.shadowBlur = 8;
    ctx.beginPath(); ctx.moveTo(0, GROUND_Y); ctx.lineTo(CANVAS_W, GROUND_Y); ctx.stroke(); ctx.shadowBlur = 0;
  }, []);

  const drawSvgChar = useCallback((ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, x: number, y: number, size: number) => {
    if (!img) return;
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
  }, []);

  const update = useCallback((dt: number) => {
    const gd = gameDataRef.current; if (!gd.player.isAlive) return;
    gd.elapsed += dt;
    gd.speed = INITIAL_SPEED + Math.floor(gd.elapsed / 10) * SPEED_INCREMENT;
    const fi = faceInputRef.current; const keys = keysRef.current;
    if (fi.doubleJump && gd.player.isJumping && gd.player.canDoubleJump) { doJump(gd); }
    else if (fi.jump || jumpQueueRef.current.jump) { doJump(gd); jumpQueueRef.current.jump = false; }
    if (fi.moveLeft || keys.has('ArrowLeft')) { if (gd.player.lane > 0) gd.player.lane = (gd.player.lane - 1) as Lane; }
    if (fi.moveRight || keys.has('ArrowRight')) { if (gd.player.lane < 2) gd.player.lane = (gd.player.lane + 1) as Lane; }
    const gravity = (2 * JUMP_HEIGHT) / (JUMP_DURATION * JUMP_DURATION);
    gd.player.vy += gravity * dt; gd.player.y += gd.player.vy * dt;
    if (gd.player.y >= GROUND_Y) { gd.player.y = GROUND_Y; gd.player.vy = 0; gd.player.isJumping = false; gd.player.canDoubleJump = false; }
    gd.nextObstacleIn -= dt;
    if (gd.nextObstacleIn <= 0) {
      gd.obstacles.push({ id: gd.obstacleId++, lane: randomLane(), y: -OBSTACLE_SIZE, type: randomObstacleType(), dodged: false });
      gd.nextObstacleIn = randomObstacleInterval() * (INITIAL_SPEED / gd.speed);
    }
    // シェイクタイマー更新
    if (gd.shakeTime > 0) gd.shakeTime -= dt;
    // コンボ表示タイマー更新
    if (gd.comboDisplay) {
      gd.comboDisplay.timeLeft -= dt;
      if (gd.comboDisplay.timeLeft <= 0) gd.comboDisplay = null;
    }
    const px = laneX(gd.player.lane); const py = gd.player.y;
    gd.obstacles = gd.obstacles.filter((obs) => {
      obs.y += gd.speed * dt; const ox = laneX(obs.lane);
      // 衝突判定
      if (Math.abs(ox - px) < LANE_WIDTH * 0.5 && Math.abs(obs.y - py) < OBSTACLE_SIZE * 0.8) {
        gd.player.isAlive = false;
        gd.combo = 0;
        gd.comboDisplay = null;
        gd.shakeTime = 0.3;
        spawnParticles(gd, px, py);
        playGameOver();
        return false;
      }
      // 回避判定: 障害物がプレイヤーより下に通り過ぎた && まだ回避カウント未済
      if (!obs.dodged && obs.y > py + OBSTACLE_SIZE) {
        obs.dodged = true;
        gd.combo += 1;
        if (gd.combo > gd.maxCombo) gd.maxCombo = gd.combo;
        playDodge();
        // コンボマイルストーン（x2: 5回、x3: 12回に調整して体験しやすく）
        if (gd.combo >= 12) {
          gd.comboDisplay = { text: 'COMBO x3', timeLeft: 2, multiplier: 3 };
          playCombo(3);
        } else if (gd.combo >= 5) {
          gd.comboDisplay = { text: 'COMBO x2', timeLeft: 2, multiplier: 2 };
          playCombo(2);
        }
      }
      return obs.y < CANVAS_H + OBSTACLE_SIZE;
    });
    // コンボ倍率込みスコア計算
    const multiplier = gd.combo >= 20 ? 3 : gd.combo >= 10 ? 2 : 1;
    gd.score = Math.floor((gd.elapsed * 10 + (gd.speed - INITIAL_SPEED) * 0.5) * multiplier);
    // スコア100倍数達成パーティクル
    const canvas = canvasRef.current;
    if (canvas) {
      const prevHundreds = Math.floor(prevScoreRef.current / 100);
      const currHundreds = Math.floor(gd.score / 100);
      if (currHundreds > prevHundreds && gd.score > 0) {
        for (let i = 0; i < 3; i++) {
          gd.particles.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 100,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 2,
            vy: -3 - Math.random() * 2,
            alpha: 1,
            color: '#FFD700',
            text: '+100',
          });
        }
      }
    }
    prevScoreRef.current = gd.score;
    gd.particles = gd.particles
      .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, vy: p.vy + 200 * dt, alpha: p.alpha - dt * 2 }))
      .filter((p) => p.alpha > 0);
  }, [faceInputRef, doJump, spawnParticles]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const gd = gameDataRef.current;
    const imgs = svgImagesRef.current;

    // スクリーンシェイク
    ctx.save();
    if (gd.shakeTime > 0) {
      const sx = (Math.random() - 0.5) * 10;
      const sy = (Math.random() - 0.5) * 10;
      ctx.translate(sx, sy);
    }

    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawBackground(ctx, gd.elapsed);

    // 障害物描画 (SVG)
    gd.obstacles.forEach((obs) => {
      const ox = laneX(obs.lane);
      if (imgs) {
        const img = obs.type === 'rock' ? imgs.rock : obs.type === 'flame' ? imgs.flame : imgs.enemy;
        drawSvgChar(ctx, img, ox, obs.y, OBSTACLE_SIZE);
      }
    });

    // プレイヤー影
    const px = laneX(gd.player.lane);
    const ss = Math.max(0, 1 - (GROUND_Y - gd.player.y) / CANVAS_H);
    ctx.save(); ctx.globalAlpha = 0.3 * ss; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(px, GROUND_Y + 4, PLAYER_SIZE * 0.4 * ss, 6 * ss, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();

    // プレイヤー描画 (SVG忍者)
    if (imgs) {
      drawSvgChar(ctx, imgs.player, px, gd.player.y, PLAYER_SIZE);
    }

    // パーティクル
    gd.particles.forEach((p) => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      if (p.text) {
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${Math.round(16 * p.alpha + 4)}px system-ui`;
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x, p.y);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    // HUD: スコアバー
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, CANVAS_W, 48);
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(`Score: ${gd.score}`, 12, 24);

    // コンボ表示
    if (gd.comboDisplay && gd.comboDisplay.timeLeft > 0) {
      const alpha = Math.min(1, gd.comboDisplay.timeLeft / 0.5);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#FFD700';
      ctx.font = 'bold 32px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#FF8C00';
      ctx.shadowBlur = 12;
      ctx.fillText(gd.comboDisplay.text, CANVAS_W / 2, CANVAS_H / 2 - 80);
      ctx.restore();
    }

    // コンボカウンター常時表示
    if (gd.combo >= 5) {
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`COMBO ${gd.combo}`, CANVAS_W - 12, 24);
    }

    ctx.restore();
  }, [drawBackground, drawSvgChar]);

  const loop = useCallback((time: number) => {
    if (gameStateRef.current !== 'playing') return;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = time; const gd = gameDataRef.current;
    update(dt);
    const canvas = canvasRef.current;
    if (canvas) { const ctx = canvas.getContext('2d'); if (ctx) draw(ctx); }
    if (!gd.player.isAlive) {
      setScore(gd.score);
      setMaxCombo(gd.maxCombo);
      setHighScore((hs) => { const n = Math.max(hs, gd.score); localStorage.setItem('facerun_highscore', String(n)); return n; });
      setGameState('dead'); gameStateRef.current = 'dead'; return;
    }
    setScore(gd.score); animFrameRef.current = requestAnimationFrame(loop);
  }, [update, draw, canvasRef]);

  const startGame = useCallback(() => {
    resume();
    gameDataRef.current = initGame(); gameStateRef.current = 'playing'; setGameState('playing'); setScore(0);
    lastTimeRef.current = performance.now(); animFrameRef.current = requestAnimationFrame(loop);
  }, [loop, resume]);

  const stopGame = useCallback(() => {
    gameStateRef.current = 'idle'; setGameState('idle');
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
  }, []);

  useEffect(() => { return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); }; }, []);

  useEffect(() => {
    if (gameState !== 'idle') return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    grad.addColorStop(0, '#0f0c29'); grad.addColorStop(1, '#302b63');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // タイトル
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 28px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('フェイスラン', CANVAS_W / 2, CANVAS_H / 2 - 100);

    // 忍者SVGをアイドル画面に描画（SVGロード済みなら使用）
    const imgs = svgImagesRef.current;
    if (imgs) {
      ctx.drawImage(imgs.player, CANVAS_W / 2 - 32, CANVAS_H / 2 - 72, 64, 64);
    } else {
      ctx.fillStyle = '#f3f4f6'; ctx.font = 'bold 48px system-ui';
      ctx.fillText('NINJA', CANVAS_W / 2, CANVAS_H / 2 - 40);
    }

    // チュートリアル3行
    ctx.fillStyle = '#f3f4f6'; ctx.font = '15px system-ui'; ctx.textBaseline = 'top';
    const tutLines = [
      '口を開ける = ジャンプ',
      '頭を傾ける = 左右移動',
      '眉を上げる = 二段ジャンプ',
    ];
    tutLines.forEach((line, i) => {
      ctx.fillText(line, CANVAS_W / 2, CANVAS_H / 2 + 10 + i * 24);
    });

    ctx.fillStyle = '#9ca3af'; ctx.font = '16px system-ui'; ctx.textBaseline = 'middle';
    ctx.fillText('スタートボタンを押してください', CANVAS_W / 2, CANVAS_H / 2 + 110);
  }, [gameState, canvasRef]);

  return { gameState, score, highScore, maxCombo, startGame, stopGame };
}
