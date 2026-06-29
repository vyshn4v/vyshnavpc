import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch6-usestate",
    title: "Chapter 6: useState and Primitive State",
    order: 6,
    content: "<h2>useState Hook</h2><p>The `useState` hook allows functional components to manage local state. It returns a state variable and a setter function.</p><h2>Functional Updates</h2><p>When new state depends on previous state, you should pass a function to the setter instead of the direct value.</p>",
    interviewQuestions: [
      { question: "What does the useState hook return?", answer: "An array containing two elements: the current state value and a function to update it." },
      { question: "When should you use functional updates in useState?", answer: "When the new state depends on the previous state, to ensure you are working with the most up-to-date value and avoid stale closures." }
    ],
    practicalTask: {
      scenario: "Safe counter incrementing.",
      task: "Create a counter that increments safely using functional state updates.",
      solutionCode: "import { useState } from 'react';\n\nexport default function Counter() {\n  const [count, setCount] = useState(0);\n  const increment = () => setCount(prev => prev + 1);\n  return <button onClick={increment}>{count}</button>;\n}"
    }
  },
  {
    slug: "react-ch7-useeffect",
    title: "Chapter 7: useEffect and Component Lifecycle",
    order: 7,
    content: "<h2>Side Effects</h2><p>The `useEffect` hook lets you perform side effects (data fetching, subscriptions, manual DOM manipulation) in function components.</p><h2>Dependency Array</h2><p>The dependency array controls when the effect runs. An empty array means it runs once on mount. Omitting it means it runs on every render.</p>",
    interviewQuestions: [
      { question: "What is the purpose of the cleanup function in useEffect?", answer: "To clean up subscriptions, intervals, or event listeners before the component unmounts or before the effect runs again, preventing memory leaks." },
      { question: "What happens if you omit the dependency array?", answer: "The effect runs after every single render of the component." }
    ],
    practicalTask: {
      scenario: "Window resize listener.",
      task: "Create a component that tracks and displays the window width, properly cleaning up the event listener.",
      solutionCode: "import { useState, useEffect } from 'react';\n\nexport default function WindowWidth() {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  return <div>Width: {width}px</div>;\n}"
    }
  },
  {
    slug: "react-ch8-useref",
    title: "Chapter 8: useRef and Direct DOM Manipulation",
    order: 8,
    content: "<h2>useRef Hook</h2><p>The `useRef` hook returns a mutable ref object whose `.current` property is initialized to the passed argument. It persists for the full lifetime of the component.</p><h2>Differences from State</h2><p>Unlike state, mutating a ref does not trigger a re-render. It is useful for storing mutable values or accessing DOM elements directly.</p>",
    interviewQuestions: [
      { question: "How does useRef differ from useState?", answer: "Updating a ref's `.current` property does not trigger a component re-render, whereas updating state does." },
      { question: "What are common use cases for useRef?", answer: "Accessing DOM elements (like focusing an input), storing previous state, or holding mutable values that shouldn't trigger re-renders." }
    ],
    practicalTask: {
      scenario: "Auto-focus an input.",
      task: "Create an input field that automatically focuses when the component mounts.",
      solutionCode: "import { useRef, useEffect } from 'react';\n\nexport default function AutoFocusInput() {\n  const inputRef = useRef(null);\n  useEffect(() => {\n    inputRef.current.focus();\n  }, []);\n  return <input ref={inputRef} placeholder=\"I am focused!\" />;\n}"
    }
  },
  {
    slug: "react-ch9-usecontext",
    title: "Chapter 9: useContext and Prop Drilling",
    order: 9,
    content: "<h2>Prop Drilling</h2><p>Passing props through many levels of the component tree is known as prop drilling. Context solves this.</p><h2>useContext Hook</h2><p>The `useContext` hook accepts a context object and returns the current context value, allowing easy reading of global state without passing props down manually.</p>",
    interviewQuestions: [
      { question: "What problem does Context API solve?", answer: "It solves 'prop drilling' by allowing data to be accessed by deeply nested components without passing props down manually through every level." },
      { question: "Does useContext prevent re-renders?", answer: "No, when a context provider's value changes, all components consuming that context will re-render." }
    ],
    practicalTask: {
      scenario: "Theming application.",
      task: "Create a simple ThemeContext and a component that consumes it to display the current theme.",
      solutionCode: "import { createContext, useContext } from 'react';\n\nconst ThemeContext = createContext('light');\n\nexport default function ThemeDisplay() {\n  const theme = useContext(ThemeContext);\n  return <div>Current theme: {theme}</div>;\n}"
    }
  },
  {
    slug: "react-ch10-performance-hooks",
    title: "Chapter 10: useMemo and useCallback",
    order: 10,
    content: "<h2>useMemo</h2><p>`useMemo` returns a memoized value. It only recalculates the memoized value when one of the dependencies has changed.</p><h2>useCallback</h2><p>`useCallback` returns a memoized callback. It is useful when passing callbacks to optimized child components that rely on reference equality.</p>",
    interviewQuestions: [
      { question: "What is the difference between useMemo and useCallback?", answer: "`useMemo` memoizes a calculated value, while `useCallback` memoizes a function definition." },
      { question: "Should you use useMemo for everything?", answer: "No. Memoization has a performance cost overhead. It should only be used for expensive calculations or preserving referential equality." }
    ],
    practicalTask: {
      scenario: "Optimizing a callback passed to a child.",
      task: "Wrap a click handler in `useCallback` to prevent child re-renders.",
      solutionCode: "import { useCallback } from 'react';\n\nexport default function Parent({ count }) {\n  const handleClick = useCallback(() => {\n    console.log('Clicked');\n  }, []);\n  return <Child onClick={handleClick} />;\n}\n\nfunction Child({ onClick }) { return <button onClick={onClick}>Click Me</button>; }"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
