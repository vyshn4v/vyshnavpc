import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, default: "" },
    email:     { type: String, required: true },
    subject:   { type: String, default: "" },
    message:   { type: String, required: true },
    ip:        { type: String, default: "" },
    country:   { type: String, default: "" },
    state:     { type: String, default: "" },
    city:      { type: String, default: "" },
    device:    { type: String, default: "" },
    browser:   { type: String, default: "" },
    status:    {
      type: String,
      enum: ["queued", "sent", "failed"],
      default: "queued"
    },
  },
  { timestamps: true }
);

export function getContactModel() {
  const db = getDbConnection();
  return db.models.Contact || db.model("Contact", contactSchema);
}
