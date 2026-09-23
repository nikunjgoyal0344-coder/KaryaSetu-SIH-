'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useApp } from '@/lib/store';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

/**
 * GoogleTranslate Component
 * Note: Auto-translation is disabled.
 * The site only translates when the user explicitly clicks the Language button in the Navbar or Top Banner.
 */
export default function GoogleTranslate() {
  const { language } = useApp();
  const initializedRef = useRef(false);
  const firstRenderRef = useRef(true);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement && !initializedRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          'google_translate_element'
        );
        initializedRef.current = true;
      }
    };

    if (window.google?.translate?.TranslateElement && !initializedRef.current) {
      window.googleTranslateElementInit();
    }
  }, []);

  // Synchronize Google Translate only when language changes via button click
  useEffect(() => {
    // Skip auto-translating on first render if default language is English
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      if (language === 'en') {
        // Clear any Google Translate cookies on first load so page is never auto-translated
        if (typeof document !== 'undefined') {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'googtrans=/en/en; path=/;';
        }
        return;
      }
    }

    const applyTranslation = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        if (select.value !== language) {
          select.value = language;
          select.dispatchEvent(new Event('change'));
        }
      }
    };

    // When switching to English, also clean up the cookie
    if (language === 'en') {
      if (typeof document !== 'undefined') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=/en/en; path=/;';
        if (typeof window !== 'undefined' && window.location.hostname) {
          document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `googtrans=/en/en; path=/; domain=${window.location.hostname};`;
        }
      }
    }

    const t = setTimeout(applyTranslation, 300);
    return () => clearTimeout(t);
  }, [language]);

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }} aria-hidden="true" />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
