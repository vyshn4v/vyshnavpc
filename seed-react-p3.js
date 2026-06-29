import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'performance-optimization-techniques',
    title: 'Chapter 11: Performance Optimization Techniques',
    order: 11,
    content: `
# Performance Optimization Techniques

React is incredibly fast out of the box, but as your application scales, unnecessary re-renders can cause your UI to feel sluggish. Optimizing a React application largely involves telling React when *not* to render.

## The Re-render Issue

By default, when a parent component's state changes, **all** of its children will re-render unconditionally, even if their props haven't changed.

### 1. React.memo
You can wrap functional components in \`React.memo\`. It's a Higher-Order Component that memoizes the rendered output. If the props passed to the component are strictly equal (\`===\`) to the previous render's props, React skips rendering the child and reuses the last rendered result.

\`\`\`jsx
const ExpensiveChild = React.memo(({ title, data }) => {
  console.log("ExpensiveChild rendered!");
  return <div>{title}</div>;
});
\`\`\`

## The Object Identity Problem

\`React.memo\` uses shallow equality. If you pass an object, array, or function as a prop, it will fail the equality check every time because a new reference is created on every parent render.

\`\`\`jsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // This function is recreated on every render!
  const handleClick = () => console.log('Clicked');
  
  // React.memo on Child is USELESS here because handleClick is a new reference.
  return <Child onClick={handleClick} />;
}
\`\`\`

### 2. useCallback
\`useCallback\` memoizes a function. It returns a memoized version of the callback that only changes if one of the dependencies has changed.

\`\`\`jsx
const Parent = () => {
  const [count, setCount] = useState(0);

  // This function reference is now preserved across renders
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []); // Empty deps: function never changes identity
  
  return <Child onClick={handleClick} />;
}
\`\`\`

### 3. useMemo
While \`useCallback\` memoizes functions, \`useMemo\` memoizes the *result* of a calculation (including objects and arrays). Use it to avoid running expensive calculations on every render, or to preserve object identity for child props.

\`\`\`jsx
const ComplexDashboard = ({ data }) => {
  // Only re-run the sorting algorithm if 'data' changes
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.value - a.value);
  }, [data]);

  return <DataGrid items={sortedData} />;
};
\`\`\`

## Virtualization (Windowing)

If you are rendering a massive list (e.g., 10,000 table rows), even with \`React.memo\`, rendering all those DOM nodes will freeze the browser. 
The solution is **Virtualization** (using libraries like \`react-window\` or \`react-virtualized\`). Virtualization only renders the items currently visible in the scroll viewport, recycling DOM nodes as you scroll.
`,
    interviewQuestions: [
      { question: "Why doesn't React use React.memo on all components by default?", answer: "Memoization has a cost. React has to store the old props and perform equality checks. For simple, fast components, the overhead of the equality check is actually slower than just re-rendering the component." },
      { question: "What is the difference between useMemo and useCallback?", answer: "useMemo memoizes the returned value of a function, while useCallback memoizes the function itself. In fact, useCallback(fn, deps) is just syntactic sugar for useMemo(() => fn, deps)." },
      { question: "Explain the concept of 'Shallow Equality'.", answer: "Shallow equality checks if primitive values are identical, or if complex types (objects/arrays) point to the exact same memory reference. It does NOT check if the internal contents of two different objects are the same." },
      { question: "What happens if you use useMemo but omit the dependency array?", answer: "If you omit the dependency array, useMemo will compute a new value on every single render, completely defeating its purpose." },
      { question: "What is list virtualization?", answer: "Virtualization is a performance technique where only the items currently visible in the browser viewport are actually rendered into the DOM. As the user scrolls, DOM nodes are recycled for new items." }
    ],
    practicalTask: {
      scenario: "Optimize a component that accepts a massive array and an onClick handler.",
      task: "Create a Parent component with a counter state. Pass a memoized function using useCallback and a memoized array using useMemo to a child component wrapped in React.memo.",
      solutionCode: "const Child = React.memo(({ onClick, items }) => <div onClick={onClick}>{items.length}</div>);\nconst Parent = () => {\n  const [c, setC] = useState(0);\n  const fn = useCallback(() => console.log('Hi'), []);\n  const arr = useMemo(() => [1,2,3], []);\n  return <div><button onClick={() => setC(c+1)}>++</button><Child onClick={fn} items={arr} /></div>;\n};"
    }
  },
  {
    slug: 'advanced-component-patterns',
    title: 'Chapter 12: Advanced Component Patterns',
    order: 12,
    content: `
# Advanced Component Patterns

As React has evolved, several patterns for sharing logic between components have emerged. While Custom Hooks are the modern standard, you must understand older patterns as they are heavily present in legacy codebases.

## 1. Higher-Order Components (HOC)

A Higher-Order Component is a function that takes a component and returns a new component, injecting additional props or wrapping it with extra UI. It is the component equivalent of a Higher-Order Function.

\`\`\`jsx
// The HOC
const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = checkAuth(); // Assume this exists
    
    if (!isAuthenticated) return <div>Access Denied</div>;
    
    // Pass through all original props
    return <WrappedComponent {...props} user={{ role: 'admin' }} />;
  };
};

// Usage
const Dashboard = ({ user }) => <div>Welcome {user.role}</div>;
const ProtectedDashboard = withAuth(Dashboard);
\`\`\`
**Drawbacks of HOCs:** They can lead to "Wrapper Hell" in React DevTools, and naming collisions if multiple HOCs inject props with the same name.

## 2. Render Props

The Render Props pattern involves passing a function as a prop (often the \`children\` prop or a prop named \`render\`) that the component calls to know what to render. This allows the wrapper component to manage state and pass it down cleanly.

\`\`\`jsx
// The Component providing state
const MouseTracker = ({ render }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });

  return (
    <div style={{ height: '100vh' }} onMouseMove={handleMouseMove}>
      {/* Call the render prop with the state! */}
      {render(position)}
    </div>
  );
};

// Usage
const App = () => (
  <MouseTracker 
    render={(pos) => <h1>Mouse is at {pos.x}, {pos.y}</h1>} 
  />
);
\`\`\`
**Drawbacks:** Can lead to deeply nested JSX, sometimes called "Callback Hell" in the UI tree.

## 3. Custom Hooks (The Modern Standard)

Custom Hooks are JavaScript functions whose names start with \`use\` and that call other Hooks. They allow you to extract component logic into reusable functions without adding any components to the UI tree!

\`\`\`jsx
// The Custom Hook
const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position; // Return the state
};

// Usage - Notice how clean this is!
const App = () => {
  const { x, y } = useMousePosition();
  return <h1>Mouse is at {x}, {y}</h1>;
};
\`\`\`
Custom hooks completely replaced HOCs and Render Props for sharing stateful logic because they avoid nesting and prop name collisions.
`,
    interviewQuestions: [
      { question: "What is a Higher-Order Component (HOC)?", answer: "A HOC is a function that takes a React component as an argument and returns a new, enhanced React component. It's a pattern used for reusing component logic." },
      { question: "What is the Render Props pattern?", answer: "It's a pattern where a component receives a function as a prop (often called 'render' or 'children'). The component manages some state and then calls that function, passing the state as arguments, allowing the parent to determine what the UI looks like." },
      { question: "Why did Custom Hooks largely replace HOCs and Render Props?", answer: "Custom Hooks allow you to extract and reuse stateful logic without changing your component hierarchy. This eliminates 'wrapper hell' (deeply nested component trees) and avoids prop name collisions caused by HOCs." },
      { question: "What is the naming convention for Custom Hooks?", answer: "They must start with the word 'use' (e.g., useFetch, useAuth). This is required so the React linter can enforce the Rules of Hooks inside the function." },
      { question: "Can two components using the same Custom Hook share state?", answer: "No. Custom Hooks are a mechanism to reuse stateful *logic*, not state itself. Each call to a hook creates a completely independent, isolated state for that specific component instance." }
    ],
    practicalTask: {
      scenario: "Create a custom hook for toggling boolean state.",
      task: "Write a custom hook 'useToggle' that takes an initial boolean. It should return an array containing the boolean and a toggle function.",
      solutionCode: "const useToggle = (initialValue = false) => {\n  const [value, setValue] = useState(initialValue);\n  const toggle = useCallback(() => setValue(v => !v), []);\n  return [value, toggle];\n};"
    }
  },
  {
    slug: 'error-boundaries-and-suspense',
    title: 'Chapter 13: Error Boundaries and Suspense',
    order: 13,
    content: `
# Error Boundaries and Suspense

In robust applications, unhandled javascript errors shouldn't break the entire application, and async data/components should be handled gracefully.

## Error Boundaries

An Error Boundary is a React component that catches JavaScript errors anywhere in its child component tree, logs those errors, and displays a fallback UI instead of the component tree that crashed.

**Important:** Currently, Error Boundaries **must** be Class Components. There is no hook equivalent yet (though libraries like \`react-error-boundary\` exist).

\`\`\`jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Update state so the next render shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  // Log the error to an error reporting service
  componentDidCatch(error, errorInfo) {
    logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please reload.</h1>;
    }
    return this.props.children; 
  }
}

// Usage
const App = () => (
  <ErrorBoundary>
    <MyVulnerableComponent />
  </ErrorBoundary>
);
\`\`\`
*Note: Error boundaries do not catch errors for async code (like setTimeout or fetch callbacks) or event handlers. They only catch errors during rendering, lifecycle methods, and constructors.*

## React Suspense

Suspense lets your components "wait" for something before they can render. Today, it is primarily used for two things: **Lazy Loading Components** and **Data Fetching** (with frameworks like Next.js or Relay).

### Lazy Loading Components
Code splitting allows you to split your bundle into smaller chunks that load on demand, improving initial load times.

\`\`\`jsx
import React, { Suspense, lazy } from 'react';

// Dynamically import the component
const HeavyChart = lazy(() => import('./HeavyChart'));

const Dashboard = () => {
  return (
    <div>
      <h2>Dashboard</h2>
      {/* Suspense dictates what is shown while HeavyChart is downloading */}
      <Suspense fallback={<Spinner />}>
        <HeavyChart />
      </Suspense>
    </div>
  );
};
\`\`\`

When React reaches the Suspense boundary, it sees the inner component is not ready. It immediately renders the \`fallback\` prop. Once the promise resolves (the component downloads), React swaps the fallback with the actual component.
`,
    interviewQuestions: [
      { question: "What is an Error Boundary in React?", answer: "It is a class component that implements getDerivedStateFromError or componentDidCatch. It catches unhandled JavaScript errors in its child component tree during rendering and displays a fallback UI instead of crashing the whole app." },
      { question: "Can you write an Error Boundary using functional components and hooks?", answer: "Currently, no built-in React hooks exist for Error Boundaries. You must use a Class Component, or use a third-party library like 'react-error-boundary' which provides a wrapper." },
      { question: "Do Error Boundaries catch errors inside onClick event handlers?", answer: "No. Error Boundaries only catch errors during the rendering phase, lifecycle methods, and constructors. For event handlers, you must use standard try/catch blocks." },
      { question: "What does React.lazy() do?", answer: "React.lazy() enables dynamic imports for components. It allows you to render a dynamically loaded component as a regular component, automatically splitting the code bundle to improve initial load time." },
      { question: "What is the purpose of the <Suspense> component?", answer: "Suspense is used to wrap lazy-loaded components or async data requirements. It provides a 'fallback' UI (like a loading spinner) to display while the child components are waiting to resolve." }
    ],
    practicalTask: {
      scenario: "Create a basic Error Boundary wrapper.",
      task: "Write a Class component ErrorBoundary that returns a red alert box if an error occurs, and otherwise renders children.",
      solutionCode: "class ErrorBoundary extends React.Component {\n  state = { error: null };\n  static getDerivedStateFromError(error) { return { error }; }\n  render() {\n    if (this.state.error) return <div style={{background: 'red', color: 'white'}}>Crash: {this.state.error.message}</div>;\n    return this.props.children;\n  }\n}"
    }
  },
  {
    slug: 'react-testing-essentials',
    title: 'Chapter 14: React Testing Essentials',
    order: 14,
    content: `
# React Testing Essentials

Testing ensures your application behaves as expected over time. In the React ecosystem, the standard testing stack consists of **Jest** (Test Runner & Assertion library) and **React Testing Library** (DOM rendering and interaction).

## Testing Philosophy

React Testing Library (RTL) enforces a specific philosophy: **"The more your tests resemble the way your software is used, the more confidence they can give you."**
You should NOT test component internals (like specific state variables). Instead, test what the user sees (the DOM) and how the user interacts (clicks, typing).

## Setting up a Test

\`\`\`jsx
// Counter.jsx
export const Counter = () => {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1 data-testid="count-display">Count: {count}</h1>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
};
\`\`\`

### Writing the Test

\`\`\`jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from './Counter';

describe('Counter Component', () => {
  
  test('renders initial count of 0', () => {
    render(<Counter />); // 1. Render the component in a virtual DOM
    
    // 2. Query the DOM. getByText uses a regex to find matching text
    const header = screen.getByText(/Count: 0/i); 
    
    // 3. Assert
    expect(header).toBeInTheDocument();
  });

  test('increments the count when button is clicked', () => {
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: /increment/i });
    
    // Simulate user interaction
    fireEvent.click(button);
    
    const header = screen.getByText(/Count: 1/i);
    expect(header).toBeInTheDocument();
  });
});
\`\`\`

## Queries in RTL

Understanding queries is critical.
1. **getBy...**: Returns the element. Throws an error if not found. (Use for asserting elements *are* present).
2. **queryBy...**: Returns the element or null. (Use for asserting elements *are NOT* present).
3. **findBy...**: Returns a Promise. (Use for testing async operations, like waiting for data to load).

**Priority of Queries:**
RTL recommends querying by accessibility attributes first:
1. \`getByRole\` (Best - ensures your app is accessible)
2. \`getByLabelText\` / \`getByPlaceholderText\`
3. \`getByText\`
4. \`getByTestId\` (Escape hatch when nothing else works)

## Mocking API Calls

You should not hit real APIs in tests. Use Jest to mock the global fetch, or use MSW (Mock Service Worker).

\`\`\`jsx
// Mocking global fetch with Jest
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ name: 'John Doe' }),
  })
);
\`\`\`
`,
    interviewQuestions: [
      { question: "What is the core philosophy of React Testing Library?", answer: "To test software the way users interact with it. Instead of testing implementation details like state variables, RTL encourages querying the DOM for accessible elements and simulating real user interactions." },
      { question: "What is the difference between getBy... and queryBy... in RTL?", answer: "getBy throws an error if the element is not found, making it ideal for asserting something exists. queryBy returns null if the element is not found, making it necessary when asserting that an element does NOT exist on the screen." },
      { question: "When would you use findBy... queries?", answer: "findBy queries are asynchronous and return a promise. They are used when testing elements that will appear on the screen after an asynchronous action, like an API call resolving." },
      { question: "Why is getByRole the preferred way to query elements?", answer: "It queries elements the same way assistive technologies (like screen readers) perceive them. If you can query an element by role, it guarantees your component is highly accessible." },
      { question: "What does the fireEvent (or userEvent) module do?", answer: "It simulates user actions in the virtual DOM, such as clicking, typing, or hovering, allowing you to test how your component's state and UI react to user input." }
    ],
    practicalTask: {
      scenario: "Write a test for a Toggle component.",
      task: "Assuming a component <Toggle /> renders a button that says 'ON' or 'OFF', write a test suite that checks the initial state is 'OFF', clicks the button, and checks the state is 'ON'.",
      solutionCode: "test('toggles state', () => {\n  render(<Toggle />);\n  const btn = screen.getByRole('button');\n  expect(btn).toHaveTextContent('OFF');\n  fireEvent.click(btn);\n  expect(btn).toHaveTextContent('ON');\n});"
    }
  },
  {
    slug: 'ecosystem-and-best-practices',
    title: 'Chapter 15: Ecosystem and Best Practices',
    order: 15,
    content: `
# Ecosystem and Best Practices

React is just a library for the view layer. A full-scale application requires an ecosystem of tools. Understanding the landscape and adopting architectural best practices is what separates intermediate developers from seniors.

## The React Ecosystem Landscape

1. **State Management:** While Context is fine for small apps, large apps use **Redux Toolkit (RTK)**, **Zustand**, or **Jotai**. For server-state (data fetching/caching), **React Query** or **RTK Query** are industry standards.
2. **Styling:** CSS-in-JS (like **Styled Components** or **Emotion**) or Utility-first CSS (**Tailwind CSS**).
3. **Routing:** **React Router** (for SPAs) or framework routers (Next.js App Router).
4. **Forms:** **React Hook Form** or **Formik** are essential for handling complex form validations without massive performance hits.

## Frameworks vs SPAs

The industry is moving heavily towards Meta-Frameworks rather than pure SPAs.
- **Next.js:** Provides Server-Side Rendering (SSR) and Static Site Generation (SSG) out of the box. Essential for SEO and performance.
- **Remix:** Focuses heavily on web standards, native form handling, and nested routing data loaders.

## Architectural Best Practices

### 1. Separation of Concerns (Container vs Presentational)
Keep components that fetch data or manage complex state (Containers) separate from components that just render UI based on props (Presentational).
*Modern note: With Hooks, this strict separation is less rigid, but the concept of separating business logic from UI remains critical.*

### 2. Absolute Imports
Instead of messy relative imports (\`../../../components/Button\`), configure your bundler to use absolute imports (\`@components/Button\`).

### 3. Component Folder Structure
Group files by feature, not by type.
\`\`\`text
// BAD
/components
  Button.js
  Header.js
/styles
  Button.css
  Header.css

// GOOD (Feature-based)
/components
  /Button
    index.js
    Button.css
    Button.test.js
\`\`\`

### 4. Prop Drilling vs Composition
Before reaching for Context or Redux to solve prop drilling, consider if you can use **Component Composition** (passing components via the \`children\` prop) to flatten your tree.

### 5. Keeping State Local
Do not put everything in global state (Redux). If a state is only used by a single component or its direct children, keep it local using \`useState\`. Only lift state up when absolutely necessary.
`,
    interviewQuestions: [
      { question: "What is the difference between Client-Side Rendering (SPA) and Server-Side Rendering (Next.js)?", answer: "In an SPA, the browser downloads a blank HTML file and a large JS bundle, then React renders the UI in the browser. In SSR, the server generates the fully populated HTML and sends it to the browser, which is much faster for first-contentful-paint and essential for SEO." },
      { question: "What problem do tools like React Query solve?", answer: "React Query manages 'Server State'. It handles data fetching, caching, synchronization, background updates, and loading/error states automatically, eliminating the need to store API responses in global UI state like Redux." },
      { question: "Why is it recommended to structure files by feature rather than by type?", answer: "Feature-based routing keeps all files related to a specific component or domain (JS, CSS, Tests) co-located. This makes the codebase highly scalable and makes it much easier to find, update, or delete features." },
      { question: "What is the Container/Presentational pattern?", answer: "A pattern where components are split into two types: Containers (which handle data fetching, state, and business logic) and Presentational components (which are pure, stateless, and solely focused on rendering the UI based on props)." },
      { question: "When should you NOT use Redux?", answer: "You shouldn't use Redux for local, transient UI state (like whether a dropdown is open or the text in a single input field). It should be reserved for true global state that is shared across many disparate parts of the application." }
    ],
    practicalTask: {
      scenario: "Refactor a component to use composition to avoid prop drilling.",
      task: "Given a layout where App passes a 'user' prop through Header just so Header can pass it to UserProfile. Refactor App to pass the UserProfile component as a child to Header instead.",
      solutionCode: "const App = () => (\n  <Header>\n    <UserProfile user={user} />\n  </Header>\n);\nconst Header = ({ children }) => (\n  <header>Logo {children}</header>\n);"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics).catch(console.error);
