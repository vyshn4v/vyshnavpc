import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "mongodb-intro",
    title: "1. Introduction to MongoDB & NoSQL",
    order: 1,
    content: "<h2>Introduction to MongoDB</h2><p>MongoDB is a popular open-source NoSQL database that stores data in flexible, JSON-like documents. Unlike relational databases that use tables and rows, MongoDB uses collections and documents. This allows for dynamic schemas, meaning documents in the same collection do not need to have the same set of fields or structure.</p>",
    interviewQuestions: [
      { question: "What is NoSQL and how does MongoDB fit into this category?", answer: "NoSQL refers to a wide variety of database technologies that differ from the traditional RDBMS. MongoDB is a document-based NoSQL database, storing data as BSON (Binary JSON) documents." },
      { question: "Why would you choose MongoDB over a relational database?", answer: "MongoDB is chosen for its flexible schema, scalability (horizontal scaling via sharding), high performance, and ease of use with modern object-oriented programming languages." }
    ],
    practicalTask: {
      scenario: "Explain the difference between a table and a collection.",
      task: "Describe the SQL to MongoDB mapping for database, table, row, and column.",
      solutionCode: "Database -> Database\nTable -> Collection\nRow -> Document\nColumn -> Field"
    }
  },
  {
    slug: "mongodb-architecture",
    title: "2. MongoDB Architecture and Components",
    order: 2,
    content: "<h2>MongoDB Architecture</h2><p>MongoDB's architecture consists of several key components: the database itself, collections (which hold documents), and documents (the basic unit of data). Under the hood, MongoDB uses the WiredTiger storage engine. It also supports replica sets for high availability and sharding for horizontal scalability.</p>",
    interviewQuestions: [
      { question: "What is a Replica Set in MongoDB?", answer: "A replica set is a group of mongod processes that maintain the same data set. It provides redundancy and high availability, which are the basis for all production deployments." },
      { question: "What is the role of the storage engine in MongoDB?", answer: "The storage engine is the component of the database that is responsible for managing how data is stored, both in memory and on disk. The default is WiredTiger." }
    ],
    practicalTask: {
      scenario: "Identify the primary components of MongoDB.",
      task: "Start a MongoDB server instance from the command line.",
      solutionCode: "mongod --dbpath /var/lib/mongodb"
    }
  },
  {
    slug: "mongodb-installation",
    title: "3. Installing & Configuring MongoDB",
    order: 3,
    content: "<h2>Installing MongoDB</h2><p>MongoDB can be installed on various operating systems including Windows, macOS, and Linux. For local development, MongoDB Community Edition is typically used. Alternatively, MongoDB Atlas provides a fully managed cloud database service. Configuration is handled via the `mongod.conf` file, where settings like port, dbpath, and security are defined.</p>",
    interviewQuestions: [
      { question: "What is the default port for MongoDB?", answer: "The default port for a mongod or mongos instance is 27017." },
      { question: "How do you connect to a MongoDB server using the command line?", answer: "You use the `mongosh` (MongoDB Shell) command to connect to a running MongoDB instance." }
    ],
    practicalTask: {
      scenario: "Connect to your local MongoDB instance.",
      task: "Launch the MongoDB shell and show existing databases.",
      solutionCode: "mongosh\n> show dbs"
    }
  },
  {
    slug: "mongodb-data-models",
    title: "4. MongoDB Data Models & Schema Design",
    order: 4,
    content: "<h2>Schema Design</h2><p>Schema design in MongoDB revolves around the decision to embed or reference data. Embedded data models (denormalized) store related data in a single document, providing fast read performance. Normalized data models use references (like foreign keys) to link documents. The choice depends on data access patterns and relationship types (e.g., 1:1, 1:N, N:M).</p>",
    interviewQuestions: [
      { question: "When should you embed documents vs reference them?", answer: "Embed when you have 'contains' relationships or when data is frequently accessed together. Reference when embedding would result in unbounded document growth or duplication of data that changes frequently." },
      { question: "What is the maximum size of a BSON document in MongoDB?", answer: "The maximum BSON document size is 16 megabytes." }
    ],
    practicalTask: {
      scenario: "Design a simple schema for a blog post with comments.",
      task: "Create a JSON document representing a blog post with an embedded array of comments.",
      solutionCode: "{\n  title: 'My Post',\n  author: 'John',\n  comments: [\n    { text: 'Great read!', user: 'Alice' },\n    { text: 'Thanks.', user: 'Bob' }\n  ]\n}"
    }
  },
  {
    slug: "mongodb-connecting-apps",
    title: "5. Connecting to MongoDB from Applications",
    order: 5,
    content: "<h2>Connecting Drivers</h2><p>MongoDB provides official drivers for major programming languages (Node.js, Python, Java, etc.). In the Node.js ecosystem, you can use the native `mongodb` driver or an ODM (Object Data Modeling) library like Mongoose. The connection string URI format is used to connect, e.g., `mongodb://localhost:27017/myDatabase`.</p>",
    interviewQuestions: [
      { question: "What is Mongoose?", answer: "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straight-forward, schema-based solution to model your application data." },
      { question: "Explain the components of a MongoDB connection string.", answer: "It includes the protocol (`mongodb://` or `mongodb+srv://`), credentials (username:password), hosts (and ports), and options (like authSource or replicaSet)." }
    ],
    practicalTask: {
      scenario: "Connect to MongoDB using Node.js.",
      task: "Write a simple script using the native mongodb driver to connect to localhost.",
      solutionCode: "const { MongoClient } = require('mongodb');\nconst client = new MongoClient('mongodb://localhost:27017');\nawait client.connect();\nconsole.log('Connected!');"
    }
  }
];

appendTopics("mongodb", "MongoDB", "Comprehensive guide to MongoDB.", topics);
