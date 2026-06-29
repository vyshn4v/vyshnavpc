import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./src/.env.local" });

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) return;
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

export const appendTopics = async (technology, title, description, topics) => {
  await connectDb();
  const Docs = getDocsModel();
  
  // First ensure the document exists with the correct title and description
  await Docs.findOneAndUpdate(
    { technology },
    { $setOnInsert: { title, description } },
    { upsert: true }
  );
  
  // Remove any existing topics that have the exact same 'order' as the new topics
  const orders = topics.map(t => t.order);
  await Docs.findOneAndUpdate(
    { technology },
    { $pull: { topics: { order: { $in: orders } } } }
  );

  // Then push the new topics
  await Docs.findOneAndUpdate(
    { technology },
    { $push: { topics: { $each: topics } } }
  );
  
  console.log(`✅ Appended ${topics.length} topics to ${technology}`);
  process.exit(0);
};

export const replaceDocs = async (technology, title, description, topics) => {
  await connectDb();
  const Docs = getDocsModel();

  await Docs.findOneAndUpdate(
    { technology },
    { title, description, topics },
    { upsert: true }
  );

  console.log(`✅ Replaced docs for ${technology}`);
  process.exit(0);
};

export const clearDocs = async (filter = {}) => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.deleteMany(filter);
  console.log(`✅ Cleared docs matching ${JSON.stringify(filter)}`);
};
