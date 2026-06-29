import { connectDb } from "./src/config/initializeDevDb.js";
import getInterviewModel from "./src/schema/interview.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "./src/.env.local" });

const fetchRound5 = async () => {
    try {
        await connectDb();
        const InterviewRound = getInterviewModel();
        const round = await InterviewRound.findOne({ roundId: 'round-5' });
        if (!round) {
            console.log('Round 5 not found');
            process.exit(1);
        }

        const questionsMap = {};
        for (const category of round.categories) {
            for (const question of category.questions) {
                questionsMap[question.question] = question.expectedAnswer;
            }
        }
        
        fs.writeFileSync('round-5-data.json', JSON.stringify(questionsMap, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fetchRound5();
