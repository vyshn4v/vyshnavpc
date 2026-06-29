import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";
import fs from "fs";

dotenv.config({ path: "./src/.env.local" });

const fetchRound = async () => {
  try {
    await connectDb();
    const InterviewRound = getInterviewModel();
    const round = await InterviewRound.findOne({ roundId: 'round-2' });
    if (!round) {
      console.log('Round not found');
      process.exit(1);
    }

    const questions = [];
    round.categories.forEach(category => {
      category.questions.forEach(q => {
        questions.push({
          question: q.question,
          answer: q.expectedAnswer
        });
      });
    });
    fs.writeFileSync('questions.json', JSON.stringify(questions, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fetchRound();
