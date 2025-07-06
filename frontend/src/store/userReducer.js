import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../lib/axios";
import toast from "react-hot-toast";

// registerUser
export const registerUser = createAsyncThunk(
    "user/registerUser",
    async (credentials, thunkAPI) => {
        try {
            const res = await axios.post(`/auth/signup`, credentials);
            toast.success("Registered successfully");
            return res.data.data; // Assuming response contains user + token
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// loginUser
export const loginUser = createAsyncThunk(
    "user/loginUser",
    async (credentials, thunkAPI) => {
        try {
            const res = await axios.post(`/auth/signin`, credentials);
            toast.success("Logged in successfully");
            return res.data.data; // Assuming response contains user + token
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);

// getProfile
export const getProfile = createAsyncThunk(
    "user/getProfile",
    async (_, thunkAPI) => {
        try {
            const res = await axios.get(`/auth/profile`);
            return res.data.data; // Assuming response contains user + token
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
)

// logout
export const logout = createAsyncThunk(
    "user/logout",
    async (_, thunkAPI) => {
        try {
            const res = await axios.post(`/auth/logout`);
            toast.success("Logged out successfully");
            return res.data.data; // Assuming response contains user + token
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
)

// refreshAccessToken
export const refreshToken = createAsyncThunk(
    "user/refreshToken",
    async (_, thunkAPI) => {
        try {
            const res = await axios.post(`/auth/refresh-token`);
            return res.data.data;
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
            return thunkAPI.rejectWithValue(err.response?.data?.message);
        }
    }
);



const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Add action to clear auth state
        // clearAuth: (state) => {
        //     state.user = null;
        //     state.isAuthenticated = false;
        //     state.error = null;
        // }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(getProfile.pending, (state) => {
                state.isLoading = true;
                state.error = action.payload;
                // Do NOT reset isAuthenticated or user here
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            .addCase(logout.fulfilled, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
            })
            .addCase(refreshToken.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload;
            })
            
    },
});

// export const { clearAuth } = userSlice.actions;
export default userSlice.reducer;
