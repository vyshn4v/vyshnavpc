import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-6-services",
    title: "Chapter 6: Services",
    order: 6,
    content: "<h2>Services</h2><p>An abstract way to expose an application running on a set of Pods as a network service.</p>",
    interviewQuestions: [
      { question: "What is a Kubernetes Service?", answer: "A Kubernetes Service provides a single, stable IP address and DNS name for a set of pods." },
      { question: "What are the types of Services?", answer: "ClusterIP, NodePort, LoadBalancer, and ExternalName." }
    ],
    practicalTask: {
      scenario: "Expose a deployment locally.",
      task: "Expose the 'nginx' deployment on port 80 as a ClusterIP service.",
      solutionCode: "kubectl expose deployment nginx --port=80"
    }
  },
  {
    slug: "kubernetes-chapter-7-namespaces",
    title: "Chapter 7: Namespaces",
    order: 7,
    content: "<h2>Namespaces</h2><p>Namespaces provide a mechanism for isolating groups of resources within a single cluster.</p>",
    interviewQuestions: [
      { question: "Why use Namespaces?", answer: "To divide cluster resources between multiple users, teams, or environments." },
      { question: "How do you specify a namespace in kubectl?", answer: "Using the '-n' or '--namespace' flag." }
    ],
    practicalTask: {
      scenario: "Isolate a development environment.",
      task: "Create a namespace named 'dev'.",
      solutionCode: "kubectl create namespace dev"
    }
  },
  {
    slug: "kubernetes-chapter-8-configmaps",
    title: "Chapter 8: ConfigMaps",
    order: 8,
    content: "<h2>ConfigMaps</h2><p>ConfigMaps allow you to decouple environment-specific configuration from your container images.</p>",
    interviewQuestions: [
      { question: "What is a ConfigMap?", answer: "An API object used to store non-confidential data in key-value pairs." },
      { question: "How can a Pod use a ConfigMap?", answer: "As environment variables, command-line arguments, or configuration files in a volume." }
    ],
    practicalTask: {
      scenario: "Store configuration properties.",
      task: "Create a ConfigMap named 'app-config' from a literal 'ENV=prod'.",
      solutionCode: "kubectl create configmap app-config --from-literal=ENV=prod"
    }
  },
  {
    slug: "kubernetes-chapter-9-secrets",
    title: "Chapter 9: Secrets",
    order: 9,
    content: "<h2>Secrets</h2><p>Secrets let you store and manage sensitive information, such as passwords, OAuth tokens, and ssh keys.</p>",
    interviewQuestions: [
      { question: "How are Secrets different from ConfigMaps?", answer: "Secrets are meant for sensitive data and are encoded in base64." },
      { question: "Is base64 encoding encryption?", answer: "No, base64 is just encoding. Kubernetes Secrets should ideally be encrypted at rest." }
    ],
    practicalTask: {
      scenario: "Store a database password securely.",
      task: "Create a secret named 'db-secret' with a literal 'password=secret123'.",
      solutionCode: "kubectl create secret generic db-secret --from-literal=password=secret123"
    }
  },
  {
    slug: "kubernetes-chapter-10-volumes",
    title: "Chapter 10: Volumes",
    order: 10,
    content: "<h2>Volumes</h2><p>On-disk files in a container are ephemeral. Volumes provide a way to store data persistently.</p>",
    interviewQuestions: [
      { question: "What is a Volume in Kubernetes?", answer: "A directory containing data, accessible to the containers in a pod." },
      { question: "What is an emptyDir volume?", answer: "A volume that is created when a pod is assigned to a node, and exists as long as the pod is running." }
    ],
    practicalTask: {
      scenario: "List all persistent volumes.",
      task: "Use kubectl to list all PersistentVolumes (PV).",
      solutionCode: "kubectl get pv"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
