'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!username || !email || !password) {
                setErrorMessage("Por favor, rellene todos los campos del formulario");
                return;
            }
            const nickname = document.getElementById('username') as HTMLInputElement;
            const mail = document.getElementById('email') as HTMLInputElement;
            const pw = document.getElementById('password') as HTMLInputElement;
            const userStatus = nickname.classList.contains('correct');
            const emailStatus = mail.classList.contains('correct');
            const passwordStatus = pw.classList.contains('correct');
            if (!userStatus || !emailStatus || !passwordStatus) {
                setErrorMessage('Por favor, corrija los campos marcados en rojo o vacíos');
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
                    console.log("Registro correcto", data);
                case 500:
                    setErrorMessage("Internal error");
            }
        } catch (err) {
            setErrorMessage("Ocurrió un error durante el registro");
        }
    }

    /* HTML PART */
    return (
        <>
            <div className="bodyContainer">
                {errorMessage && (
                    <div>
                        {errorMessage}
                    </div>
                )}
                <div className="formDiv">
                    <form id="signup-form" method="POST" onSubmit={handleSubmit}>
                        <label htmlFor="username">Introduce un nombre de usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); validateField("error-username", "username", "El nombre de usuario no es válido (no puede estar vacío)", e.target.value !== '') }}
                        />
                        <div id="error-username" className="error"></div>

                        <label htmlFor="email">Introduce un email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email.address@dominio.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); validateField("error-email", "email", "El email no es válido o ya está en uso", (e.target.value.trim() !== '' && e.target.value.includes('@') && e.target.value.includes('.'))) }}
                        />
                        <div id="error-email" className="error"></div>

                        <label htmlFor="password">Introduce una contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); validateField("error-password", "password", "La contraseña debe tener al menos 8 caracteres, una letra minúscula, una letra mayúscula y un número.", (e.target.value.length >= 8 && /[a-z]/.test(e.target.value) && /[A-Z]/.test(e.target.value) && /\d/.test(e.target.value))) }}
                        />
                        <div id="error-password" className="error"></div>

                        <label htmlFor="instructions">
                            Tu contraseña debe contener:
                            <ul>
                                <li>Al menos 8 caracteres</li>
                                <li>Al menos una letra minúscula [a - z]</li>
                                <li>Al menos una letra mayúscula [A - Z]</li>
                                <li>Al menos un dígito numérico [0 - 9]</li>
                            </ul>
                        </label>

                        <button type="submit">Registrarse</button>
                    </form>
                </div>
            </div>
        </>
    )
}

/* VALIDATION PART */
function showError(id: string, errorMessage: string) {
    const error = document.getElementById(id);
    if (error) {
        error.textContent = errorMessage;
        error.style.display = 'block';
    }
}

function hideError(id: string) {
    const error = document.getElementById(id);
    if (error) {
        error.textContent = '';
        error.style.display = 'none';
    }
}

function validateField(errorId: string, field: string, errorMessage: string, condition: boolean) {
    const inputField = document.getElementById(field)
    if (!inputField) return;
    if (condition) {
        inputField.classList.remove('incorrect');
        inputField.classList.add('correct');
        hideError(errorId);
    } else {
        inputField.classList.remove('correct');
        inputField.classList.add('incorrect');
        showError(errorId, errorMessage);
    }
}
