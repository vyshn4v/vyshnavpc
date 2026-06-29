import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-swarm-advanced",
    title: "26. Advanced Docker Swarm",
    order: 26,
    content: "<h2>Routing Mesh and Replicas</h2><p>Swarm mode features a Routing Mesh. If you publish a port for a service (e.g., port 80), every node in the Swarm listens on port 80. If a request hits a node not running the container, the Routing Mesh transparently forwards the request to a node that is. You can easily scale services up or down using `docker service scale`.</p>",
    interviewQuestions: [
      { question: "What is the Docker Swarm Routing Mesh?", answer: "It is an internal load balancer that allows all nodes in the swarm to accept connections on published ports for any service, routing the traffic to an active container regardless of which node received the request." },
      { question: "How does Swarm provide self-healing?", answer: "If a worker node crashes, the manager node notices the lost container replicas and automatically reschedules them on other available, healthy nodes." }
    ],
    practicalTask: {
      scenario: "You have a service named 'frontend' running on Swarm.",
      task: "Scale the 'frontend' service to 5 replicas.",
      solutionCode: "docker service scale frontend=5"
    }
  },
  {
    slug: "docker-contexts",
    title: "27. Docker Contexts",
    order: 27,
    content: "<h2>Managing Multiple Daemons</h2><p>Developers often work with multiple Docker environments (local, staging, production servers). `docker context` allows you to define multiple endpoints and easily switch between them. Instead of exporting `DOCKER_HOST` environment variables, you create a context (e.g., over SSH) and switch your CLI to control a remote daemon seamlessly.</p>",
    interviewQuestions: [
      { question: "What is a Docker Context?", answer: "A context is a configuration containing the endpoint details and credentials needed to connect to a specific Docker daemon or Kubernetes cluster." },
      { question: "How do you switch your Docker CLI to target a remote server named 'prod'?", answer: "By running `docker context use prod`." }
    ],
    practicalTask: {
      scenario: "You want to see all configured Docker environments.",
      task: "List all Docker contexts available on your machine.",
      solutionCode: "docker context ls"
    }
  },
  {
    slug: "docker-machine",
    title: "28. Docker Machine",
    order: 28,
    content: "<h2>Legacy Provisioning Tool</h2><p>Docker Machine was a tool that let you install Docker Engine on virtual hosts, and manage the hosts with `docker-machine` commands. You could create hosts on your local Mac/Windows box, or on cloud providers like Azure, AWS, or DigitalOcean. Though officially deprecated in favor of Docker Desktop and cloud-native managed solutions, the concept of remote daemon provisioning remains relevant.</p>",
    interviewQuestions: [
      { question: "What was the primary use case for Docker Machine?", answer: "It was used to easily provision and manage remote or virtual machines with Docker installed, simplifying the setup process before tools like Docker Desktop matured." },
      { question: "Why was Docker Machine deprecated?", answer: "Modern OS-level virtualization (like WSL2 on Windows and native hypervisors on Mac) made it obsolete for local development, and tools like Terraform are preferred for cloud provisioning." }
    ],
    practicalTask: {
      scenario: "Historical knowledge check.",
      task: "Write the legacy command that was used to create a virtualbox Docker machine.",
      solutionCode: "docker-machine create --driver virtualbox default"
    }
  },
  {
    slug: "docker-buildx",
    title: "29. Building Cross-Platform Images",
    order: 29,
    content: "<h2>Introduction to buildx</h2><p>With the rise of ARM architecture (e.g., Apple Silicon M1/M2, AWS Graviton), building images for multiple platforms is crucial. `docker buildx` is a CLI plugin that extends the docker command with the full support of the features provided by Moby BuildKit builder toolkit, including multi-architecture builds using `--platform`.</p>",
    interviewQuestions: [
      { question: "What is Docker BuildKit?", answer: "BuildKit is the next-generation container image builder for Docker. It offers improved performance, better caching, concurrent build steps, and multi-platform build support." },
      { question: "How do you build an image for both ARM64 and AMD64 architectures?", answer: "Using buildx: `docker buildx build --platform linux/amd64,linux/arm64 -t myapp .`" }
    ],
    practicalTask: {
      scenario: "Enable advanced build features.",
      task: "Create and use a new buildx builder instance.",
      solutionCode: "docker buildx create --use"
    }
  },
  {
    slug: "docker-node-example",
    title: "30. Containerizing a Node.js App",
    order: 30,
    content: "<h2>Real-world Example</h2><p>Containerizing a Node.js app involves using an official Node base image (e.g., `node:18-alpine`), setting a working directory, copying `package.json`, running `npm install`, copying the rest of the source code, exposing the port, and defining the start command. Copying `package.json` separately optimizes the layer cache, speeding up builds when code changes but dependencies don't.</p>",
    interviewQuestions: [
      { question: "Why should you copy package.json and run npm install BEFORE copying the rest of your Node.js code?", answer: "To leverage Docker's layer caching. If you copy everything at once, any change in your code will invalidate the cache for `npm install`, causing it to redownload packages every time." },
      { question: "Why use 'alpine' versions of Node images?", answer: "Alpine Linux is extremely lightweight (around 5MB), which significantly reduces the final Docker image size and minimizes the security attack surface." }
    ],
    practicalTask: {
      scenario: "You need a basic Dockerfile for a Node app.",
      task: "Write a one-liner to create a Dockerfile with a Node Alpine base.",
      solutionCode: "echo 'FROM node:18-alpine' > Dockerfile"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
