import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-21-probes",
    title: "Chapter 21: Liveness and Readiness Probes",
    order: 21,
    content: "<h2>Probes</h2><p>Probes are diagnostic checks performed periodically by the kubelet on a container.</p>",
    interviewQuestions: [
      { question: "What is a Liveness Probe?", answer: "It checks if the container is running. If it fails, the container is restarted." },
      { question: "What is a Readiness Probe?", answer: "It checks if the container is ready to accept traffic. If it fails, the pod is removed from service endpoints." }
    ],
    practicalTask: {
      scenario: "Configure health checks.",
      task: "Add a readiness probe to a deployment using an HTTP GET request to /health.",
      solutionCode: "kubectl edit deployment api # Then add readinessProbe section"
    }
  },
  {
    slug: "kubernetes-chapter-22-hpa",
    title: "Chapter 22: Horizontal Pod Autoscaler",
    order: 22,
    content: "<h2>HPA</h2><p>HPA automatically scales the number of Pods in a replication controller, deployment, replica set or stateful set based on observed CPU utilization.</p>",
    interviewQuestions: [
      { question: "What does Horizontal Pod Autoscaler do?", answer: "It automatically scales the number of pods based on resource utilization metrics like CPU or memory." },
      { question: "What is required for HPA to work?", answer: "A Metrics Server must be deployed in the cluster to provide resource usage metrics." }
    ],
    practicalTask: {
      scenario: "Enable auto-scaling.",
      task: "Autoscale a deployment named 'web' between 2 and 5 pods based on 80% CPU usage.",
      solutionCode: "kubectl autoscale deployment web --min=2 --max=5 --cpu-percent=80"
    }
  },
  {
    slug: "kubernetes-chapter-23-vpa",
    title: "Chapter 23: Vertical Pod Autoscaler",
    order: 23,
    content: "<h2>VPA</h2><p>Vertical Pod Autoscaler allows you to automatically set resource requests and limits based on usage.</p>",
    interviewQuestions: [
      { question: "How does VPA differ from HPA?", answer: "VPA scales pods vertically by adjusting CPU/memory requests, while HPA scales horizontally by adding/removing pods." },
      { question: "Can you use VPA and HPA together?", answer: "Yes, but they should not be configured to auto-scale on the same metric (like CPU) to avoid conflicts." }
    ],
    practicalTask: {
      scenario: "Review VPA configuration.",
      task: "List all VPA resources in the cluster.",
      solutionCode: "kubectl get vpa --all-namespaces"
    }
  },
  {
    slug: "kubernetes-chapter-24-cluster-autoscaler",
    title: "Chapter 24: Cluster Autoscaler",
    order: 24,
    content: "<h2>Cluster Autoscaler</h2><p>Cluster Autoscaler automatically adjusts the size of the Kubernetes cluster when there are pods that fail to run due to insufficient resources.</p>",
    interviewQuestions: [
      { question: "What triggers the Cluster Autoscaler to scale up?", answer: "When pods are stuck in the 'Pending' state due to a lack of available resources on nodes." },
      { question: "What triggers the Cluster Autoscaler to scale down?", answer: "When a node is underutilized and its pods can be safely moved to other nodes." }
    ],
    practicalTask: {
      scenario: "Check node scaling.",
      task: "Describe the cluster-autoscaler deployment to review its logs and configuration.",
      solutionCode: "kubectl describe configmap cluster-autoscaler-status -n kube-system"
    }
  },
  {
    slug: "kubernetes-chapter-25-taints-tolerations",
    title: "Chapter 25: Taints and Tolerations",
    order: 25,
    content: "<h2>Taints and Tolerations</h2><p>Taints and tolerations work together to ensure that pods are not scheduled onto inappropriate nodes.</p>",
    interviewQuestions: [
      { question: "What is a Taint?", answer: "A taint is applied to a node, repelling pods from being scheduled on it unless they have a matching toleration." },
      { question: "What is a Toleration?", answer: "A toleration is applied to a pod, allowing it to bypass specific node taints." }
    ],
    practicalTask: {
      scenario: "Isolate a node for specific workloads.",
      task: "Taint a node named 'node1' with key 'dedicated' and value 'gpu' with a NoSchedule effect.",
      solutionCode: "kubectl taint nodes node1 dedicated=gpu:NoSchedule"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
