import express from "express";
import getDocsModel from "../schema/docs.js";
import { getRedisClient } from "../config/initializeRedis.js";

const router = express.Router();

router.get("/:technology", async (req, res) => {
  try {
    const technology = req.params.technology.toLowerCase();
    const redis = getRedisClient();
    const cacheKey = `${process.env.REDIS_CACHE_KEY || 'vyshnav'}:docs:${technology}`;
    
    let docData;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      docData = JSON.parse(cachedData);
    } else {
      docData = await getDocsModel().findOne({ technology: technology }).lean();
      if (docData) {
        // Cache for 1 hour (3600 seconds) since docs don't change frequently
        await redis.set(cacheKey, JSON.stringify(docData), {
          EX: 3600,
        });
      }
    }
    
    if (!docData) {
      return res.status(404).send(`<h1>404 - Documentation for ${technology} not found.</h1>`);
    }

    // Sort topics by order
    const sortedTopics = docData.topics.sort((a, b) => a.order - b.order);

    res.render("docs-view", {
      layout: "docs", 
      technology: docData.technology,
      title: docData.title,
      description: docData.description,
      topics: sortedTopics // Only pass topics for SSR Sidebar, no JSON injection!
    });
  } catch (err) {
    console.error("Error fetching docs:", err);
    res.status(500).send("Server Error");
  }
});

// Clean REST API endpoint to fetch the raw data securely
router.get("/api/:technology", async (req, res) => {
  try {
    const tech = req.params.technology.toLowerCase();
    const redis = getRedisClient();
    const cacheKey = `${process.env.REDIS_CACHE_KEY || 'vyshnav'}:docs:api:${tech}`;
    
    let docData;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      docData = JSON.parse(cachedData);
    } else {
      docData = await getDocsModel().findOne({ technology: tech }).lean();
      if (docData) {
        // Cache API response for 1 hour
        await redis.set(cacheKey, JSON.stringify(docData), {
          EX: 3600,
        });
      }
    }

    if (!docData) return res.status(404).json({ error: "Not found" });
    
    const sortedTopics = docData.topics.sort((a, b) => a.order - b.order);
    res.json({ topics: sortedTopics });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// Redirect /docs to /docs/general by default
router.get("/", (req, res) => {
  res.redirect("/docs/general");
});

export default router;
