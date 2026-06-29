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
    topics: [{
      slug: String,
      title: String,
      order: Number,
      content: String,
      interviewQuestions: Array,
      practicalTask: Object
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const normalizeTitles = async () => {
  await connectDb();
  const Docs = getDocsModel();
  const allDocs = await Docs.find({});
  
  for (let doc of allDocs) {
    let modified = false;
    for (let topic of doc.topics) {
      if (topic.order !== undefined && topic.order !== null) {
        // Remove existing prefixes like "Chapter 41: ", "41. ", "41: "
        if (!topic.title) {
          topic.title = "Topic " + topic.order;
        }
        let cleanTitle = topic.title.replace(/^(Chapter\s*\d+[:.-]\s*|\d+[:.-]\s*)/i, '').trim();
        const expectedTitle = `${topic.order}. ${cleanTitle}`;
        
        if (topic.title !== expectedTitle) {
          topic.title = expectedTitle;
          modified = true;
        }
      }
    }
    
    if (modified) {
      await doc.save();
      console.log(`Normalized titles for ${doc.technology}`);
    }
  }
  process.exit(0);
};

normalizeTitles();
