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

interface UserBody {
  answer: number,
  encoded: string,
}

interface EncodedBody {
  index: number;
  solution: number;
  score: number,
  startTime: number;
}

const jsonResponse = (data: ResponsePayload | object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export async function POST(req: Request) {
  try {
    const body = await req.body as Partial<UserBody>;

    if (!body.encoded) {
      const startTime = Date.now();
      const problem = createProblem(0, 0);

      const payload = encrypt(
        JSON.stringify({
          index: 0,
          solution: problem.correctAnswer,
          score: 0,
          startTime,
        })
      );

      return jsonResponse({
        index: problem.index,
        question: problem.question,
        answers: problem.answers,
        encoded: payload,
      });
    }

    const decoded = JSON.parse(decrypt(body.encoded)) as EncodedBody;

    const is_correct = body.answer && decoded.solution == body.answer


    const elapsed = (Date.now() - decoded.startTime) / 1000;
    if (elapsed > timeLimit) {
      return jsonResponse({ ok: true, finished: true, points: decoded.score, index: decoded.index });
    }

    const problem = createProblem(decoded.index, decoded.index);

    const nextIndex = decoded.index + 1;
    const nextProblem = createProblem(nextIndex, nextIndex);
    const nextScore = is_correct ? decoded.score + 1 : decoded.score

    const nextEncoded = encrypt(
      JSON.stringify({
        index: nextIndex,
        startTime: decoded.startTime,
        score: nextScore,
        solution: nextProblem.correctAnswer
      })
    );

    return jsonResponse({
      ok: is_correct,
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

