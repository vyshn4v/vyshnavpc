import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-fiber-architecture",
    title: "React Fiber Architecture",
    order: 16,
    content: "### 1. Conceptual Overview\nReact Fiber is the new reconciliation engine in React 16. Its main goal is to enable incremental rendering of the virtual DOM. It breaks rendering work into chunks and spreads it out over multiple frames, allowing React to yield to the browser's main thread and keep the app responsive.\n\n### 2. Architecture & Mechanics\nFiber introduces a new data structure (a \"fiber\") that represents a unit of work. Each React element is converted into a fiber node. Fibers are linked together in a tree (singly linked list structure) using child, sibling, and return pointers. This structure allows React to pause, abort, or reuse work. It operates in two phases: the render/reconciliation phase (interruptible) and the commit phase (synchronous).\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation relies on the default stack reconciler which processes the entire component tree synchronously. The optimized Fiber implementation uses `requestIdleCallback` (or a polyfill) to schedule work during browser idle times. This allows high-priority tasks (like user input) to interrupt low-priority rendering work.\n\n### 4. Trade-offs & Complexity\nFiber significantly improves the perceived performance and responsiveness of complex applications. However, it introduces complexity in the internal React codebase and changes how some lifecycle methods (like `componentWillMount`) behave, leading to the deprecation of legacy lifecycles as they could be invoked multiple times before a commit.",
    interviewQuestions: [
      {
        question: "What is React Fiber and why was it introduced?",
        answer: "React Fiber is a reimplementation of React's core algorithm. It was introduced to enable incremental rendering, allowing React to pause and resume work to keep the UI responsive during heavy updates."
      },
      {
        question: "What are the two phases of React Fiber?",
        answer: "The render/reconciliation phase (which is asynchronous and interruptible) and the commit phase (which is synchronous and applies changes to the DOM)."
      },
      {
        question: "How does a fiber node differ from a React element?",
        answer: "A React element is a plain object describing what you want to see on the screen. A fiber node is a mutable internal data structure that represents a unit of work and keeps track of a component's state and DOM representation."
      },
      {
        question: "Why were certain lifecycle methods deprecated with the introduction of Fiber?",
        answer: "Methods like `componentWillMount` were deprecated because the interruptible nature of the render phase means they could be called multiple times before a single commit, leading to bugs if they contained side effects."
      },
      {
        question: "Explain the concept of priority in React Fiber.",
        answer: "Fiber assigns priorities to different updates. User interactions like typing or clicking have high priority and need immediate processing, while background data fetching or hidden off-screen rendering can be scheduled with lower priority."
      }
    ],
    practicalTask: {
      scenario: "You have a component that renders a massive list of items, causing the main thread to block.",
      task: "Optimize the component using concurrent features to allow the browser to remain responsive.",
      solutionCode: "import React, { useState, useTransition } from 'react';\n\nfunction LargeList() {\n  const [items, setItems] = useState([]);\n  const [isPending, startTransition] = useTransition();\n\n  const loadItems = () => {\n    startTransition(() => {\n      const newItems = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);\n      setItems(newItems);\n    });\n  };\n\n  return (\n    <div>\n      <button onClick={loadItems}>Load Massive List</button>\n      {isPending ? <p>Loading...</p> : <ul>{items.map(item => <li key={item}>{item}</li>)}</ul>}\n    </div>\n  );\n}\n"
    }
  },
  {
    slug: "concurrent-rendering",
    title: "Concurrent Rendering",
    order: 17,
    content: "### 1. Conceptual Overview\nConcurrent Rendering is a set of capabilities built on top of Fiber that allows React to prepare multiple versions of the UI at the same time. It lets React interrupt a long-running render to handle a high-priority event, and then resume or discard the previous work.\n\n### 2. Architecture & Mechanics\nAt its core, Concurrent Rendering works by yielding control back to the browser periodically. React works on an \"in-memory\" tree (the work-in-progress tree). When an urgent update occurs, React can abandon the current work-in-progress tree, process the urgent update, and then restart the low-priority work.\n\n### 3. Implementation: Standard vs Optimized\nStandard synchronous rendering blocks the main thread until the entire tree is rendered. Concurrent Rendering is explicitly opted into via the `createRoot` API in React 18. This allows features like `useTransition` and `useDeferredValue` to separate urgent updates from non-urgent ones.\n\n### 4. Trade-offs & Complexity\nConcurrent features provide a massive boost to user experience by eliminating jank. The trade-off is the mental model shift required from developers to understand that renders can be interrupted and that components must be resilient to multiple re-renders without side effects before commit.",
    interviewQuestions: [
      {
        question: "What is Concurrent Rendering in React?",
        answer: "It's a mechanism that allows React to prepare multiple versions of the UI simultaneously and interrupt rendering to handle urgent updates, improving app responsiveness."
      },
      {
        question: "How do you enable Concurrent Mode in React 18?",
        answer: "By replacing `ReactDOM.render` with `ReactDOM.createRoot`."
      },
      {
        question: "What is the difference between synchronous and concurrent rendering?",
        answer: "Synchronous rendering blocks the main thread until complete. Concurrent rendering is interruptible, allowing React to yield control to the browser to handle other events."
      },
      {
        question: "What is tearing, and how does React prevent it in concurrent mode?",
        answer: "Tearing happens when a UI shows inconsistent states for the same data. React prevents this by ensuring that the DOM is updated synchronously in the commit phase, even if the render phase is interrupted."
      },
      {
        question: "Which hooks are primarily associated with Concurrent Rendering?",
        answer: "Hooks like `useTransition`, `useDeferredValue`, and `useSyncExternalStore`."
      }
    ],
    practicalTask: {
      scenario: "A search input filters a large list of items on every keystroke, causing the input to feel sluggish.",
      task: "Use a concurrent hook to decouple the input state update from the slow list rendering.",
      solutionCode: "import React, { useState, useDeferredValue } from 'react';\n\nfunction SearchApp({ items }) {\n  const [query, setQuery] = useState('');\n  const deferredQuery = useDeferredValue(query);\n\n  const filteredItems = items.filter(item => item.includes(deferredQuery));\n\n  return (\n    <div>\n      <input \n        type=\"text\" \n        value={query} \n        onChange={e => setQuery(e.target.value)} \n        placeholder=\"Search...\" \n      />\n      <ul>\n        {filteredItems.map(item => <li key={item}>{item}</li>)}\n      </ul>\n    </div>\n  );\n}\n"
    }
  },
  {
    slug: "react-server-components",
    title: "React Server Components (RSC)",
    order: 18,
    content: "### 1. Conceptual Overview\nReact Server Components (RSC) allow components to be rendered exclusively on the server, sending zero JavaScript to the client. This reduces bundle size and allows components to directly access server-side resources like databases or file systems.\n\n### 2. Architecture & Mechanics\nRSCs split the component tree into Server Components and Client Components. Server Components are executed on the server during the request or build time, and their output is serialized into a special wire format. Client components are hydration boundaries where standard React lifecycle and state take over on the client.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation relies on fetching data on the client (e.g., in a `useEffect`) or using SSR mechanisms like `getServerSideProps`. The optimized RSC approach mixes server-only execution with interactive client islands. You mark client components with the `\"use client\"` directive, while all other components default to running on the server.\n\n### 4. Trade-offs & Complexity\nRSCs greatly decrease initial load times and client-side JS bundle sizes. The main trade-off is architectural complexity: developers must understand the boundary between server and client, carefully manage serialization of props passed between them, and learn the constraints (e.g., no hooks in Server Components).",
    interviewQuestions: [
      {
        question: "What are React Server Components?",
        answer: "They are a new type of React component that renders exclusively on the server, resulting in zero client-side JavaScript for that component."
      },
      {
        question: "How do Server Components differ from Server-Side Rendering (SSR)?",
        answer: "SSR renders the initial HTML for SEO and fast paint, but still requires hydrating the entire tree on the client with JavaScript. Server Components are never hydrated on the client; their JS is excluded entirely."
      },
      {
        question: "What is the `\"use client\"` directive used for?",
        answer: "It marks the boundary between the server-only code and the client-side interactive code, explicitly declaring a component (and its imports) as a Client Component."
      },
      {
        question: "Can you use `useState` in a Server Component?",
        answer: "No, Server Components do not have state or lifecycle methods because they execute once on the server and do not exist in the browser."
      },
      {
        question: "What is a limitation when passing props from a Server to a Client component?",
        answer: "Props passed across the boundary must be serializable (e.g., JSON). Functions or complex non-serializable objects cannot be passed directly."
      }
    ],
    practicalTask: {
      scenario: "You need to fetch user data from a database and display it, while providing an interactive 'Edit' button.",
      task: "Structure the code using a Server Component for the data fetch and a Client Component for the interactivity.",
      solutionCode: "// page.js (Server Component)\nimport { getUser } from './db';\nimport EditButton from './EditButton';\n\nexport default async function UserProfile({ id }) {\n  const user = await getUser(id);\n  \n  return (\n    <div>\n      <h1>{user.name}</h1>\n      <p>Email: {user.email}</p>\n      <EditButton userId={user.id} />\n    </div>\n  );\n}\n\n// EditButton.js (Client Component)\n'use client';\nimport { useState } from 'react';\n\nexport default function EditButton({ userId }) {\n  const [isEditing, setIsEditing] = useState(false);\n  \n  return (\n    <button onClick={() => setIsEditing(!isEditing)}>\n      {isEditing ? 'Cancel' : 'Edit User'}\n    </button>\n  );\n}\n"
    }
  },
  {
    slug: "transitions-and-suspense",
    title: "Transitions & Suspense",
    order: 19,
    content: "### 1. Conceptual Overview\nTransitions and Suspense are core features of React's concurrent rendering. Transitions allow you to mark state updates as non-urgent, while Suspense lets you declaratively specify loading states for parts of the UI that are waiting for asynchronous data or code.\n\n### 2. Architecture & Mechanics\nWhen an update is wrapped in `startTransition`, React categorizes it as low-priority. If a component suspends (throws a Promise) during this transition, React will wait for the Promise to resolve without immediately showing a fallback, preserving the existing UI until the new content is ready.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementations use boolean flags (`isLoading`) to show spinners, often leading to flashing UI and layout shifts. Optimized implementations wrap state updates in transitions and wrap components in `<Suspense>` boundaries, allowing React to orchestrate a smoother visual transition.\n\n### 4. Trade-offs & Complexity\nThis pattern drastically simplifies loading state management and prevents \"spinner hell.\" The trade-off is the requirement for data fetching libraries to integrate with Suspense (by throwing Promises), which can be complex to implement from scratch without a framework like Next.js or libraries like React Query.",
    interviewQuestions: [
      {
        question: "What is the purpose of the `useTransition` hook?",
        answer: "It allows developers to mark certain state updates as non-urgent, keeping the UI responsive during complex rendering."
      },
      {
        question: "How does Suspense work with data fetching?",
        answer: "A component throws a Promise when waiting for data. React catches this Promise, suspends the render, and displays the nearest Suspense fallback until the Promise resolves."
      },
      {
        question: "What is the difference between `startTransition` and a regular state update?",
        answer: "Regular updates are urgent and block the main thread. `startTransition` updates are interruptible and can yield to urgent updates like user typing."
      },
      {
        question: "How do Transitions and Suspense work together?",
        answer: "If a component suspends during a transition, React avoids showing the Suspense fallback immediately. It keeps the old UI interactive while rendering the new UI in the background."
      },
      {
        question: "What does the `isPending` flag returned by `useTransition` indicate?",
        answer: "It indicates that the non-urgent state update wrapped in `startTransition` is still being processed."
      }
    ],
    practicalTask: {
      scenario: "Navigating between tabs causes a data fetch. You want to avoid showing a loading spinner immediately if the fetch is fast.",
      task: "Implement tab switching using `startTransition` and a Suspense boundary.",
      solutionCode: "import React, { useState, useTransition, Suspense } from 'react';\n\n// Assume ProfileTab and PostsTab suspend while fetching data\nimport { ProfileTab, PostsTab } from './Tabs'; \n\nexport default function Dashboard() {\n  const [tab, setTab] = useState('profile');\n  const [isPending, startTransition] = useTransition();\n\n  const switchTab = (newTab) => {\n    startTransition(() => {\n      setTab(newTab);\n    });\n  };\n\n  return (\n    <div>\n      <nav>\n        <button onClick={() => switchTab('profile')}>Profile</button>\n        <button onClick={() => switchTab('posts')}>Posts</button>\n        {isPending && <span> Loading new tab...</span>}\n      </nav>\n      <Suspense fallback={<p>Loading...</p>}>\n        {tab === 'profile' ? <ProfileTab /> : <PostsTab />}\n      </Suspense>\n    </div>\n  );\n}\n"
    }
  },
  {
    slug: "advanced-custom-hooks",
    title: "Advanced Custom Hooks & Patterns",
    order: 20,
    content: "### 1. Conceptual Overview\nCustom hooks allow you to extract reusable logic from components. Advanced custom hooks often manage complex state machines, integrate with external APIs, or encapsulate performance optimizations like debouncing and external store synchronization.\n\n### 2. Architecture & Mechanics\nAdvanced hooks compose standard React hooks (`useState`, `useEffect`, `useRef`) together to build higher-level abstractions. For example, `useSyncExternalStore` is a specialized hook designed to subscribe to external stores safely in a concurrent world, preventing tearing.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation often re-invents logic inside components, leading to massive `useEffect` blocks and duplicated state management. An optimized approach abstracts this into cohesive hooks (e.g., `useFetch`, `useMediaQuery`, `useLocalStorage`), making components smaller, more declarative, and easier to test.\n\n### 4. Trade-offs & Complexity\nCustom hooks enforce a clean separation of concerns and promote reusability. The downside is that poorly designed hooks can create hidden dependencies, cause infinite re-render loops due to unstable object references, and obfuscate component logic if abstracted too far.",
    interviewQuestions: [
      {
        question: "What defines a custom hook in React?",
        answer: "A custom hook is a JavaScript function whose name starts with 'use' and that calls other React hooks to encapsulate reusable logic."
      },
      {
        question: "How do you prevent a custom hook from causing unnecessary re-renders?",
        answer: "By memoizing callback functions with `useCallback` and return values with `useMemo` where appropriate, ensuring stable references are passed back to the component."
      },
      {
        question: "What is `useSyncExternalStore` and when should you use it?",
        answer: "It is a React 18 hook used to safely read and subscribe from external data sources in a way that is compatible with concurrent rendering, preventing UI tearing."
      },
      {
        question: "Why shouldn't you call hooks conditionally?",
        answer: "React relies on the exact order in which hooks are called on every render to associate state with the correct hook. Conditional calls break this order."
      },
      {
        question: "Explain a scenario where `useImperativeHandle` is useful.",
        answer: "It is useful when you need to expose specific imperative functions (like `focus()` or `reset()`) to a parent component using a ref, rather than exposing the entire underlying DOM node."
      }
    ],
    practicalTask: {
      scenario: "You need a hook that delays the update of a value, typically used for search inputs to prevent excessive API calls.",
      task: "Write a `useDebounce` custom hook.",
      solutionCode: "import { useState, useEffect } from 'react';\n\nfunction useDebounce(value, delay) {\n  const [debouncedValue, setDebouncedValue] = useState(value);\n\n  useEffect(() => {\n    // Update debounced value after delay\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    // Cancel the timeout if value changes (also on delay change or unmount)\n    // This is how we prevent debounced value from updating if value is changed ...\n    // .. within the delay period. Timeout gets cleared and restarted.\n    return () => {\n      clearTimeout(handler);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n\nexport default useDebounce;\n"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'Master React development with advanced patterns, concurrent rendering, and server components.', topics);
