"use client" 
import { useContext } from "react"
import { AuthUserContext } from "@/lib/AuthUserProvider";


export default function userProfilePage(){
    const user = useContext(AuthUserContext) as any; //without this any HTML die, due to line 8
    //in AuthServiceProvider

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