import {Navbar} from "./view/common/Navbar/Navbar.tsx";
import {MainContent} from "./view/common/MainContent/MainContent.tsx";
import {Footer} from "./view/common/Footer/Footer.tsx";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";
import * as React from "react";
import {Login} from "./view/pages/Login/Login.tsx";
import {useEffect} from "react";
import {isTokenExpired} from "./auth/auth.ts";
import {Unauthorized} from "./auth/Unauthorized.tsx";

function App() {
    const navigate = useNavigate()
    useEffect(()=>{
        const accessToken = localStorage.getItem("accessToken")
        if(!accessToken || isTokenExpired(accessToken )){
            localStorage.removeItem("accessToken");
            navigate("/login")
        }
    },[navigate])

    return(
        <>

                <Routes>
                    <Route path="/*" element={<DefaultLayout/>}></Route>
                    <Route path="/login" element={<Login/>}></Route>
                    <Route path="unauthorized" element={<Unauthorized/>}/>
                </Routes>


        </>
    )
}

export default App