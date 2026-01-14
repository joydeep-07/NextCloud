import { supabase } from "./supabaseClient";

export const signUp = async ({ email, password, firstName, lastName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) throw error;

  if (!data.user) {
    throw new Error("Signup failed");
  }

  return data.user;
};




export const login = async ({ email, password }) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  

  if (error) throw error;
};

export const logout = async () => {
  await supabase.auth.signOut();
};
