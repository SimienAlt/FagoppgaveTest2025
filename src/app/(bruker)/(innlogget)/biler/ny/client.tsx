"use client"

import ErrorMessage from "@/components/ErrorMessage";
import { FormEvent, useRef, useState } from "react"


export default function Client({ onSubmit }: { onSubmit: (regnr: string) => Promise<void | { Error: string }> }) {
    const regnr = useRef("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //Prøver å lage api-token
        const res = await onSubmit(regnr.current);

        //Håndterer feil og viser feilmelding
        if (res?.Error) {
            setError(res.Error);
        } else {
            setError(null);
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: "500px", padding: "0px 0px 16px", display: "flex", flexDirection: "column", gap: "32px" }}>
            <ErrorMessage message={error} />
            <div className="input-label-pair">
                <label htmlFor="name">Regnr</label>
                <input name="name" type="text" onChange={(e) => regnr.current = e.target.value} />
            </div>
            <button type="submit" className="submit-btn">Lagre</button>
        </form>
    );
}