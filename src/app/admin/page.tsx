import LoginForm from "@/components/LoginForm";
import DB, { Administrator } from "@/lib/db";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { GetSession } from "@/lib/session";
const bcrypt = require('bcrypt');


export default function Page() {

    async function onSubmit(username: string, pwd: string) {
        "use server"
        //Oppreter databasekobling
        const db = new DB;

        //Henter admin fra database basert på brukernavn
        let adminuser: Administrator;
        try {
            adminuser = await db.GetFirst`SELECT * FROM administrator WHERE brukernavn = ${username}` as Administrator;
        } catch {
            return { Error: "Brukernavn eller passord er feil" }
        }

        //Sjekker at passord er rett
        if (await bcrypt.compare(pwd, adminuser.passord)) {
            //Setter session
            const session = await GetSession(await cookies());
            session.isAdmin = true;
            session.isUser = false;
            session.id = adminuser.id;
            session.mabyttepassord = false;
            await session.save();

            //redirecter til adminside
            redirect("/admin/parkeringsplasser");
        } else {
            return { Error: "Brukernavn eller passord er feil" }
        }

    }
    return (
        <main>
            <LoginForm onSubmit={onSubmit} />
        </main>
    );
}