import axios from "axios";
import { getAuth } from "firebase/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const axiosSecure = axios.create({
  baseURL: API,
});

axiosSecure.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
