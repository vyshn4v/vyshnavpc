import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Seeding MongoDB.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) {
    return mongoose.models.Docs;
  }
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const mongoDoc = {
  technology: "mongodb",
  title: "MongoDB Deep Dive",
  description: "Advanced Schema Design, Aggregation Pipelines, Indexes, and ACID Transactions.",
  topics: [
    {
      slug: "data-modeling",
      title: "1. Advanced Data Modeling",
      order: 1,
      content: `
        <h2>Advanced Data Modeling</h2>
        <p>In SQL, data modeling is driven by the shape of the data itself (normalization). In MongoDB, data modeling is driven by the <strong>application's access patterns</strong>. Data that is read together should be stored together.</p>

        <h3>1. Embedded Data Models</h3>
        <p>Embedded models allow applications to store related pieces of information in the same database record. This drastically improves read performance.</p>
        <ul>
          <li>Use when you have "contains" relationships between entities (1-to-1).</li>
          <li>Use when you have 1-to-Few relationships where the child data is always viewed with the parent.</li>
        </ul>
        <pre><code class="language-javascript">
// The User Document EMBEDS their primary addresses
{
  "_id": "vyshnav",
  "name": "Vyshnav P C",
  "addresses": [
    { "street": "123 Tech Park", "city": "Bangalore" },
    { "street": "456 Beach Road", "city": "Goa" }
  ]
}
        </code></pre>

        <h3>2. Normalized (Referenced) Data Models</h3>
        <p>Use references when embedding would result in duplication of data but would not provide sufficient read performance advantages, or to represent complex many-to-many relationships.</p>
        <ul>
          <li>Use when embedding would cause the document to exceed the 16MB BSON size limit.</li>
          <li>Use for 1-to-Squillions relationships (e.g., an Event Logging system).</li>
        </ul>
        <pre><code class="language-javascript">
// Publisher Document
{ "_id": "oreilly", "name": "O'Reilly Media" }

// Book Document References the Publisher
{
  "_id": 123456789,
  "title": "MongoDB: The Definitive Guide",
  "publisher_id": "oreilly"
}
        </code></pre>

        <h3>3. The Subset Pattern</h3>
        <p>What if a product has thousands of reviews? You want fast reads for the first page of reviews, but you don't want a 16MB document.</p>
        <p><strong>Solution:</strong> Embed the 10 most recent reviews inside the Product document, and store the rest in a separate <code>Reviews</code> collection!</p>
      `
    },
    {
      slug: "aggregation-pipeline",
      title: "2. The Aggregation Pipeline",
      order: 2,
      content: `
        <h2>The Aggregation Pipeline</h2>
        <p>The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms the documents into aggregated results.</p>

        <h3>Core Stages</h3>
        <ul>
          <li><code>$match</code>: Filters the documents (always put this FIRST to reduce the pipeline size, and so it can use Indexes!).</li>
          <li><code>$group</code>: Groups input documents by the specified <code>_id</code> expression and applies accumulator expressions (e.g., <code>$sum</code>, <code>$avg</code>).</li>
          <li><code>$project</code>: Reshapes each document (adds, removes, or renames fields).</li>
          <li><code>$unwind</code>: Deconstructs an array field from the input documents to output a document for each element.</li>
          <li><code>$lookup</code>: Performs a left outer join to an unsharded collection in the same database.</li>
        </ul>

        <h3>Example: Advanced Analytics Query</h3>
        <p>Find the top 3 highest spending customers in California for the year 2023.</p>
        <pre><code class="language-javascript">
db.orders.aggregate([
  // 1. Filter: Only completed orders in 2023 in California
  { 
    $match: { 
      status: "completed", 
      state: "CA",
      date: { $gte: ISODate("2023-01-01"), $lt: ISODate("2024-01-01") } 
    } 
  },
  // 2. Group by the customer ID and calculate total spent
  { 
    $group: { 
      _id: "$customerId", 
      totalSpent: { $sum: "$orderTotal" },
      averageOrder: { $avg: "$orderTotal" },
      totalOrders: { $sum: 1 }
    } 
  },
  // 3. Join with the Users collection to get their name
  { 
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "customerInfo"
    } 
  },
  // 4. Flatten the joined array
  { $unwind: "$customerInfo" },
  // 5. Sort by highest spender
  { $sort: { totalSpent: -1 } },
  // 6. Limit to top 3
  { $limit: 3 },
  // 7. Reshape the final output
  { 
    $project: {
      _id: 0,
      name: "$customerInfo.name",
      totalSpent: 1,
      totalOrders: 1
    } 
  }
]);
        </code></pre>
      `
    },
    {
      slug: "indexing-strategies",
      title: "3. Indexing & The ESR Rule",
      order: 3,
      content: `
        <h2>Indexing Strategies & The ESR Rule</h2>
        <p>Indexes support the efficient execution of queries. Without indexes, MongoDB must perform a <em>collection scan</em>, i.e. scan every document in a collection.</p>

        <h3>The ESR Rule for Compound Indexes</h3>
        <p>When creating Compound Indexes (indexes on multiple fields), the order of the fields is CRITICAL. Follow the <strong>ESR Rule</strong>:</p>
        <ol>
          <li><strong>E - Equality:</strong> Fields on which exact matches are performed (e.g., <code>{ status: "active" }</code>). Place these FIRST.</li>
          <li><strong>S - Sort:</strong> Fields on which the results are sorted. Place these SECOND.</li>
          <li><strong>R - Range:</strong> Fields on which range filters are applied (e.g., <code>$gt</code>, <code>$lt</code>, regex). Place these LAST.</li>
        </ol>

        <h3>Example of ESR in Action</h3>
        <p>Given the query:</p>
        <pre><code class="language-javascript">
db.cars.find({ manufacturer: "Ford", year: { $gt: 2015 } }).sort({ price: 1 })
        </code></pre>
        <p>What index should we create?</p>
        <ul>
          <li><strong>Bad Index:</strong> <code>{ manufacturer: 1, year: 1, price: 1 }</code> (Sort is after Range, causing an in-memory sort).</li>
          <li><strong>Perfect Index:</strong> <code>{ manufacturer: 1, price: 1, year: 1 }</code> (Equality, then Sort, then Range).</li>
        </ul>

        <pre><code class="language-javascript">
// Create the index in MongoDB
db.cars.createIndex({ manufacturer: 1, price: 1, year: 1 });
        </code></pre>

        <h3>Using .explain()</h3>
        <p>To see if your query is actually using an index, append <code>.explain("executionStats")</code> to your query. Look for <code>IXSCAN</code> (Index Scan) instead of <code>COLLSCAN</code> (Collection Scan).</p>
      `
    },
    {
      slug: "acid-transactions",
      title: "4. ACID Transactions",
      order: 4,
      content: `
        <h2>ACID Transactions in MongoDB</h2>
        <p>MongoDB supports multi-document ACID transactions! This means you can update multiple documents across multiple collections, and if one update fails, the entire transaction rolls back.</p>

        <h3>When to use Transactions</h3>
        <p>Because MongoDB allows embedded documents, you shouldn't use transactions for things that can be modeled in a single document (since single document updates are always atomic). Use transactions when you strictly need to mutate data across multiple completely separate documents/collections (e.g., a Banking Transfer).</p>

        <h3>Mongoose Transaction Example</h3>
        <pre><code class="language-javascript">
const mongoose = require('mongoose');

async function transferFunds(fromAccountId, toAccountId, amount) {
  // 1. Start a session
  const session = await mongoose.startSession();
  
  // 2. Start the transaction
  session.startTransaction();
  
  try {
    const opts = { session };
    
    // Deduct from Sender
    const sender = await Account.findOneAndUpdate(
      { _id: fromAccountId, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      opts
    );
    
    if (!sender) {
      throw new Error("Insufficient funds or account not found.");
    }
    
    // Add to Receiver
    await Account.findOneAndUpdate(
      { _id: toAccountId },
      { $inc: { balance: amount } },
      opts
    );
    
    // 3. Commit the transaction
    await session.commitTransaction();
    console.log('Success! Funds transferred.');
    
  } catch (error) {
    // 4. If anything fails, ABORT the transaction!
    await session.abortTransaction();
    console.error('Transaction Aborted: ', error.message);
  } finally {
    // 5. End the session
    session.endSession();
  }
}
        </code></pre>
      `
    }
  ]
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate(
    { technology: mongoDoc.technology },
    mongoDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Comprehensive MongoDB docs seeded successfully!");
  process.exit(0);
};

run();
