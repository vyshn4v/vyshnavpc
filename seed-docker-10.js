import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "docker-security-secret-management",
    title: "Docker Security & Secret Management",
    order: 46,
    content: `
### 1. Conceptual Overview
Securing Docker environments involves protecting the Docker daemon, images, containers, and data. Central to this is secret management, which ensures sensitive data like API keys, passwords, and TLS certificates are not hardcoded in images or exposed in plain text within container environments. Security in Docker follows a defense-in-depth approach, encompassing host security, container runtime security, and secure supply chains.

### 2. Architecture & Mechanics
Docker security relies on Linux kernel features: Namespaces provide isolation for processes, networks, and mount points; cgroups restrict resource usage to prevent Denial of Service (DoS); and capabilities drop unnecessary root privileges. Seccomp profiles and AppArmor/SELinux restrict system calls and file access. Secret management in Docker Swarm encrypts secrets at rest in the Raft log and distributes them to nodes via mutual TLS (mTLS), mounting them in memory (tmpfs) within containers at \`/run/secrets/\`.

### 3. Implementation: Standard vs Optimized
**Standard (Insecure):** Passing secrets via environment variables or hardcoding them in \`Dockerfile\`.
\`\`\`dockerfile
# INSECURE
ENV DB_PASSWORD=mysecretpassword
\`\`\`

**Optimized (Secure):** Using Docker secrets (Swarm) or passing secrets during build with BuildKit.
\`\`\`dockerfile
# syntax=docker/dockerfile:1.2
FROM alpine
# Build-time secret
RUN --mount=type=secret,id=mysecret cat /run/secrets/mysecret
\`\`\`
For runtime in Swarm:
\`\`\`yaml
version: "3.8"
services:
  app:
    image: myapp
    secrets:
      - db_password
secrets:
  db_password:
    external: true
\`\`\`

### 4. Trade-offs & Complexity
Implementing strict security measures like dropping capabilities or using custom AppArmor profiles increases operational complexity and may break legacy applications. Docker Swarm secrets are highly secure but only work within Swarm mode, requiring alternative solutions like HashiCorp Vault or AWS Secrets Manager for standalone containers. Maintaining secure, minimal base images (like Alpine or Distroless) requires more effort in managing dependencies.
`,
    interviewQuestions: [
      {
        question: "Why should you avoid passing secrets via environment variables in Docker?",
        answer: "Environment variables can be easily exposed through `docker inspect`, container logs, or child processes, making them insecure for sensitive data. Docker secrets or dedicated secret managers are preferred."
      },
      {
        question: "What are Linux capabilities in the context of Docker security?",
        answer: "Linux capabilities break down root privileges into distinct units. Docker drops many capabilities by default, running containers with a restricted subset to limit the damage a compromised container can cause."
      },
      {
        question: "How does Docker Swarm store and distribute secrets?",
        answer: "Docker Swarm encrypts secrets at rest within the Raft log. It distributes them over mutually authenticated TLS connections only to the nodes running tasks that require those secrets, where they are mounted in memory via tmpfs."
      },
      {
        question: "What is a seccomp profile?",
        answer: "A seccomp (secure computing mode) profile restricts the system calls a container can make to the host kernel. Docker's default seccomp profile blocks many dangerous system calls, reducing the attack surface."
      },
      {
        question: "How can you securely use a secret during the `docker build` process?",
        answer: "Using BuildKit's secret mounts (`RUN --mount=type=secret,id=mysecret ...`), you can expose a secret to a build step without it being baked into the final image layers or the image history."
      }
    ],
    practicalTask: {
      scenario: "You need to securely provide a database password to a Node.js container running in Docker Swarm without exposing it in the Docker Compose file or environment variables.",
      task: "Create a Docker secret from a file and define a service in a `docker-compose.yml` that mounts and reads this secret.",
      solutionCode: `
# 1. Create the secret
echo "SuperSecretDBPass" | docker secret create db_password -

# 2. docker-compose.yml
version: "3.8"
services:
  db-client:
    image: node:18-alpine
    command: >
      node -e "
        const fs = require('fs');
        const pass = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
        console.log('Successfully read secret password of length: ' + pass.length);
      "
    secrets:
      - db_password
    deploy:
      mode: replicated
      replicas: 1

secrets:
  db_password:
    external: true

# 3. Deploy
docker stack deploy -c docker-compose.yml secret_stack
      `
    }
  },
  {
    slug: "advanced-docker-networking",
    title: "Advanced Docker Networking (Overlay, Macvlan)",
    order: 47,
    content: `
### 1. Conceptual Overview
Beyond standard bridge and host networks, Docker offers advanced networking drivers for complex architectures. The **Overlay** network driver enables communication between containers across multiple Docker daemon hosts, essential for Swarm clusters. The **Macvlan** driver allows containers to appear as physical devices on the network, assigning them unique MAC addresses, which is crucial for legacy applications requiring direct network attachment.

### 2. Architecture & Mechanics
**Overlay Networks:** Uses VXLAN (Virtual Extensible LAN) to encapsulate Layer 2 frames within Layer 4 UDP packets. This creates a distributed virtual network on top of the existing physical network. Swarm nodes participate in a gossip protocol to manage routing tables and endpoint discovery.
**Macvlan Networks:** Creates virtual network interfaces attached directly to a physical interface (like \`eth0\`). Traffic is routed based on MAC addresses. Containers on a Macvlan network bypass the Docker host's bridge and port mapping, communicating directly with external subnets.

### 3. Implementation: Standard vs Optimized
**Overlay Network Creation:**
\`\`\`bash
# Requires Swarm mode enabled
docker network create -d overlay --attachable my-overlay
\`\`\`

**Macvlan Network Creation (Optimized for legacy apps):**
\`\`\`bash
docker network create -d macvlan \\
  --subnet=192.168.1.0/24 \\
  --gateway=192.168.1.1 \\
  -o parent=eth0 pub_net
\`\`\`

**Service Deployment on Overlay:**
\`\`\`yaml
version: "3.8"
services:
  frontend:
    image: nginx
    networks:
      - my-overlay
networks:
  my-overlay:
    external: true
\`\`\`

### 4. Trade-offs & Complexity
Overlay networks introduce encapsulation overhead (VXLAN), slightly reducing network throughput and increasing latency compared to host networking, though they vastly simplify cross-host connectivity. Macvlan networks require careful IP Address Management (IPAM) to prevent IP collisions with external DHCP servers and typically prevent the Docker host from communicating with its own Macvlan containers due to Linux security features.
`,
    interviewQuestions: [
      {
        question: "When would you choose a Macvlan network over a standard Bridge network?",
        answer: "Macvlan is chosen when a container needs its own MAC address and IP address on the physical network, often required by legacy applications that expect to be directly connected to the network without NAT."
      },
      {
        question: "How does an Overlay network work under the hood?",
        answer: "It uses VXLAN technology to encapsulate container network frames inside UDP packets, sending them across the host network to other Docker nodes where they are decapsulated."
      },
      {
        question: "What is the purpose of the `--attachable` flag when creating an Overlay network?",
        answer: "By default, only Swarm services can attach to an overlay network. The `--attachable` flag allows standalone containers (run via `docker run`) to also connect to the overlay network."
      },
      {
        question: "Why can't the Docker host communicate with its own containers on a Macvlan network by default?",
        answer: "Linux isolates traffic between the physical interface and the Macvlan sub-interfaces attached to it for security. To allow host-to-container communication, a separate Macvlan interface must be created on the host itself."
      },
      {
        question: "What is the role of the gossip protocol in Docker Swarm networking?",
        answer: "The gossip protocol is used by Swarm nodes to quickly disseminate network state, routing mesh configurations, and endpoint IP changes across the cluster in a decentralized and highly available manner."
      }
    ],
    practicalTask: {
      scenario: "You have legacy software that must broadcast on the local physical network (10.0.0.0/24) to discover other physical devices.",
      task: "Create a Macvlan network bound to `eth0` and run an Alpine container on it to verify connectivity.",
      solutionCode: `
# 1. Create the Macvlan network
docker network create -d macvlan \\
  --subnet=10.0.0.0/24 \\
  --gateway=10.0.0.1 \\
  -o parent=eth0 \\
  legacy_net

# 2. Run a container attached to this network
docker run --rm -it --network legacy_net alpine sh

# Inside the container, you can now ping external network devices directly
# ping 10.0.0.50
      `
    }
  },
  {
    slug: "docker-buildx-multi-architecture",
    title: "Docker Buildx & Multi-Architecture Builds",
    order: 48,
    content: `
### 1. Conceptual Overview
With the proliferation of ARM-based processors (like Apple Silicon and AWS Graviton), building container images for a single architecture (e.g., \`amd64\`) is no longer sufficient. Docker Buildx is a CLI plugin that extends the \`docker build\` command with the full features of BuildKit, allowing developers to build multi-architecture images concurrently and push them as a single manifest list to a registry.

### 2. Architecture & Mechanics
Docker Buildx uses BuildKit as its backend. When you request a multi-arch build, Buildx provisions a builder instance using QEMU (an open-source machine emulator) or multiple native nodes to compile binaries for target platforms like \`linux/amd64\` and \`linux/arm64\`. It then bundles these architecture-specific images together under a single "fat manifest" (OCI Image Index). When a client pulls the image, the Docker daemon automatically selects the image matching the host's architecture.

### 3. Implementation: Standard vs Optimized
**Standard (Single Arch):**
\`\`\`bash
docker build -t myapp:latest .
\`\`\`

**Optimized (Multi-Arch with Buildx):**
First, create and bootstrap a new builder instance:
\`\`\`bash
docker buildx create --name mybuilder --use
docker buildx inspect --bootstrap
\`\`\`

Then, build and push for multiple platforms simultaneously:
\`\`\`bash
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t myrepo/myapp:latest \\
  --push .
\`\`\`

### 4. Trade-offs & Complexity
Using QEMU for cross-compilation (e.g., building ARM on an x86 machine) is significantly slower than native compilation because CPU instructions must be emulated. To optimize build times in production pipelines, remote native builders (e.g., an x86 server and an ARM server connected to the same Buildx instance) are preferred over QEMU. Additionally, creating multi-arch images increases overall registry storage consumption.
`,
    interviewQuestions: [
      {
        question: "What is an OCI Image Index (or Docker Manifest List)?",
        answer: "It is a top-level manifest that points to multiple architecture-specific image manifests. It allows users to pull a single image tag (like `ubuntu:latest`), and Docker will automatically resolve and download the correct binary for their architecture."
      },
      {
        question: "Why is QEMU used in Docker Buildx?",
        answer: "QEMU is an emulator that allows Buildx to execute binaries compiled for a different architecture (e.g., executing ARM binaries on an AMD64 host) during the build process, enabling cross-platform image building."
      },
      {
        question: "What is a significant drawback of relying on QEMU for multi-arch builds?",
        answer: "Emulation adds significant computational overhead. Tasks like compiling C/C++ code or installing heavy dependencies via QEMU are much slower compared to native execution."
      },
      {
        question: "How can you speed up multi-architecture builds using Buildx?",
        answer: "Instead of relying on QEMU emulation, you can attach remote nodes of native architectures to a single Buildx builder instance, allowing native, parallel compilation."
      },
      {
        question: "Can you load a multi-arch build directly into the local Docker daemon?",
        answer: "No, the standard Docker daemon does not support storing multi-arch manifest lists locally. You must output the build to a registry (`--push`) or export it to the local filesystem (`--output type=local`)."
      }
    ],
    practicalTask: {
      scenario: "You need to create a simple Go application image that works natively on both Apple Silicon (ARM64) and standard cloud servers (AMD64).",
      task: "Setup a Buildx builder and execute a cross-platform build that pushes a manifest list to Docker Hub.",
      solutionCode: `
# 1. Ensure QEMU is installed (usually default in Docker Desktop)
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes

# 2. Create and use a new builder
docker buildx create --name multiarch-builder --use
docker buildx inspect --bootstrap

# 3. Create a basic Dockerfile
cat <<EOF > Dockerfile
FROM golang:1.20-alpine AS builder
WORKDIR /app
COPY main.go .
RUN go build -o myapp main.go

FROM alpine
COPY --from=builder /app/myapp /usr/local/bin/myapp
CMD ["myapp"]
EOF

# 4. Build and Push (requires Docker Hub login)
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t username/myapp:multiarch \\
  --push .
      `
    }
  },
  {
    slug: "docker-daemon-configuration",
    title: "Docker Daemon Configuration & Optimization",
    order: 49,
    content: `
### 1. Conceptual Overview
The Docker daemon (\`dockerd\`) is the core background process that manages images, containers, networks, and storage volumes. Its behavior is highly customizable through the \`daemon.json\` configuration file. Optimizing the daemon is crucial for production environments to enforce security standards, manage logging limits, configure custom registry mirrors, and adjust network MTU sizes for performance.

### 2. Architecture & Mechanics
The \`dockerd\` process listens for Docker API requests. Upon starting, it reads configuration from \`/etc/docker/daemon.json\` (on Linux). Modifications here alter global daemon behavior. For example, configuring \`log-driver\` changes how container stdout/stderr streams are processed by default, while \`default-address-pools\` modifies the IP subnets allocated to new bridge networks to prevent conflicts with host infrastructure.

### 3. Implementation: Standard vs Optimized
**Standard (Default config):**
Containers use the \`json-file\` log driver with no size limits, leading to potential disk exhaustion. IP allocations may conflict with internal VPC subnets.

**Optimized (\`/etc/docker/daemon.json\`):**
\`\`\`json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "3"
  },
  "default-address-pools": [
    {
      "base": "10.10.0.0/16",
      "size": 24
    }
  ],
  "metrics-addr": "0.0.0.0:9323",
  "experimental": true,
  "live-restore": true
}
\`\`\`

### 4. Trade-offs & Complexity
Modifying \`daemon.json\` requires a daemon restart for changes to take effect, which can disrupt running containers unless \`live-restore\` is enabled. Enabling \`live-restore\` keeps containers running while the daemon restarts, but it has limitations (e.g., incompatible with Swarm tasks). Configuring external log drivers (like \`fluentd\` or \`awslogs\`) offloads disk I/O but introduces dependencies on external logging infrastructure availability.
`,
    interviewQuestions: [
      {
        question: "What is the purpose of the `live-restore` setting in `daemon.json`?",
        answer: "It allows containers to keep running when the Docker daemon is restarted for updates or configuration changes, minimizing downtime for standalone containers."
      },
      {
        question: "Why should you set `max-size` and `max-file` in the daemon's log options?",
        answer: "By default, the `json-file` driver does not limit log size. Setting these options prevents runaway application logs from consuming all host disk space."
      },
      {
        question: "How do you expose Docker daemon metrics for Prometheus to scrape?",
        answer: "Set the `metrics-addr` key in `daemon.json` to expose a Prometheus-compatible metrics endpoint (e.g., `0.0.0.0:9323`) and restart the daemon."
      },
      {
        question: "What does `default-address-pools` configure?",
        answer: "It dictates the IP ranges Docker uses when automatically creating new bridge networks, preventing Docker from picking IPs that overlap with the host's existing physical or VPC networks."
      },
      {
        question: "What happens if a JSON syntax error exists in `/etc/docker/daemon.json`?",
        answer: "The Docker daemon will fail to start. It is critical to validate the JSON format before restarting the service."
      }
    ],
    practicalTask: {
      scenario: "You need to ensure that no single container on your host can consume more than 30MB of disk space for logs, retaining only the 3 most recent log files.",
      task: "Configure the Docker daemon's default logging options to enforce log rotation.",
      solutionCode: `
# 1. Create or edit the daemon configuration file
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

# 2. Restart the Docker daemon to apply changes
sudo systemctl restart docker

# 3. Verify by running a container and inspecting its HostConfig
docker run -d --name log-test alpine ping 8.8.8.8
docker inspect log-test | grep -A 3 LogConfig
      `
    }
  },
  {
    slug: "docker-swarm-deep-dive",
    title: "Docker Swarm Deep Dive",
    order: 50,
    content: `
### 1. Conceptual Overview
Docker Swarm is Docker's native orchestration tool, enabling a cluster of Docker engines to act as a single virtual engine. It provides high availability, scaling, rolling updates, and self-healing out of the box. While Kubernetes has become the industry standard for orchestration, Swarm remains highly relevant for smaller teams or edge deployments due to its profound simplicity, built-in security, and seamless integration with the standard Docker API.

### 2. Architecture & Mechanics
A Swarm consists of **Manager** and **Worker** nodes. Managers maintain cluster state using a distributed Raft consensus algorithm, ensuring high availability (requiring a quorum, e.g., 3 or 5 managers). Workers execute tasks (containers) dispatched by managers. Swarm implements a **Routing Mesh**, an ingress network that routes incoming requests to published ports on any node directly to the node actively running the corresponding service container, providing integrated load balancing.

### 3. Implementation: Standard vs Optimized
**Standard (Initializing and Joining):**
\`\`\`bash
# On Manager 1
docker swarm init --advertise-addr <MANAGER-IP>

# On Worker Nodes (using token from init output)
docker swarm join --token <WORKER-TOKEN> <MANAGER-IP>:2377
\`\`\`

**Optimized (Service Deployment with Updates & Constraints):**
\`\`\`yaml
version: "3.8"
services:
  web:
    image: nginx:1.19
    deploy:
      replicas: 5
      placement:
        constraints: [node.role == worker]
      update_config:
        parallelism: 2
        delay: 10s
        order: start-first
\`\`\`
Deployed via: \`docker stack deploy -c docker-compose.yml web_stack\`

### 4. Trade-offs & Complexity
Swarm is incredibly simple to set up compared to Kubernetes, requiring no additional binaries. It automatically handles mTLS certificate rotation for node communication. However, it lacks the vast ecosystem, advanced custom resource definitions (CRDs), and granular RBAC found in Kubernetes. Furthermore, managing stateful workloads in Swarm is notoriously difficult without external distributed storage plugins, making it best suited for stateless microservices.
`,
    interviewQuestions: [
      {
        question: "Explain the Raft consensus algorithm in the context of Docker Swarm managers.",
        answer: "Raft ensures that the cluster state is consistent across all manager nodes. A leader is elected, and state changes are replicated to followers. A quorum (majority) of managers must be reachable to make changes or recover from failures."
      },
      {
        question: "What is the Docker Swarm Routing Mesh?",
        answer: "It is an ingress network that allows every node in the Swarm to accept connections on a service's published port. The mesh automatically routes that request to an active container for that service, regardless of which node received the request."
      },
      {
        question: "What is the difference between a `global` service and a `replicated` service in Swarm?",
        answer: "A `replicated` service runs a specified number of task replicas distributed across the cluster. A `global` service runs exactly one task on every available node in the Swarm that meets the placement constraints."
      },
      {
        question: "Why should you always have an odd number of Swarm managers?",
        answer: "To maintain quorum and tolerate failures without split-brain scenarios. A 3-manager cluster can tolerate 1 failure, while a 5-manager cluster can tolerate 2. Even numbers do not improve fault tolerance over the lower odd number."
      },
      {
        question: "How do you perform a zero-downtime deployment in Docker Swarm?",
        answer: "By configuring `update_config` with settings like `parallelism` and `order: start-first`, Swarm will start new containers before killing old ones, incrementally rolling out the update across the replicas."
      }
    ],
    practicalTask: {
      scenario: "You need to scale a web service across multiple nodes and ensure that during an image update, no more than 2 containers are updated simultaneously with a 5-second delay between batches.",
      task: "Deploy a stack with a rolling update configuration.",
      solutionCode: `
# 1. Create a docker-compose.yml
cat <<EOF > docker-compose.yml
version: "3.8"
services:
  app:
    image: nginx:alpine
    ports:
      - "8080:80"
    deploy:
      replicas: 6
      update_config:
        parallelism: 2
        delay: 5s
        order: start-first
        failure_action: rollback
EOF

# 2. Deploy the stack (must be run on a manager node)
docker stack deploy -c docker-compose.yml mystack

# 3. Update the service image to trigger the rolling update
docker service update --image nginx:latest mystack_app

# 4. Monitor the update progress
docker service ps mystack_app
      `
    }
  }
];

appendTopics("docker", "Docker Masterclass", "Complete guide to containerization, deployment, and optimization with Docker.", topics);
