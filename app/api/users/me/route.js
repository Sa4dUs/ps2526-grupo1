import { NextResponse } from "next/server";
import { adminAuth, db } from "@/lib/firebaseAdmin";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await adminAuth.verifyIdToken(token);

        const userDoc = await db.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ uid: decoded.uid, ...userDoc.data() });
    } catch (err) {
        console.error("Error fetching user:", err);
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
