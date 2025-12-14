import { NextResponse } from "next/server";
import { get_leaderboard } from "@/lib/leaderboard";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const from = Number(searchParams.get("from") ?? 0);
    const to = Number(searchParams.get("to") ?? 100);
    const user = searchParams.get("user") || undefined;
    
    const modeParam = searchParams.get("mode");
    const mode = (modeParam === "timetrial") ? "timetrial" : "puzzle";

    try {
        const leaderboard = await get_leaderboard(from, to, user, mode);
        return NextResponse.json(leaderboard);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Error getting leaderboard" }, { status: 500 });
    }
}