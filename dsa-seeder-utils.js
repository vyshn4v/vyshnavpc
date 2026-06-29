import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env.local" });

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(process.env.MONGO_URI);
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

export const appendDsaTopics = async (topics) => {
  await connectDb();
  const Docs = getDocsModel();
  
  const technology = "dsa";
  const title = "Data Structures and Algorithms Masterclass: Noob to Pro";
  const description = "The ultimate encyclopedic curriculum for mastering DSA. Learn mental models, core data structures, algorithms, and how to ace FAANG interviews.";
  
  await Docs.findOneAndUpdate(
    { technology },
    { $setOnInsert: { title, description } },
    { upsert: true }
  );
  
  await Docs.findOneAndUpdate(
    { technology },
    { $push: { topics: { $each: topics } } }
  );
  
  console.log(`✅ Appended ${topics.length} DSA topics.`);
  process.exit(0);
};
