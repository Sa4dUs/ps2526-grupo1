"use client";
import Link from "next/link";

export default function LogoutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 flex flex-col items-center max-w-sm">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Has cerrado la sesión
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          Esperamos verte pronto. Tu sesión se ha cerrado correctamente.
        </p>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  );
}