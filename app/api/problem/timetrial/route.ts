import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";
import { Problem, ProblemError, ResponsePayload } from "@/types/problem";

const timeLimit=30;
const createProblem = (index: number, difficulty: number): Problem => {
  const p = generateProblems(difficulty);

  if (p.correctAnswer == null) {
    throw new Error("generateProblems returned undefined correctAnswer");
  }

  return {
    index,
    question: p.question,
    answers: p.answers,
    correctAnswer: p.correctAnswer,
  };
};

const jsonResponse = (data: ResponsePayload | object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let { encoded } = body;

    if (!encoded) {
      const startTime = Date.now();
      const problem = createProblem(0, 0);

      const payload = encrypt(
        JSON.stringify({
          index: 0,
          solution: problem.correctAnswer,
          question: problem.question,
          answers: problem.answers,
          startTime,
        })
      );

      return jsonResponse({
        ok: true,
        index: problem.index,
        question: problem.question,
        answers: problem.answers,
        encoded: payload,
      });
    }

    const decoded = JSON.parse(decrypt(encoded)) as {
        index: number;
        question: string;
        solution: number;
        startTime:number;
    };
    let { index, startTime } = decoded;

    const elapsed = (Date.now() - startTime) / 1000;
    if (elapsed > timeLimit) {
      return jsonResponse({ ok: true, finished: true });
    }

    const problem = createProblem(index, index);
    if (decoded.solution != null && decoded.solution !== problem.correctAnswer) {
      return jsonResponse({ error: ProblemError.IncorrectSubmission });
    }

    const nextIndex = index + 1;
    const nextProblem = createProblem(nextIndex, nextIndex);

    const nextEncoded = encrypt(
      JSON.stringify({
        index: nextIndex,
        startTime,
      })
    );

    return jsonResponse({
      ok: true,
      index: nextProblem.index,
      question: nextProblem.question,
      answers: nextProblem.answers,
      encoded: nextEncoded,
    });

  } catch (e) {
    console.log(e);
    return jsonResponse({ error: ProblemError.UnexpectedError }, 500);
  }
}
