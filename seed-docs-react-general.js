import { replaceDocs } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-beginners-track",
    title: "Getting Started — Beginner Track",
    order: 0,
    content: `
# React Beginner Track — Step by Step

This beginner path is for people who want to learn React from scratch, not just see topic names.

## 1. Create a starter project

Use Vite to create a fresh React app quickly.

\`\`\`bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
\`\`\`

Open \`http://localhost:5173\` and you should see the starter page.

## 2. Understand the project structure

- \`index.html\` contains the empty root element.
- \`src/main.jsx\` mounts the React app.
- \`src/App.jsx\` is the main component.
- \`src/App.css\` stores the app styles.

## 3. Learn JSX and components

JSX is JavaScript that looks like HTML. Components are functions that return JSX.

\`\`\`jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

## 4. Add state with useState

State lets React remember values and update the UI when they change.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

## 5. Handle user input

Use event handlers to respond to clicks and typing.

\`\`\`jsx
function NameForm() {
  const [name, setName] = useState('');
  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <p>Your name is: {name}</p>
    </div>
  );
}
\`\`\`

## 6. What to practice next

- Build a todo list with add/remove behavior.
- Create a reusable card component and render a list.
- Add conditional rendering for login/logout state.

This beginner track gives you a real React learning path, not just a list of topics.
`,
    interviewQuestions: [
      {
        question: "Junior: What file starts the React app and where does the root element live?",
        answer: "The entry is typically `src/main.jsx` which mounts the React tree into a DOM node in `index.html`."
      },
      {
        question: "Mid: How does `useState` update work when using a function setter?",
        answer: "Passing a function to the setter gives the previous state and avoids closure-stale values when updates depend on previous state."
      },
      {
        question: "Senior: How would you explain hot module replacement and why it helps development?",
        answer: "HMR updates modules in the running app without a full reload, preserving state and speeding iteration; it patches changed modules and re-renders affected components."
      }
    ],
    practicalTask: {
      scenario: "You are new and want a focused first task.",
      task: "Create a Counter component in `src/App.jsx` and add a reset button.",
      solutionCode: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`
    }
  },
  {
    slug: "react-introduction",
    title: "1. React Introduction",
    order: 1,
    content: `
# React Introduction — What React Teaches You

This section teaches what React is, why it is useful, and how your first app works.

## What is React?

React is a library for building user interfaces. It lets you define UI as components and keeps the page in sync with data changes.

## Why use React?

- Build reusable UI pieces.
- Manage changing state easily.
- Update only the parts of the DOM that change.

## How React apps are structured

- \`index.html\` contains the root element.
- \`src/main.jsx\` renders the root component.
- \`src/App.jsx\` defines the main application UI.

## Example: a simple counter

\`\`\`jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Counter</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
\`\`\`

## Key takeaways

- Components are functions that return JSX.
- JSX is the syntax React uses for UI.
- State stores changing data and triggers re-renders.

Practice: Open \`src/App.jsx\` and change the displayed text, then save to see hot reload in the browser.
`,
    interviewQuestions: [
      {
        question: "What is React used for?",
        answer: "React is used to build user interfaces using reusable components. It makes it easier to manage complex pages and update only the parts that change."
      },
      {
        question: "What is a component in React?",
        answer: "A component is a self-contained piece of UI. It can be a function that returns JSX or a class that renders UI."
      },
      {
        question: "Why do developers choose React?",
        answer: "Developers choose React because it helps build maintainable UI, supports reusable code, and updates the screen efficiently."
      }
    ],
    practicalTask: {
      scenario: "You want to create a reusable greeting component.",
      task: "Create a simple React component called Greeting that renders a message using a name prop.",
      solutionCode: `import React from "react";

function Greeting({ name }) {
  return <div>Hello, {name}!</div>;
}

export default Greeting;`
    }
  },
  {
    slug: "jsx-and-components",
    title: "2. JSX and Components",
    order: 2,
    content: `
# JSX and Components — Build UI with React

React uses JSX to describe the UI. Components are the reusable pieces of that UI.

## Beginner

JSX looks like HTML but is JavaScript.

\`\`\`jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
\`\`\`

A component is a function that returns JSX. Use props to pass data in.

## Intermediate

Compose smaller components into larger ones.

\`\`\`jsx
function Card({ title, children }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
}
\`\`\`

Then use it like this:

\`\`\`jsx
<Card title="Profile">
  <p>Welcome, Sara</p>
</Card>
\`\`\`

## Advanced

When rendering lists, use keys to help React match items.

\`\`\`jsx
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
\`\`\`

Split large components into small ones and avoid repeating UI logic by extracting reusable components.
`,
    interviewQuestions: [
      {
        question: "What is JSX?",
        answer: "JSX is a syntax that looks like HTML but runs inside JavaScript. React transforms JSX into normal JavaScript calls."
      },
      {
        question: "Can you use React without JSX?",
        answer: "Yes. JSX is optional, but it is easier to write and read than the equivalent React.createElement calls."
      },
      {
        question: "What is the difference between a component and an element?",
        answer: "A React element describes what should appear on the screen. A component is a function or class that returns elements."
      }
    ],
    practicalTask: {
      scenario: "You want to build a simple reusable card.",
      task: "Create a UserCard component that shows a name and a role.",
      solutionCode: `import React from "react";

function UserCard({ name, role }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{role}</p>
    </div>
  );
}

export default UserCard;`
    }
  },
  {
    slug: "props-and-state",
    title: "3. Props and State",
    order: 3,
    content: `
# Props and State — Control Your Data

React separates data into props and state. Props are passed in. State is managed inside a component.

## Beginner

Props are read-only values passed from parent to child.

\`\`\`jsx
function PageTitle({ title }) {
  return <h1>{title}</h1>;
}
\`\`\`

State is local data that changes over time.

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

## Intermediate

When multiple components need the same value, lift state up to their nearest common parent.

\`\`\`jsx
function App() {
  const [name, setName] = useState('Sara');
  return <PageTitle title={name} />;
}
\`\`\`

Pass functions as props for child-to-parent updates.

## Advanced

For complex logic, use \`useReducer\` and immutable updates.

\`\`\`jsx
const initialState = { todos: [] };
function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { ...state, todos: [...state.todos, action.todo] };
    default:
      return state;
  }
}
\`\`\`
`
    interviewQuestions: [
      {
        question: "What are props in React?",
        answer: "Props are read-only values passed from a parent component to a child component."
      },
      {
        question: "What is state in React?",
        answer: "State is data managed inside a component. When state changes, React re-renders the component."
      },
      {
        question: "Should props be modified inside a component?",
        answer: "No. Props are read-only. If data needs to change, update state in the parent and pass a new prop."
      }
    ],
    practicalTask: {
      scenario: "You want one component to show a title passed from another component.",
      task: "Build a PageTitle component that accepts a title prop and displays it.",
      solutionCode: `function PageTitle({ title }) {
  return <h1>{title}</h1>;
}

export default PageTitle;`
    }
  },
  {
    slug: "hooks-overview",
    title: "4. Hooks Overview",
    order: 4,
    content: `
# Hooks Overview — Hands-on Guide

Hooks let functional components hold state and run side effects. Below are the most-used hooks with beginner-friendly examples and common pitfalls.

## useState (local state)

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

Tips: pass a function to the setter when new state depends on previous state.

## useEffect (side effects)

Use \`useEffect\` to run code after render (fetching data, subscriptions).

\`\`\`jsx
import { useEffect, useState } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/users')
      .then(r => r.json())
      .then(data => mounted && setUsers(data));
    return () => { mounted = false; };
  }, []); // empty deps = run once on mount

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
\`\`\`

Common pitfall: forgetting dependency arrays — include all external values used inside the effect or intentionally leave empty for mount-only behavior.

## useRef, useMemo, useCallback (when to use)


- \`useRef\` stores mutable values that survive renders (DOM refs, timers).
- \`useMemo\` memoizes expensive calculations.
- \`useCallback\` memoizes function identities to avoid unnecessary child renders.

Example \`useRef\`:

\`\`\`jsx
import { useRef, useEffect } from 'react';

function FocusableInput() {
  const ref = useRef();
  useEffect(() => { ref.current?.focus(); }, []);
  return <input ref={ref} />;
}
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is useState used for?",
        answer: "useState adds local state to functional components and returns the current value plus a setter."
      },
      {
        question: "When should you use useEffect?",
        answer: "Use useEffect for side effects like fetching data or updating outside the component."
      },
      {
        question: "Why are hooks useful?",
        answer: "Hooks let you use state and lifecycle features without writing class components."
      }
    ],
    practicalTask: {
      scenario: "You want a counter that updates on button clicks.",
      task: "Create a Counter component using useState that increments when clicked.",
      solutionCode: `import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default Counter;`
    }
  },
  {
    slug: "conditional-rendering",
    title: "5. Conditional Rendering",
    order: 5,
    content: `
# Conditional Rendering — Beginner → Advanced

## Beginner

Show different UI using simple expressions (ternary or &&).

\`\`\`jsx
function Welcome({ isLoggedIn }) {
  return isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>;
}
\`\`\`

## Intermediate

Use small rendering helper functions or extract conditional blocks into components to keep JSX readable.

## Advanced

For complex state-driven UI consider state machines (XState) or router-level guards to centralize transitions and reduce bugs.
`,
    interviewQuestions: [
      {
        question: "How do you show different UI in React?",
        answer: "Use expressions inside JSX, like the ternary operator or logical &&."
      },
      {
        question: "What does returning null do?",
        answer: "Returning null tells React to render nothing for that component."
      },
      {
        question: "Can you use if statements inside JSX?",
        answer: "No. Use expressions like ternary or helper functions instead."
      }
    ],
    practicalTask: {
      scenario: "You want to show a welcome message only for logged-in users.",
      task: "Build a Welcome component that displays either a welcome note or a login prompt based on a boolean prop.",
      solutionCode: `function Welcome({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please log in.</p>}
    </div>
  );
}

export default Welcome;`
    }
  },
  {
    slug: "forms-and-events",
    title: "6. Forms and Events",
    order: 6,
    content: `
# Forms and Events — Beginner → Advanced

## Beginner

Start with controlled components: keep input values in state and update them via onChange.

\`\`\`jsx
function NameForm() {
  const [name, setName] = useState('');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}
\`\`\`

## Intermediate

Handle validation and submission using onSubmit and event.preventDefault(), and show inline validation messages.

## Advanced

Use form libraries (React Hook Form, Formik) for performance and complex validation, and integrate with Yup or Zod for schema validation.
`,
    interviewQuestions: [
      {
        question: "What is a controlled component?",
        answer: "A controlled component keeps form values in React state and updates them as the user types."
      },
      {
        question: "How do you handle form submit?",
        answer: "Use an onSubmit handler and call event.preventDefault() to keep the page from reloading."
      },
      {
        question: "Why avoid direct DOM manipulation in React?",
        answer: "React manages the DOM, so direct changes can cause unexpected behavior."
      }
    ],
    practicalTask: {
      scenario: "You want to capture typed text from a form.",
      task: "Create a NameForm component that shows the typed value below the input.",
      solutionCode: `import React, { useState } from "react";

function NameForm() {
  const [name, setName] = useState("");

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>You typed: {name}</p>
    </div>
  );
}

export default NameForm;`
    }
  },
  {
    slug: "react-router-overview",
    title: "7. React Router Overview",
    order: 7,
    content: `
# React Router — Beginner → Advanced

## Beginner

Use react-router-dom to create routes and navigate without full page reloads.

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link></nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Intermediate

Learn nested routes, route params, and programmatic navigation with useNavigate.

## Advanced

Implement route-level data loading, code-splitting with React.lazy, and route guards for authenticated sections.
`,
    interviewQuestions: [
      {
        question: "What is React Router used for?",
        answer: "React Router is used to navigate between pages in a single-page app without reloading the browser."
      },
      {
        question: "What is the difference between Link and an anchor tag?",
        answer: "Link updates the view using React Router, while an anchor tag causes a full page refresh."
      },
      {
        question: "How do you handle an unknown route?",
        answer: "Add a fallback route with path='*' to show a 404 page."
      }
    ],
    practicalTask: {
      scenario: "You want users to move between pages in your app.",
      task: "Build routes for Home and About pages and add links to switch between them.",
      solutionCode: `import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  return <h1>Home</h1>;
}

function About() {
  return <h1>About</h1>;
}

export default App;`
    }
  },
  {
    slug: "react-performance-basics",
    title: "8. React Performance Basics",
    order: 8,
    content: `
# React Performance — Beginner → Advanced

## Beginner

Keep components small and avoid heavy work during render. Use keys for lists.

## Intermediate

Memoize expensive computations with useMemo and avoid recreating functions where unnecessary with useCallback.

## Advanced

Profile your app with the React Profiler, use virtualization for large lists, and optimize reconciliation by reducing the amount of changing DOM.
`,
    interviewQuestions: [
      {
        question: "What causes a React component to re-render?",
        answer: "A component re-renders when its props or state change."
      },
      {
        question: "Why are keys important in lists?",
        answer: "Keys help React track items and update only the changed elements."
      },
      {
        question: "What does React.memo do?",
        answer: "React.memo prevents a functional component from re-rendering when its props have not changed."
      }
    ],
    practicalTask: {
      scenario: "You want to reduce unnecessary renders.",
      task: "Wrap a simple display component with React.memo to skip re-rendering when props are unchanged.",
      solutionCode: `import React from "react";

function ExpensiveComponent({ value }) {
  return <div>{value}</div>;
}

export default React.memo(ExpensiveComponent);`
    }
  },
  {
    slug: "context-and-reducers",
    title: "9. Context and Reducers",
    order: 9,
    content: `
# Context and Reducers — Beginner → Advanced

## Beginner

Use Context to provide simple global values like theme or language.

\`\`\`jsx
const ThemeContext = React.createContext('light');
\`\`\`

## Intermediate

Combine Context with useReducer for predictable state updates when logic becomes complex.

## Advanced

Avoid overusing Context for frequently changing values; prefer localized providers or external stores to minimize unnecessary re-renders.
`,
    interviewQuestions: [
      {
        question: "What is React Context?",
        answer: "Context provides a way to pass data through the component tree without prop drilling."
      },
      {
        question: "When should you use useReducer?",
        answer: "Use useReducer when state logic is complex or depends on previous state."
      },
      {
        question: "How does Context differ from props?",
        answer: "Context is global within a tree, while props are passed directly from parent to child."
      }
    ],
    practicalTask: {
      scenario: "You want to share a theme value with many components.",
      task: "Create a ThemeContext provider and use it in a child component.",
      solutionCode: `import React, { createContext, useContext } from "react";

const ThemeContext = createContext("light");

function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

function DisplayTheme() {
  const theme = useContext(ThemeContext);
  return <div>Theme: {theme}</div>;
}

export { ThemeProvider, DisplayTheme };`
    }
  },
  {
    slug: "testing-and-deployment",
    title: "10. Testing and Deployment",
    order: 10,
    content: `
# Testing and Deployment — Beginner → Advanced

## Beginner

Write simple component tests with React Testing Library to assert rendered output.

\`\`\`jsx
import { render, screen } from '@testing-library/react';
import Hello from './Hello';
test('renders hello', () => { render(<Hello />); expect(screen.getByText(/hello/i)).toBeInTheDocument(); });
\`\`\`

## Intermediate

Add integration tests, test hooks and async behavior, and use mocked network requests for deterministic tests.

## Advanced

Set up CI pipelines, performance budgets, and deploy optimized builds (CDN, caching headers, SSR/ISR strategies).
`,
    interviewQuestions: [
      {
        question: "Why write tests for React apps?",
        answer: "Tests make sure your UI works correctly and help you avoid breaking changes when you update code."
      },
      {
        question: "What is a smoke test?",
        answer: "A smoke test checks that the app starts and the main page renders without crashing."
      },
      {
        question: "How do you deploy a React app?",
        answer: "Build the app and upload the static files to a hosting service or use a platform like Vercel."
      }
    ],
    practicalTask: {
      scenario: "You want to confirm your React component renders correctly.",
      task: "Write a simple test for a component that checks its rendered text.",
      solutionCode: `import { render, screen } from "@testing-library/react";
import Hello from "./Hello";

test("renders hello message", () => {
  render(<Hello />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});`
    }
  },
  {
    slug: "advanced-hooks",
    title: "11. Advanced Hooks and Custom Hooks",
    order: 11,
    content: `
# Advanced Hooks and Custom Hooks — Beginner → Advanced

## Beginner

Custom hooks let you extract reusable logic from components into functions that follow the hook rules.

\`\`\`jsx
import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
\`\`\`

## Intermediate

Use \`useMemo\` and \`useCallback\` to optimize expensive calculations and stable callback references in custom hooks.

## Advanced

Understand \`useLayoutEffect\` for DOM reads before paint and how to build custom hook libraries that can be shared across apps.
`,
    interviewQuestions: [
      {
        question: "When should you create a custom hook?",
        answer: "When you have reusable stateful logic that is used in multiple components, a custom hook keeps the code DRY and easier to reason about."
      },
      {
        question: "Why should hooks only be called at the top level?",
        answer: "Hooks must be called in the same order on every render so React can preserve state between renders. Conditional or looped hook calls break this rule."
      },
      {
        question: "What is the difference between useEffect and useLayoutEffect?",
        answer: "useEffect runs after paint, while useLayoutEffect runs synchronously after DOM mutations and before the browser paints. Use useLayoutEffect when you need to read layout or synchronously apply changes."
      }
    ],
    practicalTask: {
      scenario: "You want reusable window-size tracking logic.",
      task: "Build a useWindowWidth custom hook and use it to render different content for mobile and desktop layouts.",
      solutionCode: `import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

export default useWindowWidth;`
    }
  },
  {
    slug: "data-fetching-and-suspense",
    title: "12. Data Fetching and Suspense",
    order: 12,
    content: `
# Data Fetching and Suspense — Beginner → Advanced

## Beginner

Fetch data in effects and render loading state while the request is pending.

## Intermediate

Use data-fetching hooks, caching, and request deduplication to avoid repeat network calls.

## Advanced

Use React Suspense for data fetching, error boundaries, and concurrent-friendly loading states.
`,
    interviewQuestions: [
      {
        question: "How do you fetch data in a React component?",
        answer: "Use useEffect to fetch data after render and store results in state, while rendering a loading indicator until the data arrives."
      },
      {
        question: "What is Suspense used for in React?",
        answer: "Suspense lets you declaratively wait for asynchronous data or code, showing fallback UI while the content loads."
      },
      {
        question: "Why use an error boundary with data fetching?",
        answer: "Error boundaries catch rendering errors from failed fetches or missing props and prevent the whole app from crashing."
      }
    ],
    practicalTask: {
      scenario: "You need to fetch and show remote data safely.",
      task: "Create a UsersList component that fetches users and renders a loading message while waiting.",
      solutionCode: `import { useState, useEffect } from 'react';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  return <ul>{users.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}

export default UsersList;`
    }
  },
  {
    slug: "state-management-patterns",
    title: "13. State Management Patterns",
    order: 13,
    content: `
# State Management Patterns — Beginner → Advanced

## Beginner

Use component state and pass props down the tree for simple apps.

## Intermediate

Use Context or reducer-based state for shared, predictable state updates.

## Advanced

Use external state libraries, normalized state, and selectors when your app grows large.
`,
    interviewQuestions: [
      {
        question: "When is React Context a good choice?",
        answer: "Context is good for global values that many components read, such as theme, locale, or authenticated user data."
      },
      {
        question: "What problem does useReducer solve?",
        answer: "useReducer is ideal for state that changes in complex ways or depends on previous state, such as form logic or multi-step workflows."
      },
      {
        question: "Why normalize state in large applications?",
        answer: "Normalized state avoids deeply nested objects and makes updates predictable, especially for lists of entities."
      }
    ],
    practicalTask: {
      scenario: "You need to manage a shared list of items.",
      task: "Use useReducer and Context to provide a todo list with add/remove actions to multiple components.",
      solutionCode: `import { createContext, useContext, useReducer } from 'react';

const TodosContext = createContext();

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, { id: Date.now(), text: action.text }];
    case 'REMOVE':
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}

export function TodosProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  return (
    <TodosContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
}

export function useTodos() {
  return useContext(TodosContext);
}`
    }
  },
  {
    slug: "styling-and-accessibility",
    title: "14. Styling and Accessibility",
    order: 14,
    content: `
# Styling and Accessibility — Beginner → Advanced

## Beginner

Use plain CSS files, className, and simple layout rules in React components.

## Intermediate

Use CSS modules, styled-components, or utility-first CSS to keep styles scoped and maintainable.

## Advanced

Build accessible components with semantic HTML, ARIA attributes, keyboard support, and screen-reader text.
`,
    interviewQuestions: [
      {
        question: "How do you add styles to a React component?",
        answer: "Use className for CSS classes, inline styles for dynamic values, or CSS-in-JS libraries for component-scoped styling."
      },
      {
        question: "Why is accessibility important in React apps?",
        answer: "Accessibility makes apps usable for everyone and helps meet legal and usability standards."
      },
      {
        question: "What is semantic HTML?",
        answer: "Semantic HTML uses elements like <header>, <nav>, <button>, and <main> to convey meaning and accessibility hints."
      }
    ],
    practicalTask: {
      scenario: "You want your UI to work for all users.",
      task: "Create a form with labels, proper keyboard focus, and a visible focus indicator.",
      solutionCode: `<form>
  <label htmlFor="email">Email</label>
  <input id="email" type="email" />
  <button type="submit">Submit</button>
</form>`
    }
  },
  {
    slug: "react-architecture-best-practices",
    title: "15. React Architecture and Best Practices",
    order: 15,
    content: `
# React Architecture and Best Practices — Beginner → Advanced

## Beginner

Keep components small, use descriptive names, and separate UI from data logic.

## Intermediate

Organize files by feature or domain, and use hooks/components directories for reusable logic.

## Advanced

Use layered architecture, composition over inheritance, and keep side effects isolated. Favor testable components and maintainable abstractions.
`,
    interviewQuestions: [
      {
        question: "What is a good folder structure for a React app?",
        answer: "Organize by feature or route, with clear separation between components, hooks, services, and styles."
      },
      {
        question: "Why is composition preferred over inheritance in React?",
        answer: "Composition keeps components simpler and more reusable by combining smaller pieces instead of building rigid class hierarchies."
      },
      {
        question: "How do you keep React code maintainable as the app grows?",
        answer: "Use small pure components, custom hooks for logic reuse, consistent naming, and clear boundaries between state, UI, and data fetching."
      }
    ],
    practicalTask: {
      scenario: "You want a maintainable component library.",
      task: "Refactor a large page into smaller presentational components and a container that manages data and state.",
      solutionCode: `function ProductList({ products }) {
  return (
    <div>
      {products.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

function ProductPage() {
  const products = useProducts();
  return <ProductList products={products} />;
}`
    }
  }
];

replaceDocs(
  "react",
  "React.js � Beginner to Pro",
  "Beginner-friendly React docs with easy explanations, interview questions, and practice tasks for each section.",
  topics
);
