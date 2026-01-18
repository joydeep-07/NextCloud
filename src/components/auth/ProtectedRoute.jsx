import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  // 🔐 Single source of truth
  const storedUser = localStorage.getItem("auth_user");

  // ❌ Not logged in → force login
  if (!storedUser) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in → allow
  return <Outlet />;
};

export default ProtectedRoute;
