"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MenuPage() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="fixed top-6 right-6 z-50">
        <div className="relative">
      <button
        className="flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        onClick={() => setOpen(!open)}
        aria-label="Abrir menú"
      >
        <span className="block w-6 h-0.5 bg-foreground mb-1"></span>
        <span className="block w-6 h-0.5 bg-foreground mb-1"></span>
        <span className="block w-6 h-0.5 bg-foreground"></span>
      </button>
          {open && (
            <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl z-50 flex flex-col">
              <button
                className="block w-full text-left px-6 py-3 hover:bg-blue-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
                onClick={() => { setOpen(false); router.push("/profile"); }}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-6 py-3 hover:bg-blue-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 transition"
                onClick={() => { setOpen(false); router.push("/settings"); }}
              >
                Setting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}