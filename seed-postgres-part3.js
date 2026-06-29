import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-advanced-datatypes",
    title: "11. Advanced Data Types (Array, UUID)",
    order: 11,
    content: "<h2>Arrays and UUIDs</h2><p>Postgres natively supports arrays of any built-in or user-defined type.</p>",
    interviewQuestions: [
      { question: "Why use UUIDs over SERIAL?", answer: "UUIDs are globally unique, making them ideal for distributed systems, though they consume more space." }
    ],
    practicalTask: {
      scenario: "Store multiple tags for a post.",
      task: "Create a table with an array column for tags.",
      solutionCode: "CREATE TABLE articles (id SERIAL, tags TEXT[]);"
    }
  },
  {
    slug: "pg-jsonb",
    title: "12. JSON and JSONB",
    order: 12,
    content: "<h2>JSONB</h2><p>JSONB stores data in a decomposed binary format, allowing for indexing and fast retrieval.</p>",
    interviewQuestions: [
      { question: "What is the difference between JSON and JSONB?", answer: "JSON stores an exact copy of the input text, while JSONB stores it in a parsed binary format, making it slower to insert but much faster to process." }
    ],
    practicalTask: {
      scenario: "Storing unstructured profile data.",
      task: "Insert a JSONB record.",
      solutionCode: "INSERT INTO users (profile) VALUES ('{\"age\": 30, \"theme\": \"dark\"}'::jsonb);"
    }
  },
  {
    slug: "pg-indexing-basics",
    title: "13. Indexing Basics",
    order: 13,
    content: "<h2>B-Tree Indexes</h2><p>Indexes are crucial for database performance. B-Tree is the default index type.</p>",
    interviewQuestions: [
      { question: "What is an index?", answer: "A data structure that improves the speed of data retrieval operations on a database table." }
    ],
    practicalTask: {
      scenario: "Speeding up user lookups by email.",
      task: "Create an index on the email column.",
      solutionCode: "CREATE INDEX idx_users_email ON users(email);"
    }
  },
  {
    slug: "pg-index-types",
    title: "14. Advanced Index Types (GIN, GiST, BRIN)",
    order: 14,
    content: "<h2>GIN and GiST</h2><p>GIN is perfect for JSONB, arrays, and full-text search. BRIN is good for very large, naturally ordered tables.</p>",
    interviewQuestions: [
      { question: "When should you use a GIN index?", answer: "When indexing composite types like arrays or JSONB documents." }
    ],
    practicalTask: {
      scenario: "Indexing a JSONB column.",
      task: "Create a GIN index on a JSONB column.",
      solutionCode: "CREATE INDEX idx_users_profile ON users USING GIN (profile);"
    }
  },
  {
    slug: "pg-constraints",
    title: "15. Database Constraints",
    order: 15,
    content: "<h2>Data Integrity</h2><p>UNIQUE, NOT NULL, CHECK, and FOREIGN KEY constraints ensure data validity.</p>",
    interviewQuestions: [
      { question: "What is a CHECK constraint?", answer: "It ensures that all values in a column satisfy a specific boolean expression." }
    ],
    practicalTask: {
      scenario: "Ensuring age is positive.",
      task: "Add a check constraint for age > 0.",
      solutionCode: "ALTER TABLE users ADD CONSTRAINT check_age CHECK (age > 0);"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 3 seeded!'));
