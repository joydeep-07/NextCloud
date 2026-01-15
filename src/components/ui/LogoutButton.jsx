import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";
import { FiLogOut } from "react-icons/fi";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
    >
      <FiLogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
};

export default LogoutButton;
