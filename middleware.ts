import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;

    if (pathname === '/dashboard/login') {
      return NextResponse.next();
    }

    if (req.nextauth.token?.role !== 'ADMIN') {
      const loginUrl = new URL('/dashboard/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname === '/dashboard/login') {
          return true;
        }
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: ['/dashboard/:path*']
};
