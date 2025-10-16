import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthUserProvider } from "./context/AuthUserProvider";
import Navbar from "./components/nav";
import Footer from "./components/footer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "EduMath",
	description: "Learn math the fun way!",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`}
			>
				<AuthUserProvider>
					<Navbar />

					<main className="flex flex-col flex-grow items-center justify-center px-4 py-6 w-full">
						{children}
					</main>

					<Footer />
				</AuthUserProvider>
			</body>
		</html>
	);
}
