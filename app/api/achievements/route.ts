import { db } from "@/lib/firebaseClient";
import { doc, getDoc } from "firebase/firestore";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const user_id = searchParams.get("user_id");

		if (!user_id) {
			return new Response(JSON.stringify({ error: "Missing user_id" }), {
				status: 400,
			});
		}

		const ref = doc(db, "users", user_id);
		const snapshot = await getDoc(ref);

		if (!snapshot.exists()) {
			return new Response(JSON.stringify({ error: "User not found" }), {
				status: 404,
			});
		}

		const data = snapshot.data();

		const achievements = data.achievements ?? [];

		return new Response(JSON.stringify({ achievements }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (e) {
		console.error(e);
		return new Response(JSON.stringify({ error: "Unexpected error" }), {
			status: 500,
		});
	}
}
