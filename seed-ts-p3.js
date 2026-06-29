import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "11. Modules & Namespaces",
    description: "Understanding how to organize, encapsulate, and share TypeScript code across files using ES Modules and legacy Namespaces.",
    content: `
# Modules & Namespaces

As applications grow, code organization becomes critical. TypeScript provides two ways to organize code: Modules (the modern, standard approach) and Namespaces (the legacy TypeScript-specific approach).

## Modules (ES Modules)

Modules are executed within their own scope, not in the global scope. Variables, functions, classes, etc. declared in a module are not visible outside the module unless they are explicitly exported using one of the \`export\` forms. Conversely, to consume a variable, function, class, interface, etc. exported from a different module, it has to be imported using one of the \`import\` forms.

In TypeScript, just as in ECMAScript 2015, any file containing a top-level \`import\` or \`export\` is considered a module.

### Exporting

You can export declarations (variables, functions, classes, interfaces, type aliases).

\`\`\`typescript
// math.ts
export const pi = 3.14;

export function add(x: number, y: number): number {
    return x + y;
}

export interface Calculator {
    add(x: number, y: number): number;
}
\`\`\`

You can also use a single export statement at the bottom:

\`\`\`typescript
const pi = 3.14;
function add(x: number, y: number) { return x + y; }
export { pi, add };
\`\`\`

### Default Exports

Each module can optionally export a \`default\` export. Default exports are imported using a different syntax.

\`\`\`typescript
// logger.ts
export default class Logger {
    log(msg: string) { console.log(msg); }
}
\`\`\`

### Importing

Importing is done using the \`import\` keyword.

\`\`\`typescript
// app.ts

// Importing named exports (must use curly braces and match names)
import { pi, add } from "./math";
console.log(add(10, pi));

// Importing a default export (no curly braces, can name it anything)
import MyLogger from "./logger";
const logger = new MyLogger();
logger.log("Hello Modules");

// Importing everything into a single variable
import * as MathUtils from "./math";
console.log(MathUtils.add(5, 5));
\`\`\`

### Type-Only Imports and Exports

TypeScript allows you to explicitly specify that you are only importing or exporting types. This is highly beneficial because the compiler guarantees that these statements are completely erased from the compiled JavaScript, optimizing bundle size and avoiding runtime issues with circular dependencies.

\`\`\`typescript
// Importing only types
import type { Calculator } from "./math";

// Exporting only types
export type { Calculator };
\`\`\`

## Namespaces (Internal Modules)

*Note: Namespaces are a legacy feature. In modern TypeScript development, ES Modules are strongly preferred and recommended. Namespaces are mainly seen in older codebases or DefinitelyTyped definition files (.d.ts).*

Namespaces provide a way to logically group related code and prevent global namespace pollution without using the module system (e.g., when compiling to a single giant JavaScript file via the \`--outFile\` compiler flag).

\`\`\`typescript
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;

    // Exported classes are accessible outside
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}

// Usage
let strings = ["Hello", "98052", "101"];
let validator = new Validation.LettersOnlyValidator();

for (let s of strings) {
    console.log(\`"\${s}" - \${validator.isAcceptable(s) ? "matches" : "does not match"}\`);
}
\`\`\`

## Interview Questions
1.  **What defines a file as a Module in TypeScript?**
    *   *Answer:* Any file containing a top-level \`import\` or \`export\` statement is treated as a module. Its contents are scoped to the file, not the global object. A file without these is treated as a script, and its contents are globally available.
2.  **What is the difference between a named export and a default export?**
    *   *Answer:* A module can have multiple named exports (e.g., \`export const x = 1\`), which must be imported using their exact names within curly braces (\`import { x } from ...\`). A module can have only one default export (\`export default class...\`), which can be imported without braces and assigned any local name (\`import MyClass from ...\`).
3.  **Why would you use \`import type\` instead of a regular \`import\`?**
    *   *Answer:* \`import type\` explicitly tells the compiler that you are only importing a TypeScript type or interface, not a value. This guarantees the import will be completely erased in the emitted JavaScript, improving performance and avoiding issues with circular dependencies or side-effectful module loading at runtime.
4.  **Are Namespaces recommended for modern TypeScript applications?**
    *   *Answer:* No. Namespaces are a legacy TypeScript feature created before ECMAScript Modules (ES6) became the standard. Modern applications should use ES Modules for file organization, dependency management, and tree-shaking capabilities.
5.  **How do you import all named exports from a module into a single namespace-like object?**
    *   *Answer:* Using the syntax \`import * as AliasName from "./modulePath"\`. You can then access exports like \`AliasName.myFunction()\`.
`
  },
  {
    title: "12. Decorators (Basics)",
    description: "An introduction to metaprogramming in TypeScript using Decorators to add annotations and modify classes, methods, and properties at design time.",
    content: `
# Decorators (Basics)

With the introduction of Classes in TypeScript and ES6, there exist certain scenarios that require additional features to support annotating or modifying classes and class members. Decorators provide a way to add both annotations and a metaprogramming syntax for class declarations and members.

*Note: Decorators are an experimental feature that may change in future releases. To use them, you must enable the \`experimentalDecorators\` compiler option in your \`tsconfig.json\`.*

\`\`\`json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
\`\`\`

## What is a Decorator?

A Decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. Decorators use the form \`@expression\`, where \`expression\` must evaluate to a function that will be called at runtime with information about the decorated declaration.

## Class Decorators

A class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition.

The decorator function receives the constructor function as its only argument.

\`\`\`typescript
// The decorator function
function Sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

// Applying the decorator
@Sealed
class BugReport {
    type = "report";
    title: string;

    constructor(t: string) {
        this.title = t;
    }
}
\`\`\`

In this example, the \`@Sealed\` decorator seals the \`BugReport\` constructor and its prototype, preventing new properties from being added to them at runtime.

## Decorator Factories

If you want to customize how a decorator is applied to a declaration, you can write a decorator factory. A Decorator Factory is simply a function that returns the expression that will be called by the decorator at runtime.

\`\`\`typescript
function Color(colorString: string) { // This is the decorator factory
    return function (constructor: Function) { // This is the decorator
        constructor.prototype.themeColor = colorString;
    }
}

@Color("dark-mode")
class UIComponent {
    // themeColor will be injected by the decorator
}

const el = new UIComponent();
console.log((el as any).themeColor); // Outputs: "dark-mode"
\`\`\`

## Method Decorators

A method decorator is applied to the Property Descriptor for the method, and can be used to observe, modify, or replace a method definition.

It takes three arguments:
1.  Target: The prototype of the class for an instance member, or the constructor function for a static member.
2.  PropertyKey: The name of the member.
3.  Descriptor: The Property Descriptor for the member.

\`\`\`typescript
function LogExecution(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // Save a reference to the original method
    const originalMethod = descriptor.value;

    // Modify the method descriptor's value property
    descriptor.value = function (...args: any[]) {
        console.log(\`Execution of \${propertyKey} started\`);
        const result = originalMethod.apply(this, args);
        console.log(\`Execution of \${propertyKey} ended\`);
        return result;
    };

    return descriptor;
}

class Calculator {
    @LogExecution
    add(a: number, b: number) {
        return a + b;
    }
}

const calc = new Calculator();
calc.add(2, 3);
// Output:
// Execution of add started
// Execution of add ended
\`\`\`

## Common Use Cases

Frameworks like Angular and NestJS heavily rely on decorators:
*   **Routing/Controllers:** \`@Get('/users')\` or \`@Controller()\`.
*   **Dependency Injection:** \`@Injectable()\` or \`@Inject()\`.
*   **Validation:** \`@IsString()\`, \`@MinLength(5)\` (used with libraries like \`class-validator\`).

## Interview Questions
1.  **What is a Decorator in TypeScript?**
    *   *Answer:* A Decorator is a special kind of declaration (using the \`@\` symbol) that can be attached to classes, methods, properties, or parameters. It is a function that runs at design/definition time (not instantiation time) and allows for metaprogramming—observing, modifying, or replacing the decorated entity.
2.  **How do you enable Decorators in a TypeScript project?**
    *   *Answer:* By setting \`"experimentalDecorators": true\` in the \`compilerOptions\` of the \`tsconfig.json\` file.
3.  **What is a Decorator Factory?**
    *   *Answer:* A decorator factory is a function that *returns* a decorator function. It is used when you need to pass arguments to a decorator (e.g., \`@Component({ selector: 'my-app' })\`).
4.  **What arguments does a Method Decorator receive?**
    *   *Answer:* It receives three arguments: the \`target\` (prototype of the class), the \`propertyKey\` (name of the method), and the \`descriptor\` (the PropertyDescriptor, which contains the actual method function inside \`descriptor.value\`).
5.  **Can decorators change the runtime behavior of a method? Provide an example.**
    *   *Answer:* Yes. A method decorator can replace \`descriptor.value\` with a new function. This new function can execute custom logic (like logging, timing, or authorization checks) before or after calling the original method using \`originalMethod.apply(this, args)\`.
`
  },
  {
    title: "13. Type Inference & Type Assertions",
    description: "Understanding how TypeScript guesses types automatically (Inference) and how developers can override those guesses (Assertions).",
    content: `
# Type Inference & Type Assertions

TypeScript is designed to provide type safety without forcing you to write types everywhere. Understanding how it infers types, and how to safely override it when it gets things wrong, is crucial for writing idiomatic TypeScript.

## Type Inference

In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation.

### Basics

When initializing a variable, the type is inferred from the assigned value.

\`\`\`typescript
let x = 3; 
// TS infers: let x: number = 3;
// x = "hello"; // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

### Best Common Type

When a type inference is made from several expressions, the types of those expressions are used to calculate a "best common type".

\`\`\`typescript
let x = [0, 1, null];
// TS infers: let x: (number | null)[]
\`\`\`

To infer the type of \`x\`, TypeScript considers the types of the array elements (number and null) and creates a union type.

### Contextual Typing

Type inference also works in "the other direction" in some cases in TypeScript. This is known as "contextual typing". Contextual typing occurs when the type of an expression is implied by its location.

\`\`\`typescript
window.onmousedown = function(mouseEvent) {
    // TypeScript knows 'mouseEvent' is of type MouseEvent because of window.onmousedown
    console.log(mouseEvent.button);  // OK
    // console.log(mouseEvent.kangaroo); // Error: Property 'kangaroo' does not exist on type 'MouseEvent'.
};
\`\`\`

If we assigned the function to a standalone variable, there is no contextual typing, so \`mouseEvent\` would default to \`any\` (or throw an error if \`noImplicitAny\` is true).

## Type Assertions

Sometimes you will have information about the type of a value that TypeScript can’t know about. Usually, this happens when you interact with the DOM or external APIs.

In these situations, you can use a type assertion to tell the compiler "Trust me, I know what I'm doing." A type assertion is like a type cast in other languages, but it performs no special checking or restructuring of data at runtime. It has no runtime impact and is used purely by the compiler.

There are two syntaxes for type assertions.

### 1. The \`as\` syntax (Recommended)

\`\`\`typescript
// document.getElementById returns HTMLElement | null.
// If we know it's specifically an HTMLCanvasElement, we assert it.
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;

// Now we can use canvas specific properties safely
const ctx = myCanvas.getContext("2d");
\`\`\`

### 2. The "angle-bracket" syntax

\`\`\`typescript
let someValue: unknown = "this is a string";

// Asserting that 'someValue' is actually a string so we can use .length
let strLength: number = (<string>someValue).length;
\`\`\`

**Note:** The \`as\` syntax is generally preferred, and is required if you are using TypeScript with JSX (React), because angle brackets conflict with JSX syntax.

### Impossible Assertions

TypeScript prevents you from making assertions that are completely unreasonable (e.g., asserting a \`string\` is a \`number\`).

\`\`\`typescript
const x = "hello";
// const y = x as number; // Error: Conversion of type 'string' to type 'number' may be a mistake...
\`\`\`

If you absolutely must override this safety check (usually a bad idea), you have to assert to \`unknown\` (or \`any\`) first:

\`\`\`typescript
const z = (x as unknown) as number; // Compiler allows this, but it will cause runtime issues.
\`\`\`

## Non-Null Assertion Operator (!.)

A specific type of assertion is the non-null assertion operator \`!\`. It tells TypeScript that an expression is not \`null\` or \`undefined\`.

\`\`\`typescript
function liveDangerously(x?: number | null) {
    // x could be undefined or null here
    // console.log(x.toFixed()); // Error

    // By adding !, we assert it is definitely a number here
    console.log(x!.toFixed()); 
}
\`\`\`

*Use this sparingly!* If the value actually is null at runtime, your application will crash. It is better to use proper Type Guards (e.g., \`if (x !== null) {...}\`) to narrow the type safely.

## Interview Questions
1.  **What is Contextual Typing in TypeScript?**
    *   *Answer:* It's when TypeScript infers the type of an expression based on the context in which it is used. For example, inferring the types of parameters in a callback function passed to \`array.map()\` or assigned to an event handler like \`window.onclick\`.
2.  **What is a Type Assertion, and does it affect code at runtime?**
    *   *Answer:* A type assertion tells the compiler to treat a value as a specific type, overriding the compiler's inferred type. It is purely a compile-time construct and is completely erased during compilation; it has zero impact on runtime behavior.
3.  **Why is the \`as Type\` syntax preferred over the \`<Type>\` syntax for assertions?**
    *   *Answer:* Because the angle-bracket syntax \`<Type>\` clashes with JSX syntax in React (\`.tsx\` files). Using \`as Type\` is universally compatible.
4.  **How does TypeScript handle impossible assertions, and how can you bypass it?**
    *   *Answer:* TypeScript throws a compile-time error if you try to assert a value to a completely unrelated type (like \`string\` to \`number\`). You can bypass this by first asserting to \`unknown\` or \`any\`, and then to the desired type (\`(val as unknown) as number\`), though this is highly discouraged.
5.  **Explain the Non-Null Assertion Operator (\`!\`). When should you avoid using it?**
    *   *Answer:* The \`!\` operator removes \`null\` and \`undefined\` from a type. It tells the compiler "I guarantee this value is not null here." You should avoid it because if your assumption is wrong, it will cause a runtime crash. Safe type guarding (\`if (val) ...\`) or optional chaining (\`?.\`) are much safer alternatives.
`
  },
  {
    title: "14. Asynchronous Programming in TS (Promises, Async/Await)",
    description: "Deep dive into strongly typing asynchronous JavaScript: handling Promises, typing async/await, and managing complex async data flows.",
    content: `
# Asynchronous Programming in TS (Promises, Async/Await)

JavaScript relies heavily on asynchronous operations (network requests, file I/O, timers). TypeScript ensures that we handle these asynchronous operations with strict type safety.

## Typing Promises

A \`Promise\` in TypeScript is a generic class: \`Promise<T>\`. The type variable \`T\` represents the type of data the promise will resolve with.

\`\`\`typescript
// A function returning a Promise that resolves to a string
function fetchGreeting(): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Hello from the server!");
            // reject("Network error"); 
        }, 1000);
    });
}

fetchGreeting().then((data) => {
    // TypeScript knows 'data' is a string
    console.log(data.toUpperCase());
}).catch((error) => {
    // 'error' is typically typed as 'any' or 'unknown'
    console.error(error);
});
\`\`\`

If a Promise doesn't return any specific data, use \`Promise<void>\`.

\`\`\`typescript
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}
\`\`\`

## Async / Await

The \`async\` / \`await\` syntax provides a more synchronous-looking way to write asynchronous code.

Any function marked with \`async\` *always* returns a Promise. TypeScript will enforce this.

\`\`\`typescript
interface User {
    id: number;
    username: string;
}

// Typing an async function
async function getUser(id: number): Promise<User> {
    const response = await fetch(\`https://api.example.com/users/\${id}\`);
    
    if (!response.ok) {
        throw new Error("Failed to fetch");
    }

    // The result of response.json() is 'any' by default.
    // We type assert it to the expected interface.
    const data = await response.json() as User;
    return data;
}

async function main() {
    try {
        const user = await getUser(1);
        console.log(user.username); // 'user' is strongly typed as User
    } catch (error) {
        // In TS 4.4+, caught errors in try/catch are of type 'unknown' (with strict flag)
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error("An unexpected error occurred", error);
        }
    }
}
\`\`\`

## Awaited Utility Type

TypeScript provides a built-in utility type called \`Awaited<Type>\`. This type is meant to model operations like \`await\` in \`async\` functions, or the \`.then()\` method on Promises - specifically, the way they recursively unwrap Promises.

\`\`\`typescript
// A Promise that resolves to a string
type P = Promise<string>;

// Awaited un-wraps the Promise to get the inner type
type Result = Awaited<P>; // Result is 'string'

// It works recursively
type NestedPromise = Promise<Promise<number>>;
type NestedResult = Awaited<NestedPromise>; // NestedResult is 'number'
\`\`\`

\`Awaited\` is particularly useful when you need to infer the return type of an API call or a complex generic async function.

## Promise.all

When executing multiple promises concurrently, \`Promise.all\` is used. TypeScript handles the typing for this beautifully, returning a Tuple of the resolved types.

\`\`\`typescript
async function fetchUserAndPosts(userId: number) {
    const userPromise = fetch(\`/api/users/\${userId}\`).then(res => res.json() as Promise<User>);
    const postsPromise = fetch(\`/api/users/\${userId}/posts\`).then(res => res.json() as Promise<Post[]>);

    // Promise.all preserves the types in the resulting array (Tuple)
    const [user, posts] = await Promise.all([userPromise, postsPromise]);
    
    // TypeScript knows 'user' is User and 'posts' is Post[]
    return { user, posts };
}
\`\`\`

## Interview Questions
1.  **How do you specify the return type of a function that returns a Promise resolving to a number?**
    *   *Answer:* You define the return type using the generic Promise syntax: \`Promise<number>\`.
2.  **What is the implied return type of any function marked with the \`async\` keyword?**
    *   *Answer:* The return type is always wrapped in a Promise. Even if you just \`return "hello"\`, the function's signature evaluates to returning \`Promise<string>\`.
3.  **In a \`catch\` block within an \`async/await\` function, what is the type of the caught error by default in modern TypeScript (with strict mode)?**
    *   *Answer:* The caught error defaults to \`unknown\`. This forces the developer to perform a type check (e.g., \`if (error instanceof Error)\`) before attempting to access properties like \`error.message\`, making error handling much safer.
4.  **What does the \`Awaited<T>\` utility type do?**
    *   *Answer:* It recursively unwraps Promises. If you pass \`Promise<string>\` to it, it returns \`string\`. If you pass \`Promise<Promise<number>>\`, it returns \`number\`. It models the unwrapping behavior of the \`await\` keyword.
5.  **How does TypeScript handle the return type of \`Promise.all()\`?**
    *   *Answer:* It infers the return type as a Tuple matching the types of the Promises passed into the array. For example, \`Promise.all([Promise<string>, Promise<number>])\` returns \`Promise<[string, number]>\`.
`
  },
  {
    title: "15. TypeScript Configuration (tsconfig.json) & Best Practices",
    description: "Configuring the TypeScript compiler for optimal strictness, understanding tsconfig options, and adhering to industry best practices.",
    content: `
# TypeScript Configuration (tsconfig.json) & Best Practices

The \`tsconfig.json\` file is the heart of any TypeScript project. It defines the root files and the compiler options required to compile the project. Configuring it correctly is crucial for project health.

## Key Compiler Options

Here are the most critical compiler options you should understand:

### 1. The Strict Family

The \`strict\` flag is a shorthand that enables a broad range of type checking behavior that results in stronger guarantees of program correctness. **Always set \`"strict": true\` in new projects.**

Setting \`"strict": true\` enables:
*   \`noImplicitAny\`: Raises an error on expressions and declarations with an implied \`any\` type.
*   \`strictNullChecks\`: \`null\` and \`undefined\` are not in the domain of every type and are only assignable to themselves and \`any\` (the one exception being that \`undefined\` is also assignable to \`void\`).
*   \`strictFunctionTypes\`: Ensures that function parameters are checked contravariantly.
*   \`strictBindCallApply\`: Ensures that \`bind\`, \`call\`, and \`apply\` are invoked with correct arguments.
*   \`strictPropertyInitialization\`: Ensures class properties are initialized in the constructor.
*   \`noImplicitThis\`: Raises an error on \`this\` expressions with an implied \`any\` type.
*   \`useUnknownInCatchVariables\`: Changes the default type of catch clause variables from \`any\` to \`unknown\`.

### 2. Output and Module Generation

*   **\`target\`**: Specifies the JavaScript version to compile to (e.g., \`ES5\`, \`ES2015\`, \`ESNext\`). Choose this based on your target environment (older browsers vs. modern Node.js).
*   **\`module\`**: Specifies the module system for the compiled code (e.g., \`CommonJS\` for Node, \`ESNext\` or \`ES2015\` for modern bundlers like Webpack/Vite).
*   **\`outDir\`**: The output directory for compiled \`.js\` files.
*   **\`rootDir\`**: The root directory of input files. Used to control the output directory structure with \`outDir\`.

### 3. Interoperability

*   **\`esModuleInterop\`**: Emits additional JavaScript to ease support for importing CommonJS modules. This enables \`import React from 'react'\` instead of \`import * as React from 'react'\`.
*   **\`allowJs\`**: Allows JavaScript files to be compiled (useful when migrating a JS project to TS).

### 4. DOM and Library Types

*   **\`lib\`**: Specifies library files to be included in the compilation. For browser apps, this usually includes \`["DOM", "ES2015"]\`.

## Example Professional \`tsconfig.json\`

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "outDir": "./dist",
    "rootDir": "./src",
    
    /* Strict Type-Checking Options */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    /* Interoperability */
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
\`\`\`

## TypeScript Best Practices

1.  **Always enable \`strict\` mode:** This is non-negotiable for modern TypeScript. It catches null pointer exceptions and forces you to type variables properly.
2.  **Avoid \`any\`:** The \`any\` type bypasses the compiler. If you don't know the type, use \`unknown\` and narrow it down with type guards.
3.  **Use Interfaces for Objects, Type Aliases for Everything Else:** Standardize on Interfaces for defining shapes and APIs, use \`type\` for unions, intersections, and mapped types.
4.  **Use \`readonly\` and \`as const\`:** Immutability reduces side effects. Mark array parameters as \`ReadonlyArray\`, object properties as \`readonly\`, and use \`as const\` for static configuration objects.
5.  **Infer what you can, annotate what you must:** Don't clutter code with obvious types (e.g., \`let x: number = 5;\`). Let TS infer the simple things, but explicitly type function return values and API boundaries.
6.  **Prefer \`unknown\` over \`any\` in \`try/catch\`:** Since TS 4.4, you can enforce this via config. Always check if the error \`instanceof Error\` before accessing \`.message\`.

## Interview Questions
1.  **What does the \`strict\` flag in \`tsconfig.json\` actually do?**
    *   *Answer:* It enables a suite of strict type-checking rules. The most impactful ones are \`noImplicitAny\` (errors if TS has to guess \`any\`) and \`strictNullChecks\` (prevents null/undefined from being assigned to other types, preventing runtime null reference errors).
2.  **Explain the difference between the \`target\` and \`module\` compiler options.**
    *   *Answer:* \`target\` determines the version of ECMAScript that the TS code is transpiled *into* (e.g., ES5, ES6). \`module\` determines how imports/exports are compiled (e.g., CommonJS for Node.js \`require()\` syntax, or ESNext for modern \`import\` statements).
3.  **Why would you enable \`esModuleInterop\`?**
    *   *Answer:* It allows you to use default imports (\`import X from 'y'\`) for CommonJS modules that don't actually have a default export. TypeScript generates helper functions to make this work smoothly, which is especially useful when importing older NPM packages.
4.  **What is the purpose of \`skipLibCheck\`?**
    *   *Answer:* It tells the compiler to skip type checking of all declaration files (\`.d.ts\`), especially those in \`node_modules\`. This significantly speeds up compilation time and prevents errors caused by conflicting or poorly written types in third-party libraries.
5.  **If you are migrating a legacy JavaScript codebase to TypeScript, which two compiler flags are most crucial to start with?**
    *   *Answer:* You would start by enabling \`allowJs: true\` to allow TS to compile existing \`.js\` files, and setting \`strict: false\` (or specifically \`noImplicitAny: false\`) so that the compiler doesn't immediately fail on thousands of un-typed variables. You then incrementally add types and turn strictness back on.
`
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 3', 'The definitive guide - Intermediate 2.', topics);
