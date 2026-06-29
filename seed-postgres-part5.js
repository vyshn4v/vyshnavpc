import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-transactions",
    title: "21. Transactions (ACID)",
    order: 21,
    content: "<h2>ACID Properties</h2><p>Transactions ensure that multiple operations either all succeed or all fail.</p>",
    interviewQuestions: [
      { question: "What does ACID stand for?", answer: "Atomicity, Consistency, Isolation, Durability." }
    ],
    practicalTask: {
      scenario: "Transferring funds.",
      task: "Start a transaction, update a balance, and commit.",
      solutionCode: "BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;"
    }
  },
  {
    slug: "pg-mvcc",
    title: "22. Multi-Version Concurrency Control (MVCC)",
    order: 22,
    content: "<h2>MVCC</h2><p>Postgres uses MVCC to manage concurrent access without strict locking.</p>",
    interviewQuestions: [
      { question: "How does MVCC avoid locks?", answer: "By keeping multiple versions of a row, allowing readers to read a consistent snapshot without blocking writers." }
    ],
    practicalTask: {
      scenario: "Understanding hidden columns.",
      task: "Select the hidden transaction IDs of a row.",
      solutionCode: "SELECT xmin, xmax, * FROM users;"
    }
  },
  {
    slug: "pg-locking",
    title: "23. Locking Mechanisms",
    order: 23,
    content: "<h2>Locks</h2><p>Table-level and row-level locks prevent concurrent modifications that could cause data corruption.</p>",
    interviewQuestions: [
      { question: "What does SELECT FOR UPDATE do?", answer: "It locks the selected rows, preventing other transactions from modifying them until the current transaction completes." }
    ],
    practicalTask: {
      scenario: "Pessimistic locking.",
      task: "Lock a specific row for an update.",
      solutionCode: "SELECT * FROM users WHERE id = 1 FOR UPDATE;"
    }
  },
  {
    slug: "pg-deadlocks",
    title: "24. Handling Deadlocks",
    order: 24,
    content: "<h2>Deadlocks</h2><p>Occurs when two transactions hold locks that the other needs.</p>",
    interviewQuestions: [
      { question: "How does Postgres resolve deadlocks?", answer: "It automatically detects them, aborts one of the transactions (deadlock timeout), and raises an error." }
    ],
    practicalTask: {
      scenario: "Reviewing deadlock settings.",
      task: "Show the deadlock timeout setting.",
      solutionCode: "SHOW deadlock_timeout;"
    }
  },
  {
    slug: "pg-performance-tuning",
    title: "25. Performance Tuning Basics",
    order: 25,
    content: "<h2>Tuning parameters</h2><p>Adjusting shared_buffers, work_mem, and maintenance_work_mem.</p>",
    interviewQuestions: [
      { question: "What is work_mem used for?", answer: "It specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files." }
    ],
    practicalTask: {
      scenario: "Checking memory allocation.",
      task: "Check the current work_mem value.",
      solutionCode: "SHOW work_mem;"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 5 seeded!'));
