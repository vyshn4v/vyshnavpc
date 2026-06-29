import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch11-usereducer",
    title: "Chapter 11: useReducer and Complex State",
    order: 11,
    content: "<h2>useReducer</h2><p>`useReducer` is usually preferable to `useState` when you have complex state logic that involves multiple sub-values or when the next state depends on the previous one.</p><h2>Reducer Function</h2><p>It takes a reducer function of type `(state, action) => newState`, and returns the current state paired with a `dispatch` method.</p>",
    interviewQuestions: [
      { question: "When should you prefer useReducer over useState?", answer: "When managing complex state objects, state transitions that depend on previous state, or when grouping related state updates." },
      { question: "What are the arguments of a reducer function?", answer: "The current state and the action object (usually containing a `type` and an optional `payload`)." }
    ],
    practicalTask: {
      scenario: "State machine counter.",
      task: "Implement a counter using `useReducer` supporting 'INCREMENT' and 'DECREMENT' actions.",
      solutionCode: "import { useReducer } from 'react';\n\nfunction reducer(state, action) {\n  switch (action.type) {\n    case 'INCREMENT': return { count: state.count + 1 };\n    case 'DECREMENT': return { count: state.count - 1 };\n    default: return state;\n  }\n}\n\nexport default function Counter() {\n  const [state, dispatch] = useReducer(reducer, { count: 0 });\n  return (\n    <div>\n      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>\n      {state.count}\n      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>\n    </div>\n  );\n}"
    }
  },
  {
    slug: "react-ch12-custom-hooks",
    title: "Chapter 12: Custom Hooks Architecture",
    order: 12,
    content: "<h2>Custom Hooks</h2><p>A custom Hook is a JavaScript function whose name starts with 'use' and that may call other Hooks. It allows you to extract component logic into reusable functions.</p><h2>Rules of Hooks</h2><p>Custom hooks must follow the Rules of Hooks: only call them at the top level, and only call them from React functions.</p>",
    interviewQuestions: [
      { question: "Why must custom hooks start with 'use'?", answer: "To allow React's linter plugin to enforce the Rules of Hooks automatically." },
      { question: "Do two components using the same custom hook share state?", answer: "No. Custom hooks are a mechanism to reuse stateful logic, but every time you use a custom hook, all state and effects inside of it are fully isolated." }
    ],
    practicalTask: {
      scenario: "Fetch data hook.",
      task: "Create a `useToggle` custom hook that returns a boolean value and a toggle function.",
      solutionCode: "import { useState } from 'react';\n\nexport function useToggle(initialValue = false) {\n  const [value, setValue] = useState(initialValue);\n  const toggle = () => setValue(v => !v);\n  return [value, toggle];\n}"
    }
  },
  {
    slug: "react-ch13-uselayouteffect",
    title: "Chapter 13: useLayoutEffect vs useEffect",
    order: 13,
    content: "<h2>The Difference</h2><p>The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render.</p><h2>Performance Impact</h2><p>Because it blocks browser painting, `useLayoutEffect` should be avoided unless absolutely necessary to prevent visual flickering.</p>",
    interviewQuestions: [
      { question: "When should you use useLayoutEffect instead of useEffect?", answer: "When you need to measure a DOM element's layout (like height or width) and mutate the DOM synchronously before the browser paints, to avoid visual flicker." },
      { question: "Does useLayoutEffect block rendering?", answer: "Yes, it fires synchronously after DOM mutations but before the browser paints the screen." }
    ],
    practicalTask: {
      scenario: "Measure an element.",
      task: "Use `useLayoutEffect` to measure a div's width and store it in state.",
      solutionCode: "import { useState, useLayoutEffect, useRef } from 'react';\n\nexport default function Measurer() {\n  const divRef = useRef();\n  const [width, setWidth] = useState(0);\n  useLayoutEffect(() => {\n    setWidth(divRef.current.getBoundingClientRect().width);\n  }, []);\n  return <div ref={divRef}>My width is: {width}px</div>;\n}"
    }
  },
  {
    slug: "react-ch14-useimperativehandle",
    title: "Chapter 14: useImperativeHandle and Refs",
    order: 14,
    content: "<h2>Forwarding Refs</h2><p>`React.forwardRef` allows a component to pass a ref to a child component.</p><h2>useImperativeHandle</h2><p>This hook customizes the instance value that is exposed to parent components when using `ref`. It is useful when you want to expose specific functions to the parent.</p>",
    interviewQuestions: [
      { question: "What does useImperativeHandle do?", answer: "It allows a child component to customize the methods or properties exposed to a parent component via a ref." },
      { question: "Why is useImperativeHandle considered an anti-pattern for regular use?", answer: "React embraces declarative programming. Exposing imperative methods breaks declarative patterns and makes the component tree harder to reason about." }
    ],
    practicalTask: {
      scenario: "Custom input component.",
      task: "Create a custom input component that exposes a `focusAndClear` method to its parent.",
      solutionCode: "import { forwardRef, useImperativeHandle, useRef } from 'react';\n\nconst CustomInput = forwardRef((props, ref) => {\n  const inputRef = useRef();\n  useImperativeHandle(ref, () => ({\n    focusAndClear: () => {\n      inputRef.current.value = '';\n      inputRef.current.focus();\n    }\n  }));\n  return <input ref={inputRef} />;\n});\nexport default CustomInput;"
    }
  },
  {
    slug: "react-ch15-concurrent-features",
    title: "Chapter 15: Concurrent Features (useTransition)",
    order: 15,
    content: "<h2>Concurrent React</h2><p>Concurrent React allows React to interrupt a long-running render to handle a high-priority event, like user input.</p><h2>useTransition</h2><p>`useTransition` lets you mark some state updates as non-urgent (transitions), keeping the UI responsive.</p>",
    interviewQuestions: [
      { question: "What is Concurrent Rendering in React 18?", answer: "A new behind-the-scenes mechanism that allows React to prepare multiple versions of the UI at the same time, making rendering interruptible." },
      { question: "What is the difference between useTransition and setTimeout?", answer: "`useTransition` is integrated into React's rendering lifecycle, letting React prioritize urgent updates and interrupt the transition if needed, unlike `setTimeout`." }
    ],
    practicalTask: {
      scenario: "Slow list filtering.",
      task: "Use `useTransition` to wrap a slow state update so the input remains responsive.",
      solutionCode: "import { useState, useTransition } from 'react';\n\nexport default function FilterList() {\n  const [isPending, startTransition] = useTransition();\n  const [filter, setFilter] = useState('');\n  \n  const handleChange = (e) => {\n    startTransition(() => {\n      setFilter(e.target.value);\n    });\n  };\n  return <div><input onChange={handleChange} />{isPending && 'Loading...'}</div>;\n}"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
