import mongoose from "mongoose";

const clearNodeDocs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    const DocsSchema = new mongoose.Schema({
      technology: { type: String, required: true, unique: true }
    }, { strict: false });
    const Docs = mongoose.models.Docs || mongoose.model("Docs", DocsSchema);
    
    await Docs.deleteMany({ technology: "nodejs" });
    console.log("✅ Cleared nodejs docs");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
clearNodeDocs();
