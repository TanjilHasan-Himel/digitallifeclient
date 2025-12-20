import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or <LoadingSpinner/>

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}
