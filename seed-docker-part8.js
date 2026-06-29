import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-stateful-stateless",
    title: "36. Stateful vs Stateless Applications",
    order: 36,
    content: "<h2>Understanding Application States</h2><p>Stateless applications don't save client data from one session to the next (e.g., a simple web frontend). They are trivial to scale horizontally in Docker. Stateful applications (like databases or apps storing local sessions) require careful data management using volumes or external stores (like Redis for sessions) to ensure data isn't lost when containers are destroyed or moved.</p>",
    interviewQuestions: [
      { question: "Why are stateless applications easier to manage in Docker?", answer: "Because they hold no persistent data internally. They can be destroyed, recreated, and scaled up or down instantly without worrying about data loss or synchronization." },
      { question: "How can you make a stateful web application stateless?", answer: "By externalizing the state. For example, moving user sessions from local memory into a distributed cache like Redis, and moving file uploads to an object storage like AWS S3." }
    ],
    practicalTask: {
      scenario: "Stateless scaling test.",
      task: "Scale a stateless web service to 10 instances using Compose.",
      solutionCode: "docker-compose up -d --scale web=10"
    }
  },
  {
    slug: "docker-plugins",
    title: "37. Docker Plugins",
    order: 37,
    content: "<h2>Extending Docker Capabilities</h2><p>Docker Engine can be extended using plugins, primarily for Networking and Volumes. For instance, a volume plugin could allow Docker to directly provision and mount AWS EBS volumes or NetApp storage. Network plugins can integrate Docker with complex enterprise SDN (Software Defined Networking) solutions. They are installed using `docker plugin install`.</p>",
    interviewQuestions: [
      { question: "What is the purpose of Docker volume plugins?", answer: "They allow Docker to integrate with third-party storage systems, enabling containers to consume persistent storage from cloud providers or SAN hardware seamlessly." },
      { question: "How do you manage plugins in Docker?", answer: "Using the `docker plugin` CLI commands (install, ls, enable, disable, rm)." }
    ],
    practicalTask: {
      scenario: "Investigating Docker capabilities.",
      task: "List all installed Docker plugins.",
      solutionCode: "docker plugin ls"
    }
  },
  {
    slug: "docker-in-production",
    title: "38. Docker in Production",
    order: 38,
    content: "<h2>Best Practices and Scaling</h2><p>Running Docker in production requires discipline. Use official and verified base images. Never run as root. Set CPU/Memory limits. Centralize logging to a system like ELK or Splunk. Use healthchecks in Dockerfiles. Ensure images are immutable (tag with versions, not just 'latest'). Utilize orchestration (Kubernetes) for zero-downtime deployments and auto-scaling.</p>",
    interviewQuestions: [
      { question: "Why shouldn't you rely on the 'latest' tag in production?", answer: "The 'latest' tag is mutable. If an image is updated on the registry and a node pulls it, it might introduce breaking changes unexpectedly. Always pin to specific version tags (e.g., `node:18.4.0`)." },
      { question: "What is the role of a Docker HEALTHCHECK?", answer: "It tells Docker how to test the container to check that it is still working. If it fails, Docker can mark it unhealthy, and orchestrators can automatically restart or replace it." }
    ],
    practicalTask: {
      scenario: "Adding a healthcheck to a web container.",
      task: "Write a Dockerfile instruction to curl localhost every 30s.",
      solutionCode: "HEALTHCHECK --interval=30s CMD curl -f http://localhost/ || exit 1"
    }
  },
  {
    slug: "docker-containerd-runc",
    title: "39. Exploring Containerd and RunC",
    order: 39,
    content: "<h2>Under the Hood</h2><p>Docker is not a monolithic program. It relies on standard lower-level components. `containerd` manages the complete container lifecycle of its host system, from image transfer to container execution. `runc` is the lightweight, CLI wrapper for libcontainer used to spawn and run containers according to the OCI (Open Container Initiative) specification.</p>",
    interviewQuestions: [
      { question: "What is the OCI (Open Container Initiative)?", answer: "A governance board that creates open industry standards around container formats and runtimes to ensure interoperability between tools (like Docker, Podman, and Kubernetes)." },
      { question: "What is the relationship between Docker, containerd, and runc?", answer: "Docker Daemon uses containerd to manage images and lifecycles. Containerd, in turn, uses runc to actually create and run the container processes at the OS level." }
    ],
    practicalTask: {
      scenario: "Curiosity about the lower levels.",
      task: "Check the version of containerd on your system.",
      solutionCode: "containerd --version"
    }
  },
  {
    slug: "docker-future",
    title: "40. Future of Containerization",
    order: 40,
    content: "<h2>WASM, Podman, and Beyond</h2><p>Containerization is evolving. Podman is a popular daemonless alternative to Docker that doesn't require root privileges. WebAssembly (WASM) is emerging as a secure, extremely fast alternative to traditional containers, capable of running compiled languages at near-native speed outside the browser. Docker now supports WASM workloads, blending traditional containers with WASM modules.</p>",
    interviewQuestions: [
      { question: "How does Podman differ fundamentally from Docker?", answer: "Podman is daemonless and runs containers by default as rootless (without root privileges), making it inherently more secure in many environments." },
      { question: "Why is WebAssembly (WASM) being considered the next step in containerization?", answer: "WASM modules are much smaller than Linux containers, start in milliseconds, and provide a strong security sandbox natively, making them ideal for edge computing and serverless architectures." }
    ],
    practicalTask: {
      scenario: "Exploring alternatives.",
      task: "Assuming podman is installed, run a hello-world container with it (the syntax is identical to docker).",
      solutionCode: "podman run hello-world"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
