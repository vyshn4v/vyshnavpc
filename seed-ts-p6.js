import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "TypeScript Compiler API and Custom Transformers",
    content: `
      <h2>The TypeScript Compiler API</h2>
      <p>TypeScript is not just a language; it is a platform exposing a robust Compiler API. This API allows you to programmatically invoke the parser, type checker, and emitter. This is the foundation for tools like TSLint/ESLint, Prettier, API extractors, and Webpack loaders.</p>
      
      <h3>Generating an Abstract Syntax Tree (AST)</h3>
      <p>The parser converts source code into an Abstract Syntax Tree (AST). You can use the Compiler API to traverse this tree programmatically.</p>
      <pre><code class="language-typescript">
import * as ts from 'typescript';

const sourceCode = \`
  interface User { id: number; name: string; }
  const u: User = { id: 1, name: "Alice" };
\`;

// Create a SourceFile AST
const sourceFile = ts.createSourceFile(
  'example.ts',
  sourceCode,
  ts.ScriptTarget.Latest,
  true // setParentNodes
);

// Traverse the AST
function visit(node: ts.Node) {
  if (ts.isInterfaceDeclaration(node)) {
    console.log("Found interface:", node.name.text);
  }
  ts.forEachChild(node, visit);
}

visit(sourceFile);
      </code></pre>

      <h2>Custom Transformers</h2>
      <p>While decorators manipulate metadata at runtime, Custom Transformers allow you to rewrite the AST during the compilation phase, before the JavaScript is emitted. This is incredibly powerful for removing debug code, injecting environment variables, or creating framework-specific build optimizations (like React's JSX transform).</p>

      <pre><code class="language-typescript">
import * as ts from 'typescript';

// A transformer that replaces all string literals with "REDACTED"
const redactStringsTransformer: ts.TransformerFactory&lt;ts.SourceFile&gt; = (context) =&gt; {
  return (rootNode) =&gt; {
    function visit(node: ts.Node): ts.Node {
      if (ts.isStringLiteral(node)) {
        // Return a new node to replace the old one
        return ts.factory.createStringLiteral("REDACTED");
      }
      return ts.visitEachChild(node, visit, context);
    }
    return ts.visitNode(rootNode, visit) as ts.SourceFile;
  };
};

// Usage within the compiler API
// ts.transpileModule(source, { transformers: { before: [redactStringsTransformer] } });
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is the Abstract Syntax Tree (AST) in the context of TypeScript?</strong><br/>A: The AST is a tree representation of the abstract syntactic structure of source code. Each node denotes a construct occurring in the code (e.g., VariableDeclaration, ClassDeclaration).</li>
        <li><strong>Q2: Provide an example use case for the TypeScript Compiler API.</strong><br/>A: Creating custom linting rules (via tools like typescript-eslint), generating documentation from comments, extracting API signatures for library consumers, or compiling code dynamically on the server.</li>
        <li><strong>Q3: What is a Custom Transformer?</strong><br/>A: A plugin for the TypeScript compiler that can intercept the AST during the build process, allowing you to modify, add, or delete nodes before the final JavaScript and type definitions are emitted.</li>
        <li><strong>Q4: Why might you choose a Custom Transformer over a Decorator?</strong><br/>A: Decorators run at runtime and add overhead. Transformers run at compile-time, meaning zero runtime overhead. Transformers can also alter any part of the code (like modifying strings or logic), whereas decorators are limited to observing/wrapping classes and methods.</li>
        <li><strong>Q5: What is the <code>ts.visitEachChild</code> function used for?</strong><br/>A: It is a helper provided by the Compiler API to recursively traverse down the AST, applying a visitor function to every child of a given node.</li>
      </ul>
    `
  },
  {
    title: "High-Performance TypeScript and Project References",
    content: `
      <h2>Compiler Performance Tuning</h2>
      <p>As TypeScript projects scale to millions of lines of code, compilation times and IDE responsiveness can degrade significantly. Optimizing the <code>tsconfig.json</code> and understanding the compiler's behavior is crucial for large enterprise applications.</p>

      <h3>Key Compiler Flags for Performance</h3>
      <ul>
        <li><code>skipLibCheck: true</code> - Skips type checking of declaration files (<code>.d.ts</code>). This provides the single largest performance boost in large projects, as it ignores checking complex library types like <code>@types/react</code> or <code>@types/lodash</code>.</li>
        <li><code>incremental: true</code> - Instructs TypeScript to save compilation metadata to a <code>.tsbuildinfo</code> file. Subsequent builds only recompile files that changed and their dependents.</li>
        <li><code>isolatedModules: true</code> - Ensures each file can be transpiled safely by tools like Babel or esbuild without needing the full type context (e.g., disallowing re-exporting of implicit types). This allows for lightning-fast concurrent transpilation.</li>
      </ul>

      <h2>TypeScript Project References</h2>
      <p>Monorepos (multiple packages in a single repository) are the standard for large codebases. Project References (introduced in TS 3.0) allow you to structure your TypeScript program into smaller, independently compilable pieces. This improves build times drastically because TS only rebuilds the modified projects.</p>

      <h3>Setting up Project References</h3>
      <p>A root <code>tsconfig.json</code> acts as the orchestrator:</p>
      <pre><code class="language-json">
// root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/ui" },
    { "path": "./packages/app" }
  ]
}
      </code></pre>
      <p>Each package must have <code>composite: true</code> enabled to allow other projects to reference it. The build system must be invoked with the build flag: <code>tsc --build</code> or <code>tsc -b</code>.</p>
      <pre><code class="language-json">
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "declaration": true,
    "outDir": "./dist"
  }
}
      </code></pre>

      <h2>Avoiding "Excessively Deep" Recursion</h2>
      <p>Deeply nested conditional types or recursive mapped types (like deep partials or deep omit) can cause the compiler to perform millions of checks, locking up the CPU. You should constrain type inputs, avoid deeply nested unions, and use simple interfaces over complex type aliases for core entities.</p>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What does the <code>skipLibCheck</code> compiler option do, and why is it important?</strong><br/>A: It tells the compiler to skip type checking of all <code>.d.ts</code> files. It drastically reduces compilation time because it assumes third-party types are already correct.</li>
        <li><strong>Q2: Explain the purpose of TypeScript Project References.</strong><br/>A: They allow partitioning a large TypeScript codebase into smaller, separate projects that can be compiled independently. This enables incremental builds across project boundaries, vastly improving compilation speeds in monorepos.</li>
        <li><strong>Q3: What compiler flag is strictly required for a project to be referenced by another project?</strong><br/>A: <code>"composite": true</code>. This forces the project to emit <code>.tsbuildinfo</code> and declarations, ensuring the consuming project can quickly determine its dependency interface.</li>
        <li><strong>Q4: How do you build a project that utilizes Project References?</strong><br/>A: Using the <code>tsc --build</code> or <code>tsc -b</code> command, rather than the standard <code>tsc</code>.</li>
        <li><strong>Q5: Why are interfaces often preferred over type aliases for compilation performance?</strong><br/>A: Interfaces create a single named type that the compiler can cache and recursively resolve efficiently. Type aliases (especially intersections and unions) are evaluated eagerly and can result in massive Cartesian products of types that the compiler must resolve entirely, slowing down type-checking.</li>
        <li><strong>Q6: What does <code>isolatedModules</code> do and which tools benefit from it?</strong><br/>A: It warns you if you write code that cannot be safely transpiled on a single-file basis (e.g., using const enums). It is required for fast transpilers like esbuild, SWC, or Babel to safely strip TypeScript syntax concurrently without needing a full type-check phase.</li>
      </ul>
    `
  },
  {
    title: "Type-Safe Event Emitters and Pub/Sub",
    content: `
      <h2>The Problem with Standard EventEmitters</h2>
      <p>The standard Node.js <code>EventEmitter</code> is entirely untyped. You can emit any event name with any payload, and listeners have no idea what payload they will receive. This leads to brittle systems prone to typo-related bugs.</p>

      <h2>Building a Strictly Typed EventEmitter</h2>
      <p>We can use mapped types, the <code>keyof</code> operator, and rest parameters to build a fully type-safe event emitter.</p>

      <pre><code class="language-typescript">
// Define an interface where keys are event names and values are the payload types
interface MyEvents {
  userLogin: { userId: string; timestamp: number };
  userLogout: { userId: string };
  error: Error;
}

class TypedEventEmitter&lt;Events extends Record&lt;string, any&gt;&gt; {
  private listeners: { [K in keyof Events]?: Array&lt;(payload: Events[K]) =&gt; void&gt; } = {};

  on&lt;K extends keyof Events&gt;(event: K, listener: (payload: Events[K]) =&gt; void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  emit&lt;K extends keyof Events&gt;(event: K, payload: Events[K]): void {
    const eventListeners = this.listeners[event];
    if (eventListeners) {
      eventListeners.forEach(listener =&gt; listener(payload));
    }
  }
}

const emitter = new TypedEventEmitter&lt;MyEvents&gt;();

// Autocompletes "userLogin", "userLogout", "error"
// Enforces payload to be { userId: string, timestamp: number }
emitter.on("userLogin", (data) =&gt; {
  console.log(data.userId); 
});

// Compile error: Property 'timestamp' is missing in type...
// emitter.emit("userLogin", { userId: "123" }); 
      </code></pre>

      <h2>Advanced Generic Event Bus</h2>
      <p>In complex architectures (like Micro-frontends or CQRS architectures), you might need a generalized message bus. You can leverage discriminated unions to create a single strongly-typed <code>dispatch</code> function.</p>

      <pre><code class="language-typescript">
type Action = 
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'REMOVE_TODO'; payload: { id: string } };

class EventBus {
  dispatch&lt;T extends Action['type']&gt;(
    type: T, 
    // Extract the specific action based on the 'type' discriminator
    payload: Extract&lt;Action, { type: T }&gt;['payload']
  ) {
    // Process event...
  }
}

const bus = new EventBus();
bus.dispatch('ADD_TODO', { text: "Learn TS" }); // OK
// bus.dispatch('REMOVE_TODO', { text: "Typo" }); // ERROR: Expected { id: string }
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: Why is the default Node.js EventEmitter considered unsafe in TypeScript?</strong><br/>A: Its method signatures (like <code>on</code> and <code>emit</code>) type the event name as a generic <code>string | symbol</code> and arguments as <code>any[]</code>, offering zero autocomplete or payload validation.</li>
        <li><strong>Q2: How do you enforce specific payloads for specific event names in a custom Event Emitter?</strong><br/>A: By using a generic interface representing the event map (keys are event names, values are payloads) and using generic constraints on the methods: <code>on&lt;K extends keyof EventMap&gt;(event: K, cb: (data: EventMap[K]) =&gt; void)</code>.</li>
        <li><strong>Q3: What does the utility type <code>Extract&lt;T, U&gt;</code> do, and how is it used in event dispatching?</strong><br/>A: <code>Extract</code> constructs a type by extracting from <code>T</code> all union members that are assignable to <code>U</code>. In an event bus utilizing discriminated unions, <code>Extract&lt;Action, { type: 'LOG' }&gt;</code> isolates the specific Log action from the union so its precise payload type can be inferred.</li>
        <li><strong>Q4: Explain the type <code>Record&lt;string, any&gt;</code>. Why is it used as a constraint for the event map?</strong><br/>A: <code>Record&lt;K, T&gt;</code> is a utility type that constructs an object type whose keys are <code>K</code> and values are <code>T</code>. <code>Record&lt;string, any&gt;</code> ensures that the generic provided to the TypedEventEmitter is an object structure.</li>
        <li><strong>Q5: Can you type events that take multiple arguments instead of a single payload object?</strong><br/>A: Yes, the event map values can be defined as tuple types representing function arguments. The listener type would then spread them: <code>listener: (...args: Events[K]) =&gt; void</code>.</li>
      </ul>
    `
  },
  {
    title: "WebAssembly (Wasm) and Rust FFI with TypeScript",
    content: `
      <h2>The Rise of WebAssembly</h2>
      <p>WebAssembly (Wasm) provides a way to run code written in languages like C, C++, or Rust on the web at near-native speeds. TypeScript integrates deeply with Wasm by acting as the strict, typed bridge (FFI - Foreign Function Interface) between the browser's JavaScript engine and the compiled Wasm binary.</p>

      <h2>Compiling Rust to Wasm using wasm-bindgen</h2>
      <p>When writing Rust for the web, <code>wasm-bindgen</code> is the standard tool. It automatically generates TypeScript definition files (<code>.d.ts</code>) corresponding to your Rust functions and structs, making the interop completely type-safe.</p>

      <pre><code class="language-rust">
// Rust code (lib.rs)
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Point {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -&gt; Point {
        Point { x, y }
    }

    pub fn distance(&self, other: &Point) -&gt; f64 {
        ((self.x - other.x).powi(2) + (self.y - other.y).powi(2)).sqrt()
    }
}
      </code></pre>

      <p>Running <code>wasm-pack build</code> automatically generates the following TypeScript declarations:</p>

      <pre><code class="language-typescript">
// Generated TypeScript (pkg/my_wasm_lib.d.ts)
export class Point {
  free(): void;
  x: number;
  y: number;
  constructor(x: number, y: number);
  distance(other: Point): number;
}
      </code></pre>

      <h2>Memory Management across the Boundary</h2>
      <p>When passing complex data structures (arrays, strings) between TS and Wasm, data must be serialized, written to the Wasm linear memory, and deserialized on the other side. <code>wasm-bindgen</code> handles this automatically. However, when working with raw Wasm modules without bindgen, you must use <code>WebAssembly.Memory</code>.</p>

      <pre><code class="language-typescript">
// Interacting with raw Wasm memory via Typed Arrays
const memory = new WebAssembly.Memory({ initial: 1 });
const wasmModule = await WebAssembly.instantiateStreaming(fetch('math.wasm'), {
  env: { memory }
});

// Writing an array to Wasm memory
const floatArray = new Float32Array(memory.buffer);
floatArray[0] = 1.5;
floatArray[1] = 2.5;

// Calling a wasm function that reads pointers
const sum = wasmModule.instance.exports.sum_array(0, 2); 
console.log(sum);
      </code></pre>

      <h2>Performance Considerations</h2>
      <p>The transition between JS/TS and Wasm has a cost. For maximum performance, minimize the number of calls across the boundary. Pass large chunks of data via shared memory buffers (SharedArrayBuffer) rather than individual objects, and let Wasm perform heavy computations before returning the result.</p>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is WebAssembly and how does it relate to TypeScript?</strong><br/>A: WebAssembly is a binary instruction format for a stack-based virtual machine, designed as a portable compilation target for languages like Rust/C++. TypeScript acts as the type-safe host environment, orchestrating the loading, execution, and data bridging (FFI) with the Wasm module.</li>
        <li><strong>Q2: What is the role of <code>wasm-bindgen</code> when using Rust with TypeScript?</strong><br/>A: It facilitates high-level interactions between Wasm modules and JavaScript. It automatically generates JS wrapper code and precise <code>.d.ts</code> TypeScript definitions corresponding to Rust structs and functions.</li>
        <li><strong>Q3: How is complex data (like strings or objects) passed between TypeScript and Wasm?</strong><br/>A: Wasm only understands numbers (i32, i64, f32, f64). Complex data is passed by writing it into a shared ArrayBuffer (the Wasm linear memory) from TypeScript, and passing the numeric pointer (offset) and length to the Wasm function.</li>
        <li><strong>Q4: Why does a generated Wasm class in TypeScript (via wasm-bindgen) have a <code>free()</code> method?</strong><br/>A: Because Rust objects allocated in Wasm memory are not automatically garbage collected by the JavaScript engine. You must explicitly call <code>free()</code> in TypeScript when the object is no longer needed to deallocate the memory in Wasm.</li>
        <li><strong>Q5: What is the performance bottleneck when combining TS and Wasm?</strong><br/>A: The serialization/deserialization of data and the context-switching overhead when calling across the FFI boundary. Frequent, tiny calls to Wasm are slower than performing the entire workload within TS. Wasm excels at prolonged, heavy numeric computation.</li>
      </ul>
    `
  },
  {
    title: "Domain-Specific Languages (DSLs) with TypeScript",
    content: `
      <h2>What is a DSL?</h2>
      <p>A Domain-Specific Language (DSL) is a language specialized to a particular application domain, contrasting with general-purpose languages. In TypeScript, we can build internal DSLs—fluent APIs or builder patterns that leverage the compiler to enforce strict grammatical rules for the domain.</p>

      <h2>Building a SQL Query Builder DSL</h2>
      <p>We can use template literals, keyof, and mapped types to build a type-safe SQL query generator where typos in column names are caught at compile-time.</p>

      <pre><code class="language-typescript">
type TableMap = {
  users: { id: number; name: string; age: number; active: boolean };
  posts: { id: number; authorId: number; title: string; content: string };
};

class QueryBuilder&lt;Table extends keyof TableMap&gt; {
  constructor(private table: Table) {}

  // Enforces that selected columns actually exist on the table
  select&lt;K extends keyof TableMap[Table]&gt;(...columns: K[]): this {
    // implementation
    return this;
  }

  // Enforces that the where clause references valid columns and value types
  where(column: keyof TableMap[Table], operator: '=' | '&gt;' | '&lt;', value: any): this {
    // implementation
    return this;
  }
}

const qb = new QueryBuilder('users')
  .select('id', 'name')
  .where('age', '&gt;', 18);

// Compile Error: Argument of type '"firstName"' is not assignable to parameter of type '"id" | "name" | "age" | "active"'
// qb.select('firstName'); 
      </code></pre>

      <h2>Creating Validation DSLs (like Zod)</h2>
      <p>Modern schema validation libraries like Zod or Yup are essentially internal DSLs. They chain methods to define a schema, which then infers the static TypeScript type.</p>

      <pre><code class="language-typescript">
class StringValidator {
  private validators: Array&lt;(val: string) =&gt; boolean&gt; = [];

  min(length: number): this {
    this.validators.push(val =&gt; val.length &gt;= length);
    return this;
  }

  email(): this {
    this.validators.push(val =&gt; /.*@.*/.test(val)); // Simplistic
    return this;
  }

  validate(val: string): boolean {
    return this.validators.every(fn =&gt; fn(val));
  }
}

const emailSchema = new StringValidator().min(5).email();
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is an internal DSL in the context of TypeScript?</strong><br/>A: An API designed to read like a specialized language using TypeScript's native syntax (like method chaining or object configuration) while utilizing the type system to enforce strict domain rules at compile time.</li>
        <li><strong>Q2: How does the type inference in libraries like Zod work under the hood?</strong><br/>A: They use complex generics and mapped types to construct a TypeScript type simultaneously while building the runtime validation object. When you call <code>z.infer&lt;typeof schema&gt;</code>, it unwraps the generic type information stored inside the schema class.</li>
        <li><strong>Q3: How do template literal types aid in creating DSLs?</strong><br/>A: They allow DSLs to parse strings at compile time. For instance, an ORM DSL can parse an inclusion string like <code>"user.posts"</code> and ensure that <code>user</code> has a relation to <code>posts</code>.</li>
        <li><strong>Q4: What is the main benefit of implementing a Query Builder as a TypeScript DSL instead of writing raw SQL strings?</strong><br/>A: Type safety. The TypeScript compiler catches misspelled table names, incorrect column references, and type mismatches in conditions before the code ever runs or touches the database.</li>
      </ul>
    `
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 6', 'Compiler APIs, Wasm, Project References, and DSLs.', topics);
