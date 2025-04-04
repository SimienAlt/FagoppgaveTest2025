import { neon, NeonQueryFunction } from '@neondatabase/serverless';

//#region Typer
//Diverse typer for de forskjelige tabellene i databasen
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
    brukernavn?: string;
    passord?: string;
    tlf?: string;
    epost?: string;
    address?: string;
    postcode?: string;
    city?: string,
    mabyttepassord?: boolean;
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
    plasser?: number;
}

//En type som er en av typene som kan hentes fra databasen
export type SelectResult = Administrator | ApiToken | Avvikslogg | Bil | Bruker | Etasjer | Parkering | Parkeringsplass;

//#endregion
class DB {
    private sql: NeonQueryFunction<false, false>;
    constructor() {
        //Oppret kobling til database
        this.sql = neon(`${process.env.DATABASE_URL}`);
    }

    GetFirst = async (query: TemplateStringsArray, ...values: any[]): Promise<SelectResult> => {
        //Sjekker at det er en "Select" query
        if (!/^(SELECT|Select|select)/.test(query.toString())) {
            throw new Error("Query must be a Select");
        }

        //Kjører query
        const result = await this.Run(query, ...values);

        //Sjekker at svaret er en liste og at første elemente har id som forventet 
        if (Array.isArray(result) && typeof result[0].id === "number") {
            //Returnerer verdien som et "SelectResult"
            return result[0] as SelectResult;
        } else {
            throw new Error("Result does not contain a valid user");
        }
    }

    Get = async (query: TemplateStringsArray, ...values: any[]): Promise<SelectResult[]> => {
        //Sjekker at det er en "Select" query
        if (!/^(SELECT|Select|select)/.test(query.toString())) {
            throw new Error("Query must be a Select");
        }

        //Kjører query
        const result = await this.Run(query, ...values);

        //Sjekker at svaret er en liste som forventet
        if (Array.isArray(result)) {
            //Konverterer listen til en liste med "SelectResult". Den hiver en error dersom noe mangler id da denne altid skal være med
            const users = result.map(obj => {
                if (typeof result[0].id === "number") return obj as SelectResult;
                throw new Error("Result does not contain a valid user")
            })
            return users;
        } else {
            throw new Error("Result does not contain a valid user");
        }
    }

    Run = (query: TemplateStringsArray, ...values: any[]) => {
        //kjører query med databasekobling
        return (Array.isArray(values) && values.length > 0 ? this.sql(query, ...values) : this.sql(query));
    }
}


export default DB