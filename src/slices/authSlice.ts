import type {UserData} from "../model/userData.ts";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {getUserFromToken, isTokenExpired} from "../auth/auth.ts";
import {backendApi} from "../api.ts";

export const refreshAccessToken = createAsyncThunk(
    'auth/refreshAccessToken',
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState() as { auth: authState };
        const refreshToken = auth.refreshToken;

        if (!refreshToken) {
            return rejectWithValue('No refresh token available.');
        }

        try {
            // Your API endpoint to refresh a token
            const response = await backendApi.post('/api/auth/refresh', { token: refreshToken });
            const { accessToken } = response.data;
            // You can optionally decode the new token to get updated user data if needed
            return { accessToken };
        } catch (error: any) {
            // If the refresh token is expired or invalid, the API should return an error
            return rejectWithValue('Session expired. Please log in again.');
        }
    }
);
interface authState {
    user: UserData | null,
    accessToken: string | null,
    refreshToken: string | null,
    isLoading: boolean,
    isLoggedIn: boolean
    status: 'idle' | 'loading' | 'failed' | 'refreshing';
}

const initialState: authState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    isLoggedIn: false,
    status: 'idle'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers:{
        loginSuccess:(state, action:PayloadAction<{user:UserData, accessToken:string, refreshToken:string}>) =>{
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isLoading = false;
            state.isLoggedIn = true;
            state.status = 'idle';
            localStorage.setItem("username",action.payload.user.name as string);
            localStorage.setItem("isAdmin",action.payload.user.isAdmin as string);
            localStorage.setItem("accessToken",action.payload.accessToken);
            localStorage.setItem("refreshToken",action.payload.refreshToken);
        },
        logoutSuccess: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isLoading = false;
            state.isLoggedIn = false;
            state.status = 'idle';
            localStorage.removeItem("username");
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        },
        setInitialAuth: (state) => {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken){
                state.refreshToken = refreshToken;
                if(accessToken && !isTokenExpired(accessToken)){
                    const user: UserData = getUserFromToken(accessToken);
                    state.user = user;
                    state.accessToken = accessToken;
                    state.isLoading = false;
                    state.isLoggedIn = true;
                }
            }
            state.isLoading = false;
        },
    },
    extraReducers: (builder) =>{
        builder
            .addCase(refreshAccessToken.pending,(state:authState)=>{
                state.status = 'refreshing';
            })
            .addCase(refreshAccessToken.fulfilled,(state:authState, action:PayloadAction<{accessToken: string}>)=>{
                state.accessToken = action.payload.accessToken;
                state.isLoggedIn = true;
                state.status = 'idle';
                localStorage.setItem('accessToken', action.payload.accessToken);
            })
            .addCase(refreshAccessToken.rejected, (state:authState) => {
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
                state.isLoggedIn = false;
                state.status = 'failed';
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
            });
    }
})

export const { loginSuccess, logout, setInitialAuth } = authSlice.actions;
export default authSlice.reducer;