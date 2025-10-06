"use client" 
import { useContext } from "react"
import { AuthUserContext } from "@/lib/AuthUserProvider";


type userType = { 
    displayName: string; 
    email: string;
};

export default function UserProfilePage() { //if it is wroten as before npm run build fail.

    const user = useContext(AuthUserContext) as userType | null; //any don't pass lint, I needed to create a type
    //and also failed => type or null :|
    
    //I added a few if's because if not the HTML dies
    if (!user){
        return(
            <p>You do not exist, even online </p>
        )
    }
    if (user===null){
        return(
            <p>Your are null, feel special</p>
        )
    }
    return(
        <div>
            <h1>Your Profile</h1>
            <p>Name: {user.displayName}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}