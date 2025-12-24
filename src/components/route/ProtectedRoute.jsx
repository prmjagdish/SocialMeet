import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@context/AuthContext.jsx";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
