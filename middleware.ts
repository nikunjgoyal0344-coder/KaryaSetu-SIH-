import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
  "img-src 'self' data: blob: https://images.unsplash.com https://www.gstatic.com https://translate.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://generativelanguage.googleapis.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/**
 * Global Security Middleware
 * Attaches defense-in-depth HTTP security headers to all page and API responses.
 */
export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);

  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  if (req.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png).*)'],
};
