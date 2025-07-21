import {Route, Routes} from "react-router-dom";
import {Home} from "../../pages/Home/Home.tsx";
import * as React from "react";
import {BrowseBooks} from "../../pages/BrowseBooks/BrowseBooks.tsx";
import {MyBooks} from "../../pages/MyBooks/MyBooks.tsx";
import {Requests} from "../../pages/Requests/Requests.tsx";
import {Profile} from "../../pages/Profile/Profile.tsx";

export function MainContent() {
    return (
        <div className=' bg-white w-full h-screen p-2 flex items-center justify-center'>
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/browse-books" element={<BrowseBooks/>}></Route>
                <Route path="/my-books" element={<MyBooks/>}></Route>
                <Route path="/requests" element={<Requests/>}></Route>
                <Route path="/profile" element={<Profile/>}></Route>
            </Routes>
        </div>
    );
}