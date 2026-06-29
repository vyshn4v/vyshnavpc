import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'chapter-6-container-lifecycle-cli',
    title: 'Chapter 6: Managing Container Lifecycle and CLI Mastery',
    order: 6,
    content: `
<h2>1. The Container Lifecycle</h2>
<p>A Docker container transitions through several states during its lifecycle: <strong>Created, Running, Paused, Stopped, and Deleted</strong>.</p>
<p>Understanding these states and how to transition between them using the Docker CLI is fundamental to managing your applications effectively.</p>

<h2>2. Starting and Stopping Containers</h2>
<p>The <code>docker run</code> command is a shortcut that actually performs two distinct operations: <code>docker create</code> (creates a container from an image) and <code>docker start</code> (starts the created container).</p>
<pre><code class="language-bash">
# Create and start a container in the background (-d for detached)
docker run -d --name my_web_server nginx

# Stop a running container gracefully (sends SIGTERM, then SIGKILL if it doesn't stop)
docker stop my_web_server

# Start a stopped container
docker start my_web_server

# Forcefully stop a container immediately (sends SIGKILL)
docker kill my_web_server
</code></pre>

<h2>3. Interacting with Running Containers</h2>
<p>Once a container is running, especially in the background (detached mode), you often need to see what it's doing or execute commands inside it.</p>
<pre><code class="language-bash">
# View real-time logs of a container
docker logs -f my_web_server

# Execute an interactive shell session inside a running container
docker exec -it my_web_server /bin/bash
</code></pre>
<p>The <code>docker exec</code> command is invaluable for debugging. It spawns a new process inside the existing namespaces of the running container.</p>

<h2>4. Inspecting and Monitoring</h2>
<p>To understand the configuration, network settings, and volume mounts of a container, you use <code>docker inspect</code>, which returns detailed JSON metadata.</p>
<p>To monitor resource usage (CPU, Memory, Network I/O) in real-time across your containers, use <code>docker stats</code>.</p>
<pre><code class="language-bash">
# Get detailed JSON metadata
docker inspect my_web_server

# View live resource usage statistics
docker stats
</code></pre>

<h2>5. Cleaning Up</h2>
<p>Stopped containers and unused images consume significant disk space over time. Docker provides bulk cleanup commands.</p>
<pre><code class="language-bash">
# Remove a specific stopped container
docker rm my_web_server

# Remove a specific image
docker rmi nginx

# The nuclear option: Remove all stopped containers, unused networks, and dangling images
docker system prune -a
</code></pre>
`,
    interviewQuestions: [
      {
        question: "Explain the difference between `docker run` and `docker start`.",
        answer: "`docker run` creates a brand new container instance from a specified image and starts it. `docker start` is used to launch an existing, previously stopped container without creating a new instance."
      },
      {
        question: "How do you execute a command or open a shell inside a container that is already running in the background?",
        answer: "You use the `docker exec` command. For an interactive shell, you use the flags `-it` along with the container name and the shell executable, e.g., `docker exec -it container_name /bin/bash` or `sh`."
      },
      {
        question: "What is the difference between `docker stop` and `docker kill`?",
        answer: "`docker stop` sends a SIGTERM signal to the main process (PID 1) in the container, allowing it to shut down gracefully. If it doesn't stop after a grace period, it sends SIGKILL. `docker kill` immediately sends a SIGKILL signal, forcibly terminating the process without a graceful shutdown."
      },
      {
        question: "If a container crashes immediately upon starting, how would you investigate the cause?",
        answer: "The first step is to use `docker logs <container_name>` to view the standard output and standard error from the application. If more detail is needed, `docker inspect <container_name>` can show the container's configuration and exit codes."
      },
      {
        question: "What does the `docker system prune` command do, and why should you be careful using it?",
        answer: "`docker system prune` removes all stopped containers, all networks not used by at least one container, all dangling images, and build cache. If used with the `-a` flag, it wipes out any image not currently attached to a running container, meaning you might have to redownload large images you intended to keep."
      }
    ],
    practicalTask: {
      scenario: "You need to access the logs of a container named 'frontend-app' and tail them in real time.",
      task: "Write the command to view the logs of the container 'frontend-app' continuously.",
      solutionCode: "docker logs -f frontend-app"
    }
  },
  {
    slug: 'chapter-7-docker-volumes-persistence',
    title: 'Chapter 7: Docker Volumes: Persistent Data and Bind Mounts',
    order: 7,
    content: `
<h2>1. The Problem with Container File Systems</h2>
<p>By default, all files created inside a container are stored on a writable container layer. This means that the data doesn't persist when the container is removed, and it can be difficult to extract data from the container to the host machine. Furthermore, writing to the container's writable layer requires a storage driver to manage a union filesystem, which is less performant than writing directly to the host filesystem.</p>

<h2>2. Introduction to Volumes</h2>
<p>Volumes are the preferred mechanism for persisting data generated by and used by Docker containers. While bind mounts are dependent on the directory structure and OS of the host machine, volumes are completely managed by Docker.</p>
<p>Volumes are stored within a directory on the Docker host (<code>/var/lib/docker/volumes/</code> on Linux) that is managed by Docker. Non-Docker processes should not modify this part of the filesystem.</p>

<h2>3. Creating and Managing Volumes</h2>
<pre><code class="language-bash">
# Create a volume
docker volume create my-vol

# List volumes
docker volume ls

# Inspect a volume to find its mountpoint on the host
docker volume inspect my-vol

# Run a container using a volume (modern --mount syntax)
docker run -d \
  --name devtest \
  --mount source=my-vol,target=/app \
  nginx:latest
</code></pre>

<h2>4. Bind Mounts: Bridging Host and Container</h2>
<p>Bind mounts have limited functionality compared to volumes. When you use a bind mount, a file or directory on the host machine is mounted into a container. The file or directory is referenced by its absolute path on the host machine.</p>
<p>Bind mounts are exceptionally useful for local development because they allow source code changes made on the host (e.g., in your IDE) to be immediately reflected inside the running container without a rebuild.</p>
<pre><code class="language-bash">
# Running a container with a bind mount for live code reloading
docker run -d \
  --name web_dev \
  --mount type=bind,source="$(pwd)"/src,target=/usr/share/nginx/html \
  -p 8080:80 \
  nginx:latest
</code></pre>

<h2>5. tmpfs Mounts</h2>
<p>A <code>tmpfs</code> mount is not persisted on disk, either on the Docker host or within a container. It is written completely to the host's memory (RAM). This is useful for temporarily storing sensitive files that you don't want to persist in either the host or the container writable layer, or to improve performance for applications that write massive amounts of non-persistent state data.</p>
`,
    interviewQuestions: [
      {
        question: "Why should you not rely on the container's writable layer for data persistence?",
        answer: "The writable layer is tightly coupled to the container's lifecycle. When the container is deleted, the writable layer and all data within it are destroyed. Additionally, performance is lower because data must be written through a storage driver managing the union filesystem."
      },
      {
        question: "What is the primary difference between a Docker Volume and a Bind Mount?",
        answer: "Docker Volumes are created and fully managed by Docker, stored in an isolated area of the host filesystem, and are OS-independent. Bind Mounts tie a container directly to a specific absolute path on the host's filesystem, making them dependent on the host OS directory structure but excellent for live-reloading code during local development."
      },
      {
        question: "What is the recommended syntax for mounting volumes and bind mounts in newer Docker versions?",
        answer: "While the older `-v` or `--volume` flag is still supported, the recommended flag is `--mount` because its syntax is more explicit, verbose, and less prone to user error (e.g., `--mount type=volume,source=myvol,target=/data`)."
      },
      {
        question: "What happens if you mount a completely empty Volume into a container directory that already contains files in the image?",
        answer: "If you mount an empty volume into a directory that already contains files or directories within the image, those existing files and directories are copied into the volume before the container starts. This pre-populates the volume."
      },
      {
        question: "In what scenario would you use a tmpfs mount?",
        answer: "You use a tmpfs mount when you need to store temporary, sensitive information (like secrets, keys, or passwords) that should never be written to a physical disk, or when you need ultra-fast read/write operations for ephemeral data, as it resides entirely in host RAM."
      }
    ],
    practicalTask: {
      scenario: "You are setting up a PostgreSQL database container and need to ensure its data is persisted even if the container is removed.",
      task: "Write a command to run a postgres container named 'mydb', using a Docker volume named 'pgdata' mounted to the standard postgres data directory '/var/lib/postgresql/data'. Set the POSTGRES_PASSWORD environment variable to 'secret'.",
      solutionCode: "docker run -d --name mydb -e POSTGRES_PASSWORD=secret --mount source=pgdata,target=/var/lib/postgresql/data postgres"
    }
  },
  {
    slug: 'chapter-8-docker-networking-fundamentals',
    title: 'Chapter 8: Docker Networking Fundamentals: Bridge, Host, and Overlay',
    order: 8,
    content: `
<h2>1. Docker Network Drivers Overview</h2>
<p>Docker's networking subsystem is pluggable, using drivers to provide different networking behaviors. When you install Docker, it automatically creates three default networks. Understanding these drivers is critical for securely connecting containers to each other and to the outside world.</p>

<h2>2. The Default Bridge Network</h2>
<p>The <code>bridge</code> network driver is the default. If you don't specify a network when running a container, it connects to the default bridge network. A bridge network is a Link Layer device that forwards traffic between network segments.</p>
<p>Containers on the default bridge network can communicate with each other by IP address. However, they <strong>cannot</strong> communicate by container name. This is a crucial limitation of the default bridge.</p>

<h2>3. User-Defined Bridge Networks</h2>
<p>For production and multi-container applications on a single host, you should always create a <strong>User-Defined Bridge Network</strong>. User-defined bridges provide automatic DNS resolution between containers.</p>
<pre><code class="language-bash">
# Create a custom bridge network
docker network create my_app_net

# Run containers on that network
docker run -d --name db --network my_app_net mongo
docker run -d --name api --network my_app_net -p 8080:8080 my_api

# The 'api' container can now connect to MongoDB simply using the hostname 'db'
# e.g., mongodb://db:27017
</code></pre>

<h2>4. The Host Network</h2>
<p>If you use the <code>host</code> network driver for a container, that container's network stack is not isolated from the Docker host. The container shares the host's networking namespace, and the container does not get its own IP-address allocated.</p>
<p>For instance, if you run an Nginx container on port 80 and use <code>--network host</code>, the Nginx application is available directly on port 80 of the host machine's IP address. This removes network isolation but provides maximum performance since it bypasses Docker's proxy/NAT layer.</p>

<h2>5. Overlay and Macvlan Networks</h2>
<ul>
  <li><strong>Overlay Networks:</strong> Connect multiple Docker daemons together and enable swarm services to communicate with each other. You use overlay networks to facilitate communication between containers running on different physical or virtual hosts.</li>
  <li><strong>Macvlan Networks:</strong> Allow you to assign a MAC address to a container, making it appear as a physical device on your network. The Docker daemon routes traffic to containers by their MAC addresses. This is often used for legacy applications that expect to be directly connected to the physical network.</li>
</ul>
`,
    interviewQuestions: [
      {
        question: "What is the primary limitation of the default 'bridge' network compared to a user-defined bridge network?",
        answer: "Containers on the default bridge network can only communicate via IP addresses. User-defined bridge networks provide automatic DNS resolution, allowing containers to discover and communicate with each other using their container names as hostnames."
      },
      {
        question: "What happens when a container is started with `--network host`?",
        answer: "The container bypasses Docker's network isolation entirely and shares the host machine's networking namespace. It does not get its own IP address, and port mapping (-p) is ignored. An application listening on port 80 in the container will bind directly to port 80 of the host."
      },
      {
        question: "In what scenario would you absolutely need an 'overlay' network?",
        answer: "An overlay network is required when you need containers to securely communicate with each other across multiple distinct Docker hosts (e.g., in a Docker Swarm or Kubernetes cluster), abstracting the underlying physical network infrastructure."
      },
      {
        question: "How do you expose a container's port to the outside world?",
        answer: "You use the `-p` or `--publish` flag with `docker run`. The syntax is `-p <host_port>:<container_port>`. This creates a firewall rule in the host OS that forwards traffic from the host's interface port to the specified port inside the container's isolated network space."
      },
      {
        question: "What does the `none` network driver do?",
        answer: "The `none` driver completely disables networking for a container. The container gets a network namespace but only has a loopback interface (`lo`). It cannot communicate with the outside world or other containers, which is useful for highly secure, isolated batch-processing jobs."
      }
    ],
    practicalTask: {
      scenario: "You need to set up two containers (a web app and a redis cache) that can communicate with each other by name, rather than IP address.",
      task: "Write the commands to create a custom network named 'backend', start a redis container on that network, and start an alpine container that pings the 'redis' container by name.",
      solutionCode: "docker network create backend\ndocker run -d --name redis --network backend redis:alpine\ndocker run --rm --network backend alpine ping -c 3 redis"
    }
  },
  {
    slug: 'chapter-9-docker-compose-orchestrating',
    title: 'Chapter 9: Docker Compose: Orchestrating Multi-Container Applications',
    order: 9,
    content: `
<h2>1. Beyond Single Containers</h2>
<p>While the <code>docker run</code> command is powerful, modern applications are rarely just a single container. A typical web application requires a frontend, a backend API, a database, and perhaps a caching layer like Redis. Managing multiple interconnected containers via CLI commands quickly becomes unmanageable and error-prone.</p>

<h2>2. Enter Docker Compose</h2>
<p>Docker Compose is a tool for defining and running multi-container Docker applications. You define your entire application stack, including services, networks, and volumes, in a single YAML file called <code>docker-compose.yml</code>. Then, with a single command, you create and start all the services from your configuration.</p>

<h2>3. Anatomy of a docker-compose.yml file</h2>
<p>A Compose file consists of several top-level elements: <code>version</code>, <code>services</code>, <code>networks</code>, and <code>volumes</code>.</p>
<pre><code class="language-yaml">
version: '3.8'

services:
  web:
    build: ./frontend
    ports:
      - "3000:3000"
    networks:
      - app_net

  api:
    image: my-api:latest
    environment:
      - DB_HOST=db
    ports:
      - "8080:8080"
    networks:
      - app_net
    depends_on:
      - db

  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: mysecretpassword
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - app_net

networks:
  app_net:

volumes:
  pg_data:
</code></pre>

<h2>4. Core Compose Commands</h2>
<p>Docker Compose provides a powerful CLI to manage the lifecycle of the entire stack defined in the YAML file.</p>
<pre><code class="language-bash">
# Build images and start all services in the background
docker-compose up -d

# View logs for all services combined
docker-compose logs -f

# Stop and remove containers, networks, and images created by 'up'
docker-compose down

# Stop the containers without removing them
docker-compose stop
</code></pre>

<h2>5. Automatic Networking in Compose</h2>
<p>One of the best features of Docker Compose is that it automatically sets up a single default network for your app. All services defined in the file join that network, and they are both reachable by other containers on that network, and discoverable by them at a hostname identical to the container name (the service key in the YAML file).</p>
`,
    interviewQuestions: [
      {
        question: "What is Docker Compose and what problem does it solve?",
        answer: "Docker Compose is an orchestration tool used for defining and running multi-container applications. It solves the problem of managing complex applications with multiple services, networks, and volumes by allowing you to define the entire infrastructure as code in a single YAML file and spin it up with a single command."
      },
      {
        question: "In a docker-compose.yml file, what happens if you don't explicitly define a 'networks' section?",
        answer: "If you don't define custom networks, Docker Compose automatically creates a single default bridge network for the application. All services defined in the compose file are attached to this default network and can automatically communicate with each other using their service names as hostnames."
      },
      {
        question: "What does `docker-compose down` do?",
        answer: "`docker-compose down` stops all running containers defined in the compose file and removes those containers, along with the default network it created. It does NOT remove named volumes by default unless you pass the `-v` flag."
      },
      {
        question: "Explain the difference between `build` and `image` directives in a docker-compose.yml service definition.",
        answer: "The `image` directive tells Compose to pull a specific pre-built image from a registry (or use a local one) to run the container. The `build` directive provides a path to a directory containing a Dockerfile; Compose will actually build a new image from that Dockerfile before running the container."
      },
      {
        question: "How can you scale a specific service to run multiple instances using Docker Compose?",
        answer: "You can use the `--scale` flag with the `up` command, for example: `docker-compose up -d --scale web=3`. Note that you must ensure you haven't mapped a static host port for that service (like `80:80`), otherwise, the scaling will fail due to port conflicts on the host."
      }
    ],
    practicalTask: {
      scenario: "You have a docker-compose.yml file that starts your stack, but one of the containers is failing and restarting repeatedly. You need to see the logs specifically for the 'api' service to debug it.",
      task: "Write the docker-compose command to view and continuously follow the logs for only the 'api' service.",
      solutionCode: "docker-compose logs -f api"
    }
  },
  {
    slug: 'chapter-10-advanced-docker-compose',
    title: 'Chapter 10: Advanced Docker Compose: Depends On, Healthchecks, and Profiles',
    order: 10,
    content: `
<h2>1. The Problem with Startup Order</h2>
<p>By default, Docker Compose starts all services simultaneously. If your backend API starts up faster than your PostgreSQL database, the API might try to connect, fail, and crash. While you could configure the API to auto-restart, a cleaner solution is to control the startup order.</p>

<h2>2. Using depends_on</h2>
<p>The <code>depends_on</code> directive expresses dependency between services. Compose will start dependencies before the services that rely on them.</p>
<pre><code class="language-yaml">
services:
  web:
    build: .
    depends_on:
      - db
      - redis
  redis:
    image: redis
  db:
    image: postgres
</code></pre>
<p><strong>Crucial Caveat:</strong> Standard <code>depends_on</code> only waits until the container is <em>started</em>, not until the application inside it is <em>ready</em> to accept connections. A database container starts instantly, but the DB engine might take 10 seconds to initialize.</p>

<h2>3. Healthchecks to the Rescue</h2>
<p>To solve the "ready" problem, Docker allows you to define Healthchecks. A healthcheck is a command run periodically inside the container. If the command succeeds (exit code 0), the container is "healthy".</p>
<p>You can then combine <code>depends_on</code> with a condition to wait for the healthcheck to pass.</p>
<pre><code class="language-yaml">
services:
  api:
    image: my-api
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
</code></pre>

<h2>4. Environment Variables and .env files</h2>
<p>Hardcoding secrets in <code>docker-compose.yml</code> is a security risk. Compose natively supports reading environment variables from a <code>.env</code> file placed in the same directory.</p>
<p>You can interpolate these variables into your compose file using the <code>\${VAR_NAME}</code> syntax.</p>
<pre><code class="language-yaml">
# .env file contains: POSTGRES_USER=admin

# docker-compose.yml
services:
  db:
    image: postgres
    environment:
      - POSTGRES_USER=\${POSTGRES_USER}
</code></pre>

<h2>5. Compose Profiles</h2>
<p>Profiles allow you to define multiple environments within a single compose file. Services can be assigned to one or more profiles. When you start Compose, you specify which profile(s) to activate.</p>
<p>This is useful for running a "full" environment with monitoring tools vs. a "light" environment for fast frontend development.</p>
<pre><code class="language-yaml">
services:
  frontend:
    image: my-frontend
  backend:
    image: my-backend
  prometheus-metrics:
    image: prom/prometheus
    profiles: ["monitoring", "full"]
</code></pre>
<p>Run with: <code>docker-compose --profile monitoring up -d</code></p>
`,
    interviewQuestions: [
      {
        question: "Why is a basic `depends_on` directive often insufficient for ensuring an API successfully connects to a database container on startup?",
        answer: "A basic `depends_on` only guarantees that the database container process has started before the API container starts. It does NOT wait for the database engine software (like PostgreSQL or MySQL) inside the container to fully initialize and be ready to accept connections. The API might start and fail before the DB is ready."
      },
      {
        question: "How do you combine `depends_on` and healthchecks to ensure proper startup sequencing?",
        answer: "You first define a `healthcheck` block in the dependency service (e.g., the database) that runs a command to verify readiness (like pg_isready). Then, in the dependent service (the API), you use the long-form `depends_on` syntax and set the `condition` to `service_healthy`."
      },
      {
        question: "How does Docker Compose handle `.env` files by default?",
        answer: "If a file named `.env` exists in the directory where the `docker-compose` command is run, Compose automatically reads it. The variables in this file can be used for variable substitution within the `docker-compose.yml` file itself (e.g., using `${VAR_NAME}`)."
      },
      {
        question: "What are Docker Compose Profiles used for?",
        answer: "Profiles allow you to group services into distinct environments or use cases within a single compose file. For example, you can have a 'debug' profile that starts additional logging and profiling containers, allowing developers to selectively spin up only the services they need for their current task."
      },
      {
        question: "If you have an `environment` block in your docker-compose.yml AND a `.env` file containing the same variable, which one takes precedence?",
        answer: "Values defined directly in the `environment` block of the `docker-compose.yml` file (or passed via the shell environment where the command is executed) take precedence over values defined in the `.env` file. The `.env` file is meant for default values."
      }
    ],
    practicalTask: {
      scenario: "You are defining a Redis container in a docker-compose file and want to add a healthcheck using the redis-cli tool.",
      task: "Write the YAML block for a Redis service that includes a healthcheck executing 'redis-cli ping', running every 10 seconds, with a 5 second timeout and 3 retries.",
      solutionCode: "services:\n  redis:\n    image: redis:alpine\n    healthcheck:\n      test: [\"CMD\", \"redis-cli\", \"ping\"]\n      interval: 10s\n      timeout: 5s\n      retries: 3"
    }
  }
];

appendTopics('docker', 'Docker Containerization', 'The definitive guide.', topics);
