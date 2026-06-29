import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "view-engines",
    title: "16. View Engines Overview",
    order: 16,
    content: "<h2>Dynamic HTML</h2><p>View engines allow you to render dynamic HTML pages on the server side before sending them to the client.</p>",
    interviewQuestions: [
      { question: "What is a View Engine in Express?", answer: "A template engine enables you to use static template files and replace variables with actual values at runtime to generate HTML." },
      { question: "Name some popular view engines for Express.", answer: "Pug, EJS, and Handlebars." }
    ],
    practicalTask: {
      scenario: "Set up a view engine.",
      task: "Configure Express to use the 'ejs' view engine.",
      solutionCode: "app.set('view engine', 'ejs');\napp.set('views', './views');"
    }
  },
  {
    slug: "handlebars-ejs",
    title: "17. Handlebars / EJS Integration",
    order: 17,
    content: "<h2>Rendering Views</h2><p>Use `res.render(view, [locals], callback)` to render a view and send the rendered HTML string to the client.</p>",
    interviewQuestions: [
      { question: "How does res.render() work?", answer: "It reads a template file, compiles it using the configured view engine and local variables, and sends the resulting HTML string to the client." },
      { question: "Can res.render() take a callback?", answer: "Yes, if provided, the method returns the HTML string to the callback rather than sending it to the client automatically." }
    ],
    practicalTask: {
      scenario: "Render a homepage.",
      task: "Create a route that renders the 'home' view.",
      solutionCode: "app.get('/', (req, res) => {\n  res.render('home');\n});"
    }
  },
  {
    slug: "passing-data",
    title: "18. Passing Data to Views",
    order: 18,
    content: "<h2>Local Variables</h2><p>You can pass data to your templates by providing an object as the second argument to `res.render()`.</p>",
    interviewQuestions: [
      { question: "How do you pass data to a template?", answer: "By passing a 'locals' object to `res.render()`, like `res.render('index', { title: 'Hello' })`." },
      { question: "What is res.locals?", answer: "An object that contains response local variables scoped to the request. They are available to the view rendered during that request/response cycle." }
    ],
    practicalTask: {
      scenario: "Render user data.",
      task: "Render a 'profile' view and pass a username to it.",
      solutionCode: "app.get('/profile', (req, res) => {\n  res.render('profile', { username: 'JohnDoe' });\n});"
    }
  },
  {
    slug: "layouts-partials",
    title: "19. Layouts and Partials",
    order: 19,
    content: "<h2>Reusable UI</h2><p>Partials are smaller reusable components (like headers/footers). Layouts are wrapper templates that embed other views.</p>",
    interviewQuestions: [
      { question: "What is a template partial?", answer: "A partial is a reusable template fragment that can be included in other templates, reducing duplication (e.g., a navbar)." },
      { question: "Does standard Express support layouts out of the box?", answer: "It depends on the engine. EJS needs additional modules (like express-ejs-layouts), whereas Handlebars (express-handlebars) has built-in layout support." }
    ],
    practicalTask: {
      scenario: "Use a layout system.",
      task: "Set up express-handlebars with a default layout.",
      solutionCode: "const exphbs = require('express-handlebars');\napp.engine('handlebars', exphbs({ defaultLayout: 'main' }));\napp.set('view engine', 'handlebars');"
    }
  },
  {
    slug: "server-side-rendering",
    title: "20. Server-Side Rendering (SSR)",
    order: 20,
    content: "<h2>SSR vs CSR</h2><p>Server-Side Rendering generates the full HTML on the server, which is excellent for SEO and initial load times, as opposed to Client-Side Rendering which relies on JS.</p>",
    interviewQuestions: [
      { question: "What are the benefits of SSR in Express?", answer: "Better SEO, faster first contentful paint, and it works for clients with JavaScript disabled." },
      { question: "How does Express facilitate SSR?", answer: "By using template engines to merge data with HTML structures on the server before responding to the HTTP request." }
    ],
    practicalTask: {
      scenario: "Implement an SSR endpoint.",
      task: "Return an HTML string directly containing server data.",
      solutionCode: "app.get('/time', (req, res) => {\n  const now = new Date().toISOString();\n  res.send(`<h1>Current time: ${now}</h1>`);\n});"
    }
  }
];

appendTopics("express", "Express.js API Design", "The definitive guide.", topics).then(() => console.log('Part 4 seeded!'));
