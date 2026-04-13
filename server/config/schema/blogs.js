import mongoose from "mongoose";

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

export default mongoose.model("blogs", blogSchema);
