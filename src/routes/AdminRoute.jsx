import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { user, me, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (me?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
}
