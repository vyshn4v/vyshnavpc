import express from "express";
import { connectDb } from "./config/initializeDevDb.js";
import { initializeRedis, getRedisClient } from "./config/initializeRedis.js";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
import portfolioRoute from "./routes/portfolio.js";
import { visitorTracker } from "./middleware/visitorTracker.js";
import { initializeAmqp } from "./config/amqp.js";
import contactRouter from "./routes/contact.js";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
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
app.use("/", portfolioRoute);
app.use("/blogs", blogsRouter);
app.use("/contact", contactRouter);
// handling 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
await connectDb()
  .then(async () => {
    try {
      await initializeAmqp();
    } catch (err) {
      console.error("[AMQP] Failed to connect:", err.message);
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application if the database connection fails
  });
