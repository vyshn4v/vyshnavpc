import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-41-advanced-crds",
    title: "Chapter 41: Advanced Custom Resource Definitions (CRDs)",
    order: 41,
    content: "### 1. Conceptual Overview\nCustom Resource Definitions (CRDs) allow you to extend Kubernetes capabilities by adding your own API objects. Advanced CRDs go beyond basic schema definitions to include versioning, validation, and defaulting.\n\n### 2. Architecture & Mechanics\nCRDs are stored in etcd and served by the API server just like native resources. Advanced usage involves conversion webhooks to translate between multiple stored versions of the custom resource, as well as validating and mutating admission webhooks to enforce complex business logic.\n\n### 3. Implementation: Standard vs Optimized\nStandard implementation relies solely on OpenAPI v3 validation schemas. Optimized implementation employs admission webhooks to implement complex validations (like cross-field validation) and defaults, ensuring robust data integrity before the object is ever stored in etcd.\n\n### 4. Trade-offs & Complexity\nWhile CRDs make Kubernetes highly extensible, they increase the management overhead. Maintaining multiple API versions, managing webhook certificates, and ensuring high availability of the webhook servers add significant operational complexity.",
    interviewQuestions: [
      { question: "What is the purpose of conversion webhooks in CRDs?", answer: "They translate custom resources between different API versions when reading from or writing to etcd." },
      { question: "How does OpenAPI schema validation work for CRDs?", answer: "It allows you to specify a structural schema for your custom resource, which the Kubernetes API server uses to validate incoming requests." },
      { question: "What is a Mutating Admission Webhook?", answer: "A webhook invoked by the API server before an object is saved, allowing it to modify the incoming object (e.g., to inject defaults)." },
      { question: "Why might you use a Validating Admission Webhook over OpenAPI validation?", answer: "When you need complex, cross-field validation or logic that cannot be expressed via OpenAPI schema constraints." },
      { question: "How are CRDs different from Aggregated APIs?", answer: "CRDs are managed by the main API server and store data in the main etcd, while Aggregated APIs require a separate API server and can use different storage backends." }
    ],
    practicalTask: {
      scenario: "List all Custom Resource Definitions in the cluster.",
      task: "Retrieve a list of all CRDs configured in the current Kubernetes cluster.",
      solutionCode: "kubectl get crds"
    }
  },
  {
    slug: "kubernetes-chapter-42-operators-pattern",
    title: "Chapter 42: Kubernetes Operators Pattern",
    order: 42,
    content: "### 1. Conceptual Overview\nThe Operator pattern is a method of packaging, deploying, and managing a Kubernetes application. It uses custom resources to manage applications and their components by encoding operational knowledge into software.\n\n### 2. Architecture & Mechanics\nAn Operator consists of a CRD and a custom controller running in a Pod. The controller continuously monitors the state of the custom resources via the Kubernetes API. When it detects a drift between the actual state and the desired state defined in the CRD, it executes a reconciliation loop to correct it.\n\n### 3. Implementation: Standard vs Optimized\nA standard implementation might use simple bash scripts or generic tools. An optimized approach uses frameworks like Kubebuilder or Operator SDK, leveraging Go to write robust reconciliation loops with proper backoff, caching, and rate limiting.\n\n### 4. Trade-offs & Complexity\nOperators automate complex day-two operations like backups and upgrades. However, writing an Operator is essentially distributed systems programming. It requires deep knowledge of Kubernetes internals, client-go, and handling edge cases like concurrent modifications and network partitions.",
    interviewQuestions: [
      { question: "What is the core concept behind a Kubernetes Operator?", answer: "It encapsulates operational knowledge (human logic) into a software controller that manages a specific application using custom resources." },
      { question: "What is a reconciliation loop?", answer: "A continuous process in a controller that compares the actual state of the cluster with the desired state and makes changes to reconcile them." },
      { question: "What tools are commonly used to build Operators?", answer: "Operator SDK and Kubebuilder are the most popular frameworks for building Kubernetes Operators." },
      { question: "What is the difference between a Controller and an Operator?", answer: "A Controller is a control loop that watches the state of the cluster. An Operator is a specific type of Controller that manages a custom resource and contains domain-specific knowledge." },
      { question: "How do Operators handle leader election?", answer: "They use Kubernetes resource locks (like Leases or ConfigMaps) to ensure only one instance of the controller actively reconciles resources at a time." }
    ],
    practicalTask: {
      scenario: "Deploy an Operator Lifecycle Manager (OLM).",
      task: "Check the status of OLM pods in the cluster.",
      solutionCode: "kubectl get pods -n olm"
    }
  },
  {
    slug: "kubernetes-chapter-43-service-mesh",
    title: "Chapter 43: Service Mesh Integration",
    order: 43,
    content: "### 1. Conceptual Overview\nA Service Mesh is a dedicated infrastructure layer that handles service-to-service communication, providing features like traffic management, observability, and security without requiring changes to application code.\n\n### 2. Architecture & Mechanics\nA Service Mesh typically employs a sidecar proxy pattern. A proxy (like Envoy) is injected into every application pod. The control plane manages and configures these proxies. All incoming and outgoing traffic for the pod is intercepted and routed through the sidecar proxy.\n\n### 3. Implementation: Standard vs Optimized\nA standard setup relies on Kubernetes Services and basic NetworkPolicies. An optimized Service Mesh implementation (like Istio or Linkerd) provides advanced traffic routing (canary deployments, retries), mutual TLS (mTLS) for encryption, and detailed telemetry via distributed tracing.\n\n### 4. Trade-offs & Complexity\nWhile a Service Mesh provides powerful capabilities, it introduces significant resource overhead (CPU and memory for sidecars) and operational complexity. Debugging network issues becomes harder, as traffic flows through multiple proxies before reaching its destination.",
    interviewQuestions: [
      { question: "What is a sidecar proxy in the context of a Service Mesh?", answer: "A container running alongside the application container in the same pod that intercepts and manages all network traffic for that application." },
      { question: "How does a Service Mesh provide mutual TLS (mTLS)?", answer: "The control plane provisions certificates to the sidecar proxies, which then encrypt and authenticate communication between services automatically." },
      { question: "What is the role of the control plane in a Service Mesh?", answer: "It manages the configuration, policy enforcement, and telemetry collection for all the sidecar proxies (data plane) in the mesh." },
      { question: "Name two popular Service Mesh solutions for Kubernetes.", answer: "Istio and Linkerd." },
      { question: "What is traffic shifting?", answer: "The ability to route a specific percentage of traffic to different versions of a service, commonly used for canary deployments." }
    ],
    practicalTask: {
      scenario: "Label a namespace for Istio injection.",
      task: "Label the 'default' namespace so Istio automatically injects sidecar proxies.",
      solutionCode: "kubectl label namespace default istio-injection=enabled"
    }
  },
  {
    slug: "kubernetes-chapter-44-gitops",
    title: "Chapter 44: GitOps and Continuous Deployment",
    order: 44,
    content: "### 1. Conceptual Overview\nGitOps is a paradigm where Git is the single source of truth for declarative infrastructure and applications. Any changes to the cluster state are made via pull requests to a Git repository.\n\n### 2. Architecture & Mechanics\nA GitOps controller (like ArgoCD or Flux) runs inside the Kubernetes cluster. It continuously monitors the designated Git repository. When a change is merged to the repository, the controller automatically pulls the changes and applies them to the cluster, ensuring the cluster state matches the Git state.\n\n### 3. Implementation: Standard vs Optimized\nA standard CI/CD pipeline pushes changes directly to Kubernetes (push model). An optimized GitOps implementation uses a pull model, where the cluster pulls its configuration from Git. This eliminates the need to expose cluster credentials to external CI systems.\n\n### 4. Trade-offs & Complexity\nGitOps provides excellent auditability, easy rollbacks, and enhanced security. The trade-off is the learning curve associated with declarative configuration management (like Helm or Kustomize) and managing the sheer volume of YAML files. Reconciling drifts made manually outside of Git can also be challenging.",
    interviewQuestions: [
      { question: "What is the primary difference between a Push and Pull CD model?", answer: "In a Push model, an external system deploys to the cluster. In a Pull model (GitOps), an agent in the cluster pulls configuration from a repository." },
      { question: "Why is GitOps considered more secure than traditional CI/CD?", answer: "Because cluster credentials do not need to be shared with external CI servers; the cluster pulls its own configuration." },
      { question: "What happens if someone manually edits a resource in a GitOps environment?", answer: "The GitOps controller will detect the configuration drift and automatically revert the change to match the state defined in Git." },
      { question: "Name two popular GitOps tools for Kubernetes.", answer: "ArgoCD and Flux." },
      { question: "How does GitOps facilitate disaster recovery?", answer: "Since the entire cluster state is defined in Git, restoring a cluster is as simple as pointing a new cluster to the Git repository." }
    ],
    practicalTask: {
      scenario: "Check ArgoCD application status.",
      task: "List all ArgoCD applications in the 'argocd' namespace.",
      solutionCode: "kubectl get applications -n argocd"
    }
  },
  {
    slug: "kubernetes-chapter-45-cluster-api",
    title: "Chapter 45: Multi-Cluster Management and Cluster API",
    order: 45,
    content: "### 1. Conceptual Overview\nAs organizations scale, they often need to manage multiple Kubernetes clusters. The Cluster API (CAPI) provides a declarative way to provision, upgrade, and operate multiple Kubernetes clusters across different infrastructure providers.\n\n### 2. Architecture & Mechanics\nCluster API uses a management cluster to deploy and manage workload clusters. It introduces new CRDs such as Cluster, Machine, and MachineDeployment. Infrastructure-specific providers translate these resources into actual VMs and load balancers on cloud platforms like AWS, GCP, or vSphere.\n\n### 3. Implementation: Standard vs Optimized\nStandard multi-cluster provisioning relies on bespoke automation scripts or tools like Terraform. The optimized Cluster API approach brings infrastructure provisioning into the Kubernetes ecosystem, allowing you to use native Kubernetes tools (kubectl, GitOps) to manage the lifecycle of entire clusters.\n\n### 4. Trade-offs & Complexity\nCluster API standardizes cluster lifecycle management across environments, reducing vendor lock-in. However, it requires maintaining a highly available management cluster. Troubleshooting can be complex as it involves debugging nested layers of Kubernetes resources and cloud provider APIs.",
    interviewQuestions: [
      { question: "What is the purpose of the Cluster API?", answer: "To provide a declarative, Kubernetes-native way to manage the lifecycle (creation, scaling, upgrading) of multiple Kubernetes clusters." },
      { question: "What is a Management Cluster in Cluster API?", answer: "A Kubernetes cluster that runs the Cluster API controllers and is used to manage other workload clusters." },
      { question: "How does Cluster API interact with different cloud providers?", answer: "It uses Infrastructure Providers, which are specific controllers that translate Cluster API resources into cloud-specific API calls." },
      { question: "What is the difference between a Machine and a Node in CAPI?", answer: "A Machine is a declarative representation of the infrastructure (e.g., a VM), while a Node is the Kubernetes object representing the compute resource once the kubelet registers." },
      { question: "How do you scale out a cluster using Cluster API?", answer: "By updating the replicas field on the MachineDeployment or MachineSet resource in the management cluster." }
    ],
    practicalTask: {
      scenario: "List Cluster API clusters.",
      task: "List all clusters managed by Cluster API in the current namespace.",
      solutionCode: "kubectl get clusters"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Masterclass', '...', topics);
