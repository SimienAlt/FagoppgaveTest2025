import Navigation from "@/components/Navigation";
import { ReactNode } from "react";
import { GetSession } from "@/lib/session";
import { cookies } from "next/headers";
import EditPasswordForm from "@/components/EditPasswordForm";
import { redirect } from "next/navigation";
import DB from "@/lib/db";
const bcrypt = require('bcrypt');


export default async function UserLayout({ children }: { children: ReactNode }) {
    const session = await GetSession(await cookies());

    async function EditPassword(newPassword: string) {
        "use server"
        //sjekk at passord er minst 8 tegn
        if (newPassword.length < 8) return { Error: "Lengde på passord må være minst 8 tegn" }

        //hent session og sjekk at person er logget inn som bruker
        const session = await GetSession(await cookies());
        if (!session.isUser) {
            redirect("/");
            return;
        }

        //lag et hash av det nye passordet
        const hashedPwd = await bcrypt.hash(newPassword, 12);

        //oppdater passord og mabyttepassord på bruker i database
        const db = new DB;
        await db.Run`UPDATE bruker SET passord = ${hashedPwd}, mabyttepassord = false WHERE id = ${session.id}`;

        //Endre session.mabyttepassord til false
        session.mabyttepassord = false;
        await session.save();
    }

    return (
        <>
            {session.mabyttepassord &&
                <div style={{ position: "fixed", height: "100dvh", width: "100%", backgroundColor: "rgba(0,0,0,0.3)", top: "0", left: "0", zIndex: "100", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <div style={{ width: "600px", backgroundColor: "#626262", padding: "16px" }}>
                        <div style={{ width: "100%", textAlign: "center", color: "white", fontSize: "24px" }}>Du må bytte passord!</div>
                        <EditPasswordForm onSubmit={EditPassword} />
                    </div>
                </div>
            }
            <div className="logedin-layout">
                <Navigation links={[
                    { path: "/parkeringsoversikt", text: "Parkeringsoversikt" },
                    { path: "/biler", text: "Biler" },
                    { path: "/personalia", text: "Personalia" },
                ]} />
                {children}
            </div>
            <span className="admin-tag">Administrator</span>
        </>
    )
}