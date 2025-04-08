import DB, { Bil, Parkering } from "@/lib/db";
import { GetSession } from "@/lib/session";
import { cookies } from "next/headers";
import Client from "./client";

export default async function Page() {
    async function GetParkings({ carFilter, fromDate, toDate }: { carFilter?: number, fromDate?: Date, toDate?: Date }) {
        "use server"
        //Henter session
        const session = await GetSession(await cookies());
        const db = new DB;

        //Henter liste over biler som tilhører bruker
        const cars = await db.Get`SELECT id, regnr FROM bil WHERE bruker_id = ${session.id}` as Bil[];
        const carIds = cars.map(bil => Number(bil.id));

        //Filtrer liste over biler basert på filter
        let filteredCarIds = carIds;
        if (carFilter) filteredCarIds = carIds.filter(id => id === carFilter);

        //Legger bil-ider in i verdier som skal legges inn i queryen
        const values: (number | Date)[] = [...filteredCarIds];

        //Lager queryen
        let query = "SELECT parkering.id, bil.regnr, parkering.startdatotid, parkering.sluttdatotid, parkering.pris ";
        query += "FROM parkering INNER JOIN bil ON parkering.bil_id = bil.id "
        query += "WHERE bil_id IN (" + Array.from({ length: filteredCarIds.length }, (v, i) => " $ ").join(",") + ") ";

        if (fromDate) {
            values.push(fromDate);
            query += "AND startdatotid > $ ";
        }

        if (toDate) {
            values.push(toDate);
            query += "AND sluttdatotid < $";
        }


        const parkings = await db.GetString(query, values) as Parkering[];
        return { parkings, cars };
    }


    return (
        <main>
            <div className="loged-in-heading">
                <h1>Parkeringsoversikt</h1>
                {/* <Link href="/biler/ny">+ Legg til ny</Link> */}
            </div>
            <Client GetParkings={GetParkings} />
        </main>
    );


}