import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type {BookData} from "../model/BookData.ts";
import {backendApi} from "../api.ts";

interface BookState{
    books:BookData[],
    filteredBooks: BookData[];
    loading: boolean;
    error: string | null;
    searchTerm: string;
    selectedCategory: string;
    categories: string[];
}

const initialState: BookState = {
    books: [],
    filteredBooks: [],
    loading: false,
    error: null,
    searchTerm: "",
    selectedCategory: "All",
    categories: ["All"],
}

export const getAllBooks = createAsyncThunk<BookData[]>("books/getAllBooks", async () => {
    const response = await backendApi.get("/api/books/get-all-books")
    return response.data; // Await is not strictly needed here as axios returns a Promise
});

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

            // setFilteredBooksInternal: (state) => {
            //     applyFilters(state);
            // },
        },
        extraReducers: (builder) => {
            builder
                // FIX: Remove explicit type 'BookState' from 'state' parameter
                .addCase(getAllBooks.pending, (state:BookState) => {
                    state.loading = true;
                    state.error = null;
                })
                // FIX: Remove explicit type 'BookState' from 'state' parameter
                .addCase(getAllBooks.fulfilled, (state:BookState, action) => {
                    state.loading = false;
                    state.books = action.payload;
                    state.categories = ['All', ...new Set(action.payload.map((book) => book.category))];
                    applyFilters(state);
                })
                // FIX: Remove explicit type 'BookState' from 'state' parameter
                .addCase(getAllBooks.rejected, (state:BookState, action) => {
                    state.loading = false;
                    state.error = action.payload as string;
                    state.books = [];
                    state.filteredBooks = [];
                    state.categories = ['All'];
                });
        }
    }
)

// The applyFilters function should also accept Draft<BookState>
// To ensure type safety, you can define it to accept a mutable BookState
const applyFilters = (state: BookState) => { // This BookState here is implicitly Draft<BookState> when called from reducers
    let filtered = state.books; // Accessing state.books directly is fine within Immer

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

export const { setSearchTerm, setSelectedCategory } = bookSlice.actions;
export default bookSlice.reducer;