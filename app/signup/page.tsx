'use client'

import { useEffect, useState, FormEvent } from 'react'
import Image from 'next/image'
import '../styles.css'
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter();

    useEffect(() => {
        setupValidation()
    }, [])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Comprobar pasar a JSON para comunicación con Backend
        console.log("Submitting form")
        router.push("/");
    }

    /* HTML PART */
    return (
        <>
            <header className="p-3 sticky-top">
                <a href="/">
                    <Image src="/images/LogoURJC.png" alt="logo" height={50} width={150} />
                </a>
            </header>

            <div className="bodyContainer">
                <div className="formDiv">
                    <form id="signup-form" action="/" method="POST" onSubmit={handleSubmit}>
                        <label htmlFor="username">Introduce un nombre de usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <div id="error-username" className="error"></div>

                        <label htmlFor="email">Introduce un email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="email.address@dominio.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <div id="error-email" className="error"></div>

                        <label htmlFor="password">Introduce una contraseña:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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

            <footer className="p-3 sticky-bottom">
                <p>URJC - Ingeniería del Software - 2025 - Grupo 1</p>
            </footer>
        </>
    )
}

/* VALIDATION PART */
function setupValidation() {
    function showError(id: string, errorMessage: string) {
        const error = document.getElementById(id)
        if (error) {
            error.textContent = errorMessage
            error.style.display = 'block'
        }
    }

    function hideError(id: string) {
        const error = document.getElementById(id)
        if (error) {
            error.textContent = ''
            error.style.display = 'none'
        }
    }

    function checkInput(
        input: HTMLElement & { value: string; classList: DOMTokenList },
        condition: boolean,
        errorId: string,
        errorMessage: string
    ) {
        if (condition) {
            input.classList.remove('incorrect')
            input.classList.add('correct')
            hideError(errorId)
        } else {
            input.classList.remove('correct')
            input.classList.add('incorrect')
            showError(errorId, errorMessage)
        }
    }

    function checkPassword(str: string) {
        return (
            str.length >= 8 &&
            /[a-z]/.test(str) &&
            /[A-Z]/.test(str) &&
            /\d/.test(str)
        )
    }

    const username = document.getElementById('username') as HTMLInputElement | null
    const email = document.getElementById('email') as HTMLInputElement | null
    const password = document.getElementById('password') as HTMLInputElement | null
    const form = document.getElementById('signup-form') as HTMLFormElement | null

    if (!username || !email || !password || !form) return

    username.addEventListener('input', () => {
        checkInput(
            username,
            username.value.trim() !== '',
            'error-username',
            'El nombre de usuario no puede estar vacío.'
        )
    })

    email.addEventListener('input', () => {
        const valor = email.value.trim()
        checkInput(
            email,
            valor.includes('@') && valor.includes('.'),
            'error-email',
            'Introduce un correo electrónico válido.'
        )
    })

    password.addEventListener('input', () => {
        checkInput(
            password,
            checkPassword(password.value),
            'error-password',
            'La contraseña debe tener al menos 8 caracteres, una letra minúscula, una letra mayúscula y un número.'
        )
    })

    form.addEventListener('submit', () => {
        const userStatus = username.classList.contains('correct')
        const emailStatus = email.classList.contains('correct')
        const passwordStatus = password.classList.contains('correct')

        if (userStatus && emailStatus && passwordStatus) {
            form.submit()
        } else {
            alert('Por favor, corrige los campos marcados en rojo o vacíos.')
        }
    })
}
