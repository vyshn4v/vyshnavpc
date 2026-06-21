import express from "express";
import { getBlogContentModel } from "../schema/blogsContent.js";
import mongoose from "mongoose";
import { getRedisClient } from "../config/initializeRedis.js";
import { getCategoryModel } from "../schema/categories.js";
import { getBlogModel } from "../schema/blogs.js";
import { getDbConnection } from "../config/initializeDevDb.js";
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
  const rest = allPosts.filter((p) => p !== featured);
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
      ogImage: `${base}/og-preview.webp`,
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

// Secure API endpoint to create a new blog
router.post("/create", async (req, res, next) => {
  try {
    // 1. Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== (process.env.ADMIN_SECRET || "supersecret123")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { blog, content, overview, sections } = req.body;
    if (!blog || !content) {
      return res.status(400).json({ error: "Missing required fields: blog, content" });
    }

    const conn = getDbConnection();
    const db = conn.db;
    if (!db) throw new Error("Native db object is not available yet");
    const blogId = new mongoose.Types.ObjectId();

    // 2. Insert into blogs collection
    await getBlogModel().create({
      ...blog,
      _id: blogId
    });

    // 3. Insert into blog-contents collection
    await getBlogContentModel().create({
      ...content,
      blogId: blogId
    });

    // 4. Insert into blog-overviews
    if (overview) {
      await db.collection("blog-overviews").insertOne({
        ...overview,
        blogId: blogId
      });
    }

    // 5. Insert into blog-sections
    if (sections && Array.isArray(sections) && sections.length > 0) {
      const sectionsWithId = sections.map(s => ({ ...s, blogId: blogId }));
      await db.collection("blog-sections").insertMany(sectionsWithId);
    }

    // 6. Clear the Redis cache for the index page so the new blog shows up instantly
    const redis = getRedisClient();
    await redis.del(process.env.REDIS_CACHE_KEY + ":blogIndexPage");

    res.status(201).json({ success: true, message: "Blog created successfully", blogId, slug: blog.slug });
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Failed to create blog", details: err.message });
  }
});

// Secure API endpoint to update an existing blog
router.put("/update/:slugOrId", async (req, res) => {
  try {
    // 1. Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || authHeader !== (process.env.ADMIN_SECRET || "supersecret123")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { slugOrId } = req.params;
    const isObjectId = mongoose.Types.ObjectId.isValid(slugOrId);

    // 2. Find the existing blog
    let blogDoc = null;
    if (isObjectId) {
      blogDoc = await getBlogModel().findById(slugOrId);
    } else {
      blogDoc = await getBlogModel().findOne({ slug: slugOrId });
    }

    if (!blogDoc) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const blogId = blogDoc._id;
    const conn = getDbConnection();
    const db = conn.db;
    if (!db) throw new Error("Native db object is not available yet");

    const { blog, content, overview, sections } = req.body;

    // 3. Update blogs collection
    if (blog) {
      await getBlogModel().updateOne({ _id: blogId }, { $set: blog });
    }

    // 4. Update blog-contents collection
    if (content) {
      await getBlogContentModel().updateOne({ blogId }, { $set: content }, { upsert: true });
    }

    // 5. Replace blog-overviews (delete old + insert new)
    if (overview) {
      await db.collection("blog-overviews").deleteMany({ blogId });
      await db.collection("blog-overviews").insertOne({ ...overview, blogId });
    }

    // 6. Replace blog-sections (delete old + insert new)
    if (sections && Array.isArray(sections) && sections.length > 0) {
      await db.collection("blog-sections").deleteMany({ blogId });
      const sectionsWithId = sections.map(s => ({ ...s, blogId }));
      await db.collection("blog-sections").insertMany(sectionsWithId);
    }

    // 7. Clear Redis cache
    const redis = getRedisClient();
    await redis.del(process.env.REDIS_CACHE_KEY + ":blogIndexPage");
    await redis.del(`${process.env.REDIS_CACHE_KEY}:blog:${blogId.toString()}`);

    res.json({ success: true, message: "Blog updated successfully", blogId, slug: blogDoc.slug });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: "Failed to update blog", details: err.message });
  }
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
    const postImage = data.coverImage || `${base}/og-preview.webp`;
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
