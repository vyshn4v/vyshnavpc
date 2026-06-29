import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-xstate-machines",
    title: "Advanced State Machines with XState in React",
    order: 36,
    content: `### 1. Conceptual Overview
State machines provide a mathematically sound way to manage application states, eliminating impossible states.

### 2. Architecture & Mechanics
Using XState, the logic is decoupled from React components, relying on states and transitions managed externally and synced via \`@xstate/react\`.

### 3. Implementation: Standard vs Optimized
Standard implementation manages state via \`useState\`/\`useReducer\`, whereas an optimized implementation uses XState's \`useMachine\` for complex state orchestration.

### 4. Trade-offs & Complexity
XState brings a steep learning curve but drastically improves robustness and testability in complex workflows.`,
    interviewQuestions: [
      { question: "What is a finite state machine?", answer: "A mathematical model of computation having a finite number of states." },
      { question: "Why use XState over useReducer?", answer: "XState handles complex, multi-step state transitions with side-effects elegantly." },
      { question: "What is a statechart?", answer: "An extension of state machines that adds hierarchy and parallel states." },
      { question: "How do you test an XState machine?", answer: "By simulating transitions purely, independent of React." },
      { question: "What is the useMachine hook?", answer: "A hook to interpret an XState machine inside a React component." }
    ],
    practicalTask: {
      scenario: "A multi-step checkout process.",
      task: "Integrate a basic toggle machine.",
      solutionCode: "const [state, send] = useMachine(toggleMachine);"
    }
  },
  {
    slug: "react-error-boundaries-telemetry",
    title: "Complex Error Boundaries and Telemetry",
    order: 37,
    content: `### 1. Conceptual Overview
Error boundaries are React components that catch JavaScript errors anywhere in their child component tree.

### 2. Architecture & Mechanics
They leverage lifecycle methods \`componentDidCatch\` and \`static getDerivedStateFromError\` to intercept errors and render a fallback UI.

### 3. Implementation: Standard vs Optimized
Standard boundaries merely show an error message; optimized boundaries integrate with telemetry services like Sentry.

### 4. Trade-offs & Complexity
They only catch errors in the render phase, not in event handlers or async code.`,
    interviewQuestions: [
      { question: "Can functional components be error boundaries?", answer: "No, they require class components." },
      { question: "Do error boundaries catch errors in async code?", answer: "No, only during rendering, lifecycle methods, and constructors." },
      { question: "How do you catch event handler errors?", answer: "Using standard try/catch blocks." },
      { question: "What is componentDidCatch used for?", answer: "Logging the error and its stack trace." },
      { question: "How to recover from an error?", answer: "Provide a 'try again' button that resets the error state." }
    ],
    practicalTask: {
      scenario: "Application crashes due to unhandled exceptions.",
      task: "Create a global error boundary.",
      solutionCode: "class ErrorBoundary extends React.Component { state = { hasError: false }; static getDerivedStateFromError(error) { return { hasError: true }; } render() { return this.state.hasError ? <h1>Error</h1> : this.props.children; } }"
    }
  },
  {
    slug: "react-websockets-realtime",
    title: "Real-Time Data with WebSockets and React",
    order: 38,
    content: `### 1. Conceptual Overview
WebSockets provide full-duplex communication channels over a single TCP connection, ideal for real-time React apps.

### 2. Architecture & Mechanics
React components establish a WebSocket connection inside a \`useEffect\` hook and update state upon receiving messages.

### 3. Implementation: Standard vs Optimized
Standard uses raw WebSockets; optimized uses libraries like Socket.io or SignalR with proper connection pooling and reconnection logic.

### 4. Trade-offs & Complexity
Managing the connection lifecycle and preventing memory leaks requires careful cleanup in hooks.`,
    interviewQuestions: [
      { question: "Where should you initialize a WebSocket in React?", answer: "Inside a useEffect hook to ensure it runs only on the client." },
      { question: "How do you prevent memory leaks?", answer: "Close the WebSocket connection in the useEffect cleanup function." },
      { question: "What is Socket.io?", answer: "A library that abstracts WebSockets and provides fallbacks and automatic reconnections." },
      { question: "How do you share a WebSocket across components?", answer: "Using React Context to provide the socket instance." },
      { question: "Can WebSockets be used for state management?", answer: "Yes, by dispatching actions based on incoming messages." }
    ],
    practicalTask: {
      scenario: "A live chat application.",
      task: "Connect to a WebSocket server and listen for messages.",
      solutionCode: "useEffect(() => { const ws = new WebSocket('ws://localhost:8080'); ws.onmessage = (e) => setMsg(e.data); return () => ws.close(); }, []);"
    }
  },
  {
    slug: "react-custom-renderers",
    title: "Custom Renderers in React",
    order: 39,
    content: `### 1. Conceptual Overview
React's architecture separates the reconciler from the renderer, allowing custom renderers for different host environments.

### 2. Architecture & Mechanics
The \`react-reconciler\` package allows developers to define how React primitives map to the host environment's APIs.

### 3. Implementation: Standard vs Optimized
Standard usage targets the DOM via ReactDOM; customized usage maps to Canvas, WebGL, or terminal outputs (like React Ink).

### 4. Trade-offs & Complexity
Writing a custom renderer is highly complex and requires deep understanding of React's fiber architecture.`,
    interviewQuestions: [
      { question: "What is the React Reconciler?", answer: "The core algorithm that diffs the Virtual DOM." },
      { question: "Name a non-DOM React renderer.", answer: "React Native, React Three Fiber, or React Ink." },
      { question: "Why use a custom renderer?", answer: "To declaratively control non-DOM environments." },
      { question: "What is React Fiber?", answer: "The reimplementation of React's core algorithm supporting interruptible rendering." },
      { question: "How does React map to native UI?", answer: "Through custom host configs in the reconciler." }
    ],
    practicalTask: {
      scenario: "Declarative 3D graphics rendering.",
      task: "Use React Three Fiber to render a mesh.",
      solutionCode: "return <mesh><boxGeometry /><meshStandardMaterial color='hotpink' /></mesh>;"
    }
  },
  {
    slug: "react-micro-frontends",
    title: "Micro-Frontends with React",
    order: 40,
    content: `### 1. Conceptual Overview
Micro-frontends apply the concept of microservices to the frontend, splitting a monolith into independently deployable units.

### 2. Architecture & Mechanics
React components from different builds are dynamically loaded and composed together using Module Federation or iframes.

### 3. Implementation: Standard vs Optimized
Standard implementation relies on complex routing; optimized leverages Webpack 5 Module Federation for seamless runtime integration.

### 4. Trade-offs & Complexity
Increases deployment complexity and potential for duplicated dependencies, but vastly improves team autonomy.`,
    interviewQuestions: [
      { question: "What is a micro-frontend?", answer: "An architectural style where independently deliverable frontend applications are composed into a greater whole." },
      { question: "What is Module Federation?", answer: "A Webpack 5 feature that allows multiple builds to share code dynamically at runtime." },
      { question: "How do micro-frontends communicate?", answer: "Through CustomEvents, shared state libraries, or query parameters." },
      { question: "What is a common pitfall?", answer: "Inconsistent styling and bloated bundle sizes due to duplicated dependencies." },
      { question: "How do you handle routing?", answer: "Typically with a shell application orchestrating sub-app routes." }
    ],
    practicalTask: {
      scenario: "Scaling a large React application across multiple teams.",
      task: "Configure a Webpack Module Federation plugin.",
      solutionCode: "new ModuleFederationPlugin({ name: 'app', remotes: { microApp: 'microApp@http://localhost:3001/remoteEntry.js' } });"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'Mastering the React ecosystem for enterprise scale.', topics);
