import Link from "next/link";
import Client from "./client";
import { GetSession } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DB from "@/lib/db";


export default function Page() {

    async function onSubmit(regnr: string) {
        "use server"
        regnr = regnr.toUpperCase();

        //valider regnr
        if (!/[A-Z]{2}[0-9]{4,5}/.test(regnr)) return { Error: "ugyldig regnr" }

        //sjekk at regnr ikke er i bruk
        const db = new DB;
        try {
            await db.GetFirst`SELECT id FROM bil WHERE regnr = ${regnr}`;
            return { Error: `Regnr med navn "${regnr}" finnes allerede` };
        } catch {
            console.log("regnr finnes ikke")
        }

        //hent brukerid fra session
        const session = await GetSession(await cookies());
        if (!session.isUser) redirect("/");

        //insert bil
        await db.Run`INSERT INTO bil (bruker_id, regnr) VALUES (${session.id}, ${regnr})`;

        //videresend til oversikt over biler
        redirect("/biler");
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>Ny bil</h1>
                <Link href="/biler">Avbryt</Link>
            </div>
            <section className="main-content">
                <Client onSubmit={onSubmit} />
            </section>
        </main>
    );
}