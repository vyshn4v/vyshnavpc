import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-concurrent-rendering",
    title: "26. Advanced Concurrent Rendering",
    order: 26,
    content: `### 1. Conceptual Overview
Concurrent React allows React to interrupt a long-running render to handle a high-priority event.

### 2. Architecture & Mechanics
React uses a work loop and fibers to yield back to the browser.

### 3. Implementation: Standard vs Optimized
Standard render blocks the main thread. Optimized uses useTransition to keep UI responsive.

### 4. Trade-offs & Complexity
Adds complexity in handling intermediate states but drastically improves UX.`,
    interviewQuestions: [
      { question: "What is Concurrent Mode?", answer: "A set of features helping React apps stay responsive." },
      { question: "How does useTransition work?", answer: "It marks some state updates as non-urgent." },
      { question: "What is a Fiber?", answer: "React's internal unit of work." },
      { question: "How does time-slicing work?", answer: "Breaking work into chunks and yielding to the browser." },
      { question: "What are the trade-offs of concurrent features?", answer: "Complexity of state consistency." }
    ],
    practicalTask: {
      scenario: "A slow list rendering",
      task: "Use useTransition to keep input responsive while filtering a large list.",
      solutionCode: "const [isPending, startTransition] = useTransition(); startTransition(() => setQuery(e.target.value));"
    }
  },
  {
    slug: "react-server-components-depth",
    title: "27. Server Components in Depth",
    order: 27,
    content: `### 1. Conceptual Overview
React Server Components allow rendering components entirely on the server.

### 2. Architecture & Mechanics
They do not add to the client-side JavaScript bundle and run exclusively on the server.

### 3. Implementation: Standard vs Optimized
Standard React sends all components to the client. RSC keeps heavy dependencies on the server.

### 4. Trade-offs & Complexity
Reduces bundle size but requires a framework like Next.js to route and render.`,
    interviewQuestions: [
      { question: "What are React Server Components?", answer: "Components that run only on the server." },
      { question: "Can RSC have state?", answer: "No, they cannot use useState or useEffect." },
      { question: "How are they different from SSR?", answer: "SSR sends HTML and then hydrates. RSC streams UI format." },
      { question: "Can you pass functions to Client Components from RSC?", answer: "No, functions are not serializable." },
      { question: "What is the benefit of RSC?", answer: "Smaller JS bundles and direct access to server resources." }
    ],
    practicalTask: {
      scenario: "Fetching DB data",
      task: "Create a Server Component that reads directly from a database.",
      solutionCode: "export default async function Page() { const data = await db.query(); return <div>{data}</div>; }"
    }
  },
  {
    slug: "react-complex-state",
    title: "28. Complex State Management Patterns",
    order: 28,
    content: `### 1. Conceptual Overview
Handling deeply nested state or derived state requires robust patterns.

### 2. Architecture & Mechanics
Using Context + useReducer, or atomic state libraries like Jotai/Zustand.

### 3. Implementation: Standard vs Optimized
Prop drilling is standard. Using selectors to prevent re-renders is optimized.

### 4. Trade-offs & Complexity
External stores add dependency but simplify cross-component state.`,
    interviewQuestions: [
      { question: "When to use useReducer over useState?", answer: "For complex state logic involving multiple sub-values." },
      { question: "What is atomic state?", answer: "State broken down into small, independent units." },
      { question: "How does Zustand work?", answer: "It creates a global store with hooks without context providers." },
      { question: "What is a selector?", answer: "A function to extract a specific piece of state." },
      { question: "Why avoid massive contexts?", answer: "They trigger re-renders for all consumers when any value changes." }
    ],
    practicalTask: {
      scenario: "Global theme and user state",
      task: "Implement a Zustand store for user session.",
      solutionCode: "const useStore = create(set => ({ user: null, login: (u) => set({user: u}) }));"
    }
  },
  {
    slug: "react-performance-optimization",
    title: "29. React Performance Optimization Strategies",
    order: 29,
    content: `### 1. Conceptual Overview
Performance optimization ensures smooth 60fps rendering and fast load times.

### 2. Architecture & Mechanics
React uses virtual DOM, but unnecessary renders cost CPU cycles.

### 3. Implementation: Standard vs Optimized
Standard renders all children. Optimized uses React.memo and useMemo.

### 4. Trade-offs & Complexity
Overusing useMemo can actually hurt performance due to memory overhead.`,
    interviewQuestions: [
      { question: "What does React.memo do?", answer: "It memoizes a component based on props." },
      { question: "When should you use useCallback?", answer: "When passing callbacks to memoized children." },
      { question: "How to find performance bottlenecks?", answer: "Using React Profiler." },
      { question: "What is code splitting?", answer: "Loading JS bundles only when needed via React.lazy." },
      { question: "Is useMemo always good?", answer: "No, it has an overhead and should be used for expensive calculations." }
    ],
    practicalTask: {
      scenario: "Expensive calculation blocking render",
      task: "Wrap a prime number calculation in useMemo.",
      solutionCode: "const prime = useMemo(() => calculatePrime(num), [num]);"
    }
  },
  {
    slug: "react-micro-frontends",
    title: "30. Micro-Frontends with React",
    order: 30,
    content: `### 1. Conceptual Overview
Micro-frontends break down a monolith into smaller, independent apps.

### 2. Architecture & Mechanics
Module Federation in Webpack allows sharing dependencies and components at runtime.

### 3. Implementation: Standard vs Optimized
Standard SPA is a monolith. Optimized micro-frontends load remote entries dynamically.

### 4. Trade-offs & Complexity
Deployment complexity increases significantly, along with styling conflicts.`,
    interviewQuestions: [
      { question: "What are micro-frontends?", answer: "Independent fragments of UI that form a single application." },
      { question: "What is Module Federation?", answer: "A Webpack plugin to load code dynamically from other builds." },
      { question: "How do micro-frontends share state?", answer: "Via custom events, local storage, or shared singletons." },
      { question: "What are the styling challenges?", answer: "CSS scoping and class name collisions." },
      { question: "Why use micro-frontends?", answer: "To allow independent team deployments." }
    ],
    practicalTask: {
      scenario: "Loading a remote component",
      task: "Use React.lazy to import a federated component.",
      solutionCode: "const RemoteHeader = React.lazy(() => import('app1/Header'));"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'Master advanced React concepts and architectures.', topics);
