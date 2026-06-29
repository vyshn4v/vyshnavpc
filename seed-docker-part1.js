import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-intro",
    title: "1. Introduction to Docker",
    order: 1,
    content: "<h2>What is Docker?</h2><p>Docker is an open-source platform that automates the deployment, scaling, and management of applications inside lightweight, portable environments called containers. Unlike virtual machines (VMs) that virtualize the entire hardware stack and OS, containers virtualize at the OS level, sharing the host kernel.</p>",
    interviewQuestions: [
      { question: "What is the difference between Docker containers and Virtual Machines?", answer: "VMs virtualize the hardware and require a full Guest OS, making them heavy. Containers share the Host OS kernel, making them lightweight, fast to start, and resource-efficient." },
      { question: "What is containerization?", answer: "Containerization is a form of OS-level virtualization where applications run in isolated user spaces (containers) using the same shared operating system kernel." }
    ],
    practicalTask: {
      scenario: "Explain Docker to a beginner.",
      task: "Run your very first container to see Docker in action.",
      solutionCode: "docker run hello-world"
    }
  },
  {
    slug: "docker-architecture",
    title: "2. Docker Architecture",
    order: 2,
    content: "<h2>Docker Daemon and Client</h2><p>Docker uses a client-server architecture. The Docker Client communicates with the Docker Daemon (dockerd), which does the heavy lifting of building, running, and distributing containers. They communicate via REST API over UNIX sockets or a network interface. Components include the Daemon, Client, Images, Containers, and Registries.</p>",
    interviewQuestions: [
      { question: "What are the main components of Docker Architecture?", answer: "Docker Daemon (background service), Docker Client (CLI), Docker Images, Docker Containers, and Docker Registries (like Docker Hub)." },
      { question: "How do the Docker client and daemon communicate?", answer: "They communicate using a REST API over UNIX sockets (locally) or TCP (remotely)." }
    ],
    practicalTask: {
      scenario: "You need to verify the Docker daemon is running.",
      task: "Check the version and system-wide information regarding the Docker installation.",
      solutionCode: "docker info"
    }
  },
  {
    slug: "docker-installation",
    title: "3. Installation and Setup",
    order: 3,
    content: "<h2>Setting up Docker Desktop</h2><p>Docker Desktop is an easy-to-install application for Mac, Windows, and Linux environments that enables you to build and share containerized applications. On Windows, it leverages WSL2 (Windows Subsystem for Linux 2) for near-native Linux kernel performance. On Linux, Docker Engine can be installed directly via package managers.</p>",
    interviewQuestions: [
      { question: "What is WSL2 and why is it important for Docker on Windows?", answer: "WSL2 is the Windows Subsystem for Linux version 2. It provides a real Linux kernel inside Windows, allowing Docker to run Linux containers natively and with much better performance than the older Hyper-V method." },
      { question: "How do you verify a successful Docker installation?", answer: "By running the command 'docker --version' or running the 'hello-world' image." }
    ],
    practicalTask: {
      scenario: "You have just installed Docker.",
      task: "Verify your Docker client and server versions.",
      solutionCode: "docker version"
    }
  },
  {
    slug: "docker-first-container",
    title: "4. Your First Docker Container",
    order: 4,
    content: "<h2>Running Containers</h2><p>The `docker run` command is used to run a container from an image. If the image is not available locally, Docker pulls it from the default registry (Docker Hub). For example, running an Nginx web server or an interactive Ubuntu shell.</p>",
    interviewQuestions: [
      { question: "What happens exactly when you type `docker run hello-world`?", answer: "1. The Docker client contacts the Docker daemon. 2. The daemon checks if the 'hello-world' image is locally available. 3. If not, it pulls it from Docker Hub. 4. The daemon creates a new container from that image. 5. The daemon runs the container, which executes the executable." },
      { question: "How do you run a container in interactive mode?", answer: "Use the -i (interactive) and -t (pseudo-TTY) flags: `docker run -it ubuntu bash`" }
    ],
    practicalTask: {
      scenario: "You need to spin up a quick web server to test locally.",
      task: "Run an Nginx container in detached mode, exposing it on port 8080.",
      solutionCode: "docker run -d -p 8080:80 nginx"
    }
  },
  {
    slug: "docker-images-intro",
    title: "5. Understanding Docker Images",
    order: 5,
    content: "<h2>Images and Layers</h2><p>A Docker image is a read-only template with instructions for creating a Docker container. Images are built in layers; each instruction in a Dockerfile creates a layer. These layers are cached, which makes rebuilding images very fast. Images are identified by repositories and tags (e.g., `nginx:latest` vs `nginx:1.21`).</p>",
    interviewQuestions: [
      { question: "What is a Docker Image?", answer: "A read-only template that contains a set of instructions for creating a container, including the code, runtime, libraries, environment variables, and config files." },
      { question: "What is the Union File System in Docker?", answer: "UnionFS allows files and directories of separate file systems (layers) to be transparently overlaid, forming a single file system. This is how Docker manages image layers." }
    ],
    practicalTask: {
      scenario: "You want to explore available images locally.",
      task: "List all downloaded Docker images and pull a specific version of Redis (version 6).",
      solutionCode: "docker images\ndocker pull redis:6"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
