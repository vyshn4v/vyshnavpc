import mongoose from "mongoose";
import getDocsModel from "./src/schema/docs.js";
import { connectDb } from "./src/config/initializeDevDb.js";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGO_URI environment variable inside .env");
  process.exit(1);
}

const typescriptTopics = [
  // ==========================================
  // MODULE 1: THE FOUNDATION (BEGINNER)
  // ==========================================
  {
    title: "1. The TypeScript Philosophy",
    slug: "ts-philosophy",
    order: 1,
    content: `
      <h2>The TypeScript Philosophy</h2>
      <p>TypeScript is fundamentally a <strong>syntactic superset</strong> of JavaScript that adds static typing. In an enterprise environment, the cost of an unhandled TypeError crashing a production server is immense. TypeScript's entire philosophy revolves around shifting error discovery from <em>Runtime</em> to <em>Compile-time</em>.</p>
      
      <h3>Erasable Typing</h3>
      <p>One of the core architectural decisions behind TypeScript is that its type system is entirely <em>erasable</em>. Once compiled, all type annotations, interfaces, and type aliases are completely stripped away, leaving only pure, standard JavaScript. This means TypeScript has exactly <strong>zero runtime overhead</strong>.</p>
      
      <blockquote>
        <p><strong>Architect's Note:</strong> Always remember that TypeScript cannot validate data at runtime (e.g., API payloads). For runtime validation, you must pair TypeScript with a validation library like Zod or Joi.</p>
      </blockquote>
    `
  },
  {
    title: "2. Primitives & Type Inference",
    slug: "primitives",
    order: 2,
    content: `
      <h2>Primitives & Type Inference</h2>
      <p>TypeScript supports all JavaScript primitives: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>symbol</code>, and <code>bigint</code>.</p>
      
      <h3>Explicit vs. Implicit Types</h3>
      <p>While you can explicitly declare types, TypeScript has an incredibly powerful inference engine.</p>
      <pre><code class="language-typescript">// Explicit Definition
const systemId: string = "SYS-001";
const maxRetries: number = 3;

// Implicit Inference (Best Practice)
let activeUsers = 100; // TypeScript infers 'number'
// activeUsers = "Many"; // Error: Type 'string' is not assignable to type 'number'
</code></pre>
      
      <p>In industry, we rely on inference for local variables to reduce visual clutter, reserving explicit types for function parameters, return types, and class properties.</p>
    `
  },
  {
    title: "3. Functions & Signatures",
    slug: "functions",
    order: 3,
    content: `
      <h2>Functions & Signatures</h2>
      <p>Functions are the core logic blocks. In TypeScript, explicitly defining input and output types is critical for large teams.</p>
      
      <pre><code class="language-typescript">function calculateTax(amount: number, taxRate: number = 0.2): number {
  return amount + (amount * taxRate);
}</code></pre>

      <h3>Void and Never</h3>
      <ul>
        <li><code>void</code>: Used when a function returns nothing (e.g., a logging function).</li>
        <li><code>never</code>: Used when a function <em>never successfully completes</em> (e.g., it always throws an error or runs in an infinite loop).</li>
      </ul>

      <pre><code class="language-typescript">function crashSystem(reason: string): never {
  throw new Error(\`FATAL: \${reason}\`);
}</code></pre>
    `
  },
  {
    title: "4. Arrays & Tuples",
    slug: "arrays",
    order: 4,
    content: `
      <h2>Arrays & Tuples</h2>
      <p>While Arrays hold lists of uniform types, Tuples hold a fixed-length sequence of mixed types.</p>
      
      <pre><code class="language-typescript">// Arrays
const validStatus: string[] = ["SUCCESS", "PENDING"];
const coordinates: Array&lt;number&gt; = [40.7128, -74.0060]; // Generic syntax

// Tuples
type HTTPResponse = [number, string];
const response: HTTPResponse = [404, "Not Found"];
</code></pre>
      <p>Tuples are widely used in modern libraries (like React's <code>useState</code>) to return multiple, distinctly typed variables from a single function.</p>
    `
  },
  {
    title: "5. Object Types",
    slug: "object-types",
    order: 5,
    content: `
      <h2>Object Types</h2>
      <p>Objects are the fundamental way we group data. TypeScript allows us to strictly define the shape of these objects.</p>
      
      <pre><code class="language-typescript">function printCoordinates(pt: { x: number; y: number; z?: number }) {
  console.log("X:", pt.x);
  console.log("Y:", pt.y);
  if (pt.z !== undefined) console.log("Z:", pt.z);
}</code></pre>

      <p>The <code>?</code> operator designates an optional property. Attempting to access properties that don't exist in the defined shape will result in a compile-time error.</p>
    `
  },

  // ==========================================
  // MODULE 2: INTERMEDIATE ARCHITECTURE
  // ==========================================
  {
    title: "6. Interfaces vs. Type Aliases",
    slug: "interfaces-vs-types",
    order: 6,
    content: `
      <h2>Interfaces vs. Type Aliases</h2>
      <p>Both <code>interface</code> and <code>type</code> can be used to define object shapes. The debate between them is legendary, but in enterprise codebases, we follow specific rules.</p>
      
      <h3>Declaration Merging</h3>
      <p>The defining feature of an <code>interface</code> is that it is "open" and can be merged. If you declare the same interface twice, TypeScript combines them. This is critical when extending third-party libraries like Express or React.</p>
      
      <pre><code class="language-typescript">interface User { name: string; }
interface User { age: number; }
// User is now { name: string, age: number }
</code></pre>

      <h3>Type Aliases</h3>
      <p>Type aliases are "closed". They cannot be merged. However, <code>type</code> can represent primitives, unions, and tuples, which interfaces cannot.</p>
      
      <blockquote>
        <p><strong>Architect's Rule:</strong> Use <code>interface</code> for all objects and class contracts. Use <code>type</code> for unions, intersections, and primitives.</p>
      </blockquote>
    `
  },
  {
    title: "7. Union & Intersection Types",
    slug: "unions-intersections",
    order: 7,
    content: `
      <h2>Union & Intersection Types</h2>
      
      <h3>Unions (OR) <code>|</code></h3>
      <p>Unions allow a variable to hold one of several types. This is the foundation of <em>Strict Literal Typing</em>.</p>
      <pre><code class="language-typescript">type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function makeRequest(url: string, method: HttpMethod) {
  // method MUST be one of those exact 4 strings.
}</code></pre>

      <h3>Intersections (AND) <code>&</code></h3>
      <p>Intersections merge multiple types together. A value must satisfy ALL intersected types.</p>
      <pre><code class="language-typescript">type Identifiable = { id: string };
type Auditable = { createdAt: Date; createdBy: string };

type DatabaseRecord = Identifiable & Auditable;
// DatabaseRecord requires id, createdAt, AND createdBy
</code></pre>
    `
  },
  {
    title: "8. Type Narrowing & Guards",
    slug: "type-guards",
    order: 8,
    content: `
      <h2>Type Narrowing & Guards</h2>
      <p>When dealing with Unions, TypeScript refuses to let you perform operations unless it is 100% sure the operation is valid for the current type. You must "narrow" the type.</p>
      
      <h3>Control Flow Analysis</h3>
      <pre><code class="language-typescript">function padLeft(padding: number | string, input: string) {
  if (typeof padding === "number") {
    return " ".repeat(padding) + input; // TS knows padding is a number here
  }
  return padding + input; // TS knows padding is a string here
}</code></pre>

      <h3>User-Defined Type Guards</h3>
      <p>For complex objects, you can write functions that explicitly tell the compiler what type a variable is.</p>
      <pre><code class="language-typescript">interface Fish { swim(): void }
interface Bird { fly(): void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}</code></pre>
    `
  },
  {
    title: "9. Classes & Modifiers",
    slug: "classes",
    order: 9,
    content: `
      <h2>Classes & Access Modifiers</h2>
      <p>TypeScript implements standard OOP modifiers: <code>public</code>, <code>private</code>, and <code>protected</code>.</p>
      
      <pre><code class="language-typescript">class DatabaseConnector {
  private connectionString: string;
  protected maxRetries: number;
  public isConnected: boolean;

  // Parameter Properties (Shorthand syntax)
  constructor(private host: string, public port: number) {
    // 'host' and 'port' are automatically bound to 'this'
  }
}</code></pre>
      <p><strong>Note:</strong> These modifiers exist only at compile-time. At runtime, JavaScript can still technically access private properties unless you use ES2020 private fields (<code>#</code>).</p>
    `
  },
  {
    title: "10. Abstract Classes & Polymorphism",
    slug: "abstract-classes",
    order: 10,
    content: `
      <h2>Abstract Classes & Polymorphism</h2>
      <p>Abstract classes define strict architectural contracts. They cannot be instantiated themselves; they exist solely to be extended.</p>
      
      <pre><code class="language-typescript">abstract class NotificationService {
  protected logDelivery(message: string) {
    console.log(\`[LOG]: \${message}\`);
  }

  // Subclasses MUST implement this
  abstract send(userId: string, message: string): Promise&lt;void&gt;;
}

class EmailService extends NotificationService {
  async send(userId: string, message: string): Promise&lt;void&gt; {
    this.logDelivery("Sending Email");
    // Email implementation
  }
}</code></pre>
      <p>This ensures maximum decoupling in enterprise systems.</p>
    `
  },

  // ==========================================
  // MODULE 3: ADVANCED TYPE MANIPULATION
  // ==========================================
  {
    title: "11. Generics (The Foundation)",
    slug: "generics-1",
    order: 11,
    content: `
      <h2>Generics: The Foundation</h2>
      <p>Generics are essentially "variables for types". They allow you to write highly reusable, strictly typed functions and classes without resorting to <code>any</code>.</p>
      
      <pre><code class="language-typescript">function extractData&lt;T&gt;(response: { data: T, status: number }): T {
  return response.data;
}

const userData = extractData&lt;User&gt;({ data: myUser, status: 200 });
// userData is strictly typed as 'User'</code></pre>

      <h3>Generic Constraints</h3>
      <p>You can restrict the types that a Generic can accept.</p>
      <pre><code class="language-typescript">function getLength&lt;T extends { length: number }&gt;(arg: T): number {
  return arg.length;
}</code></pre>
    `
  },
  {
    title: "12. The typeof Operator",
    slug: "typeof",
    order: 12,
    content: `
      <h2>The typeof Operator</h2>
      <p>In JavaScript, <code>typeof</code> returns a string indicating the variable's runtime type. In TypeScript, <code>typeof</code> can be used in a <em>type context</em> to extract the exact structural type of a JavaScript variable or object.</p>
      
      <pre><code class="language-typescript">const DEFAULT_CONFIG = {
  host: "localhost",
  port: 8080,
  isSecure: false
};

// Extracts the type { host: string; port: number; isSecure: boolean; }
type ConfigType = typeof DEFAULT_CONFIG;

function startServer(config: ConfigType) {
  // ...
}</code></pre>
      <p>This is a legendary technique for deriving types from large, static JSON configuration files without having to write the interface manually.</p>
    `
  },
  {
    title: "13. The keyof Operator",
    slug: "keyof",
    order: 13,
    content: `
      <h2>The keyof Operator</h2>
      <p>The <code>keyof</code> operator takes an object type and produces a string or numeric literal union of its keys.</p>
      
      <pre><code class="language-typescript">interface Point {
  x: number;
  y: number;
}
type P = keyof Point; // "x" | "y"
</code></pre>

      <h3>Combining keyof and Generics</h3>
      <p>This allows us to create ultra-safe property accessor functions.</p>
      <pre><code class="language-typescript">function getProperty&lt;T, K extends keyof T&gt;(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "John", age: 30 };
const n = getProperty(user, "name"); // Valid, returns string
// const invalid = getProperty(user, "password"); // ERROR! "password" is not a key of user
</code></pre>
    `
  },
  {
    title: "14. Indexed Access Types",
    slug: "indexed-access",
    order: 14,
    content: `
      <h2>Indexed Access Types</h2>
      <p>Just like you can access object properties using brackets in JavaScript (<code>obj['prop']</code>), you can access the <em>type</em> of a property in TypeScript using Indexed Access Types.</p>
      
      <pre><code class="language-typescript">type Person = {
  age: number;
  name: string;
  alive: boolean;
};

type AgeType = Person["age"]; // number
type MixedType = Person["age" | "name"]; // number | string
</code></pre>

      <p>This is incredibly powerful when dealing with massive API payload types, allowing you to extract a specific sub-type from deeply nested structures without rewriting the interface.</p>
    `
  },
  {
    title: "15. Global Utility Types",
    slug: "global-utilities",
    order: 15,
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
  email: string;
  passwordHash: string;
}

// Strip 'passwordHash' for the frontend payload
type PublicUser = Omit&lt;User, "passwordHash"&gt;;

// A dictionary mapping strings to numbers
const scores: Record&lt;string, number&gt; = {
  "Alice": 100
};</code></pre>
    `
  },

  // ==========================================
  // MODULE 4: EXPERT LEVEL MASTERY
  // ==========================================
  {
    title: "16. Conditional Types",
    slug: "conditional-types",
    order: 16,
    content: `
      <h2>Conditional Types</h2>
      <p>Conditional types enable ternary logic inside the type system: <code>SomeType extends OtherType ? TrueType : FalseType</code>. They describe a type relationship, evaluating differently depending on the input type.</p>
      
      <pre><code class="language-typescript">interface Animal { live(): void; }
interface Dog extends Animal { bark(): void; }

// Is Dog assignable to Animal? Yes, so it returns 'number'.
type Example1 = Dog extends Animal ? number : string; // number
</code></pre>

      <h3>Flattening Arrays</h3>
      <p>Conditional types are heavily used with the <code>infer</code> keyword to extract types from within other types.</p>
      <pre><code class="language-typescript">type Flatten&lt;T&gt; = T extends Array&lt;infer ItemType&gt; ? ItemType : T;

type Str = Flatten&lt;string[]&gt;; // string
type Num = Flatten&lt;number&gt;; // number
</code></pre>
    `
  },
  {
    title: "17. Mapped Types",
    slug: "mapped-types",
    order: 17,
    content: `
      <h2>Mapped Types</h2>
      <p>A mapped type is a generic type which uses a union of <code>PropertyKeys</code> (frequently created via a <code>keyof</code>) to iterate through keys to create a new object type.</p>
      
      <p>This is exactly how TypeScript builds <code>Partial&lt;T&gt;</code> and <code>Readonly&lt;T&gt;</code> under the hood!</p>
      
      <pre><code class="language-typescript">type MyReadonly&lt;T&gt; = {
  readonly [Property in keyof T]: T[Property];
};

type User = { name: string; age: number; };
type ReadonlyUser = MyReadonly&lt;User&gt;; 
// { readonly name: string; readonly age: number; }
</code></pre>
    `
  },
  {
    title: "18. Template Literal Types",
    slug: "template-literal-types",
    order: 18,
    content: `
      <h2>Template Literal Types</h2>
      <p>Template literal types build on string literal types, and have the ability to expand into many strings via unions. They use the same syntax as JavaScript template strings.</p>
      
      <pre><code class="language-typescript">type World = "world";
type Greeting = \`hello \${World}\`; // "hello world"

type Colors = "red" | "blue";
type Sizes = "sm" | "md" | "lg";

type ThemeConfig = \`bg-\${Colors}-\${Sizes}\`;
// "bg-red-sm" | "bg-red-md" | "bg-red-lg" | "bg-blue-sm" | "bg-blue-md" | "bg-blue-lg"
</code></pre>
      <p>This is heavily utilized in CSS-in-JS libraries and massive utility frameworks like Tailwind to strongly type class names.</p>
    `
  },
  {
    title: "19. The 'infer' Keyword",
    slug: "infer-keyword",
    order: 19,
    content: `
      <h2>The 'infer' Keyword</h2>
      <p>The <code>infer</code> keyword is used entirely within Conditional Types. It allows you to declare a type variable and extract a type from the true branch of a conditional type.</p>
      
      <pre><code class="language-typescript">// Extracts the Return Type of ANY function
type MyReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : any;

function generateId() {
  return "ID-12345";
}

type IdType = MyReturnType&lt;typeof generateId&gt;; // string
</code></pre>
      <p><code>infer</code> is the engine behind advanced library typing (like Redux Toolkit or React Query) where the library must deduce what data shapes your custom functions are producing.</p>
    `
  },
  {
    title: "20. Enterprise Architecture Patterns",
    slug: "enterprise-patterns",
    order: 20,
    content: `
      <h2>Enterprise Architecture Patterns</h2>
      <p>At the highest level of software engineering, TypeScript is used to enforce architectural boundaries and Domain-Driven Design (DDD).</p>
      
      <h3>The Repository Pattern</h3>
      <p>By defining strict repository interfaces, we can swap out the underlying database (MongoDB to PostgreSQL) without changing a single line of business logic.</p>
      
      <pre><code class="language-typescript">interface UserRepository {
  findById(id: string): Promise&lt;User | null&gt;;
  save(user: User): Promise&lt;void&gt;;
}

// Business Logic Layer (Uses the Interface, NOT the implementation)
class UserService {
  constructor(private repo: UserRepository) {}
  
  async getUser(id: string) {
    return await this.repo.findById(id);
  }
}</code></pre>

      <h3>Branded Types (Nominal Typing)</h3>
      <p>TypeScript is structurally typed. However, in banking or security systems, you might want to ensure a <code>UserId</code> string cannot be accidentally passed to an <code>AccountId</code> string parameter. Branded types solve this.</p>
      <pre><code class="language-typescript">type Brand&lt;K, T&gt; = K & { __brand: T };

type UserId = Brand&lt;string, "UserId"&gt;;
type AccountId = Brand&lt;string, "AccountId"&gt;;

function fetchAccount(id: AccountId) { ... }

const uId = "123" as UserId;
// fetchAccount(uId); // ERROR: UserId cannot be assigned to AccountId
</code></pre>
    `
  }
];

async function seed() {
  try {
    await connectDb();
    console.log("Connected to MongoDB...");

    const Docs = getDocsModel();

    // Clear existing docs
    await Docs.deleteOne({ technology: "typescript" });
    
    // Insert new docs
    const newDoc = new Docs({
      technology: "typescript",
      title: "TypeScript Enterprise Architecture Handbook",
      description: "A comprehensive, 20-chapter deep dive into TypeScript, from foundational syntax to expert-level Domain Driven Design.",
      topics: typescriptTopics
    });

    await newDoc.save();
    console.log("TypeScript documentation successfully seeded with 20 Chapters!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding docs:", error);
    process.exit(1);
  }
}

seed();
