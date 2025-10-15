import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";
import {
	Problem,
	ProblemError,
	RequestPayload,
	ResponsePayload,
} from "@/types/problem";

const createProblem = (index: number, difficulty: number): Problem =>
	({ index, ...generateProblems(difficulty) } as Problem);

const jsonResponse = (data: ResponsePayload, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export async function POST(req: Request) {
	try {
		const payload: RequestPayload = await req.json();
		let index = 0;

		if (payload) {
			const { solution, encoded } = payload;
			const decoded = JSON.parse(decrypt(encoded)) as Problem;
			index = decoded.index;

			if (solution !== decoded.correctAnswer) {
				return jsonResponse({
					error: ProblemError.IncorrectSubmission,
				});
			}
			index++;
		}

		const next = createProblem(index, index);
		const encoded = encrypt(JSON.stringify(next));

		return jsonResponse({
			solution: next.correctAnswer,
			index: next.index,
			question: next.question,
			answers: next.answers,
			encoded,
		});
	} catch (e) {
		console.log(e);
		return jsonResponse({ error: ProblemError.UnexpectedError }, 500);
	}
}
