import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "mongodb-mongoose",
    title: "26. Connecting to MongoDB (Mongoose)",
    order: 26,
    content: "<h2>NoSQL in Express</h2><p>Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.</p>",
    interviewQuestions: [
      { question: "What is Mongoose?", answer: "Mongoose is an ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a straight-forward, schema-based solution to model your application data." },
      { question: "How do you connect to MongoDB using Mongoose?", answer: "By using `mongoose.connect(uri)`, which returns a promise." }
    ],
    practicalTask: {
      scenario: "Connect an Express app to MongoDB.",
      task: "Write the code to connect to a local MongoDB instance using Mongoose.",
      solutionCode: "const mongoose = require('mongoose');\nmongoose.connect('mongodb://localhost/myapp')\n  .then(() => console.log('Connected to DB'))\n  .catch(err => console.error(err));"
    }
  },
  {
    slug: "postgresql-sequelize",
    title: "27. Connecting to PostgreSQL (Sequelize/Prisma)",
    order: 27,
    content: "<h2>SQL in Express</h2><p>Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. Prisma is a modern, type-safe ORM alternative.</p>",
    interviewQuestions: [
      { question: "What is the difference between an ODM and an ORM?", answer: "An ODM (Object Document Mapper) like Mongoose is for NoSQL document databases. An ORM (Object Relational Mapper) like Sequelize is for SQL relational databases." },
      { question: "Why use Prisma over Sequelize?", answer: "Prisma offers better type safety, auto-generated queries based on the schema, and an intuitive developer experience." }
    ],
    practicalTask: {
      scenario: "Initialize a Sequelize instance.",
      task: "Create a Sequelize instance connecting to Postgres.",
      solutionCode: "const { Sequelize } = require('sequelize');\nconst sequelize = new Sequelize('postgres://user:pass@localhost:5432/dbname');\nsequelize.authenticate().then(() => console.log('Connected'));"
    }
  },
  {
    slug: "session-management",
    title: "28. Session Management",
    order: 28,
    content: "<h2>Stateful Apps</h2><p>`express-session` is used to store session data on the server side, with a session ID stored in a cookie on the client side.</p>",
    interviewQuestions: [
      { question: "How do sessions work in Express?", answer: "The server creates a session object and assigns it a unique ID. This ID is sent to the client via a cookie. On subsequent requests, the client sends the cookie back, and the server retrieves the session data using the ID." },
      { question: "Where should session data be stored in production?", answer: "In a dedicated session store like Redis or a database. The default MemoryStore is not suitable for production." }
    ],
    practicalTask: {
      scenario: "Track page views per user.",
      task: "Use express-session to track views.",
      solutionCode: "const session = require('express-session');\napp.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true }));\napp.get('/', (req, res) => {\n  req.session.views = (req.session.views || 0) + 1;\n  res.send(`Views: ${req.session.views}`);\n});"
    }
  },
  {
    slug: "caching-redis",
    title: "29. Caching with Redis",
    order: 29,
    content: "<h2>Performance Boost</h2><p>Redis is an in-memory data structure store, used as a database, cache, and message broker. It drastically improves Express API response times for read-heavy operations.</p>",
    interviewQuestions: [
      { question: "Why use Redis in an Express app?", answer: "To cache frequent database queries or heavy computations, reducing latency and database load." },
      { question: "How does caching work?", answer: "Before querying the database, the app checks if the data exists in Redis. If it does (cache hit), it returns it immediately. If not (cache miss), it queries the database, saves the result to Redis, and returns it." }
    ],
    practicalTask: {
      scenario: "Implement simple caching logic.",
      task: "Write a middleware that checks Redis for cached data before proceeding to the route handler.",
      solutionCode: "const checkCache = async (req, res, next) => {\n  const data = await redisClient.get(req.params.id);\n  if (data) return res.json(JSON.parse(data));\n  next();\n};\napp.get('/data/:id', checkCache, getDataFromDB);"
    }
  },
  {
    slug: "transactions",
    title: "30. Transactions and Data Integrity",
    order: 30,
    content: "<h2>ACID Properties</h2><p>Transactions ensure that a series of database operations either all succeed or all fail, maintaining data integrity.</p>",
    interviewQuestions: [
      { question: "What is a database transaction?", answer: "A sequence of operations performed as a single logical unit of work. If any operation fails, the entire transaction is rolled back." },
      { question: "How do you handle transactions in Mongoose?", answer: "By using MongoDB's session feature: `const session = await mongoose.startSession(); session.startTransaction();`" }
    ],
    practicalTask: {
      scenario: "Transfer funds securely.",
      task: "Write a Mongoose transaction skeleton.",
      solutionCode: "const session = await mongoose.startSession();\nsession.startTransaction();\ntry {\n  // perform ops with { session }\n  await session.commitTransaction();\n} catch (e) {\n  await session.abortTransaction();\n} finally {\n  session.endSession();\n}"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 6 seeded!'));
