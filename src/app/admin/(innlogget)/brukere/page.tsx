import DB, { Bruker } from "@/lib/db";
import Link from "next/link";


export default async function Page() {
    //Henter parkeringsplasser fra database
    const db = new DB;
    const brukere = await db.Get`SELECT id, brukernavn, tlf, epost FROM bruker` as Bruker[];
    return (
        <main>
            <div className="loged-in-heading">
                <h1>Brukere</h1>
                <Link href="/admin/brukere/ny">+ Legg til ny</Link>
            </div>
            <section className="main-content">
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Brukernavn</th>
                            <th>Tlf.</th>
                            <th>E-post</th>
                            <th>Vis mer</th>
                        </tr>
                        {brukere.map((obj, index) => (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.brukernavn}</td>
                                <td>{obj.tlf}</td>
                                <td>{obj.epost}</td>
                                <td><Link href={`/admin/brukere/${obj.id}`}>Vis mer</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}