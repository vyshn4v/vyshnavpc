import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-advanced-transactions",
    title: "46. Advanced Transaction Management & Isolation Anomalies",
    order: 46,
    content: `### 1. Conceptual Overview
Transactions guarantee ACID properties. Advanced anomalies such as serialization anomalies, phantom reads, and write skew require an intimate understanding of isolation levels.

### 2. Architecture & Mechanics
PostgreSQL implements MVCC (Multi-Version Concurrency Control) using hidden system columns (\`xmin\`, \`xmax\`). Predicate locking is used to enforce the SERIALIZABLE isolation level without relying solely on traditional row or page locks.

### 3. Implementation: Standard vs Optimized
Standard implementation relies on \`READ COMMITTED\` and application-level checks. The optimized approach involves explicitly tuning queries to use \`SERIALIZABLE\` with retry logic for write-heavy workloads, eliminating application-level race conditions.

### 4. Trade-offs & Complexity
Serializable transactions offer perfect consistency and simpler application logic but introduce overhead, predicate lock memory pressure, and the absolute requirement to implement serialization abort retry logic.`,
    interviewQuestions: [
      { question: "What is a serialization anomaly?", answer: "An anomaly where the outcome of concurrent transactions cannot be reproduced by any serial execution." },
      { question: "How does Postgres handle repeatable read?", answer: "It guarantees that a transaction sees a snapshot of the database from the moment the transaction started, preventing non-repeatable reads." },
      { question: "Explain xmin and xmax.", answer: "They track the transaction IDs that created and deleted the row versions, which is essential for MVCC." },
      { question: "What is write skew?", answer: "A concurrency anomaly where two concurrent transactions read overlapping data sets, make decisions based on the read, and write disjoint updates, resulting in an inconsistent state." },
      { question: "How does Postgres prevent dirty reads?", answer: "By using MVCC, reading transactions only see data from transactions that have fully committed." }
    ],
    practicalTask: {
      scenario: "Setting isolation levels.",
      task: "Begin a serializable transaction.",
      solutionCode: "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;"
    }
  },
  {
    slug: "pg-wal-checkpoints",
    title: "47. Low-level WAL & Checkpoint Tuning",
    order: 47,
    content: `### 1. Conceptual Overview
Write-Ahead Logging (WAL) ensures data integrity by logging changes before they are written to the main database files. Checkpoints control how often memory buffers are synced to disk.

### 2. Architecture & Mechanics
All modifications are sequentially appended to WAL files. A checkpoint flushes dirty buffers to disk, allowing old WAL files to be recycled. This mechanism ensures crash recovery without losing committed transactions.

### 3. Implementation: Standard vs Optimized
Standard tuning uses default 1GB max WAL size and 5-minute checkpoint timeouts. Optimized tuning for write-heavy systems might increase \`max_wal_size\` to 16GB+ and \`checkpoint_timeout\` to 15-30 minutes, spreading out the I/O using \`checkpoint_completion_target\`.

### 4. Trade-offs & Complexity
Larger WAL sizes and longer checkpoint intervals reduce steady-state I/O load significantly but result in longer crash recovery times and require more disk space for WAL retention.`,
    interviewQuestions: [
      { question: "What is the primary purpose of Write-Ahead Logging (WAL)?", answer: "To ensure durability of transactions and enable crash recovery without the cost of writing data pages to disk on every commit." },
      { question: "How does checkpointing relate to WAL?", answer: "Checkpoints flush dirty pages to disk, determining the starting point in the WAL for crash recovery." },
      { question: "What is full_page_writes?", answer: "A setting that writes the entire content of a disk page to WAL during the first modification after a checkpoint, preventing torn pages." },
      { question: "How can you monitor checkpoint frequency?", answer: "By examining the pg_stat_bgwriter view and enabling log_checkpoints in the configuration." },
      { question: "What happens if checkpoint_completion_target is too low?", answer: "The checkpoint I/O will be aggressively pushed to disk, potentially causing I/O spikes and degraded query performance." }
    ],
    practicalTask: {
      scenario: "Checking background writer stats.",
      task: "Query the pg_stat_bgwriter to see checkpoint counts.",
      solutionCode: "SELECT checkpoints_timed, checkpoints_req FROM pg_stat_bgwriter;"
    }
  },
  {
    slug: "pg-vacuum-fsm",
    title: "48. High-Performance Vacuuming & XID Wraparound Avoidance",
    order: 48,
    content: `### 1. Conceptual Overview
Because of MVCC, UPDATEs and DELETEs leave dead tuples behind. Vacuuming reclaims this space, updates data statistics, and prevents transaction ID (XID) wraparound failure.

### 2. Architecture & Mechanics
The autovacuum daemon continuously scans for tables needing maintenance based on threshold formulas. The Free Space Map (FSM) tracks available space in relation blocks, and the Visibility Map (VM) tracks pages containing only visible tuples to speed up index-only scans.

### 3. Implementation: Standard vs Optimized
The standard autovacuum runs sequentially with default thresholds. Optimized configurations use multiple autovacuum workers, aggressive scale-factor tuning for large tables, and increased \`maintenance_work_mem\` to avoid multiple passes over indexes.

### 4. Trade-offs & Complexity
Aggressive vacuuming consumes CPU and I/O resources and can impact foreground queries. However, neglecting it leads to catastrophic table bloat, slow sequential scans, and eventual system halting due to XID wraparound.`,
    interviewQuestions: [
      { question: "What is Transaction ID (XID) wraparound?", answer: "A catastrophic event where the 32-bit transaction ID counter wraps around, causing old, valid data to appear as if it is in the future and thus invisible." },
      { question: "How does the Free Space Map (FSM) work?", answer: "It is a data structure used to quickly locate pages with enough free space to accommodate new tuples, avoiding exhaustive table scans." },
      { question: "What is the Visibility Map (VM) used for?", answer: "It keeps track of pages where all tuples are known to be visible to all active transactions, enabling index-only scans." },
      { question: "Why might a table experience severe bloat despite autovacuum?", answer: "Long-running transactions holding old snapshots prevent autovacuum from removing dead tuples." },
      { question: "How can you manually freeze tuples?", answer: "By running the VACUUM FREEZE command on the table." }
    ],
    practicalTask: {
      scenario: "Analyzing table bloat.",
      task: "Run a verbose vacuum analyze on the users table.",
      solutionCode: "VACUUM (VERBOSE, ANALYZE) users;"
    }
  },
  {
    slug: "pg-geqo-planner",
    title: "49. Advanced Query Planning & GEQO",
    order: 49,
    content: `### 1. Conceptual Overview
The PostgreSQL query planner evaluates multiple execution strategies to find the optimal path. For queries with numerous joins, exhaustive search becomes computationally impossible, triggering the Genetic Query Optimizer (GEQO).

### 2. Architecture & Mechanics
The standard planner uses dynamic programming to construct and cost join trees. When the number of joined relations exceeds \`geqo_threshold\` (default 12), GEQO employs a randomized genetic algorithm to explore a subset of the search space, evaluating fitness based on standard cost estimations.

### 3. Implementation: Standard vs Optimized
Standard implementations let the planner dictate join order. Optimized approaches for complex analytics involve tuning \`join_collapse_limit\`, rewriting queries using Common Table Expressions (CTEs) as optimization fences (prior to PG 12), or carefully setting \`geqo_effort\`.

### 4. Trade-offs & Complexity
GEQO prevents planning time from growing exponentially for complex queries, but its non-deterministic nature means execution plans might vary between identical queries. Forcing join orders guarantees stability but removes the planner's ability to adapt to changing statistics.`,
    interviewQuestions: [
      { question: "What is GEQO in PostgreSQL?", answer: "Genetic Query Optimizer, a randomized heuristic search algorithm used to plan queries with many joins where dynamic programming is too slow." },
      { question: "What does join_collapse_limit do?", answer: "It limits the number of explicit JOIN constructs the planner will flatten into a list of items to be freely reordered." },
      { question: "How does the planner estimate query costs?", answer: "By combining table statistics (like row counts and histograms) with cost constants (like seq_page_cost and cpu_tuple_cost)." },
      { question: "What is a Nested Loop join?", answer: "A join algorithm where for every row in the outer relation, the inner relation is scanned for matching rows." },
      { question: "How can you force the planner to use a specific join order?", answer: "By setting join_collapse_limit = 1 and structuring the query with explicit JOIN clauses." }
    ],
    practicalTask: {
      scenario: "Inspecting query plans.",
      task: "View the execution plan with execution buffers and timings.",
      solutionCode: "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users;"
    }
  },
  {
    slug: "pg-bdr-sharding",
    title: "50. Extreme Scaling: Sharding, Citus & BDR",
    order: 50,
    content: `### 1. Conceptual Overview
When a single PostgreSQL instance cannot handle the data volume or write throughput, the database must be horizontally scaled using sharding or distributed multi-master replication architectures.

### 2. Architecture & Mechanics
Extensions like Citus use a coordinator node to distribute queries across multiple worker nodes holding shards of the data. Bi-Directional Replication (BDR) enables multi-master architectures using logical replication and conflict resolution algorithms.

### 3. Implementation: Standard vs Optimized
Standard scaling relies on vertical scaling and read replicas. Optimized distributed systems partition tables based on a distribution key (e.g., tenant_id in a multi-tenant SaaS) to colocate related data on the same shard, minimizing cross-node network traffic.

### 4. Trade-offs & Complexity
Distributed architectures introduce immense operational complexity, distributed transaction overhead (two-phase commit), limitations on cross-shard joins or constraints, and complex disaster recovery procedures compared to a monolithic database.`,
    interviewQuestions: [
      { question: "What is a distribution column in Citus?", answer: "The column used to partition table rows across multiple worker nodes, determining data colocation." },
      { question: "What is Bi-Directional Replication (BDR)?", answer: "A multi-master replication technology for Postgres that allows writes on multiple nodes with asynchronous replication and conflict resolution." },
      { question: "What is two-phase commit (2PC)?", answer: "A distributed algorithm that coordinates all the processes that participate in a distributed atomic transaction on whether to commit or abort." },
      { question: "Why is colocation important in sharding?", answer: "It ensures that related data resides on the same node, allowing joins to be executed locally without moving large amounts of data across the network." },
      { question: "What are the limitations of multi-master replication?", answer: "Increased latency for synchronous conflict resolution, or eventual consistency and complex conflict handling in asynchronous setups." }
    ],
    practicalTask: {
      scenario: "Creating a distributed table (Citus context).",
      task: "Create a distributed table using tenant_id as the distribution column.",
      solutionCode: "SELECT create_distributed_table('users', 'tenant_id');"
    }
  }
];

appendTopics('postgres', 'PostgreSQL Masterclass', '...', topics)
  .then(() => console.log('Part 10 seeded!'))
  .catch(err => console.error(err));
