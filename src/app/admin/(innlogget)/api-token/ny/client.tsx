"use client"

import ErrorMessage from "@/components/ErrorMessage";
import { FormEvent, useRef, useState } from "react"


export default function Client({ onSubmit }: { onSubmit: (username: string, password: string) => Promise<void | { Error: string }> }) {
    const username = useRef("");
    const password = useRef("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //Prøver å lage api-token
        const res = await onSubmit(username.current, password.current);

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
                <label htmlFor="name">Brukernavn</label>
                <input name="name" type="text" onChange={(e) => username.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="name">Passord</label>
                <input name="name" type="text" onChange={(e) => password.current = e.target.value} />
            </div>
            <button type="submit" className="submit-btn">Lagre</button>
        </form>
    );
}