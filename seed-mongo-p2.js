import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'designing-mongodb-schemas',
    title: '6. Designing MongoDB Schemas and Data Modeling',
    order: 6,
    content: `
# Designing MongoDB Schemas and Data Modeling

Unlike relational databases where you normalize data into flat tables and use JOINs, data modeling in MongoDB is driven by the application's access patterns. The golden rule of MongoDB data modeling is: **"Data that is accessed together should be stored together."**

## Embedding vs. Referencing

### 1. Embedding (Denormalization)
Embedding involves storing related data as an array or object within a single document. 

**Advantages:**
- Single read operation retrieves the main document and its relationships.
- Single atomic update.
- Improved read performance.

**Disadvantages:**
- Documents have a 16MB size limit. If an embedded array grows unboundedly, it will hit this limit.
- Data duplication (if the same data is embedded in multiple places).

**Example (One-to-Few relationship):**
\`\`\`javascript
// User with embedded addresses
{
  "_id": ObjectId("..."),
  "name": "Jane",
  "addresses": [
    { "type": "home", "city": "NY" },
    { "type": "work", "city": "SF" }
  ]
}
\`\`\`

### 2. Referencing (Normalization)
Referencing stores the relationships between data by including links (like foreign keys) from one document to another.

**Advantages:**
- No unbounded array growth (prevents hitting the 16MB limit).
- Avoids data duplication.
- Easier to manage many-to-many relationships.

**Disadvantages:**
- Requires multiple queries or an Aggregation \`$lookup\` (join) to resolve relationships, which adds latency.

**Example (One-to-Squillions relationship):**
\`\`\`javascript
// Publisher Document
{
  "_id": "publisher1",
  "name": "O'Reilly Media"
}

// Book Document referencing Publisher
{
  "_id": "book1",
  "title": "MongoDB: The Definitive Guide",
  "publisher_id": "publisher1" // Reference
}
\`\`\`

## Common Relationship Patterns

1. **One-to-One (1:1):** Usually embedded within the document. (e.g., User -> Profile settings).
2. **One-to-Many (1:N) - One-to-Few:** Embed the many. (e.g., User -> multiple addresses).
3. **One-to-Many (1:N) - One-to-Many:** Reference. Store an array of ObjectIds in the "One" side or parent ID on the "Many" side. (e.g., Blog Post -> 1000 Comments).
4. **One-to-Many (1:N) - One-to-Squillions:** Always Reference by storing the parent ID on the child documents. (e.g., Log server -> Millions of log events).
5. **Many-to-Many (N:N):** Two-way referencing or an array of references on one side.

## Schema Validation
Although MongoDB is flexible, you can enforce strict schema structures at the database level using JSON Schema validation.

\`\`\`javascript
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "year", "major" ],
      properties: {
        name: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        year: {
          bsonType: "int",
          minimum: 2017,
          maximum: 3017,
          description: "must be an integer in [ 2017, 3017 ] and is required"
        }
      }
    }
  }
})
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'What is the most important factor to consider when modeling data in MongoDB?',
        answer: 'The application\'s access patterns. You should model your data based on how the application reads and writes data, aiming to minimize the number of queries needed to satisfy a user request.'
      },
      {
        question: 'When should you embed data instead of referencing it?',
        answer: 'You should embed data for "contains" relationships (1:1 or 1:few), when the child data is frequently accessed alongside the parent, and when the embedded data array will not grow indefinitely.'
      },
      {
        question: 'What is the document size limit in MongoDB?',
        answer: 'The maximum BSON document size is 16 megabytes. This limit prevents documents from taking up excessive amount of RAM or bandwidth during transmission.'
      },
      {
        question: 'How do you model a "One-to-Squillions" relationship (e.g., an IoT device emitting thousands of logs per minute)?',
        answer: 'Do not embed the logs inside the device document, as it will quickly hit the 16MB limit. Instead, use referencing by storing the device ID inside each individual log document.'
      },
      {
        question: 'Does MongoDB enforce schemas?',
        answer: 'MongoDB is inherently schema-flexible, but you can enforce structural rules at the collection level using Schema Validation with JSON Schema syntax, ensuring specific fields exist and are of correct types.'
      }
    ],
    practicalTask: {
      scenario: 'You are modeling an e-commerce order system. An order has items, shipping info, and payment details. The number of items rarely exceeds 10.',
      task: 'Write a JSON/BSON schema structure showing how you would model the Order document. Justify your use of embedding vs referencing.',
      solutionCode: `// Since an order is self-contained and the number of items is small (One-to-Few), embedding is ideal.
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."), // Reference to the user
  "orderDate": ISODate("2023-10-01"),
  "status": "shipped",
  "items": [
    { "productId": ObjectId("..."), "name": "Laptop", "quantity": 1, "price": 1200 },
    { "productId": ObjectId("..."), "name": "Mouse", "quantity": 2, "price": 25 }
  ],
  "shippingAddress": {
    "street": "123 Tech Lane",
    "city": "San Jose",
    "zip": "95112"
  },
  "payment": {
    "method": "credit_card",
    "transactionId": "txn_8943759"
  }
}`
    }
  },
  {
    slug: 'indexing-and-performance',
    title: '7. Indexing Strategies and Performance Tuning',
    order: 7,
    content: `
# Indexing Strategies and Performance Tuning

Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a **Collection Scan**, scanning every document in a collection, to select those that match the query statement. If an appropriate index exists, MongoDB can use the index to limit the number of documents it must inspect.

## Types of Indexes

1. **Default _id Index:** MongoDB automatically creates a unique index on the \`_id\` field.
2. **Single Field Index:** An index on a single field. MongoDB can traverse these in ascending or descending order.
3. **Compound Index:** An index on multiple fields.
4. **Multikey Index:** If you index a field that holds an array, MongoDB creates an index key for every element in the array.
5. **Text Index:** Supports text search queries on string content.
6. **Geospatial Index:** Supports queries on spatial data (2d, 2dsphere).
7. **Hashed Index:** Maintains hashes of the indexed field values, used primarily for sharding.

## Creating Indexes

\`\`\`javascript
// Single field index (ascending)
db.users.createIndex({ username: 1 })

// Compound index (username ascending, age descending)
db.users.createIndex({ username: 1, age: -1 })

// Unique index (prevents duplicates)
db.users.createIndex({ email: 1 }, { unique: true })
\`\`\`

## The ESR Rule for Compound Indexes
When creating compound indexes for queries that involve Equality, Sort, and Range conditions, follow the **ESR (Equality, Sort, Range)** rule:
1. **E (Equality):** Fields matched by equality (\`$eq\`, exact matches) should come first.
2. **S (Sort):** Fields determining the sort order should come second.
3. **R (Range):** Fields matched by range operators (\`$gt\`, \`$lt\`, \`$ne\`, etc.) should come last.

*Example:* 
Query: \`db.vehicles.find({ manufacturer: "Ford", year: { $gt: 2015 } }).sort({ model: 1 })\`
Best Index: \`{ manufacturer: 1, model: 1, year: 1 }\`

## Other Index Properties
- **TTL Indexes (Time-to-Live):** Automatically removes documents from a collection after a certain amount of time or at a specific clock time. Ideal for sessions or logs.
  \`\`\`javascript
  // Documents expire 3600 seconds (1 hour) after creation
  db.sessions.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 })
  \`\`\`
- **Partial Indexes:** Indexes only documents that meet a specified filter expression, saving storage space and reducing performance overhead.
- **Sparse Indexes:** Indexes only documents that contain the indexed field.

## Execution Plans (explain)
To understand how MongoDB executes a query and whether it uses an index, use the \`.explain()\` method.

\`\`\`javascript
db.users.find({ username: "alice" }).explain("executionStats")
\`\`\`
**Key metrics to look for:**
- \`winningPlan.stage\`: Look for \`IXSCAN\` (Index Scan) instead of \`COLLSCAN\` (Collection Scan).
- \`totalDocsExamined\` vs \`nReturned\`: If it examines 10,000 docs to return 10, the query is inefficient. Ideally, these numbers should be close.
    `,
    interviewQuestions: [
      {
        question: 'What is a Collection Scan (COLLSCAN) and why is it bad?',
        answer: 'A collection scan occurs when MongoDB must read every document in a collection to satisfy a query. It is highly inefficient, CPU-intensive, and slow for large datasets. Using proper indexes converts a COLLSCAN to an IXSCAN (Index Scan).'
      },
      {
        question: 'Explain the ESR rule for compound indexes.',
        answer: 'The ESR rule stands for Equality, Sort, Range. To optimize compound indexes, fields queried for Equality should be first, fields used for Sorting should be second, and fields used for Range filters ($gt, $lt) should be last.'
      },
      {
        question: 'What is a TTL index?',
        answer: 'A Time-to-Live (TTL) index is a special single-field index that MongoDB uses to automatically remove documents from a collection after a specified amount of time. It is commonly used for expiring session tokens or temporary logs.'
      },
      {
        question: 'What is the difference between a Partial Index and a Sparse Index?',
        answer: 'A Sparse index only indexes documents that contain the indexed field. A Partial index is more expressive; it indexes documents based on a specified filter condition (e.g., only index users where status is "active").'
      },
      {
        question: 'How do you check if a query is using an index?',
        answer: 'By appending .explain("executionStats") to the query. You then review the output to check if the winning plan uses an IXSCAN instead of a COLLSCAN and compare totalKeysExamined with totalDocsExamined.'
      }
    ],
    practicalTask: {
      scenario: 'You have a query: db.orders.find({ status: "Pending", amount: { $gt: 100 } }).sort({ date: -1 })',
      task: 'Based on the ESR rule, define the optimal compound index to support this query.',
      solutionCode: `// Following the Equality, Sort, Range rule:
// 1. Equality: status
// 2. Sort: date
// 3. Range: amount
db.orders.createIndex({
  status: 1,
  date: -1,
  amount: 1
});`
    }
  },
  {
    slug: 'aggregation-framework-basics',
    title: '8. Aggregation Framework: The Basics',
    order: 8,
    content: `
# Aggregation Framework: The Basics

The Aggregation Framework provides a way to process data records and return computed results. It operates as a data processing pipeline where documents enter a multi-stage pipeline that transforms them into aggregated results.

It is vastly more powerful and performant than the traditional \`find()\` method when doing data analysis, grouping, or complex transformations.

## The Pipeline Concept
Documents pass sequentially through stages. The output of one stage becomes the input for the next.

\`\`\`javascript
db.collection.aggregate([
  { $stage1: { ... } },
  { $stage2: { ... } },
  { $stage3: { ... } }
])
\`\`\`

## Core Aggregation Stages

### $match
Filters the documents. It works exactly like a standard \`find()\` query. **Rule of thumb:** Place \`$match\` as early in the pipeline as possible to reduce the number of documents passing through subsequent stages and to utilize indexes.

### $group
Groups input documents by a specified identifier expression and applies accumulator expressions to each group.

\`\`\`javascript
// Group by status and count them
db.orders.aggregate([
  {
    $group: {
      _id: "$status", // The field to group by
      totalOrders: { $sum: 1 },
      totalRevenue: { $sum: "$amount" },
      averageOrder: { $avg: "$amount" }
    }
  }
])
\`\`\`

### $project
Reshapes each document in the stream, such as by adding new fields, removing existing fields, or reshaping nested documents.

\`\`\`javascript
db.users.aggregate([
  {
    $project: {
      _id: 0, // Exclude ID
      fullName: { $concat: ["$firstName", " ", "$lastName"] }, // Computed field
      age: 1
    }
  }
])
\`\`\`

### $sort, $skip, $limit
Used for pagination and ordering. Must be mindful of memory limits (100MB per pipeline stage, though \`allowDiskUse: true\` can circumvent this).

\`\`\`javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $sort: { amount: -1 } }, // 1 is ascending, -1 is descending
  { $skip: 10 },
  { $limit: 5 }
])
\`\`\`

## Accumulators (Used within $group and $project)
- \`$sum\`: Calculates the sum of numeric values.
- \`$avg\`: Calculates the average.
- \`$min\` / \`$max\`: Finds the lowest or highest value.
- \`$push\`: Returns an array of all values that result from applying an expression to each document in a group.
- \`$addToSet\`: Same as \`$push\`, but ensures uniqueness.

## Example: Daily Sales Report
Let's build a basic pipeline that finds completed sales, groups them by date, sums the revenue, and sorts them by date.

\`\`\`javascript
db.sales.aggregate([
  // 1. Filter
  { $match: { status: "completed" } },
  
  // 2. Group by Date
  { $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$saleDate" } },
      dailyRevenue: { $sum: "$totalAmount" },
      itemsSold: { $sum: "$quantity" }
  }},
  
  // 3. Sort chronologically
  { $sort: { _id: 1 } }
])
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'What is the Aggregation Framework in MongoDB?',
        answer: 'It is a data processing pipeline framework where documents pass through a sequence of stages (like $match, $group, $project) that process and transform the data into aggregated results.'
      },
      {
        question: 'Where should you place the $match stage in an aggregation pipeline and why?',
        answer: '$match should be placed as early in the pipeline as possible. This limits the number of documents passed to the next stages, saving memory and CPU, and allows MongoDB to use indexes to evaluate the match.'
      },
      {
        question: 'What does the $group stage do?',
        answer: 'The $group stage groups documents by a specified identifier (_id) and allows the use of accumulator operators (like $sum, $avg, $push) to compute aggregate values for each group.'
      },
      {
        question: 'What is the memory limit for an aggregation pipeline stage?',
        answer: 'Each stage in the pipeline is restricted to 100 megabytes of RAM. If a stage exceeds this limit, MongoDB will throw an error unless you set the { allowDiskUse: true } option, which allows writing temporary files to disk.'
      },
      {
        question: 'How do you concatenate strings in a $project stage?',
        answer: 'You use the $concat operator. For example: { $concat: ["$firstName", " ", "$lastName"] }.'
      }
    ],
    practicalTask: {
      scenario: 'You have a "reviews" collection containing product ratings (1-5).',
      task: 'Write an aggregation pipeline to find the average rating for productId "XYZ", count how many reviews it has, and return the result.',
      solutionCode: `db.reviews.aggregate([
  { $match: { productId: "XYZ" } },
  {
    $group: {
      _id: "$productId",
      averageRating: { $avg: "$rating" },
      totalReviews: { $sum: 1 }
    }
  }
]);`
    }
  },
  {
    slug: 'advanced-aggregation',
    title: '9. Advanced Aggregation Pipeline',
    order: 9,
    content: `
# Advanced Aggregation Pipeline

Once you master the basics, you can handle relational-like joins, array unwinding, and complex analytics.

## $lookup (Left Outer Join)
Since MongoDB 3.2, \`$lookup\` allows performing a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing.

\`\`\`javascript
// Collection 1: Orders (has a field 'productId')
// Collection 2: Products (has '_id')

db.orders.aggregate([
  {
    $lookup: {
      from: "products",        // Target collection
      localField: "productId", // Field in orders collection
      foreignField: "_id",     // Field in products collection
      as: "productDetails"     // Array containing joined data
    }
  }
])
\`\`\`
*Note: Because an order might match multiple products (if relationship was different), \`$lookup\` always returns the joined data as an **array**.*

## $unwind
Deconstructs an array field from the input documents to output a document for each element. This is frequently used directly after a \`$lookup\` to flatten the returned array into an object.

\`\`\`javascript
db.orders.aggregate([
  { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "productDetails" } },
  
  // Converts productDetails from an array of 1 to a single object
  { $unwind: "$productDetails" } 
])
\`\`\`
*Tip: You can use \`{ path: "$array", preserveNullAndEmptyArrays: true }\` if you don't want to lose documents that have empty arrays.*

## $addFields
Similar to \`$project\`, but instead of replacing the document, it simply adds new fields or overwrites existing ones, keeping the rest of the document intact.

\`\`\`javascript
db.users.aggregate([
  {
    $addFields: {
      totalScore: { $sum: "$testScores" } // testScores is an array of numbers
    }
  }
])
\`\`\`

## $facet (Multi-faceted Search)
Processes multiple aggregation pipelines within a single stage on the same set of input documents. Useful for generating analytics dashboards or building e-commerce filter sidebars in a single query.

\`\`\`javascript
db.products.aggregate([
  {
    $facet: {
      "categorizedByTags": [
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } }
      ],
      "categorizedByPrice": [
        // Using $bucket to group into price ranges
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 50, 100, 200, 500],
            default: "Other",
            output: { count: { $sum: 1 } }
          }
        }
      ]
    }
  }
])
\`\`\`

## $out and $merge
Instead of returning the results to the client, you can write them directly to another collection.
- \`$out\`: Completely replaces the specified collection.
- \`$merge\`: Writes results to a collection, allowing updates/inserts to existing data (since MongoDB 4.2).

\`\`\`javascript
db.logs.aggregate([
  { $group: { _id: "$userId", loginCount: { $sum: 1 } } },
  { $out: "user_login_stats" } // Writes to a new collection
])
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'How do you perform a JOIN in MongoDB?',
        answer: 'You use the $lookup aggregation stage. It performs a left outer join to an unsharded collection in the same database, pulling in related documents and storing them as an array in a new field.'
      },
      {
        question: 'Why is $unwind typically used after $lookup?',
        answer: 'Because $lookup always returns the joined documents as an array, even if only one document matches. $unwind deconstructs this array so you can work with the embedded document directly as an object.'
      },
      {
        question: 'What is the difference between $project and $addFields?',
        answer: '$project is used to reshape the entire document, explicitly requiring you to specify which fields to keep or exclude. $addFields simply appends new fields to the existing document without needing to explicitly state the inclusion of existing fields.'
      },
      {
        question: 'What is the $facet stage used for?',
        answer: '$facet allows you to run multiple separate aggregation pipelines simultaneously on the same set of input documents within a single stage. It is widely used to build filtering sidebars (e.g., categories, price ranges) in a single database round trip.'
      },
      {
        question: 'How can you persist the result of an aggregation pipeline directly to the database?',
        answer: 'You can use the $out stage (which overwrites a target collection) or the $merge stage (which can insert/update into an existing collection).'
      }
    ],
    practicalTask: {
      scenario: 'You have a "posts" collection and a "users" collection. The post document has an "authorId" field.',
      task: 'Write an aggregation pipeline to fetch all posts, join the author details from the "users" collection, and unwind the array so "author" is a single object.',
      solutionCode: `db.posts.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "authorId",
      foreignField: "_id",
      as: "author"
    }
  },
  {
    $unwind: "$author"
  }
]);`
    }
  },
  {
    slug: 'transactions-and-concurrency',
    title: '10. Managing Data with Transactions and Concurrency',
    order: 10,
    content: `
# Managing Data with Transactions and Concurrency

Historically, MongoDB only provided atomicity at the single-document level. Because data is generally modeled to embed related data, single-document atomicity is sufficient for the majority of use cases. However, for complex operations like financial transactions spanning multiple accounts, multi-document transactions are necessary.

## ACID Properties
MongoDB 4.0 introduced multi-document ACID transactions against replica sets, and 4.2 extended this to sharded clusters.
- **Atomicity:** All operations within the transaction succeed, or none do.
- **Consistency:** Transactions ensure data goes from one valid state to another.
- **Isolation:** Operations within a transaction are hidden from other operations until the transaction commits.
- **Durability:** Committed data is saved reliably (persisted to disk).

## Multi-Document Transactions Example (Node.js)
To use transactions, you **must** be using a Replica Set (even a single-node replica set for local development).

\`\`\`javascript
const session = client.startSession();

// Using the recommended withTransaction helper
// It automatically handles retries for TransientTransactionErrors and UnknownTransactionCommitResults
try {
  await session.withTransaction(async () => {
    
    // 1. Deduct from Account A
    await accounts.updateOne(
      { name: "Alice", balance: { $gte: 100 } },
      { $inc: { balance: -100 } },
      { session } // Critical: must pass the session
    );
    
    // 2. Add to Account B
    await accounts.updateOne(
      { name: "Bob" },
      { $inc: { balance: 100 } },
      { session } // Critical: must pass the session
    );
    
  });
  console.log("Transaction successfully committed.");
} catch (error) {
  console.log("Transaction aborted due to error:", error);
} finally {
  await session.endSession();
}
\`\`\`

### Important Rules for Transactions
1. **Pass the Session:** You must pass the \`{ session }\` object to every database operation inside the transaction.
2. **Collection Creation:** You cannot create collections or indexes inside a transaction in older MongoDB versions (supported partially in newer versions, but best practice is to pre-create).
3. **Time Limit:** Transactions have a default time limit (usually 60 seconds). If they take longer, they are automatically aborted to prevent locking issues.

## Concurrency and Locking
MongoDB uses **document-level locking** (via the WiredTiger storage engine).
- This means multiple clients can write to different documents in the same collection concurrently.
- If two clients attempt to write to the exact same document, one will lock the document, and the other must wait until the lock is released.

## Write Concerns
Write concerns describe the level of acknowledgment requested from MongoDB for write operations.
- \`w: 1\` (Default): Acknowledged by the Primary node only. Fast, but risks data loss if primary crashes before replicating.
- \`w: "majority"\`: Acknowledged by a majority of nodes in the replica set. Ensures high durability.
- \`j: true\`: Journaling. Requires the write to be flushed to the on-disk journal before acknowledging.

\`\`\`javascript
db.users.insertOne(
  { name: "High Value Client" },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
);
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'Does MongoDB support ACID transactions?',
        answer: 'Yes. Single-document operations have always been atomic. Starting with MongoDB 4.0, it supports multi-document ACID transactions across replica sets, and since 4.2, across sharded clusters.'
      },
      {
        question: 'What is required to run multi-document transactions in MongoDB locally?',
        answer: 'You cannot run multi-document transactions on a standard standalone MongoDB instance. You must configure the instance as a Replica Set (even if it is just a single node) to enable the oplog, which transactions rely on.'
      },
      {
        question: 'Why must you pass the session object to database operations within a transaction?',
        answer: 'The session object binds the individual operations together. If you omit the session, the operation executes outside the transaction context and will not be rolled back if the transaction fails.'
      },
      {
        question: 'What is document-level locking?',
        answer: 'It is a concurrency control mechanism used by the WiredTiger storage engine. It allows multiple writes to happen concurrently on different documents within the same collection. Only when two processes try to modify the exact same document will one have to wait.'
      },
      {
        question: 'Explain Write Concern w: "majority".',
        answer: 'w: "majority" requires the database to wait until the write operation has been successfully replicated to a majority of the nodes in a replica set before acknowledging the success to the client, preventing data rollback during failovers.'
      }
    ],
    practicalTask: {
      scenario: 'You are transferring inventory between two warehouses.',
      task: 'Using pseudocode or Node.js syntax, show how you start a session, pass it to two operations (deducting stock from Warehouse A, adding to Warehouse B), and commit or abort the transaction.',
      solutionCode: `const session = client.startSession();
session.startTransaction();
try {
  await db.collection("inventory").updateOne(
    { warehouse: "A", stock: { $gte: 5 } },
    { $inc: { stock: -5 } },
    { session }
  );
  
  await db.collection("inventory").updateOne(
    { warehouse: "B" },
    { $inc: { stock: 5 } },
    { session }
  );
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}`
    }
  }
];

appendTopics('mongodb', 'MongoDB Database Engineering', 'The definitive guide to mastering MongoDB from fundamentals to advanced distributed architectures.', topics).catch(console.error);
