import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-intro-architecture",
    title: "1. Introduction to PostgreSQL & Architecture",
    order: 1,
    content: "<h2>Introduction</h2><p>PostgreSQL is an advanced, enterprise-class, and open-source relational database system.</p><h2>Process Architecture</h2><p>Postgres uses a process per-connection client/server model.</p>",
    interviewQuestions: [
      { question: "What is PostgreSQL?", answer: "An open-source object-relational database management system." },
      { question: "Explain the process architecture of Postgres.", answer: "It uses a multi-process architecture with a postmaster process that forks a new backend process for each client connection." }
    ],
    practicalTask: {
      scenario: "You need to start learning about the database system.",
      task: "Check the version of PostgreSQL currently running.",
      solutionCode: "SELECT version();"
    }
  },
  {
    slug: "pg-relational-concepts",
    title: "2. Relational Concepts & Normalization",
    order: 2,
    content: "<h2>Relational Model</h2><p>Data is organized into tables (relations) with columns (attributes) and rows (tuples).</p>",
    interviewQuestions: [
      { question: "What is 3NF?", answer: "Third Normal Form ensures that all attributes are functionally dependent only on the primary key." }
    ],
    practicalTask: {
      scenario: "Designing a simple users table.",
      task: "Create a table for users with an id and name.",
      solutionCode: "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL);"
    }
  },
  {
    slug: "pg-basic-sql",
    title: "3. Basic SQL: SELECT, INSERT, UPDATE, DELETE",
    order: 3,
    content: "<h2>CRUD Operations</h2><p>The foundation of interacting with the database using standard SQL commands.</p>",
    interviewQuestions: [
      { question: "What is the difference between DELETE and TRUNCATE?", answer: "DELETE removes rows one by one and logs each, while TRUNCATE removes all rows by deallocating the pages, which is faster." }
    ],
    practicalTask: {
      scenario: "Adding data to the users table.",
      task: "Insert a new user named 'Alice'.",
      solutionCode: "INSERT INTO users (name) VALUES ('Alice');"
    }
  },
  {
    slug: "pg-filtering-data",
    title: "4. Filtering Data with WHERE",
    order: 4,
    content: "<h2>The WHERE Clause</h2><p>Filters rows returned by a query based on specified conditions.</p>",
    interviewQuestions: [
      { question: "How does the IN operator work?", answer: "It allows you to specify multiple values in a WHERE clause for matching." }
    ],
    practicalTask: {
      scenario: "Finding a specific user.",
      task: "Select the user with the name 'Alice'.",
      solutionCode: "SELECT * FROM users WHERE name = 'Alice';"
    }
  },
  {
    slug: "pg-sorting-limiting",
    title: "5. Sorting and Limiting Results",
    order: 5,
    content: "<h2>ORDER BY and LIMIT</h2><p>Use ORDER BY to sort the result set and LIMIT to restrict the number of rows returned.</p>",
    interviewQuestions: [
      { question: "How do you sort results in descending order?", answer: "By appending DESC to the column name in the ORDER BY clause." }
    ],
    practicalTask: {
      scenario: "Getting the latest 10 users.",
      task: "Select the top 10 users ordered by id descending.",
      solutionCode: "SELECT * FROM users ORDER BY id DESC LIMIT 10;"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 1 seeded!'));
