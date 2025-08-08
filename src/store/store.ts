import { configureStore} from "@reduxjs/toolkit";
import type AsyncThunkAction from "@reduxjs/toolkit";
import bookReducer from "../slices/bookSlice.ts";
import authReducer from "../slices/authSlice.ts";
import userReducer from "../slices/userSlice.ts";

export const store = configureStore({
    reducer:{
        books: bookReducer,
        auth: authReducer,
        users:userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch & {
    <T>(action: AsyncThunkAction<T, any, any>): T;
};