"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type LeaderboardEntry = {
	name: string;
	best_score: number;
	rank: number;
};

type GameMode = "puzzle" | "timetrial";

export default function RankingPage() {
	const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<GameMode>("puzzle"); // Estado para el modo

    // Función para obtener datos
	const fetchLeaderboard = async (currentMode: GameMode) => {
        setIsLoading(true);
        setError(null);
		try {
			const res = await fetch(`/api/leaderboard?from=1&to=10&mode=${currentMode}`);
			if (!res.ok) {
				throw new Error("Unexpected response from server");
			}
			const data = (await res.json()) as LeaderboardEntry[];
			setLeaders(data);
		} catch (err) {
			console.error(err);
			setError("We couldn't load the leaderboard right now.");
		} finally {
			setIsLoading(false);
		}
	};

    // Efecto para cargar cuando cambia el modo
	useEffect(() => {
		fetchLeaderboard(mode);
	}, [mode]);

	return (
		<div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
            {/* Controles de Modo */}
            <div className="flex gap-4">
                <Button 
                    variant={mode === "puzzle" ? "default" : "secondary"}
                    onClick={() => setMode("puzzle")}
                >
                    Puzzle Rush
                </Button>
                <Button 
                    variant={mode === "timetrial" ? "default" : "secondary"}
                    onClick={() => setMode("timetrial")}
                >
                    Time Trial
                </Button>
            </div>

			<Card className="w-full max-w-3xl shadow-lg">
				<CardHeader className="text-center">
					<h2 className="text-2xl font-semibold">
						Top 10 Players - {mode === "puzzle" ? "Puzzle Rush" : "Time Trial"}
					</h2>
					<p className="text-sm text-muted-foreground">
						Sorted by best score from highest to lowest.
					</p>
				</CardHeader>
				<CardContent className="flex flex-col gap-6">
					{isLoading && (
						<p className="text-center text-muted-foreground">
							Loading ranking...
						</p>
					)}
					{!isLoading && error && (
						<Alert variant="destructive">
							<AlertTitle>Failed to load</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}
					{!isLoading && !error && leaders.length === 0 && (
						<p className="text-center text-muted-foreground">
							No players found yet for this mode.
						</p>
					)}
					{!isLoading && !error && leaders.length > 0 && (
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-sm md:text-base">
								<thead>
									<tr className="text-left text-muted-foreground">
										<th className="py-2 px-3">Rank</th>
										<th className="py-2 px-3">Player</th>
										<th className="py-2 px-3 text-right">
											Score
										</th>
									</tr>
								</thead>
								<tbody>
									{leaders.map((player) => (
										<tr
											key={player.rank + "-" + player.name}
											className="border-t border-border/50"
										>
											<td className="py-2 px-3 font-semibold">
												{player.rank}
											</td>
											<td className="py-2 px-3">
												{player.name}
											</td>
											<td className="py-2 px-3 text-right font-medium">
												{player.best_score}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<Link href="/" className="flex justify-center">
						<Button variant="outline" className="w-full max-w-xs">
							Back home
						</Button>
					</Link>
				</CardContent>
			</Card>
		</div>
	);
}