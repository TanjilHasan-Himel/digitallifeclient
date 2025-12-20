import axios from "axios";
import { auth } from "../firebase/firebase.config";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosSecure = axios.create({
  baseURL: API,
});

axiosSecure.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); // auto refresh if needed
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosSecure;
