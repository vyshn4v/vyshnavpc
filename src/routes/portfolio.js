import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getRedisClient } from "../config/initializeRedis.js";

router.get("/", async (req, res) => {
  const redis = getRedisClient();
  const cachedData = await redis.get("landingPage");
  if (cachedData) {
    return res.render("landing-page", JSON.parse(cachedData));
  }
  const portfolio = await getLandingPageModel().findOne();
  redis.set("landingPage", JSON.stringify(portfolio?.data), {
    EX: process.env.REDIS_CACHE_TIME, // Cache for 60 seconds
  });
  res.render("landing-page", {
    ...portfolio?.data,
  });
});

router.put("/portfolio-to-prod", (req, res) => {
  // Logic to move portfolio to production
  try {
    // Simulate moving portfolio to production
    getLandingPageModel()
      .find()
      .then((data) => {
        if (data.length === 0) {
          return res
            .status(404)
            .json({ message: "No landing page data found" });
        }
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error moving portfolio to production",
      error: error.message,
    });
  }
  res
    .status(200)
    .json({ message: "Portfolio moved to production successfully" });
});

export default router;
