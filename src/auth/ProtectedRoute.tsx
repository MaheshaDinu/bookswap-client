import {JSX, useEffect, useState} from "react";
import type {UserData} from "../model/userData.ts";
import {getUserFromToken} from "./auth.ts";

export function ProtectedRoute({childern}:{childern: JSX.Element}) {

    const [user, setUser] = useState<UserData>( null);

    useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            setUser(getUserFromToken(accessToken))
        }
    },[])

    if (!user.isAdmin){
        return null;
    }
    return childern

}