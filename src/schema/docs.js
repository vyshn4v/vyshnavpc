import mongoose from "mongoose";
import { getDbConnection } from "../config/initializeDevDb.js";

const topicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  content: {
    type: String, // HTML or Markdown content
    required: true,
  },
  interviewQuestions: [{
    question: String,
    answer: String
  }],
  practicalTask: {
    scenario: String,
    task: String,
    solutionCode: String
  },
  order: {
    type: Number,
    default: 0,
  }
});

const docsSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: true,
    unique: true, // e.g. "typescript", "nodejs"
  },
  title: {
    type: String,
    required: true, // e.g. "TypeScript Documentation"
  },
  description: {
    type: String,
  },
  topics: [topicSchema]
});

const getDocsModel = () => {
  const db = getDbConnection();
  return db.models.Docs || db.model("Docs", docsSchema);
};

export default getDocsModel;
