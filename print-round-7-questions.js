import mongoose from "mongoose";
import dotenv from "dotenv";
import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";

dotenv.config({ path: "./src/.env.local" });

const run = async () => {
  await connectDb();
  const InterviewRound = getInterviewModel();
  const round = await InterviewRound.findOne({ roundId: 'round-7' });
  if (!round) {
    console.log("Not found");
    process.exit(1);
  }
  let questions = [];
  for (const cat of round.categories) {
    for (const q of cat.questions) {
      questions.push(q.question);
    }
  }
  console.log(JSON.stringify(questions, null, 2));
  process.exit(0);
};

run();
