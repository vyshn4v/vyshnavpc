import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-child-processes",
    title: "16. Child Processes",
    order: 16,
    content: "<h2>Spawning Processes</h2><p>Node can run system commands using exec, spawn, and fork.</p>",
    interviewQuestions: [
      { question: "Difference between spawn and exec?", answer: "exec buffers the output completely before returning, spawn streams the output." },
      { question: "When to use fork()?", answer: "To spawn a new Node.js process and establish an IPC communication channel." }
    ],
    practicalTask: {
      scenario: "Run a system command.",
      task: "Use exec to run 'ls' or 'dir' and print the output.",
      solutionCode: "import { exec } from 'child_process';\nexec('dir', (err, stdout) => console.log(stdout));"
    }
  },
  {
    slug: "node-worker-threads",
    title: "17. Worker Threads",
    order: 17,
    content: "<h2>True Parallelism</h2><p>Worker threads enable the execution of JavaScript in parallel, useful for CPU-intensive tasks.</p>",
    interviewQuestions: [
      { question: "Do Worker Threads share memory?", answer: "No, they have independent V8 engines, but they can share memory via SharedArrayBuffer." },
      { question: "When should you NOT use Worker Threads?", answer: "For I/O intensive tasks. Node's async event loop handles I/O much more efficiently." }
    ],
    practicalTask: {
      scenario: "Create a simple worker.",
      task: "Instantiate a Worker and pass data to it.",
      solutionCode: "import { Worker } from 'worker_threads';\nconst w = new Worker('./worker.js', { workerData: { n: 10 } });"
    }
  },
  {
    slug: "node-cluster-module",
    title: "18. Cluster Module",
    order: 18,
    content: "<h2>Scaling the Event Loop</h2><p>Cluster allows you to create child processes that share the same server ports.</p>",
    interviewQuestions: [
      { question: "How does Cluster work under the hood?", answer: "It forks the master process, and the master routes incoming connections to workers using round-robin." },
      { question: "Does Cluster guarantee session persistence?", answer: "No, consecutive requests from a client might hit different workers." }
    ],
    practicalTask: {
      scenario: "Setting up a cluster.",
      task: "Fork a worker for every CPU core.",
      solutionCode: "import cluster from 'cluster';\nimport os from 'os';\nif (cluster.isPrimary) {\n  os.cpus().forEach(() => cluster.fork());\n}"
    }
  },
  {
    slug: "node-error-handling",
    title: "19. Error Handling Strategies",
    order: 19,
    content: "<h2>Robust Failures</h2><p>Properly catching and handling asynchronous errors, unhandled rejections, and fatal exceptions.</p>",
    interviewQuestions: [
      { question: "What happens on unhandledRejection?", answer: "In modern Node versions, it crashes the process by default." },
      { question: "How do you catch an uncaught exception globally?", answer: "process.on('uncaughtException', handler)" }
    ],
    practicalTask: {
      scenario: "Graceful shutdown on error.",
      task: "Listen to uncaught exceptions and exit cleanly.",
      solutionCode: "process.on('uncaughtException', (err) => {\n  console.error(err);\n  process.exit(1);\n});"
    }
  },
  {
    slug: "node-debugging",
    title: "20. Debugging Node.js",
    order: 20,
    content: "<h2>Using the Inspector</h2><p>Node provides an inspector protocol allowing integration with Chrome DevTools or VSCode.</p>",
    interviewQuestions: [
      { question: "How do you start Node in debug mode?", answer: "By running 'node --inspect app.js'." },
      { question: "What does --inspect-brk do?", answer: "It starts the debugger and pauses execution at the very first line of the script." }
    ],
    practicalTask: {
      scenario: "Setting a programmatic breakpoint.",
      task: "Use the built-in debugger keyword.",
      solutionCode: "function calc() {\n  debugger;\n  return 2 + 2;\n}"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
