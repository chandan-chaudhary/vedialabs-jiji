import { Router } from "express";
import { supabase } from "../../lib/supabase.js";
import {
  authenticateUser,
  type AuthRequest,
} from "../../middleware/auth.middleware.js";
import { answer } from "./mock-answer.js";

const router = Router();

router.post("/ask-jiji", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { question } = req.body;
    const userId = req.userId!;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    // Search for resources
    const searchTerms = question.toLowerCase();
    const { data: resources, error: resourceError } = await supabase
      .from("resources")
      .select("*")
      .or(`tags.cs.{BITCOIN},title.ilike.%${searchTerms}%`);

    if (resourceError) {
      console.error("Resource fetch error:", resourceError);
    }

    // Save query to database
    const { error: queryError } = await supabase.from("queries").insert({
      profile_id: userId,
      question,
      answer,
    });

    if (queryError) {
      console.error("Query save error:", queryError);
    }

    return res.status(200).json({
      answer,
      resources: resources || [],
    });
  } catch (error) {
    console.error("Ask Jiji error:", error);
    return res.status(500).json({ error: "Failed to process question" });
  }
});

export default router;
