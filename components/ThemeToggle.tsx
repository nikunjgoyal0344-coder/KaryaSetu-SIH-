'use client';

import React from 'react';
import { useApp } from '@/lib/store';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

export default function ThemeToggle({ showLabel = false, className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useApp();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className={`flex items-center gap-2 p-2 rounded-xl transition-all border ${
        theme === 'dark'
          ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700 shadow-xs'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-xs'
      } ${className}`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-90 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-90 duration-300" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
}
