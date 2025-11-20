"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import app from "@/lib/firebaseClient";
import { useContext } from "react";
import { AuthUserContext } from "../context/AuthUserProvider";

export default function UserMenu() {
	const router = useRouter();
	const auth = getAuth(app);
	const { user } = useContext(AuthUserContext);

	const handleLogout = async () => {
		await signOut(auth);
		router.push("/login");
	};

	const goToProfile = () => {
		router.push("/profile");
	};

	const goToRanking = () => {
		router.push("/ranking");
	};

	return (
		<div className="fixed top-6 right-6 flex items-center gap-4 z-50">
			<img
				src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${encodeURIComponent(
					user?.email ?? ""
				)}`}
				alt="User Avatar"
				className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
				onClick={goToProfile}
			/>

			<Button variant="outline" size="sm" onClick={handleLogout}>
				Logout
			</Button>
			<Button variant="outline" size="sm" onClick={goToRanking}>
				Ranking
			</Button>
			
		</div>
	);
}
