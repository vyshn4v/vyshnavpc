import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "mongodb-backup-and-restore",
    title: "31. MongoDB Backup & Restore (mongodump, mongorestore)",
    order: 31,
    content: "<h2>MongoDB Backup & Restore</h2><p>Proper database backup and restoration are critical for disaster recovery and migrating data. MongoDB provides tools like <code>mongodump</code> and <code>mongorestore</code> to handle BSON data backups.</p><h3>mongodump</h3><p><code>mongodump</code> is a utility that creates a binary export of a database's contents. It can export data from a standalone instance, replica set, or sharded cluster.</p><h3>mongorestore</h3><p><code>mongorestore</code> reads binary database dumps produced by <code>mongodump</code> and restores the data to a MongoDB database.</p>",
    interviewQuestions: [
      { question: "What is the difference between mongodump and a file system snapshot?", answer: "mongodump creates BSON files by querying the database, while a file system snapshot copies the underlying data files directly from the disk, which is faster but requires volume-level support." },
      { question: "How do you restore a specific collection using mongorestore?", answer: "You can use the --nsInclude option or specify the path to the specific collection's BSON file directly in the command." }
    ],
    practicalTask: {
      scenario: "You need to back up a specific database and restore it to another instance.",
      task: "Write the command to backup the 'sales' database using mongodump.",
      solutionCode: "mongodump --db=sales --out=/backups/"
    }
  },
  {
    slug: "monitoring-and-profiling",
    title: "32. Monitoring and Profiling (mongostat, mongotop, Database Profiler)",
    order: 32,
    content: "<h2>Monitoring and Profiling in MongoDB</h2><p>Monitoring the performance of your database is essential for identifying bottlenecks. MongoDB provides <code>mongostat</code>, <code>mongotop</code>, and the Database Profiler.</p><h3>mongostat & mongotop</h3><p><code>mongostat</code> provides a quick overview of the status of a currently running mongod or mongos instance, tracking operations per second. <code>mongotop</code> tracks and reports the current read and write activity of a MongoDB instance on a per-collection basis.</p><h3>Database Profiler</h3><p>The Database Profiler collects detailed information about database commands executed against a mongod instance. It can be configured to log slow queries or all queries.</p>",
    interviewQuestions: [
      { question: "What does mongotop measure?", answer: "It tracks and reports the amount of time MongoDB spends reading and writing data, broken down on a per-collection basis." },
      { question: "How do you enable the database profiler for slow queries?", answer: "By setting the profiling level to 1 using db.setProfilingLevel(1, { slowms: 100 }), which logs operations taking longer than 100 milliseconds." }
    ],
    practicalTask: {
      scenario: "You need to monitor database performance to identify slow operations.",
      task: "Write the command to enable profiling for operations taking longer than 50ms.",
      solutionCode: "db.setProfilingLevel(1, { slowms: 50 });"
    }
  },
  {
    slug: "mongodb-atlas-cloud",
    title: "33. MongoDB Atlas: Cloud Database Management",
    order: 33,
    content: "<h2>MongoDB Atlas</h2><p>MongoDB Atlas is the fully managed cloud database service developed by the creators of MongoDB. It simplifies deploying, managing, and scaling MongoDB databases across multiple cloud providers like AWS, Azure, and Google Cloud Platform.</p><h3>Key Features</h3><ul><li>Automated patching, updates, and backups.</li><li>Built-in monitoring, alerting, and performance optimization suggestions.</li><li>Global clusters for multi-region and multi-cloud availability.</li><li>Enterprise-grade security including network isolation, VPC peering, and encryption.</li></ul>",
    interviewQuestions: [
      { question: "What are some benefits of using MongoDB Atlas?", answer: "It provides automated patching, continuous backups, real-time monitoring, and automatic scaling without the need to manage the underlying infrastructure." },
      { question: "How does MongoDB Atlas handle network security?", answer: "It handles security through IP whitelisting, VPC peering, and services like AWS PrivateLink or Azure Private Link to ensure secure, private connections." }
    ],
    practicalTask: {
      scenario: "Connecting an application securely to a cloud database.",
      task: "Write a standard connection string used to connect to a MongoDB Atlas cluster.",
      solutionCode: "mongodb+srv://<username>:<password>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority"
    }
  },
  {
    slug: "mongodb-compass-gui-tools",
    title: "34. MongoDB Compass & GUI Tools",
    order: 34,
    content: "<h2>MongoDB Compass</h2><p>MongoDB Compass is the official graphical user interface (GUI) for MongoDB. It allows users to visually explore their data, interact with databases, and optimize queries without requiring command-line syntax.</p><h3>Features for Developers and DBAs</h3><p>Compass includes a robust Aggregation Pipeline Builder, visual explain plans for query optimization, and a Schema visualization tab to analyze data distribution, types, and outliers. It serves as an excellent companion tool to the mongosh CLI.</p>",
    interviewQuestions: [
      { question: "What is the primary use of the Aggregation Pipeline Builder in MongoDB Compass?", answer: "It allows developers to build complex aggregation pipelines stage-by-stage and instantly preview the resulting documents at each stage." },
      { question: "How does Compass assist with query optimization?", answer: "It provides visual explain plans that highlight index usage, execution time, and number of scanned documents, making it easier to identify performance issues." }
    ],
    practicalTask: {
      scenario: "You want to visually analyze the schema of a collection.",
      task: "Explain the purpose of the Schema tab in MongoDB Compass.",
      solutionCode: "The Schema tab automatically samples documents in a collection and visualizes their data types, value distribution, and potential outliers."
    }
  },
  {
    slug: "advanced-queries-geospatial-text-search",
    title: "35. Advanced Queries: Geospatial and Full-Text Search",
    order: 35,
    content: "<h2>Advanced Query Capabilities</h2><p>MongoDB offers specialized indexes and query operators to support complex search requirements.</p><h3>Geospatial Queries</h3><p>By creating a <code>2dsphere</code> index, you can store GeoJSON objects and execute geospatial queries like finding points within a polygon or finding the nearest locations using operators like <code>$near</code> and <code>$geoWithin</code>.</p><h3>Full-Text Search</h3><p>MongoDB supports text search capabilities. By creating a text index on string fields, you can use the <code>$text</code> operator to search for words or phrases, supporting stemming and language-specific stop words.</p>",
    interviewQuestions: [
      { question: "What type of index is required for a $near geospatial query?", answer: "A 2dsphere index (for spherical geometry) or a 2d index (for flat geometry) must be present on the location field." },
      { question: "How do you perform a text search on a collection?", answer: "First, create a text index on the desired string fields, then use the $text operator in your query, for example: db.collection.find({ $text: { $search: \"keyword\" } })." }
    ],
    practicalTask: {
      scenario: "You need to find nearby locations for a user.",
      task: "Write a query to find documents within 1000 meters of a given GeoJSON point.",
      solutionCode: "db.places.find({\n  location: {\n    $near: {\n      $geometry: { type: \"Point\", coordinates: [ -73.9667, 40.78 ] },\n      $maxDistance: 1000\n    }\n  }\n});"
    }
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
