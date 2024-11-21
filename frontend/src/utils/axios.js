import axios from "axios";

const accessToken = JSON.parse(localStorage.getItem("auth"))?.accessToken;

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

if (accessToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
}

export default axios;
