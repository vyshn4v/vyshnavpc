import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'daemonsets-statefulsets',
    title: '11. DaemonSets and StatefulSets: Advanced Workloads',
    order: 11,
    content: `
# DaemonSets and StatefulSets: Advanced Workload Types

Deployments are perfect for stateless, standard web applications. But what if you need an agent running on *every single node*? Or what if you are deploying a clustered database that requires strict ordering and persistent network identities? Kubernetes provides specialized controllers for these tasks.

## DaemonSets

A **DaemonSet** ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them. As nodes are removed from the cluster, those Pods are garbage collected. Deleting a DaemonSet will clean up the Pods it created.

### Use Cases for DaemonSets:
*   **Cluster Storage Daemons**: Running \`ceph\` or \`glusterd\` on every node to provide distributed storage.
*   **Logs Collection Daemons**: Running \`fluentd\` or \`logstash\` on every node to ship container logs to a central server.
*   **Node Monitoring Daemons**: Running Prometheus Node Exporter or Datadog agents on every node to collect hardware metrics.

### DaemonSet Example:
DaemonSet YAML is almost identical to a Deployment, but the \`kind\` is different, and there is no \`replicas\` field (since the number of replicas equals the number of nodes).

\`\`\`yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
spec:
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      containers:
      - name: fluentd-elasticsearch
        image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
\`\`\`

## StatefulSets

A **StatefulSet** is the workload API object used to manage stateful applications.
Like a Deployment, a StatefulSet manages Pods that are based on an identical container spec. However, a StatefulSet maintains a sticky identity for each of their Pods. These pods are created from the same spec, but are not interchangeable: each has a persistent identifier that it maintains across any rescheduling.

### When to use StatefulSets:
StatefulSets are used for applications that require one or more of the following:
*   **Stable, unique network identifiers**: Pods get names like \`kafka-0\`, \`kafka-1\`, \`kafka-2\`. If \`kafka-1\` dies, the new pod is also named \`kafka-1\` and gets the same DNS record.
*   **Stable, persistent storage**: StatefulSets use \`volumeClaimTemplates\`. Each replica gets its own dedicated PVC and PV. If \`kafka-1\` gets rescheduled, it automatically reattaches to the exact same disk it had before.
*   **Ordered, graceful deployment and scaling**: Pods are created sequentially (0, then 1, then 2).
*   **Ordered, automated rolling updates**: Pods are updated sequentially in reverse order.

StatefulSets are notoriously difficult to configure properly and are primarily used for deploying clustered databases like Elasticsearch, Kafka, Cassandra, or MongoDB replicasets. For many organizations, it is preferable to run databases as managed services (like AWS RDS) outside the cluster rather than using StatefulSets.
    `,
    interviewQuestions: [
      {
        question: "What is a DaemonSet and what are common use cases?",
        answer: "A DaemonSet guarantees that a specific Pod runs on all (or a filtered subset of) worker nodes in the cluster. It scales automatically as nodes are added or removed. Common use cases include log forwarding agents (fluentd), monitoring agents (Prometheus Node Exporter), and network plugins (CNI)."
      },
      {
        question: "How does a StatefulSet differ from a Deployment?",
        answer: "A Deployment creates ephemeral, interchangeable Pods with random hashes in their names. A StatefulSet creates Pods with sticky, sequential identities (e.g., db-0, db-1). It guarantees strict ordering for deployment/scaling, provides stable DNS names, and allows each replica to have its own persistent disk via volumeClaimTemplates."
      },
      {
        question: "In a StatefulSet with 3 replicas, what happens during creation and deletion?",
        answer: "During creation, Pods are started strictly in order: 0, then 1 (only after 0 is Running and Ready), then 2. During deletion or scaling down, they are terminated in reverse order: 2, then 1, then 0."
      },
      {
        question: "What is a Headless Service and why is it used with StatefulSets?",
        answer: "A Headless Service is a Service with 'clusterIP: None'. It doesn't load balance. Instead, it returns the individual IP addresses of the associated Pods via DNS. StatefulSets use Headless Services to give each Pod a stable, resolvable DNS name (e.g., db-0.db-service.default.svc.cluster.local) necessary for database clustering."
      },
      {
        question: "Can you run a database using a Deployment?",
        answer: "Yes, if it's a single-instance (non-clustered) database and you mount a PersistentVolume, a Deployment with 1 replica works. However, if you need a distributed database cluster where nodes need to know about each other's stable network identities, you must use a StatefulSet."
      }
    ],
    practicalTask: {
      scenario: "Identify the YAML structure that provides dedicated persistent storage for each Pod in a StatefulSet.",
      task: "What specific field is used in a StatefulSet to provision PVCs for each replica, unlike a Deployment?",
      solutionCode: "# The field is volumeClaimTemplates:\nspec:\n  volumeClaimTemplates:\n  - metadata:\n      name: www\n    spec:\n      accessModes: [ \"ReadWriteOnce\" ]\n      resources:\n        requests:\n          storage: 1Gi"
    }
  },
  {
    slug: 'jobs-cronjobs-batch-processing',
    title: '12. Jobs and CronJobs: Batch Processing',
    order: 12,
    content: `
# Jobs and CronJobs: Batch Processing in Kubernetes

Not all workloads are long-running web servers. Sometimes you need a container to wake up, perform a specific computational task (like generating a report, running a database migration, or processing a queue), and then gracefully shut down. 

Using a Deployment for this would be a mistake, as the Deployment controller would immediately restart the container once it successfully finished. For finite tasks, Kubernetes provides **Jobs**.

## Jobs

A Job creates one or more Pods and ensures that a specified number of them successfully terminate. As pods successfully complete, the Job tracks the successful completions. When a specified number of successful completions is reached, the task (ie, Job) is complete. Deleting a Job will clean up the Pods it created.

### Job Characteristics:
*   **Restart Policy**: Pods managed by a Job must have a \`restartPolicy\` of \`OnFailure\` or \`Never\` (the default for Deployments is \`Always\`).
*   **Completions**: You can specify how many times the job must succeed before the Job is considered complete.
*   **Parallelism**: You can specify how many pods the Job should run simultaneously.

### Job Example: Compute Pi
Here is a Job that calculates Pi to 2000 places using Perl, and then terminates.

\`\`\`yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  completions: 1    # Task must succeed 1 time
  parallelism: 1    # Run 1 pod at a time
  backoffLimit: 4   # Retry 4 times before failing the Job
  template:
    spec:
      containers:
      - name: pi
        image: perl:5.34.0
        command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
\`\`\`

## CronJobs

A **CronJob** creates Jobs on a repeating schedule.
It operates much like the traditional Linux \`cron\` utility. CronJobs are meant for performing regular scheduled actions such as backups, report generation, and so on.

### Schedule Syntax
CronJobs use standard cron syntax:
\`* * * * *\` (Minute, Hour, Day of Month, Month, Day of Week).

### CronJob Example:

\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello-cron
spec:
  schedule: "*/1 * * * *" # Run every minute
  concurrencyPolicy: Forbid # Don't start a new job if the old one is still running
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: busybox:1.28
            imagePullPolicy: IfNotPresent
            command:
            - /bin/sh
            - -c
            - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
\`\`\`

### Managing CronJob History
Jobs created by CronJobs stick around after they complete so you can view their logs. However, this can clutter the cluster. You can configure \`successfulJobsHistoryLimit\` (default 3) and \`failedJobsHistoryLimit\` (default 1) to instruct Kubernetes to automatically clean up old jobs.
    `,
    interviewQuestions: [
      {
        question: "Why use a Job instead of a Deployment for a database migration script?",
        answer: "A Deployment is designed for continuous, long-running processes. If a migration script finishes successfully and exits with code 0, a Deployment will think it crashed and continually restart it. A Job expects the container to exit successfully and will track its completion without restarting it."
      },
      {
        question: "What are 'completions' and 'parallelism' in a Job specification?",
        answer: "'completions' dictates how many times the Pod needs to successfully terminate for the entire Job to be marked as complete. 'parallelism' dictates how many of those Pods are allowed to run concurrently at the exact same time."
      },
      {
        question: "What is a CronJob and what is its relationship to a Job?",
        answer: "A CronJob is a controller that creates Job objects on a specified time-based schedule (using standard cron format). The CronJob acts as the scheduler, and the Job it creates manages the actual execution of the Pods."
      },
      {
        question: "What does 'concurrencyPolicy: Forbid' do in a CronJob?",
        answer: "If a scheduled CronJob takes longer to finish than the frequency of its schedule (e.g., scheduled every 5 mins, but takes 10 mins to run), 'Forbid' ensures that the next scheduled run is skipped until the current running Job completes. This prevents overlapping jobs and potential database locks."
      },
      {
        question: "What must the 'restartPolicy' be set to in a Job's Pod template?",
        answer: "It must be set to either 'Never' or 'OnFailure'. It cannot be set to 'Always' (which is the default for standard Pods and Deployments)."
      }
    ],
    practicalTask: {
      scenario: "You need to run a one-time task using an alpine image to echo 'Task Complete'.",
      task: "Write the imperative kubectl command to create this Job.",
      solutionCode: "kubectl create job one-time-task --image=alpine -- echo \"Task Complete\""
    }
  },
  {
    slug: 'rbac-securing-cluster',
    title: '13. Role-Based Access Control (RBAC)',
    order: 13,
    content: `
# Role-Based Access Control (RBAC): Securing Your Cluster

Security is paramount in Kubernetes. By default, processes running inside a Pod, or users connecting to the cluster, should not have unrestricted access to the Kubernetes API. **RBAC** is the standard method for regulating access to computer or network resources based on the roles of individual users within an enterprise.

In Kubernetes, RBAC allows you to configure exactly who (or what) can perform which operations on which resources.

## The Core RBAC Components

RBAC uses four primary API objects, categorized into two groups: Defining permissions (Roles), and assigning those permissions (Bindings).

### 1. Defining Permissions: Role and ClusterRole
A Role contains rules that represent a set of permissions. Permissions are purely additive (there are no "deny" rules).
*   **Role**: Always sets permissions within a particular **namespace**.
*   **ClusterRole**: A non-namespaced resource. It can grant the same permissions as a Role, but across the entire cluster, or it can grant access to cluster-scoped resources (like Nodes).

**Example Role**: Allows reading Pods in the "default" namespace.
\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods", "pods/log"]
  verbs: ["get", "watch", "list"]
\`\`\`

### 2. Assigning Permissions: RoleBinding and ClusterRoleBinding
A binding grants the permissions defined in a role to a subject (User, Group, or ServiceAccount).
*   **RoleBinding**: Grants permissions within a specific **namespace**. It can bind a Role or a ClusterRole (restricting the ClusterRole's scope to that namespace).
*   **ClusterRoleBinding**: Grants permissions across the **entire cluster**. It can only bind to a ClusterRole.

**Example RoleBinding**: Binds the "pod-reader" Role to the user "jane".
\`\`\`yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
\`\`\`

## ServiceAccounts

While "Users" represent human operators, **ServiceAccounts** represent applications running inside Pods. If your application needs to talk to the Kubernetes API (for example, a CI/CD runner pod that needs to deploy other pods), you assign it a ServiceAccount, and use RBAC to give that ServiceAccount the necessary permissions.

Every namespace has a \`default\` ServiceAccount, which is automatically mounted into every Pod unless specified otherwise. In production, you should create dedicated ServiceAccounts with principle-of-least-privilege permissions.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between a Role and a ClusterRole?",
        answer: "A Role defines permissions within a specific namespace (e.g., allowing access to Pods in the 'dev' namespace). A ClusterRole defines cluster-wide permissions, allowing access to resources across all namespaces, or access to cluster-scoped resources like Nodes and PersistentVolumes."
      },
      {
        question: "Can you create a 'Deny' rule in Kubernetes RBAC?",
        answer: "No. Kubernetes RBAC is additive only. By default, all access is denied. You can only create rules that grant permissions. There are no explicit deny rules."
      },
      {
        question: "What is a RoleBinding?",
        answer: "A RoleBinding is the object that connects a subject (a User, Group, or ServiceAccount) to a Role, effectively granting them the permissions defined in that Role within a specific namespace."
      },
      {
        question: "What is a ServiceAccount?",
        answer: "While standard 'Users' represent human administrators, a ServiceAccount provides an identity for processes running inside a Pod. When a Pod needs to authenticate with the Kubernetes API Server, it uses the token associated with its ServiceAccount."
      },
      {
        question: "If you bind a ClusterRole to a user using a standard RoleBinding in the 'dev' namespace, what happens?",
        answer: "The user is granted the permissions defined in the ClusterRole, but ONLY for resources within the 'dev' namespace. This is a common pattern to reuse common roles (like 'admin' or 'edit') across multiple namespaces without duplicating Role definitions."
      }
    ],
    practicalTask: {
      scenario: "You want to check if you (your current kubeconfig user) have permission to create deployments in the 'prod' namespace.",
      task: "What kubectl command allows you to verify your authorization for an action?",
      solutionCode: "kubectl auth can-i create deployments -n prod"
    }
  },
  {
    slug: 'horizontal-pod-autoscaling-metrics',
    title: '14. Horizontal Pod Autoscaling (HPA)',
    order: 14,
    content: `
# Horizontal Pod Autoscaling (HPA) and Metrics Server

Cloud computing promises elasticity—the ability to scale resources up when demand is high and down to save money when demand is low. Kubernetes achieves this automatically through the **HorizontalPodAutoscaler (HPA)**.

## How HPA Works

The HPA automatically updates a workload resource (such as a Deployment or StatefulSet), with the aim of automatically scaling the workload to match demand. 

1.  **Metrics Collection**: The HPA continuously checks metrics (like CPU or memory usage). To do this, your cluster MUST have a metrics aggregation layer installed, typically the **Metrics Server**.
2.  **Calculation**: HPA calculates the desired number of replicas by comparing current metric values against target thresholds defined in the HPA configuration.
3.  **Scaling**: HPA adjusts the \`replicas\` field on the target Deployment.

*Note: HPA scales the number of Pods (Horizontal scaling). It does not increase the CPU/Memory allocated to existing Pods (Vertical scaling - handled by VPA) or add new worker nodes to the cluster (handled by Cluster Autoscaler).*

## Prerequisites
For HPA to work based on CPU/Memory, **every container in the target Pods must have resource requests defined**. If requests are not defined, HPA cannot calculate the percentage of utilization, and autoscaling will fail.

## HPA Definition Example

Here is an HPA that scales a deployment named \`php-apache\` between 1 and 10 replicas, aiming to keep average CPU utilization across all pods at 50%.

\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
\`\`\`

### The Algorithm
The basic formula HPA uses is:
\`desiredReplicas = ceil[currentReplicas * ( currentMetricValue / desiredMetricValue )]\`

If current CPU is 100m, and desired is 50m, and there is 1 replica:
\`1 * (100 / 50) = 2\`. The HPA will scale up to 2 replicas.

## Custom Metrics
Modern Kubernetes allows scaling based on custom metrics outside of CPU/Memory. For example, using Prometheus and an adapter, you can configure HPA to scale based on the number of messages in an SQS queue, or the number of active HTTP requests per second.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between Horizontal Pod Autoscaler (HPA), Vertical Pod Autoscaler (VPA), and Cluster Autoscaler?",
        answer: "HPA increases the *number* of Pod replicas. VPA increases the *size* (CPU/Memory requests and limits) of existing Pods. Cluster Autoscaler communicates with the cloud provider to add more physical *worker nodes* to the cluster when pods are pending due to lack of resources."
      },
      {
        question: "What component must be installed in a Kubernetes cluster for basic CPU/Memory HPA to function?",
        answer: "The Metrics Server. The API server does not collect pod metrics by default. The Metrics Server gathers these stats from the kubelet on each node and exposes them to the HPA controller via the Metrics API."
      },
      {
        question: "Why might an HPA show '<unknown>/50%' for its metrics and fail to scale?",
        answer: "This almost always happens because the Pods in the target Deployment do not have CPU/Memory 'requests' defined in their container specs. Without a baseline request, HPA cannot calculate a utilization percentage."
      },
      {
        question: "Can HPA scale based on metrics other than CPU and Memory?",
        answer: "Yes, using the Custom Metrics API. You can integrate tools like Prometheus or KEDA to scale based on business metrics, such as queue length, active HTTP connections, or database latency."
      },
      {
        question: "What is 'scaleTargetRef' in an HPA manifest?",
        answer: "It is the reference to the specific workload object (like a Deployment or StatefulSet) that the HPA is tasked with monitoring and scaling."
      }
    ],
    practicalTask: {
      scenario: "You need to quickly configure autoscaling for a deployment named 'web' to maintain 80% CPU utilization, with a minimum of 2 and maximum of 5 replicas.",
      task: "Write the imperative kubectl command to create this HPA.",
      solutionCode: "kubectl autoscale deployment web --cpu-percent=80 --min=2 --max=5"
    }
  },
  {
    slug: 'helm-package-manager',
    title: '15. Helm: The Kubernetes Package Manager',
    order: 15,
    content: `
# Helm: The Kubernetes Package Manager

Managing Kubernetes YAML files by hand becomes unmanageable quickly. A single application might require a Deployment, a Service, an Ingress, a ConfigMap, a Secret, and an HPA. If you want to deploy this app to Dev, Staging, and Prod, you end up duplicating hundreds of lines of YAML.

**Helm** is the package manager for Kubernetes. It is to Kubernetes what \`apt\`, \`yum\`, or \`npm\` are to operating systems and programming languages.

## Key Helm Concepts

### 1. Charts
A Helm package is called a **Chart**. A Chart is a collection of files that describe a related set of Kubernetes resources. A single chart might be used to deploy something simple, like a memcached pod, or something complex, like a full web app stack with HTTP servers, databases, and caches.

### 2. Templates
Helm uses the Go templating language. Instead of hardcoding values (like the docker image tag or the replica count) in your YAML, you use template variables.

Example \`deployment.yaml\` inside a Helm chart:
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-app
spec:
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
\`\`\`

### 3. Values
The \`values.yaml\` file provides the default data that is injected into the templates. When you install a chart, you can override these defaults by passing your own values file (e.g., \`values-prod.yaml\`).

### 4. Releases
A Release is a running instance of a chart in a Kubernetes cluster. One chart can often be installed many times into the same cluster. And each time it is installed, a new release is created.

## Common Helm Commands

*   **helm create mychart**: Scaffolds a new chart structure.
*   **helm repo add bitnami https://charts.bitnami.com/bitnami**: Adds a remote repository of pre-built charts.
*   **helm install my-db bitnami/mysql**: Installs the MySQL chart onto your cluster, creating a release named \`my-db\`.
*   **helm upgrade my-db bitnami/mysql -f custom-values.yaml**: Upgrades an existing release with new values.
*   **helm uninstall my-db**: Deletes all the Kubernetes resources associated with the release.
*   **helm template mychart**: Renders the templates locally and outputs the raw YAML (great for debugging).

Helm dramatically simplifies CI/CD pipelines. Instead of running \`kubectl apply\` on a dozen files, a pipeline just runs \`helm upgrade --install my-app ./chart --set image.tag=$COMMIT_SHA\`.
    `,
    interviewQuestions: [
      {
        question: "What is Helm and what problem does it solve?",
        answer: "Helm is the package manager for Kubernetes. It solves the problem of managing, templating, and versioning complex collections of Kubernetes YAML files. It allows developers to package applications into 'Charts' and deploy them consistently across different environments using dynamic variables."
      },
      {
        question: "What is the relationship between a Helm Chart, Values, and a Release?",
        answer: "A Chart is the package containing the YAML templates. Values are the configuration variables injected into those templates. When you install a Chart with a specific set of Values into a cluster, it creates a running instance called a Release."
      },
      {
        question: "How does Helm keep track of installed releases?",
        answer: "In Helm v3, release information is stored natively inside the Kubernetes cluster as Secrets (or ConfigMaps) in the namespace where the release was installed. This eliminates the need for the older, less secure 'Tiller' server component used in Helm v2."
      },
      {
        question: "How can you view the actual Kubernetes YAML that Helm will generate before applying it?",
        answer: "You can use the command 'helm template <chart>' to render the templates locally and output the resulting YAML to the terminal. Alternatively, 'helm install --dry-run' will simulate the installation against the live cluster without making actual changes."
      },
      {
        question: "What does 'helm upgrade --install' do?",
        answer: "It is an atomic command commonly used in CI/CD pipelines. It checks if the release already exists. If it does not, it runs an installation. If it does exist, it upgrades the existing release with the new chart or values provided."
      }
    ],
    practicalTask: {
      scenario: "You have downloaded a helm chart into a local directory called './my-chart'. You want to deploy it to the 'prod' namespace with the release name 'webapp', and override the 'replicaCount' value to 5.",
      task: "Write the helm command to achieve this.",
      solutionCode: "helm install webapp ./my-chart --namespace prod --set replicaCount=5"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide to Kubernetes orchestration, from beginner to intermediate level.', topics);
