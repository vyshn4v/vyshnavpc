import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'replica-sets-high-availability',
    title: '11. MongoDB Replica Sets and High Availability',
    order: 11,
    content: `
# MongoDB Replica Sets and High Availability

High Availability (HA) ensures that a database system remains accessible and operational even in the event of hardware failures or network partitions. In MongoDB, HA is achieved through **Replica Sets**.

## What is a Replica Set?
A replica set is a group of \`mongod\` instances that maintain the exact same dataset. It provides redundancy, preventing a single point of failure.

### Architecture of a Replica Set
A standard replica set consists of a minimum of three nodes:
1. **Primary Node:** The only node that accepts write operations. It records all changes to its datasets in its **oplog** (operations log).
2. **Secondary Node(s):** These nodes continuously replicate the primary's oplog and apply operations to their own datasets, mirroring the primary. They can optionally handle read operations.
3. **Arbiter (Optional):** An arbiter participates in elections but does not hold a copy of the data. It is used to break ties when you have an even number of data-bearing nodes (to save costs).

## The Election Process
If the Primary node fails or becomes unreachable, the replica set automatically holds an **Election** to choose a new Primary.
- The remaining nodes communicate via heartbeats.
- If a Secondary stops receiving heartbeats from the Primary for a specific timeout (default 10 seconds), it calls for an election.
- The node with the most up-to-date oplog and highest priority votes wins.
- The failover process is automatic and usually completes within seconds, during which writes are temporarily paused.

## Read Preferences
By default, all read and write operations go to the Primary to ensure strong consistency. However, you can configure your application to read from Secondaries to distribute the read load.

- **primary (Default):** All reads go to the primary. Strict consistency.
- **primaryPreferred:** Reads go to the primary, but if it is unavailable, reads fallback to secondaries.
- **secondary:** All reads go to secondaries. If no secondaries are available, the query fails.
- **secondaryPreferred:** Reads go to secondaries, but fallback to the primary if needed.
- **nearest:** Reads from the node with the lowest network latency.

*Warning: Reading from secondaries means your application must be tolerant of "eventual consistency" (reading slightly stale data).*

## The Oplog
The oplog (operations log) is a special capped collection that keeps a rolling record of all operations that modify the data. Secondaries query this collection to replicate operations.
If a secondary goes offline for longer than the oplog's capacity holds (oplog window), it falls completely out of sync and requires a full initial sync from scratch upon returning.
    `,
    interviewQuestions: [
      {
        question: 'What is the minimum recommended number of nodes in a MongoDB replica set?',
        answer: 'Three. Usually, this means one Primary and two Secondaries, or one Primary, one Secondary, and one Arbiter. This ensures a strict majority can be formed during an election to choose a new primary if one node fails.'
      },
      {
        question: 'What role does an Arbiter play in a replica set?',
        answer: 'An arbiter does not store a copy of the data and cannot become a primary. Its sole purpose is to participate in elections and cast a vote to break ties, allowing a replica set to maintain a majority without the cost of an additional data-bearing node.'
      },
      {
        question: 'Explain what happens during a failover event.',
        answer: 'If the primary becomes unresponsive to heartbeats, the remaining nodes hold an election. The secondary with the most up-to-date data is elected as the new primary. Write operations are temporarily suspended until the election completes.'
      },
      {
        question: 'What is the oplog and why is it important?',
        answer: 'The oplog (operations log) is a capped collection on the primary that records all modifying operations. Secondaries read the oplog and apply these operations locally to stay synchronized. If the oplog rolls over before a down secondary recovers, it must perform a costly full initial sync.'
      },
      {
        question: 'When is it appropriate to use a Read Preference of "secondary"?',
        answer: 'When your application needs to offload heavy analytical reads from the primary node and is strictly tolerant of eventual consistency (meaning reading data that might be milliseconds or seconds out of date).'
      }
    ],
    practicalTask: {
      scenario: 'You are initializing a new local replica set for testing.',
      task: 'Write the command used in the mongo shell to initiate a replica set, assuming the mongod processes are started with --replSet "rs0".',
      solutionCode: `rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
})`
    }
  },
  {
    slug: 'sharding-horizontal-scalability',
    title: '12. Sharding for Horizontal Scalability',
    order: 12,
    content: `
# Sharding for Horizontal Scalability

When an application's data size outgrows the storage or memory capacity of a single server (or replica set), or when write operations exceed the CPU/IO capacity, MongoDB utilizes **Sharding**.
Sharding is the process of storing data records across multiple machines (horizontal scaling).

## Sharded Cluster Components
A MongoDB sharded cluster consists of three main components:

1. **Shards:** Each shard contains a subset of the sharded data. In production, each shard is deployed as a Replica Set to ensure high availability.
2. **Config Servers:** These servers store the metadata and configuration settings for the cluster. They track which chunk of data lives on which shard.
3. **Query Routers (mongos):** The application connects to a \`mongos\` router instead of a specific shard. The mongos consults the Config Servers and routes the read/write operations to the appropriate Shard(s).

## The Shard Key
To distribute documents across shards, MongoDB relies on a **Shard Key**. This is a specific field (or fields) that exists in every document in the collection.

MongoDB partitions the shard key space into **Chunks**. Each chunk has an inclusive lower bound and an exclusive upper bound based on the shard key. The **Balancer** is a background process that migrates chunks across shards to ensure an even distribution.

### Choosing a Good Shard Key
The choice of shard key is the most critical decision in a sharded architecture. A poor shard key can lead to "jumbo chunks" or severe performance bottlenecks.

**Criteria for a good shard key:**
- **High Cardinality:** The key must have a large number of possible values (e.g., \`userId\` has high cardinality; \`countryCode\` usually has low cardinality).
- **Even Data Distribution:** It shouldn't cause all new writes to hit a single shard (avoid monotonically increasing keys like \`Date\` or sequential IDs on their own).
- **Targeted Queries:** The key should ideally be included in most of your application's query filters to allow the mongos to route queries directly to a single shard (Targeted Query) rather than broadcasting it to all shards (Scatter-Gather).

## Sharding Strategies

1. **Ranged Sharding:** Divides data based on ranges of the shard key values. Great for range-based queries (e.g., sorting by age), but can lead to "hotspots" if data is continuously inserted at the end of the range.
2. **Hashed Sharding:** Computes a hash of the shard key's value and uses that hash to assign chunks. Ensures a very even distribution of write loads, preventing hotspots, but range queries become inefficient because data is randomized across shards.
    `,
    interviewQuestions: [
      {
        question: 'What is the purpose of the mongos router in a sharded cluster?',
        answer: 'The mongos acts as a query router, providing an interface between the application and the sharded cluster. It caches metadata from the config servers to know where data lives and routes client requests to the correct shards.'
      },
      {
        question: 'Why is choosing the right shard key critical?',
        answer: 'Because a poor shard key can cause uneven data distribution, leading to hotspots where one shard receives all the writes (e.g., using a sequential timestamp), or result in inefficient queries that must be broadcast to all shards (scatter-gather).'
      },
      {
        question: 'What is the difference between Hashed Sharding and Ranged Sharding?',
        answer: 'Hashed sharding distributes data evenly by hashing the shard key, great for heavy write loads but bad for range queries. Ranged sharding keeps contiguous values together, making range queries efficient but risking write hotspots.'
      },
      {
        question: 'What is a "scatter-gather" query?',
        answer: 'When a query does not include the shard key, the mongos router does not know which shard holds the data. It must broadcast the query to all shards, gather the results, and merge them. This is highly inefficient and should be minimized.'
      },
      {
        question: 'What is the role of the Balancer in a sharded cluster?',
        answer: 'The balancer is a background process that monitors the number of chunks on each shard. If the distribution becomes uneven, it automatically migrates chunks from shards with many chunks to shards with fewer chunks.'
      }
    ],
    practicalTask: {
      scenario: 'You are setting up sharding for a "users" collection.',
      task: 'Write the command to enable sharding on the "mydatabase" database, and the command to shard the "users" collection using a hashed shard key on the "_id" field.',
      solutionCode: `sh.enableSharding("mydatabase");
sh.shardCollection("mydatabase.users", { _id: "hashed" });`
    }
  },
  {
    slug: 'security-best-practices',
    title: '13. Security Best Practices',
    order: 13,
    content: `
# Security Best Practices

Securing a MongoDB deployment is paramount. Early versions of MongoDB shipped with insecure defaults (listening on public interfaces without authentication), leading to widespread data breaches. Modern versions have secure defaults, but robust security requires a defense-in-depth approach.

## 1. Authentication and Authorization
Always enable **Authentication**. 

MongoDB uses **Role-Based Access Control (RBAC)** to govern access.
Instead of giving users direct access, you grant them Roles. A role grants specific privileges (actions) on specific resources (databases/collections).

**Built-in Roles include:**
- \`read\`: Can only read data.
- \`readWrite\`: Can read and modify data.
- \`dbAdmin\`: Can perform administrative tasks like index creation, but cannot read/write application data.
- \`userAdminAnyDatabase\`: Can create and modify users and roles (Superuser equivalent for user management).

\`\`\`javascript
// Creating a user with strict privileges
db.createUser({
  user: "appRunner",
  pwd: passwordPrompt(), // Securely enter password
  roles: [
    { role: "readWrite", db: "ecommerce" }
  ]
})
\`\`\`

## 2. Network Security
- **Bind IP:** Ensure MongoDB is bound only to private IP addresses or localhost (\`bindIp: 127.0.0.1\`). It should never be exposed directly to the public internet.
- **Firewalls:** Configure VPCs and firewalls so only trusted application servers can reach the MongoDB port (default 27017).
- **TLS/SSL Encryption in Transit:** Always encrypt network traffic between the application and MongoDB, and between nodes within a replica set/sharded cluster using TLS.

## 3. Encryption at Rest
Encryption at rest ensures that even if someone steals the physical hard drives, they cannot read the database files.
- MongoDB Enterprise and Atlas support native **WiredTiger Encryption at Rest**, integrating with Key Management Systems (KMS like AWS KMS, HashiCorp Vault).
- Alternatively, use OS-level disk encryption (e.g., LUKS for Linux, BitLocker for Windows).

## 4. Auditing
MongoDB Enterprise provides an auditing framework to track administrative and data manipulation activities. This is crucial for compliance (HIPAA, GDPR, SOC2). It can log every time a user logs in, creates an index, or queries a specific collection.

## 5. Field-Level Encryption (Client-Side)
Client-Side Field Level Encryption (CSFLE) allows the application driver to encrypt specific sensitive fields (like SSNs or credit card numbers) *before* sending them to the database. The database only sees ciphertext, meaning DBAs cannot view the sensitive data.
    `,
    interviewQuestions: [
      {
        question: 'What is Role-Based Access Control (RBAC) in MongoDB?',
        answer: 'RBAC is a security mechanism where access privileges are grouped into "roles". Instead of assigning permissions to users directly, you assign users to roles (like readWrite or dbAdmin), making permission management scalable and secure.'
      },
      {
        question: 'How do you prevent MongoDB from being accessible over the public internet?',
        answer: 'By configuring the bindIp setting in the mongod.conf file to only listen on private IP addresses or localhost, and by configuring network firewalls/VPCs to block inbound traffic on port 27017 from unauthorized IP addresses.'
      },
      {
        question: 'What is the difference between Encryption in Transit and Encryption at Rest?',
        answer: 'Encryption in transit (TLS/SSL) protects data while it is moving over the network between the app and the database. Encryption at rest encrypts the actual database files on the hard drive, protecting against physical theft of the server.'
      },
      {
        question: 'What is Client-Side Field Level Encryption (CSFLE)?',
        answer: 'CSFLE is a feature where the MongoDB driver encrypts specific sensitive fields locally within the application before sending them to the database server. The database never sees the plaintext, protecting data even from database administrators.'
      },
      {
        question: 'Why should you avoid using the root or clusterAdmin role for application database connections?',
        answer: 'Using root violates the principle of least privilege. If the application is compromised, the attacker gains full control over the entire database server. Applications should use a dedicated user with only readWrite access to the specific database they need.'
      }
    ],
    practicalTask: {
      scenario: 'You are setting up credentials for a new reporting tool that needs to analyze data across multiple collections but should not be able to modify anything.',
      task: 'Write the MongoDB shell command to create a user named "reporter" on the "analytics" database with a secure role.',
      solutionCode: `use analytics;
db.createUser({
  user: "reporter",
  pwd: "SecurePassword123!",
  roles: [
    { role: "read", db: "analytics" }
  ]
});`
    }
  },
  {
    slug: 'backups-restoration-maintenance',
    title: '14. Database Backups, Restoration, and Maintenance',
    order: 14,
    content: `
# Database Backups, Restoration, and Maintenance

Having a robust backup and restoration strategy is the ultimate safety net against catastrophic data loss, accidental drops, or ransomware attacks.

## Backup Strategies

### 1. MongoDB Atlas Backups
If using Atlas, backups are fully managed. 
- **Continuous Cloud Backups:** Takes snapshots incrementally.
- **Point-in-Time Recovery (PITR):** Allows restoring the database to the exact minute of a failure using oplog data.

### 2. mongodump and mongorestore (Logical Backups)
These are CLI utilities that export BSON data. They read data from the database and write it to disk.
- **Pros:** Easy to use, great for migrating data between different versions or moving data locally.
- **Cons:** Extremely slow for large datasets. Restoring rebuilds all indexes, which is CPU intensive. Does not guarantee point-in-time consistency unless you use the \`--oplog\` flag.

\`\`\`bash
# Create a logical backup of a specific database
mongodump --uri="mongodb://localhost:27017" --db=ecommerce --out=/backups/ecommerce_backup

# Restore the logical backup
mongorestore --uri="mongodb://localhost:27017" --db=ecommerce /backups/ecommerce_backup/ecommerce
\`\`\`

### 3. File System Snapshots (Physical Backups)
For large, self-managed deployments, physical backups are preferred. This involves taking a snapshot of the underlying file system (e.g., LVM snapshots, AWS EBS snapshots).
- **Pros:** Extremely fast backup and restore times, regardless of database size.
- **Cons:** Requires the file system to support snapshots. To ensure consistency, you must lock the database against writes using \`db.fsyncLock()\` before taking the snapshot, and \`db.fsyncUnlock()\` after.

## Maintenance Operations

### Compaction
Over time, as documents are updated and deleted, MongoDB's storage engine (WiredTiger) can accumulate fragmented free space.
Normally, WiredTiger reuses this space for new documents. However, if you delete a massive amount of data and want to return that disk space to the Operating System, you must run a \`compact\` command.
*Warning: Compaction blocks all other operations on the collection while it runs.*

### Index Rebuilding
Indexes can sometimes become bloated. You can rebuild them using \`db.collection.reIndex()\` (though usually only needed on standalone instances, as replica sets handle this during initial sync).

### Version Upgrades
Always upgrade incrementally (e.g., 4.2 -> 4.4 -> 5.0). Upgrades in a replica set should be done as a **Rolling Upgrade**:
1. Upgrade one secondary.
2. Upgrade the other secondary.
3. Step down the primary (forcing an election).
4. Upgrade the former primary.
This ensures zero downtime.
    `,
    interviewQuestions: [
      {
        question: 'What is the difference between mongodump and a file system snapshot?',
        answer: 'mongodump creates a logical backup by reading documents and saving them as BSON files, which is slow for large datasets. A file system snapshot copies the underlying physical data files on disk, which is significantly faster and more scalable.'
      },
      {
        question: 'Why must you use the --oplog flag when using mongodump on a live replica set?',
        answer: 'mongodump takes time to run. Without --oplog, any writes that occur during the dump process are lost, resulting in an inconsistent backup. The --oplog flag captures changes made during the dump to ensure point-in-time consistency upon restore.'
      },
      {
        question: 'What is Point-in-Time Recovery (PITR)?',
        answer: 'PITR is a backup feature that combines snapshots with continuous oplog backups. It allows administrators to restore a database to a highly specific point in time (e.g., 2:14 PM), usually just seconds before a catastrophic error occurred.'
      },
      {
        question: 'How do you perform a zero-downtime upgrade of a MongoDB replica set?',
        answer: 'You perform a rolling upgrade. First, upgrade the secondary nodes one by one. Once they are up to date, use rs.stepDown() on the primary to hand over leadership to an upgraded secondary, then upgrade the former primary.'
      },
      {
        question: 'What command must you run before taking a physical file system snapshot of MongoDB?',
        answer: 'You should run db.fsyncLock() to flush all pending writes to disk and lock the database to prevent new writes, ensuring the snapshot captures a completely consistent state. Afterwards, run db.fsyncUnlock().'
      }
    ],
    practicalTask: {
      scenario: 'A junior developer accidentally ran a destructive script and you need to restore the users collection from a backup file located at /tmp/backup/users.bson.',
      task: 'Write the mongorestore terminal command to restore this specific collection into the production database.',
      solutionCode: `mongorestore --uri="mongodb+srv://admin:password@cluster.mongodb.net" \\
  --db=production \\
  --collection=users \\
  --drop \\
  /tmp/backup/users.bson`
    }
  },
  {
    slug: 'monitoring-and-diagnostics',
    title: '15. MongoDB Monitoring and Diagnostics',
    order: 15,
    content: `
# MongoDB Monitoring and Diagnostics

Proactive monitoring is critical for maintaining performance and preventing outages. You cannot fix what you cannot see.

## Server Status
The \`db.serverStatus()\` command provides a massive document containing real-time metrics about the mongod instance.
- **connections:** Current active and available connections.
- **opcounters:** Number of inserts, queries, updates, deletes since the server started.
- **network:** Bytes in and out.
- **wiredTiger.cache:** Detailed metrics on memory cache usage.

## The Database Profiler
The database profiler collects fine-grained data about database operations. It writes this data to a capped collection named \`system.profile\`.

### Profiling Levels
- **Level 0:** The profiler is off (Default).
- **Level 1:** Logs slow operations (operations taking longer than the \`slowms\` threshold, default 100ms).
- **Level 2:** Logs *all* operations. (Do not use in production as it causes severe performance degradation).

\`\`\`javascript
// Set profiling level to 1, logging queries taking longer than 50ms
db.setProfilingLevel(1, { slowms: 50 })

// Query the system.profile collection to find the slowest recent queries
db.system.profile.find().sort({ millis: -1 }).limit(5)
\`\`\`

## currentOp and Killing Queries
If your database suddenly spikes to 100% CPU, a bad query is likely running without an index.

You can view currently running operations using \`db.currentOp()\`.
\`\`\`javascript
// Find operations taking longer than 3 seconds
db.currentOp({
  "active": true,
  "secs_running": { $gt: 3 }
})
\`\`\`

Once you identify the rogue query's \`opid\`, you can kill it to restore database stability:
\`\`\`javascript
db.killOp("opid_here")
\`\`\`

## Visual Monitoring Tools
While CLI tools are great for debugging, production systems require visual dashboards and alerting.
- **MongoDB Atlas Metrics:** Built-in charts showing IOPS, CPU, Connections, and Query targeting metrics.
- **MongoDB Cloud Manager / Ops Manager:** For self-managed deployments.
- **Prometheus and Grafana:** Using the MongoDB Exporter, you can pipe metrics into Prometheus and visualize them in Grafana.

## Key Metrics to Watch
1. **Query Targeting (Scanned vs Returned):** If MongoDB is scanning 10,000 documents to return 1, you are missing indexes.
2. **Page Faults:** High page faults mean MongoDB is constantly reading from disk into RAM, indicating your working set no longer fits in memory.
3. **Replication Lag:** The delay between an operation occurring on the primary and being applied on a secondary. High lag compromises HA and stale reads.
4. **Connection Counts:** Sudden spikes can indicate connection pool exhaustion or a bottleneck in the application layer.
    `,
    interviewQuestions: [
      {
        question: 'What does the Database Profiler do, and what is its default state?',
        answer: 'The Database Profiler logs performance data about database operations to the system.profile collection. By default, it is turned off (Level 0) to save overhead, but it is commonly set to Level 1 to log queries slower than a specific threshold.'
      },
      {
        question: 'How do you identify a query that is currently hanging and consuming all CPU resources?',
        answer: 'You use the db.currentOp() command, filtering for active queries and looking at the "secs_running" or "microsecs_running" fields to find long-running operations.'
      },
      {
        question: 'If you find a rogue query using db.currentOp(), how do you stop it?',
        answer: 'You take the "opid" (Operation ID) from the currentOp output and pass it to the db.killOp("opid") command.'
      },
      {
        question: 'What does a high ratio of "Documents Scanned" to "Documents Returned" indicate?',
        answer: 'It indicates poor query targeting, meaning MongoDB is having to examine a large number of documents to find the ones that match the query. This almost always means the query is lacking an appropriate index.'
      },
      {
        question: 'What is Replication Lag?',
        answer: 'Replication lag is the time delay between when a write operation occurs on the Primary node and when that same operation is applied to a Secondary node. High lag means secondaries are struggling to keep up with the primary.'
      }
    ],
    practicalTask: {
      scenario: 'The application is suddenly very slow. You suspect a long-running aggregation pipeline is locking up resources.',
      task: 'Write the MongoDB shell commands to first find all active operations running longer than 5 seconds, and then the command you would use to kill an operation with ID 12345.',
      solutionCode: `// Find slow ops
db.currentOp({
  active: true,
  secs_running: { $gte: 5 }
});

// Kill the rogue op
db.killOp(12345);`
    }
  }
];

appendTopics('mongodb', 'MongoDB Database Engineering', 'The definitive guide to mastering MongoDB from fundamentals to advanced distributed architectures.', topics).catch(console.error);
