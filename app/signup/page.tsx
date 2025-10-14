"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!username || !email || !password) {
				setErrorMessage(
					"Please, fill in all required fields in the form"
				);
				return;
			}

			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
					name: username,
				}),
			});
			const data = await response.json();
			switch (response.status) {
				case 200:
					router.push("/");
					console.log("Successful registration: ", data);
				case 500:
					setErrorMessage("Internal error");
			}
		} catch (err) {
			console.log("SignUp error: ", err);
			setErrorMessage("An error occurred during registration");
		}
	};

	const handler =
		(
			setValue: (val: string) => void,
			validator: (val: string) => boolean,
			errorText: string
		) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setValue(value);
			setErrorMessage(validator(value) ? "" : errorText);
		};

	const isValidUsername = (value: string) => value.trim().length > 0;
	const isValidEmail = (value: string) =>
		/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(value);
	const isValidPassword = (value: string) =>
		value.length >= 8 &&
		/[a-z]/.test(value) &&
		/[A-Z]/.test(value) &&
		/\d/.test(value);

	/* HTML PART */
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
			{errorMessage && (
				<Alert variant="destructive" className="mb-6 max-w-md w-full">
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
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<div className="space-y-2">
							<Label htmlFor="username">Enter a username:</Label>
							<Input
								type="text"
								id="username"
								name="username"
								placeholder="Username"
								value={username}
								onChange={handler(
									setUsername,
									isValidUsername,
									"Username cannot be empty"
								)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Enter an email:</Label>
							<Input
								type="email"
								id="email"
								name="email"
								placeholder="email.address@domain.com"
								value={email}
								onChange={handler(
									setEmail,
									isValidEmail,
									"Email is not valid or already in use"
								)}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Enter a password:</Label>
							<Input
								type="password"
								id="password"
								name="password"
								placeholder="********"
								value={password}
								onChange={handler(
									setPassword,
									isValidPassword,
									"Password must be at least 8 characters and include lowercase, uppercase, and a number."
								)}
							/>
						</div>

						<div className="mt-2 text-sm text-muted-foreground text-left">
							<Label
								htmlFor="instructions"
								className="font-medium"
							>
								Your password must contain:
							</Label>
							<ul className="list-disc pl-6 mt-1 space-y-1">
								<li>At least 8 characters</li>
								<li>At least one lowercase letter [a - z]</li>
								<li>At least one uppercase letter [A - Z]</li>
								<li>At least one numeric digit [0 - 9]</li>
							</ul>
						</div>

						<Button type="submit" className="mt-4 w-full">
							Sign up
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
