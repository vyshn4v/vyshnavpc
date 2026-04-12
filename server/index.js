// importing necessary modules
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
// importing the portfolio data
import portfolio from "./data/portfolio.js";
import { buildContext } from "./data/blogs.js";

// __dirname is not available in ES modules, so we need to create it manually
const file_name = fileURLToPath(import.meta.url);
const __dirname = path.dirname(file_name);

// creating an instance of express
const app = express();
initializeHbsEngine(express, app);
// setting up the static files directory

// setting up the view engine and views directory
app.get("/", (req, res) => {
  res.render("landing-page", {
    ...portfolio,
  });
});
app.use("/blogs", blogsRouter);
// handling 404 errors for undefined routes
app.use((req, res) => {
  return res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
