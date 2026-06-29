import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'react-introduction-and-jsx',
    title: 'Chapter 1: Introduction to React and JSX',
    order: 1,
    content: `
# Introduction to React and JSX

Welcome to the React Industrial Masterclass. In this incredibly comprehensive guide, we will explore every nuance of React, starting with its core philosophy, the Virtual DOM, and the syntax extension known as JSX.

## What is React?

React is a declarative, efficient, and flexible JavaScript library for building user interfaces. Developed and maintained by Meta (formerly Facebook), React has become the dominant paradigm for frontend development. Unlike traditional imperative programming where you dictate exactly how the DOM should change, React uses a declarative approach. You describe what the UI should look like at any given point in time, and React ensures the DOM matches that state.

### Core Philosophies

1. **Declarative Paradigm:** You write code that describes the final state of the UI. When the underlying data changes, React efficiently updates and renders just the right components. This makes the code more predictable and easier to debug.
2. **Component-Based Architecture:** Build encapsulated components that manage their own state, then compose them to make complex UIs. Since component logic is written in JavaScript instead of templates, you can easily pass rich data through your app and keep state out of the DOM.
3. **Learn Once, Write Anywhere:** React doesn't make assumptions about the rest of your technology stack. You can use React to render on the server using Node (Next.js) or build mobile apps using React Native.

## The Virtual DOM Explained in Depth

The Virtual DOM (VDOM) is a programming concept where an ideal, or "virtual", representation of a UI is kept in memory and synced with the "real" DOM by a library such as ReactDOM. This process is called reconciliation.

Why is this important? DOM manipulation is historically slow. By using a VDOM, React minimizes the number of direct DOM interactions. When state changes, React creates a new VDOM tree and compares it to the previous one using a diffing algorithm (Heuristic O(n) algorithm). It calculates the most efficient way to update the real DOM and batches those updates, resulting in high performance.

## Deep Dive into JSX

JSX is a syntax extension for JavaScript. It looks like HTML, but it's actually closer to JavaScript. JSX produces React "elements" which are the building blocks of React applications.

### JSX Under the Hood

When you write JSX, it's transpiled by tools like Babel into standard JavaScript function calls.

\`\`\`jsx
// JSX Code
const element = <h1 className="greeting">Hello, World!</h1>;
\`\`\`

\`\`\`javascript
// Transpiled JavaScript (React 17+)
import { jsx as _jsx } from "react/jsx-runtime";
const element = _jsx("h1", {
  className: "greeting",
  children: "Hello, World!"
});
\`\`\`

### Advanced JSX Features

1. **Embedding Expressions:** You can embed any JavaScript expression within JSX using curly braces \`{}\`.
2. **Attributes:** Use quotes to specify string literals as attributes, or curly braces to embed JavaScript expressions. Note that React uses camelCase for HTML attributes (e.g., \`className\` instead of \`class\`, \`tabIndex\` instead of \`tabindex\`).
3. **Children:** JSX tags may contain children.
4. **Preventing Injection Attacks:** React DOM escapes any values embedded in JSX before rendering them, effectively preventing Cross-Site Scripting (XSS) attacks.

\`\`\`jsx
const user = { firstName: 'Harper', lastName: 'Perez' };
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

const element = (
  <div className="user-profile">
    <h1>Hello, {formatName(user)}!</h1>
    <img src={user.avatarUrl} alt={\`Avatar of \${user.firstName}\`} />
    <p>Current timestamp: {new Date().toLocaleTimeString()}</p>
  </div>
);
\`\`\`

## Control Flow in JSX

Because JSX is just JavaScript, you cannot use traditional \`if/else\` or \`for\` loops directly inside the JSX payload. Instead, you use JavaScript expressions.

### Conditional Rendering
\`\`\`jsx
const LoginPanel = ({ isLoggedIn }) => (
  <div>
    {isLoggedIn ? <Dashboard /> : <LoginForm />}
    {isLoggedIn && <button>Logout</button>}
  </div>
);
\`\`\`

### List Rendering
\`\`\`jsx
const items = ['Apple', 'Banana', 'Cherry'];
const List = () => (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
\`\`\`
*(Note: Using index as key is an anti-pattern which we will cover deeply in Chapter 5).*

## Conclusion

Understanding JSX and the React philosophy is the cornerstone of mastering React. In the next chapter, we will look at how components are composed and how data flows through them using props.
`,
    interviewQuestions: [
      { question: "What is the Virtual DOM and why is it useful?", answer: "The Virtual DOM is an in-memory representation of the real DOM. It is useful because direct DOM manipulation is computationally expensive. React batches updates to the Virtual DOM, calculates the diff against the previous state, and applies only the minimal necessary changes to the real DOM." },
      { question: "How does JSX differ from HTML?", answer: "JSX is a JavaScript syntax extension that looks like HTML but gets transpiled to JavaScript objects (React.createElement). It uses camelCase for attributes (className instead of class), allows embedding JS expressions using curly braces, and requires all tags to be closed." },
      { question: "Can a browser read JSX directly?", answer: "No, browsers can only read standard JavaScript. JSX must be transpiled into standard JS using tools like Babel before it can be interpreted by a browser." },
      { question: "What is reconciliation in React?", answer: "Reconciliation is the algorithm React uses to diff one tree of React elements against another to determine the parts that need to be updated in the real DOM." },
      { question: "Why do we use className instead of class in JSX?", answer: "'class' is a reserved keyword in JavaScript (used for ES6 classes). Since JSX is transpiled down to JavaScript, React uses 'className' to avoid naming collisions." }
    ],
    practicalTask: {
      scenario: "You need to create a greeting card component that dynamically displays user information.",
      task: "Create a JSX expression that renders a div containing an h2 with the user's name, a paragraph with their bio, and an image if they have an avatarUrl. Use inline styling for the div.",
      solutionCode: "const GreetingCard = ({ user }) => (\n  <div style={{ border: '1px solid black', padding: '10px' }}>\n    <h2>{user.name}</h2>\n    <p>{user.bio}</p>\n    {user.avatarUrl && <img src={user.avatarUrl} alt={`${user.name}'s avatar`} />}\n  </div>\n);"
    }
  },
  {
    slug: 'components-and-props-deep-dive',
    title: 'Chapter 2: Components and Props Deep Dive',
    order: 2,
    content: `
# Components and Props Deep Dive

Components are the fundamental building blocks of any React application. A component is essentially a JavaScript function (or class) that optionally accepts inputs (called "props") and returns a React element describing what should appear on the screen.

## Functional vs Class Components

Historically, React had two types of components: Class-based and Functional.

### Functional Components
Functional components are simpler, lighter, and modern. With the introduction of Hooks, functional components can do everything class components can do, and they are now the industry standard.

\`\`\`jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
// Or as an arrow function
const Welcome = ({ name }) => <h1>Hello, {name}</h1>;
\`\`\`

### Class Components
While legacy, it's critical to understand them as you will encounter them in older codebases.

\`\`\`jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
\`\`\`

## Understanding Props

"Props" (short for properties) is how components talk to each other. They flow strictly downwards (from parent to child). This is called unidirectional data flow.

### Characteristics of Props
1. **Read-Only (Immutable):** A component must never modify its own props. Whether you declare a component as a function or a class, it must act like a pure function with respect to its props.
2. **Any Data Type:** You can pass strings, numbers, arrays, objects, and even functions or other React elements as props.

### Destructuring Props
It is highly common and recommended to destructure props in the function signature for cleaner code.

\`\`\`jsx
const Profile = ({ name, age, onLogout }) => (
  <div className="profile">
    <h2>{name}</h2>
    <p>Age: {age}</p>
    <button onClick={onLogout}>Logout</button>
  </div>
);
\`\`\`

## Children Prop

The \`children\` prop is a special prop passed automatically to components that have opening and closing tags. This allows for powerful composition.

\`\`\`jsx
const Card = ({ children, title }) => (
  <div className="card-wrapper">
    <div className="card-header">{title}</div>
    <div className="card-body">
      {children}
    </div>
  </div>
);

// Usage
const App = () => (
  <Card title="User Statistics">
    <p>Views: 100</p>
    <p>Likes: 42</p>
  </Card>
);
\`\`\`

## Prop Types and Default Props

In modern React, TypeScript is generally preferred for type checking. However, React provides a built-in mechanism called \`PropTypes\`.

\`\`\`jsx
import PropTypes from 'prop-types';

const Button = ({ label, color }) => (
  <button style={{ backgroundColor: color }}>{label}</button>
);

Button.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['red', 'blue', 'green'])
};

Button.defaultProps = {
  color: 'blue'
};
\`\`\`

## Pure Components

If a component's render output only depends on its props, you can wrap it in \`React.memo\` to optimize performance. It memoizes the component, skipping rendering if props are strictly equal to the previous props.

\`\`\`jsx
const ExpensiveComponent = React.memo(({ data }) => {
  // Heavy computation here
  return <div>{data.result}</div>;
});
\`\`\`

## Component Composition vs Inheritance

React has a powerful composition model, and it is recommended to use composition instead of inheritance to reuse code between components. Props and composition give you all the flexibility you need to customize a component's look and behavior in an explicit and safe way.
`,
    interviewQuestions: [
      { question: "What is the difference between state and props?", answer: "Props are read-only inputs passed from parent to child, while state is mutable data managed within the component itself. Props are analogous to function arguments, whereas state is like local variables." },
      { question: "Why must components act like pure functions with respect to their props?", answer: "Because modifying props directly violates React's unidirectional data flow and functional programming principles. It leads to unpredictable side effects and bugs. Props must be immutable." },
      { question: "What is the children prop?", answer: "The children prop is a special prop containing the components or elements passed between the opening and closing tags of a component. It allows for component composition." },
      { question: "What is React.memo used for?", answer: "React.memo is a higher-order component that memoizes the rendering of a functional component. It prevents unnecessary re-renders if the incoming props have not changed." },
      { question: "How do you pass a function as a prop and why?", answer: "You pass it like any other variable (<Child onClick={handleClick} />). This is crucial for inverse data flow, allowing child components to trigger state changes in parent components." }
    ],
    practicalTask: {
      scenario: "You need to build a reusable layout component that wraps any page content with a standard header and footer.",
      task: "Create a Layout component that accepts a 'title' prop for the header and a 'children' prop for the main content.",
      solutionCode: "const Layout = ({ title, children }) => (\n  <div className=\"layout\">\n    <header><h1>{title}</h1></header>\n    <main>{children}</main>\n    <footer>&copy; 2026 Company</footer>\n  </div>\n);"
    }
  },
  {
    slug: 'state-and-lifecycle-methods',
    title: 'Chapter 3: State and Lifecycle Methods',
    order: 3,
    content: `
# State and Lifecycle Methods

While props are fixed throughout the lifetime of a component (from the component's perspective), **State** is dynamic data that changes over time, usually triggered by user interactions, network responses, or timers.

## The Concept of State

State is local and encapsulated within the component. When a component's state changes, React schedules a re-render of that component and its children.

### State in Functional Components: \`useState\`

In modern React, we use the \`useState\` hook to add state to functional components.

\`\`\`jsx
import React, { useState } from 'react';

const Counter = () => {
  // useState returns an array with 2 elements: current state, and setter function
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Current Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
\`\`\`

### Asynchronous State Updates

State updates via the setter function are **asynchronous**. React batches state updates for performance. If you need to update state based on the previous state, you should pass a callback function to the setter.

\`\`\`jsx
// BAD: May result in stale closures or skipped updates if called rapidly
setCount(count + 1);

// GOOD: Safely uses previous state
setCount(prevCount => prevCount + 1);
\`\`\`

## Component Lifecycle (The Core Concept)

Every React component goes through three main phases:
1. **Mounting:** Being inserted into the DOM.
2. **Updating:** Re-rendering when state or props change.
3. **Unmounting:** Being removed from the DOM.

### Lifecycle in Class Components

Before Hooks, we used lifecycle methods:
- \`componentDidMount()\`: Fired once after initial render. Great for fetching data.
- \`componentDidUpdate(prevProps, prevState)\`: Fired after every re-render. Great for reacting to prop changes.
- \`componentWillUnmount()\`: Fired right before removal. Great for cleanup (intervals, event listeners).

\`\`\`jsx
class Timer extends React.Component {
  state = { seconds: 0 };
  
  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(s => ({ seconds: s.seconds + 1 }));
    }, 1000);
  }
  
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  
  render() {
    return <div>Seconds: {this.state.seconds}</div>;
  }
}
\`\`\`

### Lifecycle in Functional Components: \`useEffect\`

The \`useEffect\` hook unifies all three lifecycle methods into a single API.

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const TimerHook = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // componentDidMount & componentDidUpdate equivalent logic
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    // componentWillUnmount equivalent (cleanup function)
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array means this runs ONCE on mount

  return <div>Seconds: {seconds}</div>;
};
\`\`\`

## Rules of State

1. **Do not modify state directly:** Always use the setter function. \`this.state.comment = 'Hello'\` will not re-render the component.
2. **State Updates are Merged (in Classes) / Replaced (in Hooks):** \`setState\` in classes merges the object. The \`useState\` setter completely replaces the old state, so you must spread objects manually if dealing with complex state.

\`\`\`jsx
const [user, setUser] = useState({ name: 'John', age: 30 });

// Updating just the name
setUser(prevUser => ({ ...prevUser, name: 'Jane' }));
\`\`\`
`,
    interviewQuestions: [
      { question: "Why is state updating asynchronous in React?", answer: "React batches state updates to optimize performance. If you update state 10 times in a single synchronous block of code, React will only perform a single re-render with the final state, avoiding unnecessary DOM manipulations." },
      { question: "What is the difference between mounting and rendering?", answer: "Rendering is React calling your component function to get the JSX. Mounting is when React actually inserts those elements into the browser's DOM for the first time." },
      { question: "Why must you use a callback in setState when relying on previous state?", answer: "Because state updates are batched and async, relying on the 'current' variable value might use stale data. The callback guarantees you are operating on the most recently committed state." },
      { question: "How do you perform cleanup in useEffect?", answer: "You return a function from the useEffect callback. This returned function is executed right before the component unmounts, and also before the effect runs again on subsequent renders." },
      { question: "What happens if you omit the dependency array in useEffect?", answer: "The effect will run after EVERY render (initial and subsequent). This can easily lead to infinite loops if the effect also updates state." }
    ],
    practicalTask: {
      scenario: "Create a WindowResize listener that tracks the window width in state.",
      task: "Write a component that displays the current window width. Ensure you add the event listener on mount and properly remove it on unmount to prevent memory leaks.",
      solutionCode: "const WindowSize = () => {\n  const [width, setWidth] = useState(window.innerWidth);\n  useEffect(() => {\n    const handleResize = () => setWidth(window.innerWidth);\n    window.addEventListener('resize', handleResize);\n    return () => window.removeEventListener('resize', handleResize);\n  }, []);\n  return <div>Width: {width}px</div>;\n};"
    }
  },
  {
    slug: 'event-handling-in-react',
    title: 'Chapter 4: Event Handling in React',
    order: 4,
    content: `
# Event Handling in React

Handling events with React elements is very similar to handling events on DOM elements, but there are some critical syntactic and conceptual differences you must master.

## Key Differences from HTML

1. **CamelCase Naming:** React events are named using camelCase, rather than lowercase. (e.g., \`onClick\` instead of \`onclick\`).
2. **Passing Functions:** With JSX you pass a function as the event handler, rather than a string.
3. **Preventing Default:** You cannot return \`false\` to prevent default behavior. You must call \`e.preventDefault()\` explicitly.

### Basic Event Binding

\`\`\`jsx
const Form = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted.');
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
};
\`\`\`

## The SyntheticEvent Object

React wraps the native browser event in a \`SyntheticEvent\` object. This provides a cross-browser wrapper around the browser's native event, ensuring events behave exactly the same across all browsers.

The SyntheticEvent has the same interface as the native browser event, including \`stopPropagation()\` and \`preventDefault()\`. If you need the underlying native event, you can access \`e.nativeEvent\`.

## Passing Arguments to Event Handlers

Often you need to pass an extra parameter to an event handler. For example, deleting a specific row in a list.

There are two primary ways to do this:

### 1. Arrow Functions (Inline)
This is clean and readable, but creates a new function on every render. For most components, this performance hit is negligible.
\`\`\`jsx
<button onClick={(e) => deleteRow(id, e)}>Delete Row</button>
\`\`\`

### 2. Function Currying / Higher-Order Functions
You can create a function that returns the event handler.
\`\`\`jsx
const handleDelete = (id) => (e) => {
  // execute delete logic for id
};

<button onClick={handleDelete(id)}>Delete Row</button>
\`\`\`

## Event Pooling (Legacy Concept)

In React 16 and earlier, SyntheticEvents were pooled. This meant that the event object was reused and all properties were nullified after the event callback was invoked to save memory. You had to call \`e.persist()\` to use the event async.
**Note:** React 17 removed event pooling. You can now use event objects asynchronously without \`e.persist()\`.

## Common Events

- \`onClick\`: For buttons and clickable elements.
- \`onChange\`: For controlled inputs. Crucially, React's \`onChange\` behaves like HTML's \`oninput\` (fires on every keystroke), not HTML's \`onchange\` (fires on blur).
- \`onSubmit\`: For form submissions.
- \`onMouseEnter\` / \`onMouseLeave\`: For hover interactions.

## Binding in Class Components

If you use class components, you must carefully handle \`this\` binding, as class methods are not bound by default.

\`\`\`jsx
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // Necessary!
  }
  
  handleClick() {
    console.log(this); // 'this' will be undefined without binding
  }
}
\`\`\`
Modern class components bypass this using class field arrow functions:
\`\`\`jsx
class Button extends React.Component {
  handleClick = () => {
    console.log(this); // Works perfectly!
  }
}
\`\`\`
`,
    interviewQuestions: [
      { question: "What is a SyntheticEvent in React?", answer: "SyntheticEvent is a cross-browser wrapper around the browser's native event object. It ensures that events work consistently across all browsers and provides a standard API (like stopPropagation and preventDefault)." },
      { question: "Why do we pass functions as event handlers instead of calling them?", answer: "If you call the function directly (e.g., onClick={handleClick()}), it will execute immediately when the component renders. Passing the function reference (onClick={handleClick}) ensures it only runs when the event occurs." },
      { question: "How does React's onChange differ from HTML's native onchange?", answer: "In React, onChange fires on every keystroke for text inputs, mirroring HTML's 'input' event. Native HTML onchange only fires when the input loses focus (blur) and the value has changed." },
      { question: "How do you pass a custom parameter to an event handler?", answer: "You can use an inline arrow function: onClick={() => handleAction(myParam)}, or use currying: onClick={handleAction(myParam)} where handleAction returns another function." },
      { question: "Do you need e.persist() in React 17+?", answer: "No. React 17 removed event pooling, meaning SyntheticEvent objects are no longer nullified after the synchronous event callback finishes. They can be safely accessed inside async callbacks like setTimeout or Promises." }
    ],
    practicalTask: {
      scenario: "You need a list of items where clicking an item logs its specific ID.",
      task: "Render an array of objects ({id: 1, name: 'A'}, etc). Add an onClick handler to each list item that passes the ID to a logging function.",
      solutionCode: "const List = ({ items }) => {\n  const logId = (id) => console.log('Clicked ID:', id);\n  return (\n    <ul>\n      {items.map(item => (\n        <li key={item.id} onClick={() => logId(item.id)}>{item.name}</li>\n      ))}\n    </ul>\n  );\n};"
    }
  },
  {
    slug: 'conditional-rendering-and-lists',
    title: 'Chapter 5: Conditional Rendering and List Keys',
    order: 5,
    content: `
# Conditional Rendering and List Keys

Dynamic UIs require showing different components based on state, and rendering arrays of data into lists. These two concepts are deeply intertwined in everyday React development.

## Conditional Rendering Techniques

In React, conditional rendering works exactly the same way conditions work in JavaScript.

### 1. If/Else with Early Return
Great for entire component replacements, like loading states.
\`\`\`jsx
const Profile = ({ user, isLoading }) => {
  if (isLoading) {
    return <Spinner />;
  }
  if (!user) {
    return <Redirect to="/login" />;
  }
  return <div>Welcome {user.name}</div>;
};
\`\`\`

### 2. Logical AND (&&) Operator
Ideal for inline rendering where you want to render something ONLY if a condition is true.
\`\`\`jsx
const Inbox = ({ unreadMessages }) => (
  <div>
    <h1>Hello!</h1>
    {unreadMessages.length > 0 && (
      <h2>You have {unreadMessages.length} unread messages.</h2>
    )}
  </div>
);
\`\`\`
**Danger Warning:** Be careful with falsy values like \`0\`. \`{0 && <Component />}\` will render \`0\` to the screen! Always use strict booleans: \`{messages.length > 0 && ...}\`.

### 3. Ternary Operator (Condition ? True : False)
Perfect for inline conditional if-else rendering.
\`\`\`jsx
const AuthButton = ({ isLoggedIn }) => (
  <button>
    {isLoggedIn ? 'Logout' : 'Login'}
  </button>
);
\`\`\`

## Rendering Lists with Map

You will constantly transform arrays of data into arrays of React elements. The standard way to do this is using the array \`.map()\` function.

\`\`\`jsx
const TodoList = ({ todos }) => {
  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} text={todo.text} />
      ))}
    </ul>
  );
};
\`\`\`

## The Critical Importance of Keys

When you render a list, React requires you to provide a special string attribute called \`key\`. 

### Why Keys?
Keys help React identify which items have changed, are added, or are removed. They are crucial for React's reconciliation algorithm (diffing). Without keys, if a list changes, React might re-render the entire list instead of just updating the changed node, causing massive performance drops. Worse, it can cause bugs with component state.

### Rules for Keys
1. **Uniqueness:** Keys only need to be unique among sibling elements.
2. **Stability:** Keys must not change over time. Never use \`Math.random()\` as a key.
3. **Index as Key (Anti-pattern):** Do not use the array index as a key if the list can be reordered, filtered, or items can be deleted. This leads to component state mix-ups.

### Example of the Index Anti-Pattern
Imagine a list of inputs. If you delete the first item, the item that used to be index 1 is now index 0. React sees that the key "0" still exists, so it keeps the old DOM node and just updates its props. But the internal state of that input remains attached to the DOM node, meaning the wrong input text will show up for the shifted items!

\`\`\`jsx
// DANGEROUS IF LIST CAN CHANGE
{items.map((item, index) => <input key={index} defaultValue={item.val} />)}

// CORRECT
{items.map(item => <input key={item.uniqueId} defaultValue={item.val} />)}
\`\`\`

## Extracting Components with Keys
A common mistake is putting the key on the wrapper element inside a component rather than on the component itself.
\`\`\`jsx
// BAD
const ListItem = ({ item }) => <li key={item.id}>{item.name}</li>;
const List = ({ items }) => items.map(item => <ListItem item={item} />);

// GOOD
const ListItem = ({ item }) => <li>{item.name}</li>;
const List = ({ items }) => items.map(item => <ListItem key={item.id} item={item} />);
\`\`\`
Rule of thumb: Elements inside the \`map()\` call need keys.
`,
    interviewQuestions: [
      { question: "Why is it dangerous to use array index as keys in React?", answer: "If the list order changes (e.g., sorting, deleting items, adding items at the top), React will misinterpret which elements changed. This causes performance issues and bugs where component state (like uncontrolled inputs) gets mixed up between elements." },
      { question: "What happens if a component renders the number 0 dynamically using &&, like {count && <span>hi</span>}?", answer: "Since 0 is falsy, the expression evaluates to 0. React renders strings and numbers, so the literal number '0' will appear on the screen. To fix this, use a strict boolean expression like {count > 0 && ...}." },
      { question: "What is the best unique identifier to use for a key?", answer: "A stable, unique ID coming from your data source, such as a database primary key, UUID, or a unique hash generated when the data object is created." },
      { question: "Can we use ternary operators outside of JSX?", answer: "Yes, ternary operators are standard JavaScript. You can use them to assign variables or determine which component to return entirely, though they are most commonly seen inline within JSX." },
      { question: "Does a key prop get passed down to the child component?", answer: "No. React strips out 'key' (and 'ref') before passing props to the child component. If you need access to that ID inside the child, you must pass it as a separate custom prop (e.g., <Child key={id} id={id} />)." }
    ],
    practicalTask: {
      scenario: "Render a list of users, but only show users who are marked as active.",
      task: "Given an array of objects {id, name, isActive}, use filter and map to render a list of list items. Ensure proper keys are used.",
      solutionCode: "const ActiveUsers = ({ users }) => (\n  <ul>\n    {users.filter(u => u.isActive).map(user => (\n      <li key={user.id}>{user.name}</li>\n    ))}\n  </ul>\n);"
    }
  }
];

appendTopics('react', 'React Industrial Masterclass', 'The definitive guide.', topics).catch(console.error);
