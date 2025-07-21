import {Link} from "react-router-dom";

export function Navbar() {


    return (
        <nav className="h-50 dark:bg-slate-700 hover:dark:bg-slate-800 flex items-center justify-between p-2 relative">
            <ul>
                <li className="inline-block text-sm text-white mr-2"><Link to="/">Home</Link></li>
                <li className="inline-block text-sm text-white mr-2"><Link to="/browse-books">Browse Books</Link></li>
                <li className="inline-block text-sm text-white mr-2"><Link to="/my-books">My Books</Link></li>
                <li className="inline-block text-sm text-white mr-2"><Link to="/requests">Requests</Link></li>
                <li className="inline-block text-sm text-white mr-2"><Link to="/profile">Profile</Link></li>
            </ul>

        </nav>
    );
}
