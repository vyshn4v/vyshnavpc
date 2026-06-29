import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "ts-ch41-compiler-api",
    title: "Chapter 41: TypeScript AST & Compiler API",
    order: 41,
    content: "### 1. Conceptual Overview\nExplore the Abstract Syntax Tree (AST) and the TypeScript Compiler API.\n### 2. Architecture & Mechanics\nUnderstand how the parser generates the AST, binder creates symbols, and the checker performs type resolution.\n### 3. Implementation: Standard vs Optimized\nStandard script parsing vs utilizing incremental compilation and compiler hosts.\n### 4. Trade-offs & Complexity\nThe API is powerful for custom linting and code generation but has a steep learning curve and undocumented internals.",
    interviewQuestions: [
      { question: "What is an Abstract Syntax Tree (AST) in TypeScript?", answer: "A tree representation of the abstract syntactic structure of source code, used by the compiler to analyze code." },
      { question: "What are the main phases of the TypeScript compiler?", answer: "Parsing, Binding, Type Checking, and Emitting." },
      { question: "How do you traverse an AST using the Compiler API?", answer: "Using `ts.forEachChild` or a custom visitor pattern to walk through AST nodes." },
      { question: "What is the role of the Type Checker?", answer: "It assigns types to symbols and verifies type compatibility and correctness." },
      { question: "What is a CompilerHost?", answer: "An interface that manages file system interactions, like reading files and checking file existence." }
    ],
    practicalTask: {
      scenario: "Extracting Interface Names",
      task: "Write a function using the Compiler API to extract all interface names from a source file.",
      solutionCode: "import * as ts from 'typescript';\nfunction getInterfaces(sourceFile) {\n  const names = [];\n  function visit(node) {\n    if (ts.isInterfaceDeclaration(node)) names.push(node.name.text);\n    ts.forEachChild(node, visit);\n  }\n  visit(sourceFile);\n  return names;\n}"
    }
  },
  {
    slug: "ts-ch42-advanced-decorators",
    title: "Chapter 42: Advanced Decorators & Reflection",
    order: 42,
    content: "### 1. Conceptual Overview\nDeep dive into experimental decorators, stage 3 decorators, and metadata reflection.\n### 2. Architecture & Mechanics\nHow decorators modify classes, methods, and properties at design time using `reflect-metadata`.\n### 3. Implementation: Standard vs Optimized\nUsing standard class decorators versus emitting metadata for Dependency Injection.\n### 4. Trade-offs & Complexity\nDecorators add runtime overhead and the standard is still evolving, requiring careful polyfill management.",
    interviewQuestions: [
      { question: "What is the difference between experimental and Stage 3 decorators?", answer: "Experimental decorators evaluate differently and rely on older specs, while Stage 3 decorators have a standardized API." },
      { question: "How does `reflect-metadata` work in TypeScript?", answer: "It allows you to define and read metadata on classes and properties, often using the `Reflect` API." },
      { question: "What is `emitDecoratorMetadata`?", answer: "A compiler option that emits design-time type information as metadata, crucial for DI frameworks like NestJS." },
      { question: "What parameters does a method decorator receive (experimental)?", answer: "The target object, the property key, and the property descriptor." },
      { question: "How do parameter decorators function?", answer: "They receive the target, property key, and parameter index, mostly used to attach metadata." }
    ],
    practicalTask: {
      scenario: "Creating a Validation Decorator",
      task: "Implement an experimental property decorator that logs when a property is set.",
      solutionCode: "function LogSet() {\n  return function (target, key) {\n    let val = target[key];\n    Object.defineProperty(target, key, {\n      set: (newVal) => { console.log(`Setting ${key} to ${newVal}`); val = newVal; },\n      get: () => val\n    });\n  };\n}"
    }
  },
  {
    slug: "ts-ch43-type-level-programming",
    title: "Chapter 43: Type-Level Programming",
    order: 43,
    content: "### 1. Conceptual Overview\nTreating the TypeScript type system as a Turing-complete language for compile-time computation.\n### 2. Architecture & Mechanics\nUsing recursive conditional types, template literal types, and mapped types to compute complex types.\n### 3. Implementation: Standard vs Optimized\nSimple generic types vs highly optimized tail-recursive type aliases to avoid compiler limits.\n### 4. Trade-offs & Complexity\nExtremely powerful for DX, but can severely degrade compiler performance and readability.",
    interviewQuestions: [
      { question: "Is TypeScript's type system Turing-complete?", answer: "Yes, it can perform arbitrary computations, but it has recursion limits to prevent infinite loops." },
      { question: "What are tail-recursive evaluation in conditional types?", answer: "An optimization in TS 4.5+ that prevents hitting the recursion limit by reusing the stack for certain recursive types." },
      { question: "How can you implement a tuple length type?", answer: "Using `T['length']` where `T` is an array or tuple type." },
      { question: "What is type instantiation depth?", answer: "The limit TypeScript places on recursive type instantiations (default is 50) to prevent hanging the compiler." },
      { question: "How do you split a string literal type into a tuple?", answer: "Using template literal types and recursive conditional types: `S extends \\`${infer Head}${infer Tail}\\` ? [Head, ...Split<Tail>] : []`." }
    ],
    practicalTask: {
      scenario: "String Manipulation at Compile Time",
      task: "Create a type that reverses a string literal.",
      solutionCode: "type Reverse<S extends string> = S extends `${infer First}${infer Rest}` ? `${Reverse<Rest>}${First}` : '';"
    }
  },
  {
    slug: "ts-ch44-project-references",
    title: "Chapter 44: Project References & Monorepos",
    order: 44,
    content: "### 1. Conceptual Overview\nStructuring massive codebases using TypeScript project references and composite builds.\n### 2. Architecture & Mechanics\nHow the `composite` flag, `references` array, and `tsconfig` inheritance work together to isolate compilations.\n### 3. Implementation: Standard vs Optimized\nSingle massive tsconfig vs modular project references with incremental builds.\n### 4. Trade-offs & Complexity\nReduces build times and provides strict boundary enforcement, but requires meticulous dependency management.",
    interviewQuestions: [
      { question: "What does the `composite` compiler option do?", answer: "It allows the project to be referenced by other projects and enforces certain rules to ensure safe incremental builds." },
      { question: "How do project references improve compilation speed?", answer: "By breaking the codebase into smaller parts that can be compiled independently and cached." },
      { question: "What is `declarationMap` used for?", answer: "It maps `.d.ts` files back to their `.ts` source files, enabling Go-to-Definition across project boundaries." },
      { question: "What happens if a referenced project is not built?", answer: "TypeScript can build it automatically if using `--build`, otherwise it will throw an error." },
      { question: "How do you share common settings across multiple tsconfig files?", answer: "Using the `extends` field to inherit from a base `tsconfig.json`." }
    ],
    practicalTask: {
      scenario: "Setting up a Monorepo",
      task: "Write a root tsconfig.json that references a 'core' and 'app' project.",
      solutionCode: "{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./packages/core\" },\n    { \"path\": \"./packages/app\" }\n  ]\n}"
    }
  },
  {
    slug: "ts-ch45-compiler-performance",
    title: "Chapter 45: Compiler Performance Tuning",
    order: 45,
    content: "### 1. Conceptual Overview\nIdentifying and resolving TypeScript compiler performance bottlenecks in large codebases.\n### 2. Architecture & Mechanics\nHow type instantiation, complex unions, and module resolution impact memory and CPU usage.\n### 3. Implementation: Standard vs Optimized\nUnoptimized complex interfaces vs simplified, flat interfaces with explicit return types.\n### 4. Trade-offs & Complexity\nOptimizing for the compiler might lead to slightly less 'clever' or DRY code, but dramatically improves DX.",
    interviewQuestions: [
      { question: "How can you trace TypeScript compiler performance?", answer: "By running `tsc --generateTrace` and inspecting the output in an tracing tool like Perfetto." },
      { question: "Why do explicit return types improve performance?", answer: "They prevent the compiler from having to infer the return type by inspecting the entire function body." },
      { question: "What is the impact of massive union types?", answer: "They significantly slow down type checking as TS has to check compatibility against every member of the union." },
      { question: "How does `skipLibCheck` improve performance?", answer: "It skips type checking of all declaration files (`.d.ts`), saving time at the cost of potential hidden errors." },
      { question: "What is the difference between `--incremental` and `--watch`?", answer: "`--incremental` saves compilation state to a file for faster subsequent builds, while `--watch` keeps the compiler running in memory." }
    ],
    practicalTask: {
      scenario: "Tracing Build Performance",
      task: "Provide the CLI command to generate a trace directory for analyzing tsc performance.",
      solutionCode: "npx tsc --noEmit --generateTrace traceDir"
    }
  }
];

appendTopics("typescript", "TypeScript Masterclass", "The definitive guide.", topics);
