import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { GetSession } from './lib/session';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    //hopper over logginsider
    const noPermisionRequired = ['/', '/admin']
    if (noPermisionRequired.includes(request.nextUrl.pathname))
        return;

    //Requestcookies kan brukes, men de får en error i IDE (det fungerer fortsatt) legger på as unknown as ReadonlyRequestCookies
    const session = await GetSession(request.cookies as unknown as ReadonlyRequestCookies)

    if (request.nextUrl.pathname.startsWith('/admin/')) {
        //om du prøver å gå til en adminside sjekker den at du er admin, og om du ikke er det sender den deg til logginnsiden
        if (session.isAdmin) return;
        return NextResponse.redirect(new URL('/admin', request.url))
    } else {
        //om du prøver å gå til en brukerside sjekker den at du er bruker, og om du ikke er det sender den deg til logginnsiden
        if (session.isUser) return;
        return NextResponse.redirect(new URL('/', request.url))
    }
}

// Matcher alle sidene, men ikke statisk innhold.
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'
    ],
}