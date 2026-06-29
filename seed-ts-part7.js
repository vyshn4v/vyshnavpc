import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-31-dom-manipulation", 
    title: "Chapter 31: DOM Manipulation with TypeScript", 
    order: 31, 
    content: "<h2>DOM Manipulation</h2><p>TypeScript provides excellent autocomplete and type safety when working with the browser's Document Object Model.</p>",
    interviewQuestions: [ 
      { question: "How do you cast a DOM element to a specific type?", answer: "By using type assertions, e.g., `document.getElementById('myCanvas') as HTMLCanvasElement`." }, 
      { question: "What is the `Event` type?", answer: "The base type for all events in the DOM, which can be narrowed down (e.g., `MouseEvent`, `KeyboardEvent`)." } 
    ],
    practicalTask: { scenario: "Selecting an input element", task: "Select an input element by ID and log its value safely.", solutionCode: "const input = document.getElementById('myInput') as HTMLInputElement;\nif (input) console.log(input.value);" }
  },
  { 
    slug: "ts-32-advanced-compiler", 
    title: "Chapter 32: Advanced Compiler Options", 
    order: 32, 
    content: "<h2>Advanced Compiler Options</h2><p>The `tsconfig.json` file controls how TypeScript compiles your code. Advanced flags help tighten type safety.</p>",
    interviewQuestions: [ 
      { question: "What does the `strict` flag do in tsconfig?", answer: "It enables a suite of strict type checking options like `strictNullChecks`, `noImplicitAny`, and more." }, 
      { question: "What is `noImplicitReturns`?", answer: "It ensures that all code paths in a function return a value." } 
    ],
    practicalTask: { scenario: "Enabling strict mode", task: "Enable strict mode in a tsconfig snippet.", solutionCode: "{\n  \"compilerOptions\": {\n    \"strict\": true\n  }\n}" }
  },
  { 
    slug: "ts-33-project-references", 
    title: "Chapter 33: Project References", 
    order: 33, 
    content: "<h2>Project References</h2><p>Project references are a feature that allows you to structure your TypeScript programs into smaller pieces.</p>",
    interviewQuestions: [ 
      { question: "What are the benefits of project references?", answer: "They greatly improve build times, enforce logical separation between components, and allow grouping code logically." }, 
      { question: "How do you specify project references?", answer: "By adding a `references` array to the `tsconfig.json`." } 
    ],
    practicalTask: { scenario: "Adding a reference", task: "Add a reference to a folder named `backend` in a `tsconfig.json`.", solutionCode: "{\n  \"compilerOptions\": { \"composite\": true },\n  \"references\": [{ \"path\": \"../backend\" }]\n}" }
  },
  { 
    slug: "ts-34-module-resolution", 
    title: "Chapter 34: Module Resolution", 
    order: 34, 
    content: "<h2>Module Resolution</h2><p>Module resolution is the process the compiler uses to figure out what an import refers to.</p>",
    interviewQuestions: [ 
      { question: "What are the two module resolution strategies in TypeScript?", answer: "`Node` and `Classic`." }, 
      { question: "What is the `baseUrl` option?", answer: "It sets the base directory from which to resolve non-relative module names." } 
    ],
    practicalTask: { scenario: "Configuring paths", task: "Configure the `paths` compiler option to alias the `@app` prefix to `src/app`.", solutionCode: "{\n  \"compilerOptions\": {\n    \"baseUrl\": \".\",\n    \"paths\": {\n      \"@app/*\": [\"src/app/*\"]\n    }\n  }\n}" }
  },
  { 
    slug: "ts-35-declaration-merging", 
    title: "Chapter 35: Declaration Merging", 
    order: 35, 
    content: "<h2>Declaration Merging</h2><p>Declaration merging is the compiler merging two separate declarations declared with the same name into a single definition.</p>",
    interviewQuestions: [ 
      { question: "Can you merge two interfaces with the same name?", answer: "Yes, TypeScript merges their members into a single interface." }, 
      { question: "Can classes merge with other classes?", answer: "No, classes cannot merge with other classes or variables." } 
    ],
    practicalTask: { scenario: "Merging interfaces", task: "Declare an interface `Box` with `height`, and then declare `Box` again with `width`.", solutionCode: "interface Box { height: number; }\ninterface Box { width: number; }\nlet b: Box = { height: 10, width: 20 };" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
