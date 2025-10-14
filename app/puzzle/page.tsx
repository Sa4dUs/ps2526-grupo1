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
		<main className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-foreground">
			<h1 className="text-3xl font-bold mb-6 text-center text-primary">
				Puzzle Rush
			</h1>

			{gameState === GameState.Loading && (
				<p className="text-center text-muted-foreground">Loading...</p>
			)}

			{gameState === GameState.Playing && problem && (
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader>
						<h2 className="text-xl font-bold text-primary text-center">
							Score: {score}
						</h2>
					</CardHeader>

					<CardContent className="flex flex-col items-center gap-6">
						<div className="w-full h-48 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
							<img
								src="/mathimage.png"
								alt="Math Problem Illustration"
								className="object-cover w-full h-full"
							/>
						</div>

						<div className="text-center w-full">
							<h2 className="text-xl font-semibold mb-6">
								{problem.question}
							</h2>

							{problem && (
								<div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
									{problem.answers.map((ans, i) => {
										let className =
											"w-full py-3 text-lg font-medium transition-all rounded-lg";

										if (selectedAnswer === null) {
											className +=
												" bg-gray-800 text-white hover:bg-gray-700";
										} else if (
											ans === selectedAnswer &&
											isCorrect
										) {
											className +=
												" bg-green-500 text-white hover:bg-green-600";
										} else if (ans === selectedAnswer) {
											className +=
												" bg-yellow-500 text-white hover:bg-yellow-600";
										} else {
											className +=
												" bg-gray-700 text-white opacity-70";
										}

										return (
											<Button
												key={i}
												className={className}
												onClick={() =>
													handleAnswer(ans)
												}
												disabled={
													selectedAnswer !== null
												}
											>
												{ans}
											</Button>
										);
									})}
								</div>
							)}
						</div>

						<div className="flex flex-col items-center gap-3 mt-8">
							<Link href="/" className="w-48 text-center">
								<Button variant="outline" className="w-full">
									Back home
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			)}

			{gameState === GameState.GameOver && (
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader>
						<p className="text-xl font-semibold text-primary text-center">
							Game Over
						</p>
					</CardHeader>
					<CardContent className="flex flex-col items-center gap-4 text-center">
						<p className="text-muted-foreground">
							You reached a score of <strong>{score}</strong>
						</p>

						<div className="flex flex-col items-center gap-3 mt-4">
							<Button className="w-48" onClick={startNewGame}>
								Try Again
							</Button>

							<Link href="/" className="w-48 text-center">
								<Button variant="outline" className="w-full">
									Back home
								</Button>
							</Link>
						</div>
					</CardContent>
				</Card>
			)}
		</main>
	);
}
