import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    order: 21,
    title: "Advanced Component Patterns: Compound & Control Props",
    content: "### 1. Conceptual Overview\nCompound components and control props are advanced React patterns that empower developers to create highly reusable, flexible, and expressive UI components. Compound components allow multiple components to work together to share state and logic implicitly, much like `<select>` and `<option>` elements in HTML. Control props allow a component's internal state to be controlled entirely from the outside, shifting the source of truth to the parent component.\n\n### 2. Architecture & Mechanics\nThe architecture of **Compound Components** relies heavily on the React Context API. A parent component provides a context that holds the shared state and updater functions. Child components consume this context to interact with each other without the need for prop drilling.\n**Control Props** follow a controlled vs. uncontrolled component paradigm. The component checks whether a specific prop (like `value`) is passed. If it is, the component becomes \"controlled\" and relies on the parent's state and `onChange` handlers. If not, it uses its own internal state. This is typically implemented using a custom hook like `useControlled`.\n\n### 3. Implementation: Standard vs Optimized\n**Standard Implementation (Prop Drilling)**:\nPassing props down multiple levels to configure components, which leads to rigid and hard-to-maintain code interfaces.\n\n**Optimized Implementation (Compound Components with Context)**:\n```jsx\nconst TabsContext = React.createContext();\n\nfunction Tabs({ children, defaultIndex = 0 }) {\n  const [activeIndex, setActiveIndex] = React.useState(defaultIndex);\n  return (\n    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>\n      <div className=\"tabs\">{children}</div>\n    </TabsContext.Provider>\n  );\n}\n\nfunction TabList({ children }) {\n  return <div className=\"tab-list\">{children}</div>;\n}\n\nfunction Tab({ index, children }) {\n  const { activeIndex, setActiveIndex } = React.useContext(TabsContext);\n  const isActive = index === activeIndex;\n  return (\n    <button onClick={() => setActiveIndex(index)} className={isActive ? 'active' : ''}>\n      {children}\n    </button>\n  );\n}\n```\n\n### 4. Trade-offs & Complexity\n- **Flexibility vs. Learning Curve**: These patterns offer immense flexibility, allowing consumers to rearrange and customize components. However, they significantly increase the complexity of the component's internal implementation and require a deeper understanding of React Context and controlled state management.\n- **Performance**: Using Context for compound components can lead to unnecessary re-renders if the context value changes frequently and consumers aren't properly memoized. It's crucial to memoize the context value provider.",
    interviewQuestions: [
      {
        question: "Explain the Compound Component pattern and give a real-world use case.",
        answer: "The Compound Component pattern allows multiple components to work together sharing implicit state, usually via React Context. A classic example is a `<Select>` component with multiple `<Option>` children, or a `<Tabs>` component with `<TabList>` and `<TabPanels>`."
      },
      {
        question: "How do you implement the Control Props pattern?",
        answer: "You implement it by checking if a prop (e.g., `value`) is defined. If it is, you use that prop and the corresponding `onChange` handler provided by the parent. If it's undefined, you use internal state."
      },
      {
        question: "What are the performance implications of using Context in Compound Components?",
        answer: "Whenever the Context value changes, all components consuming that context will re-render. To optimize, use `useMemo` for the context value."
      },
      {
        question: "How can you enforce that child components are only used within their intended parent?",
        answer: "By creating a custom hook to consume the context and throwing an error if the context is undefined."
      },
      {
        question: "Compare Higher-Order Components (HOCs) to Render Props.",
        answer: "Both solve cross-cutting concerns. HOCs are functions returning a new component, risking prop collisions. Render props pass a function as a prop to allow dynamic composition."
      }
    ],
    practicalTask: {
      title: "Build an Accordion using Compound Components",
      description: "Create an `<Accordion>` component that uses Compound Components. It should have `<Accordion.Item>`, `<Accordion.Header>`, and `<Accordion.Panel>`. The state should manage which item is currently expanded.",
      solution: "Implement an `AccordionContext`. The `Accordion` provider stores `openIndex`. `Accordion.Header` calls `setOpenIndex(index)`, and `Accordion.Panel` checks if `openIndex === index` to render its children."
    }
  },
  {
    order: 22,
    title: "Architecting Large-Scale State: Zustand & Jotai",
    content: "### 1. Conceptual Overview\nAs React applications scale, standard Context API and Redux often introduce boilerplate, performance bottlenecks, or rigid architectures. Atomic state management (like Jotai) and simplified flux-like stores (like Zustand) provide modern, highly optimized alternatives. Zustand offers a global store without Context providers, focusing on hooks. Jotai embraces a bottom-up, atomic approach where individual pieces of state are independent and composable.\n\n### 2. Architecture & Mechanics\n**Zustand** operates on a single-store philosophy but utilizes React hooks for consumption. It doesn't require wrapping the app in a Provider. It uses a custom pub/sub system to trigger re-renders only in components that subscribe to the specific slice of state that changed.\n**Jotai** uses an atomic model. Atoms are tiny, independent units of state. Components subscribe directly to atoms. This architecture inherently prevents unnecessary re-renders because changes to one atom only affect components explicitly using that atom. Atoms can also be derived from other atoms, creating a robust dependency graph.\n\n### 3. Implementation: Standard vs Optimized\n**Standard (Redux Boilerplate)**:\nRequires actions, reducers, dispatchers, and heavily connected components, often leading to slow development velocity for simple state.\n\n**Optimized (Zustand)**:\n```javascript\nimport { create } from 'zustand';\n\nconst useBearStore = create((set) => ({\n  bears: 0,\n  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),\n  removeAllBears: () => set({ bears: 0 }),\n}));\n\nfunction BearCounter() {\n  const bears = useBearStore((state) => state.bears);\n  return <h1>{bears} around here ...</h1>;\n}\n```\n\n### 4. Trade-offs & Complexity\n- **Zustand**: Extremely fast setup and excellent performance due to slice-based subscriptions. However, handling highly normalized relational data might still require careful architecture compared to Redux Toolkit's entity adapters.\n- **Jotai**: Excellent for heavily interactive UIs where many disparate elements update independently. The trade-off is the mental shift to atomic thinking; managing hundreds of scattered atoms can become difficult without proper organization.",
    interviewQuestions: [
      {
        question: "Why choose Zustand over React Context?",
        answer: "React Context causes all consuming components to re-render whenever the context value changes. Zustand allows components to select specific slices of state, triggering re-renders only when those specific slices update."
      },
      {
        question: "Explain the atomic state model used by Jotai or Recoil.",
        answer: "The atomic model treats state as small, independent units called atoms. Components subscribe directly to individual atoms. State updates flow from atoms to components without a centralized store."
      },
      {
        question: "How does Zustand achieve state updates without a Provider component?",
        answer: "Zustand maintains the store outside the React component tree and uses a custom pub/sub mechanism internally. It hooks into React's lifecycle using `useSyncExternalStore` to trigger re-renders."
      },
      {
        question: "When is Redux still preferable over lightweight libraries like Zustand?",
        answer: "Redux is excellent when the application requires complex state serialization, rigorous audit trails (time-travel debugging), highly normalized relational data with entity adapters, or when working in very large teams."
      },
      {
        question: "How do derived states work in Jotai?",
        answer: "In Jotai, you can create a read-only atom by passing a function that reads the values of other atoms. When dependent atoms change, the derived atom automatically recalculates its value."
      }
    ],
    practicalTask: {
      title: "Migrate Context to Zustand",
      description: "Take a simple application that uses React Context to manage an authentication token and user profile, and rewrite the state management using Zustand.",
      solution: "Create a Zustand store using `create`. Move the state (`token`, `user`) and actions (`login`, `logout`) into the store definition. Replace `useContext` calls with `useStore(state => state.user)`."
    }
  },
  {
    order: 23,
    title: "Deep Dive: Concurrent React & Suspense Under the Hood",
    content: "### 1. Conceptual Overview\nConcurrent React is a fundamental shift in how React renders UI. Instead of rendering the entire component tree in a single, uninterruptible, synchronous block, Concurrent React can pause, abort, or resume rendering work. Suspense is a mechanism built on this architecture, allowing React to \"wait\" for asynchronous operations before painting the UI.\n\n### 2. Architecture & Mechanics\nReact uses a fiber architecture. In concurrent mode, it assigns priorities to different updates (e.g., typing in an input is high priority, while background data fetching is low priority).\n**Suspense Mechanics**: When a component needs data that isn't ready, it throws a Promise. React catches this Promise, suspends the rendering of that tree, and finds the nearest `<Suspense>` boundary above it to display a fallback UI. Once the Promise resolves, React retries rendering the suspended tree.\n\n### 3. Implementation: Standard vs Optimized\n**Standard (Loading State Variables)**:\n```jsx\nfunction Profile() {\n  const [data, setData] = useState(null);\n  useEffect(() => { fetchProfile().then(setData); }, []);\n  if (!data) return <Spinner />;\n  return <div>{data.name}</div>;\n}\n```\n\n**Optimized (Suspense with Data Fetching)**:\n```jsx\nconst resource = fetchProfileData();\n\nfunction Profile() {\n  const data = resource.read(); // Throws Promise if not ready\n  return <div>{data.name}</div>;\n}\n```\n\n### 4. Trade-offs & Complexity\n- **User Experience vs. Developer Experience**: Suspense dramatically improves UX by orchestrating loading states declaratively and avoiding UI \"jank.\" However, writing Suspense-compatible data fetching from scratch is incredibly complex. This is why React relies on frameworks (Next.js) or libraries (React Query, SWR) to provide Suspense integrations.\n- **Waterfalls**: Improperly nested Suspense boundaries can lead to request waterfalls if data fetching is initiated during render. Patterns like \"Render-as-You-Fetch\" are required to maximize performance.",
    interviewQuestions: [
      {
        question: "What does it mean that React rendering is now 'interruptible'?",
        answer: "Interruptible rendering means React can start rendering an update, pause it to handle a higher-priority event (like user input), and then resume or discard the previous rendering work."
      },
      {
        question: "How does React Suspense handle data fetching internally?",
        answer: "A component reading asynchronous data throws a Promise if the data isn't ready. React catches this Promise, stops rendering that component, and renders the fallback of the nearest `<Suspense>` boundary."
      },
      {
        question: "Explain the 'Render-as-You-Fetch' pattern.",
        answer: "Instead of fetching data inside `useEffect` (Fetch-on-Render), Render-as-You-Fetch initiates the data request before rendering begins. The component is then rendered and immediately suspends if the data isn't ready."
      },
      {
        question: "What is the purpose of the `useTransition` hook?",
        answer: "`useTransition` allows you to mark a state update as a non-urgent transition. It keeps the UI responsive during expensive updates. React will prioritize urgent updates and render the transition in the background."
      },
      {
        question: "What are React Server Components and how do they relate to Suspense?",
        answer: "Server Components execute exclusively on the server and stream their UI output to the client. They seamlessly integrate with Suspense, allowing the server to stream fallback UIs immediately."
      }
    ],
    practicalTask: {
      title: "Implement useTransition for Search",
      description: "You have an input field that filters a massive list of 10,000 items. Typing in the input causes noticeable lag. Use `useTransition` to optimize it.",
      solution: "Wrap the state update for the search query in `startTransition`. Keep a separate state for the immediate input value."
    }
  },
  {
    order: 24,
    title: "Modern Hydration: SSR, SSG, and React Server Components",
    content: "### 1. Conceptual Overview\nServer-Side Rendering (SSR) generates initial HTML on the server, allowing the browser to display content before JavaScript is downloaded. Hydration is the process where React attaches event listeners to this static HTML, making it interactive. Modern React introduces partial hydration, streaming SSR, and React Server Components (RSC) to solve hydration bottlenecks.\n\n### 2. Architecture & Mechanics\n**Standard Hydration**: The browser must download, parse, and execute all JavaScript for the entire page before any of it becomes interactive.\n**Streaming SSR & Suspense**: React 18 allows the server to send HTML in chunks via streams. Suspense boundaries allow React to selectively hydrate parts of the UI.\n**React Server Components (RSC)**: RSCs never ship their JavaScript to the client. They are resolved on the server, and the server sends a serialized UI format to the client. Only Client Components (marked with 'use client') are hydrated.\n\n### 3. Implementation: Standard vs Optimized\n**Standard SSR (Blocking)**:\nWaiting for all database queries to finish on the server before sending the complete HTML string.\n\n**Optimized (Streaming with RSC in Next.js)**:\n```jsx\n// app/page.js - Server Component (No JS sent to client)\nimport db from './db';\nimport { Suspense } from 'react';\nimport ProductList from './ProductList'; // Client Component\n\nexport default async function Page() {\n  const initialData = await db.fetchFastData();\n  \n  return (\n    <div>\n      <h1>{initialData.title}</h1>\n      <Suspense fallback={<p>Loading products...</p>}>\n         <ProductList /> \n      </Suspense>\n    </div>\n  );\n}\n```\n\n### 4. Trade-offs & Complexity\n- **RSC vs. Client Components**: RSCs dramatically reduce client bundle sizes and offer direct access to backend resources. However, they cannot use React hooks (`useState`, `useEffect`) or browser APIs. Developers must carefully architect the component tree.\n- **Streaming Complexity**: Handling errors in streamed responses is complex; once headers are sent, you cannot change the HTTP status code, requiring specialized error boundaries on the client.",
    interviewQuestions: [
      {
        question: "What is hydration in React?",
        answer: "Hydration is the process where React takes static HTML delivered by the server and attaches event listeners and state management to it, turning it into a fully interactive React application."
      },
      {
        question: "Explain the problem of 'Hydration Mismatches'.",
        answer: "A mismatch occurs when the HTML generated by the server differs from the initial tree React expects to render on the client. React will discard the server HTML and re-render from scratch."
      },
      {
        question: "How do React Server Components differ from Server-Side Rendering?",
        answer: "SSR generates HTML for components but still sends their JavaScript to the client for hydration. RSCs never send their JavaScript to the client; they only output UI representation."
      },
      {
        question: "What is selective hydration?",
        answer: "Selective hydration, enabled by React 18 Suspense, allows React to begin hydrating parts of the tree before the entire application has been loaded or rendered."
      },
      {
        question: "Why can't you use `useState` in a React Server Component?",
        answer: "Because Server Components execute only once on the server to generate UI. They do not persist in memory across user interactions or participate in the browser's event loop."
      }
    ],
    practicalTask: {
      title: "Identify Server and Client Boundaries",
      description: "Given a layout with a Sidebar (needs `onClick`), a Main Article (fetched from DB), and a Footer (static text), architect this using Server and Client Components.",
      solution: "Make the Main Article and Footer Server Components to eliminate their JS payload. Extract the interactive parts of the Sidebar into a separate Client Component with 'use client'."
    }
  },
  {
    order: 25,
    title: "React Performance Profiling and Optimization",
    content: "### 1. Conceptual Overview\nPerformance optimization in React involves identifying and eliminating unnecessary re-renders, preventing large layout shifts, and managing memory efficiently. While React is fast by default, complex applications can suffer from \"render thrashing,\" where deep component trees re-render needlessly due to reference changes in props or state.\n\n### 2. Architecture & Mechanics\nReact's reconciliation algorithm uses a heuristic to compare the Virtual DOM. When a component's state or props change, React recursively evaluates it and all its children. \n**Optimization Tools**: \n- `React.memo`: Prevents a component from re-rendering if its props have not changed.\n- `useMemo` / `useCallback`: Caches expensive calculations or function references between renders.\n- **React Profiler**: A DevTools extension that visualizes component render times and the reasons for updates.\n\n### 3. Implementation: Standard vs Optimized\n**Standard (Causes unnecessary child renders)**:\n```jsx\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const data = { id: 1 }; // New reference every render\n  const handleClick = () => console.log('Clicked'); // New reference\n\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n      <ExpensiveChild data={data} onClick={handleClick} />\n    </div>\n  );\n}\n```\n\n**Optimized (Memoization)**:\n```jsx\nfunction Parent() {\n  const [count, setCount] = useState(0);\n  const data = useMemo(() => ({ id: 1 }), []); \n  const handleClick = useCallback(() => console.log('Clicked'), []);\n\n  return (\n    <div>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n      <ExpensiveChild data={data} onClick={handleClick} />\n    </div>\n  );\n}\n```\n\n### 4. Trade-offs & Complexity\n- **Cost of Memoization**: `useMemo` and `useCallback` are not free. They require memory allocation to store dependencies and CPU cycles to compare them. Overusing them on trivial calculations often degrades performance rather than improving it.\n- **State Colocation**: The most powerful optimization is often architectural, not programmatic. By moving state down to the components that actually need it (State Colocation), you prevent parent components from re-rendering entirely.",
    interviewQuestions: [
      {
        question: "When should you use `React.memo`?",
        answer: "Use `React.memo` when a component renders frequently with the exact same props, and its render logic is expensive enough to cause performance drops. Do not use it for lightweight components."
      },
      {
        question: "Explain the difference between `useMemo` and `useCallback`.",
        answer: "`useMemo` caches the result of an expensive calculation based on its dependencies. `useCallback` caches the function reference itself. `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`."
      },
      {
        question: "What is 'State Colocation' and how does it improve performance?",
        answer: "State colocation means placing the state as close as possible to the components that consume it. Moving it down isolates the re-renders to only the affected components."
      },
      {
        question: "How do you identify memory leaks in a React application?",
        answer: "Memory leaks often occur when event listeners or subscriptions are not cleaned up when a component unmounts. You can identify them using the Chrome DevTools Memory tab to take heap snapshots."
      },
      {
        question: "Why might an inline object or function cause performance issues in React?",
        answer: "Inline objects or functions create a new memory reference on every render. If passed to a child component wrapped in `React.memo`, the shallow comparison will fail, causing the child to re-render unnecessarily."
      }
    ],
    practicalTask: {
      title: "Profile and Fix Unnecessary Renders",
      description: "A parent component manages a text input state and renders a heavy `Chart` component. Typing in the input makes the chart lag.",
      solution: "Extract the text input and its state into a separate `SearchInput` component. By doing this (state colocation), typing only re-renders the `SearchInput` and not the parent, preventing the `Chart` from re-rendering."
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'Mastering advanced React concepts, patterns, and performance optimizations for industrial-scale applications.', topics)
  .then(() => console.log('Seeded successfully'))
  .catch(console.error);
