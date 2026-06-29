import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "pg-fdw",
    title: "36. Foreign Data Wrappers (FDW)",
    order: 36,
    content: "<h2>postgres_fdw</h2><p>Allows accessing tables from a remote PostgreSQL server (or other DBs) as if they were local.</p>",
    interviewQuestions: [
      { question: "What is an FDW?", answer: "Foreign Data Wrapper, a standard to allow Postgres to query external data sources." }
    ],
    practicalTask: {
      scenario: "Enabling foreign tables.",
      task: "Create the postgres_fdw extension.",
      solutionCode: "CREATE EXTENSION postgres_fdw;"
    }
  },
  {
    slug: "pg-pgbouncer",
    title: "37. Connection Pooling with pgBouncer",
    order: 37,
    content: "<h2>Connection Pooling</h2><p>Since Postgres creates a process per connection, connection poolers like pgBouncer multiplex client connections.</p>",
    interviewQuestions: [
      { question: "What is transaction pooling mode in pgBouncer?", answer: "It assigns a server connection to a client for the duration of a single transaction." }
    ],
    practicalTask: {
      scenario: "Checking active connections.",
      task: "Count active connections in Postgres.",
      solutionCode: "SELECT count(*) FROM pg_stat_activity;"
    }
  },
  {
    slug: "pg-logical-replication",
    title: "38. Logical Replication",
    order: 38,
    content: "<h2>Pub/Sub Replication</h2><p>Logical replication copies data modifications based on their replication identity (publishers and subscribers).</p>",
    interviewQuestions: [
      { question: "What is the difference between physical and logical replication?", answer: "Physical replicates blocks/files and the entire cluster, while logical replicates data changes (rows) and allows replicating specific tables." }
    ],
    practicalTask: {
      scenario: "Creating a publisher.",
      task: "Create a publication for all tables.",
      solutionCode: "CREATE PUBLICATION mypub FOR ALL TABLES;"
    }
  },
  {
    slug: "pg-design-patterns",
    title: "39. Database Design Patterns",
    order: 39,
    content: "<h2>Schema Design</h2><p>Best practices for designing scalable, maintainable schemas.</p>",
    interviewQuestions: [
      { question: "What is the Entity-Attribute-Value (EAV) pattern?", answer: "A data model to describe entities where the number of attributes is vast, but the number that will actually apply to a given entity is relatively modest. (Often discouraged in relational DBs in favor of JSONB)." }
    ],
    practicalTask: {
      scenario: "Documenting your schema.",
      task: "Add a comment to a table.",
      solutionCode: "COMMENT ON TABLE users IS 'Table storing user accounts.';"
    }
  },
  {
    slug: "pg-scaling",
    title: "40. Scaling PostgreSQL",
    order: 40,
    content: "<h2>Sharding and Scaling</h2><p>Techniques like read replicas, Citus (sharding), and connection pooling to handle massive traffic.</p>",
    interviewQuestions: [
      { question: "What is Citus?", answer: "An extension that transforms Postgres into a distributed database, scaling out across multiple nodes." }
    ],
    practicalTask: {
      scenario: "Checking table size.",
      task: "Get the physical size of a table.",
      solutionCode: "SELECT pg_size_pretty(pg_total_relation_size('users'));"
    }
  }
];

appendTopics("postgres", "PostgreSQL Database Engineering", "The definitive guide.", topics).then(() => console.log('Part 8 seeded!'));
