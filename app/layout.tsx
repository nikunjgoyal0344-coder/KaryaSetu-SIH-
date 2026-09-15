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
import AiChatbot from '@/components/AiChatbot';
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('karyasetu-theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-on-surface antialiased transition-colors relative">
        <AppProvider>
          <GoogleTranslate />
          <GovTopBanner />
          <LiveWallpaper />
          <RoleSwitcher />
          <Navbar />
          <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 md:pb-10 relative z-10">
            {children}
          </main>
          <MobileBottomNav />
          <AiChatbot />
          <GovFooter />
          <Analytics />
        </AppProvider>
      </body>
    </html>
  );
}
