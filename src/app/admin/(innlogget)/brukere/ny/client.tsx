"use client"

import ErrorMessage from "@/components/ErrorMessage";
import { FormEvent, useRef, useState } from "react"


export default function Client({
    onSubmit
}: {
    onSubmit: (
        username: string,
        password: string,
        phone: string,
        email: string,
        address: string,
        postcode: string,
        city: string
    ) => Promise<void | { Error: string }>
}) {
    const username = useRef("");
    const password = useRef("");
    const phone = useRef("");
    const email = useRef("");
    const address = useRef("");
    const postcode = useRef("");
    const city = useRef("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        //Stopper side fra å laste på nytt
        e.preventDefault();
        e.stopPropagation();

        //Prøver å lage parkeringsplass
        const res = await onSubmit(
            username.current,
            password.current,
            phone.current,
            email.current,
            address.current,
            postcode.current,
            city.current
        );

        //Håndterer feil og viser feilmelding
        if (res?.Error) {
            setError(res.Error);
        } else {
            setError(null)
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
                <label htmlFor="name">Standard passord</label>
                <input name="name" type="text" onChange={(e) => password.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="name">Tlf.</label>
                <input name="name" type="text" pattern="[0-9]{8}" onChange={(e) => phone.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="name">Epost</label>
                <input name="name" type="email" onChange={(e) => email.current = e.target.value} />
            </div>
            <div className="input-label-pair">
                <label htmlFor="name">Adresse</label>
                <input name="name" type="text" onChange={(e) => address.current = e.target.value} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
                <div className="input-label-pair">
                    <label htmlFor="name">Postkode</label>
                    <input name="name" type="text" pattern="[0-9]{4}" onChange={(e) => postcode.current = e.target.value} />
                </div>
                <div className="input-label-pair">
                    <label htmlFor="name">Poststed</label>
                    <input name="name" type="text" onChange={(e) => city.current = e.target.value} />
                </div>
            </div>
            <button type="submit" className="submit-btn">Lagre</button>
        </form>
    );
}