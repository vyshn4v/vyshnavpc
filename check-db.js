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
    technology: { type: String, required: true },
    topics: [{ order: Number }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const checkDb = async () => {
  await connectDb();
  const Docs = getDocsModel();
  const allDocs = await Docs.find({});
  allDocs.forEach(doc => {
    console.log(doc.technology, ":", doc.topics.map(t => t.order).sort((a,b)=>a-b));
  });
  process.exit(0);
};

checkDb();
