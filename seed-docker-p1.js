import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'chapter-1-genesis-containerization',
    title: 'Chapter 1: The Genesis of Containerization: Chroot, LXC, and the Path to Docker',
    order: 1,
    content: `
<h2>1. Introduction to the World Before Docker</h2>
<p>Before Docker became the de facto standard for containerization, the software development industry relied heavily on physical servers and, subsequently, Virtual Machines (VMs). Running applications directly on bare metal was notoriously difficult to scale and maintain. Dependency conflicts ("it works on my machine") were rampant, and resource allocation was rigid and inefficient.</p>
<p>Virtual Machines introduced the hypervisor, allowing multiple OS instances to run on a single host. However, each VM required its own complete OS, leading to significant overhead in memory, storage, and boot time. This paved the way for containerization—a lightweight alternative that shares the host OS kernel while providing isolated user-space environments.</p>
<h2>2. Chroot and the Concept of Isolation</h2>
<p>The journey to containerization began in 1979 with <code>chroot</code> (change root) in Unix V7. By changing the apparent root directory for the current running process and its children, <code>chroot</code> created a primitive form of isolation. A process running in a "chroot jail" could not access files outside its designated directory tree.</p>
<pre><code class="language-bash">
# A simple example of creating a chroot jail
mkdir /var/chroot_jail
cp /bin/bash /var/chroot_jail/bin/bash
# (Note: Required shared libraries must also be copied)
chroot /var/chroot_jail /bin/bash
</code></pre>
<p>While <code>chroot</code> isolated the filesystem, it did not isolate processes, networking, or resource consumption, making it insufficient for running multiple independent applications securely.</p>
<h2>3. Linux Containers (LXC)</h2>
<p>LXC, introduced around 2008, brought together various kernel features to create true containerization. It leveraged two critical Linux kernel features: <strong>Namespaces</strong> and <strong>Control Groups (cgroups)</strong>.</p>
<ul>
  <li><strong>Namespaces:</strong> Provide isolation for processes, networking, IPC, mounts, and UTS. They ensure a container cannot see or interact with the resources of another container or the host.</li>
  <li><strong>Control Groups (cgroups):</strong> Handle resource limiting, prioritization, and accounting. They ensure a container cannot consume all CPU or memory on the host system.</li>
</ul>
<pre><code class="language-bash">
# Installing and creating a simple LXC container (Ubuntu example)
sudo apt-get install lxc
sudo lxc-create -n my_container -t ubuntu
sudo lxc-start -n my_container
sudo lxc-attach -n my_container
</code></pre>
<h2>4. The Birth of Docker</h2>
<p>In 2013, dotCloud (which later rebranded to Docker Inc.) introduced Docker. Initially, Docker was essentially a wrapper around LXC, making it significantly easier to use. However, Docker introduced a revolutionary concept: <strong>the Docker Image</strong>.</p>
<p>By defining applications and their dependencies in a portable, layered image format, Docker solved the "it works on my machine" problem definitively. Docker also eventually replaced LXC with its own execution environment, <code>libcontainer</code>, and later <code>runc</code> and <code>containerd</code>.</p>
<h2>5. Docker vs. Virtual Machines</h2>
<p>The fundamental difference lies in virtualization level. VMs virtualize the hardware, requiring a guest OS. Docker virtualizes the operating system, allowing containers to run directly on the host OS kernel.</p>
<p>Because containers don't boot an entire OS, they start in milliseconds instead of minutes. Because they share the kernel, they consume vastly fewer resources, allowing you to run hundreds of containers on hardware that could only support a few VMs.</p>
`,
    interviewQuestions: [
      {
        question: "Explain the fundamental difference between a Virtual Machine and a Docker Container.",
        answer: "A Virtual Machine virtualizes the hardware and requires a full guest Operating System (OS) for each instance, running on top of a hypervisor. A Docker Container virtualizes the OS by sharing the host OS kernel, making it much more lightweight, faster to start, and less resource-intensive."
      },
      {
        question: "What is chroot and why is it considered the predecessor to containerization?",
        answer: "chroot (change root) is a Unix operation that changes the apparent root directory for the current running process and its children. It creates an isolated filesystem environment (a 'chroot jail'). It's considered a predecessor because it provided early filesystem isolation, a core concept of modern containerization, though it lacked process and network isolation."
      },
      {
        question: "Which two underlying Linux kernel technologies make containerization possible?",
        answer: "The two core technologies are Namespaces (which provide isolation for processes, networks, mounts, etc.) and Control Groups or cgroups (which provide resource allocation, limiting, and accounting for CPU, memory, etc.)."
      },
      {
        question: "What was LXC and how did Docker initially relate to it?",
        answer: "LXC (Linux Containers) is an OS-level virtualization method for running multiple isolated Linux systems on a single host. In its early days, Docker used LXC as its default execution environment before developing its own libraries (libcontainer/runc) to directly interact with Linux kernel features."
      },
      {
        question: "Why was the introduction of the Docker Image revolutionary?",
        answer: "The Docker Image provided a standardized, portable, and layered format for packaging an application and all its dependencies. It solved the environment inconsistency problem by ensuring that the exact same artifact could be deployed across development, testing, and production environments."
      }
    ],
    practicalTask: {
      scenario: "Your team wants to understand the resource footprint difference between running a full OS vs a minimal container. You need to pull and run a simple Alpine Linux container and observe its size.",
      task: "Pull the latest alpine image, run it interactively, and execute the 'free -m' command to see memory usage.",
      solutionCode: "docker pull alpine:latest\ndocker run -it alpine:latest /bin/sh\n# Inside container:\nfree -m\nexit"
    }
  },
  {
    slug: 'chapter-2-docker-architecture',
    title: 'Chapter 2: Docker Architecture Deep Dive: Client, Host, and Registry',
    order: 2,
    content: `
<h2>1. The Docker Client-Server Architecture</h2>
<p>Docker operates on a client-server architecture. It's crucial to understand that the <code>docker</code> command you type in your terminal is merely the <strong>Docker Client</strong>. The heavy lifting is done by the <strong>Docker Daemon</strong> (or Docker Host), which can run on the same machine as the client or on a completely remote machine.</p>
<p>The client and the daemon communicate over a REST API via UNIX sockets or a network interface.</p>
<h2>2. The Docker Client</h2>
<p>The Docker Client (<code>docker</code> binary) is the primary interface for users to interact with Docker. When you execute commands like <code>docker run</code> or <code>docker build</code>, the client parses the command and translates it into HTTP API requests sent to the Docker Daemon.</p>
<pre><code class="language-bash">
# Running a command through the Docker Client
docker run -d -p 80:80 nginx

# Under the hood, this makes API calls like:
# POST /v1.41/containers/create
# POST /v1.41/containers/&lt;id&gt;/start
</code></pre>
<h2>3. The Docker Daemon (dockerd)</h2>
<p>The Docker Daemon (<code>dockerd</code>) is a persistent background process that manages Docker objects such as images, containers, networks, and volumes. It listens for Docker API requests and processes them.</p>
<p>The daemon is responsible for:</p>
<ul>
  <li>Pulling images from registries.</li>
  <li>Building images from Dockerfiles.</li>
  <li>Starting, stopping, and monitoring containers.</li>
  <li>Managing the local container state and filesystem.</li>
</ul>
<h2>4. Docker Objects</h2>
<p>When working with Docker, you create and manage several types of objects:</p>
<ul>
  <li><strong>Images:</strong> Read-only templates with instructions for creating a Docker container. They are built in layers.</li>
  <li><strong>Containers:</strong> Runnable instances of images. They are stateful and include an ephemeral read-write layer on top of the image layer.</li>
  <li><strong>Networks:</strong> Allow containers to communicate with each other and the outside world securely.</li>
  <li><strong>Volumes:</strong> Persistent data storage mechanisms that exist independently of container lifecycles.</li>
</ul>
<h2>5. Docker Registries</h2>
<p>A Docker Registry stores Docker images. Docker Hub is the default, public registry that Docker is configured to look for images on by default. You can also run your own private registry using tools like Docker Registry, AWS ECR, Google GCR, or Harbor.</p>
<p>When you run <code>docker pull ubuntu</code>, the daemon fetches the <code>ubuntu</code> image from Docker Hub. When you run <code>docker push myapp</code>, the daemon uploads your image to the configured registry.</p>
`,
    interviewQuestions: [
      {
        question: "Describe the components of Docker's client-server architecture.",
        answer: "Docker consists of three main components: The Docker Client (the CLI tool users interact with), the Docker Daemon/Host (a background process that does the heavy lifting of building, running, and managing containers), and the Docker Registry (a storage and distribution system for Docker images, like Docker Hub)."
      },
      {
        question: "How do the Docker Client and Docker Daemon communicate?",
        answer: "They communicate using a RESTful API over UNIX sockets (locally) or over a network interface (TCP) if the daemon is hosted remotely."
      },
      {
        question: "What is the difference between a Docker Image and a Docker Container?",
        answer: "A Docker Image is a static, read-only template that contains the application code, libraries, dependencies, and configuration. A Docker Container is a running instance of that image, which adds a thin read-write layer on top of the image to allow state changes during runtime."
      },
      {
        question: "What role does dockerd play in the Docker ecosystem?",
        answer: "dockerd is the Docker Daemon. It constantly runs in the background on the host machine, listening for API requests from the Docker client. It manages all Docker objects, including images, containers, networks, and volumes."
      },
      {
        question: "Can the Docker Client run on a different machine than the Docker Daemon?",
        answer: "Yes. Because they communicate via a REST API, you can configure the Docker Client on your local laptop to control a Docker Daemon running on a remote server by setting the DOCKER_HOST environment variable."
      }
    ],
    practicalTask: {
      scenario: "You need to verify that your Docker client can successfully communicate with the Docker Daemon and retrieve system-wide information.",
      task: "Execute the command that displays system-wide information about the Docker installation, including the number of containers and images, and the Docker version.",
      solutionCode: "docker info\ndocker version"
    }
  },
  {
    slug: 'chapter-3-docker-engine-components',
    title: 'Chapter 3: The Docker Engine and Core Components: containerd, runc, and namespaces',
    order: 3,
    content: `
<h2>1. Deconstructing the Docker Engine</h2>
<p>Initially, the Docker Engine was a single, monolithic binary that handled everything from REST API routing to low-level container execution. Over time, to comply with the Open Container Initiative (OCI) standards and improve modularity, Docker was broken down into several distinct, specialized components.</p>
<p>Today, when you run a container, the execution flow passes through <code>dockerd</code>, down to <code>containerd</code>, and finally to <code>runc</code>.</p>
<h2>2. containerd: The High-Level Container Runtime</h2>
<p><code>containerd</code> (pronounced "container-dee") was extracted from the Docker Engine to act as an industry-standard core container runtime. It acts as an abstraction layer between the Docker Daemon and the low-level execution environment.</p>
<p>Responsibilities of containerd include:</p>
<ul>
  <li>Image push and pull operations.</li>
  <li>Managing container lifecycle (start, stop, pause).</li>
  <li>Image management and storage execution.</li>
  <li>Network primitives and attachment.</li>
</ul>
<p>Because it is highly modular, platforms like Kubernetes can use <code>containerd</code> directly (via CRI) without needing the full Docker Daemon.</p>
<h2>3. runc: The OCI Low-Level Runtime</h2>
<p><code>runc</code> is a lightweight CLI tool for spawning and running containers according to the OCI specification. It is the lowest level of the container execution stack in standard Docker setups.</p>
<p>When <code>containerd</code> needs to start a container, it doesn't do it directly. Instead, it delegates the actual creation of the container environment (setting up namespaces and cgroups) to <code>runc</code>. <code>runc</code> creates the container process, and then exits, leaving a slim shim process (<code>containerd-shim</code>) to monitor it.</p>
<h2>4. The Role of containerd-shim</h2>
<p>To keep containers running even if the Docker Daemon or <code>containerd</code> crashes or restarts, Docker uses the <code>containerd-shim</code>. When <code>runc</code> starts a container process, <code>containerd-shim</code> becomes the parent of that process.</p>
<p>This allows "daemonless" containers—running processes that are decoupled from the lifecycle of the management daemons.</p>
<h2>5. Namespaces and Cgroups in Action</h2>
<p>When <code>runc</code> initializes a container, it directly invokes Linux kernel features:</p>
<ul>
  <li><strong>PID Namespace:</strong> The container process gets PID 1 inside the namespace, unaware of other host processes.</li>
  <li><strong>NET Namespace:</strong> The container gets its own isolated network stack, loopback interface, and IP address.</li>
  <li><strong>MNT Namespace:</strong> Mount points are isolated; the container has its own root filesystem.</li>
  <li><strong>Cgroups:</strong> Memory limits (e.g., max 512MB) and CPU quotas are strictly enforced by the kernel based on rules set by <code>runc</code>.</li>
</ul>
`,
    interviewQuestions: [
      {
        question: "What was the motivation behind breaking down the monolithic Docker Engine into smaller components?",
        answer: "The primary motivation was to adhere to the Open Container Initiative (OCI) standards, improve modularity, increase stability, and allow other systems (like Kubernetes) to use core container management pieces (like containerd) without the overhead of the entire Docker Daemon."
      },
      {
        question: "Explain the role of containerd in modern Docker architecture.",
        answer: "containerd acts as the high-level container runtime. It sits between the Docker daemon and the low-level runtime (runc). It handles image transfer and storage, container execution and supervision, low-level storage, and network attachments."
      },
      {
        question: "What is runc, and what is its primary responsibility?",
        answer: "runc is an OCI-compliant low-level container runtime. Its sole responsibility is to interface with the Linux kernel to create namespaces, set up cgroups, and spawn the actual isolated container process. Once the process is spawned, runc exits."
      },
      {
        question: "How does Docker achieve daemonless container execution (keeping containers running if dockerd crashes)?",
        answer: "This is achieved using the containerd-shim. When runc spawns a container, containerd-shim takes over as the parent process of the container. If dockerd or containerd crash or are updated, the shim remains alive, keeping the container running and allowing containerd to reattach to it later."
      },
      {
        question: "Name three Linux namespaces and briefly explain what they isolate.",
        answer: "1. PID namespace isolates the process ID space, allowing a container process to be PID 1. 2. NET namespace provides an isolated network stack (IP, interfaces, routing). 3. MNT namespace isolates the filesystem mount points, giving the container its own unique root filesystem view."
      }
    ],
    practicalTask: {
      scenario: "You need to verify the version and components of the low-level runtimes installed with your Docker Engine.",
      task: "Execute the command that lists detailed version information for Docker, containerd, runc, and docker-init.",
      solutionCode: "docker version"
    }
  },
  {
    slug: 'chapter-4-dockerizing-applications',
    title: 'Chapter 4: Dockerizing Applications: The Anatomy of a Dockerfile',
    order: 4,
    content: `
<h2>1. Introduction to the Dockerfile</h2>
<p>A <code>Dockerfile</code> is a simple text document containing all the commands a user could call on the command line to assemble an image. It acts as a reproducible build script. The Docker daemon reads these instructions sequentially to build a Docker Image.</p>
<h2>2. Foundational Instructions: FROM, WORKDIR, and COPY</h2>
<p>Every valid Dockerfile must begin with a <code>FROM</code> instruction (with rare exceptions like arg initialization). It specifies the Base Image you are building upon.</p>
<pre><code class="language-dockerfile">
# Specify the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy application files from the host to the container
# COPY &lt;src&gt; &lt;dest&gt;
COPY package*.json ./
COPY . .
</code></pre>
<p>The <code>WORKDIR</code> command sets the current working directory for subsequent <code>RUN</code>, <code>CMD</code>, <code>ENTRYPOINT</code>, <code>COPY</code>, and <code>ADD</code> instructions. It's best practice to use <code>WORKDIR</code> rather than using absolute paths in every command.</p>
<h2>3. Executing Commands: RUN</h2>
<p>The <code>RUN</code> instruction executes commands in a new layer on top of the current image and commits the results. It is typically used for installing software packages, building code, or creating directories.</p>
<pre><code class="language-dockerfile">
# Install dependencies
RUN npm install --production

# Or in an Ubuntu base image:
RUN apt-get update && apt-get install -y python3
</code></pre>
<h2>4. Runtime Instructions: CMD and ENTRYPOINT</h2>
<p>While <code>RUN</code> executes during the <em>build</em> phase, <code>CMD</code> and <code>ENTRYPOINT</code> define what happens during the <em>run</em> phase (when the container starts).</p>
<ul>
  <li><strong>CMD:</strong> Provides default arguments or a default command. It can be easily overridden by passing a command to <code>docker run</code>.</li>
  <li><strong>ENTRYPOINT:</strong> Configures the container to run as an executable. It is much harder to override. If both are used, <code>CMD</code> arguments are passed to the <code>ENTRYPOINT</code>.</li>
</ul>
<pre><code class="language-dockerfile">
# Using CMD (easily overridden)
CMD ["npm", "start"]

# Using ENTRYPOINT with CMD as default args
ENTRYPOINT ["node"]
CMD ["app.js"]
</code></pre>
<h2>5. Environment Variables and Networking: ENV and EXPOSE</h2>
<p>The <code>ENV</code> instruction sets environment variables that persist in the resulting image and the running container.</p>
<p>The <code>EXPOSE</code> instruction documents the ports on which a container listens at runtime. It does <em>not</em> actually publish the port; it merely serves as documentation for the person running the container.</p>
<pre><code class="language-dockerfile">
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080
</code></pre>
`,
    interviewQuestions: [
      {
        question: "What is a Dockerfile?",
        answer: "A Dockerfile is a text file containing a sequence of instructions used by the Docker daemon to automatically build a Docker image. It ensures reproducible and automated image creation."
      },
      {
        question: "Explain the difference between the RUN and CMD instructions in a Dockerfile.",
        answer: "The RUN instruction executes commands during the image build process and commits the result as a new image layer (e.g., installing packages). The CMD instruction specifies the default command to execute when a container is started from the image, not during the build process."
      },
      {
        question: "How do ENTRYPOINT and CMD interact when used together in the same Dockerfile?",
        answer: "When both are used, the ENTRYPOINT specifies the main executable that the container will run, and the CMD instruction provides default arguments passed to that ENTRYPOINT executable. These CMD arguments can be overridden at runtime."
      },
      {
        question: "Why is it recommended to use WORKDIR instead of running `cd` commands using RUN?",
        answer: "Using `RUN cd /some/dir` only changes the directory for that specific RUN layer. Subsequent instructions will revert to the previous directory. WORKDIR persistently sets the working directory for all subsequent RUN, CMD, ENTRYPOINT, COPY, and ADD instructions, resulting in cleaner and more predictable Dockerfiles."
      },
      {
        question: "Does the EXPOSE instruction actually open a port on the host machine?",
        answer: "No. The EXPOSE instruction is purely for documentation purposes to inform users which ports the application inside the container listens on. To actually open and map the port to the host machine, you must use the -p or -P flag with `docker run`."
      }
    ],
    practicalTask: {
      scenario: "You have a simple Node.js application. You need to write the content of a Dockerfile to package this application using the 'node:18-alpine' base image.",
      task: "Write a complete Dockerfile that sets the working dir to /app, copies package.json, runs npm install, copies the rest of the code, exposes port 3000, and uses CMD to run 'node index.js'.",
      solutionCode: "FROM node:18-alpine\nWORKDIR /app\nCOPY package.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"node\", \"index.js\"]"
    }
  },
  {
    slug: 'chapter-5-image-layers-optimization',
    title: 'Chapter 5: Image Layers, Caching, and Optimization Strategies',
    order: 5,
    content: `
<h2>1. Understanding the Layered File System</h2>
<p>Docker Images are constructed from a series of read-only layers. Each instruction in a Dockerfile (specifically <code>FROM</code>, <code>RUN</code>, <code>COPY</code>, and <code>ADD</code>) creates a new layer. These layers are stacked, and each layer represents the differences (delta) from the layer below it.</p>
<p>Docker uses Union File Systems (like overlay2) to merge these layers into a single coherent filesystem view for the running container.</p>
<h2>2. The Docker Build Cache</h2>
<p>To drastically speed up image builds, Docker caches each layer. When you rebuild an image, Docker checks if the instruction and the files it depends on have changed. If they haven't, Docker reuses the cached layer instead of executing the instruction again.</p>
<p><strong>Crucial Rule:</strong> If a layer's cache is invalidated (e.g., a file copied by <code>COPY</code> changes), the cache for <strong>all subsequent layers</strong> is also invalidated.</p>
<h2>3. Optimizing Layer Caching</h2>
<p>To maximize cache hits, you should order your Dockerfile instructions from least likely to change to most likely to change. For a Node.js app, this means copying <code>package.json</code> and running <code>npm install</code> BEFORE copying the rest of your rapidly changing source code.</p>
<pre><code class="language-dockerfile">
# POOR CACHING: Source code changes invalidate the npm install cache
COPY . /app
RUN npm install

# EXCELLENT CACHING: npm install is cached unless package.json changes
COPY package.json /app
RUN npm install
COPY . /app
</code></pre>
<h2>4. Reducing Image Size: Multi-Stage Builds</h2>
<p>Multi-stage builds allow you to use multiple <code>FROM</code> statements in a single Dockerfile. Each <code>FROM</code> begins a new stage. You can selectively copy artifacts from one stage to another, leaving behind everything you don't need in the final image.</p>
<p>This is incredibly useful for compiled languages (Go, Java, C++) where you need a heavy SDK to compile the code, but only a tiny runtime environment to run the compiled binary.</p>
<pre><code class="language-dockerfile">
# Stage 1: Build environment
FROM golang:1.20 AS builder
WORKDIR /src
COPY . .
RUN go build -o myapp main.go

# Stage 2: Minimal runtime environment
FROM alpine:latest
WORKDIR /app
# Copy ONLY the compiled binary from the builder stage
COPY --from=builder /src/myapp .
CMD ["./myapp"]
</code></pre>
<h2>5. Chaining Commands to Reduce Layers</h2>
<p>Because every <code>RUN</code> creates a layer, chaining shell commands with <code>&&</code> and cleaning up temporary files in the same <code>RUN</code> instruction significantly reduces the final image size.</p>
<pre><code class="language-dockerfile">
# Instead of this (creates multiple layers and leaves cache behind):
RUN apt-get update
RUN apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*

# Do this (single layer, perfectly clean):
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*
</code></pre>
`,
    interviewQuestions: [
      {
        question: "Explain the concept of Docker Image Layers.",
        answer: "A Docker image is built up from a series of read-only layers. Instructions like RUN, COPY, and ADD in a Dockerfile each create a new layer representing the filesystem changes made by that instruction. These layers are stacked and managed by a storage driver using a Union File System."
      },
      {
        question: "How does Docker's layer caching mechanism work during a build?",
        answer: "When building an image, Docker steps through the Dockerfile instructions. For each instruction, it checks its cache to see if it already has a layer matching that instruction and context. If a match is found, the cached layer is used, speeding up the build. If an instruction causes a cache miss (e.g., files changed in a COPY), that layer and all subsequent layers are rebuilt from scratch."
      },
      {
        question: "Why should you copy package.json and run 'npm install' before copying your source code in a Dockerfile?",
        answer: "Because source code changes frequently, but dependencies (package.json) change rarely. By copying package.json and installing dependencies first, Docker caches the expensive 'npm install' layer. This cache is preserved even when source code changes, resulting in lightning-fast subsequent builds."
      },
      {
        question: "What are Multi-Stage Builds, and what problem do they solve?",
        answer: "Multi-stage builds allow you to use multiple FROM instructions in a single Dockerfile, creating distinct build phases. They solve the problem of large image sizes by allowing you to use a heavy, tool-rich image to compile code, and then selectively copy only the compiled artifacts into a fresh, minimal runtime image."
      },
      {
        question: "Why is it best practice to chain commands with '&&' and clean up package managers in a single RUN instruction?",
        answer: "Every RUN instruction creates a new image layer. If you install packages in one RUN, and clean up the cache in the next RUN, the cache files are still permanently baked into the first layer, bloating the image size. Chaining them ensures the temporary files are created and deleted within the same layer, resulting in a much smaller footprint."
      }
    ],
    practicalTask: {
      scenario: "You are reviewing a Dockerfile that updates apt-get and installs 'curl' across two separate RUN statements, which creates unnecessary layers.",
      task: "Refactor the apt-get commands to run in a single RUN statement and clear the apt cache to minimize layer size.",
      solutionCode: "RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*"
    }
  }
];

appendTopics('docker', 'Docker Containerization', 'The definitive guide.', topics);
