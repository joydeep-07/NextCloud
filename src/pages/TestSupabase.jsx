import { supabase } from "../services/supabaseClient";
import { useEffect } from "react";

export default function TestSupabase() {
  useEffect(() => {
    const test = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(1);

      console.log("DATA:", data);
      console.log("ERROR:", error);
    };

    test();
  }, []);

  return <h1>Check Console</h1>;
}
