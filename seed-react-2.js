import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "react-router-navigation",
    title: "Chapter 6: React Router & Navigation",
    order: 6,
    content: `
### 1. Conceptual Overview
Navigation is essential in single-page applications. React Router maps URLs to components, providing an experience like traditional multipage apps without the full page reload.

### 2. Architecture & Mechanics
React Router utilizes the browser's History API. When a URL changes, it intercepts the event and determines which component subtree to render instead of sending a request to the server.

### 3. Implementation: Standard vs Optimized
Standard uses basic Switch and Route components. Optimized implementation leverages nested routes, data routers (createBrowserRouter), and loaders to fetch data before the component renders.

### 4. Trade-offs & Complexity
Client-side routing introduces complexity in state management and bundle size. Managing 404 pages, nested layouts, and protected routes demands careful architectural planning.
    `,
    interviewQuestions: [
      { question: "How does React Router prevent full page reloads?", answer: "It intercepts link clicks and uses the HTML5 History API to update the URL and re-render components." },
      { question: "What is the difference between HashRouter and BrowserRouter?", answer: "HashRouter uses the URL hash fragment (#) while BrowserRouter uses regular paths requiring server configuration." },
      { question: "What are nested routes?", answer: "Routes defined inside other routes, sharing layouts and UI boundaries with their parent routes." },
      { question: "How do you handle private or protected routes?", answer: "By creating a wrapper component that checks authentication state before rendering the children or redirecting to login." },
      { question: "What are loaders in React Router v6.4+?", answer: "Functions that load data for a route before it renders, avoiding waterfall rendering issues." }
    ],
    practicalTask: {
      scenario: "Users lose unsaved form data when navigating away.",
      task: "Implement a Prompt or useBlocker hook to warn users before leaving a route with unsaved changes.",
      solutionCode: "const blocker = useBlocker(hasUnsavedChanges); /* implementation */"
    }
  },
  {
    slug: "testing-react-applications",
    title: "Chapter 7: Testing React Applications",
    order: 7,
    content: `
### 1. Conceptual Overview
Testing ensures that components function correctly. React apps rely on Unit Tests (functions/hooks), Component Tests (UI behavior), and End-to-End (E2E) tests.

### 2. Architecture & Mechanics
Jest is commonly used as a test runner. React Testing Library (RTL) renders components into a virtual DOM (JSDOM) to verify what elements appear and how they behave on user interaction.

### 3. Implementation: Standard vs Optimized
Standard implementation relies on enzyme or testing implementation details. Optimized uses RTL to test behavior, interacting with the component exactly as a user would.

### 4. Trade-offs & Complexity
Maintaining tests is costly. Over-testing implementation details creates fragile tests. E2E tests are slow and prone to flakiness but provide the highest confidence.
    `,
    interviewQuestions: [
      { question: "What is the philosophy of React Testing Library?", answer: "Test behavior, not implementation details. The more your tests resemble how software is used, the more confidence they can give you." },
      { question: "What is the difference between getBy, queryBy, and findBy in RTL?", answer: "getBy throws an error if not found, queryBy returns null, and findBy is asynchronous, waiting for the element." },
      { question: "Why avoid testing component state directly?", answer: "Testing state ties the test to implementation details, causing tests to break during refactors even if UI behavior remains correct." },
      { question: "How do you mock API calls in tests?", answer: "Using tools like MSW (Mock Service Worker) to intercept requests at the network level rather than mocking fetch/axios." },
      { question: "What is snapshot testing?", answer: "Capturing a serialized version of the component's output and comparing it to a saved reference to detect UI regressions." }
    ],
    practicalTask: {
      scenario: "A login form needs thorough testing.",
      task: "Write a test using RTL to simulate user input, click the submit button, and verify the loading state.",
      solutionCode: "fireEvent.change(input, { target: { value: 'user' } }); fireEvent.click(button);"
    }
  },
  {
    slug: "redux-state-management",
    title: "Chapter 8: Redux & Complex State Management",
    order: 8,
    content: `
### 1. Conceptual Overview
Redux is a predictable state container. It centralizes application state, making data flow explicit and easier to debug for massive web applications.

### 2. Architecture & Mechanics
Redux enforces a unidirectional data flow: Action -> Reducer -> Store -> View. State is immutable, and reducers are pure functions that calculate the next state.

### 3. Implementation: Standard vs Optimized
Standard uses legacy connect() and massive switch statements. Optimized uses Redux Toolkit (RTK), slices, createAsyncThunk, and RTK Query to eliminate boilerplate.

### 4. Trade-offs & Complexity
Redux introduces significant boilerplate. While RTK helps, for small apps or simple data fetching, built-in Context API or React Query might be a leaner and better choice.
    `,
    interviewQuestions: [
      { question: "What are the core principles of Redux?", answer: "Single source of truth, state is read-only, and changes are made with pure functions (reducers)." },
      { question: "What is a Redux Middleware?", answer: "Code that intercepts actions before they reach the reducer, useful for async tasks like API calls (e.g., Redux Thunk)." },
      { question: "What is Redux Toolkit (RTK)?", answer: "The official, opinionated toolset for Redux development that simplifies setup, reduces boilerplate, and includes Immer." },
      { question: "How does Immer work in Redux Toolkit?", answer: "It allows developers to write mutative logic in reducers, which Immer translates into safe, immutable updates." },
      { question: "When should you NOT use Redux?", answer: "When the application is small, state doesn't need to be shared widely, or mostly consists of server-state (better handled by React Query)." }
    ],
    practicalTask: {
      scenario: "Managing a global shopping cart.",
      task: "Create a Redux slice using createSlice that handles adding, removing, and updating item quantities.",
      solutionCode: "const cartSlice = createSlice({ name: 'cart', initialState: [], reducers: { addItem: (state, action) => { state.push(action.payload) } } });"
    }
  },
  {
    slug: "ssr-ssg-react",
    title: "Chapter 9: Server-Side Rendering (SSR) & Static Site Generation (SSG)",
    order: 9,
    content: `
### 1. Conceptual Overview
Client-side rendering sends empty HTML. SSR generates HTML on the server for each request, and SSG generates HTML at build time. Both improve SEO and time-to-interactive.

### 2. Architecture & Mechanics
In SSR, Node.js renders React components into a string (renderToString), sends it to the browser, and React "hydrates" it to attach event listeners. Next.js automates this.

### 3. Implementation: Standard vs Optimized
Standard involves manual Express setups for SSR. Optimized leverages Next.js or Remix to effortlessly mix SSG (getStaticProps) and SSR (getServerSideProps) per page.

### 4. Trade-offs & Complexity
SSR increases server load and response latency. SSG is incredibly fast but requires rebuilding the site for new content. Choosing the right rendering strategy per route is vital.
    `,
    interviewQuestions: [
      { question: "What is Hydration in React?", answer: "The process where React attaches event listeners to the server-rendered HTML to make it interactive." },
      { question: "What is the difference between SSR and SSG?", answer: "SSR renders HTML on every request. SSG renders HTML once at build time." },
      { question: "Why is SSR beneficial for SEO?", answer: "Search engine crawlers easily read fully formed HTML from the server, instead of waiting for JS to execute." },
      { question: "What is Incremental Static Regeneration (ISR)?", answer: "A Next.js feature that allows updating static pages in the background without a full site rebuild." },
      { question: "What happens if server and client HTML mismatch?", answer: "React will throw a hydration warning and discard the server-rendered DOM, hurting performance." }
    ],
    practicalTask: {
      scenario: "A blog page needs to be extremely fast but updated occasionally.",
      task: "Implement Incremental Static Regeneration using Next.js getStaticProps with a revalidate interval.",
      solutionCode: "export async function getStaticProps() { return { props: { data }, revalidate: 60 }; }"
    }
  },
  {
    slug: "reusable-component-libraries",
    title: "Chapter 10: Building Reusable Component Libraries",
    order: 10,
    content: `
### 1. Conceptual Overview
A component library is a set of reusable UI elements that ensure design consistency. Building one requires thinking about API design, accessibility, and theming.

### 2. Architecture & Mechanics
Libraries use tools like Storybook for isolation, Rollup or Webpack for bundling, and rely heavily on Prop validation (TypeScript/PropTypes) to ensure correct usage.

### 3. Implementation: Standard vs Optimized
Standard builds components tightly coupled to specific styles. Optimized builds polymorphic components (using the 'as' prop), headless components, and accessible primitives (using Radix or Aria).

### 4. Trade-offs & Complexity
Maintaining a library is equivalent to maintaining an open-source project. Backwards compatibility, semantic versioning, and extensive documentation are strictly required.
    `,
    interviewQuestions: [
      { question: "What is a polymorphic component?", answer: "A component that can render as different HTML elements (e.g., a Button that can render as an 'a' or 'button' using an 'as' prop)." },
      { question: "What is Storybook?", answer: "A tool for UI component development and testing in isolation, apart from the main application." },
      { question: "Why build 'Headless' components?", answer: "They provide logic and accessibility without dictating the styling, allowing maximum flexibility for consumers." },
      { question: "What role does accessibility (a11y) play in component libraries?", answer: "It is crucial. Components must support keyboard navigation and screen readers using proper ARIA attributes." },
      { question: "How do you manage tree-shaking in a component library?", answer: "By outputting ES modules and avoiding side-effects, allowing bundlers to remove unused components." }
    ],
    practicalTask: {
      scenario: "Designing a highly reusable Button component.",
      task: "Create a polymorphic Button component in TypeScript that accepts 'as', 'variant', and 'size' props.",
      solutionCode: "export const Button = ({ as: Component = 'button', variant, ...props }) => <Component className={variant} {...props} />;"
    }
  }
];

appendTopics(
  'react', 
  'React Industrial Masterclass', 
  'A deep dive into React architecture, performance, and advanced patterns for modern web development.', 
  topics
);
