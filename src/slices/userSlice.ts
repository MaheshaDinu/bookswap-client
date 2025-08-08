import type {UserModel} from "../model/UserModel.ts";
import {createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit";
import type {CreateUserPayload} from "../model/CreateUserPayload.ts";
import {backendApi} from "../api.ts";


interface UserState {
    users: UserModel[]
    currentUser: UserModel | null
    loading: boolean
    error: string | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    status: 'idle'
}

export const registerUser = createAsyncThunk<UserModel, CreateUserPayload,{rejectValue: string}>(
    'users/registerUser',
    async (user, {rejectWithValue}) => {
        try {
            const response = await backendApi.post('/api/users/create-user',user);
            return await response.data
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to register user.')
        }
    }
)