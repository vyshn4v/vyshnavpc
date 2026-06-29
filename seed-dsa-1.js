import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    title: "1. Arrays & Strings",
    slug: "arrays-and-strings",
    description: "Deep dive into array manipulation, strings, and the sliding window technique.",
    order: 1,
    content: `
### 1. Conceptual Overview
Arrays and Strings are foundational data structures. Arrays store elements contiguously in memory, enabling O(1) access. Strings are often implemented as immutable arrays of characters.

### 2. Architecture & Mechanics
Understanding memory allocation, dynamic resizing (for ArrayLists/Vectors), and character encodings.

### 3. Implementation: Standard vs Optimized
Standard implementation using basic loops vs optimized approaches using Two Pointers or Sliding Window techniques.

### 4. Trade-offs & Complexity
Time Complexity: O(1) access, O(n) search/insertion/deletion. Space Complexity: O(n).
`,
    interviewQuestions: [
      { question: "Reverse a string in-place.", answer: "Use two pointers starting at both ends." },
      { question: "Find the longest substring without repeating characters.", answer: "Use a sliding window." },
      { question: "Implement an ArrayList from scratch.", answer: "Allocate a fixed array and resize it by a factor when full." },
      { question: "Check if two strings are anagrams.", answer: "Use a frequency map or sort the strings." },
      { question: "Find the maximum subarray sum.", answer: "Use Kadane's Algorithm." }
    ],
    practicalTask: {
      title: "Build a Text Editor Buffer",
      description: "Implement a gap buffer to efficiently insert and delete text at the cursor."
    }
  },
  {
    title: "2. Linked Lists",
    slug: "linked-lists",
    description: "Understanding singly, doubly, and circular linked lists.",
    order: 2,
    content: `
### 1. Conceptual Overview
A Linked List is a linear collection of data elements whose order is not given by their physical placement in memory. Instead, each element points to the next.

### 2. Architecture & Mechanics
Nodes containing data and next (and optionally prev) pointers. Understanding dummy heads and tail pointers.

### 3. Implementation: Standard vs Optimized
Basic traversal and manipulation vs techniques like Fast & Slow Pointers (Floyd's Cycle-Finding Algorithm).

### 4. Trade-offs & Complexity
Time Complexity: O(n) access/search, O(1) insertion/deletion at a known node. Space Complexity: O(n) for pointers.
`,
    interviewQuestions: [
      { question: "Reverse a linked list.", answer: "Iterate and change next pointers to previous nodes." },
      { question: "Detect a cycle in a linked list.", answer: "Use fast and slow pointers." },
      { question: "Merge two sorted linked lists.", answer: "Iterate through both using a dummy head." },
      { question: "Find the middle of a linked list.", answer: "Use fast and slow pointers." },
      { question: "Remove the Nth node from the end.", answer: "Use two pointers separated by N steps." }
    ],
    practicalTask: {
      title: "Implement an LRU Cache",
      description: "Use a Doubly Linked List with a HashMap to implement a Least Recently Used Cache."
    }
  },
  {
    title: "3. Stacks & Queues",
    slug: "stacks-and-queues",
    description: "LIFO and FIFO data structures and their applications.",
    order: 3,
    content: `
### 1. Conceptual Overview
Stacks follow Last-In-First-Out (LIFO). Queues follow First-In-First-Out (FIFO). Both can be implemented using arrays or linked lists.

### 2. Architecture & Mechanics
Push/Pop for Stacks, Enqueue/Dequeue for Queues. Circular queues to reuse array space.

### 3. Implementation: Standard vs Optimized
Array-based vs Linked-list based. Monotonic stacks/queues for range queries.

### 4. Trade-offs & Complexity
Time: O(1) for push/pop/enqueue/dequeue. Space: O(n). Array-based has better cache locality but may need resizing.
`,
    interviewQuestions: [
      { question: "Implement a Queue using Stacks.", answer: "Use two stacks, transferring elements when dequeueing." },
      { question: "Valid Parentheses.", answer: "Use a stack to keep track of opening brackets." },
      { question: "Evaluate Reverse Polish Notation.", answer: "Use a stack for operands." },
      { question: "Implement a Min Stack.", answer: "Keep an auxiliary stack of minimums." },
      { question: "Daily Temperatures.", answer: "Use a monotonic decreasing stack." }
    ],
    practicalTask: {
      title: "Browser History Manager",
      description: "Implement a backward and forward navigation history using two stacks."
    }
  },
  {
    title: "4. Trees & Graphs",
    slug: "trees-and-graphs",
    description: "Hierarchical data structures and complex network topologies.",
    order: 4,
    content: `
### 1. Conceptual Overview
Trees are hierarchical graphs without cycles. Graphs are networks of nodes (vertices) connected by edges.

### 2. Architecture & Mechanics
Binary Trees, BSTs, Heaps, Tries. Adjacency lists vs Adjacency matrices for graphs.

### 3. Implementation: Standard vs Optimized
DFS (recursive/iterative) and BFS. Optimized pathfinding like Dijkstra's or A*. Disjoint Set Union (Union-Find) for connectivity.

### 4. Trade-offs & Complexity
Tree traversals: O(V). Graph BFS/DFS: O(V+E). Adjacency list saves space for sparse graphs.
`,
    interviewQuestions: [
      { question: "Invert a Binary Tree.", answer: "Recursively swap left and right children." },
      { question: "Validate a BST.", answer: "Traverse keeping a min and max boundary." },
      { question: "Number of Islands.", answer: "Use BFS or DFS to explore connected land components." },
      { question: "Clone a Graph.", answer: "Use a hash map to keep track of visited nodes and their clones." },
      { question: "Course Schedule.", answer: "Use Topological Sort to detect cycles in a directed graph." }
    ],
    practicalTask: {
      title: "Build a Web Crawler",
      description: "Implement a BFS-based multi-threaded web crawler that finds reachable links without cycles."
    }
  },
  {
    title: "5. Dynamic Programming",
    slug: "dynamic-programming",
    description: "Solving complex problems by breaking them down into simpler subproblems.",
    order: 5,
    content: `
### 1. Conceptual Overview
Dynamic Programming involves overlapping subproblems and optimal substructure. 

### 2. Architecture & Mechanics
Top-Down (Memoization) vs Bottom-Up (Tabulation). State representation and state transitions.

### 3. Implementation: Standard vs Optimized
Standard tabulation using 2D arrays vs optimizing space complexity by keeping only necessary previous states (e.g., 1D arrays or variables).

### 4. Trade-offs & Complexity
Time Complexity typically depends on the number of states * transitions. Space Complexity can often be optimized from O(N^2) to O(N).
`,
    interviewQuestions: [
      { question: "Climbing Stairs.", answer: "Bottom-up sum of previous two steps (Fibonacci)." },
      { question: "Coin Change.", answer: "DP array storing minimum coins for each amount." },
      { question: "Longest Increasing Subsequence.", answer: "O(n^2) DP or O(n log n) with binary search." },
      { question: "0/1 Knapsack Problem.", answer: "2D DP or 1D DP iterating backwards." },
      { question: "Edit Distance.", answer: "2D DP matching characters or substituting/inserting/deleting." }
    ],
    practicalTask: {
      title: "Text Justification Engine",
      description: "Use DP to calculate the minimum cost (uneven spaces) to split words into lines of a given width."
    }
  }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', 'Mastering the core fundamentals of computer science.', topics)
  .then(() => {
    console.log('Successfully seeded DSA topics!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
