import { insertRound } from './insertRound.js';

const roundData = {
  roundId: 'round-2',
  roundName: 'Round 2: Frontend Engineering',
  order: 2,
  description: 'Deep dive into frontend engineering, focusing on React.js, Next.js, Redux Toolkit, CSS3, and frontend architecture, tailored to experiences with Domain Scanner and Neutrinos.',
  categories: [
    {
      categoryName: 'React Under the Hood & Advanced Concepts',
      questions: [
        {
          difficulty: 'Hard',
          question: 'In Neutrinos, you architected a stage-based decision API to manage complex UI flows. How did you design the React components to dynamically render these different stage-based UIs without tightly coupling the frontend logic to specific stages?',
          expectedAnswer: 'Should mention component composition, dynamic imports, HOCs, or render props. Good answer involves a configuration-driven UI approach where the backend API drives the component tree rendering via a mapper or registry of components.',
          redFlags: ['Hardcoding stage checks (if/else or switch statements) across many components', 'Tight coupling between backend data and frontend view'],
          bonusPoints: ['Mentioning a component registry pattern', 'Discussing lazy loading (React.lazy/Suspense) for stage components']
        },
        {
          difficulty: 'Hard',
          question: 'How does React\'s reconciliation algorithm (Fiber) work, and how did you leverage this knowledge to ensure smooth rendering in the Domain Scanner\'s dynamic dashboards?',
          expectedAnswer: 'Should explain the virtual DOM, diffing algorithm, and how Fiber breaks rendering work into chunks. Should mention the importance of keys in dynamic lists to prevent unnecessary re-renders.',
          redFlags: ['Not understanding the Virtual DOM', 'Using array indices as keys in dynamic lists that change order'],
          bonusPoints: ['Mentioning time-slicing or concurrent mode', 'Explaining how React bails out of renders']
        },
        {
          difficulty: 'Medium',
          question: 'For role-specific, context-aware decision paths in Neutrinos, how did you handle component composition and avoiding prop drilling before implementing a global state?',
          expectedAnswer: 'Should discuss React Context API, using children props, or render props for component composition. Passing down components themselves instead of data.',
          redFlags: ['Only suggesting global state (Redux) for everything', 'Not knowing what component composition is'],
          bonusPoints: ['Explaining the inversion of control pattern']
        },
        {
          difficulty: 'Medium',
          question: 'Explain the concept of closures in React hooks. What are some common bugs related to stale closures you might have encountered while building the dynamic dashboards for Domain Scanner?',
          expectedAnswer: 'Should explain how hooks like useEffect and useCallback capture variables from their render scope. A stale closure happens when a hook references an old value of a state or prop because the dependency array was missing or incorrect.',
          redFlags: ['Unable to explain closures in JavaScript', 'Not understanding why the dependency array exists'],
          bonusPoints: ['Mentioning use of refs (useRef) to bypass stale closures when necessary']
        },
        {
          difficulty: 'Hard',
          question: 'Can you explain the difference between useMemo and useCallback? In what specific scenarios in Domain Scanner would you use them to optimize rendering, and when might they actually hurt performance?',
          expectedAnswer: 'useMemo memoizes a computed value, useCallback memoizes a function reference. Useful when passing props to heavily optimized child components (React.memo) or for expensive calculations. Can hurt performance due to the overhead of dependency tracking and memory usage if used unnecessarily.',
          redFlags: ['Using them everywhere by default', 'Not knowing they are for referential equality and expensive calculations'],
          bonusPoints: ['Explaining how they interact with React.memo']
        }
      ]
    },
    {
      categoryName: 'State Management (Redux Toolkit) & Data Flow',
      questions: [
        {
          difficulty: 'Hard',
          question: 'Given the complex application state logic in Neutrinos, how did you structure your Redux Toolkit slices? Did you normalize your state, and why?',
          expectedAnswer: 'Should discuss feature-based slice structure. Should mention state normalization (keeping data flat, using IDs to reference entities) to avoid deeply nested updates and ensure consistency.',
          redFlags: ['Deeply nested state objects', 'Duplicating data across slices'],
          bonusPoints: ['Mentioning createEntityAdapter in Redux Toolkit']
        },
        {
          difficulty: 'Hard',
          question: 'In Domain Scanner, you integrated Redis and PostgreSQL for backend data. How did you handle asynchronous state and caching on the React frontend using Redux Toolkit?',
          expectedAnswer: 'Should discuss RTK Query for data fetching and caching, or createAsyncThunk for complex async logic. Should explain how loading, success, and error states are handled.',
          redFlags: ['Not using RTK Query or createAsyncThunk', 'Handling all async logic inside components without Redux integration'],
          bonusPoints: ['Explaining cache invalidation strategies in RTK Query']
        },
        {
          difficulty: 'Medium',
          question: 'Redux can sometimes introduce boilerplate. How does Redux Toolkit simplify this, and what are the key differences between createSlice and traditional Redux reducers?',
          expectedAnswer: 'RTK uses Immer under the hood, allowing mutating logic in reducers. It auto-generates action creators and action types. It configures the store with good defaults (thunk, devtools).',
          redFlags: ['Not knowing about Immer', 'Manually writing action types and creators in RTK'],
          bonusPoints: ['Explaining how configureStore sets up middleware']
        },
        {
          difficulty: 'Hard',
          question: 'How do you handle side effects in a Redux Toolkit architecture when dealing with complex multi-stage workflows like in Neutrinos?',
          expectedAnswer: 'Can use Redux Thunk (default in RTK) or RTK Listener Middleware for complex side effects responding to state changes. For very complex flows, might mention Redux Saga or Observables, though RTK listener is modern standard.',
          redFlags: ['Putting side effects inside reducers (violating pure functions)'],
          bonusPoints: ['Detailed explanation of RTK Listener Middleware']
        },
        {
          difficulty: 'Medium',
          question: 'What are the trade-offs of using Redux Toolkit versus the Context API combined with useReducer for managing the state of a dynamic React dashboard?',
          expectedAnswer: 'Redux provides better debugging (DevTools), middleware support, and performance for frequent updates (prevents unnecessary re-renders). Context API is good for low-frequency updates (theme, auth) but can cause performance issues if value changes frequently and components are not properly memoized.',
          redFlags: ['Thinking Context API is a direct 1:1 replacement for Redux without performance considerations'],
          bonusPoints: ['Explaining how Context API triggers re-renders for all consumers']
        }
      ]
    },
    {
      categoryName: 'Next.js & UI Architecture',
      questions: [
        {
          difficulty: 'Expert',
          question: 'You used Next.js for building high-performance user interfaces. Can you compare SSG, SSR, ISR, and CSR? Which strategies would you choose for Domain Scanner\'s dashboards vs. a public-facing risk report page?',
          expectedAnswer: 'SSG for static pages. SSR for dynamic pages needing SEO/fresh data per request. ISR for updating static pages in background. CSR for highly interactive private dashboards. Domain Scanner dashboard: CSR or SSR. Public risk report: ISR or SSR.',
          redFlags: ['Not knowing the difference between SSG and SSR', 'Recommending CSR for SEO-heavy pages'],
          bonusPoints: ['Discussing Edge rendering and specific Next.js functions (getStaticProps vs getServerSideProps)']
        },
        {
          difficulty: 'Expert',
          question: 'How did you manage authentication state and protect specific routes in Next.js, particularly for the SSO-based authentication framework you architected in Domain Scanner?',
          expectedAnswer: 'Should discuss handling auth state on both server and client. Using Next.js middleware for edge-level route protection. Handling tokens (cookies vs local storage) securely (HttpOnly cookies).',
          redFlags: ['Storing JWTs in localStorage and only checking auth on the client side (vulnerable to XSS and causes flashes of unauthenticated content)'],
          bonusPoints: ['Explaining how NextAuth.js or custom middleware works under the hood']
        },
        {
          difficulty: 'Expert',
          question: 'Explain the App Router vs. Pages Router in Next.js. What architectural changes would you consider if migrating Domain Scanner from Pages to App Router?',
          expectedAnswer: 'App router introduces React Server Components (RSCs), nested layouts, and streaming. Migration involves separating Server Components (data fetching) from Client Components (interactivity), utilizing the new directory structure, and replacing getStaticProps/getServerSideProps with standard fetch calls.',
          redFlags: ['Not knowing about Server Components', 'Making all components Client Components by default'],
          bonusPoints: ['Discussing the performance benefits of sending less JavaScript to the client using RSCs']
        },
        {
          difficulty: 'Medium',
          question: 'For a highly dynamic SaaS application like Domain Scanner, how do you handle hydration mismatches in Next.js, and what are common causes?',
          expectedAnswer: 'Hydration mismatches happen when the server-rendered HTML differs from the initial client render (e.g., using window/document before mount, or invalid HTML nesting). Fixed by using useEffect to defer client-only rendering or dynamically importing components with ssr: false.',
          redFlags: ['Not understanding what hydration is'],
          bonusPoints: ['Using suppressHydrationWarning for expected mismatches like timestamps']
        },
        {
          difficulty: 'Medium',
          question: 'How would you architect a reusable UI component library for Neutrinos to ensure consistency across different role-specific UI flows?',
          expectedAnswer: 'Should mention creating isolated, accessible components. Using a tool like Storybook for documentation. Implementing a design system with CSS variables or a utility framework. Using an atomic design pattern.',
          redFlags: ['Building components tightly coupled to specific business logic'],
          bonusPoints: ['Mentioning accessibility (a11y) and testing (React Testing Library) for the component library']
        }
      ]
    },
    {
      categoryName: 'Performance Optimization & CSS3',
      questions: [
        {
          difficulty: 'Medium',
          question: 'For the complex UI flows in Neutrinos, how did you ensure the CSS remained maintainable? Did you use CSS Modules, Styled Components, or Tailwind, and what are the pros/cons of your approach?',
          expectedAnswer: 'Expect a solid comparison. CSS Modules provide local scoping without runtime cost. Styled Components provide dynamic styling but have runtime overhead. Tailwind provides utility classes for rapid development but can clutter markup.',
          redFlags: ['Using global CSS for everything, leading to specificity wars'],
          bonusPoints: ['Discussing CSS-in-JS runtime performance implications']
        },
        {
          difficulty: 'Hard',
          question: 'How do you analyze and improve the First Contentful Paint (FCP) and Largest Contentful Paint (LCP) in a Next.js application like Domain Scanner?',
          expectedAnswer: 'Analyze using Lighthouse/Core Web Vitals. Improve FCP by reducing server response time, minimizing blocking resources (CSS/JS). Improve LCP by prioritizing the critical image (Next/Image priority prop), preloading fonts, and deferring non-critical scripts.',
          redFlags: ['Not knowing what Core Web Vitals are'],
          bonusPoints: ['Mentioning dynamic imports for reducing initial bundle size']
        },
        {
          difficulty: 'Hard',
          question: 'How do you implement code splitting and lazy loading in React/Next.js to reduce the initial bundle size of a complex application?',
          expectedAnswer: 'In React, using React.lazy and Suspense. In Next.js, using next/dynamic. Should split by routes automatically (Next.js does this), and split large, non-critical components or heavy third-party libraries (e.g., charts on the dashboard).',
          redFlags: ['Loading the entire application in a single bundle'],
          bonusPoints: ['Discussing when NOT to lazy load (e.g., above the fold content)']
        },
        {
          difficulty: 'Hard',
          question: 'Explain how you would handle complex CSS animations for the stage-based decision paths in Neutrinos without causing layout thrashing or jank.',
          expectedAnswer: 'Should emphasize animating only composite properties (transform and opacity) to utilize the GPU. Avoid animating layout properties (width, height, margin) which trigger reflows. Use requestAnimationFrame for complex JS animations.',
          redFlags: ['Animating width, top, or left properties for transitions'],
          bonusPoints: ['Explaining the browser rendering pipeline (Style -> Layout -> Paint -> Composite)']
        },
        {
          difficulty: 'Medium',
          question: 'What strategies do you use for optimizing images and other media assets in a high-performance Next.js frontend?',
          expectedAnswer: 'Using the next/image component for automatic WebP/AVIF format conversion, responsive resizing, and lazy loading. Using a CDN for asset delivery.',
          redFlags: ['Using standard img tags for large static images without optimization'],
          bonusPoints: ['Discussing proper usage of the priority prop for LCP images']
        }
      ]
    }
  ]
};

const run = async () => {
  try {
    await insertRound(roundData);
    console.log('Successfully inserted Round 2.');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting Round 2:', error);
    process.exit(1);
  }
};

run();
