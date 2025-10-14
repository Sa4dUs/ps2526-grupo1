import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Here you could add any server-side cleanup if needed
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

