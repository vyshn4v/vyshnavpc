import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";
const landingpageSchema = new mongoose.Schema(
  {
    data: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

// export default db.model("landingPages", landingpageSchema);
export function getLandingPageModel() {
  const db = getDbConnection();
  return db.models.landingPages || db.model("landingPages", landingpageSchema);
}
