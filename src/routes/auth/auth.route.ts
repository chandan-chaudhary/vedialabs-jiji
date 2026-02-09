import { Router } from "express";
import { supabase } from "../../lib/supabase.js";

const router = Router();

// Sign Up
router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    // Create profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: data.user.email,
      name: name || null,
    });

    if (profileError) {
      return res.status(500).json({ error: "Failed to create profile" });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: data.user,
      session: { access_token: data.session?.access_token },
    });
  } catch (error) {
    return res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Login successful",
      user: { id: data.user?.id, email: data.user?.email },
      session: { access_token: data.session?.access_token },
    });
  } catch (error) {
    return res.status(500).json({ error: "Login failed" });
  }
});

export default router;
