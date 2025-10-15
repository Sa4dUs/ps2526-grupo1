"use client";

import { useContext } from "react";
import { AuthUserContext } from "@/app/context/AuthUserProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UserMenu from "./components/menu";

export default function Home() {
	const { user } = useContext(AuthUserContext);

	return (
		<div className="flex flex-col min-h-screen bg-background text-foreground">
			<header className="flex items-center justify-between px-8 py-6 border-b border-border">
				<h1 className="text-2xl font-semibold tracking-tight">App</h1>

				<nav className="flex items-center space-x-4">
					{user ? (
						<UserMenu />
					) : (
						<>
							<Link href="/login">
								<Button variant="default">Login</Button>
							</Link>
							<Link href="/signup">
								<Button variant="outline">Signup</Button>
							</Link>
						</>
					)}
				</nav>
			</header>

			<main className="flex flex-col flex-grow items-center justify-center gap-10 px-4 text-center">
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
					</CardContent>
				</Card>
			</main>

			<footer className="py-6 text-center text-sm text-muted-foreground border-t border-border">
				© {new Date().getFullYear()} App
			</footer>
		</div>
	);
}
