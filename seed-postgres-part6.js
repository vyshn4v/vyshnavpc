import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-explain-analyze",
    title: "26. EXPLAIN and EXPLAIN ANALYZE",
    order: 26,
    content: "<h2>Query Plans</h2><p>EXPLAIN shows the query plan, ANALYZE actually executes it to show real timing.</p>",
    interviewQuestions: [
      { question: "Why should you be careful with EXPLAIN ANALYZE on a DELETE query?", answer: "Because EXPLAIN ANALYZE executes the query, so it will actually delete the data." }
    ],
    practicalTask: {
      scenario: "Analyzing a query.",
      task: "Use EXPLAIN ANALYZE on a simple select.",
      solutionCode: "EXPLAIN ANALYZE SELECT * FROM users WHERE active = true;"
    }
  },
  {
    slug: "pg-vacuuming",
    title: "27. VACUUM and Autovacuum",
    order: 27,
    content: "<h2>Garbage Collection</h2><p>VACUUM reclaims storage occupied by dead tuples from MVCC.</p>",
    interviewQuestions: [
      { question: "What is the difference between VACUUM and VACUUM FULL?", answer: "VACUUM marks space as reusable but doesn't shrink the file, whereas VACUUM FULL rewrites the table, requiring an exclusive lock and reclaiming space to the OS." }
    ],
    practicalTask: {
      scenario: "Manual garbage collection.",
      task: "Run a manual vacuum on the users table.",
      solutionCode: "VACUUM VERBOSE users;"
    }
  },
  {
    slug: "pg-partitioning",
    title: "28. Table Partitioning",
    order: 28,
    content: "<h2>Declarative Partitioning</h2><p>Splitting large logical tables into smaller physical tables (partitions) by range, list, or hash.</p>",
    interviewQuestions: [
      { question: "What is the benefit of partitioning by date?", answer: "It allows for easy archiving and dropping of old data without heavy DELETE operations." }
    ],
    practicalTask: {
      scenario: "Creating a partitioned table.",
      task: "Create a table partitioned by range.",
      solutionCode: "CREATE TABLE measurements (logdate DATE, val INT) PARTITION BY RANGE (logdate);"
    }
  },
  {
    slug: "pg-replication-basics",
    title: "29. Replication Basics (Physical)",
    order: 29,
    content: "<h2>Streaming Replication</h2><p>Postgres supports physical streaming replication by sending WAL records to standbys.</p>",
    interviewQuestions: [
      { question: "What is WAL?", answer: "Write-Ahead Logging; ensuring data integrity by writing changes to a log before they are applied to the database files." }
    ],
    practicalTask: {
      scenario: "Reviewing replication status.",
      task: "Query the stat replication view.",
      solutionCode: "SELECT * FROM pg_stat_replication;"
    }
  },
  {
    slug: "pg-high-availability",
    title: "30. High Availability (HA)",
    order: 30,
    content: "<h2>HA Architecture</h2><p>Using tools like Patroni or Repmgr to manage automatic failover.</p>",
    interviewQuestions: [
      { question: "What is split-brain?", answer: "A scenario where two nodes in a cluster both believe they are the primary, leading to data divergence." }
    ],
    practicalTask: {
      scenario: "Identifying the role.",
      task: "Check if the current database is in recovery (standby mode).",
      solutionCode: "SELECT pg_is_in_recovery();"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 6 seeded!'));
