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
        .orderBy("stats.best_score", "desc")
        .get();

    const allUsers: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
            name: data.name ?? "Unnamed",
            best_score: data.stats?.best_score ?? 0,
            rank: index + 1,
        };
    });

    const fromIndex = Math.max(0, from - 1)

    if (!user) {
        return allUsers.slice(fromIndex, to);
    }

    const userIndex = allUsers.findIndex(u => u.name === user);

    if (userIndex === -1) {
        return allUsers.slice(fromIndex, to);
    }

    let end = Math.min(allUsers.length, userIndex + 1);
    const start = Math.max(0, end - to - fromIndex - 1);

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
