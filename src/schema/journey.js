import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";
const journeySchema = new mongoose.Schema(
  {
    steps: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true },
);

// export default db.model("landingPages", landingpageSchema);
export function getJourneyModel() {
  const db = getDbConnection();
  return db.models.journey || db.model("journey", journeySchema);
}
