import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";
import {
	Problem,
	ProblemError,
	RequestPayload,
	ResponsePayload,
} from "@/types/problem";
import { db } from "@/lib/firebaseClient";
import { doc, runTransaction } from "firebase/firestore";
import { ACHIEVEMENTS } from "@/data/achievements";

const createProblem = (index: number, difficulty: number): Problem =>
	({ index, ...generateProblems(difficulty) } as Problem);

const jsonResponse = (data: ResponsePayload, status = 200) =>
	new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});

export async function POST(req: Request) {
	let is_correct = false;
	let score = 0;
	try {
		const payload: RequestPayload = await req.json();
		let index = 0;

		if (payload) {
			const { solution, encoded, user_id } = payload;
			console.log(user_id);
			const decoded = JSON.parse(decrypt(encoded)) as Problem;
			index = decoded.index;
			score = decoded.score ?? 0;

			if (solution !== decoded.correctAnswer) {
				const ref = doc(db, "users", user_id);

				await runTransaction(db, async (transaction) => {
					const snapshot = await transaction.get(ref);
					if (!snapshot.exists()) throw new Error("document does not exist");

					const data = snapshot.data();
					const current_best = data.stats?.best_score ?? 0;
					const new_value = Math.max(current_best, score);

					const current_games = data.stats?.total_games ?? 0;
					const stats = {
						...data.stats,
						best_score: new_value,
						total_games: current_games + 1,
					};

					const achievements = ACHIEVEMENTS.filter(a => a.validator(stats)).map(a => {
						return { name: a.name, image_url: a.image_url }
					});

					transaction.update(ref, {
						"stats": stats,
						"achievements": achievements,
					});
				});

				return jsonResponse({
					error: ProblemError.IncorrectSubmission,
				});
			}

			is_correct = true;
			index++;
		}

		const difficulty = Math.min(4, Math.floor(Math.log2(index + 1)));
		const next = {...createProblem(index, difficulty), score : score + Number(is_correct)};
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
