import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";

dotenv.config({ path: "./src/.env.local" });

export const appendQuestions = async (roundId, additionalCategories) => {
  try {
    await connectDb();
    
    const InterviewRound = getInterviewModel();
    
    const round = await InterviewRound.findOne({ roundId });
    if (!round) {
      throw new Error(`Round ${roundId} not found!`);
    }

    // Merge categories
    for (const newCat of additionalCategories) {
      const existingCat = round.categories.find(c => c.categoryName === newCat.categoryName);
      if (existingCat) {
        existingCat.questions.push(...newCat.questions);
      } else {
        round.categories.push(newCat);
      }
    }

    await round.save();
    console.log(`Successfully appended questions to round: ${roundId}`);
  } catch (err) {
    console.error("Error appending questions:", err);
    throw err;
  }
};
