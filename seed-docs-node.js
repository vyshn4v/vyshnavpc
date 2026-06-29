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
    console.log("Connected to MongoDB for Seeding Node.js.");
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

const nodeDoc = {
  technology: "nodejs",
  title: "Node.js Masterclass",
  description: "Deep dive into Event Loop, Streams, File System, and Clustering.",
  topics: [
    {
      slug: "event-loop",
      title: "1. The Event Loop",
      order: 1,
      content: `
        <h2>The Node.js Event Loop</h2>
        <p>Node.js is an asynchronous event-driven JavaScript runtime. It operates on a single thread using non-blocking I/O calls, allowing it to support tens of thousands of concurrent connections.</p>
        <h3>Phases of the Event Loop</h3>
        <ul>
          <li><strong>Timers:</strong> Executes callbacks scheduled by <code>setTimeout()</code> and <code>setInterval()</code>.</li>
          <li><strong>Pending Callbacks:</strong> Executes I/O callbacks deferred to the next loop iteration.</li>
          <li><strong>Poll:</strong> Retrieves new I/O events; execute I/O related callbacks.</li>
          <li><strong>Check:</strong> <code>setImmediate()</code> callbacks are invoked here.</li>
        </ul>
        <pre><code class="language-javascript">
const fs = require('fs');

console.log('1. Script start');

setTimeout(() => console.log('5. setTimeout callback'), 0);
setImmediate(() => console.log('6. setImmediate callback'));

fs.readFile(__filename, () => {
  console.log('7. File Read IO callback');
  setTimeout(() => console.log('9. setTimeout inside IO'), 0);
  setImmediate(() => console.log('8. setImmediate inside IO'));
});

Promise.resolve().then(() => console.log('4. Promise microtask'));
process.nextTick(() => console.log('3. process.nextTick'));

console.log('2. Script end');
        </code></pre>
      `
    },
    {
      slug: "streams-and-buffers",
      title: "2. Streams & Buffers",
      order: 2,
      content: `
        <h2>Streams & Buffers</h2>
        <p>Streams are a way to handle reading/writing files, network communications, or any kind of end-to-end information exchange efficiently.</p>
        <p>Instead of reading a whole file into memory at once, streams read chunks of data piece by piece, processing its content without keeping it all in memory.</p>
        <pre><code class="language-javascript">
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  // Bad: Reads entire file into memory
  // fs.readFile(__dirname + '/large-video.mp4', (err, data) => res.end(data));

  // Good: Streams file in chunks
  const readStream = fs.createReadStream(__dirname + '/large-video.mp4');
  readStream.pipe(res);
});

server.listen(3000);
        </code></pre>
      `
    },
    {
      slug: "clustering",
      title: "3. Clustering & Scaling",
      order: 3,
      content: `
        <h2>Clustering & Scaling</h2>
        <p>A single instance of Node.js runs in a single thread. To take advantage of multi-core systems, you should launch a cluster of Node.js processes to handle the load.</p>
        <pre><code class="language-javascript">
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(\`Master \${process.pid} is running\`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(\`worker \${worker.process.pid} died, restarting...\`);
    cluster.fork(); // Auto-restart workers
  });
} else {
  // Workers can share any TCP connection
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Hello from worker ' + process.pid);
  }).listen(8000);
  
  console.log(\`Worker \${process.pid} started\`);
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
    { technology: nodeDoc.technology },
    nodeDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Node.js docs seeded successfully!");
  process.exit(0);
};

run();
