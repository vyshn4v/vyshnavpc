import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Seeding TypeScript.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) {
    return mongoose.models.Docs;
  }
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const tsDoc = {
  technology: "typescript",
  title: "TypeScript Enterprise Handbook",
  description: "Official-level documentation spanning from absolute beginner basics to advanced type-level programming.",
  topics: [
    {
      slug: "getting-started",
      title: "1. Getting Started",
      order: 1,
      content: `
        <h2>Getting Started with TypeScript</h2>
        <p>TypeScript is JavaScript with syntax for types. It is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.</p>
        
        <h3>Installation</h3>
        <p>You can install TypeScript globally or in your project using npm:</p>
        <pre><code class="language-bash">npm install -D typescript</code></pre>
        
        <h3>The Compiler</h3>
        <p>TypeScript files (<code>.ts</code>) cannot be run directly in the browser or Node.js without compiling (transpiling) them to standard JavaScript first.</p>
        <pre><code class="language-bash">npx tsc index.ts</code></pre>
        <p>This command takes <code>index.ts</code> and outputs an <code>index.js</code> file.</p>
        
        <h3>tsconfig.json</h3>
        <p>To configure how TypeScript behaves in your project, initialize a <code>tsconfig.json</code> file:</p>
        <pre><code class="language-bash">npx tsc --init</code></pre>
        <p>This file dictates the strictness of your project, the output directory for your compiled JS, and the module system you want to use.</p>
      `
    },
    {
      slug: "everyday-types",
      title: "2. Everyday Types",
      order: 2,
      content: `
        <h2>Everyday Types</h2>
        <p>TypeScript supports all the primitive types you know from JavaScript, and adds a few more.</p>
        
        <h3>Primitives</h3>
        <p>The three most common primitives are <code>string</code>, <code>number</code>, and <code>boolean</code>.</p>
        <pre><code class="language-typescript">
let username: string = "Vyshnav";
let age: number = 25;
let isDeveloper: boolean = true;
        </code></pre>

        <h3>Arrays</h3>
        <p>To specify the type of an array, use the syntax <code>Type[]</code> or <code>Array&lt;Type&gt;</code>:</p>
        <pre><code class="language-typescript">
let skills: string[] = ["React", "Node.js", "TypeScript"];
let scores: Array&lt;number&gt; = [98, 95, 100];
        </code></pre>

        <h3>Any</h3>
        <p>TypeScript also has a special type, <code>any</code>, that you can use whenever you don't want a particular value to cause typechecking errors. <strong>Use this sparingly!</strong></p>
        <pre><code class="language-typescript">
let obj: any = { x: 0 };
// None of the following lines of code will throw compiler errors.
// Using 'any' disables all further type checking, and it is assumed 
// you know the environment better than TypeScript.
obj.foo();
obj();
obj.bar = 100;
obj = "hello";
        </code></pre>
      `
    },
    {
      slug: "interfaces-vs-types",
      title: "3. Interfaces vs. Type Aliases",
      order: 3,
      content: `
        <h2>Interfaces vs. Type Aliases</h2>
        <p>Both <code>interface</code> and <code>type</code> are used to define the shape of an object. In modern TypeScript, they are extremely similar, but there are a few key differences.</p>
        
        <h3>Defining an Object Shape</h3>
        <pre><code class="language-typescript">
// Using Interface
interface User {
  name: string;
  age: number;
}

// Using Type
type UserType = {
  name: string;
  age: number;
};
        </code></pre>

        <h3>Extending and Intersection</h3>
        <p>Interfaces extend other interfaces using the <code>extends</code> keyword. Types extend other types via intersections (<code>&</code>).</p>
        <pre><code class="language-typescript">
// Interface Extension
interface Animal { name: string; }
interface Bear extends Animal { honey: boolean; }

// Type Intersection
type AnimalType = { name: string; }
type BearType = AnimalType & { honey: boolean; }
        </code></pre>

        <h3>Declaration Merging</h3>
        <p>The most significant difference is that <strong>Interfaces are open</strong> and <strong>Type aliases are closed</strong>. You can declare the same interface multiple times, and TypeScript will merge them. You cannot do this with types.</p>
        <pre><code class="language-typescript">
interface Window {
  title: string;
}

interface Window {
  ts: TypeScriptAPI;
}
// Window now has both title and ts properties.
        </code></pre>
      `
    },
    {
      slug: "functions",
      title: "4. Functions",
      order: 4,
      content: `
        <h2>Functions</h2>
        <p>TypeScript allows you to specify the types of both the input and output values of functions.</p>

        <h3>Parameter and Return Types</h3>
        <pre><code class="language-typescript">
function greet(name: string): string {
  return "Hello, " + name.toUpperCase() + "!!";
}
        </code></pre>

        <h3>Optional Parameters</h3>
        <p>You can mark parameters as optional using a <code>?</code>.</p>
        <pre><code class="language-typescript">
function buildName(first: string, last?: string) {
  if (last) {
    return first + " " + last;
  }
  return first;
}
        </code></pre>

        <h3>Function Types</h3>
        <p>You can define the type signature of a function using an arrow function syntax in a type alias.</p>
        <pre><code class="language-typescript">
type GreetFunction = (a: string) => void;

function greeter(fn: GreetFunction) {
  fn("Hello, World");
}
        </code></pre>
      `
    },
    {
      slug: "union-and-intersection",
      title: "5. Union & Intersection Types",
      order: 5,
      content: `
        <h2>Union & Intersection Types</h2>
        
        <h3>Union Types (OR)</h3>
        <p>A union type is a type formed from two or more other types, representing values that may be any one of those types. We use the pipe <code>|</code> symbol.</p>
        <pre><code class="language-typescript">
function printId(id: number | string) {
  console.log("Your ID is: " + id);
}
// OK
printId(101);
// OK
printId("202");
        </code></pre>
        
        <h3>Type Narrowing</h3>
        <p>When using unions, you often need to "narrow" the type to perform specific operations.</p>
        <pre><code class="language-typescript">
function printId(id: number | string) {
  if (typeof id === "string") {
    // In this branch, id is of type 'string'
    console.log(id.toUpperCase());
  } else {
    // Here, id is of type 'number'
    console.log(id * 2);
  }
}
        </code></pre>

        <h3>Intersection Types (AND)</h3>
        <p>Intersection types combine multiple types into one. This is mainly used for combining object interfaces.</p>
        <pre><code class="language-typescript">
interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

// A response that has both error handling fields AND artwork fields
type ArtworksResponse = ArtworksData & ErrorHandling;
        </code></pre>
      `
    },
    {
      slug: "generics",
      title: "6. Generics",
      order: 6,
      content: `
        <h2>Generics</h2>
        <p>Generics allow you to create reusable components that can work over a variety of types rather than a single one. This is crucial for building large-scale software engineering components.</p>
        
        <h3>The Identity Function</h3>
        <p>Without generics, we would have to use <code>any</code> to allow our function to return whatever type was passed in.</p>
        <pre><code class="language-typescript">
function identity&lt;Type&gt;(arg: Type): Type {
  return arg;
}

// Usage:
let output = identity&lt;string&gt;("myString");
// Type argument inference makes it even cleaner:
let output2 = identity("myString"); 
        </code></pre>

        <h3>Generic Interfaces</h3>
        <p>You can create interfaces that take type parameters.</p>
        <pre><code class="language-typescript">
interface Box&lt;Type&gt; {
  contents: Type;
}

let stringBox: Box&lt;string&gt; = { contents: "hello" };
let numberBox: Box&lt;number&gt; = { contents: 100 };
        </code></pre>

        <h3>Generic Constraints</h3>
        <p>Sometimes you want to write a generic function that works on a set of types, but requires those types to have certain properties.</p>
        <pre><code class="language-typescript">
interface Lengthwise {
  length: number;
}

function loggingIdentity&lt;Type extends Lengthwise&gt;(arg: Type): Type {
  console.log(arg.length); // Now we know it has a .length property
  return arg;
}

loggingIdentity({ length: 10, value: 3 }); // OK
// loggingIdentity(3); // Error, number doesn't have a .length property
        </code></pre>
      `
    },
    {
      slug: "enums-and-tuples",
      title: "7. Enums & Tuples",
      order: 7,
      content: `
        <h2>Enums & Tuples</h2>

        <h3>Enums</h3>
        <p>Enums allow a developer to define a set of named constants. TypeScript provides both numeric and string-based enums.</p>
        <pre><code class="language-typescript">
// Numeric Enum (starts at 0 by default)
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}

// String Enum
enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}
        </code></pre>

        <h3>Tuples</h3>
        <p>A tuple type is another sort of Array type that knows exactly how many elements it contains, and exactly which types it contains at specific positions.</p>
        <pre><code class="language-typescript">
type StringNumberPair = [string, number];

const pair: StringNumberPair = ["hello", 42];

// Error: Type 'boolean' is not assignable to type 'string'.
// const badPair: StringNumberPair = [true, 42]; 
        </code></pre>
      `
    },
    {
      slug: "utility-types",
      title: "8. Utility Types",
      order: 8,
      content: `
        <h2>Utility Types</h2>
        <p>TypeScript provides several global utility types to facilitate common type transformations.</p>

        <h3>Partial&lt;Type&gt;</h3>
        <p>Constructs a type with all properties of <code>Type</code> set to optional.</p>
        <pre><code class="language-typescript">
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial&lt;Todo&gt;) {
  return { ...todo, ...fieldsToUpdate };
}
        </code></pre>

        <h3>Pick&lt;Type, Keys&gt; and Omit&lt;Type, Keys&gt;</h3>
        <p><code>Pick</code> creates a type by picking a set of properties, while <code>Omit</code> creates a type by removing them.</p>
        <pre><code class="language-typescript">
interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

// Pick only what we want to send to the client
type PublicUser = Pick&lt;User, "id" | "name" | "email"&gt;;

// Omit what we don't want
type SafeUser = Omit&lt;User, "passwordHash"&gt;;
        </code></pre>

        <h3>Record&lt;Keys, Type&gt;</h3>
        <p>Constructs an object type whose property keys are <code>Keys</code> and whose property values are <code>Type</code>.</p>
        <pre><code class="language-typescript">
type Role = 'admin' | 'user' | 'guest';

const roleDescriptions: Record&lt;Role, string&gt; = {
  admin: "Full access",
  user: "Limited access",
  guest: "Read-only access"
};
        </code></pre>
      `
    },
    {
      slug: "advanced-types",
      title: "9. Advanced Types (Mapped & Conditional)",
      order: 9,
      content: `
        <h2>Advanced Types</h2>
        <p>Enterprise TypeScript heavily relies on type-level programming to ensure absolute type safety across complex architectures.</p>

        <h3>Mapped Types</h3>
        <p>A mapped type is a generic type which uses a union of <code>PropertyKeys</code> (frequently created via a <code>keyof</code>) to iterate through keys to create a type.</p>
        <pre><code class="language-typescript">
type OptionsFlags&lt;Type&gt; = {
  [Property in keyof Type]: boolean;
};

type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

// FeatureOptions transforms all methods into booleans
type FeatureOptions = OptionsFlags&lt;FeatureFlags&gt;;
// { darkMode: boolean; newUserProfile: boolean; }
        </code></pre>

        <h3>Conditional Types</h3>
        <p>Conditional types help describe the relation between the inputs and outputs of functions.</p>
        <p><code>SomeType extends OtherType ? TrueType : FalseType;</code></p>
        <pre><code class="language-typescript">
interface Animal { live(): void; }
interface Dog extends Animal { bark(): void; }

type Example1 = Dog extends Animal ? number : string; // number
type Example2 = RegExp extends Animal ? number : string; // string
        </code></pre>

        <h3>The 'infer' Keyword</h3>
        <p>Within the <code>extends</code> clause of a conditional type, you can use the <code>infer</code> keyword to infer a type variable to be used in the true branch.</p>
        <pre><code class="language-typescript">
// Extracts the return type of a function
type MyReturnType&lt;T&gt; = T extends (...args: any[]) => infer R ? R : any;

type Func = () => string;
type R = MyReturnType&lt;Func&gt;; // string
        </code></pre>
      `
    },
    {
      slug: "decorators",
      title: "10. Decorators",
      order: 10,
      content: `
        <h2>Decorators</h2>
        <p>Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members. They are widely used in frameworks like NestJS and Angular.</p>
        
        <p>To enable decorators, you must set <code>"experimentalDecorators": true</code> in your <code>tsconfig.json</code>.</p>

        <h3>Class Decorators</h3>
        <pre><code class="language-typescript">
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
        </code></pre>

        <h3>Method Decorators</h3>
        <p>A method decorator is declared just before a method declaration. It is used to observe, modify, or replace a method definition.</p>
        <pre><code class="language-typescript">
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}

class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
        </code></pre>
      `
    }
  ]
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate(
    { technology: tsDoc.technology },
    tsDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Comprehensive TypeScript docs seeded successfully!");
  process.exit(0);
};

run();
