import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'forms-and-controlled-components',
    title: 'Chapter 6: Forms and Controlled Components',
    order: 6,
    content: `
# Forms and Controlled Components

HTML form elements work a bit differently from other DOM elements in React because form elements naturally keep some internal state. For example, an \`<input>\` element maintains its own text value. In React, we typically want the React component to control that state, leading to the concept of **Controlled Components**.

## Controlled Components

In a controlled component, the form data is handled by the state within the React component. The React state becomes the "single source of truth."

\`\`\`jsx
import React, { useState } from 'react';

const SimpleForm = () => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(\`Submitted name: \${name}\`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
\`\`\`

### Why use Controlled Components?
1. **Instant validation:** You can validate input on every keystroke.
2. **Conditional disabling:** You can disable the submit button until the form is valid.
3. **Format formatting:** You can format data (like phone numbers) as the user types.

## Handling Multiple Inputs

When you have multiple inputs, creating a separate state variable for each can get tedious. Instead, you can use an object for your state and update it dynamically using the input's \`name\` attribute.

\`\`\`jsx
const ComplexForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Computed property names in ES6
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <form>
      <input name="firstName" value={formData.firstName} onChange={handleChange} />
      <input name="lastName" value={formData.lastName} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
    </form>
  );
};
\`\`\`

## Textarea and Select

In React, \`<textarea>\` and \`<select>\` work identically to \`<input>\`. They all use the \`value\` prop to control the state.

\`\`\`jsx
// Textarea
<textarea value={notes} onChange={e => setNotes(e.target.value)} />

// Select
<select value={role} onChange={e => setRole(e.target.value)}>
  <option value="admin">Admin</option>
  <option value="user">User</option>
</select>
\`\`\`

## Uncontrolled Components

Sometimes you don't need React to control the state, perhaps when integrating with non-React code or for simple, non-validated forms. You can use **Uncontrolled Components**, where form data is handled by the DOM itself.

You access the DOM nodes directly using \`useRef\`.

\`\`\`jsx
import React, { useRef } from 'react';

const UncontrolledForm = () => {
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputRef.current.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* defaultValue sets the initial state, but does not control it */}
      <input type="text" ref={inputRef} defaultValue="Bob" />
      <button type="submit">Submit</button>
    </form>
  );
};
\`\`\`
`,
    interviewQuestions: [
      { question: "What is a Controlled Component?", answer: "A controlled component is an input form element whose value is controlled by React state. The React component that renders the form also controls what happens in that form on subsequent user input." },
      { question: "What is the difference between value and defaultValue?", answer: "'value' is used in controlled components to bind the input to React state. 'defaultValue' is used in uncontrolled components to provide an initial value, leaving the DOM to manage subsequent changes." },
      { question: "How do you handle multiple form inputs effectively?", answer: "By giving each input a 'name' attribute and using a single state object. You can write a generic handleChange function that uses computed property names ([event.target.name]: event.target.value) to update the specific field." },
      { question: "When would you choose an uncontrolled component over a controlled one?", answer: "Uncontrolled components are useful when integrating React with third-party DOM libraries, or for extremely simple forms where you don't need instant validation, formatting, or conditionally disabling buttons." },
      { question: "Why does <textarea> use the value prop in React?", answer: "In standard HTML, <textarea> defines its text by its children. React standardizes this so that <textarea> uses a 'value' prop, making it behave consistently with <input>." }
    ],
    practicalTask: {
      scenario: "Build a registration form with live password matching validation.",
      task: "Create a controlled form with two inputs: password and confirmPassword. If they do not match, display a red error message below them.",
      solutionCode: "const Registration = () => {\n  const [pass, setPass] = useState('');\n  const [confirm, setConfirm] = useState('');\n  const isMatch = pass === confirm;\n  return (\n    <form>\n      <input type=\"password\" value={pass} onChange={e => setPass(e.target.value)} />\n      <input type=\"password\" value={confirm} onChange={e => setConfirm(e.target.value)} />\n      {!isMatch && confirm.length > 0 && <p style={{color: 'red'}}>Passwords do not match.</p>}\n    </form>\n  );\n};"
    }
  },
  {
    slug: 'deep-dive-into-hooks',
    title: 'Chapter 7: Deep Dive into Hooks (useState, useEffect)',
    order: 7,
    content: `
# Deep Dive into Hooks (useState, useEffect)

Hooks were introduced in React 16.8 to allow you to use state and other React features without writing a class. They completely changed how React is written.

## Rules of Hooks

Before diving into specific hooks, you must memorize the two fundamental rules of hooks:
1. **Only Call Hooks at the Top Level:** Do not call Hooks inside loops, conditions, or nested functions. This ensures Hooks are called in the exact same order each time a component renders, which is how React associates state with the correct \`useState\` call.
2. **Only Call Hooks from React Functions:** Call them from functional components or from custom Hooks. Never from regular JavaScript functions.

## \`useState\` Deep Dive

We covered the basics of \`useState\`, but there are advanced considerations.

### Lazy Initialization
If the initial state requires expensive computation, you can pass a function to \`useState\`. React will only invoke this function during the initial render.

\`\`\`jsx
// Expensive computation runs on EVERY render (Bad)
const [data, setData] = useState(computeExpensiveData());

// Expensive computation runs ONLY ONCE on mount (Good)
const [data, setData] = useState(() => computeExpensiveData());
\`\`\`

## \`useEffect\` Deep Dive

\`useEffect\` lets you perform side effects (data fetching, subscriptions, DOM manipulation).

### The Dependency Array

The second argument to \`useEffect\` is an array of dependencies. It dictates WHEN the effect should re-run.

- **No array:** \`useEffect(() => {...})\` - Runs after EVERY render.
- **Empty array:** \`useEffect(() => {...}, [])\` - Runs ONCE on mount.
- **Array with values:** \`useEffect(() => {...}, [id, name])\` - Runs on mount, and re-runs IF \`id\` or \`name\` change between renders.

### Object Identity and Dependency Arrays
A common bug involves passing objects, arrays, or functions into the dependency array without memoizing them.

\`\`\`jsx
const UserProfile = ({ userId }) => {
  // If we recreate this object on every render, it triggers the effect infinitely!
  const options = { id: userId, fetchDetails: true };

  useEffect(() => {
    fetchUser(options);
  }, [options]); // 🔴 Danger: 'options' reference changes every render!
};
\`\`\`
**Fix:** Move \`options\` inside the \`useEffect\`, or use \`useMemo\` to memoize it.

### Cleanup Functions and Race Conditions
When fetching data, the component might unmount before the fetch completes, causing a memory leak warning. Or, the \`id\` changes rapidly, causing multiple network requests to return out of order (Race Condition).

\`\`\`jsx
useEffect(() => {
  let isMounted = true; // Flag to track mount status
  
  const loadData = async () => {
    const data = await fetchData(id);
    if (isMounted) setGlobalData(data); // Only update state if still mounted
  };
  
  loadData();
  
  return () => {
    isMounted = false; // Cleanup runs on unmount or before next effect
  };
}, [id]);
\`\`\`
`,
    interviewQuestions: [
      { question: "What are the rules of Hooks?", answer: "1. Only call Hooks at the top level (not inside loops, conditions, or nested functions). 2. Only call Hooks from React function components or custom Hooks." },
      { question: "How does React know which state corresponds to which useState call?", answer: "React relies on the call order of Hooks. Because Hooks must be called unconditionally at the top level, React maps the array of state variables internally based on the index (order) in which they were called." },
      { question: "What is lazy initialization in useState?", answer: "Passing a function instead of a value to useState: useState(() => computeValue()). This function is only executed during the initial render, saving processing time if the calculation is expensive." },
      { question: "Explain the purpose of the dependency array in useEffect.", answer: "The dependency array tells React when to skip applying an effect. If all values in the array are strictly equal (===) to their values from the previous render, React skips the effect." },
      { question: "How do you handle race conditions in useEffect data fetching?", answer: "By returning a cleanup function that sets an 'isMounted' boolean to false, or by utilizing an AbortController to cancel the outgoing fetch request if the effect is torn down." }
    ],
    practicalTask: {
      scenario: "Fetch and display a user's profile based on an ID passed via props.",
      task: "Write a component that accepts a userId prop. Use useEffect to fetch data from a mock API. Implement an AbortController to abort the fetch if userId changes before the previous fetch completes.",
      solutionCode: "const Profile = ({ userId }) => {\n  const [data, setData] = useState(null);\n  useEffect(() => {\n    const controller = new AbortController();\n    fetch(`/api/user/${userId}`, { signal: controller.signal })\n      .then(res => res.json())\n      .then(setData)\n      .catch(err => { if (err.name !== 'AbortError') console.error(err); });\n    return () => controller.abort();\n  }, [userId]);\n  return <div>{data ? data.name : 'Loading...'}</div>;\n};"
    }
  },
  {
    slug: 'advanced-hooks',
    title: 'Chapter 8: Advanced Hooks (useReducer, useRef)',
    order: 8,
    content: `
# Advanced Hooks (useReducer, useRef)

While \`useState\` and \`useEffect\` cover 80% of use cases, complex applications require advanced state management and direct DOM access.

## \`useReducer\`: For Complex State Logic

\`useReducer\` is an alternative to \`useState\`. It is preferable when you have complex state logic that involves multiple sub-values, or when the next state depends on the previous one. It functions exactly like Redux reducers.

### Anatomy of useReducer
\`\`\`jsx
const [state, dispatch] = useReducer(reducer, initialState);
\`\`\`
- **state:** The current state.
- **dispatch:** A function to send "actions" to the reducer.
- **reducer:** A pure function \`(state, action) => newState\` that determines how state changes.

### Example
\`\`\`jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset': return initialState;
    default: throw new Error();
  }
}

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
};
\`\`\`

## \`useRef\`: The "Escape Hatch"

\`useRef\` returns a mutable ref object whose \`.current\` property is initialized to the passed argument. 
It has two primary uses:
1. **Accessing DOM Elements:** The most common use case.
2. **Keeping Mutable Variables:** A ref is like a "box" that can hold a mutable value. Unlike state, updating a ref **does not trigger a re-render**.

### 1. Accessing DOM Elements
\`\`\`jsx
const FocusInput = () => {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // Directly accesses the input DOM node and calls focus()
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
};
\`\`\`

### 2. Storing Mutable Values (Instance Variables)
If you need to keep track of a value (like an interval ID or previous state) but don't want changes to that value to force the component to re-render, \`useRef\` is perfect.

\`\`\`jsx
const Timer = () => {
  const [count, setCount] = useState(0);
  const timerId = useRef(null);

  const start = () => {
    timerId.current = setInterval(() => setCount(c => c + 1), 1000);
  };

  const stop = () => {
    clearInterval(timerId.current);
  };

  return (
    <div>
      <p>{count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
};
\`\`\`
`,
    interviewQuestions: [
      { question: "When should you use useReducer instead of useState?", answer: "Use useReducer when state transitions are complex, involve multiple sub-values, or when the next state heavily depends on the previous state. It also allows you to pass a dispatch function down the component tree instead of multiple callbacks." },
      { question: "Does updating a useRef value trigger a re-render?", answer: "No. Mutating the .current property of a ref does not trigger a component re-render. This is the main difference between useRef and useState." },
      { question: "How can you access a child component's DOM node from a parent?", answer: "You must use React.forwardRef on the child component to forward the ref down to the specific DOM element." },
      { question: "Is the reducer function in useReducer allowed to have side effects?", answer: "No, a reducer must be a pure function. It should only take the state and action, and return the new state without executing any API calls, DOM mutations, or other side effects." },
      { question: "Can you store objects or arrays in a useRef?", answer: "Yes, the .current property of a ref can hold any JavaScript value, including objects, arrays, functions, or primitives." }
    ],
    practicalTask: {
      scenario: "You need a stopwatch that tracks elapsed time without re-rendering every millisecond.",
      task: "Create a component using useRef to store the start time and interval ID. Only update state when the user clicks 'Pause' or 'Lap' to display the recorded time.",
      solutionCode: "const Stopwatch = () => {\n  const startTime = useRef(0);\n  const timerId = useRef(null);\n  const [laps, setLaps] = useState([]);\n\n  const start = () => {\n    startTime.current = Date.now();\n  };\n  const lap = () => {\n    setLaps([...laps, Date.now() - startTime.current]);\n  };\n  return (\n    <div>\n      <button onClick={start}>Start</button>\n      <button onClick={lap}>Lap</button>\n      {laps.map((l, i) => <div key={i}>{l}ms</div>)}\n    </div>\n  );\n};"
    }
  },
  {
    slug: 'context-api-and-state-management',
    title: 'Chapter 9: Context API and State Management',
    order: 9,
    content: `
# Context API and State Management

React's unidirectional data flow (passing props down) works great, but it can lead to **Prop Drilling**—passing props through many intermediate components that don't need them, just to reach a deeply nested child.

## What is the Context API?

Context provides a way to pass data through the component tree without having to pass props down manually at every level. It is ideal for global data like current authenticated user, theme (dark/light), or preferred language.

### Creating and Providing Context

1. **Create the Context:**
\`\`\`jsx
import React, { createContext, useContext, useState } from 'react';

// Default value is used only if no Provider is found above in the tree
export const ThemeContext = createContext('light');
\`\`\`

2. **Provide the Context:**
Wrap the part of the application that needs the data with a \`Provider\`.
\`\`\`jsx
const App = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        Toggle Theme
      </button>
    </ThemeContext.Provider>
  );
};
\`\`\`

### Consuming Context

In modern React, the \`useContext\` hook is the standard way to consume context.

\`\`\`jsx
const Toolbar = () => {
  return <div><ThemedButton /></div>;
};

const ThemedButton = () => {
  // Directly grab the context value without prop drilling!
  const theme = useContext(ThemeContext);
  return <button className={\`btn-\${theme}\`}>I am styled by theme: {theme}</button>;
};
\`\`\`

## Context combined with useReducer

For complex global state, it's a common pattern to combine \`useReducer\` with \`Context\` to create a lightweight Redux alternative.

\`\`\`jsx
const AppStateContext = createContext();
const AppDispatchContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
\`\`\`
*Note: Splitting State and Dispatch into two separate contexts prevents components that only need to dispatch actions from re-rendering when the state changes.*

## Limitations of Context

Context is fantastic, but it's not a silver bullet.
1. **Performance Issues:** Whenever the \`value\` prop on the Provider changes, **ALL** components consuming that context will re-render. If you pass a large, frequently updating object into Context, it can cause severe performance bottlenecks.
2. **Not for High-Frequency Updates:** Context is not designed for state that changes multiple times a second (like an animation ticker or mouse position).
`,
    interviewQuestions: [
      { question: "What problem does the Context API solve?", answer: "It solves the problem of 'prop drilling'—the need to pass data through multiple layers of intermediate components that don't actually use the data, just to get it to a deeply nested child." },
      { question: "What happens to context consumers when the Provider's value changes?", answer: "Every component that consumes that context via useContext will unconditionally re-render, even if they are wrapped in React.memo. This is why it's crucial to split contexts or avoid high-frequency updates." },
      { question: "Why might you separate state and dispatch into two different contexts?", answer: "If you put both in the same object context, any component that only needs to dispatch an action will re-render whenever the state changes. Separating them prevents these unnecessary re-renders." },
      { question: "Does Context replace Redux?", answer: "No. While Context handles dependency injection globally, Redux provides strict architectural patterns (middlewares, time-travel debugging) and highly optimized selector subscriptions to prevent unnecessary renders in huge apps." },
      { question: "What is the default value in createContext used for?", answer: "The default value passed to createContext('default') is only used if a component calls useContext but does not have a matching Provider anywhere above it in the component tree." }
    ],
    practicalTask: {
      scenario: "Create a simple Authentication context.",
      task: "Create AuthContext that holds a 'user' object and a 'login' function. Wrap an App in AuthProvider and create a LoginButton component that consumes the context to log in the user.",
      solutionCode: "const AuthContext = createContext();\nconst AuthProvider = ({children}) => {\n  const [user, setUser] = useState(null);\n  const login = () => setUser({ name: 'Admin' });\n  return <AuthContext.Provider value={{user, login}}>{children}</AuthContext.Provider>;\n};\nconst UserProfile = () => {\n  const { user, login } = useContext(AuthContext);\n  return user ? <div>Welcome {user.name}</div> : <button onClick={login}>Login</button>;\n};"
    }
  },
  {
    slug: 'react-router-fundamentals',
    title: 'Chapter 10: React Router Fundamentals',
    order: 10,
    content: `
# React Router Fundamentals

React out of the box is a UI library, not a framework. It does not include routing. To build Single Page Applications (SPAs) with multiple views, the industry standard is **React Router** (currently v6+).

## Single Page Applications (SPA)

In a traditional website, clicking a link requests a new HTML page from the server. In an SPA, only one HTML file is loaded. When navigation occurs, React Router intercepts the URL change, prevents the browser from reloading, and tells React to render a different component based on the new URL.

## Setup and Basic Routing (v6 Syntax)

Wrap your entire application in a \`BrowserRouter\`. Define your routes using the \`Routes\` and \`Route\` components.

\`\`\`jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const App = () => (
  <BrowserRouter>
    <nav>
      {/* Use Link instead of <a> to prevent page reloads */}
      <Link to="/">Home</Link> | 
      <Link to="/about">About</Link>
    </nav>
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* Catch-all route for 404s */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);
\`\`\`

## Dynamic Parameters

Often you need to pass data via the URL, such as a user ID or product slug. You define dynamic segments with a colon \`:\`.

\`\`\`jsx
// Route Definition
<Route path="/users/:userId" element={<UserProfile />} />

// Component
import { useParams } from 'react-router-dom';

const UserProfile = () => {
  // Extract dynamic params from the URL
  const { userId } = useParams();
  
  return <div>Displaying data for user: {userId}</div>;
};
\`\`\`

## Nested Routing and Layouts

React Router v6 embraces nested routing heavily using the \`<Outlet />\` component. This allows you to create global layouts containing sidebars or headers, where only the inner content changes.

\`\`\`jsx
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => (
  <div className="dashboard">
    <Sidebar />
    <main>
      {/* The child route's element will be injected here */}
      <Outlet />
    </main>
  </div>
);

// App.js
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    {/* Resolves to /dashboard/stats */}
    <Route path="stats" element={<Stats />} />
    {/* Resolves to /dashboard/settings */}
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
\`\`\`

## Programmatic Navigation

Sometimes you need to navigate the user via code (e.g., after a successful form submission). Use the \`useNavigate\` hook.

\`\`\`jsx
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await loginService();
    // Navigate to dashboard programmatically
    navigate('/dashboard', { replace: true });
  };

  return <button onClick={handleLogin}>Log In</button>;
};
\`\`\`
*(Setting \`replace: true\` replaces the current history entry, meaning if the user clicks "Back", they won't return to the login page).*
`,
    interviewQuestions: [
      { question: "What is the difference between an SPA (Single Page Application) and a traditional multipage site?", answer: "An SPA loads a single HTML document. Routing is handled client-side by JavaScript (intercepting URL changes and swapping DOM elements), eliminating full page reloads and providing a smoother user experience." },
      { question: "Why must we use <Link> instead of an <a> tag in React Router?", answer: "An <a> tag causes the browser to make a full HTTP request for the new page, resetting the entire React application state. <Link> intercepts the click, updates the URL via the History API, and triggers React Router to render the new component without a reload." },
      { question: "What does the useParams hook do?", answer: "It allows a component to access dynamic segments of the current URL (e.g., extracting '123' from the URL '/users/123' if the route path is defined as '/users/:userId')." },
      { question: "How does the <Outlet /> component work in React Router v6?", answer: "<Outlet /> acts as a placeholder inside a parent layout component. It renders the child route's element that matches the current URL." },
      { question: "What is programmatic navigation and how is it achieved in v6?", answer: "Programmatic navigation means changing the route via code (e.g., after an API call finishes). In v6, it is achieved using the useNavigate() hook, which returns a navigate function." }
    ],
    practicalTask: {
      scenario: "Create an e-commerce product view.",
      task: "Set up a BrowserRouter with two routes: a ProductList ('/products') and a ProductDetail ('/products/:id'). In ProductDetail, use useParams to read the ID and display it.",
      solutionCode: "const App = () => (\n  <BrowserRouter>\n    <Routes>\n      <Route path=\"/products\" element={<div>Products List</div>} />\n      <Route path=\"/products/:id\" element={<ProductDetail />} />\n    </Routes>\n  </BrowserRouter>\n);\nconst ProductDetail = () => {\n  const { id } = useParams();\n  return <div>Showing Product: {id}</div>;\n};"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics).catch(console.error);
