import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "21. Server-Side Rendering (SSR) and Next.js App Router Architecture",
    content: `
      <h2>Server-Side Rendering and Next.js App Router</h2>
      <p>Next.js 13+ fundamentally shifted the paradigm with the App Router, moving away from <code>getServerSideProps</code> and embracing the server-first architecture.</p>

      <h3>App Router Directory Structure</h3>
      <p>The App Router relies on nested folders representing routes, and specific file conventions (<code>page.tsx</code>, <code>layout.tsx</code>, <code>loading.tsx</code>, <code>error.tsx</code>) to define UI segments.</p>

      <h3>Data Fetching in Next.js App Router</h3>
      <p>Data fetching is now natively handled using the standard Web <code>fetch</code> API extended by Next.js to provide caching and revalidation features. You can fetch data directly in Server Components.</p>
      <pre><code>
// app/users/page.tsx
export default async function UsersPage() {
  // Fetches data on the server. Cached by default.
  const res = await fetch('https://api.example.com/users', { next: { revalidate: 3600 } });
  const users = await res.json();
  
  return (
    &lt;ul&gt;
      {users.map(user =&gt; &lt;li key={user.id}&gt;{user.name}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}
      </code></pre>

      <h3>Streaming and Suspense Boundaries</h3>
      <p>Next.js natively supports streaming via React Suspense. By wrapping components in <code>&lt;Suspense&gt;</code>, or using <code>loading.tsx</code> files, the server can progressively stream HTML to the client as data becomes available, massively improving Time to First Byte (TTFB).</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What is the fundamental difference between the Pages Router (<code>getServerSideProps</code>) and the App Router data fetching model?</li>
        <li>2. Explain how Next.js extends the native <code>fetch</code> API. How do you implement ISR (Incremental Static Regeneration) in the App Router?</li>
        <li>3. What is Route Handlers in the App Router, and how do they replace API routes from the Pages Router?</li>
        <li>4. Describe the concept of Streaming SSR. How does it improve Web Vitals like FCP and LCP?</li>
        <li>5. How do Nested Layouts work in Next.js, and how does React prevent them from unmounting during route transitions?</li>
      </ul>
    `
  },
  {
    title: "22. React Server Components (RSC) Deep Dive",
    content: `
      <h2>React Server Components (RSC)</h2>
      <p>React Server Components allow developers to build components that span the server and client. This allows rendering UI on the server, entirely skipping the need to send their JavaScript to the client.</p>

      <h3>Client vs. Server Components</h3>
      <p>By default, components in Next.js App Router are Server Components. They cannot use state (<code>useState</code>), effects (<code>useEffect</code>), or browser APIs. To use client-side interactivity, you must explicitly opt-in using the <code>"use client"</code> directive.</p>
      <pre><code>
'use client';

import { useState } from 'react';

export default function InteractiveButton() {
  const [clicks, setClicks] = useState(0);
  return &lt;button onClick={() =&gt; setClicks(c =&gt; c + 1)}&gt;Clicked {clicks} times&lt;/button&gt;;
}
      </code></pre>

      <h3>The Server Component Wire Format</h3>
      <p>Server Components do not send HTML directly during hydration. They stream a special JSON-like wire format describing the virtual DOM, which the client reconstructs. This allows Server Components to pass React nodes as props to Client components.</p>

      <h3>Interleaving Client and Server Components</h3>
      <p>You cannot import a Server Component into a Client Component. However, you can pass a Server Component as a <code>children</code> prop to a Client Component. This "interleaving" is a core architectural pattern.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. Why did React introduce Server Components? What specific problems do they solve regarding bundle sizes and data fetching?</li>
        <li>2. Explain why you cannot import a Server Component directly into a Client Component. What is the workaround using the <code>children</code> prop?</li>
        <li>3. Can a Server Component access a database directly? Provide an example. What are the security implications?</li>
        <li>4. How does the <code>"use client"</code> directive define the boundary between the server and client bundles?</li>
        <li>5. What is the RSC Payload (Wire Format), and how does it differ from traditional SSR HTML strings?</li>
        <li>6. Is Context API available in Server Components? Why or why not?</li>
      </ul>
    `
  },
  {
    title: "23. Advanced React Component Patterns",
    content: `
      <h2>Advanced React Component Patterns</h2>
      <p>Building highly reusable and extensible UI libraries requires advanced composition patterns. We cover Compound Components, Render Props, and Control Props.</p>

      <h3>Compound Components Pattern</h3>
      <p>Compound components consist of a parent component and several child components that share implicit state, usually via Context. This mimics native HTML elements like <code>&lt;select&gt;</code> and <code>&lt;option&gt;</code>.</p>
      <pre><code>
const TabsContext = React.createContext();

function Tabs({ children }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    &lt;TabsContext.Provider value={{ activeIndex, setActiveIndex }}&gt;
      &lt;div className="tabs"&gt;{children}&lt;/div&gt;
    &lt;/TabsContext.Provider&gt;
  );
}

function Tab({ index, children }) {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = index === activeIndex;
  return (
    &lt;button onClick={() =&gt; setActiveIndex(index)} className={isActive ? 'active' : ''}&gt;
      {children}
    &lt;/button&gt;
  );
}

// Usage
&lt;Tabs&gt;
  &lt;Tab index={0}&gt;Profile&lt;/Tab&gt;
  &lt;Tab index={1}&gt;Settings&lt;/Tab&gt;
&lt;/Tabs&gt;
      </code></pre>

      <h3>Control Props Pattern</h3>
      <p>The Control Props pattern allows a component to be used either as an uncontrolled component (managing its own internal state) or as a controlled component (state managed by the parent via props).</p>

      <h3>Custom Hooks for Headless UI</h3>
      <p>Headless components provide behavior and state management via hooks without rendering any UI, giving the consumer complete control over the DOM.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What is the Compound Component pattern? In what scenarios is it superior to passing massive configuration objects as props?</li>
        <li>2. Explain the "Control Props" pattern. How do you design a component to handle both controlled and uncontrolled states seamlessly?</li>
        <li>3. What is a "Headless Component" or "Headless Hook"? Name an open-source library that relies entirely on this pattern.</li>
        <li>4. How does the "Prop Getters" pattern work in headless hooks? (e.g., <code>{...getToggleProps()}</code>)</li>
        <li>5. How do you validate that compound child components are used inside the correct parent component context?</li>
      </ul>
    `
  },
  {
    title: "24. Enterprise Testing: Jest, RTL, and Playwright",
    content: `
      <h2>Enterprise Testing Strategies</h2>
      <p>Testing in enterprise React applications is divided into Unit testing, Integration testing, and End-to-End (E2E) testing.</p>

      <h3>Unit and Integration Testing with React Testing Library</h3>
      <p>RTL focuses on testing user behavior rather than implementation details. You should query the DOM exactly how a user would interact with it (by roles, labels, text).</p>
      <pre><code>
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm';

test('submits the form with user credentials', async () => {
  const user = userEvent.setup();
  render(&lt;LoginForm onSubmit={jest.fn()} /&gt;);
  
  await user.type(screen.getByLabelText(/username/i), 'admin');
  await user.type(screen.getByLabelText(/password/i), 'password123');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
});
      </code></pre>

      <h3>Mocking Modules and API Calls</h3>
      <p>Mocking is crucial for isolation. Mock Service Worker (MSW) intercepts network requests at the service worker level, meaning your tests hit actual <code>fetch</code> calls without mocking the fetch API itself.</p>

      <h3>E2E Testing with Playwright</h3>
      <p>Playwright runs tests in actual headless browsers (Chromium, Webkit, Firefox), simulating true user sessions. It handles multiple tabs, iframes, and network interception natively.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What is the core philosophy of React Testing Library, and how does it differ from Enzyme?</li>
        <li>2. Explain why <code>getByRole</code> is preferred over <code>getByTestId</code>. What are the accessibility implications of this testing philosophy?</li>
        <li>3. How do you test a component that depends on a deeply nested Context Provider?</li>
        <li>4. What is Mock Service Worker (MSW) and why is it preferred over <code>jest.mock('axios')</code> or mocking <code>fetch</code>?</li>
        <li>5. What is the difference between an Integration Test in RTL and an E2E test in Playwright? Where do you draw the boundary?</li>
        <li>6. Explain the <code>act()</code> warning in React tests. What causes it and how do you resolve it?</li>
      </ul>
    `
  },
  {
    title: "25. Resilient UIs: Error Boundaries and Fallbacks",
    content: `
      <h2>Resilient UIs and Error Handling</h2>
      <p>React applications must degrade gracefully. JavaScript runtime errors during rendering should not crash the entire application to a blank white screen.</p>

      <h3>Error Boundaries</h3>
      <p>Error Boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI.</p>
      <pre><code>
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return &lt;h1&gt;Something went horribly wrong. Please reload.&lt;/h1&gt;;
    }
    return this.props.children; 
  }
}
      </code></pre>

      <h3>Limitations of Error Boundaries</h3>
      <p>Error boundaries do NOT catch errors inside event handlers, asynchronous code (e.g., setTimeout or requestAnimationFrame), server-side rendering, or errors thrown in the error boundary itself. For those, you must use standard <code>try/catch</code> blocks.</p>

      <h3>react-error-boundary Library</h3>
      <p>The <code>react-error-boundary</code> library provides a modern, functional approach to error boundaries, allowing you to pass fallback components, reset state, and handle asynchronous errors via a hook.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What lifecycle methods are required to implement a Class-based Error Boundary in React?</li>
        <li>2. Can a React Functional Component be an Error Boundary? Why or why not?</li>
        <li>3. Name four specific scenarios where React Error Boundaries will NOT catch an error.</li>
        <li>4. How do you implement a "Retry" mechanism in an Error Boundary so the user can attempt to recover from the error without refreshing the page?</li>
        <li>5. How do Next.js App Router <code>error.tsx</code> files map to React Error Boundaries under the hood?</li>
      </ul>
    `
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics)
  .then(() => console.log('Seed React Part 5 complete!'))
  .catch(err => console.error(err));
