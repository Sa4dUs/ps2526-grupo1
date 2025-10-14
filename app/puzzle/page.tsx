"use client";

import { useEffect, useState } from "react";
import { ResponsePayload, ResponseSuccess, Solution } from "@/types/problem";
import ProblemComponent from "../components/problem";

enum GameState {
	Loading,
	Playing,
	GameOver,
}

async function requestProblem(solution?: Solution): Promise<ResponsePayload> {
	const res = await fetch("/api/problem", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: solution ? JSON.stringify(solution) : "null",
	});
	return await res.json();
}

export default function PuzzlePage() {
	const [problem, setProblem] = useState<ResponseSuccess | null>(null);
	const [gameState, setGameState] = useState<GameState>(GameState.Loading);
	const [score, setScore] = useState<number>(0);

	const startNewGame = async () => {
		setScore(0);
		setGameState(GameState.Loading);

		const res = await requestProblem();
		setProblem(res as ResponseSuccess);
		setGameState(GameState.Playing);
	};

	useEffect(() => {
		startNewGame();
	}, []);

	const handleAnswer = async (selected: number) => {
		if (!problem) return;

		const response = await requestProblem({
			solution: selected,
			encoded: problem.encoded,
		});

		if ("error" in response) {
			setGameState(GameState.GameOver);
			setProblem(null);
			return;
		}

		setScore((prev) => prev + 1);
		setProblem(response);
	};

	return (
		<main className="min-h-screen flex flex-col items-center justify-center px-4">
			<div className="w-full max-w-md text-center">
				<h1 className="text-2xl font-semibold mb-6">Puzzle Rush</h1>

				{gameState === GameState.Loading && <p>Loading...</p>}

				{gameState === GameState.Playing && problem && (
					<ProblemComponent
						question={problem.question}
						answers={[...problem.answers].sort(
							() => Math.random() - 0.5
						)}
						onAnswer={handleAnswer}
					/>
				)}

				{gameState === GameState.GameOver && (
					<div className="mt-6">
						<p className="text-lg font-medium mb-2 text-red-600 dark:text-red-400">
							Game Over
						</p>
						<p className="mb-4">
							You reached a score of <strong>{score}</strong>
						</p>
						<button
							onClick={startNewGame}
							className="px-4 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-100 rounded hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
						>
							Try Again
						</button>
					</div>
				)}
			</div>
		</main>
	);
}
