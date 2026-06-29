import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Advanced Decorators and Metadata Reflection",
    content: `
      <h2>Understanding TypeScript Decorators</h2>
      <p>Decorators provide a way to add both annotations and a metaprogramming syntax for class declarations and members. They are functions that are called at runtime, allowing you to observe, modify, or replace class definitions, methods, accessors, properties, or parameters. TypeScript decorators have evolved significantly, moving towards alignment with the ECMAScript decorators proposal.</p>

      <h3>Class Decorators</h3>
      <p>A class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition. If the class decorator returns a value, it replaces the class declaration with the provided constructor function.</p>
      <pre><code class="language-typescript">
function Logger(constructor: Function) {
  console.log('Class registered: ', constructor.name);
}

function WithTemplate(template: string, hookId: string) {
  return function&lt;T extends { new (...args: any[]): { name: string } }&gt;(originalConstructor: T) {
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super(...args);
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector('h1')!.textContent = this.name;
        }
      }
    };
  };
}

@Logger
@WithTemplate('&lt;h1&gt;My Person Object&lt;/h1&gt;', 'app')
class Person {
  name = 'Max';
  constructor() { console.log('Creating person object...'); }
}
      </code></pre>

      <h3>Method and Property Decorators</h3>
      <p>Method decorators can modify the property descriptor of the method. This is incredibly useful for implementing patterns like auto-binding <code>this</code>, logging, or caching.</p>
      <pre><code class="language-typescript">
function Autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      // 'this' inside the getter refers to whatever object the property is accessed on.
      return originalMethod.bind(this);
    }
  };
  return adjDescriptor;
}

class Printer {
  message = 'This works!';
  @Autobind
  showMessage() { console.log(this.message); }
}
      </code></pre>

      <h2>Metadata Reflection API (reflect-metadata)</h2>
      <p>To fully leverage decorators for advanced dependency injection (like in Angular or NestJS), you must enable <code>emitDecoratorMetadata</code> in your <code>tsconfig.json</code> and use the <code>reflect-metadata</code> polyfill. This allows TypeScript to emit design-time type information as runtime metadata.</p>

      <pre><code class="language-typescript">
import 'reflect-metadata';

function Injectable(target: any) {
  // Read the types of the constructor parameters emitted by TS
  const types = Reflect.getMetadata('design:paramtypes', target);
  console.log(types); // e.g., [class DatabaseService, class LoggerService]
}

@Injectable
class UserService {
  constructor(private db: DatabaseService, private logger: LoggerService) {}
}
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is a Decorator in TypeScript and what elements can it be attached to?</strong><br/>A: A decorator is a special kind of declaration that can be attached to a class declaration, method, accessor, property, or parameter. They are evaluated as functions at runtime and can modify the behavior or structure of what they decorate.</li>
        <li><strong>Q2: Explain the order of execution when multiple decorators are applied to a single declaration.</strong><br/>A: They are evaluated mathematically as function composition. The expressions are evaluated top-to-bottom, but the results are called as functions from bottom-to-top (inside-out).</li>
        <li><strong>Q3: How does a class decorator differ from a method decorator in terms of arguments?</strong><br/>A: A class decorator receives only one argument: the constructor function. A method decorator receives three: the target (prototype for instance methods, constructor for static), the property name, and the PropertyDescriptor.</li>
        <li><strong>Q4: What is a Decorator Factory?</strong><br/>A: It's a function that returns the actual decorator function. It allows you to pass custom configuration parameters to the decorator (e.g., <code>@Route('/users')</code>).</li>
        <li><strong>Q5: What role does <code>reflect-metadata</code> play in Dependency Injection frameworks built with TypeScript?</strong><br/>A: By enabling <code>emitDecoratorMetadata</code>, TS injects <code>Reflect.metadata</code> calls into the compiled JS. Frameworks use the metadata key <code>"design:paramtypes"</code> to know exactly which classes to instantiate and inject into a constructor at runtime.</li>
        <li><strong>Q6: If a property decorator returns a value, what does it modify?</strong><br/>A: In the experimental decorators specification, returning a value from a property decorator is ignored. To modify a property descriptor, you must use a method or accessor decorator.</li>
      </ul>
    `
  },
  {
    title: "Declaration Merging and Module Augmentation",
    content: `
      <h2>Core Concepts of Declaration Merging</h2>
      <p>Declaration merging is a unique feature of TypeScript where the compiler merges two or more separate declarations declared with the same name into a single definition. This merged definition has the features of both original declarations. It is extensively used when writing type definitions for external libraries.</p>

      <h3>Merging Interfaces</h3>
      <p>The most common form is interface merging. If you declare two interfaces with the same name in the same scope, their properties are combined.</p>
      <pre><code class="language-typescript">
interface Window {
  title: string;
}

// Later in the file or in another file
interface Window {
  tsVersion: string;
}

// The merged Window interface now has both 'title' and 'tsVersion'
const myWindow: Window = {
  title: "Main",
  tsVersion: "5.0"
};
      </code></pre>

      <h3>Merging Namespaces with Classes and Functions</h3>
      <p>Namespaces can be merged with classes or functions to create objects with both callable/instantiable behavior and static properties. This mirrors common JavaScript patterns.</p>
      <pre><code class="language-typescript">
class Album {
  label: Album.AlbumLabel;
}

// Merging a namespace with the class allows adding static properties/types scoped to the class
namespace Album {
  export class AlbumLabel { }
}
      </code></pre>

      <h2>Module Augmentation</h2>
      <p>Module augmentation is the application of declaration merging to external ES Modules. When you import a library, you can use the <code>declare module</code> syntax to inject new properties or methods into existing interfaces defined within that library. This is crucial for adding types for plugins or polyfills.</p>

      <pre><code class="language-typescript">
// Assume 'express' is imported
import * as express from 'express';

// Augment the 'express' module
declare module 'express-serve-static-core' {
  interface Request {
    // Injecting a custom property into the Express Request object
    user?: { id: string; role: string };
    transactionId: string;
  }
}

const app = express();
app.use((req, res, next) =&gt; {
  req.transactionId = "tx-123"; // Now strongly typed!
  req.user = { id: "1", role: "admin" };
  next();
});
      </code></pre>

      <h3>Global Augmentation</h3>
      <p>To add types to the global scope from within an ES module (a file containing import/export), you must use <code>declare global</code>.</p>
      <pre><code class="language-typescript">
export {}; // Ensure file is treated as a module

declare global {
  interface String {
    toTitleCase(): string;
  }
}

String.prototype.toTitleCase = function() {
  return this.replace(/\\w\\S*/g, (txt) =&gt; txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is Declaration Merging in TypeScript?</strong><br/>A: It is the compiler's ability to merge multiple declarations with the same name into a single combined type or namespace. The most common use case is interface merging.</li>
        <li><strong>Q2: How does interface merging handle method overloads?</strong><br/>A: When methods with the same name are declared in merged interfaces, they are treated as overloads of the same method. Methods from later interfaces are generally positioned earlier in the overload list (higher precedence), unless the method parameter has a string literal type, which bubbles to the top.</li>
        <li><strong>Q3: Explain Module Augmentation and when it is used.</strong><br/>A: Module augmentation allows adding new declarations (like interface properties) to external, already-compiled modules. It's used when adding custom methods to built-in objects or augmenting library interfaces (e.g., adding properties to the Express <code>Request</code> object).</li>
        <li><strong>Q4: Why do you need <code>export {}</code> at the top of a file containing <code>declare global</code>?</strong><br/>A: <code>declare global</code> only works inside a module. If a file has no top-level imports or exports, TS treats it as a classic global script. Adding <code>export {}</code> turns it into a module, allowing the <code>declare global</code> block to correctly target the global scope from within a modular context.</li>
        <li><strong>Q5: Can you merge a Class with a Class?</strong><br/>A: No. You cannot merge two classes together, nor can you merge a class with an interface to automatically implement it. Classes can only be merged with Namespaces to attach static members.</li>
      </ul>
    `
  },
  {
    title: "Covariance, Contravariance, and Bivariance",
    content: `
      <h2>Understanding Type Variance</h2>
      <p>Variance describes how complex types (like arrays, functions, or promises) relate to each other based on the relationships of their component types. It answers questions like: "If <code>Dog</code> extends <code>Animal</code>, does <code>Array&lt;Dog&gt;</code> extend <code>Array&lt;Animal&gt;</code>?" Understanding variance is critical for mastering advanced generics and function substitutability.</p>

      <h3>Covariance (Direction Preserved)</h3>
      <p>Covariance means the complex type preserves the assignability direction of its components. If <code>A</code> is assignable to <code>B</code>, then <code>Container&lt;A&gt;</code> is assignable to <code>Container&lt;B&gt;</code>. In TypeScript, return types, arrays, and promises are covariant.</p>
      <pre><code class="language-typescript">
class Animal { name: string; }
class Dog extends Animal { breed: string; }

// Arrays are covariant
let dogs: Dog[] = [new Dog()];
let animals: Animal[] = dogs; // Valid! An array of dogs IS an array of animals.

// Return types are covariant
type AnimalGenerator = () =&gt; Animal;
type DogGenerator = () =&gt; Dog;
let getAnimal: AnimalGenerator = () =&gt; new Dog(); // Valid
      </code></pre>

      <h3>Contravariance (Direction Reversed)</h3>
      <p>Contravariance means the complex type reverses the assignability direction. If <code>A</code> is assignable to <code>B</code>, then <code>Handler&lt;B&gt;</code> is assignable to <code>Handler&lt;A&gt;</code>. In TypeScript, <strong>function parameters are contravariant</strong> (when <code>strictFunctionTypes</code> is enabled).</p>
      <pre><code class="language-typescript">
type AnimalHandler = (a: Animal) =&gt; void;
type DogHandler = (d: Dog) =&gt; void;

let handleDog: DogHandler = (animal: Animal) =&gt; {
    console.log(animal.name);
}; // Valid! 
// A function that can handle ANY animal is perfectly capable of handling a Dog.

let handleAnimal: AnimalHandler = (dog: Dog) =&gt; {
    console.log(dog.breed);
}; // ERROR!
// You cannot pass a DogHandler to something expecting an AnimalHandler, 
// because the AnimalHandler might be called with a Cat, which the DogHandler cannot process.
      </code></pre>

      <h3>Bivariance (Legacy Behavior)</h3>
      <p>Historically, TypeScript parameters were bivariant (both covariant and contravariant) for ease of adoption. This is inherently unsafe. Setting <code>"strictFunctionTypes": true</code> fixes this, making parameters strictly contravariant. However, method declarations in interfaces are still bivariant by design.</p>
      <pre><code class="language-typescript">
interface EventHandler {
  // Method syntax is bivariant
  onClick(e: Event): void; 
  
  // Property syntax is contravariant (strictly checked)
  onHover: (e: Event) =&gt; void; 
}
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: Define Covariance and provide an example in TypeScript.</strong><br/>A: Covariance is when a complex type maintains the subtyping relationship of its components. Example: A <code>Dog</code> is an <code>Animal</code>, therefore an <code>Array&lt;Dog&gt;</code> can be assigned to an <code>Array&lt;Animal&gt;</code>.</li>
        <li><strong>Q2: Define Contravariance and explain why function parameters are contravariant.</strong><br/>A: Contravariance reverses the subtyping relationship. If a function requires a callback that takes a <code>Dog</code>, providing a callback that can handle any <code>Animal</code> is safe, because it is guaranteed to only receive a <code>Dog</code>, which fulfills the <code>Animal</code> requirement. Thus, <code>(Animal)=&gt;void</code> is assignable to <code>(Dog)=&gt;void</code>.</li>
        <li><strong>Q3: What does the compiler flag <code>strictFunctionTypes</code> do?</strong><br/>A: It changes function parameters from being bivariant (unsafe) to contravariant (safe).</li>
        <li><strong>Q4: Why does TypeScript distinguish between method shorthand syntax and property syntax in interfaces regarding variance?</strong><br/>A: Method shorthand (<code>foo(arg: string): void</code>) remains bivariant for compatibility with common JavaScript patterns (like array methods). Property syntax (<code>foo: (arg: string) =&gt; void</code>) is strictly contravariant when <code>strictFunctionTypes</code> is true.</li>
        <li><strong>Q5: Why are mutable arrays in covariant positions technically unsafe?</strong><br/>A: If you assign a <code>Dog[]</code> to an <code>Animal[]</code> variable, you can then push a <code>Cat</code> into the <code>Animal[]</code> array. This mutates the original <code>Dog[]</code> array, placing a <code>Cat</code> inside it, breaking type safety. TypeScript allows this for pragmatism, whereas languages like C# handle this through distinct invariant array interfaces.</li>
      </ul>
    `
  },
  {
    title: "Advanced Control Flow and Custom Type Guards",
    content: `
      <h2>Control Flow Analysis</h2>
      <p>TypeScript uses Control Flow Analysis (CFA) to narrow the types of variables based on logical constructs like <code>if</code>, <code>switch</code>, and logical operators. This means the type of a variable can change depending on where you are in the code flow.</p>

      <h3>Discriminated Unions</h3>
      <p>The most robust way to leverage CFA is through Discriminated Unions (also known as Tagged Unions). By giving each interface in a union a common, literal-type property (the discriminator), TypeScript can instantly narrow the union to a specific interface.</p>
      <pre><code class="language-typescript">
interface Circle { kind: "circle"; radius: number; }
interface Square { kind: "square"; sideLength: number; }
type Shape = Circle | Square;

function getArea(shape: Shape) {
  // 'kind' acts as the discriminator
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2; // shape is Circle
    case "square": return shape.sideLength ** 2;       // shape is Square
  }
}
      </code></pre>

      <h3>Exhaustiveness Checking with never</h3>
      <p>You can use the <code>never</code> type to enforce exhaustiveness checking in discriminated unions. If you add a new type to the union but forget to handle it in a <code>switch</code>, the compiler will throw an error.</p>
      <pre><code class="language-typescript">
function assertUnreachable(x: never): never {
    throw new Error("Didn't expect to get here");
}

function getAreaSafe(shape: Shape) {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "square": return shape.sideLength ** 2;
    default:
      // If a 'Triangle' is added to the Shape union, 'shape' here will be typed as 'Triangle', 
      // which cannot be assigned to 'never', causing a compile error!
      return assertUnreachable(shape);
  }
}
      </code></pre>

      <h2>Custom Type Guards (Type Predicates)</h2>
      <p>When TypeScript's built-in CFA (like <code>typeof</code> or <code>instanceof</code>) isn't enough, you can define your own Type Guards. A custom type guard is a function whose return type is a <strong>type predicate</strong> taking the form <code>parameterName is Type</code>.</p>
      <pre><code class="language-typescript">
interface Bird { fly(): void; layEggs(): void; }
interface Fish { swim(): void; layEggs(): void; }

// The return type is a type predicate
function isFish(pet: Bird | Fish): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function movePet(pet: Bird | Fish) {
  if (isFish(pet)) {
    pet.swim(); // TypeScript knows 'pet' is Fish here
  } else {
    pet.fly();  // TypeScript knows 'pet' is Bird here
  }
}
      </code></pre>

      <h3>Assertion Functions</h3>
      <p>Introduced in TS 3.7, assertion functions throw an error if a condition is false. They use the <code>asserts value is Type</code> syntax. This is highly useful for Node.js <code>assert</code> modules or writing robust validation logic.</p>
      <pre><code class="language-typescript">
function assertIsString(val: any): asserts val is string {
  if (typeof val !== "string") {
    throw new AssertionError("Not a string!");
  }
}

function processValue(val: string | number) {
  assertIsString(val);
  // From here on, 'val' is definitely a string
  console.log(val.toUpperCase()); 
}
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is a Discriminated Union?</strong><br/>A: A pattern where multiple object types share a common property (the discriminator) with literal types (like <code>type: 'A'</code>). TypeScript uses this property to uniquely identify and narrow down the type within a control flow construct like a <code>switch</code> statement.</li>
        <li><strong>Q2: How do you perform exhaustive checking in a <code>switch</code> statement over a union type?</strong><br/>A: By creating a <code>default</code> case that assigns the union variable to a variable of type <code>never</code>. If all cases are handled, the variable's narrowed type is <code>never</code>. If a case is missed, its type is not <code>never</code>, causing a compile error.</li>
        <li><strong>Q3: What is a Type Guard and how do you write a custom one?</strong><br/>A: A type guard allows you to narrow types based on runtime checks. A custom type guard is a function returning a boolean, annotated with a type predicate like <code>arg is SpecificType</code>.</li>
        <li><strong>Q4: What is the difference between a type predicate (<code>x is T</code>) and an assertion function (<code>asserts x is T</code>)?</strong><br/>A: A type predicate returns a boolean; CFA narrows the type in the <code>if (isTrue)</code> block. An assertion function returns <code>void</code> but throws an error if false; CFA narrows the type for the remainder of the scope following the function call.</li>
        <li><strong>Q5: Can you use the <code>in</code> operator as a type guard?</strong><br/>A: Yes. The syntax <code>"propertyName" in objectName</code> acts as a type guard. If true, TypeScript narrows the object to types in the union that possess that property.</li>
      </ul>
    `
  },
  {
    title: "Abstract Classes, Mixins, and Design Patterns",
    content: `
      <h2>Abstract Classes in TypeScript</h2>
      <p>Abstract classes serve as base classes from which other classes may be derived. They cannot be instantiated directly. Unlike interfaces, abstract classes can contain implementation details for its members.</p>
      <pre><code class="language-typescript">
abstract class Department {
  constructor(public name: string) {}

  printName(): void { console.log("Department: " + this.name); }

  // Abstract method must be implemented in derived classes
  abstract printMeeting(): void; 
}

class AccountingDepartment extends Department {
  constructor() { super("Accounting and Auditing"); }

  printMeeting(): void {
    console.log("The Accounting Department meets each Monday at 10am.");
  }
}
      </code></pre>

      <h2>The Mixin Pattern</h2>
      <p>TypeScript does not support multiple inheritance. However, you can achieve similar functionality using Mixins. A Mixin is a factory function that takes a class constructor and returns a new class constructor that extends the original, adding new properties or methods.</p>

      <pre><code class="language-typescript">
// A type representing any constructor
type Constructor = new (...args: any[]) =&gt; {};

// Mixin 1: Adds a timestamp property
function Timestamped&lt;TBase extends Constructor&gt;(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

// Mixin 2: Adds an activation state
function Activatable&lt;TBase extends Constructor&gt;(Base: TBase) {
  return class extends Base {
    isActivated = false;
    activate() { this.isActivated = true; }
    deactivate() { this.isActivated = false; }
  };
}

class User {
  constructor(public name: string) {}
}

// Applying mixins to create a composed class
const SpecialUser = Timestamped(Activatable(User));
const userInstance = new SpecialUser("Alice");

userInstance.activate();
console.log(userInstance.isActivated); // true
console.log(userInstance.timestamp); // e.g., 1634567890
      </code></pre>

      <h2>Builder Pattern with Fluent Interfaces</h2>
      <p>TypeScript's polymorphic <code>this</code> type enables highly effective Fluent Interfaces (chaining). When a method returns <code>this</code>, TypeScript inherently knows that it returns the specific derived class instance, not just the base class.</p>

      <pre><code class="language-typescript">
class RequestBuilder {
  private url: string = '';
  private method: 'GET' | 'POST' = 'GET';

  setUrl(url: string): this {
    this.url = url;
    return this; // Polymorphic 'this'
  }

  setMethod(method: 'GET' | 'POST'): this {
    this.method = method;
    return this;
  }

  build() { return { url: this.url, method: this.method }; }
}

const req = new RequestBuilder()
  .setUrl('/api/data')
  .setMethod('POST')
  .build();
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is the difference between an Interface and an Abstract Class?</strong><br/>A: Interfaces contain no implementation at all, only shape definitions, and exist purely at compile-time. Abstract classes can contain implementation (both methods and state) and exist as prototype objects at runtime.</li>
        <li><strong>Q2: Can you instantiate an abstract class?</strong><br/>A: No, an abstract class can only be inherited from.</li>
        <li><strong>Q3: Explain the Mixin pattern and why it is used in TypeScript.</strong><br/>A: Mixins are a way to build up classes from reusable components, overcoming the limitation of single inheritance. They are implemented as functions taking a base class constructor and returning a new anonymous class extending the base class.</li>
        <li><strong>Q4: What is the type of a generic constructor used in Mixins?</strong><br/>A: Typically <code>type Constructor&lt;T = {}&gt; = new (...args: any[]) =&gt; T;</code></li>
        <li><strong>Q5: What is the polymorphic <code>this</code> type?</strong><br/>A: It is a special type available in classes and interfaces that refers to the instance type of the current class. It is invaluable for fluent interfaces/chaining because a base class returning <code>this</code> will correctly be typed as returning the derived class when called on a derived instance.</li>
      </ul>
    `
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 5', 'Decorators, Mixins, Variance, and Advanced Flow Control.', topics);
