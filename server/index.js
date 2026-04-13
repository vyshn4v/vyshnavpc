import dotenv from "dotenv";
dotenv.config();
import express from "express";
import initializeHbsEngine from "./config/hbsEngine.js";
import blogsRouter from "./routes/blogs.js";
import initializeDb from "./config/initializeDb.js";
import landingpageSchema from "./config/schema/landingpages.js";

// creating an instance of express
const app = express();
initializeHbsEngine(express, app);
initializeDb();
// setting up the static files directory

// setting up the view engine and views directory
app.get("/", async (req, res) => {
  const portfolio = await landingpageSchema.findOne();
  res.render("landing-page", {
    ...portfolio?.data,
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
