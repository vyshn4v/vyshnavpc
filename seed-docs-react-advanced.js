import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Seeding React Masterclass.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) {
    return mongoose.models.Docs;
  }
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const reactDoc = {
  technology: "react",
  title: "React Official Masterclass",
  description: "Comprehensive guide to React 18+, Concurrent Mode, and Enterprise Architecture.",
  topics: [
    {
      slug: "getting-started",
      title: "1. Describing the UI",
      order: 1,
      content: `
        <h2>Describing the UI</h2>
        <p>React is a JavaScript library for rendering user interfaces (UI). UI is built from small units like buttons, text, and images. React lets you combine them into reusable, nestable <em>components</em>.</p>
        
        <h3>Your First Component</h3>
        <p>A React component is a JavaScript function that returns markup (JSX).</p>
        <pre><code class="language-jsx">
function Profile() {
  return (
    &lt;img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    /&gt;
  );
}

export default function Gallery() {
  return (
    &lt;section&gt;
      &lt;h1&gt;Amazing scientists&lt;/h1&gt;
      &lt;Profile /&gt;
      &lt;Profile /&gt;
      &lt;Profile /&gt;
    &lt;/section&gt;
  );
}
        </code></pre>
        
        <h3>Rules of JSX</h3>
        <ol>
          <li><strong>Return a single root element:</strong> Wrap multiple elements in a <code>&lt;Fragment&gt;</code> (or <code>&lt;&gt;...&lt;/&gt;</code>).</li>
          <li><strong>Close all the tags:</strong> Tags like <code>&lt;img /&gt;</code> must be self-closed.</li>
          <li><strong>camelCase most of the things:</strong> JSX turns into JavaScript, so attributes written in HTML like <code>class</code> become <code>className</code>.</li>
        </ol>
      `
    },
    {
      slug: "adding-interactivity",
      title: "2. Adding Interactivity (State)",
      order: 2,
      content: `
        <h2>Adding Interactivity</h2>
        <p>Components often need to change what's on the screen as a result of an interaction. Typing into the form should update the input field, clicking "next" should change which image is displayed, clicking "buy" should put a product in the shopping cart. Components need to "remember" things: the current input value, the current image, the shopping cart. In React, this kind of component-specific memory is called <strong>state</strong>.</p>
        
        <h3>The useState Hook</h3>
        <p>To add state to a component, use the <code>useState</code> Hook.</p>
        <pre><code class="language-jsx">
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    &lt;button onClick={handleClick}&gt;
      You pressed me {count} times
    &lt;/button&gt;
  );
}
        </code></pre>

        <h3>State is Isolated</h3>
        <p>State is local to a component instance on the screen. In other words, if you render the same component twice, each copy will have completely isolated state!</p>
      `
    },
    {
      slug: "managing-state",
      title: "3. Managing State",
      order: 3,
      content: `
        <h2>Managing State</h2>
        <p>As your application grows, it helps to be more intentional about how your state is organized and how the data flows between your components.</p>
        
        <h3>Lifting State Up</h3>
        <p>Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props.</p>
        <pre><code class="language-jsx">
function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    &lt;&gt;
      &lt;h2&gt;Almaty, Kazakhstan&lt;/h2&gt;
      &lt;Panel 
        title="About" 
        isActive={activeIndex === 0} 
        onShow={() => setActiveIndex(0)}
      &gt;
        With a population of about 2 million, Almaty is Kazakhstan's largest city.
      &lt;/Panel&gt;
      &lt;Panel 
        title="Etymology" 
        isActive={activeIndex === 1} 
        onShow={() => setActiveIndex(1)}
      &gt;
        The name comes from alma, the Kazakh word for "apple".
      &lt;/Panel&gt;
    &lt;/&gt;
  );
}
        </code></pre>
      `
    },
    {
      slug: "escape-hatches",
      title: "4. Escape Hatches (Effects)",
      order: 4,
      content: `
        <h2>Escape Hatches (Refs & Effects)</h2>
        <p>Some components need to control and synchronize with systems outside of React. For example, you might need to focus an input using the browser API, play and pause a video player, or connect and listen to messages from a server.</p>

        <h3>Referencing Values with Refs</h3>
        <p>When you want a component to "remember" some information, but you don't want that information to trigger new renders, you can use a ref.</p>
        <pre><code class="language-jsx">
import { useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());
    
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }
}
        </code></pre>

        <h3>Synchronizing with Effects</h3>
        <p>Effects let you specify side effects that are caused by rendering itself, rather than by a particular event (like a click).</p>
        <pre><code class="language-jsx">
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]); // Only re-run the effect if isPlaying changes

  return &lt;video ref={ref} src={src} loop playsInline /&gt;;
}
        </code></pre>
      `
    },
    {
      slug: "custom-hooks",
      title: "5. Custom Hooks",
      order: 5,
      content: `
        <h2>Reusing Logic with Custom Hooks</h2>
        <p>React comes with several built-in Hooks like <code>useState</code> and <code>useEffect</code>. You can also author your own Hooks to extract reusable logic from your components.</p>
        
        <h3>Extracting a Hook</h3>
        <p>Imagine two components that need to track whether the user is online. You can extract this logic into a <code>useOnlineStatus</code> Hook.</p>
        <pre><code class="language-jsx">
import { useState, useEffect } from 'react';

// Custom Hook MUST start with "use"
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
}
        </code></pre>

        <p>Now any component can use it:</p>
        <pre><code class="language-jsx">
function SaveButton() {
  const isOnline = useOnlineStatus();

  return (
    &lt;button disabled={!isOnline}&gt;
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    &lt;/button&gt;
  );
}
        </code></pre>
      `
    },
    {
      slug: "context-api",
      title: "6. The Context API",
      order: 6,
      content: `
        <h2>Passing Data Deeply with Context</h2>
        <p>Usually, you will pass information from a parent component to a child component via props. But passing props can become verbose and inconvenient if you have to pass them through many components in the middle (prop drilling).</p>
        <p><strong>Context</strong> lets a parent component provide data to the entire tree below it.</p>

        <h3>Step 1: Create the context</h3>
        <pre><code class="language-jsx">
import { createContext } from 'react';
export const ThemeContext = createContext('light');
        </code></pre>

        <h3>Step 2: Provide the context</h3>
        <pre><code class="language-jsx">
import { ThemeContext } from './ThemeContext.js';

export default function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    &lt;ThemeContext.Provider value={theme}&gt;
      &lt;Page /&gt;
    &lt;/ThemeContext.Provider&gt;
  );
}
        </code></pre>

        <h3>Step 3: Use the context</h3>
        <pre><code class="language-jsx">
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext.js';

function Button() {
  // Automatically updates when the provider's value changes!
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return &lt;button className={className}&gt;Click me&lt;/button&gt;;
}
        </code></pre>
      `
    },
    {
      slug: "performance",
      title: "7. React Performance",
      order: 7,
      content: `
        <h2>React Performance & Memoization</h2>
        <p>By default, when a component's state changes, React re-renders that component and ALL of its children. In enterprise apps, this can lead to performance bottlenecks.</p>

        <h3>React.memo</h3>
        <p>Wrap a component in <code>memo</code> to skip re-rendering it if its props haven't changed.</p>
        <pre><code class="language-jsx">
import { memo } from 'react';

const ExpensiveChart = memo(function ExpensiveChart({ data }) {
  // Heavy calculations...
  return &lt;svg&gt;...&lt;/svg&gt;;
});
        </code></pre>

        <h3>useMemo</h3>
        <p><code>useMemo</code> caches the result of a calculation between renders.</p>
        <pre><code class="language-jsx">
import { useMemo } from 'react';

function TodoList({ todos, tab }) {
  const visibleTodos = useMemo(() => {
    return filterTodos(todos, tab); // Only runs if todos or tab change
  }, [todos, tab]);
  
  return (
    &lt;ul&gt;
      {visibleTodos.map(todo => &lt;li key={todo.id}&gt;{todo.text}&lt;/li&gt;)}
    &lt;/ul&gt;
  );
}
        </code></pre>

        <h3>useCallback</h3>
        <p><code>useCallback</code> caches a function definition between renders. This is essential when passing functions down to <code>memo</code>'d child components, as recreating functions normally breaks the memoization.</p>
        <pre><code class="language-jsx">
const handleSubmit = useCallback((orderDetails) => {
  post('/api/orders', { orderDetails });
}, []); // Function identity never changes
        </code></pre>
      `
    },
    {
      slug: "concurrent-mode",
      title: "8. Concurrent React",
      order: 8,
      content: `
        <h2>Concurrent React (Transitions & Suspense)</h2>
        <p>React 18 introduced Concurrent Mode, which allows React to interrupt a heavy render to handle a high-priority event (like a click or typing).</p>

        <h3>useTransition</h3>
        <p>Transitions let you keep the user interface responsive by marking certain state updates as non-urgent.</p>
        <pre><code class="language-jsx">
import { useState, useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    // React will yield to typing/clicking during this update
    startTransition(() => {
      setTab(nextTab);
    });
  }

  return (
    &lt;&gt;
      &lt;button onClick={() => selectTab('posts')}&gt;Posts&lt;/button&gt;
      {isPending && &lt;span&gt;Loading...&lt;/span&gt;}
      &lt;HeavyTabContent tab={tab} /&gt;
    &lt;/&gt;
  );
}
        </code></pre>

        <h3>Suspense</h3>
        <p><code>&lt;Suspense&gt;</code> lets you display a fallback until its children have finished loading.</p>
        <pre><code class="language-jsx">
import { Suspense, lazy } from 'react';

const HeavyDashboard = lazy(() => import('./HeavyDashboard.js'));

function App() {
  return (
    &lt;Suspense fallback={&lt;LoadingSpinner /&gt;}&gt;
      &lt;HeavyDashboard /&gt;
    &lt;/Suspense&gt;
  );
}
        </code></pre>
      `
    }
  ]
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate(
    { technology: reactDoc.technology },
    reactDoc,
    { upsert: true, new: true }
  );
  console.log("✅ Comprehensive React docs seeded successfully!");
  process.exit(0);
};

run();
