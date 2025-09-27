import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const apiKey = process.env.FIREBASE_API_KEY;

        const res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
            }),
        }
        );

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.error.message }, { status: 400 });
        }

        return NextResponse.json({
        idToken: data.idToken,
        refreshToken: data.refreshToken,
        expiresIn: data.expiresIn,
        localId: data.localId,
        email: data.email,
        });
    } catch (err) {
        console.error("Login error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
