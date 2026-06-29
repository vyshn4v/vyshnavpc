import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { connectDb } from "../config/initializeDevDb.js";
import getMcqModel from "../schema/mcq.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "mcq-data");

async function seed() {
  console.log("🚀 Starting MCQ Seeding Process...");
  try {
    const db = await connectDb();
    console.log("✅ Connected to MongoDB");

    const Mcq = getMcqModel();

    console.log("🗑️ Clearing existing MCQs...");
    await Mcq.deleteMany({});

    // Read all JSON files in mcq-data directory
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".json"));
    
    let totalQuestions = 0;

    for (const file of files) {
      const filePath = path.join(dataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      
      // Some json strings from JS objects might have unquoted keys if poorly formatted,
      // but assuming standard JSON is used moving forward.
      // The chunk0 might be standard JS, let's parse carefully or evaluate it.
      // Since chunk0 was a JS array string, it's not strictly valid JSON.
      // Let's use Function to evaluate it safely.
      let chunkData;
      try {
        chunkData = JSON.parse(fileContent);
      } catch (e) {
        chunkData = new Function("return " + fileContent)();
      }

      console.log(`📥 Inserting ${chunkData.length} questions from ${file}...`);
      await Mcq.insertMany(chunkData);
      totalQuestions += chunkData.length;
    }

    console.log(`✅ Seeding complete! Total questions inserted: ${totalQuestions}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
