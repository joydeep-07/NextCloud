import { useNavigate } from "react-router-dom";
import { logout } from "../../services/auth.service";

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
      className="mt-auto bg-red-500 hover:bg-red-600 text-white w-full px-3 py-2 rounded cursor-pointer"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
