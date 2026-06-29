import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-plugins",
    title: "Docker Plugins: Volume, Network, and Authorization",
    order: 21,
    content: `
# Docker Plugins: Extending the Docker Ecosystem

Docker's architecture is highly modular, allowing its core capabilities to be extended via Plugins. Instead of baking every conceivable storage driver or network protocol into the Docker daemon, Docker provides an API for third-party developers to integrate external systems seamlessly. 

Plugins run as out-of-process daemons, either as specialized Docker containers (Managed Plugins) or as standalone processes on the host.

## The Docker Plugin Architecture
Docker communicates with plugins using HTTP over Unix Domain Sockets or standard TCP sockets. When a user requests a specific volume driver (e.g., \`-v myvol:/data --volume-driver my-plugin\`), the Docker daemon sends an HTTP \`POST /VolumeDriver.Create\` request to the plugin.

### Managed Plugins vs. Legacy Plugins
- **Legacy Plugins**: Standalone processes installed directly on the host OS (e.g., via \`apt\` or \`yum\`). The host administrator is responsible for their lifecycle.
- **Managed Plugins**: Introduced in Docker 1.13, these are distributed as Docker images and managed entirely via the \`docker plugin\` CLI. They run as highly restricted, containerized processes.

## Types of Plugins

### 1. Volume Plugins
Volume plugins connect Docker to external storage arrays, cloud block storage, or distributed file systems. 
Examples include plugins for NetApp, Pure Storage, AWS EBS, Azure Disk, and GlusterFS.

**Installing and using a managed volume plugin (e.g., SSHFS):**
\`\`\`bash
# Install the plugin from Docker Hub
docker plugin install vieux/sshfs

# Create a volume using the plugin
docker volume create -d vieux/sshfs \\
  -o sshcmd=user@192.168.1.10:/path/to/remote/dir \\
  -o password=secret \\
  my-ssh-vol

# Mount the volume to a container
docker run -d -v my-ssh-vol:/app/data nginx
\`\`\`

### 2. Network Plugins
Network plugins allow integration with third-party Software-Defined Networking (SDN) solutions like Weave, Calico, Flannel, or Cisco ACI. They implement the Container Network Model (CNM).

\`\`\`bash
# Install a network plugin (e.g., Weave)
docker plugin install weaveworks/net-plugin:latest_release

# Create a network using the custom driver
docker network create --driver=weaveworks/net-plugin my-weave-net
\`\`\`

### 3. Authorization (AuthZ) Plugins
AuthZ plugins intercept every REST API request sent to the Docker daemon before it is executed. They evaluate the request (e.g., User X wants to delete Container Y) against external policy engines like Open Policy Agent (OPA) or Casbin, and return an Allow or Deny response.

**Configuring an AuthZ plugin:**
1. Install the plugin (e.g., OPA docker authz plugin).
2. Configure the daemon to use the plugin by editing \`/etc/docker/daemon.json\`:
\`\`\`json
{
  "authorization-plugins": ["opa-docker-authz"]
}
\`\`\`
3. Restart the Docker daemon. Every \`docker run\` or \`docker stop\` command will now be subject to OPA policies.

## Managing Plugins lifecycle
Plugins have a lifecycle separate from standard containers:
\`\`\`bash
# List installed plugins
docker plugin ls

# Disable a plugin (required before updating or removing)
docker plugin disable vieux/sshfs

# Update a plugin
docker plugin upgrade vieux/sshfs vieux/sshfs:v2

# Re-enable the plugin
docker plugin enable vieux/sshfs
\`\`\`
`,
    interviewQuestions: [
      {
        question: "What is the difference between a Managed Docker Plugin and a Legacy Plugin?",
        answer: "Managed plugins are distributed as Docker images and are fully lifecycle-managed by the Docker daemon via the `docker plugin` CLI (install, enable, disable). Legacy plugins are standalone processes or systemd services installed directly on the host OS by the administrator, outside of Docker's control."
      },
      {
        question: "How does the Docker daemon communicate with a volume plugin?",
        answer: "The Docker daemon communicates with plugins via HTTP/JSON over Unix Domain Sockets (usually located in `/run/docker/plugins/`) or standard TCP sockets. When Docker needs to mount a volume, it sends specific HTTP POST requests (like `/VolumeDriver.Mount`) to the plugin's socket."
      },
      {
        question: "Give a use case for an Authorization (AuthZ) plugin.",
        answer: "An AuthZ plugin is used to enforce granular Access Control Policies over the Docker daemon. For example, in a multi-tenant environment, you could use an AuthZ plugin integrated with Open Policy Agent (OPA) to prevent users from binding to host ports below 1024, or to stop them from mounting sensitive host directories like `/etc`."
      },
      {
        question: "Can you update a running Managed Plugin? What are the steps?",
        answer: "You cannot update a plugin while it is active. The steps are: 1. `docker plugin disable <plugin-name>`, 2. `docker plugin upgrade <plugin-name> <new-image>`, 3. `docker plugin enable <plugin-name>`. Any containers relying on the plugin (like using its volumes) must usually be stopped first."
      },
      {
        question: "What is the purpose of Network Plugins, and name two popular examples.",
        answer: "Network plugins implement the Container Network Model (CNM) to integrate Docker with complex Software-Defined Networking (SDN) solutions, bypassing Docker's native bridge or overlay drivers. Popular examples include Calico (for fine-grained network policies) and Weave Net (for resilient, encrypted mesh networking)."
      }
    ],
    practicalTask: {
      scenario: "Your team needs to mount an SSH/SFTP directory directly into a Docker container securely without installing SSHFS on the host OS.",
      task: "Write the commands to install the `vieux/sshfs` managed plugin, create a volume using this driver, and run a busybox container that mounts this volume.",
      solutionCode: `
# 1. Install the managed plugin
docker plugin install vieux/sshfs

# 2. Create the volume via the plugin
docker volume create \\
  -d vieux/sshfs \\
  -o sshcmd=user@server.example.com:/home/user/data \\
  -o password=mypassword \\
  sshfs-vol

# 3. Mount it into a container
docker run -it --rm -v sshfs-vol:/remote-data busybox sh
      `
    }
  },
  {
    slug: "docker-remote-api",
    title: "Docker Remote API and Custom Client Integration",
    order: 22,
    content: `
# Docker Remote API: Controlling Docker Programmatically

The \`docker\` CLI is merely an HTTP client. Every command you execute—whether \`docker run\`, \`docker ps\`, or \`docker build\`—is translated into a REST API call to the Docker Engine API.

Mastering the Docker Remote API enables you to build custom orchestration tools, specialized CI/CD runners, and automated testing frameworks that interact directly with the daemon without relying on shell wrappers.

## Understanding the Engine API
The Engine API is versioned (e.g., \`v1.43\`). It defaults to communicating over a Unix socket at \`/var/run/docker.sock\`.

To interact with the socket directly using \`curl\`:
\`\`\`bash
# List containers (equivalent to docker ps)
curl --unix-socket /var/run/docker.sock http://localhost/v1.43/containers/json

# Inspect a specific container
curl --unix-socket /var/run/docker.sock http://localhost/v1.43/containers/my-container/json
\`\`\`

## Exposing the API over TCP
By default, the daemon only listens on the local Unix socket. To manage remote hosts, you must expose the API over TCP.

**SECURITY WARNING:** Exposing the Docker API over unencrypted TCP is catastrophic. Anyone who can reach the port has root-level access to the host. You MUST use Mutual TLS (mTLS).

### Securing the TCP Socket with mTLS
To enable mTLS, you must generate a Certificate Authority (CA), a server certificate, and client certificates.
Start the daemon with:
\`\`\`bash
dockerd \\
  --tlsverify \\
  --tlscacert=ca.pem \\
  --tlscert=server-cert.pem \\
  --tlskey=server-key.pem \\
  -H=0.0.0.0:2376
\`\`\`

Clients must then provide their certificates to connect:
\`\`\`bash
docker --tlsverify \\
  --tlscacert=ca.pem \\
  --tlscert=client-cert.pem \\
  --tlskey=client-key.pem \\
  -H=tcp://remote-host:2376 ps
\`\`\`

## Integrating with Custom Clients (SDKs)
Docker provides official SDKs for Python and Go, and the community maintains clients for Node.js, Java, and others.

### Python Example using \`docker-py\`
The Python SDK is heavily used in Ansible and custom automation scripts.
\`\`\`python
import docker

# Connects automatically using DOCKER_HOST env var or local socket
client = docker.from_env()

# Run a container in detached mode
container = client.containers.run(
    "nginx:latest", 
    detach=True, 
    ports={'80/tcp': 8080},
    name="my-python-nginx"
)

print(f"Container {container.id} started.")

# Stream logs
for line in container.logs(stream=True):
    print(line.decode('utf-8').strip())

# Stop and remove
container.stop()
container.remove()
\`\`\`

### Go Example using \`docker/docker/client\`
The Go SDK is extremely powerful, as it is derived from the same codebase used to build Docker itself.
\`\`\`go
package main

import (
	"context"
	"fmt"
	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

func main() {
	ctx := context.Background()
	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}

	containers, err := cli.ContainerList(ctx, types.ContainerListOptions{})
	if err != nil {
		panic(err)
	}

	for _, container := range containers {
		fmt.Printf("%s %s\\n", container.ID[:10], container.Image)
	}
}
\`\`\`

## Advanced API Features
The API allows for complex operations that are difficult via the CLI:
- **Streaming Attach/Exec**: Hijacking HTTP connections using connection upgrade protocols to stream \`stdin\`, \`stdout\`, and \`stderr\` directly to web sockets.
- **Event Subscriptions**: Listening to \`/events\` to trigger webhooks when containers start, die, or encounter OOM errors.
`,
    interviewQuestions: [
      {
        question: "How does the `docker` CLI communicate with the Docker daemon?",
        answer: "The `docker` CLI is a client that communicates with the Docker daemon's REST API. By default, it does this over a local Unix Domain Socket (`/var/run/docker.sock`), but it can also be configured to communicate over TCP using the `-H` flag or `DOCKER_HOST` environment variable."
      },
      {
        question: "Why is it extremely dangerous to expose the Docker TCP port (2375) without TLS?",
        answer: "The Docker daemon runs as root. If exposed without TLS authentication, anyone who can reach the network port can send API requests to run privileged containers, mount the host's root filesystem, and gain complete root control over the host machine."
      },
      {
        question: "What is Mutual TLS (mTLS) in the context of the Docker Engine API?",
        answer: "mTLS ensures that both the server (the Docker daemon) and the client (the Docker CLI or SDK) authenticate each other. The daemon verifies that the client's certificate was signed by a trusted CA, and the client verifies the daemon's certificate, providing both encryption and strong authorization."
      },
      {
        question: "What environment variable is read by Docker SDKs (like docker-py or the Go client) to determine connection settings?",
        answer: "The `DOCKER_HOST` environment variable specifies the socket or TCP address. Other relevant variables are `DOCKER_TLS_VERIFY` to enforce TLS, and `DOCKER_CERT_PATH` to define the directory containing the client certificates."
      },
      {
        question: "How would you use the Engine API to build a monitoring dashboard that updates immediately when a container crashes?",
        answer: "You would use the `/events` API endpoint. It streams JSON objects representing real-time daemon events. You can filter for event types like `container` and actions like `die` or `oom` (Out of Memory), and push these events to your dashboard via websockets."
      }
    ],
    practicalTask: {
      scenario: "You need to quickly query the local Docker daemon to get a list of running containers using standard Unix tools, without using the `docker` CLI executable.",
      task: "Write the `curl` command that interacts with the Docker Unix socket to hit the `/containers/json` API endpoint.",
      solutionCode: `
# Using curl to hit the Docker Engine API directly
curl -s --unix-socket /var/run/docker.sock http://localhost/v1.43/containers/json

# (Optional) Pipe to jq for readability
curl -s --unix-socket /var/run/docker.sock http://localhost/v1.43/containers/json | jq .
      `
    }
  },
  {
    slug: "advanced-docker-volumes",
    title: "Advanced Docker Volumes and Persistent Data Management",
    order: 23,
    content: `
# Advanced Docker Volumes: Data Resilience

Stateless containers are trivial to orchestrate. Stateful containers—databases, message queues, and caching layers—require meticulous data management. Docker provides three distinct mount types: Bind Mounts, Volumes, and tmpfs mounts. 

For advanced persistence, **Named Volumes** are the standard, but their behavior requires deep understanding.

## The Anatomy of a Docker Volume
Unlike bind mounts (which map a specific host path to a container path), Volumes are entirely managed by Docker within \`/var/lib/docker/volumes/\`.
- They isolate data from host OS configurations.
- They can be managed via the Docker API (\`docker volume create/rm\`).
- They can utilize third-party plugins (e.g., to back the volume on AWS EBS or an NFS server).

### Volume Population Strategy
When you mount an *empty* volume into a container directory that *already contains files*, Docker automatically copies the contents of the container directory into the volume before initiating the mount.

**Example:**
\`\`\`bash
docker run -v new_empty_vol:/var/lib/mysql mysql:8
\`\`\`
Because \`new_empty_vol\` is empty, Docker copies the initial database files created by the MySQL image into the volume. Subsequent runs will use these populated files.

*Note: This behavior ONLY applies to named volumes. Bind mounts will simply obscure/hide the container's directory contents.*

## Advanced Bind Mounts
Bind mounts are notoriously problematic across different operating systems (Windows/macOS vs. Linux) due to file permission disparities.

### Handling File Permissions
When a process inside a container creates a file on a bind mount, the file's owner is determined by the UID inside the container. If the container runs as root, the file on the host becomes owned by root, frustrating developers.

**Solutions:**
1. **User Namespaces**: Remaps UIDs as discussed in Security.
2. **Explicit User IDs**: Run the container with the host user's UID/GID.
   \`\`\`bash
   docker run -v $(pwd)/data:/app/data -u $(id -u):$(id -g) myapp
   \`\`\`
3. **Init Scripts (FixUID/gosu)**: Run the container as root, execute an entrypoint script that \`chown\`s the directory, and then drops privileges using \`gosu\` to execute the main app.

## Tmpfs Mounts
A \`tmpfs\` mount stores data purely in the host's memory (RAM) and never writes it to disk. 

**Use Cases:**
- Storing highly sensitive credentials, cryptographic keys, or tokens that must never persist on disk.
- High-performance, temporary scratch space for data processing applications.

\`\`\`bash
docker run -d \\
  --name secure-app \\
  --tmpfs /app/secrets:size=64m,noexec \\
  myapp:latest
\`\`\`

## Using NFS with Docker Volumes
Instead of installing an NFS client on every host and fighting with \`/etc/fstab\`, you can configure Docker Volumes to natively mount NFS shares using the local driver's advanced options.

\`\`\`bash
docker volume create --driver local \\
  --opt type=nfs \\
  --opt o=addr=192.168.1.100,rw,nfsvers=4 \\
  --opt device=:/mnt/nfs/shared_data \\
  my-nfs-vol

docker run -d -v my-nfs-vol:/app/data nginx
\`\`\`
This enables high availability; any node in a Swarm cluster can mount this volume and access identical data.

## Backing up and Restoring Volumes
Volumes cannot be simply \`cp\` copied safely while a container is running due to active file locks and database transactions.

**Backup Strategy:**
1. Mount the target volume and a backup directory (bind mount) into a temporary container.
2. Tar the contents.

\`\`\`bash
# Backup
docker run --rm \\
  -v my_database_data:/volume \\
  -v $(pwd):/backup \\
  ubuntu tar cvf /backup/db_backup.tar /volume

# Restore
docker run --rm \\
  -v new_database_data:/volume \\
  -v $(pwd):/backup \\
  ubuntu bash -c "cd /volume && tar xvf /backup/db_backup.tar --strip 1"
\`\`\`
`,
    interviewQuestions: [
      {
        question: "Explain the difference in behavior between mounting an empty named volume vs. a bind mount into a container directory that already contains files.",
        answer: "If you mount an empty named volume into a populated container directory, Docker automatically copies the container's files into the volume. If you use a bind mount (or a non-empty named volume), the mount simply overlays the container directory, obscuring the original files within the image."
      },
      {
        question: "What is a `tmpfs` mount and what are its primary use cases?",
        answer: "A `tmpfs` mount stores data temporarily in the host's RAM, never writing it to the host's persistent disk. It is used to store highly sensitive data (like decrypted secrets or private keys) to prevent disk forensics, or as ultra-fast scratch space for temporary processing tasks."
      },
      {
        question: "How do you resolve file ownership issues where a containerized app writes files to a bind mount as `root`, making them uneditable by the host developer?",
        answer: "You can resolve this by running the container with the host developer's UID and GID using `docker run -u $(id -u):$(id -g)`. Alternatively, you can use an entrypoint script with `gosu` to adjust file permissions as root before dropping privileges to run the app as a non-root user."
      },
      {
        question: "How can you mount an NFS share directly into a container without configuring the host OS `/etc/fstab`?",
        answer: "You can use the default `local` volume driver with advanced options to create a volume backed by NFS: `docker volume create --driver local --opt type=nfs --opt o=addr=NFS_IP,rw --opt device=:/path nfs-vol`."
      },
      {
        question: "Describe a safe methodology for backing up a Docker named volume.",
        answer: "You launch an ephemeral (temporary) container using `--rm`. You mount the named volume to be backed up (e.g., `/data`), and you bind-mount a host directory (e.g., `/backup`). Inside the container, you use `tar` to archive the contents of `/data` and save it to `/backup/archive.tar`."
      }
    ],
    practicalTask: {
      scenario: "You need to store cryptographic keys inside a container at `/etc/secrets`, but security policy dictates these keys must never touch the host's hard drive.",
      task: "Write the `docker run` command to start an `alpine` container with an interactive shell, utilizing a RAM-based mount for `/etc/secrets` limited to 10 Megabytes.",
      solutionCode: `
# Use the --tmpfs flag with size limits
docker run -it --rm \\
  --tmpfs /etc/secrets:size=10m,noexec,nosuid \\
  alpine sh

# Alternatively, using the newer --mount syntax
docker run -it --rm \\
  --mount type=tmpfs,destination=/etc/secrets,tmpfs-size=10m,tmpfs-mode=1770 \\
  alpine sh
      `
    }
  },
  {
    slug: "docker-compose-complex-workflows",
    title: "Docker Compose for Complex Multi-Environment Workflows",
    order: 24,
    content: `
# Docker Compose for Complex Multi-Environment Workflows

Docker Compose (\`docker-compose.yml\`) is indispensable for defining multi-container applications. However, using a single \`docker-compose.yml\` file rapidly becomes unmanageable when dealing with distinct environments (Development, Staging, CI, Production) that require different configurations, exposed ports, and volume mounts.

## The Multiple File Strategy (Overrides)
Docker Compose supports reading from multiple files simultaneously, merging them in the order specified. By default, if \`docker-compose.yml\` and \`docker-compose.override.yml\` exist, Compose merges them automatically.

### The Base Compose File (\`docker-compose.yml\`)
This file should contain the **baseline production-ready** configuration. It includes the image names, internal networks, and generic environment variables. It should *not* contain development-specific bind mounts or debug ports.

\`\`\`yaml
# docker-compose.yml (Base)
version: '3.8'
services:
  web:
    image: mycorp/webapp:latest
    networks:
      - internal
    environment:
      - NODE_ENV=production
  db:
    image: postgres:14
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - internal
volumes:
  db-data:
networks:
  internal:
\`\`\`

### The Development Override (\`docker-compose.dev.yml\`)
This file overrides or appends to the base file. It maps host ports, mounts source code, and changes environment variables for local development.

\`\`\`yaml
# docker-compose.dev.yml
version: '3.8'
services:
  web:
    build:
      context: .
      target: dev
    ports:
      - "3000:3000"
      - "9229:9229" # Node debugger port
    volumes:
      - ./src:/app/src
    environment:
      - NODE_ENV=development
\`\`\`

**Execution:**
To run the development environment, you specify both files. The second file overrides the first:
\`\`\`bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
\`\`\`

## Using Extension Fields (YAML Anchors)
To adhere to DRY (Don't Repeat Yourself) principles within large Compose files, you can use YAML anchors (\`&\`) and aliases (\`*\`). Docker Compose also supports custom extension fields beginning with \`x-\`.

\`\`\`yaml
version: '3.8'

# Define a reusable block
x-logging: &default-logging
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"

x-env: &shared-env
  REDIS_HOST: redis
  DB_HOST: postgres

services:
  api:
    image: myapi:latest
    logging: *default-logging
    environment:
      <<: *shared-env
      API_PORT: 8080

  worker:
    image: myworker:latest
    logging: *default-logging
    environment:
      <<: *shared-env
      WORKER_THREADS: 4
\`\`\`

## Environment Variable Interpolation and \`.env\` Files
Compose automatically substitutes variables structured like \`\${VAR}\`.
You can provide defaults using bash-like syntax: \`\${PORT:-8080}\`.

Compose automatically reads variables from a \`.env\` file in the same directory.
\`\`\`env
# .env
IMAGE_TAG=v1.2.3
DB_PASSWORD=supersecret
\`\`\`
\`\`\`yaml
services:
  api:
    image: myapi:\${IMAGE_TAG}
    environment:
      - DB_PASS=\${DB_PASSWORD}
\`\`\`

## Compose Profiles
Introduced in recent versions of Compose, **Profiles** allow you to conditionally start services. This is useful for heavyweight services (like a massive analytics database or end-to-end testing runners) that you don't want to spin up during standard API development.

\`\`\`yaml
services:
  web:
    image: web:latest
  
  # This service only starts if the 'debug' profile is active
  phpmyadmin:
    image: phpmyadmin
    profiles:
      - debug

  # Only starts during testing
  e2e-cypress:
    image: cypress/included
    profiles:
      - testing
\`\`\`

**Execution:**
\`\`\`bash
# Starts only 'web'
docker compose up -d

# Starts 'web' and 'phpmyadmin'
docker compose --profile debug up -d
\`\`\`
`,
    interviewQuestions: [
      {
        question: "Explain how Docker Compose merges multiple configuration files using the `-f` flag.",
        answer: "When multiple `-f` flags are provided, Compose reads them in order. The first file acts as the base. Subsequent files apply overrides: adding new services, merging arrays (like adding new ports to existing services), or overriding dictionary keys (like altering an environment variable's value)."
      },
      {
        question: "What is the purpose of YAML anchors and `x-` extension fields in a Docker Compose file?",
        answer: "They adhere to the DRY (Don't Repeat Yourself) principle. Extension fields (`x-something`) are ignored by the Compose parser but can hold reusable configuration blocks. YAML anchors (`&`) and aliases (`*`) allow you to inject these shared blocks into multiple services, such as standardizing logging drivers or shared environment variables."
      },
      {
        question: "What does the syntax `${DB_PORT:-5432}` do in a Compose file?",
        answer: "It performs environment variable interpolation with a default fallback. It tells Compose to use the value of the `DB_PORT` environment variable. If `DB_PORT` is unset or empty on the host (or in the `.env` file), it falls back to the default value of `5432`."
      },
      {
        question: "How do Docker Compose Profiles work, and when would you use them?",
        answer: "Profiles assign services to specific categories. Services without a profile start by default. Services assigned to a profile (e.g., \"profiles: ['testing']\") are ignored unless the profile is explicitly activated via the `--profile testing` CLI flag or the `COMPOSE_PROFILES` environment variable. This is ideal for optional tooling like pgAdmin, metrics dashboards, or heavy E2E testing suites."
      },
      {
        question: "If a `.env` file exists, and you also `export` an environment variable in your shell, which value does Docker Compose prioritize?",
        answer: "Docker Compose prioritizes the environment variable exported in the host shell environment over the value defined in the `.env` file."
      }
    ],
    practicalTask: {
      scenario: "You have a `docker-compose.yml` file with a `frontend` and `backend` service. You want to add a `pgadmin` service for database debugging, but it should only start if explicitly requested by the developer.",
      task: "Write the Compose snippet for the `pgadmin` service utilizing Compose Profiles so it is ignored by default.",
      solutionCode: `
# Snippet demonstrating Compose Profiles
services:
  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "5050:80"
    # The profile ensures it does not start on a standard 'docker compose up'
    profiles:
      - debug
      - db-tools
      `
    }
  },
  {
    slug: "containerizing-legacy-applications",
    title: "Containerizing Legacy Applications: Strategies and Patterns",
    order: 25,
    content: `
# Containerizing Legacy Applications: Strategies and Patterns

Modernizing a monolithic legacy application (often termed a "Brownfield" project) is vastly more difficult than containerizing a modern 12-factor microservice ("Greenfield"). Legacy applications often violate core container principles: they store state locally, write logs to files instead of stdout, require specific initialization scripts, and depend on static IP configurations.

## The Strangler Fig Pattern
Before containerizing a massive monolith, consider the **Strangler Fig Pattern**. Instead of containerizing the entire legacy app at once (the "Big Bang" rewrite), you put a reverse proxy (like NGINX) in front of the legacy app.
As you extract features into new, modern, containerized microservices, the proxy routes traffic for those specific endpoints to the new containers, while routing the rest to the legacy monolith. Over time, the legacy app is "strangled" until it can be retired.

## Overcoming Legacy Hurdles in Docker

### 1. The "Init System" Problem
Legacy apps often expect to run on a full OS managed by \`systemd\` or \`sysvinit\`, relying on cron jobs, syslog daemons, and background workers all running concurrently.

**Container Anti-Pattern:** A container should ideally run exactly one process.
**Legacy Solution:** If you must run multiple processes, use a lightweight supervisor like **supervisord**, **s6-overlay**, or **tini**.

\`\`\`dockerfile
# Using supervisord to run an app, cron, and a logging daemon
FROM ubuntu:20.04
RUN apt-get update && apt-get install -y supervisor cron nginx
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
\`\`\`

### 2. The Local State Problem
Legacy apps often save user uploads, cache files, and SQLite databases directly into their working directory. In Docker, these files will be destroyed when the container restarts.

**Solution:** Identify every directory where the application writes data and map them to persistent Docker Volumes.
Use \`.dockerignore\` to ensure local development state isn't accidentally baked into the production image.

### 3. The Logging Problem
Old applications often hardcode their logs to \`/var/log/myapp/app.log\`. Docker expects logs to be streamed to \`stdout\` and \`stderr\` so the Docker logging daemon can capture them.

**Solution 1 (Symlinks):** The standard Docker approach is to symlink the log files to stdout/stderr in the Dockerfile.
\`\`\`dockerfile
RUN ln -sf /dev/stdout /var/log/myapp/app.log \\
    && ln -sf /dev/stderr /var/log/myapp/error.log
\`\`\`

**Solution 2 (Tail process):** If the app writes dynamically generated log file names, run a background process that tails the directory.
\`\`\`bash
# In an entrypoint script
tail -F /var/log/myapp/*.log &
exec /opt/myapp/start.sh
\`\`\`

### 4. Configuration via Files instead of Environment Variables
Modern apps use environment variables (\`ENV\`). Legacy apps often require complex XML, INI, or properties files.

**Solution:** Use an \`ENTRYPOINT\` script (often written in Bash) combined with a tool like \`envsubst\`. The container receives environment variables at runtime, the entrypoint script parses a template file, injects the variables, writes the final config file, and then uses \`exec\` to start the main application.

\`\`\`bash
#!/bin/bash
# entrypoint.sh
echo "Injecting variables into config..."
envsubst < /app/config.template.xml > /app/config.xml

# Execute the main process (replaces bash process with the app)
exec java -jar legacy-app.jar
\`\`\`

### 5. Zombie Processes and PID 1
If a legacy script is run as PID 1 (e.g., via \`CMD ["./start.sh"]\`), it often fails to forward UNIX signals (like SIGTERM) to child processes, and fails to reap zombie processes, causing graceful shutdown issues and resource leaks.

**Solution:** Always use \`exec\` in your shell scripts, or use an init system like **tini**.
\`\`\`dockerfile
# Use tini as the PID 1 init system
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["/app/legacy-start.sh"]
\`\`\`
`,
    interviewQuestions: [
      {
        question: "Why is running `systemd` inside a Docker container considered a bad practice, and what are the alternatives for legacy apps?",
        answer: "Containers are designed to isolate a single application process, not to boot a full operating system. Running `systemd` requires elevated privileges, specific volume mounts, and violates the microservice philosophy. The alternative for legacy apps requiring multiple processes is to use a lightweight process manager like `supervisord` or `s6-overlay`."
      },
      {
        question: "How do you handle a legacy application that strictly writes its logs to `/var/log/app.log` instead of `stdout`?",
        answer: "The standard Docker workaround is to create a symbolic link in the Dockerfile from `/var/log/app.log` to `/dev/stdout`. This tricks the application into writing to the standard output stream, allowing Docker's logging driver to capture and manage the logs."
      },
      {
        question: "What is the purpose of using `envsubst` in a container's Entrypoint script?",
        answer: "Legacy applications often read configuration from static files (XML, properties) rather than environment variables. `envsubst` is a tool used in entrypoint scripts to read a template configuration file, substitute environment variables passed via `docker run`, and generate the final static config file before starting the main application process."
      },
      {
        question: "Explain the 'PID 1 Zombie Problem' in Docker and how `tini` solves it.",
        answer: "In Linux, PID 1 is the init process, responsible for forwarding signals (like SIGTERM for graceful shutdown) and 'reaping' orphaned zombie child processes. Standard application scripts do neither. `tini` is a tiny, valid init process injected as the Entrypoint. It runs as PID 1, spawns your application, properly handles signals, and reaps zombies, preventing resource leaks."
      },
      {
        question: "Why is the `exec` command critical when writing shell script entrypoints for Docker?",
        answer: "If a shell script ends with `./my-app`, the shell process remains PID 1, and the app runs as a child process. The shell will swallow termination signals sent by `docker stop`. Using `exec ./my-app` replaces the shell process entirely with the application process, ensuring the application receives signals directly."
      }
    ],
    practicalTask: {
      scenario: "A legacy application is started via a bash script (`start.sh`). If you use `CMD [\"./start.sh\"]`, Docker takes 10 seconds to stop the container because the script ignores `docker stop` (SIGTERM).",
      task: "Modify the `start.sh` script to properly replace its own process with the target Java application, ensuring signals are received correctly.",
      solutionCode: `
#!/bin/bash
# start.sh

# Do some pre-flight setup
echo "Starting application environment..."
mkdir -p /app/temp

# WRONG WAY (creates a child process, script swallows signals):
# java -jar /app/legacy.jar

# CORRECT WAY (exec replaces the bash process with the Java process):
exec java -jar /app/legacy.jar
      `
    }
  }
];

appendTopics('docker', 'Docker Containerization', 'The definitive guide.', topics);
