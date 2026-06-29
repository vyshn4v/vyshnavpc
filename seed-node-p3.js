import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "nodejs-mongodb-mongoose",
    title: "11. Connecting to Databases (MongoDB/Mongoose)",
    order: 11,
    content: `
# Connecting to Databases (MongoDB/Mongoose)

While Node.js can connect to any type of database (SQL or NoSQL), the most popular database paired with Node.js in the modern web ecosystem is **MongoDB**, a NoSQL document database. This forms the "M" and "N" of the popular MERN/MEAN stacks.

To interact with MongoDB efficiently in Node.js, developers almost universally use **Mongoose**, an Object Data Modeling (ODM) library. Mongoose provides a rigorous modeling environment, schema validation, and easily queryable APIs.

## Why Mongoose over the native MongoDB Driver?
The native MongoDB Node.js driver allows you to connect and execute queries, but it is schema-less. You can insert any data shape into a collection. Mongoose introduces Schemas, allowing you to enforce data structure, add validation, set default values, and create lifecycle hooks (middleware).

## 1. Connecting to MongoDB

First, install the library: \`npm install mongoose\`

\`\`\`javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The URI usually comes from an environment variable
    const uri = 'mongodb://localhost:27017/my_database';
    
    await mongoose.connect(uri);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();
\`\`\`

## 2. Defining a Schema and Model

A Schema defines the structure of your document, default values, validators, etc. A Model is a compiled version of the schema that provides an interface to the database for creating, querying, updating, deleting records.

\`\`\`javascript
const mongoose = require('mongoose');

// 1. Define the Schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, // Ensures no duplicate emails
    lowercase: true 
  },
  age: { 
    type: Number, 
    min: [18, 'Must be at least 18 years old'] 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 2. Create the Model
// 'User' will automatically create a collection named 'users' in MongoDB
const User = mongoose.model('User', userSchema);

module.exports = User;
\`\`\`

## 3. CRUD Operations with Mongoose

Mongoose Models provide a variety of methods to perform Create, Read, Update, and Delete operations. These operations return Promises, making them perfect for \`async/await\`.

### Create (Insert)
\`\`\`javascript
const createUser = async () => {
  try {
    const newUser = await User.create({
      name: 'Alice Doe',
      email: 'alice@example.com',
      age: 25
    });
    console.log('User created:', newUser);
  } catch (err) {
    console.error('Failed to create:', err.message); // Validations trigger here
  }
};
\`\`\`

### Read (Query)
\`\`\`javascript
const findUsers = async () => {
  // Find all users
  const allUsers = await User.find();
  
  // Find by criteria
  const admins = await User.find({ role: 'admin' });
  
  // Find a specific user by ID
  const specificUser = await User.findById('60c72b2f9b1d8b3a4c8b4567');
  
  // Find one user by email
  const user = await User.findOne({ email: 'alice@example.com' });
};
\`\`\`

### Update
\`\`\`javascript
const updateUser = async () => {
  // Update one document matching the criteria
  // new: true returns the updated document rather than the old one
  const updatedUser = await User.findOneAndUpdate(
    { email: 'alice@example.com' }, 
    { age: 26 },
    { new: true, runValidators: true } // runValidators ensures the 'min: 18' rule is checked
  );
  
  // Alternatively, using findByIdAndUpdate
  // await User.findByIdAndUpdate(id, { role: 'admin' }, { new: true });
};
\`\`\`

### Delete
\`\`\`javascript
const deleteUser = async () => {
  const deleted = await User.findOneAndDelete({ email: 'alice@example.com' });
  // OR
  // await User.findByIdAndDelete(id);
};
\`\`\`

## Using Mongoose in an Express Route

Combining Mongoose with Express is straightforward. Make sure you handle asynchronous errors properly (as discussed in Chapter 9).

\`\`\`javascript
const express = require('express');
const User = require('./models/User'); // Import the model
const app = express();
app.use(express.json());

// Create a User Endpoint
app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    // Distinguish between Mongoose Validation Errors and Duplicate Key errors
    if (err.name === 'ValidationError') {
      res.status(400).json({ error: err.message });
    } else if (err.code === 11000) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is the difference between MongoDB and Mongoose?",
        answer: "MongoDB is the actual NoSQL database engine. Mongoose is an Object Data Modeling (ODM) library for Node.js that runs on top of the MongoDB driver. Mongoose provides schema validation, data modeling, and business logic hooks that raw MongoDB lacks."
      },
      {
        question: "What is a Mongoose Schema?",
        answer: "A Mongoose Schema is a configuration object that defines the structure of documents within a collection. It dictates what fields are allowed, their data types, default values, and validation rules."
      },
      {
        question: "How do you enforce validation in Mongoose?",
        answer: "Validation is defined in the Schema. You can use built-in validators like `required: true`, `min`, `max`, `enum`, or write custom validation functions. If a document fails validation during a `.save()` or `.create()` operation, Mongoose throws a ValidationError."
      },
      {
        question: "What does `runValidators: true` do in an update query?",
        answer: "By default, Mongoose does not run schema validations during update operations like `findOneAndUpdate`. Setting `{ runValidators: true }` forces Mongoose to validate the incoming update data against the schema before applying the update."
      },
      {
        question: "If a Mongoose query fails because of a duplicate `unique` field, what kind of error is thrown?",
        answer: "It throws a MongoDB driver error with the code `11000` (Duplicate Key Error), not a Mongoose ValidationError."
      }
    ],
    practicalTask: {
      scenario: "You are creating a catalog API and need a Mongoose model for a 'Product'.",
      task: "Write a Node script defining a Product model with: `name` (required string), `price` (required number, minimum 0), and `inStock` (boolean, default true).",
      solutionCode: `const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  inStock: {
    type: Boolean,
    default: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;`
    }
  },
  {
    slug: "nodejs-auth-jwt",
    title: "12. Authentication and Authorization (JWT)",
    order: 12,
    content: `
# Authentication and Authorization (JWT)

Securing your Node.js application means identifying who the user is (**Authentication**) and determining what they are allowed to do (**Authorization**).

In modern, stateless APIs, the industry standard for authentication is **JSON Web Tokens (JWT)**.

## What is a JWT?
A JSON Web Token (JWT) is an open standard that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. 

A JWT consists of three parts separated by dots (\`.\`):
1. **Header:** Contains the algorithm used (e.g., HMAC SHA256).
2. **Payload:** Contains the "claims" (the data, like user ID and role).
3. **Signature:** A cryptographic hash of the Header, Payload, and a Secret Key stored on the server.

**Crucial Concept:** The payload is *encoded*, not encrypted. Anyone can decode and read the payload. The magic is in the *signature*. If a user modifies the payload (e.g., changes their role from 'user' to 'admin'), the signature will no longer match, and the server will reject the token.

## 1. User Registration and Password Hashing

You must NEVER store plain-text passwords in the database. Use \`bcrypt\` to hash them.

\`\`\`javascript
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Assume Mongoose Model from previous chapter

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Generate salt and hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 2. Save user to DB
    const user = await User.create({ email, password: hashedPassword });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
\`\`\`

## 2. User Login and JWT Generation

When a user logs in successfully, the server creates a JWT and sends it back to the client. The client stores this token (usually in local storage or an HttpOnly cookie) and sends it with every subsequent request.

Install the package: \`npm install jsonwebtoken\`

\`\`\`javascript
const jwt = require('jsonwebtoken');

// Secret key should be in a .env file!
const JWT_SECRET = 'super-secret-key-do-not-share';

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // 2. Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  // 3. Generate JWT
  // Payload contains non-sensitive data needed to identify the user
  const payload = { userId: user._id, role: user.role };
  
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' }); // Expires in 1 hour

  // 4. Send token to client
  res.json({ token });
});
\`\`\`

## 3. Protecting Routes (Authentication Middleware)

To protect routes, we create an Express middleware that extracts the token from the \`Authorization\` header and verifies it.

\`\`\`javascript
const requireAuth = (req, res, next) => {
  // Tokens are usually sent as "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using the secret key
    // If successful, it returns the decoded payload { userId, role, iat, exp }
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user data to the request object for the next routes to use
    req.user = decoded;
    
    next(); // Pass control to the protected route
  } catch (err) {
    // jwt.verify throws an error if token is invalid or expired
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Using the middleware
app.get('/api/dashboard', requireAuth, (req, res) => {
  // We know req.user exists because requireAuth passed
  res.json({ message: \`Welcome User ID: \${req.user.userId}\` });
});
\`\`\`

## 4. Role-Based Authorization

Authentication proves *who* you are. Authorization proves *what* you can do. Now that we have \`req.user.role\` attached to the request, we can build authorization middleware.

\`\`\`javascript
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    // Ensure requireAuth ran first
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient privileges' });
    }

    next();
  };
};

// Route protected by TWO middlewares
// 1. Must be logged in
// 2. Must be an admin
app.delete('/api/users/:id', requireAuth, requireRole('admin'), (req, res) => {
  res.json({ message: 'User deleted (Admin only action)' });
});
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is the difference between Authentication and Authorization?",
        answer: "Authentication is the process of verifying a user's identity (e.g., checking an email and password). Authorization is the process of verifying what a specific user has permission to do (e.g., checking if a user has 'admin' rights to delete a post)."
      },
      {
        question: "What is a JWT and what are its three parts?",
        answer: "A JSON Web Token (JWT) is a standard for securely transmitting information. Its three parts are the Header (algorithm info), the Payload (the actual data/claims), and the Signature (used to verify the token hasn't been tampered with)."
      },
      {
        question: "Is the payload of a JWT encrypted? Can you store passwords in it?",
        answer: "No, the payload is merely base64 encoded, meaning anyone can decode and read it. You should NEVER store passwords or highly sensitive data inside a JWT payload. It is only signed to prevent tampering, not encrypted to prevent reading."
      },
      {
        question: "How do you securely store passwords in a Node.js application?",
        answer: "Passwords must be hashed using a strong cryptographic algorithm like `bcrypt` or `argon2`, and a random 'salt' must be added before hashing to protect against rainbow table attacks. Never store plain-text passwords."
      },
      {
        question: "If a user's role changes from 'user' to 'admin' in the database, what happens to their current JWT?",
        answer: "The current JWT still contains the 'user' role in its payload. Since JWTs are stateless, the server does not check the database for every request. The user will remain a 'user' until the JWT expires or they log in again to receive a new token with the updated role."
      }
    ],
    practicalTask: {
      scenario: "You need a middleware function that checks for a JWT and attaches the decoded payload to the request.",
      task: "Write a Node script with a `verifyToken` middleware that extracts a token from the `Authorization: Bearer <token>` header, verifies it with `jsonwebtoken`, and handles errors.",
      solutionCode: `const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;`
    }
  },
  {
    slug: "nodejs-security",
    title: "13. Node.js Security Best Practices",
    order: 13,
    content: `
# Node.js Security Best Practices

Because Node.js is widely used for backend APIs, it is a prime target for attackers. Building a secure application is a multi-layered process. Below are the most critical security vulnerabilities and how to mitigate them in an Express.js environment.

## 1. Setting Security Headers with Helmet
By default, Express sends HTTP headers that can reveal information about your server (like \`X-Powered-By: Express\`), and lacks headers that protect against common attacks like Cross-Site Scripting (XSS) or Clickjacking.

**Helmet** is a middleware that automatically secures your HTTP headers.

\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const app = express();

// Use Helmet at the very top of the stack
app.use(helmet());
\`\`\`

## 2. Preventing Cross-Site Scripting (XSS)
XSS occurs when an attacker injects malicious JavaScript into your database, which is later served to and executed by other users' browsers. 

To prevent this, you should sanitize all user input to remove HTML tags and scripts.

\`\`\`bash
npm install xss-clean
\`\`\`
\`\`\`javascript
const xss = require('xss-clean');

// Sanitize incoming request bodies, queries, and params
app.use(xss());
\`\`\`

## 3. Preventing NoSQL Injection
Similar to SQL Injection, NoSQL Injection happens when an attacker passes MongoDB operators (like \`$gt\`, \`$ne\`) via the request body or query string, manipulating the database query logic.

For example, an attacker trying to bypass login:
\`\`\`json
{
  "email": { "$gt": "" },
  "password": { "$gt": "" }
}
\`\`\`

To prevent this, use **express-mongo-sanitize**. It removes any keys containing a \`$\` or \`.\` from \`req.body\`, \`req.query\`, or \`req.params\`.

\`\`\`bash
npm install express-mongo-sanitize
\`\`\`
\`\`\`javascript
const mongoSanitize = require('express-mongo-sanitize');

// Prevent NoSQL injection
app.use(mongoSanitize());
\`\`\`

## 4. Rate Limiting to prevent Brute Force & DDoS
If your API endpoints are entirely open, an attacker can write a script to guess thousands of passwords per second, or simply overwhelm your server with traffic (DDoS). Rate limiting restricts the number of requests an IP address can make in a given timeframe.

\`\`\`bash
npm install express-rate-limit
\`\`\`
\`\`\`javascript
const rateLimit = require('express-rate-limit');

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // Limit each IP to 100 requests
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: 'Too many requests from this IP, please try again in an hour.'
});

// Apply globally
app.use('/api', limiter);

// Apply strict limits to specific routes (e.g., login)
const loginLimiter = rateLimit({
  max: 5,
  windowMs: 15 * 60 * 1000, // 5 attempts per 15 mins
  message: 'Too many login attempts.'
});
app.use('/api/login', loginLimiter);
\`\`\`

## 5. Preventing HTTP Parameter Pollution (HPP)
HPP occurs when a client sends the same query parameter multiple times. 
E.g., \`GET /search?sort=asc&sort=desc\`. 
Express parses this into an array: \`req.query.sort = ['asc', 'desc']\`. If your code expects a string, an array might crash your server or bypass logic.

\`\`\`bash
npm install hpp
\`\`\`
\`\`\`javascript
const hpp = require('hpp');

// Cleans up duplicate parameters
app.use(hpp({
  whitelist: ['price'] // Allow 'price' to be an array for ranges: ?price=10&price=50
}));
\`\`\`

## 6. Validating Environment Variables
Never hardcode secrets (like DB passwords, JWT secrets, API keys) in your source code. Use a \`.env\` file. More importantly, ensure these variables are strictly validated on startup so your app crashes immediately rather than failing silently in production.

\`\`\`javascript
require('dotenv').config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is Helmet.js and why should you use it?",
        answer: "Helmet.js is an Express middleware that secures HTTP headers. It prevents the server from leaking information (like the 'X-Powered-By' header) and adds headers that protect against cross-site scripting (XSS), clickjacking, and mime-sniffing attacks."
      },
      {
        question: "How do you protect a Node.js MongoDB application against NoSQL Injection?",
        answer: "You use middleware like `express-mongo-sanitize` which recursively parses `req.body`, `req.query`, and `req.params` to strip out any keys that begin with a `$` or contain a `.`, neutralizing MongoDB query operators injected by an attacker."
      },
      {
        question: "What is Rate Limiting and how does it protect an API?",
        answer: "Rate limiting restricts the number of HTTP requests a specific IP address can make within a specific time window. It protects the API against Denial of Service (DoS) attacks, brute-force login attempts, and excessive server resource consumption."
      },
      {
        question: "What is HTTP Parameter Pollution?",
        answer: "HPP is an attack where the client sends the same query string parameter multiple times (e.g., `?id=1&id=2`). Express converts this into an array. If the application logic expects a string, it may crash or behave unpredictably. Middleware like `hpp` forces the parameter to be a single string (usually taking the last one)."
      },
      {
        question: "How do you securely store secrets in a Node.js application?",
        answer: "Secrets must never be hardcoded into the source code or checked into version control. They should be passed into the application via Environment Variables (often using a `.env` file locally), and accessed via `process.env`."
      }
    ],
    practicalTask: {
      scenario: "You are preparing your Express server for production and need to add basic security middlewares.",
      task: "Create a basic Express server and integrate `helmet`, `express-rate-limit` (100 req/15min), and `express-mongo-sanitize` globally.",
      solutionCode: `const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Body parser
app.use(express.json());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: 'Too many requests from this IP.'
});
app.use('/api', limiter);

app.get('/api/test', (req, res) => res.send('Secure API'));

// app.listen(3000);`
    }
  },
  {
    slug: "nodejs-testing-jest",
    title: "14. Unit and Integration Testing with Jest",
    order: 14,
    content: `
# Unit and Integration Testing with Jest

Testing is a fundamental practice in software engineering to ensure that your code behaves as expected and to prevent regressions when making changes. In the Node.js ecosystem, **Jest** is the most popular testing framework due to its simplicity, built-in assertion library, and excellent mocking capabilities.

## Types of Tests
1. **Unit Tests**: Test an isolated piece of code (like a single function) without any external dependencies (no database, no network).
2. **Integration Tests**: Test how different parts of the application work together. In Node.js, this usually involves spinning up the Express app and testing API endpoints (often hitting a test database).

## 1. Setting up Jest

Install Jest as a development dependency:
\`\`\`bash
npm install --save-dev jest
\`\`\`

In \`package.json\`, set the test script:
\`\`\`json
"scripts": {
  "test": "jest --watchAll"
}
\`\`\`

## 2. Writing Unit Tests

Let's test a simple utility function. Jest automatically looks for files ending in \`.test.js\` or \`.spec.js\`.

\`\`\`javascript
// math.js
const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
module.exports = { add, subtract };
\`\`\`

\`\`\`javascript
// math.test.js
const { add, subtract } = require('./math');

// 'describe' groups related tests together
describe('Math Utility Functions', () => {
  
  // 'it' or 'test' defines a single test case
  it('should correctly add two numbers', () => {
    const result = add(2, 3);
    // 'expect' is the assertion
    expect(result).toBe(5);
  });

  it('should correctly subtract two numbers', () => {
    expect(subtract(10, 4)).toBe(6);
  });
});
\`\`\`

## 3. Mocking Dependencies
Unit tests should not hit a real database or call third-party APIs. We use Jest's mocking features to simulate them.

\`\`\`javascript
// user-service.js
const User = require('./models/User'); // Mongoose Model

const getUserEmail = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');
  return user.email;
};
module.exports = { getUserEmail };
\`\`\`

To test \`getUserEmail\` without connecting to MongoDB, we mock the Mongoose Model.

\`\`\`javascript
// user-service.test.js
const { getUserEmail } = require('./user-service');
const User = require('./models/User');

// Tell Jest to mock the entire User module
jest.mock('./models/User');

describe('getUserEmail', () => {
  it('should return the email of the user', async () => {
    // Mock the specific implementation of findById for this test
    User.findById.mockResolvedValue({ email: 'test@example.com' });
    
    const email = await getUserEmail('123');
    expect(email).toBe('test@example.com');
    expect(User.findById).toHaveBeenCalledWith('123');
  });

  it('should throw an error if user not found', async () => {
    User.findById.mockResolvedValue(null); // Simulate not found
    
    // Testing async errors requires returning the promise
    await expect(getUserEmail('123')).rejects.toThrow('User not found');
  });
});
\`\`\`

## 4. Integration Testing APIs with Supertest

To test Express API routes, we use a library called **Supertest**. It allows us to simulate HTTP requests without actually starting the server on a network port.

\`\`\`bash
npm install --save-dev supertest
\`\`\`

**Important setup:** You must export the Express \`app\` instance *without* calling \`app.listen()\`. Separate the server startup into a different file (e.g., \`server.js\`).

\`\`\`javascript
// app.js
const express = require('express');
const app = express();
app.get('/api/ping', (req, res) => res.status(200).json({ message: 'pong' }));
module.exports = app;
\`\`\`

\`\`\`javascript
// app.test.js
const request = require('supertest');
const app = require('./app');

describe('GET /api/ping', () => {
  it('should return 200 and a message pong', async () => {
    // request(app) passes the Express app to Supertest
    const response = await request(app).get('/api/ping');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'pong' });
  });
});
\`\`\`

Integration tests that involve a database usually require setting up a test database. You use Jest lifecycle hooks (\`beforeAll\`, \`afterAll\`, \`beforeEach\`, \`afterEach\`) to connect to the test database, clear collections before each test, and disconnect afterward.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between a Unit Test and an Integration Test?",
        answer: "A Unit Test focuses on testing a single, isolated piece of code (like a function) by mocking all external dependencies (DBs, network calls). An Integration Test checks how multiple units work together, often involving a real (test) database and full HTTP request lifecycles."
      },
      {
        question: "What is the purpose of mocking in testing?",
        answer: "Mocking replaces real, complex, or slow dependencies (like a database connection or a third-party API) with fake, predictable objects. This ensures that a unit test runs quickly, is deterministic, and strictly tests the logic of the function, not the external service."
      },
      {
        question: "What does the `supertest` library do?",
        answer: "Supertest is a library used alongside test runners like Jest to test Node.js HTTP servers. It allows you to simulate HTTP requests (GET, POST, etc.) against an Express app object without actually spinning up the server and binding it to a network port."
      },
      {
        question: "Why should you export the Express `app` separately from `app.listen()` for testing?",
        answer: "If `app.listen()` is in the same file as the Express app definition, requiring the file in a test will start the server on an actual port. This can cause port conflicts and hang the test runner. Exporting the `app` separately allows Supertest to inject requests directly into the application in memory."
      },
      {
        question: "What are Jest lifecycle hooks?",
        answer: "Hooks like `beforeAll`, `afterAll`, `beforeEach`, and `afterEach` allow you to run setup or teardown code at specific points during the test suite execution. They are commonly used to connect to test databases before tests run and clear data between test cases."
      }
    ],
    practicalTask: {
      scenario: "You need to write a unit test for a simple authentication utility.",
      task: "Write a Jest test file for a function `isValidPassword(password)`. It should return true if length >= 8, else false. Test both cases using `describe`, `it`, and `expect`.",
      solutionCode: `// Utility function (usually imported)
const isValidPassword = (password) => password.length >= 8;

describe('isValidPassword', () => {
  it('should return true if password is 8 or more characters', () => {
    expect(isValidPassword('password123')).toBe(true);
    expect(isValidPassword('12345678')).toBe(true);
  });

  it('should return false if password is less than 8 characters', () => {
    expect(isValidPassword('short')).toBe(false);
    expect(isValidPassword('')).toBe(false);
  });
});`
    }
  },
  {
    slug: "nodejs-deployment-pm2",
    title: "15. Deployment, Process Managers (PM2) & Environment Variables",
    order: 15,
    content: `
# Deployment, Process Managers (PM2) & Environment Variables

Moving a Node.js application from a developer's laptop to a production server requires addressing several challenges: keeping the app running if it crashes, managing environment-specific configurations, and utilizing multi-core processors.

## 1. Environment Variables
Applications behave differently depending on the environment (development, testing, production). Database URIs, port numbers, and secret keys change. These should never be hardcoded.

Node.js exposes environment variables on the \`process.env\` object. 

### Using dotenv
During local development, we use a \`.env\` file and the \`dotenv\` package to load these variables into \`process.env\`.

\`\`\`bash
# .env (NEVER commit this file to Git)
PORT=8080
NODE_ENV=development
DB_URI=mongodb://localhost:27017/devdb
JWT_SECRET=supersecret
\`\`\`

\`\`\`javascript
// app.js
require('dotenv').config(); // Load variables from .env

const port = process.env.PORT || 3000;
const dbUri = process.env.DB_URI;

// Check environment mode
if (process.env.NODE_ENV === 'development') {
  console.log('Running in Dev mode');
}
\`\`\`

In production (e.g., AWS, Heroku, DigitalOcean), you do NOT upload the \`.env\` file. Instead, you set these variables directly in the hosting provider's dashboard or server OS.

## 2. Process Managers: Why PM2?

If you start a Node app using \`node app.js\` on a server, and an unhandled exception occurs, the app crashes, the process exits, and your website goes offline until you manually restart it. Also, if you close your SSH terminal, the Node process dies.

**PM2 (Process Manager 2)** solves this. It is an advanced, production process manager for Node.js.

### Key Features of PM2:
1. **Auto-Restart**: If the app crashes, PM2 immediately restarts it.
2. **Daemonization**: It runs the app in the background. You can close your terminal and the app keeps running.
3. **Cluster Mode**: Node.js is single-threaded. By default, it runs on one CPU core, even if your server has 8 cores. PM2 can spawn multiple instances of your app to utilize all cores and load balance traffic between them.
4. **Log Management**: PM2 aggregates logs and handles log rotation.

## 3. Using PM2

Install PM2 globally on your server:
\`\`\`bash
npm install -g pm2
\`\`\`

### Basic Commands
\`\`\`bash
# Start an app and name it
pm2 start app.js --name "my-api"

# View running apps
pm2 list

# View logs
pm2 logs my-api

# Stop / Restart / Delete app
pm2 stop my-api
pm2 restart my-api
pm2 delete my-api
\`\`\`

### Cluster Mode (Scaling across CPUs)
To maximize performance, you should run your app in cluster mode, allowing PM2 to spawn multiple worker processes.

\`\`\`bash
# Start app in cluster mode utilizing all available CPU cores
pm2 start app.js -i max
\`\`\`

When a request comes in, PM2's internal load balancer will route the request to an available worker process. If one worker crashes, the others continue serving traffic while PM2 restarts the crashed worker, ensuring zero-downtime.

## 4. PM2 Ecosystem File
For production, instead of passing flags via the CLI, you create an \`ecosystem.config.js\` file. This acts as a configuration file for PM2, defining instances, environment variables, and log paths.

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: "my-production-api",
    script: "./app.js",
    instances: "max",       // Use all CPUs
    exec_mode: "cluster",   // Enable cluster mode
    watch: false,           // Don't auto-restart on file changes in production
    env_production: {
      NODE_ENV: "production",
      PORT: 80
    }
  }]
};
\`\`\`

You start this using:
\`\`\`bash
pm2 start ecosystem.config.js --env production
\`\`\`

## 5. Reverse Proxies (Nginx)
While Node.js handles application logic efficiently, it is not designed to be a front-facing web server handling SSL certificates (HTTPS) or serving heavy static files. 

In production, you typically put a **Reverse Proxy** like Nginx in front of Node.js. 
- The client connects to Nginx on Port 80 (HTTP) or 443 (HTTPS).
- Nginx handles the SSL decryption.
- Nginx forwards the traffic internally to the Node.js/PM2 application running on Port 3000.
    `,
    interviewQuestions: [
      {
        question: "Why should you use a process manager like PM2 in production?",
        answer: "A plain `node app.js` command runs in the foreground and will terminate if the terminal closes or if the app crashes. PM2 runs the app in the background (as a daemon), automatically restarts it if it crashes, manages logs, and can scale the app across multiple CPU cores."
      },
      {
        question: "What is PM2 Cluster Mode?",
        answer: "Because Node.js is single-threaded, a standard Node app uses only one CPU core. PM2 Cluster Mode spawns multiple instances of the application (usually one per CPU core) and uses an internal load balancer to distribute incoming network traffic among them, significantly increasing throughput and availability."
      },
      {
        question: "How do you manage environment variables in a Node.js application?",
        answer: "Locally, you use a `.env` file and the `dotenv` package to load variables into `process.env`. In production, you do not use `.env` files; instead, you inject the variables directly into the host environment (e.g., AWS, Heroku) or define them in a PM2 ecosystem file."
      },
      {
        question: "Why is it important to never commit `.env` files to version control (Git)?",
        answer: "`.env` files contain sensitive secrets like database passwords, API keys, and JWT secrets. Committing them to Git exposes these secrets to anyone with repository access, leading to severe security breaches."
      },
      {
        question: "What is the role of a Reverse Proxy (like Nginx) in front of a Node.js server?",
        answer: "A reverse proxy acts as an intermediary. It handles incoming HTTP/HTTPS traffic, manages SSL/TLS termination, serves static files efficiently, protects against certain attacks, and forwards only the dynamic API requests to the underlying Node.js application running on an internal port."
      }
    ],
    practicalTask: {
      scenario: "You need to define a PM2 configuration for your API.",
      task: "Write an `ecosystem.config.js` file for an app named 'store-api'. It should run `server.js`, use 'max' instances in cluster mode, and define an env_production object setting `NODE_ENV` to 'production'.",
      solutionCode: `module.exports = {
  apps: [{
    name: "store-api",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    env_production: {
      NODE_ENV: "production",
      PORT: 8080
    }
  }]
};`
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
