import { supabase } from "./supabaseClient";
// SIGN UP
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

 
  if (error) {
    throw error;
  }

  if (data?.user?.identities?.length === 0) {
    throw new Error("Email already registered");
  }

  // New user created successfully
  return data.user;
};

// LOGIN
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data.user;
};

/**
 * LOGOUT
 */
export const logout = async () => {
  await supabase.auth.signOut();
};
