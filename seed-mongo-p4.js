import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Chapter 16: Advanced Aggregation Pipeline Optimization",
    content: `
<h2>Advanced Aggregation Pipeline Optimization</h2>

The MongoDB Aggregation Framework is an exceptionally powerful tool for data processing, analysis, and transformation. However, as datasets scale into the terabytes and petabytes, poorly constructed pipelines can become massive performance bottlenecks, consuming excessive memory and CPU. In this comprehensive chapter, we will delve deep into the mechanics of the aggregation pipeline, exploring how the query optimizer works, how to leverage indexes effectively, advanced \`$lookup\` strategies, and the critical importance of pipeline shape.

<h3>Understanding Pipeline Execution and the Query Optimizer</h3>
When you submit an aggregation pipeline, MongoDB does not simply execute the stages blindly in the exact order you provided them. The Aggregation Pipeline Optimizer analyzes the pipeline and attempts to rearrange, combine, or optimize stages to improve efficiency without altering the final output.

**Crucial Optimizations:**
1. **$match and $sort Early Execution**: If a \`$match\` stage occurs early in the pipeline, MongoDB will attempt to push it as far forward as possible, ideally making it the first stage. This drastically reduces the number of documents passed to subsequent stages.
2. **$limit and $skip Coalescence**: When \`$limit\` and \`$skip\` are contiguous, they can be optimized. A \`$sort\` followed by a \`$limit\` without intervening blocking stages allows MongoDB to use a "top-k" algorithm, keeping only the \`k\` highest/lowest documents in memory rather than sorting the entire dataset.
3. **$project Optimization**: MongoDB determines which fields are actually used in subsequent stages and projects only those fields automatically, even if you did not explicitly specify a \`$project\` stage. This reduces memory usage during execution.

<h3>Index Usage in Aggregations</h3>
The most critical rule of aggregation performance is that **only the earliest stages of the pipeline can use indexes**.
- If your pipeline starts with \`$match\`, \`$sort\`, \`$limit\`, or \`$skip\`, it can utilize an index.
- Once a stage like \`$project\`, \`$unwind\`, \`$group\`, or \`$lookup\` modifies the document structure or stream, the index on the original collection is generally no longer applicable.

**Example: Optimal Index Usage**
\`\`\`javascript
// Given an index on { status: 1, created_at: -1 }
db.orders.aggregate([
  { $match: { status: "COMPLETED" } }, // Uses the 'status' part of the index
  { $sort: { created_at: -1 } },       // Uses the 'created_at' part of the index
  { $limit: 100 },                     // Top-K sort Optimization applied
  { $group: { _id: "$customer_id", total: { $sum: "$amount" } } }
]);
\`\`\`

<h3>Advanced $lookup Strategies</h3>
The \`$lookup\` stage performs a left outer join. While powerful, it can be extremely slow if not optimized.

1. **Indexed Foreign Keys**: Always ensure that the \`foreignField\` in the target collection is indexed. Without this index, MongoDB must perform a full collection scan on the target collection for *every* document coming from the pipeline.
2. **Correlated Subqueries (MongoDB 3.6+)**: The modern \`$lookup\` syntax allows you to execute an entirely separate pipeline on the joined collection. This is far more efficient when you only need a subset of the joined data.

\`\`\`javascript
// Inefficient: Joins entire documents, then unwinds and matches
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "user_id",
      as: "user_orders"
    }
  },
  { $unwind: "$user_orders" },
  { $match: { "user_orders.status": "COMPLETED" } }
]);

// Highly Efficient: Correlated Subquery filtering BEFORE joining
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      let: { userId: "$_id" },
      pipeline: [
        { $match: { 
            $expr: { $eq: ["$user_id", "$$userId"] },
            status: "COMPLETED" 
        }},
        { $project: { _id: 1, amount: 1, date: 1 } }
      ],
      as: "completed_orders"
    }
  }
]);
\`\`\`

<h3>Memory Constraints and AllowDiskUse</h3>
Aggregation pipelines run entirely in RAM by default. If a single stage (like a massive \`$group\` or \`$sort\`) exceeds 100MB of RAM, the query will fail.
- For large aggregations, you must specify \`allowDiskUse: true\`. This allows MongoDB to write temporary files to the \`_tmp\` directory.
- **Caution**: While this prevents failure, writing to disk is orders of magnitude slower than RAM. Optimization should always aim to keep operations within the 100MB limit by filtering early.

<h3>Analyzing Pipelines with EXPLAIN</h3>
To truly optimize, you must use \`explain()\`.
\`\`\`javascript
db.collection.aggregate([ ...pipeline... ]).explain("executionStats")
\`\`\`
Look for:
- \`winningPlan\`: Did it use an \`IXSCAN\` (Index Scan) or \`COLLSCAN\` (Collection Scan)?
- \`totalDocsExamined\` vs \`nReturned\`: A high ratio indicates poor indexing.
- \`stages\`: See exactly how the optimizer restructured your pipeline.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Explain the difference in execution between placing a $match stage before a $group stage versus after a $group stage.</strong><br/>A: A $match before $group can utilize collection indexes and significantly reduces the volume of data processed by the $group stage, conserving memory and CPU. A $match after $group cannot use indexes from the original collection and forces the $group stage to process documents that will eventually be discarded.</li>
<li><strong>Q: How does the Aggregation Optimizer handle contiguous $skip and $limit stages?</strong><br/>A: The optimizer will coalesce a $sort and $limit into a Top-K sort, preventing an in-memory sort of the entire dataset. It also pushes $match and $sort stages to the beginning of the pipeline when possible to maximize index usage.</li>
<li><strong>Q: What is the 100MB RAM limit in aggregation, and how do you bypass it? What are the consequences?</strong><br/>A: By default, individual aggregation stages cannot consume more than 100MB of RAM. Bypassing it requires setting \`allowDiskUse: true\`, which lets MongoDB write intermediate data to disk. The consequence is a severe performance degradation due to I/O latency.</li>
<li><strong>Q: Write an advanced $lookup stage that joins only orders placed in the last 30 days.</strong><br/>A: Use the let/pipeline syntax. \`$lookup: { from: 'orders', let: { uId: '$_id' }, pipeline: [ { $match: { $expr: { $eq: ['$userId', '$$uId'] }, date: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } } ], as: 'recentOrders' }\`. This prevents pulling all historical orders into memory.</li>
<li><strong>Q: What happens if the foreignField in a standard $lookup is not indexed?</strong><br/>A: MongoDB will perform a full collection scan on the target collection for every single document passing through the pipeline. If the pipeline has 10,000 documents and the target collection has 1 million, it will scan 1 million documents 10,000 times, causing catastrophic performance collapse.</li>
<li><strong>Q: Can a $lookup utilize an index on the foreign collection?</strong><br/>A: Yes, absolutely. In a standard \`localField\`/\`foreignField\` lookup, an index on the \`foreignField\` is critical. In a correlated subquery lookup, the fields used in the \`$match\` stage of the sub-pipeline should be indexed.</li>
<li><strong>Q: Explain "Covered Queries" in the context of Aggregation.</strong><br/>A: A covered query occurs when all fields requested in the pipeline (usually via an early $project) and all fields used for filtering ($match) are present within a single index. MongoDB can return the results directly from the index RAM without fetching the actual documents from disk.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 17: Data Modeling for Scale: Beyond the Basics",
    content: `
<h2>Data Modeling for Scale: Beyond the Basics</h2>

MongoDB's flexible schema does not mean "no schema." In fact, data modeling in MongoDB is often more complex than in relational databases because it heavily depends on application access patterns rather than purely normalizing data. At massive scale, choosing the right modeling pattern dictates whether your database thrives or crashes.

<h3>The Philosophy of NoSQL Modeling</h3>
In relational databases (SQL), data is modeled for storage efficiency and avoiding duplication (Normalization). In MongoDB (NoSQL), data is modeled for **read efficiency**. Data that is accessed together should be stored together (Embedded). Duplication (Denormalization) is not just allowed; it is often required.

<h3>Advanced Design Patterns</h3>

<h4>1. The Polymorphic Pattern</h4>
When you have a collection of documents that share some similarities but have structural differences, the Polymorphic Pattern is ideal. Instead of creating separate collections for every variation, you store them together and use a "type" field to differentiate them.
*Use Case*: An asset management system storing Laptops, Monitors, and Desktops. All have an \`assetTag\` and \`purchaseDate\`, but Laptops have \`batteryLife\` while Monitors have \`resolution\`.
\`\`\`json
{ "_id": 1, "type": "Laptop", "assetTag": "LT-100", "batteryLife": "10h", "ram": "16GB" }
{ "_id": 2, "type": "Monitor", "assetTag": "MN-200", "resolution": "4K", "panelType": "IPS" }
\`\`\`
*Benefits*: Single queries can retrieve all assets for an employee, and common fields can be indexed globally.

<h4>2. The Bucket Pattern</h4>
When dealing with time-series data, IoT streams, or financial ticks, storing one document per event creates massive index overhead and metadata bloat. The Bucket Pattern groups multiple events into a single document based on a time window or item count.
*Use Case*: Storing temperature sensor readings.
\`\`\`json
// Instead of 1 document per reading:
{
  "sensorId": "S1",
  "startDate": ISODate("2023-10-01T00:00:00Z"),
  "endDate": ISODate("2023-10-01T23:59:59Z"),
  "measurements": [
    { "time": ISODate("2023-10-01T00:01:00Z"), "temp": 22.4 },
    { "time": ISODate("2023-10-01T00:02:00Z"), "temp": 22.5 }
    // ... up to 1440 readings for the day
  ],
  "transactionCount": 1440,
  "sumTemp": 32544
}
\`\`\`
*Benefits*: Drastically reduces the number of documents and index size. Allows for pre-aggregation (storing \`sumTemp\` to easily calculate daily averages).

<h4>3. The Outlier Pattern</h4>
Sometimes a dataset fits a specific pattern 99% of the time, but 1% of the data consists of massive outliers that break the rules. The Outlier Pattern prevents the exceptions from ruining the rule.
*Use Case*: A social media application. Most users have < 500 followers. You can embed the follower IDs directly in the User document. However, celebrities might have 50 million followers, which would exceed the 16MB document limit.
*Solution*: Add a \`hasExtraFollowers: true\` flag.
\`\`\`json
{
  "_id": "user_123",
  "username": "average_joe",
  "followers": [ "user_4", "user_9" ],
  "hasExtraFollowers": false
}
// Outlier
{
  "_id": "user_999",
  "username": "taylor_swift",
  "followers": [ /* first 1000 followers */ ],
  "hasExtraFollowers": true // Application knows to query a separate 'followers_overflow' collection
}
\`\`\`

<h4>4. The Computed Pattern</h4>
When your application performs frequent reads of aggregated data (e.g., total revenue per day, user ratings average), calculating this on the fly for every read is highly inefficient. The Computed Pattern calculates these values upon write (or periodically) and stores the result.
*Use Case*: Movie rating system.
Instead of aggregating 10,000 reviews every time someone views a movie page, update the movie document when a review is submitted:
\`\`\`javascript
db.movies.updateOne(
  { _id: "matrix" },
  { 
    $inc: { totalReviews: 1, sumRatings: newRating },
    $set: { averageRating: calculatedNewAverage }
  }
)
\`\`\`

<h4>5. The Subset Pattern</h4>
When a document contains a massive array or large sub-documents, but the application only needs a fraction of that data for the initial view (e.g., the first 10 comments on a blog post).
*Solution*: Store the most frequently accessed subset of data in the main document, and store the rest in a separate collection.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Explain the primary difference between relational data modeling and MongoDB data modeling.</strong><br/>A: Relational modeling is normalized, focusing on storage efficiency and avoiding duplication. MongoDB modeling is denormalized and read-optimized, embedding data that is accessed together to ensure queries can be satisfied with a single disk read.</li>
<li><strong>Q: What is the 16MB Document Limit, and which design pattern helps mitigate it when dealing with arrays?</strong><br/>A: A single BSON document cannot exceed 16MB. When an array (like followers or comments) grows indefinitely, it risks hitting this limit. The Subset Pattern or the Outlier Pattern mitigates this by embedding a small subset and moving the rest to a separate collection.</li>
<li><strong>Q: Describe the Bucket Pattern and when you would use it.</strong><br/>A: The Bucket Pattern groups multiple related events (e.g., IoT sensor readings per hour, logs per day) into a single document containing an array. It is used to drastically reduce document count, index size, and metadata overhead for time-series or streaming data.</li>
<li><strong>Q: What is the Computed Pattern, and what tradeoff does it introduce?</strong><br/>A: The Computed Pattern pre-calculates read-heavy aggregated metrics (like averages or sums) at write-time rather than read-time. The tradeoff is increased write latency and application complexity, but it provides massive performance gains for read-heavy workloads.</li>
<li><strong>Q: How do you handle a scenario where 99% of e-commerce products have 3 variants, but 1% have 5000 variants?</strong><br/>A: Use the Outlier Pattern. For the 99%, embed the variants directly in the product document for fast retrieval. For the 1%, embed a flag (e.g., \`overflow: true\`) and store the 5000 variants in a separate, dedicated collection. The application logic handles fetching the overflow data when the flag is true.</li>
<li><strong>Q: In the Polymorphic pattern, how do you index a field that only exists in one of the document types?</strong><br/>A: You create a Sparse Index or a Partial Index. A Partial Index on \`{ batteryLife: 1 } { filter: { type: "Laptop" } }\` ensures the index only includes documents where the type is Laptop, saving RAM and disk space.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 18: Mastering the WiredTiger Storage Engine",
    content: `
<h2>Mastering the WiredTiger Storage Engine</h2>

The Storage Engine is the core component of MongoDB responsible for managing how data is stored on disk and in memory. Since MongoDB 3.2, **WiredTiger** has been the default storage engine. Understanding its internal architecture is mandatory for expert-level database engineering, performance tuning, and capacity planning.

<h3>WiredTiger Architecture Overview</h3>
WiredTiger uses a combination of an internal cache (RAM), B-Tree data structures, write-ahead logging (the journal), and background threads (checkpointing and eviction) to manage data.

Unlike legacy engines (MMAPv1) which relied on OS-level memory mapping, WiredTiger manages its own internal cache explicitly.

<h3>The WiredTiger Cache</h3>
The cache is the lifeblood of MongoDB performance. By default, WiredTiger utilizes **50% of (RAM - 1GB)** or **256MB**, whichever is larger.
- **Uncompressed Data in RAM**: Data in the WiredTiger cache is kept uncompressed. This means 10GB of data on disk (compressed) might consume 25GB in RAM.
- **Filesystem Cache**: The operating system uses remaining free RAM for its filesystem cache. MongoDB relies heavily on this OS cache to hold compressed disk blocks. Therefore, giving MongoDB 100% of the RAM is an anti-pattern.

**Eviction**: When the cache fills up (reaches ~80% capacity), WiredTiger must "evict" clean pages (data not modified) or write "dirty" pages (modified data) to disk to make room. If cache pressure becomes critical (95%+), user operations are paused while foreground threads are forced to assist in eviction, causing massive latency spikes.

<h3>Checkpoints and the Journal</h3>
WiredTiger persists data to disk through two mechanisms: Checkpoints and the Journal (Write-Ahead Log).

1. **Checkpoints**: Every 60 seconds (or 2GB of journal data), WiredTiger writes a consistent snapshot of all data in memory to disk. This is an I/O intensive operation. The checkpoint guarantees data durability up to that exact second.
2. **The Journal (WAL)**: To prevent data loss between the 60-second checkpoints, every write operation is recorded in the journal. Upon a crash, MongoDB uses the last checkpoint + the journal to replay all writes and recover the data.
   - The journal uses snappy compression.
   - Journal files are pre-allocated and rotate automatically.

<h3>Concurrency and Ticketing</h3>
WiredTiger provides Document-Level Concurrency Control. This means multiple clients can modify different documents within the same collection simultaneously without locking the entire collection.

To prevent overwhelming the CPU and disk, WiredTiger uses **Tickets**. By default, there are:
- 128 Read Tickets
- 128 Write Tickets

When a query starts, it takes a ticket. When it finishes, it returns the ticket. If long-running queries exhaust all read tickets, new read queries will queue, creating a bottleneck. Monitoring ticket usage (\`db.serverStatus().wiredTiger.concurrentTransactions\`) is critical for diagnosing slow databases.

<h3>Compression Algorithms</h3>
WiredTiger compresses data before writing it to disk. You can configure this per collection.
1. **Snappy (Default)**: Excellent balance. Very fast compression/decompression with moderate space savings.
2. **Zlib**: High compression ratio, but highly CPU intensive. Use for archival data or when disk space is critically expensive and CPU is abundant.
3. **Zstd (MongoDB 4.2+)**: The modern standard. Provides compression ratios similar to zlib but with CPU overhead closer to Snappy. Highly recommended for large deployments.

<h3>Tuning and Best Practices</h3>
1. **RAM Allocation**: Ensure the active working set (frequently accessed data + indexes) fits within the WiredTiger cache.
2. **Disk I/O**: Use high IOPS SSDs. Checkpointing requires massive bursts of write operations.
3. **Avoid Swapping**: Disable OS swap. If MongoDB runs out of RAM and swaps to disk, performance degrades by orders of magnitude.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: What is the default cache size for WiredTiger, and why shouldn't you allocate 100% of RAM to it?</strong><br/>A: The default is 50% of (RAM - 1GB). You shouldn't allocate 100% because WiredTiger stores data uncompressed in its cache, while the OS filesystem cache holds the compressed blocks from disk. MongoDB relies heavily on the OS cache to buffer disk I/O, so starving the OS of RAM harms overall performance.</li>
<li><strong>Q: Explain the difference between Checkpoints and the Journal in WiredTiger.</strong><br/>A: Checkpoints occur every 60 seconds and flush all dirty memory pages to the data files, creating a consistent snapshot on disk. The Journal is a write-ahead log that records every single operation sequentially as it happens. In a crash, MongoDB recovers by loading the last checkpoint and replaying the journal.</li>
<li><strong>Q: What is Document-Level Concurrency Control?</strong><br/>A: It is the locking mechanism used by WiredTiger. It allows multiple write operations to happen simultaneously on the same collection, as long as they are modifying different documents. Legacy engines locked the entire collection or database, severely limiting write throughput.</li>
<li><strong>Q: What happens when WiredTiger read or write tickets are exhausted?</strong><br/>A: By default there are 128 of each. If long-running operations or massive traffic exhaust them, new operations will queue up waiting for a ticket, causing immediate and severe latency spikes across the application.</li>
<li><strong>Q: Describe the difference between Snappy, Zlib, and Zstd compression.</strong><br/>A: Snappy (default) provides fast, low-CPU compression with moderate space savings. Zlib offers high compression but consumes significant CPU. Zstd (available in modern versions) provides high compression similar to Zlib, but with much lower CPU overhead, making it the superior choice for most high-volume datasets.</li>
<li><strong>Q: What is Cache Eviction, and what happens when cache pressure reaches 95%?</strong><br/>A: Eviction is the process of removing clean pages or writing dirty pages to disk to free up RAM. Normally handled by background threads. If pressure hits 95%, foreground application threads are forced to stop processing queries and assist with eviction, causing the database to seemingly "hang" for the application.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 19: Sharding Architecture and Chunks Management",
    content: `
<h2>Sharding Architecture and Chunks Management</h2>

When a database exceeds the capacity of a single high-end server (in terms of RAM, CPU, or Disk I/O), MongoDB utilizes **Sharding** to distribute data across multiple machines. Sharding is MongoDB's approach to horizontal scaling. While powerful, an improperly configured sharded cluster is a nightmare to manage and performs worse than a standalone replica set.

<h3>The Components of a Sharded Cluster</h3>
A sharded cluster requires three distinct components:
1. **Shards**: Replica sets that store the actual data. A document lives on exactly one shard.
2. **Config Servers (CSRS)**: A replica set that stores the cluster's metadata. This metadata defines which chunks of data live on which shards.
3. **Mongos (Query Routers)**: Stateless proxy servers that route application requests to the correct shard based on the Config Server metadata. Applications connect to the \`mongos\`, entirely unaware of the underlying architecture.

<h3>The Shard Key: The Most Important Decision</h3>
To distribute data, MongoDB partitions a collection into **Chunks** based on a **Shard Key**. The shard key is an indexed field (or compound field) present in every document.

**Requirements of a Good Shard Key:**
- **High Cardinality**: The number of unique values. A key with only 5 values (e.g., \`continent\`) can only ever distribute data across 5 chunks, meaning a max of 5 shards.
- **Even Frequency**: Values should occur at roughly equal rates. If 90% of documents have the key "Active", 90% of the data goes to one chunk (and thus one shard).
- **Non-Monotonically Increasing**: If the key is an ObjectId, Timestamp, or Auto-incrementing integer, all new inserts will target the single chunk holding the "highest" values. This creates a "Hot Shard" where one machine takes 100% of write traffic while others sit idle. Hashed Shard Keys solve this.

<h3>Hashed vs. Ranged Sharding</h3>
1. **Ranged Sharding**: Data is distributed based on continuous ranges of the shard key. 
   - *Pro*: Excellent for range queries (e.g., \`find({ age: { $gt: 20, $lt: 30 } })\`). The mongos routes the query only to shards holding those ages (Targeted Query).
   - *Con*: Prone to hot-spotting if data is inserted sequentially.
2. **Hashed Sharding**: MongoDB hashes the shard key value, distributing data randomly but predictably across all shards.
   - *Pro*: Perfect, even distribution of writes across all shards regardless of insertion order.
   - *Con*: Range queries must be broadcast to *all* shards (Scatter-Gather Query), which is less efficient.

<h3>Chunks and the Balancer</h3>
Data is broken into logical Chunks (default 64MB). When a chunk grows beyond 64MB due to inserts, it splits into two.
The **Balancer** is a background process that monitors the number of chunks on each shard. If Shard A has 100 chunks and Shard B has 50, the balancer automatically migrates chunks from A to B until they are even.
- **Migration Impact**: Chunk migration consumes network bandwidth and I/O. It is often scheduled during off-peak hours to avoid impacting application performance.

<h3>Jumbo Chunks</h3>
If a chunk exceeds the maximum size (64MB) but *cannot* be split because all documents in that chunk share the exact same shard key value, it becomes a "Jumbo Chunk."
- The Balancer refuses to move Jumbo Chunks.
- Over time, Jumbo Chunks lead to severe data imbalance.
- **Solution**: You must refine the shard key (MongoDB 4.4+) to add a second field to break the tie, allowing the chunk to be split.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Describe the roles of mongos, config servers, and shards in a cluster.</strong><br/>A: Shards store the actual data. Config servers store the metadata mapping which data chunks live on which shards. Mongos are stateless query routers; applications connect to them, and they use the config server metadata to route queries to the appropriate shards.</li>
<li><strong>Q: What happens if you choose an ObjectId or Timestamp as a Ranged Shard Key?</strong><br/>A: You create a "Hot Shard" bottleneck. Because ObjectIds and timestamps always increase, all new writes will target the "max" chunk, which resides on a single shard. All other shards will be idle during writes, defeating the purpose of horizontal write scaling.</li>
<li><strong>Q: Differentiate between Hashed Sharding and Ranged Sharding. When would you use each?</strong><br/>A: Hashed sharding hashes the key, providing perfectly even write distribution, ideal for heavy insert workloads where range queries aren't necessary. Ranged sharding keeps contiguous values together, enabling highly efficient targeted range queries, but requires careful key selection to avoid write hotspots.</li>
<li><strong>Q: What is a Scatter-Gather Query?</strong><br/>A: It occurs when a query does not include the shard key. The mongos does not know which shard holds the data, so it must broadcast the query to *all* shards, wait for their responses, and merge them. This is highly inefficient and should be avoided for high-volume operations.</li>
<li><strong>Q: What is a Jumbo Chunk, why is it dangerous, and how do you prevent it?</strong><br/>A: A Jumbo Chunk exceeds the max chunk size but cannot be split because all documents inside share the exact same shard key value. The balancer cannot move it, leading to permanent cluster imbalance. Prevent it by choosing a shard key with high cardinality and low frequency, or by adding a suffix field to create a compound shard key.</li>
<li><strong>Q: Can you change a shard key after a collection is sharded?</strong><br/>A: Historically, no. But starting in MongoDB 4.4, you can refine a shard key by adding a suffix field to an existing key. In MongoDB 5.0+, you can completely change the shard key using the \`reshardCollection\` command, though this is an incredibly intensive operation that rewrites the entire collection.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 20: Transactions and Concurrency Control in MongoDB",
    content: `
<h2>Transactions and Concurrency Control in MongoDB</h2>

For many years, the primary argument against MongoDB was its lack of multi-document ACID transactions. Since version 4.0 (Replica Sets) and 4.2 (Sharded Clusters), MongoDB fully supports distributed multi-document ACID transactions. Understanding how they work under the hood—specifically Multi-Version Concurrency Control (MVCC) and Read/Write Concerns—is crucial for data integrity.

<h3>ACID in a NoSQL World</h3>
MongoDB has always been ACID-compliant at the **single-document level**. An update to a massive, complex document with nested arrays is atomic. Because of the denormalized document model, single-document atomicity satisfies 80-90% of application needs.

Multi-document transactions are necessary when updating documents across multiple collections (e.g., deducting inventory from the \`products\` collection and adding a record to the \`orders\` collection).

<h3>Multi-Version Concurrency Control (MVCC)</h3>
WiredTiger uses MVCC to manage concurrent access. When a document is updated, WiredTiger does not overwrite the old data immediately. Instead, it creates a new version of the document.
- Readers read the older, consistent snapshot.
- Writers modify the new version.
- This prevents Read locks from blocking Writes, and Write locks from blocking Reads, massively increasing throughput.

<h3>Using Transactions in Node.js</h3>
Transactions are tied to a **Session**.
\`\`\`javascript
const session = client.startSession();

try {
  session.startTransaction({
    readConcern: { level: 'snapshot' },
    writeConcern: { w: 'majority' }
  });

  const ordersCollection = client.db('shop').collection('orders');
  const inventoryCollection = client.db('shop').collection('inventory');

  // Must pass the session to every operation
  await ordersCollection.insertOne({ order_id: 123, item: 'A' }, { session });
  await inventoryCollection.updateOne({ item: 'A' }, { $inc: { stock: -1 } }, { session });

  await session.commitTransaction();
} catch (error) {
  // If anything fails, abort and roll back
  await session.abortTransaction();
} finally {
  await session.endSession();
}
\`\`\`

<h3>Read Concern and Write Concern</h3>
To guarantee data consistency in a distributed system, you must configure Read and Write concerns.

**Write Concern (\`w\`)**: Determines how many nodes must acknowledge a write before the driver returns success.
- \`w: 1\` (Default): Acknowledged by the Primary only. Fast, but data can be lost if the Primary crashes before replicating.
- \`w: "majority"\`: Acknowledged by a majority of voting nodes. Slower, but guarantees data will survive a Primary election. Required for strict ACID compliance.

**Read Concern**: Determines the isolation level of the read.
- \`local\` (Default): Returns the most recent data on the node, even if it hasn't been replicated. Subject to dirty reads if a rollback occurs.
- \`majority\`: Returns data that has been acknowledged by a majority of nodes. Prevents dirty reads.
- \`snapshot\`: (Used in transactions) Guarantees that all reads within the transaction see a consistent snapshot of the data from the exact moment the transaction started.

<h3>The Cost of Distributed Transactions</h3>
Transactions in MongoDB should be used sparingly.
1. **Performance Hit**: Transactions require coordinator nodes, two-phase commits (in sharded clusters), and extensive locks. They are significantly slower than standard operations.
2. **Time Limits**: By default, transactions must execute within 60 seconds. If they exceed this, they are automatically aborted to prevent holding locks indefinitely.
3. **Data Modeling First**: If you rely heavily on transactions, your data model is likely too relational. Redesign your schema to leverage embedded documents where possible.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Does MongoDB support ACID transactions? Explain.</strong><br/>A: Yes. MongoDB has always supported single-document ACID transactions. Since version 4.0, it supports multi-document transactions across replica sets, and since 4.2 across sharded clusters, providing full ACID compliance.</li>
<li><strong>Q: Explain Multi-Version Concurrency Control (MVCC) in WiredTiger.</strong><br/>A: MVCC handles concurrency by maintaining multiple versions of data. When an update occurs, a new version is created rather than overwriting the old one. This allows readers to access a consistent snapshot of the old data without being blocked by writers, and writers are not blocked by readers.</li>
<li><strong>Q: What is the difference between Write Concern \`w: 1\` and \`w: "majority"\`?</strong><br/>A: \`w: 1\` returns success as soon as the Primary writes to memory, which is fast but risks data loss if the Primary crashes before replication. \`w: "majority"\` waits until the data is replicated to a majority of nodes, guaranteeing the write will survive an election and preventing rollbacks.</li>
<li><strong>Q: What Read Concern is required to prevent "Dirty Reads" during a network partition?</strong><br/>A: Read concern \`"majority"\`. It ensures the data returned has been written to a majority of nodes and therefore cannot be rolled back, preventing the application from reading data that might later disappear.</li>
<li><strong>Q: Why should multi-document transactions be used sparingly in MongoDB?</strong><br/>A: They incur significant performance overhead due to locking, snapshot management, and two-phase commits in sharded environments. Overuse usually indicates a poor, highly relational data model that should be refactored to use embedded documents instead.</li>
<li><strong>Q: What is the default time limit for a MongoDB transaction and why does it exist?</strong><br/>A: The default limit is 60 seconds. It exists to prevent transactions from holding locks and maintaining WiredTiger snapshots indefinitely, which would eventually exhaust memory and crash the database.</li>
</ul>
</div>
    `
  }
];

appendTopics('mongodb', 'MongoDB Database Engineering', 'The definitive guide.', topics);
