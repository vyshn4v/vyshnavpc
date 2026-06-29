import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "1. React Fundamentals & Components",
    slug: "react-fundamentals-components",
    description: "Deep dive into React components, JSX, and the virtual DOM.",
    order: 1,
    content: `
### 1. Conceptual Overview
React is a declarative, component-based library for building user interfaces. It uses a virtual DOM to optimize rendering and allows developers to build reusable UI pieces.

### 2. Architecture & Mechanics
Components can be functional or class-based. JSX is syntactic sugar for \`React.createElement\`. The Virtual DOM acts as a lightweight copy of the actual DOM, enabling React to compute diffs efficiently.

### 3. Implementation: Standard vs Optimized
Standard implementation relies on passing props deeply. Optimized approaches use Context or state management libraries to prevent prop drilling.

### 4. Trade-offs & Complexity
React simplifies UI logic but adds an overhead of learning JSX and tooling (Babel/Webpack). Virtual DOM diffing is O(n), making updates generally fast, but large component trees can still cause performance bottlenecks.
`,
    interviewQuestions: [
      { question: "What is the Virtual DOM?", answer: "A lightweight JavaScript representation of the actual DOM used for efficient diffing and updating." },
      { question: "Difference between Element and Component?", answer: "An element is what you want to see on screen, while a component is a function or class that returns an element." },
      { question: "What are Higher-Order Components (HOCs)?", answer: "A function that takes a component and returns a new component with added logic." },
      { question: "Why can't browsers read JSX?", answer: "Browsers only understand plain JavaScript. JSX must be transpiled by tools like Babel." },
      { question: "Explain unidirectional data flow.", answer: "Data only flows downwards from parent to child components via props." }
    ],
    practicalTask: {
      title: "Build a Custom UI Library",
      description: "Implement a set of reusable atomic React components like Button, Input, and Modal with support for polymorphic behavior."
    }
  },
  {
    title: "2. State & Lifecycle",
    slug: "state-and-lifecycle",
    description: "Managing state and understanding component lifecycle phases.",
    order: 2,
    content: `
### 1. Conceptual Overview
State represents the mutable data of a component. Lifecycle methods or hooks allow executing code at specific phases: mounting, updating, and unmounting.

### 2. Architecture & Mechanics
In functional components, \`useState\` manages state, and \`useEffect\` handles side effects by combining mounting, updating, and unmounting logic into single functions based on dependency arrays.

### 3. Implementation: Standard vs Optimized
Standard state updates might trigger unnecessary re-renders. Optimized implementations batch state updates and use lazy initialization for heavy computations.

### 4. Trade-offs & Complexity
Local state is fast but hard to share. Global state is easy to share but can lead to complex dependencies and performance hits if not structured well.
`,
    interviewQuestions: [
      { question: "How does setState work under the hood?", answer: "It enqueues changes to the component state and tells React to re-render the component and its children." },
      { question: "Difference between state and props?", answer: "Props get passed to the component, state is managed within the component." },
      { question: "What is the useEffect dependency array?", answer: "An array of variables that tells React when to re-run the effect." },
      { question: "How do you avoid memory leaks in useEffect?", answer: "By returning a cleanup function that cancels subscriptions or timers." },
      { question: "What is strict mode?", answer: "A tool for highlighting potential problems, deliberately double-invoking certain lifecycles in development." }
    ],
    practicalTask: {
      title: "Develop a Real-time Dashboard",
      description: "Create a dashboard component that connects to a WebSocket, managing complex real-time state updates without unmounting."
    }
  },
  {
    title: "3. Context & State Management",
    slug: "context-and-state-management",
    description: "Handling global state with Context API, Redux, and Zustand.",
    order: 3,
    content: `
### 1. Conceptual Overview
As applications grow, passing props multiple levels down (prop drilling) becomes unmanageable. Global state management solutions allow components to access shared state directly.

### 2. Architecture & Mechanics
The Context API uses a Provider and Consumer model. Redux relies on a single immutable store, reducers, and actions. Modern tools like Zustand use hooks for simpler reactive stores.

### 3. Implementation: Standard vs Optimized
Standard Context can cause unnecessary re-renders of all consumers when any part of the value changes. Optimized approaches split contexts or use selectors in libraries like Redux to only re-render when needed data changes.

### 4. Trade-offs & Complexity
Context is built-in but can have performance issues. Redux has excellent dev tools and predictable state but requires boilerplate. Zustand offers a minimal footprint at the cost of less strict architectural guidelines.
`,
    interviewQuestions: [
      { question: "What is prop drilling?", answer: "Passing data through multiple nested components that do not need it, just to reach a deeply nested component." },
      { question: "How does Redux compare to Context API?", answer: "Redux provides a predictable global state with a strict architecture and dev tools; Context is simpler but lacks granular render optimization out-of-the-box." },
      { question: "What is a Redux Thunk?", answer: "A middleware that allows returning functions from action creators to handle asynchronous logic." },
      { question: "How to optimize Context API performance?", answer: "Split state into multiple contexts or memoize the provider value." },
      { question: "What is Zustand?", answer: "A small, fast state-management solution using simplified flux principles and hooks." }
    ],
    practicalTask: {
      title: "Architect an E-commerce Cart",
      description: "Implement a complex global shopping cart state using Redux Toolkit or Zustand, handling async inventory checks."
    }
  },
  {
    title: "4. Hooks & Custom Hooks",
    slug: "hooks-and-custom-hooks",
    description: "Mastering built-in hooks and building reusable custom hooks.",
    order: 4,
    content: `
### 1. Conceptual Overview
Hooks allow functional components to hook into React state and lifecycle features. Custom hooks let you extract component logic into reusable functions.

### 2. Architecture & Mechanics
React relies on the call order of hooks to associate them with the correct component state. They must always be called at the top level, never inside loops or conditions.

### 3. Implementation: Standard vs Optimized
Standard usage involves directly calling hooks in components. Optimized implementations extract complex logic into custom hooks (e.g., \`useFetch\`, \`useAuth\`) for modularity and testing.

### 4. Trade-offs & Complexity
Hooks make components cleaner but introduce closures and stale closure bugs if dependency arrays are not managed correctly. Debugging hooks can sometimes be less intuitive than class lifecycles.
`,
    interviewQuestions: [
      { question: "Rules of Hooks?", answer: "Only call hooks at the top level. Only call hooks from React function components or custom hooks." },
      { question: "What is a stale closure in React?", answer: "When a hook or effect captures old state or props because its dependencies were not properly specified." },
      { question: "Difference between useMemo and useCallback?", answer: "useMemo memoizes a value; useCallback memoizes a function definition." },
      { question: "How does useRef differ from useState?", answer: "useRef holds a mutable value that does not trigger a re-render when changed." },
      { question: "How would you build a useDebounce hook?", answer: "Use useEffect to set a timeout that updates a debounced value, and return a cleanup function to clear the timeout." }
    ],
    practicalTask: {
      title: "Build a Comprehensive useFetch Hook",
      description: "Create a custom hook for data fetching that handles caching, request cancellation, pagination, and retry logic."
    }
  },
  {
    title: "5. Performance & Optimization",
    slug: "performance-and-optimization",
    description: "Techniques for measuring and improving React application performance.",
    order: 5,
    content: `
### 1. Conceptual Overview
React is fast by default, but complex applications require manual optimizations to avoid unnecessary re-renders and large bundle sizes.

### 2. Architecture & Mechanics
React uses shallow comparison in \`React.memo\`. Code splitting uses dynamic imports (\`React.lazy\` and \`Suspense\`) to load code only when needed. Concurrent rendering allows interrupting rendering work.

### 3. Implementation: Standard vs Optimized
Standard rendering processes the whole tree. Optimized implementations use \`React.memo\`, \`useMemo\`, and virtualized lists (like \`react-window\`) to render only what changes or is visible.

### 4. Trade-offs & Complexity
Over-optimization (e.g., wrapping everything in \`useMemo\`) can actually degrade performance due to the overhead of memory allocation and comparison. Optimization should always be guided by profiling.
`,
    interviewQuestions: [
      { question: "How does React.memo work?", answer: "It is a higher-order component that memoizes the rendered output, skipping re-renders if props haven't changed." },
      { question: "What is code splitting?", answer: "Breaking the app bundle into smaller chunks that can be loaded on demand." },
      { question: "How do you identify performance bottlenecks?", answer: "Using the React Profiler to record rendering times and identify unnecessary updates." },
      { question: "What is windowing or virtualization?", answer: "A technique to render only the visible rows in a large list, improving performance." },
      { question: "Explain the useTransition hook.", answer: "It allows marking state updates as non-urgent, keeping the UI responsive during heavy rendering." }
    ],
    practicalTask: {
      title: "Optimize a Data-Heavy Grid",
      description: "Refactor a lagging data grid component to use virtualization, memoization, and concurrent features to achieve 60fps scrolling."
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'A comprehensive guide to building scalable React applications.', topics)
  .then(() => {
    console.log('Successfully seeded React topics');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error seeding React topics:', err);
    process.exit(1);
  });
