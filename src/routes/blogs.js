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
  const base = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";
  const data = {
    pageTitle: "DevBlog",
    postPage: true,
    categories,
    featured,
    posts: rest,
    breadcrumbs: [
      { name: "Home", url: "/", position: 1 },
      { name: "DevBlog", url: `${base}/blogs`, position: 2 }
    ],
    meta: {
      title: "DevBlog | Vyshnav",
      description: "Articles on fullstack development, MERN stack, Node.js, DevOps, cloud infrastructure, and software engineering by Vyshnav.",
      keywords: "Vyshnav blog, Vyshnav, fullstack development, MERN stack, Node.js, DevOps, cloud, software engineering",
      author: "Vyshnav",
      canonical: `${base}/blogs`,
      siteName: "Vyshnav",
      ogImage: `${base}/og-preview.png`,
      schemaJSON: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "DevBlog | Vyshnav",
        "description": "Articles on fullstack development, MERN stack, Node.js, DevOps, cloud infrastructure, and software engineering by Vyshnav.",
        "url": `${base}/blogs`,
        "author": { "@type": "Person", "name": "Vyshnav P C" }
      }),
    },
  };
  redis.set(
    process.env.REDIS_CACHE_KEY + ":blogIndexPage",
    JSON.stringify(data),
    { EX: process.env.REDIS_CACHE_TIME },
  );
  res.render("blogs", data);
});
router.get("/:slugOrId", async (req, res, next) => {
  try {
    const slugOrId = req.params.slugOrId;
    const redis = getRedisClient();
    
    // Check if it's a valid object ID
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    
    let blogDoc = null;
    if (isObjectId) {
      blogDoc = await getBlogModel().findById(slugOrId).lean();
      if (blogDoc && blogDoc.slug) {
        // 301 Redirect to the slug version for SEO
        return res.redirect(301, `/blogs/${blogDoc.slug}`);
      }
    } else {
      blogDoc = await getBlogModel().findOne({ slug: slugOrId }).lean();
    }

    if (!blogDoc) {
      throw new Error("Post not found");
    }

    const actualBlogId = blogDoc._id.toString();
    const finalSlug = blogDoc.slug || actualBlogId;

    const cachedData = await redis.get(
      `${process.env.REDIS_CACHE_KEY}:blog:${actualBlogId}`,
    );
    if (cachedData) {
      return res.render("post", JSON.parse(cachedData));
    }
    const postData = await getBlogContentModel().aggregate([
      {
        $match: {
          blogId: new mongoose.Types.ObjectId(actualBlogId),
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
    const base = process.env.SITE_URL || "https://portfolio.vyshnavpc.com";
    const postUrl = `${base}/blogs/${finalSlug}`;
    const postImage = data.coverImage || `${base}/og-preview.png`;
    const postDescription = data.description || data.overview?.summary || "Read this post on MERN stack, fullstack development, DevOps, and software engineering by Vyshnav.";
    data.meta = {
      title: `${data.title || "Blog Post"} | Vyshnav`,
      description: postDescription,
      keywords: data.tags ? data.tags.join(", ") + ", Vyshnav, blog" : "Vyshnav, blog, fullstack development, MERN",
      author: "Vyshnav",
      canonical: postUrl,
      siteName: "Vyshnav",
      ogImage: postImage,
      ogType: "article",
      schemaJSON: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title || "Blog Post",
        "description": postDescription,
        "image": postImage,
        "url": postUrl,
        "datePublished": data.createdAt || new Date().toISOString(),
        "dateModified": data.updatedAt || data.createdAt || new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": "Vyshnav P C",
          "url": base
        },
        "publisher": {
          "@type": "Person",
          "name": "Vyshnav P C",
          "url": base
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": postUrl
        }
      }),
    };
    
    data.breadcrumbs = [
      { name: "Home", url: "/", position: 1 },
      { name: "DevBlog", url: `${base}/blogs`, position: 2 },
      { name: data.title || "Blog Post", url: postUrl, position: 3 }
    ];

    redis.set(
      `${process.env.REDIS_CACHE_KEY}:blog:${actualBlogId}`,
      JSON.stringify(data),
      { EX: process.env.REDIS_CACHE_TIME },
    );
    res.render("post", data);
  } catch (err) {
    next(); // fall through to 404
  }
});
router.get("/:slugOrId/json", async (req, res, next) => {
  try {
    const slugOrId = req.params.slugOrId;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);
    
    let blogDoc = null;
    if (isObjectId) {
      blogDoc = await getBlogModel().findById(slugOrId).lean();
    } else {
      blogDoc = await getBlogModel().findOne({ slug: slugOrId }).lean();
    }

    if (!blogDoc) {
      throw new Error("Post not found");
    }

    const actualBlogId = blogDoc._id.toString();

    const postData = await getBlogContentModel().aggregate([
      {
        $match: {
          blogId: new mongoose.Types.ObjectId(actualBlogId),
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
