import { insertRound } from "./insertRound.js";
import mongoose from "mongoose";

const roundData = {
  roundId: 'round-1',
  roundName: 'Round 1: Resume Deep Dive & Behavioral',
  order: 1,
  description: 'Deep dive into past projects, technical impact, conflict resolution, awards, and ownership based on the candidate\'s resume.',
  categories: [
    {
      categoryName: 'Past Projects & Technical Impact (Neutrinos & Domain Scanner)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'In your role at Neutrinos, you architected a dynamic, stage-based decision API. Can you walk me through the specific architectural choices you made to handle complex application state logic and role-specific paths?',
          expectedAnswer: 'Should detail the use of Node.js and Strapi CMS, explain the stage-based state machine, how roles (like Reviewers) were modeled, and how context-awareness was achieved without hardcoding logic.',
          redFlags: ['Inability to explain the state machine', 'Lack of clarity on how roles were separated', 'Mentioning only superficial details without technical depth'],
          bonusPoints: ['Discussed scalability of the API', 'Mentioned specific design patterns used', 'Explained how it improved maintainability']
        },
        {
          difficulty: 'Hard',
          question: 'For the Domain Scanner project, you constructed a distributed architecture using RabbitMQ for background domain analysis. What were the specific challenges you faced regarding asynchronous task processing, and how did you handle task failures or retries?',
          expectedAnswer: 'Should explain the producer-consumer model using RabbitMQ, how domain analysis tasks were queued, handling message acknowledgment, and implementing automated retry logic for scan failures.',
          redFlags: ['Lack of understanding of message queues', 'No strategy for handling failed tasks', 'Vague explanation of distributed architecture'],
          bonusPoints: ['Mentioned dead-letter queues', 'Discussed performance tuning and scaling consumers', 'Explained how Redis was used in conjunction for caching']
        },
        {
          difficulty: 'Medium',
          question: 'You integrated Redis for high-speed caching and PostgreSQL for data persistence in Domain Scanner. How did you decide what data to cache, and how did you handle cache invalidation?',
          expectedAnswer: 'Should provide a clear strategy on caching frequently accessed data (like recent scan reports) while ensuring PostgreSQL remained the source of truth. Must address cache staleness and invalidation strategies.',
          redFlags: ['Caching everything without a strategy', 'No understanding of cache invalidation', 'Inability to explain why Redis was chosen over others'],
          bonusPoints: ['Mentioned specific Redis data structures used', 'Discussed memory management in Redis']
        },
        {
          difficulty: 'Hard',
          question: 'At Neutrinos, you contributed to robust policy lifecycle automation systems for enterprise clients like Sunlife PH. How did you ensure data consistency and reliability in these complex processing workflows?',
          expectedAnswer: 'Should discuss transactional integrity, error handling, ensuring idempotency in API endpoints, and how system communications were reliably automated.',
          redFlags: ['Lack of focus on reliability', 'No mention of database transactions or error recovery', 'Superficial understanding of enterprise requirements'],
          bonusPoints: ['Discussed integration testing for these workflows', 'Mentioned monitoring and alerting for failures']
        },
        {
          difficulty: 'Medium',
          question: 'You utilized Strapi CMS alongside Node.js for 15+ RESTful APIs. What were the trade-offs of using a headless CMS like Strapi versus building the admin and content management from scratch?',
          expectedAnswer: 'Should articulate the speed of development, built-in features of Strapi versus the limitations in flexibility, performance considerations, and how custom logic was integrated into Strapi.',
          redFlags: ['Could not explain the trade-offs', 'Overly reliant on Strapi without understanding its underlying architecture'],
          bonusPoints: ['Discussed custom plugin development in Strapi', 'Explained database querying optimizations within the CMS context']
        }
      ]
    },
    {
      categoryName: 'Behavioral & Conflict Resolution',
      questions: [
        {
          difficulty: 'Medium',
          question: 'Tell me about a time when you disagreed with a senior engineer or product manager on an architectural decision. How did you navigate the conflict, and what was the outcome?',
          expectedAnswer: 'Looking for a situation where they used data/logic to make their case, listened to the other side, and compromised or escalated professionally.',
          redFlags: ['Became defensive or arrogant', 'Yielded immediately without discussion', 'Blamed others for the conflict'],
          bonusPoints: ['Backed up their argument with a PoC (Proof of Concept)', 'Showed empathy towards the other person\'s perspective']
        },
        {
          difficulty: 'Hard',
          question: 'Describe a situation where a critical production issue arose (perhaps related to the "Beyond the Call of Duty" award). How did you manage the stress, coordinate with your team, and resolve the issue?',
          expectedAnswer: 'Should detail the incident response process, how they identified the root cause, the immediate fix versus the long-term solution, and how they communicated with stakeholders.',
          redFlags: ['Panicked or acted impulsively', 'Did not communicate with the team', 'Failed to implement a long-term preventive measure'],
          bonusPoints: ['Led the post-mortem analysis', 'Created new alerts or monitoring based on the incident']
        },
        {
          difficulty: 'Medium',
          question: 'You worked with cross-functional agile teams at Neutrinos. Can you give an example of how you handled a situation where a dependency from another team was blocking your work?',
          expectedAnswer: 'Should explain how they communicated the blocker, collaborated to find a workaround, or adjusted their own priorities while waiting.',
          redFlags: ['Complained without taking action', 'Ignored the blocker and missed deadlines'],
          bonusPoints: ['Helped the other team unblock the dependency', 'Suggested process improvements to avoid future blockers']
        },
        {
          difficulty: 'Medium',
          question: 'Tell me about a time when you had to learn a new technology or framework quickly to deliver a project on time. How did you approach the learning process?',
          expectedAnswer: 'Looking for a structured approach to learning (e.g., reading docs, building small prototypes) while balancing project deadlines.',
          redFlags: ['Refused to learn new tech', 'Got bogged down in theory without delivering practical results'],
          bonusPoints: ['Shared the newly acquired knowledge with the rest of the team', 'Created internal documentation']
        },
        {
          difficulty: 'Medium',
          question: 'Can you describe a time when you received constructive criticism from a peer or manager? How did you respond, and what changes did you make?',
          expectedAnswer: 'Should demonstrate self-awareness, receptiveness to feedback, and concrete actions taken to improve.',
          redFlags: ['Argued with the feedback', 'Made excuses', 'Failed to show actual improvement'],
          bonusPoints: ['Actively sought out follow-up feedback', 'Mentored someone else using the lessons learned']
        }
      ]
    },
    {
      categoryName: 'Awards, Leadership & Ownership',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You received the "Team Player Award" for strong collaboration. Can you share a specific instance where your collaborative efforts directly impacted a critical project deliverable?',
          expectedAnswer: 'Should provide a concrete example of stepping in to help a teammate, facilitating communication, or bridging a gap between different functions.',
          redFlags: ['Vague answer without a specific example', 'Took all the credit for the team\'s success'],
          bonusPoints: ['Mentored junior developers', 'Improved team morale during a difficult phase']
        },
        {
          difficulty: 'Hard',
          question: 'The "Beyond the Call of Duty Award" implies taking ownership beyond your assigned scope. Can you detail the specific production issue you took ownership of, why it was outside your scope, and the steps you took to ensure system uptime?',
          expectedAnswer: 'Should describe a complex issue, why they stepped up (e.g., lack of other resources, critical business impact), and the technical steps taken to resolve and stabilize the system.',
          redFlags: ['The issue wasn\'t actually outside their scope', 'Acted as a "hero" without involving the team when necessary'],
          bonusPoints: ['Documented the fix and trained others', 'Implemented automated recovery mechanisms']
        },
        {
          difficulty: 'Medium',
          question: 'In managing full-cycle production deployments using CI/CD, PM2, and Nginx for Domain Scanner, how did you ensure zero downtime and handle rollbacks if a deployment failed?',
          expectedAnswer: 'Should explain their deployment strategy (e.g., blue-green, rolling updates), how PM2 was utilized for process management, and the steps for reverting bad code.',
          redFlags: ['No strategy for rollbacks', 'Manual deployments without automation', 'Lack of understanding of Nginx load balancing'],
          bonusPoints: ['Implemented health checks and automated rollbacks', 'Discussed infrastructure as code']
        },
        {
          difficulty: 'Hard',
          question: 'Given your experience with Docker and Kubernetes, how would you approach migrating a legacy monolithic application to a microservices architecture hosted on Kubernetes? What would be your first steps?',
          expectedAnswer: 'Should outline a phased approach (strangler fig pattern), containerizing the monolith first, identifying bounded contexts, setting up CI/CD, and addressing data management challenges.',
          redFlags: ['Suggesting a complete rewrite from scratch without justification', 'Ignoring data migration and database decoupling'],
          bonusPoints: ['Mentioned service mesh or API gateways', 'Discussed cultural shifts required in the team']
        },
        {
          difficulty: 'Medium',
          question: 'As a backend-focused engineer, how do you ensure that the APIs you design are developer-friendly and easy for the frontend team to consume?',
          expectedAnswer: 'Should mention clear documentation (Swagger/OpenAPI), consistent naming conventions, proper error handling and status codes, and versioning.',
          redFlags: ['Dismissing frontend needs', 'Lack of standardized error formats'],
          bonusPoints: ['Involving frontend engineers in the API design phase', 'Providing SDKs or client libraries']
        }
      ]
    }
  ]
};

const run = async () => {
  try {
    await insertRound(roundData);
    console.log("Seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

run();
