//as far as I am concerned this is the only name that next.js accept to recognise
"use client";
/*THE COMMENTS IN THIS PARTS ARE PERSONAL NOTES FOR ME TO LEARN, NOT REAL COMMENTS */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LogInPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const handleLoginClick = async (e) => {
		//we need async to be able to use wait later on.
		//try-catch is react version of angular's .valid
		e.preventDefault();

		try {
			if (!username || !password) {
				setErrorMessage(
					"The reason why you have fingers is the reason it failed :)"
				);
				return;
			}
			//to use as backend firebase we need JSON format not HTML (append won't work)
			const response = await fetch("/api/auth/login", {
				//George route
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: username,
					password: password,
				}),
			});
			const data = await response.json();
			//here the switch case
			switch (response.status) {
				case 200:
					router.push("/"); //@TODO, this is a big shit
					console.log("Login worked", data);
				case 401:
					setErrorMessage("Invalid credentials, you fool");
				case 500:
					setErrorMessage("Internal error, PANIC");
			}
		} catch (err) {
			console.log("LogIn error", err);
			setErrorMessage("Something happened during the login.");
		}
	};

	/* HTML PART*/
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground px-4">
			{errorMessage && (
				<Alert variant="destructive" className="mb-6 max-w-md w-full">
					<AlertDescription>{errorMessage}</AlertDescription>
				</Alert>
			)}

			<Card className="w-full max-w-md shadow-lg">
				<CardHeader>
					<h2 className="text-xl font-semibold text-center">Login</h2>
				</CardHeader>
				<CardContent>
					<form className="flex flex-col gap-4">
						<div className="space-y-2">
							<Label>Username:</Label>
							<Input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
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

						<Button
							onClick={handleLoginClick}
							className="mt-4 w-full"
						>
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
