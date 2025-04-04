import LoginForm from "@/components/LoginForm";
import DB, { Bruker } from "@/lib/db";
import { redirect } from 'next/navigation';
import { cookies } from "next/headers";
import { GetSession } from "@/lib/session";
const bcrypt = require('bcrypt');


export default function Page() {

  async function onSubmit(username: string, pwd: string) {
    "use server"
    //Oppreter databasekobling
    const db = new DB;

    //Hent bruker basert på brukernavn
    let user: Bruker;
    try {
      user = await db.GetFirst`SELECT id, passord, mabyttepassord FROM bruker WHERE brukernavn = ${username}` as Bruker;
    } catch {
      return { Error: "Brukernavn eller passord er feil" }
    }

    //Sjekk at passord er rett
    if (await bcrypt.compare(pwd, user.passord)) {
      //Sett session
      const session = await GetSession(await cookies());
      session.isAdmin = false;
      session.isUser = true;
      session.id = user.id;
      session.mabyttepassord = user.mabyttepassord ?? false;
      await session.save();

      //redirect til brukerside
      redirect("/parkeringsoversikt");
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