

import  { useState, useEffect } from 'react'
import * as React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Trash2, BookOpen, AlertCircle } from 'lucide-react'
import { Book } from '../../common/Book/Book' // Adjust path
import { AddBookModal } from "../../common/AddBookModal/AddBookModal.tsx" // Adjust path
import { getBooksByUserId, deleteBook, clearError } from "../../../slices/bookSlice.ts" // Adjust path
import type { RootState, AppDispatch } from '../../../store/store.ts'
import type {BookData} from "../../../model/BookData.ts"; // Adjust path

interface MyBooksProps {
    userId?: number // You might get this from auth context
}



export function MyBooks({ userId = 1 }: MyBooksProps) { // Default userId for demo
    const dispatch = useDispatch<AppDispatch>()
    const { userBooks, loading, error } = useSelector((state: RootState) => state)

    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    useEffect(() => {
        if (userId) {
            dispatch(getBooksByUserId(userId))
        }
    }, [dispatch, userId])

    const handleDeleteBook = async (bookId: number) => {
        try {
             dispatch(deleteBook(bookId))
            setDeleteConfirm(null)
        } catch (error) {
            console.error('Failed to delete book:', error)
        }
    }

    const handleCloseError = () => {
        dispatch(clearError())
    }

    // Enhanced Book component with delete functionality
    const BookWithActions = ({ book }: { book: any }) => {
        const getConditionColor = (condition: string) => {
            switch (condition.toLowerCase()) {
                case "new":
                    return "bg-green-100 text-green-800"
                case "like new":
                    return "bg-blue-100 text-blue-800"
                case "good":
                    return "bg-yellow-100 text-yellow-800"
                case "fair":
                    return "bg-orange-100 text-orange-800"
                case "poor":
                    return "bg-red-100 text-red-800"
                default:
                    return "bg-gray-100 text-gray-800"
            }
        }

        const truncateDescription = (text: string, maxLength = 100) => {
            return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
        }

        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-sm">
                {/* Book Image */}
                <div className="relative">
                    <img
                        src={book.image || `/placeholder.svg?height=200&width=150&query=${encodeURIComponent(book.title + " book cover")}`}
                        alt={`${book.title} cover`}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getConditionColor(book.condition)}`}>
              {book.condition}
            </span>
                    </div>
                    {/* Delete Button */}
                    <button
                        onClick={() => setDeleteConfirm(book.id)}
                        className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Delete Book"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>

                {/* Book Details */}
                <div className="p-4">
                    {/* Title and Author */}
                    <div className="mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">{book.title}</h3>
                        <p className="text-sm text-gray-600">by {book.author}</p>
                    </div>

                    {/* Category */}
                    <div className="mb-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">{book.category}</span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-700 mb-4">{truncateDescription(book.description)}</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Added {new Date(book.createdAt).toLocaleDateString()}
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                            Available
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
                        <p className="text-gray-600 mt-2">Manage your book collection</p>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        Add Book
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                        <button
                            onClick={handleCloseError}
                            className="text-red-500 hover:text-red-700"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Books Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
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
                        ))}
                    </div>
                ) : userBooks && userBooks.length > 0 ? (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-600">You have {userBooks.length} book{userBooks.length !== 1 ? 's' : ''} in your collection</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {userBooks.map((book) => (
                                <BookWithActions key={book.id} book={book} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No books yet</h3>
                        <p className="text-gray-600 mb-6">Start building your collection by adding your first book!</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                            Add Your First Book
                        </button>
                    </div>
                )}

                {/* Add Book Modal */}
                <AddBookModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    userId={userId}
                />

                {/* Delete Confirmation Modal */}
                {deleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Book</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this book? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeleteBook(deleteConfirm)}
                                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
