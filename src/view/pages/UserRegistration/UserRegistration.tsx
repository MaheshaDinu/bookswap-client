import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../../store/store.ts";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {registerUser, resetUserStatus} from "../../../slices/userSlice.ts";
import type {CreateUserPayload} from "../../../model/CreateUserPayload.ts";
import {ArrowLeft, Eye, EyeOff} from "lucide-react";

interface FormData {
    name: string
    email: string
    password: string
    confirmPassword: string
    location: string
    contact: string
}

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    location?: string
    contact?: string
    general?: string
}
export function UserRegistration() {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { loading, error, status } = useSelector((state: RootState) => state)

    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        location: "",
        contact: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({})

    // Reset status when component mounts
    useEffect(() => {
        dispatch(resetUserStatus())
    }, [dispatch])

    // Handle successful registration
    useEffect(() => {
        if (status === 'succeeded') {
            // Redirect to login or home page after successful registration
            setTimeout(() => {
                navigate('/login')
            }, 2000)
        }
    }, [status, navigate])

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters"
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        // Location validation
        if (!formData.location.trim()) {
            newErrors.location = "Location is required"
        }

        // Contact validation
        if (!formData.contact.trim()) {
            newErrors.contact = "Contact information is required"
        } else if (!/^\+?[\d\s\-$$$$]+$/.test(formData.contact)) {
            newErrors.contact = "Please enter a valid phone number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Clear specific field error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        const createUserPayload: CreateUserPayload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            location: formData.location.trim(),
            contact: formData.contact.trim(),
            isAdmin: false, // Default to false for regular users
        }

        dispatch(registerUser(createUserPayload))
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Back to Home Button */}
                    <div className="mb-6">
                        <Link
                            to="/"
                            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Home
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Join BookSwap Hub</h1>
                        <p className="text-gray-600 text-sm">Create your account to start exchanging books with fellow readers.</p>
                    </div>

                    {/* Success Message */}
                    {status === 'succeeded' && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-sm text-green-700">Registration successful! Redirecting to login...</span>
                        </div>
                    )}

                    {/* General Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                    errors.name
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                placeholder="Enter your full name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                    errors.email
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                placeholder="Enter your email address"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                        errors.password
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Create a password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                        errors.confirmPassword
                                            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        {/* Location Field */}
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                                Location
                            </label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                    errors.location
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                placeholder="Enter your city or area"
                            />
                            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                        </div>

                        {/* Contact Field */}
                        <div>
                            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors ${
                                    errors.contact
                                        ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                placeholder="Enter your phone number"
                            />
                            {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading || status === 'succeeded'}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating Account...
                                </>
                            ) : status === 'succeeded' ? (
                                <>
                                    <CheckCircle className="-ml-1 mr-2 h-4 w-4" />
                                    Account Created!
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-500 hover:underline font-medium transition-colors"
                            >
                                Login Here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}