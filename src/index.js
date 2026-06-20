import express from "express";
import { connectDb } from "./config/initializeDevDb.js";
import { initializeRedis, getRedisClient } from "./config/initializeRedis.js";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
import portfolioRoute from "./routes/portfolio.js";
import { visitorTracker } from "./middleware/visitorTracker.js";
import { initializeAmqp } from "./config/amqp.js";
import contactRouter from "./routes/contact.js";
import hrRouter from "./routes/hr.js";
import { startHrWorker } from "./workers/hrWorker.js";
import { startHrScheduler } from "./cron/hrScheduler.js";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
initializeRedis();

// creating an instance of express
const app = express();
app.set("trust proxy", 1); // Trust first proxy (useful for rate-limiting behind load balancers)
initializeHbsEngine(express, app);
// setting up the static files directory

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later" },
  store: new RedisStore({
    prefix: process.env.RATE_LIMITER_PREFIX,
    sendCommand: (...args) => getRedisClient().sendCommand(args),
  }),
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// setting up the view engine and views directory
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(visitorTracker);

// AI Agent Readiness Middleware
app.use((req, res, next) => {
  // 1. Link Headers for AI Discovery
  if (req.path === "/" || req.path === "") {
    res.append("Link", '</.well-known/api-catalog>; rel="api-catalog"');
  }
  
  // 2. Markdown Content Negotiation
  if (req.headers.accept && req.headers.accept.includes("text/markdown")) {
    if (req.path === "/" || req.path === "") {
      res.setHeader("Content-Type", "text/markdown; charset=utf-8");
      // Use x-markdown-tokens header to signify AI-friendly format
      res.setHeader("x-markdown-tokens", "true");
      return res.sendFile("llms.txt", { root: "./src/public" });
    }
  }
  next();
});

// Serve static well-known files
app.use("/.well-known", express.static("./src/public/.well-known"));

// API Catalog route
app.get("/.well-known/api-catalog", (req, res) => {
  res.setHeader("Content-Type", "application/linkset+json");
  res.json({
    linkset: [
      {
        anchor: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/api-docs`,
        "service-desc": [
          { href: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/api-docs`, type: "text/html" }
        ],
        "service-doc": [
          { href: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/api-docs`, type: "text/html" }
        ]
      }
    ]
  });
});

// OAuth Discovery Metadata
app.get("/.well-known/oauth-authorization-server", (req, res) => {
  res.json({
    issuer: process.env.SITE_URL || "https://portfolio.vyshnavpc.com",
    authorization_endpoint: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/oauth/authorize`,
    token_endpoint: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/oauth/token`,
    jwks_uri: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/.well-known/jwks.json`,
    grant_types_supported: ["client_credentials"],
    agent_auth: {
      register_uri: `${process.env.SITE_URL || "https://portfolio.vyshnavpc.com"}/auth.md`,
      supported_identity_types: ["none"]
    }
  });
});

// OAuth Protected Resource Metadata
app.get("/.well-known/oauth-protected-resource", (req, res) => {
  res.json({
    resource: process.env.SITE_URL || "https://portfolio.vyshnavpc.com",
    authorization_servers: [
      process.env.SITE_URL || "https://portfolio.vyshnavpc.com"
    ],
    scopes_supported: ["public"]
  });
});

app.use("/", portfolioRoute);
app.use("/blogs", blogsRouter);
app.use("/contact", contactRouter);
app.use("/hr-portal", hrRouter); // HR application blasting route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: "Vyshnav PC — API Docs",
  customCss: `.swagger-ui .topbar { background: #0a0a0f; } .swagger-ui .topbar-wrapper img { content: none; } .swagger-ui .info .title { color: #7c6ef7; }`,
}));
// handling 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

// Start the server immediately — don't wait for DB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to DB and AMQP in background with retry
async function connectWithRetry(attempt = 1) {
  try {
    await connectDb();
    console.log("[DB] Connected to MongoDB successfully");
    try {
      await initializeAmqp();
      startHrWorker(); // Initialize the worker
      startHrScheduler(); // Initialize the cron job
    } catch (err) {
      console.error("[AMQP] Failed to connect:", err.message);
    }
  } catch (error) {
    const delay = Math.min(5000 * attempt, 30000);
    console.error(`[DB] Connection failed (attempt ${attempt}), retrying in ${delay / 1000}s...`, error.message);
    setTimeout(() => connectWithRetry(attempt + 1), delay);
  }
}

connectWithRetry();
