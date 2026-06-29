import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-26-symbols", 
    title: "Chapter 26: Symbols", 
    order: 26, 
    content: "<h2>Symbols</h2><p>Starting with ECMAScript 2015, symbol is a primitive data type, just like number and string.</p>",
    interviewQuestions: [ 
      { question: "What is a Symbol?", answer: "A primitive data type introduced in ES6 whose instances are unique and immutable." }, 
      { question: "How do you use a Symbol as an object key in TypeScript?", answer: "You must use computed property syntax, e.g., `[mySymbol]: 'value'`." } 
    ],
    practicalTask: { scenario: "Using symbols", task: "Create a unique symbol and use it as a key in an object.", solutionCode: "const sym = Symbol('key');\nlet obj = { [sym]: 'value' };" }
  },
  { 
    slug: "ts-27-triple-slash-directives", 
    title: "Chapter 27: Triple-Slash Directives", 
    order: 27, 
    content: "<h2>Triple-Slash Directives</h2><p>Triple-slash directives are single-line comments containing a single XML tag. The contents of the comment are used as compiler directives.</p>",
    interviewQuestions: [ 
      { question: "What are triple-slash directives used for?", answer: "They are used to declare dependencies between files, mostly in legacy codebases or declaration files." }, 
      { question: "Where must triple-slash directives be placed?", answer: "At the very top of their containing file, before any statements." } 
    ],
    practicalTask: { scenario: "Reference an ambient declaration", task: "Add a reference to Node.js types using a triple-slash directive.", solutionCode: "/// <reference types=\"node\" />\nconsole.log(process.cwd());" }
  },
  { 
    slug: "ts-28-type-checking-js", 
    title: "Chapter 28: Type Checking JavaScript Files", 
    order: 28, 
    content: "<h2>Type Checking JavaScript Files</h2><p>TypeScript can check JavaScript files in your project using JSDoc types and the `--checkJs` compiler option.</p>",
    interviewQuestions: [ 
      { question: "How do you enable type checking for a specific JavaScript file?", answer: "By adding `// @ts-check` at the top of the file." }, 
      { question: "How does TypeScript infer types in JS files?", answer: "It infers types from assignments and uses JSDoc comments to explicitly define types." } 
    ],
    practicalTask: { scenario: "Adding JSDoc types", task: "Add a JSDoc comment to define a function parameter type as string.", solutionCode: "/**\n * @param {string} name\n */\nfunction greet(name) { return 'Hello ' + name; }" }
  },
  { 
    slug: "ts-29-jsx", 
    title: "Chapter 29: JSX in TypeScript", 
    order: 29, 
    content: "<h2>JSX in TypeScript</h2><p>TypeScript supports embedding, type checking, and compiling JSX directly to JavaScript.</p>",
    interviewQuestions: [ 
      { question: "What are the JSX compilation modes in TypeScript?", answer: "`preserve`, `react`, and `react-native`." }, 
      { question: "How do you type the props of a React component in TypeScript?", answer: "By defining an interface or type alias for the props and passing it to the component function or `React.FC` generic." } 
    ],
    practicalTask: { scenario: "Typing a React component", task: "Create an interface `Props` with `text` as string, and use it in a functional component.", solutionCode: "interface Props { text: string; }\nconst Button = ({ text }: Props) => <button>{text}</button>;" }
  },
  { 
    slug: "ts-30-nightly-builds", 
    title: "Chapter 30: Nightly Builds", 
    order: 30, 
    content: "<h2>Nightly Builds</h2><p>TypeScript publishes nightly builds to npm under the `typescript@next` tag, allowing you to try out unreleased features.</p>",
    interviewQuestions: [ 
      { question: "How do you install a nightly build of TypeScript?", answer: "Run `npm install typescript@next`." }, 
      { question: "Should you use nightly builds in production?", answer: "No, they are for testing and providing feedback on upcoming features and might contain bugs." } 
    ],
    practicalTask: { scenario: "Installing next", task: "Provide the command to install the TypeScript nightly build.", solutionCode: "npm install -D typescript@next" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
