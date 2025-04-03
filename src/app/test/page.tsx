import DB from "@/lib/db"

export default function Test() {
    async function TestDBRun() {
        const db = new DB()
        const id = 2;
        const res = await db.Run`SELECT * FROM bruker where id = ${id}`;
        console.log(res)
    }
    // TestDBRun();
    return (
        <main>

        </main>
    )
}   