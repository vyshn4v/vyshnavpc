import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "change-streams",
    title: "36. Change Streams",
    order: 36,
    content: `
      <h2>Change Streams</h2>
      <p>Change streams allow applications to access real-time data changes without the complexity and risk of tailing the oplog. Applications can use change streams to subscribe to all data changes on a single collection, a database, or an entire deployment, and immediately react to them.</p>
      <h3>How It Works</h3>
      <p>Change streams use the aggregation framework. Applications can filter for specific changes or transform the notifications using an aggregation pipeline.</p>
      <pre><code class="language-javascript">const collection = db.collection('inventory');
const changeStream = collection.watch([{ $match: { 'fullDocument.status': 'A' } }]);
changeStream.on('change', next => {
  console.log(next);
});</code></pre>
    `,
    interviewQuestions: [
      {
        question: "What are Change Streams in MongoDB?",
        answer: "Change streams allow applications to listen to real-time data changes (inserts, updates, deletes) in a collection, database, or cluster without manually polling or tailing the oplog."
      },
      {
        question: "What is required to use change streams?",
        answer: "Change streams require a replica set or a sharded cluster because they rely on the operations log (oplog)."
      }
    ],
    practicalTask: "Create a Node.js script that listens to a change stream on a 'users' collection and logs whenever a new user is inserted."
  },
  {
    slug: "gridfs",
    title: "37. GridFS: Storing Large Files",
    order: 37,
    content: `
      <h2>GridFS: Storing Large Files</h2>
      <p>GridFS is a specification for storing and retrieving files that exceed the BSON-document size limit of 16 MB. Instead of storing a file in a single document, GridFS divides the file into parts, or chunks, and stores each chunk as a separate document.</p>
      <h3>GridFS Collections</h3>
      <p>GridFS uses two collections to store files:</p>
      <ul>
        <li><strong>fs.files:</strong> Stores the file's metadata (filename, content type, length).</li>
        <li><strong>fs.chunks:</strong> Stores the binary chunks of the file.</li>
      </ul>
      <p>When you query GridFS for a file, the driver automatically reassembles the chunks as needed.</p>
    `,
    interviewQuestions: [
      {
        question: "When should you use GridFS?",
        answer: "GridFS should be used when you need to store files larger than the 16MB BSON document size limit, or when you want to access parts of large files without loading the entire file into memory."
      }
    ],
    practicalTask: "Use the GridFS bucket API in Node.js to upload a 20MB dummy file to MongoDB, and then write a function to download it back to the local file system."
  },
  {
    slug: "capped-and-time-series",
    title: "38. Capped Collections & Time Series Collections",
    order: 38,
    content: `
      <h2>Capped Collections</h2>
      <p>Capped collections are fixed-size collections that support high-throughput operations that insert and retrieve documents based on insertion order. When the allocated space is exhausted, MongoDB automatically overwrites the oldest documents.</p>
      <pre><code class="language-javascript">db.createCollection("log", { capped: true, size: 100000, max: 5000 })</code></pre>
      
      <h2>Time Series Collections</h2>
      <p>Time Series collections efficiently store sequences of measurements over a period of time. MongoDB optimizes storage and query performance for time-stamped data, making them ideal for IoT, application metrics, and financial data.</p>
      <pre><code class="language-javascript">db.createCollection(
  "weather",
  { timeseries: { timeField: "timestamp", metaField: "metadata", granularity: "hours" } }
)</code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the primary difference between a capped collection and a regular collection?",
        answer: "A capped collection has a fixed size and automatically overwrites its oldest documents when it reaches its maximum size, ensuring high-speed inserts and retrieval in insertion order."
      },
      {
        question: "What are Time Series collections optimized for?",
        answer: "Time Series collections are optimized for storing and querying sequences of measurements over time, providing better storage efficiency and faster querying for time-based data than regular collections."
      }
    ],
    practicalTask: "Create a time series collection for 'temperature_sensors' and insert several documents representing temperature readings over a 1-hour period. Query the average temperature."
  },
  {
    slug: "mongodb-performance-tuning",
    title: "39. MongoDB Performance Tuning",
    order: 39,
    content: `
      <h2>Performance Tuning</h2>
      <p>Performance tuning in MongoDB involves optimizing schema design, indexing strategies, and configuring the WiredTiger storage engine properly.</p>
      <h3>Analyzing Queries</h3>
      <p>Use the <code>explain()</code> method to analyze how MongoDB executes a query. It provides information on index usage, execution time, and scanned documents.</p>
      <pre><code class="language-javascript">db.users.find({ age: { $gt: 25 } }).explain("executionStats")</code></pre>
      <h3>Working Set Size</h3>
      <p>Your "working set" is the data and indexes frequently accessed by your application. For optimal performance, your entire working set must fit in RAM. If it exceeds RAM, MongoDB will page to disk, causing massive performance degradation.</p>
    `,
    interviewQuestions: [
      {
        question: "How can you identify slow queries in MongoDB?",
        answer: "You can identify slow queries by enabling the database profiler with a specific slowms threshold, checking the system.profile collection, or analyzing the logs for slow operation warnings."
      },
      {
        question: "What does the explain() method do?",
        answer: "The explain() method provides a detailed execution plan for a query, including whether it used an index, how many documents were scanned, and the total execution time."
      }
    ],
    practicalTask: "Enable the database profiler on your local MongoDB instance to log queries taking longer than 50ms. Run a slow query without an index to verify it gets logged."
  },
  {
    slug: "best-practices-and-production-deployment",
    title: "40. Best Practices & Production Deployment",
    order: 40,
    content: `
      <h2>Best Practices & Production Deployment</h2>
      <p>Deploying MongoDB to production requires careful planning around security, high availability, scalability, and backups.</p>
      <h3>Security Checklist</h3>
      <ul>
        <li>Enable Role-Based Access Control (RBAC).</li>
        <li>Require TLS/SSL for all client and intra-cluster communication.</li>
        <li>Bind MongoDB strictly to private IP addresses; avoid public internet exposure.</li>
        <li>Enable encryption at rest for sensitive data.</li>
      </ul>
      <h3>Architecture</h3>
      <p>Always deploy a Replica Set (minimum 3 nodes) for high availability. Use Sharding only when your data or throughput exceeds the capacity of a single powerful machine.</p>
    `,
    interviewQuestions: [
      {
        question: "What are some essential security measures when deploying MongoDB to production?",
        answer: "Essential measures include enabling Role-Based Access Control (RBAC), requiring TLS/SSL for all connections, disabling default network exposure (binding to localhost or private IPs), and encrypting data at rest."
      },
      {
        question: "Why should you always deploy a replica set in production?",
        answer: "Replica sets provide data redundancy, high availability, and automatic failover, protecting your database against the failure of a single server or node."
      }
    ],
    practicalTask: "Draft a deployment checklist for a new MongoDB replica set, detailing the steps to secure the cluster and configure daily automated backups."
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
