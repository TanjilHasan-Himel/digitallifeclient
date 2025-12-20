// client/src/api/axiosSecure.js
import axios from "axios";
import { auth } from "../firebase/firebase.config";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosSecure = axios.create({
  baseURL,
  withCredentials: true,
});

// Attach Firebase ID token automatically on every request
axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); // auto refresh if needed
      config.headers = config.headers || {};
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: handle 401/403 globally (keep simple for now)
axiosSecure.interceptors.response.use(
  (res) => res,
  async (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;
