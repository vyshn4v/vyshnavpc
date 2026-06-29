import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "26. Advanced Animations: Framer Motion and React Spring",
    content: `
      <h2>Advanced Animations in React</h2>
      <p>Building fluid, performant animations in React requires understanding the difference between CSS transitions, keyframes, and physics-based JavaScript animation libraries.</p>

      <h3>Framer Motion and Declarative Animations</h3>
      <p>Framer Motion is the industry standard for declarative animations in React. It handles enter/exit animations, drag gestures, and layout transitions.</p>
      <pre><code>
import { motion, AnimatePresence } from 'framer-motion';

function Modal({ isVisible }) {
  return (
    &lt;AnimatePresence&gt;
      {isVisible && (
        &lt;motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        &gt;
          Modal Content
        &lt;/motion.div&gt;
      )}
    &lt;/AnimatePresence&gt;
  );
}
      </code></pre>

      <h3>React Spring for Physics-Based Animations</h3>
      <p>React Spring models animations based on real-world physics (mass, tension, friction) rather than duration-based curves. It interpolates values smoothly over time without triggering React renders for every frame.</p>

      <h3>Performance Considerations</h3>
      <p>Animating <code>transform</code> and <code>opacity</code> guarantees hardware acceleration. Animating properties like <code>width</code>, <code>height</code>, or <code>top</code> forces the browser to recalculate the layout on every frame, causing jank.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. Why is animating <code>width</code> or <code>height</code> discouraged? What is the "Layout Thrashing" problem?</li>
        <li>2. How does <code>AnimatePresence</code> in Framer Motion allow for exit animations, given that React removes components from the DOM instantly when unmounted?</li>
        <li>3. Explain the difference between duration-based easing curves and physics-based spring animations.</li>
        <li>4. How do you implement "Shared Layout Animations" in Framer Motion?</li>
        <li>5. What is the difference between animating via React state (causing re-renders) vs animating values directly on the DOM node? How do animation libraries bypass React rendering?</li>
      </ul>
    `
  },
  {
    title: "27. Micro-frontends with Webpack Module Federation",
    content: `
      <h2>Micro-frontends in React</h2>
      <p>As applications grow, a single monolithic frontend becomes a bottleneck for multiple engineering teams. Micro-frontends break down the application into independently deployable pieces.</p>

      <h3>Webpack Module Federation</h3>
      <p>Module Federation allows a JavaScript application to dynamically load code from another application at runtime. This allows true micro-frontends without the overhead of iframes.</p>
      <pre><code>
// webpack.config.js (Host)
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: "host_app",
      remotes: {
        cart_app: "cart_app@http://localhost:3002/remoteEntry.js",
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
};

// Inside Host App Component
const RemoteCart = React.lazy(() => import("cart_app/Cart"));
      </code></pre>

      <h3>Dependency Sharing</h3>
      <p>Module Federation ensures that dependencies like React and React Router are only downloaded once. If the host has React loaded, the remote app uses the host's React instance.</p>

      <h3>Routing Across Micro-frontends</h3>
      <p>Routing is complex in micro-frontends. Generally, the Host application manages the Browser Router, while remote applications use Memory Routers to prevent URL sync conflicts.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What are the pros and cons of using Micro-frontends compared to a Monolithic frontend?</li>
        <li>2. How does Webpack Module Federation differ from simply loading multiple bundles via <code>&lt;script&gt;</code> tags?</li>
        <li>3. Why is it critical to set dependencies like <code>react</code> and <code>react-dom</code> as <code>singleton: true</code> in Module Federation?</li>
        <li>4. Describe the challenges of sharing global state (like Redux or User Authentication) across different micro-frontend applications.</li>
        <li>5. How do you handle routing conflicts between a Host shell and a Remote micro-frontend?</li>
      </ul>
    `
  },
  {
    title: "28. React Accessibility (A11y) at Scale",
    content: `
      <h2>React Accessibility (A11y)</h2>
      <p>Accessible applications can be used by everyone, including people relying on screen readers, keyboard navigation, or voice commands.</p>

      <h3>Managing Focus in SPAs</h3>
      <p>In Single Page Applications, route changes do not reload the page. Screen readers are often unaware that the page content has changed. You must programmatically move the focus to a heading or the main content area upon route transition.</p>
      <pre><code>
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

function MainContent({ children }) {
  const location = useLocation();
  const headingRef = useRef(null);

  useEffect(() => {
    // Move focus when route changes
    headingRef.current?.focus();
  }, [location.pathname]);

  return (
    &lt;main&gt;
      &lt;h1 tabIndex="-1" ref={headingRef}&gt;Page Title&lt;/h1&gt;
      {children}
    &lt;/main&gt;
  );
}
      </code></pre>

      <h3>ARIA Attributes and Roles</h3>
      <p>ARIA (Accessible Rich Internet Applications) attributes provide semantic meaning to non-semantic elements. However, the first rule of ARIA is: "No ARIA is better than bad ARIA." Always prefer native HTML elements (e.g., <code>&lt;button&gt;</code> instead of <code>&lt;div role="button"&gt;</code>).</p>

      <h3>Headless UI for Accessibility</h3>
      <p>Building accessible complex components like Modals, Comboboxes, and Tabs is extremely difficult. Libraries like Radix UI or Reach UI provide fully accessible headless primitives.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. How do you ensure that a custom Modal component traps keyboard focus when open, and restores focus when closed?</li>
        <li>2. Explain the purpose of the <code>aria-live</code> attribute. Give an example of when it should be used in a React app.</li>
        <li>3. Why is <code>tabIndex="0"</code> used, and why is using <code>tabIndex</code> greater than 0 an anti-pattern?</li>
        <li>4. How does React's synthetic event system handle native keyboard events like <code>onKeyDown</code> vs <code>onKeyPress</code>?</li>
        <li>5. What tools can you integrate into your CI/CD pipeline to automatically catch accessibility regressions? (e.g., axe-core).</li>
      </ul>
    `
  },
  {
    title: "29. React Application Architecture and Monorepos",
    content: `
      <h2>React Architecture and Monorepos</h2>
      <p>Enterprise applications require rigorous architectural boundaries to prevent coupling. A Monorepo is a single repository containing multiple distinct projects with well-defined relationships.</p>

      <h3>Feature-Sliced Design</h3>
      <p>Instead of organizing files by type (e.g., <code>components/</code>, <code>hooks/</code>, <code>utils/</code>), modern React apps organize by domain or feature (e.g., <code>features/auth</code>, <code>features/products</code>). Each feature is a self-contained module that exposes a public API via an <code>index.ts</code> file.</p>

      <h3>Turborepo and Nx</h3>
      <p>Tools like Turborepo provide high-performance build systems for JavaScript monorepos. They cache build artifacts aggressively. If a package hasn't changed, Turborepo skips building it and retrieves the output from the cache.</p>
      <pre><code>
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
      </code></pre>

      <h3>Sharing UI Libraries</h3>
      <p>In a monorepo, you can extract your design system into an internal package (e.g., <code>@my-org/ui</code>) and import it across different applications (e.g., Web App, Admin Panel).</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What is the fundamental difference between a Monorepo and a Monolith?</li>
        <li>2. Explain "Feature-Sliced Design". Why does organizing by file type (e.g., all reducers in one folder) fail as the app scales?</li>
        <li>3. How does Turborepo's caching mechanism work? What is remote caching?</li>
        <li>4. Explain how package workspaces (yarn workspaces, npm workspaces) resolve dependencies across local packages.</li>
        <li>5. How do you handle environment variables in a monorepo containing multiple deployed applications?</li>
      </ul>
    `
  },
  {
    title: "30. React 19: The Compiler, Actions, and The Future",
    content: `
      <h2>React 19 and The Future</h2>
      <p>React 19 introduces massive shifts in how React code is written and compiled, eliminating a vast amount of boilerplate.</p>

      <h3>The React Compiler (React Forget)</h3>
      <p>The React Compiler automatically memoizes your React code. It eliminates the need for <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code>. The compiler deeply analyzes your code to understand which values change and automatically caches them.</p>

      <h3>Actions and Form Handling</h3>
      <p>React 19 natively supports "Actions" - asynchronous functions that handle form submissions and data mutations. You can pass a function directly to the <code>action</code> prop of a <code>&lt;form&gt;</code>.</p>
      <pre><code>
// React 19 Action Example
async function updateProfile(formData) {
  'use server'; // If using server components
  const name = formData.get('name');
  await db.updateUser({ name });
}

function ProfileForm() {
  const { pending } = useFormStatus();
  
  return (
    &lt;form action={updateProfile}&gt;
      &lt;input name="name" /&gt;
      &lt;button disabled={pending}&gt;
        {pending ? 'Saving...' : 'Save'}
      &lt;/button&gt;
    &lt;/form&gt;
  );
}
      </code></pre>

      <h3>useFormStatus and useOptimistic</h3>
      <p><code>useFormStatus</code> provides status information for the parent <code>&lt;form&gt;</code> without needing Context. <code>useOptimistic</code> allows you to optimistically update the UI while an action is pending, rolling back if it fails.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. Explain how the React Compiler changes the performance optimization model of React. Why were <code>useMemo</code> and <code>useCallback</code> necessary in the past?</li>
        <li>2. How do React 19 Actions simplify form state management compared to using controlled components and <code>onSubmit</code> handlers?</li>
        <li>3. What is the purpose of the <code>useOptimistic</code> hook? Provide a real-world use case.</li>
        <li>4. How does <code>useFormStatus</code> work under the hood? Why must it be used in a component rendered inside a <code>&lt;form&gt;</code> tag?</li>
        <li>5. What is the significance of the new <code>use</code> API in React (e.g., <code>use(Promise)</code> or <code>use(Context)</code>)? How does it differ from traditional hooks?</li>
      </ul>
    `
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics)
  .then(() => console.log('Seed React Part 6 complete!'))
  .catch(err => console.error(err));
