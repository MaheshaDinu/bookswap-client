import {configureStore} from "@reduxjs/toolkit";
import bookReducer from "../slices/bookSlice.ts";
import authReducer from "../slices/authSlice.ts";

export const store = configureStore({
    reducer:{
        books: bookReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch