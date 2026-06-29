import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env.local" });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) return mongoose.models.Docs;
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true },
      interviewQuestions: [{
        question: { type: String },
        answer: { type: String }
      }],
      practicalTask: {
        scenario: { type: String },
        task: { type: String },
        solutionCode: { type: String }
      }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const clearAll = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.deleteMany({}); // Wipe EVERYTHING
  console.log("Cleared ALL documents from the database.");
  process.exit(0);
};

clearAll();
