import { supabase } from "./supabaseClient";

export const signUp = async ({ email, password, firstName, lastName }) => {
  // 1️⃣ Create user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  // 2️⃣ Immediately sign in (FOR SESSION)
  const { data: loginData, error: loginError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (loginError) throw loginError;

  const user = loginData.user;

  // if (!user) {
  //   throw new Error("Signup failed. Session not created.");
  // }

  // 3️⃣ Insert profile (RLS-safe)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    first_name: firstName,
    last_name: lastName,
  });

  if (profileError) throw profileError;

  return user;
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
