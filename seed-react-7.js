import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-error-boundaries",
    title: "31. Error Boundaries & Fallback UIs",
    order: 31,
    content: `### 1. Conceptual Overview
Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of the component tree that crashed.

### 2. Architecture & Mechanics
They work like a JavaScript \`catch {}\` block, but for components. Only class components can be error boundaries.

### 3. Implementation: Standard vs Optimized
Standard implementation catches errors but might not recover state. Optimized implementation uses libraries like \`react-error-boundary\` to allow resetting error state.

### 4. Trade-offs & Complexity
They do not catch errors in event handlers, asynchronous code, SSR, or errors thrown in the error boundary itself.`,
    interviewQuestions: [
      { question: "What lifecycle methods make a class component an Error Boundary?", answer: "static getDerivedStateFromError() or componentDidCatch()." },
      { question: "Can functional components be Error Boundaries?", answer: "No, currently only class components can implement these lifecycles, though libraries like react-error-boundary provide functional wrappers." },
      { question: "Do Error Boundaries catch async errors?", answer: "No, they only catch errors during rendering, in lifecycle methods, and in constructors of the whole tree below them." },
      { question: "What is the purpose of getDerivedStateFromError?", answer: "To update state so the next render will show the fallback UI." },
      { question: "How to handle errors in event handlers?", answer: "Using regular try/catch blocks." }
    ],
    practicalTask: {
      scenario: "App crashing from a bad API response rendering",
      task: "Create a simple Error Boundary component that displays a generic error message.",
      solutionCode: "class ErrorBoundary extends React.Component { state = { hasError: false }; static getDerivedStateFromError(error) { return { hasError: true }; } render() { return this.state.hasError ? <h1>Error</h1> : this.props.children; } }"
    }
  },
  {
    slug: "react-custom-hooks",
    title: "32. Custom Hooks Architecture",
    order: 32,
    content: `### 1. Conceptual Overview
Custom hooks allow you to extract component logic into reusable functions, keeping components clean and focused on rendering.

### 2. Architecture & Mechanics
They are regular JavaScript functions whose names start with 'use' and that may call other Hooks.

### 3. Implementation: Standard vs Optimized
Standard hooks just share logic. Optimized hooks encapsulate complex state machines, memoization, and side-effects smoothly.

### 4. Trade-offs & Complexity
Over-abstracting logic into custom hooks can make the flow of state hard to trace and debug.`,
    interviewQuestions: [
      { question: "What is the primary rule of Custom Hooks?", answer: "Their names must start with 'use' and they must follow the Rules of Hooks." },
      { question: "Do two components using the same custom hook share state?", answer: "No, custom hooks are a mechanism to reuse stateful logic, every time you use a custom hook, all state and effects inside of it are fully isolated." },
      { question: "How to test a custom hook?", answer: "Using libraries like @testing-library/react-hooks to render them in isolation." },
      { question: "Can a custom hook return JSX?", answer: "Technically yes, but it's an anti-pattern. Components return JSX, hooks return data and functions." },
      { question: "When should you create a custom hook?", answer: "When you have complex stateful logic that is duplicated across multiple components." }
    ],
    practicalTask: {
      scenario: "Duplicated local storage logic",
      task: "Create a useLocalStorage hook to sync state with window.localStorage.",
      solutionCode: "function useLocalStorage(key, initialValue) { const [val, setVal] = useState(() => JSON.parse(localStorage.getItem(key)) || initialValue); useEffect(() => localStorage.setItem(key, JSON.stringify(val)), [key, val]); return [val, setVal]; }"
    }
  },
  {
    slug: "react-design-systems",
    title: "33. Design Systems & Component Libraries",
    order: 33,
    content: `### 1. Conceptual Overview
A Design System provides a set of reusable components and guidelines to build cohesive UIs at scale.

### 2. Architecture & Mechanics
Usually implemented with a core set of highly customizable primitive components, utilizing a theme provider (like in styled-components or Tailwind).

### 3. Implementation: Standard vs Optimized
Standard approach uses ad-hoc CSS. Optimized uses CSS-in-JS or Utility-first CSS to enforce design tokens strictly.

### 4. Trade-offs & Complexity
High initial setup time and overhead, but drastically improves development speed and consistency in the long run.`,
    interviewQuestions: [
      { question: "What are design tokens?", answer: "The visual design atoms of the design system, like color, typography, spacing." },
      { question: "How does a ThemeProvider work?", answer: "It uses React Context to pass theme objects down to all styled components." },
      { question: "What is a polymorphic component?", answer: "A component that can render as different HTML elements using an 'as' prop." },
      { question: "Why build a component library instead of just using one?", answer: "To have full control over the design, accessibility, and behavior specific to business needs." },
      { question: "What is Storybook?", answer: "A tool to develop UI components in isolation." }
    ],
    practicalTask: {
      scenario: "Inconsistent button styles",
      task: "Create a polymorphic Button component that accepts a 'variant' prop.",
      solutionCode: "const Button = ({ as: Component = 'button', variant, ...props }) => <Component className={\`btn \${variant}\`} {...props} />;"
    }
  },
  {
    slug: "react-server-state",
    title: "34. React Query & Server State Management",
    order: 34,
    content: `### 1. Conceptual Overview
Server state management libraries abstract away fetching, caching, synchronizing, and updating server state in your React applications.

### 2. Architecture & Mechanics
They use a cache layer outside of React component state to store query results keyed by unique strings or arrays.

### 3. Implementation: Standard vs Optimized
Standard implementation uses useEffect and useState. Optimized uses React Query to automatically handle caching, deduping, and background updates.

### 4. Trade-offs & Complexity
Adds a dependency and requires understanding cache invalidation, but eliminates massive amounts of boilerplate.`,
    interviewQuestions: [
      { question: "What is the difference between client state and server state?", answer: "Client state is ephemeral UI state. Server state is persisted remotely and requires async fetching." },
      { question: "How does React Query handle caching?", answer: "It caches queries by a unique QueryKey and serves stale data while fetching in the background (stale-while-revalidate)." },
      { question: "What is cache invalidation?", answer: "Marking cached data as stale so it is refetched on the next usage." },
      { question: "Why avoid useEffect for data fetching?", answer: "It lacks built-in caching, race condition handling, and requires manual loading/error state management." },
      { question: "What is an optimistic update?", answer: "Updating the UI before the server confirms the mutation was successful." }
    ],
    practicalTask: {
      scenario: "Fetching user profile",
      task: "Use React Query to fetch a user profile.",
      solutionCode: "const { data, isLoading } = useQuery(['user', id], () => fetchUser(id));"
    }
  },
  {
    slug: "react-testing-strategies",
    title: "35. Testing Strategies in React",
    order: 35,
    content: `### 1. Conceptual Overview
Testing in React ensures your components behave as expected and protects against regressions. It spans Unit, Integration, and End-to-End (E2E) testing.

### 2. Architecture & Mechanics
Unit tests isolate functions/components (Jest/RTL). Integration tests check how components work together. E2E tests simulate real user interactions in a browser (Cypress/Playwright).

### 3. Implementation: Standard vs Optimized
Standard relies heavily on E2E tests which are slow. Optimized uses the Testing Trophy approach: many integration tests, some unit tests, few E2E tests.

### 4. Trade-offs & Complexity
Testing requires time investment and maintenance, but drastically reduces bugs in production.`,
    interviewQuestions: [
      { question: "What is the difference between Jest and React Testing Library?", answer: "Jest is the test runner and assertion library. RTL is a utility to render components and query the DOM." },
      { question: "Why does RTL encourage querying by accessibility handles?", answer: "To test the application the way a user interacts with it, rather than testing implementation details." },
      { question: "What is snapshot testing?", answer: "Comparing the rendered output to a saved text snapshot to detect UI changes." },
      { question: "How do you mock API calls in tests?", answer: "Using MSW (Mock Service Worker) to intercept network requests at the network level." },
      { question: "What is an E2E test?", answer: "A test that runs the entire application stack and interacts with it via an automated browser." }
    ],
    practicalTask: {
      scenario: "Testing a click event",
      task: "Write an RTL test that clicks a button and asserts text appears.",
      solutionCode: "render(<App />); fireEvent.click(screen.getByRole('button', {name: 'Submit'})); expect(screen.getByText('Success')).toBeInTheDocument();"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', '...', topics);
