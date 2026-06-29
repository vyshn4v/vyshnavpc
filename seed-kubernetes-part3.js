import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "kubernetes-chapter-11-pv-pvc",
    title: "Chapter 11: PV and PVC",
    order: 11,
    content: "<h2>Persistent Volumes & Claims</h2><p>PVs and PVCs provide APIs for users and administrators that abstract details of how storage is provided from how it is consumed.</p>",
    interviewQuestions: [
      { question: "What is a PV?", answer: "A PersistentVolume is a piece of storage in the cluster provisioned by an administrator or dynamically provisioned." },
      { question: "What is a PVC?", answer: "A PersistentVolumeClaim is a request for storage by a user." }
    ],
    practicalTask: {
      scenario: "Check storage requests.",
      task: "List all PersistentVolumeClaims in the current namespace.",
      solutionCode: "kubectl get pvc"
    }
  },
  {
    slug: "kubernetes-chapter-12-storageclasses",
    title: "Chapter 12: StorageClasses",
    order: 12,
    content: "<h2>StorageClasses</h2><p>StorageClass provides a way for administrators to describe the classes of storage they offer.</p>",
    interviewQuestions: [
      { question: "What does a StorageClass do?", answer: "It allows dynamic provisioning of PersistentVolumes." },
      { question: "What is a provisioner in a StorageClass?", answer: "It determines what volume plugin is used for provisioning PVs." }
    ],
    practicalTask: {
      scenario: "Review available storage types.",
      task: "List all StorageClasses in the cluster.",
      solutionCode: "kubectl get sc"
    }
  },
  {
    slug: "kubernetes-chapter-13-statefulsets",
    title: "Chapter 13: StatefulSets",
    order: 13,
    content: "<h2>StatefulSets</h2><p>StatefulSet is the workload API object used to manage stateful applications.</p>",
    interviewQuestions: [
      { question: "How does a StatefulSet differ from a Deployment?", answer: "StatefulSets maintain a sticky identity for each of their Pods." },
      { question: "When would you use a StatefulSet?", answer: "For applications like databases that require stable, unique network identifiers and persistent storage." }
    ],
    practicalTask: {
      scenario: "Check stateful applications.",
      task: "List all StatefulSets in the 'db' namespace.",
      solutionCode: "kubectl get statefulset -n db"
    }
  },
  {
    slug: "kubernetes-chapter-14-daemonsets",
    title: "Chapter 14: DaemonSets",
    order: 14,
    content: "<h2>DaemonSets</h2><p>A DaemonSet ensures that all (or some) Nodes run a copy of a Pod.</p>",
    interviewQuestions: [
      { question: "What is a DaemonSet used for?", answer: "Running cluster storage daemons, logs collection daemons, or node monitoring daemons on every node." },
      { question: "What happens when a new node is added to the cluster?", answer: "The DaemonSet automatically adds the required pod to the new node." }
    ],
    practicalTask: {
      scenario: "Check node agents.",
      task: "List all DaemonSets in the 'kube-system' namespace.",
      solutionCode: "kubectl get ds -n kube-system"
    }
  },
  {
    slug: "kubernetes-chapter-15-jobs",
    title: "Chapter 15: Jobs and CronJobs",
    order: 15,
    content: "<h2>Jobs and CronJobs</h2><p>A Job creates one or more Pods and ensures that a specified number of them successfully terminate.</p>",
    interviewQuestions: [
      { question: "What is a Kubernetes Job?", answer: "A workload object that runs a task to completion." },
      { question: "How is a CronJob different from a Job?", answer: "A CronJob manages time-based Jobs, running them on a scheduled schedule." }
    ],
    practicalTask: {
      scenario: "Create a scheduled task.",
      task: "Create a CronJob named 'hello' that prints 'Hello' every minute using the busybox image.",
      solutionCode: "kubectl create cronjob hello --image=busybox --schedule='* * * * *' -- echo Hello"
    }
  }
];

appendTopics("kubernetes", "Kubernetes Orchestration", "The definitive guide.", topics);
