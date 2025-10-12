"use client" 
import { useContext } from "react"
import { AuthUserContext } from "@/lib/AuthUserProvider";
import { useRouter } from 'next/navigation';


type userType = { 
    displayName: string; 
    email: string;
};

export default function UserProfilePage() { //if it is wroten as before npm run build fail.
    const router = useRouter();

    const user = useContext(AuthUserContext) as userType | null; //any don't pass lint, I needed to create a type
    //and also failed => type or null :|
    
    //I added a few if's because if not the HTML dies
    if (!user){
            console.log("You are not authenticated");
            router.push("/");
            return(<p>You are not authenticated</p>);
    }
    if (user===null){
        console.log("You are null?");
        router.push("/");
        return (<p>You are null?</p>)
    }
    return(
        <div>
            <h1>Your Profile</h1>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}