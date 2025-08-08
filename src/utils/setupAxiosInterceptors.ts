import type {AppDispatch, RootState} from "../store/store.ts";
import {store} from "../store/store.ts";
import {backendApi} from "../api.ts";
import {logoutSuccess, refreshAccessToken} from "../slices/authSlice.ts";

export const setupAxiosInterceptors = (store:{dispatch:AppDispatch, getState:()=>RootState}) =>{
    backendApi.interceptors.request.use(
        (config)=>{
            const accessToken = store.getState().auth.accessToken;
            if (accessToken){
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    )
    backendApi.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            const dispatch = store.dispatch;

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                     // dispatch is already typed via the function arg
                    const resultAction = await dispatch(refreshAccessToken());

                    if (refreshAccessToken.fulfilled.match(resultAction)) {
                        // Token refreshed successfully, retry the original request
                        return backendApi(originalRequest);
                    } else {
                        // Refresh token failed. Dispatch logout.
                        dispatch(logoutSuccess());
                        return Promise.reject(error);
                    }
                } catch (refreshError) {
                    // Unexpected error during refresh. Dispatch logout.
                    console.error("Error refreshing token in interceptor:", refreshError);
                    dispatch(logoutSuccess());
                    return Promise.reject(refreshError);
                }
            }
            // For other errors or if already retried, just reject the promise
            return Promise.reject(error);
        }
    );
}