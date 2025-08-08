import {Navbar} from "../Navbar/Navbar.tsx";
import {MainContent} from "../MainContent/MainContent.tsx";
import {Footer} from "../Footer/Footer.tsx";
import {useEffect, useState} from "react";
import {getUserFromToken} from "../../../auth/auth.ts";
import type {UserData} from "../../../model/userData.ts";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../../store/store.ts";
import {logoutSuccess} from "../../../slices/authSlice.ts";

export function DefaultLayout() {
    const [user, setUser] = useState<UserData>(null);


    useEffect(() => {

        const accessToken = localStorage.getItem("accessToken") as string;
        if (typeof accessToken === 'string') {
            setUser(getUserFromToken(accessToken));
        } else {
            // handle the case where accessToken is not a string
            console.error('Invalid access token');
        }
    },[])

    return (
        <>
            <Navbar user={user} />
            <MainContent user={user}/>
            <Footer/>
        </>
    );
}