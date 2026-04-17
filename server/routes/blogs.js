import express from "express";
import blogContentSchema from "../config/schema/blogsContent.js";
import mongoose from "mongoose";
import categorySchema from "../config/schema/categories.js";
import blogSchema from "../config/schema/blogs.js";
const router = express.Router();
router.get("/", async (req, res) => {
  const allPosts = await blogSchema.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "slug",
        as: "category",
      },
    },
    {
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);

  let categories = await categorySchema.find();
  categories = categories.map((c) => c?.toObject());
  const featured = allPosts.find((p) => p.featured) || null;
  const rest = allPosts.filter((p) => !p.featured);
  res.render("blogs", {
    pageTitle: "DevBlog",
    postPage: true,
    categories,
    featured,
    posts: rest,
  });
});
router.get("/:blogId", async (req, res, next) => {
  try {
    const postData = await blogContentSchema.aggregate([
      {
        $match: {
          blogId: new mongoose.Types.ObjectId(req.params.blogId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "slug",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "blog-sections",
          localField: "blogId",
          foreignField: "blogId",
          as: "sections",
        },
      },
      {
        $lookup: {
          from: "blog-overviews",
          localField: "blogId",
          foreignField: "blogId",
          as: "overview",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$overview",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    const data = postData?.[0];
    if (!data) {
      throw new Error("Post not found");
    }
    // res.json(data);
    res.render("post", data);
  } catch (err) {
    next(); // fall through to 404
  }
});
router.get("/:blogId/json", async (req, res, next) => {
  try {
    const postData = await blogContentSchema.aggregate([
      {
        $match: {
          blogId: new mongoose.Types.ObjectId(req.params.blogId),
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "slug",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "blog-sections",
          localField: "blogId",
          foreignField: "blogId",
          as: "sections",
        },
      },
      {
        $lookup: {
          from: "blog-overviews",
          localField: "blogId",
          foreignField: "blogId",
          as: "overview",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$overview",
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
    const data = postData?.[0];
    if (!data) {
      throw new Error("Post not found");
    }
    res.json(data);
  } catch (err) {
    next(); // fall through to 404
  }
});
export default router;
