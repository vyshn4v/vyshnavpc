import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch46-advanced-context",
    title: "Chapter 46: Advanced Context API",
    order: 46,
    content: "### 1. Conceptual Overview\nContext provides a way to pass data through the component tree without having to pass props down manually at every level.\n\n### 2. Architecture & Mechanics\nIt uses a Provider and Consumer architecture. The Provider holds the value, and Consumers subscribe to it.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation often leads to unnecessary re-renders. Optimized implementation splits state into multiple contexts and leverages `useMemo`.\n\n### 4. Trade-offs & Complexity\nContext is great for low-frequency updates (theme, auth) but scales poorly for high-frequency state updates compared to robust state managers like Redux or Zustand.",
    interviewQuestions: [
      { question: "What is the Context API?", answer: "A React API to share state across the entire app or part of it without prop drilling." },
      { question: "How do you optimize Context to prevent unnecessary re-renders?", answer: "By splitting contexts based on data frequency or using `useMemo` on the context provider's value." },
      { question: "Can Context replace Redux?", answer: "For simple state and low-frequency updates, yes. For complex, high-frequency state, Redux is better suited." },
      { question: "What is prop drilling?", answer: "Passing props down through multiple layers of components that do not need the data themselves." },
      { question: "How do you consume Context?", answer: "Using the `useContext` hook." }
    ],
    practicalTask: {
      scenario: "Optimized Context implementation.",
      task: "Create an optimized Context provider.",
      solutionCode: "import { createContext, useState, useMemo } from 'react';\nexport const MyContext = createContext();\nexport function MyProvider({ children }) {\n  const [val, setVal] = useState(0);\n  const value = useMemo(() => ({ val, setVal }), [val]);\n  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;\n}"
    }
  },
  {
    slug: "react-ch47-concurrent-rendering",
    title: "Chapter 47: Concurrent Rendering",
    order: 47,
    content: "### 1. Conceptual Overview\nConcurrent rendering allows React to interrupt a long-running render to handle high-priority events, making the UI feel more responsive.\n\n### 2. Architecture & Mechanics\nReact uses a priority queue for updates. Urgent updates (typing, clicking) interrupt non-urgent ones (data fetching, list rendering).\n\n### 3. Implementation: Standard vs Optimized\nStandard rendering blocks the main thread. Optimized concurrent rendering uses `useTransition` and `useDeferredValue` to mark non-urgent updates.\n\n### 4. Trade-offs & Complexity\nAdds complexity to state management and component lifecycle. Developers must ensure components are pure and resilient to interrupted renders.",
    interviewQuestions: [
      { question: "What is Concurrent Rendering in React?", answer: "A mechanism that allows React to pause, abort, or yield rendering work to keep the browser responsive." },
      { question: "What does `useTransition` do?", answer: "It marks a state update as a non-urgent transition, allowing other urgent updates to interrupt it." },
      { question: "What is the difference between `useTransition` and `useDeferredValue`?", answer: "`useTransition` wraps the state updater function, while `useDeferredValue` wraps the value itself to defer its update." },
      { question: "Does concurrent rendering make React faster?", answer: "Not in terms of raw execution time, but it makes the UI feel significantly more responsive." },
      { question: "What are pure components and why are they important here?", answer: "Components that return the same output for the same input without side effects. They are essential because concurrent rendering might render a component multiple times before committing." }
    ],
    practicalTask: {
      scenario: "Using useTransition for a slow update.",
      task: "Wrap a slow state update in a transition.",
      solutionCode: "import { useState, useTransition } from 'react';\nfunction App() {\n  const [isPending, startTransition] = useTransition();\n  const [val, setVal] = useState(0);\n  const handleClick = () => {\n    startTransition(() => {\n      setVal(val + 1);\n    });\n  };\n  return <button onClick={handleClick}>Update {isPending ? '...' : ''}</button>;\n}"
    }
  },
  {
    slug: "react-ch48-suspense-architecture",
    title: "Chapter 48: Suspense Architecture",
    order: 48,
    content: "### 1. Conceptual Overview\nSuspense lets your components 'wait' for something before they can render, showing a fallback UI in the meantime.\n\n### 2. Architecture & Mechanics\nIt works by components throwing a Promise. The nearest Suspense boundary catches it and renders the fallback until the Promise resolves.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation uses Suspense for code-splitting (`React.lazy`). Optimized implementation integrates with data fetching libraries like React Query or Relay.\n\n### 4. Trade-offs & Complexity\nProvides a declarative way to handle loading states but requires compatible data fetching patterns and can lead to complex nested boundary management.",
    interviewQuestions: [
      { question: "What is React Suspense?", answer: "A feature that allows components to delay rendering while waiting for async operations, like data fetching or code splitting, to complete." },
      { question: "How does Suspense know a component is loading?", answer: "The component or its underlying data source throws a Promise that Suspense catches." },
      { question: "What is `React.lazy`?", answer: "A function that lets you render a dynamic import as a regular component, automatically integrating with Suspense." },
      { question: "Can Suspense be used for data fetching?", answer: "Yes, when integrated with a Suspense-compatible library or framework like Relay, SWR, or React Query." },
      { question: "What is the fallback prop?", answer: "A prop on the Suspense component that accepts a React element to display while waiting." }
    ],
    practicalTask: {
      scenario: "Code splitting with Suspense.",
      task: "Implement a lazy-loaded component with a Suspense boundary.",
      solutionCode: "import React, { Suspense } from 'react';\nconst LazyComponent = React.lazy(() => import('./LazyComponent'));\nfunction App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <LazyComponent />\n    </Suspense>\n  );\n}"
    }
  },
  {
    slug: "react-ch49-performance-profiling",
    title: "Chapter 49: Performance Profiling",
    order: 49,
    content: "### 1. Conceptual Overview\nProfiling identifies performance bottlenecks in a React application by measuring render times and component update frequencies.\n\n### 2. Architecture & Mechanics\nReact DevTools Profiler records performance data. The `<Profiler>` API allows programmatic measurement of rendering costs.\n\n### 3. Implementation: Standard vs Optimized\nStandard debugging relies on console logs. Optimized profiling uses the DevTools flamegraph and ranked charts to pinpoint expensive components.\n\n### 4. Trade-offs & Complexity\nProfiling adds overhead and should be disabled in production. Analyzing flamegraphs requires practice to accurately diagnose underlying issues.",
    interviewQuestions: [
      { question: "What is the React DevTools Profiler?", answer: "A tool to record and analyze performance data, showing how often and how fast components render." },
      { question: "What is a flamegraph?", answer: "A visualization showing the component tree and the time spent rendering each component during a commit." },
      { question: "How does the `<Profiler>` API work?", answer: "It wraps a React tree and accepts an `onRender` callback that receives timing metrics." },
      { question: "Why might a component render too often?", answer: "Due to unoptimized parent renders, passing new object references as props, or excessive state updates." },
      { question: "Should you leave profiling enabled in production?", answer: "No, as it incurs a performance penalty. Only enable it in specialized profiling builds." }
    ],
    practicalTask: {
      scenario: "Using the Profiler component.",
      task: "Wrap a component with the React Profiler to log render times.",
      solutionCode: "import { Profiler } from 'react';\nfunction onRenderCallback(id, phase, actualDuration) {\n  console.log(`${id} took ${actualDuration}ms to render`);\n}\nfunction App() {\n  return (\n    <Profiler id=\"App\" onRender={onRenderCallback}>\n      <MyComponent />\n    </Profiler>\n  );\n}"
    }
  },
  {
    slug: "react-ch50-micro-frontends",
    title: "Chapter 50: Micro-Frontends",
    order: 50,
    content: "### 1. Conceptual Overview\nMicro-frontends extend microservice concepts to the frontend, splitting a monolithic app into smaller, independently deployable pieces.\n\n### 2. Architecture & Mechanics\nOften implemented via Webpack Module Federation, where different React apps expose and consume components at runtime.\n\n### 3. Implementation: Standard vs Optimized\nStandard monorepos scale poorly for huge teams. Optimized micro-frontends isolate dependencies and allow mixed technology stacks.\n\n### 4. Trade-offs & Complexity\nIncreases infrastructure complexity, introduces potential version conflicts for shared libraries, and complicates global state and routing.",
    interviewQuestions: [
      { question: "What are Micro-Frontends?", answer: "An architectural style where independently deliverable frontend applications are composed into a greater whole." },
      { question: "What is Webpack Module Federation?", answer: "A Webpack feature that allows a JavaScript application to dynamically load code from another application at runtime." },
      { question: "What is the main benefit of Micro-Frontends?", answer: "Independent deployments and team autonomy in large-scale applications." },
      { question: "How do Micro-Frontends share state?", answer: "Through custom events, shared libraries, or passing data via URL parameters, though global state should be minimized." },
      { question: "What are the drawbacks?", answer: "Increased complexity in CI/CD, potential duplicate dependencies, and inconsistent UI/UX if not governed well." }
    ],
    practicalTask: {
      scenario: "Module Federation configuration.",
      task: "Write a basic Webpack Module Federation plugin configuration.",
      solutionCode: "const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'app1',\n      filename: 'remoteEntry.js',\n      remotes: { app2: 'app2@http://localhost:3002/remoteEntry.js' },\n      shared: { react: { singleton: true }, 'react-dom': { singleton: true } }\n    })\n  ]\n};"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics);
