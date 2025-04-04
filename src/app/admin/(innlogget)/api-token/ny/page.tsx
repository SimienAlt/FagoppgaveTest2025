import Link from "next/link";
import Client from "./client";
import { IsAdmin } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DB from "@/lib/db";
const bcrypt = require('bcrypt');


export default function Page() {

    async function onSubmit(username: string, password: string) {
        "use server"
        //sjekk at bruker er admin
        if (!(await IsAdmin(cookies()))) redirect("/admin");

        //sjekk at brukenavn og passord er gyldig 
        if (typeof username !== "string" || !/^[a-zA-Z0-9_.@]{2,45}$/.test(username)) return { Error: "Ugyldig brukernavn" };
        if (typeof password !== "string" || password.length < 8) return { Error: "Passord må være minst 8 tegn" };

        //sjekk at brukernavn ikke er brukt
        const db = new DB;
        try {
            await db.GetFirst`SELECT id FROM api_token WHERE brukernavn = ${username}`;
            return { Error: `api_token med navn "${username}" finnes allerede` };
        } catch {
            console.log("api_token finnes ikke")
        }

        //lag et hash av passordet
        const hashedPwd = await bcrypt.hash(password, 12);

        //insert navn og hash i databasen
        await db.Run`INSERT INTO api_token (brukernavn, passord) VALUES (${username}, ${hashedPwd})`;

        //videresend til liste over passord
        redirect("/admin/api-token");
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>Ny API Token</h1>
                <Link href="/admin/api-token">Avbryt</Link>
            </div>
            <section className="main-content">
                <Client onSubmit={onSubmit} />
            </section>
        </main>
    );
}