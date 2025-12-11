import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// All pages now physically exist - no restrictions needed
// Proxy only handles API route restrictions if needed

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all page routes since only demo pages exist now
  // Allow all static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/public') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/logos') ||
    !pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // All API routes are allowed for demo functionality
  return NextResponse.next();
}

// Configure which routes this proxy runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
