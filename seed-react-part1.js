import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch1-intro",
    title: "Chapter 1: Introduction to React and JSX",
    order: 1,
    content: "<h2>React Overview</h2><p>React is a declarative, efficient, and flexible JavaScript library for building user interfaces. It lets you compose complex UIs from small and isolated pieces of code called components.</p><h2>JSX Syntax</h2><p>JSX produces React elements. It is a syntax extension to JavaScript that looks similar to XML/HTML.</p>",
    interviewQuestions: [
      { question: "What is the Virtual DOM?", answer: "The Virtual DOM is a lightweight copy of the actual DOM in memory. React uses it to efficiently compute the minimal set of changes required to update the UI." },
      { question: "Why can't browsers read JSX?", answer: "Browsers can only read JavaScript objects. JSX is not a valid JavaScript object. It must be compiled (e.g., by Babel) into `React.createElement()` calls before the browser can execute it." }
    ],
    practicalTask: {
      scenario: "You need to render a simple welcome message.",
      task: "Create a React component using JSX that renders an H1 tag with 'Hello, React World!'",
      solutionCode: "export default function Welcome() {\n  return <h1>Hello, React World!</h1>;\n}"
    }
  },
  {
    slug: "react-ch2-components",
    title: "Chapter 2: Components and Props",
    order: 2,
    content: "<h2>Functional vs Class Components</h2><p>Historically, React had class and functional components. Modern React uses functional components primarily.</p><h2>Props</h2><p>Props (short for properties) are how components talk to each other. They are read-only and passed from parent to child.</p>",
    interviewQuestions: [
      { question: "What is the difference between state and props?", answer: "Props are passed to the component (similar to function parameters) and are immutable. State is managed within the component (similar to variables declared within a function) and is mutable." },
      { question: "What are Pure Components?", answer: "Pure components only re-render if their state or props have changed. In functional components, this is achieved using `React.memo`." }
    ],
    practicalTask: {
      scenario: "Display a user profile card.",
      task: "Create a `Profile` component that accepts `name` and `age` as props and renders them.",
      solutionCode: "export default function Profile({ name, age }) {\n  return <div><h2>{name}</h2><p>Age: {age}</p></div>;\n}"
    }
  },
  {
    slug: "react-ch3-state",
    title: "Chapter 3: State and Lifecycle",
    order: 3,
    content: "<h2>Understanding State</h2><p>State allows React components to change their output over time in response to user actions, network responses, and anything else.</p><h2>Lifecycle</h2><p>Components go through a lifecycle: Mounting, Updating, and Unmounting. In functional components, hooks replace traditional lifecycle methods.</p>",
    interviewQuestions: [
      { question: "Why shouldn't you mutate state directly?", answer: "Mutating state directly (e.g., `this.state.count = 1` or modifying a state object directly) does not trigger a re-render. Always use the state setter function." },
      { question: "What is state batching?", answer: "React groups multiple state updates into a single re-render for better performance." }
    ],
    practicalTask: {
      scenario: "You need a toggle switch.",
      task: "Create a component with a button that toggles between 'ON' and 'OFF' text.",
      solutionCode: "import { useState } from 'react';\n\nexport default function Toggle() {\n  const [isOn, setIsOn] = useState(false);\n  return <button onClick={() => setIsOn(!isOn)}>{isOn ? 'ON' : 'OFF'}</button>;\n}"
    }
  },
  {
    slug: "react-ch4-events",
    title: "Chapter 4: Event Handling",
    order: 4,
    content: "<h2>Synthetic Events</h2><p>React handles events using Synthetic Events, which are cross-browser wrappers around the browser's native event.</p><h2>Binding</h2><p>In modern React functional components, event handlers are simply functions passed as props (e.g., `onClick={handleClick}`).</p>",
    interviewQuestions: [
      { question: "How do you pass arguments to an event handler?", answer: "Use an arrow function: `onClick={() => handleClick(id)}` or `bind`: `onClick={handleClick.bind(this, id)}`." },
      { question: "What is a Synthetic Event?", answer: "A cross-browser wrapper around the browser's native event, ensuring events work identically across all browsers." }
    ],
    practicalTask: {
      scenario: "Form submission prevention.",
      task: "Create a form that prevents the default reload behavior when submitted.",
      solutionCode: "export default function Form() {\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    console.log('Submitted');\n  };\n  return <form onSubmit={handleSubmit}><button type=\"submit\">Submit</button></form>;\n}"
    }
  },
  {
    slug: "react-ch5-conditional-lists",
    title: "Chapter 5: Conditional Rendering and Lists",
    order: 5,
    content: "<h2>Conditional Rendering</h2><p>You can render different elements depending on the state using `if`, ternary operators, or logical `&&`.</p><h2>Lists and Keys</h2><p>When rendering arrays of elements, each element must have a unique `key` prop to help React identify which items have changed.</p>",
    interviewQuestions: [
      { question: "Why are keys necessary in React lists?", answer: "Keys help React identify which items have changed, are added, or are removed. They give elements a stable identity, improving rendering performance." },
      { question: "Is it safe to use array indices as keys?", answer: "Only if the list is static, items are never reordered, and no items are added or removed. Otherwise, it can cause rendering bugs and performance issues." }
    ],
    practicalTask: {
      scenario: "Display a list of items.",
      task: "Given an array of string items, render an unordered list mapping each item to an `<li>` element.",
      solutionCode: "export default function ItemList({ items }) {\n  return <ul>{items.map((item, i) => <li key={i}>{item}</li>)}</ul>;\n}"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
