import { createContext, useEffect, useMemo, useState } from "react";
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

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null); // mongo user: role, isPremium
  const [loading, setLoading] = useState(true);

  const syncMongoUser = async (fbUser) => {
    if (!fbUser?.uid || !fbUser?.email) return;

    // upsert
    await axiosSecure.post("/users/upsert", {
      uid: fbUser.uid,
      email: fbUser.email,
      name: fbUser.displayName || "User",
      photoURL: fbUser.photoURL || "",
    });

    // fetch me
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
        console.error("Auth sync error:", err?.message);
        setMe(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // actions
  const registerUser = async (email, password, name) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (name) await updateProfile(res.user, { displayName: name });
    return res;
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  };

  const logoutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setMe(null);
    setLoading(false);
  };

  const refreshMe = async () => {
    if (!auth.currentUser) return null;
    const { data } = await axiosSecure.get("/users/me");
    setMe(data);
    return data;
  };
  // Compatibility helpers for pages using different naming
  const createUser = async (email, password) => {
    return await registerUser(email, password);
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return null;
    await updateProfile(auth.currentUser, {
      displayName: name || auth.currentUser.displayName || "User",
      photoURL: photoURL || auth.currentUser.photoURL || "",
    });
    // Optionally sync to backend and refresh cached profile
    try {
      await axiosSecure.post("/users/upsert", {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        name: name || auth.currentUser.displayName || "User",
        photoURL: photoURL || auth.currentUser.photoURL || "",
      });
      await refreshMe();
    } catch {
      /* ignore */
    }
  };

  const value = useMemo(
    () => ({
      user,
      me,
      loading,
      isPremium: me?.isPremium || false,
      registerUser,
      loginUser,
      loginWithGoogle,
      // alias for compatibility in Login.jsx
      googleLogin: loginWithGoogle,
      logoutUser,
      refreshMe,
      // compatibility
      createUser,
      updateUserProfile,
    }),
    [user, me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
