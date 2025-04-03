import Navigation from "@/components/Navigation";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="logedin-layout">
                <Navigation links={[
                    { path: "/admin/parkeringsoversikt", text: "Parkeringsoversikt" },
                    { path: "/admin/biler", text: "Biler" },
                    { path: "/admin/personalia", text: "Personalia" },
                ]} />
                {children}
            </div>
            <span className="admin-tag">Administrator</span>
        </>
    )
}