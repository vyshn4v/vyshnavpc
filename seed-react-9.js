import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch41-advanced-patterns",
    title: "Chapter 41: Advanced Patterns",
    order: 41,
    content: "### 1. Conceptual Overview\nExplore advanced design patterns in React.\n### 2. Architecture & Mechanics\nUnderstand how patterns like Render Props, HOCs, and Compound Components work under the hood.\n### 3. Implementation: Standard vs Optimized\nCompare basic implementations with highly optimized, memoized versions.\n### 4. Trade-offs & Complexity\nDiscuss when to use which pattern and the complexity they introduce.",
    interviewQuestions: [
      { question: "What are Compound Components?", answer: "A pattern where multiple components work together to form a cohesive UI, sharing implicit state." },
      { question: "What is a Higher-Order Component (HOC)?", answer: "A function that takes a component and returns a new component, used for reusing component logic." },
      { question: "How do Render Props differ from HOCs?", answer: "Render props use a prop whose value is a function to share code, whereas HOCs wrap components." },
      { question: "What is the Control Props pattern?", answer: "It allows users to control the internal state of a component from the outside, like controlled inputs." },
      { question: "When would you use the State Reducer pattern?", answer: "When you want to allow users of your component to hook into and modify state updates before they are applied." }
    ],
    practicalTask: {
      scenario: "Implementing a Compound Component",
      task: "Create a Toggle component using the Compound Component pattern.",
      solutionCode: "const ToggleContext = React.createContext();\nfunction Toggle({children}) { const [on, setOn] = React.useState(false); return <ToggleContext.Provider value={{on, setOn}}>{children}</ToggleContext.Provider>; }"
    }
  },
  {
    slug: "react-ch42-performance-tuning",
    title: "Chapter 42: Deep Performance Tuning",
    order: 42,
    content: "### 1. Conceptual Overview\nLearn how to identify and resolve performance bottlenecks in React applications.\n### 2. Architecture & Mechanics\nThe React rendering pipeline, reconciliation, and how bailout mechanisms work.\n### 3. Implementation: Standard vs Optimized\nStandard unoptimized lists vs virtualized lists.\n### 4. Trade-offs & Complexity\nOver-optimization pitfalls vs necessary performance gains.",
    interviewQuestions: [
      { question: "What is React virtualization?", answer: "A technique to render only the visible portion of a large list or table, improving performance." },
      { question: "How does `React.memo` compare to `useMemo`?", answer: "`React.memo` memoizes an entire component based on props, while `useMemo` memoizes a specific value or computation inside a component." },
      { question: "What causes unnecessary re-renders in React?", answer: "Passing new object references or functions as props, or state changes high up in the component tree without proper memoization." },
      { question: "Explain the concurrent mode features for performance.", answer: "Features like `useTransition` and `useDeferredValue` allow React to interrupt low-priority updates to keep the UI responsive." },
      { question: "How can you profile a React application?", answer: "Using the React Developer Tools Profiler tab to measure render times and identify slow components." }
    ],
    practicalTask: {
      scenario: "Optimizing a list rendering",
      task: "Implement windowing using react-window for a list of 10,000 items.",
      solutionCode: "import { FixedSizeList } from 'react-window';\nconst Row = ({ index, style }) => <div style={style}>Row {index}</div>;\n<FixedSizeList height={150} itemCount={10000} itemSize={35} width={300}>{Row}</FixedSizeList>"
    }
  },
  {
    slug: "react-ch43-state-machines",
    title: "Chapter 43: State Machines in React",
    order: 43,
    content: "### 1. Conceptual Overview\nUsing finite state machines to manage complex UI states predictably.\n### 2. Architecture & Mechanics\nHow statecharts model events, transitions, and states.\n### 3. Implementation: Standard vs Optimized\nUsing `useReducer` vs utilizing a library like XState.\n### 4. Trade-offs & Complexity\nState machines add boilerplate but eliminate impossible states and make logic highly predictable.",
    interviewQuestions: [
      { question: "What is a finite state machine (FSM)?", answer: "A mathematical model of computation representing a system that can be in exactly one of a finite number of states at any given time." },
      { question: "Why use state machines for UI?", answer: "They eliminate impossible states, making UI behavior predictable, testable, and easier to visualize." },
      { question: "What is the difference between a state machine and a statechart?", answer: "Statecharts extend state machines with hierarchy, concurrency, and communication." },
      { question: "How does XState integrate with React?", answer: "Through the `@xstate/react` package, primarily using the `useMachine` hook." },
      { question: "Can `useReducer` act as a state machine?", answer: "Yes, by structuring the reducer to check the current state before processing events." }
    ],
    practicalTask: {
      scenario: "FSM with useReducer",
      task: "Write a simple state machine for a traffic light using useReducer.",
      solutionCode: "const reducer = (state, event) => {\n  if (state === 'green' && event === 'TIMER') return 'yellow';\n  if (state === 'yellow' && event === 'TIMER') return 'red';\n  if (state === 'red' && event === 'TIMER') return 'green';\n  return state;\n};"
    }
  },
  {
    slug: "react-ch44-micro-frontends",
    title: "Chapter 44: React Micro-Frontends",
    order: 44,
    content: "### 1. Conceptual Overview\nDecomposing a large frontend application into smaller, independently deployable units.\n### 2. Architecture & Mechanics\nModule federation, iframes, and web components as integration strategies.\n### 3. Implementation: Standard vs Optimized\nMonolith vs Webpack Module Federation for sharing dependencies.\n### 4. Trade-offs & Complexity\nIncreased operational complexity, versioning issues, but allows autonomous teams.",
    interviewQuestions: [
      { question: "What are micro-frontends?", answer: "An architectural style where independently deliverable frontend applications are composed into a greater whole." },
      { question: "What is Webpack Module Federation?", answer: "A feature that allows multiple Webpack builds to work together, sharing modules dynamically at runtime." },
      { question: "How do you share state between micro-frontends?", answer: "Using custom events, a shared global store, or URL parameters, though it's best to minimize shared state." },
      { question: "What are the styling challenges in micro-frontends?", answer: "CSS conflicts. Solutions include CSS Modules, Shadow DOM, or strict naming conventions like BEM." },
      { question: "When should you NOT use micro-frontends?", answer: "For small projects, tightly coupled domains, or when the overhead of managing multiple pipelines outweighs the benefits." }
    ],
    practicalTask: {
      scenario: "Module Federation Configuration",
      task: "Configure the ModuleFederationPlugin to expose a React component.",
      solutionCode: "new ModuleFederationPlugin({\n  name: 'app1',\n  filename: 'remoteEntry.js',\n  exposes: { './Button': './src/Button' },\n  shared: { react: { singleton: true } }\n})"
    }
  },
  {
    slug: "react-ch45-future-react",
    title: "Chapter 45: The Future of React",
    order: 45,
    content: "### 1. Conceptual Overview\nExploring upcoming features and the evolving paradigm of React.\n### 2. Architecture & Mechanics\nReact Forget (Compiler), advanced server actions, and deep hydration improvements.\n### 3. Implementation: Standard vs Optimized\nManual memoization vs compiler-driven automatic memoization.\n### 4. Trade-offs & Complexity\nAdopting experimental features carries stability risks but prepares the codebase for the future.",
    interviewQuestions: [
      { question: "What is the React Compiler (React Forget)?", answer: "An upcoming tool that automatically memoizes React components and hooks, eliminating the need for manual `useMemo` and `useCallback`." },
      { question: "What are Server Actions?", answer: "Functions executed on the server that can be called directly from Client Components, simplifying data mutations." },
      { question: "How does React plan to improve hydration?", answer: "Through selective hydration, streaming HTML, and making the hydration process interruptible." },
      { question: "What is the role of Asset Loading in React 19?", answer: "React will natively support loading stylesheets, scripts, and fonts, coordinating them with Suspense and concurrent rendering." },
      { question: "How does the 'use' hook differ from other hooks?", answer: "It can be called conditionally and handles unwrapping promises or reading context, integrating closely with Suspense." }
    ],
    practicalTask: {
      scenario: "Using the `use` hook",
      task: "Demonstrate reading a Promise with the experimental `use` hook.",
      solutionCode: "import { use } from 'react';\n\nfunction Message({ messagePromise }) {\n  const message = use(messagePromise);\n  return <p>{message}</p>;\n}"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
