"use client";

import { useEffect, useState } from "react";
import { ResponsePayload, ResponseSuccess, Solution } from "@/types/problem";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
	const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

	const startNewGame = async () => {
		setScore(0);
		setGameState(GameState.Loading);
		setSelectedAnswer(null);
		setIsCorrect(null);

		const res = await requestProblem();
		setProblem(res as ResponseSuccess);
		setGameState(GameState.Playing);
	};

	useEffect(() => {
		startNewGame();
	}, []);

	const handleAnswer = async (answer: number) => {
		if (!problem || selectedAnswer !== null) return;

		setSelectedAnswer(answer);

		const response = await requestProblem({
			solution: answer,
			encoded: problem.encoded,
		});

		if ("error" in response) {
			setGameState(GameState.GameOver);
			setProblem(null);
			setSelectedAnswer(null);
			setIsCorrect(null);
			return;
		}

		setScore((prev) => prev + 1);
		setIsCorrect(true);

		setTimeout(async () => {
			const nextProblem = await requestProblem();
			setProblem(nextProblem as ResponseSuccess);
			setSelectedAnswer(null);
			setIsCorrect(null);
		}, 500);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full flex-grow gap-6">
			{gameState === GameState.Loading && <p>Loading...</p>}

			{gameState === GameState.Playing && problem && (
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader>
						<h2 className="text-center">Score: {score}</h2>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-6">
						<h2 className="text-xl font-semibold text-center">
							{problem.question}
						</h2>

						<div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
							{problem.answers.map((ans, i) => {
								let className =
									"w-full py-3 text-lg font-medium transition-all rounded-lg";

								if (selectedAnswer === null)
									className +=
										" bg-gray-800 text-white hover:bg-gray-700";
								else if (ans === selectedAnswer && isCorrect)
									className +=
										" bg-green-500 text-white hover:bg-green-600";
								else if (ans === selectedAnswer)
									className +=
										" bg-yellow-500 text-white hover:bg-yellow-600";
								else
									className +=
										" bg-gray-700 text-white opacity-70";

								return (
									<Button
										key={i}
										className={className}
										onClick={() => handleAnswer(ans)}
										disabled={selectedAnswer !== null}
									>
										{ans}
									</Button>
								);
							})}
						</div>

						<Link href="/">
							<Button
								variant="outline"
								className="w-full max-w-xs"
							>
								Back home
							</Button>
						</Link>
					</CardContent>
				</Card>
			)}

			{gameState === GameState.GameOver && (
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader>
						<h2 className="text-center">Game Over</h2>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4">
						<p className="text-center">
							You reached a score of {score}
						</p>
						<Button
							onClick={startNewGame}
							className="w-full max-w-xs mb-2"
						>
							Try Again
						</Button>
						<Link href="/">
							<Button
								variant="outline"
								className="w-full max-w-xs"
							>
								Back home
							</Button>
						</Link>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
