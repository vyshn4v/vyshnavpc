import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Chapter 26: Graph and Tree Structures in MongoDB",
    content: `
<h2>Graph and Tree Structures in MongoDB</h2>

While MongoDB is a Document Database, modern applications frequently model relationships that resemble Graphs (e.g., social networks) or Trees (e.g., organizational charts, category hierarchies, nested comment threads). MongoDB provides specialized aggregation stages and modeling techniques to handle deeply nested and interconnected data without requiring a dedicated Graph Database like Neo4j.

<h3>The $graphLookup Stage</h3>
Introduced in MongoDB 3.4, \`$graphLookup\` allows you to perform recursive searches on a collection. It effectively performs a transitive closure over a graph.

**Use Case: An Organizational Chart**
Imagine an \`employees\` collection where each document has a \`reportsTo\` field indicating the manager's \`_id\`.
You want to find an executive and *all* employees who report to them, either directly or indirectly.

\`\`\`javascript
db.employees.aggregate([
  { $match: { name: "Alice" } }, // The CEO
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",           // Start with Alice's ID
      connectFromField: "_id",     // The ID of the current node
      connectToField: "reportsTo", // The field in the target docs that points to the parent
      as: "entire_hierarchy",
      maxDepth: 5,                 // Optional limit to recursion
      depthField: "management_level" // Injects how deep the node is in the graph
    }
  }
])
\`\`\`

<h3>Modeling Trees</h3>
Depending on the read/write ratio, there are several ways to model hierarchical tree data in MongoDB:

1. **Parent References**:
   - The simplest model. Each node stores the \`_id\` of its immediate parent.
   - *Pros*: Very easy to insert and move nodes.
   - *Cons*: Querying a full subtree requires multiple queries or \`$graphLookup\`.

2. **Child References**:
   - Each node stores an array of its immediate children's \`_id\`s.
   - *Pros*: Good for finding immediate children.
   - *Cons*: Array can grow too large. Difficult to query ancestors.

3. **Materialized Paths**:
   - Each node stores a string representing its entire path in the tree.
   - Example: \`path: ",Books,Programming,Databases,"\`
   - *Pros*: You can find all descendants of "Programming" using a simple regex query: \`db.categories.find({ path: /,Books,Programming,/ })\`. Extremely fast for subtree reads.
   - *Cons*: Moving a subtree requires updating the path string of every single descendant node.

4. **Nested Sets**:
   - Assigns a \`left\` and \`right\` number to each node. All descendants of a node have a left/right value between the parent's left/right values.
   - *Pros*: Extremely fast for finding subtrees.
   - *Cons*: Highly complex to maintain. Inserting a node requires recalculating the left/right values of half the tree.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: What is the primary purpose of the $graphLookup aggregation stage?</strong><br/>A: It allows recursive searching within a collection to traverse hierarchical or graph-like relationships (like an org chart or a social network) in a single query, eliminating the need for application-side recursive queries.</li>
<li><strong>Q: When using $graphLookup, what does the 'depthField' option do?</strong><br/>A: It injects a new field into the output documents representing the level of recursion required to reach that specific document. For example, direct reports would have depth 0, and their reports would have depth 1.</li>
<li><strong>Q: Explain the Materialized Paths pattern for modeling trees.</strong><br/>A: Each node stores a string representing its entire ancestry path (e.g., ",Electronics,Computers,Laptops,"). This allows developers to query an entire subtree rapidly using a single regular expression, prioritizing read performance over write flexibility.</li>
<li><strong>Q: What is the main drawback of using the Materialized Paths pattern?</strong><br/>A: If you need to move a parent node to a different location in the tree, you must update the path string of that node AND every single one of its descendants, which can be an intensive write operation.</li>
<li><strong>Q: How does the 'Parent References' pattern compare to 'Child References'?</strong><br/>A: Parent References store a single field linking to the parent, making it easy to move nodes but requiring $graphLookup to find all descendants. Child References store an array of children IDs, which can hit document size limits if a node has too many children and makes querying ancestors difficult.</li>
<li><strong>Q: In what scenario would you choose MongoDB over a dedicated Graph DB like Neo4j?</strong><br/>A: If the primary workload is standard CRUD operations on documents, but occasionally requires tree traversal (like a category hierarchy), MongoDB's $graphLookup is sufficient. If the entire application relies on complex relationship mapping, weighted edges, and deep graph traversal algorithms, a dedicated Graph DB is superior.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 27: Time Series Data in MongoDB 5.0+",
    content: `
<h2>Time Series Data in MongoDB 5.0+</h2>

Historically, developers had to manually implement the "Bucket Pattern" to handle high-frequency time-series data (IoT sensors, financial ticks, metrics). It was complex and required intricate application logic. With MongoDB 5.0, **Native Time-Series Collections** were introduced, drastically simplifying the architecture while providing immense performance benefits.

<h3>Creating a Time-Series Collection</h3>
A time-series collection must be created explicitly. It cannot be converted from a standard collection.

\`\`\`javascript
db.createCollection("weather_sensors", {
  timeseries: {
    timeField: "timestamp",     // The field containing the Date
    metaField: "sensorId",      // The field identifying the source (metadata)
    granularity: "minutes"      // Optimization hint: "seconds", "minutes", or "hours"
  },
  expireAfterSeconds: 31536000  // Optional TTL: Auto-delete data after 1 year
})
\`\`\`

<h3>How Native Time-Series Work Under the Hood</h3>
When you insert documents into a time-series collection, it looks and acts like a normal collection to the application.
However, under the hood, MongoDB uses an internal optimized columnar format. It automatically groups data into buckets based on the \`metaField\` and time boundaries.
- **Benefits**: This results in highly compressed data on disk, fewer B-Tree index entries, and drastically faster analytical queries. You get the benefits of the Bucket Pattern without writing the application logic.

<h3>Window Functions in Aggregation</h3>
Time-series analysis often requires comparing data points to surrounding data points. MongoDB 5.0 introduced **Window Functions** via the \`$setWindowFields\` stage.

**Use Case: Calculating a Moving Average**
\`\`\`javascript
db.weather_sensors.aggregate([
  {
    $setWindowFields: {
      partitionBy: "$sensorId", // Group by sensor
      sortBy: { timestamp: 1 }, // Order chronologically
      output: {
        moving_avg_temp: {
          $avg: "$temperature",
          window: {
            documents: ["unbounded", "current"] // Cumulative average from start to current doc
            // OR: documents: [-2, 0] for a 3-point moving average
          }
        }
      }
    }
  }
])
\`\`\`
Window functions allow you to calculate running totals, moving averages, ranks, and relative differences without pulling data into the application layer.

<h3>Archival Strategies</h3>
Time-series data grows exponentially. Managing its lifecycle is critical.
1. **TTL Indexes / expireAfterSeconds**: The easiest method. MongoDB will automatically delete documents in the background when they expire.
2. **Online Archive (Atlas)**: Automatically moves cold data older than a specified threshold from expensive cluster storage into cheap S3 storage. The data remains seamlessly queryable via Federated Queries.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: What is the main advantage of Native Time-Series Collections introduced in MongoDB 5.0?</strong><br/>A: They automatically format data into an optimized columnar bucket format under the hood. This provides massive storage compression, reduces index overhead, and speeds up analytical queries without requiring the developer to manually implement the Bucket Pattern in their application code.</li>
<li><strong>Q: When creating a time-series collection, what are the 'timeField' and 'metaField'?</strong><br/>A: 'timeField' is the required field that stores the date/time of the event. 'metaField' is an optional (but highly recommended) field used to group the data, such as a sensor ID, stock ticker, or server IP. MongoDB uses the metaField to group data into internal buckets.</li>
<li><strong>Q: Explain the purpose of the 'granularity' setting.</strong><br/>A: Granularity ("seconds", "minutes", or "hours") is an optimization hint that tells the storage engine how frequently data is expected to arrive. It dictates the time span of the internal buckets, optimizing how data is compressed and indexed.</li>
<li><strong>Q: What is the $setWindowFields aggregation stage?</strong><br/>A: It allows developers to perform Window Functions, computing results across a "window" of related documents. It is heavily used in time-series analysis for calculating running totals, moving averages, and ranks without altering the number of documents returned.</li>
<li><strong>Q: How do you automatically delete time-series data that is older than 30 days?</strong><br/>A: You configure the \`expireAfterSeconds\` option when creating the time-series collection (or using collMod later). MongoDB will run a background thread to automatically delete data that exceeds the TTL (Time-To-Live).</li>
<li><strong>Q: How does a Time-Series collection appear to the application layer?</strong><br/>A: It appears entirely transparent. Applications insert and query standard BSON documents. The complex bucketing and columnar storage happen exclusively at the storage engine level.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 28: Geospatial Indexing and Queries",
    content: `
<h2>Geospatial Indexing and Queries</h2>

Modern applications—from ride-sharing to food delivery to dating apps—rely heavily on location data. MongoDB has first-class, highly optimized support for Geospatial operations. It can index coordinates, calculate distances over a spherical earth, and find intersections of complex polygons.

<h3>GeoJSON Format</h3>
While MongoDB supports legacy coordinate pairs, you should exclusively use **GeoJSON** for modern applications. GeoJSON specifies standard object formats for Points, LineStrings, and Polygons.

\`\`\`json
// A GeoJSON Point embedded in a document
{
  "_id": 1,
  "name": "Central Park",
  "location": {
    "type": "Point",
    "coordinates": [-73.9654, 40.7829] // Note: Longitude first, Latitude second!
  }
}
\`\`\`

<h3>The 2dsphere Index</h3>
To query GeoJSON data on a spherical surface (like the Earth), you must create a \`2dsphere\` index.
\`\`\`javascript
db.places.createIndex({ location: "2dsphere" })
\`\`\`

<h3>Geospatial Query Operators</h3>

1. **$nearSphere**: Finds points nearest to a given coordinate, sorted by distance.
\`\`\`javascript
// Find coffee shops within 5km, sorted nearest to farthest
db.places.find({
  location: {
    $nearSphere: {
      $geometry: { type: "Point", coordinates: [-73.96, 40.78] },
      $maxDistance: 5000 // In meters
    }
  }
})
\`\`\`

2. **$geoWithin**: Finds points that are entirely within a bounded area, such as a Polygon. (Does not sort by distance).
\`\`\`javascript
// Find all vehicles within a specific delivery zone polygon
db.vehicles.find({
  location: {
    $geoWithin: {
      $geometry: {
        type: "Polygon",
        coordinates: [ [ [lng1, lat1], [lng2, lat2], [lng3, lat3], [lng1, lat1] ] ] // Must be a closed ring
      }
    }
  }
})
\`\`\`

3. **$geoIntersects**: Finds documents whose geometry intersects with a given geometry. Useful for finding which delivery zone polygon a specific user point falls into.

<h3>The $geoNear Aggregation Stage</h3>
If you are using an Aggregation Pipeline and need to sort by distance AND output that calculated distance to the documents, you must use the \`$geoNear\` stage.
**Crucial Rule**: \`$geoNear\` MUST be the absolute first stage in the pipeline.

\`\`\`javascript
db.places.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-73.96, 40.78] },
      distanceField: "calculated_distance_meters",
      maxDistance: 5000,
      spherical: true
    }
  },
  { $match: { category: "Coffee" } }, // Additional filtering
  { $sort: { calculated_distance_meters: 1 } }
])
\`\`\`

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: In GeoJSON, what is the correct order for coordinates?</strong><br/>A: Longitude first, then Latitude. This is a common pitfall because map systems often list them as Lat/Lng, but GeoJSON strictly requires Lng/Lat (X axis, then Y axis).</li>
<li><strong>Q: What type of index is required to perform spherical distance calculations?</strong><br/>A: A \`2dsphere\` index. The older \`2d\` index is designed for flat Euclidean geometry and should be avoided for Earth-based calculations.</li>
<li><strong>Q: Differentiate between $nearSphere and $geoWithin.</strong><br/>A: $nearSphere finds points close to a specific location and automatically sorts the results by distance. $geoWithin finds points enclosed entirely within a defined shape (like a polygon) and does *not* sort the results by distance, making it generally faster for simple inclusion checks.</li>
<li><strong>Q: You need to perform a geospatial search in an aggregation pipeline and include the calculated distance in the output. Which stage do you use, and what is its strict placement rule?</strong><br/>A: You must use the \`$geoNear\` stage. Its strict rule is that it must be the very first stage in the aggregation pipeline.</li>
<li><strong>Q: What does the $geoIntersects operator do?</strong><br/>A: It evaluates whether one geometry shares any space with another geometry. It is highly useful for determining if a point (e.g., a user's location) falls inside a complex polygon (e.g., a specific neighborhood or delivery zone).</li>
<li><strong>Q: Why should you avoid using $nearSphere without a $maxDistance limit?</strong><br/>A: Because it will scan outward infinitely until it finds every single document in the collection and sort them all by distance, which is an extremely heavy and inefficient operation. Always provide a logical max distance bound.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 29: Advanced Indexing: Text, Wildcard, and Partial Indexes",
    content: `
<h2>Advanced Indexing: Text, Wildcard, and Partial Indexes</h2>

Standard single-field and compound B-Tree indexes handle 90% of use cases. However, complex schemas and specific query patterns require advanced indexing strategies to maintain performance without bloat.

<h3>Partial Indexes</h3>
A Partial Index only indexes documents that meet a specific filter expression.
**Why use it?** It drastically reduces the size of the index in RAM and disk, and minimizes the write overhead for documents that don't need to be indexed.

\`\`\`javascript
// Scenario: We frequently query for pending orders. 
// Completed orders are rarely queried.
db.orders.createIndex(
  { created_at: 1 },
  { partialFilterExpression: { status: "PENDING" } }
)
\`\`\`
This index only stores entries for pending orders. If an order transitions to "COMPLETED", it is removed from the index.
*Note*: A query must include the filter expression to utilize the partial index. \`db.orders.find({ created_at: { $gt: new Date() } })\` will NOT use the index, because the DB cannot guarantee the index contains all documents. You must run \`db.orders.find({ status: "PENDING", created_at: ... })\`.

<h3>Sparse Indexes</h3>
A Sparse Index only contains entries for documents that actually possess the indexed field. It skips documents where the field is missing.
*Note*: Partial indexes are generally preferred over Sparse indexes because they offer much more control (e.g., you can filter by value, not just existence).

<h3>Text Indexes</h3>
MongoDB provides a native text search engine using Text Indexes. It supports stemming, stop-words, and language-specific rules.
\`\`\`javascript
// Create a text index spanning multiple fields
db.articles.createIndex({ title: "text", content: "text", tags: "text" })

// Querying
db.articles.find({ $text: { $search: "database architecture" } })
// Sorting by relevance score
db.articles.find(
  { $text: { $search: "database" } },
  { score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } })
\`\`\`
**Limitations**:
- You can only have ONE text index per collection.
- It is significantly slower than Atlas Search (Lucene) and lacks fuzzy matching.
- Updating text-indexed fields is highly CPU intensive.

<h3>Wildcard Indexes</h3>
Introduced in MongoDB 4.2. In highly polymorphic schemas, users might define arbitrary custom fields. You cannot predict the schema to create a compound index. A Wildcard Index indexes all scalar fields within a document or subdocument.

\`\`\`javascript
// User can add any custom fields to the userMetadata subdocument
// e.g., "userMetadata.shoeSize", "userMetadata.favoriteColor"
db.users.createIndex({ "userMetadata.$**": 1 })

// The wildcard index will support this query:
db.users.find({ "userMetadata.shoeSize": 10 })
\`\`\`
**Caution**: Wildcard indexes are heavily misunderstood. They do NOT act as a compound index. They act as many separate single-field indexes. A query on \`{ "userMetadata.shoeSize": 10, "userMetadata.age": 25 }\` will use the wildcard index for ONE of the fields, and then scan memory for the other.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Explain the primary benefit of a Partial Index.</strong><br/>A: A Partial Index uses a filter expression to index only a specific subset of documents. This significantly reduces the index's footprint in RAM and disk, and reduces the write-penalty for documents that fall outside the filter criteria.</li>
<li><strong>Q: Why might a query fail to use a Partial Index even if it queries the indexed field?</strong><br/>A: The query must explicitly include the filter criteria defined in the partial index's \`partialFilterExpression\`. If it does not, the query planner assumes the index is incomplete for that query and will perform a collection scan instead.</li>
<li><strong>Q: Differentiate between a Partial Index and a Sparse Index.</strong><br/>A: A Sparse Index only filters based on the *existence* of a field. A Partial Index is much more powerful; it can filter based on specific values or conditions across multiple fields. MongoDB documentation recommends Partial Indexes over Sparse Indexes.</li>
<li><strong>Q: What is a Wildcard Index, and what schema pattern does it solve?</strong><br/>A: A Wildcard Index (\`$**\`) automatically indexes all scalar fields within a document or specified sub-document. It solves the "Attribute Pattern" where users can define arbitrary, unpredictable custom fields in the schema that still need to be queried efficiently.</li>
<li><strong>Q: Can a Wildcard index replace a Compound Index?</strong><br/>A: No. A wildcard index creates a single-field index for every field. If a query filters on two custom fields simultaneously, the database can only use the wildcard index for one of those fields, unlike a true compound index which handles both.</li>
<li><strong>Q: How many text indexes can you have on a single collection? What is the modern alternative to MongoDB's native text index?</strong><br/>A: You can only have one native text index per collection (though it can span multiple fields). The modern, far superior alternative is MongoDB Atlas Search, which embeds Apache Lucene for advanced full-text and fuzzy search capabilities.</li>
</ul>
</div>
    `
  },
  {
    title: "Chapter 30: MongoDB Backup, Restore, and Data Lifecycle",
    content: `
<h2>MongoDB Backup, Restore, and Data Lifecycle</h2>

A database is only as good as its last restorable backup. Ensuring data durability, surviving human error, and managing the lifecycle of aging data are core responsibilities of a Database Engineer.

<h3>mongodump and mongorestore</h3>
The simplest tools for backups are the command-line utilities \`mongodump\` and \`mongorestore\`.
- \`mongodump\` reads BSON data out of the database and writes it to flat files.
- **Limitation**: It is a logical backup. On a large, heavily active database, running \`mongodump\` will cause severe CPU and disk I/O spikes, impacting production traffic. Furthermore, the backup is not a perfect snapshot—data can change while the dump is running.
- **The --oplog flag**: To ensure consistency, you must run \`mongodump --oplog\`. This records the oplog entries that occur *during* the dump process. \`mongorestore --oplogReplay\` then applies the dumped data and replays those operations to create a consistent snapshot.

<h3>Filesystem Snapshots</h3>
For massive deployments (Terabytes), logical backups (\`mongodump\`) are unfeasible. You must rely on physical filesystem snapshots (e.g., AWS EBS Snapshots, LVM snapshots).
- Snapshots are instantaneous at the block level.
- **Crucial Rule**: Before taking a snapshot, the file system must be consistent. In WiredTiger, a snapshot is generally safe, but best practice is to lock writes briefly, force a flush to disk, take the snapshot, and unlock.
\`\`\`javascript
db.fsyncLock() // Locks all writes and flushes dirty pages to disk
// ... trigger EBS snapshot via AWS CLI ...
db.fsyncUnlock() // Resumes normal operation
\`\`\`

<h3>Point-in-Time Recovery (PITR)</h3>
If a developer accidentally drops a collection at 2:15 PM, yesterday's midnight snapshot is not enough. You will lose 14 hours of data.
PITR requires two things:
1. Periodic snapshots (e.g., daily).
2. Continuous archiving of the Oplog.

To recover to 2:14 PM:
1. Restore the daily snapshot.
2. Use \`mongorestore --oplogReplay\` with an \`oplogLimit\` parameter set to the exact timestamp (2:14 PM). The database will replay every action up until that exact second, recovering the data before the drop occurred.

<h3>Data Lifecycle: TTL Collections</h3>
Not all data needs to live forever. Session tokens, event logs, and temporary caches should expire.
Time-To-Live (TTL) indexes allow MongoDB to automatically delete documents after a certain period.
- A background thread checks the TTL index every 60 seconds and deletes expired documents.

\`\`\`javascript
// Delete documents 1 hour (3600s) after their 'createdAt' timestamp
db.sessions.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 3600 }
)
\`\`\`
**Limitations**: TTL deletion is not instantaneous; it happens within a minute of expiration. Furthermore, if massive amounts of data expire simultaneously, the background deletion process can consume significant CPU.

<h3>Interview Questions</h3>
<div class="interview-questions">
<ul>
<li><strong>Q: Why is running a standard \`mongodump\` on a live production database dangerous and potentially inconsistent?</strong><br/>A: It causes high CPU and I/O overhead. More importantly, it is a logical backup that takes time. If a document is updated while the dump is running, the final backup may contain a mix of old and new states. You must use the \`--oplog\` flag to capture a consistent state.</li>
<li><strong>Q: Explain the process of creating a safe Filesystem Snapshot of a MongoDB node.</strong><br/>A: Because data might be in RAM and not yet written to the data files, you should run \`db.fsyncLock()\` to flush all dirty memory pages to disk and temporarily block incoming writes. Then, trigger the underlying OS/Cloud snapshot (like an EBS snapshot). Finally, run \`db.fsyncUnlock()\` to resume traffic.</li>
<li><strong>Q: What two components are strictly required to perform a Point-In-Time Recovery (PITR)?</strong><br/>A: You need a base Snapshot (e.g., taken at midnight) AND a continuous, unbroken backup of the MongoDB Oplog from the time of the snapshot up to the target recovery time.</li>
<li><strong>Q: How do you configure MongoDB to automatically delete session tokens after 24 hours?</strong><br/>A: You create a TTL (Time-To-Live) index on a date field (like \`createdAt\`) and specify the \`expireAfterSeconds\` option set to 86400. A background thread will automatically remove the documents when the time expires.</li>
<li><strong>Q: Is data deleted by a TTL index instantly at the exact second it expires?</strong><br/>A: No. The TTL monitor thread runs in the background every 60 seconds. Therefore, documents may remain in the database for up to a minute (or longer under heavy server load) after their official expiration time.</li>
<li><strong>Q: When would you choose physical snapshots over logical backups (mongodump)?</strong><br/>A: Physical snapshots are mandatory for large datasets (hundreds of GBs to Terabytes) because they are nearly instantaneous at the block level and do not require the database to serialize data to BSON, saving immense amounts of time and avoiding CPU/RAM impact.</li>
</ul>
</div>
    `
  }
];

appendTopics('mongodb', 'MongoDB Database Engineering', 'The definitive guide.', topics);
