import express from "express";
import { connectDb } from "./config/initializeDevDb.js";
import { initializeRedis } from "./config/initializeRedis.js";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
import portfolioRoute from "./routes/portfolio.js";

// creating an instance of express
const app = express();
initializeHbsEngine(express, app);
// setting up the static files directory

// setting up the view engine and views directory
app.use("/", portfolioRoute);
app.use("/blogs", blogsRouter);
// handling 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
await connectDb()
  .then(() => {
    initializeRedis();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1); // Exit the application if the database connection fails
  });
