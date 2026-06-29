import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "node-fs-module",
    title: "11. File System (fs) Module",
    order: 11,
    content: "<h2>Interacting with the File System</h2><p>The fs module allows reading, writing, and manipulating files and directories.</p>",
    interviewQuestions: [
      { question: "Should you use fs.readFile or fs.createReadStream?", answer: "For small files, readFile is fine. For large files, use createReadStream to avoid memory issues." },
      { question: "What is fs.promises?", answer: "An API providing Promise-based versions of the fs methods." }
    ],
    practicalTask: {
      scenario: "Reading a config file.",
      task: "Read a JSON file using fs.promises.",
      solutionCode: "import fs from 'fs/promises';\nconst data = await fs.readFile('config.json', 'utf8');"
    }
  },
  {
    slug: "node-path-os",
    title: "12. Path & OS Modules",
    order: 12,
    content: "<h2>System Utilities</h2><p>Path helps normalize paths across OS environments. OS module gives system diagnostics.</p>",
    interviewQuestions: [
      { question: "Why use path.join() instead of string concatenation?", answer: "It automatically handles the correct path separator for the host OS." },
      { question: "How to get system memory info?", answer: "Using os.totalmem() and os.freemem()." }
    ],
    practicalTask: {
      scenario: "Generating an absolute path.",
      task: "Use path to resolve an absolute path to a file in the current directory.",
      solutionCode: "import path from 'path';\nconst p = path.resolve('file.txt');"
    }
  },
  {
    slug: "node-http-api",
    title: "13. Building HTTP APIs Natively",
    order: 13,
    content: "<h2>Raw Node.js Web APIs</h2><p>You can build REST APIs purely using Node's core http module, manually setting headers and status codes.</p>",
    interviewQuestions: [
      { question: "How do you set a status code in http response?", answer: "By setting res.statusCode = 200 or using res.writeHead(200)." },
      { question: "How is the request body read?", answer: "By listening to 'data' and 'end' events on the incoming request stream." }
    ],
    practicalTask: {
      scenario: "Returning JSON data natively.",
      task: "Write a server that returns a JSON object.",
      solutionCode: "res.writeHead(200, {'Content-Type': 'application/json'});\nres.end(JSON.stringify({ok: true}));"
    }
  },
  {
    slug: "node-advanced-routing",
    title: "14. Advanced Routing Natively",
    order: 14,
    content: "<h2>Routing without Express</h2><p>Switch statements or dictionary lookups against req.url and req.method manage routing.</p>",
    interviewQuestions: [
      { question: "What is req.url?", answer: "The URL string requested by the client, excluding the domain." },
      { question: "How to parse query strings natively?", answer: "Using the built-in 'url' and 'querystring' modules, or the modern URL class." }
    ],
    practicalTask: {
      scenario: "Parse query parameters from a URL.",
      task: "Extract the 'id' parameter from a URL string using the URL class.",
      solutionCode: "const u = new URL('http://loc/path?id=5');\nconsole.log(u.searchParams.get('id'));"
    }
  },
  {
    slug: "node-external-requests",
    title: "15. External HTTP Requests",
    order: 15,
    content: "<h2>Fetching External Data</h2><p>Node 18+ includes the global fetch API natively. Previously, http.request or libraries like Axios were used.</p>",
    interviewQuestions: [
      { question: "How does native fetch in Node differ from browser fetch?", answer: "It is largely identical, adhering to the standard Web API." },
      { question: "What was used before fetch in Node core?", answer: "The http.request() and https.request() functions." }
    ],
    practicalTask: {
      scenario: "Call an external API.",
      task: "Use global fetch to get data from an endpoint and parse JSON.",
      solutionCode: "const res = await fetch('https://api.github.com');\nconst data = await res.json();"
    }
  }
];

appendTopics("nodejs", "Node.js Enterprise Backend", "The definitive guide.", topics);
