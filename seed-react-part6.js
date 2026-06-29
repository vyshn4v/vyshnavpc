import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch26-react-memo",
    title: "Chapter 26: React.memo and Component Rendering",
    order: 26,
    content: "<h2>Render Optimization</h2><p>`React.memo` is a higher-order component that prevents a functional component from re-rendering if its props have not changed.</p><h2>Shallow Comparison</h2><p>It performs a shallow comparison of props. If complex objects or inline functions are passed, memoization may break.</p>",
    interviewQuestions: [
      { question: "What is React.memo?", answer: "A Higher-Order Component that memoizes the rendered output of a functional component, preventing unnecessary re-renders when props remain unchanged." },
      { question: "When should you NOT use React.memo?", answer: "When a component's props change frequently, or when the component is so simple that the cost of prop comparison outweighs the cost of re-rendering." }
    ],
    practicalTask: {
      scenario: "Prevent child re-renders.",
      task: "Wrap a component in `React.memo`.",
      solutionCode: "import React from 'react';\n\nconst Display = React.memo(function Display({ value }) {\n  console.log('Rendering Display');\n  return <div>{value}</div>;\n});\n\nexport default Display;"
    }
  },
  {
    slug: "react-ch27-code-splitting",
    title: "Chapter 27: Code Splitting and React.lazy",
    order: 27,
    content: "<h2>Bundle Size Reduction</h2><p>Code-splitting allows you to split your bundle into smaller chunks which can be loaded on demand.</p><h2>React.lazy and Suspense</h2><p>`React.lazy` lets you render a dynamic import as a regular component. It must be wrapped in a `<Suspense>` component to handle the loading state.</p>",
    interviewQuestions: [
      { question: "What is code splitting?", answer: "A technique to divide the final JavaScript bundle into smaller files, loading only the code necessary for the initial render to improve performance." },
      { question: "What does the Suspense component do?", answer: "It specifies a fallback UI (like a spinner) to display while the dynamically imported components are being loaded over the network." }
    ],
    practicalTask: {
      scenario: "Lazy load a component.",
      task: "Import a component lazily and wrap it in Suspense.",
      solutionCode: "import React, { Suspense } from 'react';\nconst HeavyComponent = React.lazy(() => import('./HeavyComponent'));\n\nexport default function App() {\n  return (\n    <Suspense fallback={<div>Loading...</div>}>\n      <HeavyComponent />\n    </Suspense>\n  );\n}"
    }
  },
  {
    slug: "react-ch28-profiling",
    title: "Chapter 28: Profiling React Applications",
    order: 28,
    content: "<h2>React DevTools Profiler</h2><p>The Profiler records how long components take to render, helping identify performance bottlenecks.</p><h2>React.Profiler Component</h2><p>You can also wrap parts of your application with the `<Profiler>` component to programmatically measure rendering costs.</p>",
    interviewQuestions: [
      { question: "What causes unnecessary re-renders in React?", answer: "State updates high up in the tree, passing new object/function references as props, and missing memoization." },
      { question: "What does the React DevTools Profiler show?", answer: "It shows a flamegraph or ranked chart of component renders, indicating which components rendered, why they rendered, and how long they took." }
    ],
    practicalTask: {
      scenario: "Programmatic profiling.",
      task: "Wrap a component in `Profiler` to log render timings.",
      solutionCode: "import { Profiler } from 'react';\n\nconst onRender = (id, phase, actualDuration) => {\n  console.log(`${id} took ${actualDuration}ms to render`);\n};\n\nexport default function App() {\n  return (\n    <Profiler id=\"Main\" onRender={onRender}>\n      <div>Measured Content</div>\n    </Profiler>\n  );\n}"
    }
  },
  {
    slug: "react-ch29-virtualization",
    title: "Chapter 29: Virtualization and Large Lists",
    order: 29,
    content: "<h2>Windowing</h2><p>Rendering thousands of DOM nodes causes severe performance degradation. Virtualization solves this by only rendering the rows currently visible on screen.</p><h2>Libraries</h2><p>Tools like `react-window` and `react-virtualized` implement this pattern efficiently.</p>",
    interviewQuestions: [
      { question: "What is List Virtualization?", answer: "A performance technique where only the visible items in a large list are rendered to the DOM, replacing off-screen items with empty space." },
      { question: "Why not just render 10,000 items in React?", answer: "Creating and diffing 10,000 DOM nodes consumes significant memory and CPU, causing the browser to freeze and severely dropping frame rates." }
    ],
    practicalTask: {
      scenario: "Basic windowing concept.",
      task: "Render a slice of an array simulating a window.",
      solutionCode: "export default function VirtualList({ items, startIndex, endIndex }) {\n  const visibleItems = items.slice(startIndex, endIndex);\n  return (\n    <ul>\n      {visibleItems.map(item => <li key={item.id}>{item.name}</li>)}\n    </ul>\n  );\n}"
    }
  },
  {
    slug: "react-ch30-ssr-concepts",
    title: "Chapter 30: Server-Side Rendering (SSR) Concepts",
    order: 30,
    content: "<h2>Client vs Server</h2><p>Standard React sends a blank HTML file and loads UI via JavaScript. SSR generates the full HTML on the server.</p><h2>Hydration</h2><p>Once the HTML loads on the client, React 'hydrates' the static HTML, attaching event listeners and making it interactive.</p>",
    interviewQuestions: [
      { question: "What is hydration in React?", answer: "The process where React attaches event listeners and state to the static HTML markup generated by the server, making it a fully interactive React app." },
      { question: "What are the benefits of SSR?", answer: "Faster initial page load (First Contentful Paint), better SEO since search engines can easily parse the HTML, and improved performance on slow devices." }
    ],
    practicalTask: {
      scenario: "Hydration entry point.",
      task: "Write the code to hydrate an SSR application in React 18.",
      solutionCode: "import { hydrateRoot } from 'react-dom/client';\nimport App from './App';\n\nhydrateRoot(document.getElementById('root'), <App />);"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
