"use client";

import { useEffect, useState } from "react";
import { ResponsePayload, ResponseSuccess, Solution } from "@/types/problem";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useProblemGame } from "../hooks/useProblemGame";
import { AnswerButtons } from "../components/AnswerButtons";

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
	const [score, setScore] = useState(0);
	const [gameState, setGameState] = useState(GameState.Loading);

	const {
		problem,
		selected,
		isCorrect,
		setProblem,
		selectAnswer,
		setSelected,
		setIsCorrect,
	} = useProblemGame<ResponseSuccess>(async () =>
		requestProblem().then((res) => res as ResponseSuccess)
	);

	const startNewGame = async () => {
		setScore(0);
		setGameState(GameState.Loading);
		setSelected(null);
		setIsCorrect(null);
		const res = await requestProblem();
		setProblem(res as ResponseSuccess);
		setGameState(GameState.Playing);
	};

	useEffect(() => {
		startNewGame();
	}, []);

	const handleAnswer = async (answer: number) => {
		if (!problem || selected !== null) return;
		selectAnswer(answer);

		const response = await requestProblem({
			solution: answer,
			encoded: problem.encoded,
		});

		if ("error" in response) {
			setGameState(GameState.GameOver);
			return;
		}

		setScore((prev) => prev + 1);
		setIsCorrect(true);

		setTimeout(async () => {
			const next = await requestProblem();
			setProblem(next as ResponseSuccess);
			setSelected(null);
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

						<AnswerButtons
							answers={problem.answers}
							selected={selected}
							isCorrect={isCorrect}
							onSelect={handleAnswer}
						/>

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
