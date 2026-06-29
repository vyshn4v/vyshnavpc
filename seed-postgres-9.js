import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-advanced-query-tuning",
    title: "41. Advanced Query Tuning",
    order: 41,
    content: "### 1. Conceptual Overview\nQuery tuning in PostgreSQL involves analyzing execution plans, identifying bottlenecks, and optimizing SQL statements or database structures (like indexes) to reduce latency and resource usage.\n\n### 2. Architecture & Mechanics\nPostgreSQL's Query Planner uses cost-based optimization. It evaluates multiple execution paths based on statistics collected by the `ANALYZE` command. The `EXPLAIN` and `EXPLAIN ANALYZE` commands provide insights into the planner's choices, showing nodes like sequential scans, index scans, and join methods (Nested Loop, Hash Join, Merge Join).\n\n### 3. Implementation: Standard vs Optimized\n**Standard (Unoptimized):**\nQuerying a large table without an appropriate index leads to a Sequential Scan.\n```sql\nSELECT * FROM orders WHERE customer_id = 12345;\n```\n\n**Optimized:**\nCreating a B-tree index on `customer_id` allows the planner to use an Index Scan or Bitmap Index Scan.\n```sql\nCREATE INDEX idx_orders_customer_id ON orders(customer_id);\nSELECT * FROM orders WHERE customer_id = 12345;\n```\n\n### 4. Trade-offs & Complexity\nWhile indexes speed up read operations, they add overhead to writes (INSERT, UPDATE, DELETE) and consume disk space. Over-indexing can degrade overall database performance. Tuning requires a careful balance between read and write workloads.",
    interviewQuestions: [
      { question: "What is the difference between EXPLAIN and EXPLAIN ANALYZE?", answer: "EXPLAIN shows the query plan and estimated costs. EXPLAIN ANALYZE actually executes the query and shows both the plan and the actual execution times." },
      { question: "How does a Hash Join work in PostgreSQL?", answer: "It builds an in-memory hash table of the smaller relation, then scans the larger relation, probing the hash table to find matches." },
      { question: "What is the purpose of the pg_stat_statements extension?", answer: "It tracks execution statistics of all SQL statements executed by a server, useful for identifying slow queries." },
      { question: "Explain what a Bitmap Index Scan is.", answer: "It scans an index to build a bitmap of matching row locations, sorts the locations, and then fetches the actual table rows in physical order." },
      { question: "Why might PostgreSQL choose a Sequential Scan even when an index exists?", answer: "If the planner estimates that the query will return a large percentage of the table's rows, a Sequential Scan is often cheaper than an Index Scan due to lower I/O overhead." }
    ],
    practicalTask: {
      scenario: "You need to analyze the performance of a query.",
      task: "Run a query with execution time and plan analysis.",
      solutionCode: "EXPLAIN ANALYZE SELECT * FROM users WHERE active = true;"
    }
  },
  {
    slug: "pg-postgis-spatial",
    title: "42. PostGIS and Spatial Data",
    order: 42,
    content: "### 1. Conceptual Overview\nPostGIS is a spatial database extension for PostgreSQL. It adds support for geographic objects, allowing location queries to be run in SQL.\n\n### 2. Architecture & Mechanics\nPostGIS introduces new data types such as `geometry` and `geography`. It utilizes R-Tree spatial indexes implemented via GiST (Generalized Search Tree) to efficiently query multi-dimensional data, such as finding all points within a certain polygon.\n\n### 3. Implementation: Standard vs Optimized\n**Standard:**\nStoring coordinates as separate numeric columns and computing distances using standard math functions (slow and cannot be effectively indexed).\n\n**Optimized:**\nUsing PostGIS types and functions with a GiST index.\n```sql\nCREATE TABLE locations (id serial, name varchar, geom geometry(Point, 4326));\nCREATE INDEX idx_locations_geom ON locations USING GIST(geom);\nSELECT name FROM locations WHERE ST_DWithin(geom, ST_MakePoint(-71.06, 42.36)::geography, 1000);\n```\n\n### 4. Trade-offs & Complexity\nPostGIS makes PostgreSQL a powerful GIS tool but adds complexity to the installation, backup, and querying processes. Spatial operations can be CPU-intensive, and spatial indexes require careful tuning.",
    interviewQuestions: [
      { question: "What is the difference between geometry and geography types in PostGIS?", answer: "Geometry uses a Cartesian plane (flat earth), while geography uses a spherical model (round earth) which provides more accurate measurements over large distances but is computationally heavier." },
      { question: "Which index type is typically used for spatial data in PostGIS?", answer: "GiST (Generalized Search Tree) indexes." },
      { question: "What does SRID stand for and why is it important?", answer: "Spatial Reference System Identifier. It defines the coordinate system (e.g., 4326 for WGS 84) ensuring accurate mapping and calculations." },
      { question: "Name a common PostGIS function used to find the distance between two points.", answer: "ST_Distance." },
      { question: "How does a GiST index improve spatial query performance?", answer: "It uses bounding boxes to quickly filter out geometries that definitely do not match the query, drastically reducing the number of complex geometric calculations required." }
    ],
    practicalTask: {
      scenario: "Enable spatial capabilities in a database.",
      task: "Create the PostGIS extension.",
      solutionCode: "CREATE EXTENSION postgis;"
    }
  },
  {
    slug: "pg-full-text-search",
    title: "43. Full-Text Search",
    order: 43,
    content: "### 1. Conceptual Overview\nPostgreSQL provides robust, built-in Full-Text Search (FTS) capabilities. It allows documents to be converted into search tokens, enabling complex querying like stemming, ranking, and language-specific matching without needing an external search engine like Elasticsearch.\n\n### 2. Architecture & Mechanics\nFTS relies on two main data types: `tsvector` (a document optimized for search, containing lexemes) and `tsquery` (a search query). Postgres parses documents, removes stop words, and normalizes words to their base forms (lexemes) using dictionaries. GIN (Generalized Inverted Index) indexes are typically used to speed up FTS.\n\n### 3. Implementation: Standard vs Optimized\n**Standard:**\nUsing the `LIKE` or `ILIKE` operator with wildcards, which cannot be easily indexed and performs a sequential scan.\n```sql\nSELECT * FROM articles WHERE content ILIKE '%database%';\n```\n\n**Optimized:**\nUsing `tsvector`, `tsquery`, and a GIN index.\n```sql\nALTER TABLE articles ADD COLUMN tsv_content tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED;\nCREATE INDEX idx_tsv_content ON articles USING GIN(tsv_content);\nSELECT * FROM articles WHERE tsv_content @@ to_tsquery('english', 'database & scaling');\n```\n\n### 4. Trade-offs & Complexity\nBuilt-in FTS reduces architectural complexity by removing the need for a separate search service. However, it may lack advanced features of dedicated search engines (like fuzzy search or complex relevancy tuning out-of-the-box) and large GIN indexes can be slow to update.",
    interviewQuestions: [
      { question: "What are `tsvector` and `tsquery`?", answer: "`tsvector` represents a document optimized for text search, and `tsquery` represents a text query." },
      { question: "Which index type is recommended for Full-Text Search in PostgreSQL?", answer: "GIN (Generalized Inverted Index)." },
      { question: "What is the purpose of stemming in full-text search?", answer: "Stemming reduces words to their root or base form (e.g., 'running' and 'runs' become 'run'), allowing matches on different word variations." },
      { question: "How do you rank search results in PostgreSQL FTS?", answer: "Using the `ts_rank` or `ts_rank_cd` functions." },
      { question: "What are stop words?", answer: "Common words like 'the', 'is', 'at' that are typically ignored during full-text search indexing and querying because they provide little value." }
    ],
    practicalTask: {
      scenario: "Convert a string to a tsvector.",
      task: "Use the english dictionary to convert a sentence to a tsvector.",
      solutionCode: "SELECT to_tsvector('english', 'The quick brown fox jumps');"
    }
  },
  {
    slug: "pg-table-partitioning",
    title: "44. Table Partitioning Deep Dive",
    order: 44,
    content: "### 1. Conceptual Overview\nTable partitioning involves splitting one logically large table into smaller physical pieces called partitions. This improves query performance and simplifies maintenance tasks like bulk deleting old data.\n\n### 2. Architecture & Mechanics\nPostgreSQL supports declarative partitioning (by RANGE, LIST, or HASH). Queries against the parent table are transparently routed to the appropriate child partitions. The query planner uses 'partition pruning' to exclude partitions that cannot possibly satisfy the query criteria, dramatically reducing I/O.\n\n### 3. Implementation: Standard vs Optimized\n**Standard:**\nA single monolithic table containing billions of rows, where archiving old data requires slow `DELETE` statements that bloat the table.\n\n**Optimized:**\nA table partitioned by date (RANGE).\n```sql\nCREATE TABLE measurements (\n    id int,\n    logdate date,\n    peaktemp int\n) PARTITION BY RANGE (logdate);\n\nCREATE TABLE measurements_y2023 PARTITION OF measurements \n    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');\n```\n\n### 4. Trade-offs & Complexity\nPartitioning adds schema complexity. Foreign keys referencing partitioned tables and unique constraints across all partitions have limitations. If query conditions do not include the partition key, partition pruning cannot occur, and performance may actually degrade.",
    interviewQuestions: [
      { question: "What are the three types of declarative partitioning available in PostgreSQL?", answer: "RANGE, LIST, and HASH." },
      { question: "What is partition pruning?", answer: "An optimization technique where the query planner excludes unneeded partitions from the execution plan based on the query's WHERE clause." },
      { question: "How do you remove old data efficiently in a partitioned setup?", answer: "By dropping the entire partition (DROP TABLE partition_name), which is much faster than running DELETE statements and avoids table bloat." },
      { question: "What happens if you insert a row that doesn't fit into any existing partition?", answer: "An error is thrown unless a DEFAULT partition exists." },
      { question: "Can you create a global index across all partitions in PostgreSQL?", answer: "No, PostgreSQL currently only supports local indexes (indexes created on each partition individually) for partitioned tables." }
    ],
    practicalTask: {
      scenario: "Attach a default partition.",
      task: "Create a default partition for the `measurements` table.",
      solutionCode: "CREATE TABLE measurements_default PARTITION OF measurements DEFAULT;"
    }
  },
  {
    slug: "pg-ha-patroni",
    title: "45. High Availability and Patroni",
    order: 45,
    content: "### 1. Conceptual Overview\nHigh Availability (HA) ensures that a database remains accessible even if a server fails. Patroni is a popular open-source template for PostgreSQL HA, managing automated failover and replication.\n\n### 2. Architecture & Mechanics\nPatroni relies on a Distributed Configuration Store (DCS) like etcd, Consul, or ZooKeeper to maintain cluster state and leader election. It configures PostgreSQL streaming replication. If the primary node fails, Patroni automatically promotes a standby to primary and reconfigures other standbys to follow the new primary.\n\n### 3. Implementation: Standard vs Optimized\n**Standard:**\nManual failover using standard streaming replication. If the primary goes down, an administrator must manually run `pg_ctl promote` on a standby and redirect application traffic.\n\n**Optimized:**\nA Patroni cluster with HAProxy or PgBouncer routing traffic to the current leader. Failover happens automatically within seconds, minimizing downtime.\n\n### 4. Trade-offs & Complexity\nPatroni provides robust HA but requires setting up and maintaining a DCS (e.g., an etcd cluster). This significantly increases the infrastructure footprint and operational complexity. Split-brain scenarios must be carefully mitigated through proper DCS configuration and fencing.",
    interviewQuestions: [
      { question: "What is the role of the DCS (Distributed Configuration Store) in Patroni?", answer: "It stores the cluster configuration, tracks the health of nodes, and orchestrates leader election." },
      { question: "Explain the concept of 'Split-Brain' in a database cluster.", answer: "It occurs when network failures cause multiple nodes to believe they are the primary, leading to independent data modifications and data corruption." },
      { question: "How does Patroni handle automatic failover?", answer: "When the primary fails to update its lock in the DCS, another node acquires the lock, promotes itself to primary, and updates the cluster state." },
      { question: "What is the difference between synchronous and asynchronous replication?", answer: "Synchronous ensures data is written to at least one standby before acknowledging the commit to the client (guaranteeing no data loss but higher latency), while asynchronous does not wait." },
      { question: "Why is HAProxy commonly used alongside Patroni?", answer: "HAProxy acts as a reverse proxy, checking the Patroni REST API to route read-write traffic to the current leader and read-only traffic to replicas." }
    ],
    practicalTask: {
      scenario: "Check replication status.",
      task: "Query the system view to see connected replication standbys.",
      solutionCode: "SELECT * FROM pg_stat_replication;"
    }
  }
];

appendTopics("postgres", "PostgreSQL Masterclass", "...", topics).then(() => console.log('Part 9 seeded!'));
