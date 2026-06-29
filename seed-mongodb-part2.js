import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "crud-create-insert",
    title: "6. CRUD Operations: Create (Insert)",
    order: 6,
    content: `
      <h2>Create Operations in MongoDB</h2>
      <p>In MongoDB, creating data is accomplished using insert operations. The primary methods are <code>insertOne()</code> and <code>insertMany()</code>.</p>
      <h3>insertOne()</h3>
      <p>Inserts a single document into a collection. If the collection does not exist, MongoDB creates it implicitly.</p>
      <pre><code class="language-javascript">db.users.insertOne({ name: "Alice", age: 25, status: "active" })</code></pre>
      <h3>insertMany()</h3>
      <p>Inserts multiple documents into a collection. By default, documents are inserted in order. If an error occurs during an ordered insert, MongoDB returns without processing the remaining documents.</p>
      <pre><code class="language-javascript">db.users.insertMany([
  { name: "Bob", age: 30, status: "active" },
  { name: "Charlie", age: 28, status: "inactive" }
])</code></pre>
      <p>Each document inserted is automatically assigned a unique <code>_id</code> field by MongoDB if one is not provided.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the difference between insertOne() and insertMany() in MongoDB?",
        answer: "insertOne() adds a single document to a collection, while insertMany() adds an array of documents. insertMany() can also be configured to be ordered or unordered, affecting how errors during bulk insertion are handled."
      },
      {
        question: "What happens if you do not specify an _id field when inserting a document?",
        answer: "MongoDB automatically generates a unique ObjectId for the _id field and adds it to the document."
      }
    ],
    practicalTask: {
      scenario: "You need to add products to your new e-commerce database.",
      task: "Insert an array of three products into the 'products' collection using a single operation.",
      solutionCode: `db.products.insertMany([
  { name: "Laptop", price: 1200, category: "Electronics" },
  { name: "Mouse", price: 25, category: "Electronics" },
  { name: "Desk", price: 150, category: "Furniture" }
]);`
    }
  },
  {
    slug: "crud-read-find",
    title: "7. CRUD Operations: Read (Find, Query Operators)",
    order: 7,
    content: `
      <h2>Read Operations in MongoDB</h2>
      <p>Read operations retrieve documents from a collection. The primary methods are <code>find()</code> and <code>findOne()</code>.</p>
      <h3>find() and findOne()</h3>
      <p><code>find()</code> returns a cursor pointing to the matched documents, while <code>findOne()</code> returns the first matching document.</p>
      <pre><code class="language-javascript">db.users.find({ status: "active" })
db.users.findOne({ name: "Alice" })</code></pre>
      <h3>Query Operators</h3>
      <p>MongoDB provides a rich set of query operators to perform complex lookups:</p>
      <ul>
        <li><strong>Comparison:</strong> <code>$eq</code>, <code>$gt</code>, <code>$gte</code>, <code>$lt</code>, <code>$lte</code>, <code>$in</code>, <code>$ne</code>, <code>$nin</code></li>
        <li><strong>Logical:</strong> <code>$and</code>, <code>$or</code>, <code>$not</code>, <code>$nor</code></li>
      </ul>
      <p>Example using operators:</p>
      <pre><code class="language-javascript">db.products.find({
  price: { $gt: 50, $lt: 200 },
  category: { $in: ["Electronics", "Furniture"] }
})</code></pre>
      <p>This query finds products with a price greater than 50 and less than 200, belonging to either the Electronics or Furniture category.</p>
    `,
    interviewQuestions: [
      {
        question: "How do you perform a query with an 'OR' condition in MongoDB?",
        answer: "You use the $or logical operator, which takes an array of query expressions. For example: db.collection.find({ $or: [{ status: 'A' }, { qty: { $lt: 30 } }] })"
      },
      {
        question: "What is the difference between find() and findOne()?",
        answer: "find() returns a cursor that you can iterate over to access multiple matching documents, whereas findOne() immediately returns the first single document that matches the query."
      }
    ],
    practicalTask: {
      scenario: "You need to find specific active users for a promotional campaign.",
      task: "Query the 'users' collection to find all users whose age is greater than 20 and less than 30, and whose status is 'active'.",
      solutionCode: `db.users.find({
  age: { $gt: 20, $lt: 30 },
  status: "active"
});`
    }
  },
  {
    slug: "crud-update",
    title: "8. CRUD Operations: Update",
    order: 8,
    content: `
      <h2>Update Operations in MongoDB</h2>
      <p>Update operations modify existing documents in a collection. The primary methods are <code>updateOne()</code>, <code>updateMany()</code>, and <code>replaceOne()</code>.</p>
      <h3>updateOne() and updateMany()</h3>
      <p>Both methods take a filter document and an update document. <code>updateOne()</code> modifies the first matched document, while <code>updateMany()</code> modifies all matching documents.</p>
      <pre><code class="language-javascript">db.users.updateOne(
  { name: "Alice" },
  { $set: { status: "inactive" } }
)</code></pre>
      <h3>Update Operators</h3>
      <p>Update documents use update operators to specify the modification to perform:</p>
      <ul>
        <li><code>$set</code>: Replaces the value of a field.</li>
        <li><code>$inc</code>: Increments the value of a field by a specified amount.</li>
        <li><code>$unset</code>: Removes a field from a document.</li>
        <li><code>$push</code>: Appends a value to an array.</li>
      </ul>
      <pre><code class="language-javascript">db.products.updateMany(
  { category: "Electronics" },
  { $inc: { price: 10 } }
)</code></pre>
      <p>This increments the price of all Electronic products by 10.</p>
    `,
    interviewQuestions: [
      {
        question: "What does the $set operator do in an update operation?",
        answer: "The $set operator replaces the value of a field with the specified value. If the field does not exist, $set will add the new field with the specified value."
      },
      {
        question: "How can you add an element to an array field in a document?",
        answer: "You can use the $push operator in your update document to append a specified value to an array."
      }
    ],
    practicalTask: {
      scenario: "A user changed their email address.",
      task: "Update the user with username 'johndoe' to have a new email 'john.new@example.com' using the $set operator.",
      solutionCode: `db.users.updateOne(
  { username: "johndoe" },
  { $set: { email: "john.new@example.com" } }
);`
    }
  },
  {
    slug: "crud-delete",
    title: "9. CRUD Operations: Delete",
    order: 9,
    content: `
      <h2>Delete Operations in MongoDB</h2>
      <p>Delete operations remove documents from a collection. The main methods are <code>deleteOne()</code> and <code>deleteMany()</code>.</p>
      <h3>deleteOne() and deleteMany()</h3>
      <p><code>deleteOne()</code> removes the first document that matches the filter, whereas <code>deleteMany()</code> removes all matching documents.</p>
      <pre><code class="language-javascript">db.users.deleteOne({ name: "Alice" })

db.users.deleteMany({ status: "inactive" })</code></pre>
      <h3>Dropping a Collection</h3>
      <p>If you need to remove all documents from a collection and you also do not need the collection itself (including its indexes), it is much more efficient to drop the collection rather than using <code>deleteMany({})</code>.</p>
      <pre><code class="language-javascript">db.users.drop()</code></pre>
      <p>Unlike relational databases, there is no cascading delete built directly into MongoDB; managing relationships during deletion must be handled by application logic.</p>
    `,
    interviewQuestions: [
      {
        question: "When would you use deleteMany({}) instead of db.collection.drop()?",
        answer: "You would use deleteMany({}) if you want to remove all documents but keep the collection and its indexes intact. drop() removes the collection entirely, including its indexes, which is faster but requires recreation if needed again."
      },
      {
        question: "Does deleteOne() guarantee which document is deleted if multiple match?",
        answer: "No, if multiple documents match the filter, deleteOne() deletes the first document it encounters based on the collection's natural order or an index, which may not be predictable."
      }
    ],
    practicalTask: {
      scenario: "You are cleaning up your database by removing inactive user accounts.",
      task: "Delete all documents in the 'users' collection where the 'status' is 'deleted'.",
      solutionCode: `db.users.deleteMany({ status: "deleted" });`
    }
  },
  {
    slug: "bulk-operations-write-concerns",
    title: "10. Bulk Operations & Write Concerns",
    order: 10,
    content: `
      <h2>Bulk Operations and Write Concerns</h2>
      <p>For high-performance applications, MongoDB provides bulk operations and configurable write concerns to manage how data is written to the database.</p>
      <h3>Bulk Operations</h3>
      <p>The <code>bulkWrite()</code> method provides the ability to perform multiple write operations (insert, update, delete) in a single command, reducing network round trips.</p>
      <pre><code class="language-javascript">db.collection.bulkWrite([
  { insertOne: { document: { _id: 1, type: "apple" } } },
  { updateOne: { filter: { _id: 2 }, update: { $set: { type: "banana" } } } },
  { deleteMany: { filter: { type: "orange" } } }
])</code></pre>
      <h3>Write Concerns</h3>
      <p>A write concern describes the level of acknowledgment requested from MongoDB for write operations. It determines when the server responds to a write.</p>
      <ul>
        <li><code>w: 1</code> (Default): Requests acknowledgment that the write operation has propagated to the standalone mongod or the primary in a replica set.</li>
        <li><code>w: "majority"</code>: Requests acknowledgment that the write operations have propagated to the calculated majority of the data-bearing voting members.</li>
        <li><code>j: true</code>: Requests acknowledgment that the mongod instance has written to the on-disk journal, ensuring data durability across server restarts.</li>
      </ul>
      <pre><code class="language-javascript">db.users.insertOne(
  { name: "Bob", status: "active" },
  { writeConcern: { w: "majority", j: true, wtimeout: 5000 } }
)</code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the primary benefit of using bulkWrite()?",
        answer: "The primary benefit is performance optimization. bulkWrite() executes multiple write operations in a single network request, significantly reducing network latency and overhead compared to executing each operation individually."
      },
      {
        question: "What does a write concern of 'majority' ensure?",
        answer: "It ensures that the write operation has been replicated to a majority of the voting nodes in a replica set before acknowledging success, preventing data loss in the event of a primary node failure."
      }
    ],
    practicalTask: {
      scenario: "You need to process a batch of different updates efficiently.",
      task: "Use bulkWrite() to insert one document { name: 'NewItem' } and delete one document with name 'OldItem'.",
      solutionCode: `db.collection.bulkWrite([
  { insertOne: { document: { name: "NewItem" } } },
  { deleteOne: { filter: { name: "OldItem" } } }
]);`
    }
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics).then(() => {
  console.log("Topics 6-10 seeded successfully.");
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
