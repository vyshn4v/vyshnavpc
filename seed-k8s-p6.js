import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-26-monitoring-prometheus",
    title: "Chapter 26: Monitoring, Prometheus, and Grafana Ecosystem",
    order: 26,
    content: `<h2>Cluster Observability and Monitoring</h2>
<p>Monitoring is critical for operating Kubernetes in production. The CNCF standard for metrics gathering is Prometheus, usually paired with Grafana for visualization.</p>
<h3>Prometheus Architecture</h3>
<p>Prometheus operates on a pull-based model. It scrapes HTTP endpoints (usually <code>/metrics</code>) exposed by applications and cluster components. The data is stored as time-series metrics.</p>
<pre><code class="language-yaml">
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: frontend-monitor
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: frontend
  endpoints:
  - port: web
    path: /metrics
    interval: 15s
</code></pre>
<h3>Kube-state-metrics and Node Exporter</h3>
<p>To monitor the cluster itself, <code>kube-state-metrics</code> exposes metrics about the state of Kubernetes objects (e.g., pod phases, replica counts), while <code>node_exporter</code> runs as a DaemonSet to expose hardware and OS metrics (CPU, Memory, Disk I/O) from the nodes.</p>
<h3>Alertmanager</h3>
<p>Prometheus evaluates PromQL alert rules and sends triggers to Alertmanager, which handles deduplication, grouping, and routing of alerts to Slack, PagerDuty, or Email.</p>`,
    interviewQuestions: [
      { question: "What is Prometheus?", answer: "Prometheus is an open-source systems monitoring and alerting toolkit built around a time-series database and a pull-based scraping mechanism." },
      { question: "What is a ServiceMonitor in the Prometheus Operator?", answer: "A Custom Resource that declaratively specifies how groups of Kubernetes services should be monitored and scraped by Prometheus." },
      { question: "How does Prometheus differ from traditional monitoring tools?", answer: "Prometheus uses a pull model via HTTP instead of agents pushing data, heavily utilizes labels for multidimensional data, and provides the powerful PromQL query language." },
      { question: "What does kube-state-metrics do?", answer: "It listens to the Kubernetes API server and generates metrics about the state of objects, like how many pods are crashing or deployment replica counts." },
      { question: "What is PromQL?", answer: "PromQL is the query language for Prometheus, allowing users to select and aggregate time-series data in real time." },
      { question: "What is the role of Alertmanager?", answer: "It receives firing alerts from Prometheus, groups them, suppresses duplicates, and routes them to notification receivers." }
    ],
    practicalTask: {
      scenario: "You need to query the CPU usage of a specific pod.",
      task: "Write a PromQL query for pod CPU usage.",
      solutionCode: "rate(container_cpu_usage_seconds_total{pod=\"frontend-xyz\"}[5m])"
    }
  },
  {
    slug: "kubernetes-chapter-27-logging-elk",
    title: "Chapter 27: Logging with ELK/EFK Stack and Fluentbit",
    order: 27,
    content: `<h2>Centralized Logging in Kubernetes</h2>
<p>Containers are ephemeral, so writing logs to local files is an anti-pattern. Applications should log to <code>stdout/stderr</code>. A node-level logging agent is then required to collect, transform, and forward these logs to a central backend.</p>
<h3>The EFK Stack</h3>
<p>The EFK stack consists of Elasticsearch (storage/search), Fluentd or Fluentbit (collection), and Kibana (visualization). Fluentbit is preferred over Fluentd in Kubernetes as it is written in C and consumes significantly less memory.</p>
<pre><code class="language-yaml">
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluent-bit
spec:
  template:
    spec:
      containers:
      - name: fluent-bit
        image: fluent/fluent-bit:latest
        volumeMounts:
        - name: varlog
          mountPath: /var/log
        - name: varlibdockercontainers
          mountPath: /var/lib/docker/containers
          readOnly: true
</code></pre>
<h3>Log Enrichment</h3>
<p>Fluentbit includes a Kubernetes filter that queries the local kubelet to enrich log streams with metadata like Pod Name, Namespace, Labels, and Annotations before shipping them to Elasticsearch. This makes logs highly searchable in Kibana.</p>`,
    interviewQuestions: [
      { question: "Why is a DaemonSet used for logging agents?", answer: "A DaemonSet ensures that exactly one instance of the logging agent (like Fluentbit) runs on every node, allowing it to collect logs from all pods scheduled on that node." },
      { question: "Where do container logs reside on a worker node?", answer: "They are typically stored in `/var/log/containers/` and `/var/log/pods/`, which symlink to the actual container runtime logs." },
      { question: "What is the difference between Fluentd and Fluentbit?", answer: "Fluentd is written in Ruby/C and has a massive plugin ecosystem but uses more memory. Fluentbit is written purely in C, is highly optimized for performance, and uses very little memory, making it ideal as a node agent." },
      { question: "Why should applications log to stdout/stderr in Kubernetes?", answer: "Because the container runtime automatically captures streams from stdout/stderr, allowing native tools like `kubectl logs` and logging agents to easily access them." },
      { question: "How does the Kubernetes filter in Fluentbit work?", answer: "It intercepts the log, extracts the pod name and namespace from the file path, queries the kubelet API, and appends Kubernetes metadata (labels, annotations) to the log payload." },
      { question: "What is Loki?", answer: "Loki is a log aggregation system by Grafana that only indexes labels (not full text), making it highly cost-effective and deeply integrated with Prometheus." }
    ],
    practicalTask: {
      scenario: "You need to view logs of a crash-looping pod's previous execution.",
      task: "Use kubectl to fetch logs from the previous container instance.",
      solutionCode: "kubectl logs pod-name --previous"
    }
  },
  {
    slug: "kubernetes-chapter-28-kubeadm",
    title: "Chapter 28: Kubeadm and Hard-way Cluster Provisioning",
    order: 28,
    content: `<h2>Cluster Provisioning Internals</h2>
<p>While managed services (EKS, GKE, AKS) hide the control plane, understanding how to bootstrap a cluster is vital for on-premise deployments or debugging.</p>
<h3>Kubeadm</h3>
<p><code>kubeadm</code> is the official tool for bootstrapping a Kubernetes cluster. It performs the heavy lifting of generating certificates, writing kubeconfig files, and spinning up control plane components as Static Pods.</p>
<pre><code class="language-bash">
# Bootstrap the control plane
kubeadm init --pod-network-cidr=192.168.0.0/16

# Join a worker node
kubeadm join 10.0.0.10:6443 --token <token> --discovery-token-ca-cert-hash sha256:<hash>
</code></pre>
<h3>Static Pods and Certificates</h3>
<p>When you run <code>kubeadm init</code>, it places manifest files in <code>/etc/kubernetes/manifests/</code>. The local Kubelet directly monitors this directory and starts the API Server, etcd, Scheduler, and Controller Manager directly, without needing an API server to be running first.</p>
<p>Certificate management is critical. <code>kubeadm</code> creates a CA and signs certificates for all components. These usually expire after 1 year and must be renewed using <code>kubeadm certs renew</code>.</p>`,
    interviewQuestions: [
      { question: "What is kubeadm?", answer: "Kubeadm is a tool that provides `kubeadm init` and `kubeadm join` as best-practice fast paths for creating Kubernetes clusters." },
      { question: "What are Static Pods?", answer: "Static Pods are managed directly by the kubelet daemon on a specific node, without the API server observing them. They are used to bootstrap control plane components." },
      { question: "Where does the kubelet look for Static Pod manifests?", answer: "Typically in `/etc/kubernetes/manifests/`." },
      { question: "What is the role of etcd?", answer: "Etcd is a strongly consistent, distributed key-value store that holds all the cluster state and configuration data." },
      { question: "How do worker nodes authenticate to the API Server?", answer: "They use TLS client certificates generated during the `kubeadm join` process via the TLS bootstrapping mechanism." },
      { question: "What happens if etcd loses quorum?", answer: "The Kubernetes API server becomes read-only. You cannot create, update, or delete any resources until quorum is restored." }
    ],
    practicalTask: {
      scenario: "You need to renew cluster certificates.",
      task: "Check the expiration date of kubeadm certificates.",
      solutionCode: "kubeadm certs check-expiration"
    }
  },
  {
    slug: "kubernetes-chapter-29-cluster-api",
    title: "Chapter 29: Multi-cluster Management and Cluster API",
    order: 29,
    content: `<h2>Cluster API (CAPI)</h2>
<p>Managing a single cluster is solved, but managing fleets of clusters is complex. Cluster API brings declarative, Kubernetes-style APIs to cluster creation, configuration, and management.</p>
<h3>Clusters as Resources</h3>
<p>With CAPI, you use a management cluster to deploy workload clusters across various infrastructure providers (AWS, vSphere, Azure, bare metal).</p>
<pre><code class="language-yaml">
apiVersion: cluster.x-k8s.io/v1beta1
kind: Cluster
metadata:
  name: my-workload-cluster
spec:
  clusterNetwork:
    pods:
      cidrBlocks: ["192.168.0.0/16"]
  infrastructureRef:
    apiVersion: infrastructure.cluster.x-k8s.io/v1beta1
    kind: AWSCluster
    name: my-workload-cluster
  controlPlaneRef:
    apiVersion: controlplane.cluster.x-k8s.io/v1beta1
    kind: KubeadmControlPlane
    name: my-workload-cluster-cp
</code></pre>
<h3>Machine Deployments</h3>
<p>Similar to how a Deployment manages Pods, a MachineDeployment manages Machines. If a node goes down, CAPI's Machine controller will automatically provision a new VM via the cloud provider's API and join it to the cluster.</p>`,
    interviewQuestions: [
      { question: "What is Cluster API (CAPI)?", answer: "A Kubernetes sub-project that provides declarative APIs and tooling to simplify provisioning, upgrading, and operating multiple Kubernetes clusters." },
      { question: "What is the difference between a management cluster and a workload cluster?", answer: "A management cluster runs the CAPI controllers and stores the CRDs defining other clusters. A workload cluster is the target cluster where actual applications run." },
      { question: "What is a MachineDeployment?", answer: "A CAPI resource that manages a set of Machine resources, similar to how a standard Deployment manages Pods, providing declarative updates and scaling for cluster nodes." },
      { question: "How does CAPI handle infrastructure providers?", answer: "It uses provider-specific controllers (e.g., CAPA for AWS, CAPZ for Azure) to translate CAPI generic resources into cloud-specific API calls to create VMs and load balancers." },
      { question: "Can CAPI be used for bare-metal?", answer: "Yes, using providers like Tinkerbell, Metal3, or BYOH (Bring Your Own Host)." },
      { question: "What happens if a Machine resource is deleted?", answer: "The CAPI controller will instruct the infrastructure provider to terminate the underlying VM and provision a new one to satisfy the MachineDeployment replica count." }
    ],
    practicalTask: {
      scenario: "You need to initialize a management cluster for AWS.",
      task: "Use the clusterctl CLI to initialize the providers.",
      solutionCode: "clusterctl init --infrastructure aws"
    }
  },
  {
    slug: "kubernetes-chapter-30-troubleshooting",
    title: "Chapter 30: Troubleshooting and Debugging Kubernetes Internals",
    order: 30,
    content: `<h2>Mastering Kubernetes Troubleshooting</h2>
<p>Debugging Kubernetes requires a systematic approach. Issues can stem from the application, the network, or the cluster infrastructure.</p>
<h3>Debugging Pods</h3>
<p>When a pod is failing, the sequence is generally: <code>kubectl get events</code> -> <code>kubectl describe pod</code> -> <code>kubectl logs</code>. CrashLoopBackOff usually indicates an application error on startup or a missing configuration (like a Secret).</p>
<h3>Network Troubleshooting</h3>
<p>If services cannot communicate, use an ephemeral debug container with network tools (like <code>netshoot</code>) to test DNS resolution and connectivity.</p>
<pre><code class="language-bash">
# Attach an ephemeral debug container to a running pod
kubectl debug -it pod/my-app --image=nicolaka/netshoot --target=my-app
</code></pre>
<p>Common DNS issues can be diagnosed by querying CoreDNS. Check if <code>nslookup kubernetes.default.svc.cluster.local</code> resolves correctly.</p>
<h3>Control Plane Debugging</h3>
<p>If the API is slow or nodes show NotReady, check the kubelet logs on the nodes using <code>journalctl -u kubelet</code>. High etcd latency is a common cause of control plane instability; monitor disk IOPS on the etcd nodes.</p>`,
    interviewQuestions: [
      { question: "What does CrashLoopBackOff mean?", answer: "It means a container repeatedly fails and exits shortly after starting. Kubernetes employs an exponential backoff delay before restarting it again." },
      { question: "What does ImagePullBackOff mean?", answer: "The kubelet is unable to pull the container image, possibly due to a typo in the image name, missing image pull secrets, or network issues." },
      { question: "How do you use ephemeral containers?", answer: "Using `kubectl debug`, which attaches a temporary container to a running pod, allowing you to use debugging tools without including them in the production image." },
      { question: "How do you view kubelet logs on a systemd-based node?", answer: "By SSHing into the node and running `journalctl -u kubelet`." },
      { question: "What is CoreDNS?", answer: "CoreDNS is the default DNS server in Kubernetes that resolves Service names to ClusterIPs." },
      { question: "Why might a node become NotReady?", answer: "The kubelet might have crashed, the node might be out of memory/disk space, or the network connection between the node and the API server might be broken." }
    ],
    practicalTask: {
      scenario: "A pod is failing to start and you suspect it's an environment variable issue.",
      task: "Check the pod's events to find out why it's failing.",
      solutionCode: "kubectl describe pod <pod-name>"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide.', topics);
