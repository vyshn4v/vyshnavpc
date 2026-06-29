import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "replica-sets-architecture",
    title: "31. Replica Sets: Architecture",
    order: 31,
    content: `
      <h2>Replica Sets Architecture</h2>
      <p>A replica set in MongoDB is a group of mongod processes that maintain the same data set. Replica sets provide redundancy and high availability, and are the basis for all production deployments.</p>
      <h3>Nodes in a Replica Set</h3>
      <ul>
        <li><strong>Primary Node:</strong> The only member that receives write operations. MongoDB applies write operations on the primary and then records the operations on the primary's oplog (operations log).</li>
        <li><strong>Secondary Nodes:</strong> Maintain a copy of the primary's data set. Secondary members replicate the primary's oplog and apply the operations to their data sets asynchronously.</li>
        <li><strong>Arbiter:</strong> An optional node that does not hold a copy of data but participates in elections to break ties. Used when you have an even number of data-bearing nodes.</li>
      </ul>
      <p>Redundancy provides fault tolerance against the loss of a single database server. With multiple copies of data on different database servers, replication provides a high level of fault tolerance.</p>
    `
  },
  {
    slug: "replica-sets-elections",
    title: "32. Replica Sets: Elections",
    order: 32,
    content: `
      <h2>Replica Set Elections</h2>
      <p>Elections determine which member of a replica set becomes the primary. Replica sets trigger an election in response to various events, such as adding a new node, initiating a replica set, or when the primary node becomes unavailable.</p>
      <h3>How Elections Work</h3>
      <p>If a secondary does not receive a heartbeat from the primary within the <code>electionTimeoutMillis</code> (default 10 seconds), it assumes the primary is dead and calls for an election, nominating itself. Other nodes vote based on who has the most recent oplog entries.</p>
      <p>To become a primary, a node must receive a strict majority of votes. In a 3-node replica set, 2 votes are required. If a cluster loses a majority of its members (e.g., a network partition isolates 2 nodes out of 5), the remaining nodes cannot elect a primary and become read-only.</p>
      <h3>Priority Settings</h3>
      <p>You can configure <code>priority</code> values (0 to 1000) to control which node is more likely to become the primary. A node with priority 0 can never become a primary.</p>
      <pre><code class="language-javascript">cfg = rs.conf()
cfg.members[1].priority = 2
rs.reconfig(cfg)</code></pre>
    `
  },
  {
    slug: "write-concerns",
    title: "33. Write Concerns",
    order: 33,
    content: `
      <h2>Write Concerns</h2>
      <p>Write concern describes the level of acknowledgment requested from MongoDB for write operations. It dictates how many nodes must acknowledge a write before the driver returns success to the application.</p>
      <h3>Levels of Write Concern</h3>
      <ul>
        <li><code>w: 1</code> (Default): Acknowledgment that the write has been applied to the Primary node in memory. Fast, but if the primary crashes before replicating, data is lost.</li>
        <li><code>w: "majority"</code>: Acknowledgment that the write operations have propagated to a calculated majority of the data-bearing voting members. This provides the highest durability and guarantees data won't be rolled back during an election.</li>
        <li><code>w: 0</code>: Unacknowledged write. Fire and forget.</li>
      </ul>
      <h3>The Journal</h3>
      <p>You can also require that the write is physically written to the on-disk journal before acknowledgment using <code>j: true</code>.</p>
      <pre><code class="language-javascript">db.orders.insertOne(
  { item: "laptop", qty: 1 },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
)</code></pre>
    `
  },
  {
    slug: "read-preferences",
    title: "34. Read Preferences",
    order: 34,
    content: `
      <h2>Read Preferences</h2>
      <p>Read preference describes how MongoDB clients route read operations to the members of a replica set.</p>
      <h3>Read Preference Modes</h3>
      <ul>
        <li><code>primary</code> (Default): All read operations are routed to the primary node. Guarantees strong consistency.</li>
        <li><code>primaryPreferred</code>: Reads from the primary if available, otherwise routes to a secondary.</li>
        <li><code>secondary</code>: Routes all reads to secondary nodes. Useful for reporting workloads, but data may be eventually consistent (stale).</li>
        <li><code>secondaryPreferred</code>: Reads from a secondary, but falls back to the primary if no secondary is available.</li>
        <li><code>nearest</code>: Reads from the member with the lowest network latency, regardless of whether it is primary or secondary.</li>
      </ul>
      <h3>Configuring Read Preference in Node.js</h3>
      <pre><code class="language-javascript">const client = new MongoClient('mongodb://localhost/?replicaSet=myRs', {
  readPreference: 'secondaryPreferred'
});</code></pre>
    `
  },
  {
    slug: "sharding-architecture",
    title: "35. Sharding Architecture",
    order: 35,
    content: `
      <h2>Sharding: Horizontal Scaling</h2>
      <p>Sharding is a method for distributing data across multiple machines. MongoDB uses sharding to support deployments with very large data sets and high throughput operations.</p>
      <h3>Components of a Sharded Cluster</h3>
      <ul>
        <li><strong>Shards:</strong> Each shard contains a subset of the sharded data. Each shard should be deployed as a replica set for high availability.</li>
        <li><strong>mongos (Query Routers):</strong> Provide an interface between client applications and the sharded cluster. They route queries and writes to the appropriate shard.</li>
        <li><strong>Config Servers:</strong> Store metadata and configuration settings for the cluster. Config servers must be deployed as a replica set.</li>
      </ul>
      <p>When an application connects, it connects to a <code>mongos</code> router, not directly to the shards. The <code>mongos</code> uses the metadata cached from the config servers to route the operations to the correct shards.</p>
    `
  },
  {
    slug: "shard-keys-and-chunks",
    title: "36. Shard Keys and Chunks",
    order: 36,
    content: `
      <h2>Shard Keys and Chunks</h2>
      <p>To distribute the documents in a collection, MongoDB partitions the collection using the shard key. The shard key consists of an indexed field or fields that exist in every document in the collection.</p>
      <h3>Chunks</h3>
      <p>MongoDB divides the sharded data into chunks. Each chunk has an inclusive lower and exclusive upper range based on the shard key. The mongos routers route requests to shards based on which chunk the document belongs to.</p>
      <h3>Choosing a Shard Key</h3>
      <p>Choosing the correct shard key is the most critical decision in a sharded cluster. A bad shard key can lead to "hot shards" where one server takes all the writes, defeating the purpose of sharding.</p>
      <ul>
        <li><strong>High Cardinality:</strong> A key like "country" might only have 200 distinct values, limiting the maximum number of chunks to 200. Choose a key with many possible values.</li>
        <li><strong>Even Distribution (Frequency):</strong> Avoid monotonically increasing keys (like ObjectIds or timestamps) for write-heavy workloads, as all new inserts will go to the single chunk that holds the "highest" values, causing a hot shard. Hashed shard keys are great for distributing writes evenly.</li>
        <li><strong>Targeted Queries:</strong> Ideally, queries should include the shard key so the mongos can route the query to a single shard, avoiding "scatter-gather" queries across all shards.</li>
      </ul>
    `
  },
  {
    slug: "authentication-and-authorization",
    title: "37. Security: Authentication & RBAC",
    order: 37,
    content: `
      <h2>Security: Authentication & Role-Based Access Control</h2>
      <p>Securing a MongoDB deployment requires enabling Authentication and configuring Authorization.</p>
      <h3>Enabling Authentication</h3>
      <p>In your <code>mongod.conf</code> file, enable security authorization:</p>
      <pre><code class="language-javascript">security:
  authorization: "enabled"</code></pre>
      <h3>Role-Based Access Control (RBAC)</h3>
      <p>MongoDB employs Role-Based Access Control to govern access to a MongoDB system. A user is granted one or more roles that determine their access to database resources.</p>
      <p>Creating a user with read/write access to a specific database:</p>
      <pre><code class="language-javascript">use myAppDatabase
db.createUser({
  user: "appUser",
  pwd: passwordPrompt(),
  roles: [ { role: "readWrite", db: "myAppDatabase" } ]
})</code></pre>
      <p>Common built-in roles include <code>read</code>, <code>readWrite</code>, <code>dbAdmin</code>, <code>userAdmin</code>, and <code>clusterAdmin</code>. Adhere to the Principle of Least Privilege by giving users only the permissions they strictly need.</p>
    `
  },
  {
    slug: "encryption-at-rest-and-transit",
    title: "38. Encryption at Rest and Transit",
    order: 38,
    content: `
      <h2>Encryption: Rest and Transit</h2>
      <p>Protecting data from unauthorized access requires encrypting it both when stored on disk and when moving over a network.</p>
      <h3>Encryption in Transit (TLS/SSL)</h3>
      <p>Always configure MongoDB to require TLS/SSL for all incoming connections. This prevents man-in-the-middle attacks and packet sniffing.</p>
      <pre><code class="language-javascript">net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem</code></pre>
      <h3>Encryption at Rest</h3>
      <p>MongoDB Enterprise Advanced provides a native encryption at rest feature utilizing the WiredTiger storage engine. It encrypts the database files on disk transparently using AES-256.</p>
      <h3>Client-Side Field Level Encryption (CSFLE)</h3>
      <p>With CSFLE, the application encrypts sensitive fields (like SSNs or credit card numbers) before sending them to the database. The database server only sees ciphertext and never has access to the encryption keys. This protects data even if a database administrator's credentials are compromised.</p>
    `
  },
  {
    slug: "performance-tuning",
    title: "39. Performance Tuning and WiredTiger",
    order: 39,
    content: `
      <h2>Performance Tuning and the WiredTiger Storage Engine</h2>
      <p>MongoDB's default storage engine is WiredTiger. Tuning WiredTiger is crucial for maximizing hardware utilization.</p>
      <h3>WiredTiger Cache</h3>
      <p>By default, WiredTiger uses the larger of either 50% of (RAM - 1 GB), or 256 MB. It uses this cache for uncompressed data. The operating system's filesystem cache handles compressed data.</p>
      <p>If you run MongoDB on a dedicated server, the default is usually appropriate. If you run other memory-intensive processes on the same server, you must manually lower the <code>wiredTigerCacheSizeGB</code> in the config file.</p>
      <h3>Connection Pooling</h3>
      <p>Creating a new TCP connection is expensive. Use connection pooling in your drivers to reuse connections. Ensure your application creates a single MongoClient instance at startup and reuses it across all requests, rather than opening a new client for every query.</p>
      <h3>Working Set Size</h3>
      <p>Your "working set" is the data and indexes frequently accessed by your application. For optimal performance, your entire working set must fit in RAM. If it exceeds RAM, MongoDB will page to disk (page faults), causing massive performance degradation.</p>
    `
  },
  {
    slug: "monitoring-and-profiling",
    title: "40. Monitoring and Database Profiler",
    order: 40,
    content: `
      <h2>Monitoring and the Database Profiler</h2>
      <p>Proactive monitoring is required to maintain a healthy database. You need to track metrics like CPU usage, disk I/O, page faults, and slow queries.</p>
      <h3>The Database Profiler</h3>
      <p>The database profiler collects fine-grained data about database operations. By default, profiling is off (level 0). You can set it to level 1 to log slow operations, or level 2 to log all operations.</p>
      <pre><code class="language-javascript">// Log queries taking longer than 100 milliseconds
db.setProfilingLevel(1, { slowms: 100 })</code></pre>
      <p>The profiler writes to the <code>system.profile</code> collection. You can query this collection to identify bad queries.</p>
      <pre><code class="language-javascript">db.system.profile.find({ op: "query" }).sort({ millis: -1 }).limit(5)</code></pre>
      <h3>MongoDB Cloud Manager / Atlas</h3>
      <p>For production, visual monitoring tools like MongoDB Cloud Manager or the Atlas Dashboard provide historical graphs, alerting on thresholds, and performance advisor recommendations for missing indexes based on real traffic.</p>
    `
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
