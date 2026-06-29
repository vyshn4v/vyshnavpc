import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "aggregation-pipeline-stages",
    title: "16. Aggregation Pipeline Stages ($match, $group, $project)",
    order: 16,
    content: `
      <h2>Aggregation Pipeline Stages</h2>
      <p>The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results.</p>
      <h3>$match</h3>
      <p>The <code>$match</code> stage filters the document stream to allow only matching documents to pass unmodified into the next pipeline stage. It is recommended to place <code>$match</code> as early in the pipeline as possible to reduce the number of documents to be processed.</p>
      <pre><code class="language-javascript">{ $match: { status: "A" } }</code></pre>
      <h3>$group</h3>
      <p>The <code>$group</code> stage groups input documents by a specified identifier expression and applies the accumulator expression(s), if specified, to each group. It outputs one document for each unique group.</p>
      <pre><code class="language-javascript">{ 
  $group: { 
    _id: "$custId", 
    totalAmount: { $sum: "$amount" } 
  } 
}</code></pre>
      <h3>$project</h3>
      <p>The <code>$project</code> stage passes along the documents with the requested fields to the next stage in the pipeline. The specified fields can be existing fields from the input documents or newly computed fields.</p>
      <pre><code class="language-javascript">{ 
  $project: { 
    title: 1, 
    author: 1, 
    isbn: {
      prefix: { $substr: ["$isbn", 0, 3] },
      no: { $substr: ["$isbn", 3, 10] }
    }
  } 
}</code></pre>
    `,
    interviewQuestions: [
      {
        question: "Why should you place the `$match` stage as early as possible in the aggregation pipeline?",
        answer: "Placing `$match` early filters out documents quickly, reducing the amount of data the pipeline has to process in subsequent stages. Furthermore, when placed at the beginning of a pipeline, `$match` operations can use indexes to improve performance."
      },
      {
        question: "Explain what the `_id` field in a `$group` stage does.",
        answer: "The `_id` field in the `$group` stage defines the grouping key. All documents that have the same value for the expression specified in `_id` will be grouped into a single output document. You can set it to `null` to calculate accumulated values for all input documents as a whole."
      }
    ],
    practicalTask: {
      scenario: "You have an 'orders' collection. You need to find the total revenue for all completed orders for each customer.",
      task: "Write an aggregation pipeline using `$match` and `$group`.",
      solutionCode: `db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", totalRevenue: { $sum: "$amount" } } }
]);`
    }
  },
  {
    slug: "advanced-aggregation",
    title: "17. Advanced Aggregation ($lookup, $unwind)",
    order: 17,
    content: `
      <h2>Advanced Aggregation</h2>
      <p>MongoDB's aggregation pipeline also supports advanced operations like joining collections and expanding arrays.</p>
      <h3>$lookup</h3>
      <p>The <code>$lookup</code> stage performs a left outer join to an unsharded collection in the same database to filter in documents from the "joined" collection for processing.</p>
      <pre><code class="language-javascript">{
  $lookup: {
    from: "inventory",
    localField: "item",
    foreignField: "sku",
    as: "inventory_docs"
  }
}</code></pre>
      <h3>$unwind</h3>
      <p>The <code>$unwind</code> stage deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.</p>
      <pre><code class="language-javascript">{ $unwind: "$sizes" }</code></pre>
      <p>Using <code>$lookup</code> followed by <code>$unwind</code> is a common pattern to flat-map joined arrays into a flat structure for easier grouping or projection.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the primary purpose of the `$lookup` stage?",
        answer: "`$lookup` is used to perform a left outer join between two collections in the same database. It allows you to combine data from multiple collections without needing to make multiple round trips from your application."
      },
      {
        question: "What happens if you use `$unwind` on an empty array?",
        answer: "By default, `$unwind` will ignore the input document if the array is empty, missing, or null. To output the document even if the array is empty or missing, you must set the `preserveNullAndEmptyArrays` option to `true`."
      }
    ],
    practicalTask: {
      scenario: "You have a 'users' collection and a 'posts' collection. Users have an `_id` and posts have an `authorId`.",
      task: "Write an aggregation pipeline to fetch all users along with their corresponding posts, and output one document per post.",
      solutionCode: `db.users.aggregate([
  {
    $lookup: {
      from: "posts",
      localField: "_id",
      foreignField: "authorId",
      as: "user_posts"
    }
  },
  {
    $unwind: "$user_posts"
  }
]);`
    }
  },
  {
    slug: "data-modeling-one-to-one-and-many",
    title: "18. Data Modeling: One-to-One and One-to-Many",
    order: 18,
    content: `
      <h2>Data Modeling: 1:1 and 1:N Relationships</h2>
      <p>In MongoDB, data relationships can be modeled by either embedding documents or using references (normalization). The choice depends on data size and access patterns.</p>
      <h3>One-to-One Relationships</h3>
      <p>Generally, One-to-One relationships are best modeled with embedding. This keeps related data in a single document, minimizing read operations.</p>
      <pre><code class="language-javascript">// Embedding Patient and their Medical Record
{
  _id: 1,
  name: "John Doe",
  medical_record: {
    blood_type: "O+",
    allergies: ["Peanuts"]
  }
}</code></pre>
      <h3>One-to-Many Relationships</h3>
      <p>One-to-Many relationships can be modeled with embedding (if the "Many" side is bounded) or referencing (if the "Many" side is unbounded).</p>
      <pre><code class="language-javascript">// 1-to-Few (Embedding)
{
  name: "Jane Doe",
  addresses: [
    { street: "123 Main St", city: "NY" },
    { street: "456 Side St", city: "LA" }
  ]
}

// 1-to-Many (Referencing)
// User Document
{ _id: ObjectId("5f1b..."), name: "Jane" }
// Order Document
{ _id: ObjectId("6f2c..."), userId: ObjectId("5f1b..."), amount: 100 }
</code></pre>
    `,
    interviewQuestions: [
      {
        question: "When should you use embedding over referencing for One-to-Many relationships?",
        answer: "Embedding is preferred when the 'many' side of the relationship is relatively small and bounded (e.g., a few addresses for a user). It improves read performance since all data is fetched in a single query."
      },
      {
        question: "What is the risk of using embedding for unbounded One-to-Many relationships?",
        answer: "If the array continues to grow indefinitely (like comments on a highly popular post), the document could exceed MongoDB's 16MB document size limit, leading to write errors."
      }
    ],
    practicalTask: {
      scenario: "A 'product' can have multiple 'reviews', which grow rapidly and can easily reach thousands per product.",
      task: "Design the schema for products and reviews using Mongoose-like syntax.",
      solutionCode: `const productSchema = new Schema({
  name: String,
  price: Number
});

const reviewSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  text: String,
  rating: Number
});`
    }
  },
  {
    slug: "data-modeling-many-to-many-trees",
    title: "19. Data Modeling: Many-to-Many & Tree Structures",
    order: 19,
    content: `
      <h2>Many-to-Many & Tree Structures</h2>
      <p>Complex relationships require careful schema design to maintain read performance and avoid excessive query complexity.</p>
      <h3>Many-to-Many Relationships</h3>
      <p>Many-to-Many relationships are modeled using arrays of references. You can store the array of references on either side or both sides depending on how the data is queried.</p>
      <pre><code class="language-javascript">// Students and Courses
// Student Document
{ _id: 1, name: "Alice", enrolled_courses: [101, 102] }
// Course Document
{ _id: 101, name: "Math", enrolled_students: [1, 2] }
</code></pre>
      <h3>Tree Structures (Hierarchical Data)</h3>
      <p>MongoDB provides several patterns to model tree structures:</p>
      <ul>
        <li><strong>Parent References:</strong> Each node stores its parent's ID. Good for simple trees and immediate child lookups.</li>
        <li><strong>Child References:</strong> Each node stores an array of its children's IDs.</li>
        <li><strong>Array of Ancestors:</strong> Each node stores its parent's ID and an array of all ancestor IDs. Good for finding all ancestors or descendants.</li>
        <li><strong>Materialized Paths:</strong> Each node stores a string representing its full path in the tree (e.g., <code>",books,programming,databases,"</code>). Pattern matching (Regex) is used to find subtrees.</li>
      </ul>
    `,
    interviewQuestions: [
      {
        question: "In a Many-to-Many relationship, when would you store references on both sides?",
        answer: "You store references on both sides when you frequently need to query the relationship from both directions (e.g., finding all courses for a student, and finding all students in a course) without doing expensive collection scans."
      },
      {
        question: "Explain the Materialized Paths pattern for tree structures.",
        answer: "Materialized Paths store the full path to a node as a string field. For example, a node under 'Electronics' -> 'Computers' might have a path 'electronics/computers'. You can query for all descendants of 'Electronics' using a regular expression that matches the path prefix."
      }
    ],
    practicalTask: {
      scenario: "You are building a category tree for an e-commerce site using the Parent Reference pattern.",
      task: "Write a Mongoose schema for the Category and a query to find all direct children of a given parent category ID.",
      solutionCode: `const categorySchema = new Schema({
  name: String,
  parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
});

// Find children
db.categories.find({ parentId: ObjectId("...") });`
    }
  },
  {
    slug: "transactions-in-mongodb",
    title: "20. Transactions in MongoDB",
    order: 20,
    content: `
      <h2>Transactions in MongoDB</h2>
      <p>Starting with MongoDB 4.0 (for replica sets) and 4.2 (for sharded clusters), MongoDB supports multi-document ACID transactions.</p>
      <h3>When to use Transactions</h3>
      <p>In MongoDB, operations on a single document are always atomic. Because MongoDB allows you to embed related data into a single document, many use cases do not require multi-document transactions. However, if you must update multiple documents across multiple collections atomically, you should use transactions.</p>
      <h3>Using Transactions</h3>
      <p>Transactions are associated with a Client Session. All operations within a transaction must be passed the session.</p>
      <pre><code class="language-javascript">const session = client.startSession();

try {
  session.startTransaction();
  
  await coll1.updateOne({ _id: 1 }, { $set: { a: 1 } }, { session });
  await coll2.insertOne({ b: 2 }, { session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}</code></pre>
      <p>Note: Transactions have a performance cost and hold locks on the involved documents, which can cause contention. Keep transactions as short-lived as possible.</p>
    `,
    interviewQuestions: [
      {
        question: "Why are multi-document transactions less frequently needed in MongoDB compared to relational databases?",
        answer: "Because MongoDB's document model allows for embedding related data into a single document, and operations on a single document are fully atomic. Normalizing data across tables in SQL inherently requires multi-statement transactions to keep them consistent."
      },
      {
        question: "What is required to start a transaction in MongoDB?",
        answer: "You must first start a client session using \`client.startSession()\`, then call \`session.startTransaction()\`. All database operations that are part of the transaction must explicitly pass the \`session\` object in their options."
      }
    ],
    practicalTask: {
      scenario: "You are transferring funds from Account A to Account B. You need to deduct from A and add to B atomically.",
      task: "Write a Node.js transaction snippet to handle this.",
      solutionCode: `const session = client.startSession();
session.startTransaction();
try {
  await accounts.updateOne({ _id: 'A' }, { $inc: { balance: -100 } }, { session });
  await accounts.updateOne({ _id: 'B' }, { $inc: { balance: 100 } }, { session });
  await session.commitTransaction();
} catch (e) {
  await session.abortTransaction();
} finally {
  session.endSession();
}`
    }
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
