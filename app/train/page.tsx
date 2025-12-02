"use client";

import { useState } from "react";
import { generateProblems } from "@/lib/problems";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Info } from "lucide-react";

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

	function handleLevelClick(lvl: number) {
		const generated = generateProblems(lvl);
		if (!generated || typeof generated.correctAnswer !== "number") {
			return;
		}
		setLevel(lvl);
		setProblem(generated as Problem);
		setSelected(null);
		setIsCorrect(null);
	}

	function handleAnswerClick(answer: number) {
		if (selected !== null || !problem) return;
		setSelected(answer);
		setIsCorrect(answer === problem.correctAnswer);
	}

	function handleNextProblem() {
		if (level === null) return;
		const next = generateProblems(level);
		if (!next || typeof next.correctAnswer !== "number") {
			return;
		}
		setProblem(next as Problem);
		setSelected(null);
		setIsCorrect(null);
	}

	return (
		<div className="flex flex-col items-center justify-center w-full flex-grow">
			{level === null ? (
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
					<Dialog>
						<div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
							<span>
								Note: Levels 2 and 3 may generate combined operations.
								Click the info icon for more details.
							</span>

							{/*Botón para abrir el modal*/}
							<DialogTrigger asChild>
								<Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
									<Info className="h-4 w-4" />
								</Button>
							</DialogTrigger>
						</div>
						<DialogContent className="max-w-xs sm:max-w-md">
							<DialogHeader>
								<DialogTitle>Hierarchy of Operations</DialogTitle>
								<DialogDescription>
									This is the order (PEMDAS/BODMAS) used for combined operations.
								</DialogDescription>
							</DialogHeader>
							<div className="mt-4">
								<img
									src="/hierarchyoperations.png"
									alt="Jerarquía de operaciones (PEMDAS)"
									className="rounded-md object-contain w-full"
								/>
							</div>
						</DialogContent>
					</Dialog>

					<Link href="/" className="text-center">
						<Button variant="outline">Back home</Button>
					</Link>
				</>
			) : (
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
