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
  description: "Advanced Schema Design, Aggregation Pipelines, and Performance Indexing.",
  topics: [
    {
      slug: "schema-design",
      title: "1. Schema Design Principles",
      order: 1,
      content: `
        <h2>Schema Design Principles</h2>
        <p>Unlike relational databases, MongoDB schema design is dictated by data access patterns. Data that is accessed together should be stored together.</p>
        <h3>Embedding vs. Referencing</h3>
        <ul>
          <li><strong>Embedding:</strong> Ideal for 1-to-Few relationships or data that is always retrieved together (e.g., an order and its line items).</li>
          <li><strong>Referencing:</strong> Ideal for 1-to-Many or Many-to-Many relationships, or when embedded arrays would grow infinitely (e.g., a user and their millions of log entries).</li>
        </ul>
        <pre><code class="language-javascript">
// Embedded Schema (Good for bounded data)
const orderSchema = new Schema({
  orderTotal: Number,
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number
  }]
});

// Referenced Schema (Good for unbounded data)
const publisherSchema = new Schema({
  name: String,
  founded: Date
});

const bookSchema = new Schema({
  title: String,
  publisherId: { type: Schema.Types.ObjectId, ref: 'Publisher' }
});
        </code></pre>
      `
    },
    {
      slug: "aggregation-pipeline",
      title: "2. The Aggregation Pipeline",
      order: 2,
      content: `
        <h2>The Aggregation Pipeline</h2>
        <p>The aggregation framework is a powerful tool for data analysis. Documents enter a multi-stage pipeline that transforms them into aggregated results.</p>
        <pre><code class="language-javascript">
// Example: Find total sales per category for completed orders
db.orders.aggregate([
  { 
    $match: { status: 'completed' } 
  },
  { 
    $unwind: '$items' // Deconstructs the items array
  },
  { 
    $group: {
      _id: '$items.category',
      totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
      averageOrderValue: { $avg: '$orderTotal' }
    }
  },
  { 
    $sort: { totalRevenue: -1 } 
  }
]);
        </code></pre>
      `
    },
    {
      slug: "indexing-strategies",
      title: "3. Indexing Strategies",
      order: 3,
      content: `
        <h2>Indexing Strategies</h2>
        <p>Indexes support the efficient execution of queries. Without indexes, MongoDB must perform a collection scan (read every document).</p>
        <h3>Compound Indexes</h3>
        <p>Order matters! Follow the ESR (Equality, Sort, Range) rule.</p>
        <pre><code class="language-javascript">
// Query: find({ status: "active", age: { $gt: 20 } }).sort({ createdAt: -1 })

// ESR Rule Indexing
db.users.createIndex({ 
  status: 1,       // [E]quality matches first
  createdAt: -1,   // [S]ort operations next
  age: 1           // [R]ange queries last
});
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
  console.log("✅ MongoDB docs seeded successfully!");
  process.exit(0);
};

run();
