'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sparkles, Square } from 'lucide-react';

interface WallpaperToggleProps {
  className?: string;
  showLabels?: boolean;
}

export default function WallpaperToggle({
  className = '',
  showLabels = true,
}: WallpaperToggleProps) {
  const { wallpaperMode, setWallpaperMode } = useApp();

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 text-xs shadow-2xs ${className}`}
      role="group"
      aria-label="Background Wallpaper Switcher"
    >
      {/* Live Wallpaper Button */}
      <button
        type="button"
        onClick={() => setWallpaperMode('live')}
        title="Live Interactive Botanical/Particle Wallpaper"
        aria-label="Switch to live interactive botanical and particle wallpaper"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
          wallpaperMode === 'live'
            ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-xs border border-slate-200/70 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${wallpaperMode === 'live' ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
        {showLabels && <span>Live Wallpaper</span>}
      </button>

      {/* Plain Static Background Button */}
      <button
        type="button"
        onClick={() => setWallpaperMode('plain')}
        title="Plain Solid Matte Neutral Background (Zero Motion)"
        aria-label="Switch to plain solid neutral background with zero motion"
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all ${
          wallpaperMode === 'plain'
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs border border-slate-200/70 dark:border-slate-700'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Square className={`w-3.5 h-3.5 ${wallpaperMode === 'plain' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'}`} />
        {showLabels && <span>Plain</span>}
      </button>
    </div>
  );
}
