import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "aggregation-framework-intro",
    title: "21. Aggregation Framework Overview",
    order: 21,
    content: `
      <h2>The Aggregation Framework</h2>
      <p>The aggregation framework is a powerful pipeline-based system for data processing in MongoDB. Modeled on the concept of data processing pipelines, documents enter a multi-stage pipeline that transforms them into aggregated results.</p>
      <h3>The Pipeline Concept</h3>
      <p>A pipeline consists of multiple stages. Each stage transforms the documents as they pass through. Pipeline stages do not need to produce one output document for every input document; stages may also generate new documents or filter out documents.</p>
      <pre><code class="language-javascript">db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
])</code></pre>
      <p>In this example, the <code>$match</code> stage filters documents by status. The matching documents are then passed to the <code>$group</code> stage, which groups them by <code>cust_id</code> and calculates the total amount.</p>
      <h3>Common Stages</h3>
      <ul>
        <li><code>$match</code>: Filters the documents.</li>
        <li><code>$group</code>: Groups documents by a specified identifier and applies accumulator expressions.</li>
        <li><code>$project</code>: Reshapes each document (add, remove, or rename fields).</li>
        <li><code>$sort</code>: Reorders the documents.</li>
        <li><code>$limit</code> / <code>$skip</code>: Used for pagination.</li>
      </ul>
    `
  },
  {
    slug: "aggregation-match-group",
    title: "22. Deep Dive: $match and $group",
    order: 22,
    content: `
      <h2>Deep Dive: $match and $group</h2>
      <p>The <code>$match</code> and <code>$group</code> stages are the foundation of most aggregation pipelines.</p>
      <h3>$match Stage</h3>
      <p>The <code>$match</code> stage uses standard MongoDB query syntax. It is highly recommended to place <code>$match</code> as early in the pipeline as possible. If placed at the very beginning, <code>$match</code> can use indexes to improve performance.</p>
      <pre><code class="language-javascript">{ $match: { date: { $gte: new ISODate("2023-01-01") } } }</code></pre>
      <h3>$group Stage</h3>
      <p>The <code>$group</code> stage separates documents into groups according to a "group key". The output is one document for each unique group key.</p>
      <p>You can use accumulator operators to calculate values across the grouped documents:</p>
      <ul>
        <li><code>$sum</code>: Returns a sum of numerical values.</li>
        <li><code>$avg</code>: Returns an average.</li>
        <li><code>$max</code> / <code>$min</code>: Returns the highest/lowest value.</li>
        <li><code>$push</code>: Returns an array of expression values.</li>
      </ul>
      <pre><code class="language-javascript">db.sales.aggregate([
  { $group: {
      _id: "$department",
      totalRevenue: { $sum: { $multiply: ["$price", "$quantity"] } },
      averagePrice: { $avg: "$price" },
      itemsSold: { $push: "$item" }
  }}
])</code></pre>
    `
  },
  {
    slug: "aggregation-lookup",
    title: "23. Joining Data with $lookup",
    order: 23,
    content: `
      <h2>Joining Data with $lookup</h2>
      <p>Because MongoDB is a document database, it encourages denormalized data models. However, when you must join data from different collections, the <code>$lookup</code> stage performs a left outer join to an unsharded collection in the same database.</p>
      <h3>Basic $lookup Syntax</h3>
      <pre><code class="language-javascript">db.orders.aggregate([
  {
    $lookup: {
      from: "inventory",
      localField: "item",
      foreignField: "sku",
      as: "inventory_docs"
    }
  }
])</code></pre>
      <p>In this query, MongoDB looks at the <code>item</code> field in the <code>orders</code> collection and searches the <code>inventory</code> collection where <code>sku</code> matches the <code>item</code> value. The matched documents are appended as an array in a new field called <code>inventory_docs</code>.</p>
      <h3>Correlated Subqueries</h3>
      <p>Starting in MongoDB 3.6, you can perform complex joins using a pipeline inside the <code>$lookup</code>.</p>
      <pre><code class="language-javascript">db.orders.aggregate([
  {
    $lookup: {
      from: "warehouses",
      let: { order_item: "$item", order_qty: "$ordered" },
      pipeline: [
        { $match:
           { $expr:
              { $and:
                 [
                   { $eq: [ "$stock_item",  "$$order_item" ] },
                   { $gte: [ "$instock", "$$order_qty" ] }
                 ]
              }
           }
        },
        { $project: { stock_item: 0, _id: 0 } }
      ],
      as: "stockdata"
    }
  }
])</code></pre>
    `
  },
  {
    slug: "aggregation-unwind-project",
    title: "24. Working with Arrays: $unwind",
    order: 24,
    content: `
      <h2>Working with Arrays: $unwind</h2>
      <p>The <code>$unwind</code> stage deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.</p>
      <h3>Basic Usage</h3>
      <pre><code class="language-javascript">// Input document: { _id: 1, item: "ABC", sizes: ["S", "M", "L"] }

db.inventory.aggregate([ { $unwind: "$sizes" } ])

// Output:
// { _id: 1, item: "ABC", sizes: "S" }
// { _id: 1, item: "ABC", sizes: "M" }
// { _id: 1, item: "ABC", sizes: "L" }</code></pre>
      <h3>Combining $unwind with $group</h3>
      <p><code>$unwind</code> is often used before <code>$group</code> to calculate statistics on array elements.</p>
      <pre><code class="language-javascript">db.articles.aggregate([
  { $unwind: "$tags" },
  { $group: { _id: "$tags", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])</code></pre>
      <p>This pipeline creates a frequency list of all tags used across all articles, sorted from most popular to least popular.</p>
    `
  },
  {
    slug: "indexing-the-esr-rule",
    title: "25. Indexing: The ESR Rule",
    order: 25,
    content: `
      <h2>Indexing Best Practices: The ESR Rule</h2>
      <p>When creating compound indexes, the order of the fields is critical. The <strong>ESR (Equality, Sort, Range)</strong> rule is a guideline for ordering fields in a compound index to maximize query performance.</p>
      <h3>E: Equality</h3>
      <p>Fields on which your queries perform exact matches (Equality) should come first. This allows the database to quickly narrow down the number of documents to examine.</p>
      <pre><code class="language-javascript">db.cars.find({ make: "Toyota", year: { $gt: 2015 } }).sort({ model: 1 })</code></pre>
      <p>In this query, <code>make</code> is an equality condition.</p>
      <h3>S: Sort</h3>
      <p>Fields used for sorting should come next. If the sort field follows the equality field, MongoDB can perform a non-blocking sort (returning sorted results directly from the index without an in-memory sort).</p>
      <h3>R: Range</h3>
      <p>Fields used in range filters (e.g., <code>$gt</code>, <code>$lt</code>, <code>$in</code>) should come last. Once a range scan begins, MongoDB cannot use subsequent fields in the index to sort the data.</p>
      <h3>Applying ESR</h3>
      <p>Based on the query above, the ideal index following the ESR rule is:</p>
      <pre><code class="language-javascript">db.cars.createIndex({ make: 1, model: 1, year: 1 })</code></pre>
      <p>First Equality (make), then Sort (model), then Range (year). Following ESR is the most important skill for a MongoDB performance engineer.</p>
    `
  },
  {
    slug: "covered-queries",
    title: "26. Covered Queries",
    order: 26,
    content: `
      <h2>Covered Queries</h2>
      <p>A covered query is a query that can be satisfied entirely using an index, meaning MongoDB does not need to inspect the actual documents in the collection.</p>
      <h3>Conditions for a Covered Query</h3>
      <p>A query is covered if:</p>
      <ul>
        <li>All fields in the query are part of an index.</li>
        <li>All fields returned in the results are in the same index.</li>
      </ul>
      <p>Because the index contains all the data needed, MongoDB avoids the disk I/O of reading the documents, resulting in lightning-fast responses.</p>
      <h3>Example</h3>
      <p>Assume we have an index on <code>status</code> and <code>username</code>:</p>
      <pre><code class="language-javascript">db.users.createIndex({ status: 1, username: 1 })</code></pre>
      <p>To make the query covered, we must explicitly project <em>only</em> those fields and exclude the <code>_id</code> field (unless <code>_id</code> is part of the index):</p>
      <pre><code class="language-javascript">db.users.find(
  { status: "active" },
  { username: 1, status: 1, _id: 0 }
)</code></pre>
      <p>When executing this query, an Explain Plan will show <code>totalDocsExamined: 0</code>, confirming it was fully covered.</p>
    `
  },
  {
    slug: "understanding-explain-plans",
    title: "27. Understanding Explain Plans",
    order: 27,
    content: `
      <h2>Understanding Explain Plans</h2>
      <p>To analyze how MongoDB executes a query, use the <code>explain()</code> method. This outputs a detailed execution plan, showing whether an index was used, how many documents were scanned, and the execution time.</p>
      <h3>Execution Stats Mode</h3>
      <p>Always run explain with <code>"executionStats"</code> to get real performance metrics.</p>
      <pre><code class="language-javascript">db.users.explain("executionStats").find({ age: { $gt: 30 } })</code></pre>
      <h3>Key Metrics to Look For</h3>
      <ul>
        <li><strong>winningPlan.stage:</strong> <code>COLLSCAN</code> means a full collection scan (bad). <code>IXSCAN</code> means an index scan (good). <code>FETCH</code> means retrieving the document after an index scan.</li>
        <li><strong>totalKeysExamined:</strong> The number of index entries scanned.</li>
        <li><strong>totalDocsExamined:</strong> The number of actual documents fetched from disk.</li>
        <li><strong>nReturned:</strong> The number of documents returned.</li>
      </ul>
      <p><strong>The Golden Ratio:</strong> The ideal query has <code>nReturned</code> equal to <code>totalKeysExamined</code> and <code>totalDocsExamined</code>. If <code>totalDocsExamined</code> is significantly higher than <code>nReturned</code>, your index is not selective enough or you are missing an index.</p>
    `
  },
  {
    slug: "partial-and-sparse-indexes",
    title: "28. Partial and Sparse Indexes",
    order: 28,
    content: `
      <h2>Partial and Sparse Indexes</h2>
      <p>Sometimes you don't want to index every document in a collection. MongoDB provides Sparse and Partial indexes to reduce index size and improve write performance.</p>
      <h3>Sparse Indexes</h3>
      <p>A sparse index only contains entries for documents that have the indexed field. Documents missing the field are not indexed.</p>
      <pre><code class="language-javascript">db.users.createIndex({ twitter_handle: 1 }, { sparse: true })</code></pre>
      <p>If a query searches for users without a twitter handle (e.g., <code>$exists: false</code>), it cannot use this index.</p>
      <h3>Partial Indexes</h3>
      <p>Partial indexes are a superset of sparse indexes. They allow you to specify a filter expression to dictate which documents are indexed. They are preferred over sparse indexes.</p>
      <pre><code class="language-javascript">db.restaurants.createIndex(
  { rating: 1 },
  { partialFilterExpression: { rating: { $gt: 4 } } }
)</code></pre>
      <p>This index only contains restaurants with a rating greater than 4. If an application only queries for highly-rated restaurants, this partial index is much smaller and faster to update than a full index.</p>
    `
  },
  {
    slug: "ttl-indexes",
    title: "29. TTL (Time-To-Live) Indexes",
    order: 29,
    content: `
      <h2>Time-To-Live (TTL) Indexes</h2>
      <p>TTL indexes are special single-field indexes that MongoDB uses to automatically remove documents from a collection after a certain amount of time or at a specific clock time. This is perfect for session data, event logs, or temporary notifications.</p>
      <h3>Creating a TTL Index</h3>
      <p>The indexed field must be a BSON date type.</p>
      <pre><code class="language-javascript">// Delete document 3600 seconds (1 hour) after the 'createdAt' time
db.sessions.createIndex(
  { "createdAt": 1 },
  { expireAfterSeconds: 3600 }
)</code></pre>
      <h3>Expiring at a Specific Time</h3>
      <p>Alternatively, you can set <code>expireAfterSeconds: 0</code> and set the indexed field to the exact Date when the document should expire.</p>
      <pre><code class="language-javascript">db.events.createIndex(
  { "expireAt": 1 },
  { expireAfterSeconds: 0 }
)

// Document insertion
db.events.insertOne({
  logEvent: 2,
  expireAt: new Date('July 22, 2024 14:00:00')
})</code></pre>
      <p>A background thread in MongoDB checks for expired documents every 60 seconds.</p>
    `
  },
  {
    slug: "aggregation-optimization",
    title: "30. Pipeline Optimization",
    order: 30,
    content: `
      <h2>Aggregation Pipeline Optimization</h2>
      <p>MongoDB automatically optimizes aggregation pipelines under the hood. However, understanding these optimizations helps you write better pipelines.</p>
      <h3>Sequence Optimization</h3>
      <p>MongoDB can reorder stages to improve performance. For example, if you have a <code>$project</code> followed by a <code>$match</code>, MongoDB will automatically move the <code>$match</code> before the <code>$project</code> to filter documents sooner and reduce the workload of the projection.</p>
      <h3>Index Usage in Aggregation</h3>
      <p>The <code>$match</code> and <code>$sort</code> stages can use indexes if they occur at the beginning of the pipeline. Once a stage modifies the document structure (like <code>$project</code>, <code>$unwind</code>, or <code>$group</code>), subsequent <code>$match</code> or <code>$sort</code> stages cannot use indexes.</p>
      <h3>Memory Constraints</h3>
      <p>Pipeline stages have a memory limit of 100 megabytes of RAM. If a stage exceeds this, it will return an error. To handle large datasets, you can use the <code>allowDiskUse</code> option to write temporary files to disk.</p>
      <pre><code class="language-javascript">db.orders.aggregate(
  [ /* heavy pipeline stages */ ],
  { allowDiskUse: true }
)</code></pre>
    `
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
