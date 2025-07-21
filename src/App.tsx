import {Navbar} from "./view/common/Navbar/Navbar.tsx";
import {MainContent} from "./view/common/MainContent/MainContent.tsx";
import {Footer} from "./view/common/Footer/Footer.tsx";
import {BrowserRouter} from "react-router-dom";
import {DefaultLayout} from "./view/common/DefaultLayout/DefaultLayout.tsx";

function App() {

    return(
        <>
            <BrowserRouter>
                <DefaultLayout/>
            </BrowserRouter>
        </>
    )
}

export default App