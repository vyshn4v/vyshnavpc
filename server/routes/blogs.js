import express from "express";
import { buildContext } from "../data/blogs.js";

const router = express.Router();
router.get("/", (req, res) => {
  res.render("blogs", {
    ...buildContext(),
  });
});
router.get("/:href", (req, res) => {
  const { href } = req.params;
  const blog = buildContext().posts.find((b) => b.href === href);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }
  res.render("view-blog", {
    ...blog,
  });
});
export default router;
