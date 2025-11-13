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

type TimeTrialAnswerPayload = RequestPayload & { timeLeft?: number; type?: undefined };
type TimeTrialEndPayload = { type: "end"; score: number; timeLeft?: number };
type TimeTrialPayload = TimeTrialAnswerPayload | TimeTrialEndPayload;

type TimeTrialEndResponse = { ok: true };

export async function POST(req: Request) {
    try {
        const payload: TimeTrialPayload = await req.json();
        let index = 0;

        if ("type" in payload && payload.type === "end") {
            const { score, timeLeft } = payload;
            console.log("Time Trial finished:", { score, timeLeft });
            return new Response(JSON.stringify({ ok: true } as TimeTrialEndResponse), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        }

        if ("timeLeft" in payload && (payload.timeLeft! < 0 || payload.timeLeft! > 30)) {
            return jsonResponse({ error: ProblemError.UnexpectedError }, 400);
        }

        if (payload.solution != null && payload.encoded != null) {
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
