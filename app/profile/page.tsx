"use client";
import { useContext,  useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUserContext } from "@/app/context/AuthUserProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAuth, signOut } from "firebase/auth";

export default function UserProfilePage() {
	const router = useRouter();
	const { user } = useContext(AuthUserContext);

	const [achievements, setAchievements] = useState<any[]>([]);
	const [loadingAchievements, setLoadingAchievements] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLogout = async () => {
		const auth = getAuth();
		await signOut(auth);
		router.push("/login");
	};

	const getAchievements = async () => {
		try {
			setLoadingAchievements(true);
			setErrorMessage("");

			const headers: Record<string, string> = {
				"Accept": "application/json",
			};


			// const res = await fetch("falta la ruta", {
			// 	method: "GET",
			// 	headers,
			// });

			// if (!res.ok) 
			// 	throw new Error(`HTTP ${res.status}`);
			// const data = await res.json();
			setAchievements([
			{ title: "Primer inicio de sesión" },
			{ title: "Explorador del perfil" },
			{ title: "Desbloqueado: Probando Achievements" },
		]);
		} catch (err: any) {
			console.error("Error fetching achievements:", err);
			setErrorMessage(err.message || "Failed to fetch achievements");
		} finally {
			setLoadingAchievements(false);
		}
	};



	const getAvatar = (email?: string) =>
		`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
			email ?? ""
		)}`;

	if (!user) return null; 

	return (
		<Card className="w-full max-w-md shadow-lg">
			<CardHeader className="text-center">
				<h2 className="text-2xl font-semibold">Your Profile</h2>
			</CardHeader>

			<CardContent className="flex flex-col items-center gap-4">
				<img
					src={user.photoURL || getAvatar(user.email ?? "")}
					alt="User Avatar"
					className="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-700"
				/>

				<div className="text-center">
					<p className="text-lg font-medium">
						{user.displayName || "No display name"}
					</p>
					<p className="text-sm text-muted-foreground">
						{user.email}
					</p>
				</div>
				<div className="text-center mt-4 w-full">
					<h3 className="font-semibold mb-2">Achievements</h3>

					{errorMessage && (
						<Alert variant="destructive" className="mb-4">
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}

					<Button
						variant="outline"
						size="sm"
						onClick={getAchievements}
						disabled={loadingAchievements}
						className="w-full"
					>
						{loadingAchievements ? "Loading..." : "Load Achievements"}
					</Button>

					{achievements.length > 0 && (
						<ul className="mt-3 text-left">
							{achievements.map((a, i) => (
								<li key={i} className="border-b py-1">
									{a.title || JSON.stringify(a)}
								</li>
							))}
						</ul>
					)}
				</div>


				<Button
					variant="outline"
					size="sm"
					onClick={handleLogout}
					className="mt-4 w-full"
				>
					Logout
				</Button>
			</CardContent>
		</Card>
	);
}
