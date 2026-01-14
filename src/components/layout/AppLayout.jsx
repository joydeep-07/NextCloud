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
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 fixed top-0 left-0 h-screen flex flex-col z-10">
        <h2 className="text-lg font-semibold tracking-wider mb-6">NEXTCLOUD</h2>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

        </nav>

        <LogoutButton />
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Navbar positioned at top of main content */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Content area */}
        <div className="p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
