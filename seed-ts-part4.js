import { appendTopics } from './seeder-utils.js';

const topics = [
  { 
    slug: "ts-16-enums", 
    title: "Chapter 16: Enums", 
    order: 16, 
    content: "<h2>Enums</h2><p>Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent.</p>",
    interviewQuestions: [ 
      { question: "What are the two main types of enums in TypeScript?", answer: "Numeric and string enums." }, 
      { question: "What is a const enum?", answer: "A const enum is fully erased during compilation and its usages are inlined, saving memory and output size." } 
    ],
    practicalTask: { scenario: "Creating a String Enum", task: "Create a string enum `Direction` with values Up, Down, Left, and Right.", solutionCode: "enum Direction {\n  Up = 'UP',\n  Down = 'DOWN',\n  Left = 'LEFT',\n  Right = 'RIGHT'\n}" }
  },
  { 
    slug: "ts-17-utility-types", 
    title: "Chapter 17: Utility Types", 
    order: 17, 
    content: "<h2>Utility Types</h2><p>TypeScript provides several utility types globally to facilitate common type transformations.</p>",
    interviewQuestions: [ 
      { question: "What does the `Partial<T>` utility type do?", answer: "It makes all properties of the type `T` optional." }, 
      { question: "What is the difference between `Omit` and `Pick`?", answer: "`Pick` constructs a type by picking a set of properties from `T`, while `Omit` constructs a type by picking all properties from `T` and then removing a specified set of keys." } 
    ],
    practicalTask: { scenario: "Using Partial", task: "Given an interface `Todo { title: string; description: string; }`, create a type `PartialTodo` using a utility type.", solutionCode: "interface Todo { title: string; description: string; }\ntype PartialTodo = Partial<Todo>;" }
  },
  { 
    slug: "ts-18-decorators", 
    title: "Chapter 18: Decorators", 
    order: 18, 
    content: "<h2>Decorators</h2><p>Decorators provide a way to add both annotations and a metaprogramming syntax for class declarations and members.</p>",
    interviewQuestions: [ 
      { question: "What is a decorator?", answer: "A special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter." }, 
      { question: "How do you enable experimental decorators in tsconfig?", answer: "By setting `\"experimentalDecorators\": true` in `tsconfig.json`." } 
    ],
    practicalTask: { scenario: "Creating a basic class decorator", task: "Write a class decorator `sealed` that seals the constructor and its prototype.", solutionCode: "function sealed(constructor: Function) {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n}" }
  },
  { 
    slug: "ts-19-iterators-and-generators", 
    title: "Chapter 19: Iterators and Generators", 
    order: 19, 
    content: "<h2>Iterators and Generators</h2><p>An object is an iterator when it implements a `next()` method. Generators are functions that can be paused and resumed.</p>",
    interviewQuestions: [ 
      { question: "What makes an object iterable in TypeScript?", answer: "It must have an implementation for the `Symbol.iterator` property." }, 
      { question: "What is the return type of a generator function?", answer: "A generator function returns an `IterableIterator<T>` or `Generator<T, TReturn, TNext>`." } 
    ],
    practicalTask: { scenario: "Typing a generator", task: "Write a generator function `idMaker` that yields incrementing numbers.", solutionCode: "function* idMaker(): IterableIterator<number> {\n  let index = 0;\n  while (true) {\n    yield index++;\n  }\n}" }
  },
  { 
    slug: "ts-20-mixins", 
    title: "Chapter 20: Mixins", 
    order: 20, 
    content: "<h2>Mixins</h2><p>Along with traditional object-oriented hierarchies, another popular way of building up classes is to build them from reusable components.</p>",
    interviewQuestions: [ 
      { question: "What is a mixin pattern?", answer: "It's a way to compose classes by combining simpler partial classes or functions that return extended classes." }, 
      { question: "How do you apply mixins in TypeScript?", answer: "Usually by creating a function that takes a class constructor and returns a new class that extends it with additional behavior." } 
    ],
    practicalTask: { scenario: "Creating a basic mixin", task: "Create a mixin function `Timestamped` that adds a `timestamp` property to a class.", solutionCode: "type Constructor<T = {}> = new (...args: any[]) => T;\nfunction Timestamped<TBase extends Constructor>(Base: TBase) {\n  return class extends Base {\n    timestamp = Date.now();\n  };\n}" }
  }
];

appendTopics("typescript", "TypeScript Encyclopedia", "The definitive guide.", topics);
