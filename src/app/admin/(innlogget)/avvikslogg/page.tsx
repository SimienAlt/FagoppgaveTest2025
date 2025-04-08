import DB, { Avvikslogg } from "@/lib/db";

export default async function Page() {
    const db = new DB;
    const avvikslogg = await db.Get`SELECT * FROM avvikslogg ORDER BY tidspunkt DESC` as Avvikslogg[];
    return (
        <main>
            <div className="loged-in-heading">
                <h1>Avvikslogg</h1>
            </div>
            <section className="main-content">
                <table cellSpacing="0">
                    <tbody>
                        <tr>
                            <th>ID</th>
                            <th>Regnr.</th>
                            <th>Melding</th>
                            <th>Tidspunkt</th>
                            <th>Parkeringsplass</th>
                        </tr>
                        {avvikslogg.map((obj, index) => (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.regnr}</td>
                                <td>{obj.melding}</td>
                                <td>{obj.tidspunkt ? formatDateTime(obj.tidspunkt) : undefined}</td>
                                <td>{obj.parkeringsplass_id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </main>
    );

    function formatDateTime(dateTime: Date): String {
        return dateTime.getDate() + "." + (dateTime.getMonth() + 1) + "." + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
    }
}