"use client"

import { FormEvent, useRef, useState } from "react"
import ErrorMessage from "./ErrorMessage";
import { useRouter } from "next/navigation";

export default function EditPasswordForm({ onSubmit }: { onSubmit: (password: string) => Promise<void | { Error: string }> }) {
    const newPassword = useRef("");
    const confirmPassword = useRef("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //Sammenligner passord, og bekreft passord
        if (newPassword.current !== confirmPassword.current) {
            setError("Nytt passord og bekreft passord er ikke like");
            return;
        }

        //Prøver å logge in
        const res = await onSubmit(newPassword.current)

        //Håndterer feil og viser feilmelding
        if (res?.Error) {
            setError(res.Error);
        } else {
            setError(null)
            router.refresh();
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "16px", flexDirection: "column", padding: "16px 0px" }}>
            <ErrorMessage message={error} />
            <div className="input-label-pair">
                <label htmlFor="password">Nytt passord</label>
                <input name="password" type="password" onChange={(e) => newPassword.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="password">Bekreft passord</label>
                <input name="password" type="password" onChange={(e) => confirmPassword.current = e.target.value} />
            </div>
            <button type="submit" className="submit-btn">Lagre</button>
        </form>
    )
}