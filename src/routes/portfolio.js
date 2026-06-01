import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getRedisClient } from "../config/initializeRedis.js";
import { getJourneyModel } from "../schema/journey.js";
import dsaQuestions from "./dsa.questions.js";

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
        EX: parseInt(process.env.REDIS_CACHE_TIME) || 60, // Cache for 60 seconds
      },
    );
    // Provide default projects if the database schema hasn't been updated yet
    const data = portfolio?.data || {};
    if (!data.projects || data.projects.length === 0) {
      data.projects = [
        {
          title: "Personal Portfolio",
          description: "A dark-themed, terminal-inspired portfolio website built with Express, Handlebars, and MongoDB.",
          technologies: ["Node.js", "Express", "Handlebars", "MongoDB"],
          github: "https://github.com/vyshn4v",
          live: "https://vyshnavpc.com"
        },
        {
          title: "Real-time Chat App",
          description: "A scalable real-time chat application utilizing WebSockets and Redis for message brokering.",
          technologies: ["React", "Socket.io", "Redis", "Docker"],
          github: "https://github.com/vyshn4v",
        }
      ];
    }

    res.render("landing-page", {
      ...data,
    });
  } catch (err) {
    next();
  }
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
    let journeyObj = journeyData ? journeyData.toObject() : {};
    
    // Normalization 1: If the user named the array "journey" instead of "steps" in the DB
    if (journeyObj.journey && !journeyObj.steps) {
      journeyObj.steps = journeyObj.journey;
    }
    
    // Normalization 2: If the user seeded the DB with multiple flat documents instead of one array document
    if (!journeyObj.steps && journeyObj.year) {
      const allDocs = await getJourneyModel().find().sort({ order: 1 });
      journeyObj = { steps: allDocs.map(d => d.toObject()) };
    }

    redis.set(
      process.env.REDIS_CACHE_KEY + ":journeyPage",
      JSON.stringify(journeyObj),
      {
        EX: parseInt(process.env.REDIS_CACHE_TIME) || 60, // Cache for 60 seconds
      },
    );
    // res.json({ journey: journeyData });
    res.render("journey-page", { journey: journeyObj });
  } catch (err) {
    next();
  }
});
router.get("/hidden-dsa-guide", (req, res) => {
  res.render("hidden-dsa-guide", dsaQuestions);
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
