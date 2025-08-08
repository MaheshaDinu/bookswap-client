
import {  useEffect } from "react"
import { Search, Filter, BookOpen } from "lucide-react"
import { Book } from "../../common/Book/Book.tsx"
import { Link } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import type {RootState,AppDispatch} from "../../../store/store.ts";
import {getAllBooks, setSearchTerm, setSelectedCategory} from "../../../slices/bookSlice.ts";


interface HomeProps {
    isLoggedIn?: boolean
}

export function Home({ isLoggedIn = false }: HomeProps) {
    const dispatch: AppDispatch = useDispatch();
    // const [books, setBooks] = useState<BookData[]>([])
    // const [filteredBooks, setFilteredBooks] = useState<BookData[]>([])
    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)
    // const [searchTerm, setSearchTerm] = useState("")
    // const [selectedCategory, setSelectedCategory] = useState("All")

    const { books, filteredBooks, loading, error, searchTerm, selectedCategory, categories } = useSelector(
        (state: RootState) => state.books
    )

    useEffect(()=>{
        dispatch(getAllBooks())
    },[dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchTerm(e.target.value));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setSelectedCategory(e.target.value));
    };


    // Loading skeleton component
    const BookSkeleton = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-4">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded mb-3 w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded mb-4 w-1/2"></div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="bg-gray-50">
            {/* Conditional Hero Section - Only show if user is not logged in */}
            {!isLoggedIn && (
                <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome to BookSwap Hub</h1>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Discover, exchange, and share your favorite books with fellow book lovers. Join our community of readers
                            today!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/login"
                                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Search and Filter Section */}
            <section className={`py-8 bg-gray-50 ${!isLoggedIn ? "" : "pt-16"}`}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Browse Books</h2>

                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search Bar */}
                            <div className="relative flex-1 lg:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search books or authors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mb-6">
                        <p className="text-gray-600">
                            {loading ? "Loading..." : `Showing ${filteredBooks.length} of ${books.length} books`}
                            {searchTerm && ` for "${searchTerm}"`}
                            {selectedCategory !== "All" && ` in ${selectedCategory}`}
                        </p>
                    </div>
                </div>
            </section>

            {/* Books Grid */}
            <section className="pb-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {error ? (
                        <div className="text-center py-12">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                <p className="text-red-600 mb-4">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {loading ? (
                                    // Show loading skeletons
                                    Array.from({ length: 12 }).map((_, index) => <BookSkeleton key={index} />)
                                ) : // Show actual books or no results message
                                filteredBooks.length > 0 ? (
                                    filteredBooks.map((book) => <Book key={book.id} book={book} />)
                                ) : (
                                    <div className="col-span-full text-center py-12">
                                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                                        <p className="text-gray-600 mb-4">
                                            {searchTerm || selectedCategory !== "All"
                                                ? "Try adjusting your search or filter criteria"
                                                : "No books available at the moment"}
                                        </p>
                                        {(searchTerm || selectedCategory !== "All") && (
                                            <button
                                                onClick={() => {
                                                    setSearchTerm("")
                                                    setSelectedCategory("All")
                                                }}
                                                className="text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Clear filters
                                            </button>
                                        )}
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
