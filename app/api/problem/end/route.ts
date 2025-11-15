import { generateProblems } from "@/lib/problems";
import { encrypt, decrypt } from "@/lib/crypto";
import { Problem, ProblemError, RequestPayload, ResponsePayload } from "@/types/problem";

const createProblem = (index: number, difficulty: number): Problem =>
  ({ index, ...generateProblems(difficulty) } as Problem);


const jsonResponse = (data: ResponsePayload | object, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });

type TimeTrialPayload = RequestPayload & {
  timeLeft?: number;
  type?: "end";
  startTime?: number; 
};
export async function POST(req: Request) {
  try {
    const raw = await req.json().catch(() => ({}));
    const payload: TimeTrialPayload & { score?: number } = raw ?? {};

    if ("type" in payload && payload.type === "end") {
      console.log("Time Trial finished:", {
        score: payload.score ?? 0, 
        timeLeft: payload.timeLeft,
      });

      return jsonResponse({ ok: true });
    }

    if (payload.score != null) {
      console.log("Time Trial finished:", {
        score: payload.score,
        timeLeft: payload.timeLeft,
      });
      return jsonResponse({ ok: true });
    }

    if ("timeLeft" in payload && payload.timeLeft != null) {
      if (payload.timeLeft < 0 || payload.timeLeft > 30) {
        return jsonResponse({ error: ProblemError.UnexpectedError }, 400);
      }
    }

    let index = 0;
    if ("solution" in payload && payload.solution != null && payload.encoded != null) {
      const decoded = JSON.parse(decrypt(payload.encoded)) as Problem;
      index = decoded.index;

      if (payload.solution !== decoded.correctAnswer) {
        return jsonResponse({ error: ProblemError.IncorrectSubmission });
      }
      index++;
    }

    const next = createProblem(index, index);
    const encoded = encrypt(JSON.stringify(next));

    return jsonResponse({
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
