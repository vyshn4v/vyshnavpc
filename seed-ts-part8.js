import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-36-writing-d-ts", 
    title: "Chapter 36: Writing Declaration Files (d.ts)", 
    order: 36, 
    content: "<h2>Writing Declaration Files</h2><p>Declaration files allow you to describe the shape of existing JavaScript libraries to TypeScript.</p>",
    interviewQuestions: [ 
      { question: "What is a `.d.ts` file?", answer: "It is a declaration file that provides type information for JavaScript code without containing actual implementation." }, 
      { question: "How do you declare a global variable in a `.d.ts` file?", answer: "By using the `declare` keyword, e.g., `declare var myGlobal: string;`." } 
    ],
    practicalTask: { scenario: "Typing a global library", task: "Write a declaration for a global function `doMagic`.", solutionCode: "declare function doMagic(spell: string): boolean;" }
  },
  { 
    slug: "ts-37-publishing", 
    title: "Chapter 37: Publishing TypeScript to npm", 
    order: 37, 
    content: "<h2>Publishing to npm</h2><p>When publishing a TypeScript package to npm, you must ensure that users get both the compiled JS and the type declarations.</p>",
    interviewQuestions: [ 
      { question: "Which file should the `types` property in `package.json` point to?", answer: "It should point to the main declaration file, usually `dist/index.d.ts`." }, 
      { question: "Do you publish `.ts` files to npm?", answer: "Usually no, you publish the compiled `.js` files and their corresponding `.d.ts` type definitions." } 
    ],
    practicalTask: { scenario: "Updating package.json", task: "Add the necessary keys in package.json to point to `main.js` and `main.d.ts`.", solutionCode: "{\n  \"main\": \"dist/main.js\",\n  \"types\": \"dist/main.d.ts\"\n}" }
  },
  { 
    slug: "ts-38-migrating", 
    title: "Chapter 38: Migrating from JavaScript", 
    order: 38, 
    content: "<h2>Migrating from JavaScript</h2><p>Migrating a project from JavaScript to TypeScript can be done incrementally using `allowJs`.</p>",
    interviewQuestions: [ 
      { question: "What is the `allowJs` compiler option?", answer: "It allows JavaScript files to be compiled alongside TypeScript files, enabling gradual migration." }, 
      { question: "What is `suppressImplicitAnyIndexErrors`?", answer: "A flag that suppresses errors about implicit any types when accessing objects with string keys, useful during migration." } 
    ],
    practicalTask: { scenario: "Setting up a migration", task: "Configure `tsconfig.json` to allow JS files.", solutionCode: "{\n  \"compilerOptions\": {\n    \"allowJs\": true,\n    \"outDir\": \"./dist\"\n  }\n}" }
  },
  { 
    slug: "ts-39-best-practices", 
    title: "Chapter 39: Best Practices", 
    order: 39, 
    content: "<h2>Best Practices</h2><p>Following TypeScript best practices helps maintain code quality and take full advantage of the type system.</p>",
    interviewQuestions: [ 
      { question: "Why should you avoid the `any` type?", answer: "Because it disables type checking for that value, negating the benefits of using TypeScript." }, 
      { question: "When should you use `unknown` instead of `any`?", answer: "When you don't know the type of a value but still want to enforce type checking before operating on it." } 
    ],
    practicalTask: { scenario: "Fixing an 'any' type", task: "Change a function accepting `any` to accept `unknown` and add a type guard.", solutionCode: "function process(value: unknown) {\n  if (typeof value === 'string') {\n    console.log(value.toUpperCase());\n  }\n}" }
  },
  { 
    slug: "ts-40-performance", 
    title: "Chapter 40: Performance in TypeScript", 
    order: 40, 
    content: "<h2>Performance in TypeScript</h2><p>As TypeScript projects grow, compile times can increase. Understanding how to optimize performance is critical.</p>",
    interviewQuestions: [ 
      { question: "How does `skipLibCheck` improve build performance?", answer: "It skips type checking of declaration files (`.d.ts`), significantly reducing compilation time." }, 
      { question: "What is the `incremental` compiler option?", answer: "It saves information from previous compilations to disk, making subsequent builds faster." } 
    ],
    practicalTask: { scenario: "Optimizing compilation", task: "Enable incremental builds in your `tsconfig.json`.", solutionCode: "{\n  \"compilerOptions\": {\n    \"incremental\": true,\n    \"skipLibCheck\": true\n  }\n}" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
