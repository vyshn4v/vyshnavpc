import express from "express";
import getMcqModel from "../schema/mcq.js";
import { getRedisClient } from "../config/initializeRedis.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("mcq-app", {
    layout: "main",
    title: "Daily Practice | Vyshnav P C",
    description: "Daily Multiple Choice Questions for Full-Stack Developers."
  });
});

router.get("/api/questions", async (req, res) => {
  try {
    const redis = getRedisClient();
    const cacheKey = `${process.env.REDIS_CACHE_KEY || 'vyshnav'}:mcq:all`;
    
    // Try to get from cache
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // If not in cache, get from MongoDB
    const questions = await getMcqModel().find().lean();
    
    // Cache for 1 hour (3600 seconds)
    if (questions && questions.length > 0) {
      await redis.set(cacheKey, JSON.stringify(questions), { EX: 3600 });
    }
    
    res.json(questions);
  } catch (error) {
    console.error("Error fetching MCQs:", error);
    res.status(500).json({ error: "Failed to fetch practice questions" });
  }
});

export default router;
