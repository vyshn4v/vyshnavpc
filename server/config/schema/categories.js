import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String, // emoji or icon identifier, e.g. "⚡"
    },
    color: {
      type: String, // hex string, e.g. "#fde68a"
    },
    bg: {
      type: String, // CSS color value, e.g. "rgba(251,191,36,.1)"
    },
  },
  { timestamps: true },
);

export default mongoose.model("categories", categorySchema);
