import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "Trees and Binary Search Trees",
    slug: "trees-bst",
    order: 6,
    content: `### 1. Conceptual Overview
A tree is a hierarchical data structure consisting of nodes connected by edges. The Binary Search Tree (BST) is a specialized tree where each node has at most two children, and the left child is strictly smaller than the parent, while the right child is greater.

### 2. Architecture & Mechanics
A BST starts with a root node. Every subsequent insertion traverses the tree, going left or right depending on the value, until an empty spot is found. In a balanced BST, this ensures that the height is logarithmic in relation to the number of nodes.

### 3. Implementation: Standard vs Optimized
Standard implementation relies on a simple Node class with \`value\`, \`left\`, and \`right\` properties. Recursive methods can easily handle insertion and traversal. Optimized variants, like AVL or Red-Black trees, include self-balancing logic during insertion and deletion to prevent the tree from becoming a linked list (O(n) operations).

### 4. Trade-offs & Complexity
Time complexity for search, insert, and delete in a balanced BST is O(log n). However, the worst-case for an unbalanced BST is O(n). Memory overhead includes the pointers for left and right children, which can be significant compared to arrays.`,
    interviewQuestions: [
      {
        question: "What makes a Binary Tree a Binary Search Tree?",
        answer: "In a BST, for every node, all values in its left subtree are smaller, and all values in its right subtree are larger."
      },
      {
        question: "What are the common tree traversal algorithms?",
        answer: "In-order, Pre-order, Post-order, and Level-order (BFS) traversals."
      },
      {
        question: "Why do we need self-balancing trees?",
        answer: "Self-balancing trees ensure operations stay at O(log n) worst-case time by preventing the tree structure from degrading into a linear chain."
      },
      {
        question: "Explain the time complexity of deleting a node in a BST.",
        answer: "It takes O(h) where h is the height of the tree. In a balanced tree, this is O(log n)."
      },
      {
        question: "How do you find the lowest common ancestor of two nodes in a BST?",
        answer: "Traverse from root: if both nodes are smaller, go left. If both are greater, go right. The first node that splits the two values is the LCA."
      }
    ],
    practicalTask: {
      title: "Implement a Binary Search Tree",
      description: "Write a Node class and a BST class with insert, search, and inOrder traversal methods.",
      solution: `class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}
class BST {
  constructor() { this.root = null; }
  insert(value) { /* implementation */ }
}`
    }
  },
  {
    title: "Heaps and Priority Queues",
    slug: "heaps-priority-queues",
    order: 7,
    content: `### 1. Conceptual Overview
A heap is a specialized tree-based data structure that satisfies the heap property. In a max-heap, the parent key is always greater than or equal to its children; in a min-heap, the parent is less than or equal to its children. A priority queue is an abstract data type commonly implemented using a heap.

### 2. Architecture & Mechanics
Heaps are typically implemented as complete binary trees using arrays. The root is at index 0. The left child of a node at index \`i\` is at \`2i + 1\`, and the right child is at \`2i + 2\`. The parent is at \`Math.floor((i - 1) / 2)\`.

### 3. Implementation: Standard vs Optimized
Standard insertion adds an element at the end of the array and "bubbles up" to maintain the heap property. Deletion replaces the root with the last element and "bubbles down". An optimized priority queue might use Fibonacci heaps for faster decrease-key operations in advanced graph algorithms.

### 4. Trade-offs & Complexity
Insertion and extraction both take O(log n) time. Finding the maximum (or minimum) takes O(1) time. Building a heap from an unordered array takes O(n) time, not O(n log n), due to mathematical bounds. Heaps are extremely memory-efficient as they do not require pointers.`,
    interviewQuestions: [
      {
        question: "What is the difference between a heap and a standard BST?",
        answer: "A heap guarantees that the maximum or minimum element is always at the root, whereas a BST guarantees an ordered sequence of all elements."
      },
      {
        question: "How is a heap typically represented in memory?",
        answer: "As an array, using arithmetic on indices to find parents and children."
      },
      {
        question: "What is a Priority Queue?",
        answer: "An abstract data structure where elements are served based on priority rather than the order they were enqueued."
      },
      {
        question: "Explain the time complexity of building a heap from an array.",
        answer: "O(n) time using the heapify down algorithm starting from the last non-leaf node."
      },
      {
        question: "Why would you use a Min-Heap over sorting the entire array?",
        answer: "If you only need to continuously extract the smallest element dynamically, a Min-Heap takes O(log n) per extraction, whereas sorting is upfront O(n log n)."
      }
    ],
    practicalTask: {
      title: "Implement a Min-Heap",
      description: "Create a Min-Heap class with insert, extractMin, and bubbleUp methods using an array.",
      solution: `class MinHeap {
  constructor() { this.heap = []; }
  insert(val) { this.heap.push(val); this.bubbleUp(); }
  /* other methods */
}`
    }
  },
  {
    title: "Graphs and Graph Algorithms",
    slug: "graphs-algorithms",
    order: 8,
    content: `### 1. Conceptual Overview
A graph is a non-linear data structure consisting of vertices (nodes) and edges (connections). Graphs can be directed or undirected, weighted or unweighted, and cyclic or acyclic. They model networks like roads, social connections, and the internet.

### 2. Architecture & Mechanics
Graphs are represented using Adjacency Matrices (2D arrays) or Adjacency Lists (arrays of lists/sets). Traversal methods include Breadth-First Search (BFS) using a queue and Depth-First Search (DFS) using a stack or recursion.

### 3. Implementation: Standard vs Optimized
Standard implementation uses an Adjacency List for sparse graphs to save space. Advanced implementations might use Disjoint Sets (Union-Find) for optimized cycle detection. For shortest paths, Dijkstra’s algorithm uses a priority queue for optimal time complexity.

### 4. Trade-offs & Complexity
Adjacency Matrices take O(V^2) space but O(1) edge lookups. Adjacency Lists take O(V + E) space but O(V) edge lookups. BFS and DFS both operate in O(V + E) time for an Adjacency List.`,
    interviewQuestions: [
      {
        question: "What is the difference between BFS and DFS?",
        answer: "BFS explores level by level using a queue. DFS explores as deeply as possible along a branch using a stack or recursion before backtracking."
      },
      {
        question: "When would you prefer an Adjacency Matrix over an Adjacency List?",
        answer: "For dense graphs where the number of edges approaches V^2, or when you need constant time checking if an edge exists."
      },
      {
        question: "What is Dijkstra's algorithm?",
        answer: "An algorithm for finding the shortest paths between nodes in a graph with non-negative edge weights."
      },
      {
        question: "How do you detect a cycle in a directed graph?",
        answer: "By keeping track of nodes currently in the recursion stack during DFS. If you visit a node already in the stack, there is a cycle."
      },
      {
        question: "What is a Topological Sort?",
        answer: "A linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, u comes before v."
      }
    ],
    practicalTask: {
      title: "Implement BFS on a Graph",
      description: "Write a Graph class using an adjacency list and implement Breadth-First Search.",
      solution: `class Graph {
  constructor() { this.adjList = new Map(); }
  bfs(startNode) { /* queue and visited set implementation */ }
}`
    }
  },
  {
    title: "Sorting and Searching Algorithms",
    slug: "sorting-searching",
    order: 9,
    content: `### 1. Conceptual Overview
Sorting algorithms rearrange elements in a collection according to a relational operator (like < or >). Searching algorithms retrieve the position of an element. The efficiency of searching usually depends heavily on whether the data is sorted.

### 2. Architecture & Mechanics
Sorting can be comparison-based (Merge Sort, Quick Sort) or non-comparison-based (Counting Sort, Radix Sort). Searching is typically linear (Sequential Search) or logarithmic (Binary Search on sorted data).

### 3. Implementation: Standard vs Optimized
Standard array \`.sort()\` in JavaScript uses Timsort or a variation of Quick/Merge sort. A highly optimized Quick Sort chooses a random pivot or median-of-three to avoid O(n^2) worst-case. Binary Search iteratively halves the search space.

### 4. Trade-offs & Complexity
Merge Sort guarantees O(n log n) time but requires O(n) extra space. Quick Sort is often faster in practice with O(1) space but has an O(n^2) worst-case time complexity. Binary search runs in O(log n) time but requires the array to be pre-sorted.`,
    interviewQuestions: [
      {
        question: "What is the time complexity of Quick Sort?",
        answer: "Average case O(n log n), worst case O(n^2) when the array is already sorted and a poor pivot is chosen."
      },
      {
        question: "Why is Merge Sort preferred for Linked Lists?",
        answer: "Because Linked Lists do not require contiguous memory, making the merge step O(1) in extra space instead of O(n) as in arrays."
      },
      {
        question: "How does Binary Search work?",
        answer: "It repeatedly divides the sorted array in half, comparing the target value to the middle element, discarding the half where the target cannot reside."
      },
      {
        question: "What is a stable sorting algorithm?",
        answer: "A sorting algorithm that preserves the relative order of equal elements (e.g., Merge Sort, Insertion Sort)."
      },
      {
        question: "Can we sort faster than O(n log n)?",
        answer: "Yes, using non-comparison sorts like Counting Sort or Radix Sort, provided the data meets specific integer restrictions, operating in O(n) or O(nk) time."
      }
    ],
    practicalTask: {
      title: "Implement Binary Search",
      description: "Write a function that takes a sorted array and a target, returning the index or -1 if not found.",
      solution: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`
    }
  },
  {
    title: "Dynamic Programming",
    slug: "dynamic-programming",
    order: 10,
    content: `### 1. Conceptual Overview
Dynamic Programming (DP) is an algorithmic optimization technique. It solves complex problems by breaking them down into simpler subproblems, solving each subproblem just once, and storing their solutions to avoid redundant computations.

### 2. Architecture & Mechanics
DP operates through two main approaches: Top-Down with Memoization (caching recursive results) and Bottom-Up with Tabulation (iteratively solving smaller problems to build up to the larger one). Problems must exhibit optimal substructure and overlapping subproblems.

### 3. Implementation: Standard vs Optimized
Standard implementation uses recursion, which can lead to exponential time O(2^n). Adding memoization reduces this to O(n). Tabulation completely removes recursion overhead. Space optimization can further reduce O(n) space to O(1) by only keeping track of the last few required values (e.g., in Fibonacci).

### 4. Trade-offs & Complexity
DP significantly decreases time complexity at the cost of increased space complexity for the cache/table. Bottom-up tabulation is generally faster than top-down memoization due to the absence of recursive call stack overhead and risk of stack overflow.`,
    interviewQuestions: [
      {
        question: "What are the two key properties required for DP?",
        answer: "Overlapping subproblems and optimal substructure."
      },
      {
        question: "What is the difference between Memoization and Tabulation?",
        answer: "Memoization is top-down recursion with caching. Tabulation is bottom-up iteration building a table."
      },
      {
        question: "How does DP differ from Divide and Conquer?",
        answer: "Divide and conquer splits problems into non-overlapping subproblems (like Merge Sort). DP deals with overlapping subproblems."
      },
      {
        question: "What is the classic 0/1 Knapsack problem?",
        answer: "A DP problem where you maximize total value without exceeding a weight limit, choosing to either include or exclude each item."
      },
      {
        question: "Explain the space optimization in the Fibonacci DP solution.",
        answer: "Instead of an array storing all N values, you only keep the last two computed values in variables, reducing space to O(1)."
      }
    ],
    practicalTask: {
      title: "Fibonacci with Tabulation",
      description: "Write an iterative DP solution for the Fibonacci sequence optimized for space.",
      solution: `function fib(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    let curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`
    }
  }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', 'The definitive guide.', topics)
  .then(() => console.log('DSA chapters 6-10 seeded successfully!'))
  .catch(err => console.error('Error seeding DSA topics:', err));
