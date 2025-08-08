import {Link, useNavigate} from "react-router-dom"
import {useEffect, useState} from "react"
import icon from "../../../assets/react.svg"
import type {UserData} from "../../../model/userData.ts";
import {getUserFromToken} from "../../../auth/auth.ts";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../../store/store.ts";
import {logoutSuccess} from "../../../slices/authSlice.ts";



interface ResponsiveNavbarProps {
    user?: UserData | null

}



export function Navbar({user }: ResponsiveNavbarProps) {


    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        const  isLogout =dispatch(logoutSuccess());
        window.location.reload()
    }


    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <nav className="bg-blue-600 p-4 text-white">
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    {/* Left Side - Branding */}
                    <Link to="/" className="flex items-center space-x-2">
                        <img className="h-6 w-6" src={icon || "/placeholder.svg"} alt="BookSwap Hub Logo" />
                        <h1 className="text-2xl font-bold">BookSwap Hub</h1>
                    </Link>

                    {/* Mobile menu button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden flex flex-col space-y-1 p-2"
                        aria-label="Toggle mobile menu"
                    >
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                        <span className="block w-6 h-0.5 bg-white"></span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/" className="hover:underline transition-all duration-200">
                            Browse Books
                        </Link>

                        {user ? (
                            <>
                                <Link to="/my-books" className="hover:underline transition-all duration-200">
                                    My Books
                                </Link>
                                <Link to="/exchange-requests" className="hover:underline transition-all duration-200">
                                    Requests
                                </Link>
                                <Link to="/profile" className="hover:underline transition-all duration-200">
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
                                >
                                    Logout ({user.name})
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:underline transition-all duration-200">
                                    Login
                                </Link>
                                <Link to="/register" className="hover:underline transition-all duration-200">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-blue-500">
                        <div className="flex flex-col space-y-3 pt-4">
                            <Link
                                to="/"
                                className="hover:underline transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                className="hover:underline transition-all duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Browse Books
                            </Link>

                            {user ? (
                                <>
                                    <Link
                                        to="/my-books"
                                        className="hover:underline transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Books
                                    </Link>
                                    <Link
                                        to="/exchange-requests"
                                        className="hover:underline transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Requests
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="hover:underline transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout?.()
                                            setIsMobileMenuOpen(false)
                                        }}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 text-left"
                                    >
                                        Logout ({user.name})
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="hover:underline transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="hover:underline transition-all duration-200"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
