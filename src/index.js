import express from "express";
import { connectDb } from "./config/initializeDevDb.js";
import { initializeRedis } from "./config/initializeRedis.js";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
import portfolioRoute from "./routes/portfolio.js";
import { visitorTracker } from "./middleware/visitorTracker.js";
import { initializeAmqp } from "./config/amqp.js";
import contactRouter from "./routes/contact.js";

// creating an instance of express
const app = express();
initializeHbsEngine(express, app);
// setting up the static files directory

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
    initializeRedis();
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
