import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-networking-basics",
    title: "11. Docker Networking Basics",
    order: 11,
    content: "<h2>Bridge, Host, and None</h2><p>Docker provides network isolation and communication via network drivers. The default is the `bridge` network, allowing containers on the same host to talk to each other. `host` removes network isolation between the container and the Docker host. `none` completely disables networking for the container.</p>",
    interviewQuestions: [
      { question: "What is the default network driver in Docker?", answer: "The bridge network driver is the default. It creates an internal private network on the host so containers on this network can communicate." },
      { question: "When would you use the host network driver?", answer: "When you want the container to share the host's networking namespace, meaning the container's application will be available on the host's IP address and ports directly without NAT overhead." }
    ],
    practicalTask: {
      scenario: "You need a container completely isolated from any network.",
      task: "Run an Alpine container using the 'none' network driver.",
      solutionCode: "docker run --network none -it alpine sh"
    }
  },
  {
    slug: "docker-advanced-networking",
    title: "12. Advanced Docker Networking",
    order: 12,
    content: "<h2>Custom Bridges and DNS</h2><p>User-defined bridge networks provide better isolation and automatic DNS resolution between containers. In the default bridge, containers must communicate via IP or using legacy `--link`. In user-defined bridges, they can resolve each other by container name or alias. The `overlay` network is used in Swarm to connect multiple Docker hosts.</p>",
    interviewQuestions: [
      { question: "How do containers resolve each other by name?", answer: "Docker provides a built-in DNS server. When containers are attached to a user-defined bridge network, Docker automatically resolves container names to their internal IP addresses." },
      { question: "What is an Overlay network?", answer: "An overlay network is a distributed network among multiple Docker daemon hosts. This network sits on top of the host-specific networks, allowing containers connected to it to communicate securely across different machines." }
    ],
    practicalTask: {
      scenario: "You have a frontend and backend container.",
      task: "Create a user-defined network called 'app-net' and run a container attached to it.",
      solutionCode: "docker network create app-net\ndocker run -d --network app-net --name backend nginx"
    }
  },
  {
    slug: "docker-compose-intro",
    title: "13. Docker Compose Introduction",
    order: 13,
    content: "<h2>Multi-container Orchestration Locally</h2><p>Docker Compose is a tool for defining and running multi-container Docker applications. You use a YAML file (`docker-compose.yml`) to configure your application's services, networks, and volumes. Then, with a single command (`docker-compose up`), you create and start all the services from your configuration.</p>",
    interviewQuestions: [
      { question: "What is the purpose of Docker Compose?", answer: "It simplifies the process of defining, running, and managing multi-container Docker applications using a single declarative YAML file." },
      { question: "Which command shuts down and cleans up Compose resources?", answer: "`docker-compose down` stops containers and removes containers, networks, volumes, and images created by `up`." }
    ],
    practicalTask: {
      scenario: "You have written a docker-compose.yml file.",
      task: "Start all services defined in the compose file in detached mode.",
      solutionCode: "docker-compose up -d"
    }
  },
  {
    slug: "docker-compose-multi",
    title: "14. Multi-container Applications",
    order: 14,
    content: "<h2>Linking Services</h2><p>In a `docker-compose.yml`, services can communicate with each other using the service name as the hostname. The `depends_on` option expresses dependency between services (e.g., starting a database before the API). However, `depends_on` only waits for the container to start, not to be \"ready\", which requires custom wait scripts or healthchecks.</p>",
    interviewQuestions: [
      { question: "Does `depends_on` guarantee the target service is fully initialized?", answer: "No, by default `depends_on` only ensures the container is started. You need to use healthchecks combined with `depends_on: condition: service_healthy` to wait for initialization." },
      { question: "How are services linked in Compose?", answer: "Compose automatically creates a single user-defined bridge network for the app. Each service joins the network and is reachable by other containers via a hostname identical to the service name." }
    ],
    practicalTask: {
      scenario: "Your API service needs the database service to be healthy first.",
      task: "Define the dependency in docker-compose.yml (snippet).",
      solutionCode: "depends_on:\n  db:\n    condition: service_healthy"
    }
  },
  {
    slug: "docker-environment-variables",
    title: "15. Environment Variables in Docker",
    order: 15,
    content: "<h2>Configuring Containers</h2><p>Environment variables allow you to externalize configuration. In Docker, you can pass them via `docker run -e KEY=VALUE` or using a `.env` file via `--env-file`. In Docker Compose, Compose automatically reads `.env` files in the same directory, or you can explicitly define them in the `environment:` section.</p>",
    interviewQuestions: [
      { question: "Why should we use Environment Variables in Docker?", answer: "To keep configuration separate from code (following 12-factor app principles) and to avoid hardcoding secrets or environment-specific data in the Docker image." },
      { question: "What is the difference between ENV and ARG in a Dockerfile?", answer: "ARG is only available during the build process of a Docker image. ENV is available during the build and is persisted in the final image, making it available when the container runs." }
    ],
    practicalTask: {
      scenario: "You need to pass database credentials securely.",
      task: "Run a container passing an environment variable 'DB_PASS=secret'.",
      solutionCode: "docker run -e DB_PASS=secret -d my-app"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
