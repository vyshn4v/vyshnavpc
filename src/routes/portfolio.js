import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getRedisClient } from "../config/initializeRedis.js";
import { getJourneyModel } from "../schema/journey.js";

router.get("/", async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(
      process.env.REDIS_CACHE_KEY + ":landingPage",
    );
    if (cachedData) {
      return res.render("landing-page", JSON.parse(cachedData));
    }
    const portfolio = await getLandingPageModel().findOne();
    redis.set(
      process.env.REDIS_CACHE_KEY + ":landingPage",
      JSON.stringify(portfolio?.data),
      {
        EX: process.env.REDIS_CACHE_TIME, // Cache for 60 seconds
      },
    );
    res.render("landing-page", {
      ...portfolio?.data,
    });
  } catch (err) {
    next();
  }
});

router.get(["/login", "/.fgvsdf"], (req, res) => {
  res.render("login", {
    layout: "main",
    title: "Login | Vyshnav P C",
  });
});

router.get("/journey", async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(
      process.env.REDIS_CACHE_KEY + ":journeyPage",
    );
    if (cachedData) {
      return res.render("journey-page", { journey: JSON.parse(cachedData) });
    }
    const journeyData = await getJourneyModel().findOne();
    redis.set(
      process.env.REDIS_CACHE_KEY + ":journeyPage",
      JSON.stringify(journeyData?.toObject()),
      {
        EX: process.env.REDIS_CACHE_TIME, // Cache for 6
      },
    );
    // res.json({ journey: journeyData });
    res.render("journey-page", { journey: journeyData.toObject() });
  } catch (err) {
    next();
  }
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
