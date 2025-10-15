"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/app/context/AuthUserProvider";

export default function LogInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const { signIn, user, loading } = useAuth();

	const handleLoginClick = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!email || !password) {
				setErrorMessage("Please enter both email and password");
				return;
			}

			await signIn(email, password);
			router.push("/");
		} catch (error: unknown) {
			console.error("Login error:", error);
			if (error && typeof error === "object" && "code" in error) {
				const firebaseError = error as { code: string };
				if (firebaseError.code === "auth/invalid-credential") {
					setErrorMessage("Invalid email or password");
				} else if (firebaseError.code === "auth/too-many-requests") {
					setErrorMessage(
						"Too many attempts. Please try again later"
					);
				} else {
					setErrorMessage("An error occurred during login");
				}
			} else {
				setErrorMessage("An unexpected error occurred");
			}
		}
	};

	useEffect(() => {
		if (!loading && user) {
			router.push("/");
		}
	}, [user, loading, router]);

	return (
		<>
			{errorMessage && (
				<Alert variant="destructive" className="mb-6 w-full max-w-md">
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<h2 className="text-xl font-semibold text-center">Login</h2>
				</CardHeader>
				<CardContent>
					<form
						className="flex flex-col gap-4"
						onSubmit={handleLoginClick}
					>
						<div className="space-y-2">
							<Label>Email:</Label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
							/>
						</div>

						<div className="space-y-2">
							<Label>Password:</Label>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
							/>
						</div>

						<Button type="submit" className="mt-4 w-full">
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
