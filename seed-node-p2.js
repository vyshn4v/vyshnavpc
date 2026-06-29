import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "nodejs-http-server",
    title: "6. Working with HTTP & Building a Basic Web Server",
    order: 6,
    content: `
# Working with HTTP & Building a Basic Web Server

While you will usually use frameworks like Express.js to build web servers in the real world, understanding the core \`http\` module is crucial. It is the foundation upon which all Node.js web frameworks are built.

## The Core \`http\` Module

Node.js provides a built-in \`http\` module to transfer data over the Hyper Text Transfer Protocol (HTTP). The \`http\` module can create an HTTP server that listens to server ports and gives a response back to the client.

### Creating a Simple Web Server

\`\`\`javascript
const http = require('http');

// Create the server
// The callback function is invoked every time a request is received
const server = http.createServer((req, res) => {
  
  // 1. Set the response header (Status Code + Content-Type)
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  
  // 2. Write the response body
  res.write('Hello World! Welcome to the Node.js HTTP Server.');
  
  // 3. End the response
  res.end();
});

// The server starts listening on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
\`\`\`

## Handling Different Routes and Methods

A real web server needs to handle different URLs (routes) and different HTTP methods (GET, POST, etc.). Using only the core \`http\` module, you must manually parse the URL and method.

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  // req.url contains the path requested by the client
  // req.method contains the HTTP method (GET, POST, PUT, DELETE)
  
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Home Page</h1>');
  } 
  else if (req.url === '/about' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>About Us</h1>');
  } 
  else if (req.url === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: "Success", data: [1, 2, 3] }));
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => console.log('Server running on port 3000'));
\`\`\`

## Handling POST Requests and Payload Data

When a client sends a POST request with data (like a form submission), the data doesn't arrive all at once. Because the HTTP request is a **Readable Stream**, the data arrives in chunks. You must listen for the \`data\` events and stitch the chunks together.

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/submit' && req.method === 'POST') {
    let body = '';

    // Listen for data chunks
    req.on('data', (chunk) => {
      // Convert buffer chunk to string and append
      body += chunk.toString();
    });

    // Listen for the end of the request
    req.on('end', () => {
      console.log('Received Payload:', body);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'Data received successfully',
        receivedData: body
      }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);
\`\`\`

## Why Use Frameworks like Express?
As you can see, building a server with just the \`http\` module is verbose. 
- You have to manually check \`req.url\` and \`req.method\`.
- You have to manually parse incoming streams for POST bodies.
- You have to manually set headers and stringify JSON.
- Serving static files (HTML, CSS, JS) requires manually reading the files from disk and setting the correct MIME types.

Frameworks like Express.js abstract all this boilerplate away.
    `,
    interviewQuestions: [
      {
        question: "How do you create a basic web server using only Node.js core modules?",
        answer: "You use the `http` module and call `http.createServer()`. You pass it a callback function taking `req` (request) and `res` (response) objects. Inside the callback, you write headers and data to `res` and call `res.end()`. Finally, you call `.listen(port)` on the server instance."
      },
      {
        question: "What is `req` and `res` in the `http.createServer` callback?",
        answer: "`req` is an `IncomingMessage` object representing the HTTP request, which implements the Readable Stream interface. `res` is a `ServerResponse` object, which implements the Writable Stream interface used to send data back to the client."
      },
      {
        question: "How do you handle incoming POST data in a raw Node.js HTTP server?",
        answer: "Because `req` is a readable stream, you must listen to the `'data'` event to collect incoming chunks of the payload, and append them to a variable. Once the `'end'` event fires, the entire payload is assembled and ready to be processed."
      },
      {
        question: "Why do we set the 'Content-Type' header?",
        answer: "The 'Content-Type' header tells the client's browser how to interpret the response body. For example, 'text/html' tells the browser to render HTML, while 'application/json' tells it to parse the response as a JSON object."
      },
      {
        question: "Why do developers use Express.js instead of the raw `http` module?",
        answer: "The `http` module requires manually handling routing, parsing URLs, extracting query strings, assembling stream chunks for POST payloads, and managing headers. Express abstracts all of this complex boilerplate into simple, easy-to-use functions."
      }
    ],
    practicalTask: {
      scenario: "You need a raw HTTP server that returns a simple JSON object on the root route.",
      task: "Write a Node.js script using the 'http' module that listens on port 8080 and responds with JSON `{ status: 'ok' }` on a GET request to '/'.",
      solutionCode: `const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('Raw HTTP Server listening on port 8080');
});`
    }
  },
  {
    slug: "nodejs-express-routing",
    title: "7. Express.js Fundamentals & Routing",
    order: 7,
    content: `
# Express.js Fundamentals & Routing

Express.js is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for web and mobile applications and abstracts away the complexities of the core \`http\` module.

## Setting Up Express

First, you install Express via npm: \`npm install express\`.

### A Basic Express Server

\`\`\`javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Basic GET route
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

// Start the server
app.listen(PORT, () => {
  console.log(\`Server listening on http://localhost:\${PORT}\`);
});
\`\`\`

Notice how much simpler this is! \`res.send()\` automatically sets the \`Content-Type\` header and ends the response.

## Routing in Express

Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).

\`\`\`javascript
// GET method route
app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]);
});

// POST method route
app.post('/api/users', (req, res) => {
  res.send('Got a POST request');
});

// PUT method route (Update)
app.put('/api/users/:id', (req, res) => {
  res.send(\`Update user with ID \${req.params.id}\`);
});

// DELETE method route
app.delete('/api/users/:id', (req, res) => {
  res.send(\`Deleted user \${req.params.id}\`);
});
\`\`\`

## Extracting Data from Requests

Express makes it extremely easy to extract data sent by the client.

### 1. Route Parameters (req.params)
Used for capturing values specified at their position in the URL. Ideal for identifying specific resources.

\`\`\`javascript
// URL: /users/34/books/8989
app.get('/users/:userId/books/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  res.send(\`User \${userId} requested book \${bookId}\`);
});
\`\`\`

### 2. Query Parameters (req.query)
Used for capturing key-value pairs in the URL string, usually for filtering, sorting, or pagination.

\`\`\`javascript
// URL: /search?keyword=node&sort=asc
app.get('/search', (req, res) => {
  const keyword = req.query.keyword;
  const sort = req.query.sort;
  res.send(\`Searching for '\${keyword}' sorting by '\${sort}'\`);
});
\`\`\`

### 3. Request Body (req.body)
Used to capture payload data sent in POST, PUT, or PATCH requests. **Important:** By default, Express cannot read JSON bodies. You must use a built-in middleware.

\`\`\`javascript
// Middleware to parse JSON bodies
app.use(express.json()); 

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === '123') {
    res.json({ success: true, token: 'abc-123' });
  } else {
    res.status(401).json({ success: false, message: 'Auth failed' });
  }
});
\`\`\`

## The express.Router()

As your application grows, defining all routes in \`app.js\` becomes unmanageable. \`express.Router\` allows you to create modular, mountable route handlers. Think of it as a "mini-application".

\`\`\`javascript
// --- routes/users.js ---
const express = require('express');
const router = express.Router();

// This route path will actually be /users/
router.get('/', (req, res) => {
  res.send('Get all users');
});

// This route path will actually be /users/:id
router.get('/:id', (req, res) => {
  res.send('Get user by ID');
});

module.exports = router;


// --- app.js ---
const express = require('express');
const app = express();
const userRoutes = require('./routes/users');

// Mount the router on the /users path
app.use('/users', userRoutes);

app.listen(3000);
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is Express.js?",
        answer: "Express.js is a fast, minimalist web framework for Node.js. It simplifies building web servers and APIs by providing robust routing, middleware support, and abstracting away the boilerplate of the core `http` module."
      },
      {
        question: "What is the difference between req.params, req.query, and req.body?",
        answer: "`req.params` captures dynamic segments of the route URL (e.g., `/users/:id`). `req.query` captures key-value pairs appended to the URL after a question mark (e.g., `?sort=asc`). `req.body` captures the payload sent in the request body, usually in POST or PUT requests."
      },
      {
        question: "Why do we need `express.json()`?",
        answer: "By default, Node and Express do not automatically parse incoming JSON payloads into JavaScript objects. `express.json()` is a built-in middleware that parses incoming requests with JSON payloads and makes the data available on `req.body`."
      },
      {
        question: "What is `express.Router` and why use it?",
        answer: "`express.Router` is a class used to create modular, mountable route handlers. It acts as a mini-application, allowing developers to split their routing logic across multiple files, keeping the main application file clean and maintainable."
      },
      {
        question: "How do you send a JSON response in Express?",
        answer: "By using the `res.json()` method. It automatically sets the appropriate 'Content-Type: application/json' header, stringifies the JavaScript object or array passed to it, and sends the response."
      }
    ],
    practicalTask: {
      scenario: "You need to create an Express server with a route that accepts a user ID in the URL and an 'action' in the query string.",
      task: "Create an Express app with a GET route on `/profile/:userId`. Extract the userId from params and 'action' from the query, and return them as JSON.",
      solutionCode: `const express = require('express');
const app = express();

app.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const { action } = req.query;
  
  res.json({
    requestedUserId: userId,
    requestedAction: action || 'view'
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));`
    }
  },
  {
    slug: "nodejs-express-middleware",
    title: "8. Middleware in Express.js",
    order: 8,
    content: `
# Middleware in Express.js

Middleware functions are the absolute core concept of Express.js. Essentially, an Express application is a series of middleware function calls. 

## What is Middleware?

Middleware functions are functions that have access to the **request object** (\`req\`), the **response object** (\`res\`), and the **next middleware function** in the application’s request-response cycle. 

The next middleware function is commonly denoted by a variable named \`next\`.

### What can Middleware do?
- Execute any code.
- Make changes to the request and the response objects (e.g., attaching user data to \`req\`).
- End the request-response cycle (e.g., sending an error response).
- Call the next middleware function in the stack by calling \`next()\`.

**Crucial Rule:** If the current middleware function does not end the request-response cycle, it **must** call \`next()\` to pass control to the next middleware function. Otherwise, the request will be left hanging, and the client will eventually time out.

## Types of Middleware

### 1. Application-Level Middleware
Bound to an instance of the \`express\` object by using \`app.use()\` or \`app.METHOD()\`. It executes for every single request that hits the application (or a specific path).

\`\`\`javascript
const express = require('express');
const app = express();

// Custom Logger Middleware
const loggerMiddleware = (req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Pass control to the next handler
};

// Use it for ALL routes
app.use(loggerMiddleware);

app.get('/', (req, res) => {
  res.send('Home');
});
\`\`\`

### 2. Router-Level Middleware
Works in the exact same way as application-level middleware, except it is bound to an instance of \`express.Router()\`.

\`\`\`javascript
const router = express.Router();

// Middleware specific to this router
router.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
\`\`\`

### 3. Route-Specific Middleware
You can pass middleware directly into specific routes. This is heavily used for authentication and validation.

\`\`\`javascript
// Middleware to check authentication
const requireAuth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'secret-token') {
    req.user = { id: 1, role: 'admin' }; // Attach data to req
    next(); // Authenticated, proceed to route
  } else {
    res.status(401).json({ error: 'Unauthorized' }); // Cycle ends here
  }
};

// Route uses the middleware
app.get('/dashboard', requireAuth, (req, res) => {
  // We can access req.user because the middleware attached it
  res.send(\`Welcome to the dashboard, user \${req.user.id}\`);
});
\`\`\`

### 4. Built-in Middleware
Express has several built-in middleware functions:
- \`express.json()\`: Parses incoming requests with JSON payloads.
- \`express.urlencoded()\`: Parses incoming requests with URL-encoded payloads.
- \`express.static()\`: Serves static assets such as HTML files, images, and CSS.

\`\`\`javascript
// Serve files from the 'public' directory
app.use(express.static('public'));
\`\`\`

### 5. Third-Party Middleware
You can install and use third-party middleware to add functionality to your app.
- **morgan**: HTTP request logger.
- **helmet**: Secures Express apps by setting various HTTP headers.
- **cors**: Enables Cross-Origin Resource Sharing.

\`\`\`javascript
const cors = require('cors');
const helmet = require('helmet');

app.use(helmet());
app.use(cors());
\`\`\`

## The Request-Response Cycle Stack
When a request comes in, it flows through the middleware stack in the exact order they are defined in your code.

\`\`\`javascript
app.use(middlewareOne); // Runs first
app.use(middlewareTwo); // Runs second

app.get('/route', middlewareThree, (req, res) => { // Runs third
  res.send('Done');
});
\`\`\`
    `,
    interviewQuestions: [
      {
        question: "What is middleware in Express.js?",
        answer: "Middleware is a function that has access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle. It can modify the req/res objects, end the cycle, or call `next()` to pass control."
      },
      {
        question: "What happens if a middleware function does not call `next()` or `res.send()`?",
        answer: "The request will hang. The server will not respond to the client, the client's browser will keep waiting, and eventually, the request will time out."
      },
      {
        question: "How can middleware communicate with the final route handler?",
        answer: "Middleware can attach custom properties or objects to the `req` object. For example, an authentication middleware can decode a token and attach the user profile to `req.user`. The final route handler can then access `req.user`."
      },
      {
        question: "What is the difference between `app.use('/users', middleware)` and `app.get('/users', middleware)`?",
        answer: "`app.use('/users', middleware)` applies the middleware to ANY HTTP method (GET, POST, PUT, etc.) that hits paths starting with `/users`. `app.get('/users', middleware)` applies the middleware strictly to GET requests matching exactly `/users`."
      },
      {
        question: "Can you name 3 common third-party middleware packages?",
        answer: "cors (for Cross-Origin Resource Sharing), morgan (for logging HTTP requests), and helmet (for securing HTTP headers)."
      }
    ],
    practicalTask: {
      scenario: "You need a route that is protected. Only users who send a header `x-api-key: 123` should be allowed in.",
      task: "Write an Express app with a custom middleware `checkApiKey`. Apply it to a `/secret` route. Return 403 if the key is wrong, or a success message if correct.",
      solutionCode: `const express = require('express');
const app = express();

const checkApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey === '123') {
    next(); // Key is valid, continue
  } else {
    res.status(403).json({ error: 'Forbidden: Invalid API Key' });
  }
};

app.get('/secret', checkApiKey, (req, res) => {
  res.json({ message: 'You have accessed the secret data!' });
});

app.listen(3000, () => console.log('Server running'));`
    }
  },
  {
    slug: "nodejs-error-handling",
    title: "9. Asynchronous Error Handling in Node.js",
    order: 9,
    content: `
# Asynchronous Error Handling in Node.js

Proper error handling is critical. In a Node.js web server, an unhandled exception or unhandled promise rejection can crash the entire Node process, taking down the server for all users simultaneously.

## Synchronous Error Handling
In synchronous code, you simply use \`try...catch\`.

\`\`\`javascript
app.get('/sync-route', (req, res) => {
  try {
    const data = JSON.parse('invalid-json'); // This throws an error
    res.send('Success');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});
\`\`\`

## Error Handling Middleware in Express
Express provides a special type of middleware for global error handling. It is defined with **four arguments** instead of three: \`(err, req, res, next)\`. You define this middleware at the very bottom of your middleware stack, after all routes.

\`\`\`javascript
const express = require('express');
const app = express();

// ... normal routes ...

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('ERROR ENCOUNTERED:', err.message);
  
  // Set status code, default to 500
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});
\`\`\`

To trigger this error handler from a standard synchronous route, you simply \`throw\` an error, or call \`next(err)\`.

## Asynchronous Error Handling (The Tricky Part)

If an error is thrown inside an asynchronous callback or an unresolved Promise, **Express cannot catch it automatically**.

\`\`\`javascript
// THIS WILL CRASH THE SERVER
app.get('/bad-async', async (req, res) => {
  // If this promise rejects, the error bypasses Express's try/catch
  // resulting in an "UnhandledPromiseRejection" which crashes Node
  const data = await fetchSomeDataThatFails(); 
  res.send(data);
});
\`\`\`

### Solution 1: Try/Catch with \`next(err)\`
You must wrap your async code in a try/catch block and pass the error to Express using \`next()\`.

\`\`\`javascript
app.get('/safe-async', async (req, res, next) => {
  try {
    const data = await fetchSomeDataThatFails();
    res.send(data);
  } catch (error) {
    // Pass the error to the global error handler
    next(error); 
  }
});
\`\`\`

### Solution 2: Async Wrapper Function (Best Practice)
Writing try/catch in every single route is tedious. We can create a wrapper function that automatically catches Promise rejections and passes them to \`next\`.

\`\`\`javascript
// The Wrapper Utility
const catchAsync = (fn) => {
  return (req, res, next) => {
    // Execute the async route. If it rejects, catch it and pass to next()
    fn(req, res, next).catch(err => next(err));
  };
};

// Using the wrapper
app.get('/clean-async', catchAsync(async (req, res) => {
  // No try/catch needed!
  const data = await fetchSomeDataThatFails(); // If this fails, catchAsync handles it
  res.send(data);
}));
\`\`\`
*(Note: As of Express 5.0, async functions returning rejected promises automatically call \`next(err)\`, but Express 4.x is still widely used and requires this wrapper).*

## Uncaught Exceptions and Unhandled Rejections
Even with Express error handlers, you should catch errors at the Node.js process level as a safety net.

\`\`\`javascript
// Catch synchronous errors outside Express
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1); 
});

// Catch asynchronous errors outside Express (e.g., DB connection failures)
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  // Ideally, close the server gracefully before exiting
  server.close(() => {
    process.exit(1);
  });
});
\`\`\`
It is best practice to restart the process (using a manager like PM2) after an uncaught exception, as the Node runtime may be in an unpredictable state.
    `,
    interviewQuestions: [
      {
        question: "How do you define an error-handling middleware in Express?",
        answer: "An error-handling middleware is defined just like regular middleware but with exactly four arguments: `(err, req, res, next)`. It must be placed at the very end of the middleware stack."
      },
      {
        question: "Why do asynchronous errors crash an Express app if not properly handled?",
        answer: "Express 4.x route handlers wrap synchronous code in a try/catch. However, if an asynchronous operation (like a Promise) throws an error later in the event loop, it escapes the Express try/catch block. This results in an UnhandledPromiseRejection, which crashes the Node.js process."
      },
      {
        question: "How do you pass an error to the Express global error handler?",
        answer: "By calling the `next()` function and passing the error object as an argument: `next(err)`. If you pass anything to `next()`, Express assumes it's an error and skips all remaining regular middleware, jumping straight to the error handlers."
      },
      {
        question: "What is the purpose of `process.on('unhandledRejection')`?",
        answer: "It acts as a global safety net to catch any Promise rejections that were not handled by a `.catch()` block anywhere in the Node application. It allows you to log the error and gracefully shut down the application."
      },
      {
        question: "What is an `asyncWrapper` or `catchAsync` function in Express?",
        answer: "It is a higher-order function that wraps an asynchronous route handler. It catches any Promise rejections from the route and automatically passes them to `next(err)`, eliminating the need to write `try/catch` blocks in every single route."
      }
    ],
    practicalTask: {
      scenario: "You want a global error handler that catches errors, but you also want a route that purposely throws an async error to test it.",
      task: "Write an Express app with an async route `/fail` that throws an error after 100ms. Use a `catchAsync` wrapper and a global error handler to catch it and return a 500 JSON response.",
      solutionCode: `const express = require('express');
const app = express();

const catchAsync = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Route that simulates an async failure
app.get('/fail', catchAsync(async (req, res) => {
  await new Promise((_, reject) => setTimeout(() => reject(new Error('Async DB Failure!')), 100));
}));

// Global Error Handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: true, message: err.message });
});

app.listen(3000, () => console.log('Server running'));`
    }
  },
  {
    slug: "nodejs-file-uploads",
    title: "10. File Uploads & Multipart Data in Node.js",
    order: 10,
    content: `
# File Uploads & Multipart Data in Node.js

Handling file uploads (images, PDFs, documents) is a very common requirement for web servers. However, standard JSON or URL-encoded middleware (\`express.json()\`) cannot handle files. Files are sent via a special content type called \`multipart/form-data\`.

To parse multipart data in Node.js, we rely on third-party packages. The most popular and robust choice for Express applications is **Multer**.

## What is Multer?
Multer is a Node.js middleware for handling \`multipart/form-data\`, which is primarily used for uploading files. It is written on top of \`busboy\` for maximum efficiency.

*(Note: Multer will not process any form which is not multipart).*

## Basic Multer Setup (Saving to Disk)

First, install it: \`npm install multer\`.

\`\`\`javascript
const express = require('express');
const multer  = require('multer');
const path = require('path');
const app = express();

// 1. Configure Storage
// diskStorage gives full control on storing files to disk
const storage = multer.diskStorage({
  // Define destination folder
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The 'uploads' folder must exist
  },
  // Define filename
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 2. Initialize Multer
const upload = multer({ storage: storage });

// 3. Create Upload Route
// upload.single('profilePic') expects a single file field named 'profilePic'
app.post('/upload-profile', upload.single('profilePic'), (req, res) => {
  // req.file contains information about the uploaded file
  // req.body contains any text fields sent in the multipart form
  
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.json({
    message: 'File uploaded successfully',
    fileInfo: req.file
  });
});

app.listen(3000, () => console.log('Upload server running'));
\`\`\`

## Handling Multiple Files

Multer provides different methods depending on how many files you expect.

\`\`\`javascript
// 1. Array of files with the same field name (max 5 files)
app.post('/upload-photos', upload.array('photos', 5), (req, res) => {
  // req.files is an array of file objects
  res.send(\`\${req.files.length} photos uploaded.\`);
});

// 2. Multiple files with different field names
const multiUpload = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
]);

app.post('/upload-profile-data', multiUpload, (req, res) => {
  // req.files is an object: { avatar: [...], gallery: [...] }
  res.send('Profile data uploaded');
});
\`\`\`

## Filtering Files and Setting Limits

For security, you should never blindly accept any file upload. Users might upload massive files (causing Denial of Service) or malicious executables. You must implement file size limits and file type filtering.

\`\`\`javascript
const safeUpload = multer({
  storage: multer.memoryStorage(), // Use memory instead of disk for immediate cloud upload
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit size to 2MB
  },
  fileFilter: function (req, file, cb) {
    // Check file mime type
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true); // Accept file
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false); // Reject file
    }
  }
});

app.post('/secure-upload', safeUpload.single('image'), (req, res) => {
  // If memoryStorage is used, the file buffer is available at req.file.buffer
  // We can now send this buffer directly to AWS S3 or Cloudinary
  res.send('Safe image uploaded to memory buffer.');
});

// Handle Multer errors (like file too large)
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading (e.g., limit exceeded)
    res.status(400).json({ error: err.message });
  } else if (err) {
    // An unknown error occurred (e.g., wrong file type from fileFilter)
    res.status(400).json({ error: err.message });
  }
});
\`\`\`

### Note on Memory Storage
Using \`multer.memoryStorage()\` keeps the uploaded file as a Buffer object in RAM. This is ideal if you are immediately forwarding the file to a cloud storage provider (like AWS S3). However, be careful: uploading very large files using memory storage can cause your server to run out of RAM and crash.
    `,
    interviewQuestions: [
      {
        question: "Why can't `express.json()` handle file uploads?",
        answer: "`express.json()` is designed to parse JSON text strings. File uploads are sent from the browser using a special binary format called `multipart/form-data`. Parsing this requires specialized middleware like Multer."
      },
      {
        question: "What is Multer?",
        answer: "Multer is a popular Node.js middleware for handling `multipart/form-data`. It parses incoming file uploads and attaches the file data to the `req.file` or `req.files` object, and text fields to `req.body`."
      },
      {
        question: "How do you prevent a user from uploading a 5GB file and crashing your server?",
        answer: "By configuring Multer's `limits` option. You can set `limits: { fileSize: <bytes> }`. If a user uploads a file exceeding this limit, Multer will abort the upload and throw an error, protecting the server."
      },
      {
        question: "What is the difference between `multer.diskStorage()` and `multer.memoryStorage()`?",
        answer: "`diskStorage` saves the uploaded file directly to the server's hard drive and populates `req.file.path`. `memoryStorage` keeps the file in RAM as a Buffer object (`req.file.buffer`), which is useful for passing the file directly to cloud storage without touching the local disk."
      },
      {
        question: "How do you restrict uploads to only image files?",
        answer: "You implement a `fileFilter` function in the Multer configuration. Inside the function, you inspect the `file.mimetype` (e.g., checking if it starts with 'image/'). If it matches, you call the callback with `true`; otherwise, you call it with an error."
      }
    ],
    practicalTask: {
      scenario: "You need an endpoint to receive PDF resumes, saving them to disk.",
      task: "Configure Multer disk storage to save files in the 'resumes' folder. The route should be POST `/upload-resume`, expecting a field named `resume`. Enforce a 5MB size limit.",
      solutionCode: `const express = require('express');
const multer = require('multer');

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'resumes/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

app.post('/upload-resume', upload.single('resume'), (req, res) => {
  if (!req.file) return res.status(400).send('No file');
  res.send('Resume uploaded successfully!');
});

// Mock listen
// app.listen(3000);`
    }
  }
];

appendTopics('nodejs', 'Node.js Enterprise Backend', 'The definitive guide.', topics);
