import { NextResponse, type NextRequest } from 'next/server';

const AUTH_REQUIRED = ['/dashboard', '/videos', '/biblioteca', '/professor', '/admin', '/perfil'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('volt_session');
  const isAdmin = request.cookies.has('volt_is_admin');

  // Vídeos estáticos da landing (public/videos/*) — não confundir com /videos/[id]
  if (/^\/videos\/[^/]+\.(mp4|webm|mov)$/i.test(pathname)) {
    return NextResponse.next();
  }

  // /admin exige login + flag de administrador
  if (pathname.startsWith('/admin')) {
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  const needsAuth = AUTH_REQUIRED.some((p) => pathname.startsWith(p));
  if (needsAuth && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/videos/:path*', '/biblioteca/:path*', '/professor/:path*', '/admin/:path*', '/perfil/:path*'],
};
