import express from "express";
import { getBlogContentModel } from "../schema/blogsContent.js";
import mongoose from "mongoose";
import { getRedisClient } from "../config/initializeRedis.js";
import { getCategoryModel } from "../schema/categories.js";
import { getBlogModel } from "../schema/blogs.js";
const router = express.Router();
router.get("/", async (req, res) => {
  const redis = getRedisClient();

  const cachedData = await redis.get(
    process.env.REDIS_CACHE_KEY + ":blogIndexPage",
  );
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
  const base = process.env.SITE_URL || "https://vyshnavpc.com";
  const data = {
    pageTitle: "DevBlog",
    postPage: true,
    categories,
    featured,
    posts: rest,
    meta: {
      title: "DevBlog — Vyshnav P C",
      description: "Articles on backend development, Node.js, DevOps, cloud infrastructure, and software engineering by Vyshnav P C.",
      keywords: "Vyshnav PC blog, backend development, Node.js, DevOps, cloud, software engineering",
      author: "Vyshnav P C",
      canonical: `${base}/blogs`,
      siteName: "Vyshnav P C",
    },
  };
  redis.set(
    process.env.REDIS_CACHE_KEY + ":blogIndexPage",
    JSON.stringify(data),
    { EX: process.env.REDIS_CACHE_TIME },
  );
  res.render("blogs", data);
});
router.get("/:blogId", async (req, res, next) => {
  try {
    const redis = getRedisClient();
    const cachedData = await redis.get(
      `${process.env.REDIS_CACHE_KEY}:blog:${req.params.blogId}`,
    );
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
    const base = process.env.SITE_URL || "https://vyshnavpc.com";
    data.meta = {
      title: `${data.title || "Blog Post"} — Vyshnav P C`,
      description: data.description || data.overview?.summary || "Read this post on backend development, DevOps, and software engineering by Vyshnav P C.",
      keywords: data.tags ? data.tags.join(", ") : "Vyshnav PC, blog, backend development",
      author: "Vyshnav P C",
      canonical: `${base}/blogs/${req.params.blogId}`,
      siteName: "Vyshnav P C",
      ogImage: data.coverImage || `${base}/images/og-image.png`,
    };
    redis.set(
      `${process.env.REDIS_CACHE_KEY}:blog:${req.params.blogId}`,
      JSON.stringify(data),
      { EX: process.env.REDIS_CACHE_TIME },
    );
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
