import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getBlogModel } from "../schema/blogs.js";
import { getRedisClient } from "../config/initializeRedis.js";
import { getJourneyModel } from "../schema/journey.js";
import dsaQuestions from "./dsa.questions.js";

const BASE_URL = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";

function buildMeta(site = {}) {
  const name   = "Vyshnav";
  const role   = site.role   || "MERN / Full Stack Developer";
  const desc   = site.description || `Vyshnav P C — Full-stack developer with ~2 years of experience building scalable backend systems in Node.js and Express.js, plus dynamic React/Redux frontends. Skilled in integrating PostgreSQL, MongoDB, and Redis. Actively seeking full-time roles.`;
  const url    = site.url    || BASE_URL;
  const image  = site.ogImage || `${BASE_URL}/vyshnav_p_c.jpg`;
  const twitter = site.twitter || "";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vyshnav P C",
    "alternateName": ["Vyshnav", "Vyshnav PC", "vyshnavpc"],
    "url": url,
    "jobTitle": role,
    "email": "vyshnavpcnaravoor@gmail.com",
    "telephone": "+918086064478",
    "address": { "@type": "PostalAddress", "addressLocality": "Kannur", "addressRegion": "Kerala", "addressCountry": "IN" },
    "sameAs": [
      site.github || "https://github.com/vyshn4v",
      site.linkedin || "https://www.linkedin.com/in/vyshnav-p-c-5567ba242/",
      "https://leetcode.com/u/vyshnavpcnaravoor/",
      "https://namastedev.com/vyshnavpcnaravoor",
      twitter ? `https://twitter.com/${twitter.replace("@","")}` : "",
    ].filter(Boolean),
    "image": image,
    "description": desc,
    "worksFor": { "@type": "Organization", "name": "Freelance / Open to work" },
    "alumniOf": [
      { "@type": "EducationalOrganization", "name": "Packapeer Academy" },
      { "@type": "EducationalOrganization", "name": "Sree Sankaracharya Institute" },
      { "@type": "EducationalOrganization", "name": "GVHSS Kadirur" }
    ],
    "hasCredential": [
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Bootcamp", "name": "MERN Stack Development", "recognizedBy": { "@type": "EducationalOrganization", "name": "Packapeer Academy" } },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "Diploma", "name": "Diploma in Graphic Design", "recognizedBy": { "@type": "EducationalOrganization", "name": "Sree Sankaracharya Institute" } },
      { "@type": "EducationalOccupationalCredential", "credentialCategory": "High School", "name": "Electrical & Electronics Technology", "recognizedBy": { "@type": "EducationalOrganization", "name": "GVHSS Kadirur" } }
    ],
    "knowsAbout": ["MERN Stack", "React.js", "Node.js", "MongoDB", "Express.js", "PostgreSQL", "Redis", "RabbitMQ", "Kubernetes", "Docker", "AWS", "DevOps"]
  };

  const schemaArray = JSON.stringify([
    personSchema,
    { "@context": "https://schema.org", "@type": "WebSite", "name": "Vyshnav P C", "url": url, "description": desc },
    { "@context": "https://schema.org", "@type": "WebPage", "name": `Vyshnav | ${role} Portfolio`, "url": url, "description": desc, "isPartOf": { "@type": "WebSite", "name": "Vyshnav P C", "url": url } },
    { "@context": "https://schema.org", "@type": "ProfessionalService", "@id": `${url}/#service`, "name": "Vyshnav P C - Software Engineer", "description": "Software Engineer specializing in React JS and Node.js. Actively seeking full-time roles.", "telephone": "+918086064478", "priceRange": "$$", "image": image, "address": { "@type": "PostalAddress", "addressLocality": "Kannur", "addressRegion": "Kerala", "addressCountry": "IN" }, "provider": { "@type": "Person", "name": "Vyshnav P C" }, "url": url }
  ]);

  return {
    title:          `Vyshnav | ${role} Portfolio`,
    description:    desc,
    keywords:       site.keywords || `Vyshnav, vyshnav pc, software engineer, MERN stack developer, React JS, Node.js, DevOps, full-time, seeking roles, APIs`,
    author:         name,
    canonical:      url,
    siteName:       name,
    ogImage:        image,
    twitterHandle:  twitter,
    schemaJSON:     schemaArray,
  };
}

// Cache the default meta at module level — recomputed only on server restart
let _cachedMeta = null;
function getCachedMeta(site) {
  if (!_cachedMeta) _cachedMeta = buildMeta(site);
  return _cachedMeta;
}

// Static journey page meta — built once
const _journeyMeta = {
  title: "Vyshnav — My Career Journey",
  description: "A timeline of Vyshnav's career journey — education, projects, milestones, and growth as a MERN / Fullstack Developer.",
  keywords: "Vyshnav journey, Vyshnav career timeline, fullstack developer, software engineering journey",
  author: "Vyshnav",
  canonical: `${BASE_URL}/journey`,
  siteName: "Vyshnav",
  ogImage: `${BASE_URL}/og-preview.webp`,
  schemaJSON: JSON.stringify({
    "@context": "https://schema.org", "@type": "WebPage",
    "name": "Vyshnav — My Career Journey",
    "description": "A timeline of Vyshnav's career journey — education, projects, milestones, and growth as a MERN / Fullstack Developer.",
    "url": `${BASE_URL}/journey`,
    "isPartOf": { "@type": "WebSite", "name": "Vyshnav P C", "url": BASE_URL }
  }),
};
const _journeyBreadcrumbs = [
  { name: "Home", url: "/", position: 1 },
  { name: "Journey", url: `${BASE_URL}/journey`, position: 2 }
];

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
        const portfolio = await getLandingPageModel().findOne().lean();
        renderData = portfolio?.data || {};
        redis.set(cacheKey, JSON.stringify(renderData), {
          EX: parseInt(process.env.REDIS_CACHE_TIME) || 60,
        });
      } catch (dbErr) {
        console.error("[DB] Failed to fetch landing page data:", dbErr.message);
        renderData = {};
      }
    }
    
    // SEO fallbacks — only applied when the DB value is missing
    if (!renderData.hero) renderData.hero = {};
    renderData.hero.role_label = renderData.hero.role_label || 'MERN/Full Stack Developer — Actively seeking full-time roles';
    renderData.hero.tagline = renderData.hero.tagline || 'I build fullstack products end-to-end — from infrastructure to interface.';
    renderData.hero.sub = renderData.hero.sub || 'Full-stack developer with ~2 years of experience building scalable backend systems in Node.js and Express.js, plus dynamic React/Redux frontends.';
    if (!renderData.hero.cta_primary) renderData.hero.cta_primary = {};
    renderData.hero.cta_primary.label = renderData.hero.cta_primary.label || 'CONTACT ME';
    
    if (!renderData.about) renderData.about = {};
    if (!renderData.about.bio_paragraphs || !renderData.about.bio_paragraphs.length) {
      renderData.about.bio_paragraphs = [
        "I'm Vyshnav, a Freelance Fullstack Developer who spent ~2 years as an SDE 1 at Neutrinos working across the MERN stack — building features end-to-end, from database schema to deployment.",
        "Right now I'm looking for a full-time role where I can keep growing as an engineer and take on real ownership. I specialize in React JS and Node.js."
      ];
    }

    renderData.hasManyProjects = renderData.projects && renderData.projects.length >= 4;
    renderData.meta = getCachedMeta(renderData.site);
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
      return res.render("journey-page", { 
        journey: JSON.parse(cachedData), 
        isSubpage: true,
        subpageCategory: 'Special Feature',
        subpageTitle: "The Developer's Journey",
        subpageNum: 3
      });
    }
    const journeyObj = await getJourneyModel().findOne().lean() || {};
    
    // Normalization 1: If the user named the array "journey" instead of "steps" in the DB
    if (journeyObj.journey && !journeyObj.steps) {
      journeyObj.steps = journeyObj.journey;
    }
    
    // Normalization 2: If the user seeded the DB with multiple flat documents instead of one array document
    if (!journeyObj.steps && journeyObj.year) {
      const allDocs = await getJourneyModel().find().sort({ order: 1 }).lean();
      journeyObj.steps = allDocs;
    }

    redis.set(
      process.env.REDIS_CACHE_KEY + ":journeyPage",
      JSON.stringify(journeyObj),
      {
        EX: parseInt(process.env.REDIS_CACHE_TIME) || 60,
      },
    );
    res.render("journey-page", { 
      journey: journeyObj, 
      meta: _journeyMeta, 
      breadcrumbs: _journeyBreadcrumbs, 
      isSubpage: true,
      subpageCategory: 'Special Feature',
      subpageTitle: "The Developer's Journey",
      subpageNum: 3 
    });
  } catch (err) {
    next();
  }
});
router.get("/sitemap.xml", async (req, res) => {
  const base = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";
  const today = new Date().toISOString().split("T")[0];

  // Static pages
  const urls = [
    { loc: `${base}/`,         priority: "1.0", changefreq: "daily" },
    { loc: `${base}/journey`,  priority: "0.8", changefreq: "weekly" },
    { loc: `${base}/blogs`,    priority: "0.9", changefreq: "daily" },
  ];

  // Dynamically add all blog posts
  try {
    const blogs = await getBlogModel().find({}, { _id: 1, slug: 1, updatedAt: 1 }).lean();
    blogs.forEach((blog) => {
      urls.push({
        loc: `${base}/blogs/${blog.slug || blog._id}`,
        priority: "0.7",
        changefreq: "weekly",
        lastmod: blog.updatedAt
          ? new Date(blog.updatedAt).toISOString().split("T")[0]
          : today,
      });
    });
  } catch (err) {
    console.error("[Sitemap] Failed to fetch blogs:", err.message);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
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
