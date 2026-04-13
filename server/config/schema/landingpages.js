import mongoose from "mongoose";

const landingpageSchema = new mongoose.Schema(
  {
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

export default mongoose.model("landingPages", landingpageSchema);
