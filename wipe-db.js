import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "src", ".env.local") });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Master Wipe");
    await mongoose.connection.db.collection('docs').deleteMany({});
    console.log("Docs collection completely wiped!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
