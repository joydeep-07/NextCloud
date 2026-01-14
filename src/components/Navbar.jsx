import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabaseClient";
import LogoutButton from "./LogoutButton";
import { useProfile } from "../utils/useProfile";

const Navbar = () => {
  const { user, loading } = useAuth();
  const profile = useProfile();
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-end">
      <span className="text-sm font-medium">
      Welcome,  {profile?.first_name}
      </span>
      {loading ? (
        <span className="text-sm text-gray-500">Loading...</span>
      ) : user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">
            {user.user_metadata?.first_name} {user.user_metadata?.last_name}
          </span>

          <LogoutButton />
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
