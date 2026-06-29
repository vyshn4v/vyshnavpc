import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";

const McqSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answerIndex: { type: Number, required: true },
  explanation: { type: String, required: true }
}, {
  timestamps: true
});

const getMcqModel = () => {
  const db = getDbConnection();
  return db.models.Mcq || db.model("Mcq", McqSchema);
};

export default getMcqModel;
