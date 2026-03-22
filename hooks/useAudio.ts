"use client";

import { useRef, useCallback } from 'react';

export function useBGM() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const startBGM = useCallback(() => {
    if (bgmRef.current) return; // already playing
    try {
      const audio = new Audio('/sounds/bgm_play.mp3');
      audio.loop = true;
      audio.volume = 0.4;
      audio.play().catch(() => {}); // autoplay policy safe
      bgmRef.current = audio;
    } catch (e) {
      // MP3ファイル未配置時はスキップ
    }
  }, []);

  const stopBGM = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = !bgmRef.current.muted;
      return bgmRef.current.muted;
    }
    return false;
  }, []);

  return { startBGM, stopBGM, toggleMute };
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // 回避SE: 短い上昇ピング
  const playDodge = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(660, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.12);
  }, [getCtx]);

  // コンボSE: 2音ピング
  const playCombo = useCallback((level: 2 | 3) => {
    const ctx = getCtx(); if (!ctx) return;
    const freqs = level === 3 ? [880, 1320, 1760] : [880, 1320];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.07;
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      osc.start(t); osc.stop(t + 0.15);
    });
  }, [getCtx]);

  // ゲームオーバーSE: 下降音
  const playGameOver = useCallback(() => {
    const ctx = getCtx(); if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
  }, [getCtx]);

  // AudioContext.resume（ユーザー操作時に呼ぶ）
  const resume = useCallback(() => { getCtx(); }, [getCtx]);

  return { playDodge, playCombo, playGameOver, resume };
}
