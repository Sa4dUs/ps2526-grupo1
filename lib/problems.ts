import { ProblemStatement } from "@/types/problem";

const OPERATORS = ["+", "-", "*", "/"];
const MAX_PER_LEVEL = [10, 20, 50, 100];

//function to generate random problems based on the level that the user has selected from 0 to 3
export function generateProblems(level: number): ProblemStatement {
	const depth = level + 2;
	const expr = Expr(MAX_PER_LEVEL[level], depth);

	const question = expr + " = ?";
	const correctAnswer = Math.round(eval(expr) * 100) / 100;

	const threshold = correctAnswer / 2;
	const answers = generateAnswers(correctAnswer, threshold);

	return {
		question,
		answers,
		correctAnswer,
	};
}

function generateAnswers(correctAnswer: number, threshold: number): number[] {
	const answers: Set<number> = new Set();
	answers.add(correctAnswer);
	while (answers.size < 4) {
		const offset = Math.floor(randomRange(threshold, -threshold));
		if (offset !== 0) {
			const wrongAnswer = correctAnswer + offset;
			answers.add(wrongAnswer);
		}
	}

	return shuffle([...answers]);
}

/* --------------------------- Push Down Automata --------------------------- */
// Expr := Term Op Term
// Term := (Expr) | Factor
// Factor := number
// Op := operator
function Expr(max: number, depth: number): string {
	depth--;
	return `${Term(max, depth)} ${Op()} ${Term(max, depth)}`;
}

function Term(max: number, depth: number): string {
	depth--;
	const options = [() => `(${Expr(max, depth)})`, () => `${Factor(max)}`];

	if (depth <= 0) return options[1]();
	return random(options)();
}

function Op(): string {
	return random(OPERATORS);
}

function Factor(max: number): number {
	return randomRange(max);
}

/* --------------------------------- Helpers -------------------------------- */
function random<T>(a: T[]): T {
	return a[Math.floor(Math.random() * a.length)];
}

function randomRange(max: number, min: number = 1): number {
	return Math.floor(Math.random() * max) + min;
}

function shuffle<T>(answers: T[]): T[] {
	return answers.sort(() => Math.random() - 0.5);
}
