import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { loading } = useAuth();

  // ⏳ Wait until auth state initializes
  if (loading) {
    return <p>Loading...</p>;
  }

  // 🔐 SINGLE source of truth
  const storedUser = localStorage.getItem("auth_user");

  // ❌ No user → force login
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ User exists → allow access
  return <Outlet />;
};

export default ProtectedRoute;
