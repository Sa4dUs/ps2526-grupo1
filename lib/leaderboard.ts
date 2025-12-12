import { db } from "@/lib/firebaseAdmin";

interface LeaderboardEntry {
    name: string;
    best_score: number;
    rank: number;
}

export async function get_leaderboard(
    from: number,
    to: number,
    user?: string,
    mode: "puzzle" | "timetrial" = "puzzle" 
): Promise<LeaderboardEntry[]> {
    
    // Seleccionamos el campo de la base de datos según el modo
    const orderByField = mode === "timetrial" ? "stats.best_score_timetrial" : "stats.best_score";

    const snapshot = await db
        .collection("users")
        .orderBy(orderByField, "desc")
        .get();

    const allUsers: LeaderboardEntry[] = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        
        // Obtenemos el puntaje correcto según el modo
        const score = mode === "timetrial" 
            ? (data.stats?.best_score_timetrial ?? 0) 
            : (data.stats?.best_score ?? 0);

        return {
            name: data.name ?? "Unnamed",
            best_score: score,
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