import { NextResponse } from "next/server";
import { adminAuth, db, admin } from "../../../../lib/firebaseAdmin";

export async function POST(req) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing fieldss" }, { status: 400 });
        }

        const user = await adminAuth.createUser({
            email,
            password,
            displayName: name,
        });

        await db.collection("users").doc(user.uid).set({
            name,
            email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            times: [],
        });

        return NextResponse.json({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
        });
    } catch (err) {
        console.error("Signup error:", err);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }
}
