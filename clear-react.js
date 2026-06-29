import mongoose from "mongoose";

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

const clearReact = async () => {
  await connectDb();
  const DocsSchema = new mongoose.Schema({ technology: String }, { strict: false });
  const Docs = mongoose.models.Docs || mongoose.model("Docs", DocsSchema);
  await Docs.deleteOne({ technology: "react" });
  console.log("Deleted react document from MongoDB");
  process.exit(0);
};

clearReact();
