import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-content-trust",
    title: "41. Docker Content Trust (DCT)",
    order: 41,
    content: "### 1. Conceptual Overview\nDocker Content Trust (DCT) provides the ability to use digital signatures for data sent to and received from remote Docker registries. These signatures allow client-side or runtime verification of the integrity and publisher of specific image tags.\n\n### 2. Architecture & Mechanics\nDCT relies on Notary, an open-source tool that provides trust over arbitrary collections of data. When DCT is enabled, Docker signs the image metadata upon push and verifies the signatures upon pull using offline and tagging keys.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Default pulling without validation, exposing the system to tampered images.\nOptimized: Enabling `DOCKER_CONTENT_TRUST=1` ensures that only signed images can be pulled, run, or built upon.\n\n### 4. Trade-offs & Complexity\nEnabling DCT introduces key management overhead. Developers must safeguard their private keys. CI/CD pipelines require delegation keys to push signed images autonomously, increasing configuration complexity.",
    interviewQuestions: [
      { question: "What is Docker Content Trust?", answer: "Validates image origin and integrity via signatures, ensuring tampered images are not pulled." },
      { question: "Which tool backs Docker Content Trust?", answer: "Notary, an open-source tool that provides trust over arbitrary data." },
      { question: "How do you enable DCT?", answer: "By setting the environment variable DOCKER_CONTENT_TRUST=1." },
      { question: "What happens if you pull an unsigned image with DCT enabled?", answer: "The pull operation fails immediately." },
      { question: "What are delegation keys in DCT?", answer: "Keys used in CI/CD to sign images autonomously without using the highly sensitive root key." }
    ],
    practicalTask: {
      scenario: "Secure image verification.",
      task: "Pull a signed Alpine image with DCT enabled.",
      solutionCode: "export DOCKER_CONTENT_TRUST=1 && docker pull alpine:latest"
    }
  },
  {
    slug: "rootless-docker",
    title: "42. Rootless Docker",
    order: 42,
    content: "### 1. Conceptual Overview\nRootless mode allows running the Docker daemon and containers as a non-root user. This mitigates potential vulnerabilities in the daemon and the container runtime, preventing host takeover if a container breakout occurs.\n\n### 2. Architecture & Mechanics\nRootless Docker uses user namespaces to map a range of user IDs on the host to the container. It relies on tools like `slirp4netns` for network isolation and `fuse-overlayfs` for storage without requiring root privileges.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Docker daemon runs as root, risking severe privilege escalation.\nOptimized: Installing and running Docker in rootless mode strictly limits daemon capabilities and confines container breakout impacts.\n\n### 4. Trade-offs & Complexity\nRootless mode does not support all Docker features. Features like AppArmor, checkpoint/restore, and binding to privileged ports (<1024) are restricted. Storage performance might degrade slightly due to user-space filesystem overhead.",
    interviewQuestions: [
      { question: "What is the primary benefit of Rootless Docker?", answer: "Prevents container breakout vulnerabilities from gaining root access to the host system." },
      { question: "Which namespace is crucial for rootless containers?", answer: "The user namespace." },
      { question: "Can rootless Docker bind to port 80?", answer: "Not by default, as ports below 1024 are privileged and require root." },
      { question: "What tool is commonly used for rootless networking?", answer: "slirp4netns is used for creating network namespaces without root." },
      { question: "Are all Docker features supported in rootless mode?", answer: "No, features like cgroups resource limits and AppArmor profiles have restrictions." }
    ],
    practicalTask: {
      scenario: "Running rootless.",
      task: "Start the rootless Docker daemon via script.",
      solutionCode: "dockerd-rootless.sh --experimental"
    }
  },
  {
    slug: "advanced-networking-macvlan",
    title: "43. Advanced Docker Networking: Macvlan and IPvlan",
    order: 43,
    content: "### 1. Conceptual Overview\nMacvlan and IPvlan allow Docker containers to connect directly to the physical network, bypassing the Docker bridge. They make containers appear as physical devices on the network, highly useful for legacy applications requiring direct network presence.\n\n### 2. Architecture & Mechanics\nMacvlan assigns a unique MAC address to each container. IPvlan shares the host's MAC address but assigns unique IP addresses to containers. Both operate at the kernel level to route packets efficiently without NAT overhead.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Bridge networking with NAT, which is simple but adds latency and obscures container IPs.\nOptimized: Using Macvlan for legacy applications requiring Layer 2 network presence or IPvlan for Layer 3 setups with restricted switch port configurations.\n\n### 4. Trade-offs & Complexity\nMacvlan requires promiscuous mode on the host network interface, which may be blocked in cloud environments. Host-to-container communication is blocked by default in Macvlan for security, requiring complex routing rules to bypass.",
    interviewQuestions: [
      { question: "When should you use Macvlan?", answer: "When containers need their own MAC address and direct access to the physical network." },
      { question: "How does IPvlan differ from Macvlan?", answer: "IPvlan shares the host MAC address, while Macvlan assigns unique MAC addresses to containers." },
      { question: "Why might Macvlan fail in AWS or GCP?", answer: "Cloud providers often block traffic from unknown MAC addresses or disable promiscuous mode." },
      { question: "Can the Docker host ping a Macvlan container?", answer: "No, host-to-container communication is blocked by default for isolation." },
      { question: "What is the benefit of removing NAT?", answer: "It reduces routing latency and allows the container IP to be visible on the external network." }
    ],
    practicalTask: {
      scenario: "Create a Macvlan network.",
      task: "Create a Macvlan network linked to eth0.",
      solutionCode: "docker network create -d macvlan --subnet=192.168.1.0/24 -o parent=eth0 my_macvlan"
    }
  },
  {
    slug: "custom-seccomp-profiles",
    title: "44. Custom Docker Seccomp Profiles",
    order: 44,
    content: "### 1. Conceptual Overview\nSeccomp (secure computing mode) is a Linux kernel feature that restricts the system calls available to a process. Docker uses a default seccomp profile to disable highly dangerous syscalls for containers out of the box.\n\n### 2. Architecture & Mechanics\nWhen a container starts, Docker passes a JSON-formatted seccomp profile to the kernel. Any syscall made by the container is checked against this profile. If not permitted, the kernel blocks it and typically kills the process or returns an error.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Running with Docker's default seccomp profile, which blocks around 44 out of 300+ syscalls.\nOptimized: Creating a custom, tightly constrained seccomp profile that only allows the exact syscalls needed by a specific application, reducing attack surfaces.\n\n### 4. Trade-offs & Complexity\nCreating custom profiles requires deep knowledge of the application's runtime behavior. Tracing syscalls (using strace or eBPF) is time-consuming, and missing a required syscall will crash the container under specific edge cases in production.",
    interviewQuestions: [
      { question: "What does seccomp stand for?", answer: "Secure computing mode, a kernel-level sandbox feature." },
      { question: "What is the purpose of a seccomp profile in Docker?", answer: "To explicitly restrict which system calls a container can make to the host kernel." },
      { question: "How do you apply a custom seccomp profile?", answer: "By using the --security-opt seccomp=profile.json flag during docker run." },
      { question: "What happens if a container makes a blocked syscall?", answer: "The syscall is denied, and the process typically receives a SIGSYS signal or an error." },
      { question: "How does seccomp compare to AppArmor?", answer: "Seccomp filters low-level syscalls at the kernel entry level, while AppArmor restricts file and network access paths." }
    ],
    practicalTask: {
      scenario: "Applying a custom seccomp profile.",
      task: "Run a container with a custom seccomp profile named strict.json.",
      solutionCode: "docker run --rm --security-opt seccomp=strict.json alpine echo 'Hello'"
    }
  },
  {
    slug: "buildx-multi-arch",
    title: "45. Advanced Multi-arch Builds with Buildx",
    order: 45,
    content: "### 1. Conceptual Overview\nDocker Buildx is an advanced CLI plugin that extends the standard `docker build` command with the full support of the features provided by Moby BuildKit, including concurrent multi-platform builds.\n\n### 2. Architecture & Mechanics\nBuildx uses QEMU (an open-source machine emulator) for cross-compilation. It spins up specialized build containers, compiles the application for multiple architectures (e.g., amd64, arm64), and packages them into a multi-arch manifest list pushed to a registry.\n\n### 3. Implementation: Standard vs Optimized\nStandard: Building individual images sequentially on different hardware and manually stitching manifests together.\nOptimized: Using `docker buildx build --platform linux/amd64,linux/arm64` to seamlessly cross-compile and push a unified multi-arch image from a single command.\n\n### 4. Trade-offs & Complexity\nEmulation via QEMU can be significantly slower than native compilation. Managing buildx builders requires configuring QEMU on the host, which adds an extra setup step in CI/CD environments and may cause timeouts for large binaries.",
    interviewQuestions: [
      { question: "What is Docker Buildx?", answer: "A CLI plugin that provides advanced BuildKit capabilities, notably concurrent multi-arch builds." },
      { question: "How does Buildx support cross-platform compilation?", answer: "By utilizing QEMU emulation behind the scenes to build for non-native architectures." },
      { question: "What is a multi-arch manifest list?", answer: "An image reference in a registry that contains pointers to architecture-specific image layers." },
      { question: "Why is QEMU-based building sometimes avoided?", answer: "Because software emulation causes significant performance degradation compared to native builds." },
      { question: "What is BuildKit?", answer: "A modern, concurrent, and highly cache-efficient build engine used under the hood by Buildx." }
    ],
    practicalTask: {
      scenario: "Multi-arch build.",
      task: "Build and push an image for both amd64 and arm64 architectures.",
      solutionCode: "docker buildx build --platform linux/amd64,linux/arm64 -t myapp:latest --push ."
    }
  }
];

await appendTopics('docker', 'Docker Masterclass', '...', topics);
