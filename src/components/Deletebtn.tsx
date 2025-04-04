"use client"

import { useRouter } from "next/navigation"
import React from "react";

interface DeletebtnProps {
    id: number;
    onDelete: (id: number) => Promise<void>;
    style?: React.CSSProperties;
    className?: string;
}

export default function Deletebtn({ id, onDelete, style, className }: DeletebtnProps) {
    const router = useRouter();

    async function handleClick() {
        await onDelete(id);
        router.refresh();
    }

    return (<button style={style} className={className} onClick={handleClick}>Slett</button>)
}