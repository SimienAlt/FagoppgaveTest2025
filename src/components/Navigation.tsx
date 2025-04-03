"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface LinkObject {
    path: string;
    text: string;
}
export default function Navigation({ links }: { links: LinkObject[] }) {
    const path = usePathname();
    const [navOpen, setNavOpen] = useState(false);
    return (
        <nav className={navOpen ? "open" : "closed"}>
            {links.map(obj => <Link href={obj.path} className={path === obj.path ? "active" : undefined}>{obj.text}</Link>)}
            <button className="toggle-nav" onClick={() => setNavOpen(!navOpen)}>
                <svg className="elipsis" width="53" height="155" viewBox="0 0 53 155" fill="none">
                    <ellipse cx="4.5" cy="77.5" rx="48.5" ry="77.5" fill="#626262" />
                </svg>
                <svg className="arrow" width="53" height="155" viewBox="0 0 53 155" fill="none">
                    <line x1="13.5562" y1="92.5563" x2="30.5268" y2="75.5858" stroke="white" strokeWidth="4" />
                    <line x1="14.4142" y1="60.5858" x2="31.3848" y2="77.5564" stroke="white" strokeWidth="4" />
                </svg>
            </button>
        </nav >
    );
}