import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch16-router-intro",
    title: "Chapter 16: Introduction to Client-side Routing",
    order: 16,
    content: "<h2>SPA Routing</h2><p>In a Single Page Application (SPA), routing is handled client-side. React Router is the standard library for this.</p><h2>BrowserRouter</h2><p>The `BrowserRouter` component uses HTML5 history API to keep the UI in sync with the URL.</p>",
    interviewQuestions: [
      { question: "How does client-side routing differ from server-side routing?", answer: "Client-side routing intercepts URL changes to render different components without requesting a new HTML page from the server, resulting in faster transitions." },
      { question: "What is the Link component in React Router?", answer: "It is an accessible wrapper around an anchor tag that prevents the default browser navigation and instead uses the History API to navigate." }
    ],
    practicalTask: {
      scenario: "Basic App Navigation.",
      task: "Set up a basic router with a Home and About page.",
      solutionCode: "import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';\n\nexport default function App() {\n  return (\n    <BrowserRouter>\n      <nav><Link to=\"/\">Home</Link> | <Link to=\"/about\">About</Link></nav>\n      <Routes>\n        <Route path=\"/\" element={<div>Home</div>} />\n        <Route path=\"/about\" element={<div>About</div>} />\n      </Routes>\n    </BrowserRouter>\n  );\n}"
    }
  },
  {
    slug: "react-ch17-route-params",
    title: "Chapter 17: Route Parameters and Query Strings",
    order: 17,
    content: "<h2>URL Parameters</h2><p>URL parameters let you capture dynamic values from the URL, using syntax like `/users/:id`.</p><h2>useParams and useSearchParams</h2><p>React Router provides hooks to access parameters and query strings.</p>",
    interviewQuestions: [
      { question: "How do you access URL parameters in a component?", answer: "Using the `useParams` hook provided by React Router." },
      { question: "What does useSearchParams do?", answer: "It is used to read and modify the query string in the URL for the current location, similar to useState but for URL parameters." }
    ],
    practicalTask: {
      scenario: "User Profile Page.",
      task: "Create a component that reads a user ID from the URL and displays it.",
      solutionCode: "import { useParams } from 'react-router-dom';\n\nexport default function UserProfile() {\n  const { id } = useParams();\n  return <div>User ID: {id}</div>;\n}"
    }
  },
  {
    slug: "react-ch18-nested-routes",
    title: "Chapter 18: Nested Routes and Layouts",
    order: 18,
    content: "<h2>Nested Routing</h2><p>React Router allows routes to be nested inside other routes, matching the component hierarchy.</p><h2>Outlet Component</h2><p>The `<Outlet />` component should be used in parent route elements to render their child route elements.</p>",
    interviewQuestions: [
      { question: "What is the purpose of the Outlet component?", answer: "It serves as a placeholder in a parent route layout component where child routes will be rendered." },
      { question: "What is an index route?", answer: "An index route is a default child route that renders when the parent route's exact path is matched." }
    ],
    practicalTask: {
      scenario: "Dashboard Layout.",
      task: "Create a Layout component that renders a navigation bar and an Outlet for nested content.",
      solutionCode: "import { Outlet } from 'react-router-dom';\n\nexport default function Layout() {\n  return (\n    <div>\n      <header>Dashboard Header</header>\n      <main><Outlet /></main>\n    </div>\n  );\n}"
    }
  },
  {
    slug: "react-ch19-protected-routes",
    title: "Chapter 19: Protected Routes and Authentication",
    order: 19,
    content: "<h2>Guarding Routes</h2><p>Protected routes are routes that require the user to be authenticated. If they are not, they are redirected to a login page.</p><h2>Navigate Component</h2><p>The `<Navigate />` component is used to redirect users programmatically during render.</p>",
    interviewQuestions: [
      { question: "How do you implement a protected route in React Router v6?", answer: "By creating a wrapper component that checks authentication state. If authenticated, it renders `<Outlet />` or `children`; if not, it returns `<Navigate to=\"/login\" />`." },
      { question: "What is the difference between Navigate and useNavigate?", answer: "`<Navigate />` is a component used for redirection during the render phase, while `useNavigate` provides a function for imperative navigation (e.g., after form submission)." }
    ],
    practicalTask: {
      scenario: "Auth Guard Component.",
      task: "Create a RequireAuth component that redirects unauthenticated users.",
      solutionCode: "import { Navigate } from 'react-router-dom';\n\nexport default function RequireAuth({ children, isAuthenticated }) {\n  if (!isAuthenticated) {\n    return <Navigate to=\"/login\" replace />;\n  }\n  return children;\n}"
    }
  },
  {
    slug: "react-ch20-data-loaders",
    title: "Chapter 20: Data Loaders and Actions",
    order: 20,
    content: "<h2>Data Fetching in React Router v6.4+</h2><p>React Router introduced `loader` functions to fetch data before a route renders, reducing layout shift and loading spinners.</p><h2>Actions</h2><p>`action` functions handle data mutations (like form submissions) integrated directly into the routing layer.</p>",
    interviewQuestions: [
      { question: "What problem do loaders in React Router solve?", answer: "They solve 'render-as-you-fetch' problems by starting the data fetch in parallel with rendering, avoiding waterfall loading states." },
      { question: "How do you access data fetched by a loader?", answer: "By using the `useLoaderData()` hook inside the component." }
    ],
    practicalTask: {
      scenario: "Loader fetching data.",
      task: "Define a route loader and consume it using `useLoaderData`.",
      solutionCode: "import { useLoaderData } from 'react-router-dom';\n\nexport async function myLoader() {\n  return { message: 'Loaded data!' };\n}\n\nexport default function RouteComponent() {\n  const data = useLoaderData();\n  return <div>{data.message}</div>;\n}"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
