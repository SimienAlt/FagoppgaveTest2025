"use client"
import ErrorMessage from "@/components/ErrorMessage";
import { Parkering } from "@/lib/db";
import { RefObject, useRef, useState } from "react";

export default function Client({ GetParkeringer, username, id }: { GetParkeringer: (id: number, year: number) => Promise<{ Error: string } | Parkering[]>, username: string, id: number }) {
    const year: RefObject<number | null> = useRef(null);
    const [error, setError] = useState<string | null>(null);

    return (<>
        <ErrorMessage message={error} />
        <div style={{ maxWidth: "400px", display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <div className="input-label-pair">
                <label htmlFor="year">År</label>
                <input name="year" type="number" onChange={(e) => year.current = Number(e.target.value)} />
            </div>
            <button style={{ width: "100%", height: "40px", cursor: "pointer" }} onClick={DownloadPasseringer}>Last ned</button>
        </div>
    </>);

    async function DownloadPasseringer() {
        if (year.current === null) {
            setError("year is null");
            return;
        }
        if (isNaN(year.current)) {
            setError("year is not a number");
            return;
        }

        if (year.current < 2025) {
            setError("year is must be atleast 2025");
            return;
        }

        const res = await GetParkeringer(id, year.current);

        if ("Error" in res) {
            setError(res.Error);
            return;
        }

        const options = {
            filename: `Parkeringer ${username} ${year.current}`,
            format: 'xlsx',
            openAsDownload: true
        }

        let prisTotal = 0;

        const sheets = [{
            name: 'Sheet 1',
            formats: [],
            from: {
                array: [
                    ["id", "startdatotid", "sluttdatotid", "bil", "parkeringsplass", "etasje", "pris"],
                    ...res.map(obj => {
                        prisTotal += Number(obj.pris) || 0;
                        return [obj.id, obj.startdatotid, obj.sluttdatotid, obj.regnr, obj.parkeringsplass_id, obj.etasjer_id, Number(obj.pris)];
                    }),
                    ["", "", "", "", "", "Totalt", prisTotal]
                ]
            }
        }]

        const ExcellentExport = (await import('excellentexport')) as any;
        ExcellentExport.convert(options, sheets);
        setError(null);
    }
}