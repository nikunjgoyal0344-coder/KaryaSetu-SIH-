'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useApp } from '@/lib/store';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export default function GoogleTranslate() {
  const { language } = useApp();
  const pathname = usePathname();
  const initializedRef = useRef(false);

  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement && !initializedRef.current) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false,
          },
          'google_translate_element'
        );
        initializedRef.current = true;
      }
    };

    // If script was already loaded in prior navigation, re-init if needed
    if (window.google?.translate?.TranslateElement && !initializedRef.current) {
      window.googleTranslateElementInit();
    }
  }, []);

  // Synchronize Google Translate dropdown with store language
  useEffect(() => {
    const applyTranslation = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        if (select.value !== language) {
          select.value = language;
          select.dispatchEvent(new Event('change'));
        }
      }
    };

    const t1 = setTimeout(applyTranslation, 300);
    const t2 = setTimeout(applyTranslation, 800);
    const t3 = setTimeout(applyTranslation, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [language, pathname]);

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
