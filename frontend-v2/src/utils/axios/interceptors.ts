// import axiosInstance, { setAccessToken } from "./config";
// import { store } from "@/store";
// import { refreshAccessToken, logout } from "@/store/slices/authSlice";

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value?: any) => void;
//   reject: (error: any) => void;
// }[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (token) {
//       prom.resolve(token);
//     } else {
//       prom.reject(error);
//     }
//   });

//   failedQueue = [];
// };

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response &&
//       error.response.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/auth/login/") &&
//       !originalRequest.url.includes("/auth/token/refresh")
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return axiosInstance(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         const actionResult = await store.dispatch(refreshAccessToken());
//         const newAccessToken = actionResult.payload as string;

//         if (newAccessToken) {
//           setAccessToken(newAccessToken);
//           processQueue(null, newAccessToken);
//           isRefreshing = false;
//           originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
//           return axiosInstance(originalRequest);
//         } else {
//           processQueue(error, null);
//           isRefreshing = false;
//           store.dispatch(logout());
//           return Promise.reject(error);
//         }
//       } catch (refreshError) {
//         processQueue(refreshError, null);
//         isRefreshing = false;
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
