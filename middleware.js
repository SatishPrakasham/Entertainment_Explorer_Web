import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware: Processing request for', pathname);
  
  // Since Firebase auth is primarily client-side, we'll be permissive here
  // and let the React components (AuthContext) handle the real authentication checks
  // This prevents issues with server-side middleware not having access to client-side auth state
  
  console.log('Middleware: Allowing request to proceed - client-side auth will handle protection');
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
