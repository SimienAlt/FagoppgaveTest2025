import Link from "next/link";
import Client from "./client";
import { GetSession, IsAdmin } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import DB, { Parkeringsplass, SelectResult } from "@/lib/db";

interface Etasje {
    name: string;
    plasser: string;
}

export default function Page() {
    async function onSubmit(name: string, price: number, etasjer: Etasje[]) {
        "use server"
        //Sjekker at bruker faktisk er logget inn som admin
        if (!(await IsAdmin(cookies()))) redirect("/admin");

        //Validerer data fra skjema
        if (typeof name !== "string" || name.length > 50) {
            return { Error: "Navn må være en text med max 50 bokstaver" };
        }

        if (typeof price !== "number" || Number.isNaN(price)) {
            return { Error: "Pris må være et tall" };
        }

        if (etasjer.some(obj => typeof obj.name !== "string" || obj.name.length > 10)) {
            return { Error: "Etasje navn må være en text med max 10 bokstaver" };
        }
        if (etasjer.some(obj => Number.isNaN(Number(obj.plasser)) || Number(obj.plasser) < 0)) {
            return { Error: "Etasje plasser må være et possitivt tall" };
        }

        const db = new DB;
        //Sjekker at det ikke allerede finnes en lik parkeringsplass
        try {
            await db.GetFirst`SELECT id FROM parkeringsplass where navn = ${name}`;
            return { Error: "Parkeringsplass finnes allerede" };
        } catch {
            console.log("Parkeingsplass finnes ikke")
        }

        //lager parkeringsplass
        let parkeringsplass: Parkeringsplass;
        try {
            await db.Run`INSERT INTO parkeringsplass (navn, pris) VALUES (${name}, ${price})`
            parkeringsplass = await db.GetFirst`SELECT id FROM parkeringsplass where navn = ${name}` as Parkeringsplass;
        } catch {
            return { Error: "Kunne ikke lage parkeringsplass" };
        }

        //lager etasjer
        etasjer.forEach(async (obj) => {
            await db.Run`INSERT INTO etasjer (navn, parkeringsplass_id, plasser) VALUES (${obj.name}, ${parkeringsplass.id}, ${obj.plasser})`;
        })

        //videresender
        redirect("/admin/parkeringsplasser");
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>Ny parkeringsplass</h1>
                <Link href="/admin/parkeringsplasser">Avbryt</Link>
            </div>
            <section className="main-content">
                <Client onSubmit={onSubmit} />
            </section>
        </main>
    );
}