import { replaceDocs } from "./seeder-utils.js";

const topics = [
  {
    slug: "welcome-to-development",
    title: "1. Welcome to Development",
    order: 1,
    content: `
# Welcome to Development

This guide is designed to take you from beginner to confident developer step by step.

## Why this guide exists

- **Start simple.** You do not need to understand everything at once.
- **Build practical skills.** Each chapter shows a real idea you can use immediately.
- **Prepare for interviews.** Every topic adds questions from junior to senior level.

## How to read this guide

1. Read the explanation slowly.
2. Try the examples in a real editor.
3. Answer the interview questions in your own words.
4. Solve the practical task to build your confidence.
`,
    interviewQuestions: [
      {
        question: "What is the difference between a beginner and a professional developer?",
        answer: `A beginner learns by copying examples and discovering how code works. A professional thinks about problems, writes clean code, and uses tools like version control. A professional also learns to break big ideas into small tasks and to fix mistakes quickly.`
      },
      {
        question: "Why is it helpful to practice building small projects?",
        answer: `Small projects help you put concepts into action. They make abstract ideas concrete, show how different parts of code work together, and prepare you for real work. Every small project you finish makes larger projects easier later.`
      },
      {
        question: "What habits make a developer ready for senior-level work?",
        answer: `Good habits include writing clear code, testing changes, learning how systems behave under load, asking good questions, and thinking about maintainability. Senior developers also mentor others, choose the right tools, and make decisions based on what the team needs.`
      }
    ],
    practicalTask: {
      scenario: "You want to keep a learning notebook about what you built today.",
      task: "Create a simple Node script that writes a short lesson summary into a local file named lesson-notes.txt.",
      solutionCode: `import fs from "fs";

const note = "Today I learned how to structure beginner-friendly documentation and add interview questions.";

fs.writeFileSync("lesson-notes.txt", note + "\n");
console.log("Saved lesson-notes.txt");`
    }
  },
  {
    slug: "javascript-fundamentals",
    title: "2. JavaScript Fundamentals",
    order: 2,
    content: `
# JavaScript Fundamentals

JavaScript is the language that runs both in the browser and on servers. It is the foundation of modern web development.

## Variables and values

- **let**: a changing value.
- **const**: a value that does not change.
- **var**: older style, avoid it for new code.


documentation: `,
    interviewQuestions: [
      {
        question: "What is the difference between let and const?",
        answer: `
- **let** can be changed after it is created.
- **const** cannot be reassigned.

Use const when the value should stay the same; use let when it will change.
`
      },
      {
        question: "How does JavaScript treat strings, numbers, and booleans?",
        answer: `
JavaScript has basic types like string, number, and boolean. Strings are text, numbers are numeric values, and booleans are true or false. JavaScript can also convert between types, so you need to be careful when combining them.
`
      },
      {
        question: "What is an object in JavaScript and why is it useful?",
        answer: `
An object is a collection of key/value pairs. It helps you group related data and behavior together. For example, a user object can store name, email, and role in one place.
`
      }
    ],
    practicalTask: {
      scenario: "You are building a registration form and need to store user details.",
      task: "Create a JavaScript object for a user with name, age, and email, then print the user's name and email to the console.",
      solutionCode: `const user = {
  name: "Aisha",
  age: 22,
  email: "aisha@example.com"
};

console.log("Name:", user.name);
console.log("Email:", user.email);`
    }
  },
  {
    slug: "nodejs-basics",
    title: "3. Node.js Basics",
    order: 3,
    content: `
# Node.js Basics

Node.js lets you run JavaScript on your computer, not just inside the browser.

## What Node does

- Runs JavaScript outside the browser.
- Lets you read and write files.
- Lets you create servers that accept requests from users.

## Simple hello world server

\\ Example:
import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js\n");
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

`,
    interviewQuestions: [
      {
        question: "What is Node.js used for?",
        answer: `
Node.js is used to run JavaScript on the server. It is great for building web servers, APIs, command-line tools, and real-time applications.
`
      },
      {
        question: "How do you run a Node.js file?",
        answer: `
Use the command: \`node file.js\`. This tells Node to execute the code inside the file.
`
      },
      {
        question: "What is npm and why do developers use it?",
        answer: `
npm is the package manager for Node.js. It installs reusable code packages, helps manage dependencies, and makes it easy to share code with others.
`
      }
    ],
    practicalTask: {
      scenario: "You want to see how HTTP requests work with Node.js.",
      task: "Create a basic HTTP server in Node that returns 'Hello Developer' for any request.",
      solutionCode: `import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello Developer\n");
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});`
    }
  },
  {
    slug: "modules-and-npm",
    title: "4. Modules and npm",
    order: 4,
    content: `
# Modules and npm

A module is a file that contains code. Node.js lets you split code into smaller pieces using modules.

## Exporting and importing

- Use **export** to share values.
- Use **import** to use values from another file.

Simple example:

\\ math.js
export function add(a, b) {
  return a + b;
}

\\ app.js
import { add } from "./math.js";
console.log(add(2, 3));

## npm packages

Install reusable packages with \`npm install package-name\`.
`,
    interviewQuestions: [
      {
        question: "What is the difference between local and global npm packages?",
        answer: `
Local packages are installed in the project folder and are used by that project only. Global packages are installed on your computer and can be used from the command line everywhere.
`
      },
      {
        question: "Why should you use modules instead of one big file?",
        answer: `
Modules keep code organized, easier to read, and easier to maintain. They also make it simpler to reuse code and fix bugs.
`
      },
      {
        question: "What is package.json used for?",
        answer: `
package.json stores project settings, dependencies, scripts, and metadata. It tells npm what the project needs and how to run common commands.
`
      }
    ],
    practicalTask: {
      scenario: "You want to split your code into reusable pieces.",
      task: "Create one file that exports a function and another file that imports and uses it.",
      solutionCode: `// math.js
export function multiply(x, y) {
  return x * y;
}

// app.js
import { multiply } from "./math.js";
console.log(multiply(4, 5));`
    }
  },
  {
    slug: "async-and-event-loop",
    title: "5. Async and the Event Loop",
    order: 5,
    content: `
# Async and the Event Loop

JavaScript does one thing at a time, but Node can do many things at once using asynchronous code.

## Callbacks, promises, and async/await

- **Callback**: a function passed into another function to run later.
- **Promise**: an object representing a future result.
- **async/await**: a cleaner way to write promise-based code.

Example with async/await:

\\ example.js
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log("Start");
  await wait(1000);
  console.log("One second later");
}

run();
`,
    interviewQuestions: [
      {
        question: "What is the event loop in Node.js?",
        answer: `
The event loop is the mechanism that lets Node handle asynchronous tasks. It watches for events and runs callbacks when work finishes, allowing Node to continue working without waiting.
`
      },
      {
        question: "What does async/await do?",
        answer: `
async/await makes asynchronous code look like normal code. \`async\` marks a function that returns a promise, and \`await\` waits for that promise before moving on.
`
      },
      {
        question: "How do you handle an error in a promise?",
        answer: `
Use \`.catch()\` after the promise, or wrap \`await\` calls in a \`try/catch\` block to catch errors cleanly.
`
      }
    ],
    practicalTask: {
      scenario: "You need to wait for a simulated network call before continuing.",
      task: "Write an async function that waits 2 seconds and then logs 'Done waiting' to the console.",
      solutionCode: `const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  console.log("Waiting...");
  await wait(2000);
  console.log("Done waiting");
}

main();`
    }
  },
  {
    slug: "building-http-apis",
    title: "6. Building HTTP APIs",
    order: 6,
    content: `
# Building HTTP APIs

A web API lets other programs talk to your application over the internet.

## REST API basics

A REST API uses simple paths and methods like GET, POST, PUT, and DELETE.

Example with Node's http module:

\\ server.js
import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/hello") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello API" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(3000);
`,
    interviewQuestions: [
      {
        question: "What is an HTTP request?",
        answer: `
An HTTP request is a message sent by a client to a server asking for a web resource or action. It includes a method, a path, headers, and sometimes data.
`
      },
      {
        question: "What does REST stand for?",
        answer: `
REST stands for Representational State Transfer. It is a design style for web APIs using simple URLs and standard HTTP methods.
`
      },
      {
        question: "How do you send JSON from a Node API?",
        answer: `
Set \`Content-Type\` to \`application/json\` and send a JSON string using \`JSON.stringify()\`.
`
      }
    ],
    practicalTask: {
      scenario: "You must serve a JSON message to callers of your API.",
      task: "Create a Node HTTP server that responds with JSON at the path /api/message and returns 404 elsewhere.",
      solutionCode: `import http from "http";

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/api/message") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello from API" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => console.log("API listening on port 3000"));`
    }
  },
  {
    slug: "data-and-persistence",
    title: "7. Data and Persistence",
    order: 7,
    content: `
# Data and Persistence

Most apps need to save information that stays available after the program stops. This is called persistence.

## Simple file storage

Node can save data in a file using the file system.

Example:

\\ data.js
import fs from "fs";

const content = JSON.stringify({ name: "Sam", score: 100 });
fs.writeFileSync("data.json", content);
`,
    interviewQuestions: [
      {
        question: "What is persistence in software?",
        answer: `
Persistence means saving data so it still exists after the program stops running. Files, databases, and cloud storage are all persistence tools.
`
      },
      {
        question: "Why use a database instead of a file?",
        answer: `
Databases are better for many users, searching data, and keeping data safe when multiple parts of the app use it at once. Files are simpler but harder to manage in large systems.
`
      },
      {
        question: "What is a JSON file used for?",
        answer: `
A JSON file stores data in a text format that is easy to read and use in JavaScript. It is often used for simple configuration or small datasets.
`
      }
    ],
    practicalTask: {
      scenario: "You want to capture user settings in a file.",
      task: "Write a Node script that saves a settings object to settings.json and then reads it back.",
      solutionCode: `import fs from "fs";

const settings = { theme: "dark", notifications: true };
fs.writeFileSync("settings.json", JSON.stringify(settings, null, 2));

const stored = fs.readFileSync("settings.json", "utf-8");
console.log(JSON.parse(stored));`
    }
  },
  {
    slug: "security-and-deployment",
    title: "8. Security and Deployment",
    order: 8,
    content: `
# Security and Deployment

Security keeps your users safe. Deployment puts your app on the internet where other people can use it.

## Basic security rules

- Do not store secrets in code.
- Validate user input to avoid bad data.
- Use HTTPS for secure communication.

## Quick deployment ideas

- Use a platform like Vercel, Netlify, or Heroku for simple apps.
- For Node apps, use a service that supports a server or container.
`,
    interviewQuestions: [
      {
        question: "What is an environment variable?",
        answer: `
An environment variable is a value kept outside the code, often used for secrets, API keys, and settings. This makes the code safer and easier to configure.
`
      },
      {
        question: "Why should you never hardcode passwords in your code?",
        answer: `
Hardcoded passwords can be leaked if the code is shared. Using secrets keeps credentials private and can be changed without editing code.
`
      },
      {
        question: "What does HTTPS do?",
        answer: `
HTTPS encrypts the data sent between a browser and a server so attackers cannot read or change it.
`
      }
    ],
    practicalTask: {
      scenario: "You need to use a secret value without writing it in your code.",
      task: "Write a Node script that reads a value from an environment variable and prints it. Add a note that the value should not be stored directly in the file.",
      solutionCode: `const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("Missing API_KEY environment variable.");
  process.exit(1);
}
console.log("API key loaded successfully.");`
    }
  },
  {
    slug: "testing-and-debugging",
    title: "9. Testing and Debugging",
    order: 9,
    content: `
# Testing and Debugging

Testing helps you find bugs before users do. Debugging helps you understand what is wrong when code breaks.

## Simple testing ideas

Start with the code you write. Check that functions return the right values and that error paths are handled.

## Debugging with console logs

Add \`console.log\` statements to see variables and program flow. Then remove them when the bug is fixed.
`,
    interviewQuestions: [
      {
        question: "Why is testing important?",
        answer: `
Testing makes code more reliable. It helps you catch mistakes early, makes it safer to change code later, and gives confidence in your work.
`
      },
      {
        question: "What is a debugger and when do you use it?",
        answer: `
A debugger lets you pause code, inspect variables, and step through execution. Use it when console logs are not enough to understand a problem.
`
      },
      {
        question: "What is the difference between unit tests and integration tests?",
        answer: `
Unit tests check one small part of code in isolation. Integration tests check how multiple pieces work together.
`
      }
    ],
    practicalTask: {
      scenario: "You want to confirm a function returns the correct value.",
      task: "Write a function that adds two numbers and then log the result of calling it with sample input. Add an extra case that shows what happens if one value is missing.",
      solutionCode: `function add(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new Error("Both values must be numbers.");
  }
  return a + b;
}

console.log(add(2, 3));
try {
  console.log(add(2));
} catch (error) {
  console.error(error.message);
}`
    }
  },
  {
    slug: "career-and-interview-prep",
    title: "10. Career and Interview Prep",
    order: 10,
    content: `
# Career and Interview Prep

This final chapter helps you prepare for real interview conversations and next-level work.

## What interviewers want

- Clear explanations.
- Practical examples.
- Evidence that you can learn and grow.

## How to practice

- Build small projects.
- Review your code each day.
- Explain your work out loud.
`,
    interviewQuestions: [
      {
        question: "How should you answer an interview question when you are not sure?",
        answer: `
Be honest and say what you know. Then explain how you would find the answer or how you would test your idea. It is better to be thoughtful than to guess wildly.
`
      },
      {
        question: "What is the difference between junior and senior engineering work?",
        answer: `
Junior work is focused on learning tools and writing code that works. Senior work adds design, reliability, mentoring, and solving hard system problems. Seniors also help the team make better decisions.
`
      },
      {
        question: "Why is communication important for developers?",
        answer: `
Developers work with other people and tools. Good communication helps avoid mistakes, makes requirements clear, and ensures the team builds the right product.
`
      }
    ],
    practicalTask: {
      scenario: "You want to practice explaining your work clearly.",
      task: "Write a short summary of a project idea, including the goal, the tools you would use, and the first three steps you would take.",
      solutionCode: `const projectSummary = {
  goal: "Build a simple task tracker",
  tools: ["Node.js", "Express", "JSON file storage"],
  steps: [
    "Create an HTTP server",
    "Add routes for adding and listing tasks",
    "Store tasks in a JSON file"
  ]
};

console.log(JSON.stringify(projectSummary, null, 2));`
    }
  }
];

replaceDocs(
  "general",
  "General Developer Docs — Beginner to Pro",
  "A beginner-friendly guide that explains development concepts in simple language, with interview questions and tasks for each section.",
  topics
);
