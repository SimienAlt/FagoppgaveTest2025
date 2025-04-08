import DB, { Bil, Parkering, Parkeringsplass } from "@/lib/db";
import { NextRequest } from "next/server";
import { AuthorizeRequest, CreateResponse, MissingFieldError, WrongTypeError } from "../helpers";


export async function POST(request: NextRequest) {
    const headers = new Headers(request.headers);

    //Sjekker autorisering
    if (!await AuthorizeRequest(headers)) {
        return CreateResponse({ success: false, error: "Authorization is invalid or missing", displayError: "Noe gikk galt" }, 401);
    }

    //henter json body
    let json;
    try {
        json = await request.json();
    } catch {
        return CreateResponse({ success: false, error: "Expected a json body", displayError: "Noe gikk galt" }, 400);
    }

    //Sjekker at verdier i felt er til stede og av rett type
    if (!("regnr" in json)) return MissingFieldError("regnr");
    if (!("parkeringsplass" in json)) return MissingFieldError("parkeringsplass");
    if (typeof json.regnr !== "string") return WrongTypeError("regnr", "string");
    if (typeof json.parkeringsplass !== "number") return WrongTypeError("parkeringsplass", "number");

    const db = new DB;

    //Sjekker at parkeringsplass finnes
    let parkeringsplass: Parkeringsplass;
    try {
        parkeringsplass = await db.GetFirst`SELECT id, pris FROM parkeringsplass WHERE id = ${json.parkeringsplass}`
    } catch {
        return CreateResponse({ success: false, error: "Car does not have an active parking at the specified parkinglot", displayError: "Noe gikk galt" }, 400);
    }

    //Sjekker at bil finnes og henter ID-en til bilen
    let car: Bil;
    try {
        car = await db.GetFirst`SELECT id FROM bil WHERE regnr = ${json.regnr}`;
    } catch {
        await db.Run`INSERT INTO avvikslogg (regnr, melding, tidspunkt, parkeringsplass_id) VALUES (${json.regnr}, 'Car not found at attempted arrival', ${new Date(new Date().toISOString())}, ${json.parkeringsplass})`
        return CreateResponse({ success: true, carExists: false }, 200);
    }

    //Finn bil sin aktive parkeing
    let parkering: Parkering;
    try {
        parkering = await db.GetFirst`SELECT id, startdatotid FROM parkering WHERE bil_id = ${car.id} AND sluttdatotid IS null AND parkeringsplass_id = ${json.parkeringsplass}`
    } catch {
        return CreateResponse({ success: false, error: "Car does not have an active parking", displayError: "Noe gikk galt" }, 400);
    }

    const sluttdatotid = new Date(new Date().toISOString());

    //Beregn hvor lenge bilen har stått parkert
    if (parkering.startdatotid === undefined) return CreateResponse({ success: false, error: "Somthing went wrong", displayError: "Noe gikk galt" }, 500);
    const millisecondDiff = sluttdatotid.getTime() - parkering.startdatotid.getTime();
    const secondDiff = millisecondDiff / 1000;
    const minuteDiff = Math.round(secondDiff / 60);

    //Beregn pris
    if (parkeringsplass.pris === undefined) return CreateResponse({ success: false, error: "Somthing went wrong", displayError: "Noe gikk galt" }, 500);
    const price = parkeringsplass.pris * Math.ceil(minuteDiff / 30);


    //Oppdater parkering med sluttdatotid og pris
    await db.Run`UPDATE parkering SET pris = ${price}, sluttdatotid = ${sluttdatotid} WHERE id = ${parkering.id}`;

    return CreateResponse({ success: true }, 200);
}

