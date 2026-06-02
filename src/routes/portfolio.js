import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getRedisClient } from "../config/initializeRedis.js";
import { getJourneyModel } from "../schema/journey.js";
import dsaQuestions from "./dsa.questions.js";

const BASE_URL = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";

function buildMeta(site = {}) {
  const dbName = site.name || "Vyshnav";
  const name   = "Vyshnav"; // Force the primary keyword
  const role   = site.role   || "Backend Developer";
  const desc   = site.description || `Hi, I am Vyshnav — a ${role} specialising in Node.js, DevOps, cloud infrastructure and scalable APIs.`;
  const url    = site.url    || BASE_URL;
  const image  = site.ogImage || `${BASE_URL}/images/og-image.png`;
  const twitter = site.twitter || "";

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "url": url,
    "jobTitle": role,
    "sameAs": [
      site.github  || "",
      site.linkedin || "",
      twitter ? `https://twitter.com/${twitter.replace("@","")}` : "",
    ].filter(Boolean),
    "image": image,
    "description": desc,
  });

  return {
    title:          `Vyshnav | ${role} Portfolio`,
    description:    desc,
    keywords:       site.keywords || `Vyshnav, vyshnav pc, backend developer, Node.js, DevOps, cloud, APIs, software engineer`,
    author:         name,
    canonical:      url,
    siteName:       name,
    ogImage:        image,
    twitterHandle:  twitter,
    schemaJSON:     schema,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cacheKey = process.env.REDIS_CACHE_KEY + ":landingPage";
    const cachedData = await redis.get(cacheKey);
    let renderData;

    if (cachedData) {
      renderData = JSON.parse(cachedData);
    } else {
      try {
        const portfolio = await getLandingPageModel().findOne();
        renderData = portfolio?.data || {};
        redis.set(cacheKey, JSON.stringify(renderData), {
          EX: parseInt(process.env.REDIS_CACHE_TIME) || 60,
        });
      } catch (dbErr) {
        console.error("[DB] Failed to fetch landing page data:", dbErr.message);
        renderData = {};
      }
    }

    renderData.hasManyProjects = renderData.projects && renderData.projects.length >= 4;
    renderData.meta = buildMeta(renderData.site);
    res.render("landing-page", renderData);
  } catch (err) {
    console.error("Error in portfolio route:", err);
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
    const base = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";
    const journeyMeta = {
      title: "Vyshnav — My Career Journey",
      description: "A timeline of Vyshnav's career journey — education, projects, milestones, and growth as a backend developer.",
      keywords: "Vyshnav journey, Vyshnav career timeline, backend developer, software engineering journey",
      author: "Vyshnav",
      canonical: `${base}/journey`,
      siteName: "Vyshnav",
    };
    res.render("journey-page", { journey: journeyObj, meta: journeyMeta });
  } catch (err) {
    next();
  }
});
router.get("/sitemap.xml", (req, res) => {
  const base = process.env.SITE_URL || "https://vyshnavpc.com";
  const today = new Date().toISOString().split("T")[0];
  const urls = [
    { loc: `${base}/`,         priority: "1.0", changefreq: "weekly" },
    { loc: `${base}/journey`,  priority: "0.8", changefreq: "monthly" },
    { loc: `${base}/blogs`,    priority: "0.8", changefreq: "weekly" },
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
  res.header("Content-Type", "application/xml");
  res.send(xml);
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
