import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const AuthContext = createContext(null);
const auth = getAuth(app);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // later: isPremium, role sync from Mongo (single source of truth) :contentReference[oaicite:11]{index=11}
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (current) => {
      setUser(current || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = { user, loading, logout };

  if (loading) return <LoadingSpinner label="Checking session..." />;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
