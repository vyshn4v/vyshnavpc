import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";

dotenv.config({ path: "./src/.env.local" });

export const rewriteAnswers = async (roundId, updatedQuestionsMap) => {
  try {
    await connectDb();
    const InterviewRound = getInterviewModel();
    const round = await InterviewRound.findOne({ roundId });
    if (!round) throw new Error(`Round ${roundId} not found!`);

    for (const category of round.categories) {
      for (const question of category.questions) {
        // The updatedQuestionsMap should be keyed by the exact question text
        if (updatedQuestionsMap[question.question]) {
          question.expectedAnswer = updatedQuestionsMap[question.question];
        }
      }
    }

    await round.save();
    console.log(`Successfully rewrote answers for round: ${roundId}`);
  } catch (err) {
    console.error("Error rewriting answers:", err);
    throw err;
  }
};
