import {Route, Routes} from "react-router-dom";
import {Home} from "../../pages/Home/Home.tsx";
import * as React from "react";
import {MyBooks} from "../../pages/MyBooks/MyBooks.tsx";
import {Requests} from "../../pages/Requests/Requests.tsx";
import {Profile} from "../../pages/Profile/Profile.tsx";

export function MainContent() {
    return (
        <div className=' bg-white w-full min-h-0 flex-1 overflow-auto'>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/my-books" element={<MyBooks/>}></Route>
                <Route path="/requests" element={<Requests/>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>
            </Routes>
        </div>
    );
}