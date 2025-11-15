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

type ResponseData = ResponsePayload | { ok: true } | { error: ProblemError };

const jsonResponse = (data: ResponseData, status = 200) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { "Content-Type": "application/json" },
    });

type TimeTrialAnswerPayload = RequestPayload & { timeLeft?: number; type?: undefined };
type TimeTrialEndPayload = { type: "end"; score: number; timeLeft?: number };
type TimeTrialPayload = TimeTrialAnswerPayload | TimeTrialEndPayload;

export async function POST(req: Request) {
    try {
        //what happens if you make this easier?->test error
        let payload: TimeTrialPayload | Record<string, unknown> = {};
        try {
            const raw = await req.text();
            payload =
                !raw || raw === "null"
                    ? {}
                    : (JSON.parse(raw) as TimeTrialPayload);
        } catch {
            payload = {};
        }

        if ("type" in payload && payload.type === "end") {
            console.log("Time Trial finished:", {
                score: (payload as TimeTrialEndPayload).score,
                timeLeft: (payload as TimeTrialEndPayload).timeLeft,
            });

            return jsonResponse({ ok: true });
        }

        if ("timeLeft" in payload) {
            const t = (payload as TimeTrialAnswerPayload).timeLeft;
            if (t != null && (t < 0 || t > 30)) {
                return jsonResponse({ error: ProblemError.UnexpectedError }, 400);
            }
        }

        let index = 0;

        if (
            "solution" in payload &&
            (payload as TimeTrialAnswerPayload).solution != null &&
            (payload as TimeTrialAnswerPayload).encoded != null
        ) {
            const decoded = JSON.parse(
                decrypt((payload as TimeTrialAnswerPayload).encoded)
            ) as Problem;
            index = decoded.index;

            if ((payload as TimeTrialAnswerPayload).solution !== decoded.correctAnswer) {
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
