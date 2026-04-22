import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";
// import { categorySchema } from "./categories";

const blogSchema = new mongoose.Schema(
  {
    slug: String,
    title: String,
    excerpt: String,
    category: String,
    date: String,
    readTime: String,
    tags: [String],
    featured: Boolean,
  },
  { timestamps: true },
);

// export default mongoose.model("blogs", blogSchema);
export function getBlogModel() {
  const db = getDbConnection();
  return db.models.blogs || db.model("blogs", blogSchema);
}
