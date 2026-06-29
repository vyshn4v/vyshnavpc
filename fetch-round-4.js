import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "./src/.env.local" });

async function fetchRound() {
    await connectDb();
    const InterviewRound = getInterviewModel();
    const round = await InterviewRound.findOne({ roundId: 'round-4' });
    if (!round) {
        console.log("Round not found.");
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
    fs.writeFileSync('round-4-questions-utf8.json', JSON.stringify(questions, null, 2), 'utf8');
    process.exit(0);
}

fetchRound().catch(console.error);
