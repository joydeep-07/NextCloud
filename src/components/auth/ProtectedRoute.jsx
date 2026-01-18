import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, user } = useAuth();

  // ⏳ Wait until auth state is resolved
  if (loading) {
    return <p>Loading...</p>;
  }

  // 🔐 Fallback check from localStorage (page refresh safety)
  const storedUser = localStorage.getItem("auth_user");

  if (isAuthenticated || storedUser) {
    return <Outlet />;
  }

  // 🚫 Not authenticated
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
