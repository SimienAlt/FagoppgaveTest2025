import DB, { ApiToken } from "@/lib/db";
import Link from "next/link";
import Deletebtn from "@/components/Deletebtn";


export default async function Page() {
    //Henter parkeringsplasser fra database
    const db = new DB;
    const tokener = await db.Get`SELECT id, brukernavn FROM api_token` as ApiToken[];

    async function Delete(id: number) {
        "use server"
        const db = new DB;
        await db.Run`DELETE FROM api_token WHERE id = ${id}`;
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>API Token</h1>
                <Link href="/admin/api-token/ny">+ Legg til ny</Link>
            </div>
            <section className="main-content">
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Brukernavn</th>
                            <th>Slett</th>
                        </tr>
                        {tokener.map((obj, index) => (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.brukernavn}</td>
                                <td><Deletebtn id={obj.id} onDelete={Delete} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}