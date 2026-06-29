import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'chapter-11-security-best-practices',
    title: 'Chapter 11: Security Best Practices in Docker',
    order: 11,
    content: `
<h2>1. The Root Problem</h2>
<p>By default, Docker containers run as the <code>root</code> user. Because the container shares the host's kernel, a vulnerability in the application combined with a container breakout exploit could give an attacker root access to the host machine. The principle of least privilege dictates that processes should only have the permissions they absolutely need.</p>

<h2>2. Running as a Non-Root User</h2>
<p>The single most important security practice is to configure your Dockerfile to run the application as a non-root user. You can create a user within the Dockerfile and use the <code>USER</code> instruction to switch contexts.</p>
<pre><code class="language-dockerfile">
FROM node:18-alpine

WORKDIR /app
COPY . .

# Create a group and user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Change ownership of the app directory
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

CMD ["node", "app.js"]
</code></pre>

<h2>3. Using Official and Verified Base Images</h2>
<p>Public registries like Docker Hub contain millions of images, some of which contain malicious code (e.g., cryptominers). Always use <strong>Official Images</strong> maintained by Docker, or <strong>Verified Publisher</strong> images. Alternatively, build your own base images from scratch using trusted OS distributions like Alpine or Debian Slim.</p>

<h2>4. Scanning for Vulnerabilities</h2>
<p>Dependencies and OS packages inside images often contain known CVEs (Common Vulnerabilities and Exposures). Modern development workflows integrate container scanning tools directly into the CI/CD pipeline. Docker includes a built-in scanning tool (powered by Snyk or Scout).</p>
<pre><code class="language-bash">
# Scan a local image for vulnerabilities
docker scout cves my-image:latest
</code></pre>
<p>If high-severity vulnerabilities are found, the build pipeline should be configured to fail.</p>

<h2>5. Securing the Docker Daemon</h2>
<p>The Docker daemon (<code>dockerd</code>) usually requires root privileges. If a user has access to the Docker socket (<code>/var/run/docker.sock</code>), they essentially have root access to the host. Never expose the Docker socket to untrusted users or over an unprotected network.</p>
<p>Techniques like <strong>Rootless Docker</strong> allow running the Docker daemon and containers entirely within an unprivileged user namespace, severely limiting the blast radius of a breakout.</p>
`,
    interviewQuestions: [
      {
        question: "Why is running a container as the 'root' user considered a major security risk?",
        answer: "Because containers share the host's kernel, 'root' inside the container is effectively the same user ID (UID 0) as 'root' on the host. If an attacker finds a way to break out of the container's isolation, they will immediately have root-level control over the entire host machine."
      },
      {
        question: "How do you ensure your application runs as a non-root user inside a Dockerfile?",
        answer: "You create a dedicated user and group using OS commands (like `adduser`), change the ownership of your application files to that user, and then use the `USER` instruction in the Dockerfile to switch execution context before the `CMD` or `ENTRYPOINT` is executed."
      },
      {
        question: "What is the danger of mounting the docker.sock into a container?",
        answer: "Mounting `/var/run/docker.sock` into a container allows processes inside that container to communicate directly with the host's Docker daemon. This grants the container the ability to start, stop, or create new containers (including privileged ones), effectively giving it full root-level control over the host."
      },
      {
        question: "What are some tools or strategies used to identify vulnerabilities in Docker images?",
        answer: "Strategies include using specialized container scanning tools like Trivy, Clair, or Docker Scout. These tools analyze the image layers, identify installed OS packages and language dependencies, and cross-reference them against public CVE databases to flag known security flaws."
      },
      {
        question: "Explain the concept of 'Rootless Docker'.",
        answer: "Rootless Docker is an execution mode where both the Docker daemon (dockerd) and the containers it creates run within a user namespace. This means they are executed by a standard, unprivileged user rather than the system root. This drastically improves security by eliminating the daemon's need for host-level root privileges."
      }
    ],
    practicalTask: {
      scenario: "You are reviewing a Dockerfile that runs as root. You need to modify it to run under a user named 'node' (which is conveniently pre-created in the node base image).",
      task: "Given the base image 'node:alpine', write the Dockerfile instructions to set the working directory to /app, copy code, change ownership of /app to the 'node' user, and switch to the 'node' user.",
      solutionCode: "FROM node:alpine\nWORKDIR /app\nCOPY --chown=node:node . .\nUSER node\nCMD [\"node\", \"index.js\"]"
    }
  },
  {
    slug: 'chapter-12-dockerizing-databases',
    title: 'Chapter 12: Dockerizing Databases and Stateful Services',
    order: 12,
    content: `
<h2>1. Stateless vs. Stateful Containers</h2>
<p>Web servers and API backends are generally <strong>stateless</strong>: you can destroy them and spin up new ones instantly without losing user data. Databases (like PostgreSQL, MongoDB, Redis) are <strong>stateful</strong>. They hold persistent data that must survive container restarts, updates, and host reboots.</p>
<p>Running databases in Docker requires careful configuration to ensure data integrity and performance.</p>

<h2>2. Mandatory Use of Volumes</h2>
<p>As discussed in previous chapters, never store database data in the container's writable layer. You must use Named Volumes or Bind Mounts mapped to the database's internal data directory (e.g., <code>/var/lib/postgresql/data</code> for Postgres, <code>/data/db</code> for Mongo).</p>
<p>Using a Named Volume delegates storage management to Docker, which is generally safer and more performant than a Bind Mount for database workloads.</p>

<h2>3. Database Initialization</h2>
<p>Most official database images provide a mechanism to run initialization scripts (SQL dumps, shell scripts) the <em>first</em> time the database container starts.</p>
<p>For example, the Postgres image will automatically execute any <code>.sql</code> or <code>.sh</code> scripts found in the <code>/docker-entrypoint-initdb.d/</code> directory.</p>
<pre><code class="language-yaml">
# docker-compose.yml example
services:
  db:
    image: postgres:14
    volumes:
      - pgdata:/var/lib/postgresql/data
      # Mount a local SQL script to initialize tables
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    environment:
      POSTGRES_DB: myapp
      POSTGRES_PASSWORD: supersecret
</code></pre>

<h2>4. Performance Considerations</h2>
<p>Databases are heavily dependent on I/O performance. When running in production on Docker, the default union filesystem (like overlay2) adds overhead. While Volumes bypass this union filesystem, you still need to ensure the underlying host disk (where <code>/var/lib/docker/volumes</code> resides) is fast (SSD/NVMe).</p>
<p>For extreme performance requirements, some operators use specific volume plugins or direct block device mappings.</p>

<h2>5. Backups and Restores in Docker</h2>
<p>Because the database is running inside an isolated container, traditional backup scripts on the host won't have direct access to the database tools.</p>
<p>The standard pattern is to use <code>docker exec</code> to run the database's native dump tool inside the container, piping the output to the host.</p>
<pre><code class="language-bash">
# Creating a backup of a Postgres container
docker exec -t my_postgres_container pg_dumpall -c -U postgres > dump_$(date +%Y-%m-%d).sql

# Restoring a backup into the container
cat dump.sql | docker exec -i my_postgres_container psql -U postgres
</code></pre>
`,
    interviewQuestions: [
      {
        question: "What is the fundamental difference between a stateless and a stateful application in the context of containerization?",
        answer: "A stateless application (like a web server) does not retain any persistent data between requests or restarts; any container instance is identical and disposable. A stateful application (like a database) stores data that changes over time and must be preserved across container lifecycles to prevent data loss."
      },
      {
        question: "Why is it mandatory to use Volumes when running a database container like PostgreSQL or MongoDB?",
        answer: "If you don't use a Volume, all data written by the database is stored in the container's ephemeral read-write layer. If the container crashes, is deleted, or updated, all database data is permanently lost. Volumes bypass this layer, storing data safely on the host disk."
      },
      {
        question: "How do you automatically run SQL scripts to create schemas and insert seed data when a PostgreSQL container starts for the first time?",
        answer: "Official database images like Postgres look for initialization scripts in specific directories (e.g., `/docker-entrypoint-initdb.d/`). By mounting your local `.sql` or `.sh` files into this directory via a bind mount, the database engine will automatically execute them upon its very first initialization."
      },
      {
        question: "How would you perform a logical backup (e.g., a SQL dump) of a database running inside a Docker container from the host machine?",
        answer: "You use the `docker exec` command to execute the native backup utility (like `pg_dump` or `mysqldump`) inside the running container, and use standard shell redirection (`>`) to pipe the output into a file on the host machine filesystem."
      },
      {
        question: "Are databases in containers suitable for large-scale, high-performance production workloads?",
        answer: "Yes, but they require careful configuration. While they are very common, achieving maximum I/O performance requires ensuring Docker volumes are backed by fast, dedicated storage arrays (like SSDs/NVMe) rather than slow network storage, and sometimes tuning kernel parameters."
      }
    ],
    practicalTask: {
      scenario: "You need to backup a MySQL database running in a container named 'mysql-prod'. The root password is 'admin123'.",
      task: "Write the command to execute 'mysqldump -u root -padmin123 --all-databases' inside the container and save it to 'backup.sql' on the host.",
      solutionCode: "docker exec mysql-prod mysqldump -u root -padmin123 --all-databases > backup.sql"
    }
  },
  {
    slug: 'chapter-13-cicd-integration',
    title: 'Chapter 13: CI/CD Integration: Building and Pushing Images Automatically',
    order: 13,
    content: `
<h2>1. The Goal of Continuous Integration / Continuous Deployment</h2>
<p>In a modern workflow, developers shouldn't manually build and push Docker images from their laptops. This is error-prone, insecure, and lacks an audit trail. Instead, the process of building, testing, and pushing images should be automated in a CI/CD pipeline (e.g., GitHub Actions, GitLab CI, Jenkins).</p>

<h2>2. The Typical CI/CD Pipeline Flow</h2>
<p>A standard pipeline for a containerized application looks like this:</p>
<ol>
  <li><strong>Code Commit:</strong> Developer pushes code to a Git repository.</li>
  <li><strong>Testing:</strong> The CI server pulls the code, potentially builds a temporary image, and runs unit/integration tests inside a container.</li>
  <li><strong>Image Build:</strong> If tests pass, the CI server builds the final production Docker image.</li>
  <li><strong>Image Tagging:</strong> The image is tagged uniquely (usually with the Git commit hash, a version number, or <code>latest</code>).</li>
  <li><strong>Registry Push:</strong> The CI server authenticates to a Docker Registry (Docker Hub, AWS ECR) and pushes the tagged image.</li>
</ol>

<h2>3. Implementing with GitHub Actions</h2>
<p>Here is an example of a simple GitHub Actions workflow that builds and pushes a Docker image to Docker Hub whenever code is pushed to the <code>main</code> branch.</p>
<pre><code class="language-yaml">
name: Docker Build and Push

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: myusername/myapp:latest,myusername/myapp:\${{ github.sha }}
</code></pre>

<h2>4. Tagging Strategies</h2>
<p>Using only the <code>latest</code> tag is dangerous in production because it is mutable—you never know exactly which version of the code is running. A robust tagging strategy tags images with the Git commit SHA (e.g., <code>myapp:a1b2c3d</code>) or Semantic Versioning numbers (e.g., <code>myapp:v1.2.4</code>). This ensures immutability and easy rollbacks.</p>

<h2>5. Security Scanning in CI</h2>
<p>CI is the perfect place to implement security scanning. Tools like Trivy can be added as a step right after the image is built. If vulnerabilities are found, the pipeline fails, preventing insecure images from ever reaching the registry.</p>
`,
    interviewQuestions: [
      {
        question: "Why is it considered bad practice for developers to build and push production Docker images from their local machines?",
        answer: "Local builds lack an audit trail, are prone to 'works on my machine' environmental differences (even with Docker, host architecture can matter), and pose security risks by requiring developers to have direct write access to production registries. Automation via CI ensures reproducibility and strict access control."
      },
      {
        question: "Describe the typical sequence of steps in a CI/CD pipeline for a Dockerized application.",
        answer: "1. Code is pushed to a repository. 2. The CI tool pulls the code and runs tests (often inside a container). 3. The CI tool builds the Docker image. 4. The image is tagged with a unique identifier (like a commit hash). 5. The CI tool authenticates and pushes the image to a container registry."
      },
      {
        question: "What is a major problem with relying solely on the `latest` tag for production deployments?",
        answer: "The `latest` tag is mutable; it simply points to the most recently built image. If an issue occurs in production, it's difficult to know exactly which version of the codebase the `latest` tag is currently representing, making rollbacks and debugging extremely difficult. It breaks the concept of immutable infrastructure."
      },
      {
        question: "What is an effective tagging strategy for Docker images in a CI pipeline?",
        answer: "A robust strategy is to tag images with the short Git commit SHA hash (e.g., `myapp:7a3f8b1`) or a semantic versioning tag (`myapp:v2.1.0`). This guarantees that every image tag corresponds to a specific, identifiable point in the source code history."
      },
      {
        question: "How do you handle registry authentication credentials in a CI/CD system securely?",
        answer: "Credentials (like Docker Hub tokens or AWS access keys) must never be hardcoded in the pipeline configuration files. They should be stored in the CI/CD platform's secure secret management system (e.g., GitHub Secrets, GitLab CI/CD Variables) and injected into the pipeline at runtime."
      }
    ],
    practicalTask: {
      scenario: "In a bash script acting as a simple CI pipeline, you need to build an image, tag it with a variable holding a Git commit hash, and push it.",
      task: "Given the variable COMMIT_HASH='abc1234', write the Docker CLI commands to build the current directory into an image named 'repo/app', tag it with the commit hash, and push that specific tag to the registry.",
      solutionCode: "docker build -t repo/app:$COMMIT_HASH .\ndocker push repo/app:$COMMIT_HASH"
    }
  },
  {
    slug: 'chapter-14-orchestration-swarm-intro',
    title: 'Chapter 14: Introduction to Container Orchestration and Swarm',
    order: 14,
    content: `
<h2>1. The Need for Orchestration</h2>
<p>Docker Compose is excellent for local development and single-server deployments. But what happens when you need to run your application across 10 different physical servers for high availability and scale? Managing containers manually across multiple hosts is impossible. You need a <strong>Container Orchestrator</strong>.</p>
<p>Orchestrators handle scheduling containers to optimal hosts, self-healing (restarting crashed containers), scaling up and down, load balancing, and rolling updates.</p>

<h2>2. Docker Swarm: Native Clustering</h2>
<p>Docker Swarm is Docker's native orchestration tool, built directly into the Docker Engine. While Kubernetes has become the industry standard, Swarm is significantly easier to set up and learn, making it a great stepping stone.</p>
<p>A Swarm consists of multiple Docker hosts acting as <strong>Managers</strong> (handling cluster state and API requests) and <strong>Workers</strong> (executing the actual containers).</p>

<h2>3. Initializing a Swarm</h2>
<p>To convert a standard Docker Engine into a Swarm Manager, you initialize the swarm. This generates tokens that other nodes use to join the cluster.</p>
<pre><code class="language-bash">
# On the manager node
docker swarm init --advertise-addr &lt;MANAGER-IP&gt;

# This outputs a join command that you run on worker nodes:
docker swarm join --token SWMTKN-1-... &lt;MANAGER-IP&gt;:2377
</code></pre>

<h2>4. Services vs. Containers</h2>
<p>In Swarm, you don't run individual containers; you deploy <strong>Services</strong>. A Service is a definition of the desired state of your application (e.g., "I want 5 instances of the Nginx image running, exposed on port 80"). The Swarm Manager ensures this desired state is constantly maintained.</p>
<pre><code class="language-bash">
# Create a service with 3 replicas
docker service create --name web --replicas 3 -p 80:80 nginx

# List running services
docker service ls

# See which nodes the tasks (containers) are running on
docker service ps web
</code></pre>

<h2>5. The Routing Mesh</h2>
<p>A key feature of Swarm is the ingress Routing Mesh. When you publish a port for a service (e.g., port 80), the Swarm exposes that port on <em>every single node</em> in the cluster, even if that specific node isn't running a replica of the service.</p>
<p>If a request hits Node A, but the container is running on Node B, Node A's routing mesh transparently load-balances and forwards the traffic to Node B.</p>
`,
    interviewQuestions: [
      {
        question: "What problems does a Container Orchestrator like Docker Swarm or Kubernetes solve?",
        answer: "Orchestrators solve the complexities of running containers across multiple physical or virtual hosts. They provide automated scheduling, high availability, self-healing (restarting failed containers), seamless scaling, load balancing, and zero-downtime rolling updates."
      },
      {
        question: "In a Docker Swarm cluster, what is the difference between a Manager node and a Worker node?",
        answer: "Manager nodes maintain the cluster state, handle the Docker API, and schedule tasks (containers). Worker nodes solely execute the tasks assigned to them by the Managers. Managers can also act as workers by default."
      },
      {
        question: "What is the difference between a Container and a Service in Docker Swarm?",
        answer: "A container is a single, standalone isolated process. A Service is an orchestration concept defining a desired state (e.g., an image, network ports, and the number of desired replicas). The Swarm manager creates individual containers (called 'tasks' in Swarm) to fulfill the requirements of the Service definition."
      },
      {
        question: "Explain the concept of 'Desired State' in container orchestration.",
        answer: "Desired state means you declare what you want the system to look like (e.g., 'run 3 replicas of the frontend'). The orchestrator constantly monitors the actual state. If a node crashes and a replica is lost, the actual state becomes 2. The orchestrator immediately detects this drift and spins up a new replica on a healthy node to restore the desired state of 3."
      },
      {
        question: "How does the Docker Swarm Routing Mesh work?",
        answer: "The routing mesh enables all nodes in the Swarm to accept connections on published ports for any service running in the Swarm, regardless of whether a task for that service is running on the receiving node. It acts as an internal load balancer, transparently routing ingress traffic to an active container."
      }
    ],
    practicalTask: {
      scenario: "You have a Swarm manager running. You want to deploy a scalable web service using the 'nginx' image.",
      task: "Write the Docker CLI command to create a Swarm service named 'frontend', requesting exactly 5 replicas, and publishing container port 80 to host port 8080.",
      solutionCode: "docker service create --name frontend --replicas 5 -p 8080:80 nginx"
    }
  },
  {
    slug: 'chapter-15-troubleshooting-debugging',
    title: 'Chapter 15: Troubleshooting and Debugging Dockerized Environments',
    order: 15,
    content: `
<h2>1. The Debugging Mindset</h2>
<p>Debugging a containerized application can be frustrating if you treat the container as a black box. The key is to systematically isolate the problem: Is it an issue with the application code, the image build process, the container runtime environment, or network connectivity?</p>

<h2>2. The Holy Trinity of Debugging Commands</h2>
<p>When a container fails, your investigation should almost always start with these three tools:</p>
<ul>
  <li><code>docker logs &lt;container_name&gt;</code>: This shows the application's stdout/stderr. If the app crashed with a stack trace, it will be here.</li>
  <li><code>docker inspect &lt;container_name&gt;</code>: Check the "State" section. Did it exit with an Error code (e.g., OOMKilled)? Check the "Mounts" to ensure volumes are mapped correctly.</li>
  <li><code>docker exec -it &lt;container_name&gt; /bin/sh</code>: If the container is running but behaving badly, open a shell inside it. You can check file permissions, environment variables, or run internal curl commands to test APIs.</li>
</ul>

<h2>3. Debugging Failing Builds</h2>
<p>If <code>docker build</code> fails, look at the last successful layer. Docker caches intermediate containers. You can actually start a container from the last successful layer image ID to see what went wrong.</p>
<pre><code class="language-bash">
# If build fails at step 5, find the ID of step 4
docker run -it &lt;image-id-of-step-4&gt; /bin/bash
# Now manually run the failing command from step 5 to debug it
</code></pre>

<h2>4. Network Troubleshooting</h2>
<p>Network issues are common. If Container A cannot talk to Container B:</p>
<ol>
  <li>Are they on the same custom bridge network? (Use <code>docker network inspect &lt;network_name&gt;</code>)</li>
  <li>Are you using the service name (not localhost) to connect?</li>
  <li>Use ephemeral debug containers attached to the same network to test connectivity.</li>
</ol>
<pre><code class="language-bash">
# Spin up a temporary Alpine container attached to the app network to test DNS and ping
docker run --rm -it --network my_app_net alpine /bin/sh
# Inside: ping container_b
</code></pre>

<h2>5. OOM (Out of Memory) Kills</h2>
<p>If a container mysteriously disappears or crashes without logs, it was likely killed by the Linux Kernel's OOM killer because it exceeded its memory limit. <code>docker inspect</code> will show <code>"OOMKilled": true</code> in the State section. The solution is either to increase the memory limit assigned to the container or fix memory leaks in the application.</p>
`,
    interviewQuestions: [
      {
        question: "A container is failing to start and immediately exits. What is the very first command you should run to investigate?",
        answer: "The very first command should be `docker logs <container_id_or_name>`. The application running as PID 1 inside the container has likely logged an error message or stack trace explaining why it crashed."
      },
      {
        question: "How can you debug a Dockerfile build that keeps failing at a specific `RUN` instruction?",
        answer: "You can find the image ID of the intermediate layer successfully created just before the failing step. Use `docker run -it <intermediate_image_id> /bin/bash` to open a shell in that exact state, and manually execute the failing command to observe the error interactively."
      },
      {
        question: "What does it mean if `docker inspect` shows that a container was `OOMKilled`?",
        answer: "OOMKilled means 'Out Of Memory Killed'. It indicates that the container process attempted to consume more RAM than it was allocated via Docker resource limits, prompting the Linux kernel's OOM Killer to forcefully terminate the process to protect the host system."
      },
      {
        question: "Your web container cannot connect to your database container. Both were started with standard `docker run` commands without network flags. Why?",
        answer: "By default, containers are attached to the default `bridge` network. On this network, containers cannot resolve each other by name (DNS is disabled). They must be placed on a custom, user-defined bridge network for automatic name resolution to work."
      },
      {
        question: "How do you verify if the environment variables you passed to a container are actually set inside it?",
        answer: "You can execute the `env` or `printenv` command inside the running container using `docker exec`. For example: `docker exec <container_name> env`. Alternatively, you can view the 'Env' array within the output of `docker inspect <container_name>`."
      }
    ],
    practicalTask: {
      scenario: "You have a running container named 'app-backend'. You suspect its internal environment variable 'NODE_ENV' is incorrect.",
      task: "Write the command to execute a single, non-interactive shell command inside the 'app-backend' container that prints the value of the 'NODE_ENV' variable.",
      solutionCode: "docker exec app-backend sh -c 'echo $NODE_ENV'"
    }
  }
];

appendTopics('docker', 'Docker Containerization', 'The definitive guide.', topics);
