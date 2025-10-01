import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";

type Solution = {
	solution: number;
	encoded: string;
};

type RequestPayload = Solution | null;

enum ProblemError {
	IncorrectSubmission = "IncorrectSubmission",
	UnexpectedError = "UnexpectedError",
	InvalidInput = "InvalidInput",
}

type ResponseError = { error: ProblemError };

type ResponseSuccess = {
	problem: string;
	encoded: string;
};

type ResponsePayload = ResponseError | ResponseSuccess;

type Problem = {
	index: number;
	question: string;
	answers: number[];
	correctAnswer: number;
};

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

		return jsonResponse({ problem: next.question, encoded });
	} catch {
		return jsonResponse({ error: ProblemError.UnexpectedError }, 500);
	}
}
