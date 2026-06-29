import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-01-introduction", 
    title: "Chapter 1: Introduction to TypeScript", 
    order: 1, 
    content: "<h2>Introduction to TypeScript</h2><p>TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</p>",
    interviewQuestions: [ 
      { question: "What is TypeScript?", answer: "TypeScript is a superset of JavaScript that adds static typing to the language." }, 
      { question: "Why use TypeScript over JavaScript?", answer: "It provides compile-time type checking, better tooling, and improved readability." } 
    ],
    practicalTask: { scenario: "Setting up a project", task: "Initialize a new TypeScript project with a tsconfig.json file.", solutionCode: "npx tsc --init" }
  },
  { 
    slug: "ts-02-basic-types", 
    title: "Chapter 2: Basic Types", 
    order: 2, 
    content: "<h2>Basic Types</h2><p>TypeScript supports the same basic types as JavaScript, with a few extra properties for enumerations and type safety.</p>",
    interviewQuestions: [ 
      { question: "What are the basic types in TypeScript?", answer: "Boolean, Number, String, Array, Tuple, Enum, Unknown, Any, Void, Null, Undefined, Never." }, 
      { question: "What is the difference between 'any' and 'unknown'?", answer: "'unknown' is the type-safe counterpart of 'any'. Anything is assignable to 'unknown', but 'unknown' isn't assignable to anything but itself and 'any' without a type assertion or a control flow based narrowing." } 
    ],
    practicalTask: { scenario: "Defining basic types", task: "Declare a boolean, a number, and a string with explicit typing.", solutionCode: "let isDone: boolean = false;\nlet lines: number = 42;\nlet name: string = 'Alice';" }
  },
  { 
    slug: "ts-03-interfaces", 
    title: "Chapter 3: Interfaces", 
    order: 3, 
    content: "<h2>Interfaces</h2><p>Interfaces are a powerful way to define contracts within your code as well as contracts with code outside of your project.</p>",
    interviewQuestions: [ 
      { question: "How do interfaces differ from type aliases?", answer: "Interfaces are generally used to shape objects and can be extended, whereas type aliases can shape any type, including primitives, unions, and tuples." }, 
      { question: "Can an interface extend a class?", answer: "Yes, an interface can extend a class, inheriting its members but not their implementations." } 
    ],
    practicalTask: { scenario: "Creating an interface", task: "Create an interface `User` with `id` as number and `name` as string.", solutionCode: "interface User {\n  id: number;\n  name: string;\n}" }
  },
  { 
    slug: "ts-04-functions", 
    title: "Chapter 4: Functions", 
    order: 4, 
    content: "<h2>Functions</h2><p>Functions are the fundamental building block of any application in JavaScript. TypeScript adds additional capabilities like type annotations for parameters and return types.</p>",
    interviewQuestions: [ 
      { question: "How do you specify optional parameters in a TypeScript function?", answer: "By adding a question mark (?) after the parameter name." }, 
      { question: "What is a rest parameter?", answer: "It allows a function to accept an indefinite number of arguments as an array, denoted by an ellipsis (...)." } 
    ],
    practicalTask: { scenario: "Typing a function", task: "Write a function `add` that takes two numbers and returns a number.", solutionCode: "function add(x: number, y: number): number {\n  return x + y;\n}" }
  },
  { 
    slug: "ts-05-object-types", 
    title: "Chapter 5: Object Types", 
    order: 5, 
    content: "<h2>Object Types</h2><p>In TypeScript, object types can be anonymous, defined using interfaces, or defined using type aliases.</p>",
    interviewQuestions: [ 
      { question: "What is an index signature?", answer: "An index signature allows you to define the type of keys and values in an object when you don't know all the property names ahead of time." }, 
      { question: "How do you make a property read-only?", answer: "By prefixing the property name with the `readonly` modifier." } 
    ],
    practicalTask: { scenario: "Readonly properties", task: "Define an object type where the `id` property cannot be changed after creation.", solutionCode: "interface Point {\n  readonly x: number;\n  readonly y: number;\n}" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
