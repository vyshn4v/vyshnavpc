import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "introduction-to-mongodb",
    title: "1. Introduction to MongoDB",
    order: 1,
    content: `
      <h2>Welcome to MongoDB</h2>
      <p>MongoDB is a source-available cross-platform document-oriented database program. Classified as a NoSQL database program, MongoDB uses JSON-like documents with optional schemas. MongoDB is developed by MongoDB Inc. and licensed under the Server Side Public License (SSPL).</p>
      <p>Traditional relational databases store data in tables and rows. In contrast, MongoDB stores data in collections and documents. A document is a set of key-value pairs, which is the basic unit of data in MongoDB. Collections contain sets of documents and function as the equivalent of relational database tables.</p>
      <h3>Key Features of MongoDB</h3>
      <ul>
        <li><strong>Document-Oriented Storage:</strong> Data is stored in BSON formats (a binary representation of JSON).</li>
        <li><strong>Rich Query Language:</strong> MongoDB supports a rich query language to support CRUD operations as well as data aggregation, text search, and geospatial queries.</li>
        <li><strong>High Availability:</strong> MongoDB's replica sets provide high availability with automatic failover and data redundancy.</li>
        <li><strong>Horizontal Scalability:</strong> Sharding distributes data across a cluster of machines.</li>
      </ul>
      <p>Let's look at a basic document in MongoDB:</p>
      <pre><code class="language-javascript">{
  "_id": ObjectId("5099803df3f4948bd2f98391"),
  "username": "johndoe",
  "name": {
    "first": "John",
    "last": "Doe"
  },
  "contact": {
    "email": "johndoe@example.com",
    "phone": "555-123-4567"
  },
  "status": "active"
}</code></pre>
      <p>This flexible schema means that documents in the same collection do not need to have the same set of fields or structure. This allows for rapid iteration during application development.</p>
    `
  },
  {
    slug: "installing-and-configuring",
    title: "2. Installing & Configuring MongoDB",
    order: 2,
    content: `
      <h2>Installing MongoDB</h2>
      <p>To begin working with MongoDB, you must first install it on your system. MongoDB provides distributions for various operating systems including Linux, macOS, and Windows.</p>
      <h3>Installation on macOS via Homebrew</h3>
      <p>You can use Homebrew to install the MongoDB Community Edition on macOS:</p>
      <pre><code class="language-javascript">brew tap mongodb/brew
brew install mongodb-community@7.0</code></pre>
      <h3>Starting the MongoDB Service</h3>
      <p>Once installed, you can run MongoDB as a background service using Homebrew:</p>
      <pre><code class="language-javascript">brew services start mongodb-community@7.0</code></pre>
      <h3>Configuration File</h3>
      <p>MongoDB's configuration is managed via a YAML file, typically located at <code>/etc/mongod.conf</code> on Linux or <code>/opt/homebrew/etc/mongod.conf</code> on macOS. You can configure various settings such as storage path, network interfaces, and security.</p>
      <pre><code class="language-javascript">systemLog:
  destination: file
  path: /usr/local/var/log/mongodb/mongo.log
  logAppend: true
storage:
  dbPath: /usr/local/var/mongodb
net:
  bindIp: 127.0.0.1, ::1
  ipv6: true</code></pre>
      <p>Understanding how to properly configure your <code>mongod.conf</code> file is essential for ensuring your database is secure, performant, and operates smoothly within your infrastructure.</p>
    `
  },
  {
    slug: "the-mongo-shell",
    title: "3. The MongoDB Shell (mongosh)",
    order: 3,
    content: `
      <h2>The MongoDB Shell (mongosh)</h2>
      <p>The MongoDB Shell, or <code>mongosh</code>, is an interactive JavaScript interface to MongoDB. You can use mongosh to query and update data, perform administrative operations, and run JavaScript scripts.</p>
      <h3>Connecting to a Deployment</h3>
      <p>To connect to a local MongoDB instance running on the default port (27017), simply run:</p>
      <pre><code class="language-javascript">mongosh</code></pre>
      <p>To connect to a remote deployment or a MongoDB Atlas cluster, use the connection string:</p>
      <pre><code class="language-javascript">mongosh "mongodb+srv://cluster0.example.mongodb.net/myFirstDatabase" --apiVersion 1 --username &lt;username&gt;</code></pre>
      <h3>Basic Shell Commands</h3>
      <ul>
        <li><code>show dbs</code>: Lists all databases on the server.</li>
        <li><code>use &lt;database_name&gt;</code>: Switches the current database to the specified one.</li>
        <li><code>show collections</code>: Lists all collections in the current database.</li>
      </ul>
      <p>Example session:</p>
      <pre><code class="language-javascript">> use myDatabase
switched to db myDatabase
> db.myCollection.insertOne({ name: "Alice", age: 30 })
{
  acknowledged: true,
  insertedId: ObjectId("60a2b...9a")
}
> db.myCollection.find()
[ { _id: ObjectId("60a2b...9a"), name: 'Alice', age: 30 } ]</code></pre>
    `
  },
  {
    slug: "crud-create",
    title: "4. CRUD Operations: Create",
    order: 4,
    content: `
      <h2>Create Operations in MongoDB</h2>
      <p>Create or insert operations add new documents to a collection. If the collection does not currently exist, insert operations will create the collection.</p>
      <h3>insertOne()</h3>
      <p>The <code>db.collection.insertOne()</code> method inserts a single document into a collection.</p>
      <pre><code class="language-javascript">db.users.insertOne({
  name: "Bob Builder",
  profession: "Constructor",
  age: 45,
  skills: ["carpentry", "plumbing"]
});</code></pre>
      <h3>insertMany()</h3>
      <p>The <code>db.collection.insertMany()</code> method inserts an array of documents.</p>
      <pre><code class="language-javascript">db.users.insertMany([
  { name: "Alice", age: 28 },
  { name: "Charlie", age: 34 },
  { name: "Diana", age: 22 }
]);</code></pre>
      <h3>The _id Field</h3>
      <p>In MongoDB, each document stored in a collection requires a unique <code>_id</code> field that acts as a primary key. If an inserted document omits the <code>_id</code> field, the MongoDB driver automatically generates an ObjectId for the <code>_id</code> field.</p>
      <p>Best Practices: Only insert the data you need, and structure your documents to match your application's query patterns. Avoid deeply nested arrays if they will grow unboundedly, as MongoDB has a 16MB document size limit.</p>
    `
  },
  {
    slug: "crud-read",
    title: "5. CRUD Operations: Read",
    order: 5,
    content: `
      <h2>Read Operations in MongoDB</h2>
      <p>Read operations retrieve documents from a collection; i.e. query a collection for documents. MongoDB provides the following methods to read documents from a collection:</p>
      <ul>
        <li><code>db.collection.find()</code></li>
        <li><code>db.collection.findOne()</code></li>
      </ul>
      <h3>Basic Queries</h3>
      <p>To select all documents in a collection, pass an empty document as the query filter parameter to the find method.</p>
      <pre><code class="language-javascript">db.users.find({});</code></pre>
      <p>To query for documents that match a specific equality condition, pass a document with the field and value.</p>
      <pre><code class="language-javascript">db.users.find({ age: 28 });</code></pre>
      <h3>Query Operators</h3>
      <p>MongoDB provides a robust set of query operators to perform more complex queries.</p>
      <pre><code class="language-javascript">// Find users older than 25
db.users.find({ age: { $gt: 25 } });

// Find users whose name is either Alice or Bob
db.users.find({ name: { $in: ["Alice", "Bob"] } });

// Find users older than 20 AND younger than 30
db.users.find({ age: { $gt: 20, $lt: 30 } });</code></pre>
      <h3>Projections</h3>
      <p>By default, queries in MongoDB return all fields in matching documents. To limit the amount of data that MongoDB sends to applications, you can include a projection document to specify or restrict fields to return.</p>
      <pre><code class="language-javascript">// Return only the name and age fields, exclude _id
db.users.find({ age: { $gt: 25 } }, { name: 1, age: 1, _id: 0 });</code></pre>
    `
  },
  {
    slug: "crud-update",
    title: "6. CRUD Operations: Update",
    order: 6,
    content: `
      <h2>Update Operations in MongoDB</h2>
      <p>Update operations modify existing documents in a collection. MongoDB provides the following methods to update documents of a collection:</p>
      <ul>
        <li><code>updateOne()</code></li>
        <li><code>updateMany()</code></li>
        <li><code>replaceOne()</code></li>
      </ul>
      <h3>Update Operators</h3>
      <p>To update a document, MongoDB provides update operators, such as <code>$set</code> to modify values.</p>
      <pre><code class="language-javascript">db.users.updateOne(
  { name: "Alice" }, // Query filter
  { $set: { age: 29, status: "active" } } // Update operation
);</code></pre>
      <p>Other common update operators include:</p>
      <ul>
        <li><code>$inc</code>: Increments the value of the field by the specified amount.</li>
        <li><code>$push</code>: Appends a specified value to an array.</li>
        <li><code>$pull</code>: Removes all array elements that match a specified query.</li>
        <li><code>$unset</code>: Removes the specified field from a document.</li>
      </ul>
      <pre><code class="language-javascript">db.users.updateMany(
  { age: { $lt: 25 } },
  { $inc: { points: 10 } }
);</code></pre>
      <h3>Upsert</h3>
      <p>If no document matches the query filter, an update operation can create a new document by setting the <code>upsert</code> option to true.</p>
      <pre><code class="language-javascript">db.users.updateOne(
  { name: "Edward" },
  { $set: { age: 30 } },
  { upsert: true }
);</code></pre>
    `
  },
  {
    slug: "crud-delete",
    title: "7. CRUD Operations: Delete",
    order: 7,
    content: `
      <h2>Delete Operations in MongoDB</h2>
      <p>Delete operations remove documents from a collection. MongoDB provides the following methods to delete documents of a collection:</p>
      <ul>
        <li><code>deleteOne()</code></li>
        <li><code>deleteMany()</code></li>
      </ul>
      <h3>deleteOne()</h3>
      <p>The <code>deleteOne()</code> method deletes the first document that matches the filter. Use a field that is part of a unique index such as <code>_id</code> for exact deletion.</p>
      <pre><code class="language-javascript">db.users.deleteOne({ name: "Edward" });</code></pre>
      <h3>deleteMany()</h3>
      <p>The <code>deleteMany()</code> method deletes all documents that match the filter.</p>
      <pre><code class="language-javascript">db.users.deleteMany({ status: "inactive" });</code></pre>
      <h3>Dropping a Collection</h3>
      <p>If you need to delete all documents in a collection, it is more efficient to drop the entire collection and recreate the indexes than to delete all documents individually.</p>
      <pre><code class="language-javascript">db.users.drop();</code></pre>
      <p>Note: Delete operations do not drop indexes, even if deleting all documents from a collection.</p>
    `
  },
  {
    slug: "data-modeling-basics",
    title: "8. Data Modeling Basics",
    order: 8,
    content: `
      <h2>Data Modeling in MongoDB</h2>
      <p>Unlike relational databases, MongoDB's flexible schema allows for documents in the same collection to have different fields. However, defining a good data model is crucial for performance and scalability.</p>
      <h3>Embedding vs. Referencing</h3>
      <p>The key decision in designing data models for MongoDB is whether to embed data within a single document or to store data in separate documents and reference them.</p>
      <h4>Embedded Data Models</h4>
      <p>Embedded documents capture relationships between data by storing related data in a single document structure. This approach is recommended when you have "contains" relationships between entities or one-to-many relationships where the "many" objects always appear with or are viewed in the context of the parent documents.</p>
      <pre><code class="language-javascript">{
  _id: "joe",
  name: "Joe Bookreader",
  addresses: [
    { street: "123 Fake Street", city: "Faketown", state: "MA", zip: "12345" },
    { street: "1 Some Other Street", city: "Boston", state: "MA", zip: "12345" }
  ]
}</code></pre>
      <h4>Normalized Data Models (Referencing)</h4>
      <p>References store the relationships between data by including links or references from one document to another. This approach is recommended when embedding would result in duplication of data but would not provide sufficient read performance advantages to outweigh the implications of the duplication.</p>
      <pre><code class="language-javascript">// Publisher Document
{
  _id: "oreilly",
  name: "O'Reilly Media",
  founded: 1980
}

// Book Document
{
  _id: 123456789,
  title: "MongoDB: The Definitive Guide",
  publisher_id: "oreilly"
}</code></pre>
    `
  },
  {
    slug: "schema-validation",
    title: "9. Schema Validation",
    order: 9,
    content: `
      <h2>Schema Validation in MongoDB</h2>
      <p>Although MongoDB is schema-less by default, it provides the ability to perform schema validation during updates and insertions. This ensures that data conforms to specific rules before being saved to the database.</p>
      <h3>Using JSON Schema</h3>
      <p>MongoDB uses JSON Schema to define the validation rules. You can define a validation schema when creating a collection or update an existing collection.</p>
      <pre><code class="language-javascript">db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "name", "year", "major", "address" ],
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
        },
        major: {
          enum: [ "Math", "English", "Computer Science", "History", null ],
          description: "can only be one of the enum values and is required"
        },
        address: {
          bsonType: "object",
          required: [ "city" ],
          properties: {
            street: {
              bsonType: "string",
              description: "must be a string if provided"
            },
            city: {
              bsonType: "string",
              description: "must be a string and is required"
            }
          }
        }
      }
    }
  }
})</code></pre>
      <p>By enforcing a schema, you gain the benefits of data integrity while still maintaining the flexibility of a document database.</p>
    `
  },
  {
    slug: "mongodb-compass",
    title: "10. Using MongoDB Compass",
    order: 10,
    content: `
      <h2>MongoDB Compass</h2>
      <p>MongoDB Compass is the official graphical user interface (GUI) for MongoDB. It allows users to visually explore their data, interact with databases, and optimize query performance without knowing the command-line syntax.</p>
      <h3>Key Features of Compass</h3>
      <ul>
        <li><strong>Visual Data Exploration:</strong> View, insert, modify, and delete documents intuitively.</li>
        <li><strong>Query Builder:</strong> Create queries using a point-and-click interface.</li>
        <li><strong>Aggregation Pipeline Builder:</strong> Design complex aggregation pipelines step-by-step and preview the results at each stage.</li>
        <li><strong>Performance Optimization:</strong> View visual explain plans to understand query performance and identify missing indexes.</li>
        <li><strong>Schema Visualization:</strong> Automatically analyze your collections and display the data types, distributions, and outliers.</li>
      </ul>
      <h3>Connecting with Compass</h3>
      <p>To connect to a database, you can use the same connection string format used in <code>mongosh</code> or your application code:</p>
      <pre><code class="language-javascript">mongodb+srv://username:password@cluster.mongodb.net/test</code></pre>
      <p>Compass is an indispensable tool for both beginners learning MongoDB and advanced developers building and debugging complex queries.</p>
    `
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
