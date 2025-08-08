
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import * as React from "react";
import {Login} from "./view/pages/Login/Login.tsx";
import {useEffect, useState} from "react";
import {getUserFromToken, isTokenExpired} from "./auth/auth.ts";
import {Unauthorized} from "./auth/Unauthorized.tsx";
import type {UserData} from "./model/userData.ts";
import {UserRegistration} from "./view/pages/UserRegistration/UserRegistration.tsx";

function App() {
    const navigate = useNavigate()


    return(
        <>

                <Routes>
                    <Route path="/*" element={<DefaultLayout />}></Route>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="/register" element={<UserRegistration/>}></Route>
                    <Route path="unauthorized" element={<Unauthorized/>}/>
                </Routes>


        </>
    )
}

export default App