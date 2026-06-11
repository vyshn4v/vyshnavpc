import mongoose from "mongoose";

const hrJobSchema = new mongoose.Schema(
  {
    to: {
      type: String, // comma separated emails
      required: true,
    },
    cc: {
      type: String,
      default: "",
    },
    bcc: {
      type: String,
      default: "",
    },
    subject: {
      type: String,
      required: true,
    },
    driveLink: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed"],
      default: "active",
    },
    lastRunAt: {
      type: Date,
      default: null,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

import { getDbConnection } from "../config/initializeDevDb.js";

export const getHrJobModel = () => {
  const db = getDbConnection();
  return db.models.HrJob || db.model("HrJob", hrJobSchema);
};
