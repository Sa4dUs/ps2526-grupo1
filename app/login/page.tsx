//as far as I am concerned this is the only name that next.js accept to recognise 
'use client'
 /*THE COMMENTS IN THIS PARTS ARE PERSONAL NOTES FOR ME TO LEARN, NOT REAL COMMENTS */
import { useState } from 'react'


import { useRouter } from 'next/router';

export default function LogInPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');   
    const router = useRouter();

const handleLoginClick= async()=>{ //we need async to be able to use wait later on.
    //try-catch is react version of angular's .valid
    if (!username || !password){
        console.warn ("FILL THE FORM BASTARD");
        return;
    }
    try{
        //to use as backend firebase we need JSON format not HTML (append won't work)
        const response = await fetch("/api/auth/login",{//George route
            method: "POST",
            headers: {
                "Content-Type":"application/json",
            },
            body: JSON.stringify({
                email:username,
                password:password,
            }), 
        });
        const data = await response.json();
        router.push("/"); //@TODO, this is shit 
        console.log("Login worked", data);

    }catch (err){
        console.error("Something happened during the login."); 
    }
}

/* HTML PART*/
return (
    <div>
        <h2>LogIn</h2>

        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLoginClick}> Login</button>
    </div>

)
}