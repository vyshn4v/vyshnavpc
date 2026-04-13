import express from "express";
import { buildContext } from "../data/blogs.js";
import postData from "../data/posts/data.js";
import categories from "../data/categories.js";
import allPosts from "../data/posts.js";
const router = express.Router();
router.get("/", (req, res) => {
  const featured = allPosts.find((p) => p.featured) || null;
  const rest = allPosts.filter((p) => !p.featured);
  res.render("blogs", {
    pageTitle: "DevBlog",
    postPage: false,
    categories: Object.values(categories),
    featured,
    posts: rest,
  });
});
router.get("/:slug", (req, res, next) => {
  try {
    // res.render("view-blog");
    console.log(`Loading blog post: ${req.params.slug}`);
    // const postData = require(`../data/posts/data.js`);
    res.render("post", postData);
  } catch (err) {
    console.error(`Error loading blog post: ${req.params.slug}`, err);

    next(); // fall through to 404
  }
});
export default router;
