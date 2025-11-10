import { db } from "@/lib/firebaseAdmin";

interface LeaderboardEntry {
    name: string;
    best_score: number;
    rank: number;
}

export async function get_leaderboard(
    from: number,
    to: number,
    user?: string
): Promise<LeaderboardEntry[]> {
    const snapshot = await db
        .collection("users")
        .orderBy("best_score", "desc")
        .get();

    const allUsers: LeaderboardEntry[] = snapshot.docs.map((doc, index) => ({
        name: doc.get("name") ?? "Unnamed",
        best_score: doc.get("best_score") ?? 0,
        rank: index + 1,
    }));


    if (!user) {
        return allUsers.slice(from, to);
    }

    const userIndex = allUsers.findIndex(u => u.name === user);

    if (userIndex === -1) {
        return allUsers.slice(from, to);
    }

    let end = Math.min(allUsers.length, userIndex + 1);
    const start = Math.max(0, end - to - from - 1);

    if (userIndex + 1 < to) {
        end = Math.min(allUsers.length, to);
    }

    const slice = allUsers.slice(start, end);

    if (!slice.some(u => u.name === user)) {
        const userEntry = allUsers[userIndex];
        slice.push(userEntry);
    }

    const reordered = slice.filter(u => u.name !== user);
    const userEntry = allUsers[userIndex];
    reordered.push(userEntry);

    return reordered;
}
