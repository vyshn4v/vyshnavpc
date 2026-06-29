import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-26-node-affinity",
    title: "Chapter 26: Node Affinity",
    order: 26,
    content: "<h2>Node Affinity</h2><p>Node affinity is a set of rules used by the scheduler to determine where a pod can be placed.</p>",
    interviewQuestions: [
      { question: "What is the difference between requiredDuringScheduling and preferredDuringScheduling?", answer: "'required' means the pod will not be scheduled if the rule isn't met, while 'preferred' means the scheduler will try but might ignore the rule." },
      { question: "How does Node Affinity differ from Taints?", answer: "Node Affinity attracts pods to nodes, while Taints repel pods from nodes." }
    ],
    practicalTask: {
      scenario: "Review node labels.",
      task: "Show the labels on all nodes.",
      solutionCode: "kubectl get nodes --show-labels"
    }
  },
  {
    slug: "kubernetes-chapter-27-pod-affinity",
    title: "Chapter 27: Pod Affinity and Anti-Affinity",
    order: 27,
    content: "<h2>Pod Affinity</h2><p>Pod affinity allows you to constrain which nodes your pod is eligible to be scheduled based on labels on pods that are already running on the node.</p>",
    interviewQuestions: [
      { question: "What is Pod Anti-Affinity?", answer: "It ensures that specific pods are not scheduled on the same node, often used for high availability." },
      { question: "What is a topology key?", answer: "It defines the boundary (like node, rack, or zone) within which affinity or anti-affinity rules apply." }
    ],
    practicalTask: {
      scenario: "Ensure high availability.",
      task: "Describe a deployment to check its pod anti-affinity rules.",
      solutionCode: "kubectl describe deployment <name>"
    }
  },
  {
    slug: "kubernetes-chapter-28-init-containers",
    title: "Chapter 28: Init Containers",
    order: 28,
    content: "<h2>Init Containers</h2><p>Init containers run before app containers in a Pod and must run to completion.</p>",
    interviewQuestions: [
      { question: "What is an Init Container?", answer: "A container that runs and completes before the main application containers start." },
      { question: "Can a pod have multiple init containers?", answer: "Yes, they execute sequentially in the order they are defined." }
    ],
    practicalTask: {
      scenario: "Set up data before app starts.",
      task: "View logs for an init container named 'setup-db' inside 'app-pod'.",
      solutionCode: "kubectl logs app-pod -c setup-db"
    }
  },
  {
    slug: "kubernetes-chapter-29-ephemeral-containers",
    title: "Chapter 29: Ephemeral Containers",
    order: 29,
    content: "<h2>Ephemeral Containers</h2><p>Ephemeral containers are temporarily added to an existing Pod for troubleshooting.</p>",
    interviewQuestions: [
      { question: "When would you use an Ephemeral Container?", answer: "For debugging and troubleshooting a running pod that doesn't have a shell or debugging tools installed." },
      { question: "Can ephemeral containers be restarted?", answer: "No, they will not be automatically restarted if they exit or crash." }
    ],
    practicalTask: {
      scenario: "Debug a running pod.",
      task: "Add an ephemeral busybox container to 'my-pod' for debugging.",
      solutionCode: "kubectl debug -it my-pod --image=busybox --target=main-app"
    }
  },
  {
    slug: "kubernetes-chapter-30-custom-resources",
    title: "Chapter 30: Custom Resources (CRDs)",
    order: 30,
    content: "<h2>CRDs</h2><p>CustomResourceDefinitions allow you to extend Kubernetes capabilities by adding your own API objects.</p>",
    interviewQuestions: [
      { question: "What is a CRD?", answer: "A Custom Resource Definition is an extension of the Kubernetes API that allows you to define custom resources." },
      { question: "How does a Custom Resource function?", answer: "A custom controller needs to be written to manage the lifecycle and state of the custom resources defined by the CRD." }
    ],
    practicalTask: {
      scenario: "Review installed CRDs.",
      task: "List all CRDs installed in the cluster.",
      solutionCode: "kubectl get crd"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
