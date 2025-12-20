import { createContext, useEffect, useMemo, useState, useContext } from "react";
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

// ✅ this is what your PrivateRoute expects
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [me, setMe] = useState(null); // mongo user: role + isPremium
  const [loading, setLoading] = useState(true);

  const googleProvider = useMemo(() => new GoogleAuthProvider(), []);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const googleLogin = () => signInWithPopup(auth, googleProvider);

  const updateUserProfile = async (name, photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName: name || auth.currentUser.displayName,
      photoURL: photoURL || auth.currentUser.photoURL,
    });
    setUser({ ...auth.currentUser });
  };

  const logoutUser = async () => {
    setLoading(true);
    await signOut(auth);
    setUser(null);
    setMe(null);
    setLoading(false);
  };

  const syncMongoUser = async (firebaseUser) => {
    const payload = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name: firebaseUser.displayName || "User",
      photoURL: firebaseUser.photoURL || "",
    };

    await axiosSecure.post("/users/upsert", payload);
    const res = await axiosSecure.get("/users/me");
    setMe(res.data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      try {
        if (currentUser) {
          await syncMongoUser(currentUser);
        } else {
          setMe(null);
        }
      } catch (err) {
        console.log("AUTH_SYNC_ERROR:", err?.message);
        setMe(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    me,
    loading,
    createUser,
    loginUser,
    googleLogin,
    updateUserProfile,
    logoutUser,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}
