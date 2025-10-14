export type Solution = {
	solution: number;
	encoded: string;
};

export type RequestPayload = Solution | null;

export enum ProblemError {
	IncorrectSubmission = "IncorrectSubmission",
	UnexpectedError = "UnexpectedError",
	InvalidInput = "InvalidInput",
}

export type ResponseError = { error: ProblemError };

export type ResponseSuccess = {
	solution: number;
	index: number;
	question: string;
	answers: number[];
	encoded: string;
};

export type ResponsePayload = ResponseError | ResponseSuccess;

export type Problem = {
	index: number;
	question: string;
	answers: number[];
	correctAnswer: number;
};
