import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "6. Classes and Object-Oriented Programming in TS",
    description: "An exhaustive look into Object-Oriented Programming within TypeScript, covering classes, constructors, access modifiers, inheritance, and abstract classes.",
    content: `
# Classes and Object-Oriented Programming in TS

TypeScript fully supports Object-Oriented Programming (OOP) paradigms introduced in ES6, and enhances them with static typing, access modifiers, and abstract classes.

## Basic Classes

A class encapsulates data (properties) and behavior (methods).

\`\`\`typescript
class Greeter {
    greeting: string; // Property

    // Constructor
    constructor(message: string) {
        this.greeting = message;
    }

    // Method
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
console.log(greeter.greet());
\`\`\`

## Access Modifiers

TypeScript provides three access modifiers to control the visibility of class members: \`public\`, \`private\`, and \`protected\`.

*   **\`public\` (Default):** Members are accessible from anywhere.
*   **\`private\`:** Members cannot be accessed from outside of its containing class.
*   **\`protected\`:** Members are accessible within the class and its subclasses (derived classes).

\`\`\`typescript
class Animal {
    public name: string;
    private age: number;
    protected habitat: string;

    constructor(name: string, age: number, habitat: string) {
        this.name = name;
        this.age = age;
        this.habitat = habitat;
    }

    public getAge(): number {
        return this.age; // Can access private member internally
    }
}

class Dog extends Animal {
    constructor(name: string, age: number) {
        super(name, age, "House");
    }

    public describe() {
        // console.log(this.age); // Error: Property 'age' is private.
        console.log(\`\${this.name} lives in a \${this.habitat}\`); // OK: 'habitat' is protected
    }
}

let dog = new Dog("Buddy", 3);
console.log(dog.name); // OK
// console.log(dog.age); // Error: Property 'age' is private
// console.log(dog.habitat); // Error: Property 'habitat' is protected
\`\`\`

## Parameter Properties

TypeScript offers a shorthand for declaring and initializing class properties directly in the constructor parameters using access modifiers.

\`\`\`typescript
class User {
    // Equivalent to declaring properties and assigning them in the body
    constructor(
        public readonly id: number,
        public name: string,
        private email: string
    ) {}

    getEmail() {
        return this.email;
    }
}

const user = new User(1, "Alice", "alice@example.com");
console.log(user.name);
// user.id = 2; // Error: id is readonly
\`\`\`

## Getters and Setters

Accessors allow you to intercept access to a member of an object. This gives you a way to have finer-grained control over how a member is accessed on each object.

\`\`\`typescript
class Employee {
    private _fullName: string = "";

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (newName && newName.length > 0) {
            this._fullName = newName;
        } else {
            console.error("Error: name cannot be empty");
        }
    }
}

let employee = new Employee();
employee.fullName = "Bob Smith"; // Calls the setter
console.log(employee.fullName);  // Calls the getter
\`\`\`

## Inheritance and Overriding

Classes can extend other classes using the \`extends\` keyword. You can override base class methods in the derived class. If a derived class has a constructor, it must call \`super()\` to execute the base class constructor.

\`\`\`typescript
class Base {
    greet() {
        console.log("Hello, world!");
    }
}

class Derived extends Base {
    greet(name?: string) {
        if (name === undefined) {
            super.greet(); // Call base implementation
        } else {
            console.log(\`Hello, \${name.toUpperCase()}\`);
        }
    }
}
\`\`\`

## Abstract Classes

Abstract classes are base classes from which other classes may be derived. They may not be instantiated directly. Unlike an interface, an abstract class may contain implementation details for its members. The \`abstract\` keyword is used to define abstract classes as well as abstract methods within an abstract class.

\`\`\`typescript
abstract class Department {
    constructor(public name: string) {}

    printName(): void {
        console.log("Department name: " + this.name);
    }

    // Must be implemented in derived classes
    abstract printMeeting(): void; 
}

class AccountingDepartment extends Department {
    constructor() {
        super("Accounting and Auditing"); // Constructors in derived classes must call super()
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }
}

// let department = new Department("General"); // Error: Cannot create an instance of an abstract class.
let accounting = new AccountingDepartment();
accounting.printName();
accounting.printMeeting();
\`\`\`

## Interview Questions
1.  **What is the difference between \`private\` and \`protected\` access modifiers in TypeScript?**
    *   *Answer:* A \`private\` member is only accessible within the class it is declared. A \`protected\` member is accessible within the class it is declared AND within any subclasses (derived classes) that extend it. Neither is accessible from outside instances.
2.  **What are Parameter Properties in a class constructor?**
    *   *Answer:* Parameter properties are a shorthand syntax where you prefix a constructor parameter with an access modifier (\`public\`, \`private\`, \`protected\`) or \`readonly\`. TypeScript automatically declares a class property with that name and assigns the constructor argument to it.
3.  **Explain the difference between an Interface and an Abstract Class.**
    *   *Answer:* An Interface can only define shapes and method signatures; it cannot contain implementation details (no method bodies or initialized properties). An Abstract Class can contain both abstract methods (no body, must be implemented by subclass) and concrete methods with full implementations. Abstract classes cannot be instantiated directly.
4.  **Why and when must you use the \`super()\` keyword in a class?**
    *   *Answer:* \`super()\` must be called within the \`constructor\` of a derived (child) class before accessing \`this\`. It executes the constructor of the base (parent) class, ensuring the parent's properties are properly initialized.
5.  **How do Getters and Setters work in TypeScript classes?**
    *   *Answer:* Getters (\`get\`) and setters (\`set\`) are methods that act as properties. They allow you to execute custom logic when a property is read or written to, facilitating data validation, computed properties, or encapsulation of private fields.
`
  },
  {
    title: "7. Generics (Introduction & Basics)",
    description: "Unlocking the power of reusable code. Learn how to write flexible, type-safe functions, classes, and interfaces using Generics.",
    content: `
# Generics (Introduction & Basics)

A major part of software engineering is building components that not only have well-defined and consistent APIs, but are also reusable. Generics are the primary tool for creating reusable, type-safe code in TypeScript. They allow you to create components that can work over a variety of types rather than a single one.

## The Problem Generics Solve

Without generics, you might use the \`any\` type to make a function reusable across different types.

\`\`\`typescript
function identityAny(arg: any): any {
    return arg;
}

let result = identityAny(10); // result is 'any', we lost type information
\`\`\`

While \`identityAny\` accepts anything, we lose the information about what type was passed in and what type is returned.

## Creating a Generic Function

Generics introduce *type variables*—a kind of variable that works on types rather than values.

\`\`\`typescript
function identity<T>(arg: T): T {
    return arg;
}
\`\`\`

The \`<T>\` after the function name declares a type variable \`T\`. This \`T\` is then used to specify the type of the argument (\`arg: T\`) and the return type (\`T\`).

### Calling Generic Functions

You can call the generic function in two ways.

1.  **Explicitly specifying the type argument:**
    \`\`\`typescript
    let output1 = identity<string>("myString"); // output1 is string
    \`\`\`

2.  **Type Argument Inference (Most Common):**
    The compiler looks at the value passed in and sets \`T\` to its type.
    \`\`\`typescript
    let output2 = identity(42); // output2 is number
    \`\`\`

## Generic Interfaces

You can create interfaces that take type parameters, making them highly reusable.

\`\`\`typescript
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identityFunc<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identityFunc;
\`\`\`

Another common use case is for defining data structures like responses from APIs.

\`\`\`typescript
interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

interface User {
    id: number;
    name: string;
}

const userResponse: ApiResponse<User> = {
    status: 200,
    message: "Success",
    data: { id: 1, name: "Alice" }
};

const stringResponse: ApiResponse<string[]> = {
    status: 200,
    message: "Tags fetched",
    data: ["typescript", "javascript", "web"]
};
\`\`\`

## Generic Classes

Classes can also be generic.

\`\`\`typescript
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;

    constructor(zero: T, addFn: (x: T, y: T) => T) {
        this.zeroValue = zero;
        this.add = addFn;
    }
}

let myGenericNumber = new GenericNumber<number>(0, (x, y) => x + y);
console.log(myGenericNumber.add(5, 10)); // 15

let myGenericString = new GenericNumber<string>("", (x, y) => x + y);
console.log(myGenericString.add("Hello ", "World")); // Hello World
\`\`\`

## Generic Constraints

Sometimes you want to write a generic function that works on a set of types, but requires those types to have certain properties. You can constrain the generic type using the \`extends\` keyword.

\`\`\`typescript
// We want to log the length of an argument, but 'T' might not have a '.length'
/*
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: Property 'length' does not exist on type 'T'.
    return arg;
}
*/

// Create an interface that requires a .length property
interface Lengthwise {
    length: number;
}

// Constrain T to extend Lengthwise
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // OK, we know it has a .length property
    return arg;
}

loggingIdentity("hello"); // OK: String has length
loggingIdentity([1, 2, 3]); // OK: Array has length
loggingIdentity({ length: 10, value: 3 }); // OK: Object has length property
// loggingIdentity(3); // Error: number doesn't have length
\`\`\`

### Using Type Parameters in Generic Constraints

You can declare a type parameter that is constrained by another type parameter. For example, getting a property from an object safely.

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };

getProperty(x, "a"); // OK
// getProperty(x, "m"); // Error: Argument of type '"m"' is not assignable to parameter of type '"a" | "b" | "c" | "d"'.
\`\`\`

## Interview Questions
1.  **What problem do Generics solve in TypeScript?**
    *   *Answer:* Generics provide a way to write reusable components (functions, classes, interfaces) that can work over a variety of types while maintaining strict type safety, avoiding the loss of type information that occurs when using the \`any\` type.
2.  **Explain Type Argument Inference.**
    *   *Answer:* It's when the TypeScript compiler automatically determines the type arguments for a generic function based on the types of the arguments passed into the function, saving the developer from explicitly specifying \`<T>\`.
3.  **How do you constrain a Generic type parameter to ensure it has certain properties?**
    *   *Answer:* By using the \`extends\` keyword followed by an interface or type that defines the required properties. E.g., \`<T extends { length: number }>\`.
4.  **What does \`<T, K extends keyof T>\` mean in a function signature?**
    *   *Answer:* It means the function takes two generic types. \`T\` represents an object type, and \`K\` is constrained to be a union of the valid keys (property names) of the object \`T\`. This ensures that \`key\` is valid for the given object.
5.  **Can an Interface be generic? Provide a practical example.**
    *   *Answer:* Yes. A very common example is an API response wrapper: \`interface ApiResponse<T> { data: T; status: number; }\`. This allows the same wrapper to be used for responses containing different types of data (Users, Products, etc.).
`
  },
  {
    title: "8. Advanced Types (Union, Intersection, Literal Types)",
    description: "Combining and refining types to handle complex scenarios using Union Types, Intersection Types, and precise Literal Types.",
    content: `
# Advanced Types (Union, Intersection, Literal Types)

As applications grow, you often need types that can combine multiple existing types or represent highly specific values. TypeScript provides advanced type operators to handle these scenarios.

## Union Types (\`|\`)

Union types are used when a value can be more than a single type. It represents a value that is *either* type A *or* type B.

\`\`\`typescript
function printId(id: number | string) {
    console.log("Your ID is: " + id);
    
    // You can only perform operations valid for ALL types in the union.
    // id.toUpperCase(); // Error: Property 'toUpperCase' does not exist on type 'number'.
    
    if (typeof id === "string") {
        // In this block, TypeScript knows 'id' is a string
        console.log(id.toUpperCase()); 
    }
}

printId(101); // OK
printId("202"); // OK
// printId({ myId: 22342 }); // Error
\`\`\`

Unions are heavily used for defining variables that might be \`null\` or \`undefined\` (when \`strictNullChecks\` is enabled).
\`let currentTarget: HTMLElement | null = null;\`

## Intersection Types (\`&\`)

Intersection types combine multiple types into one. This allows you to add together existing types to get a single type that has all the features you need. An intersection type represents a value that is type A *and* type B simultaneously.

\`\`\`typescript
interface ErrorHandling {
    success: boolean;
    error?: { message: string };
}

interface ArtworksData {
    artworks: { title: string }[];
}

interface ArtistsData {
    artists: { name: string }[];
}

// Combine responses
type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

const handleArtworksResponse = (response: ArtworksResponse) => {
    if (response.error) {
        console.error(response.error.message);
        return;
    }
    console.log(response.artworks[0].title);
};
\`\`\`

Intersection is heavily used with object types to combine properties from multiple sources. If you intersect primitive types that have no overlap (e.g., \`string & number\`), the resulting type is \`never\`.

## Literal Types

Literal types allow you to specify the exact value a string, number, or boolean must have. They are often combined with Union types to create powerful and restricted domains of values.

### String Literal Types

\`\`\`typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
    animate(dx: number, dy: number, easing: Easing) {
        if (easing === "ease-in") {
            // ...
        } else if (easing === "ease-out") {
            // ...
        } else if (easing === "ease-in-out") {
            // ...
        }
    }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
// button.animate(0, 0, "uneasy"); // Error: Argument of type '"uneasy"' is not assignable.
\`\`\`

### Numeric Literal Types

\`\`\`typescript
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
    return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}
\`\`\`

### Boolean Literal Types

\`\`\`typescript
interface ValidatedInput {
    isValid: true;
    data: string;
}

interface InvalidInput {
    isValid: false;
    error: string;
}

type ValidationResult = ValidatedInput | InvalidInput;
\`\`\`

## The \`as const\` Assertion

When you initialize a variable with an object or array, TypeScript infers a wide type by default. The \`as const\` suffix tells TypeScript to infer the narrowest possible literal types and make all properties readonly.

\`\`\`typescript
// Without as const
const args1 = [8, 5]; 
// inferred as number[], mutable
// const angle = Math.atan2(...args1); // Error: A spread argument must either have a tuple type or be passed to a rest parameter.

// With as const
const args2 = [8, 5] as const; 
// inferred as readonly [8, 5]
const angle = Math.atan2(...args2); // OK!
\`\`\`

## Interview Questions
1.  **Explain the conceptual difference between a Union type (\`|\`) and an Intersection type (\`&\`).**
    *   *Answer:* A Union type means a value can be *one of* the specified types (Logical OR). You can only access properties common to all types in the union. An Intersection type combines multiple types into a single type that possesses *all* properties of the intersected types (Logical AND).
2.  **What happens if you intersect two incompatible primitive types, like \`string & number\`?**
    *   *Answer:* The resulting type becomes \`never\`, because it's impossible for a value to be simultaneously a string and a number.
3.  **What is a String Literal Type and why is it useful?**
    *   *Answer:* It defines a type that must equal a specific string value (e.g., \`"GET"\`). When combined into unions (\`"GET" | "POST"\`), they act like lightweight enums, providing compile-time safety to ensure only permitted strings are used.
4.  **How do you access a specific property if a variable is of a Union type, say \`Dog | Cat\`?**
    *   *Answer:* You cannot access a property unique to \`Dog\` directly. You must first use a Type Guard (like \`instanceof\`, \`in\` operator, or a custom type guard function) to narrow the type down to specifically \`Dog\` before accessing its properties safely.
5.  **What does the \`as const\` assertion do in TypeScript?**
    *   *Answer:* It tells the compiler to treat an object or array literal as completely immutable. It infers the narrowest literal types for primitives (e.g., \`"hello"\` instead of \`string\`) and recursively marks all properties as \`readonly\`, converting arrays to readonly tuples.
`
  },
  {
    title: "9. Type Guards & Narrowing",
    description: "Mastering Control Flow Analysis. Learn how to safely narrow down broad types (like unions or 'unknown') into specific types using Type Guards.",
    content: `
# Type Guards & Narrowing

When dealing with Union types or \`unknown\`, you need a way to confidently tell TypeScript that a variable is a specific type in a certain block of code. This process of refining types to more specific types than declared is called **narrowing**. The expressions that perform this are called **Type Guards**.

## 1. \`typeof\` Type Guards

JavaScript's \`typeof\` operator is recognized by TypeScript as a type guard for primitive types (\`"string"\`, \`"number"\`, \`"bigint"\`, \`"boolean"\`, \`"symbol"\`, \`"undefined"\`, \`"object"\`, \`"function"\`).

\`\`\`typescript
function padLeft(padding: number | string, input: string) {
    if (typeof padding === "number") {
        // TypeScript knows 'padding' is a number here
        return " ".repeat(padding) + input;
    }
    // TypeScript knows 'padding' is a string here
    return padding + input;
}
\`\`\`

## 2. Truthiness Narrowing

TypeScript leverages JavaScript's truthy/falsy logic to narrow types, especially for checking against \`null\` or \`undefined\`.

\`\`\`typescript
function printAll(strs: string | string[] | null) {
    if (strs) {
        if (typeof strs === "object") {
            // Because of 'strs' truthiness check, it can't be null here. 
            // typeof object narrows it to string[]
            for (const s of strs) {
                console.log(s);
            }
        } else if (typeof strs === "string") {
            console.log(strs);
        }
    }
}
\`\`\`

## 3. Equality Narrowing

TypeScript uses \`switch\` statements and equality checks like \`===\`, \`!==\`, \`==\`, and \`!=\` to narrow types.

\`\`\`typescript
function example(x: string | number, y: string | boolean) {
    if (x === y) {
        // Both x and y must be string, because it's the only overlapping type
        x.toUpperCase();
        y.toLowerCase();
    }
}
\`\`\`

## 4. The \`in\` Operator Narrowing

The \`in\` operator determines if an object has a property with a specific name. It's excellent for narrowing between different object interfaces.

\`\`\`typescript
interface Fish { swim: () => void; }
interface Bird { fly: () => void; }

function move(animal: Fish | Bird) {
    if ("swim" in animal) {
        // animal is narrowed to Fish
        animal.swim();
    } else {
        // animal is narrowed to Bird
        animal.fly();
    }
}
\`\`\`

## 5. \`instanceof\` Narrowing

\`instanceof\` checks if an object is an instance of a specific class.

\`\`\`typescript
function logValue(x: Date | string) {
    if (x instanceof Date) {
        console.log(x.toUTCString()); // x is Date
    } else {
        console.log(x.toUpperCase()); // x is string
    }
}
\`\`\`

## 6. Custom Type Predicates (User-Defined Type Guards)

Sometimes you want complete control over how types change. To define a user-defined type guard, you write a function whose return type is a *type predicate*.

A type predicate takes the form \`parameterName is Type\`.

\`\`\`typescript
interface Car { engine: string; drive: () => void }
interface Boat { engine: string; sail: () => void }

// Return type is a type predicate
function isCar(vehicle: Car | Boat): vehicle is Car {
    // Return a boolean indicating if it's a Car
    return (vehicle as Car).drive !== undefined;
}

function operateVehicle(v: Car | Boat) {
    if (isCar(v)) {
        v.drive(); // TypeScript knows v is Car
    } else {
        v.sail();  // TypeScript knows v is Boat
    }
}
\`\`\`

## 7. Discriminated Unions

This is one of the most powerful patterns in TypeScript. If you have a union of objects, giving them all a common, literal-type property (the "discriminant") allows TypeScript to narrow the union extremely cleanly.

\`\`\`typescript
interface Circle {
    kind: "circle"; // Discriminant property
    radius: number;
}

interface Square {
    kind: "square"; // Discriminant property
    sideLength: number;
}

type Shape = Circle | Square;

function getArea(shape: Shape) {
    switch (shape.kind) {
        case "circle":
            // shape is narrowed to Circle
            return Math.PI * shape.radius ** 2;
        case "square":
            // shape is narrowed to Square
            return shape.sideLength ** 2;
    }
}
\`\`\`

## Interview Questions
1.  **What is type narrowing in TypeScript?**
    *   *Answer:* Type narrowing is the process of moving from a less precise type (like a union \`string | number\`) to a more precise type (like \`string\`) within a specific block of code using control flow analysis.
2.  **When should you use the \`in\` operator as a type guard versus \`typeof\`?**
    *   *Answer:* Use \`typeof\` for primitive types (\`string\`, \`number\`, \`boolean\`). Use the \`in\` operator to check for the existence of specific properties on an object to differentiate between different custom object types or interfaces in a union.
3.  **How do you write a custom type guard function?**
    *   *Answer:* You write a function that returns a boolean, and specify its return type as a Type Predicate (\`arg is Type\`). The function body contains the logic to verify if the argument is indeed that type.
4.  **What is a Discriminated Union and what is the "discriminant"?**
    *   *Answer:* A discriminated union is a union of object types that all share a common property with distinct literal values. That common property is the "discriminant" (e.g., a \`type\` or \`kind\` property). It allows TypeScript to perfectly narrow the union based on a \`switch\` or \`if\` statement checking that property.
5.  **Why is \`typeof null\` problematic in type guarding, and how does TypeScript handle it?**
    *   *Answer:* In JavaScript, \`typeof null === "object"\`. Therefore, checking \`if (typeof val === "object")\` doesn't filter out \`null\`. TypeScript requires you to do a truthiness check (e.g., \`if (val && typeof val === "object")\`) or explicitly check \`val !== null\` before narrowing to a generic object type.
`
  },
  {
    title: "10. Utility Types (Partial, Required, Readonly, Record)",
    description: "An essential guide to TypeScript's built-in global Utility Types, which facilitate type transformations without writing extra boilerplate.",
    content: `
# Utility Types (Partial, Required, Readonly, Record)

TypeScript provides a set of global utility types that facilitate common type transformations. These are built-in Generics that take existing types and produce new ones, saving you from repeating code.

## 1. \`Partial<Type>\`

Constructs a type with all properties of \`Type\` set to optional. This utility will return a type that represents all subsets of a given type. It is heavily used for updating objects where you only want to pass changed properties.

\`\`\`typescript
interface Todo {
    title: string;
    description: string;
}

// Function to update a todo. We might not want to update all fields.
function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>): Todo {
    return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
    title: "Organize desk",
    description: "Clear clutter",
};

const todo2 = updateTodo(todo1, {
    description: "Throw out trash", // We only provide description
});
\`\`\`

## 2. \`Required<Type>\`

The opposite of \`Partial\`. Constructs a type consisting of all properties of \`Type\` set to required. This is useful when you have an interface with optional properties, but in a specific context, you need to guarantee they are all present.

\`\`\`typescript
interface Props {
    a?: number;
    b?: string;
}

const obj: Props = { a: 5 };

// Error: Property 'b' is missing in type '{ a: number; }' but required in type 'Required<Props>'.
// const obj2: Required<Props> = { a: 5 }; 

const obj3: Required<Props> = { a: 5, b: "hello" }; // OK
\`\`\`

## 3. \`Readonly<Type>\`

Constructs a type with all properties of \`Type\` set to \`readonly\`, meaning the properties of the constructed type cannot be reassigned. This is excellent for enforcing immutability.

\`\`\`typescript
interface Todo {
    title: string;
}

const todo: Readonly<Todo> = {
    title: "Delete inactive users",
};

// todo.title = "Hello"; // Error: Cannot assign to 'title' because it is a read-only property.
\`\`\`

## 4. \`Record<Keys, Type>\`

Constructs an object type whose property keys are \`Keys\` and whose property values are \`Type\`. This utility can be used to map the properties of a type to another type, or, very commonly, to define a dictionary/map where the keys and values have specific types.

\`\`\`typescript
interface PageInfo {
    title: string;
}

type Page = "home" | "about" | "contact";

// Defines an object where keys must be from the 'Page' union, and values must be 'PageInfo'
const nav: Record<Page, PageInfo> = {
    home: { title: "Home" },
    about: { title: "About" },
    contact: { title: "Contact" },
};

// Commonly used for dynamic dictionaries:
const idToUserMap: Record<string, {name: string, age: number}> = {
    "uuid-123": { name: "Alice", age: 30 },
    "uuid-456": { name: "Bob", age: 25 }
};
\`\`\`

## 5. \`Pick<Type, Keys>\`

Constructs a type by picking the set of properties \`Keys\` (string literal or union of string literals) from \`Type\`. Useful when you want a narrower interface derived from a larger one.

\`\`\`typescript
interface FullUser {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

// Create a type for public profiles that omits sensitive data
type PublicProfile = Pick<FullUser, "id" | "name">;

const user: PublicProfile = {
    id: 1,
    name: "Alice"
};
\`\`\`

## 6. \`Omit<Type, Keys>\`

The opposite of \`Pick\`. Constructs a type by picking all properties from \`Type\` and then removing \`Keys\`.

\`\`\`typescript
interface FullUser {
    id: number;
    name: string;
    email: string;
    passwordHash: string;
}

// Create a type that has everything except the passwordHash
type UserWithoutPassword = Omit<FullUser, "passwordHash">;

const safeUser: UserWithoutPassword = {
    id: 1,
    name: "Alice",
    email: "alice@example.com"
};
\`\`\`

## Interview Questions
1.  **What is the purpose of the \`Partial<T>\` utility type?**
    *   *Answer:* It takes an existing type \`T\` and returns a new type where all properties of \`T\` are made optional. It's highly useful for functions that perform partial updates to an object, like state updates in React or PATCH requests.
2.  **How would you create an object type that acts as a dictionary with string keys and number values?**
    *   *Answer:* You would use the \`Record\` utility type: \`Record<string, number>\`.
3.  **Explain the difference between \`Pick<T, K>\` and \`Omit<T, K>\`.**
    *   *Answer:* Both create new types based on an existing type. \`Pick\` explicitly selects the properties you want to keep. \`Omit\` selects all properties except the ones you explicitly want to remove. Choose whichever results in less code or better readability based on the shape of the original type.
4.  **If you have an interface with optional properties, how do you enforce that an object has ALL of them?**
    *   *Answer:* Use the \`Required<T>\` utility type. It removes the \`?\` modifier from all properties, making them mandatory.
5.  **How does \`Readonly<T>\` differ from \`const\`?**
    *   *Answer:* \`const\` is a variable declaration keyword ensuring the variable identifier cannot be reassigned (but the object it points to can be mutated). \`Readonly<T>\` is a type system feature that makes the *properties* of an object immutable at compile time, preventing mutation of the object's fields.
`
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 2', 'The definitive guide - Intermediate 1.', topics);
