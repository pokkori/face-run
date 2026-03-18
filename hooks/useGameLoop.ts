"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import type { FaceInput } from './useFaceDetection';

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
interface Obstacle { id: number; lane: Lane; y: number; emoji: string; }
interface Particle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; }
export type GameState = 'idle' | 'playing' | 'dead';
interface GameData {
  player: Player; obstacles: Obstacle[]; particles: Particle[];
  score: number; speed: number; nextObstacleIn: number; obstacleId: number; elapsed: number;
}

const OBSTACLE_EMOJIS = ['🌳', '🏯', '💥', '🪨', '🗡️'];

function laneX(lane: Lane): number { return LANE_WIDTH * lane + LANE_WIDTH / 2; }
function randomLane(): Lane { return Math.floor(Math.random() * LANE_COUNT) as Lane; }
function randomObstacleInterval(): number {
  return OBSTACLE_INTERVAL_MIN + Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN);
}

function initGame(): GameData {
  return {
    player: { lane: 1, y: GROUND_Y, vy: 0, isJumping: false, canDoubleJump: false, isAlive: true },
    obstacles: [], particles: [], score: 0, speed: INITIAL_SPEED,
    nextObstacleIn: 1.5, obstacleId: 0, elapsed: 0,
  };
}

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  faceInputRef: React.RefObject<FaceInput>
) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameDataRef = useRef<GameData>(initGame());
  const gameStateRef = useRef<GameState>('idle');
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const touchStartXRef = useRef<number | null>(null);
  const jumpQueueRef = useRef({ jump: false, doubleJump: false });

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

  const drawEmoji = useCallback((ctx: CanvasRenderingContext2D, emoji: string, x: number, y: number, size: number) => {
    ctx.font = `${size}px serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(emoji, x, y);
  }, []);

  const update = useCallback((dt: number) => {
    const gd = gameDataRef.current; if (!gd.player.isAlive) return;
    gd.elapsed += dt;
    gd.score = Math.floor(gd.elapsed * 10 + (gd.speed - INITIAL_SPEED) * 0.5);
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
      gd.obstacles.push({ id: gd.obstacleId++, lane: randomLane(), y: -OBSTACLE_SIZE, emoji: OBSTACLE_EMOJIS[Math.floor(Math.random() * OBSTACLE_EMOJIS.length)] });
      gd.nextObstacleIn = randomObstacleInterval() * (INITIAL_SPEED / gd.speed);
    }
    const px = laneX(gd.player.lane); const py = gd.player.y;
    gd.obstacles = gd.obstacles.filter((obs) => {
      obs.y += gd.speed * dt; const ox = laneX(obs.lane);
      if (Math.abs(ox - px) < LANE_WIDTH * 0.5 && Math.abs(obs.y - py) < OBSTACLE_SIZE * 0.8) { gd.player.isAlive = false; spawnParticles(gd, px, py); return false; }
      return obs.y < CANVAS_H + OBSTACLE_SIZE;
    });
    gd.particles = gd.particles
      .map((p) => ({ ...p, x: p.x + p.vx * dt, y: p.y + p.vy * dt, vy: p.vy + 200 * dt, alpha: p.alpha - dt * 2 }))
      .filter((p) => p.alpha > 0);
  }, [faceInputRef, doJump, spawnParticles]);

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    const gd = gameDataRef.current;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    drawBackground(ctx, gd.elapsed);
    gd.obstacles.forEach((obs) => { drawEmoji(ctx, obs.emoji, laneX(obs.lane), obs.y, OBSTACLE_SIZE); });
    const px = laneX(gd.player.lane);
    const ss = Math.max(0, 1 - (GROUND_Y - gd.player.y) / CANVAS_H);
    ctx.save(); ctx.globalAlpha = 0.3 * ss; ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.ellipse(px, GROUND_Y + 4, PLAYER_SIZE * 0.4 * ss, 6 * ss, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    drawEmoji(ctx, '🥷', px, gd.player.y, PLAYER_SIZE);
    gd.particles.forEach((p) => { ctx.save(); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); });
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, CANVAS_W, 48);
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 20px system-ui'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(`Score: ${gd.score}`, 12, 24);
  }, [drawBackground, drawEmoji]);

  const loop = useCallback((time: number) => {
    if (gameStateRef.current !== 'playing') return;
    const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = time; const gd = gameDataRef.current;
    update(dt);
    const canvas = canvasRef.current;
    if (canvas) { const ctx = canvas.getContext('2d'); if (ctx) draw(ctx); }
    if (!gd.player.isAlive) {
      setScore(gd.score);
      setHighScore((hs) => { const n = Math.max(hs, gd.score); localStorage.setItem('facerun_highscore', String(n)); return n; });
      setGameState('dead'); gameStateRef.current = 'dead'; return;
    }
    setScore(gd.score); animFrameRef.current = requestAnimationFrame(loop);
  }, [update, draw, canvasRef]);

  const startGame = useCallback(() => {
    gameDataRef.current = initGame(); gameStateRef.current = 'playing'; setGameState('playing'); setScore(0);
    lastTimeRef.current = performance.now(); animFrameRef.current = requestAnimationFrame(loop);
  }, [loop]);

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
    ctx.fillStyle = '#f59e0b'; ctx.font = 'bold 28px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('フェイスラン', CANVAS_W / 2, CANVAS_H / 2 - 60);
    ctx.font = '64px serif'; ctx.fillText('🥷', CANVAS_W / 2, CANVAS_H / 2 + 10);
    ctx.fillStyle = '#f3f4f6'; ctx.font = '18px system-ui';
    ctx.fillText('スタートボタンを押してください', CANVAS_W / 2, CANVAS_H / 2 + 90);
  }, [gameState, canvasRef]);

  return { gameState, score, highScore, startGame, stopGame };
}
