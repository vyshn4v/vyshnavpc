import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'configmaps-secrets-managing-config',
    title: '6. ConfigMaps and Secrets: Managing Application Configuration',
    order: 6,
    content: `
# ConfigMaps and Secrets: Managing Application Configuration

A core principle of cloud-native applications (like the Twelve-Factor App methodology) is the strict separation of code from configuration. You should not hardcode environmental variables, database URLs, or passwords inside your Docker images. Kubernetes provides **ConfigMaps** and **Secrets** to inject configuration into your Pods at runtime.

## ConfigMaps

A ConfigMap is an API object used to store non-confidential data in key-value pairs. Pods can consume ConfigMaps as environment variables, command-line arguments, or as configuration files in a volume.

### Creating a ConfigMap

You can create a ConfigMap from literal values, from files, or from a YAML manifest:

\`\`\`yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  # property-like keys; each key maps to a simple value
  APP_COLOR: "blue"
  APP_MODE: "production"
  # file-like keys
  app.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
\`\`\`

### Consuming a ConfigMap in a Pod

You can inject this into a Pod's environment:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: alpine
      command: [ "sleep", "3600" ]
      env:
        # Define the environment variable
        - name: THE_APP_COLOR
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_COLOR
\`\`\`
Alternatively, you can use \`envFrom\` to inject all keys in a ConfigMap as environment variables.

## Secrets

A Secret is an object that contains a small amount of sensitive data such as a password, a token, or a key. Using a Secret means that you don't need to include confidential data in your application code.

### Base64 Encoding
By default, Kubernetes Secrets are stored unencrypted in etcd (though encryption at rest can be configured). In the YAML manifest, values must be Base64 encoded. **Note: Base64 is not encryption; it's just encoding.**

\`\`\`yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
type: Opaque
data:
  username: YWRtaW4= # Base64 for "admin"
  password: c2VjcmV0cGFzc3dvcmQ= # Base64 for "secretpassword"
\`\`\`

### Consuming Secrets
Secrets are consumed similarly to ConfigMaps: via environment variables or mounted as files in a volume. Mounting as a volume is generally considered safer because environment variables can be leaked in crash logs or via processes like \`env\` or \`ps\`.

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-volume-pod
spec:
  containers:
  - name: myapp
    image: myapp:1.0
    volumeMounts:
    - name: secret-volume
      mountPath: "/etc/secrets"
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: db-credentials
\`\`\`
In this example, the container will find files \`/etc/secrets/username\` and \`/etc/secrets/password\`.
    `,
    interviewQuestions: [
      {
        question: "Why should we use ConfigMaps instead of hardcoding configurations in the Docker image?",
        answer: "Hardcoding configurations tightly couples the configuration to the image, requiring a rebuild for every environment change. ConfigMaps separate configuration from the application, making images portable across different environments (dev, staging, prod)."
      },
      {
        question: "Are Kubernetes Secrets encrypted by default?",
        answer: "No. By default, Secrets are only Base64 encoded in the YAML and stored in plaintext in the etcd database. To secure them, administrators must enable 'Encryption at Rest' for etcd, and access should be restricted using RBAC."
      },
      {
        question: "What are the ways a Pod can consume a ConfigMap or Secret?",
        answer: "They can be consumed in three ways: 1) As environment variables. 2) As command-line arguments. 3) Mounted as data volumes (files) inside the container's filesystem."
      },
      {
        question: "Why is it often recommended to mount Secrets as Volumes rather than Environment Variables?",
        answer: "Environment variables can accidentally be leaked via application crash logs, APM tools, or by anyone who can exec into the container and run the 'env' command. Mounted volumes are generally safer and can also be dynamically updated without restarting the container if the application knows how to watch file changes."
      },
      {
        question: "What is an Opaque Secret?",
        answer: "Opaque is the default Secret type in Kubernetes. It indicates that the Secret contains arbitrary user-defined data. Other types include kubernetes.io/tls for TLS certificates and kubernetes.io/dockerconfigjson for container registry credentials."
      }
    ],
    practicalTask: {
      scenario: "You need to create a ConfigMap for a database host and use it as an environment variable in a Pod.",
      task: "Write the command to create the ConfigMap 'db-config' with literal 'DB_HOST=10.0.0.5', and the YAML for a Pod that uses it.",
      solutionCode: "kubectl create configmap db-config --from-literal=DB_HOST=10.0.0.5\n\n# Pod YAML:\napiVersion: v1\nkind: Pod\nmetadata:\n  name: db-consumer\nspec:\n  containers:\n  - name: app\n    image: alpine\n    env:\n    - name: DB_HOST\n      valueFrom:\n        configMapKeyRef:\n          name: db-config\n          key: DB_HOST"
    }
  },
  {
    slug: 'volumes-persistent-data-stateful',
    title: '7. Volumes and Persistent Data: Stateful Applications',
    order: 7,
    content: `
# Volumes and Persistent Data: Stateful Applications in Kubernetes

Containers are immutable and ephemeral by design. When a container crashes, kubelet will restart it, but any files created or modified during its lifetime are lost. This is acceptable for stateless microservices but disastrous for databases. Kubernetes **Volumes** solve this problem.

## The Problem with Pod Storage

By default, the disk on a container is ephemeral. If a pod is deleted or a container restarts, the data dies with it. A Kubernetes Volume has an explicit lifetime—the same as the Pod that encloses it. Consequently, a volume outlives any containers that run within the Pod, and data is preserved across container restarts. However, if the Pod is deleted, the standard Volume is deleted too.

To achieve data persistence that outlives the Pod itself, we need **PersistentVolumes**.

## Storage Architecture

The Kubernetes storage architecture separates storage provisioning from storage consumption.

### 1. PersistentVolume (PV)
A PersistentVolume (PV) is a piece of storage in the cluster that has been provisioned by an administrator, or dynamically provisioned using Storage Classes. It is a resource in the cluster just like a node is a cluster resource. PVs have a lifecycle independent of any individual Pod that uses the PV. This API object captures the details of the implementation of the storage (e.g., NFS, iSCSI, or cloud-provider-specific storage systems like AWS EBS).

### 2. PersistentVolumeClaim (PVC)
A PersistentVolumeClaim (PVC) is a request for storage by a user. It is similar to a Pod. Pods consume node resources and PVCs consume PV resources. Pods can request specific levels of resources (CPU and Memory). Claims can request specific size and access modes (e.g., they can be mounted ReadWriteOnce, ReadOnlyMany, or ReadWriteMany).

### 3. StorageClass
A StorageClass provides a way for administrators to describe the "classes" of storage they offer. It enables **Dynamic Provisioning**. Instead of an admin manually creating PVs (Static Provisioning), a user creates a PVC referencing a StorageClass, and the cluster automatically talks to the cloud provider to provision a new disk and bind it to a PV on the fly.

## Example: Stateful Pod with PVC

First, the developer creates a PVC requesting 5GB of storage:

\`\`\`yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-ebs-claim
spec:
  accessModes:
    - ReadWriteOnce # Can be mounted read/write by a single node
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard # References a dynamically provisioning class
\`\`\`

Then, the developer mounts this PVC into a Pod:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: database-pod
spec:
  containers:
    - name: mysql
      image: mysql:8.0
      volumeMounts:
      - mountPath: "/var/lib/mysql"
        name: my-storage
  volumes:
    - name: my-storage
      persistentVolumeClaim:
        claimName: my-ebs-claim
\`\`\`

If \`database-pod\` crashes and gets rescheduled on a different node, Kubernetes will detach the underlying EBS volume from the old node and attach it to the new node, preserving the database state.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between an emptyDir volume and a PersistentVolume?",
        answer: "An emptyDir volume is created when a Pod is assigned to a Node, and its data is permanently deleted when the Pod is removed from that Node. A PersistentVolume (PV) exists beyond the lifecycle of any Pod; its data persists even if the Pod is deleted or moved."
      },
      {
        question: "Explain the relationship between PV, PVC, and Pods.",
        answer: "A PV (Persistent Volume) represents actual storage hardware. A PVC (Persistent Volume Claim) is a request by a user/Pod for a specific amount of storage with specific access modes. A Pod references the PVC in its volume configuration. The cluster binds the PVC to an appropriate PV to grant the Pod access to the storage."
      },
      {
        question: "What does Dynamic Provisioning mean in Kubernetes storage?",
        answer: "Dynamic provisioning allows storage volumes to be created on-demand. Instead of cluster admins manually creating PVs beforehand, users create PVCs referencing a 'StorageClass'. The StorageClass instructs a provisioner (like AWS EBS or GCP Persistent Disk) to automatically create the backing storage and the corresponding PV."
      },
      {
        question: "What are the different Access Modes for Persistent Volumes?",
        answer: "1. ReadWriteOnce (RWO): Can be mounted as read-write by a single node. 2. ReadOnlyMany (ROX): Can be mounted read-only by many nodes. 3. ReadWriteMany (RWX): Can be mounted as read-write by many nodes (e.g., NFS). 4. ReadWriteOncePod (RWOP): Can be mounted by a single Pod."
      },
      {
        question: "What is the Reclaim Policy of a Persistent Volume?",
        answer: "The reclaim policy tells the cluster what to do with the PV after its associated PVC is deleted. 'Retain' keeps the data and requires manual cleanup. 'Delete' automatically deletes the PV and the underlying storage infrastructure (like an AWS EBS volume). 'Recycle' (deprecated) scrubs the data and makes the PV available again."
      }
    ],
    practicalTask: {
      scenario: "You need to create a Persistent Volume Claim named 'data-claim' requesting 2Gi of storage with ReadWriteOnce access.",
      task: "Write the YAML file for this PVC.",
      solutionCode: "apiVersion: v1\nkind: PersistentVolumeClaim\nmetadata:\n  name: data-claim\nspec:\n  accessModes:\n    - ReadWriteOnce\n  resources:\n    requests:\n      storage: 2Gi"
    }
  },
  {
    slug: 'ingress-controllers-routing',
    title: '8. Ingress Controllers: Advanced Routing',
    order: 8,
    content: `
# Ingress Controllers: Advanced Routing and Load Balancing

While \`LoadBalancer\` Services are great, they have a flaw: every LoadBalancer Service provisions a *new*, dedicated cloud load balancer (with its own IP address). If you have 20 microservices, you get 20 load balancers, and you pay for 20 load balancers. This is expensive and difficult to manage.

**Ingress** solves this by providing a single point of entry into the cluster, routing traffic to multiple internal Services based on HTTP paths or hostnames.

## What is an Ingress?

Ingress is an API object that manages external access to the services in a cluster, typically HTTP/HTTPS. Ingress may provide load balancing, SSL termination, and name-based virtual hosting.

An Ingress does not run by itself. To make an Ingress work, the cluster must have an **Ingress Controller** running.

## Ingress Controllers

An Ingress Controller is a specialized Pod (usually running a reverse proxy like NGINX, HAProxy, or Traefik) that listens to the Kubernetes API for new Ingress objects and configures its underlying proxy to route traffic accordingly. The Ingress Controller itself is exposed to the outside world via a single \`LoadBalancer\` or \`NodePort\`.

## Ingress Resource Example

Assume you have an Ingress Controller running. You want requests to \`myapp.com/api\` to go to the backend API, and \`myapp.com/\` to go to the frontend.

\`\`\`yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx # Specifies which controller to use
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
\`\`\`

### SSL/TLS Termination
Ingress is heavily used to manage HTTPS. You can store your SSL certificates in a Kubernetes Secret and reference them in the Ingress. The Ingress controller will decrypt the HTTPS traffic and send plain HTTP to your internal Pods.

\`\`\`yaml
spec:
  tls:
  - hosts:
      - myapp.com
    secretName: myapp-tls-cert
\`\`\`
Tools like **cert-manager** automate the process of fetching and renewing free SSL certificates from Let's Encrypt and placing them into these Secrets.
    `,
    interviewQuestions: [
      {
        question: "Why would you use an Ingress instead of a LoadBalancer Service?",
        answer: "A LoadBalancer service creates a 1-to-1 mapping to a cloud load balancer, which becomes expensive and hard to manage with many microservices. An Ingress acts as an L7 HTTP/HTTPS router, allowing a single cloud load balancer (attached to the Ingress Controller) to route traffic to dozens of internal services based on URL paths or hostnames."
      },
      {
        question: "What is an Ingress Controller?",
        answer: "An Ingress resource is just a set of routing rules. It does nothing on its own. An Ingress Controller is an application (like NGINX, Traefik, or an ALB) running in the cluster that reads these rules and actually executes the routing, reverse-proxying, and load balancing."
      },
      {
        question: "How does Ingress handle SSL termination?",
        answer: "You can create a Kubernetes Secret of type 'tls' containing your certificate and private key. You then reference this Secret in the 'tls' block of the Ingress definition. The Ingress Controller will intercept HTTPS traffic, decrypt it using the certificate, and forward plain HTTP to the backend services."
      },
      {
        question: "What is 'pathType: Prefix' vs 'pathType: Exact' in an Ingress?",
        answer: "'Exact' matches the URL path strictly (e.g., /foo only matches /foo). 'Prefix' matches based on a URL path prefix separated by / (e.g., /foo matches /foo, /foo/, and /foo/bar)."
      },
      {
        question: "What are Ingress annotations used for?",
        answer: "Annotations provide configuration options that are specific to the Ingress Controller implementation. For example, 'nginx.ingress.kubernetes.io/rewrite-target' tells the NGINX controller to rewrite the URL path before sending it to the backend pod."
      }
    ],
    practicalTask: {
      scenario: "You need to route traffic for 'api.example.com' to a service named 'api-svc' on port 8000 using Ingress.",
      task: "Write the basic Ingress YAML snippet to achieve this host-based routing.",
      solutionCode: "apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  name: api-ingress\nspec:\n  rules:\n  - host: api.example.com\n    http:\n      paths:\n      - path: /\n        pathType: Prefix\n        backend:\n          service:\n            name: api-svc\n            port:\n              number: 8000"
    }
  },
  {
    slug: 'namespaces-resource-quotas',
    title: '9. Namespaces and Resource Quotas',
    order: 9,
    content: `
# Namespaces and Resource Quotas: Cluster Isolation

As your Kubernetes adoption grows, multiple teams and environments might share the same physical cluster. Kubernetes uses **Namespaces** to provide a mechanism for isolating groups of resources within a single cluster.

## Namespaces

Namespaces are intended for use in environments with many users spread across multiple teams or projects. They provide a scope for names. Names of resources need to be unique within a namespace, but not across namespaces.

For example, you can have a \`frontend\` Pod in the \`dev\` namespace, and another completely different \`frontend\` Pod in the \`prod\` namespace.

### Default Namespaces
Kubernetes starts with a few initial namespaces:
*   **default**: The default namespace for objects with no other namespace.
*   **kube-system**: The namespace for objects created by the Kubernetes system (control plane components, DNS).
*   **kube-public**: This namespace is created automatically and is readable by all users (including those not authenticated).

### Cross-Namespace Communication
Services in different namespaces can communicate. The DNS name of a service includes the namespace: \`<service-name>.<namespace>.svc.cluster.local\`. So, a Pod in \`dev\` can talk to a DB in \`shared\` via \`db-svc.shared.svc.cluster.local\`.

## Resource Quotas

When multiple teams share a cluster, there is a risk that one team might consume more than its fair share of resources, starving other teams. **ResourceQuotas** solve this by enforcing hard limits on resource consumption per namespace.

A ResourceQuota can limit:
*   **Compute resources**: Maximum sum of CPU and memory requests/limits across all pods in a namespace.
*   **Storage resources**: Maximum sum of storage requests for PVCs.
*   **Object counts**: Maximum number of Pods, Services, Deployments, ConfigMaps, etc.

\`\`\`yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev-team
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "10"
\`\`\`
If the \`dev-team\` tries to create an 11th Pod, or a Pod that pushes the total CPU requests above 4 cores, the API server will reject the request with a \`403 FORBIDDEN\` error.

## LimitRanges
While ResourceQuotas restrict the *total* usage in a namespace, **LimitRanges** can constrain the *individual* sizes of resources. For example, a LimitRange can enforce that no single container in a namespace can request more than 1 CPU core, or provide default requests/limits if a developer forgets to specify them in their Pod YAML.
    `,
    interviewQuestions: [
      {
        question: "What is a Namespace in Kubernetes?",
        answer: "A Namespace is a logical partition within a physical Kubernetes cluster. It provides a scope for naming resources, allowing multiple teams or environments (dev, staging) to share a cluster without naming collisions and allowing administrators to apply access controls and resource limits at the namespace level."
      },
      {
        question: "Can a Pod in 'namespace-a' communicate with a Service in 'namespace-b'? How?",
        answer: "Yes, by default, all pods can communicate with all other pods across namespaces. To reach a Service in another namespace, you must use the Fully Qualified Domain Name (FQDN) like '<service-name>.<namespace>.svc.cluster.local'."
      },
      {
        question: "What resources are NOT scoped to a namespace?",
        answer: "Cluster-level resources are not scoped to namespaces. Examples include Nodes, PersistentVolumes (PVs), ClusterRoles, ClusterRoleBindings, and StorageClasses."
      },
      {
        question: "What is the purpose of a ResourceQuota?",
        answer: "A ResourceQuota provides constraints that limit aggregate resource consumption per namespace. It can limit the total CPU, memory, storage, or the total number of objects (like Pods or Secrets) that can be created in that namespace."
      },
      {
        question: "What happens if a developer creates a Pod without specifying CPU/Memory requests in a namespace that has a ResourceQuota?",
        answer: "The API server will reject the Pod creation. When a ResourceQuota for compute resources is applied to a namespace, all pods created in that namespace MUST specify resource limits/requests, or a LimitRange must be configured to supply defaults."
      }
    ],
    practicalTask: {
      scenario: "You need to create a namespace and verify it was created.",
      task: "Write the imperative commands to create a namespace named 'qa' and then list all namespaces.",
      solutionCode: "kubectl create namespace qa\nkubectl get namespaces"
    }
  },
  {
    slug: 'probes-liveness-readiness-startup',
    title: '10. Probes: Liveness, Readiness, and Startup',
    order: 10,
    content: `
# Probes: Liveness, Readiness, and Startup Probes

Kubernetes promises "Self-Healing." But how does Kubernetes know if your application is actually healthy? Just because the Node.js process is running (PID exists) doesn't mean it isn't stuck in a deadlock or unable to connect to its database. 

Kubernetes uses **Probes** to execute health checks against your containers. The kubelet uses these probes to determine the health of the container and take appropriate action.

## Types of Probes

### 1. Liveness Probe
**Purpose:** Indicates whether the container is running.
If the liveness probe fails, the kubelet kills the container, and the container is subjected to its restart policy. Use this for apps that might enter a broken state (like a deadlock) and cannot recover without a restart.

### 2. Readiness Probe
**Purpose:** Indicates whether the container is ready to respond to requests.
If the readiness probe fails, the endpoints controller removes the Pod's IP address from the endpoints of all Services that match the Pod. Use this when your app needs time to load large caches or establish database connections before it can serve users.

### 3. Startup Probe
**Purpose:** Indicates whether the application within the container has started.
All other probes are disabled if a startup probe is provided, until it succeeds. If it fails, the container is killed and restarted. Use this for legacy applications that have extremely slow and unpredictable startup times, preventing them from being killed prematurely by the Liveness probe.

## Types of Health Checks

You can define how the probe actually tests the container:
*   **HTTP GET**: Makes an HTTP GET request to a path on the container's IP/port. A 2xx or 3xx status code is success.
*   **TCP Socket**: Attempts to open a TCP connection to the container on a specified port. Success if the port is open.
*   **Exec**: Executes a shell command inside the container. Success if the command exits with status code 0.
*   **gRPC**: Uses standard gRPC health checking protocols.

## Probe Configuration Example

Here is a Pod YAML implementing Liveness and Readiness probes using HTTP:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: probe-demo
spec:
  containers:
  - name: my-app
    image: my-app:1.0
    ports:
    - containerPort: 8080
    
    # Check if app is ready to receive traffic
    readinessProbe:
      httpGet:
        path: /health/ready
        port: 8080
      initialDelaySeconds: 5  # Wait 5s before first check
      periodSeconds: 10       # Check every 10s
      successThreshold: 1     # Minimum consecutive successes to be ready
      failureThreshold: 3     # Remove from Service after 3 failures
      
    # Check if app is deadlocked and needs restart
    livenessProbe:
      httpGet:
        path: /health/live
        port: 8080
      initialDelaySeconds: 15 # Give app time to start
      periodSeconds: 20
      failureThreshold: 3     # Restart container after 3 failures
\`\`\`

**Best Practice:** Never make a Liveness probe dependent on an external service (like a database). If the DB goes down, all your pods will fail their liveness probe, Kubernetes will restart them all, causing a massive cluster restart storm that won't fix the DB issue.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between a Liveness Probe and a Readiness Probe?",
        answer: "A Liveness probe checks if the application is healthy (not deadlocked). If it fails, the container is RESTARTED. A Readiness probe checks if the application is ready to accept traffic. If it fails, the container is REMOVED from the Service's endpoint list (but not restarted)."
      },
      {
        question: "Why was the Startup Probe introduced?",
        answer: "Some legacy applications take a long, unpredictable amount of time to start. If you use a Liveness probe, it might fail before the app finishes starting, causing a continuous restart loop. A Startup probe runs first and disables Liveness/Readiness probes until it succeeds, giving the app all the time it needs."
      },
      {
        question: "What are the three main ways a probe can check a container's health?",
        answer: "1. HTTP GET: Expects an HTTP status code between 200-399. 2. TCP Socket: Expects a successful TCP connection on a specific port. 3. Exec: Executes a command inside the container and expects an exit code of 0."
      },
      {
        question: "What happens if you do not define a Readiness probe?",
        answer: "If no Readiness probe is defined, Kubernetes assumes the container is ready to accept traffic the exact moment the container process starts running. This can result in dropped connections if the application takes a few seconds to boot its internal web server."
      },
      {
        question: "Why should a Liveness probe NOT check database connectivity?",
        answer: "If the database goes down, the Liveness probe will fail for all Pods. Kubernetes will violently kill and restart all your application Pods simultaneously. Restarting the Pods does not fix the database, but it puts enormous strain on the cluster and the database when it tries to recover."
      }
    ],
    practicalTask: {
      scenario: "You need a pod with a busybox image that creates a file /tmp/healthy on start, but deletes it after 30 seconds. You need an exec liveness probe checking for that file.",
      task: "Write the YAML for this probe configuration.",
      solutionCode: "livenessProbe:\n  exec:\n    command:\n    - cat\n    - /tmp/healthy\n  initialDelaySeconds: 5\n  periodSeconds: 5"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide to Kubernetes orchestration, from beginner to intermediate level.', topics);
