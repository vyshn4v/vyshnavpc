import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Chapter 26: Logical Replication and Decoding",
    content: `
<h2>Logical Replication and Decoding</h2>

<p>Logical replication, natively introduced in PostgreSQL 10, fundamentally changed how data is distributed. Unlike traditional physical replication (which copies raw disk blocks), logical replication decodes the WAL into human-readable data changes (INSERT, UPDATE, DELETE) and streams those row-level changes to subscribers.</p>

<h3>1. Architecture: Publishers and Subscribers</h3>
<p>Logical replication uses a publish-subscribe model. The primary server is the "Publisher", defining "Publications" which are logical sets of tables. The receiving server is the "Subscriber", defining "Subscriptions" that connect to a publication. When a row in a published table is modified, the change is streamed to the subscriber, which executes an equivalent operation to apply the change.</p>

<h3>2. Logical Decoding and pgoutput</h3>
<p>The magic happens via Logical Decoding. This is the process of translating raw physical WAL records into logical data changes. It uses an output plugin (the default native one is <code>pgoutput</code>) to format these changes. Tools like Debezium use logical decoding to stream PostgreSQL changes directly into Apache Kafka for event-driven architectures (Change Data Capture - CDC).</p>

<h3>3. Advantages over Physical Replication</h3>
<ul>
  <li><strong>Selective Replication:</strong> You can replicate a single table or a subset of tables, whereas physical replication replicates the entire massive database cluster.</li>
  <li><strong>Cross-Version and Cross-Platform:</strong> Because it replicates SQL-level data, you can replicate from Postgres 12 to Postgres 16, or from Linux to Windows. This makes logical replication the standard tool for zero-downtime major version upgrades.</li>
  <li><strong>Writeable Subscribers:</strong> The subscriber database is a normal, writable database. You can add local indexes, create new tables, or aggregate data locally, unlike physical standbys which are strictly read-only.</li>
  <li><strong>Data Transformation:</strong> With row filters and column lists (introduced in PG 15+), you can replicate only specific rows (e.g., <code>WHERE country = 'US'</code>) or omit sensitive columns (e.g., excluding the <code>password_hash</code> column).</li>
</ul>

<h3>4. Caveats and Limitations</h3>
<p>Logical replication does not replicate schema (DDL). If you run <code>ALTER TABLE ADD COLUMN</code> on the publisher, the replication will break until you manually run the identical DDL on the subscriber. It also heavily relies on Replica Identities (usually the Primary Key) to know which rows to update or delete on the subscriber.</p>

<h3>Interview Questions</h3>
<ol>
  <li><strong>Question:</strong> What is the most critical requirement for a table on the publisher database for UPDATE and DELETE operations to successfully replicate via logical replication?
  <br><strong>Answer:</strong> The table must have a "Replica Identity", which is almost always a Primary Key. When an UPDATE occurs, the WAL only logs the changes. To apply that update on the subscriber, the subscriber needs to know <em>which</em> row to update. Without a primary key, it cannot identify the target row, and replication will fail.</li>

  <li><strong>Question:</strong> How is Logical Replication used to perform a zero-downtime major version upgrade of PostgreSQL?
  <br><strong>Answer:</strong> You set up the new version (e.g., PG 16) as a subscriber to the old version (e.g., PG 12). You do an initial data sync, and then let logical replication stream all ongoing changes to the new server. Once the new server is perfectly caught up with the old server, you pause your application, switch the connection string to point to the new PG 16 server, and resume. The downtime is measured in seconds.</li>

  <li><strong>Question:</strong> Explain the difference between Physical Streaming Replication and Logical Replication regarding the state of the Standby/Subscriber database.
  <br><strong>Answer:</strong> A Physical Standby is a byte-for-byte exact replica of the Primary's disk. It is strictly read-only; you cannot write to it, create local tables, or even create local indexes. A Logical Subscriber is a fully independent, writable database. It simply receives SQL-level data payloads and applies them. You can write your own data to the subscriber alongside the replicated data.</li>

  <li><strong>Question:</strong> What happens to logical replication if you run an <code>ALTER TABLE DROP COLUMN</code> on the published table?
  <br><strong>Answer:</strong> Logical replication does not replicate DDL (schema changes). If you drop a column on the publisher, it will start sending WAL records missing that column. If the subscriber table still has that column and it's marked <code>NOT NULL</code>, or if the internal row structure mismatches, the replication worker on the subscriber will crash, halting replication until the schema on the subscriber is manually fixed.</li>

  <li><strong>Question:</strong> What is "Change Data Capture" (CDC) and how does PostgreSQL's Logical Decoding enable it?
  <br><strong>Answer:</strong> CDC is an architectural pattern where external systems (like data warehouses or event queues like Kafka) react to every single data change in the database. PostgreSQL enables this via Logical Decoding. A tool like Debezium acts as a "subscriber", reading the logical WAL stream, formatting the inserts/updates/deletes as JSON payloads, and pushing them into Kafka topics for other microservices to consume in real-time.</li>
</ol>
`
  },
  {
    title: "Chapter 27: Streaming Replication and High Availability (HA) Setups",
    content: `
<h2>Streaming Replication and High Availability (HA) Setups</h2>

<p>For mission-critical applications, a single database server represents a Single Point of Failure (SPOF). PostgreSQL's physical Streaming Replication provides the foundation for High Availability (HA) by maintaining exact, real-time byte-for-byte copies of the primary server on one or more standby servers.</p>

<h3>1. Physical Streaming Replication Architecture</h3>
<p>The Primary server runs a "WAL Sender" process. As transactions commit and data is written to the WAL buffers, the WAL Sender streams this raw binary WAL data over the network to the Standby server. The Standby server runs a "WAL Receiver" process, which writes the stream to its local disk and immediately feeds it to the startup process, which continuously performs "redo" recovery, applying the blocks to the data files. This creates an exact physical mirror.</p>

<h3>2. Synchronous vs. Asynchronous Replication</h3>
<ul>
  <li><strong>Asynchronous (Default):</strong> The Primary commits the transaction locally and immediately returns success to the client. The WAL is streamed to the standby in the background. If the Primary suffers a sudden catastrophic hardware failure, a small window of recently committed transactions might not have reached the standby, resulting in minor data loss upon failover.</li>
  <li><strong>Synchronous:</strong> Configured via <code>synchronous_standby_names</code> and <code>synchronous_commit</code>. The Primary waits to return success to the client until the Standby acknowledges it has securely written the WAL to disk. This guarantees zero data loss (RPO=0) during a failover, but adds network latency to every single write transaction.</li>
</ul>

<h3>3. Hot Standby</h3>
<p>By setting <code>hot_standby = on</code>, the Standby server allows read-only queries. This allows applications to route heavy reporting queries or read-only API traffic to the replica, massively scaling out the read capacity of the database architecture while keeping the primary dedicated to write operations.</p>

<h3>4. High Availability (HA) Automation (Patroni)</h3>
<p>PostgreSQL replication is native, but <em>failover</em> is not automated out of the box. If the primary dies, someone must manually promote the standby. Modern HA utilizes tools like Patroni, which uses a Distributed Consensus Store (like etcd or Consul) to monitor database health. If the primary fails, Patroni automatically triggers an election, promotes the healthiest standby to be the new primary, and reconfigures the remaining standbys to follow the new primary, achieving recovery times (RTO) of seconds.</p>

<h3>Interview Questions</h3>
<ol>
  <li><strong>Question:</strong> In Asynchronous Streaming Replication, what happens if the network connection between the Primary and Standby goes down for 3 hours?
  <br><strong>Answer:</strong> The Primary will continue operating normally. However, it will keep all generated WAL segments in its <code>pg_wal</code> directory because it knows the Standby hasn't received them. If the network outage lasts too long and the WAL generation exceeds disk capacity (or <code>wal_keep_size</code> limits), the Primary will eventually delete the old WALs to survive. When the Standby reconnects, it will be hopelessly out of sync and require a full rebuild from a base backup.</li>

  <li><strong>Question:</strong> What is a Replication Slot, and how does it solve the problem of network disconnects mentioned above?
  <br><strong>Answer:</strong> A Replication Slot is a mechanism on the Primary that forces it to retain WAL files indefinitely as long as a specific Standby has not consumed them. It guarantees the Standby can always catch up after a disconnect. The massive risk is that if the Standby permanently dies and the slot is not manually dropped, the Primary's disk will eventually fill up 100% with un-purged WAL files, causing a catastrophic primary outage.</li>

  <li><strong>Question:</strong> Why does enabling Synchronous Replication degrade write performance?
  <br><strong>Answer:</strong> With Synchronous Replication, the Primary cannot acknowledge a <code>COMMIT</code> command to the client until the transaction's WAL data has been transmitted across the network, received by the Standby, and flushed to the Standby's physical disk. The latency of the network round-trip and the Standby's disk I/O are added to the duration of every single write transaction.</li>

  <li><strong>Question:</strong> What is a "Split-Brain" scenario in High Availability, and how do tools like Patroni prevent it?
  <br><strong>Answer:</strong> Split-Brain occurs when a network partition happens, and both the Primary and the Standby believe the other is dead. The Standby gets promoted, and now two servers believe they are the Primary, accepting conflicting writes that destroy data integrity. Patroni prevents this by relying on an external Consensus Store (like etcd/ZooKeeper) and a concept of "leader locks". Only the node that holds the lock in the consensus store is allowed to operate as the Primary.</li>

  <li><strong>Question:</strong> You have a busy reporting query running on a Hot Standby. The Primary executes an <code>UPDATE</code> that modifies rows the reporting query is currently reading. What happens to the reporting query on the Standby?
  <br><strong>Answer:</strong> This is called a replication conflict. The Standby must apply the WAL from the Primary to stay in sync. If the Standby applies the change, the reporting query's snapshot is violated. By default, the Standby will wait for <code>max_standby_streaming_delay</code> (usually 30 seconds). If the reporting query hasn't finished, the Standby will abruptly terminate the reporting query with a "canceling statement due to conflict with recovery" error to prioritize applying the replication stream.</li>
</ol>
`
  },
  {
    title: "Chapter 28: Connection Pooling (PgBouncer, Pgpool-II)",
    content: `
<h2>Connection Pooling (PgBouncer, Pgpool-II)</h2>

<p>Because PostgreSQL forks a relatively heavy OS process for every client connection, it scales poorly when handling thousands of concurrent connections (typical in serverless environments or massive web applications). Connection poolers sit between the application and the database to solve this bottleneck.</p>

<h3>1. The Problem with Direct Connections</h3>
<p>Each Postgres backend process consumes several megabytes of RAM (and potentially much more for <code>work_mem</code>). 5,000 idle direct connections will consume massive amounts of memory and OS scheduling overhead, severely degrading the performance of active queries. Furthermore, establishing a new connection (TCP handshake, SSL negotiation, Postgres authentication) is expensive and adds latency.</p>

<h3>2. How Connection Poolers Work</h3>
<p>A pooler (like PgBouncer) maintains a small, persistent pool of "real" connections to the PostgreSQL database (e.g., 50 connections). The application connects to the pooler instead of the database. The pooler can accept thousands of incoming application connections. It then multiplexes these application requests over the small number of real database connections.</p>

<h3>3. PgBouncer Pooling Modes</h3>
<p>PgBouncer supports three pooling modes, which determine when a backend connection is returned to the pool:</p>
<ul>
  <li><strong>Session Pooling:</strong> A database connection is assigned to a client for the entire duration the client is connected to PgBouncer. If you have 1000 connected clients, you still need 1000 backend connections. Only helps with connection startup overhead, rarely used for scaling.</li>
  <li><strong>Transaction Pooling (Most Common):</strong> A database connection is assigned to a client only for the duration of a single transaction. Once the transaction commits/rolls back, the connection is instantly returned to the pool for another client to use. 50 backend connections can easily serve 5,000 client applications, provided most clients are idle most of the time.</li>
  <li><strong>Statement Pooling:</strong> The connection is returned to the pool after every single statement. This breaks transactions entirely and is rarely used outside of very specific autocommit-only architectures.</li>
</ul>

<h3>4. Caveats of Transaction Pooling</h3>
<p>Because your application might be assigned a completely different PostgreSQL backend process for consecutive transactions, you cannot use session-level features. Prepared statements (which are bound to a specific backend process), temporary tables, and session-level variables (<code>SET work_mem = '10MB'</code>) will break or behave unpredictably under transaction pooling.</p>

<h3>5. Pgpool-II</h3>
<p>While PgBouncer is a lightweight, single-threaded connection multiplexer, Pgpool-II is a heavy-duty middleware. In addition to pooling, Pgpool-II provides load balancing (routing read queries to standbys and writes to the primary), automated failover, and even query caching. However, it is significantly more complex to configure and has higher overhead than PgBouncer.</p>

<h3>Interview Questions</h3>
<ol>
  <li><strong>Question:</strong> Why is connection pooling practically mandatory for high-traffic Node.js or Serverless (AWS Lambda) applications connecting to PostgreSQL?
  <br><strong>Answer:</strong> Serverless functions and high-concurrency Node apps can open thousands of simultaneous connections to the database. Because PostgreSQL creates a heavy OS process per connection, this will instantly exhaust database memory and CPU context switching, causing an "Out of Memory" crash or connection rejections. A pooler multiplexes these thousands of lightweight application connections onto a few dozen heavy backend database connections.</li>

  <li><strong>Question:</strong> Explain the difference between Session Pooling and Transaction Pooling in PgBouncer. Which one is used for scaling concurrency?
  <br><strong>Answer:</strong> Session pooling ties a backend DB connection to an application client for the entire lifetime of the client's connection; it does not reduce the number of required DB connections. Transaction pooling only assigns a DB connection to a client for the duration of a <code>BEGIN...COMMIT</code> block. It is Transaction Pooling that allows 50 database connections to service thousands of connected clients, providing the actual scalability.</li>

  <li><strong>Question:</strong> You switch your application to use PgBouncer in Transaction Pooling mode, and suddenly "Prepared Statements" start throwing errors. Why?
  <br><strong>Answer:</strong> A prepared statement (<code>PREPARE plan_name AS SELECT...</code>) is stored in the memory of the specific backend PostgreSQL process. In Transaction Pooling, Transaction 1 might prepare the statement on Backend A. Transaction 2 might be routed to Backend B and try to execute that statement, resulting in a "prepared statement does not exist" error. You must disable prepared statements in your ORM/driver when using transaction pooling.</li>

  <li><strong>Question:</strong> Compare PgBouncer and Pgpool-II. When would you use one over the other?
  <br><strong>Answer:</strong> PgBouncer is extremely lightweight, single-threaded, and does exactly one thing perfectly: connection multiplexing. It is the go-to for simply surviving high connection counts. Pgpool-II is a heavy middleware that parses SQL. You use Pgpool-II when you need application-transparent Read/Write splitting (sending SELECTs to replicas automatically) or built-in query caching, accepting its higher configuration complexity and performance overhead.</li>

  <li><strong>Question:</strong> What is a "connection leak" in application code, and how does PgBouncer react to it in Transaction pooling mode?
  <br><strong>Answer:</strong> A connection leak happens when application code opens a transaction (<code>BEGIN</code>) but crashes or forgets to issue a <code>COMMIT</code> or <code>ROLLBACK</code>. Under transaction pooling, PgBouncer cannot return that backend connection to the pool because the transaction is technically still open. If the application leaks enough connections, the PgBouncer pool will be entirely exhausted, and all new queries will queue indefinitely, causing an outage.</li>
</ol>
`
  },
  {
    title: "Chapter 29: Advanced Extension Ecosystem",
    content: `
<h2>Advanced Extension Ecosystem (PostGIS, TimescaleDB, pg_stat_statements)</h2>

<p>PostgreSQL's greatest strength is its extensibility. Unlike other databases where new features require recompiling the core engine, PostgreSQL allows loading Extensions that add new data types, index types, background workers, and SQL syntax, effectively turning it into a specialized database for different domains.</p>

<h3>1. pg_stat_statements (The Essential Diagnostics Tool)</h3>
<p>Included in the <code>contrib</code> modules, <code>pg_stat_statements</code> must be enabled in <code>shared_preload_libraries</code>. It records execution statistics of all SQL statements executed on the server. It strips out parameters (normalizing queries) and tracks total execution time, number of calls, min/max times, and block I/O. It is the absolute first tool an engineer uses to find the slowest queries in the database.</p>

<h3>2. PostGIS (Geospatial Dominance)</h3>
<p>PostGIS turns PostgreSQL into a premier Geographic Information System (GIS). It introduces data types like <code>geometry</code> and <code>geography</code>, allowing you to store points, lines, and polygons. It utilizes GiST indexes to perform extremely fast spatial queries, such as "find all restaurants within 5 miles of this coordinate" (<code>ST_DWithin</code>) or "does this delivery route intersect this neighborhood" (<code>ST_Intersects</code>).</p>

<h3>3. TimescaleDB (Time-Series Optimization)</h3>
<p>TimescaleDB is an extension that transforms PostgreSQL into a high-performance time-series database. It introduces "Hypertables", an abstraction over PostgreSQL's native partitioning. It automatically partitions data by time (and optionally space) under the hood while exposing a single logical table to the user. It provides massive ingest rates, custom analytical functions (<code>time_bucket</code>), and continuous aggregates for fast dashboards.</p>

<h3>4. pgvector (The AI Era)</h3>
<p>With the rise of Large Language Models (LLMs), storing and querying high-dimensional vector embeddings became critical for AI applications (like Semantic Search or Retrieval-Augmented Generation). The <code>pgvector</code> extension adds a <code>vector</code> data type and specialized indexing (IVFFlat, HNSW) to perform blazing-fast approximate nearest neighbor (ANN) searches using distance metrics like Cosine Similarity (<code>&lt;=&gt;</code>) or Euclidean Distance (<code>&lt;-&gt;</code>).</p>

<h3>5. Other Notable Extensions</h3>
<ul>
  <li><code>uuid-ossp</code> or <code>pgcrypto</code>: For generating UUIDs and cryptographic hashing.</li>
  <li><code>citus</code>: Transforms Postgres into a distributed, horizontally scalable database across multiple nodes.</li>
  <li><code>pg_repack</code>: Allows running a VACUUM FULL (removing bloat and reclaiming disk space) completely online without taking an exclusive lock.</li>
</ul>

<h3>Interview Questions</h3>
<ol>
  <li><strong>Question:</strong> You are tasked with identifying the queries that are consuming the most overall CPU time on your production database. What extension do you use, and how does it group queries?
  <br><strong>Answer:</strong> You use <code>pg_stat_statements</code>. It groups queries by "normalizing" them—stripping out the literal parameter values and replacing them with variables (e.g., <code>$1</code>, <code>$2</code>). This allows it to aggregate the execution time and call count of thousands of <code>SELECT * FROM users WHERE id = X</code> queries into a single statistical row, making it easy to sort by <code>total_exec_time</code>.</li>

  <li><strong>Question:</strong> What underlying PostgreSQL index type does PostGIS heavily rely on to make queries like "find all points within this bounding box" fast, and why?
  <br><strong>Answer:</strong> PostGIS relies on the GiST (Generalized Search Tree) index. GiST is designed for spatial and multidimensional data. Instead of sorting data linearly like a B-Tree, it creates a tree of bounding boxes (R-Trees), allowing it to quickly discard vast geographic areas that do not overlap the queried region.</li>

  <li><strong>Question:</strong> How does TimescaleDB's "Hypertable" differ from standard declarative partitioning in PostgreSQL for time-series data?
  <br><strong>Answer:</strong> While based on partitioning, Hypertables fully automate chunk (partition) creation as new data arrives, requiring zero manual DDL. More importantly, TimescaleDB deeply modifies the query planner to optimize time-series queries across these chunks and introduces advanced features like Continuous Aggregates (background materialized views of time-buckets) and columnar compression for older chunks, which native Postgres lacks.</li>

  <li><strong>Question:</strong> In the context of AI and Semantic Search, what operation does the <code>pgvector</code> extension optimize using HNSW indexes?
  <br><strong>Answer:</strong> <code>pgvector</code> optimizes Approximate Nearest Neighbor (ANN) searches. When you pass a vector embedding (representing a user's search query), the HNSW index allows the database to instantly find the vectors in the database that have the closest mathematical distance (e.g., Cosine Similarity), enabling fast semantic search over millions of documents.</li>

  <li><strong>Question:</strong> Why is <code>pg_repack</code> highly recommended for database maintenance over the native <code>VACUUM FULL</code> command?
  <br><strong>Answer:</strong> Native <code>VACUUM FULL</code> acquires an Access Exclusive Lock on the table, completely preventing reads and writes while it rewrites the data, causing severe application downtime. <code>pg_repack</code> creates a new table in the background, copies the data, applies ongoing changes via a trigger, and then swaps the tables, removing table bloat with near-zero downtime.</li>
</ol>
`
  },
  {
    title: "Chapter 30: Disaster Recovery, PITR, and Backup Strategies",
    content: `
<h2>Disaster Recovery, Point-in-Time Recovery (PITR), and Backup Strategies</h2>

<p>Data loss is a catastrophic failure for any business. Relying solely on replication is insufficient because if a developer accidentally runs <code>DROP TABLE users;</code>, replication will instantly execute that drop on the standby server. Robust backups and Point-in-Time Recovery (PITR) are mandatory.</p>

<h3>1. Logical Backups (pg_dump)</h3>
<p><code>pg_dump</code> generates a massive text file containing the SQL statements (CREATE TABLE, INSERT) required to reconstruct the database. It is easy to use, portable across OS architectures, and allows backing up specific tables. However, it is agonizingly slow to restore terabytes of data because the database must re-execute every INSERT and rebuild every index from scratch.</p>

<h3>2. Physical Backups (Base Backups)</h3>
<p>A physical backup (often taken via <code>pg_basebackup</code> or tools like pgBackRest) copies the actual binary files from the data directory. Restoring a physical backup is incredibly fast—you simply copy the files back and start the server. However, it backs up the entire cluster, includes all table bloat, and is architecture-dependent (you cannot restore a Linux base backup onto a Windows server).</p>

<h3>3. Point-in-Time Recovery (PITR)</h3>
<p>PITR is the gold standard for disaster recovery. It combines a Physical Base Backup with Continuous WAL Archiving. If a disaster occurs (e.g., a bad deployment corrupts data at 2:00 PM), you restore the midnight Base Backup, and then tell PostgreSQL to replay the archived WAL files strictly up until 1:59:59 PM. The database rolls forward perfectly to the second before the disaster.</p>

<h3>4. WAL Archiving Architecture</h3>
<p>To enable PITR, the primary server must have <code>archive_mode = on</code> and an <code>archive_command</code> configured (or use <code>archive_library</code>). When a WAL segment (16MB) is filled, the archive command copies it to secure off-site storage (like AWS S3). Modern tools like WAL-G or pgBackRest handle parallel compression, encryption, and verification of these archives.</p>

<h3>5. Recovery Configuration</h3>
<p>To perform PITR, you create a <code>recovery.signal</code> file in the data directory and set parameters in <code>postgresql.conf</code>: <code>restore_command</code> (how to fetch the WAL files from S3) and <code>recovery_target_time</code>. Upon startup, Postgres enters recovery mode, fetches the WALs, and replays them until it hits the target timestamp.</p>

<h3>Interview Questions</h3>
<ol>
  <li><strong>Question:</strong> Why is High Availability (Streaming Replication) NOT a substitute for Backups/PITR?
  <br><strong>Answer:</strong> Replication protects against hardware failure (a server catching fire). However, it perfectly replicates human error. If a DBA accidentally executes <code>TRUNCATE TABLE payments;</code>, that command is instantly replicated to all standbys, destroying the data everywhere. Only a backup or PITR allows you to rewind the database state to the moment before the human error occurred.</li>

  <li><strong>Question:</strong> When would you choose to use <code>pg_dump</code> over a physical base backup?
  <br><strong>Answer:</strong> You use <code>pg_dump</code> when you need logical flexibility: migrating data to a newer major version of PostgreSQL, moving from Linux to Windows, backing up only a single specific table or schema rather than the entire cluster, or generating a backup without the physical table bloat/dead tuples.</li>

  <li><strong>Question:</strong> Explain the exact components required to successfully perform a Point-in-Time Recovery (PITR).
  <br><strong>Answer:</strong> You absolutely need two things: 1) A physical Base Backup taken at a point in time prior to the target recovery time. 2) An unbroken, contiguous sequence of archived WAL files spanning from the moment the Base Backup started, up to the target recovery timestamp. If a single WAL file in that sequence is missing or corrupt, recovery stops at that gap.</li>

  <li><strong>Question:</strong> What happens to the PostgreSQL primary server if the S3 bucket used for WAL archiving goes offline, causing the <code>archive_command</code> to fail repeatedly?
  <br><strong>Answer:</strong> PostgreSQL guarantees durability. It will refuse to recycle or delete old WAL segments until they are successfully archived. If the archive command fails, WAL files will begin piling up in the <code>pg_wal</code> directory. If the disk volume hosting <code>pg_wal</code> reaches 100% capacity, the database will completely shut down (panic) to prevent data corruption.</li>

  <li><strong>Question:</strong> Why are enterprise tools like <code>pgBackRest</code> or <code>WAL-G</code> preferred over writing custom bash scripts for <code>archive_command</code>?
  <br><strong>Answer:</strong> Custom scripts (like using <code>scp</code> or <code>aws s3 cp</code>) are often sequential, slow, and lack error handling. Tools like pgBackRest are written in C or Go, perform delta backups (only backing up changed files), utilize parallel processing to saturate network bandwidth, compress data heavily, encrypt the backups, and verify WAL checksums automatically, providing a much higher guarantee of successful recovery for massive databases.</li>
</ol>
`
  }
];

appendTopics('postgres', 'PostgreSQL Database Engineering', 'The definitive guide.', topics);
