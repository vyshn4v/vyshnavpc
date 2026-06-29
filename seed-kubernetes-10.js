import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "k8s-crd-operators",
    title: "46. Custom Resource Definitions (CRDs) & Operators",
    order: 46,
    content: `
      <h3>1. Conceptual Overview</h3>
      <p>Kubernetes is highly extensible. Custom Resource Definitions (CRDs) allow you to create your own API objects, extending Kubernetes' capabilities beyond standard resources like Pods and Deployments. The Operator pattern combines CRDs with custom controllers to fully automate the management of complex stateful applications.</p>
      
      <h3>2. Architecture & Mechanics</h3>
      <p>When you create a CRD, the Kubernetes API server creates a new RESTful resource path. A custom controller (the Operator) continuously watches the API server for changes to these custom resources. Upon detecting a change, the Operator executes a reconciliation loop to bring the current state of the system into alignment with the desired state declared in the CRD.</p>
      
      <h3>3. Implementation: Standard vs Optimized</h3>
      <p><strong>Standard:</strong> Manually defining a CRD using basic YAML and writing a simple controller script that polls the API server periodically.</p>
      <p><strong>Optimized:</strong> Utilizing frameworks like Kubebuilder or the Operator SDK. These tools provide scaffolding, caching via informers, and efficiently manage the watch streams, drastically reducing boilerplate and API load.</p>
      
      <h3>4. Trade-offs & Complexity</h3>
      <p>While Operators provide immense power to automate Day-2 operations, they introduce significant complexity. Writing a robust reconciliation loop requires handling edge cases, retries, and race conditions. For simple applications, standard native resources (Deployments, StatefulSets) are often sufficient and much easier to maintain.</p>
    `,
    interviewQuestions: [
      {
        question: "What is a Custom Resource Definition (CRD)?",
        answer: "A CRD is a Kubernetes API extension that allows you to define custom objects, making them behave like native Kubernetes resources."
      },
      {
        question: "Explain the Operator pattern.",
        answer: "The Operator pattern combines CRDs with a custom controller to automate the deployment and management of complex, stateful applications by constantly reconciling the actual state with the desired state."
      },
      {
        question: "What is a reconciliation loop?",
        answer: "It is a continuous process within a controller that observes the current state of a system, compares it to the desired state, and takes necessary actions to align them."
      },
      {
        question: "Why use Kubebuilder or Operator SDK?",
        answer: "These frameworks simplify the creation of Operators by generating boilerplate code, providing robust informer-based caching, and setting up testing environments."
      },
      {
        question: "What are the drawbacks of using Operators?",
        answer: "Operators introduce high development and maintenance complexity. Writing a bug-free reconciliation loop is challenging and overkill for simple stateless applications."
      }
    ],
    practicalTask: "Use Kubebuilder to bootstrap an Operator project, define a 'WebApp' CRD, and deploy it to a local minikube cluster."
  },
  {
    slug: "k8s-advanced-scheduling",
    title: "47. Advanced Scheduling: Taints, Tolerations, and Affinity",
    order: 47,
    content: `
      <h3>1. Conceptual Overview</h3>
      <p>Advanced scheduling in Kubernetes dictates exactly where Pods should or should not run. Taints and tolerations repel Pods from specific nodes, while Node/Pod affinity and anti-affinity attract or distribute Pods across the cluster based on specific rules.</p>
      
      <h3>2. Architecture & Mechanics</h3>
      <p><strong>Taints</strong> are applied to Nodes. A Pod cannot schedule on a tainted Node unless it has a matching <strong>Toleration</strong>. <strong>Node Affinity</strong> uses node labels to attract Pods to specific nodes (e.g., nodes with GPUs). <strong>Pod Affinity/Anti-affinity</strong> schedules Pods based on the labels of other Pods already running on the nodes, useful for co-locating or separating services.</p>
      
      <h3>3. Implementation: Standard vs Optimized</h3>
      <p><strong>Standard:</strong> Using basic nodeSelectors for simple placement rules.</p>
      <p><strong>Optimized:</strong> Combining strict Node Affinity (requiredDuringSchedulingIgnoredDuringExecution) for hard requirements with preferred rules for soft constraints. Utilizing pod anti-affinity to ensure High Availability by distributing replicas across different availability zones or failure domains.</p>
      
      <h3>4. Trade-offs & Complexity</h3>
      <p>Advanced scheduling greatly improves cluster utilization and resilience. However, complex affinity rules force the kube-scheduler to perform extensive computations, potentially slowing down scheduling in large clusters. Over-constraining Pods can also lead to pending states where no nodes satisfy the requirements.</p>
    `,
    interviewQuestions: [
      {
        question: "What is the difference between Taints and Node Affinity?",
        answer: "Taints repel Pods from nodes unless they tolerate the taint, while Node Affinity attracts Pods to nodes based on node labels."
      },
      {
        question: "How do Tolerations work?",
        answer: "Tolerations are applied to Pods and allow (but do not require) them to be scheduled on nodes with matching Taints."
      },
      {
        question: "Explain requiredDuringSchedulingIgnoredDuringExecution.",
        answer: "It is a hard affinity rule specifying that the Pod MUST only be scheduled onto a node if the rule is met. Existing Pods are not evicted if the node's labels change."
      },
      {
        question: "What is Pod Anti-Affinity used for?",
        answer: "It is used to prevent multiple instances of the same Pod from being scheduled on the same node or in the same failure domain, maximizing high availability."
      },
      {
        question: "What is a potential risk of using complex scheduling rules?",
        answer: "Complex rules can increase the computational load on the kube-scheduler and lead to unschedulable Pods if the cluster lacks nodes that satisfy all constraints."
      }
    ],
    practicalTask: "Taint a node in your cluster to repel all pods. Create a deployment with a toleration for that taint, and observe the pods being scheduled successfully on the tainted node."
  },
  {
    slug: "k8s-security-rbac",
    title: "48. Kubernetes Security: RBAC & Network Policies",
    order: 48,
    content: `
      <h3>1. Conceptual Overview</h3>
      <p>Security in Kubernetes is multi-layered. Role-Based Access Control (RBAC) governs who can interact with the Kubernetes API, while Network Policies control the traffic flow between Pods at the network layer (Layer 3/4).</p>
      
      <h3>2. Architecture & Mechanics</h3>
      <p>RBAC consists of Roles/ClusterRoles (defining permissions like 'get' or 'create' on resources) and RoleBindings/ClusterRoleBindings (attaching those roles to Users, Groups, or ServiceAccounts). Network Policies act as a firewall for Pods, using label selectors to define ingress and egress rules. A CNI (Container Network Interface) plugin that supports Network Policies is required to enforce them.</p>
      
      <h3>3. Implementation: Standard vs Optimized</h3>
      <p><strong>Standard:</strong> Granting cluster-admin rights to developers or leaving namespaces open where all Pods can communicate with each other.</p>
      <p><strong>Optimized:</strong> Implementing the principle of least privilege using granular RoleBindings. Adopting a 'default deny all' Network Policy per namespace, explicitly opening ingress and egress paths only for required service-to-service communication.</p>
      
      <h3>4. Trade-offs & Complexity</h3>
      <p>Implementing strict RBAC and Network Policies significantly shrinks the attack surface. However, it requires a deep understanding of application dependencies. Misconfigured RBAC can lock out users or services, while overly strict Network Policies can silently drop legitimate traffic, leading to difficult-to-debug connectivity issues.</p>
    `,
    interviewQuestions: [
      {
        question: "What is Role-Based Access Control (RBAC) in Kubernetes?",
        answer: "RBAC is a method of regulating access to computer or network resources based on the roles of individual users within the cluster."
      },
      {
        question: "What is the difference between a Role and a ClusterRole?",
        answer: "A Role applies permissions within a specific namespace, whereas a ClusterRole applies permissions cluster-wide, across all namespaces."
      },
      {
        question: "What is a ServiceAccount?",
        answer: "A ServiceAccount provides an identity for processes that run in a Pod, allowing them to authenticate with the Kubernetes API server."
      },
      {
        question: "How do Network Policies work?",
        answer: "Network Policies specify how groups of Pods are allowed to communicate with each other and other network endpoints, acting as a virtual firewall."
      },
      {
        question: "Why might a Network Policy not take effect?",
        answer: "A Network Policy will only be enforced if the cluster's networking plugin (CNI) supports Network Policies (e.g., Calico, Cilium). Standard Flannel does not."
      }
    ],
    practicalTask: "Create a default-deny Network Policy for a namespace. Then, deploy a frontend and backend Pod, and create a targeted Network Policy that only allows the frontend to communicate with the backend."
  },
  {
    slug: "k8s-helm-package-management",
    title: "49. Helm & Package Management in Kubernetes",
    order: 49,
    content: `
      <h3>1. Conceptual Overview</h3>
      <p>Helm is the package manager for Kubernetes. It simplifies the deployment of complex applications by bundling multiple Kubernetes manifests into a single reusable package called a Chart, supporting templating and versioning.</p>
      
      <h3>2. Architecture & Mechanics</h3>
      <p>A Helm Chart contains a <code>Chart.yaml</code> (metadata), a <code>values.yaml</code> (default configuration variables), and a <code>templates</code> directory containing Go-templated Kubernetes manifests. When you run <code>helm install</code>, Helm renders the templates using the provided values and submits the resulting YAML to the Kubernetes API, tracking the deployment as a Release.</p>
      
      <h3>3. Implementation: Standard vs Optimized</h3>
      <p><strong>Standard:</strong> Hardcoding values directly into Kubernetes manifests or maintaining multiple raw YAML files for different environments (dev, staging, prod).</p>
      <p><strong>Optimized:</strong> Abstracting configuration into a structured Helm Chart. Utilizing environment-specific <code>values-prod.yaml</code> files to dynamically inject resource limits, replica counts, and image tags during the CI/CD pipeline deployment.</p>
      
      <h3>4. Trade-offs & Complexity</h3>
      <p>Helm dramatically reduces code duplication and streamlines CI/CD workflows. The downside is the learning curve of Go templating. Complex charts with heavily nested conditionals can become difficult to read and maintain, sometimes making raw YAML or tools like Kustomize more appealing for simpler scenarios.</p>
    `,
    interviewQuestions: [
      {
        question: "What is Helm in Kubernetes?",
        answer: "Helm is a package manager that helps you define, install, and upgrade even the most complex Kubernetes applications using Charts."
      },
      {
        question: "What are the core components of a Helm Chart?",
        answer: "A Chart primarily consists of a Chart.yaml file for metadata, a values.yaml file for default configurations, and a templates directory containing templated Kubernetes manifests."
      },
      {
        question: "What happens when you run 'helm install'?",
        answer: "Helm combines the templates with the values to generate valid Kubernetes YAML manifests, sends them to the API server, and creates a tracked Release in the cluster."
      },
      {
        question: "How does Helm handle application updates?",
        answer: "Helm tracks releases using secrets in the cluster. When you run 'helm upgrade', it computes the diff between the old and new rendered manifests and applies the changes."
      },
      {
        question: "Compare Helm to Kustomize.",
        answer: "Helm uses a templating engine to generate manifests based on variables, whereas Kustomize uses an overlay approach, patching base YAML files without templates."
      }
    ],
    practicalTask: "Create a simple Helm chart for an Nginx web server. Use Go templating to make the deployment replica count and service port configurable via the values.yaml file."
  },
  {
    slug: "k8s-monitoring-logging",
    title: "50. Cluster Monitoring & Logging",
    order: 50,
    content: `
      <h3>1. Conceptual Overview</h3>
      <p>Operating a Kubernetes cluster blindly is dangerous. Comprehensive monitoring and logging provide visibility into cluster health, resource utilization, and application performance. The industry standard stack usually involves Prometheus for metrics and Grafana for visualization.</p>
      
      <h3>2. Architecture & Mechanics</h3>
      <p>Prometheus operates on a pull model, scraping metrics endpoints exposed by Pods, Nodes, and the Kubernetes API server itself. These metrics are stored as time-series data. Grafana connects to Prometheus to query and visualize this data. For logging, tools like Fluentd or Promtail aggregate container logs from nodes and ship them to a central backend (like Elasticsearch or Loki).</p>
      
      <h3>3. Implementation: Standard vs Optimized</h3>
      <p><strong>Standard:</strong> Relying solely on <code>kubectl top</code> or native Kubernetes dashboard without historical data retention, and checking logs manually with <code>kubectl logs</code>.</p>
      <p><strong>Optimized:</strong> Deploying the kube-prometheus-stack using Helm, establishing a robust Alertmanager configuration to page on-call engineers for critical issues (like Node NotReady or high CrashLoopBackOff rates), and centralizing logs with a dedicated log aggregator for easy searching.</p>
      
      <h3>4. Trade-offs & Complexity</h3>
      <p>A full observability stack is essential for production but consumes significant cluster resources (CPU, Memory, and Disk I/O). Maintaining Prometheus instances, managing data retention policies, and tuning alert thresholds to avoid alert fatigue require dedicated engineering effort.</p>
    `,
    interviewQuestions: [
      {
        question: "What is Prometheus and how does it collect data?",
        answer: "Prometheus is a monitoring and alerting toolkit. It collects metrics using a pull model, periodically scraping HTTP endpoints exposed by target applications."
      },
      {
        question: "What is the role of Grafana in a Kubernetes cluster?",
        answer: "Grafana is a visualization tool that integrates with data sources like Prometheus to create customizable dashboards for monitoring cluster and application health."
      },
      {
        question: "How do you handle central logging in Kubernetes?",
        answer: "Central logging is usually handled by deploying a DaemonSet (like Fluentd or Promtail) that collects container stdout/stderr logs from all nodes and forwards them to a backend like Elasticsearch or Loki."
      },
      {
        question: "What is Alertmanager?",
        answer: "Alertmanager handles alerts sent by Prometheus, managing deduplication, grouping, and routing them to integrations like Slack, PagerDuty, or email."
      },
      {
        question: "What does 'CrashLoopBackOff' mean and how would you monitor it?",
        answer: "It means a pod is repeatedly crashing and restarting. It can be monitored by setting up a Prometheus alert based on the kube_pod_container_status_restarts_total metric."
      }
    ],
    practicalTask: "Deploy the Prometheus stack via Helm in your cluster. Create a custom Grafana dashboard that displays the CPU and Memory usage of a specific namespace."
  }
];

appendTopics('kubernetes', 'Kubernetes Masterclass', '...', topics);
