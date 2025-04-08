import DB, { Bil } from "@/lib/db";
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
    const etasje: number | null = typeof json.etasje === "number" ? json.etasje : null;

    const db = new DB;

    //Sjekker at parkeringsplass finnes
    if (!await db.ItemExists`SELECT id FROM parkeringsplass WHERE id = ${json.parkeringsplass}`) {
        return CreateResponse({ success: false, error: "Parkinglot does not exist", displayError: "Noe gikk galt" }, 400);
    }

    //Sjekker at bil finnes og henter ID-en til bilen
    let car: Bil;
    try {
        car = await db.GetFirst`SELECT id FROM bil WHERE regnr = ${json.regnr}`;
    } catch {
        await db.Run`INSERT INTO avvikslogg (regnr, melding, tidspunkt, parkeringsplass_id) VALUES (${json.regnr}, 'Car not found at attempted arrival', ${new Date(new Date().toISOString())}, ${json.parkeringsplass})`
        return CreateResponse({ success: true, carExists: false }, 200);
    }

    //Sjekker at bil ikke har noen aktive parkeringer
    if (await db.ItemExists`SELECT id FROM parkering WHERE bil_id = ${car.id} AND sluttdatotid IS null`) {
        await db.Run`INSERT INTO avvikslogg (regnr, melding, tidspunkt, parkeringsplass_id) VALUES (${json.regnr}, 'Car attempted arival while having a active parking', ${new Date(new Date().toISOString())}, ${json.parkeringsplass})`
        return CreateResponse({ success: false, error: `Car with regnr "${json.regnr}" allredy has an active parking`, displayError: "Noe gikk galt" }, 400);
    }

    //lagrer parkering
    await db.Run`INSERT INTO parkering (startdatotid, parkeringsplass_id, bil_id, etasjer_id) VALUES (${new Date(new Date().toISOString())}, ${json.parkeringsplass}, ${car.id}, ${etasje})`;
    return CreateResponse({ success: true, carExists: true }, 200);
}

