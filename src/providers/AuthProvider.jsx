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

export const AuthContext = createContext(null);

// ✅ named export for safety (so { useAuth } imports won't break)
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null); // Mongo user: role, isPremium etc
  const [loading, setLoading] = useState(true);

  const syncMongoUser = async (fbUser) => {
    if (!fbUser?.uid || !fbUser?.email) return;

    // 1) upsert
    await axiosSecure.post("/users/upsert", {
      uid: fbUser.uid,
      email: fbUser.email,
      name: fbUser.displayName || "User",
      photoURL: fbUser.photoURL || "",
    });

    // 2) fetch /users/me
    const { data } = await axiosSecure.get("/users/me");
    setMe(data);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (!currentUser) {
        setMe(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        await syncMongoUser(currentUser);
      } catch (err) {
        console.error("AuthProvider sync error:", err?.message);
        setMe(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ---------- Auth actions ----------
  const registerUser = async (email, password, name) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(res.user, { displayName: name });
      // onAuthStateChanged will sync
      return res;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setMe(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => {
    if (!auth.currentUser) return null;
    const { data } = await axiosSecure.get("/users/me");
    setMe(data);
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      me,
      loading,
      registerUser,
      loginUser,
      loginWithGoogle,
      logoutUser,
      refreshMe,
    }),
    [user, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
