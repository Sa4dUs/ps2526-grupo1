'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!username || !email || !password || usernameError || emailError || passwordError) {
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

    /* HTML PART */
    return (
        <>
            <div className="bodyContainer">
                {errorMessage && (<div>{errorMessage}</div>)}
                <div className="formDiv">
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Enter a username:</label>
                        <input type="text" id="username" name="username" placeholder="Username" value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (!e.target.value.trim()) {
                                    setUsernameError("Username is not valid (cannot be empty)");
                                } else {
                                    setUsernameError('');
                                }
                            }}
                        />
                        {usernameError && <div className="error">{usernameError}</div>}

                        <label htmlFor="email">Enter an email:</label>
                        <input type="email" id="email" name="email" placeholder="email.address@domain.com" value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (!e.target.value.trim() || !e.target.value.includes('@') || !e.target.value.includes('.')) {
                                    setEmailError("Email is not valid or already in use");
                                } else {
                                    setEmailError('');
                                }
                            }}
                        />
                        {emailError && <div className="error">{emailError}</div>}

                        <label htmlFor="password">Enter a password:</label>
                        <input type="password" id="password" name="password" placeholder="********" value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (!e.target.value.trim() || !(e.target.value.length >= 8) || !/[a-z]/.test(e.target.value) || !/[A-Z]/.test(e.target.value) || !/\d/.test(e.target.value)) {
                                    setPasswordError("Password must be at least 8 characters and include lowercase, uppercase, and a number.");
                                } else {
                                    setPasswordError('');
                                }
                            }}
                        />
                        {passwordError && <div className="error">{passwordError}</div>}

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
        </>
    )
}
