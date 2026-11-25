import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import { AppProvider } from '@/lib/store';
import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import GovTopBanner from '@/components/GovTopBanner';
import GovFooter from '@/components/GovFooter';
import { Analytics } from '@vercel/analytics/next';

// Defer heavy client-only overlays to reduce initial bundle weight and speed up hydration
const LiveWallpaper = dynamic(() => import('@/components/LiveWallpaper'), { ssr: false });
const GoogleTranslate = dynamic(() => import('@/components/GoogleTranslate'), { ssr: false });
const AiChatbot = dynamic(() => import('@/components/AiChatbot'), { ssr: false });
const ScrollProgressBar = dynamic(() => import('@/components/ScrollProgressBar'), { ssr: false });

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-navy-900 focus:text-white focus:font-bold focus:text-xs focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-saffron"
        >
          Skip to main content
        </a>
        <AppProvider>
          <ScrollProgressBar />
          <GoogleTranslate />
          <GovTopBanner />
          <LiveWallpaper />
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 pb-28 md:pb-10 relative z-10 focus:outline-none"
          >
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
