import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-building-images",
    title: "6. Building Docker Images",
    order: 6,
    content: "<h2>Dockerfile Basics</h2><p>A Dockerfile is a text document that contains all the commands a user could call on the command line to assemble an image. The `docker build` command builds an image from a Dockerfile and a context (the set of files at a specified PATH or URL). Every Dockerfile must start with a `FROM` instruction to specify the base image.</p>",
    interviewQuestions: [
      { question: "What is a Dockerfile?", answer: "A plain text file containing a series of instructions and arguments used to automatically build a Docker image." },
      { question: "What is the build context?", answer: "The set of files located in the specified path or URL when you run `docker build`. These files are sent to the Docker daemon to be used during the build process." }
    ],
    practicalTask: {
      scenario: "You have a project directory with a Dockerfile.",
      task: "Build a Docker image from the current directory and tag it as 'my-app:1.0'.",
      solutionCode: "docker build -t my-app:1.0 ."
    }
  },
  {
    slug: "dockerfile-instructions",
    title: "7. Deep Dive into Dockerfile Instructions",
    order: 7,
    content: "<h2>CMD vs ENTRYPOINT</h2><p>There are subtle differences between instructions. `COPY` just copies files, while `ADD` can extract tar files and fetch from URLs. `CMD` provides default arguments for an executing container, which can be easily overridden. `ENTRYPOINT` configures a container that will run as an executable, and appending arguments to `docker run` will pass them to the ENTRYPOINT.</p>",
    interviewQuestions: [
      { question: "What is the difference between COPY and ADD?", answer: "COPY only copies files from the host to the container. ADD does that, plus it can extract local tar archives and fetch files from remote URLs." },
      { question: "What is the difference between CMD and ENTRYPOINT?", answer: "ENTRYPOINT sets the main executable for the container. CMD provides default arguments to the ENTRYPOINT. If no ENTRYPOINT is set, CMD acts as the default command, but is easily overridden by `docker run` arguments." }
    ],
    practicalTask: {
      scenario: "You want a container to always run 'ping' but allow the user to specify the target.",
      task: "Write the CMD and ENTRYPOINT instructions to default to 'google.com'.",
      solutionCode: "ENTRYPOINT [\"ping\"]\nCMD [\"google.com\"]"
    }
  },
  {
    slug: "docker-multi-stage",
    title: "8. Multi-stage Builds",
    order: 8,
    content: "<h2>Optimizing Image Size</h2><p>Multi-stage builds are useful to optimize Dockerfiles while keeping them easy to read and maintain. You can use multiple `FROM` statements in your Dockerfile. Each `FROM` instruction begins a new stage of the build. You can selectively copy artifacts from one stage to another, leaving behind everything you don't want in the final image.</p>",
    interviewQuestions: [
      { question: "Why use multi-stage builds?", answer: "To reduce the final image size and improve security by separating the build environment (compilers, dev tools) from the runtime environment (only compiled binaries)." },
      { question: "How do you copy a file from a previous build stage?", answer: "Using the COPY instruction with the --from flag, e.g., `COPY --from=builder /app/main .`" }
    ],
    practicalTask: {
      scenario: "You have compiled a Go binary in an earlier stage named 'builder'.",
      task: "Write the Dockerfile instruction to copy the binary '/app/main' to the current stage.",
      solutionCode: "COPY --from=builder /app/main /app/main"
    }
  },
  {
    slug: "docker-managing-containers",
    title: "9. Managing Containers",
    order: 9,
    content: "<h2>Container Lifecycle</h2><p>A container can be in various states: created, running, paused, stopped, or dead. Use `docker ps` to see running containers, and `docker ps -a` for all. Use `docker stop`, `docker start`, and `docker rm` to manage their lifecycles. Removing a container deletes its read-write layer, meaning any data not stored in a volume is lost.</p>",
    interviewQuestions: [
      { question: "What is the difference between `docker stop` and `docker kill`?", answer: "`docker stop` sends a SIGTERM signal allowing a graceful shutdown, followed by a SIGKILL after a grace period. `docker kill` sends a SIGKILL immediately." },
      { question: "How do you execute a command inside a running container?", answer: "Using the `docker exec` command. For example, `docker exec -it <container_id> bash`." }
    ],
    practicalTask: {
      scenario: "You have a stopped container with the ID 'abc12345'.",
      task: "Remove the container forcefully if necessary.",
      solutionCode: "docker rm -f abc12345"
    }
  },
  {
    slug: "docker-data-management",
    title: "10. Container Data Management",
    order: 10,
    content: "<h2>Volumes vs Bind Mounts</h2><p>By default, all files created inside a container are stored on a writable container layer. To persist data, Docker uses Volumes and Bind Mounts. Volumes are managed by Docker and are the preferred mechanism for persisting data. Bind mounts are dependent on the host machine's directory structure.</p>",
    interviewQuestions: [
      { question: "What is a Docker Volume?", answer: "A Docker volume is a managed file system created by Docker and stored on the host machine, bypassing the container's UnionFS for data persistence and sharing." },
      { question: "When should you use a Bind Mount over a Volume?", answer: "Bind mounts are useful in local development when you want to mount source code into the container and see live changes. Volumes are preferred for production databases and persistent application data." }
    ],
    practicalTask: {
      scenario: "You are running a PostgreSQL container and want its data to persist.",
      task: "Create a named volume 'pgdata' and run the postgres container mounting it to '/var/lib/postgresql/data'.",
      solutionCode: "docker volume create pgdata\ndocker run -d -v pgdata:/var/lib/postgresql/data postgres"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
