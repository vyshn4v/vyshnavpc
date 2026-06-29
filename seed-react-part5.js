import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch21-state-landscape",
    title: "Chapter 21: The State Management Landscape",
    order: 21,
    content: "<h2>Local vs Global State</h2><p>Local state belongs to a single component. Global state is shared across many parts of the application.</p><h2>Libraries</h2><p>Options range from built-in Context API, Redux, Zustand, Jotai, to server-state managers like React Query and SWR.</p>",
    interviewQuestions: [
      { question: "When should you use Redux over Context API?", answer: "Use Redux for complex, high-frequency state updates, when you need strict architectural patterns, or when leveraging its powerful DevTools and middleware ecosystem." },
      { question: "What is server state vs client state?", answer: "Server state is data that resides on a server and is cached on the client (e.g., API responses). Client state is ephemeral data relevant only to the UI (e.g., dark mode, modal open state)." }
    ],
    practicalTask: {
      scenario: "Choosing a state strategy.",
      task: "Implement a simple toggle state using local useState.",
      solutionCode: "import { useState } from 'react';\n\nexport default function SimpleToggle() {\n  const [isOpen, setIsOpen] = useState(false);\n  return <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? 'Open' : 'Closed'}</button>;\n}"
    }
  },
  {
    slug: "react-ch22-redux-fundamentals",
    title: "Chapter 22: Redux Fundamentals",
    order: 22,
    content: "<h2>Core Concepts</h2><p>Redux is built on three principles: a single source of truth (the Store), state is read-only, and changes are made with pure functions (Reducers).</p><h2>Actions</h2><p>Actions are plain objects with a `type` property describing the event that occurred.</p>",
    interviewQuestions: [
      { question: "What is a Redux reducer?", answer: "A pure function that takes the current state and an action, and returns the next state." },
      { question: "Why must reducers be pure functions?", answer: "Pure functions guarantee predictable state updates, enabling features like time-travel debugging and preventing subtle bugs caused by state mutation." }
    ],
    practicalTask: {
      scenario: "Write a pure reducer.",
      task: "Create a standard Redux reducer for a counter.",
      solutionCode: "const initialState = { value: 0 };\n\nexport function counterReducer(state = initialState, action) {\n  switch (action.type) {\n    case 'INCREMENT': return { value: state.value + 1 };\n    case 'DECREMENT': return { value: state.value - 1 };\n    default: return state;\n  }\n}"
    }
  },
  {
    slug: "react-ch23-react-redux",
    title: "Chapter 23: React Redux and Hooks",
    order: 23,
    content: "<h2>Connecting Redux to React</h2><p>The `react-redux` library provides the `Provider` component to inject the store, and hooks like `useSelector` and `useDispatch` to interact with it.</p><h2>useSelector</h2><p>This hook allows you to extract data from the Redux store state.</p>",
    interviewQuestions: [
      { question: "What does useSelector do?", answer: "It allows a React component to extract and subscribe to specific pieces of data from the Redux store state." },
      { question: "How does useSelector optimize performance?", answer: "It uses strict equality (`===`) reference checks by default to determine if the selected state changed, preventing unnecessary re-renders." }
    ],
    practicalTask: {
      scenario: "Accessing Redux state.",
      task: "Use `useSelector` to read a counter value and `useDispatch` to dispatch an increment action.",
      solutionCode: "import { useSelector, useDispatch } from 'react-redux';\n\nexport default function CounterDisplay() {\n  const count = useSelector(state => state.counter.value);\n  const dispatch = useDispatch();\n  return (\n    <button onClick={() => dispatch({ type: 'INCREMENT' })}>\n      Count: {count}\n    </button>\n  );\n}"
    }
  },
  {
    slug: "react-ch24-redux-toolkit",
    title: "Chapter 24: Redux Toolkit (RTK)",
    order: 24,
    content: "<h2>Modern Redux</h2><p>Redux Toolkit is the official recommended approach for writing Redux logic. It eliminates boilerplate and prevents common mistakes.</p><h2>createSlice</h2><p>`createSlice` automatically generates action creators and action types based on the reducers you provide.</p>",
    interviewQuestions: [
      { question: "What is createSlice in Redux Toolkit?", answer: "A function that accepts an initial state, an object full of reducer functions, and a 'slice name', and automatically generates action creators and action types." },
      { question: "Can you mutate state in RTK reducers?", answer: "Yes, RTK uses the Immer library under the hood, allowing you to write mutable code that safely becomes immutable updates." }
    ],
    practicalTask: {
      scenario: "Create an RTK Slice.",
      task: "Create a counter slice using `createSlice`.",
      solutionCode: "import { createSlice } from '@reduxjs/toolkit';\n\nconst counterSlice = createSlice({\n  name: 'counter',\n  initialState: { value: 0 },\n  reducers: {\n    increment: (state) => { state.value += 1; }\n  }\n});\n\nexport const { increment } = counterSlice.actions;\nexport default counterSlice.reducer;"
    }
  },
  {
    slug: "react-ch25-rtk-query",
    title: "Chapter 25: RTK Query and Data Fetching",
    order: 25,
    content: "<h2>Data Fetching and Caching</h2><p>RTK Query is an advanced data fetching and caching tool built directly into Redux Toolkit.</p><h2>Automated Hooks</h2><p>It automatically generates React hooks (like `useGetUsersQuery`) for your API endpoints.</p>",
    interviewQuestions: [
      { question: "What problems does RTK Query solve?", answer: "It simplifies data fetching, handles loading/error states, manages request caching, and eliminates the need to write thunks for API calls." },
      { question: "What is cache invalidation in RTK Query?", answer: "It uses 'tags' to identify cached data. Mutations can invalidate specific tags, forcing queries to automatically refetch the latest data." }
    ],
    practicalTask: {
      scenario: "Using an RTK Query hook.",
      task: "Use a generated RTK Query hook to display loading states and data.",
      solutionCode: "import { useGetPokemonByNameQuery } from './services/pokemon';\n\nexport default function Pokemon({ name }) {\n  const { data, error, isLoading } = useGetPokemonByNameQuery(name);\n  if (isLoading) return <div>Loading...</div>;\n  if (error) return <div>Error!</div>;\n  return <div>{data.species.name}</div>;\n}"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
