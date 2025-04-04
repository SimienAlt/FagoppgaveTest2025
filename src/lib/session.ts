import { getIronSession, IronSession } from "iron-session";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface SessionData {
    isAdmin: boolean;
    isUser: boolean;
    id: number;
    mabyttepassord: boolean;
}

export async function GetSession(cookies: ReadonlyRequestCookies): Promise<IronSession<SessionData>> {
    const session = await getIronSession<SessionData>(cookies, {
        password: process.env.SESSION_PWD as string,
        cookieName: "session",
        cookieOptions: { maxAge: "session" }
    });

    return session;
}

export async function IsAdmin(cookies: ReadonlyRequestCookies | Promise<ReadonlyRequestCookies>) {
    const session = await GetSession(await cookies);
    return session.isAdmin;
}

export async function IsUser(cookies: ReadonlyRequestCookies | Promise<ReadonlyRequestCookies>) {
    const session = await GetSession(await cookies);
    return session.isUser;
}