import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

type AnswersProps <T>= {
	answers: T[];
	selected: T | null;
	isCorrect: boolean | null;
	correctAnswer?: T;
	onSelect: (answer: T) => void;
};

export function AnswerButtons<T>({
	answers,
	selected,
	isCorrect,
	correctAnswer,
	onSelect,
}: AnswersProps<T>) {
	return (
		<div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
			{answers.map((ans, i) => {
				let className =
					"w-full py-3 text-lg font-medium transition-all rounded-lg";

				if (selected === null)
					className += " bg-gray-800 text-white hover:bg-gray-700";
				else if (ans === selected && isCorrect)
					className += " bg-green-500 text-white hover:bg-green-600";
				else if (ans === selected)
					className +=
						" bg-yellow-500 text-white hover:bg-yellow-600";
				else className += " bg-gray-700 text-white opacity-70";

				return (
					<Button
						key={i}
						className={className}
						onClick={() => onSelect(ans)}
						disabled={selected !== null}
					>
						{ans as ReactNode}
					</Button>
				);
			})}
		</div>
	);
}
