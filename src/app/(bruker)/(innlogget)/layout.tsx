import Navigation from "@/components/Navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="logedin-layout">
                <Navigation links={[
                    { path: "/parkeringsoversikt", text: "Parkeringsoversikt" },
                    { path: "/biler", text: "Biler" },
                    { path: "/personalia", text: "Personalia" },
                ]} />
                {children}
            </div>
            <span className="admin-tag">Administrator</span>
        </>
    )
}