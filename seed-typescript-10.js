import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "ts-46-compiler-api",
    title: "Chapter 46: TypeScript Compiler API",
    order: 46,
    content: "### 1. Conceptual Overview\nThe TypeScript Compiler API allows developers to programmatically interact with the compiler. It provides hooks to parse, type-check, and transform TypeScript code dynamically.\n\n### 2. Architecture & Mechanics\nIt is built around an AST (Abstract Syntax Tree), TypeChecker, and Transformers. Programs are parsed into SourceFiles containing AST Nodes, which are analyzed by the TypeChecker for semantic errors before being emitted.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation involves simply parsing files and visiting nodes using `ts.forEachChild`. An optimized approach leverages custom transformers (`ts.TransformerFactory`) to modify the AST during the emit phase, reducing overhead by integrating directly into the build pipeline.\n\n### 4. Trade-offs & Complexity\nInteracting directly with the API is highly complex and brittle, as internal compiler APIs can change between minor versions. However, it offers unparalleled control for custom linting, code generation, and sophisticated refactorings.",
    interviewQuestions: [
      { question: "What is the primary purpose of the TypeScript Compiler API?", answer: "To programmatically parse, analyze, and transform TypeScript code for tooling like linters and bundlers." },
      { question: "How does the TypeChecker differ from the Parser?", answer: "The Parser generates the AST from source text, while the TypeChecker analyzes the AST to assign types and find semantic errors." },
      { question: "What is an Abstract Syntax Tree (AST) in the context of TypeScript?", answer: "A tree representation of the syntactic structure of the source code, where each node denotes a construct occurring in the code." },
      { question: "How do custom transformers work during the compilation phase?", answer: "They intercept the AST before code generation, allowing you to modify nodes (e.g., removing types, injecting polyfills) prior to JavaScript emit." },
      { question: "Why is interacting with the Compiler API considered fragile across TypeScript versions?", answer: "Because internal APIs are not strictly governed by semantic versioning and can be altered, potentially breaking custom tooling." }
    ],
    practicalTask: {
      scenario: "Creating a basic AST parser",
      task: "Write a script using the Compiler API to parse a file and extract function names.",
      solutionCode: "import * as ts from 'typescript';\n\nconst source = `function greet() {}`;\nconst sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);\n\nfunction visit(node: ts.Node) {\n  if (ts.isFunctionDeclaration(node)) {\n    console.log(node.name?.text);\n  }\n  ts.forEachChild(node, visit);\n}\nvisit(sourceFile);"
    }
  },
  {
    slug: "ts-47-advanced-monorepos",
    title: "Chapter 47: Advanced Monorepo Strategies",
    order: 47,
    content: "### 1. Conceptual Overview\nAdvanced monorepos utilize TypeScript's Project References to split massive codebases into smaller, independently compilable units, isolating configurations and speeding up builds.\n\n### 2. Architecture & Mechanics\nBy configuring `composite: true` in `tsconfig.json` and referencing other projects via the `references` array, TypeScript builds a dependency graph. It caches build info using `.tsbuildinfo` files, drastically speeding up compilation by only rebuilding changed packages.\n\n### 3. Implementation: Standard vs Optimized\nA standard setup might just dump all files into a single compilation context, leading to slow builds. An optimized setup defines distinct packages (e.g., `core`, `utils`, `ui`), configures project references, and uses tools like Turborepo or Nx to orchestrate parallel builds based on the dependency graph.\n\n### 4. Trade-offs & Complexity\nSetting up project references introduces configuration overhead and strict rules (e.g., packages cannot circularly reference each other). It significantly speeds up builds but requires disciplined architectural boundaries and careful dependency management.",
    interviewQuestions: [
      { question: "What are Project References in TypeScript?", answer: "A feature allowing you to structure TypeScript programs into smaller pieces, letting the compiler build them separately and cache outputs." },
      { question: "What does the `composite` compiler option do?", answer: "It forces TypeScript to enforce certain constraints (like explicitly defining root files) enabling the project to be referenced by other projects." },
      { question: "How do `.tsbuildinfo` files improve build times?", answer: "They store the compiler state and dependency graph from previous builds, enabling incremental builds that skip unchanged files." },
      { question: "What happens if two referenced projects have a circular dependency?", answer: "TypeScript will throw a compilation error, as project references require a strictly directed acyclic graph (DAG) of dependencies." },
      { question: "How does a monorepo structure benefit from `declarationMap` being enabled?", answer: "It maps `.d.ts` files back to their source `.ts` files, enabling seamless 'Go to Definition' across different packages in the IDE." }
    ],
    practicalTask: {
      scenario: "Setting up a composite project",
      task: "Configure a `tsconfig.json` file for a composite project that outputs to a `dist` folder.",
      solutionCode: "{\n  \"compilerOptions\": {\n    \"composite\": true,\n    \"declaration\": true,\n    \"outDir\": \"./dist\",\n    \"rootDir\": \"./src\"\n  },\n  \"include\": [\"src/**/*\"]\n}"
    }
  },
  {
    slug: "ts-48-typescript-webassembly",
    title: "Chapter 48: TypeScript and WebAssembly",
    order: 48,
    content: "### 1. Conceptual Overview\nTypeScript can interface with WebAssembly (Wasm) either by providing precise type definitions for compiled Wasm modules, or by being compiled down to WebAssembly directly via AssemblyScript.\n\n### 2. Architecture & Mechanics\nWasm runs in a secure sandbox alongside JavaScript. TypeScript is generally used to type the glue code (JS/Wasm bridge). Alternatively, AssemblyScript provides a strict subset of TypeScript that compiles directly to WebAssembly using the Binaryen toolchain.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementations use `any` or very basic types when calling WebAssembly exports, leaving room for runtime errors. Optimized approaches auto-generate exact TypeScript definition files (`.d.ts`) using tools like `wasm-bindgen` or AssemblyScript’s emit features, ensuring type safety across the language barrier.\n\n### 4. Trade-offs & Complexity\nWriting AssemblyScript requires abandoning dynamic JavaScript features (like `any`, dynamic object shapes, and flexible closures). Furthermore, bridging Wasm and JS introduces serialization overhead, meaning Wasm should primarily be used for computationally heavy tasks rather than rapid DOM manipulation.",
    interviewQuestions: [
      { question: "How does AssemblyScript differ from standard TypeScript?", answer: "AssemblyScript uses TypeScript syntax but strictly enforces static typing and memory management, compiling to Wasm rather than JS." },
      { question: "What are the typical use cases for WebAssembly in a TypeScript project?", answer: "Image processing, physics engines, cryptographic algorithms, or anything requiring high-performance CPU-bound computation." },
      { question: "How do you type WebAssembly exports in TypeScript?", answer: "By providing a `.d.ts` declaration file that defines the function signatures exported by the WebAssembly module." },
      { question: "What is the primary performance bottleneck when integrating WebAssembly and JS?", answer: "The overhead of crossing the JS/Wasm boundary and copying data back and forth, especially for complex objects and strings." },
      { question: "Why can't you compile any arbitrary TypeScript code to WebAssembly?", answer: "Because Wasm requires strict memory layouts and static types, whereas standard TS allows dynamic JS behaviors like closures and runtime object modification." }
    ],
    practicalTask: {
      scenario: "Typing a WebAssembly export",
      task: "Write a `.d.ts` declaration for a WebAssembly module that exports an `add` function.",
      solutionCode: "export declare function add(a: number, b: number): number;\nexport declare const memory: WebAssembly.Memory;"
    }
  },
  {
    slug: "ts-49-domain-driven-design",
    title: "Chapter 49: Domain-Driven Design (DDD)",
    order: 49,
    content: "### 1. Conceptual Overview\nDomain-Driven Design (DDD) is an approach that centers development on the core business domain. TypeScript enforces DDD principles through strict typing, modeling entities, value objects, and aggregate roots robustly.\n\n### 2. Architecture & Mechanics\nTypeScript relies on structural typing, but DDD often requires nominal typing to distinguish between identical primitive structures (e.g., `UserId` vs `OrderId`). This is achieved using branded types or type intersections to enforce domain invariants and uniqueness.\n\n### 3. Implementation: Standard vs Optimized\nA standard implementation might rely on primitive types (e.g., passing a `string` for an ID). An optimized DDD implementation uses branded types (`type UserId = string & { readonly __brand: unique symbol }`) and private constructors or factory methods that guarantee validity before creating an immutable Value Object.\n\n### 4. Trade-offs & Complexity\nApplying DDD heavily increases boilerplate and cognitive load, making it absolute overkill for simple CRUD applications. However, in complex business systems, it ensures that business rules are validated at the type level and prevents invalid states from propagating through the application architecture.",
    interviewQuestions: [
      { question: "What are Value Objects in the context of DDD?", answer: "Immutable objects defined by their attributes rather than a distinct identity (e.g., a Money or Address object)." },
      { question: "How can TypeScript simulate nominal typing for entity IDs?", answer: "By using branded types or type intersections, which attach a unique, phantom tag to a primitive type." },
      { question: "What is an Aggregate Root and how would you type it?", answer: "An entity that acts as a gateway to a cluster of related objects, responsible for maintaining their consistency and enforcing domain invariants." },
      { question: "Why is structural typing sometimes a disadvantage in DDD?", answer: "Because structurally identical types (like two different IDs represented as strings) can be accidentally swapped without triggering a compiler error." },
      { question: "How do branded types prevent accidental misuse of primitive values?", answer: "They trick the compiler into treating a primitive value as a unique type, meaning a raw string cannot be passed where a branded `EmailAddress` is expected." }
    ],
    practicalTask: {
      scenario: "Creating a Branded Type",
      task: "Define a branded type for a `UserId` to prevent it from being mixed up with standard strings.",
      solutionCode: "type UserId = string & { readonly __brand: unique symbol };\n\nfunction createUserId(id: string): UserId {\n  return id as UserId;\n}"
    }
  },
  {
    slug: "ts-50-future-tc39",
    title: "Chapter 50: The Future & TC39 Proposals",
    order: 50,
    content: "### 1. Conceptual Overview\nTypeScript's evolution is closely aligned with ECMAScript (TC39) proposals. The goal is to adopt new JavaScript features natively while refining the type system, potentially moving towards making type syntax ignorable by JS engines.\n\n### 2. Architecture & Mechanics\nProposals like \"Type Annotations as Comments\" propose standardizing syntax so JS engines can natively parse (and ignore) type annotations. Meanwhile, TypeScript continuously updates its transpiler to support upcoming ECMAScript features like Records/Tuples, Pattern Matching, and standardized Decorators.\n\n### 3. Implementation: Standard vs Optimized\nStandard developers wait for stable TypeScript releases before using new features. Optimized, forward-looking developers track beta/RC versions and enable experimental flags (like new `target` or `module` settings) to evaluate upcoming ECMAScript paradigms in a type-safe environment early.\n\n### 4. Trade-offs & Complexity\nAdopting bleeding-edge TC39 features via TypeScript runs the risk of syntax changes or dropped proposals, leading to painful refactoring and technical debt. However, being an early adopter allows teams to leverage powerful new paradigms ahead of the curve and provide feedback to the language authors.",
    interviewQuestions: [
      { question: "What is the 'Type Annotations as Comments' TC39 proposal?", answer: "A proposal to allow JavaScript engines to natively parse and ignore type annotations, removing the absolute need for a build step." },
      { question: "How does TypeScript align its feature roadmap with ECMAScript?", answer: "TypeScript generally only implements new runtime features once they reach Stage 3 in the TC39 process, avoiding conflicts with standard JS." },
      { question: "What are the risks of using experimental features in production?", answer: "The API or syntax might change before finalization, or the proposal could be dropped entirely, leading to broken code and technical debt." },
      { question: "How do you test upcoming TypeScript features before official release?", answer: "By installing the `@next` tag via npm (`npm install typescript@next`) and testing in an isolated environment." },
      { question: "How has the finalization of JS Decorators affected TypeScript's implementation?", answer: "TypeScript implemented the new standard decorators, requiring developers to migrate away from the old `experimentalDecorators` flag." }
    ],
    practicalTask: {
      scenario: "Enabling experimental features",
      task: "Configure `tsconfig.json` to use experimental decorators, simulating an older experimental setup.",
      solutionCode: "{\n  \"compilerOptions\": {\n    \"experimentalDecorators\": true,\n    \"emitDecoratorMetadata\": true\n  }\n}"
    }
  }
];

appendTopics("typescript", "TypeScript Masterclass", "Advanced techniques and ecosystem integration.", topics);
