import mongoose from "mongoose";

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
  }, { strict: false });
  return mongoose.model("Docs", DocsSchema);
};

const clearPostgres = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.deleteOne({ technology: "postgres" });
  console.log("✅ Cleared postgres docs");
  process.exit(0);
};

clearPostgres();
