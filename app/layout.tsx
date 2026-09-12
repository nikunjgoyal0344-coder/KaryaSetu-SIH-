import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import RoleSwitcher from '@/components/RoleSwitcher';
import Navbar from '@/components/Navbar';
import LiveWallpaper from '@/components/LiveWallpaper';
import MobileBottomNav from '@/components/MobileBottomNav';
import { Analytics } from '@vercel/analytics/react';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KaryaSetu - Academia–Industry Collaboration Portal',
  description: 'AI-Powered Academia-Industry Collaboration Portal for Skill Mapping, Internships, Placements, and Faculty Development with AYUSH Specialization.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50/70 dark:bg-slate-950/80 text-slate-900 dark:text-slate-100 antialiased transition-colors relative">
        <AppProvider>
          <LiveWallpaper />
          <RoleSwitcher />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 relative z-10">
            {children}
          </main>
          <MobileBottomNav />
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                <strong className="text-slate-800 dark:text-slate-200">KaryaSetu</strong> • Academia–Industry Collaboration Platform
              </p>
              <p className="text-slate-400 dark:text-slate-500">
                National Healthcare & AYUSH Skilling Ecosystem
              </p>
            </div>
          </footer>
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
