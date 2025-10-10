'use client'

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!username || !email || !password) {
                setErrorMessage("Please, fill in all required fields in the form");
                return;
            }

            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    name: username,
                }),
            });
            const data = await response.json();
            switch (response.status) {
                case 200:
                    router.push("/");
                    console.log("Successful registration: ", data);
                case 500:
                    setErrorMessage("Internal error");
            }
        } catch (err) {
            console.log("SignUp error: ", err);
            setErrorMessage("An error occurred during registration");
        }
    }

    const handler = (setValue: (val: string) => void, validator: (val: string) => boolean, errorText: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setValue(value);
        setErrorMessage(validator(value) ? '' : errorText);
    };

    const isValidUsername = (value: string) => value.trim().length > 0;
    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+.[^\s@]+$/.test(value);
    const isValidPassword = (value: string) => value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

    /* HTML PART */
    return (
        <div className="bodyContainer">
            {errorMessage && (<div className="error">{errorMessage}</div>)}
            <div className="formDiv">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Enter a username:</label>
                    <input type="text" id="username" name="username" placeholder="Username" value={username} onChange={handler(setUsername, isValidUsername, "Username cannot be empty")}/>

                    <label htmlFor="email">Enter an email:</label>
                    <input type="email" id="email" name="email" placeholder="email.address@domain.com" value={email} onChange={handler(setEmail, isValidEmail, "Email is not valid or already in use")}/>

                    <label htmlFor="password">Enter a password:</label>
                    <input type="password" id="password" name="password" placeholder="********" value={password} onChange={handler(setPassword, isValidPassword, "Password must be at least 8 characters and include lowercase, uppercase, and a number.")}/>

                    <label htmlFor="instructions">
                        Your password must contain:
                        <ul>
                            <li>At least 8 characters</li>
                            <li>At least one lowercase letter [a - z]</li>
                            <li>At least one uppercase letter [A - Z]</li>
                            <li>At least one numeric digit [0 - 9]</li>
                        </ul>
                    </label>

                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    )
}
