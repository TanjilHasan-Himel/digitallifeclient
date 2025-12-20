// client/src/providers/AuthProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import axiosSecure from "../api/axiosSecure";

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider/>");
  return ctx;
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null); // Mongo user doc (role + isPremium etc)
  const [loading, setLoading] = useState(true); // auth loading
  const [meLoading, setMeLoading] = useState(false); // /users/me loading

  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  const createUser = async (email, password, name, photoURL = "") => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // profile update
    await updateProfile(result.user, {
      displayName: name || "User",
      photoURL: photoURL || "",
    });
    setLoading(false);
    return result;
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return result;
  };

  const googleLogin = async () => {
    setLoading(true);
    const result = await signInWithPopup(auth, googleProvider);
    setLoading(false);
    return result;
  };

  const logoutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setMe(null);
    setUser(null);
    setLoading(false);
  };

  const refreshMe = async () => {
    if (!auth.currentUser) return;
    try {
      setMeLoading(true);
      const { data } = await axiosSecure.get("/users/me");
      setMe(data);
    } catch (e) {
      setMe(null);
    } finally {
      setMeLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (!currentUser) {
        setMe(null);
        setLoading(false);
        return;
      }

      try {
        setMeLoading(true);

        // Upsert user in Mongo (server reads uid/email from token, but we also send body for name/photo)
        await axiosSecure.post("/users/upsert", {
          uid: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName || "User",
          photoURL: currentUser.photoURL || "",
        });

        // Fetch mongo user (role + isPremium)
        const { data } = await axiosSecure.get("/users/me");
        setMe(data);
      } catch (err) {
        setMe(null);
      } finally {
        setMeLoading(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    me,
    loading,
    meLoading,
    createUser,
    loginUser,
    googleLogin,
    logoutUser,
    refreshMe,
    isPremium: !!me?.isPremium,
    role: me?.role || "user",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
