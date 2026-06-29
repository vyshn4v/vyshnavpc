import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "multi-document-transactions",
    title: "46. Multi-Document ACID Transactions",
    order: 46,
    content: `
### 1. Conceptual Overview
Multi-document transactions in MongoDB ensure all-or-nothing execution across multiple operations, documents, and collections, providing strict ACID guarantees similar to relational databases.

### 2. Architecture & Mechanics
Transactions use a two-phase commit protocol under the hood. They rely on the WiredTiger storage engine's snapshot isolation and the replication oplog to ensure atomic commits and consistency across replica sets or sharded clusters.

### 3. Implementation: Standard vs Optimized
Standard operations might not use transactions, risking partial updates. Optimized implementations group related multi-document operations within a session using \`session.startTransaction()\` and \`session.commitTransaction()\`, ensuring data integrity.

### 4. Trade-offs & Complexity
Transactions introduce a performance overhead due to locking and coordination. They should only be used when strictly necessary; denormalizing data to avoid multi-document updates is often the preferred, more performant approach.
`,
    interviewQuestions: [
      { question: "What are multi-document transactions in MongoDB?", answer: "They are operations that guarantee ACID properties across multiple documents and collections within a single replica set or sharded cluster." },
      { question: "How does MongoDB maintain snapshot isolation during a transaction?", answer: "WiredTiger uses multi-version concurrency control (MVCC) to provide a consistent snapshot of data to the transaction." },
      { question: "When should you use transactions in MongoDB?", answer: "Transactions should be used sparingly, primarily when operations must span multiple documents and cannot be redesigned into a single-document update." },
      { question: "What is the maximum execution time for a transaction?", answer: "By default, a transaction must commit within 60 seconds or it will be automatically aborted to prevent long-running locks." },
      { question: "Do transactions work in standalone MongoDB instances?", answer: "No, transactions require a replica set or sharded cluster because they rely on the replication oplog." }
    ],
    practicalTask: "Implement a money transfer function between two accounts using MongoDB sessions and transactions in Node.js, ensuring it rolls back on failure."
  },
  {
    slug: "schema-versioning-pattern",
    title: "47. Schema Versioning Pattern",
    order: 47,
    content: `
### 1. Conceptual Overview
The Schema Versioning pattern manages changes to document structures over time, allowing an application to handle multiple document schemas simultaneously without requiring downtime for bulk migrations.

### 2. Architecture & Mechanics
Each document includes a \`schema_version\` field. When the application reads a document, it checks the version and either processes it using the corresponding logic or dynamically upgrades it to the latest version before saving.

### 3. Implementation: Standard vs Optimized
A standard approach might perform massive blocking updates across the entire collection. The optimized schema versioning approach migrates documents lazily upon next read, distributing the write load and preventing downtime.

### 4. Trade-offs & Complexity
This pattern increases application complexity, as the code must handle all supported schema versions or handle on-the-fly migrations. It reduces database bottlenecks at the cost of maintaining migration logic in the application tier.
`,
    interviewQuestions: [
      { question: "What is the Schema Versioning pattern?", answer: "It's a design pattern that adds a version field to documents, allowing the application to evolve data models gracefully without locking the database for migrations." },
      { question: "What is a 'lazy migration'?", answer: "A lazy migration updates a document's schema to the latest version only when it is accessed by the application, avoiding a bulk update." },
      { question: "Why is Schema Versioning useful for continuous delivery?", answer: "It allows new application versions to deploy and operate seamlessly alongside old data, decoupling database updates from application deployments." },
      { question: "How does this pattern affect application code?", answer: "It increases complexity because the application must contain logic to interpret or migrate legacy document versions." },
      { question: "When would you choose a bulk migration over schema versioning?", answer: "When the transformation is complex, requires data from other collections, or when maintaining multiple schema handlers becomes too cumbersome." }
    ],
    practicalTask: "Create a Node.js model that reads a user document, checks its `schema_version`, updates it from version 1 to 2 if necessary, and saves it."
  },
  {
    slug: "geospatial-indexes",
    title: "48. Geospatial Queries and Indexes",
    order: 48,
    content: `
### 1. Conceptual Overview
Geospatial queries allow applications to find locations based on geographic coordinates, supporting operations like finding the nearest stores, intersecting regions, or locating points within a specific boundary.

### 2. Architecture & Mechanics
MongoDB uses GeoJSON objects to store geographic data. It provides \`2dsphere\` indexes that calculate geometries on an earth-like sphere, enabling operators like \`$near\`, \`$geoWithin\`, and \`$geoIntersects\`.

### 3. Implementation: Standard vs Optimized
Standard queries on coordinate fields without indexes require full collection scans. Optimized implementations use \`2dsphere\` indexes and properly ordered GeoJSON data (longitude, latitude) to achieve logarithmic lookup times.

### 4. Trade-offs & Complexity
Geospatial indexes consume memory and slow down write operations. Queries must conform strictly to GeoJSON specifications, and precision can be affected by the spherical projection model used.
`,
    interviewQuestions: [
      { question: "What are geospatial indexes used for?", answer: "They are used to optimize queries that calculate distances, find points within a polygon, or locate nearest neighbors on a spherical surface." },
      { question: "What is the difference between a `2d` and a `2dsphere` index?", answer: "A `2d` index calculates distance on a flat plane, while a `2dsphere` index calculates distance on a spherical earth model." },
      { question: "What coordinate order does GeoJSON require?", answer: "GeoJSON requires coordinates to be specified in longitude, latitude order." },
      { question: "Which operator finds documents near a specified point?", answer: "The `$near` or `$nearSphere` operator." },
      { question: "Can a geospatial index be used as a shard key?", answer: "No, `2d` and `2dsphere` indexes cannot be used as a shard key directly, but a hashed or range key can be combined with them." }
    ],
    practicalTask: "Create a collection of 'restaurants' with GeoJSON locations, build a `2dsphere` index, and write a query to find the top 5 closest restaurants to a specific point."
  },
  {
    slug: "csfle",
    title: "49. Client-Side Field Level Encryption",
    order: 49,
    content: `
### 1. Conceptual Overview
Client-Side Field Level Encryption (CSFLE) ensures that sensitive data is encrypted by the driver before it leaves the application and is only decrypted upon retrieval, hiding plaintext data from the database server itself.

### 2. Architecture & Mechanics
The application securely manages cryptographic keys using a Key Management Service (KMS). The MongoDB driver automatically encrypts fields defined in a JSON schema before transmission and decrypts them automatically if the application possesses the correct key.

### 3. Implementation: Standard vs Optimized
Standard implementations might rely solely on Encryption at Rest, leaving data visible to DBAs. The optimized CSFLE implementation guarantees data privacy even from compromised database administrators or cloud providers.

### 4. Trade-offs & Complexity
CSFLE limits certain database operations (like sorting or inequality queries) on encrypted fields. It introduces complexity in key management, increases application payload sizes, and adds slight cryptographic overhead.
`,
    interviewQuestions: [
      { question: "What is the primary benefit of Client-Side Field Level Encryption?", answer: "It encrypts data within the application layer, ensuring that the database server and administrators only see ciphertext." },
      { question: "How does CSFLE interact with query operations?", answer: "Deterministic encryption supports exact match queries, while randomized encryption provides higher security but prevents querying." },
      { question: "What is a KMS in the context of CSFLE?", answer: "A Key Management Service (like AWS KMS or HashiCorp Vault) securely stores and provides the master keys used to encrypt the data keys." },
      { question: "Can you sort an encrypted field?", answer: "No, because the database only sees the ciphertext, sorting operations on encrypted fields are not supported." },
      { question: "Does CSFLE replace Encryption at Rest?", answer: "No, they complement each other; Encryption at Rest protects the disk, while CSFLE protects data in transit and from privileged database access." }
    ],
    practicalTask: "Configure a local MongoDB script to automatically encrypt a 'SSN' field using a locally managed master key before inserting a user document."
  },
  {
    slug: "sharding-strategies",
    title: "50. Sharding Strategy and Data Distribution",
    order: 50,
    content: `
### 1. Conceptual Overview
Sharding is MongoDB's method for horizontal scaling, distributing data across multiple machines. A well-designed sharding strategy is critical for balancing load and avoiding system bottlenecks.

### 2. Architecture & Mechanics
A sharded cluster consists of shards (replica sets storing data), config servers (storing metadata and cluster configuration), and \`mongos\` query routers (directing client requests). Data is partitioned based on a chosen Shard Key.

### 3. Implementation: Standard vs Optimized
A standard, poorly chosen shard key (like a monotonically increasing ID) can lead to jumbo chunks and hotspots. An optimized strategy uses a hashed shard key for uniform write distribution or a compound ranged key to ensure targeted queries and data locality.

### 4. Trade-offs & Complexity
Sharding drastically increases operational overhead, infrastructure costs, and deployment complexity. Once a collection is sharded, changing the shard key is complex, making the initial design critical for long-term viability.
`,
    interviewQuestions: [
      { question: "What is a shard key?", answer: "A shard key is an indexed field or fields that MongoDB uses to distribute documents across the shards in a cluster." },
      { question: "What is the difference between Ranged and Hashed sharding?", answer: "Ranged sharding groups documents with similar shard keys on the same shard for efficient range queries, while Hashed sharding distributes documents uniformly to prevent write hotspots." },
      { question: "What are jumbo chunks?", answer: "Jumbo chunks occur when multiple documents share the exact same shard key, causing a chunk to exceed the maximum size, making it un-migratable." },
      { question: "What role does the `mongos` router play?", answer: "The `mongos` router acts as a load balancer and interface for the application, routing queries to the appropriate shards based on the config server metadata." },
      { question: "Can a shard key be updated after a document is inserted?", answer: "Starting in MongoDB 4.2, a document's shard key value can be updated, which may result in the document migrating to another shard." }
    ],
    practicalTask: "Evaluate a hypothetical 'Orders' collection and write a brief analysis choosing between a ranged shard key on \`orderDate\` vs a hashed shard key on \`customerId\`."
  }
];

appendTopics('mongodb', 'MongoDB Masterclass', 'Master MongoDB concepts.', topics);
