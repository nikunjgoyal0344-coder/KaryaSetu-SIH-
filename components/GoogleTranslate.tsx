'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { useApp } from '@/lib/store';
import { usePathname } from 'next/navigation';

interface GoogleTranslateInstance {
  translate?: {
    TranslateElement?: new (
      options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
      elementId: string
    ) => unknown;
  };
}

declare global {
  interface Window {
    google?: GoogleTranslateInstance;
    googleTranslateElementInit?: () => void;
  }
}

/**
 * GoogleTranslate Component
 * Auto-translation is disabled on initial load.
 * Full-site text changes only when the user clicks the Language toggle button.
 */
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

    if (window.google?.translate?.TranslateElement && !initializedRef.current) {
      window.googleTranslateElementInit();
    }
  }, []);

  // When user switches to 'hi', translate full site text (including on page navigation)
  useEffect(() => {
    if (language === 'hi') {
      const applyHindi = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          if (select.value !== 'hi') {
            select.value = 'hi';
            select.dispatchEvent(new Event('change'));
          }
        }
      };

      const t1 = setTimeout(applyHindi, 250);
      const t2 = setTimeout(applyHindi, 700);
      const t3 = setTimeout(applyHindi, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      // When on English, make sure no translation is forced
      const resetEnglish = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select && select.value !== 'en' && select.value !== '') {
          select.value = 'en';
          select.dispatchEvent(new Event('change'));
        }
      };

      const t = setTimeout(resetEnglish, 200);
      return () => clearTimeout(t);
    }
  }, [language, pathname]);

  return (
    <>
      <div
        id="google_translate_element"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <Script
        id="google-translate-script"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  );
}
