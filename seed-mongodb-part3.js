import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "mongodb-indexes-single-compound",
    title: "11. MongoDB Indexes: Single Field & Compound",
    order: 11,
    content: `
      <h2>MongoDB Indexes: Single Field & Compound</h2>
      <p>Indexes support the efficient resolution of queries. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement.</p>
      <h3>Single Field Indexes</h3>
      <p>A single field index includes data from only one field of the documents in a collection.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "field": 1 })</code></pre>
      <p>1 specifies ascending order, while -1 specifies descending order. For single-field indexes, the sort order of keys doesn't matter because MongoDB can traverse the index in either direction.</p>
      <h3>Compound Indexes</h3>
      <p>MongoDB supports compound indexes, where a single index structure holds references to multiple fields.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "field1": 1, "field2": -1 })</code></pre>
      <p>The order of fields listed in a compound index is important. The index will contain references to documents sorted first by the values of the first field, and then, within each value of the first field, sorted by values of the second field.</p>
    `,
    interviewQuestions: [
      {
        question: "What is a collection scan and how do indexes prevent it?",
        answer: "A collection scan occurs when MongoDB has to read every document in a collection to satisfy a query. Indexes prevent this by providing an ordered data structure (B-tree) containing references to documents, allowing MongoDB to efficiently find matching documents without scanning the whole collection."
      },
      {
        question: "Does the sort order matter for a single-field index?",
        answer: "No, the sort order (ascending 1 or descending -1) does not matter for single-field indexes because MongoDB can traverse the index in either direction."
      },
      {
        question: "Why does the order of fields matter in a compound index?",
        answer: "The order matters because the index is sorted primarily by the first field, and then by subsequent fields. A query must include the first field(s) of the compound index to effectively use it (this is known as the index prefix)."
      }
    ],
    practicalTask: "Create a single field index on the 'username' field and a compound index on the 'age' (ascending) and 'createdAt' (descending) fields of a 'users' collection."
  },
  {
    slug: "mongodb-indexes-multikey-text-geospatial",
    title: "12. MongoDB Indexes: Multikey, Text, and Geospatial",
    order: 12,
    content: `
      <h2>Multikey, Text, and Geospatial Indexes</h2>
      <h3>Multikey Indexes</h3>
      <p>To index a field that holds an array value, MongoDB creates an index key for each element in the array. These multikey indexes support efficient queries against array fields.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "tags": 1 })</code></pre>
      <h3>Text Indexes</h3>
      <p>Text indexes support text search queries on string content. A collection can have at most one text index.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "description": "text", "comments": "text" })</code></pre>
      <h3>Geospatial Indexes</h3>
      <p>MongoDB supports queries of geospatial data using 2dsphere indexes (for data that calculates geometries on an earth-like sphere) and 2d indexes (for data stored as points on a two-dimensional plane).</p>
      <pre><code class="language-javascript">db.places.createIndex({ "location": "2dsphere" })</code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is a multikey index in MongoDB?",
        answer: "A multikey index is an index created on an array field. MongoDB creates an index key for every element in the array, allowing efficient queries against array elements."
      },
      {
        question: "Can you create multiple text indexes on a single collection?",
        answer: "No, a collection can have at most one text index. However, that single text index can cover multiple string fields."
      },
      {
        question: "What is the difference between a 2d and a 2dsphere index?",
        answer: "A 2d index is used for data stored as points on a flat, two-dimensional plane. A 2dsphere index is used for data that calculates geometries on an earth-like sphere, supporting GeoJSON objects."
      }
    ],
    practicalTask: "Create a multikey index on an array field 'categories', a text index on 'title' and 'body' fields, and a 2dsphere index on a 'coordinates' field."
  },
  {
    slug: "index-properties",
    title: "13. Index Properties (Unique, Sparse, TTL)",
    order: 13,
    content: `
      <h2>Index Properties</h2>
      <p>MongoDB provides several index properties to customize the behavior of indexes.</p>
      <h3>Unique Indexes</h3>
      <p>A unique index ensures that the indexed fields do not store duplicate values. By default, MongoDB does not restrict duplicate values.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "email": 1 }, { unique: true })</code></pre>
      <h3>Sparse Indexes</h3>
      <p>Sparse indexes only contain entries for documents that have the indexed field, even if the index field contains a null value. This reduces the size of the index.</p>
      <pre><code class="language-javascript">db.collection.createIndex({ "optionalField": 1 }, { sparse: true })</code></pre>
      <h3>TTL (Time-To-Live) Indexes</h3>
      <p>TTL indexes are special single-field indexes that MongoDB can use to automatically remove documents from a collection after a certain amount of time or at a specific clock time. Ideal for sessions or logs.</p>
      <pre><code class="language-javascript">db.sessions.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 3600 })</code></pre>
    `,
    interviewQuestions: [
      {
        question: "How does a unique index behave if a document is inserted without the indexed field?",
        answer: "If the field is missing, MongoDB treats it as having a null value. A unique index will allow one document without the field, but subsequent documents without the field will cause a duplicate key error."
      },
      {
        question: "What is the primary benefit of a sparse index?",
        answer: "A sparse index reduces the size of the index by excluding documents that do not contain the indexed field, which saves space and reduces the overhead of updating the index."
      },
      {
        question: "What is a TTL index and what is a common use case?",
        answer: "A TTL (Time-To-Live) index automatically deletes documents after a specified time period. Common use cases include expiring user sessions, clearing old logs, or temporary data caching."
      }
    ],
    practicalTask: "Create a unique index on 'username', a sparse index on 'phoneNumber', and a TTL index on 'createdAt' to expire documents after 24 hours (86400 seconds)."
  },
  {
    slug: "query-optimization-explain-plans",
    title: "14. Query Optimization & Explain Plans",
    order: 14,
    content: `
      <h2>Query Optimization & Explain Plans</h2>
      <p>MongoDB provides the <code>explain()</code> method to analyze the execution of a query and understand how indexes are utilized.</p>
      <h3>Using Explain</h3>
      <p>You can append <code>.explain("executionStats")</code> to a query to see detailed statistics.</p>
      <pre><code class="language-javascript">db.collection.find({ age: { $gt: 25 } }).explain("executionStats")</code></pre>
      <h3>Key Metrics</h3>
      <ul>
        <li><strong>winningPlan.stage:</strong> <code>IXSCAN</code> indicates an index scan, while <code>COLLSCAN</code> indicates a full collection scan.</li>
        <li><strong>totalKeysExamined:</strong> The number of index entries scanned.</li>
        <li><strong>totalDocsExamined:</strong> The number of documents retrieved from disk.</li>
        <li><strong>nReturned:</strong> The actual number of documents returned.</li>
      </ul>
      <p>A highly optimized query will have <code>totalKeysExamined</code> and <code>totalDocsExamined</code> very close to <code>nReturned</code>.</p>
      <h3>Covered Queries</h3>
      <p>A covered query is one where all the fields in the query are part of an index, and all the fields returned in the results are in the same index. This means MongoDB does not need to fetch the document from disk (totalDocsExamined = 0).</p>
    `,
    interviewQuestions: [
      {
        question: "What does the 'executionStats' mode of the explain() method provide?",
        answer: "It provides detailed statistics about the query execution, including whether an index was used (IXSCAN vs COLLSCAN), how many index keys were examined, how many documents were fetched, and execution time."
      },
      {
        question: "What is the difference between IXSCAN and COLLSCAN?",
        answer: "IXSCAN means MongoDB used an index to satisfy the query, which is efficient. COLLSCAN means MongoDB had to scan every document in the collection, which is slow and resource-intensive."
      },
      {
        question: "What is a covered query?",
        answer: "A covered query is a query where all queried fields and returned fields are present in the index. MongoDB can satisfy the query entirely from the index without reading the actual documents from disk."
      }
    ],
    practicalTask: "Run a query with .explain('executionStats') on a collection and identify the 'winningPlan.stage' and 'totalDocsExamined' metrics from the output."
  },
  {
    slug: "aggregation-framework-introduction",
    title: "15. The Aggregation Framework: Introduction",
    order: 15,
    content: `
      <h2>The Aggregation Framework: Introduction</h2>
      <p>The MongoDB Aggregation Framework is a powerful tool for analyzing, grouping, and transforming data in complex ways. It processes data records and returns computed results.</p>
      <h3>The Pipeline Concept</h3>
      <p>Operations are structured as a pipeline, where documents pass through a series of stages. Each stage transforms the documents as they pass through.</p>
      <pre><code class="language-javascript">db.orders.aggregate([
  { $match: { status: "A" } },
  { $group: { _id: "$cust_id", totalAmount: { $sum: "$amount" } } },
  { $sort: { totalAmount: -1 } }
])</code></pre>
      <h3>Common Stages</h3>
      <ul>
        <li><strong>$match:</strong> Filters documents (similar to <code>find()</code>).</li>
        <li><strong>$group:</strong> Groups documents by a specified key and allows the use of accumulator expressions (like <code>$sum</code>, <code>$avg</code>).</li>
        <li><strong>$project:</strong> Reshapes documents by adding, removing, or renaming fields.</li>
        <li><strong>$sort:</strong> Sorts the documents.</li>
      </ul>
      <p>Using <code>$match</code> early in the pipeline is critical for performance as it reduces the number of documents that subsequent stages need to process and can leverage indexes.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the aggregation pipeline in MongoDB?",
        answer: "The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results."
      },
      {
        question: "Why is it recommended to use the $match stage early in an aggregation pipeline?",
        answer: "Using $match early reduces the number of documents passed to subsequent stages, improving performance. Additionally, if $match is placed at the beginning of the pipeline, it can utilize indexes."
      },
      {
        question: "What is the purpose of the $group stage?",
        answer: "The $group stage separates documents into groups according to a specified group key and allows the calculation of aggregate values (like sums, averages, or counts) for each group using accumulator operators."
      }
    ],
    practicalTask: "Write an aggregation pipeline that filters documents where 'status' is 'active', groups them by 'category', calculates the total count per category, and sorts the result by the count in descending order."
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
