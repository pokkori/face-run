"use client";

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function A2HSBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 既にインストール済みまたは非表示済みならスキップ
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      localStorage.getItem('a2hs_dismissed')
    ) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    setIsIOS(ios);

    if (ios) {
      // iOSは5秒後に表示（Safari限定）
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('a2hs_dismissed', '1');
  };

  if (!showBanner || dismissed) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 z-50 bg-[#1a1060] border border-[#f59e0b]/40 rounded-2xl p-4 shadow-2xl shadow-purple-900/60 flex items-center gap-3"
      role="banner"
      aria-label="ホーム画面に追加"
    >
      <div className="flex-shrink-0">
        <svg viewBox="0 0 32 32" width={36} height={36}>
          <rect width="32" height="32" rx="8" fill="#f59e0b"/>
          <text x="16" y="22" textAnchor="middle" fontSize="18" fill="#0f0c29" fontWeight="bold">F</text>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-bold">ホーム画面に追加</p>
        {isIOS ? (
          <p className="text-gray-300 text-xs mt-0.5">
            下の共有ボタン
            <svg viewBox="0 0 16 16" width={12} height={12} fill="currentColor" className="inline mx-0.5 text-blue-400">
              <path d="M8 1v8M5 4l3-3 3 3M2 11v3h12v-3"/>
            </svg>
            →「ホーム画面に追加」
          </p>
        ) : (
          <p className="text-gray-300 text-xs mt-0.5">いつでも遊べる！ブラウザ不要</p>
        )}
      </div>
      {!isIOS && (
        <button
          onClick={handleInstall}
          className="flex-shrink-0 bg-[#f59e0b] text-[#0f0c29] font-bold text-sm px-3 py-2 rounded-xl min-h-[44px]"
          aria-label="ホーム画面に追加する"
        >
          追加
        </button>
      )}
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-gray-500 hover:text-gray-300 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="閉じる"
      >
        <svg viewBox="0 0 16 16" width={16} height={16} fill="currentColor">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </button>
    </div>
  );
}
