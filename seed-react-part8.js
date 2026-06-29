import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch36-nextjs-intro",
    title: "Chapter 36: Next.js App Router Introduction",
    order: 36,
    content: "<h2>The Meta-Framework</h2><p>Next.js builds on top of React to provide file-based routing, SSR, API routes, and optimized builds.</p><h2>App Router</h2><p>The new App Router uses React Server Components by default, dramatically changing the architecture of Next.js applications.</p>",
    interviewQuestions: [
      { question: "What is Next.js?", answer: "A React framework that provides server-side rendering, static site generation, file-based routing, and built-in performance optimizations out of the box." },
      { question: "What is the difference between Pages Router and App Router in Next.js?", answer: "App Router is the newer architecture built around React Server Components, nested layouts, and streaming, while Pages Router is the legacy architecture." }
    ],
    practicalTask: {
      scenario: "Next.js page creation.",
      task: "Create a basic Next.js page component.",
      solutionCode: "export default function Page() {\n  return <h1>Hello, Next.js!</h1>;\n}"
    }
  },
  {
    slug: "react-ch37-server-components",
    title: "Chapter 37: React Server Components (RSC)",
    order: 37,
    content: "<h2>RSC Architecture</h2><p>Server Components run exclusively on the server, resulting in zero bundle size for the component and the ability to securely access databases directly.</p><h2>Client Components</h2><p>Use the `'use client'` directive to opt-in to standard React behavior (state, effects, event listeners).</p>",
    interviewQuestions: [
      { question: "What are React Server Components?", answer: "Components that execute exclusively on the server. They reduce client-side JavaScript bundle size and allow direct access to backend resources." },
      { question: "When must you use a Client Component?", answer: "When you need interactivity (onClick), hooks (useState, useEffect), or browser APIs (window, document)." }
    ],
    practicalTask: {
      scenario: "Server Component fetching.",
      task: "Write an async React Server Component that fetches data.",
      solutionCode: "export default async function DataView() {\n  const res = await fetch('https://api.example.com/data');\n  const data = await res.json();\n  return <div>{data.title}</div>;\n}"
    }
  },
  {
    slug: "react-ch38-styling",
    title: "Chapter 38: Styling Solutions",
    order: 38,
    content: "<h2>CSS Modules</h2><p>CSS Modules scope CSS locally by automatically generating unique class names.</p><h2>Tailwind & CSS-in-JS</h2><p>Tailwind provides utility classes for rapid UI development. CSS-in-JS (like styled-components) lets you write CSS inside JavaScript files.</p>",
    interviewQuestions: [
      { question: "What is the benefit of CSS Modules?", answer: "They eliminate global scope issues and naming collisions by locally scoping all class names automatically." },
      { question: "Why is Tailwind CSS popular in the React ecosystem?", answer: "It removes the need to switch context between CSS and JS files, prevents dead CSS accumulation, and provides a constrained, highly customizable design system." }
    ],
    practicalTask: {
      scenario: "Using CSS Modules.",
      task: "Import and apply a CSS Module class.",
      solutionCode: "import styles from './Button.module.css';\n\nexport default function Button() {\n  return <button className={styles.btn}>Click Me</button>;\n}"
    }
  },
  {
    slug: "react-ch39-error-boundaries",
    title: "Chapter 39: Error Boundaries",
    order: 39,
    content: "<h2>Handling Crashes</h2><p>Error boundaries catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole component tree.</p><h2>Class Component Requirement</h2><p>Currently, Error Boundaries must be written as Class components.</p>",
    interviewQuestions: [
      { question: "What is an Error Boundary in React?", answer: "A component that catches JavaScript errors in its child component tree, logs the errors, and displays a fallback UI." },
      { question: "Can functional components be Error Boundaries?", answer: "No, currently Error Boundaries can only be implemented using class components with `componentDidCatch` or `static getDerivedStateFromError`." }
    ],
    practicalTask: {
      scenario: "Basic Error Boundary implementation.",
      task: "Create an Error Boundary class component.",
      solutionCode: "import React from 'react';\n\nexport class ErrorBoundary extends React.Component {\n  state = { hasError: false };\n  static getDerivedStateFromError(error) { return { hasError: true }; }\n  render() {\n    if (this.state.hasError) return <h1>Something went wrong.</h1>;\n    return this.props.children;\n  }\n}"
    }
  },
  {
    slug: "react-ch40-deployment",
    title: "Chapter 40: CI/CD and Deployment",
    order: 40,
    content: "<h2>Building for Production</h2><p>Running `npm run build` optimizes the application for best performance.</p><h2>Hosting Platforms</h2><p>Vercel, Netlify, and AWS Amplify are popular choices that offer seamless CI/CD pipelines connected directly to your Git repository.</p>",
    interviewQuestions: [
      { question: "What does the production build of a React app do?", answer: "It minifies the JavaScript, eliminates dead code (tree-shaking), optimizes assets, and generates static files ready to be served." },
      { question: "What is CI/CD?", answer: "Continuous Integration / Continuous Deployment. It automates testing and deployment processes whenever code is pushed to a repository." }
    ],
    practicalTask: {
      scenario: "Vite build command.",
      task: "What command creates the optimized production build in a standard Vite+React app?",
      solutionCode: "// In your terminal, run:\nnpm run build"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
