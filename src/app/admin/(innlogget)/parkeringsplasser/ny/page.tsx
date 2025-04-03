import Link from "next/link";
import Client from "./client";
import { GetSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';
import DB, { Parkeringsplass, SelectResult } from "@/lib/db";

interface Etasje {
    name: string;
    plasser: string;
}

export default function Page() {
    async function onSubmit(name: string, etasjer: Etasje[]) {
        "use server"
        const session = await GetSession(await cookies());
        if (!session.isAdmin) redirect("/admin");

        if (typeof name !== "string" || name.length > 50) {
            return { Error: "Navn må være en text med max 50 bokstaver" };
        }

        if (etasjer.some(obj => typeof obj.name !== "string" || obj.name.length > 10)) {
            return { Error: "Etasje navn må være en text med max 10 bokstaver" };
        }

        if (etasjer.some(obj => Number.isNaN(Number(obj.plasser)) || Number(obj.plasser) < 0)) {
            return { Error: "Etasje plasser må være et possitivt tall" };
        }

        const db = new DB;
        try {
            await db.GetFirst`SELECT id FROM parkeringsplass where navn = ${name}`;
            return { Error: "Parkeringsplass finnes allerede" };
        } catch {
            console.log("Parkeingsplass finnes ikke")
        }

        let parkeringsplass: Parkeringsplass;

        try {
            await db.Run`INSERT INTO parkeringsplass (navn) VALUES (${name})`
            parkeringsplass = await db.GetFirst`SELECT id FROM parkeringsplass where navn = ${name}` as Parkeringsplass;
        } catch {
            return { Error: "Kunne ikke lage parkeringsplass" };
        }

        etasjer.forEach(async (obj) => {
            await db.Run`INSERT INTO etasjer (navn, parkeringsplass_id, plasser) VALUES (${obj.name}, ${parkeringsplass.id}, ${obj.plasser})`;
        })

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