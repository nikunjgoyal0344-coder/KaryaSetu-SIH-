import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import RoleSwitcher from '@/components/RoleSwitcher';
import Navbar from '@/components/Navbar';
import LiveWallpaper from '@/components/LiveWallpaper';
import MobileBottomNav from '@/components/MobileBottomNav';
import GovTopBanner from '@/components/GovTopBanner';
import GovFooter from '@/components/GovFooter';
import GoogleTranslate from '@/components/GoogleTranslate';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KaryaSetu - National Ayush & Life Sciences Skill-to-Career Verification Grid',
  description: 'AI-Powered National Centralized Academia-Industry Collaboration Portal for Skill Mapping, Internships, Placements, and Faculty Development.',
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
      <body className="min-h-screen flex flex-col bg-surface text-on-surface antialiased transition-colors relative">
        <AppProvider>
          <GoogleTranslate />
          <GovTopBanner />
          <LiveWallpaper />
          <RoleSwitcher />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 md:pb-10 relative z-10">
            {children}
          </main>
          <MobileBottomNav />
          <GovFooter />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
