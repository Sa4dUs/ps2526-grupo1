"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getAuth, signOut } from "firebase/auth";
import app from "@/lib/firebaseClient";

export default function UserMenu() {
	const router = useRouter();
	const auth = getAuth(app);

	const handleLogout = async () => {
		await signOut(auth);
		router.push("/login");
	};

	const goToProfile = () => {
		router.push("/profile");
	};

	return (
		<div className="fixed top-6 right-6 flex items-center gap-4 z-50">
			<img
				src="https://i.pravatar.cc/150?img=3"
				alt="User Avatar"
				className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 cursor-pointer"
				onClick={goToProfile}
			/>

			<Button variant="outline" size="sm" onClick={handleLogout}>
				Logout
			</Button>
		</div>
	);
}
