export default function ProblemComponent({
	question,
	answers,
	onAnswer,
}: {
	question: string;
	answers: number[];
	onAnswer: (selected: number) => void;
}) {
	return (
		<div className="bg-white dark:bg-neutral-800 p-4 rounded border border-neutral-200 dark:border-neutral-700 transition-colors">
			<p className="text-base font-medium mb-4">{question}</p>
			<ul className="space-y-2">
				{answers.map((ans, i) => (
					<li key={i}>
						<button
							onClick={() => onAnswer(ans)}
							className="w-full py-2 px-4 bg-neutral-100 dark:bg-neutral-700 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition text-left"
						>
							{ans}
						</button>
					</li>
				))}
			</ul>
		</div>
	);
}
