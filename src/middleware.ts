import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  if (request.nextUrl.pathname.endsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/analytics', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
