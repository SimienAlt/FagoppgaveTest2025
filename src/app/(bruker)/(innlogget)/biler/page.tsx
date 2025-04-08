import Deletebtn from "@/components/Deletebtn";
import DB, { Bil } from "@/lib/db";
import { GetSession } from "@/lib/session";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Page() {
    const session = await GetSession(await cookies());
    const db = new DB;
    const biler = await db.Get`SELECT id, regnr FROM bil WHERE bruker_id = ${session.id}` as Bil[];

    async function Delete(id: number) {
        "use server"
        const session = await GetSession(await cookies());
        const db = new DB;
        await db.Run`DELETE FROM bil WHERE id = ${id} AND bruker_id = ${session.id}`;
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>Biler</h1>
                <Link href="/biler/ny">+ Legg til ny</Link>
            </div>
            <section className="main-content">
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Regnr</th>
                            <th>Slett</th>
                        </tr>
                        {biler.map((obj, index) => (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.regnr}</td>
                                <td><Deletebtn id={obj.id} onDelete={Delete} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}