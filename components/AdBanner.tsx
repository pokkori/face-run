"use client";

export function AdBanner() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!clientId) {
    return (
      <div className="w-full h-[60px] bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-xs">広告スペース（AdSense設定後に表示）</span>
      </div>
    );
  }
  return (
    <ins
      className="adsbygoogle block"
      style={{ display: 'block', minHeight: '60px' }}
      data-ad-client={clientId}
      data-ad-slot="AUTO"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
