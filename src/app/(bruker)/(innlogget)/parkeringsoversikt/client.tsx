"use client"

import { Bil, Parkering } from "@/lib/db";
import { useEffect, useState } from "react";

export default function Client({ GetParkings }: { GetParkings: (props: { carFilter?: number, fromDate?: Date, toDate?: Date }) => Promise<{ parkings: Parkering[], cars: Bil[] }> }) {
    const [parkeringer, setParkeringer] = useState<Parkering[]>([]);
    const [cars, setCars] = useState<Bil[]>([]);
    const [carFilter, setCarFilter] = useState<undefined | number>(undefined);
    const [fromDate, setFromDate] = useState<undefined | Date>(undefined);
    const [toDate, setToDate] = useState<undefined | Date>(undefined);

    useEffect(() => {
        onFilter()
    }, [carFilter, fromDate, toDate]);
    return (
        <section className="main-content">
            <div style={{ height: "80px", width: "100%", display: "flex", gap: "8px" }}>
                <div className="input-label-pair">
                    <label htmlFor="regnr">Bil</label>
                    <select name="regnr" onChange={(e) => setCarFilter(Number.isNaN(e.target.value) ? undefined : Number(e.target.value))}>
                        <option>Alle</option>
                        {cars.map(car => <option key={car.id} value={car.id}>{car.regnr}</option>)}
                    </select>
                </div>
                <div className="input-label-pair">
                    <label htmlFor="from-date">Fra dato</label>
                    <input name="from-date" type="date" onChange={(e) => {
                        const value = e.target.value;
                        setFromDate(value ? new Date(value) : undefined);
                    }} />
                </div>
                <div className="input-label-pair">
                    <label htmlFor="to-date">Til Dato</label>
                    <input name="to-date" type="date" onChange={(e) => {
                        const value = e.target.value;
                        setToDate(value ? new Date(value) : undefined);
                    }} />
                </div>
            </div>
            <table cellSpacing="0">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <th>Regnr</th>
                        <th>Start</th>
                        <th>Slutt</th>
                        <th>Varighet</th>
                        <th>Pris</th>
                    </tr>
                    {parkeringer.map((obj, index) => {
                        if (!obj.startdatotid)
                            throw new Error("Startdato må ha en verdi")
                        return (
                            <tr key={obj.id} className={(index & 1) === 0 ? "even" : "odd"}>
                                <td>{obj.id}</td>
                                <td>{obj.regnr}</td>
                                <td>{formatDateTime(obj.startdatotid)}</td>
                                {obj.sluttdatotid ? <>
                                    <td>{formatDateTime(obj.sluttdatotid)}</td>
                                    <td>{Math.round(((obj.sluttdatotid.getTime() - obj.startdatotid.getTime()) / 1000) / 60)} min</td>
                                    <td>{obj.pris}</td>
                                </> : <><td /><td /><td /></>}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </section>
    );

    async function onFilter() {
        const { parkings, cars } = await GetParkings({
            carFilter: carFilter,
            toDate: toDate,
            fromDate: fromDate
        })
        setParkeringer(parkings);
        setCars(cars);
    }

    function formatDateTime(dateTime: Date): String {
        return dateTime.getDate() + "." + (dateTime.getMonth() + 1) + "." + dateTime.getFullYear() + " " + dateTime.getHours() + ":" + dateTime.getMinutes();
    }
}