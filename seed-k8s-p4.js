import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-16-advanced-crds",
    title: "Chapter 16: Advanced Custom Resource Definitions (CRDs) and Operators",
    order: 16,
    content: `<h2>Advanced CRDs and the Operator Pattern</h2>
<p>In Kubernetes, Custom Resource Definitions (CRDs) allow you to extend the API. Instead of just managing standard resources like Pods and Deployments, you can introduce custom domains such as databases or message queues directly into the control plane.</p>
<h3>Creating a Complex CRD</h3>
<p>Here is an example of an advanced CRD that includes OpenAPI v3 validation, custom columns, and subresources (status and scale).</p>
<pre><code class="language-yaml">
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: databases.company.com
spec:
  group: company.com
  versions:
    - name: v1alpha1
      served: true
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                replicas:
                  type: integer
                  minimum: 1
                engine:
                  type: string
                  enum: ["postgres", "mysql"]
      subresources:
        status: {}
        scale:
          specReplicasPath: .spec.replicas
          statusReplicasPath: .status.replicas
      additionalPrinterColumns:
        - name: Engine
          type: string
          jsonPath: .spec.engine
          description: The database engine
</code></pre>
<h3>The Operator Pattern</h3>
<p>The Operator pattern utilizes custom resources to manage applications and their components using a custom controller. Operators encode operational knowledge into software, managing complex stateful applications.</p>
<pre><code class="language-go">
// Example snippet of a Kubebuilder controller in Go
func (r *DatabaseReconciler) Reconcile(ctx context.Context, req ctrl.Request) (ctrl.Result, error) {
    var db companycomv1alpha1.Database
    if err := r.Get(ctx, req.NamespacedName, &db); err != nil {
        return ctrl.Result{}, client.IgnoreNotFound(err)
    }
    // Implement logic to provision a Postgres or MySQL instance based on db.Spec.Engine
    return ctrl.Result{}, nil
}
</code></pre>
<p>Writing an operator often requires extensive Go knowledge using the <code>controller-runtime</code> library. The reconciler continuously compares the desired state to the actual state and performs actions to converge them.</p>`,
    interviewQuestions: [
      { question: "What is a CRD in Kubernetes?", answer: "A Custom Resource Definition (CRD) is an extension of the Kubernetes API that allows users to define custom resources and their schemas." },
      { question: "What is the Operator Pattern?", answer: "The Operator pattern combines CRDs and custom controllers to encode operational knowledge into software, allowing Kubernetes to manage complex applications natively." },
      { question: "How does OpenAPI v3 validation help in CRDs?", answer: "It allows the Kubernetes API server to validate custom resources on creation or update, ensuring that required fields and specific formats (like enums or integer limits) are respected." },
      { question: "What are CRD subresources?", answer: "Subresources like `status` and `scale` allow controllers to update the status without modifying the spec, and allow tools like HPA to scale custom resources automatically." },
      { question: "What are custom printer columns?", answer: "Custom printer columns allow `kubectl get` to display specific fields from the custom resource directly in the CLI output." },
      { question: "What is Kubebuilder?", answer: "Kubebuilder is a framework for building Kubernetes APIs and controllers using Go." }
    ],
    practicalTask: {
      scenario: "You need to add a custom resource for managing caching instances.",
      task: "Create a CRD for Cache instances with replicas and engine type.",
      solutionCode: "kubectl apply -f crd.yaml"
    }
  },
  {
    slug: "kubernetes-chapter-17-security-rbac",
    title: "Chapter 17: Kubernetes Security, RBAC, and OIDC Integration",
    order: 17,
    content: `<h2>Kubernetes Security Architecture</h2>
<p>Kubernetes security revolves around the 4C's: Cloud, Cluster, Container, and Code. At the cluster level, securing the API server is paramount. This involves Authentication, Authorization, and Admission Control.</p>
<h3>Role-Based Access Control (RBAC)</h3>
<p>RBAC is the primary authorization mechanism in Kubernetes. It defines Roles (namespaced) and ClusterRoles (cluster-wide), and binds them to subjects (Users, Groups, or ServiceAccounts) using RoleBindings or ClusterRoleBindings.</p>
<pre><code class="language-yaml">
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-pods-global
subjects:
- kind: Group
  name: developers
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
</code></pre>
<h3>OIDC Integration</h3>
<p>Kubernetes delegates user authentication to external identity providers using OpenID Connect (OIDC). By configuring the API server with OIDC flags, it can validate JWT tokens issued by providers like Dex, Okta, or Keycloak.</p>
<pre><code class="language-bash">
# API Server OIDC flags
--oidc-issuer-url=https://accounts.google.com
--oidc-client-id=my-kubernetes-client
--oidc-username-claim=email
--oidc-groups-claim=groups
</code></pre>
<p>Once authenticated, the API server extracts the user identity and groups from the JWT and passes them to the RBAC authorizer.</p>`,
    interviewQuestions: [
      { question: "How does Kubernetes perform authorization?", answer: "Kubernetes uses authorization plugins like RBAC, ABAC, Webhook, or Node authorizer. RBAC is the most common." },
      { question: "What is the difference between a Role and a ClusterRole?", answer: "A Role applies to resources within a specific namespace, whereas a ClusterRole can apply to cluster-scoped resources, non-resource endpoints, or resources across all namespaces." },
      { question: "How does OIDC work in Kubernetes?", answer: "The API server is configured to trust an OIDC identity provider. Users present a JWT token to the API server, which validates the signature, extracts user and group claims, and passes them to the authorizer." },
      { question: "Can you create users natively in Kubernetes?", answer: "No, Kubernetes does not have a native object for normal users. User management is entirely externalized (e.g., certificates, OIDC)." },
      { question: "What is an Admission Controller?", answer: "An admission controller intercepts requests to the Kubernetes API server prior to persistence but after authentication and authorization. It can mutate or validate the request." },
      { question: "How do ServiceAccounts differ from Users?", answer: "ServiceAccounts are native Kubernetes objects used by pods to interact with the API server, whereas regular users are managed externally." }
    ],
    practicalTask: {
      scenario: "You want a specific user to only view pods in a given namespace.",
      task: "Create a Role and RoleBinding to grant pod read access.",
      solutionCode: "kubectl create role pod-reader --verb=get,list,watch --resource=pods && kubectl create rolebinding pod-reader-binding --role=pod-reader --user=jane"
    }
  },
  {
    slug: "kubernetes-chapter-18-advanced-scheduling",
    title: "Chapter 18: Advanced Pod Scheduling and Taints/Tolerations",
    order: 18,
    content: `<h2>Advanced Pod Scheduling</h2>
<p>The kube-scheduler is responsible for assigning Pods to Nodes. While simple setups rely on standard resource requests, advanced deployments require precise control over where workloads land.</p>
<h3>Node Affinity and Anti-Affinity</h3>
<p>Node affinity allows you to constrain which nodes your pod is eligible to be scheduled on based on node labels.</p>
<pre><code class="language-yaml">
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - us-east-1a
            - us-east-1b
</code></pre>
<h3>Pod Affinity and Anti-Affinity</h3>
<p>Pod affinity rules constrain scheduling based on the labels of other pods already running on the node, rather than the node's labels.</p>
<h3>Taints and Tolerations</h3>
<p>Taints are applied to nodes to repel pods, while tolerations are applied to pods to allow them to be scheduled on tainted nodes. This is often used for dedicated nodes (e.g., GPU nodes or control plane nodes).</p>
<pre><code class="language-bash">
# Taint a node
kubectl taint nodes node1 dedicated=gpu:NoSchedule
</code></pre>
<pre><code class="language-yaml">
# Pod toleration
tolerations:
- key: "dedicated"
  operator: "Equal"
  value: "gpu"
  effect: "NoSchedule"
</code></pre>`,
    interviewQuestions: [
      { question: "What is a Taint?", answer: "A taint is a property on a node that repels pods unless the pod has a matching toleration." },
      { question: "What is a Toleration?", answer: "A toleration is a property on a pod that allows the scheduler to schedule it onto a node with a matching taint." },
      { question: "What are the taint effects?", answer: "NoSchedule (pods won't be scheduled), PreferNoSchedule (scheduler tries to avoid scheduling), NoExecute (existing pods will be evicted if they don't tolerate the taint)." },
      { question: "Explain requiredDuringSchedulingIgnoredDuringExecution.", answer: "It is a hard requirement for node affinity. If the node doesn't match the labels, the pod cannot be scheduled." },
      { question: "What is Pod Anti-Affinity used for?", answer: "It ensures pods of the same deployment are spread across different nodes or availability zones for high availability." },
      { question: "How does the scheduler score nodes?", answer: "After filtering out ineligible nodes (predicates), it scores remaining nodes (priorities) based on factors like resource availability and soft affinity rules, picking the node with the highest score." }
    ],
    practicalTask: {
      scenario: "You need a pod to avoid running on a master node.",
      task: "Add a toleration if required, or ensure you don't tolerate the NoSchedule taint.",
      solutionCode: "kubectl describe node master | grep Taint"
    }
  },
  {
    slug: "kubernetes-chapter-19-autoscaling",
    title: "Chapter 19: Cluster Autoscaling and Horizontal Pod Autoscaler (HPA)",
    order: 19,
    content: `<h2>Scaling Workloads and Clusters</h2>
<p>Autoscaling in Kubernetes operates at two distinct layers: scaling the number of Pods (HPA) and scaling the number of Nodes (Cluster Autoscaler).</p>
<h3>Horizontal Pod Autoscaler (HPA)</h3>
<p>The HPA automatically updates a workload resource (like a Deployment) to match demand based on observed CPU utilization, memory, or custom metrics.</p>
<pre><code class="language-yaml">
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: web-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: web
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
</code></pre>
<h3>Cluster Autoscaler</h3>
<p>The Cluster Autoscaler adds or removes worker nodes based on pending pods. If a pod cannot be scheduled due to insufficient resources, the autoscaler provisions a new node. If a node is underutilized, it will drain and terminate it.</p>
<p>For custom metrics (like Kafka queue length or HTTP request rate), you can integrate Prometheus with KEDA (Kubernetes Event-driven Autoscaling) or Prometheus Adapter.</p>`,
    interviewQuestions: [
      { question: "What is the Horizontal Pod Autoscaler (HPA)?", answer: "HPA scales the number of pod replicas in a replication controller, deployment, or stateful set based on observed metric utilization." },
      { question: "What does the Cluster Autoscaler do?", answer: "It scales the number of nodes in a cluster up when pods cannot be scheduled due to resource constraints, and down when nodes are underutilized." },
      { question: "What is Vertical Pod Autoscaling (VPA)?", answer: "VPA automatically adjusts the CPU and memory requests and limits for containers in a pod based on historical usage." },
      { question: "Why should you avoid using HPA and VPA on the same resource metrics?", answer: "Because they might conflict. If both react to high CPU by scaling up replicas (HPA) and increasing limits (VPA), it leads to unpredictable scaling behavior." },
      { question: "What is KEDA?", answer: "Kubernetes Event-driven Autoscaling (KEDA) is an operator that allows autoscaling based on external events like message queue depth." },
      { question: "How does the metrics server relate to HPA?", answer: "HPA queries the metrics-server to get CPU and memory utilization data in order to make scaling decisions." }
    ],
    practicalTask: {
      scenario: "You want a deployment to scale automatically based on CPU usage.",
      task: "Create an HPA resource targeting the deployment.",
      solutionCode: "kubectl autoscale deployment web --cpu-percent=50 --min=2 --max=10"
    }
  },
  {
    slug: "kubernetes-chapter-20-network-policies",
    title: "Chapter 20: Network Policies and CNI Integrations",
    order: 20,
    content: `<h2>Network Policies and CNI Providers</h2>
<p>By default, Kubernetes pods are non-isolated; they accept traffic from any source. NetworkPolicies allow you to control traffic flow at the IP address or port level, implementing a zero-trust network model.</p>
<h3>Implementing Network Policies</h3>
<p>A NetworkPolicy specifies how groups of pods are allowed to communicate with each other and other network endpoints.</p>
<pre><code class="language-yaml">
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - protocol: TCP
      port: 8080
</code></pre>
<h3>CNI Providers: Calico vs Cilium</h3>
<p>For NetworkPolicies to work, the cluster must use a Container Network Interface (CNI) plugin that supports them. Calico uses standard iptables/BGP to enforce policies. Cilium utilizes eBPF (Extended Berkeley Packet Filter) to provide highly scalable and high-performance networking, observability, and security directly in the Linux kernel.</p>`,
    interviewQuestions: [
      { question: "What is a NetworkPolicy?", answer: "A NetworkPolicy is a Kubernetes resource that defines how pods are allowed to communicate with each other and other network endpoints." },
      { question: "Are pods isolated by default?", answer: "No, by default all pods can communicate with any other pod in the cluster without restrictions." },
      { question: "What is required for NetworkPolicies to take effect?", answer: "A CNI plugin that supports NetworkPolicies, such as Calico, Cilium, or WeaveNet, must be installed." },
      { question: "What does an empty podSelector {} mean in a NetworkPolicy?", answer: "It selects all pods in the namespace where the policy is created." },
      { question: "What is the difference between Ingress and Egress in NetworkPolicy?", answer: "Ingress controls incoming traffic to the selected pods, while Egress controls outgoing traffic from the selected pods." },
      { question: "Why is eBPF significant in Kubernetes networking (e.g., Cilium)?", answer: "eBPF allows attaching networking and security logic directly to the kernel, bypassing iptables overhead, leading to massive performance gains and deeper observability." }
    ],
    practicalTask: {
      scenario: "You want to block all incoming traffic to a namespace.",
      task: "Create a default deny ingress NetworkPolicy.",
      solutionCode: "kubectl apply -f default-deny.yaml"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide.', topics);
