import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";

const blogContentSchema = new mongoose.Schema(
  {
    pageTitle: {
      type: String,
      required: true,
      trim: true,
    },
    postPage: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    titleLine1: {
      type: String,
      trim: true,
    },
    titleLine2: {
      type: String,
      trim: true,
    },
    date: {
      type: String, // e.g. "Jan 2025"
    },
    readTime: {
      type: String, // e.g. "8 min read"
    },
    category: {
      type: String, // e.g. "8 min read"
    },
    meta: {
      tags: {
        type: String, // e.g. "JavaScript · Node.js · Async"
      },
    },
    lead: {
      type: String,
      trim: true,
    },
    footer: {
      type: mongoose.Schema.Types.Mixed, // flexible, fill later
      default: {},
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogContent", // links to content collection
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  },
);

// export default mongoose.model("blog-contents", blogContentSchema);
export function getBlogContentModel() {
  const db = getDbConnection();
  return (
    db.models["blog-contents"] || db.model("blog-contents", blogContentSchema)
  );
}
