import express from "express";
import { getBlogContentModel } from "../schema/blogsContent.js";
import mongoose from "mongoose";
import { getRedisClient } from "../config/initializeRedis.js";
import { getCategoryModel } from "../schema/categories.js";
import { getBlogModel } from "../schema/blogs.js";
const router = express.Router();
router.get("/", async (req, res) => {
  const redis = getRedisClient();

  const cachedData = await redis.get("Portfolio:blogIndexPage");
  if (cachedData) {
    return res.render("blogs", JSON.parse(cachedData));
  }
  const allPosts = await getBlogModel().aggregate([
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
  let categories = await getCategoryModel().find();
  categories = categories.map((c) => c?.toObject());
  const featured = allPosts.find((p) => p.featured) || null;
  const rest = allPosts.filter((p) => !p.featured);
  const data = {
    pageTitle: "DevBlog",
    postPage: true,
    categories,
    featured,
    posts: rest,
  };
  redis.set("Portfolio:blogIndexPage", JSON.stringify(data), {
    EX: process.env.REDIS_CACHE_TIME, // Cache for 60 seconds
  });
  res.render("blogs", data);
});
router.get("/:blogId", async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(`Portfolio:blog:${req.params.blogId}`);
    if (cachedData) {
      return res.render("post", JSON.parse(cachedData));
    }
    const postData = await getBlogContentModel().aggregate([
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
    redis.set(`Portfolio:blog:${req.params.blogId}`, JSON.stringify(data), {
      EX: process.env.REDIS_CACHE_TIME, // Cache for 60 seconds
    });
    res.render("post", data);
  } catch (err) {
    next(); // fall through to 404
  }
});
router.get("/:blogId/json", async (req, res, next) => {
  try {
    const postData = await getBlogContentModel().aggregate([
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
