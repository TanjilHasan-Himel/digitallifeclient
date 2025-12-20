import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { app } from "../firebase/firebase.config";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const createUser = async (email, password) => {
    setAuthLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);
    return res;
  };

  const loginUser = async (email, password) => {
    setAuthLoading(true);
    const res = await signInWithEmailAndPassword(auth, email, password);
    return res;
  };

  const googleLogin = async () => {
    setAuthLoading(true);
    const res = await signInWithPopup(auth, googleProvider);
    return res;
  };

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { displayName: name, photoURL });
  };

  const logout = async () => {
    setAuthLoading(true);
    await signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current || null);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  const value = {
    user,
    authLoading,
    createUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    logout,
  };

  if (authLoading) return <LoadingSpinner label="Checking session..." />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
