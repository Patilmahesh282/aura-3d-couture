import React, { useEffect, useState } from 'react';
import { ShoppingBag, Zap, Flame, Sparkles } from 'lucide-react';

export const LiveStockTicker: React.FC = () => {
  const notifications = [
    '🔥 Someone in Tokyo just purchased AURA Cyber Oversized Hoodie (Size M)!',
    '⚡ Only 3 units left for Vanguard Modular Tech Jacket (Size L)!',
    '✨ New 3D Decal unlocked: AURA Cyber Mesh Print applied!',
    '🎉 Customer in London earned +145 AuraPoints!',
    '🚀 Real-time stock stream active with 0.02s latency.'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % notifications.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-full border border-cyan-500/30 text-xs font-mono text-slate-200 shadow-xl transition-all animate-fadeIn">
      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
      <span className="line-clamp-1">{notifications[currentIndex]}</span>
    </div>
  );
};
