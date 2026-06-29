import getInterviewModel from "./src/schema/interview.js";
import { connectDb } from "./src/config/initializeDevDb.js";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env.local" });

const fetchQuestions = async () => {
    try {
        await connectDb();
        const InterviewRound = getInterviewModel();
        const round = await InterviewRound.findOne({ roundId: 'round-1' });
        if (!round) {
            console.error("Round 1 not found!");
            process.exit(1);
        }

        console.log("=== ROUND 1 QUESTIONS ===");
        round.categories.forEach(cat => {
            cat.questions.forEach(q => {
                console.log(q.question);
            });
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fetchQuestions();
