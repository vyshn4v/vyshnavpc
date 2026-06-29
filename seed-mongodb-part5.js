import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "replica-sets-concepts-architecture",
    title: "21. Replica Sets: Concepts and Architecture",
    order: 21,
    content: "<h2>Replica Sets: Concepts and Architecture</h2><p>A replica set in MongoDB is a group of mongod processes that maintain the same data set. Replica sets provide redundancy and high availability, and are the basis for all production deployments. The primary node receives all write operations, while secondary nodes replicate the primary's oplog and apply operations to their data sets asynchronously. An arbiter can be used to participate in elections but does not hold data.</p>",
    interviewQuestions: [
      { question: "What is a replica set in MongoDB?", answer: "A replica set is a group of mongod instances that maintain the same data set, providing redundancy and high availability." },
      { question: "What is the role of an Arbiter in a replica set?", answer: "An Arbiter participates in elections to break ties but does not hold a copy of the data." }
    ],
    practicalTask: {
      scenario: "You need to explain the architecture of a MongoDB replica set.",
      task: "Identify the three main types of nodes in a MongoDB replica set.",
      solutionCode: "// Primary Node\n// Secondary Node\n// Arbiter Node"
    }
  },
  {
    slug: "configuring-managing-replica-sets",
    title: "22. Configuring and Managing Replica Sets",
    order: 22,
    content: "<h2>Configuring and Managing Replica Sets</h2><p>Configuring a replica set involves starting mongod instances with the --replSet option and initiating the set using the rs.initiate() method in mongosh. Managing replica sets includes adding or removing members using rs.add() and rs.remove(), checking the status with rs.status(), and reconfiguring the set with rs.reconfig(). Elections automatically determine the primary node when the current primary becomes unavailable.</p>",
    interviewQuestions: [
      { question: "How do you initiate a replica set in MongoDB?", answer: "You initiate a replica set using the rs.initiate() command in the mongo shell on one of the mongod instances." },
      { question: "Which command shows the current status of a replica set?", answer: "The rs.status() command displays the state of the replica set and its members." }
    ],
    practicalTask: {
      scenario: "You need to check the status of your replica set.",
      task: "Write the mongosh command to view the status of the replica set.",
      solutionCode: "rs.status();"
    }
  },
  {
    slug: "read-preferences-write-concerns",
    title: "23. Read Preferences & Write Concerns in Replica Sets",
    order: 23,
    content: "<h2>Read Preferences & Write Concerns in Replica Sets</h2><p>Read preferences describe how MongoDB clients route read operations to members of a replica set. Modes include primary, primaryPreferred, secondary, secondaryPreferred, and nearest. Write concerns describe the level of acknowledgment requested from MongoDB for write operations to a standalone mongod or to replica sets. Levels include w: 1 (default), w: 'majority', and w: 0.</p>",
    interviewQuestions: [
      { question: "What does the 'w: majority' write concern do?", answer: "It requests acknowledgment that write operations have propagated to the calculated majority of the data-bearing voting members in the replica set." },
      { question: "What is the default read preference in MongoDB?", answer: "The default read preference is 'primary', meaning all read operations are routed to the primary node." }
    ],
    practicalTask: {
      scenario: "You want to perform an insert operation with majority write concern.",
      task: "Write a command to insert a document with a write concern of majority.",
      solutionCode: "db.collection.insertOne({ item: 'test' }, { writeConcern: { w: 'majority' } });"
    }
  },
  {
    slug: "sharding-concepts-architecture",
    title: "24. Sharding: Concepts & Architecture",
    order: 24,
    content: "<h2>Sharding: Concepts & Architecture</h2><p>Sharding is the process of storing data records across multiple machines and is MongoDB's approach to meeting the demands of data growth and high throughput operations. A sharded cluster consists of three components: shards (store the data), mongos (query routers), and config servers (store metadata and configuration settings). Data is partitioned across shards using a shard key.</p>",
    interviewQuestions: [
      { question: "Why is sharding used in MongoDB?", answer: "Sharding is used to distribute data across multiple machines to support deployments with very large data sets and high throughput operations." },
      { question: "What are the components of a sharded cluster?", answer: "A sharded cluster consists of shards, mongos (query routers), and config servers." }
    ],
    practicalTask: {
      scenario: "You need to explain the role of mongos.",
      task: "Describe what the mongos process does in a sharded cluster.",
      solutionCode: "// The mongos acts as a query router, providing an interface between client applications and the sharded cluster."
    }
  },
  {
    slug: "configuring-sharded-clusters",
    title: "25. Configuring Sharded Clusters",
    order: 25,
    content: "<h2>Configuring Sharded Clusters</h2><p>Configuring a sharded cluster involves deploying the config server replica set, deploying the shard replica sets, starting the mongos routing processes, and adding the shards to the cluster using sh.addShard(). Once the cluster is set up, you must enable sharding for a database using sh.enableSharding() and then shard specific collections using sh.shardCollection() with a chosen shard key.</p>",
    interviewQuestions: [
      { question: "Which command adds a new shard to a cluster?", answer: "The sh.addShard() command is used to add a new shard to a sharded cluster." },
      { question: "How do you enable sharding on a specific collection?", answer: "You use the sh.shardCollection() command, specifying the collection namespace and the shard key." }
    ],
    practicalTask: {
      scenario: "You want to shard the 'users' collection in the 'app' database on the 'userId' field.",
      task: "Write the command to shard the 'app.users' collection.",
      solutionCode: "sh.shardCollection('app.users', { userId: 1 });"
    }
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
