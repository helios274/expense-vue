import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const savedAuth = localStorage.getItem("auth");

if (savedAuth) {
  const parsedAuth = JSON.parse(savedAuth);
  initialState.user = parsedAuth.user;
  initialState.accessToken = parsedAuth.accessToken;
  initialState.refreshToken = parsedAuth.refreshToken;
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${parsedAuth.accessToken}`;
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("auth", JSON.stringify(state));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${action.payload.accessToken}`;
    },
    logout: (state) => {
      state.user = null;
      (state.accessToken = null), (state.refreshToken = null);
      localStorage.removeItem("auth");
      delete axios.defaults.headers.common["Authorization"];
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
