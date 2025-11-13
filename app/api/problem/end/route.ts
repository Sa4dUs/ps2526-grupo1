
export async function POST(req: Request) {
    try {
        const { score, timeLeft } = await req.json();
        console.log("Time Trial finished:", { score, timeLeft });

        return new Response(JSON.stringify({ ok: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("Error in /api/problem/end", e);
        return new Response(JSON.stringify({ error: "UnexpectedError" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
