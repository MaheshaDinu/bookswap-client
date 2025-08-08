import * as React from 'react'
import {useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Loader2, Upload, X} from 'lucide-react'
import {createBook, uploadImage} from '../../../slices/bookSlice.ts' // Adjust path
import type {AppDispatch, RootState} from '../../../store/store.ts' // Adjust path
import type {BookData} from "../../../model/BookData.ts";

interface AddBookModalProps {
    isOpen: boolean
    onClose: () => void
    userId: number | null
}

interface BookFormData {
    title: string
    author: string
    category: string
    description: string
    condition: string
    image: File | null
}

interface FormErrors {
    title?: string
    author?: string
    category?: string
    description?: string
    condition?: string
    image?: string
}

const categories = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Educational', 'Other'
]

const conditions = [ "EXCELLENT",'GOOD', 'FAIR', "POOR"]

export function AddBookModal({ isOpen, onClose, userId }: AddBookModalProps) {
    const dispatch:AppDispatch = useDispatch<AppDispatch>()
    const { loading, uploadLoading, error } = useSelector((state: RootState) => state)

    const [formData, setFormData] = useState<BookFormData>({
        title: '',
        author: '',
        category: '',
        description: '',
        condition: '',
        image: null,
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.title.trim()) newErrors.title = 'Title is required'
        if (!formData.author.trim()) newErrors.author = 'Author is required'
        if (!formData.category) newErrors.category = 'Category is required'
        if (!formData.description.trim()) newErrors.description = 'Description is required'
        if (!formData.condition) newErrors.condition = 'Condition is required'
        if (!formData.image) newErrors.image = 'Book cover image is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setFormData(prev => ({ ...prev, image: file }))

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)

            if (errors.image) {
                setErrors(prev => ({ ...prev, image: undefined }))
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            // Create FormData for multipart upload

            // bookFormData.append('title', formData.title.trim())
            // bookFormData.append('author', formData.author.trim())
            // bookFormData.append('category', formData.category)
            // bookFormData.append('description', formData.description.trim())
            // bookFormData.append('condition', formData.condition)
            // bookFormData.append('ownerId', userId.toString())

            if (formData.image) {
                const Imgresponse  = await dispatch(uploadImage(formData.image))
                console.log(Imgresponse)
                const url = Imgresponse.payload
                const bookData: BookData = {
                    id: 0,
                    title: formData.title.trim(),
                    author: formData.author.trim(),
                    category: formData.category,
                    description: formData.description.trim(),
                    condition: formData.condition,
                    imageUrl: url,
                    ownerId: userId.toString(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
                console.log(bookData)
                const response = await dispatch(createBook(bookData))

            }



           // await dispatch(createBook(formData))

            // Reset form and close modal
            setFormData({
                title: '',
                author: '',
                category: '',
                description: '',
                condition: '',
                image: null,
            })
            setImagePreview(null)
            setErrors({})
            onClose()
        } catch (error) {
            console.error('Failed to create book:', error)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">Add New Book</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Book Cover Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview || "/placeholder.svg"}
                                        alt="Preview"
                                        className="h-full w-auto object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Click to upload</span>
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                                errors.title
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter book title"
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                    </div>

                    {/* Author */}
                    <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                            Author
                        </label>
                        <input
                            type="text"
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                                errors.author
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter author name"
                        />
                        {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                                errors.category
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                    </div>

                    {/* Condition */}
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                            Condition
                        </label>
                        <select
                            id="condition"
                            name="condition"
                            value={formData.condition}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                                errors.condition
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        >
                            <option value="">Select condition</option>
                            {conditions.map(condition => (
                                <option key={condition} value={condition}>{condition}</option>
                            ))}
                        </select>
                        {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={3}
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                                errors.description
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                            placeholder="Enter book description"
                        />
                        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || uploadLoading}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading || uploadLoading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Adding...
                                </>
                            ) : (
                                'Add Book'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
