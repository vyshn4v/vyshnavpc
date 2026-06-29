import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";

dotenv.config({ path: "./src/.env.local" });

const fetchRound = async () => {
  try {
    await connectDb();
    const InterviewRound = getInterviewModel();
    const round = await InterviewRound.findOne({ roundId: 'round-3' });
    if (!round) {
      console.log('Round not found');
      process.exit(1);
    }
    const questions = [];
    for (const category of round.categories) {
      for (const question of category.questions) {
        questions.push({
          question: question.question,
          expectedAnswer: question.expectedAnswer
        });
      }
    }
    console.log(JSON.stringify(questions, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fetchRound();
