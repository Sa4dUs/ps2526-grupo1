"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUserContext } from "@/app/context/AuthUserProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getAuth, signOut } from "firebase/auth";

export default function UserProfilePage() {
	const router = useRouter();
	const { user } = useContext(AuthUserContext);

	useEffect(() => {
		if (!user) {
			router.push("/");
		}
	}, [router, user]);

	const handleLogout = async () => {
		const auth = getAuth();
		await signOut(auth);
		router.push("/login");
	};

	const getAvatar = (email?: string) =>
		`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
			email ?? ""
		)}`;

	if (!user) return null; // opcional: evita render antes de redirigir

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
