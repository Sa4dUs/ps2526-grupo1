"use client";

import { useState } from "react";
import { generateProblems } from "@/lib/problems";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Problem = {
	question: string;
	answers: number[];
	correctAnswer: number;
};

export default function TrainingPage() {
	const [level, setLevel] = useState<number | null>(null);
	const [problem, setProblem] = useState<Problem | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

	// --- Cuando se elige nivel, genera el primer problema
	function handleLevelClick(lvl: number) {
		const generated = generateProblems(lvl);
		if (!generated) {
			console.error("❌ generateProblems devolvió undefined");
			return;
		}
		setLevel(lvl);
		setProblem(generated);
		setSelected(null);
		setIsCorrect(null);
	}

	// --- Selección de respuesta
	function handleAnswerClick(answer: number) {
		if (selected !== null || !problem) return;
		setSelected(answer);
		setIsCorrect(answer === problem.correctAnswer);
	}

	// --- Generar nuevo problema dentro del mismo nivel
	function handleNextProblem() {
		if (level === null) return;
		const next = generateProblems(level);
		if (!next) {
			console.error("❌ generateProblems devolvió undefined");
			return;
		}
		setProblem(next);
		setSelected(null);
		setIsCorrect(null);
	}

	return (
		<div className="flex flex-col items-center justify-center w-full flex-grow">
			{level === null ? (
				// --- Pantalla de selección de nivel
				<>
					<h1 className="text-3xl font-bold mb-6 text-center text-primary">
						Select Training Level
					</h1>

					<div className="flex flex-wrap justify-center gap-4 mb-6">
						{[0, 1, 2, 3].map((lvl) => (
							<Button
								key={lvl}
								variant="default"
								className="px-6 py-2 text-lg"
								onClick={() => handleLevelClick(lvl)}
							>
								Level {lvl}
							</Button>
						))}
					</div>

					<Link href="/" className="text-center">
						<Button variant="outline">Back home</Button>
					</Link>
				</>
			) : (
				// --- Pantalla de juego
				<Card className="w-full max-w-3xl shadow-lg">
					<CardHeader>
						<h1 className="text-2xl font-bold text-primary text-center">
							Quick problems - Level {level}
						</h1>
					</CardHeader>

					<CardContent className="flex flex-col items-center gap-6">
						{/* Pregunta */}
						<h2 className="text-xl font-semibold mb-6 text-center">
							{problem?.question ?? "Loading..."}
						</h2>

						{/* Botones de respuesta */}
						<div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
							{problem?.answers.map((ans, i) => {
								let className =
									"w-full py-3 text-lg font-medium transition-all rounded-lg";

								if (selected === null)
									className +=
										" bg-gray-800 text-white hover:bg-gray-700";
								else if (ans === problem.correctAnswer)
									className +=
										" bg-green-500 text-white hover:bg-green-600";
								else if (ans === selected)
									className +=
										" bg-red-500 text-white hover:bg-red-600";
								else
									className +=
										" bg-muted text-muted-foreground opacity-70";

								return (
									<Button
										key={i}
										className={className}
										onClick={() => handleAnswerClick(ans)}
										disabled={selected !== null}
									>
										{ans}
									</Button>
								);
							})}
						</div>

						{/* Controles */}
						<div className="flex flex-col items-center gap-3 mt-8">
							<Button
								className="w-48"
								onClick={handleNextProblem}
							>
								Next Problem
							</Button>

							<Button
								variant="secondary"
								className="w-48"
								onClick={() => setLevel(null)}
							>
								Change level
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
		</div>
	);
}
