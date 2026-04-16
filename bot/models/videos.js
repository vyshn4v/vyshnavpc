const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  messageId: { type: Number, unique: true },
  fileId: String,
  caption: String,
  tags: [String],
  sourceUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  isNew: { type: Boolean, default: true },
});

videoSchema.index({ caption: "text", tags: "text" });

module.exports = mongoose.model("videos", videoSchema);
