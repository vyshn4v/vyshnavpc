import { insertRound } from './insertRound.js';

const roundData = {
  roundId: 'round-5',
  roundName: 'Round 5: System Design & Architecture',
  order: 5,
  description: 'Deep dive into system design, scalability, microservices, Docker, Kubernetes, Nginx, and cloud deployments. Focused on scaling Domain Scanner and Neutrinos APIs to millions of users.',
  categories: [
    {
      categoryName: 'High-Level Architecture',
      questions: [
        {
          difficulty: 'Medium',
          question: 'For the Domain Scanner project, you used React, Node.js, PostgreSQL, Redis, and RabbitMQ. Can you walk me through the high-level architecture and how these components interact when a user submits a domain to be scanned?',
          expectedAnswer: 'The user submits a domain via React frontend. The Node/Express API receives the request and pushes a scan task to a RabbitMQ queue. An asynchronous worker consumes the message, performs the scan, stores results in PostgreSQL, and caches them in Redis. The frontend can either poll or use WebSockets/SSE to get the updated status.',
          redFlags: ['Cannot clearly articulate the data flow', 'Misunderstands the role of RabbitMQ as a message broker'],
          bonusPoints: ['Mentions using WebSockets or Server-Sent Events (SSE) for real-time updates', 'Discusses API Gateway pattern']
        },
        {
          difficulty: 'Hard',
          question: 'If you were to scale Domain Scanner to handle 1 million domain scans per day, what architectural bottlenecks would you anticipate, and how would you redesign the system to handle this load?',
          expectedAnswer: 'Bottlenecks could be the API servers, RabbitMQ queue buildup, worker node capacity, and PostgreSQL connection limits. Redesign includes horizontally scaling API and worker nodes, implementing database connection pooling (e.g., PgBouncer), partitioning/sharding the PostgreSQL database, and using a distributed cache cluster.',
          redFlags: ['Suggests only vertical scaling', 'Ignores database scaling challenges'],
          bonusPoints: ['Discusses read replicas for reports', 'Mentions rate limiting and circuit breakers']
        },
        {
          difficulty: 'Hard',
          question: 'At Neutrinos, you engineered 15+ RESTful APIs using Node.js and Strapi CMS. How would you transition this potentially monolithic backend into a microservices architecture? What criteria would you use to define service boundaries?',
          expectedAnswer: 'Would use Domain-Driven Design (DDD) to identify bounded contexts (e.g., Policy Generation, User Management, Decision Engine). Each microservice would have its own database to ensure loose coupling. Would introduce an API Gateway for routing and authentication, and use asynchronous communication (e.g., Kafka/RabbitMQ) between services.',
          redFlags: ['Creates distributed monoliths (tightly coupled microservices)', 'Shares a single database across all microservices without justification'],
          bonusPoints: ['Discusses saga pattern for distributed transactions', 'Mentions observability (tracing, logging) challenges in microservices']
        },
        {
          difficulty: 'Medium',
          question: 'In your Domain Scanner, you integrated an SSO-based authentication framework. How does SSO work at a high level, and how would you design it to be secure and scalable across multiple microservices?',
          expectedAnswer: 'SSO involves an Identity Provider (IdP) and Service Providers (SP). Uses protocols like OAuth2.0 or OIDC. Upon login, IdP issues a JWT. Microservices can verify the JWT signature using the IdP public key without calling the IdP for every request, ensuring scalability. Token expiration and refresh token mechanisms are essential for security.',
          redFlags: ['Stateful session management across microservices', 'Lack of understanding of JWT structure and validation'],
          bonusPoints: ['Mentions jwks_uri for dynamic key rotation', 'Discusses token revocation strategies (e.g., short-lived tokens, Redis blacklist)']
        },
        {
          difficulty: 'Expert',
          question: 'Design a system for the "dynamic, stage-based decision API" you built at Neutrinos, assuming it needs to handle 10,000 requests per second with sub-50ms latency. How do you store and evaluate the complex state logic at this scale?',
          expectedAnswer: 'Use an in-memory data grid or fast key-value store like Redis for active states. Rules/logic can be pre-compiled or cached locally in the application memory. Use a distributed rule engine. For persistence, asynchronously write state changes to a highly available database (e.g., Cassandra or MongoDB) via a message queue.',
          redFlags: ['Relies solely on synchronous relational database queries for rule evaluation', 'Does not address latency constraints'],
          bonusPoints: ['Mentions event sourcing pattern', 'Discusses local caching with invalidation strategies']
        }
      ]
    },
    {
      categoryName: 'Scalability & Load Balancing',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You mentioned using Nginx in your Domain Scanner project. How would you configure Nginx to act as a load balancer for multiple Node.js backend instances, and what load balancing algorithms would you consider?',
          expectedAnswer: 'Configure an `upstream` block in Nginx with the IP addresses/ports of the Node.js instances. Use `proxy_pass` to route traffic to the upstream. Algorithms include Round Robin (default), Least Connections (good for varied response times), and IP Hash (for session persistence).',
          redFlags: ['Cannot explain basic Nginx reverse proxy configuration', 'Confuses Nginx with an application server'],
          bonusPoints: ['Mentions active health checks in Nginx Plus or using third-party modules', 'Discusses SSL termination at the Nginx layer']
        },
        {
          difficulty: 'Hard',
          question: 'Your Neutrinos APIs handle core insurance workflows. If there is a massive sudden spike in traffic (e.g., end-of-year policy renewals), how would you auto-scale the application to ensure zero downtime?',
          expectedAnswer: 'Implement autoscaling groups (AWS ASG or K8s HPA). Use metrics like CPU utilization or request queue length to trigger scaling. Ensure applications are stateless so any instance can handle any request. Over-provision slightly to handle the delay in spinning up new instances (pre-warming).',
          redFlags: ['Stateful applications preventing horizontal scaling', 'Lack of monitoring/alerting strategy for the spike'],
          bonusPoints: ['Discusses predictive autoscaling', 'Mentions queue-based load leveling using RabbitMQ to protect downstream systems']
        },
        {
          difficulty: 'Hard',
          question: 'For Domain Scanner, you used Redis for high-speed caching. If the dataset grows beyond the RAM capacity of a single Redis node, how do you scale Redis, and what are the trade-offs of the different approaches?',
          expectedAnswer: 'Can use Redis Cluster for automatic data sharding across multiple nodes, allowing horizontal scaling of memory and throughput. Alternatively, use client-side sharding or a proxy like Twemproxy. Trade-offs: Redis Cluster introduces complexity in operations and some commands (multi-key operations) are restricted.',
          redFlags: ['Suggests swapping to disk as a primary strategy', 'Unaware of Redis Cluster'],
          bonusPoints: ['Mentions Redis Sentinel for high availability', 'Discusses cache eviction policies (e.g., LRU, LFU) to manage memory']
        },
        {
          difficulty: 'Medium',
          question: 'How do you handle database read scalability in PostgreSQL for the Domain Scanner, especially when users are frequently querying their past security reports?',
          expectedAnswer: 'Implement Read Replicas (Master-Slave architecture). Direct all write operations to the Master node and distribute read queries (like fetching reports) across the Read Replicas. Use connection pooling (PgBouncer) to efficiently manage database connections from the application.',
          redFlags: ['Directs all traffic to a single database instance', 'Does not understand replication lag'],
          bonusPoints: ['Discusses logical vs physical replication', 'Mentions CQRS (Command Query Responsibility Segregation) pattern']
        },
        {
          difficulty: 'Expert',
          question: 'In a microservices architecture, how would you design global load balancing to route users to the nearest geographical data center (AWS/GCP), and how do you handle data synchronization between these regions?',
          expectedAnswer: 'Use DNS-based routing (e.g., AWS Route 53) with latency-based or geolocation routing policies. For data sync, use asynchronous cross-region replication provided by the database (e.g., AWS Aurora Global Database, DynamoDB Global Tables, or CockroachDB). Acknowledge eventual consistency and design the application to handle it.',
          redFlags: ['Proposes synchronous cross-region database writes (massive latency)', 'Ignores data sovereignty and compliance laws'],
          bonusPoints: ['Mentions active-active vs active-passive architectures', 'Discusses handling split-brain scenarios']
        }
      ]
    },
    {
      categoryName: 'Deployment & Orchestration (K8s/Docker)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'How would you write a Dockerfile for the Node.js backend of the Domain Scanner to ensure the resulting image is secure and minimal in size?',
          expectedAnswer: 'Use a minimal base image (e.g., `node:alpine` or distroless). Use multi-stage builds to separate build dependencies from the runtime environment. Do not run the application as the root user (create a specific user). Use `.dockerignore` to exclude unnecessary files like `node_modules` from the build context.',
          redFlags: ['Runs application as root', 'Copies entire working directory without `.dockerignore`'],
          bonusPoints: ['Mentions scanning images for vulnerabilities (e.g., Trivy)', 'Discusses caching `npm install` layer for faster builds']
        },
        {
          difficulty: 'Hard',
          question: 'You want to deploy the Domain Scanner application (Frontend, Backend, Postgres, Redis, RabbitMQ) to Kubernetes. Can you explain the K8s resources you would use to manage these components?',
          expectedAnswer: 'Use `Deployments` for stateless Frontend and Backend to manage replicasets and rolling updates. Use `StatefulSets` for Postgres, Redis, and RabbitMQ to guarantee persistent storage (via `PersistentVolumeClaims`) and stable network identifiers. Use `Services` (ClusterIP) for internal communication and an `Ingress` controller (like Nginx Ingress) to expose the frontend to the outside world.',
          redFlags: ['Uses Deployments for stateful databases without understanding data loss risks', 'Exposes databases directly to the public internet'],
          bonusPoints: ['Mentions Helm charts for packaging the application', 'Discusses `ConfigMaps` and `Secrets` for configuration management']
        },
        {
          difficulty: 'Hard',
          question: 'How do you achieve Zero Downtime Deployments in Kubernetes for the Neutrinos APIs, and how do you handle database schema migrations during this process?',
          expectedAnswer: 'Use Kubernetes Rolling Updates (default for Deployments) with proper Readiness and Liveness probes to ensure new pods are healthy before terminating old ones. For database migrations, decouple schema changes from code deployments. Apply additive database changes first (e.g., add new column), deploy new code that uses it, then remove old code, and finally drop the old column (Expand and Contract pattern).',
          redFlags: ['Causes downtime during deployments', 'Applies breaking database changes synchronously with code deployment'],
          bonusPoints: ['Mentions Canary deployments or Blue-Green deployments', 'Discusses using tools like Flyway or Liquibase for migrations']
        },
        {
          difficulty: 'Medium',
          question: 'In a Kubernetes cluster, how do you manage and inject sensitive configuration like database passwords and API keys into your Node.js pods securely?',
          expectedAnswer: 'Use Kubernetes `Secrets`. Store the sensitive data as base64 encoded strings in the Secret object. Mount the Secret into the pod either as environment variables or as a volume (files). For higher security, integrate with an external secret management system like HashiCorp Vault or AWS Secrets Manager.',
          redFlags: ['Hardcodes secrets in the Docker image or source code', 'Stores secrets in plain text ConfigMaps'],
          bonusPoints: ['Mentions RBAC to restrict access to Secrets', 'Discusses tools like External Secrets Operator']
        },
        {
          difficulty: 'Expert',
          question: 'Imagine a scenario where one of your K8s worker nodes running RabbitMQ crashes. How does Kubernetes handle this, and what do you need to configure in RabbitMQ and K8s to ensure message availability?',
          expectedAnswer: 'K8s will detect the node failure and reschedule the RabbitMQ pod to a healthy node (if using a StatefulSet). To ensure message availability, RabbitMQ must be configured in a cluster with Quorum Queues or Mirrored Queues to replicate messages across nodes. Persistent Volumes must be backed by a distributed storage system (e.g., EBS/Ceph) so the new pod can attach to the existing data.',
          redFlags: ['Believes K8s alone guarantees data availability without application-level replication', 'Uses local node storage (hostPath) for stateful applications'],
          bonusPoints: ['Mentions Pod Anti-Affinity rules to ensure RabbitMQ replicas are not on the same physical node', 'Discusses split-brain resolution in RabbitMQ']
        }
      ]
    },
    {
      categoryName: 'Fault Tolerance',
      questions: [
        {
          difficulty: 'Medium',
          question: 'In Domain Scanner, if the background worker processing the domain scan crashes mid-process, what happens to the RabbitMQ message, and how do you ensure the scan is not lost?',
          expectedAnswer: 'Disable RabbitMQ auto-acknowledgment. The worker should only send an ACK (`channel.ack()`) after the scan is fully complete and saved to the database. If the worker crashes, the connection drops, and RabbitMQ will re-queue the unacknowledged message to be processed by another available worker.',
          redFlags: ['Uses auto-ack for critical tasks', 'Loses data upon worker crash'],
          bonusPoints: ['Mentions Dead Letter Exchanges (DLX) for messages that fail repeatedly', 'Discusses idempotency in workers']
        },
        {
          difficulty: 'Hard',
          question: 'You integrated Razorpay for subscriptions in Domain Scanner. Network requests to payment gateways can fail. How do you implement robust retry logic and ensure you don\'t accidentally double-charge a user?',
          expectedAnswer: 'Implement exponential backoff and jitter for retries. Crucially, design the API to be idempotent. Generate a unique idempotency key (e.g., UUID) on the frontend for the payment intent and send it in the header. The backend checks if a transaction with that key has already been processed before initiating a new charge with Razorpay.',
          redFlags: ['Retries immediately without delay', 'Lacks idempotency, leading to duplicate charges'],
          bonusPoints: ['Mentions saving the intent state in the DB before calling the external API', 'Discusses Circuit Breaker pattern if Razorpay is completely down']
        },
        {
          difficulty: 'Hard',
          question: 'In a microservices environment, one of your downstream services (e.g., Policy Generation API) becomes extremely slow, causing upstream services to hang and exhaust their connection pools. How do you prevent this cascading failure?',
          expectedAnswer: 'Implement the Circuit Breaker pattern (e.g., using libraries like Opossum in Node.js). When errors or timeouts exceed a threshold, the circuit breaker opens and immediately fails fast, preventing resource exhaustion. Also, implement strict timeouts on all network calls.',
          redFlags: ['Relies solely on long timeouts', 'Allows cascading failures to bring down the entire system'],
          bonusPoints: ['Mentions Fallback strategies (e.g., serving cached data or a default response)', 'Discusses Bulkhead pattern to isolate resources']
        },
        {
          difficulty: 'Medium',
          question: 'What strategies would you use to ensure your PostgreSQL database in the Domain Scanner project is highly available and fault-tolerant in a cloud environment?',
          expectedAnswer: 'Use a managed database service (e.g., AWS RDS) with Multi-AZ deployment enabled. This automatically provisions a synchronous standby replica in a different Availability Zone. If the primary instance fails, the service automatically fails over to the standby by updating DNS records.',
          redFlags: ['Runs a single database instance without backups or replication', 'Relies solely on manual backups for disaster recovery'],
          bonusPoints: ['Mentions Point-in-Time Recovery (PITR)', 'Discusses automated backup retention policies']
        },
        {
          difficulty: 'Expert',
          question: 'Design a system to handle distributed transactions across multiple microservices where a failure in one service must rollback changes in others (e.g., User creation succeeds, but Payment setup fails).',
          expectedAnswer: 'Do not use traditional 2-Phase Commit (2PC) as it locks resources and scales poorly. Use the Saga Pattern. Implement it either via Choreography (events published to a broker) or Orchestration (a central coordinator service). If a step fails, the system executes compensating transactions to undo the previous steps.',
          redFlags: ['Attempts to use 2PC across microservices over HTTP', 'Leaves the system in an inconsistent state on partial failure'],
          bonusPoints: ['Explains the difference between Choreography and Orchestration and when to use which', 'Mentions the complexities of designing compensating transactions']
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await insertRound(roundData);
    console.log('Successfully seeded Round 5');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Round 5:', error);
    process.exit(1);
  }
}

seed();
