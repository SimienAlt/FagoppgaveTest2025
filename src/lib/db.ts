import { neon } from '@neondatabase/serverless';

namespace DB {
    export interface Administrator {
        id: number;
        Brukernavn?: string;
        passord?: string;
    }

    export interface ApiToken {
        id: number;
        navn?: string;
        verdi?: string;
    }

    export interface Avvikslogg {
        id: number;
        regnr?: string;
        melding?: string;
        tidspunkt?: Date;
        parkeringsplass_id?: number;
    }

    export interface Bil {
        id: number;
        bruker_id?: number;
        regnr?: string;
    }

    export interface Bruker {
        id: number;
        Brukernavn?: string;
        passord?: string;
        tlf?: string;
        epost?: string;
        address?: string;
        postcode?: string;
        city?: string,
        mabyttepasord?: boolean;
    }

    export interface Etasjer {
        id: number;
        navn?: string;
        parkeringsplass_id?: number;
        plasser?: number;
    }

    export interface Parkering {
        id: number;
        startdato?: Date;
        sluttdato?: Date;
        pris?: number;
        parkeringsplass_id?: number;
        bil_id?: number;
        etasjer_id?: number;
    }

    export interface Parkeringsplass {
        id: number;
        navn?: string;
    }

    export type SelectResult = Administrator | ApiToken | Avvikslogg | Bil | Bruker | Etasjer | Parkering | Parkeringsplass;

    export async function GetFirst(query: TemplateStringsArray, ...values: any[]): Promise<SelectResult> {
        if (!/^(SELECT|Select|select)/.test(query.toString())) {
            throw new Error("Query must be a Select");
        }

        const result = await Run(query, ...values);
        if (Array.isArray(result) && typeof result[0].id === "number") {
            return result[0] as SelectResult;
        } else {
            throw new Error("Result does not contain a valid user");
        }
    }

    export async function Get(query: TemplateStringsArray, ...values: any[]): Promise<SelectResult[]> {
        if (!/^(SELECT|Select|select)/.test(query.toString())) {
            throw new Error("Query must be a Select");
        }

        const result = await Run(query, ...values);
        if (Array.isArray(result)) {
            const users = result.map(obj => {
                if (typeof result[0].id === "number") return obj as SelectResult;
                throw new Error("Result does not contain a valid user")
            })
            return users;
        } else {
            throw new Error("Result does not contain a valid user");
        }
    }

    export function Run(query: TemplateStringsArray, ...values: any[]) {
        const sql = neon(`${process.env.DATABASE_URL}`);
        return (Array.isArray(values) && values.length > 0 ? sql(query, ...values) : sql(query));
    }
}


export default DB