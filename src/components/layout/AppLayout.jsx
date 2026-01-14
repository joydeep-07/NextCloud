import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { useAuth } from "../../context/AuthContext";
import LogoutButton from "../LogoutButton";

const AppLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col">
        <h2 className="text-lg font-semibold tracking-wider mb-6">NEXTCLOUD</h2>

        <nav className="flex-1 space-y-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left px-2 py-1 rounded hover:bg-gray-800"
          >
            Dashboard
          </button>
        </nav>

        <LogoutButton/>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* <header className="mb-4">
          <p className="text-sm text-gray-500">Logged in as: {user?.email}</p>
        </header> */}

        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
