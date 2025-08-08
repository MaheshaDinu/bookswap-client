import type {UserModel} from "../model/UserModel.ts";
import {createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type PayloadAction from "@reduxjs/toolkit";
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

export const fetchAllUsers = createAsyncThunk<UserModel[], void, {rejectValue: string}>(
    'users/fetchAllUsers',
    async (_, {rejectWithValue}) => {
        try {
            const response = await backendApi.get('/api/users');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users.')
        }
    }
)

export const fetchUserById = createAsyncThunk<UserModel,number,{rejectValue: string}>(
    'users/fetchUserById',
    async (userId, {rejectWithValue}) => {
        try {
            const response = await backendApi.get(`/api/users/get-user/${userId}`);
            return response.data;
        }catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user.')
        }
    }
)

export const updateUser = createAsyncThunk<UserModel,{ userId: number; updateData: Partial<Omit<UserModel, 'id' | 'createdAt' | 'updatedAt'>> },{rejectValue: string}>(
    'users/updateUser',
    async ({ userId, updateData }, { rejectWithValue }) => {
        try {
            const response = await backendApi.put(`/api/users/update-user/${userId}`, updateData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user.')
        }
    }
)

export const deleteUser = createAsyncThunk<number,number,{rejectValue: string}>(
    'users/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await backendApi.delete(`/api/users/delete-user/${userId}`);
            return userId;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user.')
        }
    }
)
export const UserSlice = createSlice({
    name: 'user',
    initialState:initialState,
    reducers: {
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
        clearUsers: (state) => {
            state.users = [];
        },
        resetUserStatus: (state) => {
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle registerUser thunk lifecycle
            .addCase(registerUser.pending, (state:UserState) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state:UserState, action: PayloadAction<UserModel>) => {
                state.loading = false;
                state.status = 'succeeded';
                state.currentUser = action.payload.payload; // Set the newly registered user as current
                // Optionally: state.users.push(action.payload); if you want to add it to the list immediately
            })
            .addCase(registerUser.rejected, (state:UserState, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Handle fetchAllUsers thunk lifecycle
            .addCase(fetchAllUsers.pending, (state:UserState) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
                state.users = []; // Clear previous list when starting fetch
            })
            .addCase(fetchAllUsers.fulfilled, (state:UserState, action: PayloadAction<{payload:UserModel[]}>) => {
                state.loading = false;
                state.status = 'succeeded';
                state.users = action.payload.payload; // Populate the users array
            })
            .addCase(fetchAllUsers.rejected, (state:UserState, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
                state.users = []; // Clear on error
            })

            // Handle fetchUserById thunk lifecycle
            .addCase(fetchUserById.pending, (state:UserState) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
                state.currentUser = null; // Clear previous current user
            })
            .addCase(fetchUserById.fulfilled, (state:UserState, action: PayloadAction<{payload:UserModel}>) => {
                state.loading = false;
                state.status = 'succeeded';
                state.currentUser = action.payload.payload; // Set the fetched user as current
            })
            .addCase(fetchUserById.rejected, (state:UserState, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
                state.currentUser = null; // Clear on error
            })

            // Handle updateUser thunk lifecycle
            .addCase(updateUser.pending, (state:UserState) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state:UserState, action: PayloadAction<{payload:UserModel}>) => {
                state.loading = false;
                state.status = 'succeeded';
                state.currentUser = action.payload.payload; // Update current user if it was updated

                // Find and update the user in the 'users' array if it exists
                const index = state.users.findIndex(user => user.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload.payload;
                }
            })
            .addCase(updateUser.rejected, (state:UserState, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            })

            // Handle deleteUser thunk lifecycle
            .addCase(deleteUser.pending, (state:UserState) => {
                state.loading = true;
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state:UserState, action: PayloadAction<number>) => { // action.payload is the userId
                state.loading = false;
                state.status = 'succeeded';
                // Remove the deleted user from the 'users' array
                state.users = state.users.filter(user => user.id !== action.payload);
                // If the deleted user was the current user, clear it
                if (state.currentUser?.id === action.payload) {
                    state.currentUser = null;
                }
            })
            .addCase(deleteUser.rejected, (state:UserState, action) => {
                state.loading = false;
                state.status = 'failed';
                state.error = action.payload as string;
            });
    }

})

export const { clearCurrentUser, clearUsers, resetUserStatus } = UserSlice.actions;
export default UserSlice.reducer;