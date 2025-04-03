import Navigation from "@/components/Navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="logedin-layout">
                <Navigation links={[
                    { path: "/admin/brukere", text: "Brukere" },
                    { path: "/admin/parkeringsplasser", text: "Parkeringsplasser" },
                    { path: "/admin/avvikslogg", text: "Avvikslogg" },
                    { path: "/admin/api-token", text: "API Token" }
                ]} />
                {children}
            </div>
            <span className="admin-tag">Administrator</span>
        </>
    )
}