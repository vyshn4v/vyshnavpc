import { insertRound } from './insertRound.js';

const roundData = {
  roundId: 'round-4',
  roundName: 'Round 4: Database & Caching',
  order: 4,
  description: 'Deep dive into database architecture, caching strategies, and distributed task queues based on the candidate\'s experience with MongoDB, PostgreSQL, Redis, and RabbitMQ.',
  categories: [
    {
      categoryName: 'MongoDB Aggregation & Indexing',
      questions: [
        {
          difficulty: 'Medium',
          question: 'How do you handle schema design in MongoDB for a highly read-intensive application vs a write-intensive one?',
          expectedAnswer: 'For read-intensive, data should be embedded to avoid multiple queries (denormalization). For write-intensive, referencing (normalization) is preferred to avoid redundant updates. Indexes should be heavily used for reads but minimized for writes to reduce overhead.',
          redFlags: ['Suggests normalizing everything like a relational DB', 'Does not mention the impact of indexes on write performance'],
          bonusPoints: ['Mentions materialized views or pre-computed fields for heavy reads']
        },
        {
          difficulty: 'Hard',
          question: 'Can you explain the ESR (Equality, Sort, Range) rule for creating compound indexes in MongoDB?',
          expectedAnswer: 'The ESR rule dictates the order of fields in a compound index: First, fields queried for Equality; Second, fields used for Sorting; Third, fields queried for a Range. This ensures the index can be fully utilized to filter, sort, and scan efficiently.',
          redFlags: ['Unaware of index field ordering impacts', 'Confuses sort and range priorities'],
          bonusPoints: ['Provides a real-world example of optimizing a slow query using the ESR rule']
        },
        {
          difficulty: 'Hard',
          question: 'Can you explain a complex aggregation pipeline you have built? How did you optimize it?',
          expectedAnswer: 'Should describe a multi-stage pipeline (e.g., $match, $lookup, $unwind, $group). Optimization includes placing $match and $project early in the pipeline to reduce the working set size, and ensuring indexes are used in the initial $match stage.',
          redFlags: ['Cannot explain pipeline stages', 'Places $match after expensive operations like $lookup without a valid reason'],
          bonusPoints: ['Mentions memory limits of aggregation pipelines and the use of allowDiskUse']
        },
        {
          difficulty: 'Medium',
          question: 'How do you approach data modeling for 1-to-many relationships in MongoDB? When would you use referencing versus embedding?',
          expectedAnswer: 'Embedding is used for "few" or bounded relationships where the child data is often retrieved with the parent. Referencing is used for "many" or unbounded relationships to avoid document size limit (16MB) issues and for data that is queried independently.',
          redFlags: ['Always embeds regardless of array growth', 'Always references, losing the benefits of document databases'],
          bonusPoints: ['Mentions the subset pattern (embedding recent items, referencing the rest)']
        },
        {
          difficulty: 'Expert',
          question: 'Describe how to handle transactions in MongoDB. What are the performance implications?',
          expectedAnswer: 'MongoDB supports multi-document ACID transactions via replica sets. They should be used sparingly due to performance overhead and locking. Best practice is to design schemas (like single document updates) to avoid transactions where possible.',
          redFlags: ['States MongoDB does not support transactions', 'Suggests using them everywhere like in SQL'],
          bonusPoints: ['Mentions the 60-second default execution time limit for transactions']
        }
      ]
    },
    {
      categoryName: 'PostgreSQL & Relational Design',
      questions: [
        {
          difficulty: 'Medium',
          question: 'In your "Domain Scanner" project, you used PostgreSQL for persistence. Why did you choose it over MongoDB for this specific use case?',
          expectedAnswer: 'Should highlight PostgreSQL\'s strengths: strong ACID compliance, relational integrity (foreign keys), complex ad-hoc querying via SQL, or perhaps specific data structures required for the risk assessment domain that fit a relational model perfectly.',
          redFlags: ['Vague answers like "it is faster"', 'Cannot articulate a clear distinction between document and relational models'],
          bonusPoints: ['Mentions JSONB support in PostgreSQL allowing for hybrid data models']
        },
        {
          difficulty: 'Hard',
          question: 'Explain how you manage migrations and schema changes in a production PostgreSQL database without downtime.',
          expectedAnswer: 'Involves backward-compatible changes. Adding columns with defaults or allowing nulls. Creating a new table and double-writing. Creating indexes concurrently. Running migrations outside of peak hours.',
          redFlags: ['Suggests locking tables during peak hours', 'Has no strategy for rolling back failed migrations'],
          bonusPoints: ['Mentions tools like Flyway, Liquibase, or specific ORM migration strategies (Prisma/TypeORM)']
        },
        {
          difficulty: 'Medium',
          question: 'What are CTEs (Common Table Expressions) and when would you use them over subqueries?',
          expectedAnswer: 'CTEs (WITH clauses) provide better readability and maintainability for complex queries by breaking them into logical blocks. Recursive CTEs are specifically used for querying hierarchical data (e.g., trees).',
          redFlags: ['Does not know what a CTE is', 'Claims CTEs always perform better than subqueries (they are often materialized in older PG versions, affecting performance)'],
          bonusPoints: ['Mentions recursive CTEs for tree structures']
        },
        {
          difficulty: 'Expert',
          question: 'Can you describe how isolation levels work in PostgreSQL and how they prevent dirty reads, non-repeatable reads, and phantom reads?',
          expectedAnswer: 'PostgreSQL defaults to Read Committed. Explain differences between Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Serializable uses SSI (Serializable Snapshot Isolation) to prevent phantom reads without strict locking.',
          redFlags: ['Cannot explain dirty reads or phantom reads', 'Assumes default isolation prevents all anomalies'],
          bonusPoints: ['Explains MVCC (Multi-Version Concurrency Control) and how it relates to isolation levels']
        },
        {
          difficulty: 'Hard',
          question: 'How do you optimize a slow-performing SQL query? What steps do you take when analyzing the output of EXPLAIN ANALYZE?',
          expectedAnswer: 'Use EXPLAIN ANALYZE to see the execution plan. Look for Sequential Scans (Seq Scan) on large tables, high-cost joins, and whether indexes are actually being used (Index Scan / Bitmap Heap Scan). Add indexes, rewrite queries, or run VACUUM ANALYZE to update statistics.',
          redFlags: ['Only suggests "adding an index" without understanding the plan', 'Doesn\'t know about EXPLAIN ANALYZE'],
          bonusPoints: ['Mentions checking buffer usage (shared hit/read) to understand memory vs disk I/O']
        }
      ]
    },
    {
      categoryName: 'Caching Strategies (Redis)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You integrated Redis for high-speed caching in "Domain Scanner". What specific caching patterns (e.g., Cache-Aside, Write-Through) did you implement?',
          expectedAnswer: 'Should describe Cache-Aside (lazy loading) where the app checks cache, then DB, then writes to cache. Or Write-Through where data is written to cache and DB simultaneously. Explain the pros/cons (e.g., stale data vs write latency).',
          redFlags: ['Doesn\'t know the names of the patterns implemented', 'Uses Redis without understanding cache coherence'],
          bonusPoints: ['Explains a hybrid approach or mentions Write-Behind caching']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle cache invalidation, especially in a distributed system where data is updated frequently?',
          expectedAnswer: 'Strategies include setting TTLs (Time to Live), event-driven invalidation (e.g., publishing a message on RabbitMQ when data changes to clear caches), or versioning cache keys.',
          redFlags: ['"Just set a long TTL"', 'Has no strategy for immediate invalidation upon data mutation'],
          bonusPoints: ['Mentions the "thundering herd" problem and how to prevent it (e.g., caching a stale value while async refreshing)']
        },
        {
          difficulty: 'Medium',
          question: 'What data structures in Redis have you used beyond simple key-value strings, and for what use cases?',
          expectedAnswer: 'Hashes for objects, Lists for queues/timelines, Sets for unique elements (e.g., active users), Sorted Sets for leaderboards or rate limiting, Bitmaps for analytics.',
          redFlags: ['Only uses Redis for string caching', 'Uses Redis strings to store massive stringified JSON objects unnecessarily instead of Hashes'],
          bonusPoints: ['Describes a complex use case using Sorted Sets or HyperLogLog']
        },
        {
          difficulty: 'Hard',
          question: 'Describe the memory eviction policies in Redis. How do you choose the right one for a caching layer?',
          expectedAnswer: 'Policies include allkeys-lru, volatile-lru, allkeys-lfu, etc. For a pure cache, allkeys-lru (Least Recently Used) or allkeys-lfu (Least Frequently Used) are common. Volatile policies only evict keys with a TTL set.',
          redFlags: ['Doesn\'t know Redis can evict data automatically', 'Recommends noeviction for a caching use case (leads to OOM)'],
          bonusPoints: ['Explains the difference between LRU and LFU and when LFU is superior']
        },
        {
          difficulty: 'Medium',
          question: 'If your Redis instance suddenly goes down, how does your application handle the failure? Do you have fallback mechanisms?',
          expectedAnswer: 'Application should catch the connection error and gracefully degrade to querying the primary database directly (circuit breaker pattern), logging the issue, and attempting to reconnect.',
          redFlags: ['Application crashes entirely if Redis is down', 'Fails to consider the increased load on the primary DB when cache falls through'],
          bonusPoints: ['Mentions implementing a Circuit Breaker to prevent overwhelming the DB during cache outages']
        }
      ]
    },
    {
      categoryName: 'Message Queues (RabbitMQ)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You used RabbitMQ for asynchronous task processing in the "Domain Scanner". Can you explain the difference between a direct, topic, and fanout exchange?',
          expectedAnswer: 'Direct routes based on exact routing key. Topic routes based on wildcard matching in routing key. Fanout routes to all bound queues blindly.',
          redFlags: ['Cannot differentiate between the exchange types', 'Confuses RabbitMQ with pub/sub only models like Kafka/Redis PubSub'],
          bonusPoints: ['Mentions Headers exchange for routing based on message headers']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle message retries and dead-letter queues (DLQ) in RabbitMQ for failed domain scanning tasks?',
          expectedAnswer: 'Configure a DLX (Dead Letter Exchange) for a queue. If a message is rejected (nack) without requeue, or TTL expires, it moves to the DLQ. Consumers process the DLQ for retries (often with exponential backoff) or manual inspection.',
          redFlags: ['Always requeues failed messages infinitely, blocking the queue', 'Does not know what a DLQ is'],
          bonusPoints: ['Explains how to implement exponential backoff using message TTLs and DLQs']
        },
        {
          difficulty: 'Medium',
          question: 'What happens if a consumer crashes while processing a message? How does RabbitMQ ensure message durability and delivery?',
          expectedAnswer: 'Through manual acknowledgments (ack). If the consumer crashes before sending an ack, RabbitMQ will requeue the message and deliver it to another consumer. Messages and queues must also be marked as durable to survive a broker restart.',
          redFlags: ['Uses auto-ack for critical tasks', 'Assumes messages are saved forever even if not marked durable'],
          bonusPoints: ['Mentions publisher confirms to guarantee the message reached the broker initially']
        },
        {
          difficulty: 'Hard',
          question: 'How do you scale consumers in RabbitMQ when the queue starts building up rapidly?',
          expectedAnswer: 'Add more consumer instances (competing consumers pattern). RabbitMQ will round-robin messages among active consumers. Monitor queue depth and scale horizontally using auto-scaling groups or Kubernetes HPAs.',
          redFlags: ['Suggests creating more queues instead of more consumers for the same workload', 'Does not consider database bottlenecks when scaling consumers'],
          bonusPoints: ['Mentions the impact of prefetch count on scaling effectively']
        },
        {
          difficulty: 'Expert',
          question: 'Explain the concept of prefetch count (QoS) in RabbitMQ and how it impacts consumer performance and load balancing.',
          expectedAnswer: 'Prefetch count limits the number of unacknowledged messages a consumer can hold. Setting it too high leads to poor load balancing (one fast consumer might grab all messages, leaving others idle). Setting it to 1 is fair but adds network latency overhead. A moderate value balances throughput and fairness.',
          redFlags: ['Doesn\'t know what prefetch is', 'Leaves prefetch unlimited, risking consumer memory exhaustion'],
          bonusPoints: ['Provides a heuristic for setting prefetch based on task duration and network latency']
        }
      ]
    }
  ]
};

async function run() {
  try {
    await insertRound(roundData);
    console.log('Successfully inserted Round 4 data.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting round 4 data:', error);
    process.exit(1);
  }
}

run();
