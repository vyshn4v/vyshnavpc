import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-16-ingress",
    title: "Chapter 16: Ingress",
    order: 16,
    content: "<h2>Ingress</h2><p>An API object that manages external access to the services in a cluster, typically HTTP.</p>",
    interviewQuestions: [
      { question: "What is an Ingress?", answer: "Ingress provides HTTP and HTTPS routing to services based on paths and hosts." },
      { question: "What is required for Ingress to work?", answer: "An Ingress controller must be running in the cluster." }
    ],
    practicalTask: {
      scenario: "Check routing rules.",
      task: "List all ingress resources in the default namespace.",
      solutionCode: "kubectl get ingress"
    }
  },
  {
    slug: "kubernetes-chapter-17-networkpolicies",
    title: "Chapter 17: Network Policies",
    order: 17,
    content: "<h2>Network Policies</h2><p>NetworkPolicies specify how groups of pods are allowed to communicate with each other and other network endpoints.</p>",
    interviewQuestions: [
      { question: "What is a Network Policy?", answer: "A specification of how pods are allowed to communicate with various network 'entities' over the network." },
      { question: "Is network policy enforced by default?", answer: "By default, pods are non-isolated; they accept traffic from any source. Network policies must be explicitly applied." }
    ],
    practicalTask: {
      scenario: "Check network rules.",
      task: "List all network policies in the cluster.",
      solutionCode: "kubectl get networkpolicies --all-namespaces"
    }
  },
  {
    slug: "kubernetes-chapter-18-rbac",
    title: "Chapter 18: RBAC",
    order: 18,
    content: "<h2>Role-Based Access Control</h2><p>RBAC is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise.</p>",
    interviewQuestions: [
      { question: "What is a Role in K8s?", answer: "A Role defines a set of permissions within a specific namespace." },
      { question: "How does a ClusterRole differ from a Role?", answer: "A ClusterRole defines permissions across the entire cluster, not bound to a single namespace." }
    ],
    practicalTask: {
      scenario: "Check assigned roles.",
      task: "List all roles in the 'dev' namespace.",
      solutionCode: "kubectl get roles -n dev"
    }
  },
  {
    slug: "kubernetes-chapter-19-serviceaccounts",
    title: "Chapter 19: Service Accounts",
    order: 19,
    content: "<h2>Service Accounts</h2><p>A ServiceAccount provides an identity for processes that run in a Pod.</p>",
    interviewQuestions: [
      { question: "Why do we need Service Accounts?", answer: "To allow applications running inside pods to securely authenticate and communicate with the Kubernetes API." },
      { question: "What happens if a pod doesn't specify a service account?", answer: "It uses the 'default' service account in its namespace." }
    ],
    practicalTask: {
      scenario: "Create a new service account.",
      task: "Create a service account named 'jenkins'.",
      solutionCode: "kubectl create serviceaccount jenkins"
    }
  },
  {
    slug: "kubernetes-chapter-20-securitycontexts",
    title: "Chapter 20: Security Contexts",
    order: 20,
    content: "<h2>Security Contexts</h2><p>A security context defines privilege and access control settings for a Pod or Container.</p>",
    interviewQuestions: [
      { question: "What is a Security Context?", answer: "It defines privilege and access control settings, such as running as a specific user or avoiding root access." },
      { question: "Can you apply a security context to a pod?", answer: "Yes, security contexts can be defined at both the Pod level and the individual Container level." }
    ],
    practicalTask: {
      scenario: "Check running pods security.",
      task: "Get details of a pod named 'secure-pod' to review its security context.",
      solutionCode: "kubectl get pod secure-pod -o yaml"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
