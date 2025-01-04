import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES } from './utils/route';

export function middleware(req: NextRequest) {
    const cookie = req.cookies.get('isLogin');
    const url = req.nextUrl;
    if (cookie) {
        if (url.pathname !== ROUTES.HOME) {
            return NextResponse.redirect(new URL(ROUTES.HOME, url));
        }
    } else {
        if (url.pathname !== ROUTES.LOGIN) {
            return NextResponse.redirect(new URL(ROUTES.LOGIN, url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'],
};
