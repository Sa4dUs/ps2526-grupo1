import { describe, it, expect, vi } from "vitest";
import { POST } from "./route";
import { encrypt } from "@/lib/crypto";

vi.mock("@/lib/problems", () => ({
	generateProblems: (difficulty: number) => ({
		question: `Q${difficulty}`,
		answers: [1, 2, 3],
		correctAnswer: 42,
	}),
}));

describe("POST /api/problems", () => {
	it("returns first problem when body is empty", async () => {
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
		const firstProblem = {
			index: 0,
			question: "Q0",
			answers: [1, 2, 3],
			correctAnswer: 42,
			score: 0,
		};
		const encoded = encrypt(JSON.stringify(firstProblem));

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
		const firstProblem = {
			index: 0,
			question: "Q0",
			answers: [1, 2, 3],
			correctAnswer: 42,
			score: 0,
		};
		const encoded = encrypt(JSON.stringify(firstProblem));

		const req = new Request("http://localhost", {
			method: "POST",
			body: JSON.stringify({ solution: 99, encoded }),
		});

		const res = await POST(req);
		const data = await res.json();

		expect(res.status).toBe(200);
		expect(data.error).toBe("IncorrectSubmission");
	});
});
