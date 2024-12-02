import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios/config";
import axios from "axios";

interface AuthState {
  accessToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed" | "inactive";
  error: string | null;
  emailForVerification: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  status: "idle",
  error: null,
  emailForVerification: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/auth/login/", credentials, {
        withCredentials: true,
      });
      const { access } = response.data;
      return access;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        const errorMessage = errorData.message || "Login failed.";
        // Check for account inactive error
        if (errorData.code === "account_inactive") {
          return rejectWithValue({
            message: errorMessage,
            code: "account_inactive",
            email: credentials.email,
          });
        }
        return rejectWithValue({ message: errorMessage });
      }
      return rejectWithValue({ message: "An unexpected error occurred." });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.accessToken = null;
      state.status = "idle";
      state.error = null;
      state.emailForVerification = null;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.emailForVerification = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = "succeeded";
        state.accessToken = action.payload;
        state.error = null;
        state.emailForVerification = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        const payload = action.payload as {
          message: string;
          code?: string;
          email?: string;
        };
        state.status =
          payload.code === "account_inactive" ? "inactive" : "failed";
        state.error = payload.message;
        state.emailForVerification = payload.email || null;
      });
  },
});

export const { logout, setAccessToken } = authSlice.actions;

export default authSlice.reducer;
