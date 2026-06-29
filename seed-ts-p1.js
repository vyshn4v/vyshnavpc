import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "1. Introduction to TypeScript & Setup",
    description: "An exhaustive deep dive into what TypeScript is, why it exists, how it differs from JavaScript, and how to set up a professional TypeScript development environment from scratch.",
    content: `
# Introduction to TypeScript

TypeScript is a strongly typed, object-oriented, compiled language introduced by Microsoft in 2012. It is a strict syntactical superset of JavaScript, which means any valid JavaScript code is also valid TypeScript code. However, TypeScript adds optional static typing to the language.

## Why TypeScript?

JavaScript is a dynamically typed language, meaning variables can change types at runtime. While this provides flexibility, it can lead to unexpected runtime errors, especially in large codebases. TypeScript solves this by allowing developers to specify the types of variables, function parameters, and return values. The TypeScript compiler (tsc) then checks the code for type correctness before it is executed.

### Key Benefits:
1. **Early Error Detection:** Type errors are caught at compile-time rather than runtime.
2. **Enhanced IDE Support:** IDEs can provide better autocompletion, refactoring, and navigation features due to static types.
3. **Improved Code Readability and Maintainability:** Types serve as a form of documentation, making the code easier to understand and maintain.
4. **Easier Refactoring:** When changing a function signature or an object structure, the compiler will flag all places where the code needs to be updated.

## Setting Up TypeScript

### Prerequisites
You need Node.js installed on your machine. You can verify this by running \`node -v\` and \`npm -v\` in your terminal.

### Global Installation
You can install the TypeScript compiler globally using npm:

\`\`\`bash
npm install -g typescript
\`\`\`

Verify the installation:
\`\`\`bash
tsc -v
\`\`\`

### Local Installation (Recommended for Projects)
It's generally better to install TypeScript locally as a dev dependency to ensure consistent versions across different environments and team members.

\`\`\`bash
mkdir ts-project
cd ts-project
npm init -y
npm install --save-dev typescript
\`\`\`

### Initializing a tsconfig.json File
The \`tsconfig.json\` file specifies the root files and the compiler options required to compile the project. You can generate a default configuration file using:

\`\`\`bash
npx tsc --init
\`\`\`

This will create a \`tsconfig.json\` file with many options, most of which are commented out. The most important options for beginners are:
*   \`target\`: Specifies the ECMAScript target version (e.g., \`ES5\`, \`ES6\`, \`ESNext\`).
*   \`module\`: Specifies the module code generation method (e.g., \`CommonJS\`, \`ESNext\`).
*   \`strict\`: Enables all strict type-checking options.
*   \`outDir\`: Redirects output structure to the directory.
*   \`rootDir\`: Specifies the root directory of input files.

## Writing Your First TypeScript Program

Create a file named \`index.ts\`:

\`\`\`typescript
function greet(name: string): string {
    return \`Hello, \${name}!\`;
}

const userName = "Alice";
console.log(greet(userName));

// The following line would cause a compile error:
// console.log(greet(42)); 
\`\`\`

### Compiling the Code

Run the TypeScript compiler to transpile the \`.ts\` file into a \`.js\` file:

\`\`\`bash
npx tsc index.ts
\`\`\`

This will generate an \`index.js\` file with the type annotations removed, ready to be executed by Node.js or a browser:

\`\`\`javascript
"use strict";
function greet(name) {
    return "Hello, ".concat(name, "!");
}
var userName = "Alice";
console.log(greet(userName));
\`\`\`

You can then run the generated JavaScript file:
\`\`\`bash
node index.js
\`\`\`

## Using ts-node for Development

During development, running \`tsc\` and then \`node\` repeatedly can be tedious. The \`ts-node\` package allows you to execute TypeScript files directly.

\`\`\`bash
npm install --save-dev ts-node
npx ts-node index.ts
\`\`\`

## Interview Questions
1.  **What are the primary differences between TypeScript and JavaScript?**
    *   *Answer:* TS is statically typed, JS is dynamically typed. TS is compiled (transpiled) to JS, while JS is interpreted by the browser/engine. TS supports advanced OOP features like interfaces, generics, and access modifiers more cleanly than JS.
2.  **Why would a team choose to migrate a large project from JavaScript to TypeScript?**
    *   *Answer:* For better maintainability, earlier bug detection during compilation, superior IDE support (autocomplete/refactoring), and improved readability as types act as documentation.
3.  **What is the role of the \`tsconfig.json\` file?**
    *   *Answer:* It defines the compiler options (like target JS version, module system) and specifies which files should be included or excluded from the compilation process.
4.  **Can you run TypeScript code directly in a web browser?**
    *   *Answer:* No, browsers only understand JavaScript (and WebAssembly). TypeScript must be compiled (transpiled) into JavaScript before it can be executed in a browser.
5.  **What does it mean that TypeScript is a "superset" of JavaScript?**
    *   *Answer:* It means every valid JavaScript program is also a valid TypeScript program. TypeScript adds additional syntax on top of JavaScript for type checking, but doesn't change the underlying runtime behavior.
`
  },
  {
    title: "2. Basic Types & Type Annotations",
    description: "A comprehensive guide to TypeScript's primitive and foundational types, explicitly annotating types, and understanding type inference.",
    content: `
# Basic Types & Type Annotations

TypeScript provides static typing through type annotations. This chapter covers the primitive types available in TypeScript and how to use them.

## Primitive Types

TypeScript supports the same primitive types as JavaScript: \`boolean\`, \`number\`, \`string\`, \`null\`, \`undefined\`, \`symbol\`, and \`bigint\`.

### Boolean
The most basic datatype is the simple true/false value.

\`\`\`typescript
let isDone: boolean = false;
let isActive: boolean = true;
\`\`\`

### Number
As in JavaScript, all numbers in TypeScript are either floating-point values or BigIntegers. They get the type \`number\`. TypeScript supports decimal, hex, octal, and binary literals.

\`\`\`typescript
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
\`\`\`

### String
Used to represent text data. You can use double quotes (\`"\`) or single quotes (\`'\`). You can also use template literals (\` \` \`) to embed expressions.

\`\`\`typescript
let color: string = "blue";
color = 'red';

let fullName: string = \`Bob Bobbington\`;
let age: number = 37;
let sentence: string = \`Hello, my name is \${fullName}.
I'll be \${age + 1} years old next month.\`;
\`\`\`

### Null and Undefined
In TypeScript, both \`undefined\` and \`null\` actually have their own types named \`undefined\` and \`null\` respectively. Much like \`void\`, they're not extremely useful on their own.

\`\`\`typescript
let u: undefined = undefined;
let n: null = null;
\`\`\`

By default \`null\` and \`undefined\` are subtypes of all other types. That means you can assign \`null\` and \`undefined\` to something like \`number\`. However, when using the \`--strictNullChecks\` flag (which is highly recommended), \`null\` and \`undefined\` are only assignable to \`unknown\`, \`any\` and their respective types.

## Special Types

### Any
The \`any\` type allows you to opt-out of type checking. It is useful when migrating code from JavaScript to TypeScript, but its use should be minimized in strict codebases as it defeats the purpose of TypeScript.

\`\`\`typescript
let looselyTyped: any = 4;
looselyTyped.ifItExists(); // Okay, ifItExists might exist at runtime
looselyTyped.toFixed(); // Okay, toFixed exists (but the compiler doesn't check)

let looselyTypedArray: any[] = [1, true, "free"];
looselyTypedArray[1] = 100;
\`\`\`

### Unknown
\`unknown\` is the type-safe counterpart of \`any\`. Anything is assignable to \`unknown\`, but \`unknown\` isn't assignable to anything but itself and \`any\` without a type assertion or a control flow based narrowing. You cannot perform operations on an \`unknown\` value without first asserting or narrowing its type.

\`\`\`typescript
let value: unknown;

value = true;             // OK
value = 42;               // OK
value = "Hello World";    // OK

let value1: unknown = value;   // OK
let value2: any = value;       // OK
// let value3: boolean = value; // Error
// let value4: number = value;  // Error

if (typeof value === "string") {
    // TypeScript knows 'value' is a string in this block
    const uppercaseString = value.toUpperCase();
}
\`\`\`

### Void
\`void\` is a little like the opposite of \`any\`: the absence of having any type at all. You may commonly see this as the return type of functions that do not return a value.

\`\`\`typescript
function warnUser(): void {
    console.log("This is my warning message");
}
\`\`\`
Declaring variables of type \`void\` is not useful because you can only assign \`null\` (only if \`strictNullChecks\` is not specified) or \`undefined\` to them.

### Never
The \`never\` type represents the type of values that never occur. For instance, \`never\` is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns (e.g., an infinite loop).

\`\`\`typescript
// Function returning never must have unreachable end point
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {
    }
}
\`\`\`

## Type Inference
TypeScript doesn't always require explicit type annotations. It can infer the type of a variable based on its initialization.

\`\`\`typescript
let myNumber = 42; // Inferred as 'number'
// myNumber = "Hello"; // Error: Type 'string' is not assignable to type 'number'.
\`\`\`

Type inference makes code less verbose while maintaining type safety.

## Interview Questions
1.  **Explain the difference between \`any\` and \`unknown\`.**
    *   *Answer:* Both can hold any value. However, \`any\` disables all type checking on that variable, allowing you to call arbitrary methods or assign it to other typed variables. \`unknown\` forces you to perform type checking (narrowing) before you can perform operations on it or assign it to a typed variable, making it much safer.
2.  **When would you use the \`never\` type?**
    *   *Answer:* Use \`never\` for functions that never return under normal circumstances, such as a function that always throws an error or contains an infinite loop. It's also useful for exhaustive type checking in switch statements.
3.  **What does the \`strictNullChecks\` compiler option do?**
    *   *Answer:* When enabled, \`null\` and \`undefined\` are no longer subtypes of every other type. You must explicitly union them if a variable can be null/undefined (e.g., \`let name: string | null\`). This prevents many common runtime null reference errors.
4.  **Is it necessary to add type annotations to every variable in TypeScript?**
    *   *Answer:* No, TypeScript has powerful type inference. If you assign a value when declaring a variable (\`let x = 10\`), TS infers the type. Explicit annotations are needed when declaring without initializing, for function arguments, or when the inferred type is too broad.
5.  **What is the type of a variable declared without initialization and without a type annotation?**
    *   *Answer:* It defaults to \`any\`, which is generally discouraged. With the \`noImplicitAny\` compiler flag enabled, this will result in a compile-time error.
`
  },
  {
    title: "3. Interfaces & Type Aliases",
    description: "Mastering the creation of custom types using Interfaces and Type Aliases to define object shapes, function signatures, and complex structures.",
    content: `
# Interfaces & Type Aliases

TypeScript provides two primary ways to define custom types that describe the shape of an object or a function signature: Interfaces and Type Aliases. While they share many similarities, there are subtle differences in how they are used and how they behave.

## Interfaces

One of TypeScript’s core principles is that type checking focuses on the *shape* that values have. Interfaces are used to name these types, and are a powerful way of defining contracts within your code as well as contracts with code outside of your project.

### Defining an Interface

An interface defines the properties and their corresponding types that an object must possess.

\`\`\`typescript
interface User {
    name: string;
    age: number;
}

function printUser(user: User) {
    console.log(\`Name: \${user.name}, Age: \${user.age}\`);
}

const myUser = { size: 10, name: "Alice", age: 30 };
printUser(myUser); // OK, structural typing allows extra properties if not passed directly as an object literal
\`\`\`

### Optional Properties

Not all properties of an interface may be required. Some exist under certain conditions or may not be there at all. You can denote optional properties by adding a \`?\` to the end of the property name.

\`\`\`typescript
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: "white", area: 100 };
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: "black" });
\`\`\`

### Readonly Properties

Some properties should only be modifiable when an object is first created. You can specify this by putting \`readonly\` before the name of the property.

\`\`\`typescript
interface Point {
    readonly x: number;
    readonly y: number;
}

let p1: Point = { x: 10, y: 20 };
// p1.x = 5; // Error: Cannot assign to 'x' because it is a read-only property.
\`\`\`

### Function Types within Interfaces

Interfaces can also describe function types. To describe a function type with an interface, we give the interface a call signature. This is like a property declaration with only the parameter list and return type given.

\`\`\`typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
\`\`\`

### Extending Interfaces

Interfaces can extend each other. This allows you to copy the members of one interface into another, giving you more flexibility in how you separate your interfaces into reusable components.

\`\`\`typescript
interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
\`\`\`

## Type Aliases

Type aliases create a new name for a type. Type aliases are sometimes similar to interfaces, but can name primitives, unions, tuples, and any other types that you'd otherwise have to write by hand.

\`\`\`typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;

function getName(n: NameOrResolver): Name {
    if (typeof n === "string") {
        return n;
    } else {
        return n();
    }
}
\`\`\`

### Object Types with Type Aliases

Type aliases can also describe object shapes, just like interfaces.

\`\`\`typescript
type PointType = {
    x: number;
    y: number;
};
\`\`\`

### Intersections (Similar to Extending)

Instead of \`extends\`, type aliases use intersections (\`&\`) to combine types.

\`\`\`typescript
type AnimalType = {
    name: string;
};

type BearType = AnimalType & {
    honey: boolean;
};

const bear: BearType = { name: "Winnie", honey: true };
\`\`\`

## Differences Between Interfaces and Type Aliases

1.  **Declaration Merging:** Interfaces are open and can be merged. If you declare an interface multiple times, TypeScript will merge their definitions. Type aliases cannot be changed after being created.

    \`\`\`typescript
    interface Window {
        title: string;
    }
    // Later in the code
    interface Window {
        ts: TypeScriptAPI;
    }
    // Window now has both 'title' and 'ts' properties.

    type WindowType = { title: string };
    // type WindowType = { ts: TypeScriptAPI }; // Error: Duplicate identifier
    \`\`\`

2.  **Primitives and Unions:** Type aliases can be used for primitives (e.g., \`type ID = string | number\`), unions, and tuples. Interfaces are strictly for object shapes.

3.  **Extends vs Intersection:** Interfaces use \`extends\`, which is sometimes more performant for the compiler than intersecting large type aliases.

**Best Practice:** Use Interfaces for defining object shapes and contracts, especially for public APIs. Use Type Aliases for unions, primitives, tuples, and complex utility types.

## Interview Questions
1.  **What is the main difference between an Interface and a Type Alias?**
    *   *Answer:* Interfaces define object shapes and support declaration merging (they are open). Type aliases can define object shapes but also unions, primitives, and tuples; they do not support declaration merging (they are closed).
2.  **How do you define an optional property in an interface?**
    *   *Answer:* By appending a question mark \`?\` to the property name, e.g., \`age?: number\`.
3.  **What is structural typing in TypeScript?**
    *   *Answer:* TypeScript uses a structural type system (duck typing). Two types are considered compatible if their internal structure is compatible, regardless of their explicit names. If object A has all the properties required by interface B, it can be assigned to a variable of type B.
4.  **Can an interface extend a type alias? Can a type alias intersect an interface?**
    *   *Answer:* Yes to both. An interface can extend a type alias (as long as it describes an object shape). A type alias can intersect with an interface using the \`&\` operator.
5.  **Explain the \`readonly\` modifier in interfaces.**
    *   *Answer:* The \`readonly\` modifier ensures that a property can only be assigned a value when the object is initialized. Reassigning the property later will result in a compile-time error.
`
  },
  {
    title: "4. Functions & Function Types",
    description: "Deeply understanding how to type function parameters, return values, default parameters, rest parameters, and function overloads.",
    content: `
# Functions & Function Types

Functions are the fundamental building block of any application in JavaScript. TypeScript adds type safety to functions by allowing you to define types for parameters and return values.

## Typing Functions

You can add types to each of the parameters and then to the function itself to add a return type.

\`\`\`typescript
// Named function
function add(x: number, y: number): number {
    return x + y;
}

// Anonymous function
let myAdd = function(x: number, y: number): number { return x + y; };

// Arrow function
const multiply = (x: number, y: number): number => {
    return x * y;
};
\`\`\`

TypeScript can infer the return type by looking at the \`return\` statements, so you can often leave it off, but it's generally good practice to explicitly state the return type.

## Optional and Default Parameters

In TypeScript, every parameter is assumed to be required by the function. You can make parameters optional by adding a \`?\` to the end of parameters we want to be optional. Optional parameters must follow required parameters.

\`\`\`typescript
function buildName(firstName: string, lastName?: string): string {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}

let result1 = buildName("Bob");                  // works correctly
// let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // works correctly
\`\`\`

Default parameters allow you to set a value that a parameter will default to if the user does not provide one, or if the user passes \`undefined\`.

\`\`\`typescript
function buildNameWithDefault(firstName: string, lastName = "Smith"): string {
    return firstName + " " + lastName;
}

let result4 = buildNameWithDefault("Bob");                  // returns "Bob Smith"
let result5 = buildNameWithDefault("Bob", undefined);       // still returns "Bob Smith"
let result6 = buildNameWithDefault("Bob", "Adams");         // returns "Bob Adams"
\`\`\`

## Rest Parameters

Sometimes, you want to work with multiple parameters as a group, or you may not know how many parameters a function will ultimately take. You can gather these arguments together into an array using the rest operator \`...\`.

\`\`\`typescript
function buildNameRest(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}

// employeeName will be "Joseph Samuel Lucas MacKinzie"
let employeeName = buildNameRest("Joseph", "Samuel", "Lucas", "MacKinzie");
\`\`\`

## Function Overloads

JavaScript is inherently a very dynamic language. It’s not uncommon for a single JavaScript function to return different types of objects based on the shape of the arguments passed in.

Function overloads allow you to specify multiple function signatures for a single function. This is particularly useful when the return type depends on the argument types.

\`\`\`typescript
// Overload signatures (no implementation)
function reverse(str: string): string;
function reverse(arr: any[]): any[];

// Implementation signature (must be compatible with all overload signatures)
function reverse(stringOrArray: string | any[]): string | any[] {
    if (typeof stringOrArray === "string") {
        return stringOrArray.split("").reverse().join("");
    } else {
        return stringOrArray.slice().reverse();
    }
}

let reversedString = reverse("hello"); // Type is string
let reversedArray = reverse([1, 2, 3]); // Type is any[]
// let error = reverse(42); // Error: No overload matches this call.
\`\`\`

**Important Note:** The implementation signature is not visible from the outside. Only the overload signatures are used for type checking calls to the function.

## 'this' Parameters

JavaScript's \`this\` keyword can be tricky. TypeScript allows you to specify the type of \`this\` using a special, fake parameter named \`this\`. It must come first in the parameter list.

\`\`\`typescript
interface Card {
    suit: string;
    card: number;
}

interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}

let deck: Deck = {
    suits: ["hearts", "spades", "clubs", "diamonds"],
    cards: Array(52),
    // NOTE: The function now explicitly specifies that its binding must be of type Deck
    createCardPicker: function(this: Deck) {
        return () => {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return {suit: this.suits[pickedSuit], card: pickedCard % 13};
        }
    }
}

let cardPicker = deck.createCardPicker();
let pickedCard = cardPicker();
\`\`\`

## Interview Questions
1.  **How do you define optional parameters in a TypeScript function? Where must they be placed?**
    *   *Answer:* By appending a \`?\` to the parameter name (e.g., \`lastName?: string\`). Optional parameters must appear after all required parameters in the parameter list.
2.  **What is a default parameter, and how does it relate to optional parameters?**
    *   *Answer:* A default parameter assigns a value if the argument is omitted or is \`undefined\` (e.g., \`lastName = "Smith"\`). Parameters with defaults are treated as optional during type checking, but they don't have to be at the end of the parameter list.
3.  **Explain function overloading in TypeScript.**
    *   *Answer:* Function overloading allows defining multiple signatures for a single function to describe different ways it can be called. You declare multiple signatures without bodies, followed by one actual implementation whose signature is broad enough to encompass all overloads.
4.  **Why would you explicitly type the \`this\` parameter in a function?**
    *   *Answer:* To ensure that the function is called with the correct context. JavaScript's \`this\` context can change depending on how a function is called. Typing \`this\` prevents the function from being executed if the context is incorrect.
5.  **How do you type rest parameters in TypeScript?**
    *   *Answer:* Rest parameters use the \`...\` syntax and must be typed as an array (e.g., \`...numbers: number[]\`).
`
  },
  {
    title: "5. Arrays, Tuples, & Enums",
    description: "Detailed exploration of data structures in TypeScript: strictly typing arrays, using fixed-length tuples, and organizing constants with Enums.",
    content: `
# Arrays, Tuples, & Enums

TypeScript provides robust ways to handle collections of data and sets of constants. This chapter covers Arrays, Tuples, and Enums in depth.

## Arrays

TypeScript, like JavaScript, allows you to work with arrays of values. Array types can be written in one of two ways.

1.  **Square brackets \`[]\`:** Specify the type of elements followed by \`[]\`.
2.  **Generic Array type:** \`Array<elemType>\`.

\`\`\`typescript
// Using square brackets
let list1: number[] = [1, 2, 3];
let strings: string[] = ["a", "b", "c"];

// Using Generic Array type
let list2: Array<number> = [1, 2, 3];

// Arrays of objects
interface User {
    id: number;
    name: string;
}
let users: User[] = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];
\`\`\`

### Readonly Arrays

You can create arrays that shouldn't be mutated after creation using \`ReadonlyArray<T>\` or the \`readonly type[]\` syntax.

\`\`\`typescript
let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;
let ro2: readonly number[] = a;

// ro[0] = 12; // error!
// ro.push(5); // error!
// ro.length = 100; // error!
// a = ro; // error! (cannot assign readonly array back to mutable array)
\`\`\`

## Tuples

Tuple types allow you to express an array where the type of a fixed number of elements is known, but need not be the same.

\`\`\`typescript
// Declare a tuple type
let x: [string, number];

// Initialize it
x = ["hello", 10]; // OK

// Initialize it incorrectly
// x = [10, "hello"]; // Error
\`\`\`

Tuples are useful for returning multiple values from a function.

\`\`\`typescript
function getCoordinates(): [number, number, number] {
    return [40.7128, -74.0060, 10]; // lat, long, elevation
}

const [lat, long, el] = getCoordinates();
\`\`\`

### Optional Tuple Elements

You can make elements in a tuple optional by adding a \`?\`.

\`\`\`typescript
let tupleWithOptional: [string, number?] = ["hello"];
tupleWithOptional = ["world", 42];
\`\`\`

### Rest Elements in Tuples

Tuples can have rest elements, similar to rest parameters in functions.

\`\`\`typescript
type StringNumberBooleans = [string, number, ...boolean[]];
const t1: StringNumberBooleans = ["hello", 1];
const t2: StringNumberBooleans = ["beautiful", 2, true];
const t3: StringNumberBooleans = ["world", 3, true, false, true];
\`\`\`

## Enums

Enums allow a developer to define a set of named constants. Using enums can make it easier to document intent, or create a set of distinct cases. TypeScript provides both numeric and string-based enums.

### Numeric Enums

By default, enums are numeric. They start at \`0\` and auto-increment.

\`\`\`typescript
enum Direction {
    Up,     // 0
    Down,   // 1
    Left,   // 2
    Right,  // 3
}

let dir: Direction = Direction.Up;
\`\`\`

You can also specify the starting number or specify values for all members.

\`\`\`typescript
enum Status {
    New = 1,       // Starts at 1
    InProgress,    // 2
    Done,          // 3
    Cancelled = 10 // 10
}
\`\`\`

### String Enums

String enums don't auto-increment. Each member has to be constant-initialized with a string literal or with another string enum member. String enums provide meaningful and readable values at runtime, which is useful for debugging.

\`\`\`typescript
enum HttpMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
}

function makeRequest(url: string, method: HttpMethod) {
    // ...
}

makeRequest("/api/users", HttpMethod.Get);
\`\`\`

### Const Enums

Const enums are completely removed during compilation. Constant enum members are inlined at use sites. This can provide performance benefits and reduce the size of the generated JavaScript.

\`\`\`typescript
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let myDirection = Directions.Up;
// Compiles directly to: let myDirection = 0;
\`\`\`

## Interview Questions
1.  **What is a Tuple in TypeScript and how does it differ from an Array?**
    *   *Answer:* An array holds elements (usually of the same type) and has a dynamic length. A tuple represents an array with a fixed number of elements whose types are known and do not have to be the same (e.g., \`[string, number]\`).
2.  **How do you define an array of objects in TypeScript?**
    *   *Answer:* Define an interface or type alias for the object, and then use the array syntax: \`MyInterface[]\` or \`Array<MyInterface>\`.
3.  **Explain the difference between a Numeric Enum and a String Enum.**
    *   *Answer:* Numeric enums auto-increment by default (starting from 0) or from a specified value. String enums require every member to be explicitly initialized with a string literal. String enums serialize better and are easier to debug as the runtime value matches the name.
4.  **What is a \`const enum\` and why would you use it?**
    *   *Answer:* A \`const enum\` is evaluated at compile time and leaves no object reference in the generated JavaScript. Instead, the enum values are inlined where they are used. This reduces the footprint of the compiled code.
5.  **How can you make an array read-only to prevent mutations?**
    *   *Answer:* Use the \`readonly\` modifier before the array type (e.g., \`readonly string[]\`) or use the \`ReadonlyArray<T>\` generic type. This prevents methods like \`push\`, \`pop\`, or direct index assignments.
`
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 1', 'The definitive guide - Beginner.', topics);
