import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const storedUser = localStorage.getItem("auth_user");

  if (storedUser) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
