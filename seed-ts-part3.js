import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-11-mapped-types", 
    title: "Chapter 11: Mapped Types", 
    order: 11, 
    content: "<h2>Mapped Types</h2><p>Mapped types build on the syntax for index signatures to map over keys and create new types.</p>",
    interviewQuestions: [ 
      { question: "What is a mapped type?", answer: "A mapped type is a generic type that iterates over keys of an existing type to create a new type." }, 
      { question: "How do you make all properties of a type optional using mapped types?", answer: "By using a mapped type with the '?' modifier, e.g., `[P in keyof T]?: T[P]`." } 
    ],
    practicalTask: { scenario: "Creating a Readonly mapped type", task: "Write a mapped type `MyReadonly<T>` that makes all properties of `T` read-only.", solutionCode: "type MyReadonly<T> = {\n  readonly [P in keyof T]: T[P];\n};" }
  },
  { 
    slug: "ts-12-template-literal-types", 
    title: "Chapter 12: Template Literal Types", 
    order: 12, 
    content: "<h2>Template Literal Types</h2><p>Template literal types build on string literal types and can expand into many strings via unions.</p>",
    interviewQuestions: [ 
      { question: "What are template literal types?", answer: "Types that use template literal syntax to build string types from other string or union types." }, 
      { question: "Can template literal types use intrinsic string manipulation?", answer: "Yes, TypeScript provides intrinsic types like `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize`." } 
    ],
    practicalTask: { scenario: "Using template literal types", task: "Create a type `EventName` that appends `Changed` to a string union `Event = 'click' | 'hover'`.", solutionCode: "type Event = 'click' | 'hover';\ntype EventName = `${Event}Changed`;" }
  },
  { 
    slug: "ts-13-classes", 
    title: "Chapter 13: Classes", 
    order: 13, 
    content: "<h2>Classes</h2><p>TypeScript offers full support for the class keyword introduced in ES2015 with additional typing features.</p>",
    interviewQuestions: [ 
      { question: "What are the access modifiers in TypeScript classes?", answer: "public (default), private, and protected." }, 
      { question: "What is a parameter property?", answer: "A shorthand that allows you to declare and initialize a class member in a single place by adding an access modifier to a constructor parameter." } 
    ],
    practicalTask: { scenario: "Using parameter properties", task: "Create a `User` class that takes `id` and `name` in its constructor and automatically makes them public properties.", solutionCode: "class User {\n  constructor(public id: number, public name: string) {}\n}" }
  },
  { 
    slug: "ts-14-modules", 
    title: "Chapter 14: Modules", 
    order: 14, 
    content: "<h2>Modules</h2><p>TypeScript shares the same module concept as ES Modules.</p>",
    interviewQuestions: [ 
      { question: "How does TypeScript define a module?", answer: "Any file containing a top-level `import` or `export` is considered a module." }, 
      { question: "What is `export type`?", answer: "It allows you to export only type declarations, which are completely erased during compilation." } 
    ],
    practicalTask: { scenario: "Exporting a type", task: "Export an interface `Point` from a module.", solutionCode: "export interface Point {\n  x: number;\n  y: number;\n}" }
  },
  { 
    slug: "ts-15-namespaces", 
    title: "Chapter 15: Namespaces", 
    order: 15, 
    content: "<h2>Namespaces</h2><p>Namespaces are a TypeScript-specific way to organize code, previously known as internal modules.</p>",
    interviewQuestions: [ 
      { question: "When should you use namespaces?", answer: "They are mostly useful for organizing code in legacy projects or specific ambient declarations, but ES modules are generally preferred today." }, 
      { question: "How do you access a variable inside a namespace?", answer: "By exporting the variable from the namespace and accessing it using dot notation (e.g., `MyNamespace.myVar`)." } 
    ],
    practicalTask: { scenario: "Declaring a namespace", task: "Create a namespace `MathHelpers` with an exported function `add`.", solutionCode: "namespace MathHelpers {\n  export function add(a: number, b: number) { return a + b; }\n}" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
