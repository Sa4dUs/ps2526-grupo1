import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { encrypt } from "@/lib/crypto";
import { ProblemError } from "@/types/problem";

vi.mock("@/lib/problems", () => ({
	generateProblems: (difficulty: number) => ({
		question: `Q${difficulty}`,
		answers: [1, 2, 3],
		correctAnswer: 42,
	}),
}));

console.log = vi.fn();
console.error = vi.fn();

describe("POST /api/problem", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("returns first problem when body is null", async () => {
		const req = new Request("http://localhost", {
			method: "POST",
			body: "null",
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.question).toBe("Q0");
		expect(data.encoded).toBeDefined();
	});

	it("returns next problem on correct submission", async () => {
		const first = {
			index: 0,
			question: "Q0",
			answers: [1, 2, 3],
			correctAnswer: 42,
		};

		const encoded = encrypt(JSON.stringify(first));

		const req = new Request("http://localhost", {
			method: "POST",
			body: JSON.stringify({ solution: 42, encoded }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.question).toBe("Q1");
		expect(data.encoded).toBeDefined();
	});

	it("returns error on incorrect submission", async () => {
		const first = {
			index: 0,
			question: "Q0",
			answers: [1, 2, 3],
			correctAnswer: 42,
		};

		const encoded = encrypt(JSON.stringify(first));

		const req = new Request("http://localhost", {
			method: "POST",
			body: JSON.stringify({ solution: 999, encoded }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.error).toBe(ProblemError.IncorrectSubmission);
	});

	it("returns error when timeLeft is invalid", async () => {
		const req = new Request("http://localhost", {
			method: "POST",
			body: JSON.stringify({ timeLeft: 200 }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(400);
		expect(data.error).toBe(ProblemError.UnexpectedError);
	});

	it("handles end game payload correctly", async () => {
		const req = new Request("http://localhost", {
			method: "POST",
			body: JSON.stringify({ type: "end", score: 10, timeLeft: 5 }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.ok).toBe(true);
	});
});
