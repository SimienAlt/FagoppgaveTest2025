import DB, { ApiToken } from "@/lib/db";
const bcrypt = require('bcrypt');

export function WrongTypeError(field: string, expectedType: "string" | "number" | "boolean") {
    return CreateResponse({ success: false, error: `"${field}" should be of type "${expectedType}"`, displayError: "Noe gikk galt" }, 400);
}

export function MissingFieldError(fieldname: string) {
    return CreateResponse({ success: false, error: `"${fieldname}" is missing from JSON body`, displayError: "Noe gikk galt" }, 400);
}

export function CreateResponse(body: object, status: number) {
    return new Response(JSON.stringify(body), {
        status: status,
        headers: { 'Content-Type': 'application/json', },
    })
}

export async function AuthorizeRequest(headers: Headers): Promise<boolean> {
    try {
        //hent authorization header
        if (!headers.has("authorization")) return false;
        const authorization = headers.get("authorization")?.replace("Basic ", "");
        if (authorization === null || authorization === undefined) return false;

        //dekod authorization headern
        const decoded = Buffer.from(authorization, 'base64').toString('ascii');
        const [username, password] = decoded.split(":");

        //Finn api_token basert på brukenavn
        const db = new DB;
        const dbData = await db.GetFirst`SELECT id, passord FROM api_token WHERE brukernavn = ${username}` as ApiToken;

        //sjekk om passord er korrekt
        return await bcrypt.compare(password, dbData.passord)
    } catch (error: any) {
        console.error(error.message);
        return false;
    }
}