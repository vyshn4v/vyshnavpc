import { appendQuestions } from "./appendQuestions.js";

const categoriesArray = [
  {
    categoryName: "Redis: Persistence vs. Memory Strategies",
    questions: [
      {
        difficulty: "Hard",
        question: "How do you choose between RDB and AOF in Redis for a high-write throughput cache that occasionally needs disaster recovery?",
        expectedAnswer: "RDB provides point-in-time snapshots and is faster for disaster recovery but risks data loss between snapshots. AOF logs every write, ensuring high durability but can grow large and slow down restarts. For high-write throughput with occasional DR, a hybrid approach (Redis 4.0+) using RDB snapshots with AOF incremental logging is optimal.",
        redFlags: ["Recommends pure AOF with 'always' fsync for high-write scenarios (will kill performance)", "Doesn't know what AOF means"],
        bonusPoints: ["Mentions hybrid persistence", "Discusses AOF rewrite mechanisms and background forks (BGSAVE)"]
      },
      {
        difficulty: "Expert",
        question: "Explain what happens when Redis runs out of memory, and how different eviction policies affect a distributed lock implementation.",
        expectedAnswer: "When maxmemory is reached, Redis relies on the configured maxmemory-policy. If set to noeviction, writes fail. If set to volatile-lru or allkeys-lru, Redis evicts keys. For distributed locks, an eviction policy like allkeys-lru can disastrously evict active lock keys, causing mutual exclusion failures. Locks should have explicit TTLs and ideally reside on a Redis instance configured with noeviction or volatile-* (where locks have expires).",
        redFlags: ["Believes Redis magically scales memory indefinitely", "Doesn't realize allkeys-lru can delete active locks"],
        bonusPoints: ["Mentions Redis Redlock algorithm", "Understands noeviction is safer for lock stores"]
      },
      {
        difficulty: "Hard",
        question: "How does Redis replication handle network partitions, and what is the role of the repl-backlog-size?",
        expectedAnswer: "During a temporary network partition, the master queues commands in the replication backlog buffer. When the replica reconnects, it attempts a partial resynchronization (PSYNC). If the downtime is too long and the backlog buffer overflows, a full resynchronization (full snapshot transfer) is triggered, which is very I/O intensive. Tuning `repl-backlog-size` based on expected disconnect times prevents full syncs.",
        redFlags: ["Thinks replicas always do full syncs on reconnect", "Unaware of the replication backlog buffer"],
        bonusPoints: ["Calculates backlog size based on write velocity (e.g., bytes/sec * max disconnect time)"]
      }
    ]
  },
  {
    categoryName: "MongoDB: Advanced Sharding & Keys",
    questions: [
      {
        difficulty: "Hard",
        question: "What are the consequences of choosing a monotonically increasing field (like an ObjectId or timestamp) as a MongoDB shard key?",
        expectedAnswer: "A monotonically increasing shard key routes all new inserts to a single chunk on a single shard. This creates a hot spot, eliminating the write-scaling benefits of sharding. The cluster will constantly have to rebalance chunks to other shards, leading to massive background I/O overhead. A hashed shard key or a compound key should be used instead for write distribution.",
        redFlags: ["Thinks ObjectId is a good shard key because it's unique", "Fails to mention hot-spotting"],
        bonusPoints: ["Suggests using a hashed shard key", "Explains chunk migrations and jumbo chunks"]
      },
      {
        difficulty: "Expert",
        question: "How would you design a MongoDB shard key for a multi-tenant SaaS application where some tenants have 100x more data than others?",
        expectedAnswer: "A simple tenant_id shard key will lead to jumbo chunks (chunks that exceed the maximum size and cannot be split or migrated) for massive tenants. A compound shard key like `{ tenant_id: 1, document_id: 1 }` or `{ tenant_id: 1, created_at: 1 }` ensures data for a single tenant is distributed across multiple chunks, while still allowing targeted queries if tenant_id is provided.",
        redFlags: ["Recommends only tenant_id, ignoring jumbo chunk risks", "Suggests a completely random key, breaking query routing"],
        bonusPoints: ["Mentions Jumbo Chunks explicitly", "Discusses targeted vs. scatter-gather queries"]
      },
      {
        difficulty: "Hard",
        question: "Explain the role of the mongos router in a sharded cluster and what happens if a query doesn't include the shard key.",
        expectedAnswer: "The mongos router acts as an interface between the application and the shards, caching metadata from the config servers to route queries. If a query does not include the shard key, the mongos must perform a 'scatter-gather' query, broadcasting the request to all shards and merging the results. This is inefficient and scales poorly.",
        redFlags: ["Doesn't know what mongos is", "Thinks scatter-gather queries are cheap"],
        bonusPoints: ["Explains how mongos caches routing tables", "Mentions the impact of scatter-gather on cluster throughput"]
      }
    ]
  },
  {
    categoryName: "PostgreSQL: MVCC & Concurrency",
    questions: [
      {
        difficulty: "Hard",
        question: "What is MVCC (Multi-Version Concurrency Control) in Postgres, and what is the 'bloat' problem associated with it?",
        expectedAnswer: "MVCC allows multiple transactions to access the database concurrently without locking, by creating new versions of rows on update/delete (dead tuples) rather than overwriting them in place. The 'bloat' problem occurs when dead tuples accumulate faster than the AUTOVACUUM process can clean them up, wasting disk space and slowing down sequential scans.",
        redFlags: ["Confuses MVCC with simple row-level locking", "Unaware of VACUUM/AUTOVACUUM"],
        bonusPoints: ["Explains that Postgres uses transaction IDs (XIDs) for visibility", "Mentions xid wraparound"]
      },
      {
        difficulty: "Expert",
        question: "How does Postgres transaction ID (XID) wraparound happen, and what are the catastrophic consequences if not monitored?",
        expectedAnswer: "Postgres XIDs are 32-bit integers (~4 billion transactions). To allow infinite transactions, XIDs wrap around, with half the ID space considered 'past' and half 'future'. Vacuuming 'freezes' old tuples to make them permanently visible. If autovacuum fails to keep up and wraparound occurs without freezing, old data suddenly appears to be in the 'future' and becomes invisible (data loss from the application's perspective). The database will forcefully shut down to prevent this if it gets too close.",
        redFlags: ["Never heard of XID wraparound", "Thinks it's a minor performance issue"],
        bonusPoints: ["Mentions 'frozen' transaction IDs (FrozenXID)", "Knows the exact 2 billion transaction threshold"]
      },
      {
        difficulty: "Hard",
        question: "Explain the difference between Read Committed and Serializable isolation levels in PostgreSQL, and how Serializable prevents Phantom Reads.",
        expectedAnswer: "Read Committed (the default) sees only data committed before the query started. Serializable guarantees that concurrent transactions yield the same result as if executed sequentially. Postgres implements Serializable using Serializable Snapshot Isolation (SSI), which tracks read/write dependencies (predicate locks) and aborts transactions that would violate serializability (e.g., preventing phantom reads where new rows appear in a range query).",
        redFlags: ["Thinks Serializable locks the entire table", "Doesn't know default isolation level is Read Committed"],
        bonusPoints: ["Mentions Serializable Snapshot Isolation (SSI)", "Explains that application must retry aborted serializable transactions"]
      }
    ]
  },
  {
    categoryName: "Database: Connection Pooling Limits",
    questions: [
      {
        difficulty: "Medium",
        question: "Why should you use a connection pooler like PgBouncer instead of having your application servers connect directly to PostgreSQL?",
        expectedAnswer: "Postgres spawns a new OS process (not a lightweight thread) for every connection, consuming significant memory (often 10MB+ per connection) and CPU for context switching. Connection poolers multiplex thousands of application connections onto a small number of actual database connections, preventing memory exhaustion and connection limit errors.",
        redFlags: ["Thinks Postgres connections are cheap threads", "Recommends just increasing max_connections to 10,000"],
        bonusPoints: ["Distinguishes between session-level and transaction-level pooling in PgBouncer", "Mentions process vs thread architecture in Postgres"]
      },
      {
        difficulty: "Hard",
        question: "What is 'connection starvation' in a microservices architecture, and how can max connection limits cascade into a full system outage?",
        expectedAnswer: "If multiple microservices share a database without centralized pooling, a traffic spike in one service can consume all available database connections. Other services attempting to connect will time out. If services wait indefinitely or lack circuit breakers, thread pools on the app side exhaust, causing cascading timeouts and a full system outage.",
        redFlags: ["Fails to see the cascading nature of timeouts", "Suggests just adding more DB instances without fixing pooling"],
        bonusPoints: ["Mentions Circuit Breakers", "Discusses application-side vs database-side connection timeouts"]
      },
      {
        difficulty: "Expert",
        question: "In a Node.js serverless environment (like AWS Lambda) connecting to an RDS instance, how do you handle connection pooling?",
        expectedAnswer: "Serverless functions are ephemeral and scale out rapidly, creating massive numbers of concurrent direct connections that easily overwhelm RDS. Standard in-memory poolers (like node-postgres pool) reset per container. The solution is using an external proxy like AWS RDS Proxy or PgBouncer, which maintains long-lived DB connections while Lambda functions rapidly connect/disconnect to the proxy.",
        redFlags: ["Thinks standard `pg.Pool` inside a Lambda solves the problem", "Unaware of Lambda scaling behavior destroying DB connections"],
        bonusPoints: ["Mentions AWS RDS Proxy specifically", "Understands zombie connections from frozen Lambda environments"]
      }
    ]
  },
  {
    categoryName: "Message Queues: Dead-Letter Routing",
    questions: [
      {
        difficulty: "Medium",
        question: "What is a Dead Letter Queue (DLQ) and what specific scenarios should trigger a message being routed there?",
        expectedAnswer: "A DLQ is a secondary queue for messages that cannot be successfully processed. Messages should be routed there after exceeding a maximum retry count, if the message payload is malformed (poison pill), or if the message TTL expires. It prevents unprocessable messages from indefinitely blocking the main queue.",
        redFlags: ["Thinks DLQs are for deleted/archived data", "Doesn't mention retry limits or poison pills"],
        bonusPoints: ["Mentions manual inspection and replay strategies from the DLQ"]
      },
      {
        difficulty: "Hard",
        question: "How do you handle a 'poison pill' message that crashes the consumer process every time it is parsed?",
        expectedAnswer: "A poison pill crashes the consumer before it can explicitly NACK or track the retry count. The message broker detects the disconnect, assumes failure, and redelivers the message to another consumer, crashing it too. To fix this, brokers (like RabbitMQ) track delivery attempts at the broker level, or applications must use strict schema validation before processing to catch bad payloads. The broker then routes it to a DLQ after N failed deliveries.",
        redFlags: ["Assumes the consumer can cleanly catch an OutOfMemory or segfault error", "Doesn't understand why redelivery loops happen"],
        bonusPoints: ["Mentions broker-side delivery counts", "Discusses schema registries or edge validation"]
      },
      {
        difficulty: "Expert",
        question: "Design an automated replay mechanism for a DLQ where messages failed due to a temporary downstream API outage.",
        expectedAnswer: "Messages in the DLQ should include metadata about the failure reason and original timestamp. An automated system (or cron job) reads the DLQ. If the failure was '503 Downstream Unavailable', it can hold the messages and replay them into a 'retry' exchange with exponential backoff, or push them back to the main queue once the downstream API health check passes. Non-transient errors (like 400 Bad Request) stay in the DLQ for manual intervention.",
        redFlags: ["Replays all DLQ messages immediately without checking why they failed", "Creates an infinite loop by not capping replay attempts"],
        bonusPoints: ["Distinguishes between transient and non-transient errors", "Mentions exponential backoff and jitter for replays"]
      }
    ]
  }
];

const run = async () => {
  try {
    await appendQuestions('round-4', categoriesArray);
    console.log("Finished adding questions.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

run();
