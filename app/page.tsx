"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Home() {
	return (
		<Card className="w-full max-w-md shadow-lg">
			<CardHeader>
				<h2 className="text-xl font-medium">Game Modes</h2>
			</CardHeader>
			<CardContent className="flex justify-around">
				<Link href="/puzzle">
					<Button className="w-32">Puzzle Rush</Button>
				</Link>
				<Link href="/train">
					<Button variant="secondary" className="w-32">
						Train
					</Button>
				</Link>
				<Link href="/timetrial">
					<Button className="w-32">
						Time trial
					</Button>
				</Link>
			</CardContent>
		</Card>
	);
}
