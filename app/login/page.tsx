//as far as I am concerned this is the only name that next.js accept to recognise 
'use client'
 /*THE COMMENTS IN THIS PARTS ARE PERSONAL NOTES FOR ME TO LEARN, NOT REAL COMMENTS */
import { useState } from 'react'
import { useRouter } from 'next/navigation';

export default function LogInPage(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');   
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

const handleLoginClick= async()=>{ //we need async to be able to use wait later on.
    //try-catch is react version of angular's .valid

    try{
        if (!username || !password){
            setErrorMessage("The reason why you have fingers is the reason it failed :)");
            return;
        }
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
        //here the switch case
        switch (response.status){
            case 200: 
                router.push("/"); //@TODO, this is a big shit 
                console.log("Login worked", data);
            case 401:
                setErrorMessage("Invalid credentials, you fool");
            case 500:
                setErrorMessage("Internal error, PANIC");
        }   



    }catch (err){
        console.log("LogIn error", err);
        setErrorMessage("Something happened during the login.");
    }
}

/* HTML PART*/
return (
    <div>        
        {errorMessage && (
            <div style={{ color: "red", marginBottom: "1rem" }}>
                {errorMessage}
            </div>
        )}
        <form>
            <div className="group">
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </div><div className='group'>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
        </form>
        <button onClick={handleLoginClick}> Login</button>

    </div>

)
}