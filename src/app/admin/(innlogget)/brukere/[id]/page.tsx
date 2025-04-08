import DB, { Bil, Bruker, Parkering } from "@/lib/db";
import Link from "next/link";
import Client from "./client";

export default async function Page({ params, }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const db = new DB;
    const user = await db.GetFirst`SELECT id, brukernavn, tlf, epost, address, postcode, city FROM bruker WHERE id = ${id}` as Bruker;
    const biler = await db.Get`SELECT id, regnr FROM bil WHERE bruker_id = ${id}` as Bil[];


    async function GetParkeringer(id: number, year: number) {
        "use server"
        if (isNaN(year)) {
            return { Error: "year is not a number" };
        }

        if (year < 2025) {
            return { Error: "year is must be atleast 2025" };
        }


        const db = new DB;
        const biler = await db.Get`SELECT id FROM bil WHERE bruker_id = ${id}` as Bil[];
        const carIds = biler.map(o => o.id);

        let query = "SELECT parkering.id, bil.regnr, parkering.startdatotid, parkering.sluttdatotid, parkering.pris ";
        query += "FROM parkering INNER JOIN bil ON parkering.bil_id = bil.id "
        query += "WHERE bil_id IN (" + Array.from({ length: carIds.length }, (v, i) => " $ ").join(",") + ") ";
        query += "AND sluttdatotid > $ ";
        query += "AND sluttdatotid < $ ";

        const parkings = await db.GetString(query, [...carIds, new Date(year, 0, 1, 0, 0, 0, 0), new Date(year, 11, 31, 23, 59, 59, 999)]) as Parkering[];
        return parkings;
    }

    return (
        <main>
            <div className="loged-in-heading">
                <h1>{user.brukernavn}</h1>
                <Link href="/admin/brukere">Oversikt</Link>
            </div>
            <section className="main-content" style={{ gap: "32px" }}>
                <div style={{ color: "white", width: "100%" }}>
                    <h2 style={{ fontSize: "32px", margin: "0px 0px 8px" }}>Kontakt</h2>
                    <div style={{ listStyle: "none", display: "flex", gap: "8px", flexDirection: "column", fontSize: "18px" }}>
                        <span>Tlf: <Link style={{ color: "white" }} href={`tel:${user.tlf}`}>{user.tlf}</Link></span>
                        <span>Epost: <Link style={{ color: "white" }} href={`mailto:${user.epost}`}>{user.epost}</Link></span>
                        <span>Adresse: {user.address}, {user.postcode} {user.city}</span>
                    </div>
                </div>
                <div style={{ color: "white", width: "100%" }}>
                    <h2 style={{ fontSize: "32px", margin: "0px 0px 8px" }}>Biler</h2>
                    <table cellSpacing={0}>
                        <tbody>
                            <tr>
                                <th>ID</th>
                                <th>Regnr</th>
                            </tr>
                            {biler.map((obj, index) => (
                                <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                    <td>{obj.id}</td>
                                    <td>{obj.regnr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div style={{ color: "white", width: "100%" }}>
                    <h2 style={{ fontSize: "32px", margin: "0px 0px 8px" }}>Last ned parkeringer for år</h2>
                    <Client GetParkeringer={GetParkeringer} username={`${user.brukernavn}`} id={Number(id)} />
                </div>
            </section>
        </main>
    );
}