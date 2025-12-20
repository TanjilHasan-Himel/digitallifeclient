// client/src/api/axiosSecure.js
import axios from "axios";
import { auth } from "../firebase/firebase.config";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosSecure = axios.create({
  baseURL: BASE_URL,
});

// attach firebase id token automatically (fresh token)
axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth?.currentUser;
    if (user) {
      const token = await user.getIdToken(); // auto refresh if needed
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;
