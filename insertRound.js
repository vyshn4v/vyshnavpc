import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";

dotenv.config({ path: "./src/.env.local" });

export const insertRound = async (roundData) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGODB_DB_NAME
      });
    }
    
    const InterviewRound = getInterviewModel();
    
    // Upsert the round data
    await InterviewRound.findOneAndUpdate(
      { roundId: roundData.roundId },
      roundData,
      { upsert: true, new: true }
    );
    
    console.log(`Successfully inserted/updated round: ${roundData.roundName}`);
  } catch (err) {
    console.error("Error inserting round:", err);
    throw err;
  }
};
