import { Button } from "@/components/ui/button";

export default function ProblemComponent({
	question,
	answers,
	selectedAnswer,
	isCorrect,
	onAnswer,
}: {
	question: string;
	answers: number[];
	selectedAnswer?: number | null;
	correctAnswer?: number | null;
	isCorrect?: boolean | null;
	onAnswer: (selected: number) => void;
}) {
	return (
		<div className="w-full">
			<h2 className="text-xl font-semibold mb-6 text-center">
				{question}
			</h2>
			<div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
				{answers.map((ans, i) => {
					let variant:
						| "default"
						| "destructive"
						| "secondary"
						| "success" = "default";
					let className =
						"w-full py-3 text-lg font-medium transition-all";

					if (selectedAnswer === null) variant = "default";
					else if (selectedAnswer && isCorrect)
						className +=
							" bg-green-500 text-white hover:bg-green-600";
					else if (selectedAnswer && !isCorrect)
						className += " bg-red-500 text-white hover:bg-red-600";
					else
						className +=
							" bg-muted text-muted-foreground opacity-70";
					return (
						<Button
							variant={"default"}
							key={i}
							className="w-full py-3 text-lg font-medium rounded-lg transition-all bg-default hover:bg-accent text-foreground"
							onClick={() => onAnswer(ans)}
							disabled={selectedAnswer != null}
						>
							{ans}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
