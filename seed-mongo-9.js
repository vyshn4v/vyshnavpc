import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "41. MongoDB Time Series Collections",
    slug: "mongodb-time-series-collections",
    description: "Deep dive into storing and analyzing time-series data efficiently in MongoDB.",
    order: 41,
    content: `
### 1. Conceptual Overview
Time Series Collections in MongoDB are designed specifically for data that changes over time, such as IoT sensor readings, stock prices, or application metrics. They provide a specialized storage format that optimizes both insertion speed and query performance for time-based data.

### 2. Architecture & Mechanics
Under the hood, MongoDB groups time-series data into buckets based on time. Instead of storing each reading as a separate document, it stores them in an optimized columnar format within these buckets. This drastically reduces storage size and improves index efficiency.

### 3. Implementation: Standard vs Optimized
A standard approach might involve creating a normal collection and indexing the timestamp field, which leads to index bloat. The optimized approach uses \`db.createCollection("weather", { timeseries: { timeField: "timestamp", metaField: "sensorId", granularity: "hours" }})\`, which automatically manages bucketization and compression.

### 4. Trade-offs & Complexity
Time Series Collections offer superior compression and read/write performance for sequential data. However, they are not suitable for all use cases; for example, documents in a time series collection cannot be updated or deleted individually in the same way as regular documents, adding complexity to data corrections.
`,
    interviewQuestions: [
      { question: "What are MongoDB Time Series Collections?", answer: "Specialized collections optimized for storing and querying sequences of measurements over time, using a bucketed columnar format." },
      { question: "What is the purpose of the 'metaField' in a time series collection?", answer: "The metaField categorizes the time-series data, like a sensor ID, helping MongoDB group related measurements together in the same bucket." },
      { question: "How does bucketing improve performance?", answer: "Bucketing groups multiple consecutive readings into a single document, reducing metadata overhead, index size, and disk I/O." },
      { question: "Can you update documents in a time series collection?", answer: "Yes, but with limitations. Updates are generally restricted to metaFields or require specific conditions depending on the MongoDB version." },
      { question: "What is 'granularity' in time series collections?", answer: "Granularity (seconds, minutes, hours) tells MongoDB the expected rate of incoming data, allowing it to optimize bucket sizes accordingly." }
    ],
    practicalTask: {
      title: "IoT Sensor Data Logger",
      description: "Create a time-series collection for IoT temperature sensors and write an aggregation pipeline to calculate the hourly average temperature per sensor."
    }
  },
  {
    title: "42. MongoDB Geospatial Queries",
    slug: "mongodb-geospatial-queries",
    description: "Mastering location-based queries, 2dsphere indexes, and spatial analysis in MongoDB.",
    order: 42,
    content: `
### 1. Conceptual Overview
Geospatial queries allow you to store and query location data (like coordinates). This is essential for applications involving maps, ride-sharing, or finding nearby points of interest. MongoDB supports GeoJSON objects and legacy coordinate pairs.

### 2. Architecture & Mechanics
MongoDB uses a specialized \`2dsphere\` index for data stored as GeoJSON. It maps the earth as an Earth-like sphere. The index uses a geohash-based B-tree structure, enabling fast retrieval of intersecting, within, or nearby geometries.

### 3. Implementation: Standard vs Optimized
Standard queries might calculate distances in application memory after fetching all records. The optimized approach leverages MongoDB's \`$near\`, \`$geoWithin\`, and \`$geoIntersects\` operators combined with a \`2dsphere\` index to perform calculations directly at the database level.

### 4. Trade-offs & Complexity
Geospatial indexes significantly speed up spatial queries but add storage overhead and slow down write operations. Careful selection of the coordinate system (GeoJSON vs legacy pairs) is critical, as mixing them can lead to inaccurate distance calculations.
`,
    interviewQuestions: [
      { question: "What is a 2dsphere index?", answer: "An index that supports queries calculating geometries on an earth-like sphere, primarily using GeoJSON data." },
      { question: "How do you find locations within a certain radius?", answer: "Use the $near or $nearSphere operator with a $maxDistance parameter, or use $geoWithin with a $centerSphere." },
      { question: "What is the difference between $near and $geoWithin?", answer: "$near returns documents sorted by distance, while $geoWithin returns unsorted documents within a specific boundary and is generally faster." },
      { question: "Why use GeoJSON over legacy coordinates?", answer: "GeoJSON is a standardized format supporting complex geometries like Polygons and MultiPolygons, required for accurate spherical calculations." },
      { question: "Can a collection have multiple 2dsphere indexes?", answer: "Yes, MongoDB supports multiple 2dsphere indexes on different fields within the same collection." }
    ],
    practicalTask: {
      title: "Store Locator App",
      description: "Implement a store locator. Seed a collection with GeoJSON points, create a 2dsphere index, and write a query to find the top 5 closest stores to a given user location within a 10km radius."
    }
  },
  {
    title: "43. MongoDB Atlas Search & Full-Text Search",
    slug: "mongodb-atlas-search",
    description: "Implementing advanced search capabilities using Lucene-based Atlas Search.",
    order: 43,
    content: `
### 1. Conceptual Overview
MongoDB Atlas Search integrates Apache Lucene directly into MongoDB Atlas, providing powerful full-text search capabilities, typo tolerance, and faceted search, going far beyond basic regular expressions or standard text indexes.

### 2. Architecture & Mechanics
Atlas Search maintains Lucene indexes alongside MongoDB collections. When data is inserted or updated in MongoDB, change streams automatically sync the data to the Lucene index. Queries use the \`$search\` aggregation stage, which routes the query to the Lucene engine.

### 3. Implementation: Standard vs Optimized
A standard approach might rely on native \`$text\` indexes or \`$regex\`, which are slow and lack fuzzy matching. The optimized approach creates an Atlas Search index and uses the \`$search\` pipeline stage to provide fast, typo-tolerant relevance-based searching.

### 4. Trade-offs & Complexity
Atlas Search provides immense power but is tightly coupled to MongoDB Atlas (the managed service). It requires separate index configuration and consumes additional memory and compute resources on the cluster, potentially requiring higher tier instances.
`,
    interviewQuestions: [
      { question: "What is MongoDB Atlas Search?", answer: "An embedded full-text search engine in MongoDB Atlas powered by Apache Lucene." },
      { question: "How does Atlas Search differ from native $text indexes?", answer: "Atlas Search offers advanced features like fuzzy matching, autocomplete, and faceting, and is much faster for complex text queries." },
      { question: "What is the $search aggregation stage?", answer: "It is the pipeline stage used to execute Atlas Search queries; it must be the first stage in the pipeline." },
      { question: "How is data synchronized between MongoDB and the Lucene index?", answer: "Atlas uses internal change streams to automatically replicate document changes to the Lucene index." },
      { question: "Can you perform faceted searches with Atlas Search?", answer: "Yes, using the $searchMeta stage, you can retrieve facet counts based on search results." }
    ],
    practicalTask: {
      title: "E-commerce Product Search",
      description: "Define an Atlas Search index for a products collection and write an aggregation query using $search that includes fuzzy matching and highlights the matched terms."
    }
  },
  {
    title: "44. Advanced Aggregation Pipeline Optimization",
    slug: "advanced-aggregation-pipeline-optimization",
    description: "Techniques for analyzing and tuning complex aggregation pipelines for maximum performance.",
    order: 44,
    content: `
### 1. Conceptual Overview
The aggregation pipeline is powerful but can become a bottleneck if not structured correctly. Optimization involves understanding how MongoDB executes the pipeline, utilizing indexes effectively, and minimizing the amount of data processed in later stages.

### 2. Architecture & Mechanics
MongoDB uses an optimizer for aggregation pipelines. It can automatically reorder certain stages (like moving \`$match\` before \`$sort\`) or coalesce multiple stages. Understanding these internal optimizations is key to writing performant queries.

### 3. Implementation: Standard vs Optimized
A standard unoptimized pipeline might use \`$project\` early to shape data, accidentally preventing index usage. An optimized pipeline filters data immediately with \`$match\` using covered indexes, delays \`$project\` or \`$unwind\` until the dataset is small, and leverages \`allowDiskUse\` only when necessary.

### 4. Trade-offs & Complexity
Optimizing pipelines requires deep knowledge of the \`explain()\` plan. Over-optimizing might lead to less readable code. Using memory limits (100MB per stage) forces developers to either optimize data flow or trade performance by spilling to disk via \`allowDiskUse: true\`.
`,
    interviewQuestions: [
      { question: "Why should $match be the first stage in a pipeline?", answer: "Placing $match first allows MongoDB to use indexes to filter the dataset before passing documents to subsequent, memory-intensive stages." },
      { question: "How does the pipeline optimizer handle a $sort followed by a $match?", answer: "The optimizer will automatically move the $match stage before the $sort stage to reduce the number of documents to sort." },
      { question: "What is the memory limit for an aggregation pipeline stage?", answer: "100 MB of RAM. Exceeding this requires setting allowDiskUse: true." },
      { question: "How can $project negatively impact performance?", answer: "If used before a $match or $sort, it can strip fields needed for index usage and force MongoDB to do in-memory processing." },
      { question: "What does the explain() method reveal for aggregations?", answer: "It shows the execution plan, including whether indexes were used, how stages were optimized, and execution time statistics." }
    ],
    practicalTask: {
      title: "Pipeline Profiler",
      description: "Take a slow-running pipeline that unwinds an array and then filters it. Refactor it to use $filter within a $project stage to avoid $unwind entirely, then compare the explain() plans."
    }
  },
  {
    title: "45. MongoDB Security Best Practices & Role-Based Access Control",
    slug: "mongodb-security-rbac",
    description: "Securing MongoDB deployments, implementing RBAC, and enforcing network isolation.",
    order: 45,
    content: `
### 1. Conceptual Overview
Securing a MongoDB database involves multiple layers: network security, authentication, authorization (RBAC), and encryption. Failing to secure a database can lead to catastrophic data breaches.

### 2. Architecture & Mechanics
MongoDB's security model uses Role-Based Access Control (RBAC). Users are assigned roles, and roles are granted privileges on specific resources (databases or collections). Encryption at rest secures the physical disk files, while TLS/SSL secures data in transit.

### 3. Implementation: Standard vs Optimized
A standard, insecure setup often runs with no authentication enabled (\`--auth\` omitted) and binds to all IP addresses. The optimized, secure approach enables authentication, configures distinct roles (e.g., read-only for analytics, readWrite for apps), enforces IP whitelisting, and enables TLS encryption.

### 4. Trade-offs & Complexity
Implementing robust security adds operational overhead. Managing certificates for TLS, rotating passwords, and auditing RBAC policies require dedicated effort. Striking a balance between security and developer friction is a constant architectural challenge.
`,
    interviewQuestions: [
      { question: "What is Role-Based Access Control (RBAC) in MongoDB?", answer: "A security mechanism where access rights are granted based on assigned roles, which specify privileges for specific resources." },
      { question: "How do you restrict network access to a MongoDB server?", answer: "By configuring the 'bindIp' setting in the mongod.conf file and using OS-level firewalls or VPC security groups." },
      { question: "What is the difference between authentication and authorization?", answer: "Authentication verifies user identity (who you are), while authorization (RBAC) determines what the authenticated user is allowed to do." },
      { question: "How does MongoDB handle encryption at rest?", answer: "MongoDB Enterprise and Atlas support encryption at rest using the WiredTiger storage engine's native encryption capabilities." },
      { question: "What is Client-Side Field Level Encryption (CSFLE)?", answer: "A feature that allows the application to encrypt specific fields before sending them to the database, ensuring the DB server never sees plaintext." }
    ],
    practicalTask: {
      title: "RBAC Configuration Script",
      description: "Write a mongo shell script to create a custom role 'reportViewer' that can only execute read operations on a 'sales' collection, and assign it to a new user."
    }
  }
];

appendTopics('mongodb', 'MongoDB Masterclass', '...', topics);
