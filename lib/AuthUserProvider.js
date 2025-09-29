//all of this is Rocket tutorial of how create useFirebaseAuth.jsx.
//in there are things we don't need...I suppose...   -_-
"use client";
import { createContext, useState, useEffect } from "react";
import { auth } from "../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";

export const AuthUserContext = createContext(null);

export const AuthUserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
    });

    return () => unsubscribe();
    }, []); 

    return (
    <AuthUserContext.Provider value={user}>
        {children}
    </AuthUserContext.Provider>
  );
};
