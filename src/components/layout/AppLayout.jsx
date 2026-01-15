import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../ui/LogoutButton";
import Navbar from "../ui/Navbar";

const AppLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex">
    

      {/* Main Content */}
      <main className="flex-1">
        {/* Navbar positioned at top of main content */}
        <div className="sticky top-0 z-10">
          {/* <Navbar /> */}
        </div>

        {/* Content area */}
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
