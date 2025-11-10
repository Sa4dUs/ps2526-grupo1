import { NextResponse } from "next/server";
import { get_leaderboard } from "@/lib/leaderboard";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const from = Number(searchParams.get("from") ?? 0);
    const to = Number(searchParams.get("to") ?? 100);
    const user = searchParams.get("user") || undefined;

    try {
        const leaderboard = await get_leaderboard(from, to, user);
        return NextResponse.json(leaderboard);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error getting leaderboard" }, { status: 500 });
    }
}
