import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'intro-to-nosql-and-mongodb',
    title: '1. Introduction to NoSQL and MongoDB Fundamentals',
    order: 1,
    content: `
# Introduction to NoSQL and MongoDB Fundamentals

## What is NoSQL?
NoSQL databases provide a mechanism for storage and retrieval of data that is modeled in means other than the tabular relations used in relational databases. They are highly recognized for their ease of development, scalable performance, high availability, and resilience. 
Unlike standard relational database management systems (RDBMS) such as PostgreSQL or MySQL, NoSQL databases handle unstructured, semi-structured, or polymorphic data efficiently. The traditional RDBMS uses Structured Query Language (SQL) and is bound to rigid schemas, enforcing ACID properties. However, as applications scale horizontally, traditional RDBMS can become bottlenecks.

### Types of NoSQL Databases:
1. **Document-oriented:** MongoDB, CouchDB (stores data in JSON-like structures).
2. **Key-Value:** Redis, DynamoDB.
3. **Wide-Column:** Cassandra, HBase.
4. **Graph:** Neo4j, ArangoDB.

## MongoDB Architecture and Core Concepts
MongoDB is a document-oriented NoSQL database. It replaces the concept of a "row" with a more flexible model, the "document".

### BSON vs JSON
MongoDB stores data in **BSON** (Binary JSON). While you interact with MongoDB using JSON (JavaScript Object Notation), under the hood, the engine converts this JSON to BSON. BSON extends the JSON model to provide additional data types (such as Date, ObjectId, and raw binary data) and to be highly efficient for encoding and decoding within different languages.

**Example of JSON vs BSON internal understanding:**
\`\`\`json
// Standard JSON
{
  "_id": "1234567890abcdef",
  "name": "Alice",
  "joined_at": "2023-01-01T00:00:00Z"
}
\`\`\`
*MongoDB BSON Representation (Conceptually):*
\`\`\`javascript
{
  "_id": ObjectId("1234567890abcdef"),
  "name": "Alice",
  "joined_at": ISODate("2023-01-01T00:00:00Z")
}
\`\`\`

### RDBMS to MongoDB Mapping
- **Database** ➔ **Database**
- **Table** ➔ **Collection**
- **Row** ➔ **Document**
- **Column** ➔ **Field**
- **Index** ➔ **Index**
- **Join** ➔ **$lookup (Aggregation) / Embedded Documents**

## Why Choose MongoDB?
1. **Flexibility:** Schema-less (or schema-flexible) nature means you can evolve your application faster without complex migrations.
2. **Scalability:** Built-in horizontal scaling via sharding.
3. **High Availability:** Built-in replication via Replica Sets provides automatic failover.
4. **Rich Query Language:** Provides advanced querying, aggregation framework, geospatial capabilities, and text search.
5. **Developer Friendly:** Data is mapped naturally to objects in application code.

### Detailed Architecture Diagram (Mental Model)
A MongoDB deployment can be a standalone server, a replica set, or a sharded cluster. 
- **mongod:** The primary daemon process for the MongoDB system. It handles data requests, manages data access, and performs background management operations.
- **mongos:** A routing service for MongoDB shard configurations that processes queries from the application layer and determines the location of the data in the sharded cluster.

\`\`\`javascript
// A simple document in MongoDB
{
    "_id": ObjectId("507f191e810c19729de860ea"),
    "username": "johndoe",
    "email": "john@example.com",
    "profile": {
        "firstName": "John",
        "lastName": "Doe",
        "age": 28
    },
    "tags": ["developer", "gamer", "writer"],
    "isActive": true
}
\`\`\`
Notice how arrays and sub-documents are natively supported, eliminating the need for complex joins in many scenarios.
    `,
    interviewQuestions: [
      {
        question: 'Explain the main differences between RDBMS and Document-oriented databases like MongoDB.',
        answer: 'RDBMS use tables, rows, and rigid schemas with normalized data relying on JOINs. MongoDB uses collections, flexible JSON-like documents, often denormalizing data by embedding it, offering easier horizontal scalability and faster iterative development.'
      },
      {
        question: 'What is BSON and why does MongoDB use it instead of JSON?',
        answer: 'BSON stands for Binary JSON. MongoDB uses it because it is more efficient to parse and scan, takes up less space in some cases, and supports additional data types not present in standard JSON, such as Date, ObjectId, Long, and MinKey/MaxKey.'
      },
      {
        question: 'What is a Replica Set in MongoDB?',
        answer: 'A replica set is a group of mongod instances that maintain the same data set. It provides redundancy and high availability through automatic failover. One node is the Primary, taking writes, and others are Secondaries.'
      },
      {
        question: 'How do you achieve horizontal scaling in MongoDB?',
        answer: 'Horizontal scaling is achieved through Sharding. MongoDB distributes data across multiple machines based on a chosen shard key.'
      },
      {
        question: 'What is an ObjectId in MongoDB?',
        answer: 'ObjectId is a 12-byte BSON type used as the default value for the _id field in documents. It contains a 4-byte timestamp, a 5-byte random value, and a 3-byte incrementing counter, ensuring global uniqueness without coordination.'
      }
    ],
    practicalTask: {
      scenario: 'You are setting up a new project and need to design a user document.',
      task: 'Write a valid BSON/JSON representation of a user containing an ID, string name, array of hobbies, and an embedded address document.',
      solutionCode: `{
  "_id": ObjectId("64abcd..."),
  "name": "Jane Smith",
  "hobbies": ["reading", "cycling", "coding"],
  "address": {
    "street": "123 Main St",
    "city": "Techville",
    "zip": "90210"
  }
}`
    }
  },
  {
    slug: 'setup-and-connecting-mongodb',
    title: '2. Setting Up and Connecting to MongoDB',
    order: 2,
    content: `
# Setting Up and Connecting to MongoDB

## MongoDB Atlas vs Local Deployment
When starting with MongoDB, you must decide where to host your database.

### MongoDB Atlas
Atlas is a fully-managed cloud database engineered by MongoDB. It automates database provisioning, setup, patching, and upgrades.
- **Benefits:** No infrastructure to manage, automated backups, built-in security, global multi-cloud distribution (AWS, GCP, Azure).
- **Getting Started:** Create a cluster, whitelist your IP address, create a database user, and get your connection string.

### Local/Self-Managed Deployment
You can run MongoDB locally using Docker, or install it directly on Windows, macOS, or Linux.
- **Benefits:** Full control over configuration, no internet required for development, no data egress costs.

**Running MongoDB via Docker:**
\`\`\`bash
docker run -d --name mongo-dev -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=secret mongo:latest
\`\`\`

## Connection Strings (URIs)
MongoDB utilizes a standard URI format for connections.

### Standard Format:
\`\`\`
mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
\`\`\`
Example: \`mongodb://admin:secret@localhost:27017/myDatabase?authSource=admin\`

### Atlas Format (DNS Seed List):
\`\`\`
mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myDatabase?retryWrites=true&w=majority
\`\`\`
The \`+srv\` modifier uses DNS SRV records to discover the nodes in the replica set automatically.

## Drivers and Connection Pooling
MongoDB provides official drivers for Node.js, Python, Java, C#, Go, etc. 

### Connecting via Node.js (Official Driver)
\`\`\`javascript
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  maxPoolSize: 50, // Connection pooling limit
  wtimeoutMS: 2500,
  useNewUrlParser: true
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server");
    const database = client.db('test_db');
    const collection = database.collection('users');
    
    // Count documents
    const count = await collection.countDocuments();
    console.log(\`Total users: \${count}\`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
\`\`\`

### Connection Pooling
Connection pooling is critical for performance. Opening a connection is an expensive TCP/TLS operation. MongoDB drivers maintain a pool of open connections.
- When an operation needs a connection, it borrows one from the pool.
- When done, it returns it to the pool.
- \`maxPoolSize\` limits how many connections can be opened simultaneously (default is often 100).
    `,
    interviewQuestions: [
      {
        question: 'What is the difference between mongodb:// and mongodb+srv:// connection strings?',
        answer: 'mongodb:// requires you to specify the exact hosts and ports. mongodb+srv:// uses DNS SRV records to automatically discover the nodes in the cluster, providing flexibility if cluster nodes change without needing to update the client connection string.'
      },
      {
        question: 'Why is connection pooling important in MongoDB?',
        answer: 'Establishing a new TCP/TLS connection is resource-intensive. Connection pooling reuses established connections, vastly improving application performance and reducing server load.'
      },
      {
        question: 'What happens if maxPoolSize is reached?',
        answer: 'If all connections in the pool are busy, new database operations will be queued and wait until a connection becomes available or until the waitQueueTimeoutMS is reached, at which point an error is thrown.'
      },
      {
        question: 'What is MongoDB Atlas?',
        answer: 'MongoDB Atlas is the official fully-managed database-as-a-service cloud solution provided by MongoDB, offering automated deployment, scaling, backups, and security.'
      },
      {
        question: 'How do you handle connection drops in the MongoDB Node.js driver?',
        answer: 'The Node.js driver has built-in auto-reconnect logic. Also, passing the retryWrites=true option in the URI ensures that if a network error occurs during a write, the driver will automatically retry it once.'
      }
    ],
    practicalTask: {
      scenario: 'You are writing an Express.js server and need to establish a global database connection.',
      task: 'Write a robust connection function using Mongoose or the native driver that connects only once and catches errors.',
      solutionCode: `import mongoose from 'mongoose';

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing connection');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};`
    }
  },
  {
    slug: 'deep-dive-crud-operations',
    title: '3. Deep Dive into MongoDB CRUD Operations',
    order: 3,
    content: `
# Deep Dive into MongoDB CRUD Operations

CRUD (Create, Read, Update, Delete) forms the backbone of any database interaction. MongoDB provides highly expressive and atomic document-level operations.

## Create (Insert)
Data is inserted using \`insertOne()\` or \`insertMany()\`. If the collection doesn't exist, MongoDB creates it automatically. If \`_id\` is not provided, MongoDB generates an \`ObjectId\`.

\`\`\`javascript
// Insert One
db.users.insertOne({
  name: "Alice",
  age: 25,
  status: "active"
});

// Insert Many
db.users.insertMany([
  { name: "Bob", age: 30, status: "pending" },
  { name: "Charlie", age: 35, status: "active" }
], { ordered: false });
\`\`\`
*Note: Setting \`ordered: false\` means if one document fails to insert (e.g. duplicate key), the rest will still process.*

## Read (Find)
Retrieving data utilizes \`find()\` and \`findOne()\`.

\`\`\`javascript
// Find all active users
db.users.find({ status: "active" });

// Find a specific user
db.users.findOne({ name: "Alice" });
\`\`\`

### Projections
Projections allow you to specify exactly which fields to return, reducing network payload and memory usage.
\`\`\`javascript
// Return ONLY name and age (exclude _id)
db.users.find(
  { status: "active" },
  { name: 1, age: 1, _id: 0 }
);
\`\`\`

## Update
Modifying documents uses \`updateOne()\`, \`updateMany()\`, or \`replaceOne()\`.

### updateOne and updateMany
These operations require an **Update Operator** (like \`$set\`, \`$unset\`, \`$inc\`). Without an operator, early versions of MongoDB would replace the whole document; modern drivers strictly require operators for \`update\` methods.

\`\`\`javascript
// Set a field
db.users.updateOne(
  { name: "Alice" }, // Filter
  { $set: { age: 26, status: "super_active" } } // Update operator
);

// Increment a field
db.users.updateMany(
  { status: "active" },
  { $inc: { age: 1 } }
);
\`\`\`

### replaceOne
Completely replaces the matched document with a new one (excluding the \`_id\`).
\`\`\`javascript
db.users.replaceOne(
  { name: "Bob" },
  { name: "Robert", age: 31, newField: true }
);
\`\`\`

## Delete
Removing data utilizes \`deleteOne()\` and \`deleteMany()\`.

\`\`\`javascript
db.users.deleteOne({ name: "Charlie" });

db.users.deleteMany({ status: "pending" });
\`\`\`

## Atomicity
In MongoDB, a write operation is **atomic on the level of a single document**, even if the operation modifies multiple embedded documents within a single document.
    `,
    interviewQuestions: [
      {
        question: 'What is the difference between updateOne() and replaceOne()?',
        answer: 'updateOne() modifies specific fields of a document using update operators (like $set). replaceOne() completely overwrites the entire document (except for the _id field) with the new document provided.'
      },
      {
        question: 'How do you prevent an insertMany operation from failing completely if a duplicate key error occurs on one document?',
        answer: 'You pass the option { ordered: false } to insertMany. This tells MongoDB to continue inserting the remaining documents even if one fails.'
      },
      {
        question: 'What is a Projection in a find query?',
        answer: 'A projection specifies which fields should be included or excluded from the documents returned by a query, which helps optimize network bandwidth and memory usage.'
      },
      {
        question: 'Are operations in MongoDB atomic?',
        answer: 'Operations in MongoDB are atomic at the single-document level. Since MongoDB 4.0, multi-document ACID transactions are also supported, but standard single-document updates are inherently atomic.'
      },
      {
        question: 'What happens if you use updateOne() without an update operator like $set?',
        answer: 'Modern MongoDB drivers will throw an error. In older driver versions using the deprecated update() method, passing a document without operators would completely replace the existing document.'
      }
    ],
    practicalTask: {
      scenario: 'You need to fetch user profiles but ensure password hashes are never returned.',
      task: 'Write a find query that fetches users over age 18, and explicitly excludes the "password" and "ssn" fields using projection.',
      solutionCode: `db.users.find(
  { age: { $gt: 18 } },
  { password: 0, ssn: 0 }
);`
    }
  },
  {
    slug: 'advanced-querying-filtering',
    title: '4. Advanced Querying and Filtering',
    order: 4,
    content: `
# Advanced Querying and Filtering

MongoDB provides a rich set of query operators to filter data beyond simple equality matches. Understanding these is crucial for complex data retrieval.

## Comparison Operators
These allow comparing field values.
- \`$eq\`: Equals
- \`$gt\`: Greater Than
- \`$gte\`: Greater Than or Equals
- \`$lt\`: Less Than
- \`$lte\`: Less Than or Equals
- \`$ne\`: Not Equal
- \`$in\`: Value is in a specified array
- \`$nin\`: Value is none of the specified array

\`\`\`javascript
// Find products priced between 50 and 100
db.products.find({ price: { $gte: 50, $lte: 100 } });

// Find users from specific cities
db.users.find({ city: { $in: ["New York", "London", "Tokyo"] } });
\`\`\`

## Logical Operators
These combine multiple query clauses.
- \`$and\`: Joins query clauses with a logical AND
- \`$or\`: Joins query clauses with a logical OR
- \`$not\`: Inverts the effect of a query expression
- \`$nor\`: Joins query clauses with a logical NOR

\`\`\`javascript
// Find items that are either out of stock OR cost less than 10
db.inventory.find({
  $or: [
    { qty: 0 },
    { price: { $lt: 10 } }
  ]
});
\`\`\`
*Note: Implicit AND is standard (e.g., \`{ qty: 0, price: 10 }\`), but \`$and\` is required when applying multiple conditions to the same field or combining multiple \`$or\` expressions.*

## Element Operators
Check for the existence or type of a field.
- \`$exists\`: Matches documents that have the specified field.
- \`$type\`: Selects documents if a field is of the specified BSON type.

\`\`\`javascript
// Find users who have a phone number defined
db.users.find({ phone: { $exists: true } });

// Find where price is stored as a String (type 2)
db.products.find({ price: { $type: "string" } });
\`\`\`

## Array Operators
Working with arrays is a superpower in MongoDB.
- \`$all\`: Matches arrays that contain all elements specified in the query.
- \`$elemMatch\`: Selects documents if an element in the array matches all specified \`$elemMatch\` conditions.
- \`$size\`: Selects documents if the array field is a specified size.

\`\`\`javascript
// Documents where tags contain BOTH 'appliance' and 'school'
db.inventory.find({ tags: { $all: ["appliance", "school"] } });

// Array of embedded documents: Find a student with a specific grade in Math
db.students.find({
  results: { $elemMatch: { subject: "Math", score: { $gte: 85 } } }
});
\`\`\`
Without \`$elemMatch\`, querying \`{ "results.subject": "Math", "results.score": { $gte: 85 } }\` would match if *any* object in the array had subject "Math" and *any* (even a different one) had score >= 85. \`$elemMatch\` forces the conditions to apply to the *same* array element.

## Evaluation Operators
- \`$regex\`: Provides regular expression capabilities for pattern matching strings.
- \`$expr\`: Allows use of aggregation expressions within the query language (comparing two fields in the same document).

\`\`\`javascript
// Find products where discount is greater than profit
db.sales.find({
  $expr: { $gt: ["$discount", "$profit"] }
});
\`\`\`
    `,
    interviewQuestions: [
      {
        question: 'When should you use $elemMatch in MongoDB?',
        answer: '$elemMatch is used when querying an array of embedded documents and you need to ensure that multiple query criteria match against the exact same element within that array, rather than different elements satisfying different parts of the query.'
      },
      {
        question: 'How do you query for a document where a specific field does not exist?',
        answer: 'You use the $exists operator set to false: { fieldName: { $exists: false } }.'
      },
      {
        question: 'Can you compare two fields within the same document using a standard find query?',
        answer: 'Yes, using the $expr operator. For example: db.collection.find({ $expr: { $gt: ["$field1", "$field2"] } }).'
      },
      {
        question: 'What is the difference between using an implicit AND and the $and operator?',
        answer: 'Implicit AND is usually sufficient ({a: 1, b: 2}). However, if you need to apply the same operator to the same field multiple times, or join multiple $or arrays, you must use the explicit $and operator to avoid JSON key overriding.'
      },
      {
        question: 'How do you find documents where an array has exactly 3 elements?',
        answer: 'By using the $size operator: { arrayField: { $size: 3 } }.'
      }
    ],
    practicalTask: {
      scenario: 'You are filtering a product catalog based on user searches.',
      task: 'Write a query to find products that belong to category "Electronics", have a rating of 4 or higher, and are either in stock (stock > 0) OR have the "preorder" flag set to true.',
      solutionCode: `db.products.find({
  category: "Electronics",
  rating: { $gte: 4 },
  $or: [
    { stock: { $gt: 0 } },
    { preorder: true }
  ]
});`
    }
  },
  {
    slug: 'modifying-data-advanced-update',
    title: '5. Modifying Data with Advanced Update Operators',
    order: 5,
    content: `
# Modifying Data with Advanced Update Operators

While \`$set\` is the most common update operator, MongoDB provides a vast array of specialized operators for atomic, in-place modifications of complex data structures like arrays and numbers.

## Field Update Operators
- \`$set\`: Sets the value of a field.
- \`$unset\`: Removes the specified field.
- \`$inc\`: Increments the value of the field by the specified amount.
- \`$mul\`: Multiplies the value of the field.
- \`$rename\`: Renames a field.
- \`$currentDate\`: Sets the value of a field to current date/time.

\`\`\`javascript
db.users.updateOne(
  { _id: 1 },
  { 
    $inc: { visits: 1 },
    $unset: { temporaryToken: "" },
    $currentDate: { lastLogin: true }
  }
);
\`\`\`

## Array Update Operators
Manipulating arrays efficiently is critical to avoiding race conditions. Instead of fetching an array, modifying it in your app, and saving it back (which causes race conditions), use array operators.

- \`$push\`: Appends a value to an array.
- \`$addToSet\`: Adds a value to an array *only* if it does not already exist (treats array like a Set).
- \`$pop\`: Removes the first or last element of an array (-1 for first, 1 for last).
- \`$pull\`: Removes all array elements that match a specified query.

\`\`\`javascript
// Add a tag only if it's unique
db.posts.updateOne(
  { _id: 1 },
  { $addToSet: { tags: "mongodb" } }
);

// Remove specific comments by author
db.posts.updateOne(
  { _id: 1 },
  { $pull: { comments: { author: "Spammer" } } }
);

// Push multiple items with sorting and slicing (keeping only top 5)
db.leaderboard.updateOne(
  { game: "chess" },
  {
    $push: {
      scores: {
        $each: [{ player: "A", score: 100 }, { player: "B", score: 90 }],
        $sort: { score: -1 },
        $slice: 5 // Keep only top 5
      }
    }
  }
);
\`\`\`

## Upserts (Update or Insert)
An \`upsert\` updates a document if it matches the filter. If no document matches, it creates a new document combining the filter criteria and the update modifiers.

\`\`\`javascript
db.users.updateOne(
  { email: "newuser@example.com" },
  { 
    $set: { name: "New User", status: "active" },
    $setOnInsert: { createdAt: new Date() } // Only sets on creation, not updates
  },
  { upsert: true }
);
\`\`\`

## ArrayFilters (Modifying specific array elements)
When you need to update an embedded document *inside* an array based on conditions.
\`\`\`javascript
// Update the grade to A for the "Math" subject inside the grades array
db.students.updateOne(
  { name: "John" },
  { $set: { "grades.$[elem].grade": "A" } },
  { arrayFilters: [ { "elem.subject": "Math" } ] }
);
\`\`\`
The \`$[elem]\` serves as a placeholder matched by the \`arrayFilters\` condition.
    `,
    interviewQuestions: [
      {
        question: 'What is the difference between $push and $addToSet?',
        answer: '$push appends a value to an array regardless of whether it already exists. $addToSet only adds the value if it is not already present in the array, preventing duplicates.'
      },
      {
        question: 'Explain the concept of an Upsert.',
        answer: 'An upsert is a database operation that attempts to update an existing document based on query criteria. If no matching document is found, it inserts a new document using the query criteria and update parameters.'
      },
      {
        question: 'What is the purpose of $setOnInsert?',
        answer: 'When performing an upsert, $setOnInsert sets field values only if a new document is being inserted. If the operation results in an update of an existing document, the $setOnInsert fields are ignored. This is perfect for setting createdAt timestamps.'
      },
      {
        question: 'How would you remove a specific object from an array of objects?',
        answer: 'Use the $pull operator. For example: { $pull: { "items": { "id": 123 } } } will remove any object from the "items" array where the "id" equals 123.'
      },
      {
        question: 'What is the purpose of arrayFilters in MongoDB updates?',
        answer: 'arrayFilters allow you to specify conditions to update specific elements within an array. It defines an identifier (e.g., $[elem]) that is used in the update document, and the filter determines which array elements that identifier applies to.'
      }
    ],
    practicalTask: {
      scenario: 'You are tracking user page views.',
      task: 'Write an update query to increment the "pageViews" counter by 1. If the user document does not exist (filter by userId: 100), create it with "pageViews" starting at 1 and set a "signupDate" only upon creation.',
      solutionCode: `db.analytics.updateOne(
  { userId: 100 },
  { 
    $inc: { pageViews: 1 },
    $setOnInsert: { signupDate: new Date() }
  },
  { upsert: true }
);`
    }
  }
];

appendTopics('mongodb', 'MongoDB Database Engineering', 'The definitive guide to mastering MongoDB from fundamentals to advanced distributed architectures.', topics).catch(console.error);
