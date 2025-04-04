import Link from "next/link";
import Client from "./client";
import { IsAdmin } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DB from "@/lib/db";
const bcrypt = require('bcrypt');

export default function Page() {
    async function onSubmit(
        username: string,
        password: string,
        phone: string,
        email: string,
        address: string,
        postcode: string,
        city: string
    ) {
        "use server"
        //Sjekk at bruker faktisk er logget inn som admin
        if (!(await IsAdmin(cookies()))) redirect("/admin");

        //Valider data fra skjema
        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof phone !== "string" ||
            typeof email !== "string" ||
            typeof address !== "string" ||
            typeof postcode !== "string" ||
            typeof city !== "string"
        ) return { Error: "Det er en feil i skjemaet" };

        if (/[^a-zA-Z0-9æøåÆØÅ]/.test(username)) return { Error: "Brukernavn kan kun bruke bokstaver og tall" };
        if (username.length < 6 || username.length > 50) return { Error: "Brukernavn må ha mellom 6 og 50 tegn" };

        if (password.length < 4) return { Error: "Passord må være minst 4 bokstaver" };

        if (!/^[0-9]{8}$/.test(phone)) return { Error: "Telefonnummer må være 8 siffre" };

        if (!/^([^@",\\. ]([^@",\\ ]{0,62}[^@",\\. ]|)|"[^"\\]{0,62}")@[a-zA-Z0-9.-]{1,253}\.[a-zA-Z]{2,63}$/.test(email)) return { Error: "Epost er ikke gyldig" };

        if (/[^a-zA-Z0-9æøåÆØÅ ]/.test(address)) return { Error: "Adresse må kun være kan kun bruke tall bokstaver og mellomrom" };
        if (address.length < 6 || address.length > 50) return { Error: "Adresse må være mellomm 6 og 50 tegn" };

        if (!/^[0-9]{4}$/.test(postcode)) return { Error: "Postkode må være 4 tall" };

        if (!/^[a-zA-ZæøåÆØÅ ]{4,50}$/.test(city)) return { Error: "Poststed må være 4 til 50 tegn og kunn bokstaver" };


        //Sjekk at det ikke allerede finnes en bruker med samme brukenavn
        const db = new DB;
        try {
            const res = await db.GetFirst`SELECT id FROM bruker WHERE brukernavn = ${username}`;
            return { Error: `Bruker med navn "${username}" finnes allerede` };
        } catch {
            console.log("Bruker finnes ikke")
        }

        //Lag hash av passord
        const hashedPwd = await bcrypt.hash(password, 12);

        //Lag bruker
        await db.Run`INSERT INTO bruker (brukernavn, passord, tlf, epost, address, postcode, city, mabyttepassord) VALUES (${username}, ${hashedPwd}, ${phone}, ${email}, ${address}, ${postcode}, ${city}, true)`;

        //videresender til brukerliste
        redirect("/admin/brukere");
    }
    return (
        <main>
            <div className="loged-in-heading">
                <h1>Ny bruker</h1>
                <Link href="/admin/brukere">Avbryt</Link>
            </div>
            <section className="main-content">
                <Client onSubmit={onSubmit} />
            </section>
        </main>
    );
}