import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'intro-kubernetes-container-orchestration',
    title: '1. Introduction to Kubernetes & Container Orchestration',
    order: 1,
    content: `
# Introduction to Kubernetes & Container Orchestration

Welcome to the definitive guide to Kubernetes! In the modern era of cloud-native development, **Kubernetes (K8s)** has become the de-facto standard for container orchestration. To truly understand Kubernetes, we must first understand the problem it solves.

## The Evolution of Application Deployment

### Traditional Deployment Era
Early on, organizations ran applications on physical servers. There was no way to define resource boundaries for applications in a physical server, and this caused resource allocation issues. For example, if multiple applications run on a physical server, there can be instances where one application would take up most of the resources, and as a result, the other applications would underperform.

### Virtualized Deployment Era
As a solution, virtualization was introduced. It allows you to run multiple Virtual Machines (VMs) on a single physical server's CPU. Virtualization allows applications to be isolated between VMs and provides a level of security as the information of one application cannot be freely accessed by another application.
Virtualization allows better utilization of resources in a physical server and allows better scalability. However, each VM is a full machine running all the components, including its own operating system, on top of the virtualized hardware.

### Container Deployment Era
Containers are similar to VMs, but they have relaxed isolation properties to share the Operating System (OS) among the applications. Therefore, containers are considered lightweight. Similar to a VM, a container has its own filesystem, share of CPU, memory, process space, and more. As they are decoupled from the underlying infrastructure, they are portable across clouds and OS distributions.

## What is Container Orchestration?

When you have hundreds or thousands of containers, managing them manually becomes impossible. You need a system to manage the lifecycle of these containers, ensuring they are running, healthy, and scaled properly. This is **Container Orchestration**.

An orchestration engine handles:
*   **Provisioning and deployment** of containers.
*   **Redundancy and availability** of containers.
*   **Scaling up or removing** containers to spread application load evenly across host infrastructure.
*   **Movement of containers** from one host to another if there is a shortage of resources in a host, or if a host dies.
*   **Allocation of resources** between containers.
*   **External exposure** of services running in a container with the outside world.
*   **Load balancing** of service discovery between containers.
*   **Health monitoring** of containers and hosts.

## Enter Kubernetes

**Kubernetes** is an open-source system for automating deployment, scaling, and management of containerized applications. It was originally designed by Google and is now maintained by the Cloud Native Computing Foundation (CNCF).

### Key Features of Kubernetes:
1.  **Service discovery and load balancing**: Kubernetes can expose a container using the DNS name or using their own IP address. If traffic to a container is high, Kubernetes is able to load balance and distribute the network traffic so that the deployment is stable.
2.  **Storage orchestration**: Kubernetes allows you to automatically mount a storage system of your choice, such as local storages, public cloud providers, and more.
3.  **Automated rollouts and rollbacks**: You can describe the desired state for your deployed containers using Kubernetes, and it can change the actual state to the desired state at a controlled rate. For example, you can automate Kubernetes to create new containers for your deployment, remove existing containers and adopt all their resources to the new container.
4.  **Automatic bin packing**: You provide Kubernetes with a cluster of nodes that it can use to run containerized tasks. You tell Kubernetes how much CPU and memory (RAM) each container needs. Kubernetes can fit containers onto your nodes to make the best use of your resources.
5.  **Self-healing**: Kubernetes restarts containers that fail, replaces containers, kills containers that don't respond to your user-defined health check, and doesn't advertise them to clients until they are ready to serve.
6.  **Secret and configuration management**: Kubernetes lets you store and manage sensitive information, such as passwords, OAuth tokens, and SSH keys. You can deploy and update secrets and application configuration without rebuilding your container images, and without exposing secrets in your stack configuration.

### Example: A Simple Dockerfile
Before Kubernetes can orchestrate, you need a container. Here is a basic \`Dockerfile\` for a Node.js application:

\`\`\`dockerfile
# Use an official Node runtime as a parent image
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 8080
EXPOSE 8080

# Command to run the application
CMD [ "node", "server.js" ]
\`\`\`

You build this image (\`docker build -t my-node-app .\`) and push it to a registry. Kubernetes will then pull this image and run it.
    `,
    interviewQuestions: [
      {
        question: "What is Kubernetes and why is it used?",
        answer: "Kubernetes is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. It is used to eliminate manual processes involved in deploying and scaling containerized applications, providing features like self-healing, load balancing, and automated rollouts."
      },
      {
        question: "What is the difference between a Virtual Machine and a Container?",
        answer: "A Virtual Machine includes a full guest operating system, virtualized hardware, and the application, making it heavy. A Container shares the host system's OS kernel and only includes the application and its dependencies, making it lightweight, faster to start, and highly portable."
      },
      {
        question: "What does 'Container Orchestration' actually mean?",
        answer: "Container Orchestration refers to the automated management of the lifecycle of containers, particularly in large, dynamic environments. This includes provisioning, scheduling, scaling, networking, and ensuring the high availability of containers across a cluster of machines."
      },
      {
        question: "Name three key features of Kubernetes.",
        answer: "1. Self-healing (restarting failed containers). 2. Automated rollouts and rollbacks (deploying new versions without downtime). 3. Service discovery and load balancing (exposing containers and distributing traffic)."
      },
      {
        question: "How does Kubernetes handle self-healing?",
        answer: "Kubernetes continuously monitors the health of containers and nodes. If a container fails or a node goes down, Kubernetes automatically restarts the container, reschedules it on a healthy node, or kills containers that fail readiness probes until they are ready to serve traffic."
      }
    ],
    practicalTask: {
      scenario: "You have a simple Node.js web application that you want to containerize. You need to write a Dockerfile to package this application so it can be deployed to Kubernetes.",
      task: "Write a Dockerfile that uses the 'node:alpine' base image, sets the working directory to '/app', copies the package.json, installs dependencies, copies the rest of the code, and exposes port 3000.",
      solutionCode: "FROM node:alpine\nWORKDIR /app\nCOPY package.json .\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\", \"start\"]\n"
    }
  },
  {
    slug: 'kubernetes-architecture-core-components',
    title: '2. Kubernetes Architecture and Core Components',
    order: 2,
    content: `
# Kubernetes Architecture and Core Components

A Kubernetes cluster consists of a set of worker machines, called **nodes**, that run containerized applications. Every cluster has at least one worker node. The worker nodes host the Pods that are the components of the application workload. The **control plane** manages the worker nodes and the Pods in the cluster.

Let's break down the massive architecture of Kubernetes into its two main sections: The Control Plane and the Worker Nodes.

## The Control Plane Components

The Control Plane's components make global decisions about the cluster (for example, scheduling), as well as detecting and responding to cluster events (for example, starting up a new pod when a deployment's replicas field is unsatisfied).

### 1. kube-apiserver
The API server is a component of the Kubernetes control plane that exposes the Kubernetes API. The API server is the front end for the Kubernetes control plane. It is designed to scale horizontally—that is, it scales by deploying more instances. All communication between components goes through the API server.

### 2. etcd
Consistent and highly-available key value store used as Kubernetes' backing store for all cluster data. If your Kubernetes cluster uses etcd as its backing store, make sure you have a back up plan for those data. It stores the entire state of the cluster.

### 3. kube-scheduler
Control plane component that watches for newly created Pods with no assigned node, and selects a node for them to run on.
Factors taken into account for scheduling decisions include:
*   Individual and collective resource requirements
*   Hardware/Software/Policy constraints
*   Affinity and anti-affinity specifications
*   Data locality
*   Inter-workload interference
*   Deadlines

### 4. kube-controller-manager
Control plane component that runs controller processes. Logically, each controller is a separate process, but to reduce complexity, they are all compiled into a single binary and run in a single process.
Some types of these controllers are:
*   **Node controller**: Responsible for noticing and responding when nodes go down.
*   **Job controller**: Watches for Job objects that represent one-off tasks, then creates Pods to run those tasks to completion.
*   **Endpoints controller**: Populates the Endpoints object (that is, joins Services & Pods).
*   **Service Account & Token controllers**: Create default accounts and API access tokens for new namespaces.

### 5. cloud-controller-manager
Embeds cloud-specific control logic. The cloud controller manager lets you link your cluster into your cloud provider's API, and separates out the components that interact with that cloud platform from components that only interact with your cluster.

## Node Components

Node components run on every node, maintaining running pods and providing the Kubernetes runtime environment.

### 1. kubelet
An agent that runs on each node in the cluster. It makes sure that containers are running in a Pod. The kubelet takes a set of PodSpecs that are provided through various mechanisms and ensures that the containers described in those PodSpecs are running and healthy. The kubelet doesn't manage containers which were not created by Kubernetes.

### 2. kube-proxy
kube-proxy is a network proxy that runs on each node in your cluster, implementing part of the Kubernetes Service concept. kube-proxy maintains network rules on nodes. These network rules allow network communication to your Pods from network sessions inside or outside of your cluster.

### 3. Container Runtime
The container runtime is the software that is responsible for running containers. Kubernetes supports container runtimes such as containerd, CRI-O, and any other implementation of the Kubernetes CRI (Container Runtime Interface).

## Architectural Diagram Flow

Imagine a user running a \`kubectl\` command:
1. User types \`kubectl apply -f pod.yaml\`.
2. The command hits the **kube-apiserver**.
3. The API server authenticates the request, validates it, and saves the desired state in **etcd**.
4. The **kube-scheduler** detects a new Pod needs to be scheduled and assigns a Node based on resources.
5. The **kubelet** on the assigned Node gets notified by the API server.
6. The kubelet tells the **Container Runtime** to pull the image and start the container.
7. The kubelet reports the status back to the API server, which updates etcd.

This declarative, asynchronous loop ensures the cluster is always moving towards the desired state.
    `,
    interviewQuestions: [
      {
        question: "What is the role of the kube-apiserver?",
        answer: "The kube-apiserver is the central management entity of the Kubernetes cluster. It acts as the front end for the control plane, exposing the Kubernetes API. All internal and external communication goes through the API server, which also validates and configures data for the API objects."
      },
      {
        question: "What is etcd and why is it critical?",
        answer: "etcd is a highly available, distributed key-value store used by Kubernetes to store all cluster data, including its state and configuration. It is critical because if etcd data is lost, the entire cluster state is lost, hence backing up etcd is a top priority."
      },
      {
        question: "How does the kube-scheduler make decisions?",
        answer: "The kube-scheduler watches for newly created, unscheduled pods and assigns them to a node based on resource availability, hardware/software constraints, node affinity/anti-affinity rules, and data locality."
      },
      {
        question: "What is the difference between kube-controller-manager and cloud-controller-manager?",
        answer: "kube-controller-manager runs core Kubernetes controllers (like Node, ReplicaSet, and Endpoint controllers) that handle internal cluster logic. The cloud-controller-manager interacts specifically with the underlying cloud provider's API (like AWS, GCP, Azure) to manage cloud-specific resources like load balancers and block storage."
      },
      {
        question: "What is the role of the kubelet?",
        answer: "The kubelet is an agent running on every worker node. It registers the node with the cluster, listens for pod specifications from the API server, and ensures that the corresponding containers are running and healthy via the container runtime."
      },
      {
        question: "What does kube-proxy do?",
        answer: "kube-proxy is a network proxy running on each node that maintains network rules (using iptables or IPVS). These rules allow communication to Pods from inside or outside the cluster and handle the routing for Kubernetes Services."
      }
    ],
    practicalTask: {
      scenario: "You need to verify the health of the control plane components of a running Kubernetes cluster to ensure the API server, controller manager, and scheduler are healthy.",
      task: "Write the kubectl command to get the status of the cluster's control plane components.",
      solutionCode: "kubectl get componentstatuses\n# Note: componentstatuses is deprecated in newer versions, alternatively:\nkubectl get pods -n kube-system"
    }
  },
  {
    slug: 'pods-smallest-deployable-units',
    title: '3. Pods: The Smallest Deployable Units',
    order: 3,
    content: `
# Pods: The Smallest Deployable Units

In Kubernetes, you don't run containers directly; instead, you run **Pods**. A Pod is the smallest, most basic deployable object in Kubernetes.

## What is a Pod?

A Pod represents a single instance of a running process in your cluster. Pods contain one or more containers, such as Docker containers. When a Pod runs multiple containers, the containers are managed as a single entity and share the Pod's resources. Generally, running multiple containers in a single Pod is an advanced use case.

Pods provide two main types of shared resources for their constituent containers:
1.  **Networking**: Every Pod is assigned a unique IP address for the cluster. Containers inside a Pod share the network namespace, including the IP address and network ports. Containers inside a Pod can communicate with one another using \`localhost\`.
2.  **Storage**: A Pod can specify a set of shared storage volumes. All containers in the Pod can access the shared volumes, allowing those containers to share data.

## Pod Lifecycle

Pods are ephemeral. They are not designed to run forever. When a Pod is created, it is scheduled to run on a Node in your cluster. The Pod remains on that Node until the process terminates, the pod object is deleted, the pod is evicted for lack of resources, or the Node fails.

Pod Phases:
*   **Pending**: The Pod has been accepted by the Kubernetes cluster, but one or more of the containers has not been set up and made ready to run. This includes time a Pod spends waiting to be scheduled as well as the time spent downloading container images over the network.
*   **Running**: The Pod has been bound to a node, and all of the containers have been created. At least one container is still running, or is in the process of starting or restarting.
*   **Succeeded**: All containers in the Pod have terminated in success, and will not be restarted.
*   **Failed**: All containers in the Pod have terminated, and at least one container has terminated in failure.
*   **Unknown**: For some reason the state of the Pod could not be obtained.

## Writing a Pod YAML

Kubernetes resources are defined declaratively using YAML (or JSON). Here is an example of a simple NGINX Pod:

\`\`\`yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: web
    env: production
spec:
  containers:
  - name: nginx-container
    image: nginx:1.24.0
    ports:
    - containerPort: 80
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
\`\`\`

### Deep Dive into the YAML structure:
*   **apiVersion**: Which version of the Kubernetes API you're using to create this object.
*   **kind**: What kind of object you want to create (Pod).
*   **metadata**: Data that helps uniquely identify the object, including a \`name\` string, \`UID\`, and optional \`namespace\` and \`labels\`.
*   **spec**: What state you desire for the object. Here we define the containers array.
*   **containers**: A list of containers to run in this Pod. We specify the name, image, ports, and resource limits/requests.

## Multi-Container Pods (Design Patterns)

While 1-container-per-pod is common, multi-container pods are used for specific patterns:
1.  **Sidecar pattern**: A helper container assists the primary container (e.g., logging agent, proxy).
2.  **Adapter pattern**: Standardizes and normalizes output from the main container.
3.  **Ambassador pattern**: Acts as a proxy for the main container to connect to external services.
    `,
    interviewQuestions: [
      {
        question: "What is a Pod in Kubernetes?",
        answer: "A Pod is the smallest deployable compute unit in Kubernetes. It encapsulates one or more containers, storage resources, a unique network IP, and options that govern how the container(s) should run."
      },
      {
        question: "Why does Kubernetes use Pods instead of running containers directly?",
        answer: "Pods provide an abstraction layer over containers, allowing Kubernetes to manage them regardless of the underlying container runtime (Docker, containerd, etc.). It also allows grouping tightly coupled containers that need to share network namespaces, IP addresses, and storage volumes."
      },
      {
        question: "How do multiple containers within the same Pod communicate?",
        answer: "Containers within the same Pod share the same network namespace and IP address. Therefore, they can communicate with each other using 'localhost' and standard IPC (Inter-Process Communication)."
      },
      {
        question: "What is the Sidecar design pattern in Kubernetes?",
        answer: "The Sidecar pattern involves deploying an auxiliary container alongside a primary container in the same Pod. The sidecar enhances or extends the functionality of the primary container, such as shipping logs, handling file syncing, or acting as a proxy, without altering the primary application."
      },
      {
        question: "What happens to a Pod if the Node it is running on crashes?",
        answer: "Pods are ephemeral. If a node crashes, the Pods running on it will be marked as Failed or Terminating. If the Pods are managed by a controller (like a Deployment or ReplicaSet), the controller will automatically create new replacement Pods and schedule them on healthy nodes."
      },
      {
        question: "What is the difference between resource requests and limits in a Pod specification?",
        answer: "A 'request' is the amount of CPU/Memory guaranteed to the container; the scheduler uses this to decide which node to place the pod on. A 'limit' is the maximum amount of CPU/Memory the container is allowed to use before being throttled (CPU) or killed (Memory/OOMKilled)."
      }
    ],
    practicalTask: {
      scenario: "You need to create a Pod running an NGINX server that has the label 'tier: frontend' and explicitly requests 100m CPU.",
      task: "Write a YAML definition for this Pod.",
      solutionCode: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: my-nginx\n  labels:\n    tier: frontend\nspec:\n  containers:\n  - name: nginx\n    image: nginx\n    resources:\n      requests:\n        cpu: 100m"
    }
  },
  {
    slug: 'replicasets-deployments-high-availability',
    title: '4. ReplicaSets and Deployments: Ensuring High Availability',
    order: 4,
    content: `
# ReplicaSets and Deployments: Ensuring High Availability

While you *can* create Pods directly, you rarely do so in a production environment. Pods are ephemeral and do not reschedule themselves if they fail or if their node dies. To ensure high availability and scalability, you use higher-level abstractions: **ReplicaSets** and **Deployments**.

## ReplicaSets

A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

If a Pod crashes, the ReplicaSet detects that the current number of running Pods is less than the desired number and creates a new one. If you manually create a Pod that matches the ReplicaSet's selector, the ReplicaSet will kill it if it exceeds the desired count.

### How a ReplicaSet works
A ReplicaSet is defined with fields, including a selector that specifies how to identify Pods it can acquire, a number of replicas indicating how many Pods it should be maintaining, and a pod template specifying the data of new Pods it should create to meet the number of replicas criteria.

## Deployments

A **Deployment** provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate.

**Deployments manage ReplicaSets.** You should generally use Deployments instead of managing ReplicaSets directly.

### Key Capabilities of Deployments:
1.  **Scaling**: Easily scale the number of Pods up or down.
2.  **Rolling Updates**: Update the Pods to a new version (e.g., a new Docker image) smoothly with zero downtime. The Deployment creates a new ReplicaSet, scales it up, and scales down the old ReplicaSet simultaneously.
3.  **Rollbacks**: If a new version crashes or is buggy, you can instantly rollback to the previous version (or any historical revision).
4.  **Pausing and Resuming**: Pause a rollout, make multiple changes to the Deployment, and then resume it to apply all changes at once.

### Deployment YAML Example

Here is a comprehensive example of a Deployment:

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-api
  labels:
    app: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1       # How many pods can be created over desired replicas
      maxUnavailable: 1 # How many pods can be unavailable during update
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: api-server
        image: myapi:2.0.0
        ports:
        - containerPort: 8080
\`\`\`

### The Update Process
When you change the image in the YAML from \`myapi:2.0.0\` to \`myapi:3.0.0\` and apply it:
1. The Deployment creates a new ReplicaSet.
2. It starts spinning up Pods with v3.0.0 in the new ReplicaSet based on \`maxSurge\`.
3. It starts terminating Pods in the old ReplicaSet based on \`maxUnavailable\`.
4. It repeats this until all Pods are running v3.0.0 and the old ReplicaSet has 0 replicas.

### Helpful Commands:
*   \`kubectl apply -f deployment.yaml\` : Create or update deployment.
*   \`kubectl scale deployment backend-api --replicas=5\` : Scale horizontally.
*   \`kubectl set image deployment/backend-api api-server=myapi:3.0.0\` : Trigger an update.
*   \`kubectl rollout status deployment/backend-api\` : Watch update status.
*   \`kubectl rollout undo deployment/backend-api\` : Rollback to previous version.
    `,
    interviewQuestions: [
      {
        question: "What is the difference between a Pod and a Deployment?",
        answer: "A Pod is a single instance of a running process and is ephemeral (if it dies, it's gone). A Deployment is a higher-level controller that manages Pods (via ReplicaSets). It ensures a specified number of Pods are always running, provides scaling capabilities, and handles zero-downtime rolling updates."
      },
      {
        question: "What is a ReplicaSet and how does it relate to a Deployment?",
        answer: "A ReplicaSet ensures a specified number of pod replicas are running at any given time. A Deployment is a higher-level concept that manages ReplicaSets and provides declarative updates to Pods. A Deployment creates a ReplicaSet to manage the underlying Pods."
      },
      {
        question: "How do you achieve zero-downtime deployments in Kubernetes?",
        answer: "By using the RollingUpdate strategy in a Deployment. Kubernetes will gradually replace old Pods with new ones. Parameters like 'maxSurge' and 'maxUnavailable' control how many new Pods can be created and how many old ones can be taken down simultaneously, ensuring continuous availability."
      },
      {
        question: "What happens if a deployment rollout fails (e.g., ImagePullBackOff)? How do you recover?",
        answer: "The deployment will pause and not terminate the remaining old Pods, preventing a complete outage. To recover, you can use 'kubectl rollout undo deployment/<name>' to instantly rollback to the previous stable ReplicaSet."
      },
      {
        question: "What do 'maxSurge' and 'maxUnavailable' mean in a Deployment strategy?",
        answer: "maxSurge dictates the maximum number of Pods that can be created over the desired number of Pods during an update. maxUnavailable dictates the maximum number of Pods that can be unavailable during the update process."
      },
      {
        question: "How does a ReplicaSet know which Pods it manages?",
        answer: "It uses Label Selectors. The ReplicaSet's 'selector' field matches the labels defined in the 'metadata.labels' of the Pods. Any Pod in the namespace with matching labels is managed by that ReplicaSet."
      }
    ],
    practicalTask: {
      scenario: "You have an imperative command requirement. You need to create a Deployment named 'webapp' using the 'nginx' image with 3 replicas, directly from the command line without writing a YAML file.",
      task: "Write the kubectl command to create the deployment and scale it.",
      solutionCode: "kubectl create deployment webapp --image=nginx\nkubectl scale deployment webapp --replicas=3"
    }
  },
  {
    slug: 'services-networking-exposing',
    title: '5. Services: Networking and Exposing Applications',
    order: 5,
    content: `
# Services: Networking and Exposing Applications

Since Pods are ephemeral—they are created, destroyed, and replaced dynamically—their IP addresses change constantly. If a set of backend Pods provides an API for a frontend app, how does the frontend keep track of which IP addresses to connect to? 
The answer is the Kubernetes **Service**.

## What is a Service?

An abstract way to expose an application running on a set of Pods as a network service.
With Kubernetes you don't need to modify your application to use an unfamiliar service discovery mechanism. Kubernetes gives Pods their own IP addresses and a single DNS name for a set of Pods, and can load-balance across them.

A Service routes traffic across a set of Pods. Services are the abstraction that allow pods to die and replicate in Kubernetes without impacting your application. Discovery and routing among dependent Pods (such as the frontend and backend components in an application) is handled by Kubernetes Services.

## Types of Services

Kubernetes ServiceTypes allow you to specify what kind of Service you want. The default is \`ClusterIP\`.

### 1. ClusterIP (Default)
Exposes the Service on a cluster-internal IP. Choosing this value makes the Service only reachable from within the cluster. This is perfect for internal communication, like a frontend talking to a backend database.

### 2. NodePort
Exposes the Service on each Node's IP at a static port (the NodePort). A ClusterIP Service, to which the NodePort Service routes, is automatically created. You'll be able to contact the NodePort Service, from outside the cluster, by requesting \`<NodeIP>:<NodePort>\`. NodePorts are in the range 30000-32767.

### 3. LoadBalancer
Exposes the Service externally using a cloud provider's load balancer. NodePort and ClusterIP Services, to which the external load balancer routes, are automatically created. This is heavily used in AWS (ELB), GCP, and Azure to get public IPs for your application.

### 4. ExternalName
Maps the Service to the contents of the \`externalName\` field (e.g. \`foo.bar.example.com\`), by returning a CNAME record with its value. No proxying of any kind is set up. This is useful for migrating legacy services into Kubernetes.

## Defining a Service

Here is an example of a Service YAML that creates a LoadBalancer routing to pods labeled \`app: my-webapp\` on port 80:

\`\`\`yaml
apiVersion: v1
kind: Service
metadata:
  name: my-webapp-service
spec:
  type: LoadBalancer
  selector:
    app: my-webapp
  ports:
    - protocol: TCP
      port: 80         # Port exposed by the Service
      targetPort: 8080 # Port the container is listening on
      nodePort: 30036  # Optional: Static port on the node
\`\`\`

### Selectors and Endpoints
How does the Service know which Pods to route traffic to? It uses the \`selector\` field. The Service continuously scans for Pods matching its label selector (\`app: my-webapp\`). 
When it finds matching Pods, it adds their IP addresses to an **Endpoints** object (or EndpointSlice in newer K8s versions). The Service proxies traffic to the IP addresses listed in that Endpoints object.

### DNS in Kubernetes
Kubernetes runs a DNS server (CoreDNS) for cluster internals. When you create a Service named \`my-service\` in namespace \`my-namespace\`, a DNS record is created: \`my-service.my-namespace.svc.cluster.local\`. Pods in the same namespace can simply resolve \`my-service\`.
    `,
    interviewQuestions: [
      {
        question: "Why do we need Services in Kubernetes? Why not just use Pod IPs?",
        answer: "Pod IPs are dynamic and ephemeral. When a Pod crashes and is recreated, it gets a new IP address. A Service provides a stable, static IP address and a DNS name that acts as a reliable load balancer in front of a set of Pods, so clients don't need to track changing Pod IPs."
      },
      {
        question: "What is the difference between ClusterIP, NodePort, and LoadBalancer?",
        answer: "ClusterIP exposes the service internally within the cluster. NodePort exposes the service on a specific port on every physical Node's IP, making it accessible from outside the cluster. LoadBalancer provisions an external load balancer from a cloud provider (AWS, Azure, GCP) to route traffic from the internet into the cluster."
      },
      {
        question: "How does a Service know which Pods to send traffic to?",
        answer: "A Service uses a Label Selector. It looks for Pods whose labels match the labels defined in the Service's selector field. The IPs of these matching Pods are continuously updated in an associated Endpoints object."
      },
      {
        question: "What is the difference between 'port', 'targetPort', and 'nodePort' in a Service definition?",
        answer: "'port' is the port the Service exposes. 'targetPort' is the port the actual container inside the Pod is listening on. 'nodePort' is the static port opened on every worker node's IP to allow external traffic in (only applicable for NodePort/LoadBalancer types)."
      },
      {
        question: "What is the purpose of an ExternalName service?",
        answer: "An ExternalName service acts as an alias to an external DNS name. It returns a CNAME record instead of proxying traffic. It is useful when a workload inside the cluster needs to connect to an external database or service using a Kubernetes DNS name, allowing seamless migration later."
      },
      {
        question: "How does DNS resolution work for Services across different namespaces?",
        answer: "CoreDNS creates records in the format <service-name>.<namespace>.svc.cluster.local. If a Pod is in the same namespace, it can just use <service-name>. If it's in a different namespace, it must use the FQDN or at least <service-name>.<namespace>."
      }
    ],
    practicalTask: {
      scenario: "You have a deployment named 'frontend'. You need to expose it within the cluster on port 80, routing to the containers on port 3000.",
      task: "Write the imperative kubectl command to create a ClusterIP service for this deployment.",
      solutionCode: "kubectl expose deployment frontend --name=frontend-svc --port=80 --target-port=3000 --type=ClusterIP"
    }
  }
];

appendTopics('kubernetes', 'Kubernetes Orchestration', 'The definitive guide to Kubernetes orchestration, from beginner to intermediate level.', topics);
