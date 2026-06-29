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
  title: "Node.js Enterprise Architecture",
  description: "Advanced deep dive into the V8 Engine, Event Loop, Memory Management, and Microservices.",
  topics: [
    {
      slug: "v8-and-libuv",
      title: "1. V8 Engine & libuv",
      order: 1,
      content: `
        <h2>The V8 Engine & libuv</h2>
        <p>Node.js is not a language; it is a runtime environment that allows JavaScript to be executed on the server. At its core, Node.js is composed of two major dependencies: <strong>V8</strong> and <strong>libuv</strong>.</p>
        
        <h3>The V8 Engine</h3>
        <p>Developed by Google, V8 is the engine that compiles your JavaScript code into native machine code (x86, ARM) just-in-time (JIT). V8 handles JavaScript execution, object allocation, and garbage collection.</p>

        <h3>libuv (The Magic of Async)</h3>
        <p>JavaScript is strictly single-threaded. So how does Node.js handle thousands of concurrent requests? The secret is <code>libuv</code>, a multi-platform C library that provides support for asynchronous I/O based on event loops.</p>
        <p>When you call <code>fs.readFile()</code>, V8 doesn't do the reading. It passes the task to <code>libuv</code>. If the task is OS-level (like networking), <code>libuv</code> delegates it to the OS kernel. If it's heavy computing (like hashing or DNS lookups), <code>libuv</code> executes it on a hidden Thread Pool (default 4 threads).</p>
      `
    },
    {
      slug: "event-loop-deep-dive",
      title: "2. Event Loop Deep Dive",
      order: 2,
      content: `
        <h2>The Event Loop: Micro vs Macro Tasks</h2>
        <p>The Event Loop is the mechanism that takes callbacks from the task queues and pushes them onto the Call Stack when the stack is empty.</p>
        
        <h3>The Phases</h3>
        <ol>
          <li><strong>Timers:</strong> Executes <code>setTimeout</code> and <code>setInterval</code>.</li>
          <li><strong>Pending Callbacks:</strong> Executes I/O callbacks deferred to the next loop iteration.</li>
          <li><strong>Idle, Prepare:</strong> Only used internally.</li>
          <li><strong>Poll:</strong> Retrieve new I/O events. This is where Node.js blocks and waits for requests if there is nothing else to do.</li>
          <li><strong>Check:</strong> <code>setImmediate()</code> callbacks are invoked here.</li>
          <li><strong>Close Callbacks:</strong> e.g., <code>socket.on('close', ...)</code>.</li>
        </ol>

        <h3>Microtasks vs Macrotasks</h3>
        <p>Microtasks (Promises, <code>process.nextTick</code>) have absolute priority. After EVERY phase, the Event Loop completely empties the Microtask Queue before moving to the next phase.</p>
        <pre><code class="language-javascript">
setTimeout(() => console.log('1. setTimeout (Macrotask)'), 0);
setImmediate(() => console.log('2. setImmediate (Check Phase)'));
Promise.resolve().then(() => console.log('3. Promise (Microtask)'));
process.nextTick(() => console.log('4. nextTick (Highest Priority Microtask)'));

// Output:
// 4. nextTick
// 3. Promise
// 1. setTimeout
// 2. setImmediate
        </code></pre>
      `
    },
    {
      slug: "event-emitters",
      title: "3. Event Emitters",
      order: 3,
      content: `
        <h2>Event Emitters</h2>
        <p>Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture. The <code>EventEmitter</code> class is at the heart of this pattern.</p>
        
        <h3>Creating a Custom Emitter</h3>
        <pre><code class="language-javascript">
const EventEmitter = require('events');

class PaymentProcessor extends EventEmitter {
  processPayment(amount) {
    console.log(\`Processing payment for $\${amount}...\`);
    setTimeout(() => {
      // Emit an event when payment completes
      this.emit('paymentSuccess', { amount, txId: 'ABC-123' });
    }, 1000);
  }
}

const processor = new PaymentProcessor();

// Listen for the event
processor.on('paymentSuccess', (data) => {
  console.log(\`Receipt: Processed $\${data.amount} (TX: \${data.txId})\`);
});

processor.processPayment(500);
        </code></pre>
      `
    },
    {
      slug: "buffers-and-streams",
      title: "4. Buffers & Streams",
      order: 4,
      content: `
        <h2>Buffers & Streams</h2>
        <p>If you try to read a 5GB video file using <code>fs.readFile</code>, Node.js will crash with an "Out of Memory" error. Why? Because it tries to load all 5GB into RAM at once. The solution is Streams.</p>

        <h3>What are Buffers?</h3>
        <p>A Buffer is a chunk of memory allocated outside of the V8 heap, used to temporarily store binary data while it is being moved from one place to another.</p>

        <h3>Piping Streams</h3>
        <p>Streams allow you to read data in chunks and process it immediately. The most powerful way to use streams is by "piping" a Readable stream directly into a Writable stream.</p>
        <pre><code class="language-javascript">
const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  // We stream the file directly to the HTTP response!
  const readableStream = fs.createReadStream('./massive-video.mp4');
  
  // Set proper headers
  res.writeHead(200, { 'Content-Type': 'video/mp4' });
  
  // Pipe it!
  readableStream.pipe(res);
  
  readableStream.on('error', (err) => {
    res.end('Error reading file');
  });
});
        </code></pre>
      `
    },
    {
      slug: "multithreading",
      title: "5. Multithreading (Worker Threads)",
      order: 5,
      content: `
        <h2>Multithreading with Worker Threads</h2>
        <p>Node.js is great for I/O intensive tasks (databases, networking), but it fails terribly at CPU intensive tasks (image processing, video encoding, cryptography) because long synchronous code blocks the Event Loop.</p>
        
        <p>To solve this, Node.js introduced <code>worker_threads</code>. They allow you to execute JavaScript in parallel across multiple OS threads.</p>

        <pre><code class="language-javascript">
// main.js
const { Worker } = require('worker_threads');

function runHeavyMath(workerData) {
  return new Promise((resolve, reject) => {
    // Spin up a new V8 instance on a new thread!
    const worker = new Worker('./math-worker.js', { workerData });
    
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(\`Worker stopped with exit code \${code}\`));
    });
  });
}

// math-worker.js
const { parentPort, workerData } = require('worker_threads');

// This heavy loop won't block the main Node server!
let result = 0;
for (let i = 0; i < workerData.iterations; i++) {
  result += Math.sqrt(i);
}

// Send result back to main thread
parentPort.postMessage(result);
        </code></pre>
      `
    },
    {
      slug: "child-processes",
      title: "6. Child Processes",
      order: 6,
      content: `
        <h2>Child Processes</h2>
        <p>Sometimes you need to run bash commands, execute Python scripts, or run entirely different binaries from within Node.js. You use the <code>child_process</code> module for this.</p>

        <h3>Spawn vs Exec</h3>
        <ul>
          <li><code>exec</code>: Buffers the output of the command and passes it to a callback. Good for quick, small commands like <code>ls</code>.</li>
          <li><code>spawn</code>: Returns a Stream. Good for heavy commands that return massive amounts of data or run continuously (like video transcoding).</li>
        </ul>

        <pre><code class="language-javascript">
const { spawn } = require('child_process');

// Run a bash command to find all files in a directory
const child = spawn('find', ['.', '-type', 'f']);

child.stdout.on('data', (data) => {
  console.log(\`Found file: \${data}\`);
});

child.stderr.on('data', (data) => {
  console.error(\`Error: \${data}\`);
});

child.on('close', (code) => {
  console.log(\`Child process exited with code \${code}\`);
});
        </code></pre>
      `
    },
    {
      slug: "memory-leaks",
      title: "7. Profiling & Memory Leaks",
      order: 7,
      content: `
        <h2>Profiling & Memory Leaks</h2>
        <p>A memory leak in Node.js occurs when objects are no longer needed but are still referenced by something, preventing the Garbage Collector (GC) from deleting them. Over time, RAM usage balloons until the server crashes with a FATAL ERROR.</p>

        <h3>Common Causes of Memory Leaks</h3>
        <ol>
          <li><strong>Global Variables:</strong> Data stored in massive arrays in the global scope never gets garbage collected.</li>
          <li><strong>Closures:</strong> Functions that maintain references to massive objects in their outer scope.</li>
          <li><strong>Timers & Event Listeners:</strong> Calling <code>setInterval</code> or <code>emitter.on()</code> without ever clearing or removing them.</li>
        </ol>

        <h3>Debugging Memory Leaks</h3>
        <p>You can use the Chrome DevTools Inspector to take Heap Snapshots of your Node.js application.</p>
        <pre><code class="language-bash">
# Start Node.js with the inspector enabled
node --inspect index.js
        </code></pre>
        <p>Open Chrome and navigate to <code>chrome://inspect</code>. You can click "Take Heap Snapshot" to see exactly which objects are hogging your RAM.</p>
      `
    },
    {
      slug: "cluster-scaling",
      title: "8. Cluster Scaling",
      order: 8,
      content: `
        <h2>Cluster Scaling (PM2)</h2>
        <p>Since Node.js runs on a single thread, a 32-core server running a standard Node application will only utilize 1 core, wasting 31 cores.</p>
        <p>The <code>cluster</code> module allows you to easily create child processes that all share the exact same server port. If you have 8 CPU cores, you can launch 8 Node.js instances listening on Port 3000!</p>

        <h3>Using PM2</h3>
        <p>While you can write cluster logic manually, the industry standard is to use PM2, a production process manager.</p>
        <pre><code class="language-bash">
# Install PM2 globally
npm install -g pm2

# Launch the app with maximum instances (based on CPU cores)
pm2 start app.js -i max

# Monitor the cluster in a real-time terminal dashboard
pm2 monit
        </code></pre>
        <p>If a worker crashes, PM2 automatically restarts it, ensuring 0 seconds of downtime.</p>
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
  console.log("✅ Comprehensive Node.js docs seeded successfully!");
  process.exit(0);
};

run();
