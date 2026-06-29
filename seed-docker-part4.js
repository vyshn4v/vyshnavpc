import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-registries",
    title: "16. Docker Registries",
    order: 16,
    content: "<h2>Docker Hub and Private Registries</h2><p>A Docker registry is a storage and distribution system for named Docker images. Docker Hub is the default public registry. For private intellectual property, organizations use private registries like AWS ECR, Google Artifact Registry, or self-hosted Docker Registry. `docker login` authenticates you, and `docker push` uploads your tagged images.</p>",
    interviewQuestions: [
      { question: "What is the difference between a Repository and a Registry?", answer: "A Registry is a service that holds collections of Repositories. A Repository is a collection of different versions (tags) of the same Docker image (e.g., ubuntu is a repository on the Docker Hub registry)." },
      { question: "How do you push an image to a private registry?", answer: "You first tag the image with the registry URL, then log in, and then push. E.g., `docker tag my-app myregistry.com/my-app`, `docker push myregistry.com/my-app`." }
    ],
    practicalTask: {
      scenario: "You built an image and want to push it to Docker Hub.",
      task: "Tag the image 'myapp' with your username 'johndoe' and push it.",
      solutionCode: "docker tag myapp johndoe/myapp:latest\ndocker push johndoe/myapp:latest"
    }
  },
  {
    slug: "docker-security",
    title: "17. Docker Security Best Practices",
    order: 17,
    content: "<h2>Non-root Users and Scanning</h2><p>Containers run as root by default, which is a security risk. A best practice is to create a dedicated user inside the Dockerfile using `USER`. Additionally, images should be built from minimal bases (like Alpine or Distroless) to reduce the attack surface. Image scanning tools (like Trivy or Docker Scan) identify known vulnerabilities.</p>",
    interviewQuestions: [
      { question: "Why shouldn't you run containers as root?", answer: "If an attacker escapes the container, they might gain root access on the host. Running as a non-privileged user mitigates this risk." },
      { question: "What are Distroless images?", answer: "Images that contain only your application and its runtime dependencies. They do not contain package managers, shells, or any other programs, heavily reducing the attack surface." }
    ],
    practicalTask: {
      scenario: "You want your Node app to run as the node user.",
      task: "Write the Dockerfile instruction to switch to the 'node' user.",
      solutionCode: "USER node"
    }
  },
  {
    slug: "docker-secrets",
    title: "18. Managing Secrets",
    order: 18,
    content: "<h2>Protecting Sensitive Data</h2><p>Never bake passwords, API keys, or SSH keys into an image. In Docker Swarm, you can use Docker Secrets to securely distribute sensitive data to services. In standalone Docker, you might rely on environment variables, `.env` files (which must be excluded from version control), or external vaults (like HashiCorp Vault).</p>",
    interviewQuestions: [
      { question: "Why is baking secrets into a Docker image a bad idea?", answer: "Because anyone who can pull the image can inspect it using `docker history` or by running a container and extracting the files, exposing the secrets." },
      { question: "How does Docker Swarm handle secrets?", answer: "Secrets are encrypted during transit and at rest in a Swarm manager. They are mounted into the container at runtime as an in-memory file at `/run/secrets/`." }
    ],
    practicalTask: {
      scenario: "Ensure secrets don't end up in Git or Images.",
      task: "Create a .dockerignore file ignoring .env files.",
      solutionCode: "echo '.env' >> .dockerignore"
    }
  },
  {
    slug: "docker-resource-limits",
    title: "19. Resource Limits",
    order: 19,
    content: "<h2>CPU and Memory Constraints</h2><p>By default, a container has no resource constraints and can use as much of a given resource as the host's kernel allows. You can restrict memory using `-m` or `--memory`, and limit CPU using `--cpus`. This prevents a single container from consuming all host resources and causing an Out-Of-Memory (OOM) exception that crashes other services.</p>",
    interviewQuestions: [
      { question: "What happens if a container exceeds its memory limit?", answer: "The Linux kernel will kill the processes inside the container to reclaim memory, known as an OOM (Out Of Memory) kill. The container may terminate." },
      { question: "How do you limit a container to use only half of a CPU core?", answer: "By using the `--cpus` flag. Example: `docker run --cpus=\".5\" my-app`." }
    ],
    practicalTask: {
      scenario: "You need to limit an aggressive container.",
      task: "Run a container with a maximum of 512MB of RAM.",
      solutionCode: "docker run -m 512m -d my-app"
    }
  },
  {
    slug: "docker-cli-mastery",
    title: "20. Docker CLI Mastery",
    order: 20,
    content: "<h2>Formatters and Advanced Filters</h2><p>The Docker CLI is powerful. You can use `--filter` (or `-f`) to search for specific containers or images based on status, name, or labels. The `--format` flag uses Go templates to extract exactly the information you need, which is essential for scripting and automation without relying on tools like grep or awk.</p>",
    interviewQuestions: [
      { question: "How do you remove all stopped containers?", answer: "You can use `docker container prune` or `docker rm $(docker ps -a -q -f status=exited)`." },
      { question: "What does the `--format` flag do?", answer: "It allows you to customize the CLI output using Go templates. For example, extracting just the IP addresses or names of running containers." }
    ],
    practicalTask: {
      scenario: "You are writing an automation script and need only the container IDs.",
      task: "List all running containers, outputting ONLY their IDs.",
      solutionCode: "docker ps -q"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
