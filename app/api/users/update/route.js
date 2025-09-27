import { NextResponse } from "next/server";
import { adminAuth, db, admin } from "../../../../lib/firebaseAdmin";

export async function PATCH(req) {
    try {
        const authHeader = req.headers.get("authorization");

        const { newName } = await req.json();

        if (!newName) {
            return NextResponse.json({ error: "Missing newName" }, { status: 400 });
        }

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await adminAuth.verifyIdToken(token);
        const uid = decoded.uid;

        const userDoc = await db.collection("users").doc(decoded.uid).get();
        if (!userDoc.exists) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userRecord = await adminAuth.updateUser(uid, {
            displayName: newName,
        });

        await db.collection("users").doc(uid).update({
            name: newName,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        return NextResponse.json({
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
        });
    } catch (err) {
        console.error("Change name error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
