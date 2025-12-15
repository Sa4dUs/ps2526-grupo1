"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator, Timer, Flame, Plus, Code } from "lucide-react";

export default function Home() {
	return (
		<div className="w-full flex flex-col items-center p-6">
			<h2 className="text-3xl font-semibold mb-8 border rounded-md p-2 font-titan">CHOOSE GAME MODE</h2>

			<div className="w-full max-w-3xl flex flex-col gap-6">

				{/* TRAIN */}
				<Card className="w-full border rounded-3xl p-4 shadow-sm">
					<div className="flex items-center gap-6">
						<div className="p-4 rounded-2xl" style={{ backgroundColor: '#77c9ffff' }}>
							<Calculator className="w-16 h-16" style={{ stroke: '#102d42ff'}} />	
						</div>
						<div className="flex flex-col flex-grow">
							<h3 className="text-2xl font-medium tracking-wide">Train</h3>
							<p className="text-muted-foreground text-sm mb-3">
								Train your math skills at your own pace
							</p>
							<Link href="/train">
								<Button style={{ backgroundColor: '#102d42ff' }}>Start</Button>
							</Link>
						</div>
					</div>
				</Card>

				{/* PUZZLE RUSH */}
				<Card className="w-full border rounded-3xl p-4 shadow-sm">
					<div className="flex items-center gap-6">
						<div className="p-4 bg-gray-100 rounded-2xl" style={{ backgroundColor: '#ffcc9fff' }}>
							<Flame className="w-16 h-16" style={{ stroke: '#e74242ff'}} />
						</div>
						<div className="flex flex-col flex-grow">
							<h3 className="text-2xl font-medium tracking-wide">Puzzle Rush</h3>
							<p className="text-muted-foreground text-sm mb-3">
								Build the longest streak you can — one mistake ends it all.
							</p>
							<Link href="/puzzle">
								<Button style={{ backgroundColor: '#e74242ff' }}>Start</Button>
							</Link>
						</div>
					</div>
				</Card>

				{/* TIME TRIAL */}
				<Card className="w-full border rounded-3xl p-4 shadow-sm">
					<div className="flex items-center gap-6">
						<div className="p-4 bg-gray-100 rounded-2xl" style={{ backgroundColor: '#afff9fff' }}>
							<Timer className="w-16 h-16" style={{ stroke: '#6aa937ff'}} />
						</div>
						<div className="flex flex-col flex-grow">
							<h3 className="text-2xl font-medium tracking-wide">Time Trial</h3>
							<p className="text-muted-foreground text-sm mb-3">
								How many problems can you solve in 30 seconds?
							</p>
							<Link href="/timetrial">
								<Button style={{ backgroundColor: '#6aa937ff' }}>Start</Button>
							</Link>
						</div>
					</div>
				</Card>

				{/* OPERATOR */}
				<Card className="w-full border rounded-3xl p-4 shadow-sm">
					<div className="flex items-center gap-6">
						<div className="p-4 bg-gray-100 rounded-2xl" style={{ backgroundColor: '#dd9fffff' }}>
							<Plus className="w-16 h-16" style={{ stroke: '#6837a9ff'}}/>
						</div>
						<div className="flex flex-col flex-grow">
							<h3 className="text-2xl font-medium tracking-wide">Operator Challenge</h3>
							<p className="text-muted-foreground text-sm mb-3">
								Place each number and operator in the right spot to solve the equation.
							</p>
							<Link href="/operator">
								<Button style={{ backgroundColor: '#6837a9ff' }}>Start</Button>
							</Link>
						</div>
					</div>
				</Card>

				{/* HIGHER-LOWER */}
				<Card className="w-full border rounded-3xl p-4 shadow-sm">
					<div className="flex items-center gap-6">
						<div className="p-4 bg-gray-100 rounded-2xl">
							<Code className="w-16 h-16 text-gray-700" />
						</div>
						<div className="flex flex-col flex-grow">
							<h3 className="text-2xl font-medium tracking-wide">Higher Lower</h3>
							<p className="text-muted-foreground text-sm mb-3">
								Test your skills by comparing the results of two operations.
							</p>
							<Link href="/higherlower">
								<Button>Start</Button>
							</Link>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
