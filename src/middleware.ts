import { NextResponse, type NextRequest } from 'next/server';
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
}