"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Remove Firebase auth data
        localStorage.removeItem("idToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("email");
        localStorage.removeItem("localId")
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          You have logged out
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          We hope to see you soon. Your session has been closed successfully.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}