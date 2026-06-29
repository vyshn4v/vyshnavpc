import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-backup-restore",
    title: "31. Backup and Restore",
    order: 31,
    content: "<h2>pg_dump and pg_restore</h2><p>Tools for taking logical backups of your database.</p>",
    interviewQuestions: [
      { question: "What does pg_dump do?", answer: "It extracts a PostgreSQL database into a script file or an archive file." }
    ],
    practicalTask: {
      scenario: "Command line backup.",
      task: "Write a terminal command to backup a db (as a SQL string example).",
      solutionCode: "pg_dump -U user dbname > backup.sql"
    }
  },
  {
    slug: "pg-security-roles",
    title: "32. Security, Roles, and Privileges",
    order: 32,
    content: "<h2>RBAC</h2><p>PostgreSQL uses roles to represent users and groups.</p>",
    interviewQuestions: [
      { question: "What is a role?", answer: "An entity that can own database objects and have database privileges. Users are just roles with the LOGIN privilege." }
    ],
    practicalTask: {
      scenario: "Granting access.",
      task: "Grant SELECT on all tables to a role.",
      solutionCode: "GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;"
    }
  },
  {
    slug: "pg-rls",
    title: "33. Row-Level Security (RLS)",
    order: 33,
    content: "<h2>RLS</h2><p>Policies that restrict which rows a user can see or modify.</p>",
    interviewQuestions: [
      { question: "How do you enable RLS on a table?", answer: "By running ALTER TABLE table_name ENABLE ROW LEVEL SECURITY." }
    ],
    practicalTask: {
      scenario: "Enabling RLS.",
      task: "Enable RLS on the users table.",
      solutionCode: "ALTER TABLE users ENABLE ROW LEVEL SECURITY;"
    }
  },
  {
    slug: "pg-full-text-search",
    title: "34. Full-Text Search",
    order: 34,
    content: "<h2>tsvector and tsquery</h2><p>PostgreSQL provides built-in capabilities for advanced text searching.</p>",
    interviewQuestions: [
      { question: "What is a tsvector?", answer: "A data type that represents a document in a format optimized for text search (lexemes)." }
    ],
    practicalTask: {
      scenario: "Searching text.",
      task: "Convert a string to a tsvector.",
      solutionCode: "SELECT to_tsvector('english', 'The quick brown fox');"
    }
  },
  {
    slug: "pg-postgis",
    title: "35. Geospatial Data with PostGIS",
    order: 35,
    content: "<h2>PostGIS Extension</h2><p>An extension that adds support for geographic objects.</p>",
    interviewQuestions: [
      { question: "What data types does PostGIS add?", answer: "Geometry and Geography types." }
    ],
    practicalTask: {
      scenario: "Enabling the extension.",
      task: "Create the PostGIS extension.",
      solutionCode: "CREATE EXTENSION postgis;"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 7 seeded!'));
