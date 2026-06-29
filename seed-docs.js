import mongoose from "mongoose";
import getDocsModel from "./src/schema/docs.js";
import { connectDb } from "./src/config/initializeDevDb.js";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGO_URI environment variable inside .env");
  process.exit(1);
}

const typescriptTopics = [
  // --- BEGINNER ---
  {
    title: "1. Introduction & Setup",
    slug: "introduction",
    order: 1,
    content: `
      <h2>TypeScript: The Industrial Standard</h2>
      <p>TypeScript is JavaScript with syntax for types. In enterprise software development, predictability and maintainability are paramount. JavaScript, being dynamically typed, introduces runtime volatility. TypeScript acts as an <strong>industrial-grade safety net</strong>, shifting error detection from <em>runtime</em> to <em>compile-time</em>.</p>
      
      <h3>Setting up a Project</h3>
      <p>To initialize a modern TypeScript project, you install the compiler and initialize a <code>tsconfig.json</code> file.</p>
      <pre><code class="language-bash">npm install typescript --save-dev
npx tsc --init</code></pre>
      <p>This generates a <code>tsconfig.json</code> which acts as the control center for your compiler's strictness rules.</p>
    `
  },
  {
    title: "2. Basic Types & Primitives",
    slug: "basic-types",
    order: 2,
    content: `
      <h2>Basic Types & Primitives</h2>
      <p>TypeScript supports all of JavaScript's primitives, but allows you to enforce them explicitly. While TypeScript features powerful <strong>Type Inference</strong> (automatically guessing the type), explicit typing is common in API boundaries.</p>
      
      <pre><code class="language-typescript">// Explicit Types
let username: string = "Vyshnav";
let age: number = 25;
let isDeveloper: boolean = true;

// Type Inference (TS knows 'company' is a string)
let company = "Google"; 

// 'any' escapes the type system (Avoid in production!)
let dynamicValue: any = "Hello";
dynamicValue = 42; </code></pre>
    `
  },
  {
    title: "3. Functions & Return Types",
    slug: "functions",
    order: 3,
    content: `
      <h2>Functions</h2>
      <p>Functions are the primary building blocks of logic. TypeScript allows you to type both the input parameters and the expected output return value.</p>
      
      <pre><code class="language-typescript">// Strongly typed parameters and return type
function calculateTax(amount: number, taxRate: number = 0.2): number {
  return amount + (amount * taxRate);
}

// Void return type (returns nothing)
function logError(message: string): void {
  console.error(\`[ERROR]: \${message}\`);
}

// Never return type (function never finishes, e.g. throws error)
function crashSystem(): never {
  throw new Error("Critical Failure");
}</code></pre>
    `
  },
  {
    title: "4. Arrays & Tuples",
    slug: "arrays-tuples",
    order: 4,
    content: `
      <h2>Arrays & Tuples</h2>
      <p>Arrays in TS strictly enforce the type of data they hold. Tuples take this a step further by enforcing the <em>exact length</em> and <em>specific type at a specific index</em>.</p>
      
      <h3>Arrays</h3>
      <pre><code class="language-typescript">const activeUsers: string[] = ["Alice", "Bob"];
const accessCodes: Array&lt;number&gt; = [101, 202, 303]; // Generic syntax</code></pre>

      <h3>Tuples</h3>
      <p>Tuples are incredibly useful for returning multiple values from a function, famously used in React's <code>useState</code> hook.</p>
      <pre><code class="language-typescript">// A tuple enforcing [string, number]
const userRecord: [string, number] = ["Vyshnav", 100];

// React useState example
function useState(initial: string): [string, (v: string) => void] {
  return [initial, (val) => console.log(val)];
}</code></pre>
    `
  },

  // --- INTERMEDIATE ---
  {
    title: "5. Interfaces & Types",
    slug: "interfaces",
    order: 5,
    content: `
      <h2>Interfaces & Type Aliases</h2>
      <p>These define the shape of objects. In large-scale systems, they are the bedrock of Data Transfer Objects (DTOs), API response typing, and component abstractions.</p>
      
      <h3>Interface Syntax</h3>
      <pre><code class="language-typescript">interface User {
  readonly id: string; // Cannot be changed after creation
  name: string;
  email: string;
  role?: "ADMIN" | "USER"; // Optional property
}</code></pre>

      <h3>Extending Interfaces</h3>
      <p>Interfaces can inherit properties using the <code>extends</code> keyword. This is crucial for DRY (Don't Repeat Yourself) architecture.</p>
      <pre><code class="language-typescript">interface Employee extends User {
  department: string;
  salary: number;
}</code></pre>
    `
  },
  {
    title: "6. Union & Intersection Types",
    slug: "union-intersection",
    order: 6,
    content: `
      <h2>Union & Intersection Types</h2>
      <p>TypeScript allows you to combine types together logically using Unions (OR) and Intersections (AND).</p>
      
      <h3>Union Types (OR) <code>|</code></h3>
      <p>A value can be one of several types. Useful for IDs that could be strings or numbers, or strict string literals.</p>
      <pre><code class="language-typescript">type Status = "PENDING" | "SUCCESS" | "FAILED";
let currentStatus: Status = "PENDING"; // Autocomplete works perfectly here!

function printId(id: string | number) {
  console.log("ID is: " + id);
}</code></pre>

      <h3>Intersection Types (AND) <code>&</code></h3>
      <p>Combines multiple types into one. The resulting type has ALL the properties of the combined types.</p>
      <pre><code class="language-typescript">type Identifiable = { id: string };
type Timestamped = { createdAt: Date };

type DatabaseRecord = Identifiable & Timestamped;
// DatabaseRecord MUST have both 'id' and 'createdAt'
</code></pre>
    `
  },
  {
    title: "7. Classes & Modifiers",
    slug: "classes",
    order: 7,
    content: `
      <h2>Classes & Access Modifiers</h2>
      <p>TypeScript supercharges ES6 Classes with strict access modifiers, aligning it with enterprise OOP languages like Java or C#.</p>
      
      <pre><code class="language-typescript">class DatabaseService {
  public connectionString: string; // Accessible anywhere
  private retryCount: number = 0; // Accessible ONLY within this class
  protected maxRetries: number = 5; // Accessible in this class and subclasses

  constructor(connString: string) {
    this.connectionString = connString;
  }

  // Shorthand constructor syntax (Highly recommended!)
  // class DatabaseService {
  //   constructor(public connectionString: string) {}
  // }
}</code></pre>
    `
  },
  {
    title: "8. Abstract Classes",
    slug: "abstract-classes",
    order: 8,
    content: `
      <h2>Abstract Classes</h2>
      <p>In enterprise OOP architectures, <code>abstract</code> classes act as foundational blueprints. Unlike standard classes, an abstract class <strong>cannot be instantiated directly</strong>.</p>
      
      <p>They can contain standard methods alongside <code>abstract</code> methods (methods with no body that force the inheriting subclass to provide the implementation).</p>
      
      <pre><code class="language-typescript">abstract class PaymentGateway {
  // Shared implementation
  protected logTransaction(amount: number) {
    console.log(\`Processing transaction of $\${amount}\`);
  }

  // Enforced implementation in subclasses
  abstract processPayment(amount: number): Promise&lt;boolean&gt;;
}

class StripeService extends PaymentGateway {
  async processPayment(amount: number): Promise&lt;boolean&gt; {
    this.logTransaction(amount);
    return true; // Stripe implementation
  }
}</code></pre>
    `
  },

  // --- ADVANCED ---
  {
    title: "9. Generics (Deep Dive)",
    slug: "generics",
    order: 9,
    content: `
      <h2>Generics: The Pinnacle of Reusability</h2>
      <p>Generics allow you to create components that work over a variety of types rather than a single one. This is heavily utilized in utility functions, API wrappers, and React hooks.</p>
      
      <h3>The Syntax</h3>
      <pre><code class="language-typescript">interface ApiResponse&lt;T&gt; {
  status: number;
  data: T; // The type is injected dynamically
}

const userResponse: ApiResponse&lt;User&gt; = await fetchUser();
console.log(userResponse.data.name); // Type-safe!</code></pre>
      
      <h3>Generic Constraints</h3>
      <p>You can restrict the types that a generic can accept using the <code>extends</code> keyword.</p>
      <pre><code class="language-typescript">// T MUST be an object that has a 'length' property
function getLength&lt;T extends { length: number }&gt;(item: T): number {
  return item.length;
}

getLength([1, 2, 3]); // OK (arrays have length)
getLength("Hello"); // OK (strings have length)
// getLength(42); // ERROR: number does not have length
</code></pre>
    `
  },
  {
    title: "10. Utility Types",
    slug: "utility-types",
    order: 10,
    content: `
      <h2>Global Utility Types</h2>
      <p>TypeScript provides global utility types that facilitate common type transformations. These are indispensable for enterprise state management and complex form handling.</p>
      
      <ul>
        <li><code>Partial&lt;T&gt;</code>: Makes all properties optional. Perfect for database PATCH payloads.</li>
        <li><code>Required&lt;T&gt;</code>: Makes all properties required (removes ?).</li>
        <li><code>Pick&lt;T, K&gt;</code>: Constructs a type by picking specific properties from T.</li>
        <li><code>Omit&lt;T, K&gt;</code>: Constructs a type by removing properties from T.</li>
        <li><code>Record&lt;K, V&gt;</code>: Creates an object type whose property keys are K and values are V.</li>
      </ul>

      <pre><code class="language-typescript">interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Strips 'passwordHash' and 'id' for a creation payload
type CreateUserPayload = Omit&lt;User, "id" | "passwordHash"&gt;;

// A dictionary mapping strings to numbers
const scores: Record&lt;string, number&gt; = {
  "Alice": 100,
  "Bob": 85
};</code></pre>
    `
  },
  {
    title: "11. Typeof & Keyof",
    slug: "typeof-keyof",
    order: 11,
    content: `
      <h2>The <code>typeof</code> and <code>keyof</code> Operators</h2>
      <p>These operators allow you to extract types from existing JavaScript code dynamically.</p>
      
      <h3>Typeof</h3>
      <p>Extracts the TypeScript type of an existing JavaScript variable.</p>
      <pre><code class="language-typescript">const config = { theme: "dark", port: 3000 };
type ConfigType = typeof config; 
// Result: { theme: string, port: number }</code></pre>

      <h3>Keyof</h3>
      <p>Extracts the keys of an object type as a Union of literal strings.</p>
      <pre><code class="language-typescript">interface ServerConfig {
  host: string;
  port: number;
}
type ConfigKeys = keyof ServerConfig; 
// Result: "host" | "port"

// Industrial Use Case: Safe property accessor
function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K) {
  return obj[key]; 
}</code></pre>
    `
  },
  {
    title: "12. Type Guards & Narrowing",
    slug: "type-guards",
    order: 12,
    content: `
      <h2>Type Guards & Narrowing</h2>
      <p>When working with Union types, you must "narrow" the type down before you can safely use it. TypeScript is smart enough to understand JavaScript runtime checks (like <code>typeof</code> and <code>instanceof</code>).</p>
      
      <pre><code class="language-typescript">function processInput(input: string | number) {
  if (typeof input === "string") {
    // TypeScript KNOWS input is a string here
    return input.toUpperCase(); 
  } else {
    // TypeScript KNOWS input is a number here
    return input.toFixed(2);
  }
}</code></pre>

      <h3>Custom Type Guards (User-Defined)</h3>
      <p>For complex objects, you can write custom functions that return a <code>value is Type</code> predicate.</p>
      <pre><code class="language-typescript">interface Fish { swim(): void; }
interface Bird { fly(): void; }

// Custom Type Guard
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

const myPet = getPet();
if (isFish(myPet)) {
  myPet.swim(); // Safe!
}</code></pre>
    `
  },
  {
    title: "13. Mapped & Conditional Types",
    slug: "mapped-conditional",
    order: 13,
    content: `
      <h2>Mapped & Conditional Types (Expert Level)</h2>
      <p>These are the most powerful features in TypeScript, allowing you to programmatically loop over and transform types, effectively creating "functions" for types.</p>
      
      <h3>Mapped Types</h3>
      <p>Iterates over keys to create a new type. (This is how <code>Partial</code> is built under the hood!)</p>
      <pre><code class="language-typescript">type MyReadonly&lt;T&gt; = {
  readonly [K in keyof T]: T[K];
};

type ReadonlyUser = MyReadonly&lt;User&gt;; // All properties are now readonly</code></pre>

      <h3>Conditional Types</h3>
      <p>Ternary logic inside the type system: <code>T extends U ? X : Y</code></p>
      <pre><code class="language-typescript">type IsString&lt;T&gt; = T extends string ? "Yes" : "No";

type A = IsString&lt;string&gt;; // "Yes"
type B = IsString&lt;number&gt;; // "No"</code></pre>
    `
  }
];

async function seed() {
  try {
    await connectDb();
    console.log("Connected to MongoDB.");

    const Docs = getDocsModel();

    // Clear existing TS docs
    await Docs.deleteOne({ technology: "typescript" });
    
    // Insert new docs
    const newDoc = new Docs({
      technology: "typescript",
      title: "Complete TypeScript Mastery",
      description: "From beginner setup to industrial-grade expert architectures, mapped types, and generics.",
      topics: typescriptTopics
    });

    await newDoc.save();
    console.log("TypeScript documentation successfully seeded with 13 topics!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding docs:", error);
    process.exit(1);
  }
}

seed();
