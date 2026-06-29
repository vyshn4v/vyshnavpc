import { appendQuestions } from './appendQuestions.js';

const categoriesArray = [
  {
    categoryName: "Advanced Leadership Scenarios",
    questions: [
      {
        difficulty: "Expert",
        question: "Describe a situation where your technical vision fundamentally contradicted the CTO's architectural mandate, yet you knew their approach would lead to systemic failure. How did you handle the situation, and what was the outcome?",
        expectedAnswer: "Look for strategic communication, data-driven argumentation, and emotional intelligence. The candidate should have built a proof-of-concept or presented risk analysis rather than just arguing. The outcome should highlight a constructive resolution.",
        redFlags: ["Arrogance or 'I told you so' attitude", "Undermining leadership behind their back", "Yielding completely without voicing valid concerns"],
        bonusPoints: ["Documenting the risks in a formal risk registry", "Creating an alternative proposal that compromised to meet business goals"]
      },
      {
        difficulty: "Expert",
        question: "You inherit a high-performing team but soon discover a critical 'brilliant jerk' who delivers 50% of the team's output but constantly sabotages psychological safety. The company relies on their knowledge for an upcoming critical launch. Walk me through your action plan.",
        expectedAnswer: "Candidate must balance short-term delivery risk with long-term cultural health. Immediate boundaries set for behavior, parallel knowledge transfer/silo-breaking, and willingness to let the person go if behavior doesn't change, even if it delays the launch.",
        redFlags: ["Protecting the toxic employee for the sake of the project", "Firing immediately without a transition plan", "Ignoring the impact on the rest of the team"],
        bonusPoints: ["Implementing pair programming to distribute the knowledge", "Quantifying the attrition risk/cost of keeping the toxic behavior"]
      },
      {
        difficulty: "Hard",
        question: "Tell me about a time you had to reverse a major technical decision that you yourself fiercely advocated for, after realizing it was the wrong path months into implementation.",
        expectedAnswer: "Candidate takes extreme ownership. They explain how they identified the flaw (new data, changing constraints), how they communicated the pivot to stakeholders without losing trust, and what post-mortem lessons were learned.",
        redFlags: ["Blaming shifting requirements or other teams", "Sunk cost fallacy (riding it out to avoid embarrassment)", "Downplaying the cost of the reversal"],
        bonusPoints: ["Using the failure to implement better technical design review processes (e.g., RFCs)"]
      },
      {
        difficulty: "Hard",
        question: "A critical project is three weeks behind schedule, and the business demands you push the team to work weekends. You know the team is already on the verge of burnout. How do you negotiate with the business to protect your team while delivering value?",
        expectedAnswer: "Negotiating scope over timeline. Candidate should push back on the timeline by offering to cut non-critical features, proposing phased rollouts, and clearly communicating the ROI of an un-burned-out team.",
        redFlags: ["Blindly forcing the team to work weekends", "Refusing completely without offering alternative solutions", "Passive-aggressive communication with stakeholders"],
        bonusPoints: ["Using historical velocity data to prove weekends yield diminishing returns"]
      }
    ]
  },
  {
    categoryName: "Complex Project Failures",
    questions: [
      {
        difficulty: "Expert",
        question: "Walk me through the most catastrophic production outage you were directly responsible for. Don't gloss over the details. What exactly did you break, how long was it down, and what was the systemic fix?",
        expectedAnswer: "Detailed technical breakdown of the outage, immediate mitigation steps, and the blameless post-mortem process. The candidate must own the mistake and explain the architectural or process guardrails put in place (e.g., automated canary rollouts) to prevent recurrence.",
        redFlags: ["Deflecting blame to QA or devops", "Vague descriptions of the outage", "The 'fix' was just 'being more careful next time'"],
        bonusPoints: ["Implementing chaos engineering following the incident"]
      },
      {
        difficulty: "Hard",
        question: "Describe a time when you successfully delivered a project exactly to spec, on time, and on budget, but it completely failed to achieve its business objectives. What did you learn?",
        expectedAnswer: "Focus on the disconnect between engineering output and product/business value. The candidate should discuss learning to ask 'why' earlier in the lifecycle and becoming more involved in product discovery and user metrics.",
        redFlags: ["'Not my problem, I just write code'", "Blaming the product manager entirely", "Lack of reflection on how engineering can validate assumptions"],
        bonusPoints: ["Instituting a lean prototyping phase in future projects"]
      },
      {
        difficulty: "Expert",
        question: "Have you ever had to pull the plug on a project that consumed months of engineering effort? How did you justify the sunken cost to the team and keep morale high?",
        expectedAnswer: "Objective evaluation of the project's viability. Honest and transparent communication with the team, framing the cancellation as a positive business decision rather than a failure of execution, and celebrating the learnings.",
        redFlags: ["Letting a failing project zombie along indefinitely", "Hiding the true reasons for cancellation from the team"],
        bonusPoints: ["Reusing components or infrastructure from the cancelled project to accelerate others"]
      },
      {
        difficulty: "Hard",
        question: "Tell me about a legacy system modernization project you led that failed or went significantly over budget. What were the hidden complexities that you underestimated?",
        expectedAnswer: "Insight into the realities of working with legacy code (undocumented business logic, lack of tests, hidden dependencies). A realistic assessment of the 'Strangler Fig' pattern versus the 'Big Bang' rewrite.",
        redFlags: ["Underestimating legacy systems as just 'bad code'", "Believing a complete rewrite was the only option without justification"],
        bonusPoints: ["Implementing contract testing to ensure parity between old and new systems"]
      }
    ]
  },
  {
    categoryName: "Ethical Dilemmas in Engineering",
    questions: [
      {
        difficulty: "Expert",
        question: "You discover that a senior executive is quietly bypassing data privacy protocols (e.g., GDPR/CCPA compliance) to accelerate a feature launch, exposing user data. You brought it up, but were told to drop it. What is your next move?",
        expectedAnswer: "Escalation to legal/compliance or the whistleblowing hotline. The candidate should demonstrate an understanding of their ethical and legal responsibility over blind obedience to the chain of command.",
        redFlags: ["Following orders without written record", "Dropping the issue completely", "Threatening the executive publicly"],
        bonusPoints: ["Documenting the non-compliance technically (e.g., leaving an audit trail) while escalating properly"]
      },
      {
        difficulty: "Hard",
        question: "Your team is building an algorithmic feature, and you realize the training data introduces a severe bias against a minority demographic, but fixing it will delay the launch by a quarter. How do you handle this?",
        expectedAnswer: "Immediate escalation of the risk. Candidate must advocate for fairness, offering solutions like launching with a restricted scope or warning labels, rather than launching a harmful feature.",
        redFlags: ["Launching anyway because 'it's just an MVP'", "Ignoring the bias because it doesn't affect the core demographic"],
        bonusPoints: ["Proposing an automated fairness evaluation framework for future models"]
      },
      {
        difficulty: "Hard",
        question: "You are asked to implement a 'dark pattern' in the UI designed to trick users into subscribing to an expensive tier they likely don't need. How do you push back?",
        expectedAnswer: "Using data to show that dark patterns increase churn, chargebacks, and customer support costs over time, arguing for long-term customer LTV over short-term conversion spikes.",
        redFlags: ["Refusing aggressively without a business argument", "Implementing it without question"],
        bonusPoints: ["Designing an A/B test comparing the dark pattern with an honest, value-driven upsell to prove the latter works better long-term"]
      }
    ]
  },
  {
    categoryName: "Deep Dive: Resume Ambiguities",
    questions: [
      {
        difficulty: "Hard",
        question: "Your resume states you 'architected a microservices migration'. Many candidates claim this when they just wrote one service. Precisely what was your role in defining the domain boundaries, inter-service communication protocols, and handling distributed transactions?",
        expectedAnswer: "Specifics on domain-driven design, event-driven architecture (Kafka/RabbitMQ), saga patterns or two-phase commits. The candidate should quickly move from high-level buzzwords to concrete architectural decisions they owned.",
        redFlags: ["Inability to explain how services communicated", "Brushing off data consistency (e.g., 'we just used REST')"],
        bonusPoints: ["Discussing the organizational impact (Conway's Law) of the migration"]
      },
      {
        difficulty: "Expert",
        question: "You mention 'scaling the application to handle 10x traffic'. Walk me through the exact bottlenecks you hit. What broke first? The database, the network, the compute? How did you profile it?",
        expectedAnswer: "A chronological journey of scaling. Mentioning specific tools (Datadog, New Relic, pprof, EXPLAIN plans). Understanding that scaling is iterative—fixing one bottleneck reveals the next.",
        redFlags: ["Vague answers like 'we added more servers'", "Not knowing what the actual limiting factor was"],
        bonusPoints: ["Explaining how they load tested to find the breaking points before production did"]
      },
      {
        difficulty: "Hard",
        question: "You led a 'complete agile transformation' according to your resume. Agile transformations often fail due to cultural resistance. Who was your biggest detractor, and how did you win them over?",
        expectedAnswer: "Focus on change management. Candidate should describe listening to the detractor's concerns, making incremental changes, and proving value through early wins rather than dogmatic enforcement of Scrum/Kanban rules.",
        redFlags: ["Forcing process on people without buy-in", "Blaming the team for not being 'agile enough'"],
        bonusPoints: ["Adapting the agile framework to fit the team's specific context rather than using out-of-the-box Scrum"]
      },
      {
        difficulty: "Expert",
        question: "Your resume highlights 'reducing cloud costs by 40%'. Was this just right-sizing instances, or did you have to fundamentally re-architect how the application consumed resources? Give me an example of a structural change you made.",
        expectedAnswer: "Moving beyond basic FinOps (reserved instances, auto-scaling) to architectural changes like moving to serverless, rewriting a hot path in a more efficient language, or optimizing database queries to reduce IOPS.",
        redFlags: ["Only mentioning purchasing reserved instances or Savings Plans", "Not knowing the actual dollar amount saved"],
        bonusPoints: ["Implementing cost-visibility tools to make engineers aware of the cost of their code"]
      }
    ]
  }
];

async function run() {
  try {
    console.log("Starting to append questions to round-1...");
    await appendQuestions('round-1', categoriesArray);
    console.log("Successfully appended questions.");
    process.exit(0);
  } catch (error) {
    console.error("Error appending questions:", error);
    process.exit(1);
  }
}

run();
