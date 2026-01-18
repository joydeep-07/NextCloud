import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("auth_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem("auth_profile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", userId)
        .single();

      if (!error) {
        setProfile(data);
        localStorage.setItem("auth_profile", JSON.stringify(data));
      } else {
        setProfile(null);
        localStorage.removeItem("auth_profile");
      }
    } catch (err) {
      console.error("Profile fetch failed:", err.message);
      setProfile(null);
      localStorage.removeItem("auth_profile");
    }
  };

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data?.session?.user ?? null;

      setUser(sessionUser);

      if (sessionUser) {
        localStorage.setItem("auth_user", JSON.stringify(sessionUser));
        fetchProfile(sessionUser.id);
      } else {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_profile");
      }

      setLoading(false);
    };

    initSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);

        if (sessionUser) {
          localStorage.setItem("auth_user", JSON.stringify(sessionUser));
          fetchProfile(sessionUser.id);
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_profile");
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
