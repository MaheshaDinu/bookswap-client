import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {BookData} from "../model/BookData.ts";
import {backendApi} from "../api.ts";

interface BookState{
    books:BookData[],
    userBooks: BookData[]; // Add user-specific books
    filteredBooks: BookData[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    selectedCategory: string;
    categories: string[];
    uploadLoading: boolean; // For image upload
}

const initialState: BookState = {
    books: [],
    userBooks: [],
    filteredBooks: [],
    loading: false,
    error: null,
    searchTerm: "",
    selectedCategory: "All",
    categories: ["All"],
    uploadLoading: false,
}

export const getAllBooks = createAsyncThunk<BookData[]>("books/getAllBooks", async () => {
    const response = await backendApi.get("/api/books/get-all-books")
    return response.data;
});

// Get books by user ID
export const getBooksByUserId = createAsyncThunk<BookData[], number>(
    "books/getBooksByUserId",
    async (userId) => {
        const response = await backendApi.get(`/api/books/users/${userId}`)
        return response.data;
    }
);

// Create a new book
export const createBook = createAsyncThunk<BookData, BookData>(
    "books/createBook",
    async (bookData) => {
        const response = await backendApi.post("/api/books/create-book", bookData);
        return response.data;
    }
);

// Delete a book
export const deleteBook = createAsyncThunk<number, number>(
    "books/deleteBook",
    async (bookId) => {
        await backendApi.delete(`/api/books/delete-book/${bookId}`);
        return bookId;
    }
);

// Upload image
export const uploadImage = createAsyncThunk<string, File>(
    "books/uploadImage",
    async (imageFile) => {
        const formData = new FormData();
        formData.append('image', imageFile);
        const response = await backendApi.post("/api/upload/image", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.url; // Assuming backend returns { filename: "uploaded-file-name.jpg" }
    }
);

export const bookSlice = createSlice({
    name: 'book',
    initialState: initialState,
    reducers: {
        setSearchTerm: (state, action: PayloadAction<string>) => {
            state.searchTerm = action.payload;
            applyFilters(state);
        },
        setSelectedCategory: (state, action: PayloadAction<string>) => {
            state.selectedCategory = action.payload;
            applyFilters(state);
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get all books
            .addCase(getAllBooks.pending, (state:BookState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBooks.fulfilled, (state:BookState, action) => {
                state.loading = false;
                state.books = action.payload;
                state.categories = ['All', ...new Set(action.payload.map((book) => book.category))];
                applyFilters(state);
            })
            .addCase(getAllBooks.rejected, (state:BookState, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to fetch books';
                state.books = [];
                state.filteredBooks = [];
                state.categories = ['All'];
            })

            // Get user books
            .addCase(getBooksByUserId.pending, (state:BookState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBooksByUserId.fulfilled, (state:BookState, action) => {
                state.loading = false;
                state.userBooks = action.payload;
            })
            .addCase(getBooksByUserId.rejected, (state:BookState, action:PayloadAction<{ code: number,message: string }>) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch user books';
                state.userBooks = [];
            })

            // Create book
            .addCase(createBook.pending, (state:BookState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBook.fulfilled, (state:BookState, action) => {
                state.loading = false;
                state.userBooks.push(action.payload);
                state.books.push(action.payload);
            })
            .addCase(createBook.rejected, (state:BookState, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to create book';
            })

            // Delete book
            .addCase(deleteBook.pending, (state:BookState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBook.fulfilled, (state:BookState, action) => {
                state.loading = false;
                const bookId = action.payload;
                state.userBooks = state.userBooks.filter(book => book.id !== bookId);
                state.books = state.books.filter(book => book.id !== bookId);
            })
            .addCase(deleteBook.rejected, (state:BookState, action) => {
                state.loading = false;
                state.error = action.payload.message || 'Failed to delete book';
            })

            // Upload image
            .addCase(uploadImage.pending, (state:BookState) => {
                state.uploadLoading = true;
                state.error = null;
            })
            .addCase(uploadImage.fulfilled, (state:BookState) => {
                state.uploadLoading = false;
            })
            .addCase(uploadImage.rejected, (state:BookState, action) => {
                state.uploadLoading = false;
                state.error = action.payload.message || 'Failed to upload image';
            });
    }
})

const applyFilters = (state: BookState) => {
    let filtered = state.books;

    if (state.searchTerm) {
        filtered = filtered.filter(
            (book) =>
                book.title.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
    }

    if (state.selectedCategory !== 'All') {
        filtered = filtered.filter((book) => book.category === state.selectedCategory);
    }

    state.filteredBooks = filtered;
};

export const { setSearchTerm, setSelectedCategory, clearError } = bookSlice.actions;
export default bookSlice.reducer;
