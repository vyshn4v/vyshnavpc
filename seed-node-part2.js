import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-callbacks",
    title: "6. Callbacks and Async Patterns",
    order: 6,
    content: "<h2>Understanding Callbacks</h2><p>Callbacks are functions passed as arguments to other functions to be executed later...</p>",
    interviewQuestions: [
      { question: "What is callback hell?", answer: "Heavily nested callbacks that make code difficult to read and maintain." },
      { question: "What is an error-first callback?", answer: "A Node.js convention where the first argument to a callback function is an error object, if any, and the second is the result." }
    ],
    practicalTask: {
      scenario: "Refactoring standard callback flow.",
      task: "Write an error-first callback for a hypothetical user fetch.",
      solutionCode: "function fetchUser(id, cb) { if(!id) return cb(new Error('No ID')); cb(null, {id}); }"
    }
  },
  {
    slug: "node-promises",
    title: "7. Promises & Async/Await",
    order: 7,
    content: "<h2>Modern Async JavaScript</h2><p>Promises represent the eventual completion of an asynchronous operation...</p>",
    interviewQuestions: [
      { question: "What states can a Promise be in?", answer: "Pending, Fulfilled, or Rejected." },
      { question: "How does async/await improve code?", answer: "It allows writing asynchronous code that looks synchronous, avoiding deep nesting." }
    ],
    practicalTask: {
      scenario: "Converting callbacks to Promises.",
      task: "Wrap a callback-based setTimeout in a Promise.",
      solutionCode: "const delay = (ms) => new Promise(res => setTimeout(res, ms));"
    }
  },
  {
    slug: "node-event-emitters",
    title: "8. Event Emitters",
    order: 8,
    content: "<h2>Custom Event Handling</h2><p>The events module provides EventEmitter, allowing objects to emit named events...</p>",
    interviewQuestions: [
      { question: "How does EventEmitter work?", answer: "It maintains a registry of event listeners and calls them synchronously when an event is emitted." },
      { question: "Is EventEmitter synchronous or asynchronous?", answer: "By default, listener functions are called synchronously in the order they were registered." }
    ],
    practicalTask: {
      scenario: "Building a custom logger.",
      task: "Create a class extending EventEmitter and emit a 'log' event.",
      solutionCode: "import { EventEmitter } from 'events';\nclass Logger extends EventEmitter {}\nconst log = new Logger();\nlog.on('log', msg => console.log(msg));\nlog.emit('log', 'Hello');"
    }
  },
  {
    slug: "node-streams",
    title: "9. Streams in Node.js",
    order: 9,
    content: "<h2>Processing Data in Chunks</h2><p>Streams are collections of data that might not be available all at once...</p>",
    interviewQuestions: [
      { question: "What are the 4 types of streams?", answer: "Readable, Writable, Duplex, and Transform." },
      { question: "Why use streams instead of buffering entire files?", answer: "Streams consume much less memory, allowing processing of massive files." }
    ],
    practicalTask: {
      scenario: "Piping data efficiently.",
      task: "Pipe a readable stream to a writable stream.",
      solutionCode: "import fs from 'fs';\nfs.createReadStream('in.txt').pipe(fs.createWriteStream('out.txt'));"
    }
  },
  {
    slug: "node-buffers",
    title: "10. Buffers & Binary Data",
    order: 10,
    content: "<h2>Handling Binary Data</h2><p>Buffers provide a way to work with binary data directly in memory...</p>",
    interviewQuestions: [
      { question: "What is a Buffer?", answer: "A globally available class in Node.js used to interact with octet streams directly." },
      { question: "Are Buffers resizable?", answer: "No, Buffers have a fixed size allocated upon creation." }
    ],
    practicalTask: {
      scenario: "Creating binary data.",
      task: "Create a Buffer from a string and convert it to base64.",
      solutionCode: "const buf = Buffer.from('hello');\nconsole.log(buf.toString('base64'));"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
