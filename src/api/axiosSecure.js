// client/src/api/axiosSecure.js
import axios from "axios";
import { auth } from "../firebase/firebase.config";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// attach firebase token
axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;
