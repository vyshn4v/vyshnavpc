import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-31-helm",
    title: "Chapter 31: Helm Fundamentals",
    order: 31,
    content: "<h2>Helm</h2><p>Helm is a package manager for Kubernetes that helps you define, install, and upgrade complex Kubernetes applications.</p>",
    interviewQuestions: [
      { question: "What is a Helm Chart?", answer: "A Helm Chart is a collection of files that describe a related set of Kubernetes resources." },
      { question: "What is Helm values.yaml?", answer: "A file used to provide default configuration values for a Helm chart." }
    ],
    practicalTask: {
      scenario: "Deploy an application using Helm.",
      task: "Install a helm chart named 'my-release' from the bitnami/nginx repository.",
      solutionCode: "helm install my-release bitnami/nginx"
    }
  },
  {
    slug: "kubernetes-chapter-32-kustomize",
    title: "Chapter 32: Kustomize",
    order: 32,
    content: "<h2>Kustomize</h2><p>Kustomize is a standalone tool to customize Kubernetes objects through a kustomization file.</p>",
    interviewQuestions: [
      { question: "How does Kustomize differ from Helm?", answer: "Kustomize uses an overlay and patch model without templating, whereas Helm uses a templating engine." },
      { question: "Is Kustomize built into kubectl?", answer: "Yes, kubectl natively supports Kustomize using the '-k' flag." }
    ],
    practicalTask: {
      scenario: "Apply kustomized resources.",
      task: "Apply a kustomization directory located at './kustomize/base'.",
      solutionCode: "kubectl apply -k ./kustomize/base"
    }
  },
  {
    slug: "kubernetes-chapter-33-operators",
    title: "Chapter 33: Kubernetes Operators",
    order: 33,
    content: "<h2>Operators</h2><p>Operators are software extensions to Kubernetes that make use of custom resources to manage applications and their components.</p>",
    interviewQuestions: [
      { question: "What is a Kubernetes Operator?", answer: "A method of packaging, deploying, and managing a Kubernetes application using CRDs and custom controllers." },
      { question: "When should you write an Operator?", answer: "When you have complex, stateful applications that require human operational knowledge to run and manage." }
    ],
    practicalTask: {
      scenario: "Check operator deployments.",
      task: "List all deployments in the 'olm' (Operator Lifecycle Manager) namespace.",
      solutionCode: "kubectl get deployments -n olm"
    }
  },
  {
    slug: "kubernetes-chapter-34-logging",
    title: "Chapter 34: Logging Architecture",
    order: 34,
    content: "<h2>Logging</h2><p>Understanding how logs work in Kubernetes is critical for troubleshooting.</p>",
    interviewQuestions: [
      { question: "Where are container logs stored by default?", answer: "They are written to standard output and standard error, and the kubelet writes them to files on the node." },
      { question: "What is a logging agent?", answer: "A daemonset (like Fluentd or Promtail) that runs on each node to collect logs and forward them to a central location." }
    ],
    practicalTask: {
      scenario: "Read logs of a pod.",
      task: "Get the logs for a pod named 'api-server' from the previous failed run.",
      solutionCode: "kubectl logs api-server --previous"
    }
  },
  {
    slug: "kubernetes-chapter-35-monitoring",
    title: "Chapter 35: Monitoring and Metrics",
    order: 35,
    content: "<h2>Monitoring</h2><p>Monitoring tracks the health and performance of the Kubernetes cluster and the applications running on it.</p>",
    interviewQuestions: [
      { question: "What is Prometheus?", answer: "An open-source systems monitoring and alerting toolkit widely used in Kubernetes environments." },
      { question: "What is the Metrics Server?", answer: "A cluster-wide aggregator of resource usage data essential for HPA." }
    ],
    practicalTask: {
      scenario: "Check node resource usage.",
      task: "Use the 'top' command to view resource usage of nodes.",
      solutionCode: "kubectl top nodes"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
