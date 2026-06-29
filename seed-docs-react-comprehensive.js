import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME,
    });
    console.log("Connected to MongoDB for Seeding Comprehensive React Docs.");
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
    topics: [
      {
        slug: { type: String, required: true },
        title: { type: String, required: true },
        order: { type: Number, required: true },
        content: { type: String, required: true },
        interviewQuestions: [
          {
            question: { type: String },
            answer: { type: String },
          },
        ],
        practicalTask: {
          scenario: { type: String },
          task: { type: String },
          solutionCode: { type: String },
        },
      },
    ],
  });
  return mongoose.model("Docs", DocsSchema);
};

const reactDoc = {
  technology: "react",
  title: "React — From Zero to Production",
  description:
    "Comprehensive React documentation covering fundamentals through advanced enterprise patterns. Includes interview questions and practical exercises for each topic.",
  topics: [
    // ==================== TOPIC 1: Introduction ====================
    {
      slug: "introduction-to-react",
      title: "1. Introduction to React",
      order: 1,
      content: `
# Introduction to React

## What is React?

React is an **open-source JavaScript library** for building user interfaces, developed and maintained by Facebook (Meta). It was first released in 2013 and has since become one of the most popular front-end libraries in the world.

### Key Characteristics

- **Declarative**: React allows you to describe *what* you want the UI to look like, and it handles *how* to update the DOM efficiently.
- **Component-Based**: UI is built from encapsulated, reusable pieces called components.
- **Learn Once, Write Anywhere**: React can be used to build web apps, mobile apps (React Native), desktop apps (Electron), and more.

## The Virtual DOM

The **Virtual DOM** is one of React's most important concepts. It's a lightweight JavaScript representation of the actual DOM.

### How it works:

1. **Initial Render**: React creates a virtual DOM tree mirroring the real DOM.
2. **State Change**: When state changes, React creates a new virtual DOM tree.
3. **Diffing**: React compares (diffs) the new virtual DOM with the previous one using a highly optimized algorithm.
4. **Reconciliation**: React calculates the minimal set of DOM mutations needed and batches them efficiently.

> **Why does this matter?** Direct DOM manipulation is slow. By batching updates and minimizing DOM touches, React delivers smooth, high-performance UIs even in complex applications.

## JSX — JavaScript XML

JSX is a **syntax extension for JavaScript** that looks like HTML. It's not required to use React, but it's the standard way to describe UI.

\`\`\`jsx
const element = <h1>Hello, World!</h1>;
\`\`\`

JSX gets **transpiled** by tools like Babel into regular JavaScript:

\`\`\`javascript
const element = React.createElement('h1', null, 'Hello, World!');
\`\`\`

## Setting Up a React Project

The official recommended way to start a React project:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

Or for a lighter, faster experience:

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

### Project Structure (Vite)

\`\`\`
my-app/
├── index.html
├── src/
│   ├── main.jsx        # Entry point
│   ├── App.jsx          # Root component
│   └── App.css
├── package.json
├── vite.config.js
└── ...
\`\`\`

## Hello World in React

\`\`\`jsx
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// App.jsx
function App() {
  return <h1>Hello, React World!</h1>;
}

export default App;
\`\`\`

## Key Takeaways

- React is a **library**, not a framework — it focuses on the view layer.
- The **Virtual DOM** makes React efficient by minimizing direct DOM manipulation.
- **JSX** is syntactic sugar that compiles to \`React.createElement\` calls.
- React follows a **declarative paradigm**: you describe the desired state, not the step-by-step mutations.
`,
      interviewQuestions: [
        {
          question:
            "What is React and how does it differ from other frameworks like Angular or Vue?",
          answer: `React is a **library for building user interfaces** developed by Facebook. Unlike Angular (a full MVC framework) or Vue (a progressive framework), React is focused solely on the view layer. This makes it lightweight and flexible — you can pair it with any routing, state management, or backend solution you prefer. React's core innovation is the **Virtual DOM**, which enables efficient UI updates through a diffing and reconciliation process.`,
        },
        {
          question:
            "Explain the Virtual DOM and the reconciliation process in React.",
          answer: `The Virtual DOM is a lightweight JavaScript object tree that mirrors the real DOM. When component state changes:

1. React creates a new virtual DOM tree.
2. It diffs this new tree against the previous one using a **heuristic O(n) algorithm** (not a full tree diff, which is O(n³)).
3. React identifies exactly which nodes changed.
4. It batches the minimal set of DOM mutations and applies them in a single update cycle.

This avoids the performance cost of repeatedly reading from and writing to the real DOM.`,
        },
        {
          question: "What is JSX and why is it used in React?",
          answer: `JSX (JavaScript XML) is a syntax extension that allows you to write HTML-like code within JavaScript. It's used because it **declaratively describes UI structure** in a way that's familiar to web developers. Under the hood, Babel transpiles JSX into \`React.createElement()\` calls. For example:

\`\`\`jsx
// JSX
<h1 className="title">Hello</h1>

// Desugars to:
React.createElement('h1', { className: 'title' }, 'Hello')
\`\`\`

JSX is optional — you can write React without it, but it greatly improves readability.`,
        },
        {
          question:
            "What is the difference between declarative and imperative programming in the context of React?",
          answer: `**Imperative** programming tells the DOM *how* to do something step-by-step:

\`\`\`javascript
const element = document.getElementById('root');
element.textContent = 'Hello';
element.className = 'highlight';
\`\`\`

**Declarative** programming (React's approach) describes *what* you want:

\`\`\`jsx
function App() {
  return <h1 className="highlight">Hello</h1>;
}
\`\`\`

React handles the underlying DOM operations. This makes code more predictable, easier to debug, and less error-prone.`,
        },
      ],
      practicalTask: {
        scenario:
          "A junior developer on your team has set up a new React project but is confused about the difference between JSX and HTML. They're trying to use 'class' instead of 'className' and attributes like 'for' instead of 'htmlFor'.",
        task: "Create a simple ProfileCard component that displays a user's name, avatar image, and a short bio. Use proper JSX attributes (className, htmlFor, src, alt) and explain why they differ from HTML attributes.",
        solutionCode: `function ProfileCard({ name, avatarUrl, bio }) {
  return (
    <div className="profile-card">
      <label htmlFor="profile-avatar">Avatar:</label>
      <img
        id="profile-avatar"
        src={avatarUrl}
        alt={\`\${name}'s avatar\`}
        className="avatar"
      />
      <h2 className="user-name">{name}</h2>
      <p className="bio">{bio}</p>
    </div>
  );
}

// Usage
<ProfileCard
  name="Alice Johnson"
  avatarUrl="https://i.pravatar.cc/150?u=alice"
  bio="Full-stack developer passionate about React"
/>`,
      },
    },

    // ==================== TOPIC 2: Components & Props ====================
    {
      slug: "components-and-props",
      title: "2. Components & Props",
      order: 2,
      content: `
# Components & Props

## What is a Component?

A **component** is a reusable, self-contained piece of UI. In React, components are JavaScript functions (or classes) that return JSX.

### Types of Components

| Type | Syntax | When to Use |
|------|--------|-------------|
| Functional Component | \`function MyComp() { return <div/>; }\` | **Modern standard** — cleaner, supports hooks |
| Class Component | \`class MyComp extends React.Component { render() { ... } }\` | Legacy — used before hooks existed |

**Always use functional components for new code.**

## Props — Passing Data to Components

**Props** (short for "properties") are read-only inputs passed to a component. They make components reusable and configurable.

\`\`\`jsx
// Child component receiving props
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Or with destructuring (preferred):
function Greeting({ name, age }) {
  return <h1>Hello, {name}! You are {age} years old.</h1>;
}

// Parent component passing props
function App() {
  return (
    <div>
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
    </div>
  );
}
\`\`\`

### Props are Read-Only

**Never mutate props inside a component.** Props flow **one-way** — from parent to child. If a child needs to modify data, it should communicate via callbacks (functions passed as props) that the parent provides.

### Children Prop

The special \`children\` prop allows you to pass JSX content into a component:

\`\`\`jsx
function Card({ children, title }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-body">{children}</div>
    </div>
  );
}

// Usage:
<Card title="Welcome">
  <p>This content is passed as <strong>children</strong>.</p>
  <button>Click me</button>
</Card>
\`\`\`

## Component Composition

React encourages **composition** over inheritance. Compose small, simple components to build complex UIs:

\`\`\`jsx
function Avatar({ src, alt }) {
  return <img className="avatar" src={src} alt={alt} />;
}

function UserInfo({ user }) {
  return (
    <div className="user-info">
      <Avatar src={user.avatarUrl} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}

function Post({ author, text }) {
  return (
    <div className="post">
      <UserInfo user={author} />
      <p>{text}</p>
    </div>
  );
}
\`\`\`

## Default Props & Prop Types

\`\`\`jsx
// Default values with destructuring
function Button({ variant = 'primary', children, disabled = false }) {
  return (
    <button className={\`btn btn-\${variant}\`} disabled={disabled}>
      {children}
    </button>
  );
}
\`\`\`

## Key Principles

1. **Single Responsibility**: Each component should do one thing well.
2. **Don't Repeat Yourself (DRY)**: Extract repeated UI patterns into components.
3. **Props should be explicit**: Avoid passing unnecessary props.
4. **Prefer composition**: Build complex UIs by nesting simple components.
`,
      interviewQuestions: [
        {
          question:
            "What are props in React and how do they differ from state?",
          answer: `**Props** (properties) are read-only inputs passed from a parent component to a child. They are immutable — a component should never modify its own props. **State**, on the other hand, is internal data managed within a component that can change over time (via setState or useState). The key distinction:

- Props are **external** (passed in), state is **internal** (owned locally).
- Props are **read-only**, state is **mutable**.
- Changing props requires the parent to re-render with new values; changing state is done via the setter function.

In short: props are like function parameters, state is like a component's memory.`,
        },
        {
          question: "What is the children prop and when would you use it?",
          answer: `The \`children\` prop is a special prop that allows you to pass JSX content/elements between the opening and closing tags of a component. It enables **component composition**.

Example use cases:
- **Layout components** (Sidebar, Card, Modal) that wrap arbitrary content.
- **Provider patterns** where the provider wraps the entire app.
- **Higher-order components** that render additional wrapping markup.

\`\`\`jsx
function Modal({ isOpen, children }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">{children}</div>
    </div>
  );
}
\`\`\``,
        },
        {
          question: "Explain the concept of one-way data flow in React.",
          answer: `One-way data flow means data flows **unidirectionally** from parent to child via props. If a child needs to communicate back to the parent, it calls a callback function that was passed down as a prop. This pattern:

1. **Simplifies debugging** — data always flows downhill, making it easy to trace where a value came from.
2. **Prevents side effects** — children can't mutate parent state directly.
3. **Improves predictability** — you always know where data changes originate.

This is fundamentally different from two-way binding (like Angular's ngModel), where child components can directly modify parent state.`,
        },
        {
          question:
            "What is component composition and why is it preferred over inheritance in React?",
          answer: `Component composition is the practice of building complex UIs by **combining smaller, focused components** together — typically using the \`children\` prop or by passing components as props.

React favors composition over inheritance because:
1. **Flexibility**: You can mix and match components without rigid hierarchies.
2. **Reusability**: Small components are easier to reuse in different contexts.
3. **Simplicity**: Composition avoids deep inheritance chains that become hard to maintain.
4. **Type safety**: With composition, props interfaces stay clean and explicit.

The React team explicitly recommends composition: "At Facebook, we use React in thousands of components, and we haven't found any use cases where we would recommend creating component inheritance hierarchies."`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building a social media feed. You need to display posts with user avatars, names, timestamps, and content. Each post should be a reusable component.",
        task: "Create three components: Avatar (displays user image), UserMeta (shows name + timestamp), and Post (composes Avatar + UserMeta + content). Pass all data via props. The Post component should also accept an optional 'actions' slot via the children prop for like/comment buttons.",
        solutionCode: `// Avatar Component
function Avatar({ src, alt, size = 40 }) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      style={{ borderRadius: '50%', objectFit: 'cover' }}
    />
  );
}

// UserMeta Component
function UserMeta({ name, timestamp }) {
  return (
    <div className="user-meta">
      <strong>{name}</strong>
      <span style={{ color: '#888', fontSize: '0.85rem' }}>
        {new Date(timestamp).toLocaleDateString()}
      </span>
    </div>
  );
}

// Post Component (composes the above)
function Post({ avatarSrc, avatarAlt, userName, timestamp, content, children }) {
  return (
    <article className="post" style={{
      border: '1px solid #ddd',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      maxWidth: 500
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar src={avatarSrc} alt={avatarAlt} />
        <UserMeta name={userName} timestamp={timestamp} />
      </div>
      <p>{content}</p>
      {children && <div style={{ marginTop: 12 }}>{children}</div>}
    </article>
  );
}

// Usage
function Feed() {
  return (
    <div>
      <Post
        avatarSrc="https://i.pravatar.cc/40?u=john"
        avatarAlt="John Doe"
        userName="John Doe"
        timestamp="2024-01-15T10:30:00Z"
        content="Just finished the React documentation! 🚀"
      >
        <button>👍 Like</button>
        <button>💬 Comment</button>
      </Post>
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 3: JSX Deep Dive ====================
    {
      slug: "jsx-deep-dive",
      title: "3. JSX Deep Dive",
      order: 3,
      content: `
# JSX Deep Dive

## JSX Expressions

Any JavaScript expression can be embedded inside JSX using curly braces \`{}\`:

\`\`\`jsx
const user = { firstName: 'Jane', lastName: 'Doe' };

function Greeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : 'Good afternoon';
  
  return (
    <div>
      <h1>{greeting}, {user.firstName}!</h1>
      <p>{2 + 2}</p>
      <p>{user.firstName.toUpperCase()}</p>
      <p>{new Date().toLocaleDateString()}</p>
    </div>
  );
}
\`\`\`

### You CANNOT use statements in JSX:
- ❌ \`{if (condition) { ... }}\`
- ❌ \`{for (let i = 0; i < 10; i++) { ... }}\`
- ✅ Use **ternary** (\`condition ? a : b\`) or **logical AND** (\`condition && <Component/>\`)

## Conditional Rendering

\`\`\`jsx
function UserStatus({ isLoggedIn, role }) {
  return (
    <div>
      {/* Ternary */}
      {isLoggedIn ? <LogoutButton /> : <LoginButton />}
      
      {/* Logical AND — renders right side only if left is truthy */}
      {isLoggedIn && <WelcomeMessage />}
      
      {/* Switch-like pattern with IIFE */}
      {(() => {
        switch (role) {
          case 'admin': return <AdminPanel />;
          case 'user': return <UserDashboard />;
          default: return <GuestView />;
        }
      })()}
    </div>
  );
}
\`\`\`

## Lists & Keys

\`\`\`jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.text}
        </li>
      ))}
    </ul>
  );
}
\`\`\`

### Keys: Why They Matter

Keys help React identify which items have changed, been added, or been removed. **Use stable IDs**, not array indices:

\`\`\`jsx
// ✅ Good: stable database IDs
items.map(item => <li key={item.id}>{item.text}</li>);

// ⚠ Avoid: array indices (causes bugs with reordering/insertion)
items.map((item, index) => <li key={index}>{item.text}</li>);

// ✅ Acceptable if list is static and never reordered
items.map((item, index) => <li key={index}>{item.text}</li>);
\`\`\`

## Inline Styles

CSS in JSX is written as a JavaScript object with camelCased properties:

\`\`\`jsx
const divStyle = {
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

function StyledBox() {
  return <div style={divStyle}>Styled Content</div>;
}
\`\`\`

## JSX Gotchas

| HTML Attribute | JSX Equivalent | Reason |
|----------------|----------------|--------|
| \`class\`       | \`className\`   | 'class' is a reserved word in JS |
| \`for\`         | \`htmlFor\`     | 'for' is a reserved word in JS |
| \`tabindex\`    | \`tabIndex\`    | camelCase convention |
| \`stroke-width\`| \`strokeWidth\` | Hyphens not valid in JS objects |
| \`style="..."\` | \`style={{}}\`  | JSX style takes an object |
`,
      interviewQuestions: [
        {
          question:
            "Why can't we use 'class' as an attribute in JSX? What should we use instead?",
          answer: `In JSX, we use \`className\` instead of \`class\` because \`class\` is a **reserved keyword** in JavaScript (used for defining classes). Since JSX is essentially JavaScript, using \`class\` would cause syntax conflicts. The same applies to \`for\` — its JSX equivalent is \`htmlFor\`.

This is handled by Babel during transpilation — \`className\` gets converted to \`class\` in the actual DOM.`,
        },
        {
          question:
            "Explain the importance of 'key' prop when rendering lists in React.",
          answer: `The \`key\` prop gives React a way to **identify individual items** in a list. Without keys, when the list changes (items added/removed/reordered), React would need to re-render every item. With keys:

1. React can **match elements** across renders and reuse DOM nodes.
2. It enables **efficient reordering** — React moves existing DOM nodes instead of destroying and recreating them.
3. It preserves **component state** — a component with a stable key retains its local state across re-renders.

Using array indices as keys is discouraged because if the list is reordered (items sorted, inserted, or deleted), the index-key mapping breaks, leading to incorrect rendering and state bugs.`,
        },
        {
          question: "What are the rules of JSX? List at least three.",
          answer: `1. **Return a single root element**: You must wrap multiple elements in a single parent (Fragment, div, or <>).
2. **Close all tags**: Self-closing tags like <img> must be written as <img />.
3. **camelCase attributes**: HTML attributes become camelCase (className, onClick, tabIndex, strokeWidth).
4. **Curly braces for expressions**: Use {} to embed JavaScript expressions.
5. **Comments use JS syntax**: {/* comment */} not <!-- comment -->.`,
        },
        {
          question:
            "How do you conditionally render content in JSX? Compare different approaches.",
          answer: `There are several approaches:

1. **Ternary operator**: \`{condition ? <ComponentA /> : <ComponentB />}\` — good for if/else.
2. **Logical AND**: \`{condition && <Component />}\` — renders nothing if condition is falsy. Be careful with numbers: \`{0 && <Comp/>}\` renders 0.
3. **Immediately Invoked Function Expression (IIFE)**: For complex logic with multiple conditions.
4. **Early return**: return null if a component should not render.
5. **Separate function**: Extract conditional logic into its own function.

Choose the simplest approach that makes the code readable.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a product listing page that displays items from an API. Some products may have discount prices, some may be out of stock, and you need to handle all these states in the UI.",
        task: "Create a ProductList component that receives an array of products. Each product has: id, name, price, originalPrice (optional, for discounts), inStock (boolean), and tags (array of strings). Use conditional rendering to: (1) show a discount badge if originalPrice exists, (2) grey out / disable out-of-stock items, (3) render tags as a list. Use proper keys.",
        solutionCode: `function ProductCard({ product }) {
  const discountPercent = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className={\`product-card \${!product.inStock ? 'out-of-stock' : ''}\`}
      style={{
        opacity: product.inStock ? 1 : 0.5,
        border: '1px solid #ddd',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        position: 'relative'
      }}
    >
      {/* Discount Badge */}
      {product.originalPrice && (
        <span style={{
          position: 'absolute',
          top: 8,
          right: 8,
          background: '#e74c3c',
          color: '#fff',
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 12,
          fontWeight: 'bold'
        }}>
          -{discountPercent}%
        </span>
      )}

      <h3>{product.name}</h3>

      {/* Price Display */}
      <div style={{ margin: '8px 0' }}>
        <span style={{ fontWeight: 'bold', fontSize: 18 }}>
          \${product.price.toFixed(2)}
        </span>
        {product.originalPrice && (
          <span style={{
            textDecoration: 'line-through',
            color: '#999',
            marginLeft: 8,
            fontSize: 14
          }}>
            \${product.originalPrice.toFixed(2)}
          </span>
        )}
      </div>

      {/* Stock Status */}
      {!product.inStock && (
        <span style={{ color: '#e74c3c', fontSize: 13, fontWeight: 500 }}>
          Currently out of stock
        </span>
      )}

      {/* Tags */}
      {product.tags.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {product.tags.map(tag => (
            <span key={tag} style={{
              background: '#f0f0f0',
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: 12
            }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductList({ products }) {
  return (
    <div>
      <h2>Products ({products.length})</h2>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// Usage Example
const sampleProducts = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, originalPrice: 129.99, inStock: true, tags: ['audio', 'bluetooth', 'sale'] },
  { id: 2, name: 'USB-C Hub', price: 34.99, inStock: false, tags: ['accessories', 'usb-c'] },
  { id: 3, name: 'Mechanical Keyboard', price: 89.99, inStock: true, tags: ['peripherals'] },
];`,
      },
    },

    // ==================== TOPIC 4: useState ====================
    {
      slug: "usestate-hook",
      title: "4. State & useState Hook",
      order: 4,
      content: `
# State & the useState Hook

## What is State?

**State** is data that changes over time within a component. Unlike props (which are passed in and read-only), state is internal, mutable, and when it changes, React re-renders the component.

## The useState Hook

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  //      ^        ^              ^
  //   current   setter        initial value
  //   value     function

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
\`\`\`

## Multiple State Variables

\`\`\`jsx
function Form() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <form>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={email} onChange={e => setEmail(e.target.value)} />
      {/* ... */}
    </form>
  );
}
\`\`\`

## State with Objects

\`\`\`jsx
function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    preferences: { theme: 'light', notifications: true }
  });

  // ✅ Correct: spread to retain other fields
  const updateName = (name) => {
    setUser(prev => ({ ...prev, name }));
  };

  // ✅ Correct: nested spread for nested objects
  const toggleTheme = () => {
    setUser(prev => ({
      ...prev,
      preferences: { ...prev.preferences, theme: prev.preferences.theme === 'light' ? 'dark' : 'light' }
    }));
  };

  // ❌ Wrong: this mutates state directly
  // user.name = 'New Name';  // DON'T DO THIS
}
\`\`\`

## useState Rules

1. **State updates are asynchronous** — React batches state updates. The \`setCount\` call doesn't immediately change \`count\`.
2. **Never mutate state directly** — always use the setter function.
3. **State is immutable** — treat all state as immutable, especially objects and arrays.
4. **Call hooks at the top level** — never inside loops, conditions, or nested functions.

## Functional Updates

When the new state depends on the previous state, use a function:

\`\`\`jsx
// ✅ Correct: functional update
setCount(prevCount => prevCount + 1);

// ✅ Correct: even with batching
setCount(prev => prev + 1);
setCount(prev => prev + 1);
// Result: count increases by 2

// ❌ Wrong: stale closure issue
setCount(count + 1);
setCount(count + 1);
// Result: count increases by 1 (both use the same stale 'count' value)
\`\`\`

## Lazy Initialization

If the initial state is expensive to compute, pass a function:

\`\`\`jsx
// ❌ Expensive: runs on every render
const [data, setData] = useState(computeExpensiveValue());

// ✅ Efficient: runs only on initial render
const [data, setData] = useState(() => computeExpensiveValue());
\`\`\`
`,
      interviewQuestions: [
        {
          question: "What is the useState hook and how does it work?",
          answer: `\`useState\` is a React hook that adds state management to functional components. It returns an array with two elements:
1. The **current state value**.
2. A **setter function** to update that value.

When the setter is called, React schedules a re-render of the component (and its children). The new state value is available on the next render. React preserves state across re-renders using the hook's position in the component's call order.

**Important**: State updates are asynchronous and batched — multiple setState calls in the same synchronous block may be batched into a single re-render for performance.`,
        },
        {
          question:
            "What is the difference between props and state? Provide a comparison.",
          answer: `| Aspect | Props | State |
|--------|-------|-------|
| **Mutability** | Immutable (read-only) | Mutable via setter |
| **Ownership** | Parent component | Current component |
| **Purpose** | Configure/parameterize child | Track internal dynamic data |
| **Trigger re-render** | When parent passes new values | When setter is called |
| **Initialization** | From parent | From component itself |
| **Default** | Could have defaultProps | \`useState(initialValue)\` |

Simple rule: If a component needs data that changes, that data belongs in state. If a component needs to receive data from outside, that's props.`,
        },
        {
          question: "Why should you never mutate state directly in React?",
          answer: `Direct mutation (e.g., \`this.state.count = 5\` or \`state.name = 'new'\`) doesn't trigger a re-render because React has no way of knowing the state changed. The \`setState\` / setter function is what tells React to:

1. Schedule a re-render.
2. Compute the new virtual DOM.
3. Diff and apply updates.

Additionally, direct mutation can lead to **bugs with reference equality checks** used by memoization (\`React.memo\`, \`useMemo\`, \`useCallback\`) and the upcoming React compiler. Always treat state as immutable and use the setter.`,
        },
        {
          question:
            "What is a functional update in useState? When would you use it?",
          answer: `A functional update passes a **function** to the state setter: \`setCount(prev => prev + 1)\`. The function receives the **most recent state** as its argument and returns the new state.

Use functional updates when:
1. The new state depends on the previous state.
2. You're calling the setter multiple times in a row (e.g., in a loop or after rapid clicks).
3. You have **stale closure** issues — where the closure captures an outdated state value.

Without functional updates, multiple sequential calls use the same stale value. With functional updates, each call gets the latest value.`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building a shopping cart feature. Users can add items, adjust quantities, remove items, and see the total price update in real-time. The cart data is complex (array of objects with nested fields).",
        task: "Build a ShoppingCart component that manages an array of cart items using useState. Each item has: id, name, price, quantity. Implement: (1) addItem — adds a new item or increments quantity if it exists, (2) updateQuantity(id, delta), (3) removeItem(id), (4) display total price. Use functional updates and immutable patterns.",
        solutionCode: `import { useState } from 'react';

function ShoppingCart() {
  const [items, setItems] = useState([]);

  const addItem = (product) => {
    // Check if item already exists in cart
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Increment quantity
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0) // Remove if quantity reaches 0
    );
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Shopping Cart ({items.length} items)</h2>

      {/* Sample products to add */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => addItem({ id: 1, name: 'T-Shirt', price: 19.99 })}>
          + Add T-Shirt ($19.99)
        </button>
        <button onClick={() => addItem({ id: 2, name: 'Jeans', price: 49.99 })}>
          + Add Jeans ($49.99)
        </button>
      </div>

      {/* Cart Items */}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 12,
              borderBottom: '1px solid #eee'
            }}>
              <div>
                <strong>{item.name}</strong>
                <div style={{ color: '#666', fontSize: 14 }}>
                  \${item.price.toFixed(2)} × {item.quantity} = \${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                <button onClick={() => removeItem(item.id)} style={{ color: '#e74c3c' }}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Total */}
      {items.length > 0 && (
        <div style={{
          marginTop: 16,
          padding: 16,
          background: '#f8f9fa',
          borderRadius: 8,
          textAlign: 'right',
          fontWeight: 'bold',
          fontSize: 18
        }}>
          Total: \${totalPrice.toFixed(2)}
        </div>
      )}
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 5: useEffect ====================
    {
      slug: "useeffect-hook",
      title: "5. useEffect & Side Effects",
      order: 5,
      content: `
# useEffect — Managing Side Effects

## What are Side Effects?

Side effects are operations that affect something **outside the component** or depend on something **outside the component's scope**:

- Fetching data from an API
- Subscribing to events / WebSockets
- Manipulating the DOM directly
- Setting timers (setTimeout, setInterval)
- Logging / analytics
- Synchronizing with external systems

## The useEffect Hook

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserData({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This runs AFTER the component renders
    let isMounted = true;  // Prevent state updates on unmounted component

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(\`https://api.example.com/users/\${userId}\`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        if (isMounted) {
          setUser(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    // Cleanup function — runs before component unmounts or effect re-runs
    return () => {
      isMounted = false;
    };
  }, [userId]); // Dependency array: effect re-runs when userId changes

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <UserDisplay user={user} />;
}
\`\`\`

## The Dependency Array

The dependency array controls when the effect runs:

| Dependency Array | When Effect Runs |
|-----------------|------------------|
| \`useEffect(fn)\` | Every render (avoid if possible) |
| \`useEffect(fn, [])\` | Only on mount (component appears) |
| \`useEffect(fn, [a, b])\` | On mount + whenever \`a\` or \`b\` changes |
| Return cleanup | On unmount + before each re-run (for cleanup) |

## Common useEffect Patterns

### 1. Data Fetching with Loading & Error States

\`\`\`jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;

    const controller = new AbortController();
    setIsLoading(true);

    fetch(\`/api/search?q=\${query}\`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error('Search failed');
        return res.json();
      })
      .then(data => {
        setResults(data);
        setError(null);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setIsLoading(false));

    // Cancel fetch if query changes before response arrives
    return () => controller.abort();
  }, [query]);

  return (/* render logic */);
}
\`\`\`

### 2. Event Listeners

\`\`\`jsx
function WindowTracker() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Cleanup: remove listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty — only mount/unmount

  return (
    <div>
      Window: {dimensions.width} × {dimensions.height}
    </div>
  );
}
\`\`\`

### 3. Timers

\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div>Elapsed: {seconds}s</div>;
}
\`\`\`

## Common Mistakes

1. **Missing dependencies** — React's exhaustive-deps ESLint rule helps catch these.
2. **Unnecessary dependencies** — Only include values that the effect actually uses.
3. **Forgetting cleanup** — Leads to memory leaks (especially with subscriptions).
4. **Infinite loops** — Effect updates state → state triggers re-render → re-render triggers effect → ...
5. **Not handling race conditions** — When previous async operations resolve after new ones start.
`,
      interviewQuestions: [
        {
          question: "What is the useEffect hook and when would you use it?",
          answer: `\`useEffect\` lets you perform side effects in functional components. It runs **after rendering** and replaces lifecycle methods from class components: \`componentDidMount\`, \`componentDidUpdate\`, and \`componentWillUnmount\`.

Use it for operations that interact with the outside world:
- API calls (fetching data)
- Browser APIs (event listeners, timers, localStorage)
- Subscriptions (WebSockets, observables)
- Manual DOM manipulation
- Setting up analytics or logging

The dependency array controls when the effect runs. A cleanup function (returned from the effect) prevents memory leaks by cleaning up subscriptions, aborting fetches, or removing event listeners.`,
        },
        {
          question:
            "Explain the useEffect dependency array. What happens with different combinations?",
          answer: `The dependency array tells React when to re-run the effect:

- **No array** (\`useEffect(fn)\`): Runs after every render. Avoid unless you have a specific reason.
- **Empty array** (\`useEffect(fn, [])\`): Runs once on mount, cleanup runs on unmount. Good for initialization.
- **With values** (\`useEffect(fn, [a, b])\`): Runs on mount and whenever \`a\` or \`b\` change.

Rules:
- Include every reactive value (props, state, derived values) that the effect uses.
- Don't include values the effect doesn't use (causes unnecessary re-runs).
- Use the \`exhaustive-deps\` ESLint rule to automatically check dependencies.
- An empty array means the effect truly depends on nothing — be sure that's correct.`,
        },
        {
          question:
            "What is the cleanup function in useEffect and why is it important?",
          answer: `The cleanup function is returned from the effect callback and runs:
1. When the component unmounts.
2. Before the effect re-runs (if dependencies changed).

It's essential for **preventing memory leaks and stale side effects**. Common cleanups include:
- Removing event listeners: \`window.removeEventListener('resize', handleResize)\`
- Clearing timers: \`clearInterval(intervalId)\`
- Aborting network requests: \`controller.abort()\`
- Unsubscribing from services: \`ws.close()\`, \`firestore.unsubscribe()\`
- Setting a flag to prevent state updates on unmounted components: \`isMounted = false\`

Without cleanup, you could end up with duplicate listeners, memory leaks, or "Can't perform a React state update on an unmounted component" warnings.`,
        },
        {
          question:
            "How do you handle race conditions in useEffect when fetching data?",
          answer: `Race conditions occur when multiple requests are fired (e.g., the user types quickly in a search box) and an older response arrives after a newer one, overwriting the correct data.

Strategies to handle them:

1. **AbortController**: Cancel the previous fetch when a new one starts. The cleanup function aborts the previous request.
2. **Flag variable (\`isMounted\`)**: Track whether the component is still mounted or if a newer request has superseded this one.
3. **Most recent token**: Use a simple counter/incrementing ID — only process the response if the ID matches the latest request.
4. **Use libraries**: \`@tanstack/react-query\`, \`swr\`, or \`rtk-query\` handle this automatically.

\`\`\`jsx
// Example with AbortController
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(res => setData(res));
  return () => controller.abort(); // Cancel if effect re-runs
}, [url]);
\`\`\``,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a real-time search component that fetches results from an API as the user types. You must handle: debouncing (don't fire on every keystroke), race conditions, loading states, error states, and cleanup on unmount.",
        task: "Build a SearchAutocomplete component with: (1) a text input that debounces (300ms delay), (2) fetches results from a mock API, (3) shows loading spinner, (4) handles empty results, (5) handles errors, (6) cancels in-flight requests on new input. Use useEffect, AbortController, and proper cleanup.",
        solutionCode: `import { useState, useEffect, useRef } from 'react';

// Simulated API
const searchApi = {
  async search(query, signal) {
    await new Promise(r => setTimeout(r, Math.random() * 500 + 200));
    if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
    const results = [
      'React Hooks Guide',
      'Understanding useEffect',
      'React Performance Tips',
      'Advanced React Patterns',
      'React vs Vue Comparison',
      'Building with Next.js',
      'React State Management'
    ];
    return results
      .filter(item => item.toLowerCase().includes(query.toLowerCase()))
      .map((title, i) => ({ id: i + 1, title }));
  }
};

function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Clear previous debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const controller = new AbortController();

    // Debounce: wait 300ms before fetching
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchApi.search(query, controller.signal);
        if (!controller.signal.aborted) {
          setResults(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Search failed');
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    // Cleanup: abort fetch and clear timeout
    return () => {
      controller.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search documentation..."
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: 16,
            border: '2px solid #ddd',
            borderRadius: 8,
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        {isLoading && (
          <span style={{ position: 'absolute', right: 12, top: 12 }}>
            ⏳
          </span>
        )}
      </div>

      {error && (
        <div style={{ color: '#e74c3c', marginTop: 8, padding: 8, background: '#fde8e8', borderRadius: 4 }}>
          Error: {error}
        </div>
      )}

      {!isLoading && query && results.length === 0 && !error && (
        <p style={{ color: '#888', marginTop: 8 }}>No results found for "{query}"</p>
      )}

      {results.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '8px 0 0',
          border: '1px solid #ddd',
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          {results.map(item => (
            <li key={item.id} style={{
              padding: '10px 16px',
              borderBottom: '1px solid #eee',
              cursor: 'pointer'
            }}
            onMouseEnter={e => e.target.style.background = '#f5f5f5'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
              {item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 6: Event Handling & Forms ====================
    {
      slug: "event-handling-forms",
      title: "6. Event Handling & Forms",
      order: 6,
      content: `
# Event Handling & Forms

## Event Handling in React

React uses **synthetic events** — a cross-browser wrapper around the native DOM event system. This ensures events work consistently across all browsers.

\`\`\`jsx
function EventExamples() {
  // Event handler functions
  const handleClick = (e) => {
    console.log('Button clicked!', e);
    // e is a SyntheticEvent
  };

  const handleMouseEnter = () => {
    console.log('Mouse entered');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault(); // Prevent browser save dialog
      console.log('Ctrl+S pressed');
    }
  };

  return (
    <div>
      <button onClick={handleClick}>Click me</button>
      <div onMouseEnter={handleMouseEnter}>Hover me</div>
      <input onKeyDown={handleKeyDown} placeholder="Press keys" />
    </div>
  );
}
\`\`\`

## Passing Arguments to Event Handlers

\`\`\`jsx
function ItemList({ items, onDelete }) {
  // Method 1: Arrow function (most common)
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

// Method 2: .bind (less common, but avoids creating functions on each render
// when used with React.memo)
<button onClick={onDelete.bind(null, item.id)}>Delete</button>
\`\`\`

## Controlled Components

In React, form inputs are typically **controlled** — React manages the input's value via state, making React the "single source of truth."

\`\`\`jsx
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload
    console.log('Form submitted:', formData);
    // Send to API...
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <label>
        <input
          name="rememberMe"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={handleChange}
        />
        Remember me
      </label>
      <button type="submit">Login</button>
    </form>
  );
}
\`\`\`

## Uncontrolled Components (with useRef)

Sometimes you don't need to control every keystroke — you can use refs to read values only when needed (e.g., on submit):

\`\`\`jsx
import { useRef } from 'react';

function UncontrolledForm() {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Input value: \${inputRef.current.value}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input ref={inputRef} defaultValue="Initial value" />
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`

## Common Form Inputs

\`\`\`jsx
function FullForm() {
  const [data, setData] = useState({
    text: '',
    textarea: '',
    select: '',
    radio: '',
    files: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <form>
      {/* Text input */}
      <input name="text" value={data.text} onChange={handleChange} />

      {/* Textarea */}
      <textarea name="textarea" value={data.textarea} onChange={handleChange} />

      {/* Select dropdown */}
      <select name="select" value={data.select} onChange={handleChange}>
        <option value="">Choose...</option>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </select>

      {/* Radio buttons */}
      <label>
        <input type="radio" name="radio" value="yes" onChange={handleChange} />
        Yes
      </label>
      <label>
        <input type="radio" name="radio" value="no" onChange={handleChange} />
        No
      </label>

      {/* File input (uncontrolled by nature) */}
      <input type="file" name="files" onChange={handleChange} />
    </form>
  );
}
\`\`\`

## Form Validation

\`\`\`jsx
function ValidatedForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!values.email.includes('@')) newErrors.email = 'Invalid email';
    if (values.password.length < 6) newErrors.password = 'Min 6 characters';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Submit...
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" value={values.email} onChange={handleChange} />
      {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      
      <input name="password" type="password" value={values.password} onChange={handleChange} />
      {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
}
\`\`\`
`,
      interviewQuestions: [
        {
          question: "What are synthetic events in React?",
          answer: `Synthetic events are React's cross-browser wrapper around the browser's native events. They provide a consistent interface across all browsers by normalizing event properties (e.g., \`e.preventDefault()\`, \`e.stopPropagation()\`) that behave differently in different browsers.

Key details:
- Synthetic events are **pooled** for performance — the event object is reused, so accessing it asynchronously (e.g., in a setTimeout) requires \`e.persist()\` (pre-React 17) or using \`e.nativeEvent\`.
- React attaches event handlers to the **root DOM container** (event delegation) rather than to individual elements, improving memory efficiency.
- In React 17+, event delegation is on the root DOM node, not the document. In React 18+, it's on the root element.`,
        },
        {
          question:
            "What is the difference between controlled and uncontrolled components in React?",
          answer: `**Controlled components**: React manages the form input's value via state. The input's \`value\` prop is bound to state, and changes go through \`onChange\` → \`setState\`. React is the single source of truth.

\`\`\`jsx
<input value={state} onChange={e => setState(e.target.value)} />
\`\`\`

**Uncontrolled components**: The DOM manages its own internal state. You use a \`ref\` to access values when needed (e.g., on submit).

\`\`\`jsx
const ref = useRef(null);
<input ref={ref} defaultValue="initial" />
\`\`\`

**When to use which:**
- Controlled: When you need real-time validation, dynamic inputs, or complex form logic.
- Uncontrolled: For simple forms, file inputs, or integrating with non-React code.`,
        },
        {
          question:
            "How do you prevent default behavior and stop event propagation in React?",
          answer: `In React, you call the methods on the synthetic event object:

\`\`\`jsx
// Prevent default (e.g., form submission, link navigation)
const handleSubmit = (e) => {
  e.preventDefault();
  // Process form...
};

// Stop propagation (prevent event from bubbling up)
const handleButtonClick = (e) => {
  e.stopPropagation();
  // Only this handler runs, parent handlers won't fire
};

// Both together
const handleClick = (e) => {
  e.preventDefault();
  e.stopPropagation();
};
\`\`\`

Note: Unlike native DOM where you \`return false\` to prevent default, in React you must explicitly call \`e.preventDefault()\`. React's synthetic event system normalizes this behavior.`,
        },
        {
          question: "How do you handle form validation in React?",
          answer: `Form validation in React can be approached several ways:

1. **Inline state validation**: Track errors in component state, validate on submit and/or on change/blur. Simple for small forms.
2. **Custom validation hook**: Extract validation logic into a reusable \`useFormValidation\` hook.
3. **Form libraries**: Use \`react-hook-form\` (performant with refs, minimal re-renders), \`Formik\` (declarative), or \`React Final Form\`.
4. **Schema validation**: Combine with \`Yup\` or \`Zod\` for schema-based validation that's reusable on both client and server.

Best practices:
- Validate on blur for better UX (not on every keystroke for complex forms).
- Show errors inline next to the relevant field.
- Disable submit button until the form is valid.
- Use \`aria-invalid\` and \`aria-describedby\` for accessibility.`,
        },
      ],
      practicalTask: {
        scenario:
          "A client wants a multi-step registration form with validation and data persistence across steps. The form has: Step 1 (Name, Email), Step 2 (Address, Phone), Step 3 (Review & Submit). Data should not be lost when navigating between steps.",
        task: "Create a MultiStepForm component that: (1) manages form state across steps using useState, (2) validates each step before allowing navigation to the next, (3) shows error messages per field, (4) has a review step displaying all entered data, (5) handles final submission (prevent default + log data). Use controlled components.",
        solutionCode: `import { useState } from 'react';

function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.includes('@')) errs.email = 'Valid email is required';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.address.trim()) errs.address = 'Address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.zip.trim()) errs.zip = 'ZIP code is required';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    return errs;
  };

  const handleNext = () => {
    const validationErrors = step === 1 ? validateStep1() : validateStep2();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration submitted:', formData);
    alert('Registration submitted successfully! (Check console)');
  };

  const renderField = (name, label, type = 'text') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: errors[name] ? '2px solid #e74c3c' : '1px solid #ddd',
          borderRadius: 4,
          fontSize: 14,
          boxSizing: 'border-box'
        }}
      />
      {errors[name] && (
        <span style={{ color: '#e74c3c', fontSize: 12 }}>{errors[name]}</span>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: step >= s ? '#3498db' : '#eee',
            color: step >= s ? '#fff' : '#999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: 14
          }}>
            {s}
          </div>
        ))}
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div>
          <h3>Personal Information</h3>
          {renderField('firstName', 'First Name')}
          {renderField('lastName', 'Last Name')}
          {renderField('email', 'Email', 'email')}
        </div>
      )}

      {/* Step 2: Contact Info */}
      {step === 2 && (
        <div>
          <h3>Contact Information</h3>
          {renderField('address', 'Address')}
          {renderField('city', 'City')}
          {renderField('zip', 'ZIP Code')}
          {renderField('phone', 'Phone', 'tel')}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div>
          <h3>Review Your Information</h3>
          <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
            <h4>Personal</h4>
            <p>{formData.firstName} {formData.lastName}</p>
            <p>{formData.email}</p>
            <h4>Contact</h4>
            <p>{formData.address}</p>
            <p>{formData.city}, {formData.zip}</p>
            <p>{formData.phone}</p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        {step > 1 ? (
          <button type="button" onClick={handlePrev} style={{
            padding: '10px 24px',
            background: '#95a5a6',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Previous
          </button>
        ) : <div />}

        {step < 3 ? (
          <button type="button" onClick={handleNext} style={{
            padding: '10px 24px',
            background: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer'
          }}>
            Next
          </button>
        ) : (
          <button type="submit" style={{
            padding: '10px 24px',
            background: '#2ecc71',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            Submit Registration
          </button>
        )}
      </div>
    </form>
  );
}`,
      },
    },

    // ==================== TOPIC 7: Conditional Rendering & Lists ====================
    {
      slug: "conditional-rendering-lists",
      title: "7. Conditional Rendering & Lists",
      order: 7,
      content: `
# Conditional Rendering & Lists

## Conditional Rendering Techniques

### 1. Ternary Operator (if/else)

\`\`\`jsx
function UserGreeting({ user }) {
  return (
    <div>
      {user ? (
        <Welcome name={user.name} />
      ) : (
        <LoginPrompt />
      )}
    </div>
  );
}
\`\`\`

### 2. Logical AND (&&) — render or nothing

\`\`\`jsx
function NotificationBadge({ count }) {
  return (
    <span className="badge">
      {count > 0 && <span className="count">{count}</span>}
    </span>
  );
}
\`\`\`

⚠ **Gotcha**: \`0 && <Component/>\` renders the number \`0\` (because \`0\` is a valid React node). Always make the condition boolean:

\`\`\`jsx
{count > 0 && <Component/>}  // ✅ safe
{!!count && <Component/>}     // ✅ also safe
{count && <Component/>}       // ❌ renders 0 if count is 0
\`\`\`

### 3. Early return (guard clause)

\`\`\`jsx
function Dashboard({ user, data }) {
  if (!user) return <LoginPage />;
  if (!data) return <LoadingSpinner />;
  if (data.length === 0) return <EmptyState />;
  
  return <DataTable data={data} />;
}
\`\`\`

### 4. Switch / Multiple conditions

\`\`\`jsx
function StatusBadge({ status }) {
  const statusConfig = {
    active: { label: 'Active', color: 'green' },
    pending: { label: 'Pending', color: 'orange' },
    suspended: { label: 'Suspended', color: 'red' },
    archived: { label: 'Archived', color: 'gray' }
  };

  const config = statusConfig[status] || { label: 'Unknown', color: '#999' };
  
  return (
    <span style={{ color: config.color, fontWeight: 600 }}>
      {config.label}
    </span>
  );
}
\`\`\`

## Rendering Lists

\`\`\`jsx
function TaskList({ tasks, onToggle, onDelete }) {
  if (tasks.length === 0) {
    return <EmptyState message="No tasks yet. Add one above!" />;
  }

  return (
    <ul className="task-list">
      {tasks
        .filter(task => !task.archived) // Transform before rendering
        .sort((a, b) => a.priority - b.priority)
        .map(task => (
          <li key={task.id} className={\`task \${task.completed ? 'completed' : ''}\`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
            />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => onDelete(task.id)}>🗑</button>
          </li>
        ))}
    </ul>
  );
}
\`\`\`

## Filtering & Sorting Lists

\`\`\`jsx
function FilterableList({ items }) {
  const [filter, setFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  // Derived state — computed from existing state, not stored separately
  const filteredItems = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
      .sort((a, b) => 
        sortOrder === 'asc' 
          ? a.name.localeCompare(b.name) 
          : b.name.localeCompare(a.name)
      );
  }, [items, filter, sortOrder]);

  return (
    <div>
      <input
        placeholder="Filter..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <button onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}>
        Sort: {sortOrder}
      </button>
      
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
\`\`\`

## Key Rules & Best Practices

1. **Keys must be stable and unique** among siblings.
2. **Don't use index as key** if the list can be reordered, filtered, or items can be inserted/deleted.
3. **Keys only need to be unique within their parent**, not globally.
4. **Don't generate keys on the fly** (e.g., \`key={Math.random()}\`) — this destroys and recreates DOM nodes on every render.
`,
      interviewQuestions: [
        {
          question:
            "Compare and contrast different conditional rendering approaches in React.",
          answer: `1. **Ternary (\`condition ? A : B\`)**: Best for if/else. Readable for simple conditions. Can become nested and hard to read.
2. **Logical AND (\`condition && A\`)**: Good for "render something or nothing". Watch out for falsy values like \`0\`.
3. **Early return**: Best for guards/loading/error states at the top of a component. Keeps the main render clean.
4. **IIFE (\`{(() => { ... })()}\`)**: For complex branching logic. Can be hard to read — consider extracting a helper component.
5. **Switch/map object**: Good for multiple known states. Clean and declarative.
6. **Conditional styles/classes**: Sometimes you render the same element but change its appearance instead of rendering different elements.

**Rule of thumb**: If the condition is simple, use ternary or &&. If it's complex, extract into a separate component.`,
        },
        {
          question:
            "Why is using array index as key problematic in React lists?",
          answer: `Using the array \`index\` as a key can cause bugs when the list changes because React uses keys to **identify elements across renders**.

Problems:
1. **Insertion at beginning**: If you prepend an item, all existing items get new indices, causing React to re-render them all (or worse, reuse wrong DOM nodes).
2. **Reordering**: When sorting, indices shift, leading to incorrect state preservation (e.g., input values in a list might jump between items).
3. **Deletion**: Removing an item from the middle shifts all subsequent indices.

**When is index acceptable?** Only for static lists that never change (no add/remove/reorder), or when items have no stable ID.

**Best practice**: Use a unique database ID, UUID, or a combination of fields that uniquely identifies the item.`,
        },
        {
          question: "What is derived state and when should you use it?",
          answer: `Derived state is data that is **computed from existing state or props** rather than stored separately. Instead of:

\`\`\`jsx
// ❌ Redundant state
const [items, setItems] = useState([]);
const [filteredItems, setFilteredItems] = useState([]); // Derived!
const [itemCount, setItemCount] = useState(0); // Derived!
\`\`\`

You compute it on the fly:

\`\`\`jsx
// ✅ Derived during render (optionally memoized)
const filteredItems = useMemo(
  () => items.filter(item => item.name.includes(filter)),
  [items, filter]
);
const itemCount = items.length; // Simple computation
\`\`\`

Benefits:
- **Single source of truth** — no risk of derived state getting out of sync.
- **Less code** — no need to update multiple states when one changes.
- **Simpler mental model** — fewer state variables to reason about.

Use \`useMemo\` for expensive computations to avoid recalculating on every render.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a project management dashboard with a task board. Tasks have different statuses (todo, in-progress, review, done) and priorities (high, medium, low). Users should be able to filter by status, sort by priority, and see task counts.",
        task: "Create a TaskBoard component that: (1) receives a list of tasks (id, title, status, priority), (2) shows filter buttons for each status (with counts), (3) sorts tasks by priority within each status, (4) allows toggling between sort orders, (5) uses early return for empty states, (6) renders a visual priority badge. Use derived state — don't store filtered/sorted data as separate state.",
        solutionCode: `import { useState, useMemo } from 'react';

function TaskBoard({ tasks = [] }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'title'
  const [sortOrder, setSortOrder] = useState('asc');

  const statuses = ['todo', 'in-progress', 'review', 'done'];
  const priorityOrder = { high: 3, medium: 2, low: 1 };

  // Derived: count tasks per status
  const statusCounts = useMemo(() => {
    const counts = { all: tasks.length };
    statuses.forEach(s => {
      counts[s] = tasks.filter(t => t.status === s).length;
    });
    return counts;
  }, [tasks]);

  // Derived: filtered + sorted tasks
  const visibleTasks = useMemo(() => {
    let filtered = statusFilter === 'all'
      ? [...tasks]
      : tasks.filter(t => t.status === statusFilter);

    filtered.sort((a, b) => {
      let comparison;
      if (sortBy === 'priority') {
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      } else {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [tasks, statusFilter, sortBy, sortOrder]);

  // Priority badge colors
  const priorityColors = {
    high: { bg: '#fde8e8', text: '#e74c3c' },
    medium: { bg: '#fef3cd', text: '#856404' },
    low: { bg: '#d1e7dd', text: '#0f5132' }
  };

  // Early returns for empty states
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>
        <h2>📋 Task Board</h2>
        <p>No tasks yet. Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2>📋 Task Board</h2>

      {/* Status Filter Buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', ...statuses].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              border: statusFilter === status ? '2px solid #3498db' : '1px solid #ddd',
              background: statusFilter === status ? '#ebf5fb' : '#fff',
              cursor: 'pointer',
              fontWeight: statusFilter === status ? 600 : 400
            }}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            {' '}
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              ({statusCounts[status]})
            </span>
          </button>
        ))}
      </div>

      {/* Sort Controls */}
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 14 }}>Sort by:</span>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16 }}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
        <span style={{ fontSize: 13, color: '#888' }}>
          {visibleTasks.length} task{visibleTasks.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Task List */}
      {visibleTasks.length === 0 ? (
        <p style={{ color: '#888', padding: 20, textAlign: 'center' }}>
          No {statusFilter !== 'all' ? statusFilter : ''} tasks found.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {visibleTasks.map(task => {
            const colors = priorityColors[task.priority];
            return (
              <li key={task.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                border: '1px solid #eee',
                borderRadius: 8,
                marginBottom: 8,
                background: '#fff'
              }}>
                <div>
                  <strong>{task.title}</strong>
                  <span style={{
                    display: 'inline-block',
                    marginLeft: 12,
                    padding: '2px 10px',
                    borderRadius: 12,
                    fontSize: 12,
                    background: colors.bg,
                    color: colors.text,
                    fontWeight: 600
                  }}>
                    {task.priority}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: 4,
                  fontSize: 13,
                  background: statusFilter === 'all'
                    ? (task.status === 'done' ? '#d1e7dd' : '#f8f9fa')
                    : 'transparent',
                  color: statusFilter === 'all' ? undefined : '#666'
                }}>
                  {task.status}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Sample usage data
const sampleTasks = [
  { id: 1, title: 'Set up CI/CD pipeline', status: 'in-progress', priority: 'high' },
  { id: 2, title: 'Write unit tests for auth', status: 'todo', priority: 'high' },
  { id: 3, title: 'Update README documentation', status: 'done', priority: 'low' },
  { id: 4, title: 'Fix navigation bug on mobile', status: 'review', priority: 'medium' },
  { id: 5, title: 'Add dark mode support', status: 'todo', priority: 'medium' },
];`,
      },
    },

    // ==================== TOPIC 8: Component Communication ====================
    {
      slug: "component-communication",
      title: "8. Component Communication Patterns",
      order: 8,
      content: `
# Component Communication Patterns

## 1. Parent → Child (via Props)

The most straightforward communication — pass data down as props:

\`\`\`jsx
function Parent() {
  const user = { name: 'Alice', role: 'admin' };
  return <Child user={user} onAction={handleAction} />;
}
\`\`\`

## 2. Child → Parent (via Callback Props)

A child communicates up by calling a function passed from the parent:

\`\`\`jsx
function Parent() {
  const [items, setItems] = useState([]);

  const handleAddItem = (newItem) => {
    setItems(prev => [...prev, newItem]);
  };

  return (
    <div>
      <AddItemForm onAdd={handleAddItem} />
      <ItemList items={items} />
    </div>
  );
}

function AddItemForm({ onAdd }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd({ id: Date.now(), text });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}
\`\`\`

## 3. Sibling Communication (via Lifting State Up)

When siblings need to share state, **lift the state up** to the nearest common ancestor:

\`\`\`jsx
function App() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div>
      <ItemList onSelect={setSelectedItem} />
      <ItemDetail item={selectedItem} />
    </div>
  );
}
\`\`\`

## 4. Deep Communication (via Context)

When many components need the same data across multiple levels, use Context:

\`\`\`jsx
const ThemeContext = React.createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
      <Content />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
\`\`\`

## 5. Cross-Component Communication (via State Management)

For complex global state, use external libraries like Zustand, Redux, or Jotai:

\`\`\`jsx
// Zustand example
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  notifications: [],
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
  addNotification: (note) => set(state => ({
    notifications: [...state.notifications, note]
  }))
}));

// Any component in the app
function NotificationBell() {
  const notifications = useStore(state => state.notifications);
  return <span>{notifications.length} unread</span>;
}
\`\`\`

## 6. Imperative Communication (via useImperativeHandle)

For rare cases where a parent needs to call methods on a child:

\`\`\`jsx
const Child = forwardRef((props, ref) => {
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
    getValue: () => inputRef.current.value
  }));

  return <input ref={inputRef} />;
});

function Parent() {
  const childRef = useRef(null);

  return (
    <div>
      <Child ref={childRef} />
      <button onClick={() => childRef.current.focus()}>Focus Input</button>
      <button onClick={() => alert(childRef.current.getValue())}>Get Value</button>
    </div>
  );
}
\`\`\`

## Choosing the Right Pattern

| Situation | Pattern |
|-----------|---------|
| Direct parent-child | Props (down) / Callbacks (up) |
| Siblings | Lift state up |
| Deep tree with many levels | Context |
| Global state (auth, theme, cart) | State management library |
| Timer, ref, imperative actions | useRef / useImperativeHandle |
`,
      interviewQuestions: [
        {
          question: "What is prop drilling and what are the ways to avoid it?",
          answer: `**Prop drilling** is passing data through multiple intermediate components that don't need it, just to reach a deeply nested component. It makes code harder to maintain and refactor.

Solutions:
1. **Context API**: Provides data to the entire subtree without explicit prop passing.
2. **Component composition**: Use the \`children\` prop or pass components as props to avoid threading props through layers.
3. **State management libraries** (Zustand, Redux, Jotai): For truly global state.
4. **Custom hooks with context**: Encapsulate context usage in a custom hook for clean consumption.

However, prop drilling isn't always bad — for 1-2 levels of depth, explicit props make data flow clear and easy to trace.`,
        },
        {
          question:
            "How do you communicate between sibling components in React?",
          answer: `Siblings communicate through their **nearest common parent** (lifting state up):

1. The parent holds the shared state.
2. One sibling calls a callback (passed via prop) to update the state.
3. The other sibling receives the updated state via its props.
4. The parent re-renders and both siblings get the new values.

\`\`\`jsx
function Parent() {
  const [selected, setSelected] = useState(null);
  return (
    <div>
      <List onSelect={setSelected} />  {/* Sends data up */}
      <Detail item={selected} />       {/* Receives data via parent */}
    </div>
  );
}
\`\`\`

If siblings are far apart in the tree, consider Context or a state management library instead of lifting state up through many intermediate components.`,
        },
        {
          question:
            "Explain the concept of 'lifting state up' with an example.",
          answer: `**Lifting state up** means moving shared state from child components to their closest common ancestor. This enables siblings to share and synchronize data.

For example, two components: a temperature input and a temperature display. When the input changes, the display should update:

\`\`\`jsx
function TemperatureCalculator() {
  const [celsius, setCelsius] = useState(0);

  return (
    <div>
      <TempInput value={celsius} onChange={setCelsius} />
      <TempDisplay celsius={celsius} />
    </div>
  );
}

function TempInput({ value, onChange }) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
    />
  );
}

function TempDisplay({ celsius }) {
  const fahrenheit = (celsius * 9/5) + 32;
  return <p>{celsius}°C = {fahrenheit}°F</p>;
}
\`\`\`

The state lives in the parent (\`TemperatureCalculator\`), and both children receive what they need via props.`,
        },
        {
          question:
            "When would you use useImperativeHandle and what are its risks?",
          answer: `\`useImperativeHandle\` is used with \`forwardRef\` to expose custom imperative methods from a child component to its parent. Use it when:

1. You need to call a method on a child (e.g., \`focus()\`, \`reset()\`, \`scrollToTop()\`).
2. Integrating with imperative third-party libraries.
3. Animations or media playback controls.

**Risks:**
- Breaks React's declarative paradigm — prefer props and state.
- Creates tight coupling between parent and child.
- Harder to test and reason about.
- Can lead to unexpected side effects.

**Best practice**: Expose the minimum imperative surface. Most needs can be solved declaratively with state and effects.`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building a tabbed interface with three panels. The tabs need to: (1) highlight the active tab, (2) show the correct panel content, (3) allow a parent component to programmatically switch tabs (e.g., via an external button). Additionally, one tab contains a form that needs to communicate data back to the parent.",
        task: "Create a Tabs component system with: (1) TabsContainer (holds state, manages active tab), (2) Tab (individual tab button), (3) TabPanel (content area). The parent should be able to set the active tab via a ref (useImperativeHandle). One tab panel should have a form that communicates data back to the parent. Use lifting state up and callbacks.",
        solutionCode: `import { useState, forwardRef, useImperativeHandle } from 'react';

// Tab Panel
function TabPanel({ children, isActive, id }) {
  if (!isActive) return null;
  return (
    <div role="tabpanel" id={id} style={{ padding: 20, border: '1px solid #ddd', borderRadius: '0 8px 8px 8px' }}>
      {children}
    </div>
  );
}

// Tab Button
function Tab({ label, isActive, onClick }) {
  return (
    <button
      role="tab"
      onClick={onClick}
      style={{
        padding: '10px 24px',
        border: isActive ? '1px solid #ddd' : '1px solid transparent',
        borderBottom: isActive ? '1px solid #fff' : '1px solid #ddd',
        background: isActive ? '#fff' : '#f8f9fa',
        cursor: 'pointer',
        fontWeight: isActive ? 600 : 400,
        borderRadius: '8px 8px 0 0',
        marginBottom: -1,
        position: 'relative'
      }}
    >
      {label}
    </button>
  );
}

// Tabs Container
const TabsContainer = forwardRef(({ children, tabLabels, initialTab = 0, onTabChange }, ref) => {
  const [activeIndex, setActiveIndex] = useState(initialTab);

  // Expose programmatic control to parent
  useImperativeHandle(ref, () => ({
    switchToTab: (index) => {
      if (index >= 0 && index < tabLabels.length) {
        setActiveIndex(index);
        onTabChange?.(index);
      }
    },
    getActiveIndex: () => activeIndex
  }));

  const handleTabClick = (index) => {
    setActiveIndex(index);
    onTabChange?.(index);
  };

  return (
    <div>
      <div role="tablist" style={{ display: 'flex', gap: 4 }}>
        {tabLabels.map((label, i) => (
          <Tab
            key={i}
            label={label}
            isActive={activeIndex === i}
            onClick={() => handleTabClick(i)}
          />
        ))}
      </div>
      {children.map((child, i) => (
        <TabPanel key={i} isActive={activeIndex === i} id={\`tabpanel-\${i}\`}>
          {child}
        </TabPanel>
      ))}
    </div>
  );
});

TabsContainer.displayName = 'TabsContainer';

// Parent Component
function Dashboard() {
  const tabsRef = useRef(null);
  const [userNotes, setUserNotes] = useState('');

  const handleFormData = (data) => {
    console.log('Received from form tab:', data);
    setUserNotes(data);
    // Automatically switch to overview tab after form submission
    tabsRef.current?.switchToTab(0);
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => tabsRef.current?.switchToTab(0)}>
          Go to Overview
        </button>
        <button onClick={() => tabsRef.current?.switchToTab(1)}>
          Go to Notes
        </button>
        <button onClick={() => tabsRef.current?.switchToTab(2)}>
          Go to Settings
        </button>
        <span style={{ marginLeft: 12, fontSize: 13, color: '#888' }}>
          Active: Tab {tabsRef.current?.getActiveIndex() ?? 0}
        </span>
      </div>

      <TabsContainer
        ref={tabsRef}
        tabLabels={['Overview', 'Notes', 'Settings']}
        onTabChange={(index) => console.log('Switched to tab:', index)}
      >
        {/* Tab 0: Overview */}
        <div>
          <h3>Dashboard Overview</h3>
          {userNotes ? (
            <p>Your latest note: <em>{userNotes}</em></p>
          ) : (
            <p>No notes yet. Go to the Notes tab to add one.</p>
          )}
        </div>

        {/* Tab 1: Notes Form */}
        <NotesForm onSubmit={handleFormData} />

        {/* Tab 2: Settings */}
        <div>
          <h3>Settings</h3>
          <p>Application preferences and configuration options would go here.</p>
        </div>
      </TabsContainer>
    </div>
  );
}

// Notes Form (sends data back to parent)
function NotesForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text, category, timestamp: new Date().toISOString() });
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Note</h3>
      <div style={{ marginBottom: 12 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your note..."
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ddd', boxSizing: 'border-box' }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Category: </label>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="general">General</option>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
        </select>
      </div>
      <button type="submit" style={{ padding: '8px 24px', background: '#3498db', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        Save Note (switches to Overview)
      </button>
    </form>
  );
}`,
      },
    },

    // ==================== TOPIC 9: useRef ====================
    {
      slug: "useref-hook",
      title: "9. useRef — Referencing Values",
      order: 9,
      content: `
# useRef — Referencing Values Without Re-renders

## What is useRef?

\`useRef\` returns a mutable ref object whose \`.current\` property persists across renders **without causing re-renders** when it changes.

\`\`\`jsx
import { useRef } from 'react';

function Timer() {
  const intervalRef = useRef(null);
  // intervalRef.current persists between renders
  // Changing intervalRef.current does NOT trigger a re-render
}
\`\`\`

## Common Use Cases

### 1. Accessing DOM Elements

\`\`\`jsx
function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // Auto-focus on mount
    inputRef.current.focus();
  }, []);

  const handleFocusClick = () => {
    inputRef.current.focus();
    inputRef.current.style.borderColor = '#3498db';
  };

  return (
    <div>
      <input ref={inputRef} type="text" placeholder="I'm auto-focused" />
      <button onClick={handleFocusClick}>Focus Input</button>
    </div>
  );
}
\`\`\`

### 2. Storing Mutable Values (without re-renders)

\`\`\`jsx
function Stopwatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const start = () => {
    startTimeRef.current = Date.now() - time;
    intervalRef.current = setInterval(() => {
      setTime(Date.now() - startTimeRef.current);
    }, 10);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <p>{time}ms</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
\`\`\`

### 3. Tracking Previous Values

\`\`\`jsx
function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current; // Returns previous value (before the effect runs)
}

// Usage
function Counter() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Now: {count}, Before: {prevCount}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
\`\`\`

### 4. Solving Closure Issues

\`\`\`jsx
function AutoIncrement() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  // Keep ref in sync with state
  useEffect(() => {
    countRef.current = count;
  }, [count]);

  useEffect(() => {
    const interval = setInterval(() => {
      // ❌ This would capture stale 'count'
      // setCount(count + 1);

      // ✅ Functional update works
      setCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []); // No dependency on count!

  return <p>Count: {count}</p>;
}
\`\`\`

## useRef vs useState

| Aspect | useRef | useState |
|--------|-------|----------|
| Re-renders on change | ❌ No | ✅ Yes |
| Mutability | Mutable (\`.current\`) | Immutable (use setter) |
| Persists across renders | ✅ Yes | ✅ Yes |
| Used for | DOM refs, mutable values, intervals | UI state, dynamic data |
| Access timing | Synchronous, immediate | Asynchronous, after render |
`,
      interviewQuestions: [
        {
          question:
            "What is the difference between useRef and useState? When would you use each?",
          answer: `**useRef** returns a mutable object that persists across renders but **does not trigger re-renders** when changed. **useState** returns a state variable and setter; changing state **triggers a re-render**.

Use \`useRef\` when:
- Accessing or manipulating DOM elements directly.
- Storing interval/timeout IDs for cleanup.
- Keeping mutable values that don't affect UI (e.g., tracking previous values, scroll positions).
- Solving closure issues in callbacks/effects without adding dependencies.

Use \`useState\` when:
- The value should appear in the UI.
- Changing the value should trigger a component re-render.
- The value is part of the component's "public" state.`,
        },
        {
          question: "How do you use refs to access DOM elements in React?",
          answer: `\`\`\`jsx
import { useRef, useEffect } from 'react';

function Example() {
  const elementRef = useRef(null);

  useEffect(() => {
    // Access the DOM node after render
    elementRef.current.focus();
  }, []);

  return <input ref={elementRef} />;
}
\`\`\`

The \`ref\` attribute on a JSX element (like \`<input>\`) tells React to set \`ref.current\` to the corresponding DOM node. This happens after the component renders and before effects run. For class components, you can also attach refs to instances, and for function components, you need \`forwardRef\` to pass refs down.`,
        },
        {
          question: "How do refs help solve closure issues in React?",
          answer: `Closures in event handlers or async callbacks capture the value of state variables **at the time the closure was created**. If the component re-renders before the closure executes, it still has the old ("stale") value.

A ref solves this because it **holds a mutable reference** to the value. You can update the ref in a \`useEffect\` whenever the state changes, and the closure always reads the latest \`ref.current\`:

\`\`\`jsx
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count; // Keep ref in sync
}, [count]);

// Now any closure can read countRef.current and get the latest value
\`\`\`

Alternatively, functional state updates (\`setCount(prev => prev + 1)\`) solve many closure issues without refs.`,
        },
        {
          question: "What is forwardRef and when is it needed?",
          answer: `\`forwardRef\` is a React function that lets a component **forward a ref** passed from its parent to a child DOM element. It's needed because function components don't expose instances like class components, so you can't put a \`ref\` attribute on a custom component directly.

\`\`\`jsx
const FancyInput = forwardRef((props, ref) => {
  return <input ref={ref} className="fancy-input" {...props} />;
});

// Parent
function Parent() {
  const ref = useRef(null);
  useEffect(() => { ref.current.focus(); }, []);
  return <FancyInput ref={ref} />;
}
\`\`\`

Common use cases: reusable input/form components, integrating with third-party DOM libraries, and scroll-to sections.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a video player with custom controls (play/pause, progress bar, volume, fullscreen). The player should: (1) auto-play a video on mount, (2) show a progress bar that updates in real-time, (3) allow seeking by clicking on the progress bar, (4) display current time / duration, (5) clean up on unmount.",
        task: "Create a VideoPlayer component that uses multiple refs: one for the video element, one for the progress bar container, and one for the animation frame request. Track playback state (playing, time) with useState, but use refs for direct DOM manipulation of the video and progress updates for performance.",
        solutionCode: `import { useState, useRef, useEffect, useCallback } from 'react';

function VideoPlayer({ src }) {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Format time helper
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return \`\${m}:\${s.toString().padStart(2, '0')}\`;
  };

  // Update progress using requestAnimationFrame (smoother than setInterval)
  const updateProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.paused) return;

    setCurrentTime(video.currentTime);

    // Update progress bar directly for performance
    if (progressRef.current && video.duration) {
      const percent = (video.currentTime / video.duration) * 100;
      progressRef.current.style.width = \`\${percent}%\`;
    }

    rafRef.current = requestAnimationFrame(updateProgress);
  }, []);

  // Play/Pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      video.pause();
      setIsPlaying(false);
      cancelAnimationFrame(rafRef.current);
    }
  };

  // Seeking via progress bar click
  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const bar = e.currentTarget;
    if (!video || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = clickX / rect.width;
    const seekTime = percent * video.duration;

    video.currentTime = seekTime;
    setCurrentTime(seekTime);
    if (progressRef.current) {
      progressRef.current.style.width = \`\${percent * 100}%\`;
    }
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const val = Number(e.target.value);
    if (video) {
      video.volume = val;
      setVolume(val);
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  // Load metadata
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
        videoRef.current.load();
      }
    };
  }, []);

  return (
    <div style={{
      maxWidth: 640,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      background: '#000'
    }}>
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        style={{ width: '100%', display: 'block' }}
        onClick={togglePlay}
      />

      {/* Custom Controls */}
      <div style={{
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }}>
        {/* Progress Bar */}
        <div
          onClick={handleProgressClick}
          style={{
            width: '100%',
            height: 6,
            background: '#444',
            borderRadius: 3,
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <div
            ref={progressRef}
            style={{
              height: '100%',
              background: '#3498db',
              borderRadius: 3,
              width: '0%',
              transition: 'width 0.1s linear'
            }}
          />
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff' }}>
          <button onClick={togglePlay} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 18 }}>
            {isPlaying ? '⏸' : '▶'}
          </button>

          <span style={{ fontSize: 13, fontFamily: 'monospace' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div style={{ flex: 1 }} />

          {/* Volume */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: 80 }}
          />

          <button onClick={toggleFullscreen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', fontSize: 16 }}>
            ⛶
          </button>
        </div>
      </div>
    </div>
  );
}

// Usage
<VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />`,
      },
    },

    // ==================== TOPIC 10: Custom Hooks ====================
    {
      slug: "custom-hooks",
      title: "10. Custom Hooks — Reusing Logic",
      order: 10,
      content: `
# Custom Hooks — Extracting Reusable Logic

## What is a Custom Hook?

A **custom hook** is a JavaScript function whose name starts with \`use\` and that may call other hooks. It lets you extract component logic into reusable functions.

## Rules for Custom Hooks

1. **Name starts with \`use\`** — this is how React identifies them as hooks.
2. **Call hooks at the top level** — just like built-in hooks.
3. **Return values the component needs** — state, functions, refs, etc.
4. **Each call creates isolated state** — instances don't share state.

## Example Library of Custom Hooks

### 1. useLocalStorage

\`\`\`jsx
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage "\${key}":\`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(\`Error setting localStorage "\${key}":\`, error);
    }
  };

  return [storedValue, setValue];
}
\`\`\`

### 2. useDebounce

\`\`\`jsx
import { useState, useEffect } from 'react';

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Only fetch when debouncedSearch changes (not on every keystroke)
  useEffect(() => {
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={e => setSearch(e.target.value)} />;
}
\`\`\`

### 3. useFetch

\`\`\`jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const result = await response.json();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
\`\`\`

### 4. useMediaQuery

\`\`\`jsx
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

// Usage
function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isDarkPreferred = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
      {isDarkPreferred ? <DarkTheme /> : <LightTheme />}
    </div>
  );
}
\`\`\`

### 5. useToggle

\`\`\`jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return { value, toggle, setTrue, setFalse };
}

// Usage
function Accordion() {
  const { value: isOpen, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>{isOpen ? 'Hide' : 'Show'}</button>
      {isOpen && <Content />}
    </div>
  );
}
\`\`\`

## Composing Hooks

Custom hooks can call other custom hooks — this is how you build complex logic from simple building blocks:

\`\`\`jsx
function useUserData(userId) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);
  const [preferences, setPreferences] = useLocalStorage(\`user-\${userId}-prefs\`, { theme: 'light' });

  return { user, loading, error, preferences, setPreferences };
}
\`\`\`

## When NOT to Use Custom Hooks

- For simple one-liners — just write the code inline.
- When the logic is used in only one component.
- When the abstraction makes the code harder to follow.
- For UI rendering — custom hooks should extract **logic**, not JSX.
`,
      interviewQuestions: [
        {
          question: "What are custom hooks and what problem do they solve?",
          answer: `Custom hooks are JavaScript functions that reuse **stateful logic** across components. They solve the problem of code duplication when different components need the same behavior (like fetching data, tracking window size, or managing localStorage).

Before hooks, this logic was duplicated across lifecycle methods in class components or required higher-order components (HOCs) and render props, which led to "wrapper hell." Custom hooks encapsulate this logic in a clean, composable way.

They are not a way to share UI — they share **behavioral logic**. The naming convention (\`useXxx\`) is important because it tells React to apply hook rules to the function.`,
        },
        {
          question: "What are the rules for creating custom hooks?",
          answer: `1. **Name must start with \`use\`** (e.g., \`useLocalStorage\`, \`useDebounce\`). This is how React lint rules know to check for hook rules inside.
2. **Call other hooks inside** — custom hooks are just functions that use useState, useEffect, etc.
3. **Don't call hooks conditionally** — hooks must be called in the same order every render (same rule as built-in hooks).
4. **Return only what's needed** — return an array (for flexible naming) or an object (for named returns). Prefer returning objects for hooks with many values.
5. **Each call is isolated** — calling a custom hook multiple times in one component creates independent state instances.

\`\`\`jsx
// ✅ Good
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return size;
}
\`\`\``,
        },
        {
          question:
            "How do custom hooks compose? Can a custom hook call another custom hook?",
          answer: `Yes! Custom hooks can call other custom hooks, just like components call hooks. This is the **composition** model of hooks — you build complex behavior from simpler hooks.

For example, \`useUserProfile\` might compose \`useFetch\`, \`useLocalStorage\`, and \`useMediaQuery\`:

\`\`\`jsx
function useUserProfile(userId) {
  const { data, loading, error } = useFetch(\`/api/users/\${userId}\`);
  const [prefs, setPrefs] = useLocalStorage(\`prefs-\${userId}\`, {});
  const isMobile = useMediaQuery('(max-width: 768px)');

  return { user: data, loading, error, prefs, setPrefs, isMobile };
}
\`\`\`

This composition is powerful because each hook is independently testable, reusable, and encapsulates its own cleanup logic.`,
        },
        {
          question:
            "What is the difference between a custom hook and a utility function?",
          answer: `**Utility functions** take inputs, compute something, and return a value. They are **stateless** — no state, no effects, no lifecycle. Example: \`formatDate(date)\`, \`capitalize(str)\`.

**Custom hooks** can have **state and side effects** because they call React hooks internally. Example: \`useFetch(url)\` manages loading/error/data states and may have cleanup logic.

When to use each:
- If your logic needs useState, useEffect, useRef, etc. → custom hook.
- If your logic is pure computation → utility function.
- If your logic accesses React context → custom hook.
- If your logic needs cleanup (event listeners, subscriptions) → custom hook.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a dashboard that displays real-time cryptocurrency prices. The requirements include: (1) fetching initial data, (2) polling every 5 seconds for updates, (3) auto-pausing when the tab is hidden (using visibility API), (4) tracking if the data is stale, (5) providing manual refresh. This logic should be reused across multiple dashboard widgets.",
        task: "Create a custom hook called usePollingEffect that handles all polling logic: takes a callback and an interval, pauses on hidden tab, returns { data, loading, error, isStale, refresh }. Then create an IntervalFetch component that demonstrates using this hook to fetch mock data.",
        solutionCode: `import { useState, useEffect, useRef, useCallback } from 'react';

// ========== Custom Hook: usePollingEffect ==========
function usePollingEffect(fetchFn, intervalMs = 5000, options = {}) {
  const { enabled = true, onError } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef(null);
  const fetchFnRef = useRef(fetchFn);

  // Keep fetchFn reference fresh without restarting interval
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  // Single fetch function
  const executeFetch = useCallback(async () => {
    try {
      const result = await fetchFnRef.current();
      setData(result);
      setError(null);
      setIsStale(false);
    } catch (err) {
      setError(err.message || 'Fetch failed');
      onError?.(err);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  // Initial fetch + polling
  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;

    // Initial fetch
    executeFetch();

    // Set up polling
    intervalRef.current = setInterval(() => {
      if (document.hidden) {
        setIsStale(true);
        return;
      }
      if (isMounted) {
        setIsStale(false);
        executeFetch();
      }
    }, intervalMs);

    // Pause polling when tab is hidden
    const handleVisibilityChange = () => {
      if (!document.hidden && isMounted) {
        setIsStale(false);
        executeFetch();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [intervalMs, enabled, executeFetch]);

  // Manual refresh
  const refresh = useCallback(async () => {
    setLoading(true);
    await executeFetch();
  }, [executeFetch]);

  return { data, loading, error, isStale, refresh };
}

// ========== Usage Component ==========
// Simulated API
const fetchCryptoPrices = async () => {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 800));

  // Simulate occasional errors
  if (Math.random() < 0.1) throw new Error('Rate limit exceeded');

  return {
    bitcoin: 42000 + Math.random() * 2000,
    ethereum: 2200 + Math.random() * 200,
    solana: 98 + Math.random() * 12,
    timestamp: new Date().toLocaleTimeString()
  };
};

function CryptoDashboard() {
  const {
    data,
    loading,
    error,
    isStale,
    refresh
  } = usePollingEffect(fetchCryptoPrices, 3000, {
    onError: (err) => console.warn('Polling error:', err)
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  if (loading && !data) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
        <p>Loading crypto prices...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div style={{ padding: 20, textAlign: 'center', color: '#e74c3c' }}>
        <p>Error: {error}</p>
        <button onClick={refresh} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>🚀 Crypto Prices</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isStale && (
            <span style={{ fontSize: 12, padding: '2px 8px', background: '#fef3cd', borderRadius: 4, color: '#856404' }}>
              Tab hidden — prices paused
            </span>
          )}
          <button onClick={refresh} disabled={loading} style={{ padding: '6px 12px', cursor: 'pointer' }}>
            {loading ? '⟳' : '↻ Refresh'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(data || {}).filter(([key]) => key !== 'timestamp').map(([coin, price]) => (
          <div key={coin} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '12px 16px',
            border: '1px solid #eee',
            borderRadius: 8,
            background: '#fff'
          }}>
            <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{coin}</span>
            <span style={{ fontFamily: 'monospace', color: price > 0 ? '#2ecc71' : '#e74c3c' }}>
              {formatPrice(price)}
            </span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: '#888', textAlign: 'center', marginTop: 12 }}>
        Last updated: {data?.timestamp || 'N/A'} · Polling every 3s
      </p>
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 11: useContext & Context API ====================
    {
      slug: "context-api-deep",
      title: "11. Context API & useContext",
      order: 11,
      content: `
# Context API & useContext

## The Problem Context Solves

Without Context, passing data from a top-level component to a deeply nested child requires **prop drilling** — threading props through every intermediate component, even those that don't use the data:

\`\`\`jsx
// ❌ Prop drilling: Theme must pass through every level
function App({ theme }) {
  return <Header theme={theme} />;
}
function Header({ theme }) {
  return <NavBar theme={theme} />;
}
function NavBar({ theme }) {
  return <Button theme={theme} />;
}
function Button({ theme }) {
  return <button className={\`btn-\${theme}\`}>Click</button>;
}
\`\`\`

Context solves this by broadcasting data to the entire subtree.

## Creating and Using Context

### Step 1: Create the Context

\`\`\`jsx
import { createContext } from 'react';

// createContext accepts a default value (used if no Provider is found)
export const ThemeContext = createContext('light');
\`\`\`

### Step 2: Provide the Context

\`\`\`jsx
import { useState } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemedPage } from './ThemedPage';

function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemedPage />
    </ThemeContext.Provider>
  );
}
\`\`\`

### Step 3: Consume the Context

\`\`\`jsx
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === 'dark' ? '#333' : '#f0f0f0',
        color: theme === 'dark' ? '#fff' : '#000',
        padding: '8px 16px',
        border: '1px solid #ccc',
        borderRadius: 4
      }}
    >
      Current: {theme} — Click to toggle
    </button>
  );
}
\`\`\`

## When a Provider's Value Changes

When a Provider's \`value\` prop changes, **all components that consume that context** (via \`useContext\`) re-render. This is why you should:

1. **Keep context values minimal** — don't put everything in one context.
2. **Use multiple contexts** for unrelated concerns.
3. **Memoize the value** to prevent unnecessary re-renders:

\`\`\`jsx
function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  // ❌ This creates a new object every render → ALL consumers re-render
  // return <ThemeContext.Provider value={{ theme, setTheme }}>

  // ✅ Memoize to avoid unnecessary re-renders
  const themeValue = useMemo(() => ({ theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <UserContext.Provider value={user}>
        <AppContent />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
\`\`\`

## Context Patterns

### 1. Context + Custom Hook (The "Provider Pattern")

\`\`\`jsx
// auth-context.js
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check session on mount
    checkSession().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const u = await loginApi(email, password);
    setUser(u);
    return u;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  const value = useMemo(() => ({
    user, loading, login, logout, isAuthenticated: !!user
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
\`\`\`

### 2. Compound Components with Context

\`\`\`jsx
const TabsContext = createContext();

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return (
    <TabsContext.Provider value={value}>
      {children}
    </TabsContext.Provider>
  );
}

function Tab({ label, id }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  return (
    <button
      className={activeTab === id ? 'active' : ''}
      onClick={() => setActiveTab(id)}
    >
      {label}
    </button>
  );
}

function TabContent({ id, children }) {
  const { activeTab } = useContext(TabsContext);
  return activeTab === id ? <div>{children}</div> : null;
}
\`\`\`

## Context vs State Management

| Context | State Management (Redux/Zustand) |
|---------|----------------------------------|
| Built-in, no extra deps | External library |
| Re-renders all consumers on value change | Fine-grained subscriptions |
| Good for low-frequency updates (theme, auth, locale) | Good for high-frequency updates |
| Simple setup | More boilerplate but more tools |
| No devtools | Dedicated devtools |
`,
      interviewQuestions: [
        {
          question: "What is the Context API and what problem does it solve?",
          answer: `The Context API provides a way to share values across the component tree **without explicitly passing props through every level** (prop drilling). It solves the problem of deeply nested components needing access to shared data like themes, authentication status, locale preferences, or UI state.

Context consists of:
1. **\`createContext\`** — creates a context object with a Provider and Consumer.
2. **\`Context.Provider\`** — wraps a subtree and provides the value.
3. **\`useContext(Context)\`** — consumes the nearest Provider's value.

Context is not a replacement for all prop passing — use it only for truly global or deeply shared data. Overusing context can lead to unnecessary re-renders and performance issues.`,
        },
        {
          question:
            "How does Context re-rendering work and how can you optimize it?",
          answer: `When a Provider's \`value\` prop changes, **every component** that consumes that context (even if it only uses part of the value) **re-renders** — not just the children that actually use the changed portion.

Optimization strategies:
1. **Memoize the value object** with \`useMemo\` to prevent re-renders when the Provider re-renders but the actual value hasn't changed.
2. **Split contexts** — separate values that change independently into different contexts (e.g., AuthContext vs ThemeContext).
3. **Use component composition** — pass components as props or children to avoid context consumption in intermediate components.
4. **Consider state libraries** (Zustand, Jotai, Recoil) when you need fine-grained subscriptions to avoid over-rendering.`,
        },
        {
          question:
            "What is the difference between Context API and prop drilling? When should you use each?",
          answer: `**Prop drilling** is passing data through intermediate components that don't need it. **Context** skips the intermediates entirely.

Use **prop drilling** for:
- 1-2 levels of depth — it's explicit and makes data flow traceable.
- When intermediates actually use or transform the props.
- For components that are not deeply shared (local to a section).

Use **Context** for:
- Deeply nested data (theme, auth, locale, routing).
- Data that many components across the tree need.
- When prop drilling makes code hard to maintain or refactor.

Rule of thumb: Start with props. If drilling becomes painful (3+ levels for the same data), refactor to context.`,
        },
        {
          question:
            "How do you structure a context module with a custom hook provider pattern?",
          answer: `The standard pattern is:

\`\`\`jsx
// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, isAuthenticated: !!user }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. Create a custom hook that consumes and validates
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
\`\`\`

Benefits:
- **Encapsulation** — consumers don't need to import both Context and useContext.
- **Error safety** — the hook throws a clear error if used outside the provider.
- **Testing** — you can mock the hook instead of the context.
- **Clean API** — consumers just call \`useAuth()\` and get what they need.`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building a multi-language e-commerce app. The entire app needs access to: (1) current language/locale, (2) a translate function (t), (3) available languages, (4) a function to switch languages. The locale affects date formatting, number formatting, and all text labels throughout the app.",
        task: "Create a LocaleContext system with: (1) LocaleProvider that wraps the app, (2) useLocale custom hook, (3) translations object for at least 2 languages, (4) a t() function that translates keys like 'welcome', 'cart', 'checkout', (5) a locale switcher component. Use React.memo and useMemo to avoid unnecessary re-renders when locale changes.",
        solutionCode: `import { createContext, useContext, useState, useMemo, useCallback, memo } from 'react';

// ========== Translations ==========
const translations = {
  en: {
    welcome: 'Welcome',
    cart: 'Shopping Cart',
    checkout: 'Checkout',
    total: 'Total',
    emptyCart: 'Your cart is empty',
    language: 'Language',
    switchTo: 'Switch to Malayalam'
  },
  ml: {
    welcome: 'സ്വാഗതം',
    cart: 'ഷോപ്പിംഗ് കാർട്ട്',
    checkout: 'ചെക്കൗട്ട്',
    total: 'ആകെ',
    emptyCart: 'നിങ്ങളുടെ കാർട്ട് ശൂന്യമാണ്',
    language: 'ഭാഷ',
    switchTo: 'English-ലേക്ക് മാറുക'
  }
};

// ========== Context ==========
const LocaleContext = createContext(null);

// ========== Provider ==========
export function LocaleProvider({ children }) {
  const [locale, setLocale] = useState('en');

  const t = useCallback((key) => {
    return translations[locale]?.[key] || key;
  }, [locale]);

  const switchLocale = useCallback(() => {
    setLocale(prev => prev === 'en' ? 'ml' : 'en');
  }, []);

  const value = useMemo(() => ({
    locale,
    t,
    switchLocale,
    availableLocales: Object.keys(translations)
  }), [locale, t, switchLocale]);

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

// ========== Custom Hook ==========
export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
}

// ========== Memoized Components ==========
const Header = memo(function Header() {
  const { t } = useLocale();
  console.log('Header rendered'); // Should only render when locale changes
  return (
    <header style={{ padding: '16px 24px', background: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
      <h1>{t('welcome')} 🛍️</h1>
    </header>
  );
});

const CartItem = memo(function CartItem({ item }) {
  console.log('CartItem rendered:', item.name);
  return (
    <li style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
      borderBottom: '1px solid #eee'
    }}>
      <span>{item.name}</span>
      <span style={{ fontFamily: 'monospace' }}>
        \${item.price.toFixed(2)} × {item.qty}
      </span>
    </li>
  );
});

const Cart = memo(function Cart({ items }) {
  const { t } = useLocale();
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (items.length === 0) {
    return <p style={{ padding: 24, textAlign: 'center', color: '#888' }}>{t('emptyCart')}</p>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>{t('cart')}</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map(item => (
          <CartItem key={item.id} item={item} />
        ))}
      </ul>
      <div style={{ textAlign: 'right', padding: 16, fontWeight: 'bold', fontSize: 18 }}>
        {t('total')}: \${total.toFixed(2)}
      </div>
    </div>
  );
});

const LocaleSwitcher = memo(function LocaleSwitcher() {
  const { locale, switchLocale, t } = useLocale();
  console.log('LocaleSwitcher rendered');
  return (
    <div style={{ padding: 16, textAlign: 'center', borderTop: '1px solid #eee' }}>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        {t('language')}: <strong>{locale === 'en' ? 'English' : 'മലയാളം'}</strong>
      </p>
      <button
        onClick={switchLocale}
        style={{
          padding: '8px 20px',
          background: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        {t('switchTo')}
      </button>
    </div>
  );
});

// ========== App ==========
function ShopApp() {
  const [items] = useState([
    { id: 1, name: 'Wireless Mouse', price: 29.99, qty: 2 },
    { id: 2, name: 'USB-C Hub', price: 34.99, qty: 1 },
    { id: 3, name: 'Mechanical Keyboard', price: 89.99, qty: 1 }
  ]);

  return (
    <LocaleProvider>
      <div style={{ maxWidth: 500, margin: '0 auto', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
        <Header />
        <Cart items={items} />
        <LocaleSwitcher />
      </div>
    </LocaleProvider>
  );
}`,
      },
    },

    // ==================== TOPIC 12: useReducer ====================
    {
      slug: "usereducer-hook",
      title: "12. useReducer — Complex State Logic",
      order: 12,
      content: `
# useReducer — Managing Complex State

## When to Use useReducer

\`useReducer\` is for when \`useState\` isn't enough:

- State logic is complex (multiple sub-values, interdependent updates).
- The next state depends heavily on the previous state.
- State transitions are better expressed as actions (events).
- You want to centralize state update logic (like Redux but local).
- Testing state transitions is important (reducers are pure functions).

## Basic Usage

\`\`\`jsx
import { useReducer } from 'react';

// 1. Define initial state
const initialState = { count: 0 };

// 2. Define reducer (pure function)
function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    case 'set':
      return { count: action.payload };
    default:
      throw new Error(\`Unknown action type: \${action.type}\`);
  }
}

// 3. Use in component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'set', payload: 100 })}>
        Set to 100
      </button>
    </div>
  );
}
\`\`\`

## Real-World Example: Shopping Cart

\`\`\`jsx
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(0, i.quantity + action.payload.delta) }
            : i
        ).filter(i => i.quantity > 0)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload };
    default:
      return state;
  }
};

function ShoppingCart() {
  const [cart, dispatch] = useReducer(cartReducer, {
    items: [],
    coupon: null
  });

  const total = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity, 0
  );

  return (
    <div>
      {cart.items.map(item => (
        <div key={item.id}>
          <span>{item.name} × {item.quantity}</span>
          <button onClick={() =>
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, delta: 1 } })
          }>+</button>
          <button onClick={() =>
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, delta: -1 } })
          }>-</button>
          <button onClick={() =>
            dispatch({ type: 'REMOVE_ITEM', payload: item.id })
          }>Remove</button>
        </div>
      ))}
      <p>Total: \${total}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_CART' })}>
        Clear Cart
      </button>
    </div>
  );
}
\`\`\`

## Action Conventions

\`\`\`jsx
// Type-only action (no payload)
dispatch({ type: 'reset' });

// With payload
dispatch({ type: 'setUser', payload: user });

// With multiple values
dispatch({ type: 'updateField', payload: { field: 'email', value: 'a@b.com' } });

// Action creator pattern (extracted function)
const addItem = (item) => ({ type: 'ADD_ITEM', payload: item });
dispatch(addItem(product));
\`\`\`

## useReducer vs useState

| Aspect | useState | useReducer |
|--------|----------|------------|
| State shape | Simple (number, string, boolean) | Complex (objects, arrays, nested) |
| Updates | Direct value or simple function | Dispatched actions |
| Logic location | In event handlers | Centralized in reducer |
| Testability | Harder to test individual updates | Reducer is a pure function — easy to test |
| Readability | Simple, intuitive | More verbose, explicit |
| Performance | Usually fine | Better for complex updates with many sub-values |

## Lazy Initialization

\`\`\`jsx
// For expensive initial state computation
const init = (initialValue) => {
  return { count: initialValue, lastUpdated: Date.now() };
};

const [state, dispatch] = useReducer(reducer, 0, init);
// 'init' runs only once, receiving 0 as argument
\`\`\`
`,
      interviewQuestions: [
        {
          question: "When would you choose useReducer over useState?",
          answer: `Choose \`useReducer\` when:

1. **Complex state shape**: Multiple related values that change together (e.g., a form with 10 fields, where validation errors and touched state need coordination).
2. **Interdependent updates**: The next state depends on multiple factors or previous state in non-trivial ways.
3. **Predictable transitions**: State updates are better modeled as "events" (actions) rather than raw value assignments.
4. **Testing matters**: Reducers are pure functions — you can test them in isolation without rendering components.
5. **Debugging**: Redux DevTools can track dispatched actions for useReducer too.

Use \`useState\` for simple, independent values (toggles, counters, single form fields). Don't use \`useReducer\` for everything — it adds boilerplate.`,
        },
        {
          question: "What are the characteristics of a reducer function?",
          answer: `A reducer is a **pure function** with these characteristics:
1. **Takes (\`state\`, \`action\`) → returns \`newState\`**.
2. **Pure**: Given the same state and action, it always returns the same result. No side effects (no API calls, no Math.random(), no Date.now()).
3. **Immutable**: Returns a new state object rather than mutating the existing one. Uses spread operators, \`.map()\`, \`.filter()\`, \`.slice()\` instead of direct mutation.
4. **Action describes what happened**: Actions typically have a \`type\` (string) and optional \`payload\` (data).

\`\`\`jsx
// ✅ Pure, immutable reducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// ❌ Impure — don't do this
function reducer(state, action) {
  state.count += 1; // Mutation!
  return state;
}
\`\`\``,
        },
        {
          question:
            "How does useReducer relate to Redux? What are the similarities and differences?",
          answer: `Both \`useReducer\` and Redux use the **reducer pattern**: \`(state, action) => newState\`. They share the concepts of actions, dispatch, and immutable updates.

**Differences:**

| Feature | useReducer | Redux |
|---------|------------|-------|
| Scope | Component-local | Global |
| Setup | Built-in, no deps | Requires library + store setup |
| Middleware | None | Thunk, Saga, etc. |
| DevTools | Limited | Rich (time-travel, etc.) |
| Multiple stores | N/A (one per useReducer call) | Single store |
| State persistence | Manual | Via libraries |

\`useReducer\` + \`useContext\` can approximate Redux functionality, but for large apps with complex global state, dedicated state management is often better.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a task management app with complex state logic. Tasks can be created, updated (status, priority, assignee), deleted, filtered, sorted, and batch-operated. The state also needs to track UI state (selected task, filter, sort order). This complexity makes useReducer ideal.",
        task: "Create a TaskManager component that uses useReducer to manage: (1) tasks array (id, title, status, priority, assignee, createdAt), (2) UI state (filter status, sort by, selected task id). Implement actions: ADD_TASK, UPDATE_TASK, DELETE_TASK, BATCH_DELETE, SET_FILTER, SET_SORT, SELECT_TASK. The reducer should handle all logic centrally.",
        solutionCode: `import { useReducer, useState } from 'react';

// ========== Reducer ==========
const initialState = {
  tasks: [],
  filter: 'all',     // 'all' | 'todo' | 'in-progress' | 'done'
  sortBy: 'createdAt', // 'createdAt' | 'priority' | 'title'
  sortOrder: 'desc',
  selectedTaskId: null
};

function taskReducer(state, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [{
          id: Date.now().toString(),
          title: action.payload.title,
          status: 'todo',
          priority: action.payload.priority || 'medium',
          assignee: action.payload.assignee || '',
          createdAt: new Date().toISOString()
        }, ...state.tasks]
      };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        selectedTaskId: state.selectedTaskId === action.payload
          ? null : state.selectedTaskId
      };

    case 'BATCH_DELETE':
      return {
        ...state,
        tasks: state.tasks.filter(t => !action.payload.includes(t.id)),
        selectedTaskId: action.payload.includes(state.selectedTaskId)
          ? null : state.selectedTaskId
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload };

    case 'SET_SORT':
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortOrder: action.payload.order
      };

    case 'SELECT_TASK':
      return {
        ...state,
        selectedTaskId: state.selectedTaskId === action.payload
          ? null : action.payload // Toggle selection
      };

    case 'CLEAR_SELECTION':
      return { ...state, selectedTaskId: null };

    default:
      return state;
  }
}

// ========== Priority helpers ==========
const priorityWeight = { high: 3, medium: 2, low: 1 };
const priorityColors = {
  high: { bg: '#fde8e8', text: '#e74c3c' },
  medium: { bg: '#fef3cd', text: '#856404' },
  low: { bg: '#d1e7dd', text: '#0f5132' }
};
const statusColors = {
  'todo': '#95a5a6',
  'in-progress': '#3498db',
  'done': '#2ecc71'
};

// ========== Component ==========
function TaskManager() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  // Derived: filtered and sorted tasks
  const visibleTasks = state.tasks
    .filter(task => state.filter === 'all' || task.status === state.filter)
    .sort((a, b) => {
      let comparison;
      if (state.sortBy === 'priority') {
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else if (state.sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else {
        comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return state.sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    dispatch({
      type: 'ADD_TASK',
      payload: { title: newTaskTitle.trim(), priority: newTaskPriority }
    });
    setNewTaskTitle('');
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch({ type: 'UPDATE_TASK', payload: { id: taskId, updates: { status: newStatus } } });
  };

  const selectedTasks = visibleTasks.filter(t => t.id === state.selectedTaskId);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>📋 Task Manager</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
          placeholder="Add a new task..."
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 4 }}
        />
        <select
          value={newTaskPriority}
          onChange={e => setNewTaskPriority(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: 4 }}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit" style={{
          padding: '8px 16px', background: '#2ecc71', color: '#fff',
          border: 'none', borderRadius: 4, cursor: 'pointer'
        }}>
          Add
        </button>
      </form>

      {/* Filters & Sort */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'todo', 'in-progress', 'done'].map(status => (
          <button
            key={status}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: status })}
            style={{
              padding: '4px 12px',
              borderRadius: 16,
              border: state.filter === status ? '2px solid #3498db' : '1px solid #ddd',
              background: state.filter === status ? '#ebf5fb' : '#fff',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {' '}
            ({state.tasks.filter(t => status === 'all' || t.status === status).length})
          </button>
        ))}

        <div style={{ marginLeft: 'auto' }}>
          <select
            value={state.sortBy}
            onChange={e => dispatch({
              type: 'SET_SORT',
              payload: { sortBy: e.target.value, order: state.sortOrder }
            })}
            style={{ padding: '4px 8px', fontSize: 13 }}
          >
            <option value="createdAt">Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => dispatch({
              type: 'SET_SORT',
              payload: { sortBy: state.sortBy, order: state.sortOrder === 'asc' ? 'desc' : 'asc' }
            })}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            {state.sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* Batch actions */}
      {selectedTasks.length > 0 && (
        <div style={{ marginBottom: 8, padding: 8, background: '#f0f8ff', borderRadius: 4, fontSize: 13 }}>
          {selectedTasks.length} selected
          <button
            onClick={() => dispatch({
              type: 'BATCH_DELETE',
              payload: selectedTasks.map(t => t.id)
            })}
            style={{ marginLeft: 8, color: '#e74c3c', cursor: 'pointer', border: 'none', background: 'none' }}
          >
            Delete selected
          </button>
          <button
            onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
            style={{ marginLeft: 8, cursor: 'pointer', border: 'none', background: 'none', color: '#888' }}
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Task List */}
      {visibleTasks.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center', padding: 40 }}>
          {state.tasks.length === 0
            ? 'No tasks yet. Add your first task above!'
            : 'No tasks match the current filter.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {visibleTasks.map(task => {
            const pColor = priorityColors[task.priority];
            return (
              <li key={task.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                border: state.selectedTaskId === task.id ? '2px solid #3498db' : '1px solid #eee',
                borderRadius: 8,
                marginBottom: 8,
                background: state.selectedTaskId === task.id ? '#f0f8ff' : '#fff',
                cursor: 'pointer'
              }}
                onClick={() => dispatch({ type: 'SELECT_TASK', payload: task.id })}
              >
                {/* Status Selector */}
                <select
                  value={task.status}
                  onChange={e => {
                    e.stopPropagation();
                    handleStatusChange(task.id, e.target.value);
                  }}
                  style={{
                    padding: '4px',
                    borderRadius: 4,
                    border: \`1px solid \${statusColors[task.status]}\`,
                    color: statusColors[task.status],
                    fontSize: 12
                  }}
                >
                  <option value="todo">TODO</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                {/* Title */}
                <span style={{
                  flex: 1,
                  textDecoration: task.status === 'done' ? 'line-through' : 'none',
                  color: task.status === 'done' ? '#888' : '#333'
                }}>
                  {task.title}
                </span>

                {/* Priority Badge */}
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  background: pColor.bg,
                  color: pColor.text,
                  fontWeight: 600
                }}>
                  {task.priority}
                </span>

                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch({ type: 'DELETE_TASK', payload: task.id });
                  }}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#e74c3c', fontSize: 16 }}
                >
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <p style={{ fontSize: 12, color: '#888', textAlign: 'center' }}>
        Total: {state.tasks.length} tasks · Click to select · Priority sorting enabled
      </p>
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 13: React Performance ====================
    {
      slug: "react-performance",
      title: "13. Performance Optimization",
      order: 13,
      content: `
# React Performance Optimization

## Understanding Re-renders

A component re-renders when:
1. Its **state** changes.
2. Its **props** change (receives new references).
3. Its **parent** re-renders (by default, children re-render when parent does).

## 1. React.memo — Memoizing Components

\`React.memo\` is a higher-order component that prevents re-renders when props haven't changed (shallow comparison):

\`\`\`jsx
import { memo } from 'react';

// Only re-renders if props actually change
const ExpensiveChart = memo(function ExpensiveChart({ data, onSelect }) {
  return (
    <div className="chart">
      {data.map(point => (
        <Bar key={point.id} value={point.value} onClick={() => onSelect(point.id)} />
      ))}
    </div>
  );
});

// Parent component
function Dashboard({ chartData }) {
  const handleSelect = useCallback((id) => {
    console.log('Selected:', id);
  }, []);

  return <ExpensiveChart data={chartData} onSelect={handleSelect} />;
}
\`\`\`

**Important**: React.memo does a **shallow comparison**. If you pass objects/arrays/functions as props, they need to be stable references (use \`useMemo\` / \`useCallback\`).

## 2. useMemo — Memoizing Values

\`\`\`jsx
import { useMemo } from 'react';

function Dashboard({ transactions, filter }) {
  // Expensive computation — only recalculates when dependencies change
  const filteredData = useMemo(() => {
    console.log('Running expensive filter...');
    return transactions
      .filter(t => t.category === filter)
      .sort((a, b) => b.amount - a.amount)
      .map(t => ({
        ...t,
        formattedAmount: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(t.amount)
      }));
  }, [transactions, filter]);

  return <Chart data={filteredData} />;
}
\`\`\`

## 3. useCallback — Memoizing Functions

\`\`\`jsx
import { useCallback } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);

  // Stable function reference — won't change unless todos changes
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies — uses functional update

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  return (
    <div>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

// Only re-renders when todo, onToggle, or onDelete actually change
const TodoItem = memo(function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div>
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => onToggle(todo.id)}>Toggle</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
});
\`\`\`

## 4. Code Splitting with React.lazy & Suspense

\`\`\`jsx
import { lazy, Suspense } from 'react';

// Heavy component loaded only when needed
const HeavyDashboard = lazy(() => import('./HeavyDashboard'));
const SettingsPanel = lazy(() => import('./SettingsPanel'));

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div>
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('settings')}>Settings</button>
      </nav>

      <Suspense fallback={<div className="spinner">Loading...</div>}>
        {page === 'dashboard' ? <HeavyDashboard /> : <SettingsPanel />}
      </Suspense>
    </div>
  );
}
\`\`\`

## 5. Virtualization for Long Lists

\`\`\`jsx
// Use libraries like react-window or react-virtuoso
import { FixedSizeList as List } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-item">
      {items[index].name}
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
\`\`\`

## 6. Performance Checklist

| Technique | When to Use | Cost/Benefit |
|-----------|-------------|--------------|
| React.memo | Expensive components that re-render often with same props | Low cost, high benefit |
| useMemo | Expensive calculations (filtering, sorting, formatting) | Low cost, high benefit |
| useCallback | Functions passed to memo'd children | Low cost, high benefit |
| Lazy loading | Large components not needed immediately | Medium cost, high benefit |
| Virtualization | Lists with 1000+ items | Medium cost, high benefit |
| Avoid inline objects | Objects/arrays created in render break memoization | Zero cost, high benefit |

## When NOT to Optimize

> **"Profile first, optimize second."**

- Premature optimization adds complexity without measurable benefit.
- Most performance issues come from a few components — find them with the React DevTools Profiler.
- Default React rendering is fast for most apps — optimize only when you measure a problem.
`,
      interviewQuestions: [
        {
          question: "How does React.memo work and when would you use it?",
          answer: `\`React.memo\` is a higher-order component that **memoizes the rendered output** of a component. It performs a shallow comparison of the component's props. If none change, React skips re-rendering and reuses the last rendered result.

\`\`\`jsx
const MyComponent = memo(function MyComponent({ name, onClick }) {
  return <button onClick={onClick}>{name}</button>;
});
\`\`\`

Use it when:
1. The component renders often but receives the same props.
2. The component is expensive to render (complex DOM, heavy calculations).
3. The component is part of a list where items are frequently re-ordered.

**Don't** wrap everything in memo — the shallow comparison itself has a small cost. Measure first with Profiler.`,
        },
        {
          question:
            "What is the difference between useMemo and useCallback? Provide use cases for each.",
          answer: `**\`useMemo\`** memoizes a **value** (result of a computation). **\`useCallback\`** memoizes a **function definition**.

\`\`\`jsx
// useMemo: memoizes the result of an expensive calculation
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// useCallback: memoizes a function reference
const handleClick = useCallback((id) => {
  setSelected(id);
}, []); // Same function reference on every render
\`\`\`

Use \`useMemo\` when:
- An expensive computation would otherwise run on every render.
- You need a stable reference for an object/array passed to a memo'd child.

Use \`useCallback\` when:
- Passing a function to a memo'd child component.
- A function is a dependency of useEffect/useMemo/useCallback.`,
        },
        {
          question:
            "What causes unnecessary re-renders in React and how do you prevent them?",
          answer: `Common causes of unnecessary re-renders:

1. **Parent re-renders** — By default, all children re-render when the parent does.
   - Fix: React.memo on child components.

2. **Inline objects/arrays/functions** — A new reference is created every render, breaking memoization.
   - Fix: Extract to const outside component, or use useMemo/useCallback.

3. **Context value changes** — All consumers re-render when any part of the context value changes.
   - Fix: Split contexts, memoize context values, use state libraries with fine-grained subscriptions.

4. **State updates in wrong component** — State that should be lower in the tree is too high.
   - Fix: Push state down to the component that actually uses it.

5. **Missing dependencies in useMemo/useCallback** — Not including all values that the memoized function/computation uses.
   - Fix: Use the \`exhaustive-deps\` ESLint rule.`,
        },
        {
          question:
            "Explain React.lazy and Suspense. How do they improve performance?",
          answer: `**\`React.lazy\`** enables **code splitting** — loading a component's JavaScript bundle only when it's needed, not when the app first loads. It works with dynamic \`import()\` statements.

**\`Suspense\`** provides a fallback UI (like a loading spinner) while the lazy component loads.

\`\`\`jsx
const AdminDashboard = lazy(() => import('./AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <AdminDashboard />
    </Suspense>
  );
}
\`\`\`

This improves performance by:
1. **Reducing initial bundle size** — users don't download code they may never use.
2. **Enabling on-demand loading** — route-based splitting loads only what's needed for the current page.
3. **Better caching** — each chunk can be cached independently.

Tools like Vite, Webpack, and Next.js support automatic code splitting at the route level.`,
        },
      ],
      practicalTask: {
        scenario:
          "You have a large data grid displaying financial transactions. Each row has formatted currency values, status badges, and action buttons. The grid updates every few seconds with new data. Without optimization, the entire grid re-renders on every update, causing jank. You need to memoize strategically.",
        task: "Create a FinancialGrid component that: (1) renders a list of 100+ transactions (use generated mock data), (2) uses React.memo on the row component, (3) uses useMemo for derived data (formatted values, filtered/sorted lists), (4) uses useCallback for event handlers, (5) includes a search/filter that doesn't cause unnecessary re-renders of non-affected rows, (6) tracks render count to demonstrate the optimization.",
        solutionCode: `import { useState, useMemo, useCallback, memo } from 'react';

// ========== Helper: Generate Mock Data ==========
const generateTransactions = (count) => {
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Salary'];
  const statuses = ['completed', 'pending', 'failed'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    date: new Date(2024, 0, Math.floor(Math.random() * 365)).toISOString().split('T')[0],
    description: \`Transaction #\${i + 1}\`,
    category: categories[Math.floor(Math.random() * categories.length)],
    amount: Math.round((Math.random() * 5000 - 500) * 100) / 100,
    status: statuses[Math.floor(Math.random() * statuses.length)]
  }));
};

// ========== Transaction Row (Memoized) ==========
const TransactionRow = memo(function TransactionRow({ transaction, onSelect, onFlag }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      signDisplay: amount < 0 ? 'always' : 'never'
    }).format(amount);
  };

  const statusColors = {
    completed: { bg: '#d1e7dd', text: '#0f5132' },
    pending: { bg: '#fef3cd', text: '#856404' },
    failed: { bg: '#fde8e8', text: '#e74c3c' }
  };

  const colors = statusColors[transaction.status] || statusColors.pending;

  // Track renders for demo
  console.log(\`Row \${transaction.id} rendered\`);

  return (
    <tr
      onClick={() => onSelect(transaction.id)}
      style={{ cursor: 'pointer', transition: 'background 0.2s' }}
      onMouseEnter={e => e.target.style.background = '#f8f9fa'}
      onMouseLeave={e => e.target.style.background = 'transparent'}
    >
      <td>{transaction.date}</td>
      <td>{transaction.description}</td>
      <td>
        <span style={{
          padding: '2px 8px',
          borderRadius: 4,
          fontSize: 12,
          background: '#f0f0f0'
        }}>
          {transaction.category}
        </span>
      </td>
      <td style={{
        textAlign: 'right',
        fontFamily: 'monospace',
        color: transaction.amount >= 0 ? '#2ecc71' : '#e74c3c',
        fontWeight: 600
      }}>
        {formatCurrency(transaction.amount)}
      </td>
      <td>
        <span style={{
          padding: '2px 10px',
          borderRadius: 12,
          fontSize: 12,
          background: colors.bg,
          color: colors.text,
          fontWeight: 600
        }}>
          {transaction.status}
        </span>
      </td>
      <td>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFlag(transaction.id);
          }}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: 16
          }}
        >
          🚩
        </button>
      </td>
    </tr>
  );
});

// ========== Financial Grid ==========
function FinancialGrid() {
  const [transactions] = useState(() => generateTransactions(100));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedId, setSelectedId] = useState(null);
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [renderCount, setRenderCount] = useState(0);

  // Increment render counter
  const filteredTransactions = useMemo(() => {
    setRenderCount(prev => prev + 1);

    return transactions
      .filter(t => {
        if (statusFilter !== 'all' && t.status !== statusFilter) return false;
        if (search) {
          const query = search.toLowerCase();
          return t.description.toLowerCase().includes(query) ||
                 t.category.toLowerCase().includes(query);
        }
        return true;
      })
      .sort((a, b) => {
        let comparison;
        if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortBy === 'status') {
          comparison = a.status.localeCompare(b.status);
        } else {
          comparison = a.date.localeCompare(b.date);
        }
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [transactions, search, statusFilter, sortBy, sortOrder]);

  // Memoized callbacks
  const handleSelect = useCallback((id) => {
    setSelectedId(prev => prev === id ? null : id);
  }, []);

  const handleFlag = useCallback((id) => {
    setFlaggedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  return (
    <div>
      <h2>📊 Financial Transactions</h2>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 14 }}>
        <span>Total: <strong>{transactions.length}</strong></span>
        <span>Visible: <strong>{filteredTransactions.length}</strong></span>
        <span>Flagged: <strong>{flaggedIds.size}</strong></span>
        <span>Renders: <strong style={{ color: '#e74c3c' }}>{renderCount}</strong></span>
        <span style={{ fontSize: 12, color: '#888' }}>
          (Lower render count = better optimization)
        </span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search transactions..."
          style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 4, flex: 1, minWidth: 200 }}
        />

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px', border: '1px solid #ddd', borderRadius: 4 }}
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{ padding: '6px', border: '1px solid #ddd', borderRadius: 4 }}
        >
          <option value="date">Date</option>
          <option value="amount">Amount</option>
          <option value="status">Status</option>
        </select>

        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: 4, cursor: 'pointer' }}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
              <th style={{ padding: '8px 12px' }}>Date</th>
              <th style={{ padding: '8px 12px' }}>Description</th>
              <th style={{ padding: '8px 12px' }}>Category</th>
              <th style={{ padding: '8px 12px', textAlign: 'right' }}>Amount</th>
              <th style={{ padding: '8px 12px' }}>Status</th>
              <th style={{ padding: '8px 12px' }}>Flag</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(tx => (
              <TransactionRow
                key={tx.id}
                transaction={{
                  ...tx,
                  isSelected: tx.id === selectedId,
                  isFlagged: flaggedIds.has(tx.id)
                }}
                onSelect={handleSelect}
                onFlag={handleFlag}
              />
            ))}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>
          No transactions match your search/filter.
        </p>
      )}
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 14: Error Boundaries ====================
    {
      slug: "error-boundaries",
      title: "14. Error Boundaries",
      order: 14,
      content: `
# Error Boundaries — Graceful Error Handling

## What is an Error Boundary?

An **Error Boundary** is a React component that **catches JavaScript errors** anywhere in its child component tree, logs those errors, and displays a fallback UI instead of crashing the whole application.

Error boundaries catch errors during:
- Rendering (lifecycle methods, render function)
- Constructor
- Event handlers (use try/catch instead for events)
- lifecycle methods (componentDidMount, useEffect, etc.)

They do **NOT** catch errors in:
- Asynchronous code (setTimeout, requestAnimationFrame)
- Server-side rendering
- Errors thrown in the error boundary itself

## Class Component Error Boundary

In React 17 and below, error boundaries can only be class components. (React 18+ may introduce a hook-based alternative.)

\`\`\`jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to your error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're sorry — an unexpected error occurred.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: 12 }}>
            <summary>Error Details</summary>
            <p>{this.state.error?.toString()}</p>
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
<ErrorBoundary>
  <UserProfile userId={userId} />
</ErrorBoundary>
\`\`\`

## Error Boundary with Hook (React 18+)

\`\`\`jsx
import { useState } from 'react';

// Custom hook for error boundary logic
function useErrorBoundary() {
  const [error, setError] = useState(null);

  if (error) {
    throw error; // Re-throw to be caught by a parent boundary
  }

  return setError;
}

// Wrapper using the hook
function SafeComponent({ children, fallback }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return fallback || <h2>Something went wrong.</h2>;
  }

  try {
    return children;
  } catch (error) {
    setHasError(true);
    // Optionally log error
    return fallback || <h2>Something went wrong.</h2>;
  }
}
\`\`\`

## Granular Error Boundaries

Instead of one global error boundary, place them strategically:

\`\`\`jsx
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<ErrorFallback component="sidebar" />}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ErrorFallback component="main content" />}>
        <MainContent />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ErrorFallback component="comments" />}>
        <CommentsSection />
      </ErrorBoundary>
    </div>
  );
}
\`\`\`

This way, if the Comments section crashes, the rest of the page still works.

## Error Boundary for Async Operations

Error boundaries don't catch errors in async code, but you can create a wrapper component:

\`\`\`jsx
function AsyncErrorHandler({ children }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div className="error-fallback">
        <h3>Failed to load data</h3>
        <p>{error.message}</p>
        <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  // Pass setError via context or cloneElement
  return children;
}
\`\`\`

## Best Practices

1. **Use multiple granular boundaries** — not one global boundary.
2. **Show useful fallbacks** — "Something went wrong" with a retry button.
3. **Log errors** — send to Sentry, LogRocket, Datadog, etc.
4. **Reset state on retry** — clear the error state and re-render children.
5. **Don't overuse** — not every component needs a boundary. Focus on:
   - Third-party widgets.
   - User-generated content.
   - Data-heavy sections.
   - Experimental/new features.
`,
      interviewQuestions: [
        {
          question:
            "What are error boundaries in React and what errors do they catch?",
          answer: `Error boundaries are React components that catch JavaScript errors in their child component tree during **rendering, lifecycle methods, and constructors**. They prevent the entire app from crashing by displaying a fallback UI.

They catch errors from:
- \`render()\` function
- \`useEffect\` (synchronously)
- \`componentDidMount\`, \`componentDidUpdate\`, etc.
- Constructor of child components
- Event handlers (though use try/catch for these is recommended)

They do NOT catch:
- Asynchronous errors (setTimeout, requestAnimationFrame, Promises)
- Server-side rendering errors
- Errors thrown in the error boundary itself
- Event handler errors (use try/catch inside handlers)`,
        },
        {
          question:
            "How do you create an error boundary in React? Can you use hooks?",
          answer: `In React 16–17, error boundaries must be **class components** because they require the \`componentDidCatch\` and \`getDerivedStateFromError\` lifecycle methods:

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() {
    return this.state.hasError
      ? <ErrorFallback />
      : this.props.children;
  }
}
\`\`\`

There is currently no hook equivalent (\`useErrorBoundary\` doesn't exist yet). However, you can:
1. Create a reusable wrapper using the class component pattern.
2. In React 18+, you can use try/catch in render with a state-based approach for some cases.
3. Libraries like \`react-error-boundary\` provide a clean Hook/Component API.`,
        },
        {
          question:
            "What is the difference between using one global error boundary vs multiple granular ones?",
          answer: `**One global boundary** catches any error in the app and shows a full-page error. It's simple but the entire app breaks.

**Multiple granular boundaries** let you isolate failures:

\`\`\`jsx
<App>
  <Header />
  <ErrorBoundary><Sidebar /></ErrorBoundary>
  <ErrorBoundary><MainContent /></ErrorBoundary>
  <ErrorBoundary><Comments /></ErrorBoundary>
</App>
\`\`\`

If Comments crashes, Header, Sidebar, and MainContent still work. This provides a **better UX** — users can still navigate and use most of the app.

Granular boundaries also help with:
- **Progressive enhancement**: New/unstable features can fail gracefully.
- **Third-party widgets**: Isolate untrusted code.
- **A/B testing**: Experimental features can crash without affecting production.`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building a social media feed that displays user posts, each with embedded third-party widgets (maps, videos, polls). These widgets may occasionally throw errors. You need to ensure one broken widget doesn't crash the entire feed. Additionally, you need to handle errors gracefully for authenticated vs anonymous users differently.",
        task: "Create: (1) an ErrorBoundary class component with fallback UI and retry capability, (2) a FeedPage that renders multiple PostCard components, each wrapped in its own ErrorBoundary, (3) a BuggyWidget component that randomly throws errors (to simulate third-party failures), (4) different fallback UIs for different contexts.",
        solutionCode: `import { Component, useState, useCallback } from 'react';

// ========== Error Boundary (Class Component) ==========
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Boundary caught:', error);
    // Send to error tracking service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback or default
      if (this.props.fallback) {
        return this.props.fallback({ 
          error: this.state.error, 
          onRetry: this.handleRetry 
        });
      }

      return (
        <div style={{
          padding: 20,
          border: '1px solid #f5c6cb',
          borderRadius: 8,
          background: '#fde8e8',
          textAlign: 'center',
          margin: '12px 0'
        }}>
          <h3 style={{ color: '#e74c3c', margin: '0 0 8px' }}>
            ⚠️ {this.props.title || 'Something went wrong'}
          </h3>
          <p style={{ color: '#721c24', margin: '0 0 12px', fontSize: 14 }}>
            {this.props.message || 'This section encountered an error.'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '6px 16px',
              background: '#e74c3c',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ========== Buggy Widget (Simulates third-party failures) ==========
function BuggyWidget({ title }) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(\`\${title} failed to render\`);
  }

  return (
    <div style={{
      padding: 16,
      border: '1px solid #ddd',
      borderRadius: 8,
      background: '#fff'
    }}>
      <h4>{title}</h4>
      <p>This widget is working correctly.</p>
      <button
        onClick={() => setShouldThrow(true)}
        style={{
          padding: '4px 12px',
          background: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 12
        }}
      >
        💥 Simulate Crash
      </button>
    </div>
  );
}

// ========== Post Card ==========
function PostCard({ post }) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: 16,
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
      {/* Post Header */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: '#3498db',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: 14
        }}>
          {post.author[0]}
        </div>
        <div>
          <strong style={{ fontSize: 14 }}>{post.author}</strong>
          <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>
            {new Date(post.date).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Post Content */}
      <div style={{ padding: '0 16px 12px' }}>
        <p style={{ margin: 0 }}>{post.content}</p>
      </div>

      {/* Embedded Widgets */}
      <div style={{ padding: '0 16px 16px', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <ErrorBoundary
            title="Map Widget Error"
            message="The map could not be loaded. Please try again."
            onError={(err) => console.log('Map error logged:', err)}
          >
            <BuggyWidget title="📍 Location Map" />
          </ErrorBoundary>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <ErrorBoundary
            title="Poll Error"
            message="The poll widget encountered an error."
            fallback={({ onRetry }) => (
              <div style={{
                padding: 16,
                border: '2px dashed #f39c12',
                borderRadius: 8,
                textAlign: 'center',
                background: '#fef3cd'
              }}>
                <h4 style={{ margin: '0 0 8px', color: '#856404' }}>📊 Poll Unavailable</h4>
                <p style={{ fontSize: 13, margin: '0 0 8px' }}>
                  This poll is currently unavailable.
                </p>
                <button onClick={onRetry} style={{ padding: '4px 12px', cursor: 'pointer' }}>
                  Retry
                </button>
              </div>
            )}
          >
            <BuggyWidget title="📊 Quick Poll" />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}

// ========== Feed Page ==========
function FeedPage() {
  const posts = [
    {
      id: 1,
      author: 'Alice Johnson',
      date: '2024-01-15',
      content: 'Just got back from an amazing hiking trip! 🏔️'
    },
    {
      id: 2,
      author: 'Bob Smith',
      date: '2024-01-16',
      content: 'New blog post: "10 Tips for Better Code Reviews" 📝'
    },
    {
      id: 3,
      author: 'Carol Davis',
      date: '2024-01-17',
      content: 'Anyone else excited about the new React 19 features? 🚀'
    }
  ];

  const [globalError, setGlobalError] = useState(null);

  const handleGlobalError = useCallback((error) => {
    setGlobalError(error);
    // In production, send to Sentry
    console.error('Critical error:', error);
  }, []);

  // Global error boundary as last resort
  if (globalError) {
    return (
      <div style={{ maxWidth: 600, margin: '40px auto', textAlign: 'center' }}>
        <h2>🚨 Something went wrong</h2>
        <p>We're experiencing technical difficulties. Please try again later.</p>
        <button onClick={() => window.location.reload()}>
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary
      title="Page Error"
      message="An unexpected error occurred on this page."
      onError={handleGlobalError}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2>📰 Social Feed</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
          Each post is wrapped in its own error boundary. 
          Click "Simulate Crash" on any widget to see how the rest remains unaffected.
        </p>

        {posts.map(post => (
          <ErrorBoundary
            key={post.id}
            title="Post Error"
            message="This post could not be displayed."
            fallback={({ onRetry }) => (
              <div style={{
                padding: 20,
                border: '1px solid #f5c6cb',
                borderRadius: 12,
                background: '#fde8e8',
                marginBottom: 16,
                textAlign: 'center'
              }}>
                <h3 style={{ color: '#e74c3c', margin: '0 0 8px' }}>
                  ❌ Post unavailable
                </h3>
                <p style={{ color: '#721c24', fontSize: 14, margin: '0 0 12px' }}>
                  This post could not be displayed due to an error.
                </p>
                <button onClick={onRetry} style={{ padding: '6px 16px', cursor: 'pointer' }}>
                  Retry
                </button>
              </div>
            )}
          >
            <PostCard post={post} />
          </ErrorBoundary>
        ))}
      </div>
    </ErrorBoundary>
  );
}`,
      },
    },

    // ==================== TOPIC 15: React Router ====================
    {
      slug: "react-router",
      title: "15. React Router",
      order: 15,
      content: `
# React Router — Navigation & Routing

## What is React Router?

React Router is the most popular routing library for React. It enables **client-side routing** — navigating between views without page reloads, while keeping the UI in sync with the URL.

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Key Components

### BrowserRouter
Uses the HTML5 History API (\`pushState\`, \`popstate\`) to keep UI in sync with the URL.

### Routes & Route
\`\`\`jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetail />} />
</Routes>
\`\`\`

- \`Routes\` is the container — it renders the first matching \`Route\`.
- \`path\` can be \`exact\` (default in v6) or contain parameters (\`:id\`).
- \`*\` is a wildcard — matches anything (for 404 pages).

### Link vs NavLink

\`\`\`jsx
// Link — basic navigation
<Link to="/about">About</Link>

// NavLink — adds \`active\` class when the route matches
<NavLink
  to="/about"
  className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
>
  About
</NavLink>
\`\`\`

## URL Parameters

\`\`\`jsx
// Route definition
<Route path="/users/:userId/posts/:postId" element={<PostDetail />} />

// Component uses useParams
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { userId, postId } = useParams();
  return <div>Viewing post {postId} by user {userId}</div>;
}
\`\`\`

## Nested Routes

\`\`\`jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />}>
          <Route index element={<ProductList />} />
          <Route path=":id" element={<ProductDetail />} />
          <Route path=":id/edit" element={<ProductEdit />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
}
\`\`\`

## Programmatic Navigation

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard', { replace: true }); // Replace history entry
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => navigate(-1)}>Go Back</button> {/* History back */}
      <button onClick={() => navigate('/help')}>Help</button>
    </div>
  );
}
\`\`\`

## Query Parameters

\`\`\`jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';

  const updateFilter = (key, value) => {
    setSearchParams(prev => {
      prev.set(key, value);
      return prev;
    });
  };

  return (
    <div>
      <select value={category} onChange={e => updateFilter('category', e.target.value)}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <p>Current URL: ?category={category}&sort={sort}</p>
    </div>
  );
}
\`\`\`

## Route Guards (Protected Routes)

\`\`\`jsx
function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, but remember where they were going
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Routes>
  <Route path="/dashboard" element={
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  } />
  <Route path="/login" element={<Login />} />
</Routes>
\`\`\`

## Lazy Loading Routes

\`\`\`jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`
`,
      interviewQuestions: [
        {
          question:
            "How does React Router differ from traditional server-side routing?",
          answer: `**Traditional routing**: Each URL change triggers a full page request to the server. The server sends back a new HTML document. The browser reloads all assets (CSS, JS, images). This causes a full-page flash.

**React Router (client-side routing)**: When the URL changes, React Router intercepts the navigation, prevents the full page reload, and renders a different component **on the client**. Only the necessary data (often JSON via API) is fetched. Benefits include:
- Faster navigation (no full page reload).
- Smoother transitions (no flash).
- Persistent state across "pages."
- Less server load (static assets loaded once).

React Router uses the HTML5 History API (\`pushState\`, \`popstate\`) to manipulate the URL.`,
        },
        {
          question:
            "What is the difference between Link, NavLink, and useNavigate in React Router?",
          answer: `1. **\`<Link to="/path">\`** — Renders an \`<a>\` tag that navigates to the specified route. Use for standard navigation links.
2. **\`<NavLink to="/path">\`** — Like Link, but applies an \`active\` class (or custom className function) when the current URL matches. Use for navigation menus where you want to highlight the active page.
3. **\`useNavigate()\`** — A hook that returns a \`navigate\` function for **programmatic navigation**. Use when you need to redirect after an action (form submission, login, API response).

\`\`\`jsx
// Declarative
<Link to="/dashboard">Dashboard</Link>

// Active-aware (navigation menus)
<NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
  Dashboard
</NavLink>

// Programmatic (after login)
const navigate = useNavigate();
<button onClick={() => { login(); navigate('/dashboard'); }}>
  Login
</button>
\`\`\``,
        },
        {
          question:
            "How do you create protected routes (route guards) in React Router?",
          answer: `Create a wrapper component that checks authentication and conditionally renders children or redirects:

\`\`\`jsx
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// Usage
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  }
/>
\`\`\`

For role-based access:
\`\`\`jsx
function RoleGuard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (!roles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return children;
}
\`\`\`

This pattern keeps auth logic centralized and routes declarative.`,
        },
        {
          question: "Explain the Outlet component in React Router v6.",
          answer: `\`<Outlet />\` is used in **nested routing**. When a parent route has child routes, the parent component renders \`<Outlet />\` as a placeholder where child components will appear.

\`\`\`jsx
<Routes>
  <Route path="/" element={<AppLayout />}>
    <Route index element={<Home />} />
    <Route path="products" element={<Products />} />
  </Route>
</Routes>

function AppLayout() {
  return (
    <div>
      <Header />
      <main>
        <Outlet /> {/* <Home /> or <Products /> renders here */}
      </main>
      <Footer />
    </div>
  );
}
\`\`\`

Benefits:
- Shared layout without repeating code.
- Layout components control where children appear.
- Nested routes create URLs like \`/products\` and \`/products/123\`.`,
        },
      ],
      practicalTask: {
        scenario:
          "You're building an e-commerce app with product listing, product detail, shopping cart, checkout, and user profile pages. You need: protected routes (auth required for checkout/profile), lazy loading for performance, nested layouts for the product section, and query parameters for filtering/sorting.",
        task: "Create a complete route structure with: (1) BrowserRouter setup, (2) Layout component with header/nav/footer using Outlet, (3) Nested product routes (/products, /products/:id), (4) Protected checkout and profile routes, (5) Lazy loading for each page, (6) Navigation links with NavLink, (7) A NotFound catch-all route.",
        solutionCode: `import { lazy, Suspense } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Outlet,
  Navigate,
  useLocation
} from 'react-router-dom';

// ========== Lazy Loaded Pages ==========
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Profile = lazy(() => import('./pages/Profile'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ========== Loading Fallback ==========
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <p>Loading page...</p>
      </div>
    </div>
  );
}

// ========== Auth Context (Simplified) ==========
function useAuth() {
  return { user: null, isAuthenticated: false }; // Mock: always false
}

// ========== Protected Route ==========
function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ========== Layout ==========
function Layout() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        background: '#2c3e50',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <NavLink to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: 20 }}>
          🛍️ ShopApp
        </NavLink>
        <nav style={{ display: 'flex', gap: 16 }}>
          <NavLink to="/products" style={navStyle}>Products</NavLink>
          <NavLink to="/cart" style={navStyle}>Cart</NavLink>
          {isAuthenticated ? (
            <NavLink to="/profile" style={navStyle}>Profile</NavLink>
          ) : (
            <NavLink to="/login" style={navStyle}>Login</NavLink>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24, maxWidth: 1200, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: '#f8f9fa',
        padding: 16,
        textAlign: 'center',
        color: '#888',
        fontSize: 14
      }}>
        © 2024 ShopApp — Built with React Router
      </footer>
    </div>
  );
}

const navStyle = ({ isActive }) => ({
  color: isActive ? '#3498db' : '#ecf0f1',
  textDecoration: 'none',
  fontWeight: isActive ? 600 : 400,
  padding: '4px 8px',
  borderBottom: isActive ? '2px solid #3498db' : '2px solid transparent'
});

// ========== App ==========
function EcommerceApp() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Pages with layout */}
            <Route index element={<Home />} />
            <Route path="products" element={<Outlet />}>
              <Route index element={<Products />} />
              <Route path=":id" element={<ProductDetail />} />
            </Route>
            <Route path="cart" element={<Cart />} />
            
            {/* Protected routes */}
            <Route path="checkout" element={
              <RequireAuth><Checkout /></RequireAuth>
            } />
            <Route path="profile" element={
              <RequireAuth><Profile /></RequireAuth>
            } />
            
            {/* Public */}
            <Route path="login" element={<Login />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

// ========== Sample Page Components ==========
function Home() {
  return (
    <div>
      <h1>🏠 Welcome to ShopApp</h1>
      <p>Browse our products and enjoy shopping!</p>
      <NavLink to="/products" style={{
        display: 'inline-block',
        padding: '12px 24px',
        background: '#3498db',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: 8
      }}>
        Shop Now
      </NavLink>
    </div>
  );
}

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'all';

  return (
    <div>
      <h1>📦 Products</h1>
      <div style={{ marginBottom: 16 }}>
        <label>Category: </label>
        <select value={category} onChange={e => setSearchParams({ category: e.target.value })}>
          <option value="all">All</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
        </select>
        <span style={{ marginLeft: 16, color: '#888' }}>
          Current filter: {category}
        </span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
        {[1, 2, 3, 4].map(id => (
          <NavLink key={id} to={\`/products/\${id}\`} style={{
            padding: 20,
            border: '1px solid #ddd',
            borderRadius: 8,
            textDecoration: 'none',
            color: 'inherit'
          }}>
            <h3>Product #{id}</h3>
            <p>Click to view details</p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        ← Back
      </button>
      <h1>Product #{id}</h1>
      <p>Detailed product information goes here.</p>
      <button onClick={() => navigate('/cart')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Add to Cart
      </button>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>🛒 Shopping Cart</h1>
      <p>Your cart is currently empty.</p>
      <button onClick={() => navigate('/checkout')} style={{ padding: '8px 16px', cursor: 'pointer' }}>
        Proceed to Checkout
      </button>
    </div>
  );
}

function Checkout() {
  return <h1>💳 Checkout</h1>;
}

function Profile() {
  return <h1>👤 User Profile</h1>;
}

function Login() {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div>
      <h1>🔐 Login</h1>
      <p>You need to log in to access: <strong>{from}</strong></p>
      <p style={{ color: '#888', fontSize: 14 }}>
        (In a real app, this would show a login form. After login, you'd be redirected back to {from}.)
      </p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <h1>404</h1>
      <p>Page not found.</p>
    </div>
  );
}`,
      },
    },

    // ==================== TOPIC 16: Advanced Patterns ====================
    {
      slug: "advanced-react-patterns",
      title: "16. Advanced React Patterns",
      order: 16,
      content: `
# Advanced React Patterns

## 1. Higher-Order Components (HOC)

A **Higher-Order Component** is a function that takes a component and returns a new enhanced component. Before hooks, HOCs were the primary way to reuse logic.

\`\`\`jsx
// HOC that adds loading state to any component
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div className="spinner">Loading...</div>;
    }
    return <WrappedComponent {...props} />;
  };
}

// Usage
const UserListWithLoading = withLoading(UserList);

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  return <UserListWithLoading isLoading={loading} users={users} />;
}
\`\`\`

### HOC Patterns

\`\`\`jsx
// 1. Props Proxy — manipulates props before passing to wrapped
function withLogging(WrappedComponent) {
  return function(props) {
    useEffect(() => {
      console.log('Component received props:', props);
    });
    return <WrappedComponent {...props} />;
  };
}

// 2. Conditional rendering
function withAuth(WrappedComponent) {
  return function AuthComponent(props) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}
\`\`\`

## 2. Render Props Pattern

A component with a **render prop** takes a function that returns a React element and calls it instead of implementing its own rendering.

\`\`\`jsx
// Component that tracks mouse position
function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return render(position);
}

// Usage
<MouseTracker render={({ x, y }) => (
  <h1>The mouse is at ({x}, {y})</h1>
)} />
\`\`\`

### Children as Function

\`\`\`jsx
function DataFetcher({ url, children }) {
  const { data, loading, error } = useFetch(url);

  return children({ data, loading, error });
}

// Usage
<DataFetcher url="/api/users">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error} />;
    return <UserList users={data} />;
  }}
</DataFetcher>
\`\`\`

## 3. Compound Components

A set of components that work together implicitly, sharing state via Context.

\`\`\`jsx
// Menu with items that auto-close when clicked
const MenuContext = createContext();

function Menu({ children }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen(prev => !prev), []);
  const close = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, toggle, close }), [open]);

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

Menu.Trigger = function Trigger({ children }) {
  const { toggle } = useContext(MenuContext);
  return <button onClick={toggle}>{children}</button>;
};

Menu.Dropdown = function Dropdown({ children }) {
  const { open } = useContext(MenuContext);
  if (!open) return null;
  return <div className="dropdown">{children}</div>;
};

Menu.Item = function Item({ onClick, children }) {
  const { close } = useContext(MenuContext);
  const handleClick = () => {
    onClick?.();
    close();
  };
  return <div className="menu-item" onClick={handleClick}>{children}</div>;
};

// Usage
<Menu>
  <Menu.Trigger>Open Menu</Menu.Trigger>
  <Menu.Dropdown>
    <Menu.Item onClick={() => console.log('Edit')}>Edit</Menu.Item>
    <Menu.Item onClick={() => console.log('Delete')}>Delete</Menu.Item>
    <Menu.Item onClick={() => console.log('Share')}>Share</Menu.Item>
  </Menu.Dropdown>
</Menu>
\`\`\`

## 4. Controlled Props Pattern

A component that can be controlled externally (like a controlled input) or manage its own state internally.

\`\`\`jsx
function Toggle({ on, onChange }) {
  // Internal state as fallback
  const [internalOn, setInternalOn] = useState(false);
  
  // Use external value if provided, otherwise internal state
  const isOn = on !== undefined ? on : internalOn;
  
  const handleToggle = () => {
    if (onChange) {
      onChange(!isOn); // Controlled
    } else {
      setInternalOn(!isOn); // Uncontrolled
    }
  };

  return (
    <button onClick={handleToggle} className={isOn ? 'active' : ''}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}

// Uncontrolled (manages its own state)
<Toggle />

// Controlled (parent manages state)
const [isDark, setIsDark] = useState(false);
<Toggle on={isDark} onChange={setIsDark} />
\`\`\`

## 5. State Reducer Pattern

Allows consumers to override internal state transitions — inspired by Downshift (the autocomplete library).

\`\`\`jsx
function useToggle({ reducer = (state, action) => state } = {}) {
  const [state, dispatch] = useReducer(
    (state, action) => reducer(state, action) ?? state,
    { on: false }
  );

  const toggle = () => dispatch({ type: 'toggle' });
  const setOn = () => dispatch({ type: 'set-on' });
  const setOff = () => dispatch({ type: 'set-off' });

  return { on: state.on, toggle, setOn, setOff, dispatch };
}

// Default behavior
const { on, toggle } = useToggle();

// Custom behavior: only allow turning ON, prevent turning OFF
const { on, toggle } = useToggle({
  reducer: (state, action) => {
    if (action.type === 'toggle' && state.on) {
      return state; // Prevent toggling off
    }
    return { on: action.type === 'set-on' || (action.type === 'toggle' && !state.on) };
  }
});
\`\`\`

## When to Use Which Pattern

| Pattern | Use Case |
|---------|----------|
| HOC | Cross-cutting concerns (logging, auth, permissions) |
| Render Props | Sharing stateful logic with flexible rendering |
| Compound Components | Related components that share implicit state (select, tabs, menu) |
| Controlled Props | Flexible components usable in controlled/uncontrolled mode |
| State Reducer | Components that need customizable behavior |
| Custom Hooks | Most modern use cases for reusable logic (preferred over HOCs/render props) |
`,
      interviewQuestions: [
        {
          question:
            "What is a Higher-Order Component (HOC) and how does it compare to hooks?",
          answer: `An HOC is a function that takes a component and returns a new component with enhanced functionality. For example:

\`\`\`jsx
function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    if (!user) return <LoginPrompt />;
    return <Component {...props} user={user} />;
  };
}
\`\`\`

**Hooks vs HOCs:**
- Hooks are simpler and more intuitive (no wrapper components).
- Hooks avoid "wrapper hell" (deeply nested HOCs).
- Hooks compose more naturally (\`useA(useB())\` vs \`withA(withB(Comp))\`).
- Hooks are the modern standard — React team recommends hooks over HOCs for new code.

HOCs are still useful for cross-cutting concerns at the component level (e.g., wrapping a component with ErrorBoundary) or when using class components.`,
        },
        {
          question:
            "What is the render props pattern and when would you use it?",
          answer: `Render props is a pattern where a component takes a function (as a prop or as \`children\`) that returns JSX. The component calls this function, passing it data/state, allowing the consumer to control rendering.

\`\`\`jsx
<MouseTracker>
  {({ x, y }) => <div>Mouse at {x}, {y}</div>}
</MouseTracker>
\`\`\`

Use render props when:
1. You need to share stateful logic but let the consumer control the UI.
2. Building libraries/components that are rendering-agnostic.
3. You need more flexibility than HOCs (HOCs create fixed wrappers).

However, for most use cases, **custom hooks** are now preferred since they achieve the same goal without nesting or render callback closures.`,
        },
        {
          question: "What are compound components? Give an example.",
          answer: `Compound components are a group of related components that share implicit state through context. They work together to form a cohesive unit while giving the consumer fine-grained control over rendering.

Example: \`<select>\` and \`<option>\` in HTML are compound components — they work together but can be arranged flexibly.

In React, a typical implementation:

\`\`\`jsx
<Tabs>
  <TabList>
    <Tab>Tab 1</Tab>
    <Tab>Tab 2</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Content 1</TabPanel>
    <TabPanel>Content 2</TabPanel>
  </TabPanels>
</Tabs>
\`\`\`

The \`Tabs\` component manages which tab is active via context, and \`Tab\`/\`TabPanel\` consume that context. Benefits include clean API, flexibility in layout, and implicit state sharing.`,
        },
        {
          question:
            "Explain the controlled/uncontrolled component pattern and when you'd implement it.",
          answer: `A **controlled** component is fully controlled by the parent — its value is passed via prop and changes go through a callback. An **uncontrolled** component manages its own internal state.

The **controlled props pattern** supports both modes:

\`\`\`jsx
function Accordion({ expanded, onToggle }) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;
  
  const handleToggle = () => {
    onToggle ? onToggle(!isExpanded) : setInternalExpanded(!isExpanded);
  };

  return (
    <div>
      <button onClick={handleToggle}>Toggle</button>
      {isExpanded && <Content />}
    </div>
  );
}
\`\`\`

Implement this when building reusable UI primitives (inputs, modals, accordions, toggles) that consumers might want to control externally. The rule of thumb: if it has internal state that consumers might need to read or set, consider supporting the controlled pattern.`,
        },
      ],
      practicalTask: {
        scenario:
          "You need to build a reusable table component that supports: (1) sorting by any column, (2) filtering with a search input, (3) pagination, (4) a custom row renderer, (5) selectable rows. The component should use multiple advanced patterns: compound components for the public API, controlled props for sort/filter state, and render props for the row rendering.",
        task: "Create a SmartTable component system using: (1) compound components (SmartTable, SmartTable.Column, SmartTable.Header, SmartTable.Body, SmartTable.Row), (2) Context for internal state sharing, (3) controlled props for sort state (sortBy, sortOrder, onSort), (4) children as function for row rendering, (5) React.memo for row optimization, (6) useMemo for derived data (sorted/filtered/paginated).",
        solutionCode: `import { createContext, useContext, useState, useMemo, useCallback, memo } from 'react';

// ========== Context ==========
const TableContext = createContext(null);

function useTableContext() {
  const ctx = useContext(TableContext);
  if (!ctx) throw new Error('Table components must be used within SmartTable');
  return ctx;
}

// ========== SmartTable (Root - manages state) ==========
function SmartTable({
  data,
  defaultSortBy,
  defaultSortOrder = 'asc',
  sortBy: controlledSortBy,
  sortOrder: controlledSortOrder,
  onSort,
  pageSize = 10,
  searchKeys = [],
  children
}) {
  // Sort state (controlled or internal)
  const [internalSortBy, setInternalSortBy] = useState(defaultSortBy || '');
  const [internalSortOrder, setInternalSortOrder] = useState(defaultSortOrder);

  const activeSortBy = controlledSortBy !== undefined ? controlledSortBy : internalSortBy;
  const activeSortOrder = controlledSortOrder !== undefined ? controlledSortOrder : internalSortOrder;

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Handle sort change
  const handleSort = useCallback((column) => {
    const newOrder = activeSortBy === column && activeSortOrder === 'asc' ? 'desc' : 'asc';
    if (onSort) {
      onSort(column, newOrder);
    } else {
      setInternalSortBy(column);
      setInternalSortOrder(newOrder);
    }
  }, [activeSortBy, activeSortOrder, onSort]);

  // Derived: filtered + sorted + paginated data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery && searchKeys.length > 0) {
      const q = searchQuery.toLowerCase();
      result = result.filter(row =>
        searchKeys.some(key =>
          String(row[key]).toLowerCase().includes(q)
        )
      );
    }

    // Sort
    if (activeSortBy) {
      result.sort((a, b) => {
        const aVal = a[activeSortBy];
        const bVal = b[activeSortBy];
        
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return activeSortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        }
        
        return activeSortOrder === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }

    return result;
  }, [data, searchQuery, activeSortBy, activeSortOrder, searchKeys]);

  const totalPages = Math.max(1, Math.ceil(processedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, page, pageSize]);

  // Reset page when filter/sort changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeSortBy, activeSortOrder]);

  const contextValue = useMemo(() => ({
    data: paginatedData,
    totalItems: processedData.length,
    totalPages,
    page,
    setPage,
    pageSize,
    searchQuery,
    setSearchQuery,
    searchKeys,
    sortBy: activeSortBy,
    sortOrder: activeSortOrder,
    onSort: handleSort
  }), [paginatedData, processedData.length, totalPages, page, pageSize, searchQuery, searchKeys, activeSortBy, activeSortOrder, handleSort]);

  return (
    <TableContext.Provider value={contextValue}>
      <div className="smart-table">{children}</div>
    </TableContext.Provider>
  );
}

// ========== Search Input ==========
SmartTable.Search = function SearchInput({ placeholder = 'Search...' }) {
  const { searchQuery, setSearchQuery, searchKeys } = useTableContext();
  if (searchKeys.length === 0) return null;

  return (
    <input
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      placeholder={placeholder}
      style={{
        marginBottom: 12,
        padding: '8px 12px',
        border: '1px solid #ddd',
        borderRadius: 4,
        width: '100%',
        boxSizing: 'border-box'
      }}
    />
  );
};

// ========== Table element ==========
SmartTable.Table = function Table({ children }) {
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: 14
    }}>
      {children}
    </table>
  );
};

// ========== Header ==========
SmartTable.Head = function Head({ children }) {
  return <thead>{children}</thead>;
};

SmartTable.HeaderRow = function HeaderRow({ children }) {
  return <tr>{children}</tr>;
};

SmartTable.HeaderCell = function HeaderCell({ column, children }) {
  const { sortBy, sortOrder, onSort } = useTableContext();
  const isSorted = sortBy === column;

  return (
    <th
      onClick={column ? () => onSort(column) : undefined}
      style={{
        padding: '10px 12px',
        textAlign: 'left',
        borderBottom: '2px solid #ddd',
        cursor: column ? 'pointer' : 'default',
        userSelect: 'none',
        background: isSorted ? '#f0f8ff' : 'transparent'
      }}
    >
      {children}
      {isSorted && (
        <span style={{ marginLeft: 4 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>
      )}
    </th>
  );
};

// ========== Body ==========
SmartTable.Body = function Body({ renderRow }) {
  const { data } = useTableContext();

  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={100} style={{ textAlign: 'center', padding: 40, color: '#888' }}>
            No data found.
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((row, i) => (
        <SmartTableRow key={row.id || i} row={row} renderRow={renderRow} />
      ))}
    </tbody>
  );
};

const SmartTableRow = memo(function SmartTableRow({ row, renderRow }) {
  return <tr>{renderRow(row)}</tr>;
});

// ========== Pagination ==========
SmartTable.Pagination = function Pagination() {
  const { page, setPage, totalPages, totalItems, pageSize } = useTableContext();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
      fontSize: 14
    }}>
      <span style={{ color: '#888' }}>
        Showing {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalItems)} of {totalItems}
      </span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={() => setPage(1)} disabled={page === 1}>««</button>
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>«</button>
        <span style={{ padding: '4px 12px' }}>{page} / {totalPages}</span>
        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>»</button>
        <button onClick={() => setPage(totalPages)} disabled={page === totalPages}>»»</button>
      </div>
    </div>
  );
};

// ========== Usage Example ==========
const sampleData = Array.from({ length: 53 }, (_, i) => ({
  id: i + 1,
  name: \`Product \${i + 1}\`,
  category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
  price: Math.round(Math.random() * 500 * 100) / 100,
  stock: Math.floor(Math.random() * 100),
  rating: Math.round((Math.random() * 4 + 1) * 10) / 10
}));

function ProductTable() {
  const [controlledSort, setControlledSort] = useState({ by: 'name', order: 'asc' });

  const handleSort = useCallback((sortBy, sortOrder) => {
    setControlledSort({ by: sortBy, order: sortOrder });
    console.log('Sort changed:', sortBy, sortOrder);
  }, []);

  return (
    <SmartTable
      data={sampleData}
      sortBy={controlledSort.by}
      sortOrder={controlledSort.order}
      onSort={handleSort}
      pageSize={8}
      searchKeys={['name', 'category']}
    >
      <h3>📦 Product Inventory</h3>
      <SmartTable.Search placeholder="Search by name or category..." />
      <SmartTable.Table>
        <SmartTable.Head>
          <SmartTable.HeaderRow>
            <SmartTable.HeaderCell column="id">#</SmartTable.HeaderCell>
            <SmartTable.HeaderCell column="name">Name</SmartTable.HeaderCell>
            <SmartTable.HeaderCell column="category">Category</SmartTable.HeaderCell>
            <SmartTable.HeaderCell column="price">Price</SmartTable.HeaderCell>
            <SmartTable.HeaderCell column="stock">Stock</SmartTable.HeaderCell>
            <SmartTable.HeaderCell column="rating">Rating</SmartTable.HeaderCell>
          </SmartTable.HeaderRow>
        </SmartTable.Head>
        <SmartTable.Body
          renderRow={(row) => (
            <>
              <td style={{ padding: '8px 12px', color: '#888' }}>{row.id}</td>
              <td style={{ padding: '8px 12px', fontWeight: 500 }}>{row.name}</td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  background: '#f0f0f0'
                }}>
                  {row.category}
                </span>
              </td>
              <td style={{ padding: '8px 12px', fontFamily: 'monospace' }}>
                \${row.price.toFixed(2)}
              </td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{
                  color: row.stock < 20 ? '#e74c3c' : '#2ecc71',
                  fontWeight: 600
                }}>
                  {row.stock}
                </span>
              </td>
              <td style={{ padding: '8px 12px' }}>
                {'★'.repeat(Math.floor(row.rating))}{'☆'.repeat(5 - Math.floor(row.rating))}
                {' '}{row.rating}
              </td>
            </>
          )}
        />
      </SmartTable.Table>
      <SmartTable.Pagination />
    </SmartTable>
  );
}`,
      },
    },

    // ==================== TOPIC 17: React 18 Features ====================
    {
      slug: "react-18-features",
      title: "17. React 18 & Beyond",
      order: 17,
      content: `
# React 18 — Concurrent Features & Beyond

## What's New in React 18

React 18 introduced **concurrent rendering** — a behind-the-scenes mechanism that lets React prepare multiple versions of the UI at the same time. This is opt-in and enables new features.

### Key Additions

1. **Automatic Batching** — More state updates are batched together.
2. **Transitions** — Mark certain updates as non-urgent.
3. **Suspense Improvements** — Streaming SSR, selective hydration.
4. **New Hooks** — \`useId\`, \`useTransition\`, \`useDeferredValue\`, \`useSyncExternalStore\`.
5. **Strict Mode Changes** — Detects more potential bugs.

## 1. Automatic Batching

In React 17, only \`setState\` in event handlers was batched. In React 18, **all** state updates are batched — including those in promises, setTimeout, and native event handlers.

\`\`\`jsx
// Before React 18 — causes 2 re-renders
setTimeout(() => {
  setCount(prev => prev + 1);
  setFlag(prev => !prev);
}, 1000);

// React 18 — batched into 1 re-render!
// (Zero code changes needed — just upgrade to React 18)
\`\`\`

To opt out of batching (rarely needed), use \`flushSync\`:

\`\`\`jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount(prev => prev + 1); // Flushes immediately
});
flushSync(() => {
  setFlag(prev => !prev);     // Second render
});
\`\`\`

## 2. useTransition — Non-Urgent Updates

\`useTransition\` lets you mark some state updates as **transitions** that React can interrupt to handle more urgent updates (like typing):

\`\`\`jsx
import { useState, useTransition } from 'react';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // Urgent: update input immediately (keeps UI responsive)
    setQuery(value);

    // Non-urgent: filter results — can be interrupted by typing
    startTransition(() => {
      setResults(filterSearchResults(value));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />} {/* Show during transition */}
      <ResultsList results={results} />
    </div>
  );
}
\`\`\`

### How Transitions Work

1. User types a character → \`setQuery\` runs immediately (urgent).
2. The transition (\`startTransition\`) starts filtering.
3. If the user types more characters, React **interrupts** the transition.
4. The transition restarts with the new query value.
5. \`isPending\` is \`true\` during the transition.

## 3. useDeferredValue — Deferring Expensive Re-renders

\`useDeferredValue\` is similar to \`useTransition\` but designed for when you can't control the state update (e.g., the state comes from a parent or external source):

\`\`\`jsx
import { useState, useDeferredValue, useMemo } from 'react';

function ProductList({ products, filterText }) {
  // Defer the filtered value — this component can lag behind
  const deferredFilter = useDeferredValue(filterText);

  const filteredProducts = useMemo(() => {
    // Expensive computation uses the deferred (slower) value
    return products.filter(p =>
      p.name.toLowerCase().includes(deferredFilter.toLowerCase())
    );
  }, [products, deferredFilter]);

  const isStale = filterText !== deferredFilter;

  return (
    <div>
      {isStale && <div className="spinner" />}
      {filteredProducts.map(p => <Product key={p.id} {...p} />)}
    </div>
  );
}
\`\`\`

## 4. Suspense on the Server (Streaming SSR)

\`\`\`jsx
// The server sends HTML progressively — no need to wait for everything
<Layout>
  <NavBar />
  <Suspense fallback={<Spinner />}>
    <Comments /> {/* Server streams this when ready */}
  </Suspense>
  <Suspense fallback={<Spinner />}>
    <Sidebar /> {/* Server streams independently */}
  </Suspense>
</Layout>
\`\`\`

## 5. New Strict Mode

\`\`\`jsx
<React.StrictMode>
  <App />
</React.StrictMode>
\`\`\`

In development, Strict Mode now **mounts → unmounts → remounts** every component to detect:
- Missing cleanup in \`useEffect\`.
- Impure render logic.
- Incorrect usage of state initialization.

## 6. useId — Generating Unique IDs

\`\`\`jsx
import { useId } from 'react';

function FormField({ label }) {
  const id = useId(); // Unique, stable ID across server + client

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input id={id} type="text" />
    </div>
  );
}
\`\`\`

## React 19 Preview (Coming Next)

- **React Compiler** (previously "React Forget") — automatically memoizes components, eliminating the need for manual \`useMemo\`/\`useCallback\`/\`React.memo\`.
- **Server Components** — Components that run only on the server, reducing client bundle size.
- **Actions** — Built-in form handling with pending states and optimistic updates.
- **New Asset Loading** — \`<title>\`, \`<meta>\`, loading states for images/fonts.
`,
      interviewQuestions: [
        {
          question:
            "What is concurrent rendering in React 18 and how does it improve UX?",
          answer: `Concurrent rendering is a **behind-the-scenes mechanism** that allows React to prepare multiple versions of the UI at the same time. It's not a user-facing feature but enables new capabilities like Transitions.

How it improves UX:
1. **Interruptible rendering** — React can pause a heavy render to respond to urgent input (typing, clicking).
2. **Keeps the UI responsive** — No more janky inputs that lag behind keystrokes.
3. **Selective hydration** — The server can stream HTML, and the client can hydrate parts progressively.

Concurrent features are opt-in via \`startTransition\` and \`useDeferredValue\`. Existing code continues to work without changes — concurrent mode just enables smoother updates when you use these new APIs.`,
        },
        {
          question:
            "Explain useTransition and useDeferredValue. How are they different?",
          answer: `Both help keep the UI responsive by deferring non-urgent updates, but they're used in different scenarios:

**\`useTransition\`**: You control the update. Wrap a state setter in \`startTransition\`.

\`\`\`jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setResults(newData));
\`\`\`

**\`useDeferredValue\`**: The state comes from outside (parent prop, external store). You can't control the update, but you can create a deferred copy.

\`\`\`jsx
const deferredValue = useDeferredValue(value);
// Use deferredValue for expensive work, show stale indicator if different
\`\`\`

**Key difference**: \`useTransition\` wraps the update; \`useDeferredValue\` wraps the value. Both allow React to interrupt the work if a higher-priority update (like keystroke) comes in.`,
        },
        {
          question:
            "What is automatic batching in React 18 and why is it important?",
          answer: `**Automatic batching** means multiple state updates within the same event loop tick are grouped into a single re-render. In React 17, this only happened in React event handlers. In React 18, it happens everywhere — in promises, setTimeout, native event handlers, and async functions.

\`\`\`jsx
// React 18: Single re-render
fetch('/api/data').then(() => {
  setData(result);    // Batched!
  setLoading(false);  // Batched!
});

// React 17: Two separate re-renders
fetch('/api/data').then(() => {
  setData(result);    // Re-render 1
  setLoading(false);  // Re-render 2
});
\`\`\`

This is important because it **reduces unnecessary re-renders**, improves performance for async flows, and makes behavior more predictable. No code changes are needed — it works automatically after upgrading to React 18.`,
        },
        {
          question:
            "What changes does React 18's Strict Mode introduce for development?",
          answer: `React 18's Strict Mode now **mounts → unmounts → remounts** every component in development. This simulates behavior that happens in production when a component is mounted, hidden (e.g., with Suspense/tabbing away), and then remounted.

This helps detect:
1. **Missing cleanup** in useEffect — if your effect subscribes but doesn't clean up, you'll see duplicate subscriptions.
2. **Impure render logic** — if your render function has side effects (like modifying shared state), they'll run twice and you'll spot the issue.
3. **Incorrect state initialization** — if you rely on state being computed only once without lazy initialization, you'll see it run twice.

To opt out of this behavior for specific components (not recommended), you can wrap them in a non-Strict container.`,
        },
      ],
      practicalTask: {
        scenario:
          "You have a search-heavy application where users type queries and get filtered results from a large dataset. The filtering operation is CPU-intensive and causes the input to lag behind keystrokes. You need to implement a responsive search experience using React 18's concurrent features.",
        task: "Create a LargeDataSearch component that: (1) renders a search input that stays responsive during filtering, (2) uses useTransition to mark results filtering as non-urgent, (3) shows a loading indicator during transitions, (4) has a large dataset (generated) that simulates heavy computation, (5) includes a comparison mode where you can toggle transition on/off to see the difference.",
        solutionCode: `import { useState, useTransition, useDeferredValue, useMemo, memo } from 'react';

// ========== Generate Large Dataset ==========
const generateLargeDataset = () => {
  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Food'];
  const brands = ['TechPro', 'StyleMax', 'ReadWell', 'HomeCo', 'SportFit', 'GlowUp', 'FreshEats'];
  
  return Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: \`\${brands[i % brands.length]} \${['Widget', 'Gadget', 'Tool', 'Kit', 'Pack', 'Set', 'Bundle'][i % 7]} #\${i + 1}\`,
    category: categories[i % categories.length],
    price: Math.round((Math.random() * 500 + 5) * 100) / 100,
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
    description: \`A high-quality product from \${brands[i % brands.length]}, perfect for your needs.\`
  }));
};

// ========== Expensive Filter Function ==========
function filterProducts(products, query) {
  // Simulate expensive computation with a small delay
  const start = Date.now();
  while (Date.now() - start < 2) { /* busy wait */ }

  if (!query.trim()) return products;

  const q = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q)
  );
}

// ========== Product Card (Memoized) ==========
const ProductCard = memo(function ProductCard({ product }) {
  // Simulate expensive rendering for demo purposes
  const start = Date.now();
  while (Date.now() - start < 0.1) { /* slight render cost */ }

  return (
    <div style={{
      padding: 12,
      border: '1px solid #eee',
      borderRadius: 8,
      background: '#fff'
    }}>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{product.name}</div>
      <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
        {product.category} · ⭐ {product.rating}
      </div>
      <div style={{ fontWeight: 'bold', color: '#2ecc71', marginTop: 4 }}>
        \${product.price.toFixed(2)}
      </div>
    </div>
  );
});

// ========== Product Grid ==========
function ProductGrid({ products }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 12,
      marginTop: 16
    }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ========== Main Search Component ==========
function LargeDataSearch() {
  const [data] = useState(() => generateLargeDataset());
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(data);
  const [useTransitions, setUseTransitions] = useState(true);
  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Urgent: update input immediately

    if (useTransitions) {
      // Non-urgent: filtering can be interrupted
      startTransition(() => {
        setResults(filterProducts(data, value));
      });
    } else {
      // Without transitions: may cause jank
      setResults(filterProducts(data, value));
    }
  };

  const isStale = query !== deferredQuery;

  // Stats
  const renderTime = useMemo(() => {
    const start = performance.now();
    const filtered = filterProducts(data, query);
    const end = performance.now();
    return { count: filtered.length, time: (end - start).toFixed(1) };
  }, [data, query]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2>🔍 React 18 Concurrent Search Demo</h2>
      
      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        background: '#f8f9fa',
        borderRadius: 8
      }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={useTransitions}
            onChange={e => setUseTransitions(e.target.checked)}
          />
          <strong>Use useTransition</strong>
          <span style={{ fontSize: 12, color: '#888' }}>
            (When off, typing may feel sluggish)
          </span>
        </label>
        
        <span style={{ fontSize: 13, color: '#888', marginLeft: 'auto' }}>
          Data: {data.length.toLocaleString()} items
        </span>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Type to search products..."
          style={{
            width: '100%',
            padding: '14px 16px',
            fontSize: 16,
            border: isPending ? '2px solid #f39c12' : '2px solid #ddd',
            borderRadius: 8,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s'
          }}
        />
        <div style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}>
          {isPending && (
            <span style={{ fontSize: 12, color: '#f39c12', fontWeight: 600 }}>
              Updating...
            </span>
          )}
          {isPending ? '⏳' : '🔍'}
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 24,
        marginTop: 12,
        fontSize: 13,
        color: '#666'
      }}>
        <span>Results: <strong>{renderTime.count}</strong></span>
        <span>Filter time: <strong>{renderTime.time}ms</strong></span>
        {isStale && useTransitions && (
          <span style={{ color: '#f39c12' }}>
            ⚠ Showing results for: "{deferredQuery}" (stale)
          </span>
        )}
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>
          <h3>No products found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <ProductGrid products={results.slice(0, 50)} />
      )}

      {results.length > 50 && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: 13, marginTop: 12 }}>
          Showing 50 of {results.length} results
        </p>
      )}
    </div>
  );
}`,
      },
    },
  ],
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate({ technology: reactDoc.technology }, reactDoc, {
    upsert: true,
    new: true,
  });
  console.log("✅ Comprehensive React docs seeded successfully!");
  console.log(
    `📚 ${reactDoc.topics.length} topics seeded with interview questions and practical tasks.`,
  );
  process.exit(0);
};

run();
