import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "16. Advanced Hooks Mastery: useReducer, useLayoutEffect, and useImperativeHandle",
    content: `
      <h2>Advanced Hooks Mastery</h2>
      <p>While <code>useState</code> and <code>useEffect</code> cover the majority of use cases in React applications, scaling complex applications requires a deeper understanding of React's advanced hooks. These hooks provide granular control over state transitions, DOM mutations, and component instance references.</p>
      
      <h3>The Power of useReducer for Complex State</h3>
      <p><code>useReducer</code> is preferable to <code>useState</code> when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one. It also lets you optimize performance for components that trigger deep updates because you can pass <code>dispatch</code> down instead of callbacks.</p>
      <pre><code>
const initialState = { count: 0, loading: false, error: null };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'decrement':
      return { ...state, count: state.count - 1 };
    case 'fetch_start':
      return { ...state, loading: true };
    case 'fetch_success':
      return { ...state, loading: false, data: action.payload };
    case 'fetch_error':
      return { ...state, loading: false, error: action.error };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // dispatch({ type: 'increment' })
}
      </code></pre>
      
      <h3>useLayoutEffect vs useEffect</h3>
      <p>The signature is identical to <code>useEffect</code>, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside <code>useLayoutEffect</code> will be flushed synchronously, before the browser has a chance to paint.</p>
      
      <h3>Ref Forwarding and useImperativeHandle</h3>
      <p><code>useImperativeHandle</code> customizes the instance value that is exposed to parent components when using <code>ref</code>. As always, imperative code using refs should be avoided in most cases. <code>useImperativeHandle</code> should be used with <code>forwardRef</code>.</p>
      <pre><code>
const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
    shake: () => {
      // Trigger shake animation
    }
  }));
  return &lt;input ref={inputRef} /&gt;;
});
      </code></pre>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. When would you choose <code>useReducer</code> over <code>useState</code>? Explain with a concrete example.</li>
        <li>2. Describe the exact timing difference between <code>useEffect</code> and <code>useLayoutEffect</code>. When is it dangerous to use <code>useLayoutEffect</code>?</li>
        <li>3. How does React batch state updates in asynchronous handlers in React 18 versus React 17?</li>
        <li>4. What is the purpose of <code>useImperativeHandle</code>, and why is its usage generally discouraged in React's declarative paradigm?</li>
        <li>5. How can you implement a custom hook that behaves like a purely synchronous local storage sync?</li>
      </ul>
    `
  },
  {
    title: "17. Custom Hooks and High-Order Abstractions",
    content: `
      <h2>Custom Hooks and High-Order Abstractions</h2>
      <p>Custom Hooks allow you to extract component logic into reusable functions. However, designing robust, generic custom hooks requires deep knowledge of closures, reference equality, and React's reactivity system.</p>
      
      <h3>Designing Robust Custom Hooks</h3>
      <p>When designing custom hooks, returning memoized callbacks is critical if the consumer of the hook will pass those callbacks into their own effect dependencies.</p>
      <pre><code>
function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    setIsLoading(true);
    
    fetch(url, { signal: abortController.signal })
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => {
        if (err.name === 'AbortError') return;
        setError(err);
      })
      .finally(() => setIsLoading(false));

    return () => abortController.abort();
  }, [url]);

  return { data, error, isLoading };
}
      </code></pre>

      <h3>Higher-Order Components (HOCs) in the Modern Era</h3>
      <p>While hooks have largely replaced HOCs, they are still prevalent in large codebases. HOCs are functions that take a component and return a new component. They are useful for cross-cutting concerns like authentication or analytics tracking.</p>

      <h3>Render Props Pattern</h3>
      <p>The render prop pattern involves passing a function as a prop to a component, which the component calls to render its content. This pattern shares state or behavior without coupling the UI.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What are the rules of Hooks, and how does the ESLint plugin enforce them?</li>
        <li>2. How do you prevent a custom hook from causing unnecessary re-renders in the consuming component?</li>
        <li>3. Compare Custom Hooks, HOCs, and Render Props. When would you use one over the other in modern React?</li>
        <li>4. How do you handle race conditions in custom data-fetching hooks? Explain the AbortController approach.</li>
        <li>5. Explain closure staleness (stale closures) in the context of <code>useEffect</code>. How does the <code>useRef</code> hook help solve this?</li>
      </ul>
    `
  },
  {
    title: "18. React Performance Optimization at Scale",
    content: `
      <h2>React Performance Optimization at Scale</h2>
      <p>Performance optimization in React is primarily about preventing unnecessary renders and minimizing the cost of renders that must occur.</p>
      
      <h3>React.memo and Component Memoization</h3>
      <p><code>React.memo</code> is a higher-order component. If your component renders the same result given the same props, you can wrap it in a call to <code>React.memo</code> for a performance boost by memoizing the result.</p>
      <pre><code>
const MyComponent = React.memo(function MyComponent(props) {
  /* render using props */
});

// With custom comparison function
function areEqual(prevProps, nextProps) {
  return prevProps.id === nextProps.id;
}
export default React.memo(MyComponent, areEqual);
      </code></pre>

      <h3>useMemo and useCallback Deep Dive</h3>
      <p><code>useMemo</code> memoizes a computed value, while <code>useCallback</code> memoizes a function definition. They are useless unless the child component is wrapped in <code>React.memo</code> or if the value is used in a dependency array of another hook.</p>

      <h3>Code Splitting and Lazy Loading</h3>
      <p>React.lazy and Suspense allow you to lazily load components, reducing the initial bundle size.</p>
      <pre><code>
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    &lt;React.Suspense fallback={&lt;Spinner /&gt;}&gt;
      &lt;OtherComponent /&gt;
    &lt;/React.Suspense&gt;
  );
}
      </code></pre>

      <h3>Virtualization for Long Lists</h3>
      <p>Rendering thousands of rows in the DOM will crash the browser. Libraries like <code>react-window</code> or <code>react-virtualized</code> only render the items visible in the viewport.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. Does <code>React.memo</code> prevent re-renders caused by context changes? How can you optimize context consumers?</li>
        <li>2. Explain why wrapping every function in <code>useCallback</code> is an anti-pattern. What is the actual cost of <code>useCallback</code>?</li>
        <li>3. How do you profile a React application to find performance bottlenecks using the React DevTools Profiler?</li>
        <li>4. What is the difference between route-based code splitting and component-based code splitting?</li>
        <li>5. How does windowing/virtualization work under the hood? Describe the mathematical calculation required to render a virtualized list.</li>
        <li>6. Explain the concept of "Render Bailing" in React.</li>
      </ul>
    `
  },
  {
    title: "19. State Management Architecture: Context, Redux, Zustand",
    content: `
      <h2>State Management Architecture</h2>
      <p>Choosing the right state management solution is critical for the maintainability of large applications. We will explore native React Context, atomic state, and global stores.</p>

      <h3>Context API + useReducer</h3>
      <p>Context provides a way to pass data through the component tree without having to pass props down manually at every level. Combined with <code>useReducer</code>, it forms a lightweight Redux alternative.</p>
      <pre><code>
const AppStateContext = React.createContext();
const AppDispatchContext = React.createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    &lt;AppStateContext.Provider value={state}&gt;
      &lt;AppDispatchContext.Provider value={dispatch}&gt;
        {children}
      &lt;/AppDispatchContext.Provider&gt;
    &lt;/AppStateContext.Provider&gt;
  );
}
      </code></pre>
      <p>Note: Separating state and dispatch into two contexts prevents components that only dispatch actions from re-rendering when the state changes.</p>

      <h3>Zustand: Bare-necessities Global State</h3>
      <p>Zustand is a small, fast, and scalable bearbones state-management solution using simplified flux principles. Has a comfy API based on hooks, isn't boilerplatey or opinionated.</p>
      
      <h3>Atomic State with Recoil or Jotai</h3>
      <p>Atomic state management systems allow state to be broken down into "atoms" that can be individually subscribed to, solving the excessive re-rendering problems of monolithic stores or Context.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. What is the primary performance issue with the React Context API for frequently changing state, and how can you mitigate it?</li>
        <li>2. Compare the architecture of Redux to Zustand. Why has Zustand gained so much popularity recently?</li>
        <li>3. What is an "atomic" state manager (like Recoil/Jotai), and how does it differ from a global store (like Redux)?</li>
        <li>4. How do you test components that are heavily reliant on global state?</li>
        <li>5. When should state live in the URL, when should it live in global state, and when should it be local component state? Give concrete rules.</li>
      </ul>
    `
  },
  {
    title: "20. Concurrent React and React 18 Features",
    content: `
      <h2>Concurrent React and React 18 Features</h2>
      <p>React 18 introduced Concurrent Mode, fundamentally changing how React renders UI by allowing rendering to be interruptible.</p>

      <h3>useTransition for Non-Blocking UI</h3>
      <p><code>useTransition</code> lets you mark state updates as non-urgent. This keeps the UI responsive during large rendering updates.</p>
      <pre><code>
const [isPending, startTransition] = useTransition();
const [searchQuery, setSearchQuery] = useState('');

function handleChange(e) {
  // Urgent update: typing in the input
  setInputValue(e.target.value);
  
  // Non-urgent update: filtering a large list
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
}
      </code></pre>

      <h3>useDeferredValue</h3>
      <p><code>useDeferredValue</code> accepts a value and returns a new copy of the value that will defer to more urgent updates. It is similar to debouncing, but it doesn't require a fixed time delay.</p>

      <h3>Suspense for Data Fetching</h3>
      <p>Suspense lets your components "wait" for something before they can render. While previously only for code-splitting, React 18 fully supports Suspense for asynchronous data fetching when integrated with frameworks like Next.js or Relay.</p>

      <h3>Automatic Batching</h3>
      <p>React 18 batches all state updates automatically, even inside promises, setTimeout, or native event handlers, drastically reducing render cycles.</p>

      <h3>Interview Questions</h3>
      <ul>
        <li>1. Explain the concept of "Interruptible Rendering" in Concurrent React. How does it improve User Experience?</li>
        <li>2. What is the exact difference between <code>useTransition</code> and <code>useDeferredValue</code>? When do you use which?</li>
        <li>3. How does Automatic Batching work in React 18? How can you opt-out of batching using <code>flushSync</code>?</li>
        <li>4. Describe the lifecycle of a Suspense component. How does a child component "suspend" execution? (Hint: throwing Promises).</li>
        <li>5. What are tearing and hydration mismatches, and how does React 18's <code>useSyncExternalStore</code> solve tearing issues?</li>
      </ul>
    `
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics)
  .then(() => console.log('Seed React Part 4 complete!'))
  .catch(err => console.error(err));
