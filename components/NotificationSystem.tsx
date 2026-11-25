'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/store';
import { 
  Bell, 
  CheckCheck, 
  Building2, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function NotificationSystem() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'selection':
        return <Building2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />;
      case 'endorsement':
        return <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />;
      case 'verification':
        return <ShieldCheck className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-live="polite"
            className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs animate-pulse"
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          role="region"
          aria-label="Events and notifications"
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-900/20 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 px-4 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                Events & Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No active notifications
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => markNotificationRead(notif.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      markNotificationRead(notif.id);
                    }
                  }}
                  className={`p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-inset focus:ring-saffron ${
                    !notif.read ? 'bg-emerald-50/30 dark:bg-emerald-950/10' : ''
                  }`}
                >
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 mt-0.5 shrink-0">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <Link
                        href={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <span>View details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] text-slate-500">
            Core Processing Event Stream • Real-time Cross-Stakeholder Sync
          </div>
        </div>
      )}
    </div>
  );
}
