import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-ci-cd",
    title: "21. CI/CD with Docker",
    order: 21,
    content: "<h2>GitHub Actions and Jenkins</h2><p>Docker is pivotal in Continuous Integration and Deployment. In a CI pipeline, Docker ensures that tests run in the exact same environment as production. A typical pipeline: code is pushed, CI server builds the Docker image, runs tests inside a container based on that image, and if successful, pushes the image to a registry and triggers a deployment.</p>",
    interviewQuestions: [
      { question: "Why use Docker in a CI/CD pipeline?", answer: "It ensures environment consistency. 'It works on my machine' problems are eliminated because the exact same container image is built, tested, and deployed across all stages." },
      { question: "What is Docker-in-Docker (DinD)?", answer: "DinD is running a Docker daemon inside a Docker container. It is commonly used in CI pipelines to build Docker images from within a containerized CI runner." }
    ],
    practicalTask: {
      scenario: "You need a command to build and tag an image for CI.",
      task: "Write a command to build an image with the tag corresponding to a Git commit hash.",
      solutionCode: "docker build -t myapp:${GIT_COMMIT} ."
    }
  },
  {
    slug: "docker-debugging",
    title: "22. Debugging and Troubleshooting Containers",
    order: 22,
    content: "<h2>Exec and Inspect</h2><p>When a container crashes or misbehaves, `docker logs` is the first place to look. If it's running but failing, `docker exec -it <container> sh` lets you shell into it. For deep-level metadata, `docker inspect <container>` returns a JSON object detailing the container's configuration, networking, and volume mounts.</p>",
    interviewQuestions: [
      { question: "How can you see the detailed configuration of an image or container?", answer: "Use the `docker inspect` command. It provides a JSON output containing all metadata, including environment variables, IP addresses, and entrypoints." },
      { question: "A container starts and immediately exits. How do you troubleshoot?", answer: "Run `docker logs <container_id>` to read the application's standard output and error to find the cause of the crash." }
    ],
    practicalTask: {
      scenario: "You need to find the internal IP address of a running container.",
      task: "Use docker inspect to format the output and get the IP address.",
      solutionCode: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name"
    }
  },
  {
    slug: "docker-logs-monitoring",
    title: "23. Docker Logs and Monitoring",
    order: 23,
    content: "<h2>Log Drivers and Prometheus</h2><p>By default, Docker captures standard output (stdout) and standard error (stderr) of all containers using the `json-file` logging driver. In production, this can consume disk space quickly. Docker supports multiple log drivers (e.g., syslog, fluentd, awslogs). For monitoring metrics like CPU/Memory usage, `docker stats` is useful locally, while Prometheus/Grafana is used in production.</p>",
    interviewQuestions: [
      { question: "What happens if you don't manage container logs?", answer: "The default `json-file` driver stores logs indefinitely. If unchecked, logs can fill up the entire host disk, causing system failure." },
      { question: "How do you limit the log size for a container?", answer: "By setting log options. For example: `--log-opt max-size=10m --log-opt max-file=3`." }
    ],
    practicalTask: {
      scenario: "You want to stream the resource usage of all containers in real-time.",
      task: "Run the command to show live container statistics.",
      solutionCode: "docker stats"
    }
  },
  {
    slug: "docker-orchestration-concepts",
    title: "24. Orchestration Concepts",
    order: 24,
    content: "<h2>Why Swarm or Kubernetes?</h2><p>Running isolated containers on a single host is fine for development, but production requires High Availability, Scaling, Load Balancing, and Self-Healing. Orchestrators manage these concerns. They cluster multiple physical or virtual machines into a single pool of resources and intelligently deploy containers across them.</p>",
    interviewQuestions: [
      { question: "What problem does container orchestration solve?", answer: "It manages the lifecycle of containers in large, dynamic environments, handling tasks like provisioning, deployment, scaling, networking, and load balancing across a cluster of nodes." },
      { question: "Name two popular container orchestration tools.", answer: "Docker Swarm and Kubernetes." }
    ],
    practicalTask: {
      scenario: "Understand the concept of scaling.",
      task: "Using Docker Compose, scale a service named 'web' to 3 instances.",
      solutionCode: "docker-compose up -d --scale web=3"
    }
  },
  {
    slug: "docker-swarm-intro",
    title: "25. Introduction to Docker Swarm",
    order: 25,
    content: "<h2>Init, Nodes, and Services</h2><p>Docker Swarm is Docker's native clustering and orchestration engine. You initialize a swarm using `docker swarm init`. The machine becomes a Manager node. Other machines can join as Worker nodes. In Swarm, you don't run containers directly; you define Services, which specify the image, ports, and number of replicas.</p>",
    interviewQuestions: [
      { question: "What is a Manager node in Docker Swarm?", answer: "Manager nodes perform orchestration and cluster management tasks. They maintain the cluster state, schedule services, and serve the Swarm API." },
      { question: "What is the difference between a Container and a Service in Swarm?", answer: "A container is an isolated process. A service is a description of a desired state, defining which image to use and how many container replicas should run across the Swarm." }
    ],
    practicalTask: {
      scenario: "You want to turn your current Docker host into a Swarm manager.",
      task: "Initialize Docker Swarm.",
      solutionCode: "docker swarm init"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
