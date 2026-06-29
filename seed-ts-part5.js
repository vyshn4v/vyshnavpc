import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-21-type-inference", 
    title: "Chapter 21: Type Inference", 
    order: 21, 
    content: "<h2>Type Inference</h2><p>In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation.</p>",
    interviewQuestions: [ 
      { question: "What is best common type?", answer: "When a type inference is made from several expressions, the types of those expressions are used to calculate a 'best common type'." }, 
      { question: "What is contextual typing?", answer: "Contextual typing occurs when the type of an expression is implied by its location." } 
    ],
    practicalTask: { scenario: "Observing type inference", task: "Declare an array of mixed numbers and nulls and observe the inferred type.", solutionCode: "let zoo = [0, 1, null];\n// Inferred as (number | null)[]" }
  },
  { 
    slug: "ts-22-type-compatibility", 
    title: "Chapter 22: Type Compatibility", 
    order: 22, 
    content: "<h2>Type Compatibility</h2><p>Type compatibility in TypeScript is based on structural subtyping. Structural typing is a way of relating types based solely on their members.</p>",
    interviewQuestions: [ 
      { question: "What does it mean that TypeScript uses structural typing?", answer: "It means that if two types have the same shape (members), they are considered compatible, regardless of their explicit names or declarations." }, 
      { question: "How does function parameter compatibility work in TypeScript?", answer: "Function parameters are compared by type and position. Extra parameters in the source are not allowed unless they are optional, but extra parameters in the target (callback) are allowed." } 
    ],
    practicalTask: { scenario: "Structural typing in action", task: "Create an interface `Named` with a `name: string` property, and show that an object literal with `name` and `age` can be assigned to a variable of type `Named`.", solutionCode: "interface Named { name: string; }\nlet p: Named;\nlet y = { name: 'Alice', age: 30 };\np = y; // OK" }
  },
  { 
    slug: "ts-23-intersection-union", 
    title: "Chapter 23: Advanced Types (Intersection/Union)", 
    order: 23, 
    content: "<h2>Intersection and Union Types</h2><p>Intersection types combine multiple types into one. Union types describe a value that can be one of several types.</p>",
    interviewQuestions: [ 
      { question: "What is the difference between union (`|`) and intersection (`&`) types?", answer: "A union type represents a value that is one of several types. An intersection type represents a value that is ALL of several types." }, 
      { question: "How do you access properties on a union type?", answer: "You can only access properties that are common to all types in the union." } 
    ],
    practicalTask: { scenario: "Creating an intersection", task: "Create an intersection type `Employee` from `Person` and `Worker`.", solutionCode: "interface Person { name: string; }\ninterface Worker { company: string; }\ntype Employee = Person & Worker;" }
  },
  { 
    slug: "ts-24-type-guards", 
    title: "Chapter 24: Type Guards and Differentiating Types", 
    order: 24, 
    content: "<h2>Type Guards</h2><p>Type guards are some expression that performs a runtime check that guarantees the type in some scope.</p>",
    interviewQuestions: [ 
      { question: "What is a user-defined type guard?", answer: "A function whose return type is a type predicate, e.g., `pet is Fish`." }, 
      { question: "What built-in JavaScript operators act as type guards in TypeScript?", answer: "`typeof`, `instanceof`, and the `in` operator." } 
    ],
    practicalTask: { scenario: "Writing a type guard", task: "Write a type guard function `isString`.", solutionCode: "function isString(test: any): test is string {\n  return typeof test === 'string';\n}" }
  },
  { 
    slug: "ts-25-nullable-types", 
    title: "Chapter 25: Nullable Types", 
    order: 25, 
    content: "<h2>Nullable Types</h2><p>TypeScript has two special types, null and undefined, that have the values null and undefined respectively.</p>",
    interviewQuestions: [ 
      { question: "What does the `--strictNullChecks` flag do?", answer: "When true, `null` and `undefined` have their own distinct types and you’ll get a type error if you try to use them where a concrete value is expected." }, 
      { question: "What is the non-null assertion operator?", answer: "The exclamation mark (`!`) postfix operator, which tells the compiler to ignore the possibility of a value being null or undefined." } 
    ],
    practicalTask: { scenario: "Using the non-null assertion", task: "Assert that a variable `name` is not null before accessing its length.", solutionCode: "let name: string | null = 'Alice';\nconsole.log(name!.length);" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
