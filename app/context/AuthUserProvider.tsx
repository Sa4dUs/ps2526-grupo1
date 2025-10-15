"use client";

import {
	createContext,
	useState,
	useEffect,
	useContext,
	ReactNode,
} from "react";
import { auth } from "../../lib/firebaseClient";
import {
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signOut as firebaseSignOut,
	User,
} from "firebase/auth";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
}

export const AuthUserContext = createContext<AuthContextType>({
	user: null,
	loading: true,
	signIn: async () => {},
	signOut: async () => {},
});

export const useAuth = () => useContext(AuthUserContext);

export const AuthUserProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			setUser(firebaseUser);
			setLoading(false);
		});

		return () => unsubscribe();
	}, []);

	const signIn = async (email: string, password: string) => {
		await signInWithEmailAndPassword(auth, email, password);
	};

	const signOut = async () => {
		await firebaseSignOut(auth);
	};

	const value: AuthContextType = {
		user,
		loading,
		signIn,
		signOut,
	};

	return (
		<AuthUserContext.Provider value={value}>
			{children}
		</AuthUserContext.Provider>
	);
};
