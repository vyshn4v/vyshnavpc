import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-36-troubleshooting",
    title: "Chapter 36: Troubleshooting Pods",
    order: 36,
    content: "<h2>Troubleshooting</h2><p>Identifying why a pod failed is a critical skill for any Kubernetes administrator.</p>",
    interviewQuestions: [
      { question: "What does 'CrashLoopBackOff' mean?", answer: "It means a pod keeps crashing immediately after starting, so Kubernetes backs off before restarting it." },
      { question: "What does 'ImagePullBackOff' indicate?", answer: "The node is unable to pull the container image, possibly due to a typo, missing image, or authentication failure." }
    ],
    practicalTask: {
      scenario: "Investigate a failing pod.",
      task: "Describe a pod named 'failing-pod' to see its events.",
      solutionCode: "kubectl describe pod failing-pod"
    }
  },
  {
    slug: "kubernetes-chapter-37-kubeconfig",
    title: "Chapter 37: Kubeconfig Files",
    order: 37,
    content: "<h2>Kubeconfig</h2><p>A kubeconfig file is used to configure access to one or multiple Kubernetes clusters.</p>",
    interviewQuestions: [
      { question: "What are the three main sections of a kubeconfig file?", answer: "Clusters, Users, and Contexts." },
      { question: "How can you view your current kubeconfig?", answer: "By using the 'kubectl config view' command." }
    ],
    practicalTask: {
      scenario: "Switch context.",
      task: "Switch the current kubectl context to 'prod-cluster'.",
      solutionCode: "kubectl config use-context prod-cluster"
    }
  },
  {
    slug: "kubernetes-chapter-38-security-best-practices",
    title: "Chapter 38: Security Best Practices",
    order: 38,
    content: "<h2>Security Best Practices</h2><p>Securing a Kubernetes cluster involves multiple layers, from the API server to individual pods.</p>",
    interviewQuestions: [
      { question: "Why should you disable root access in containers?", answer: "To limit the potential damage if a container is compromised." },
      { question: "What is Pod Security Admission?", answer: "A built-in admission controller that enforces Pod Security Standards at the namespace level." }
    ],
    practicalTask: {
      scenario: "Check API access.",
      task: "Verify if you have permission to create deployments.",
      solutionCode: "kubectl auth can-i create deployments"
    }
  },
  {
    slug: "kubernetes-chapter-39-upgrading",
    title: "Chapter 39: Upgrading a Cluster",
    order: 39,
    content: "<h2>Upgrading</h2><p>Keeping a Kubernetes cluster up-to-date is crucial for security and new features.</p>",
    interviewQuestions: [
      { question: "What is the recommended approach to upgrading a cluster?", answer: "Upgrade the control plane first, then upgrade the worker nodes one by one." },
      { question: "What does draining a node do?", answer: "It safely evicts all pods from the node, making it safe to take down for maintenance or upgrades." }
    ],
    practicalTask: {
      scenario: "Prepare a node for maintenance.",
      task: "Drain a node named 'worker-1', ignoring daemonsets.",
      solutionCode: "kubectl drain worker-1 --ignore-daemonsets"
    }
  },
  {
    slug: "kubernetes-chapter-40-future",
    title: "Chapter 40: The Future of Kubernetes",
    order: 40,
    content: "<h2>The Future</h2><p>Kubernetes continues to evolve with new API features, eBPF integration, and multi-cluster management.</p>",
    interviewQuestions: [
      { question: "What is Gateway API?", answer: "An evolution of Ingress that provides more expressive and extensible routing capabilities." },
      { question: "How does eBPF impact Kubernetes?", answer: "It allows for highly efficient and secure networking, observability, and security at the kernel level without modifying kernel source code." }
    ],
    practicalTask: {
      scenario: "Check API versions.",
      task: "List all supported API versions in your cluster.",
      solutionCode: "kubectl api-versions"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
