import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-views",
    title: "16. Views",
    order: 16,
    content: "<h2>Virtual Tables</h2><p>Views encapsulate complex queries into a single virtual table.</p>",
    interviewQuestions: [
      { question: "Are views updatable in Postgres?", answer: "Yes, simple views are automatically updatable." }
    ],
    practicalTask: {
      scenario: "Abstracting a complex join.",
      task: "Create a view for active users.",
      solutionCode: "CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;"
    }
  },
  {
    slug: "pg-materialized-views",
    title: "17. Materialized Views",
    order: 17,
    content: "<h2>Cached Views</h2><p>Materialized views store the result of the query physically for faster access.</p>",
    interviewQuestions: [
      { question: "How do you update a materialized view?", answer: "By running REFRESH MATERIALIZED VIEW." }
    ],
    practicalTask: {
      scenario: "Caching expensive reporting data.",
      task: "Create a materialized view.",
      solutionCode: "CREATE MATERIALIZED VIEW sales_summary AS SELECT date, SUM(amount) FROM sales GROUP BY date;"
    }
  },
  {
    slug: "pg-functions-procedures",
    title: "18. Functions and Stored Procedures",
    order: 18,
    content: "<h2>Server-Side Logic</h2><p>Functions return values, while procedures (introduced in PG 11) can manage transactions.</p>",
    interviewQuestions: [
      { question: "What is the difference between a function and a procedure in Postgres?", answer: "Procedures can commit and rollback transactions, functions cannot." }
    ],
    practicalTask: {
      scenario: "Creating a simple math function.",
      task: "Create a function to add two integers.",
      solutionCode: "CREATE FUNCTION add_nums(a INT, b INT) RETURNS INT LANGUAGE sql AS $$ SELECT a + b; $$;"
    }
  },
  {
    slug: "pg-plpgsql",
    title: "19. Introduction to PL/pgSQL",
    order: 19,
    content: "<h2>Procedural Language</h2><p>PL/pgSQL adds control structures like IF/ELSE and loops to SQL.</p>",
    interviewQuestions: [
      { question: "Why use PL/pgSQL?", answer: "To perform complex logic and reduce the number of client-server roundtrips." }
    ],
    practicalTask: {
      scenario: "Using loops in the database.",
      task: "Write a DO block to raise a notice.",
      solutionCode: "DO $$ BEGIN RAISE NOTICE 'Hello World'; END; $$;"
    }
  },
  {
    slug: "pg-triggers",
    title: "20. Triggers",
    order: 20,
    content: "<h2>Event-Driven Execution</h2><p>Triggers automatically execute functions when specific events (INSERT, UPDATE, DELETE) occur.</p>",
    interviewQuestions: [
      { question: "What is a BEFORE trigger?", answer: "A trigger that fires before the operation is executed, often used to modify the NEW row data." }
    ],
    practicalTask: {
      scenario: "Auto-updating an updated_at timestamp.",
      task: "Create a trigger to update a timestamp before update.",
      solutionCode: "CREATE TRIGGER set_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_func();"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 4 seeded!'));
