import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-06-generics", 
    title: "Chapter 6: Type Manipulation (Generics)", 
    order: 6, 
    content: "<h2>Generics</h2><p>Generics allow you to create reusable components that work over a variety of types rather than a single one.</p>",
    interviewQuestions: [ 
      { question: "What are generics in TypeScript?", answer: "Generics allow you to write reusable and generalized forms of functions, classes, and interfaces by parameterizing types." }, 
      { question: "Why use generics instead of 'any'?", answer: "Generics preserve the type information, whereas 'any' strips it away, leading to a loss of type safety." } 
    ],
    practicalTask: { scenario: "Creating a generic identity function", task: "Write a generic function `identity` that returns the same type it accepts.", solutionCode: "function identity<T>(arg: T): T {\n  return arg;\n}" }
  },
  { 
    slug: "ts-07-keyof", 
    title: "Chapter 7: Keyof Type Operator", 
    order: 7, 
    content: "<h2>Keyof Type Operator</h2><p>The keyof operator takes an object type and produces a string or numeric literal union of its keys.</p>",
    interviewQuestions: [ 
      { question: "What does the 'keyof' operator do?", answer: "It creates a union type from the keys of an object type." }, 
      { question: "Can 'keyof' be used with primitive types?", answer: "Yes, for example `keyof string` results in a union of string prototype methods." } 
    ],
    practicalTask: { scenario: "Using keyof", task: "Create a type `PersonKeys` that represents the keys of a `Person` interface.", solutionCode: "interface Person { name: string; age: number; }\ntype PersonKeys = keyof Person; // 'name' | 'age'" }
  },
  { 
    slug: "ts-08-typeof", 
    title: "Chapter 8: Typeof Type Operator", 
    order: 8, 
    content: "<h2>Typeof Type Operator</h2><p>The typeof operator allows you to extract the type of a variable or property.</p>",
    interviewQuestions: [ 
      { question: "How is 'typeof' used in a type context?", answer: "It extracts the inferred type of a JavaScript value, allowing you to use that type elsewhere." }, 
      { question: "Can you use 'typeof' on a function call?", answer: "No, 'typeof' can only be used on identifiers (variables, properties) or their members." } 
    ],
    practicalTask: { scenario: "Extracting a type", task: "Extract the type of an existing variable `defaultConfig` into a type `Config`.", solutionCode: "const defaultConfig = { timeout: 1000, secure: true };\ntype Config = typeof defaultConfig;" }
  },
  { 
    slug: "ts-09-indexed-access-types", 
    title: "Chapter 9: Indexed Access Types", 
    order: 9, 
    content: "<h2>Indexed Access Types</h2><p>We can use an indexed access type to look up a specific property on another type.</p>",
    interviewQuestions: [ 
      { question: "What is an indexed access type?", answer: "It is a way to look up the type of a property on another type, using syntax similar to property access in JavaScript (e.g., `Type['key']`)." }, 
      { question: "Can you use a union of keys in an indexed access type?", answer: "Yes, e.g., `Type['key1' | 'key2']` returns a union of those properties' types." } 
    ],
    practicalTask: { scenario: "Accessing a property type", task: "Get the type of the `age` property from a `Person` interface.", solutionCode: "interface Person { name: string; age: number; }\ntype AgeType = Person['age'];" }
  },
  { 
    slug: "ts-10-conditional-types", 
    title: "Chapter 10: Conditional Types", 
    order: 10, 
    content: "<h2>Conditional Types</h2><p>Conditional types help describe the relation between the types of inputs and outputs using a ternary-like syntax.</p>",
    interviewQuestions: [ 
      { question: "What is a conditional type?", answer: "A type that selects one of two possible types based on a condition expressed as a type relationship test (`T extends U ? X : Y`)." }, 
      { question: "What does the 'infer' keyword do?", answer: "It introduces a type variable to be inferred within the `extends` clause of a conditional type." } 
    ],
    practicalTask: { scenario: "Creating a conditional type", task: "Write a type `IsString<T>` that returns `true` if `T` is a string, and `false` otherwise.", solutionCode: "type IsString<T> = T extends string ? true : false;" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
