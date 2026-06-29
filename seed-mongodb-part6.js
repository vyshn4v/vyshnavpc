import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "choosing-shard-keys",
    title: "26. Choosing Shard Keys",
    order: 26,
    content: `
      <h2>Choosing Shard Keys</h2>
      <p>A shard key is a crucial element in MongoDB sharded clusters, determining how data is distributed across shards. A poor shard key can lead to unbalanced data, hotspots, and degraded performance.</p>
      <h3>Characteristics of a Good Shard Key</h3>
      <ul>
        <li><strong>High Cardinality:</strong> The key should have a large number of possible values to ensure data can be distributed evenly.</li>
        <li><strong>Low Frequency:</strong> Any given value of the shard key should not account for a large percentage of the total data. High frequency can cause chunk sizes to exceed the limit and become indivisible.</li>
        <li><strong>Non-Monotonically Changing:</strong> A monotonically increasing (like ObjectIds or timestamps) or decreasing key causes all inserts to go to a single shard, creating a write hotspot. Hashed shard keys can help distribute such data evenly.</li>
      </ul>
      <h3>Types of Sharding</h3>
      <p><strong>Range-based Sharding:</strong> MongoDB partitions data based on ranges of shard key values. This supports efficient range queries but can cause hotspots if keys are monotonically increasing.</p>
      <p><strong>Hashed Sharding:</strong> MongoDB computes a hash of the shard key's value. This ensures an even distribution of data, mitigating the hotspot issue of monotonically changing keys, but makes range queries inefficient as they must be broadcast to all shards.</p>
      <p>Once a collection is sharded, the shard key cannot be changed, although from MongoDB 4.4 onwards, you can refine a shard key by adding a suffix field, and from 5.0, you can use the <code>reshardCollection</code> command to change the shard key entirely.</p>
    `,
    interviewQuestions: [
      {
        question: "What makes a good shard key in MongoDB?",
        answer: "A good shard key has high cardinality, low frequency of individual values, and does not change monotonically, ensuring an even distribution of data and write operations across shards without creating hotspots."
      },
      {
        question: "What is the difference between hashed and range-based sharding?",
        answer: "Range-based sharding divides data into contiguous ranges based on the shard key, which is good for range queries but can lead to hotspots. Hashed sharding hashes the key values to ensure even data distribution, ideal for write-heavy workloads but less efficient for range queries."
      }
    ],
    practicalTask: "Analyze a sample collection schema with a monotonically increasing timestamp field. Propose a hashed shard key strategy and write the command to shard the collection using that key."
  },
  {
    slug: "authentication-authorization",
    title: "27. Security: Authentication & Authorization",
    order: 27,
    content: `
      <h2>Authentication & Authorization in MongoDB</h2>
      <p>Security in MongoDB is multi-layered. The first two foundational layers are authentication (verifying who you are) and authorization (determining what you can do).</p>
      <h3>Authentication Mechanisms</h3>
      <p>MongoDB supports several authentication mechanisms:</p>
      <ul>
        <li><strong>SCRAM (Salted Challenge Response Authentication Mechanism):</strong> The default authentication method. It verifies user credentials against the user data stored in the <code>admin</code> database.</li>
        <li><strong>x.509 Certificate Authentication:</strong> Uses client certificates to authenticate, useful for machine-to-machine communication.</li>
        <li><strong>LDAP proxy authentication:</strong> Enterprise feature that delegates authentication to an LDAP server.</li>
        <li><strong>Kerberos:</strong> Enterprise feature integrating with existing Kerberos infrastructure.</li>
      </ul>
      <h3>Enabling Authentication</h3>
      <p>By default, MongoDB runs without authentication. To enable it, you must first create an administrator user, then restart the MongoDB instance with the <code>--auth</code> flag or by setting <code>security.authorization: enabled</code> in the configuration file.</p>
      <pre><code class="language-javascript">security:
  authorization: enabled</code></pre>
      <h3>Authorization</h3>
      <p>Once authenticated, a user's access to resources is governed by Authorization. MongoDB uses Role-Based Access Control (RBAC) to manage authorization, where privileges are granted to roles, and roles are assigned to users.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the default authentication mechanism in MongoDB?",
        answer: "The default authentication mechanism in MongoDB is SCRAM (Salted Challenge Response Authentication Mechanism), specifically SCRAM-SHA-1 or SCRAM-SHA-256."
      },
      {
        question: "How do you enforce authentication in a MongoDB deployment?",
        answer: "You enforce authentication by starting the mongod or mongos process with the --auth command-line option or by setting security.authorization to 'enabled' in the configuration file."
      }
    ],
    practicalTask: "Create an administrative user in the 'admin' database. Then, modify the mongod.conf file to enable authorization and restart the service."
  },
  {
    slug: "role-based-access-control",
    title: "28. Security: Role-Based Access Control (RBAC)",
    order: 28,
    content: `
      <h2>Role-Based Access Control (RBAC)</h2>
      <p>MongoDB uses Role-Based Access Control (RBAC) to govern access to a MongoDB system. Instead of assigning permissions directly to users, permissions are grouped into roles, and roles are assigned to users.</p>
      <h3>Built-in Roles</h3>
      <p>MongoDB provides several built-in roles categorized by their purpose:</p>
      <ul>
        <li><strong>Database User Roles:</strong> <code>read</code>, <code>readWrite</code></li>
        <li><strong>Database Administration Roles:</strong> <code>dbAdmin</code>, <code>dbOwner</code>, <code>userAdmin</code></li>
        <li><strong>Cluster Administration Roles:</strong> <code>clusterAdmin</code>, <code>clusterManager</code>, <code>clusterMonitor</code>, <code>hostManager</code></li>
        <li><strong>Backup and Restoration Roles:</strong> <code>backup</code>, <code>restore</code></li>
        <li><strong>All-Database Roles:</strong> <code>readAnyDatabase</code>, <code>readWriteAnyDatabase</code>, <code>userAdminAnyDatabase</code>, <code>dbAdminAnyDatabase</code></li>
        <li><strong>Superuser Roles:</strong> <code>root</code></li>
      </ul>
      <h3>User Management</h3>
      <p>You can create users and assign roles using the <code>db.createUser()</code> method.</p>
      <pre><code class="language-javascript">db.createUser({
  user: "appUser",
  pwd: passwordPrompt(), // Or a cleartext password string
  roles: [
    { role: "readWrite", db: "applicationDB" },
    { role: "read", db: "reportingDB" }
  ]
})</code></pre>
      <h3>User-Defined Roles</h3>
      <p>If the built-in roles do not meet your specific needs, you can create user-defined roles with granular privileges using the <code>db.createRole()</code> method. This allows you to restrict access down to specific collections and actions.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the principle behind Role-Based Access Control (RBAC) in MongoDB?",
        answer: "RBAC simplifies permission management by granting privileges to roles rather than directly to users. Users are then assigned one or more roles, inheriting the privileges associated with those roles."
      },
      {
        question: "Can you create custom roles in MongoDB?",
        answer: "Yes, you can create user-defined roles using the db.createRole() method to grant specific, granular privileges that are not covered by the built-in roles."
      }
    ],
    practicalTask: "Use the mongo shell to create a user named 'reportUser' who only has the 'read' role on a database named 'salesData'."
  },
  {
    slug: "encryption-at-rest-in-transit",
    title: "29. Security: Encryption at Rest & in Transit",
    order: 29,
    content: `
      <h2>Encryption at Rest & in Transit</h2>
      <p>To fully secure a MongoDB deployment, data must be protected both when it is stored on disk (at rest) and when it is moving across the network (in transit).</p>
      <h3>Encryption in Transit (TLS/SSL)</h3>
      <p>Encryption in transit protects data as it moves between clients and the database server, or between nodes in a cluster. MongoDB supports TLS (Transport Layer Security) to encrypt all network traffic.</p>
      <p>To configure TLS, you provide the MongoDB server with a TLS certificate and private key via the configuration file:</p>
      <pre><code class="language-javascript">net:
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/ssl/mongodb.pem</code></pre>
      <p>Clients must also be configured to connect using TLS, often by appending <code>tls=true</code> to the connection string.</p>
      <h3>Encryption at Rest</h3>
      <p>Encryption at rest protects data files stored on disk. If physical drives are compromised, the data remains unreadable without the encryption keys.</p>
      <ul>
        <li><strong>Volume-Level Encryption:</strong> Uses OS-level tools like BitLocker (Windows) or LUKS (Linux) to encrypt the entire disk volume.</li>
        <li><strong>WiredTiger Native Encryption (Enterprise Feature):</strong> MongoDB Enterprise Advanced provides native encryption at rest using the WiredTiger storage engine. It supports various key management strategies, including local keyfiles and integration with KMIP-compliant Key Management Providers (e.g., AWS KMS, Azure Key Vault).</li>
      </ul>
      <p>Client-Side Field Level Encryption (CSFLE) and Queryable Encryption are advanced features that allow applications to encrypt specific fields before sending them to the database, ensuring the server never sees the plaintext data.</p>
    `,
    interviewQuestions: [
      {
        question: "How do you protect data moving between a Node.js application and a MongoDB server?",
        answer: "You protect data in transit by configuring MongoDB to require TLS/SSL connections and ensuring the client application connects using TLS (e.g., by adding tls=true to the connection string)."
      },
      {
        question: "What is the difference between volume-level encryption and WiredTiger native encryption at rest?",
        answer: "Volume-level encryption is managed by the operating system and encrypts the entire disk, while WiredTiger native encryption is managed by MongoDB (Enterprise only), encrypts data at the database engine level, and integrates with external key management systems."
      }
    ],
    practicalTask: "Configure a local MongoDB instance to require TLS for all incoming connections using a self-signed certificate for testing purposes."
  },
  {
    slug: "auditing-mongodb",
    title: "30. Auditing in MongoDB",
    order: 30,
    content: `
      <h2>Auditing in MongoDB</h2>
      <p>Auditing allows administrators to track and log activities performed on the database system. This is crucial for compliance with security policies, regulatory requirements (like HIPAA or GDPR), and forensic analysis after a security incident.</p>
      <p><em>Note: System auditing is a feature of MongoDB Enterprise and MongoDB Atlas.</em></p>
      <h3>What Can Be Audited?</h3>
      <p>The auditing facility can record various events, including:</p>
      <ul>
        <li>Authentication attempts (successes and failures)</li>
        <li>Authorization failures</li>
        <li>CRUD operations (creating, reading, updating, deleting data)</li>
        <li>Schema modifications (creating/dropping collections or indexes)</li>
        <li>Role and user management operations</li>
      </ul>
      <h3>Configuring Auditing</h3>
      <p>Auditing is configured in the <code>mongod.conf</code> file or via command-line options. You can specify the output destination (syslog, console, JSON file, or BSON file) and define filters to log only specific events.</p>
      <pre><code class="language-javascript">auditLog:
  destination: file
  format: JSON
  path: /var/log/mongodb/audit.json
  filter: '{ atype: "authCheck", "param.command": { $in: [ "find", "insert", "delete", "update" ] } }'</code></pre>
      <h3>Audit Filters</h3>
      <p>Audit filters are powerful expressions that allow you to capture exactly what you need without overwhelming the log files. They use standard MongoDB query syntax to match against audit event documents.</p>
    `,
    interviewQuestions: [
      {
        question: "Why is auditing important in a database environment?",
        answer: "Auditing is important for compliance, accountability, and security analysis. It allows organizations to track who did what and when, which is essential for investigating unauthorized access or data modifications."
      },
      {
        question: "Can you configure MongoDB auditing to log only failed authentication attempts?",
        answer: "Yes, you can use audit filters in the configuration to specify exactly which events to log, such as filtering for atype: 'authenticate' where the result indicates failure."
      }
    ],
    practicalTask: "Set up a MongoDB Enterprise instance (or review the documentation) to configure an audit log that records JSON events to a file specifically for collection drop operations."
  }
];

appendTopics("mongodb", "MongoDB Database Engineering", "The definitive guide.", topics);
