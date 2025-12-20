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
import useSyncUser from "../hooks/useSyncUser";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const { me, meLoading, refetchMe } = useSyncUser(user);

  const googleProvider = new GoogleAuthProvider();

  const createUser = async (email, password) => {
    setAuthLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = async (email, password) => {
    setAuthLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleLogin = async () => {
    setAuthLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUserProfile = async (name, photoURL) => {
    return updateProfile(auth.currentUser, { displayName: name, photoURL });
  };

  const logout = async () => {
    setAuthLoading(true);
    await signOut(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // DEV helper: console থেকে token বের করতে চাইলে
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__getIdToken = async () => auth.currentUser?.getIdToken();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      me, // Mongo user: role + isPremium
      loading: authLoading || meLoading,
      createUser,
      loginUser,
      googleLogin,
      updateUserProfile,
      logout,
      refetchMe,
      isPremium: !!me?.isPremium,
      role: me?.role || "user",
    }),
    [user, me, authLoading, meLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
