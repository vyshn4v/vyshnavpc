import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-1-introduction",
    title: "Chapter 1: Introduction to Kubernetes",
    order: 1,
    content: "<h2>Welcome to Kubernetes</h2><p>Kubernetes (K8s) is an open-source system for automating deployment, scaling, and management of containerized applications.</p>",
    interviewQuestions: [
      { question: "What is Kubernetes?", answer: "Kubernetes is an open-source container orchestration engine for automating deployment, scaling, and management of containerized applications." },
      { question: "Why use Kubernetes?", answer: "It helps in managing containers at scale, providing features like load balancing, auto-scaling, and self-healing." }
    ],
    practicalTask: {
      scenario: "You need a local environment to test Kubernetes.",
      task: "Install minikube and start a local cluster.",
      solutionCode: "minikube start"
    }
  },
  {
    slug: "kubernetes-chapter-2-architecture",
    title: "Chapter 2: Kubernetes Architecture",
    order: 2,
    content: "<h2>K8s Architecture</h2><p>A Kubernetes cluster consists of a control plane and one or more worker nodes.</p>",
    interviewQuestions: [
      { question: "What are the components of the Control Plane?", answer: "API Server, etcd, Scheduler, Controller Manager." },
      { question: "What components run on a worker node?", answer: "kubelet, kube-proxy, and the container runtime." }
    ],
    practicalTask: {
      scenario: "You want to view the nodes in your cluster.",
      task: "Use kubectl to list all nodes in the cluster.",
      solutionCode: "kubectl get nodes"
    }
  },
  {
    slug: "kubernetes-chapter-3-pods",
    title: "Chapter 3: Understanding Pods",
    order: 3,
    content: "<h2>Pods</h2><p>A Pod is the smallest deployable computing unit that you can create and manage in Kubernetes.</p>",
    interviewQuestions: [
      { question: "What is a Pod?", answer: "A Pod is a group of one or more containers, with shared storage and network resources." },
      { question: "Can a Pod have multiple containers?", answer: "Yes, it can run multiple tightly-coupled containers that share resources like network and storage." }
    ],
    practicalTask: {
      scenario: "Deploy a simple Nginx application.",
      task: "Create a pod named 'nginx-pod' using the nginx image.",
      solutionCode: "kubectl run nginx-pod --image=nginx"
    }
  },
  {
    slug: "kubernetes-chapter-4-replicasets",
    title: "Chapter 4: ReplicaSets",
    order: 4,
    content: "<h2>ReplicaSets</h2><p>A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time.</p>",
    interviewQuestions: [
      { question: "What is a ReplicaSet?", answer: "It ensures a specified number of pod replicas are running at any given time." },
      { question: "How does a ReplicaSet know which Pods to manage?", answer: "It uses label selectors to identify the pods." }
    ],
    practicalTask: {
      scenario: "Scale up a deployed application.",
      task: "Scale a replicaset named 'frontend' to 3 replicas.",
      solutionCode: "kubectl scale replicaset frontend --replicas=3"
    }
  },
  {
    slug: "kubernetes-chapter-5-deployments",
    title: "Chapter 5: Deployments",
    order: 5,
    content: "<h2>Deployments</h2><p>A Deployment provides declarative updates for Pods and ReplicaSets.</p>",
    interviewQuestions: [
      { question: "What is the difference between Deployment and ReplicaSet?", answer: "Deployments manage ReplicaSets and provide declarative updates, rollbacks, and easier scaling." },
      { question: "How do you roll back a deployment?", answer: "By using 'kubectl rollout undo deployment/<name>' command." }
    ],
    practicalTask: {
      scenario: "Create a new deployment for an API.",
      task: "Create a deployment named 'api' using the 'redis' image.",
      solutionCode: "kubectl create deployment api --image=redis"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
