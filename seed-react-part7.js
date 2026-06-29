import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "react-ch31-testing-intro",
    title: "Chapter 31: Introduction to Testing",
    order: 31,
    content: "<h2>Testing Strategies</h2><p>Unit tests check isolated functions. Integration tests check how components work together. E2E tests run the entire app in a real browser.</p><h2>Jest and Vitest</h2><p>Test runners execute your tests and provide assertions like `expect(x).toBe(y)`.</p>",
    interviewQuestions: [
      { question: "What is the difference between Jest and React Testing Library?", answer: "Jest is a test runner and assertion framework. React Testing Library is a set of utilities for rendering components and querying the DOM." },
      { question: "What is the Arrange-Act-Assert pattern?", answer: "A common test structure: Arrange (set up data/render component), Act (trigger events), Assert (verify the result)." }
    ],
    practicalTask: {
      scenario: "Basic pure function test.",
      task: "Write a Jest test for an `add` function.",
      solutionCode: "function add(a, b) { return a + b; }\n\ntest('adds numbers correctly', () => {\n  expect(add(1, 2)).toBe(3);\n});"
    }
  },
  {
    slug: "react-ch32-rtl",
    title: "Chapter 32: React Testing Library Fundamentals",
    order: 32,
    content: "<h2>User-Centric Testing</h2><p>RTL encourages testing applications exactly as a user interacts with them, relying on accessibility roles and text content rather than implementation details.</p><h2>Queries</h2><p>Functions like `getByRole`, `findByText`, and `queryByTestId` are used to select elements.</p>",
    interviewQuestions: [
      { question: "Why does React Testing Library discourage querying by CSS classes?", answer: "Because users don't interact with CSS classes. Testing by accessibility roles or text ensures your app is accessible and makes tests resilient to refactoring." },
      { question: "What is the difference between getBy, queryBy, and findBy?", answer: "`getBy` throws an error if not found. `queryBy` returns null if not found (good for asserting non-existence). `findBy` returns a Promise and waits for the element to appear." }
    ],
    practicalTask: {
      scenario: "Test component rendering.",
      task: "Render a heading and assert it exists using RTL.",
      solutionCode: "import { render, screen } from '@testing-library/react';\nimport App from './App';\n\ntest('renders heading', () => {\n  render(<App />);\n  const heading = screen.getByRole('heading', { name: /hello/i });\n  expect(heading).toBeInTheDocument();\n});"
    }
  },
  {
    slug: "react-ch33-mocking",
    title: "Chapter 33: Mocking APIs and Modules",
    order: 33,
    content: "<h2>MSW (Mock Service Worker)</h2><p>Instead of mocking `fetch` or `axios` directly, MSW intercepts network requests at the network level, providing the most realistic testing environment.</p><h2>Jest Mocks</h2><p>Jest provides `jest.fn()` to mock functions and `jest.mock()` to mock entire modules.</p>",
    interviewQuestions: [
      { question: "Why is Mock Service Worker (MSW) preferred over mocking fetch?", answer: "MSW intercepts requests at the network level, meaning your application code (and third-party fetch libraries) remains untouched and tests are more robust." },
      { question: "What does jest.fn() do?", answer: "It creates a mock function that keeps track of how many times it was called, what arguments it was called with, and allows you to simulate return values." }
    ],
    practicalTask: {
      scenario: "Mock a callback.",
      task: "Test that a button click calls the provided mock function.",
      solutionCode: "import { render, screen, fireEvent } from '@testing-library/react';\nimport Button from './Button';\n\ntest('calls onClick', () => {\n  const handleClick = jest.fn();\n  render(<Button onClick={handleClick}>Click</Button>);\n  fireEvent.click(screen.getByText('Click'));\n  expect(handleClick).toHaveBeenCalledTimes(1);\n});"
    }
  },
  {
    slug: "react-ch34-testing-hooks",
    title: "Chapter 34: Testing Hooks and Context",
    order: 34,
    content: "<h2>renderHook</h2><p>Testing custom hooks in isolation requires a special utility `renderHook` since hooks cannot be called outside of a component.</p><h2>Wrapper Options</h2><p>When testing components that rely on Context, you must pass a `wrapper` containing the Context Provider to the `render` function.</p>",
    interviewQuestions: [
      { question: "How do you test a component that consumes a Context?", answer: "Wrap the component in the appropriate Context.Provider when rendering it in the test, often utilizing the `wrapper` option in RTL's `render` function." },
      { question: "What is act() used for in React tests?", answer: "`act()` ensures that all updates related to React state and side effects have been processed and applied to the DOM before you make your assertions." }
    ],
    practicalTask: {
      scenario: "Testing Context.",
      task: "Render a component with a Context provider wrapper.",
      solutionCode: "import { render } from '@testing-library/react';\nimport { ThemeContext } from './theme';\nimport Display from './Display';\n\ntest('renders with theme', () => {\n  render(\n    <ThemeContext.Provider value=\"dark\">\n      <Display />\n    </ThemeContext.Provider>\n  );\n});"
    }
  },
  {
    slug: "react-ch35-e2e-testing",
    title: "Chapter 35: End-to-End Testing (Cypress/Playwright)",
    order: 35,
    content: "<h2>E2E Testing</h2><p>E2E tests fire up a real browser and simulate complex user journeys across multiple pages.</p><h2>Playwright vs Cypress</h2><p>Both are excellent modern tools. Playwright offers robust multi-browser support, while Cypress provides an exceptional developer experience.</p>",
    interviewQuestions: [
      { question: "What is End-to-End (E2E) testing?", answer: "Testing the entire software application from start to finish, simulating real user scenarios to validate that all integrated components work together." },
      { question: "When should you write E2E tests versus Unit tests?", answer: "Use E2E tests for critical user flows (like checkout or login). Use unit tests for business logic, utilities, and isolated component behavior." }
    ],
    practicalTask: {
      scenario: "Basic Cypress test.",
      task: "Write a Cypress test that visits a page and asserts the title.",
      solutionCode: "describe('Home Page', () => {\n  it('successfully loads', () => {\n    cy.visit('http://localhost:3000');\n    cy.contains('Welcome to React');\n  });\n});"
    }
  }
];

appendTopics("react", "React Industrial Masterclass", "The definitive guide.", topics);
