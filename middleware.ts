import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasSessionCookie(request: NextRequest): boolean {
  const names = [
    'better-auth.session_token',
    '__Secure-better-auth.session_token',
    'better-auth.session_data',
    '__Secure-better-auth.session_data',
  ];
  return names.some(name => request.cookies.has(name));
}

export function middleware(request: NextRequest) {
  const isProtected =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/ministry') ||
    request.nextUrl.pathname.startsWith('/minister') ||
    request.nextUrl.pathname.startsWith('/meetings');

  if (isProtected && !hasSessionCookie(request)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/ministry/:path*', '/minister/:path*', '/meetings/:path*'],
};
