import DB, { Parkeringsplass } from "@/lib/db";
import Link from "next/link";

export default async function Page() {
    //Henter parkeringsplasser fra database
    const db = new DB;
    const parkeringsplasser = await db.Get`SELECT parkeringsplass.id, parkeringsplass.navn, sum(etasjer.plasser) as plasser FROM parkeringsplass JOIN etasjer ON parkeringsplass.id = etasjer.parkeringsplass_id GROUP BY parkeringsplass.id` as Parkeringsplass[];
    return (
        <main>
            <div className="loged-in-heading">
                <h1>Parkeringsplasser</h1>
                <Link href="/admin/parkeringsplasser/ny">+ Legg til ny</Link>
            </div>
            <section className="main-content">
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Navn</th>
                            <th>Plasser</th>
                            <th>Vis mer</th>
                        </tr>
                        {parkeringsplasser.map((obj, index) => (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.navn}</td>
                                <td>{obj.plasser}</td>
                                <td><Link href={`/admin/parkeringsplasser/${obj.id}`}>Vis mer</Link></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );
}