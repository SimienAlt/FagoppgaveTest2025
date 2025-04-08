"use client"

import ErrorMessage from "@/components/ErrorMessage";
import { FormEvent, useRef, useState } from "react"

interface Etasje {
    name: string;
    plasser: string;
}

export default function Client({ onSubmit }: { onSubmit: (name: string, price: number, etasjer: Etasje[]) => Promise<void | { Error: string }> }) {
    const name = useRef("");
    const price = useRef(0);
    const [etasjer, setEtasjer] = useState<Etasje[]>([{ name: "1. etg", plasser: "0" }])
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //sjekker at pris ikke er NaN
        if (Number.isNaN(price.current)) {
            setError("Pris er ikke et tall");
            return;
        }

        //Prøver å lage parkeringsplass
        const res = await onSubmit(name.current, price.current, etasjer);

        //Håndterer feil og viser feilmelding
        if (res?.Error) {
            setError(res.Error);
        } else {
            setError(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px", padding: "16px 0px", display: "flex", flexDirection: "column", gap: "32px" }}>
            <ErrorMessage message={error} />
            <div className="input-label-pair">
                <label htmlFor="name">Navn</label>
                <input name="name" type="text" onChange={(e) => name.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="pris">Pris</label>
                <input name="pris" type="number" onChange={(e) => price.current = Number(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {etasjer.map((obj, index) => (
                    <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <div className="input-label-pair">
                            <label htmlFor="name">Navn på etg.</label>
                            <input name="name" type="text" onChange={(e) => updateEtasje(index, "name", e.target.value)} value={obj.name} />
                        </div>
                        <div className="input-label-pair">
                            <label htmlFor="name">Plasser i etg.</label>
                            <input name="name" type="number" onChange={(e) => updateEtasje(index, "plasser", e.target.value)} value={obj.plasser} />
                        </div>
                        <button
                            style={{ backgroundColor: "#414141", color: "white", borderRadius: "8px", height: "40px", marginTop: "22px", border: "1px solid black", cursor: "pointer" }}
                            type="button"
                            onClick={() => removeEtasje(index)}
                        >
                            Fjern
                        </button>
                    </div>
                ))}
                <button type="button" onClick={addEtasje} style={{ width: "100px" }}>+ Ny etasje</button>
            </div>
            <button type="submit" className="submit-btn">Lagre</button>
        </form>
    );

    function updateEtasje(index: number, field: string, value: number | string) {
        setEtasjer(old => {
            //Lagger en kopi av den gamle listen
            let newList: any[] = [...old];

            //oppdaterer verdien i den nye listen
            newList[index][field] = value;

            //returnerer ny liste
            return newList;
        })
    }

    function addEtasje() {
        setEtasjer(old => {
            //Lagger en kopi av den gamle listen
            let newList: any[] = [...old];

            //legger til en ny etasje
            newList.push({
                name: `${old.length + 1}. etg`,
                plasser: 0
            })

            //returnerer den nye listen
            return newList;
        })
    }

    function removeEtasje(index: number) {
        if (etasjer.length === 1) {
            setError("Du må ha minst en etasje!");
        } else {
            setEtasjer(old => {
                //Lagger en kopi av den gamle listen
                let newList: any[] = [...old];

                //legger til en ny etasje
                newList.splice(index, 1);

                //returnerer den nye listen
                return newList;
            })
        }
    }
}