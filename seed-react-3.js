import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-ssr-suspense",
    title: "Advanced Server-Side Rendering (SSR) & Suspense",
    order: 11,
    content: `### 1. Conceptual Overview
Server-Side Rendering (SSR) with Suspense allows React components to stream to the client asynchronously. Instead of waiting for the entire app to render on the server, React can send HTML in chunks, progressively hydrating the UI and improving Time to First Byte (TTFB).

### 2. Architecture & Mechanics
React's SSR pipeline leverages \`renderToPipeableStream\`. When a \`<Suspense>\` boundary is encountered, React emits a fallback HTML structure. Once the asynchronous data resolves on the server, React streams an inline \`<script>\` tag containing the resolved content, replacing the fallback without needing additional client-side fetch requests.

### 3. Implementation: Standard vs Optimized
Standard approach:
\`\`\`jsx
// Synchronous SSR (Blocks until all data is ready)
const html = renderToString(<App />);
res.send(html);
\`\`\`

Optimized approach:
\`\`\`jsx
// Streaming SSR with Suspense
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    res.setHeader('content-type', 'text/html');
    pipe(res);
  }
});
\`\`\`

### 4. Trade-offs & Complexity
Streaming SSR significantly improves perceived performance and SEO. However, it introduces complexity in error handling and requires a hosting environment that supports HTTP streaming (like Node.js servers, not standard static CDNs). It can also increase TTFB for the very first byte slightly compared to static generation.`,
    interviewQuestions: [
      { question: "What is the primary benefit of Suspense in SSR?", answer: "It allows the server to start streaming HTML to the client before all asynchronous data is ready, reducing Time to First Byte (TTFB)." },
      { question: "How does React replace the fallback content in streaming SSR?", answer: "React sends an inline `<script>` tag containing the resolved content and a tiny script to inject it into the DOM, replacing the fallback." },
      { question: "What is `renderToPipeableStream` used for?", answer: "It is the React 18 API used on a Node.js server to stream rendered React components as HTML over an HTTP response." },
      { question: "How does streaming SSR affect SEO?", answer: "It is highly beneficial because web crawlers receive the initial HTML structure quickly and can see the fully resolved content as the stream completes, without needing to execute client-side JavaScript." },
      { question: "Can you use `renderToString` with Suspense data fetching?", answer: "No, `renderToString` does not support streaming or waiting for Suspense boundaries; it will simply render the fallbacks." }
    ],
    practicalTask: {
      description: "Implement a basic Node.js Express server route that uses `renderToPipeableStream` to serve a React component with Suspense.",
      initialCode: `// Implement SSR streaming here\napp.get('/', (req, res) => {\n  \n});`,
      solutionCode: `app.get('/', (req, res) => {\n  const { pipe } = renderToPipeableStream(<App />, {\n    onShellReady() {\n      res.setHeader('content-type', 'text/html');\n      pipe(res);\n    },\n    onError(err) {\n      console.error(err);\n    }\n  });\n});`
    }
  },
  {
    slug: "react-module-federation",
    title: "Micro-Frontends with Module Federation",
    order: 12,
    content: `### 1. Conceptual Overview
Module Federation is a Webpack 5 feature that allows multiple separate JavaScript builds to form a single application at runtime. It enables Micro-Frontend architectures where different teams can deploy their React components independently without a central build process.

### 2. Architecture & Mechanics
Module Federation operates through a host/remote architecture. A "Host" application consumes modules dynamically loaded at runtime from a "Remote" application. Webpack manages shared dependencies (like React and ReactDOM) to ensure they are loaded only once and that the correct versions are negotiated between the host and remotes.

### 3. Implementation: Standard vs Optimized
Standard approach:
\`\`\`javascript
// Monolith importing local components
import Button from './components/Button';
\`\`\`

Optimized approach:
\`\`\`javascript
// Webpack Plugin Configuration for Module Federation
new ModuleFederationPlugin({
  name: 'hostApp',
  remotes: {
    remoteApp: 'remoteApp@http://localhost:3001/remoteEntry.js',
  },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// Using the remote component in React
const RemoteComponent = React.lazy(() => import('remoteApp/Component'));
\`\`\`

### 4. Trade-offs & Complexity
Module federation enables massive scaling of development teams and independent deployments. However, it severely increases infrastructural complexity. Version mismatches in shared dependencies can cause fatal runtime errors. Network latency for fetching remote entries can negatively impact initial load times if not aggressively cached.`,
    interviewQuestions: [
      { question: "What problem does Module Federation solve?", answer: "It allows independent teams to deploy parts of a web application separately without requiring a monolithic build process, enabling micro-frontends." },
      { question: "What is the purpose of the 'shared' configuration in Module Federation?", answer: "It prevents multiple versions of identical libraries (like React) from being loaded, ensuring a singleton instance is shared across the host and remotes." },
      { question: "How are remote components loaded in a React Host app?", answer: "They are typically loaded dynamically using `React.lazy()` and `import()`, wrapped in a `<Suspense>` boundary." },
      { question: "What happens if a Host and Remote specify different, incompatible React versions?", answer: "Webpack's module federation will attempt to negotiate, but if `strictVersion` is true or versions are entirely incompatible, it will throw a runtime error." },
      { question: "Why is Module Federation considered better than using iframes for micro-frontends?", answer: "Unlike iframes, Module Federation allows for shared context, seamless styling integration, and shared vendor dependencies, providing a better user and developer experience." }
    ],
    practicalTask: {
      description: "Write the Webpack ModuleFederationPlugin configuration for a Remote application that exposes a 'Header' component.",
      initialCode: `const { ModuleFederationPlugin } = require('webpack').container;\nmodule.exports = {\n  plugins: [\n    // Add plugin configuration\n  ]\n};`,
      solutionCode: `const { ModuleFederationPlugin } = require('webpack').container;\nmodule.exports = {\n  plugins: [\n    new ModuleFederationPlugin({\n      name: 'app2',\n      filename: 'remoteEntry.js',\n      exposes: {\n        './Header': './src/Header',\n      },\n      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },\n    }),\n  ]\n};`
    }
  },
  {
    slug: "react-xstate",
    title: "Complex State Machines with XState",
    order: 13,
    content: `### 1. Conceptual Overview
XState is a library for creating, interpreting, and executing finite state machines and statecharts. In complex React applications, \`useState\` and \`useReducer\` can lead to unpredictable UI states. State machines enforce a strict set of predefined states and transitions, making impossible states unrepresentable.

### 2. Architecture & Mechanics
A state machine defines nodes (states) and edges (transitions caused by events). When integrated with React via \`@xstate/react\`, the component subscribes to the machine's state. Actions (synchronous side-effects) and Services (asynchronous side-effects) are decoupled from the component lifecycle and managed entirely by the XState interpreter.

### 3. Implementation: Standard vs Optimized
Standard approach:
\`\`\`jsx
// Boolean flags leading to impossible states
const [isLoading, setIsLoading] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [error, setError] = useState(null);
\`\`\`

Optimized approach:
\`\`\`jsx
// XState Machine defining explicit states
import { useMachine } from '@xstate/react';
const [state, send] = useMachine(fetchMachine);

if (state.matches('loading')) return <Spinner />;
if (state.matches('success')) return <Data data={state.context.data} />;
\`\`\`

### 4. Trade-offs & Complexity
XState eliminates bug-prone boolean flag spaghetti and provides incredible visualization tools. The main trade-off is a steep learning curve and high boilerplate for simple features. It is best reserved for genuinely complex, multi-step flows like wizards, authentication, or payment processing.`,
    interviewQuestions: [
      { question: "What is a finite state machine (FSM)?", answer: "A mathematical model of computation consisting of a finite number of states, transitions between those states, and actions." },
      { question: "How does XState prevent impossible states?", answer: "By forcing the developer to define explicitly which transitions are valid from a given state; an event sent in the wrong state is safely ignored." },
      { question: "What is `context` in an XState machine?", answer: "`context` represents the extended quantitative state (like fetched data or user input) alongside the qualitative finite state." },
      { question: "How do you handle asynchronous operations in XState?", answer: "Using invoked services (Promises, Observables, or callbacks) that automatically send `onDone` or `onError` events back to the machine." },
      { question: "What is the `@xstate/react` `useMachine` hook used for?", answer: "It instantiates an XState machine, interprets it, and subscribes the React component to its state changes." }
    ],
    practicalTask: {
      description: "Define a simple XState machine for a toggle button with states 'inactive' and 'active', and an event 'TOGGLE'.",
      initialCode: `import { createMachine } from 'xstate';\n\nexport const toggleMachine = createMachine({\n  // Implement machine\n});`,
      solutionCode: `import { createMachine } from 'xstate';\n\nexport const toggleMachine = createMachine({\n  id: 'toggle',\n  initial: 'inactive',\n  states: {\n    inactive: {\n      on: { TOGGLE: 'active' }\n    },\n    active: {\n      on: { TOGGLE: 'inactive' }\n    }\n  }\n});`
    }
  },
  {
    slug: "react-fiber-architecture",
    title: "Advanced Concurrency & React Fiber",
    order: 14,
    content: `### 1. Conceptual Overview
React Fiber is the underlying reconciliation algorithm of React 16+. It reimagines the call stack by breaking rendering work into units called "fibers," allowing React to pause, abort, or prioritize rendering work to ensure main-thread responsiveness. Concurrent features in React 18 directly leverage this architecture.

### 2. Architecture & Mechanics
A Fiber is a JavaScript object representing a unit of work. React builds a tree of fibers corresponding to the component tree. During the "render phase," React asynchronously traverses this tree, yielding control back to the browser periodically. High-priority updates (like typing) can interrupt low-priority updates (like rendering a massive list). Once the render phase finishes, the "commit phase" synchronously applies DOM mutations.

### 3. Implementation: Standard vs Optimized
Standard approach:
\`\`\`jsx
// Standard synchronous rendering (blocks main thread)
setSearchQuery(query); 
// React will process all updates simultaneously
\`\`\`

Optimized approach:
\`\`\`jsx
// Using Transitions for concurrent rendering
const [isPending, startTransition] = useTransition();

const handleChange = (e) => {
  const query = e.target.value;
  setInputValue(query); // High priority
  startTransition(() => {
    setSearchQuery(query); // Low priority, interruptible
  });
};
\`\`\`

### 4. Trade-offs & Complexity
Concurrent rendering vastly improves UX by keeping the app responsive under heavy computational load. However, developers must ensure their render functions are pure; side-effects during the render phase will cause severe bugs, as React may invoke a render function multiple times or abort it entirely before committing.`,
    interviewQuestions: [
      { question: "What is React Fiber?", answer: "It is React's reimplementation of the core reconciliation algorithm, designed to enable non-blocking, interruptible rendering." },
      { question: "What are the two main phases of React's execution?", answer: "The Render phase (asynchronous, interruptible, side-effect free) and the Commit phase (synchronous, applies DOM changes and side-effects)." },
      { question: "What does `useTransition` do?", answer: "It marks a state update as a non-urgent transition, allowing React to interrupt its rendering if a higher-priority event (like user input) occurs." },
      { question: "Why must React components be pure functions?", answer: "Because in Concurrent Mode, React may start rendering a component, pause it, and throw away the result. If the component mutates global state, the app will break." },
      { question: "How does React prioritize updates?", answer: "React categorizes updates into lanes (discrete user interactions vs continuous transitions) and processes higher-priority lanes first." }
    ],
    practicalTask: {
      description: "Use `useTransition` to wrap a slow state update (`setFilteredList`) to prevent it from blocking an input field's typing experience.",
      initialCode: `const [input, setInput] = useState('');\nconst [filteredList, setFilteredList] = useState(items);\n\nconst handleChange = (e) => {\n  const val = e.target.value;\n  setInput(val);\n  setFilteredList(expensiveFilter(items, val));\n};`,
      solutionCode: `const [input, setInput] = useState('');\nconst [filteredList, setFilteredList] = useState(items);\nconst [isPending, startTransition] = useTransition();\n\nconst handleChange = (e) => {\n  const val = e.target.value;\n  setInput(val);\n  startTransition(() => {\n    setFilteredList(expensiveFilter(items, val));\n  });\n};`
    }
  },
  {
    slug: "react-server-components",
    title: "React Server Components (RSC)",
    order: 15,
    content: `### 1. Conceptual Overview
React Server Components (RSC) represent a paradigm shift where components render exclusively on the server and transmit a serialized JSON representation of the UI to the client. Unlike SSR, RSCs never ship their JavaScript dependencies to the browser, significantly reducing bundle size.

### 2. Architecture & Mechanics
The application is split into Server Components (fetching data directly from databases/APIs, zero client bundle size) and Client Components (handling interactivity, state, and browser APIs). The server streams a proprietary JSON format representing the React tree, which the client runtime reconciles and merges with client-side state without losing existing DOM focus or state.

### 3. Implementation: Standard vs Optimized
Standard approach:
\`\`\`jsx
// Client-side fetching (waterfalls, bloated bundle)
function UserProfile() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch('/api/user').then(setUser); }, []);
  if (!user) return <Spinner />;
  return <div>{user.name}</div>;
}
\`\`\`

Optimized approach:
\`\`\`jsx
// React Server Component (Direct DB access, zero JS sent to client)
import db from './db';

export default async function UserProfile() {
  const user = await db.users.findFirst();
  return <div>{user.name}</div>;
}
\`\`\`

### 4. Trade-offs & Complexity
RSCs provide massive performance gains and vastly simplify data fetching. However, they force a strict architectural split. Developers must understand network boundaries (\`"use client"\`), manage complex routing setups (usually relying on frameworks like Next.js App Router), and accept that context and hooks cannot be used in Server Components.`,
    interviewQuestions: [
      { question: "What is the main difference between Server Components and SSR?", answer: "SSR generates initial HTML for client components that later hydrate. Server Components render to a serialized format, never send their code to the client, and never hydrate." },
      { question: "What does the 'use client' directive do?", answer: "It marks a file and its imports as part of the client bundle, defining the network boundary between Server and Client Components." },
      { question: "Can you use `useState` in a React Server Component?", answer: "No. Server components execute entirely on the server and do not possess interactivity or component lifecycle." },
      { question: "How do Server Components improve bundle size?", answer: "Their code and heavy dependencies (like markdown parsers or database clients) remain exclusively on the server and are never downloaded by the browser." },
      { question: "How does data flow between Server and Client components?", answer: "Server Components can pass props to Client Components, but those props must be serializable over the network." }
    ],
    practicalTask: {
      description: "Write a React Server Component that fetches data asynchronously, and include a Client Component child passing down serializable props.",
      initialCode: `// ServerComponent.jsx\nimport ClientButton from './ClientButton';\n\nexport default function ServerComponent() {\n  // Fetch data and render\n}`,
      solutionCode: `// ServerComponent.jsx\nimport ClientButton from './ClientButton';\n\nexport default async function ServerComponent() {\n  const data = await fetch('https://api.example.com/data').then(res => res.json());\n  \n  return (\n    <div>\n      <h1>Server rendered data: {data.title}</h1>\n      <ClientButton title={data.title} />\n    </div>\n  );\n}`
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "...", topics);
