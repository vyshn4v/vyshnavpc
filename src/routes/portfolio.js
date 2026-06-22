import express from "express";
const router = express.Router();
import { getLandingPageModel } from "../schema/landingpages.js";
import { getBlogModel } from "../schema/blogs.js";
import { getRedisClient } from "../config/initializeRedis.js";
import { getJourneyModel } from "../schema/journey.js";
import dsaQuestions from "./dsa.questions.js";

const BASE_URL = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";

function buildMeta(site = {}) {
  const dbName = site.name || "Vyshnav";
  const name   = "Vyshnav"; // Force the primary keyword
  const role   = site.role   || "MERN / Fullstack Developer";
  const desc   = site.description || `Hi, I am Vyshnav — a ${role} specialising in MongoDB, Express, React, Node.js, and cloud infrastructure.`;
  const url    = site.url    || BASE_URL;
  const image  = site.ogImage || `${BASE_URL}/og-preview.webp`;
  const twitter = site.twitter || "";

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Vyshnav P C",
    "alternateName": ["Vyshnav", "Vyshnav PC", "vyshnavpc"],
    "url": url,
    "jobTitle": role,
    "email": "vyshnavpcnaravoor@gmail.com",
    "telephone": "+918086064478",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kannur",
      "addressRegion": "Kerala",
      "addressCountry": "IN"
    },
    "sameAs": [
      site.github || "https://github.com/vyshn4v",
      site.linkedin || "https://www.linkedin.com/in/vyshnav-p-c-5567ba242/",
      "https://leetcode.com/u/vyshnavpcnaravoor/",
      "https://namastedev.com/vyshnavpcnaravoor",
      twitter ? `https://twitter.com/${twitter.replace("@","")}` : "",
    ].filter(Boolean),
    "image": image,
    "description": desc,
    "worksFor": {
      "@type": "Organization",
      "name": "Neutrinos"
    },
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Packapeer Academy"
      },
      {
        "@type": "EducationalOrganization",
        "name": "Sree Sankaracharya Institute"
      },
      {
        "@type": "EducationalOrganization",
        "name": "GVHSS Kadirur"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Bootcamp",
        "name": "MERN Stack Development",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "Packapeer Academy"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Diploma",
        "name": "Diploma in Graphic Design",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "Sree Sankaracharya Institute"
        }
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "High School",
        "name": "Electrical & Electronics Technology",
        "recognizedBy": {
          "@type": "EducationalOrganization",
          "name": "GVHSS Kadirur"
        }
      }
    ],
    "knowsAbout": ["MERN Stack", "React.js", "Node.js", "MongoDB", "Express.js", "Kubernetes", "Docker", "DevOps"]
  });

  const schemaArray = JSON.stringify([
    JSON.parse(schema),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Vyshnav P C",
      "url": url,
      "description": desc
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Vyshnav | ${role} Portfolio`,
      "url": url,
      "description": desc,
      "isPartOf": { "@type": "WebSite", "name": "Vyshnav P C", "url": url }
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": `${url}/#service`,
      "name": `Vyshnav P C - Freelance Fullstack Developer`,
      "description": "Freelance fullstack development services specializing in React JS and Node.js. Available for hire.",
      "telephone": "+918086064478",
      "priceRange": "$$",
      "image": image,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Kannur",
        "addressRegion": "Kerala",
        "addressCountry": "IN"
      },
      "provider": {
        "@type": "Person",
        "name": "Vyshnav P C"
      },
      "url": url
    }
  ]);

  return {
    title:          `Vyshnav | ${role} Portfolio`,
    description:    desc,
    keywords:       site.keywords || `Vyshnav, vyshnav pc, fullstack developer, MERN stack, React, Node.js, DevOps, cloud, APIs, software engineer`,
    author:         name,
    canonical:      url,
    siteName:       name,
    ogImage:        image,
    twitterHandle:  twitter,
    schemaJSON:     schemaArray,
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
    
    // Fallback overrides for SEO rankings
    if (renderData.hero) {
      renderData.hero.role_label = 'FREELANCE FULLSTACK DEVELOPER';
      renderData.hero.tagline = 'React JS & Node.js Expert';
      renderData.hero.sub = 'I build high-performance web applications as a freelance developer. Specializing in MongoDB, Express, React, Node.js, and cloud architectures.';
    }
    if (renderData.about && renderData.about.bio_paragraphs) {
      renderData.about.bio_paragraphs[0] = 'I am Vyshnav P C, a passionate freelance fullstack developer specializing in the MERN stack (MongoDB, Express, React, Node.js). I help businesses build scalable, performant web applications.';
      renderData.about.bio_paragraphs[1] = 'With expertise in both frontend React JS development and robust Node.js backend architectures, I deliver complete, end-to-end solutions as a dedicated freelancer.';
    }

    renderData.hasManyProjects = renderData.projects && renderData.projects.length >= 4;
    renderData.meta = buildMeta(renderData.site);
    res.render("landing-page", renderData);
  } catch (err) {
    console.error("Error in portfolio route:", err);
    next();
  }
});

router.get("/projects", async (req, res, next) => {
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
        console.error("[DB] Failed to fetch projects data:", dbErr.message);
        renderData = {};
      }
    }
    
    const base = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";
    const projectsMeta = {
      title: "Projects | Vyshnav",
      description: "A collection of web applications, tools, and projects built by Vyshnav P C.",
      keywords: "Vyshnav projects, web development portfolio, MERN stack projects, React applications",
      author: "Vyshnav",
      canonical: `${base}/projects`,
      siteName: "Vyshnav",
      ogImage: `${base}/og-preview.webp`,
      schemaJSON: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Vyshnav's Projects",
        "description": "A collection of web applications, tools, and projects built by Vyshnav P C.",
        "url": `${base}/projects`,
        "isPartOf": { "@type": "WebSite", "name": "Vyshnav P C", "url": base }
      }),
    };
    
    const breadcrumbs = [
      { name: "Home", url: "/", position: 1 },
      { name: "Projects", url: `${base}/projects`, position: 2 }
    ];

    res.render("projects-page", { projects: renderData.projects, hasManyProjects: renderData.projects && renderData.projects.length >= 4, meta: projectsMeta, breadcrumbs });
  } catch (err) {
    console.error("Error in projects route:", err);
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
      description: "A timeline of Vyshnav's career journey — education, projects, milestones, and growth as a MERN / Fullstack Developer.",
      keywords: "Vyshnav journey, Vyshnav career timeline, fullstack developer, software engineering journey",
      author: "Vyshnav",
      canonical: `${base}/journey`,
      siteName: "Vyshnav",
      ogImage: `${base}/og-preview.webp`,
      schemaJSON: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Vyshnav — My Career Journey",
        "description": "A timeline of Vyshnav's career journey — education, projects, milestones, and growth as a MERN / Fullstack Developer.",
        "url": `${base}/journey`,
        "isPartOf": { "@type": "WebSite", "name": "Vyshnav P C", "url": base }
      }),
    };
    
    const breadcrumbs = [
      { name: "Home", url: "/", position: 1 },
      { name: "Journey", url: `${base}/journey`, position: 2 }
    ];

    res.render("journey-page", { journey: journeyObj, meta: journeyMeta, breadcrumbs });
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
