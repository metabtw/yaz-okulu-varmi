/**
 * Next.js Middleware - Rota bazlı erişim kontrolü.
 * /dashboard altındaki tüm rotalar sunucu tarafında korunur.
 * Token yoksa -> /login'e yönlendir
 * STUDENT rolü -> /'e yönlendir
 * UNIVERSITY ama PENDING -> /pending'e yönlendir
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** JWT payload'ını decode eder (doğrulama olmadan, sadece okuma) */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    // Base64Url decode
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Cookie'den token al
  const token = request.cookies.get('token')?.value;

  // ---- Dashboard rotaları korumalı ----
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwtPayload(token);
    if (!payload) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }

    const role = payload.role as string;
    const status = payload.status as string;

    // STUDENT rolü sadece /dashboard/student'e erişebilir
    if (role === 'STUDENT') {
      if (!pathname.startsWith('/dashboard/student')) {
        return NextResponse.redirect(new URL('/dashboard/student', request.url));
      }
      return NextResponse.next();
    }

    // UNIVERSITY/ADMIN: /dashboard/student'e erişemez
    if (pathname.startsWith('/dashboard/student') && role !== 'STUDENT') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // UNIVERSITY rolü ama PENDING/APPROVED (henüz ACTIVE değil) -> onay sayfasına
    if (role === 'UNIVERSITY' && status !== 'ACTIVE') {
      if (pathname !== '/pending') {
        return NextResponse.redirect(new URL('/pending', request.url));
      }
    }

    // REJECTED kullanıcılar -> login'e
    if (status === 'REJECTED') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ---- Pending sayfası: sadece PENDING kullanıcılar görebilir ----
  if (pathname === '/pending') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const payload = decodeJwtPayload(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Zaten ACTIVE ise dashboard'a yönlendir
    if ((payload.status as string) === 'ACTIVE') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // ---- Login/Register: giriş yapmış kullanıcılar erişmesin ----
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      const payload = decodeJwtPayload(token);
      if (payload && (payload.status as string) === 'ACTIVE') {
        const role = payload.role as string;
        const redirectUrl = role === 'STUDENT' ? '/dashboard/student' : '/dashboard';
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register', '/pending'],
};
