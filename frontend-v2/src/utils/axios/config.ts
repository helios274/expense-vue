import axios from "axios";
import { store } from "@/store";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true, // Important for sending cookies (refresh token)
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
