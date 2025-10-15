"use client";

import UserMenu from "./menu";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthUserContext } from "../context/AuthUserProvider";
import Link from "next/link";

export default function Navbar() {
	const { user } = useContext(AuthUserContext);

	return (
		<header className="flex items-center justify-between px-8 py-6 border-b border-border">
			<h1 className="text-2xl font-semibold tracking-tight">
				<Link href="/">App</Link>
			</h1>

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
	);
}
