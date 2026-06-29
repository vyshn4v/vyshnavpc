import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'express-database-integration',
    title: 'Database Integration (SQL & NoSQL)',
    order: 11,
    content: `
## Database Integration (SQL & NoSQL)

Express is unopinionated about databases. It does not come with an ORM (Object-Relational Mapper) or ODM (Object-Document Mapper). You simply install the Node.js driver or ORM for your preferred database and connect it.

### Connecting to MongoDB (NoSQL) via Mongoose
Mongoose is the most popular ODM for MongoDB and Express. It provides a straight-forward, schema-based solution to model your application data.

\`\`\`javascript
const mongoose = require('mongoose');

// 1. Connect to Database
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB Connected!'));

// 2. Define a Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// 3. Create a Model
const User = mongoose.model('User', userSchema);

// 4. Use in Express Route
app.post('/users', async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});
\`\`\`

### Connecting to PostgreSQL (SQL) via Sequelize or Prisma
For relational databases like PostgreSQL or MySQL, developers typically use an ORM like Sequelize, TypeORM, or more recently, Prisma.

**Example with Prisma:**
Prisma is a next-generation Node.js and TypeScript ORM.

\`\`\`javascript
// Schema defined in schema.prisma file...
// Using the generated Prisma Client in Express:

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

app.get('/users', async (req, res, next) => {
  try {
    // Queries the PostgreSQL database
    const users = await prisma.user.findMany({
      include: { posts: true } // Joins the posts table
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});
\`\`\`

### Connection Pooling
When integrating databases, never open a new connection for every single HTTP request. Node.js drivers handle **Connection Pooling** automatically. You open the connection once when the server starts, and the driver manages a pool of underlying TCP connections to reuse for incoming queries.

### Transactions
If you are performing multiple database operations that must succeed or fail as a unit (e.g., deducting money from User A and adding to User B), you must use Database Transactions.

\`\`\`javascript
// Mongoose Transaction Example
app.post('/transfer', async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await User.updateOne({ _id: fromId }, { $inc: { balance: -amount } }, { session });
    await User.updateOne({ _id: toId }, { $inc: { balance: amount } }, { session });
    
    await session.commitTransaction();
    session.endSession();
    res.send('Transfer successful');
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
});
\`\`\`
`,
    interviewQuestions: [
      { question: "Does Express come with built-in database support?", answer: "No, Express is completely unopinionated regarding databases. You must use a third-party Node.js driver (like the 'pg' module) or an ORM/ODM (like Sequelize or Mongoose) to interact with a database." },
      { question: "What is connection pooling and why is it important in Express?", answer: "Connection pooling is maintaining a pool of open database connections that can be reused for future requests. It is critical because opening a new database connection for every HTTP request is incredibly slow and will crash the database under load." },
      { question: "What is the difference between an ORM and an ODM?", answer: "An ORM (Object-Relational Mapper), like Sequelize, maps JavaScript objects to tables in a Relational SQL database. An ODM (Object-Document Mapper), like Mongoose, maps JavaScript objects to documents in a NoSQL database like MongoDB." },
      { question: "Why would you use a database transaction in an Express route?", answer: "A transaction ensures ACID properties for a group of operations. If your route performs multiple related writes (e.g., transferring funds), a transaction ensures that if one write fails, the others are rolled back, preventing data inconsistency." },
      { question: "Where in an Express application lifecycle should the database connection be established?", answer: "The database connection should be established once, typically at the startup of the application (e.g., before or right after app.listen()), not inside individual route handlers." }
    ],
    practicalTask: {
      scenario: "You need to query a MongoDB database using Mongoose in an Express route.",
      task: "Assume Mongoose is connected and a 'Product' model exists. Write an async GET route at '/products' that fetches all products where 'inStock' is true, and sorts them by 'price' descending.",
      solutionCode: `
app.get('/products', async (req, res, next) => {
  try {
    const products = await Product.find({ inStock: true }).sort({ price: -1 });
    res.json({ count: products.length, data: products });
  } catch (err) {
    next(err);
  }
});
      `
    }
  },
  {
    slug: 'express-restful-apis',
    title: 'Building RESTful APIs with Express',
    order: 12,
    content: `
## Building RESTful APIs with Express

REST (Representational State Transfer) is an architectural style for designing networked applications. Express is ideally suited for building RESTful APIs.

### REST Architectural Constraints
1. **Client-Server Architecture:** Separation of concerns.
2. **Statelessness:** No client context is stored on the server between requests. Every request must contain all information necessary to understand it.
3. **Cacheability:** Responses must explicitly define themselves as cacheable or not.
4. **Uniform Interface:** Consistent resource identification through URIs and use of standard HTTP methods.

### Resource Naming (URIs)
Resources should be nouns, pluralized, and hierarchical.
- **Good:** \`GET /api/users/123/orders\`
- **Bad:** \`GET /api/getUserOrders?id=123\`

### HTTP Methods and CRUD
REST maps CRUD (Create, Read, Update, Delete) operations to HTTP methods:
- **POST** -> Create (\`/users\`)
- **GET** -> Read (\`/users\` or \`/users/123\`)
- **PUT** -> Update/Replace entire resource (\`/users/123\`)
- **PATCH** -> Partial Update (\`/users/123\`)
- **DELETE** -> Delete (\`/users/123\`)

### Standard Response Structure (JSend format)
Returning consistent JSON structures makes life easier for frontend developers. A common pattern is the JSend specification.

\`\`\`javascript
// Success
res.status(200).json({
  status: 'success',
  data: {
    user: { id: 1, name: 'Alice' }
  }
});

// Fail (Client error, e.g., validation failed)
res.status(400).json({
  status: 'fail',
  data: {
    email: 'A valid email is required'
  }
});

// Error (Server error)
res.status(500).json({
  status: 'error',
  message: 'Unable to connect to database'
});
\`\`\`

### Pagination, Sorting, and Filtering
A robust REST API must handle querying efficiently via the query string.

\`\`\`javascript
// Example URI: GET /api/tours?price[lte]=500&sort=-price&page=2&limit=10

app.get('/api/tours', async (req, res) => {
  // 1. Filtering
  let queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(el => delete queryObj[el]);

  // Convert operators (gte, lte) to MongoDB syntax ($gte, $lte)
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => \`$\${match}\`);
  
  let query = Tour.find(JSON.parse(queryStr));

  // 2. Sorting
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  }

  // 3. Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  // Execute query
  const tours = await query;
  res.json({ status: 'success', results: tours.length, data: tours });
});
\`\`\`
`,
    interviewQuestions: [
      { question: "What does it mean for a REST API to be 'Stateless'?", answer: "Statelessness means the server does not store any session state about the client. Every request from the client must contain all the necessary information (like authentication tokens) for the server to understand and process it." },
      { question: "What is the difference between PUT and PATCH HTTP methods?", answer: "PUT is used to replace an entire resource. If a field is omitted in a PUT request, it should be set to null/empty. PATCH is used for partial updates, modifying only the specific fields provided in the payload while leaving the rest intact." },
      { question: "Give an example of a properly formatted RESTful URI for fetching a specific comment on a specific post.", answer: "GET /api/posts/{postId}/comments/{commentId}" },
      { question: "How should you handle pagination in a REST API?", answer: "Pagination is typically handled using query string parameters, usually 'page' and 'limit' (e.g., ?page=2&limit=20). The backend uses these to calculate an offset (skip) and restricts the number of returned records." },
      { question: "Why is it bad practice to use verbs in REST URIs (e.g., /api/getUsers)?", answer: "REST principles dictate that URIs should identify Resources (nouns), while the action performed on the resource is defined by the HTTP verb (GET, POST, DELETE). Thus, GET /api/users is the correct approach." }
    ],
    practicalTask: {
      scenario: "Design a standardized REST response.",
      task: "Create a utility function 'sendResponse(res, statusCode, status, dataOrMessage)' that formats responses consistently. Use it in a basic GET route.",
      solutionCode: `
const sendResponse = (res, statusCode, status, payload) => {
  const response = { status };
  if (status === 'success' || status === 'fail') response.data = payload;
  if (status === 'error') response.message = payload;
  return res.status(statusCode).json(response);
};

app.get('/api/users/1', (req, res) => {
  sendResponse(res, 200, 'success', { user: { id: 1, name: 'Alice' } });
});
      `
    }
  },
  {
    slug: 'express-file-uploads',
    title: 'File Uploads and Streaming',
    order: 13,
    content: `
## File Uploads and Streaming

Handling multipart/form-data (required for file uploads) and streaming large amounts of data requires specific middleware and techniques in Express.

### Handling File Uploads with Multer
Express's built-in \`express.json()\` and \`express.urlencoded()\` middleware cannot parse multipart/form-data. **Multer** is the standard middleware for this.

\`\`\`bash
npm install multer
\`\`\`

**Basic Setup (Saving to Disk):**
\`\`\`javascript
const multer = require('multer');

// Configure storage destination and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory must exist
  },
  filename: (req, file, cb) => {
    // Prevent filename collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route handling a single file upload named 'avatar'
app.post('/profile', upload.single('avatar'), (req, res) => {
  // req.file contains information about the uploaded file
  // req.body contains the text fields
  res.json({ message: 'File uploaded', file: req.file });
});
\`\`\`

### File Validation (Filtering)
You should never allow arbitrary file uploads without checking the mime type.

\`\`\`javascript
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Not an image! Please upload only images.'), false); // Reject
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});
\`\`\`

### Streaming Data in Express
When sending large files (like a video or a massive CSV file), you should not read the entire file into memory using \`fs.readFile()\`. Instead, you should pipe a ReadStream directly to the \`res\` object. \`res\` is a Writable Stream.

\`\`\`javascript
const fs = require('fs');

app.get('/download-video', (req, res) => {
  const filePath = './assets/big-video.mp4';
  
  // Set headers
  res.writeHead(200, {
    'Content-Type': 'video/mp4'
  });

  // Create stream and pipe to response
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  readStream.on('error', (err) => {
    res.status(500).send('Error streaming file');
  });
});
\`\`\`
Express also provides \`res.sendFile(filePath)\` and \`res.download(filePath)\` which handle streaming, MIME type setting, and headers under the hood automatically.
`,
    interviewQuestions: [
      { question: "Why can't express.json() handle file uploads?", answer: "express.json() only parses 'application/json' payloads. File uploads use 'multipart/form-data', which requires a specific parser like Multer to extract binary file streams and separate them from text fields." },
      { question: "What is Multer and how does it integrate with Express?", answer: "Multer is a middleware for handling multipart/form-data. It integrates with Express by being injected into specific routes (e.g., upload.single('file')), attaching a req.file object for files and parsing text fields into req.body." },
      { question: "How do you restrict file uploads to only accept images under 2MB?", answer: "In Multer configuration, provide a 'limits' object with { fileSize: 2 * 1024 * 1024 } and a 'fileFilter' function that checks if file.mimetype starts with 'image/'. If not, pass an error to the callback." },
      { question: "Why is it dangerous to read a large video file into memory using fs.readFile before sending it via Express?", answer: "Reading a massive file entirely into memory will exhaust the Node.js V8 heap memory limits and crash the server, especially if multiple users request the file simultaneously." },
      { question: "What is the most efficient way to serve a large file to a client in Node/Express?", answer: "Using Node.js Streams. You create a readable stream using fs.createReadStream() and pipe it directly to the Express response object (which is a writable stream), or simply use Express's built-in res.sendFile() which handles streaming automatically." }
    ],
    practicalTask: {
      scenario: "Create a simple file download endpoint.",
      task: "Write an Express GET route at '/download' that uses res.download() to send a file located at '__dirname + /report.pdf'.",
      solutionCode: `
const path = require('path');

app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'report.pdf');
  res.download(file, 'monthly_report.pdf', (err) => {
    if (err) console.error('Download error:', err);
  });
});
      `
    }
  },
  {
    slug: 'express-testing',
    title: 'Testing Express Applications',
    order: 14,
    content: `
## Testing Express Applications

Testing is crucial for enterprise applications. Express apps are usually tested at two levels: Unit Testing (testing individual functions/controllers) and Integration Testing (testing the HTTP endpoints).

### Testing Stack
The most common stack for testing Express applications is:
- **Jest** or **Mocha**: The test runner and assertion library.
- **Supertest**: A library specifically designed for testing Node.js HTTP servers without actually binding them to a port.

### Setting Up the App for Testing
To test an Express app with Supertest, you must export the \`app\` instance **without** calling \`app.listen()\`. If you call \`listen\`, the port will remain open and tests will hang.

\`\`\`javascript
// app.js
const express = require('express');
const app = express();
app.get('/api/status', (req, res) => res.status(200).json({ ok: true }));

module.exports = app; // Export app!

// server.js (entry point for production)
const app = require('./app');
app.listen(3000, () => console.log('Running...'));
\`\`\`

### Writing Integration Tests with Supertest
Supertest allows you to simulate HTTP requests against your Express app object.

\`\`\`javascript
// app.test.js
const request = require('supertest');
const app = require('./app');

describe('GET /api/status', () => {
  it('should return 200 OK and a JSON object', async () => {
    const response = await request(app)
      .get('/api/status')
      .expect('Content-Type', /json/)
      .expect(200);
      
    expect(response.body).toEqual({ ok: true });
  });
});
\`\`\`

### Testing Routes with Database Connections
Integration tests often require a database. Best practices include:
1. **Use a separate test database:** Never run tests against production or development databases. Use environment variables (e.g., \`NODE_ENV=test\`) to connect to a \`myapp_test\` DB.
2. **Setup and Teardown:** Use Jest hooks (\`beforeAll\`, \`afterAll\`, \`beforeEach\`) to connect to the database, clear collections before each test, and disconnect afterward.

\`\`\`javascript
const mongoose = require('mongoose');
const request = require('supertest');
const app = require('./app');

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI);
});

beforeEach(async () => {
  await mongoose.connection.collection('users').deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('POST /users', () => {
  it('should create a new user in the DB', async () => {
    const res = await request(app).post('/users').send({ name: 'Bob' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('Bob');
  });
});
\`\`\`

### Mocking Services
For pure unit testing of controllers, you can mock the Request and Response objects (using libraries like \`node-mocks-http\`) and mock the database service entirely, avoiding the need for Supertest or a DB connection.
`,
    interviewQuestions: [
      { question: "Why is it important to export the Express 'app' object separately from the 'app.listen()' call when testing?", answer: "Supertest needs the raw Express application object to simulate requests. If the file containing the app also calls app.listen(), the server will try to bind to a port during tests, causing port conflicts (EADDRINUSE) and preventing tests from exiting cleanly." },
      { question: "What is Supertest and how does it work?", answer: "Supertest is an HTTP assertion library for testing Node.js servers. It wraps the Express app object, allowing you to chain HTTP methods (like .get()), send payloads, and assert expectations on status codes, headers, and the response body." },
      { question: "How do you handle database connections during integration testing?", answer: "You should use a dedicated test database. You manage connections using test runner hooks: establish the connection in beforeAll, wipe/seed the data in beforeEach to ensure isolation, and close the connection in afterAll." },
      { question: "What is the difference between Unit Testing a controller and Integration Testing an Express route?", answer: "Unit testing a controller involves mocking the req and res objects and the database service to test the controller logic in isolation. Integration testing involves using Supertest to send an actual HTTP request through the router, middleware, controller, and often a real test database." },
      { question: "How do you test an endpoint that requires authentication?", answer: "You first make a request to the login/auth endpoint or manually sign a JWT in the test setup. Then, you use Supertest's .set('Authorization', 'Bearer ' + token) method to attach the token to the subsequent requests." }
    ],
    practicalTask: {
      scenario: "Write an integration test for a simple endpoint.",
      task: "Using 'supertest', write a test suite for 'app' testing a POST to '/echo'. It should send { msg: 'hello' }, expect a 200 status, and expect the response body to match the sent data.",
      solutionCode: `
const request = require('supertest');
const app = require('./app'); // assume app is defined

describe('POST /echo', () => {
  it('should echo the message back', async () => {
    const payload = { msg: 'hello' };
    const res = await request(app)
      .post('/echo')
      .send(payload)
      .expect(200);
      
    expect(res.body).toEqual(payload);
  });
});
      `
    }
  },
  {
    slug: 'express-performance-deployment',
    title: 'Performance Optimization and Deployment',
    order: 15,
    content: `
## Performance Optimization and Deployment

To prepare an Express application for production traffic, you must optimize its performance and configure the deployment environment properly.

### 1. Enable Gzip Compression
Compressing response bodies significantly decreases the size of payloads sent to the client, increasing speed.

\`\`\`javascript
const compression = require('compression');
app.use(compression());
\`\`\`

### 2. Node Environment Variables
Always set \`NODE_ENV=production\` in your deployment environment. Express caches view templates, CSS files, and generates less verbose error messages when running in production mode, yielding a 3x performance boost.

### 3. Use a Process Manager (PM2)
Never run a production Node app using \`node server.js\`. If the app crashes, it stays down. Use a process manager like **PM2** to ensure the app restarts automatically if it crashes, and to run multiple instances across all CPU cores.

\`\`\`bash
# Install PM2 globally
npm install pm2 -g

# Start the app in cluster mode across all available CPUs
pm2 start server.js -i max
\`\`\`
Node.js is single-threaded. PM2's cluster mode spawns multiple processes of your Express app sharing the same port, effectively utilizing multi-core systems.

### 4. Reverse Proxy with Nginx
Express is not designed to be a front-facing web server handling SSL/TLS termination or serving static files at massive scale. Place a Reverse Proxy (like Nginx) in front of Express.
- Nginx handles HTTPS.
- Nginx serves static assets (images, CSS).
- Nginx proxies API requests to Node.js (\`proxy_pass http://localhost:3000;\`).

### 5. Caching (Redis)
If your Express app performs expensive database queries for data that rarely changes, implement caching.
When a request comes in, check Redis. If data exists (cache hit), return it immediately. If not (cache miss), query the DB, store in Redis, and return.

\`\`\`javascript
const redisClient = require('redis').createClient();

app.get('/api/stats', async (req, res) => {
  redisClient.get('stats', async (err, cachedData) => {
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // Expensive DB query
    const stats = await db.getComplexStats();
    
    // Store in cache for 1 hour
    redisClient.setex('stats', 3600, JSON.stringify(stats));
    res.json(stats);
  });
});
\`\`\`

### 6. Logging
Use a proper logging library like **Winston** or **Pino** instead of \`console.log\`. \`console.log\` is synchronous (mostly) and blocks the event loop. Pino is highly optimized for performance.
`,
    interviewQuestions: [
      { question: "Why is it critical to set NODE_ENV=production in Express?", answer: "Setting NODE_ENV to 'production' instructs Express to cache view templates, cache CSS files, and suppress verbose error stack traces. This drastically improves performance (up to 3x) and enhances security." },
      { question: "What is PM2 and why do we use it in production?", answer: "PM2 is a production process manager for Node.js. It ensures your application runs continuously by auto-restarting it if it crashes. It also provides 'cluster mode' to spawn multiple instances of your app across multiple CPU cores, balancing the load." },
      { question: "Why shouldn't you expose an Express server directly to the internet on port 80/443?", answer: "Express is not optimized for SSL/TLS termination or efficiently serving static files at scale. A reverse proxy like Nginx or HAProxy should be placed in front to handle SSL, serve static files, and proxy only application logic requests to Express." },
      { question: "How does the 'compression' middleware improve Express performance?", answer: "It compresses the HTTP response bodies using Gzip or Deflate before sending them over the network. This significantly reduces the amount of data transferred, leading to faster load times for clients." },
      { question: "Why is Redis often used with Express?", answer: "Redis is an in-memory data store used for caching. It drastically improves API response times and reduces database load by storing the results of expensive database queries or API calls and serving them directly from memory on subsequent requests." }
    ],
    practicalTask: {
      scenario: "Prepare your Express app for production.",
      task: "Add the 'compression' middleware to an Express app. Also, write a PM2 command in a comment to start 'app.js' using all available CPU cores.",
      solutionCode: `
const express = require('express');
const compression = require('compression');
const app = express();

app.use(compression()); // Compress all responses

// PM2 Command:
// pm2 start app.js -i max
      `
    }
  }
];

appendTopics('express', 'Express.js API Design', 'The definitive guide.', topics);
