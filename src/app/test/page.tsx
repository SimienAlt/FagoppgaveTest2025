import DB from "@/lib/db"

export default function Test() {
    async function TestDBRun() {
        const id = 2;
        const res = await DB.Run`SELECT * FROM bruker where id = ${id}`;
        console.log(res)
    }
    // TestDBRun();
    return (
        <main>

        </main>
    )
}   