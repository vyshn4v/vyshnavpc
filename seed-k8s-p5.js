import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-21-service-mesh",
    title: "Chapter 21: Service Mesh Architecture with Istio and Linkerd",
    order: 21,
    content: `<h2>Service Mesh Architecture</h2>
<p>A Service Mesh is a dedicated infrastructure layer for facilitating service-to-service communications between microservices, using a proxy (often Envoy) sidecar injected into every pod. It handles routing, security, and observability.</p>
<h3>Istio Architecture</h3>
<p>Istio splits the mesh into a data plane (Envoy proxies) and a control plane (Istiod). Istio allows advanced traffic routing such as Canary deployments, A/B testing, and fault injection.</p>
<pre><code class="language-yaml">
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.svc.cluster.local
  http:
  - route:
    - destination:
        host: myapp
        subset: v1
      weight: 90
    - destination:
        host: myapp
        subset: v2
      weight: 10
</code></pre>
<h3>Mutual TLS (mTLS)</h3>
<p>A major feature of a Service Mesh is transparent mTLS. Proxies automatically encrypt traffic between services and verify identities, ensuring a zero-trust network environment without modifying application code.</p>
<h3>Linkerd</h3>
<p>Linkerd is a lighter-weight alternative to Istio. Built in Rust for performance, it avoids Envoy in favor of a specialized micro-proxy, focusing on simplicity and ease of use.</p>`,
    interviewQuestions: [
      { question: "What is a Service Mesh?", answer: "A service mesh is an infrastructure layer that handles service-to-service communication, providing features like load balancing, mTLS, observability, and advanced routing." },
      { question: "How does the sidecar pattern work in a Service Mesh?", answer: "A proxy container (like Envoy) is deployed alongside every application container in a pod. It intercepts all inbound and outbound network traffic." },
      { question: "What is mTLS and how does a Service Mesh handle it?", answer: "Mutual TLS encrypts traffic and authenticates both client and server. The service mesh automatically manages certificates and enforces mTLS between proxies transparently." },
      { question: "What is a VirtualService in Istio?", answer: "A VirtualService defines a set of traffic routing rules to apply when a host is addressed, useful for canary releases and traffic splitting." },
      { question: "What is the difference between Istio and Linkerd?", answer: "Istio is feature-rich and uses Envoy, often considered more complex. Linkerd uses a custom Rust micro-proxy and focuses on simplicity and lower resource overhead." },
      { question: "What is a DestinationRule in Istio?", answer: "It defines policies that apply to traffic intended for a service after routing has occurred, such as load balancing algorithms and subsets for traffic splitting." }
    ],
    practicalTask: {
      scenario: "You need to route 10% of traffic to a new version of your app.",
      task: "Create a VirtualService in Istio with weighted routing.",
      solutionCode: "kubectl apply -f virtualservice.yaml"
    }
  },
  {
    slug: "kubernetes-chapter-22-advanced-storage",
    title: "Chapter 22: Kubernetes Storage deep dive: CSI, Snapshots, and Clones",
    order: 22,
    content: `<h2>Advanced Kubernetes Storage</h2>
<p>Stateful workloads in Kubernetes rely on PersistentVolumes (PV) and PersistentVolumeClaims (PVC). The Container Storage Interface (CSI) provides a standard interface for storage vendors to write plugins for Kubernetes.</p>
<h3>Storage Classes and Dynamic Provisioning</h3>
<p>A StorageClass allows administrators to describe the "classes" of storage they offer. When a PVC is created specifying a StorageClass, the CSI driver dynamically provisions the volume.</p>
<pre><code class="language-yaml">
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer
parameters:
  type: gp3
</code></pre>
<h3>Volume Snapshots and Cloning</h3>
<p>With CSI, you can take a VolumeSnapshot of an existing PVC, and then restore it into a new PVC. You can also clone a PVC directly.</p>
<pre><code class="language-yaml">
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: my-snapshot
spec:
  volumeSnapshotClassName: csi-aws-vsc
  source:
    persistentVolumeClaimName: my-pvc
</code></pre>
<p>The <code>WaitForFirstConsumer</code> binding mode is crucial for multi-zone clusters, ensuring the volume is provisioned in the same availability zone as the node where the pod is eventually scheduled.</p>`,
    interviewQuestions: [
      { question: "What is CSI in Kubernetes?", answer: "The Container Storage Interface (CSI) is a standard API that exposes arbitrary block and file storage systems to containerized workloads." },
      { question: "What is the purpose of volumeBindingMode: WaitForFirstConsumer?", answer: "It delays the dynamic provisioning of a PersistentVolume until a Pod using the PVC is successfully scheduled, ensuring the volume is created in the correct topology (e.g., availability zone)." },
      { question: "How do you back up a persistent volume in Kubernetes?", answer: "Using VolumeSnapshots provided by the CSI driver, or using tools like Velero which orchestrate snapshotting." },
      { question: "What is the difference between a PV and a PVC?", answer: "A PersistentVolume (PV) is the actual storage resource, while a PersistentVolumeClaim (PVC) is a request for storage by a user." },
      { question: "What are Access Modes in storage?", answer: "Access modes define how a volume can be mounted: ReadWriteOnce (RWO), ReadOnlyMany (ROX), ReadWriteMany (RWX), and ReadWriteOncePod (RWOP)." },
      { question: "Can a pod mount a PVC in a different namespace?", answer: "No, PVCs are strictly namespace-scoped, though the underlying PV is cluster-scoped." }
    ],
    practicalTask: {
      scenario: "You want to create a point-in-time backup of a database PVC.",
      task: "Create a VolumeSnapshot resource targeting the database PVC.",
      solutionCode: "kubectl apply -f snapshot.yaml"
    }
  },
  {
    slug: "kubernetes-chapter-23-statefulsets",
    title: "Chapter 23: StatefulSets and Managing Stateful Workloads in Production",
    order: 23,
    content: `<h2>StatefulSets</h2>
<p>While Deployments are perfect for stateless applications, stateful applications like databases (Cassandra, MongoDB, Zookeeper) require stable identities, ordered deployment, and dedicated persistent storage. This is where StatefulSets come in.</p>
<h3>Stable Network Identity</h3>
<p>Pods in a StatefulSet get a sticky, unique identity (e.g., <code>web-0</code>, <code>web-1</code>). A Headless Service is used to control the network domain.</p>
<pre><code class="language-yaml">
apiVersion: v1
kind: Service
metadata:
  name: nginx
spec:
  ports:
  - port: 80
    name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 1Gi
</code></pre>
<h3>VolumeClaimTemplates</h3>
<p>Instead of sharing a single PVC, each pod in a StatefulSet gets its own dedicated PVC dynamically provisioned using the <code>volumeClaimTemplates</code>. If a pod dies and is recreated on another node, it automatically reattaches its specific PVC.</p>`,
    interviewQuestions: [
      { question: "What are the main characteristics of a StatefulSet?", answer: "Stable network identities (pod names), ordered graceful deployment and scaling, and stable persistent storage via volumeClaimTemplates." },
      { question: "Why do StatefulSets require a Headless Service?", answer: "A headless service (ClusterIP: None) creates DNS records for each individual pod in the StatefulSet, allowing direct peer-to-peer communication between cluster members." },
      { question: "What happens to the PVCs when a StatefulSet is deleted?", answer: "The PVCs generated by the volumeClaimTemplates are not automatically deleted. They must be removed manually to prevent accidental data loss." },
      { question: "In what order are StatefulSet pods scaled up?", answer: "Strictly sequentially from 0 to N-1. Pod N will not start until Pod N-1 is running and ready." },
      { question: "How do you update a StatefulSet?", answer: "Using the OnDelete or RollingUpdate strategy. RollingUpdate updates pods in reverse ordinal order (N-1 down to 0)." },
      { question: "What happens if a worker node running a StatefulSet pod fails?", answer: "The pod is marked as Unknown. Because it's stateful, Kubernetes will not forcibly delete it to avoid split-brain scenarios until the node recovers or the pod is forcefully deleted." }
    ],
    practicalTask: {
      scenario: "You need a 3-node Redis cluster with persistent storage.",
      task: "Deploy a StatefulSet with a headless service.",
      solutionCode: "kubectl apply -f redis-statefulset.yaml"
    }
  },
  {
    slug: "kubernetes-chapter-24-helm-charts",
    title: "Chapter 24: Helm Chart Development and Advanced Templating",
    order: 24,
    content: `<h2>Helm: The Package Manager for Kubernetes</h2>
<p>Helm simplifies deploying complex applications by bundling YAML manifests into a "Chart". Charts use Go templating to allow extreme customization.</p>
<h3>Advanced Templating</h3>
<p>Helm provides control structures (if/else, loops) and pipeline functions to format data.</p>
<pre><code class="language-gotemplate">
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "myapp.fullname" . }}
  annotations:
    {{- toYaml .Values.ingress.annotations | nindent 4 }}
spec:
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            pathType: {{ .pathType }}
            backend:
              service:
                name: {{ include "myapp.fullname" $ }}
                port:
                  number: {{ .port }}
          {{- end }}
    {{- end }}
{{- end }}
</code></pre>
<h3>Helm Hooks and Lifecycle</h3>
<p>Hooks allow you to intervene at certain points in a release's lifecycle. For example, a <code>pre-install</code> hook can run a database migration job before the deployment starts.</p>`,
    interviewQuestions: [
      { question: "What is Helm?", answer: "Helm is a package manager for Kubernetes that packages multiple Kubernetes resources into a single logical deployment unit called a Chart." },
      { question: "What is the difference between Helm 2 and Helm 3?", answer: "Helm 3 removed the server-side component (Tiller), improved security, and stores release information in Kubernetes Secrets instead of ConfigMaps." },
      { question: "What is a Helm Hook?", answer: "A hook allows you to run jobs at specific points in a release cycle, such as pre-install, post-upgrade, or pre-delete." },
      { question: "How does Helm handle rollbacks?", answer: "Helm maintains a history of releases. Running `helm rollback` reverts the cluster state to the exact manifest configuration of a previous revision." },
      { question: "What is the purpose of the _helpers.tpl file?", answer: "It is used to define reusable Go template blocks (named templates) that can be included anywhere in the chart to prevent code duplication." },
      { question: "How do you override values in a Helm chart?", answer: "By providing a custom values.yaml file using `-f custom-values.yaml` or overriding specific keys using `--set key=value`." }
    ],
    practicalTask: {
      scenario: "You want to deploy an NGINX ingress controller.",
      task: "Use helm to add the repo and install the chart.",
      solutionCode: "helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && helm install my-ingress ingress-nginx/ingress-nginx"
    }
  },
  {
    slug: "kubernetes-chapter-25-gitops-argocd",
    title: "Chapter 25: GitOps and ArgoCD for Continuous Deployment",
    order: 25,
    content: `<h2>GitOps and Continuous Deployment</h2>
<p>GitOps is an operational framework that takes DevOps best practices used for application development such as version control, collaboration, compliance, and CI/CD tooling, and applies them to infrastructure automation.</p>
<h3>ArgoCD</h3>
<p>ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It runs as a controller inside the cluster, continuously monitoring a Git repository and comparing the desired state defined there with the live state in the cluster.</p>
<pre><code class="language-yaml">
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: guestbook
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/argoproj/argocd-example-apps.git
    targetRevision: HEAD
    path: guestbook
  destination:
    server: https://kubernetes.default.svc
    namespace: guestbook
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
</code></pre>
<h3>Benefits of GitOps</h3>
<p>By enforcing that the Git repository is the single source of truth, you gain immediate rollback capabilities, comprehensive audit logs via git history, and enhanced security since CI pipelines no longer need direct access to the Kubernetes cluster.</p>`,
    interviewQuestions: [
      { question: "What is GitOps?", answer: "GitOps is a paradigm where a Git repository is the single source of truth for declarative infrastructure and applications, with automated synchronization to the cluster." },
      { question: "What is ArgoCD?", answer: "ArgoCD is a GitOps continuous delivery tool that continuously monitors a Git repository and syncs the Kubernetes cluster to the desired state." },
      { question: "What is the 'pull' model in GitOps vs the 'push' model?", answer: "In the push model, a CI pipeline runs 'kubectl apply'. In the pull model (GitOps), an agent inside the cluster (like ArgoCD) pulls changes from Git, improving security." },
      { question: "What does 'selfHeal' do in ArgoCD?", answer: "If someone manually modifies a resource directly in the cluster, selfHeal automatically overwrites the manual changes to match the state defined in Git." },
      { question: "What is an AppProject in ArgoCD?", answer: "It provides logical grouping of applications to enforce RBAC, restrict which repositories can be used, and limit target clusters and namespaces." },
      { question: "Can ArgoCD deploy Helm charts?", answer: "Yes, ArgoCD natively supports Helm, Kustomize, and raw YAML manifests." }
    ],
    practicalTask: {
      scenario: "You want ArgoCD to automatically deploy an application.",
      task: "Create an Application resource pointing to your Git repository.",
      solutionCode: "kubectl apply -f argocd-app.yaml"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide.', topics);
