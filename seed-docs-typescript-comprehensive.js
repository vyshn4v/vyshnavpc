import { appendTopics } from "./seeder-utils.js";

const topics = [
  // ==================== TOPIC 1 ====================
  {
    slug: "introduction-to-typescript",
    title: "1. Introduction to TypeScript",
    order: 1,
    content: `
# Introduction to TypeScript

## What is TypeScript?

TypeScript is a **strongly typed superset of JavaScript** that compiles to plain JavaScript. Developed by Microsoft, it adds optional static typing, classes, interfaces, and other modern features to JavaScript.

### Why TypeScript?

- **Catch errors at compile time** — type checking catches bugs before they reach production
- **Better developer experience** — autocompletion, navigation, and refactoring in IDEs
- **Self-documenting code** — types serve as living documentation
- **Enterprise scale** — makes large codebases more maintainable

### TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| Typing | Dynamic | Static (optional) |
| Compilation | Interpreted | Compiled to JS |
| IDE Support | Limited | Excellent (IntelliSense) |
| Null Safety | Manual | Built-in (strictNullChecks) |
| Modern Features | Via Babel | Built-in |

## Installation & Setup

\`\`\`bash
# Install globally
npm install -g typescript

# Or locally in project
npm install --save-dev typescript

# Initialize tsconfig.json
npx tsc --init

# Compile a file
npx tsc index.ts
\`\`\`

## tsconfig.json Key Options

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
\`\`\`

## Basic Syntax

\`\`\`typescript
// Type annotations
let name: string = "Alice";
let age: number = 30;
let isActive: boolean = true;

// Type inference — TypeScript can figure out types
let city = "New York"; // inferred as string
// city = 42; // Error!

// Functions with types
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alice", "Bob"];

// Objects
let user: { name: string; age: number } = {
  name: "Alice",
  age: 30
};
\`\`\`
`,
    interviewQuestions: [
      {
        question:
          "What is TypeScript and why would you use it over JavaScript?",
        answer: `TypeScript is a **superset of JavaScript** that adds static typing. You'd use it over JavaScript for:

1. **Catch bugs at compile time** — type errors are caught before reaching production.
2. **Better IDE tooling** — autocomplete, inline documentation, safe refactoring.
3. **Self-documenting code** — types serve as contracts.
4. **Team scalability** — makes it easier for multiple developers to work on large codebases.

TypeScript compiles down to plain JavaScript, so it runs anywhere JavaScript runs. Think of it as "JavaScript with guardrails."`,
      },
      {
        question:
          "Explain the difference between 'interface' and 'type' in TypeScript.",
        answer: `Both \`interface\` and \`type\` can define object shapes, but there are key differences:

1. **Declaration merging**: Interfaces can be merged (declared multiple times), types cannot.
2. **Extends vs Intersection**: Interfaces use \`extends\`, types use \`&\`.
3. **Use cases**: Types can represent primitives, unions, tuples; interfaces only represent objects.

\`\`\`typescript
// Interface can be merged
interface User { name: string; }
interface User { age: number; } // Merges to {name, age}

// Type cannot be redeclared
type Admin = { role: string };
// type Admin = { permissions: number }; // Error!

// Type can represent unions
type Status = "active" | "inactive" | "pending";

// Interface is preferred for public API contracts
// Type is preferred for complex type manipulations
\`\`\`

**Rule of thumb**: Use \`interface\` for objects/classes, \`type\` for everything else.`,
      },
      {
        question: "What is type inference in TypeScript?",
        answer: `Type inference is TypeScript's ability to **automatically determine the type** of a variable based on its value. You don't always need to write explicit type annotations.

\`\`\`typescript
// TypeScript infers 'number'
let count = 0;

// TypeScript infers 'string'
const name = "Alice";

// TypeScript infers return type 'number'
function add(a: number, b: number) {
  return a + b;
}

// Best practice: let inference work for simple cases,
// add explicit types at function/API boundaries
\`\`\`

TypeScript's inference engine is powerful enough to understand complex expressions, destructuring, and control flow. Reserve explicit annotations for function parameters, return types, and complex data structures.`,
      },
      {
        question:
          "What is the 'strict' mode in tsconfig.json and what does it enable?",
        answer: `The \`strict: true\` flag in \`tsconfig.json\` enables a set of stricter type-checking options that catch more bugs. It enables:

1. **\`strictNullChecks\`** — null and undefined are not assignable to other types by default.
2. **\`noImplicitAny\`** — raises an error when a type is implicitly \`any\`.
3. **\`strictFunctionTypes\`** — stricter checking of function parameter bivariance.
4. **\`strictBindCallApply\`** — stricter checking on \`.bind()\`, \`.call()\`, \`.apply()\`.
5. **\`alwaysStrict\`** — ensures "use strict" is always emitted.

For production code, always enable strict mode. It catches real bugs — like accessing a property on something that might be null — that would otherwise cause runtime errors.`,
      },
    ],
    practicalTask: {
      scenario:
        "Your team is migrating a JavaScript project to TypeScript. The existing code has a shopping cart function that takes different types of IDs (string or number) and needs to calculate totals with proper types.",
      task: "Set up a basic TypeScript project with a tsconfig.json (strict mode). Create a function that: (1) accepts a product ID (string | number), (2) accepts a quantity (number), (3) returns a formatted order summary string. Use proper type annotations and let inference work where possible.",
      solutionCode:
        '// tsconfig.json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "ESNext",\n    "strict": true,\n    "outDir": "./dist",\n    "rootDir": "./src",\n    "esModuleInterop": true\n  }\n}\n\n// src/order.ts\ninterface Product {\n  id: string | number;\n  name: string;\n  price: number;\n}\n\nfunction createOrder(productId: string | number, quantity: number): string {\n  return `Order: Product ${productId}, Qty: ${quantity}`;\n}\n\nfunction calculateTotal(price: number, quantity: number, taxRate: number = 0.1): number {\n  const subtotal = price * quantity;\n  return subtotal + subtotal * taxRate;\n}\n\n// Usage with type inference\nconst product: Product = { id: "PROD-001", name: "Widget", price: 29.99 };\nconst orderSummary = createOrder(product.id, 3);\nconst total = calculateTotal(product.price, 3);\n\nconsole.log(orderSummary, `Total: $${total.toFixed(2)}`);',
    },
  },
  // ==================== TOPIC 2 ====================
  {
    slug: "basic-types",
    title: "2. Basic Types & Type Annotations",
    order: 2,
    content: `
# Basic Types & Type Annotations

## Primitives

\`\`\`typescript
let isComplete: boolean = false;
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let color: string = "blue";
let sentence: string = \`Hello, my name is \${color}\`;
\`\`\`

## Arrays & Tuples

\`\`\`typescript
// Array types
let list: number[] = [1, 2, 3];
let fruits: Array<string> = ["apple", "banana"];

// Tuple — fixed length with specific types at each position
let pair: [string, number] = ["hello", 42];
let httpStatus: [number, string] = [200, "OK"];

// Tuple with optional element
let optional: [string, number?] = ["hello"];
\`\`\`

## Enum

\`\`\`typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

let dir: Direction = Direction.Up;

// Numeric enum (auto-increments from 0)
enum Status {
  Active,    // 0
  Inactive,  // 1
  Pending    // 2
}
\`\`\`

## Special Types

\`\`\`typescript
// any — opt out of type checking (avoid when possible)
let notSure: any = 4;
notSure = "maybe a string";
notSure = false;

// unknown — type-safe counterpart of any
let unsure: unknown = 4;
// unsure.toFixed(); // Error! Object is of type 'unknown'

// void — absence of a value (return type of functions that don't return)
function warnUser(): void {
  console.log("Warning!");
}

// never — represents values that NEVER occur
function throwError(message: string): never {
  throw new Error(message);
}

// null and undefined
let u: undefined = undefined;
let n: null = null;
\`\`\`

## Type Assertions

\`\`\`typescript
// Angle bracket syntax
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// 'as' syntax (preferred in JSX)
let strLength2: number = (someValue as string).length;
\`\`\`
`,
    interviewQuestions: [
      {
        question:
          "What is the difference between 'any' and 'unknown' in TypeScript?",
        answer: `Both \`any\` and \`unknown\` can hold any value, but they differ in **type safety**:

\`\`\`typescript
let anyValue: any = "hello";
let unknownValue: unknown = "hello";

anyValue.toUpperCase(); // OK — any disables checking
// unknownValue.toUpperCase(); // Error — unknown requires type narrowing

// To use unknown, you must narrow the type first
if (typeof unknownValue === "string") {
  unknownValue.toUpperCase(); // OK now
}
\`\`\`

**\`any\`** disables all type checking — use as a last resort. **\`unknown\`** is the type-safe version — you must prove the type before using it. Prefer \`unknown\` over \`any\`.`,
      },
      {
        question: "What are tuples in TypeScript and when would you use them?",
        answer: `Tuples are **fixed-length arrays** where each position has a specific type. They're useful when:

1. **Returning multiple values** from a function (like React's \`useState\`).
2. **Representing structured data** like CSV rows or key-value pairs.

\`\`\`typescript
// Tuple with specific types per position
type ApiResponse = [number, string, boolean];
const response: ApiResponse = [200, "OK", true];

// Destructuring tuples
const [statusCode, message, success] = response;

// React useState returns a tuple
const [count, setCount] = useState<number>(0);
// Type: [number, Dispatch<SetStateAction<number>>]

// Tuple with rest element
type StringNumberBooleans = [string, ...number[], boolean];
\`\`\`

Tuples preserve type information at specific indices, which regular arrays cannot do.`,
      },
      {
        question: "What is the never type and when would you use it?",
        answer: `The \`never\` type represents values that **never occur**. It's used in:

1. **Functions that always throw** an error.
2. **Functions with infinite loops**.
3. **Exhaustive type checking** in discriminated unions.

\`\`\`typescript
// Function that always throws
function fail(message: string): never {
  throw new Error(message);
}

// Infinite loop
function infiniteLoop(): never {
  while (true) {}
}

// Exhaustive check — ensures all cases handled
type Shape = "circle" | "square" | "triangle";
function getArea(shape: Shape): number {
  switch (shape) {
    case "circle": return Math.PI;
    case "square": return 4;
    case "triangle": return 3;
    default: {
      const _exhaustive: never = shape;
      return _exhaustive;
    }
  }
}
\`\`\`

If a new type is added to \`Shape\` and \`getArea\` isn't updated, the default branch will cause a compile error.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building a data validation library. You need to represent different types of validation results: success with data, validation error with field-level messages, and critical errors that crash the process.",
      task: "Create types/interfaces for: (1) ValidationResult<T> — a discriminated union with 'success' containing data and 'error' containing field errors, (2) a function validateUser that returns ValidationResult<User>, (3) use proper typing (never for thrown errors, tuples for field errors).",
      solutionCode:
        '// Types\ninterface User {\n  id: number;\n  email: string;\n  name: string;\n}\n\n// Field error as tuple\ntype FieldError = [string, string]; // [fieldName, message]\n\n// Discriminated union for validation result\ntype ValidationResult<T> = \n  | { success: true; data: T }\n  | { success: false; errors: FieldError[] };\n\n// Validation function\nfunction validateUser(input: Partial<User>): ValidationResult<User> {\n  const errors: FieldError[] = [];\n\n  if (!input.email?.includes("@")) {\n    errors.push(["email", "Invalid email format"]);\n  }\n  if (!input.name?.trim()) {\n    errors.push(["name", "Name is required"]);\n  }\n\n  if (errors.length > 0) {\n    return { success: false, errors };\n  }\n\n  return { \n    success: true, \n    data: { id: Date.now(), email: input.email!, name: input.name! } \n  };\n}\n\n// Function that throws (never return type)\nfunction crash(message: string): never {\n  throw new Error(`CRITICAL: ${message}`);\n}\n\n// Usage\nconst result = validateUser({ email: "test@example.com", name: "Alice" });\nif (result.success) {\n  console.log("User created:", result.data.name);\n} else {\n  console.log("Validation failed:", result.errors);\n}',
    },
  },
  // ==================== TOPIC 3 ====================
  {
    slug: "functions-in-typescript",
    title: "3. Functions & Callbacks",
    order: 3,
    content: `
# Functions & Callbacks in TypeScript

## Function Type Annotations

\`\`\`typescript
// Parameter types and return type
function add(x: number, y: number): number {
  return x + y;
}

// Arrow function with types
const multiply = (x: number, y: number): number => x * y;

// Optional parameters
function greet(name: string, greeting?: string): string {
  return greeting ? \`\${greeting}, \${name}!\` : \`Hello, \${name}!\`;
}

// Default parameters
function createEmail(to: string, subject: string = "No Subject"): string {
  return \`To: \${to}\\nSubject: \${subject}\`;
}
\`\`\`

## Rest Parameters

\`\`\`typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

sum(1, 2, 3, 4, 5); // 15
\`\`\`

## Function Overloads

\`\`\`typescript
// Overload signatures
function processInput(input: string): string;
function processInput(input: number): number;
function processInput(input: boolean): boolean;

// Implementation signature (not publicly visible)
function processInput(input: string | number | boolean): string | number | boolean {
  if (typeof input === "string") return input.toUpperCase();
  if (typeof input === "number") return input * 2;
  return !input;
}

// Usage
const result1 = processInput("hello"); // string
const result2 = processInput(42);      // number
\`\`\`

## 'this' Typing

\`\`\`typescript
interface User {
  name: string;
  getName: (this: User) => string;
}

const user: User = {
  name: "Alice",
  getName(this: User) {
    return this.name;
  }
};
\`\`\`

## Callback Types

\`\`\`typescript
// Function type
type Callback = (error: Error | null, data: string) => void;

function fetchData(url: string, callback: Callback): void {
  // Implementation
}

// Generic callbacks
function mapArray<T, U>(arr: T[], fn: (item: T, index: number) => U): U[] {
  return arr.map(fn);
}
\`\`\`
`,
    interviewQuestions: [
      {
        question:
          "What are function overloads in TypeScript and why are they useful?",
        answer: `Function overloads allow you to define **multiple type signatures** for a single function. The function behaves differently based on input types, and TypeScript picks the correct return type.

They're useful for:
1. **APIs that accept different input shapes** (e.g., \`Array.find()\` with/without a predicate).
2. **Legacy code migration** where a function was overloaded in JS.
3. **Creating type-safe utility functions**.

The key rule: the implementation signature's types must be compatible with ALL overload signatures. Only the overload signatures are visible to consumers.`,
      },
      {
        question: "How do you type the 'this' keyword in a function?",
        answer: `TypeScript allows you to specify the expected type of \`this\` by adding it as the **first parameter** of a function:

\`\`\`typescript
function handleClick(this: HTMLButtonElement, event: MouseEvent) {
  this.disabled = true; // this is typed as HTMLButtonElement
}

const button = document.querySelector("button")!;
button.addEventListener("click", handleClick);
\`\`\`

In class methods, \`this\` is automatically typed as the class instance. In standalone functions or callbacks, you should explicitly type \`this\` to avoid errors when the function is called in the wrong context.`,
      },
      {
        question:
          "What's the difference between optional parameters and default parameters?",
        answer: `**Optional parameters** (marked with \`?\`) can be \`undefined\` when not provided. You need to check for \`undefined\` before using them.

**Default parameters** automatically provide a fallback value when \`undefined\` is passed (or the parameter is omitted).

\`\`\`typescript
// Optional — could be undefined
function greet(name?: string) {
  // Must check: name could be undefined
  return \`Hello, \${name ?? "Guest"}!\`;
}

// Default — automatically provides fallback
function greetWithDefault(name: string = "Guest"): string {
  return \`Hello, \${name}!\`; // name is always string
}
\`\`\`

Default parameters are more ergonomic because the type is never \`undefined\`. Prefer default parameters over optional when you have a sensible default value.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building an event system where different event types have different data payloads. You need an 'on' function that handles the typing correctly — when listening for a 'userLogin' event, the callback should receive user data; for 'pageView', it should receive page info.",
      task: "Create: (1) EventMap interface mapping event names to payload types, (2) overloaded 'on' function that accepts event name + callback with proper typed parameter, (3) an emit function. Use function overloads to maintain type safety per event.",
      solutionCode:
        '// Event definitions\ninterface EventMap {\n  userLogin: { userId: number; name: string };\n  pageView: { page: string; duration: number };\n  error: { message: string; code: number };\n}\n\ntype EventName = keyof EventMap;\n\n// Overloaded on function\ntype Listener<T> = (data: T) => void;\n\nfunction on(event: "userLogin", callback: Listener<EventMap["userLogin"]>): void;\nfunction on(event: "pageView", callback: Listener<EventMap["pageView"]>): void;\nfunction on(event: "error", callback: Listener<EventMap["error"]>): void;\nfunction on(event: string, callback: (data: any) => void): void {\n  // Implementation registers the listener\n  console.log(`Registered listener for ${event}`);\n}\n\n// Helper type for function signatures\ntype EventCallback<E extends EventName> = (data: EventMap[E]) => void;\n\nfunction emit<E extends EventName>(event: E, data: EventMap[E]): void {\n  console.log(`Emitting ${event}:`, data);\n  // In real code, would call all registered listeners\n}\n\n// Usage — fully type-safe\non("userLogin", (data) => {\n  console.log(data.name.toUpperCase()); // data is {userId: number; name: string}\n});\n\nemit("userLogin", { userId: 1, name: "Alice" });\n\n// Type error if wrong payload\n// emit("userLogin", { page: "/home" }); // Error!\n\n// Type error if wrong callback parameter type\n// on("pageView", (data: string) => {}); // Error!',
    },
  },
  // ==================== TOPIC 4 ====================
  {
    slug: "interfaces-and-types",
    title: "4. Interfaces & Type Aliases Deep Dive",
    order: 4,
    content: `
# Interfaces & Type Aliases Deep Dive

## Interface Basics

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;  // Optional
  readonly createdAt: Date;  // Read-only
}
\`\`\`

## Extending Interfaces

\`\`\`typescript
interface BaseEntity {
  id: number;
  createdAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
}

interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}
\`\`\`

## Type Aliases

\`\`\`typescript
// Primitive types
type ID = string | number;

// Union types
type Status = "active" | "inactive" | "pending";

// Intersection types
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // { name: string; age: number }

// Function types
type Greeter = (name: string) => string;

// Generic types
type Box<T> = { value: T };
\`\`\`

## Interface vs Type Comparison Table

| Feature | Interface | Type |
|---------|-----------|------|
| Object shapes | ✅ | ✅ |
| Primitives/unions | ❌ | ✅ |
| Declaration merging | ✅ | ❌ |
| Extends/intersection | extends | & |
| Computed properties | ❌ | ✅ |
| Mapped types | ❌ | ✅ |

## Index Signatures & Dynamic Keys

\`\`\`typescript
interface StringMap {
  [key: string]: string;
}

const config: StringMap = {
  host: "localhost",
  port: "3000"  // Must be string
};

// Hybrid
interface Dictionary<T> {
  [key: string]: T;
  length: number;  // Must match the index signature type
}
\`\`\`

## Generic Interfaces

\`\`\`typescript
interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is declaration merging in TypeScript interfaces?",
        answer: `Declaration merging occurs when you define the **same interface multiple times** — TypeScript automatically merges all declarations into a single interface with all properties.

\`\`\`typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// User is now { name: string; age: number }
const user: User = { name: "Alice", age: 30 };
\`\`\`

This is useful for:
1. **Extending third-party types** — e.g., adding custom properties to Express's \`Request\` type.
2. **Splitting type definitions** across multiple files.
3. **Library augmentation** — adding types to libraries without modifying their source.

Types do NOT support declaration merging. If you redeclare a type alias, it's an error.`,
      },
      {
        question: "When would you use an interface vs a type alias?",
        answer: `**Use interface when:**
1. Defining object shapes and class contracts.
2. You need declaration merging (extending library types).
3. Building public APIs and libraries.

**Use type when:**
1. Creating union types (\`string | number\`).
2. Creating intersection types (\`A & B\`).
3. Creating mapped or conditional types.
4. Working with primitives (\`type ID = string\`).
5. You need computed properties.

\`\`\`typescript
// Interface for objects
interface User { name: string; }

// Type for everything else
type Status = "active" | "inactive";
type ID = string | number;
type WithTimestamp = { createdAt: Date } & { updatedAt: Date };
\`\`\`

The React team and many library authors prefer interfaces for public APIs and types for internal unions/utilities.`,
      },
      {
        question: "What are index signatures and when would you use them?",
        answer: `Index signatures define the type for **dynamic property access** on objects. They're used when:

1. You don't know the exact property names upfront (e.g., a dictionary).
2. You want to enforce that all properties match a specific type.

\`\`\`typescript
// Dictionary pattern
interface Cache<T> {
  [key: string]: T | undefined;
}

const userCache: Cache<User> = {};
userCache["user-1"] = { id: 1, name: "Alice" };

// CSS properties map
interface CSSMap {
  [key: string]: string | number;
}

const styles: CSSMap = {
  color: "red",
  fontSize: 14,
  backgroundColor: "blue"
};
\`\`\`

**Caveat**: Index signatures make all properties conform to the specified type. You can't have a mix of types unless using a union.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're designing a configuration system for a deployment pipeline. The configuration has base settings that all deployments share, plus environment-specific overrides. You need to represent this type-safely.",
      task: "Create: (1) a BaseConfig interface with host, port, and debug, (2) an EnvironmentConfig that extends BaseConfig and adds environment-specific settings, (3) a DeployConfig type that uses intersection to combine DeploymentTarget (dev/staging/prod) with config, (4) a generic ConfigCache interface using index signatures.",
      solutionCode:
        '// Base config\ninterface BaseConfig {\n  host: string;\n  port: number;\n  debug: boolean;\n}\n\n// Extended config\ninterface EnvironmentConfig extends BaseConfig {\n  database: {\n    url: string;\n    poolSize: number;\n  };\n  cache: {\n    ttl: number;\n    provider: "redis" | "memory";\n  };\n}\n\n// Type for deployment target\ntype DeploymentTarget = "development" | "staging" | "production";\n\n// Intersection type\ntype DeployConfig = {\n  target: DeploymentTarget;\n  version: string;\n  autoRollback: boolean;\n} & EnvironmentConfig;\n\n// Generic cache with index signature\ninterface ConfigCache<T extends BaseConfig> {\n  [environment: string]: T;\n}\n\n// Concrete configs\nconst devConfig: EnvironmentConfig = {\n  host: "localhost",\n  port: 3000,\n  debug: true,\n  database: { url: "localhost:5432/dev", poolSize: 5 },\n  cache: { ttl: 60, provider: "memory" }\n};\n\nconst prodConfig: DeployConfig = {\n  target: "production",\n  version: "1.0.0",\n  autoRollback: true,\n  host: "api.example.com",\n  port: 443,\n  debug: false,\n  database: { url: "prod-db:5432/app", poolSize: 20 },\n  cache: { ttl: 300, provider: "redis" }\n};\n\n// Cache usage\nconst cache: ConfigCache<BaseConfig> = {\n  dev: devConfig,\n  staging: { ...prodConfig, host: "staging.example.com" },\n  prod: prodConfig\n};',
    },
  },
  // ==================== TOPIC 5 ====================
  {
    slug: "union-intersection-narrowing",
    title: "5. Union Types, Intersection Types & Type Narrowing",
    order: 5,
    content: `
# Union Types, Intersection Types & Type Narrowing

## Union Types (OR)

\`\`\`typescript
type StringOrNumber = string | number;

function printId(id: StringOrNumber): void {
  console.log(\`ID: \${id}\`);
}

// Literal union types
type Direction = "north" | "south" | "east" | "west";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Result = "success" | "error" | "pending";

// Union of complex types
type Shape = 
  | { kind: "circle"; radius: number }
  | { kind: "square"; sideLength: number }
  | { kind: "rectangle"; width: number; height: number };
\`\`\`

## Intersection Types (AND)

\`\`\`typescript
interface HasId {
  id: number;
}

interface HasName {
  name: string;
}

type NamedEntity = HasId & HasName;
// { id: number; name: string }

// Combining multiple concerns
type Auditable = {
  createdAt: Date;
  createdBy: string;
};

type SoftDeletable = {
  deletedAt: Date | null;
  deletedBy: string | null;
};

type DatabaseRecord = HasId & Auditable & SoftDeletable;
\`\`\`

## Type Narrowing

\`\`\`typescript
// typeof narrowing
function padLeft(value: string | number): string {
  if (typeof value === "number") {
    return " ".repeat(value);
  }
  return value;
}

// Truthiness narrowing
function getLength(value: string | null | undefined): number {
  // null and undefined are falsy
  return value?.length ?? 0;
}

// Equality narrowing
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // Both must be string here
    console.log(x.toUpperCase());
  }
}

// 'in' operator narrowing
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim(); // TypeScript knows it's Fish
  } else {
    animal.fly(); // TypeScript knows it's Bird
  }
}
\`\`\`

## Discriminated Unions

\`\`\`typescript
type ApiState<T> = 
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function handleState<T>(state: ApiState<T>): string {
  switch (state.status) {
    case "loading":
      return "Loading...";
    case "success":
      return \`Data: \${JSON.stringify(state.data)}\`;
    case "error":
      return \`Error: \${state.error}\`;
  }
}
\`\`\`

## User-Defined Type Guards

\`\`\`typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is a discriminated union and how does it work?",
        answer: `A **discriminated union** is a union of types that share a common property (the "discriminant"). TypeScript uses this common property to narrow down which type is in use.

\`\`\`typescript
// Each type has a 'status' property as discriminant
type RequestState<T> = 
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };
\`\`\`

Benefits:
1. **Exhaustive checking** — TypeScript ensures all cases are handled in a switch.
2. **Automatic narrowing** — once you check the discriminant, TypeScript knows the shape.
3. **Type-safe state machines** — perfect for modeling async states (loading/success/error).

This pattern is used extensively in Redux reducers, React Query results, and state machines.`,
      },
      {
        question:
          "What is type narrowing and what techniques does TypeScript support?",
        answer: `Type narrowing is TypeScript's ability to **reduce a broader type to a more specific type** within a code block based on runtime checks. Techniques include:

1. **\`typeof\` guards**: For primitives (\`typeof x === "string"\`).
2. **\`instanceof\` guards**: For class instances (\`x instanceof Date\`).
3. **Truthiness narrowing**: Filtering out null/undefined/0/"".
4. **Equality narrowing**: \`if (x === y)\` narrows both.
5. **\`in\` operator**: Checking for property existence.
6. **Discriminated unions**: switch on a literal property.
7. **Custom type predicates**: \`function isFish(x): x is Fish\`.

TypeScript's control flow analysis is sophisticated enough that it can narrow types through multiple conditions and even backwards through logical operators (\`&&\`, \`||\`).`,
      },
      {
        question:
          "What is a type predicate and how do you create a custom type guard?",
        answer: `A **type predicate** is a return type annotation on a function that tells TypeScript what type a value is when the function returns \`true\`.

\`\`\`typescript
// Without type predicate
function isFish(pet: Fish | Bird): boolean {
  return (pet as Fish).swim !== undefined;
}

// With type predicate — TypeScript narrows the type
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Usage — the type is narrowed in the if block
function handlePet(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows pet is Fish here
  }
}
\`\`\`

The \`pet is Fish\` syntax is the type predicate. It must return a boolean. When \`true\`, TypeScript narrows the parameter type. This is incredibly useful for complex validation scenarios and working with third-party data.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building a real-time data dashboard that fetches data from multiple sources. Each data source has different response shapes, and the UI needs to display different components based on the state (loading, success with data, error).",
      task: "Create: (1) a discriminated union DashboardState with 'loading', 'success' (with different data shapes for temperature, stocks, news), and 'error' states, (2) a renderDashboard function that uses discriminated union narrowing with switch, (3) custom type guards for each data type.",
      solutionCode:
        '// Discriminated union for different data types\ninterface TemperatureData {\n  type: "temperature";\n  celsius: number;\n  humidity: number;\n}\n\ninterface StockData {\n  type: "stocks";\n  symbol: string;\n  price: number;\n  change: number;\n}\n\ninterface NewsData {\n  type: "news";\n  headline: string;\n  source: string;\n  timestamp: Date;\n}\n\ntype DashboardData = TemperatureData | StockData | NewsData;\n\n// Discriminated union for state\ntype DashboardState = \n  | { status: "loading" }\n  | { status: "success"; data: DashboardData }\n  | { status: "error"; error: string };\n\n// Custom type guards\nfunction isTemperatureData(data: DashboardData): data is TemperatureData {\n  return data.type === "temperature";\n}\n\nfunction isStockData(data: DashboardData): data is StockData {\n  return data.type === "stocks";\n}\n\nfunction isNewsData(data: DashboardData): data is NewsData {\n  return data.type === "news";\n}\n\n// Render function with exhaustive narrowing\nfunction renderDashboard(state: DashboardState): string {\n  switch (state.status) {\n    case "loading":\n      return "<div>Loading dashboard data...</div>";\n    \n    case "error":\n      return `<div class="error">Error: ${state.error}</div>`;\n    \n    case "success":\n      const data = state.data;\n      \n      // Use type guards for detailed rendering\n      if (isTemperatureData(data)) {\n        return `<div class="widget temperature">\n          <h3>Temperature</h3>\n          <p>${data.celsius}°C / Humidity: ${data.humidity}%</p>\n        </div>`;\n      } else if (isStockData(data)) {\n        const changeClass = data.change >= 0 ? "positive" : "negative";\n        return `<div class="widget stock">\n          <h3>${data.symbol}</h3>\n          <p>$${data.price.toFixed(2)} <span class="${changeClass}">${data.change > 0 ? "+" : ""}${data.change}%</span></p>\n        </div>`;\n      } else {\n        return `<div class="widget news">\n          <h3>${data.headline}</h3>\n          <p>Source: ${data.source}</p>\n        </div>`;\n      }\n  }\n}\n\n// Usage\nconst states: DashboardState[] = [\n  { status: "loading" },\n  { status: "success", data: { type: "temperature", celsius: 24, humidity: 65 } },\n  { status: "error", error: "Failed to fetch stock data" },\n  { status: "success", data: { type: "stocks", symbol: "AAPL", price: 175.50, change: 1.25 } }\n];\n\nstates.forEach(s => console.log(renderDashboard(s)));',
    },
  },
  // ==================== TOPIC 6 ====================
  {
    slug: "generics",
    title: "6. Generics — Reusable & Type-Safe Code",
    order: 6,
    content: `
# Generics — Reusable & Type-Safe Code

## What are Generics?

Generics allow you to create **type-safe, reusable components** that work with multiple types rather than a single one. They're like "variables for types."

## Basic Generic Functions

\`\`\`typescript
// Identity function — returns whatever type is passed in
function identity<T>(arg: T): T {
  return arg;
}

const result1 = identity<string>("hello"); // Explicit
const result2 = identity(42); // Inferred as number
\`\`\`

## Generic Constraints

\`\`\`typescript
// Constrain T to types that have a .length property
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(arg: T): number {
  console.log(arg.length);
  return arg.length;
}

logLength("hello");   // OK — string has length
logLength([1, 2, 3]); // OK — array has length
// logLength(42);      // Error — number doesn't have length
\`\`\`

## Generic Interfaces & Types

\`\`\`typescript
// Generic interface
interface ApiResponse<T> {
  status: number;
  data: T;
  message?: string;
}

// Generic type alias
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Generic class
class Stack<T> {
  private items: T[] = [];
  
  push(item: T): void {
    this.items.push(item);
  }
  
  pop(): T | undefined {
    return this.items.pop();
  }
}
\`\`\`

## Multiple Type Parameters

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", email: "alice@example.com" };
const name = getProperty(user, "name"); // string
// getProperty(user, "age"); // Error — 'age' not in keyof User
\`\`\`

## Generic Constraints with keyof

\`\`\`typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key]);
}

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" }
];

const names = pluck(users, "name"); // string[]
const ids = pluck(users, "id");     // number[]
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What are generics and why are they important in TypeScript?",
        answer: `Generics allow you to write **type-safe, reusable code** that works with any type while maintaining type information. Without generics, you'd have to use \`any\` and lose type safety.

\`\`\`typescript
// Without generics — type unsafe
function identity(arg: any): any {
  return arg;
}

// With generics — maintains type safety
function identity<T>(arg: T): T {
  return arg;
}

const num = identity(42); // TypeScript knows num is number
const str = identity(\"hello\"); // TypeScript knows str is string
\`\`\`

Generics are essential for building reusable libraries, data structures, and utility functions. They're used throughout React (\`useState<T>\`), TypeScript's utility types (\`Pick<T, K>\`), and everyday patterns like \`Promise<T>\`.`,
      },
      {
        question:
          "What are generic constraints and how do you use the 'extends' keyword with generics?",
        answer: `Generic constraints restrict what types can be used with a generic by requiring the type to extend a certain shape.

\`\`\`typescript
// Constrain to objects with an id property
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// T must have 'id' — any object with id works
findById([{ id: 1, name: \"Alice\" }, { id: 2, name: \"Bob\" }], 1);

// Combined with keyof
function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
\`\`\`

The \`extends\` keyword here doesn't mean class inheritance — it means **"is assignable to"** or **"satisfies"**. The constrained type must have at least the properties of the constraint.`,
      },
      {
        question: "How does the 'keyof' operator work with generics?",
        answer: `\`keyof T\` produces a **union of all keys** of type \`T\`. When combined with generics, it enables type-safe property access.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 'keyof User' produces: "id" | "name" | "email"
type UserKeys = keyof User;

// Generic function to safely update any property
function updateField<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const user: User = { id: 1, name: \"Alice\", email: \"alice@test.com\" };
const updated = updateField(user, \"name\", \"Bob\"); // OK
// updateField(user, \"age\", 30); // Error! 'age' is not a key of User
\`\`\`

This pattern is extremely useful for type-safe form handlers, database update functions, and Redux reducer actions.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building a generic API client that can fetch and transform data from different endpoints. Each endpoint returns different data shapes (users, products, orders). You need a generic fetch function that ensures type safety without code duplication.",
      task: "Create: (1) a generic ApiClient class with methods get<T>, post<T>, put<T>, (2) a generic response wrapper ApiResponse<T> with status and data, (3) a transform function that maps responses using a generic mapper function, (4) use keyof constraints for safe field updates.",
      solutionCode:
        '// Generic response wrapper\ninterface ApiResponse<T> {\n  status: number;\n  data: T;\n  timestamp: string;\n}\n\n// Generic pagination\ntype PaginatedResponse<T> = ApiResponse<T[]> & {\n  total: number;\n  page: number;\n  pageSize: number;\n};\n\n// Generic API Client\nclass ApiClient {\n  private baseUrl: string;\n\n  constructor(baseUrl: string) {\n    this.baseUrl = baseUrl;\n  }\n\n  async get<T>(endpoint: string): Promise<ApiResponse<T>> {\n    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);\n    const data = await response.json();\n    return { status: response.status, data: data as T, timestamp: new Date().toISOString() };\n  }\n\n  async post<T, U>(endpoint: string, body: U): Promise<ApiResponse<T>> {\n    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {\n      method: "POST",\n      body: JSON.stringify(body),\n      headers: { "Content-Type": "application/json" }\n    });\n    const data = await response.json();\n    return { status: response.status, data: data as T, timestamp: new Date().toISOString() };\n  }\n}\n\n// Generic transform utility\nfunction transformResponse<T, U>(\n  response: ApiResponse<T>,\n  mapper: (data: T) => U\n): ApiResponse<U> {\n  return {\n    ...response,\n    data: mapper(response.data)\n  };\n}\n\n// Safe field update with keyof constraint\nfunction safeUpdate<T extends Record<string, unknown>, K extends keyof T>(\n  obj: T,\n  updates: Partial<Pick<T, K>>\n): T {\n  return { ...obj, ...updates };\n}\n\n// Usage examples\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n}\n\ninterface Product {\n  id: number;\n  title: string;\n  price: number;\n}\n\nasync function main() {\n  const api = new ApiClient("https://api.example.com");\n\n  // Type-safe API calls\n  const users = await api.get<User[]>("/users");\n  const product = await api.get<Product>("/products/1");\n  const newUser = await api.post<User, Omit<User, "id">>("/users", {\n    name: "Alice",\n    email: "alice@example.com"\n  });\n\n  // Transform data\n  const userNames = transformResponse(users, (users) =>\n    users.map(u => u.name)\n  );\n\n  // Safe update\n  const user: User = { id: 1, name: "Alice", email: "a@b.com" };\n  const updated = safeUpdate(user, { name: "Bob" });\n}',
    },
  },
  // ==================== TOPIC 7 ====================
  {
    slug: "utility-types",
    title: "7. Utility Types — Built-in Type Transformations",
    order: 7,
    content: `
# Utility Types — Built-in Type Transformations

TypeScript provides several global utility types to make common type transformations easier.

## Partial & Required

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
}

// All properties become optional — great for updates
type UpdateUserPayload = Partial<User>;

// All properties become required
type RequiredUser = Required<UpdateUserPayload>;
\`\`\`

## Pick & Omit

\`\`\`typescript
// Pick specific properties
type PublicUser = Pick<User, "id" | "name" | "email">;

// Omit specific properties
type SafeUser = Omit<User, "passwordHash">;

// Practical: creating a new user (omit id and hash)
type CreateUserPayload = Omit<User, "id" | "passwordHash">;
\`\`\`

## Record & Readonly

\`\`\`typescript
// Record — creates an object type with specific keys and values
type Role = "admin" | "user" | "guest";
type RolePermissions = Record<Role, string[]>;

const permissions: RolePermissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"]
};

// Readonly — makes all properties immutable
type FrozenUser = Readonly<User>;
\`\`\`

## ReturnType & Parameters

\`\`\`typescript
function createUser(name: string, age: number): User {
  return { id: Date.now(), name, age };
}

// Extract return type of a function
type CreateUserReturn = ReturnType<typeof createUser>;

// Extract parameter types as a tuple
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, age: number]
\`\`\`

## Exclude, Extract & NonNullable

\`\`\`typescript
type Status = "active" | "inactive" | "pending" | "deleted";

// Exclude specific members from a union
type ActiveStatus = Exclude<Status, "deleted">;
// "active" | "inactive" | "pending"

// Extract specific members from a union
type TerminalStatus = Extract<Status, "active" | "deleted">;
// "active" | "deleted"

// Remove null and undefined from a type
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string
\`\`\`

## Awaited

\`\`\`typescript
type PromiseData = Awaited<Promise<Promise<string>>>;
// string — unwraps nested promises
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is the difference between Pick<T, K> and Omit<T, K>?",
        answer: `**\`Pick<T, K>\`** creates a type by **selecting** specific keys \`K\` from \`T\`. **\`Omit<T, K>\`** creates a type by **removing** specific keys \`K\` from \`T\`.

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// Pick only the fields we want to expose
type PublicProfile = Pick<User, \"id\" | \"name\" | \"email\">;

// Omit the fields we don't want
type UserWithoutSensitiveData = Omit<User, \"passwordHash\">;

// Both achieve similar results from opposite directions
// Pick says \"keep these\"
// Omit says \"drop these\"
\`\`\`

Choose \`Pick\` when you want to keep a few fields from a large interface. Choose \`Omit\` when you want to exclude a few fields.`,
      },
      {
        question: "How does Record<K, V> work and when would you use it?",
        answer: `\`Record<K, V>\` creates an object type where the keys are \`K\` and the values are \`V\`. It's perfect for creating **dictionaries, maps, or lookup tables**.

\`\`\`typescript
// Dictionary with string keys
type UserCache = Record<string, User>;

// Enum-like keys with typed values
type HttpHeaders = Record<string, string>;
type ApiEndpoints = Record<\"/users\" | \"/products\" | \"/orders\", string>;

// Practical use: configuration maps
type Environment = \"development\" | \"staging\" | \"production\";
type EnvironmentConfig = Record<Environment, {
  apiUrl: string;
  debug: boolean;
}>;

const configs: EnvironmentConfig = {
  development: { apiUrl: \"http://localhost:3000\", debug: true },
  staging: { apiUrl: \"https://staging.example.com\", debug: true },
  production: { apiUrl: \"https://api.example.com\", debug: false }
};
\`\`\`

Benefits over index signatures: \`Record\` gives you compile-time checking of keys, whereas an index signature accepts any string.`,
      },
      {
        question: "What does the Awaited<T> utility type do?",
        answer: `\`Awaited<T>\` **unwraps promises recursively**. It's useful when you have nested promises or want the resolved type of an async function.

\`\`\`typescript
// Basic unwrapping
type PromiseResult = Awaited<Promise<string>>; // string

// Nested promises
type NestedResult = Awaited<Promise<Promise<number>>>; // number

// Practical: getting return type of an async function
async function fetchUser(id: number) {
  const response = await fetch(\`/api/users/\${id}\`);
  return response.json() as Promise<User>;
}

// Without Awaited: Promise<User>
type RawReturn = ReturnType<typeof fetchUser>;

// With Awaited: User
type ActualReturn = Awaited<ReturnType<typeof fetchUser>>;
\`\`\`

Introduced in TypeScript 4.5, it's essential when working with Promises and async operations.`,
      },
    ],
    practicalTask: {
      scenario:
        "You need to build a type-safe configuration system for a microservices architecture. Each service has its own config, but they share common patterns. You need to transform these configs for different environments, create API response types, and ensure type safety.",
      task: "Create: (1) a ServiceConfig interface with common fields, (2) use Pick/Omit to create specialized configs per service, (3) use Record to create an environment config map, (4) use ReturnType to extract types from async functions, (5) use NonNullable for null-safe access patterns.",
      solutionCode:
        '// Base interfaces\ninterface ServiceConfig {\n  name: string;\n  port: number;\n  database: { url: string; pool: number } | null;\n  cache: { ttl: number; provider: "redis" | "memory" };\n  features: string[];\n  apiKey?: string;\n}\n\n// Specialized configs using Pick/Omit\n// Auth service doesn\'t need database config\ntype AuthServiceConfig = Omit<ServiceConfig, "database"> & {\n  jwtSecret: string;\n  tokenExpiry: number;\n};\n\n// Public API config — only expose non-sensitive fields\ntype PublicServiceInfo = Pick<ServiceConfig, "name" | "port" | "features">;\n\n// Min/max connections per service\ninterface ConnectionLimits {\n  min: number;\n  max: number;\n}\n\n// Environment configuration map\nenum Environment {\n  Development = "development",\n  Staging = "staging",\n  Production = "production"\n}\n\ntype EnvConfigs = Record<Environment, {\n  logging: boolean;\n  maxConnections: number;\n  connectionLimits: ConnectionLimits;\n}>;\n\n// Demo async function\nasync function loadServiceConfig(env: Environment): Promise<ServiceConfig> {\n  return {\n    name: "api-gateway",\n    port: env === Environment.Production ? 443 : 3000,\n    database: { url: `\${env}-db:5432/app`, pool: env === Environment.Production ? 20 : 5 },\n    cache: { ttl: env === Environment.Production ? 300 : 60, provider: "redis" },\n    features: ["auth", "logging", "metrics"]\n  };\n}\n\n// Extract types using ReturnType and Awaited\ntype LoadServiceConfigFn = typeof loadServiceConfig;\ntype LoadServiceConfigReturn = Awaited<ReturnType<LoadServiceConfigFn>>;\n\n// Usage\nasync function bootstrap() {\n  const env: Environment = Environment.Development;\n  \n  const envConfigs: EnvConfigs = {\n    [Environment.Development]: {\n      logging: true,\n      maxConnections: 10,\n      connectionLimits: { min: 1, max: 5 }\n    },\n    [Environment.Staging]: {\n      logging: true,\n      maxConnections: 50,\n      connectionLimits: { min: 2, max: 20 }\n    },\n    [Environment.Production]: {\n      logging: false,\n      maxConnections: 200,\n      connectionLimits: { min: 5, max: 100 }\n    }\n  };\n\n  const config = await loadServiceConfig(env);\n  \n  // Safe access using NonNullable pattern\n  const dbUrl = config.database !== null \n    ? config.database.url \n    : "No database configured";\n    \n  console.log(dbUrl);\n}\n\n// Auth service config\nconst authConfig: AuthServiceConfig = {\n  name: "auth-service",\n  port: 4001,\n  cache: { ttl: 60, provider: "memory" },\n  features: ["login", "signup", "oauth"],\n  jwtSecret: "super-secret-key",\n  tokenExpiry: 3600\n};',
    },
  },
  // ==================== TOPIC 8 ====================
  {
    slug: "classes-and-modifiers",
    title: "8. Classes, Access Modifiers & Abstract Classes",
    order: 8,
    content: `
# Classes, Access Modifiers & Abstract Classes

## Class Members & Access Modifiers

\`\`\`typescript
class User {
  // Properties
  public name: string;        // Accessible everywhere
  private password: string;    // Only within this class
  protected role: string;     // Within class and subclasses
  readonly id: number;        // Can only be set in constructor
  
  // Static property — shared across all instances
  static totalUsers: number = 0;
  
  // Constructor shorthand
  constructor(
    public email: string,      // Automatically creates and assigns this.email
    private _age: number,      // Private with constructor shorthand
    role: string = "user"
  ) {
    this.name = "";
    this.password = "";
    this.role = role;
    this.id = User.totalUsers + 1;
    User.totalUsers++;
  }
  
  // Methods
  public getAge(): number {
    return this._age;
  }
  
  private hashPassword(pw: string): string {
    return \`hashed-\${pw}\`;
  }
  
  setPassword(pw: string): void {
    this.password = this.hashPassword(pw);
  }
  
  // Static method
  static createAnonymous(): User {
    return new User("anonymous@example.com", 0, "guest");
  }
}
\`\`\`

## Getters & Setters

\`\`\`typescript
class Employee {
  private _salary: number = 0;
  
  get salary(): number {
    return this._salary;
  }
  
  set salary(value: number) {
    if (value < 0) throw new Error("Salary cannot be negative");
    this._salary = value;
  }
}
\`\`\`

## Abstract Classes

\`\`\`typescript
abstract class DatabaseService {
  // Concrete method — shared implementation
  protected logQuery(query: string): void {
    console.log(\`[DB]: \${query}\`);
  }
  
  // Abstract methods — subclasses MUST implement
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract query<T>(sql: string): Promise<T[]>;
}

class PostgresService extends DatabaseService {
  async connect(): Promise<void> {
    this.logQuery("Connecting to PostgreSQL...");
  }
  
  async disconnect(): Promise<void> {
    this.logQuery("Disconnecting...");
  }
  
  async query<T>(sql: string): Promise<T[]> {
    return []; // Implementation
  }
}
\`\`\`

## implements vs extends

\`\`\`typescript
interface Loggable {
  log(message: string): void;
}

interface Serializable {
  serialize(): string;
}

// A class can implement multiple interfaces
class Logger implements Loggable, Serializable {
  log(message: string): void {
    console.log(message);
  }
  
  serialize(): string {
    return JSON.stringify(this);
  }
}
\`\`\`
`,
    interviewQuestions: [
      {
        question:
          "What is the difference between 'private', 'protected', and 'public' in TypeScript classes?",
        answer: `These are **access modifiers** that control visibility:

- **\`public\`** (default): Accessible from anywhere — inside and outside the class.
- **\`private\`**: Accessible **only within the class** itself. Not accessible in subclasses.
- **\`protected\`**: Accessible within the class and its subclasses, but NOT from external code.

\`\`\`typescript
class Base {
  public a = 1;      // Anyone can access
  private b = 2;    // Only Base can access
  protected c = 3;  // Base and subclasses can access
}

class Derived extends Base {
  example() {
    console.log(this.a); // OK
    // console.log(this.b); // Error! private
    console.log(this.c); // OK — protected
  }
}

const obj = new Base();
console.log(obj.a); // OK
// console.log(obj.b); // Error!
// console.log(obj.c); // Error!
\`\`\`

Note: These are compile-time only. At runtime, they don't enforce privacy in JavaScript (use \`#\` for true runtime privacy).`,
      },
      {
        question: "What are abstract classes and when would you use them?",
        answer: `**Abstract classes** are base classes that **cannot be instantiated** directly. They define a shared contract and partial implementation that subclasses must complete.

Use abstract classes when:
1. You want to provide **shared implementation** (concrete methods) that all subclasses inherit.
2. You want to **force subclasses to implement** certain methods (abstract methods).
3. You're implementing the **Template Method pattern** — define a skeleton algorithm, let subclasses fill in details.

\`\`\`typescript
abstract class ReportGenerator {
  // Template method — defines the algorithm skeleton
  generateReport(): string {
    const data = this.fetchData();
    const formatted = this.formatData(data);
    return this.export(formatted);
  }
  
  protected abstract fetchData(): unknown[];
  protected abstract formatData(data: unknown[]): string;
  protected abstract export(content: string): string;
}
\`\`\`

Difference from interfaces: interfaces only define the shape (no implementation), abstract classes can have implementation AND abstract methods.`,
      },
      {
        question: "What is the difference between 'extends' and 'implements'?",
        answer: `- **\`extends\`**: A class inherits from another class (including its implementation). Can only extend one class.
- **\`implements\`**: A class agrees to fulfill a contract defined by an interface. Can implement multiple interfaces.

\`\`\`typescript
interface Flyable { fly(): void; }
interface Swimmable { swim(): void; }

class Bird {
  chirp() { console.log(\"chirp\"); }
}

// Extends one class, implements multiple interfaces
class Duck extends Bird implements Flyable, Swimmable {
  fly() { console.log(\"flying\"); }
  swim() { console.log(\"swimming\"); }
  // Inherits chirp() from Bird automatically
}
\`\`\`

Think of \`extends\` as "inherits behavior" and \`implements\` as "promises to fulfill a contract."`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building a notification system that supports multiple channels (Email, SMS, Push). Each channel has a common interface (send notification) but different implementations. You need to enforce the contract while sharing common logic (logging, rate limiting).",
      task: "Create: (1) an abstract NotificationProvider class with shared logic (log, rateLimit) and abstract method send, (2) EmailProvider and SMSProvider that extend it, (3) a NotificationManager class that uses the providers, (4) use access modifiers properly — private for internal state, protected for shared methods, public for the API.",
      solutionCode:
        '// Abstract base class\nabstract class NotificationProvider {\n  protected providerName: string;\n  private sentCount: number = 0;\n  private readonly MAX_RETRIES: number = 3;\n\n  constructor(providerName: string) {\n    this.providerName = providerName;\n  }\n\n  // Abstract method — each provider must implement\n  abstract send(recipient: string, message: string): Promise<boolean>;\n\n  // Shared concrete method\n  protected log(message: string): void {\n    console.log(`[${this.providerName}] ${message}`);\n  }\n\n  // Rate limiting check\n  protected canSend(): boolean {\n    return this.sentCount < 100; // Max 100 per instance\n  }\n\n  // Public API with retry logic\n  async sendWithRetry(recipient: string, message: string): Promise<boolean> {\n    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {\n      try {\n        if (!this.canSend()) {\n          throw new Error("Rate limit exceeded");\n        }\n        \n        const result = await this.send(recipient, message);\n        \n        if (result) {\n          this.sentCount++;\n          this.log(`Sent to ${recipient} (attempt ${attempt})`);\n          return true;\n        }\n      } catch (error) {\n        this.log(`Failed attempt ${attempt}: ${error}`);\n        if (attempt === this.MAX_RETRIES) {\n          throw error;\n        }\n      }\n    }\n    return false;\n  }\n\n  // Static factory method\n  static getSentCount(provider: NotificationProvider): number {\n    return (provider as any).sentCount;\n  }\n}\n\n// Email provider\nclass EmailProvider extends NotificationProvider {\n  constructor(private apiKey: string) {\n    super("Email");\n  }\n\n  async send(recipient: string, message: string): Promise<boolean> {\n    // Simulated email sending\n    this.log(`Sending email to ${recipient}: ${message.substring(0, 50)}...`);\n    return true;\n  }\n}\n\n// SMS provider\nclass SMSProvider extends NotificationProvider {\n  constructor() {\n    super("SMS");\n  }\n\n  async send(recipient: string, message: string): Promise<boolean> {\n    if (message.length > 160) {\n      throw new Error("SMS message exceeds 160 characters");\n    }\n    this.log(`Sending SMS to ${recipient}`);\n    return true;\n  }\n}\n\n// Notification manager\nclass NotificationManager {\n  private providers: Map<string, NotificationProvider> = new Map();\n\n  registerProvider(name: string, provider: NotificationProvider): void {\n    this.providers.set(name, provider);\n  }\n\n  async send(\n    providerName: string,\n    recipient: string,\n    message: string\n  ): Promise<boolean> {\n    const provider = this.providers.get(providerName);\n    if (!provider) {\n      throw new Error(`Provider ${providerName} not found`);\n    }\n    return provider.sendWithRetry(recipient, message);\n  }\n}\n\n// Usage\nconst manager = new NotificationManager();\nmanager.registerProvider("email", new EmailProvider("sk-123"));\nmanager.registerProvider("sms", new SMSProvider());\n\nasync function run() {\n  await manager.send("email", "user@example.com", "Welcome to our platform!");\n  await manager.send("sms", "+1234567890", "Your code is 12345");\n}',
    },
  },
  // ==================== TOPIC 9 ====================
  {
    slug: "mapped-and-conditional-types",
    title: "9. Mapped Types & Conditional Types",
    order: 9,
    content: `
# Mapped Types & Conditional Types

## Mapped Types — Transforming Properties

\`\`\`typescript
// Basic mapped type — makes all properties optional
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// Makes all properties readonly
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// Makes all properties nullable
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

// Practical: make all properties writable (remove readonly)
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
\`\`\`

## Conditional Types — Type-Level Logic

\`\`\`typescript
// Basic conditional type
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<string>;  // "yes"
type B = IsString<number>;  // "no"

// Extracting types
type ExtractArrayType<T> = T extends Array<infer U> ? U : T;

type Str = ExtractArrayType<string[]>;  // string
type Num = ExtractArrayType<number>;    // number (not an array)

// Deep conditional — unwrap Promise
type Unwrap<T> = T extends Promise<infer U> ? Unwrap<U> : T;

type Result = Unwrap<Promise<Promise<string>>>;  // string
\`\`\`

## The 'infer' Keyword

\`\`\`typescript
// Extract return type from any function
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Extract parameter types
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

function greet(name: string, age: number): string {
  return \`\${name} is \${age} years old\`;
}

type GreetReturn = MyReturnType<typeof greet>;  // string
type GreetParams = MyParameters<typeof greet>;  // [string, number]
\`\`\`

## Template Literal Types

\`\`\`typescript
type EventName = "click" | "focus" | "blur";
type HandlerName = \`on\${Capitalize<EventName>}\`;
// "onClick" | "onFocus" | "onBlur"

type Color = "red" | "blue";
type Size = "sm" | "md" | "lg";
type ColorSize = \`\${Color}-\${Size}\`;
// "red-sm" | "red-md" | "red-lg" | "blue-sm" | "blue-md" | "blue-lg"
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What are mapped types and how do they work?",
        answer: `Mapped types **iterate over the keys of a type** and create a new type by transforming each property. They're like \`.map()\` for types.

\`\`\`typescript
type MappedType<T> = {
  [Property in keyof T]: TransformedType;
};

// Example: make all properties optional and nullable
type Flexible<T> = {
  [P in keyof T]?: T[P] | null;
};

interface User { name: string; age: number; }
type FlexibleUser = Flexible<User>;
// { name?: string | null; age?: number | null; }
\`\`\`

You can use modifiers like \`?.\`, \`readonly\`, \`-?\`, \`-readonly\` to add or remove modifiers. The \`as\` clause (TS 4.1+) lets you remap keys:

\`\`\`typescript
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
\`\`\``,
      },
      {
        question:
          "What are conditional types and how does the 'infer' keyword work?",
        answer: `Conditional types use **ternary logic at the type level**: \`T extends U ? X : Y\`. They evaluate different types based on a condition.

The \`infer\` keyword, used within conditional types, **declares a type variable** that captures a type from within the condition:

\`\`\`typescript
// Extract the element type from an array
type ElementType<T> = T extends Array<infer E> ? E : T;

type Nums = ElementType<number[]>;    // number
type SingleStr = ElementType<string>; // string

// Extract the resolved type from a Promise
type PromiseValue<T> = T extends Promise<infer V> ? V : T;

type Result = PromiseValue<Promise<string>>; // string
\`\`\`

\`infer\` is essential for extracting types from complex structures — like return types from functions (\`ReturnType<T>\` uses \`infer\` internally).`,
      },
      {
        question:
          "What are template literal types and how do they enable type-safe strings?",
        answer: `Template literal types allow you to **manipulate string types** at the type level, similar to JavaScript template literals but for types.

\`\`\`typescript
type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";

// Generate all combinations
type Position = \`\${Vertical}-\${Horizontal}\`;
// "top-left" | "top-right" | "bottom-left" | "bottom-right"

// With intrinsic string manipulation types
type CSSProperty = "background-color" | "font-size";
type CSSValue = string | number;
type CSSDeclaration = \`\${CSSProperty}: \${CSSValue}\`;

// Practical: create event handler names from events
type Events = "click" | "hover" | "focus";
type EventHandlers = \`on\${Capitalize<Events>}\`;
// "onClick" | "onHover" | "onFocus"
\`\`\`

They are extensively used in:
- CSS-in-JS libraries (typed theme objects)
- GraphQL code generation
- API client generation
- Event emitter typing`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building an ORM-like library that needs to: (1) make fields optional for updates (Partial), (2) create readonly views for pure data, (3) extract return types from query methods, (4) create typed getter methods from model fields using template literals.",
      task: "Create: (1) a model interface User, (2) mapped types MakeOptional<T> and MakeReadonly<T>, (3) a conditional type ExtractPromise<T> that unwraps promises, (4) a template literal type Getters<T> that generates 'getFieldName' methods for each property.",
      solutionCode:
        '// Model\ninterface User {\n  id: number;\n  name: string;\n  email: string;\n  createdAt: Date;\n  updatedAt: Date | null;\n}\n\n// Custom Partial using mapped types\ntype MyPartial<T> = {\n  [P in keyof T]?: T[P];\n};\n\n// Readonly using mapped types\ntype MyReadonly<T> = {\n  readonly [P in keyof T]: T[P];\n};\n\n// Make writable (remove readonly)\ntype Mutable<T> = {\n  -readonly [P in keyof T]: T[P];\n};\n\n// Conditional type to unwrap promises\ntype ExtractPromise<T> = T extends Promise<infer U> ? U : T;\n\n// Conditional type for array elements\ntype ArrayElement<T> = T extends Array<infer E> ? E : T;\n\n// Template literal: generate getter names from properties\ntype GetterName<P extends string> = `get${Capitalize<P>}`;\n\n// Create getter type map\ntype Getters<T> = {\n  [K in keyof T as GetterName<string & K>]: () => T[K];\n};\n\n// Full User type with getters\ntype UserWithGetters = User & Getters<User>;\n\n// Type-level tests\nfunction testTypes() {\n  // Update payload — all optional\n  const update: MyPartial<User> = {\n    name: "Alice"  // Only fields we want to change\n  };\n\n  // Readonly view\n  const readonlyUser: MyReadonly<User> = {\n    id: 1,\n    name: "Alice",\n    email: "a@b.com",\n    createdAt: new Date(),\n    updatedAt: null\n  };\n  // readonlyUser.name = "Bob"; // Error!\n\n  // Promise extraction\n  type UserPromise = ExtractPromise<Promise<User>>;\n  // User\n\n  // Array element extraction\n  type UserElement = ArrayElement<User[]>;\n  // User\n\n  // Getter type\n  const userWithGetters: UserWithGetters = {\n    id: 1,\n    name: "Alice",\n    email: "a@b.com",\n    createdAt: new Date(),\n    updatedAt: null,\n    getId: () => 1,\n    getName: () => "Alice",\n    getEmail: () => "a@b.com",\n    getCreatedAt: () => new Date(),\n    getUpdatedAt: () => null\n  };\n\n  return { update, readonlyUser, userWithGetters };\n}',
    },
  },
  // ==================== TOPIC 10 ====================
  {
    slug: "advanced-patterns",
    title: "10. Advanced Patterns & Real-World TypeScript",
    order: 10,
    content: `
# Advanced Patterns & Real-World TypeScript

## Branded Types — Nominal Typing Simulation

\`\`\`typescript
// TypeScript uses structural typing, but sometimes we need nominal typing
type Brand<K, T> = K & { __brand: T };

type UserId = Brand<number, "UserId">;
type PostId = Brand<number, "PostId">;
type Email = Brand<string, "Email">;

function getUser(id: UserId): User { /* ... */ }
function getPost(id: PostId): Post { /* ... */ }

const userId = 1 as UserId;
const postId = 2 as PostId;

getUser(userId); // OK
// getUser(postId); // Error! PostId not assignable to UserId
\`\`\`

## The Builder Pattern

\`\`\`typescript
class QueryBuilder<T> {
  private conditions: string[] = [];
  private orderField: string | null = null;
  private limitCount: number | null = null;

  where(field: keyof T & string, value: unknown): this {
    this.conditions.push(\`\${field} = '\${value}'\`);
    return this;
  }

  orderBy(field: keyof T & string, dir: "ASC" | "DESC" = "ASC"): this {
    this.orderField = \`\${field} \${dir}\`;
    return this;
  }

  limit(count: number): this {
    this.limitCount = count;
    return this;
  }

  build(): string {
    let query = \`SELECT * FROM \${this.getTableName()}\`;
    if (this.conditions.length) query += " WHERE " + this.conditions.join(" AND ");
    if (this.orderField) query += " ORDER BY " + this.orderField;
    if (this.limitCount) query += " LIMIT " + this.limitCount;
    return query;
  }

  private getTableName(): string {
    return "items";
  }
}
\`\`\`

## The Singleton Pattern

\`\`\`typescript
class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private connected: boolean = false;

  private constructor() {} // Prevent external instantiation

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect(): Promise<void> {
    this.connected = true;
  }
}

// Usage
const db = DatabaseConnection.getInstance();
\`\`\`

## Type Safety for API Responses

\`\`\`typescript
type ApiResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: string };

async function fetchJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: \`HTTP \${res.status}\` };
    const data = await res.json();
    return { ok: true, data: data as T };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What are branded types and why would you use them?",
        answer: `Branded types simulate **nominal typing** in TypeScript's structural type system. They add a phantom brand property to distinguish between types with the same underlying structure.

\`\`\`typescript
// Structural typing means these are interchangeable:
type UserId = number;
type ProductId = number;
// Bad: can accidentally pass ProductId where UserId is expected

// Branded types prevent this:
type UserId = Brand<number, \"UserId\">;
type ProductId = Brand<number, \"ProductId\">;

function getUser(id: UserId) { ... }
getUser(1 as ProductId); // Error! Type safety!
\`\`\`

Use cases:
1. **IDs** — prevent mixing up user IDs, order IDs, etc.
2. **Currency amounts** — distinguish USD from EUR.
3. **Email addresses** — separate from plain strings.
4. **Security contexts** — distinguish sanitized vs unsanitized input.

Brands are erased at runtime (zero cost), so they provide type safety without runtime overhead.`,
      },
      {
        question:
          "How do you implement the Builder pattern in TypeScript with type safety?",
        answer: `The Builder pattern separates object construction from its representation. In TypeScript, you can make it type-safe by using generics and the method chaining pattern:

\`\`\`typescript
class QueryBuilder<T> {
  private conditions: string[] = [];

  where(field: keyof T & string, value: unknown): QueryBuilder<T> {
    this.conditions.push(\`\${field} = '\${value}'\`);
    return this; // Return this for method chaining
  }

  // ... other methods

  build(): string { ... }
}

// Usage with type safety
interface User { id: number; name: string; email: string; }

const query = new QueryBuilder<User>()
  .where(\"name\", \"Alice\")  // TypeScript ensures \"name\" is a valid key of User
  .where(\"email\", \"a@b.com\")
  .build();
\`\`\`

This pattern ensures that only valid properties can be used in the \`where\` clause. The return type is correctly inferred throughout the chain.`,
      },
      {
        question:
          "What patterns do you use for type-safe error handling in TypeScript?",
        answer: `For type-safe error handling, I use discriminated unions instead of try/catch:

\`\`\`typescript
// Result type — explicit success/failure
type Result<T, E = string> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
async function fetchUser(id: number): Promise<Result<User>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) return { success: false, error: \`HTTP \${res.status}\` };
    const data = await res.json();
    return { success: true, data };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// Consumer — must handle both cases
const result = await fetchUser(1);
if (result.success) {
  console.log(result.data.name); // TypeScript knows data exists
} else {
  console.error(result.error); // TypeScript knows error exists
}
\`\`\`

This is superior to try/catch because:
1. The return type makes error handling **explicit**.
2. TypeScript ensures you **handle both cases**.
3. No unhandled promise rejections.`,
      },
    ],
    practicalTask: {
      scenario:
        "You're building a type-safe event management system where: (1) different event types carry different payloads, (2) you need a builder for constructing events, (3) typed IDs prevent mixing up entity types, (4) API responses are wrapped in a Result type for safety.",
      task: "Create: (1) branded types for UserId, OrderId, ProductId, (2) a discriminated union Event type with different payloads per event, (3) an EventBuilder that enforces type-safe event construction, (4) a type-safe Result type for the API.",
      solutionCode:
        '// Branded types\ninterface Branding<B> {\n  __brand: B;\n}\ntype Brand<T, B> = T & Branding<B>;\n\ntype UserId = Brand<number, "UserId">;\ntype OrderId = Brand<number, "OrderId">;\ntype ProductId = Brand<number, "ProductId">;\n\n// Type-safe IDs in functions\nfunction findUser(id: UserId): string {\n  return `Finding user with id ${id}`;\n}\n\nconst userId = 1 as UserId;\nconst orderId = 2 as OrderId;\n\nfindUser(userId); // OK\n// findUser(orderId); // Error! Type \'OrderId\' not assignable to \'UserId\'\n\n// Event system with discriminated union\ninterface UserCreatedEvent {\n  type: "user.created";\n  payload: { userId: UserId; name: string; email: string };\n}\n\ninterface OrderCreatedEvent {\n  type: "order.created";\n  payload: { orderId: OrderId; productId: ProductId; quantity: number };\n}\n\ninterface ProductUpdatedEvent {\n  type: "product.updated";\n  payload: { productId: ProductId; price: number; stock: number };\n}\n\ntype AppEvent = UserCreatedEvent | OrderCreatedEvent | ProductUpdatedEvent;\n\n// Event builder\nclass EventBuilder {\n  private constructor() {}\n\n  static userCreated(data: Omit<UserCreatedEvent["payload"], "userId"> & { userId: number }): UserCreatedEvent {\n    return {\n      type: "user.created",\n      payload: { ...data, userId: data.userId as UserId }\n    };\n  }\n\n  static orderCreated(data: Omit<OrderCreatedEvent["payload"], "orderId" | "productId"> & { orderId: number; productId: number }): OrderCreatedEvent {\n    return {\n      type: "order.created",\n      payload: { ...data, orderId: data.orderId as OrderId, productId: data.productId as ProductId }\n    };\n  }\n\n  static productUpdated(data: Omit<ProductUpdatedEvent["payload"], "productId"> & { productId: number }): ProductUpdatedEvent {\n    return {\n      type: "product.updated",\n      payload: { ...data, productId: data.productId as ProductId }\n    };\n  }\n}\n\n// Type-safe Result type\ntype Result<T, E = string> =\n  | { ok: true; data: T }\n  | { ok: false; error: E };\n\n// Event handler — must handle all event types exhaustively\nfunction handleEvent(event: AppEvent): Result<string> {\n  switch (event.type) {\n    case "user.created":\n      return { ok: true, data: `Created user ${event.payload.name}` };\n    case "order.created":\n      return { ok: true, data: `Created order for ${event.payload.quantity} items` };\n    case "product.updated":\n      return { ok: true, data: `Updated product to $${event.payload.price}` };\n    default:\n      const _exhaustive: never = event;\n      return { ok: false, error: "Unknown event type" };\n  }\n}\n\n// Usage\nfunction simulate() {\n  const event = EventBuilder.userCreated({ name: "Alice", email: "a@b.com" });\n  const result = handleEvent(event);\n  \n  if (result.ok) {\n    console.log("Success:", result.data);\n  } else {\n    console.error("Failed:", result.error);\n  }\n}\n\nsimulate();',
    },
  },
];

appendTopics(
  "typescript",
  "TypeScript — From Zero to Mastery",
  "Comprehensive TypeScript documentation covering fundamentals through advanced type-level programming. Includes interview questions and practical exercises for each topic.",
  topics,
);
