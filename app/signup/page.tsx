"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/app/context/AuthUserProvider";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function SignUpPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const { user, loading } = useAuth();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");

		if (!username || !email || !password) {
			setErrorMessage("Please fill in all required fields.");
			return;
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			await updateProfile(userCredential.user, {
				displayName: username,
			});

			router.push("/");
		} catch (error: unknown) {
			console.error("Signup error:", error);
			if (
				typeof error === "object" &&
				error !== null &&
				"code" in error
			) {
				const code = (error as { code: string }).code;
				if (code === "auth/email-already-in-use") {
					setErrorMessage("Email is already in use.");
				} else if (code === "auth/weak-password") {
					setErrorMessage(
						"Password should be at least 6 characters."
					);
				} else {
					setErrorMessage("An error occurred during registration.");
				}
			} else {
				setErrorMessage("An error occurred during registration.");
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
					<h2 className="text-xl font-semibold text-center">
						Sign Up
					</h2>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSignUp}
						className="flex flex-col gap-4"
					>
						<div className="space-y-2">
							<Label>Username:</Label>
							<Input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Enter a username"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Email:</Label>
							<Input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label>Password:</Label>
							<Input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								required
							/>
						</div>

						<p className="text-xs text-muted-foreground text-left">
							Password must be at least 6 characters long.
						</p>

						<Button type="submit" className="mt-4 w-full">
							Create Account
						</Button>
					</form>
				</CardContent>
			</Card>
		</>
	);
}
