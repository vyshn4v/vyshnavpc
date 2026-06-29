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
    console.log("Connected to MongoDB for Seeding Express.js.");
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

const expressDoc = {
  technology: "express",
  title: "Express.js APIs",
  description: "Enterprise routing, Middleware architectures, and secure API development.",
  topics: [
    {
      slug: "routing-architecture",
      title: "1. Routing Architecture",
      order: 1,
      content: `
        <h2>Routing Architecture</h2>
        <p>A scalable Express.js application should decouple routing from business logic. The controller pattern ensures routes are clean and manageable.</p>
        <pre><code class="language-javascript">
// routes/users.js
import express from 'express';
import { getUser, createUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', authenticate, getUser);
router.post('/', createUser);

export default router;

// app.js
import express from 'express';
import userRoutes from './routes/users.js';

const app = express();
app.use('/api/users', userRoutes);
        </code></pre>
      `
    },
    {
      slug: "middleware-patterns",
      title: "2. Middleware Patterns",
      order: 2,
      content: `
        <h2>Middleware Patterns</h2>
        <p>Middleware functions have access to the request object, response object, and the next middleware function. They are crucial for logging, authentication, and parsing.</p>
        <pre><code class="language-javascript">
// Custom Request Logging Middleware
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Triggered when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(\`[\${req.method}] \${req.originalUrl} - \${res.statusCode} [\${duration}ms]\`);
  });
  
  next();
};

app.use(logger); // Apply globally
        </code></pre>
      `
    },
    {
      slug: "error-handling",
      title: "3. Global Error Handling",
      order: 3,
      content: `
        <h2>Global Error Handling</h2>
        <p>Express catches synchronous errors automatically, but asynchronous errors must be passed to <code>next()</code>. A global error handling middleware standardizes API responses.</p>
        <pre><code class="language-javascript">
// Async Error Wrapper
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route using the wrapper
router.get('/data', catchAsync(async (req, res) => {
  const data = await fetchDatabase(); // If this throws, next() is called automatically
  res.json(data);
}));

// Global Error Handler (must have 4 arguments)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
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
    { technology: expressDoc.technology },
    expressDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Express docs seeded successfully!");
  process.exit(0);
};

run();
