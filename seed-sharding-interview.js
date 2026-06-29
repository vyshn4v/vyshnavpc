import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "src", ".env.local") });

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Sharding Injection");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) return mongoose.models.Docs;
  const DocsSchema = new mongoose.Schema({
    technology: String,
    title: String,
    description: String,
    topics: [{
      slug: String,
      title: String,
      order: Number,
      content: String,
      interviewQuestions: [{
        question: String,
        answer: String
      }],
      practicalTask: {
        scenario: String,
        task: String,
        solutionCode: String
      }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const shardingTopic = {
  slug: "sharding-masterclass",
  title: "41. The Sharding Masterclass (Interview Ready)",
  order: 41,
  content: `
    <h2>Horizontal Scaling via Sharding</h2>
    <p>Sharding is a method for distributing data across multiple machines. MongoDB uses sharding to support deployments with very large data sets and high throughput operations.</p>
    
    <h3>The Shard Key</h3>
    <p>To distribute the documents in a collection, MongoDB partitions the collection using the <strong>shard key</strong>. The shard key consists of an immutable field or multiple fields that exist in every document in the target collection.</p>

    <h3>1. Hashed Sharding</h3>
    <p>Hashed Sharding involves computing a hash of the shard key field's value. Each chunk is then assigned a range based on the hashed shard key values.</p>
    <ul>
      <li><strong>Pros:</strong> Extremely even data distribution. Ideal for monotonically increasing keys (like an ObjectId or timestamp) to prevent a single "hot shard" from taking all writes.</li>
      <li><strong>Cons:</strong> Terrible for range queries. If you query for users aged 20 to 30, the router must broadcast the query to ALL shards.</li>
    </ul>

    <h3>2. Ranged Sharding</h3>
    <p>Ranged sharding divides data into ranges based on the shard key values. Documents with shard key values close to one another are likely to co-reside on the same chunk.</p>
    <ul>
      <li><strong>Pros:</strong> Excellent for range queries. The router (mongos) knows exactly which shard holds the data and only routes the query there (Targeted Query).</li>
      <li><strong>Cons:</strong> If you use a monotonically increasing key (like \`createdAt\`), all new writes go to the exact same shard, defeating the purpose of write-scaling.</li>
    </ul>

    <h3>3. Zone-Based Sharding (Country-Wise Management)</h3>
    <p>In enterprise systems, you often have strict legal requirements like GDPR where European data MUST stay on servers located in Europe, and US data MUST stay in the US.</p>
    <p>Zone sharding allows you to associate specific shard key ranges with specific <strong>Zones</strong> (which are tied to specific physical Shards). For example, you can create an "EU" zone and a "US" zone.</p>
    <pre><code class="language-javascript">
// 1. Add Shards to Zones
sh.addShardToZone("shard0000", "US")
sh.addShardToZone("shard0001", "EU")

// 2. Define the Zone Ranges using the Shard Key
// Assuming the shard key is { country: 1, userid: 1 }
sh.updateZoneKeyRange(
  "ecommerce.users",
  { country: "US", userid: MinKey },
  { country: "US", userid: MaxKey },
  "US"
)

sh.updateZoneKeyRange(
  "ecommerce.users",
  { country: "EU", userid: MinKey },
  { country: "EU", userid: MaxKey },
  "EU"
)
    </code></pre>
  `,
  interviewQuestions: [
    {
      question: "What is a 'Hot Shard' and how do you prevent it?",
      answer: "A Hot Shard occurs when all incoming write operations are directed to a single shard, completely bottlenecking the cluster. This usually happens when you use Ranged Sharding with a monotonically increasing shard key (like an ObjectId or timestamp). You prevent it by either using Hashed Sharding to randomly distribute the writes, or by choosing a shard key with high cardinality and low frequency (e.g., a compound key like `{ customerId: 1, timestamp: 1 }`)."
    },
    {
      question: "Explain the difference between a Targeted Query and a Scatter-Gather (Broadcast) Query.",
      answer: "A Targeted Query occurs when the `mongos` router can determine exactly which shard(s) contain the requested data by looking at the query predicate and comparing it to the shard key ranges. A Scatter-Gather query occurs when the query does NOT include the shard key. The `mongos` router is forced to broadcast the query to ALL shards, wait for their responses, and merge them before returning to the client. Scatter-Gather queries severely degrade performance at scale."
    },
    {
      question: "How would you design a database architecture to comply with GDPR data residency laws where EU user data must never leave EU data centers?",
      answer: "I would use MongoDB Zone-based Sharding. First, I would deploy a shard in an EU AWS region, and another in a US region. I would tag the EU shard with an 'EU' zone. Then, I would shard the users collection using a compound key like `{ country: 1, _id: 1 }`. Finally, I would use `sh.updateZoneKeyRange()` to define that any document where the country is an EU country is strictly pinned to the 'EU' zone."
    }
  ],
  practicalTask: {
    scenario: "You are the Lead Database Engineer at a global SaaS company. Your MongoDB cluster is crashing during peak hours because you recently sharded the `orders` collection using the `_id` field (which is a standard monotonically increasing ObjectId).",
    task: "Write the MongoDB shell commands required to re-shard the collection using a Hashed Shard key to evenly distribute the write load.",
    solutionCode: `
// 1. You cannot simply "change" a shard key in older MongoDB versions, but assuming MongoDB 5.0+, you can use the reshardCollection command.
// 2. First, create a hashed index on the field you want to use. Let's say we use a combination of tenantId and orderId to ensure good distribution but keep tenant data close.

db.orders.createIndex({ "tenantId": 1, "orderId": "hashed" });

// 3. Run the reshardCollection command
db.adminCommand({
  reshardCollection: "saas_db.orders",
  key: { tenantId: 1, orderId: "hashed" }
});

// The cluster will now automatically begin migrating chunks in the background without downtime!
    `
  }
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  
  // Push the massive interview topic to MongoDB
  await Docs.findOneAndUpdate(
    { technology: "mongodb" },
    { $push: { topics: shardingTopic } }
  );
  
  console.log("✅ Interview-Ready Sharding Masterclass Injected!");
  process.exit(0);
};

run();
