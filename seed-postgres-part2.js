import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-joins",
    title: "6. Mastering JOINs",
    order: 6,
    content: "<h2>JOIN Types</h2><p>INNER, LEFT, RIGHT, FULL OUTER, and CROSS joins are used to combine rows from two or more tables.</p>",
    interviewQuestions: [
      { question: "What is an INNER JOIN?", answer: "It returns records that have matching values in both tables." },
      { question: "What happens in a CROSS JOIN?", answer: "It returns the Cartesian product of the two tables." }
    ],
    practicalTask: {
      scenario: "Linking users to their posts.",
      task: "Write a query to join users and posts tables on user_id.",
      solutionCode: "SELECT users.name, posts.title FROM users INNER JOIN posts ON users.id = posts.user_id;"
    }
  },
  {
    slug: "pg-aggregations",
    title: "7. Aggregations and GROUP BY",
    order: 7,
    content: "<h2>Aggregate Functions</h2><p>Functions like COUNT, SUM, AVG, MAX, MIN paired with GROUP BY.</p>",
    interviewQuestions: [
      { question: "What is the difference between WHERE and HAVING?", answer: "WHERE filters rows before aggregation, while HAVING filters groups after aggregation." }
    ],
    practicalTask: {
      scenario: "Counting user posts.",
      task: "Count the number of posts per user.",
      solutionCode: "SELECT user_id, COUNT(*) FROM posts GROUP BY user_id;"
    }
  },
  {
    slug: "pg-subqueries",
    title: "8. Subqueries and Nested Selects",
    order: 8,
    content: "<h2>Subqueries</h2><p>A query nested inside another query.</p>",
    interviewQuestions: [
      { question: "What is a correlated subquery?", answer: "A subquery that uses values from the outer query, meaning it must be evaluated once for each row processed by the outer query." }
    ],
    practicalTask: {
      scenario: "Find users with more than 5 posts.",
      task: "Use a subquery to find these users.",
      solutionCode: "SELECT name FROM users WHERE id IN (SELECT user_id FROM posts GROUP BY user_id HAVING COUNT(*) > 5);"
    }
  },
  {
    slug: "pg-ctes",
    title: "9. Common Table Expressions (CTEs)",
    order: 9,
    content: "<h2>WITH Clause</h2><p>CTEs provide a way to write auxiliary statements for use in a larger query.</p>",
    interviewQuestions: [
      { question: "What are the benefits of using CTEs?", answer: "They improve readability and can be used to perform recursive queries." }
    ],
    practicalTask: {
      scenario: "Simplifying a complex query.",
      task: "Write a simple CTE that selects all users, then select from it.",
      solutionCode: "WITH all_users AS (SELECT * FROM users) SELECT * FROM all_users;"
    }
  },
  {
    slug: "pg-basic-datatypes",
    title: "10. Basic Data Types",
    order: 10,
    content: "<h2>Integers, Strings, and Booleans</h2><p>PostgreSQL has a rich set of native data types available to users.</p>",
    interviewQuestions: [
      { question: "What is the difference between VARCHAR and TEXT?", answer: "Under the hood, they are the same in PostgreSQL, but VARCHAR can have a length limit enforced." }
    ],
    practicalTask: {
      scenario: "Creating a table with various types.",
      task: "Create a products table with integer, numeric, and boolean columns.",
      solutionCode: "CREATE TABLE products (id SERIAL, price NUMERIC(10,2), is_active BOOLEAN);"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 2 seeded!'));
