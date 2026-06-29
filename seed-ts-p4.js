import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Advanced Conditional Types and the infer Keyword",
    content: `
      <h2>The Mechanics of Conditional Types</h2>
      <p>Conditional types in TypeScript take the form <code>T extends U ? X : Y</code>. They allow developers to express non-uniform type mappings, where the resulting type depends on a condition evaluated at the type level. The true power of conditional types is unlocked when combined with generics, enabling the creation of dynamic, highly reusable type utility functions. In essence, they act like ternary operators but execute during the compilation phase to resolve types.</p>
      
      <h3>Distributive Conditional Types</h3>
      <p>A crucial behavior of conditional types is their distributivity over union types. When a generic type parameter is a union type, and it is checked against a condition, TypeScript automatically applies the condition to each member of the union separately. For example, <code>(A | B) extends U ? X : Y</code> resolves to <code>(A extends U ? X : Y) | (B extends U ? X : Y)</code>. This is fundamental for utility types like <code>Exclude</code> and <code>Extract</code>.</p>
      
      <pre><code class="language-typescript">
type Exclude&lt;T, U&gt; = T extends U ? never : T;
type Result = Exclude&lt;"a" | "b" | "c", "a" | "b"&gt;; // Resolves to "c"
      </code></pre>
      <p>To prevent distributivity, you can wrap both sides of the <code>extends</code> keyword in square brackets: <code>[T] extends [U] ? X : Y</code>.</p>

      <h2>The infer Keyword</h2>
      <p>The <code>infer</code> keyword is exclusively used within the <code>extends</code> clause of a conditional type. It acts as a declarative pattern-matching mechanism, allowing you to extract a sub-type from a larger type structure and bind it to a local type variable. This variable can then be used in the true branch of the conditional type.</p>

      <h3>Extracting Return Types</h3>
      <p>One of the most common applications of <code>infer</code> is extracting the return type of a function. The built-in <code>ReturnType</code> utility relies on this:</p>
      <pre><code class="language-typescript">
type ReturnType&lt;T extends (...args: any) =&gt; any&gt; = T extends (...args: any) =&gt; infer R ? R : any;

function createPerson() {
  return { name: "Alice", age: 30 };
}
type Person = ReturnType&lt;typeof createPerson&gt;; // { name: string, age: number }
      </code></pre>

      <h3>Extracting Promise Resolution Types</h3>
      <p>Another powerful use case is unboxing promises:</p>
      <pre><code class="language-typescript">
type UnpackPromise&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T;
type Data = UnpackPromise&lt;Promise&lt;string&gt;&gt;; // string
      </code></pre>

      <h2>Advanced Pattern Matching with infer</h2>
      <p><code>infer</code> can be used in complex structures, such as arrays, tuples, and object properties.</p>
      <pre><code class="language-typescript">
// Extracting the first element of a tuple
type First&lt;T extends any[]&gt; = T extends [infer F, ...any[]] ? F : never;
type F1 = First&lt;[1, 2, 3]&gt;; // 1

// Extracting the tail of a tuple
type Tail&lt;T extends any[]&gt; = T extends [any, ...infer Rest] ? Rest : never;
type T1 = Tail&lt;[1, 2, 3]&gt;; // [2, 3]

// Extracting from object properties
type Payload&lt;T&gt; = T extends { payload: infer P } ? P : never;
type MyPayload = Payload&lt;{ type: "LOGIN", payload: { userId: string } }&gt;; // { userId: string }
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is a conditional type in TypeScript and what is its syntax?</strong><br/>A: A conditional type selects one of two possible types based on a condition expressed as a type relationship test: <code>T extends U ? X : Y</code>.</li>
        <li><strong>Q2: Explain distributive conditional types. How can you disable distributivity?</strong><br/>A: When a conditional type acts on a generic type parameter that is a union, it distributes over each member. E.g., <code>T extends U ? X : Y</code> with <code>T = A | B</code> becomes <code>(A extends U ? X : Y) | (B extends U ? X : Y)</code>. To disable this, wrap the types in tuples: <code>[T] extends [U] ? X : Y</code>.</li>
        <li><strong>Q3: What is the purpose of the infer keyword?</strong><br/>A: <code>infer</code> is used within a conditional type's <code>extends</code> clause to declare a new type variable that TypeScript will try to match against a part of the evaluated type. It extracts a piece of type information for use in the true branch.</li>
        <li><strong>Q4: Implement a utility type <code>Awaited&lt;T&gt;</code> that recursively unboxes a Promise.</strong><br/>A: <code>type Awaited&lt;T&gt; = T extends null | undefined ? T : T extends object & { then(onfulfilled: infer F, ...args: infer _): any } ? F extends ((value: infer V, ...args: infer _) =&gt; any) ? Awaited&lt;V&gt; : never : T;</code> (A simplified version is <code>T extends Promise&lt;infer U&gt; ? Awaited&lt;U&gt; : T</code>).</li>
        <li><strong>Q5: How would you extract the argument types of a function as a tuple?</strong><br/>A: Using <code>infer</code>: <code>type Parameters&lt;T extends (...args: any) =&gt; any&gt; = T extends (...args: infer P) =&gt; any ? P : never;</code></li>
        <li><strong>Q6: Can you use multiple infer declarations in a single conditional type?</strong><br/>A: Yes, you can infer multiple parts of a structure simultaneously, e.g., <code>T extends [infer A, infer B] ? A | B : never</code>.</li>
        <li><strong>Q7: What happens if an infer pattern matches multiple locations, such as in a union or function overloads?</strong><br/>A: If inferred from multiple call signatures, it infers from the last signature (most permissive). If inferred from covariant positions in a union, it produces a union. If inferred from contravariant positions (like function arguments), it produces an intersection type.</li>
      </ul>
    `
  },
  {
    title: "Recursive Type Aliases and Template Literal Types",
    content: `
      <h2>Recursive Type Aliases</h2>
      <p>Since TypeScript 3.7, type aliases can refer to themselves recursively without being wrapped in an interface. This is immensely powerful for defining arbitrary-depth data structures, such as JSON objects, trees, or linked lists.</p>

      <h3>Defining a JSON Type</h3>
      <p>A classic example of a recursive type is modeling a JSON structure, which can be a primitive, an array of JSON values, or an object containing JSON values.</p>
      <pre><code class="language-typescript">
type JSONPrimitive = string | number | boolean | null;
type JSONValue = JSONPrimitive | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
interface JSONArray extends Array&lt;JSONValue&gt; {}

const data: JSONValue = {
  name: "Alice",
  age: 30,
  skills: ["TypeScript", "React"],
  metadata: { verified: true }
};
      </code></pre>

      <h3>Deeply Readonly or Partial Types</h3>
      <p>Recursive types shine when creating deep modifiers. The standard <code>Partial&lt;T&gt;</code> only makes the top-level properties optional. A <code>DeepPartial&lt;T&gt;</code> applies recursively.</p>
      <pre><code class="language-typescript">
type DeepPartial&lt;T&gt; = T extends Function
  ? T
  : T extends Array&lt;infer U&gt;
  ? _DeepPartialArray&lt;U&gt;
  : T extends object
  ? _DeepPartialObject&lt;T&gt;
  : T | undefined;

interface _DeepPartialArray&lt;T&gt; extends Array&lt;DeepPartial&lt;T&gt;&gt; {}
type _DeepPartialObject&lt;T&gt; = { [P in keyof T]?: DeepPartial&lt;T[P]&gt; };
      </code></pre>

      <h2>Template Literal Types</h2>
      <p>Introduced in TypeScript 4.1, template literal types allow you to model strings that follow a specific pattern. They use the same syntax as JavaScript template literals but operate on types.</p>

      <h3>Basic String Manipulation</h3>
      <pre><code class="language-typescript">
type Color = "red" | "blue";
type Size = "small" | "large";
type ClassName = \`btn-\${Size}-\${Color}\`; 
// Resolves to "btn-small-red" | "btn-small-blue" | "btn-large-red" | "btn-large-blue"
      </code></pre>

      <h3>Combining Recursive Types with Template Literals</h3>
      <p>You can combine recursive types and template literals to parse strings at compile time. For example, extracting route parameters from an Express-like path.</p>
      <pre><code class="language-typescript">
type ExtractRouteParams&lt;T extends string&gt; = 
  T extends \`\${string}:\${infer Param}/\${infer Rest}\`
    ? { [K in Param | keyof ExtractRouteParams&lt;\`/\${Rest}\`&gt;]: string }
    : T extends \`\${string}:\${infer Param}\`
    ? { [K in Param]: string }
    : {};

type Params = ExtractRouteParams&lt;"/users/:userId/posts/:postId"&gt;;
// Result: { userId: string; postId: string; }
      </code></pre>

      <h3>Intrinsic String Manipulation Types</h3>
      <p>TypeScript provides built-in utilities to manipulate string types: <code>Uppercase&lt;StringType&gt;</code>, <code>Lowercase&lt;StringType&gt;</code>, <code>Capitalize&lt;StringType&gt;</code>, and <code>Uncapitalize&lt;StringType&gt;</code>.</p>
      <pre><code class="language-typescript">
type GetterName&lt;T extends string&gt; = \`get\${Capitalize&lt;T&gt;}\`;
type Name = GetterName&lt;"firstName"&gt;; // "getFirstName"
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What are template literal types and what problem do they solve?</strong><br/>A: They allow defining string types based on patterns using string interpolation syntax. They solve the problem of strongly typing structured strings like CSS classes, event names, or URLs.</li>
        <li><strong>Q2: How do template literal types interact with union types?</strong><br/>A: If an interpolation position contains a union type, the template literal type resolves to the Cartesian product of all possible combinations.</li>
        <li><strong>Q3: Write a recursive type to define a singly linked list.</strong><br/>A: <code>type LinkedList&lt;T&gt; = { value: T; next: LinkedList&lt;T&gt; | null };</code></li>
        <li><strong>Q4: Explain the risk of infinite recursion in recursive type aliases.</strong><br/>A: The TypeScript compiler imposes a depth limit on recursive type instantiation to prevent compiler crashes. Excessively deep recursive types will result in a "Type instantiation is excessively deep and possibly infinite" error.</li>
        <li><strong>Q5: How can you use template literals to type an event emitter's <code>on</code> method for an object where events are named <code>"propertyNameChanged"</code>?</strong><br/>A: <code>type Events&lt;T&gt; = { [K in keyof T as \`\${string & K}Changed\`]: (newValue: T[K]) =&gt; void };</code></li>
        <li><strong>Q6: Name the four intrinsic string manipulation types provided by TypeScript.</strong><br/>A: <code>Uppercase</code>, <code>Lowercase</code>, <code>Capitalize</code>, <code>Uncapitalize</code>.</li>
        <li><strong>Q7: Can you use infer inside a template literal type? Provide an example.</strong><br/>A: Yes, it is heavily used for string parsing. Example: <code>type Split&lt;S extends string, D extends string&gt; = S extends \`\${infer T}\${D}\${infer U}\` ? [T, ...Split&lt;U, D&gt;] : [S];</code></li>
      </ul>
    `
  },
  {
    title: "Mapped Types and Key Remapping via as",
    content: `
      <h2>The Anatomy of Mapped Types</h2>
      <p>Mapped types build on the syntax for index signatures. They are used to declare a new object type by iterating over a set of keys (usually a union of string literals) and defining the value type for each key. They are essential for creating uniform transformations of object types.</p>
      <pre><code class="language-typescript">
type OptionsFlags&lt;Type&gt; = {
  [Property in keyof Type]: boolean;
};
type FeatureFlags = { darkMode: () =&gt; void; newUserProfile: () =&gt; void; };
type FeatureOptions = OptionsFlags&lt;FeatureFlags&gt;; 
// { darkMode: boolean; newUserProfile: boolean; }
      </code></pre>

      <h3>Mapping Modifiers</h3>
      <p>You can add or remove <code>readonly</code> and <code>?</code> (optional) modifiers during the mapping process by prefixing with <code>+</code> or <code>-</code>. By default, specifying a modifier implies <code>+</code>.</p>
      <pre><code class="language-typescript">
// Removes the readonly modifier from all properties
type Mutable&lt;Type&gt; = {
  -readonly [Property in keyof Type]: Type[Property];
};

// Removes the optional modifier
type Concrete&lt;Type&gt; = {
  [Property in keyof Type]-?: Type[Property];
};
      </code></pre>

      <h2>Key Remapping via as</h2>
      <p>Introduced in TypeScript 4.1, key remapping allows you to change the names of the keys as they are being mapped, using the <code>as</code> clause. This is often combined with template literal types to generate entirely new key names.</p>

      <h3>Generating Getter Methods</h3>
      <p>A common pattern is transforming an interface of properties into an interface of getter functions.</p>
      <pre><code class="language-typescript">
type Getters&lt;Type&gt; = {
    [Property in keyof Type as \`get\${Capitalize&lt;string & Property&gt;}\`]: () =&gt; Type[Property]
};

interface Person {
    name: string;
    age: number;
}
type PersonGetters = Getters&lt;Person&gt;;
// { getName: () =&gt; string; getAge: () =&gt; number; }
      </code></pre>

      <h3>Filtering Keys</h3>
      <p>You can effectively filter out keys during mapping by remapping the key to <code>never</code>. TypeScript omits properties keyed with <code>never</code>.</p>
      <pre><code class="language-typescript">
// Only keep properties whose values extend a specific type
type FilterByValue&lt;T, ValueType&gt; = {
  [Key in keyof T as T[Key] extends ValueType ? Key : never]: T[Key]
};

interface User {
  id: number;
  name: string;
  isActive: boolean;
  role: string;
}
type StringProps = FilterByValue&lt;User, string&gt;;
// { name: string; role: string; }
      </code></pre>

      <h2>Advanced Iteration</h2>
      <p>Mapped types aren't just limited to <code>keyof</code>. You can iterate over any union of strings, numbers, or symbols.</p>
      <pre><code class="language-typescript">
type Colors = "red" | "green" | "blue";
type ColorHexMap = {
  [K in Colors]: string;
}; // { red: string; green: string; blue: string; }
      </code></pre>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is a mapped type in TypeScript?</strong><br/>A: A mapped type is a generic type that uses a union of keys to iterate over and create a new object type, defining a property for each key in the union.</li>
        <li><strong>Q2: How can you use mapping modifiers to make all properties of a type required and mutable?</strong><br/>A: By using the <code>-</code> prefix: <code>type RequiredMutable&lt;T&gt; = { -readonly [P in keyof T]-?: T[P] };</code>.</li>
        <li><strong>Q3: Explain Key Remapping via <code>as</code>. What is its primary use case?</strong><br/>A: Key remapping allows changing the name of keys during a mapped type operation using the syntax <code>[K in keyof T as NewKeyType]</code>. It is primarily used with template literals to prefix/suffix keys or to filter keys by resolving <code>NewKeyType</code> to <code>never</code>.</li>
        <li><strong>Q4: How does filtering keys with <code>as never</code> compare to using the built-in <code>Omit</code> utility?</strong><br/>A: <code>Omit</code> removes keys based on their names (a union of keys). Key remapping with <code>never</code> allows filtering keys based on the *values* of those properties or more complex logical conditions evaluated per key.</li>
        <li><strong>Q5: Can you remap keys to Symbol types?</strong><br/>A: Yes, mapped types support strings, numbers, and symbols. However, when using string manipulation utilities like <code>Capitalize</code>, you must intersect the key with <code>string</code> (e.g., <code>string & K</code>) to ensure it's a string.</li>
        <li><strong>Q6: Write a mapped type <code>PickByPrefix&lt;T, Prefix&gt;</code> that only keeps keys starting with a specific prefix.</strong><br/>A: <code>type PickByPrefix&lt;T, Prefix extends string&gt; = { [K in keyof T as K extends \`\${Prefix}\${string}\` ? K : never]: T[K] };</code>.</li>
      </ul>
    `
  },
  {
    title: "Type-Level Programming and Turing Completeness",
    content: `
      <h2>Introduction to Type-Level Programming</h2>
      <p>TypeScript's type system is famously Turing-complete. This means that, theoretically, any computation that can be expressed as a program can be executed purely within the type checker during compilation. While not recommended for production applications due to compiler performance impacts, understanding type-level programming deeply enhances your grasp of generic metaprogramming.</p>

      <h3>Type-Level Arithmetic</h3>
      <p>Since TypeScript does not support standard mathematical operators at the type level, type-level arithmetic is typically implemented using the lengths of tuple types. By pushing elements into tuples and reading their <code>length</code> property, you can perform addition, subtraction, multiplication, and more.</p>

      <pre><code class="language-typescript">
// Creating a tuple of length N
type BuildTuple&lt;L extends number, T extends any[] = []&gt; = 
    T['length'] extends L ? T : BuildTuple&lt;L, [...T, any]&gt;;

// Addition: Combine two tuples and get length
type Add&lt;A extends number, B extends number&gt; = 
    [...BuildTuple&lt;A&gt;, ...BuildTuple&lt;B&gt;]['length'];

type Sum = Add&lt;3, 5&gt;; // Resolves to 8
      </code></pre>

      <h3>Subtraction and Recursion Limits</h3>
      <p>Subtraction involves using <code>infer</code> to split a tuple into a target length and the remainder.</p>
      <pre><code class="language-typescript">
type Subtract&lt;A extends number, B extends number&gt; = 
    BuildTuple&lt;A&gt; extends [...BuildTuple&lt;B&gt;, ...infer Rest] 
        ? Rest['length'] 
        : never;

type Diff = Subtract&lt;10, 4&gt;; // Resolves to 6
      </code></pre>

      <h2>String Manipulation at the Type Level</h2>
      <p>Template literal types combined with conditional types allow for complex string parsing, such as splitting strings, replacing substrings, or parsing JSON strings into TypeScript types purely at compile time.</p>

      <pre><code class="language-typescript">
type ReplaceAll&lt;S extends string, From extends string, To extends string&gt; = 
    From extends "" ? S : 
    S extends \`\${infer Left}\${From}\${infer Right}\` 
        ? \`\${Left}\${To}\${ReplaceAll&lt;Right, From, To&gt;}\` 
        : S;

type Replaced = ReplaceAll&lt;"taming typescript is fun", "t", "T"&gt;; 
// "Taming TypeScript is fun"
      </code></pre>

      <h2>Practical Applications</h2>
      <p>While extreme type-level programming is an academic exercise, pragmatic metaprogramming is used extensively in libraries like Prisma, TRPC, and Zod to infer complex return types based on schema definitions or builder patterns. It provides incredible developer experience (DX) via autocompletion and immediate error checking without needing runtime execution.</p>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What does it mean that TypeScript's type system is Turing-complete?</strong><br/>A: It means the type system has sufficient expressive power to simulate any computer algorithm. You can write loops (via recursion), conditionals, and manipulate state (via passing types as generic arguments).</li>
        <li><strong>Q2: How is type-level arithmetic typically implemented in TypeScript?</strong><br/>A: Since there are no native type-level math operators, arithmetic is usually achieved by creating and manipulating tuples (arrays of specific lengths) and reading their <code>['length']</code> property.</li>
        <li><strong>Q3: What are the practical limitations of type-level programming?</strong><br/>A: The primary limitations are compiler performance, readability/maintainability, and recursion depth limits. Excessive type computations can drastically slow down IDE responsiveness and compilation times.</li>
        <li><strong>Q4: How does <code>[...T, any]</code> help in type-level programming?</strong><br/>A: Variadic tuple types allow for spreading an existing tuple and appending an element. This effectively acts as an "increment" operation, increasing the tuple's length by 1.</li>
        <li><strong>Q5: Implement a type-level utility <code>IsEqual&lt;A, B&gt;</code> that returns <code>true</code> if two types are strictly equal, and <code>false</code> otherwise.</strong><br/>A: <code>type IsEqual&lt;T, U&gt; = (&lt;G&gt;() =&gt; G extends T ? 1 : 2) extends (&lt;G&gt;() =&gt; G extends U ? 1 : 2) ? true : false;</code> (This relies on compiler internals for conditional types with generic functions).</li>
        <li><strong>Q6: What is the maximum recursion depth for type instantiations in TypeScript?</strong><br/>A: Historically it was 50, but in recent versions it has been increased to 1000 for specific tailored recursive patterns (like tail-recursion optimization in types introduced in TS 4.5).</li>
      </ul>
    `
  },
  {
    title: "Branded Types and Nominal Typing in TypeScript",
    content: `
      <h2>Structural vs Nominal Typing</h2>
      <p>TypeScript uses a <strong>structural type system</strong> (often called duck typing). This means that if two types have the same shape (the same properties and types), they are considered compatible, regardless of their names. While excellent for flexibility, structural typing fails when you want to enforce that two logically distinct domains that share the same underlying type (e.g., a User ID and a Product ID, both represented as strings) are not interchangeable.</p>

      <h2>Emulating Nominal Typing with Branded Types</h2>
      <p>Languages like Java or C# use nominal typing (compatibility is based on explicit declarations or names). In TypeScript, we emulate nominal typing using a pattern called <strong>Branded Types</strong> (or Opaque Types). We "brand" a primitive type by intersecting it with a unique, empty structure.</p>

      <pre><code class="language-typescript">
// Defining the Brand utility
type Brand&lt;K, T&gt; = K & { __brand: T };

// Creating branded types
type UserId = Brand&lt;string, "UserId"&gt;;
type ProductId = Brand&lt;string, "ProductId"&gt;;

function getUser(id: UserId) { /* ... */ }

const userId = "123" as UserId;
const productId = "456" as ProductId;

getUser(userId); // OK
// getUser(productId); // Error: Argument of type 'ProductId' is not assignable to parameter of type 'UserId'
      </code></pre>

      <h3>The Double Underscore Convention</h3>
      <p>The <code>__brand</code> property (often denoted with underscores to indicate it shouldn't be accessed at runtime) doesn't actually exist on the JavaScript value. The type assertion <code>as UserId</code> tells the compiler to treat the primitive string as if it has this property. At runtime, the variable is still just a string, meaning zero performance overhead.</p>

      <h2>Advanced Flavoring Patterns</h2>
      <p>Sometimes, strict branding is too restrictive. An alternative is "Flavoring," where the brand is optional. This allows implicit casting from the primitive to the flavored type, but prevents mixing different flavors.</p>

      <pre><code class="language-typescript">
type Flavor&lt;K, T&gt; = K & { __flavor?: T };

type EmailAddress = Flavor&lt;string, "Email"&gt;;
type PhoneNumber = Flavor&lt;string, "Phone"&gt;;

function sendEmail(email: EmailAddress) { /* ... */ }

// Implicit casting is allowed!
sendEmail("test@example.com"); 

const phone: PhoneNumber = "555-1234";
// sendEmail(phone); // Error: Types of property '__flavor' are incompatible.
      </code></pre>

      <h2>Practical Use Cases for Branded Types</h2>
      <ul>
        <li><strong>Database Entity IDs:</strong> Preventing accidental mixing of user IDs, tenant IDs, and order IDs.</li>
        <li><strong>Validated Data:</strong> Differentiating between an unvalidated string and an <code>EmailAddress</code> string that has passed through a validator function.</li>
        <li><strong>Currencies and Units:</strong> Distinguishing between <code>USD</code> and <code>EUR</code>, or <code>Meters</code> and <code>Feet</code>, which are all numbers under the hood.</li>
      </ul>

      <h2>Interview Questions</h2>
      <ul>
        <li><strong>Q1: What is the difference between structural typing and nominal typing? Which one does TypeScript use?</strong><br/>A: Structural typing determines compatibility based on the shape/structure of the type. Nominal typing relies on explicit names or declarations. TypeScript relies on structural typing.</li>
        <li><strong>Q2: Why is structural typing sometimes problematic for primitive types? Provide an example.</strong><br/>A: Because all numbers are structurally compatible with all other numbers. An <code>AccountBalance</code> parameter could accidentally accept a <code>Temperature</code> variable, leading to silent logical bugs.</li>
        <li><strong>Q3: Explain how the Branded Type pattern works in TypeScript.</strong><br/>A: It involves intersecting a base primitive type with an object type containing a unique, fictitious property (the "brand"). This makes the type structurally unique, preventing other primitives from being assigned to it without an explicit cast.</li>
        <li><strong>Q4: Do branded types incur any runtime performance penalty?</strong><br/>A: No. The brand is purely a compile-time construct. At runtime, the values remain naked primitives, and the brand property never actually exists.</li>
        <li><strong>Q5: How do you create an instance of a branded type?</strong><br/>A: Since the brand property doesn't exist at runtime, you must use a type assertion (casting) like <code>const id = "abc" as UserId</code>. In practice, this cast is often hidden inside a factory or validation function.</li>
        <li><strong>Q6: What is a "Flavor" type compared to a "Brand" type?</strong><br/>A: A flavor type makes the unique property optional (e.g., <code>__flavor?: T</code>). This allows standard primitives to be passed to functions expecting the flavored type, but still prevents different flavored types from being mixed.</li>
      </ul>
    `
  }
];

appendTopics('typescript', 'TypeScript Encyclopedia - Part 4', 'Advanced Conditional Types, Mapped Types, and Type-Level Programming.', topics);
