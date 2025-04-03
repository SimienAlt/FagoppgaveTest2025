"use client"
import { FormEvent, useRef, useState } from "react";
import "./loginForm.css"
/** */
export default function LoginForm({ onSubmit }: { onSubmit: (username: string, pwd: string) => Promise<void | { Error: string }> }) {
    const username = useRef("");
    const password = useRef("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //Prøver å logge in
        const res = await onSubmit(username.current, password.current)

        //Håndterer feil og viser feilmelding
        if (res?.Error) {
            setError(res.Error);
        } else {
            setError(null)
        }
    }

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h1>Logg inn</h1>
            <div style={{ height: "20px" }}>{error !== null && <p style={{ color: "red", fontSize: "18px" }}>{error}</p>}</div>
            <div className="input-label-pair">
                <label htmlFor="username">Brukernavn</label>
                <input name="username" type="text" onChange={(e) => username.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="password">Passord</label>
                <input name="password" type="password" onChange={(e) => password.current = e.target.value} />
            </div>
            <button type="submit" className="submit-btn">Logg inn</button>
        </form>
    )
}