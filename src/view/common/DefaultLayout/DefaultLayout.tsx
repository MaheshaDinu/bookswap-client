import {Navbar} from "../Navbar/Navbar.tsx";
import {MainContent} from "../MainContent/MainContent.tsx";
import {Footer} from "../Footer/Footer.tsx";
import {useEffect, useState} from "react";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {UserData} from "../../../model/userData.ts";

export function DefaultLayout() {

    const[user, setUser] = useState<UserData>( null);
    useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken")
        if(accessToken){
            setUser(getUserFromToken(accessToken))
        }
    },[user])
    return (
        <>
            <Navbar user={user}/>
            <MainContent user={user}/>
            <Footer/>
        </>
    );
}