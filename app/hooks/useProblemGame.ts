import { useState } from "react";

export function useProblemGame<TProblem>(
	getNextProblem: () => Promise<TProblem> | TProblem
) {
	const [problem, setProblem] = useState<TProblem | null>(null);
	const [selected, setSelected] = useState<number | null>(null);
	const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

	const nextProblem = async () => {
		const p = await getNextProblem();
		setProblem(p);
		setSelected(null);
		setIsCorrect(null);
	};

	const selectAnswer = (answer: number, correctAnswer?: number) => {
		if (selected !== null) return;
		setSelected(answer);
		if (correctAnswer !== undefined) {
			setIsCorrect(answer === correctAnswer);
		}
	};

	return {
		problem,
		selected,
		isCorrect,
		nextProblem,
		selectAnswer,
		setProblem,
		setSelected,
		setIsCorrect,
	};
}
