"use client";
import { useContext,  useEffect,  useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUserContext } from "@/app/context/AuthUserProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAuth } from "firebase/auth";

export default function UserProfilePage() {
	const router = useRouter();
	const { user, signOut } = useContext(AuthUserContext);
	interface Achievement{name:string; image_url: string;}
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLogout = async () => {
		await signOut();
		router.push("/login");
	};

	useEffect(()=> {
		(async () => {
			try {
				const headers: Record<string, string> = {
					"Accept": "application/json" 
				};
				const res = await fetch(`/api/achievements?user_id=${getAuth().currentUser?.uid}`, {
					method: "GET", 
					headers 
				});

				if (!res.ok) 
					throw new Error(`HTTP ${res.status}`);
				const data = await res.json();
				console.log(data)
				setAchievements(data.achievements);
			} catch (err: unknown) {
				console.error("Error fetching achievements:", err);
				setErrorMessage("Failed to fetch achievements");
			}
		})()
	}, []);


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

					{achievements.length > 0 && (
						<ul className="mt-3 w-full space-y-2">
							{achievements.map((a, i) => (
								<li
									key={i}
									className="p-3 rounded-lg border shadow-sm bg-card text-card-foreground flex items-center gap-3"
								>
									<img
										src={a.image_url}
										alt={a.name}
										className="w-10 h-10 rounded-md object-cover border"
									/>

									<span className="font-medium">
										{a.name}
									</span>
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
