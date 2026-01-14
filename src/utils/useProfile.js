import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useAuth } from "../context/AuthContext";

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!error) {
        setProfile({
          first_name: data.first_name,
          last_name: data.last_name,
          email: user.email,
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  // ✅ ALWAYS return an object
  return { profile, loading };
};
