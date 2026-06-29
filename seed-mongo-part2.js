import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "introduction-to-indexes",
    title: "11. Introduction to Indexes",
    order: 11,
    content: `
      <h2>Indexes in MongoDB</h2>
      <p>Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a <em>collection scan</em>, i.e. scan every document in a collection, to select those documents that match the query statement. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.</p>
      <h3>Creating an Index</h3>
      <p>Use the <code>createIndex()</code> method to create an index on a collection. To create an index on the "score" field in descending order:</p>
      <pre><code class="language-javascript">db.records.createIndex({ score: -1 })</code></pre>
      <h3>Types of Indexes</h3>
      <ul>
        <li><strong>Single Field:</strong> An index on a single field of a document.</li>
        <li><strong>Compound Index:</strong> An index on multiple fields. For example: <code>{ userid: 1, score: -1 }</code>.</li>
        <li><strong>Multikey Index:</strong> To index fields that hold arrays, MongoDB creates an index key for each element in the array.</li>
      </ul>
      <p>Indexes improve read performance but add overhead to write operations. Therefore, you should index only the fields you query frequently.</p>
    `
  },
  {
    slug: "advanced-querying",
    title: "12. Advanced Querying: Text and Regex",
    order: 12,
    content: `
      <h2>Advanced Querying in MongoDB</h2>
      <p>MongoDB supports complex query types such as Regular Expressions and Full-Text Search.</p>
      <h3>Regular Expressions</h3>
      <p>The <code>$regex</code> operator provides regular expression capabilities for pattern matching strings in queries.</p>
      <pre><code class="language-javascript">db.users.find({ name: { $regex: /^A/ } }) // Names starting with A
db.users.find({ name: { $regex: /son$/i } }) // Names ending in 'son', case-insensitive</code></pre>
      <h3>Text Search</h3>
      <p>To perform text search, you first need to create a text index on the fields you want to search.</p>
      <pre><code class="language-javascript">db.articles.createIndex({ title: "text", content: "text" })</code></pre>
      <p>Then, you can use the <code>$text</code> query operator to search for words.</p>
      <pre><code class="language-javascript">db.articles.find({ $text: { $search: "database performance" } })</code></pre>
      <p>Text search supports language-specific stemming, stop words, and phrase matching.</p>
    `
  },
  {
    slug: "geospatial-queries",
    title: "13. Geospatial Queries",
    order: 13,
    content: `
      <h2>Geospatial Queries</h2>
      <p>MongoDB supports geospatial queries through the use of <code>2dsphere</code> and <code>2d</code> indexes. This allows you to store GeoJSON objects and query them based on location.</p>
      <h3>Storing Location Data</h3>
      <p>Store location data as GeoJSON Point objects:</p>
      <pre><code class="language-javascript">db.places.insertOne({
  name: "Central Park",
  location: { type: "Point", coordinates: [ -73.9654, 40.7829 ] }
})</code></pre>
      <h3>Creating a 2dsphere Index</h3>
      <pre><code class="language-javascript">db.places.createIndex({ location: "2dsphere" })</code></pre>
      <h3>Finding Near Locations</h3>
      <p>You can use the <code>$near</code> operator to find places close to a specific point:</p>
      <pre><code class="language-javascript">db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [ -73.96, 40.78 ] },
      $maxDistance: 5000 // 5 kilometers
    }
  }
})</code></pre>
    `
  },
  {
    slug: "gridfs",
    title: "14. Storing Large Files with GridFS",
    order: 14,
    content: `
      <h2>GridFS</h2>
      <p>GridFS is a specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB. Instead of storing a file in a single document, GridFS divides the file into parts, or chunks, and stores each chunk as a separate document.</p>
      <h3>How GridFS Works</h3>
      <p>GridFS uses two collections to store files. One collection stores the file chunks, and the other stores file metadata.</p>
      <ul>
        <li><code>fs.files</code>: Contains metadata about the files.</li>
        <li><code>fs.chunks</code>: Contains the actual binary chunks of the files.</li>
      </ul>
      <h3>Using GridFS with Node.js</h3>
      <p>Here is an example of uploading a file using GridFS in Node.js:</p>
      <pre><code class="language-javascript">const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');

async function uploadFile() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('myDatabase');
  
  const bucket = new GridFSBucket(db);
  fs.createReadStream('./video.mp4')
    .pipe(bucket.openUploadStream('video.mp4'))
    .on('finish', () => {
      console.log('Upload complete');
      client.close();
    });
}</code></pre>
    `
  },
  {
    slug: "capped-collections",
    title: "15. Capped Collections",
    order: 15,
    content: `
      <h2>Capped Collections</h2>
      <p>Capped collections are fixed-size collections that support high-throughput operations that insert and read documents based on insertion order. Capped collections work in a way similar to circular buffers: once a collection fills its allocated space, it makes room for new documents by overwriting the oldest documents in the collection.</p>
      <h3>Creating a Capped Collection</h3>
      <p>You must explicitly create a capped collection using the <code>createCollection</code> command, specifying its maximum size in bytes.</p>
      <pre><code class="language-javascript">db.createCollection("log", { capped: true, size: 100000 })</code></pre>
      <p>You can also specify a maximum number of documents using the <code>max</code> parameter:</p>
      <pre><code class="language-javascript">db.createCollection("log", { capped: true, size: 100000, max: 5000 })</code></pre>
      <h3>Use Cases</h3>
      <p>Capped collections are ideal for logging application events, storing recent activity feeds, or implementing simple messaging queues where only the most recent data is relevant.</p>
    `
  },
  {
    slug: "bulk-write-operations",
    title: "16. Bulk Write Operations",
    order: 16,
    content: `
      <h2>Bulk Write Operations</h2>
      <p>MongoDB provides the ability to perform bulk write operations in a single method call. This significantly reduces the network overhead of making multiple individual round trips to the server.</p>
      <h3>The bulkWrite() Method</h3>
      <p>The <code>bulkWrite()</code> method allows you to execute a series of insert, update, replace, and delete operations.</p>
      <pre><code class="language-javascript">db.characters.bulkWrite([
  { insertOne: { document: { name: "Aragorn", race: "Human" } } },
  { insertOne: { document: { name: "Legolas", race: "Elf" } } },
  { updateOne: {
      filter: { name: "Frodo" },
      update: { $set: { status: "Ring Bearer" } }
  }},
  { deleteOne: { filter: { name: "Boromir" } } }
])</code></pre>
      <h3>Ordered vs Unordered Operations</h3>
      <p>By default, MongoDB executes bulk operations in order. If an error occurs during an ordered operation, MongoDB returns without processing any remaining write operations in the list. You can specify <code>ordered: false</code> to allow MongoDB to continue processing remaining operations even if an error occurs.</p>
    `
  },
  {
    slug: "introduction-to-transactions",
    title: "17. Introduction to Transactions",
    order: 17,
    content: `
      <h2>Multi-Document Transactions</h2>
      <p>While single-document operations in MongoDB are always atomic, sometimes you need to guarantee the atomicity of operations across multiple documents or collections. MongoDB supports multi-document ACID transactions.</p>
      <h3>Using Transactions</h3>
      <p>To use transactions, you must be connected to a replica set or a sharded cluster. Transactions are associated with a Client Session.</p>
      <pre><code class="language-javascript">const session = client.startSession();
session.startTransaction();

try {
  await db.collection("accounts").updateOne(
    { name: "Alice" },
    { $inc: { balance: -100 } },
    { session }
  );
  
  await db.collection("accounts").updateOne(
    { name: "Bob" },
    { $inc: { balance: 100 } },
    { session }
  );
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}</code></pre>
      <p>Use transactions sparingly. Most use cases can be solved through proper data modeling (embedding) without incurring the performance cost of transactions.</p>
    `
  },
  {
    slug: "change-streams",
    title: "18. Change Streams",
    order: 18,
    content: `
      <h2>Change Streams</h2>
      <p>Change streams allow applications to access real-time data changes without the complexity and risk of tailing the oplog. Applications can subscribe to all data changes on a single collection, a database, or an entire deployment.</p>
      <h3>Watching a Collection</h3>
      <p>You can listen to changes using the <code>watch()</code> method.</p>
      <pre><code class="language-javascript">const collection = db.collection('inventory');
const changeStream = collection.watch();

changeStream.on('change', next => {
  console.log('Detected a change:', next);
  if (next.operationType === 'insert') {
    console.log('New document inserted:', next.fullDocument);
  }
});</code></pre>
      <h3>Filtering Change Streams</h3>
      <p>You can pass an aggregation pipeline to <code>watch()</code> to filter the events you receive. For example, to only receive update events:</p>
      <pre><code class="language-javascript">const pipeline = [{ $match: { 'operationType': 'update' } }];
const changeStream = collection.watch(pipeline);</code></pre>
    `
  },
  {
    slug: "backup-and-restore",
    title: "19. Backup and Restore",
    order: 19,
    content: `
      <h2>Backup and Restore Strategies</h2>
      <p>Ensuring data durability means taking regular backups. MongoDB offers several methods for backing up your data.</p>
      <h3>mongodump and mongorestore</h3>
      <p>The <code>mongodump</code> utility reads data from a MongoDB database and creates a high-fidelity BSON file. <code>mongorestore</code> can populate a MongoDB database using the output of mongodump.</p>
      <pre><code class="language-javascript"># Backup a specific database
mongodump --db myDatabase --out /backups/mongodump-2023-10-01

# Restore a database
mongorestore --db myDatabase /backups/mongodump-2023-10-01/myDatabase</code></pre>
      <h3>File System Snapshots</h3>
      <p>For large deployments, mongodump can be slow. A faster approach is to take a snapshot of the underlying file system (e.g., LVM snapshots or AWS EBS snapshots). To ensure consistency, you must lock the database against writes using <code>db.fsyncLock()</code> before taking the snapshot, and <code>db.fsyncUnlock()</code> afterward.</p>
      <h3>MongoDB Atlas Backups</h3>
      <p>If you use MongoDB Atlas, automated continuous backups and snapshot backups are provided out-of-the-box, allowing you to restore to a specific point in time without manual intervention.</p>
    `
  },
  {
    slug: "data-import-export",
    title: "20. Data Import and Export",
    order: 20,
    content: `
      <h2>Importing and Exporting Data</h2>
      <p>While mongodump outputs BSON files, sometimes you need to work with human-readable formats like JSON or CSV. MongoDB provides <code>mongoexport</code> and <code>mongoimport</code> for this purpose.</p>
      <h3>mongoexport</h3>
      <p>Use <code>mongoexport</code> to export data to JSON or CSV.</p>
      <pre><code class="language-javascript"># Export to JSON
mongoexport --db users --collection contacts --out contacts.json

# Export to CSV (requires specifying fields)
mongoexport --db users --collection contacts --type=csv --fields name,email,phone --out contacts.csv</code></pre>
      <h3>mongoimport</h3>
      <p>Use <code>mongoimport</code> to load data from JSON or CSV files.</p>
      <pre><code class="language-javascript"># Import from JSON
mongoimport --db users --collection contacts --file contacts.json

# Import from CSV (with headerline)
mongoimport --db users --collection contacts --type=csv --headerline --file contacts.csv</code></pre>
      <p>These tools are extremely useful for migrating data between different environments or for data analysis in external tools like Excel or Pandas.</p>
    `
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
