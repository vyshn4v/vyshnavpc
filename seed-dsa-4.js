import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "bit-manipulation",
    title: "Bit Manipulation",
    order: 16,
    content: `### 1. Conceptual Overview
Bit manipulation is the act of algorithmically manipulating bits or other pieces of data shorter than a word. It involves operating directly on binary representations of numbers using bitwise operators.

### 2. Architecture & Mechanics
Modern computers store data in binary. Bitwise operators like AND (&), OR (|), XOR (^), NOT (~), and bit shifts (<<, >>) manipulate these bits. It allows for extremely fast and low-level arithmetic and logic operations.

### 3. Implementation: Standard vs Optimized
Instead of using standard arithmetic like multiplication or division by 2, bit shifting (<< 1 or >> 1) is a highly optimized way to perform these operations at the processor level. Finding powers of 2 or checking if a number is even can be done in O(1) time.

### 4. Trade-offs & Complexity
Bit manipulation is incredibly fast and memory efficient (often O(1) time and space). However, the code can be difficult to read and maintain for those unfamiliar with bitwise operations.`,
    interviewQuestions: [
      { question: "How do you check if a number is even or odd using bitwise operators?", answer: "Use the bitwise AND operator: (n & 1). If the result is 1, it's odd. If 0, it's even." },
      { question: "How do you check if a number is a power of 2?", answer: "Use the expression (n > 0) && ((n & (n - 1)) === 0)." },
      { question: "What does the XOR operator (^) do?", answer: "It returns 1 if the corresponding bits of its operands are different, and 0 if they are the same. It's useful for finding a non-repeating element in an array." },
      { question: "How do you multiply a number by 2 using bit manipulation?", answer: "Use a left shift operator: n << 1." },
      { question: "What is a bitmask?", answer: "A bitmask is data that is used for bitwise operations, particularly in a bit field to enable, disable, or toggle certain bits." }
    ],
    practicalTask: {
      scenario: "Find the single non-repeating number in an array where every other number repeats exactly twice.",
      task: "Implement a function using bit manipulation to find the single number.",
      solutionCode: `function singleNumber(nums) {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result ^= nums[i];
  }
  return result;
}`
    }
  },
  {
    slug: "disjoint-set-union",
    title: "Disjoint Set Union (Union-Find)",
    order: 17,
    content: `### 1. Conceptual Overview
A Disjoint Set (or Union-Find) is a data structure that keeps track of a set of elements partitioned into a number of disjoint (non-overlapping) subsets. It is heavily used in network connectivity and graph cycle detection.

### 2. Architecture & Mechanics
It provides two main operations: Find (determines which subset a particular element is in) and Union (joins two subsets into a single subset). It represents sets as trees, where each node points to its parent.

### 3. Implementation: Standard vs Optimized
The standard implementation uses arrays for parent pointers. However, to prevent tree imbalance, we use two optimizations: Path Compression (flattening the tree during Find) and Union by Rank/Size (attaching the smaller tree under the root of the larger tree).

### 4. Trade-offs & Complexity
With Path Compression and Union by Rank, the amortized time complexity of both operations is almost O(1) (specifically, the inverse Ackermann function α(n)). It requires O(n) space to store the parent and rank arrays.`,
    interviewQuestions: [
      { question: "What is the primary use case of a Disjoint Set?", answer: "To efficiently keep track of partitions of a set into disjoint subsets, especially useful in Kruskal's algorithm and cycle detection." },
      { question: "Explain Path Compression.", answer: "During the Find operation, it makes every node on the path point directly to the root, drastically speeding up future operations." },
      { question: "Explain Union by Rank.", answer: "During the Union operation, the tree with smaller depth (rank) is attached to the root of the tree with larger depth to keep the overall tree flat." },
      { question: "What is the time complexity of optimized Union-Find?", answer: "Amortized O(α(N)), where α is the inverse Ackermann function, effectively O(1) for all practical values of N." },
      { question: "Can Union-Find be used on directed graphs for cycle detection?", answer: "Standard Union-Find is primarily used for undirected graphs. For directed graphs, DFS is more appropriate." }
    ],
    practicalTask: {
      scenario: "Determine if adding an edge to a graph creates a cycle.",
      task: "Implement a basic Union-Find data structure to detect a cycle in an undirected graph.",
      solutionCode: `class UnionFind {
  constructor(size) {
    this.parent = new Array(size).fill(0).map((_, i) => i);
    this.rank = new Array(size).fill(1);
  }

  find(x) {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x, y) {
    let rootX = this.find(x);
    let rootY = this.find(y);

    if (rootX !== rootY) {
      if (this.rank[rootX] > this.rank[rootY]) {
        this.parent[rootY] = rootX;
      } else if (this.rank[rootX] < this.rank[rootY]) {
        this.parent[rootX] = rootY;
      } else {
        this.parent[rootY] = rootX;
        this.rank[rootX] += 1;
      }
      return true; // successful union
    }
    return false; // cycle detected
  }
}`
    }
  },
  {
    slug: "segment-trees",
    title: "Segment Trees",
    order: 18,
    content: `### 1. Conceptual Overview
A Segment Tree is a versatile data structure used for storing information about intervals, or segments. It allows querying which of the stored segments contain a given point, and answering range queries over an array efficiently.

### 2. Architecture & Mechanics
It is built as a binary tree where each node represents an interval. The root represents the whole array, and its children represent the left and right halves. Leaves represent individual elements. It supports both point updates and range queries.

### 3. Implementation: Standard vs Optimized
Implemented using an array of size 4N to store the tree to prevent out-of-bounds errors for an array of size N. Construction takes O(N), while updates and queries rely on dividing the range dynamically. Lazy Propagation is an optimization used for efficient range updates.

### 4. Trade-offs & Complexity
Segment Trees perform range queries (like sum, min, max) and point updates in O(log N) time. However, they are memory-intensive, requiring O(N) space, specifically an array roughly 4 times the size of the input.`,
    interviewQuestions: [
      { question: "What problems do Segment Trees solve?", answer: "They efficiently answer range queries (sum, min, max) and point/range updates in O(log N) time." },
      { question: "How much space does a Segment Tree require?", answer: "Typically, an array of size 4N is allocated to safely construct a segment tree for an array of N elements." },
      { question: "What is Lazy Propagation?", answer: "An optimization technique where we delay updates to child nodes until they are actually needed, allowing range updates in O(log N) time." },
      { question: "Difference between Segment Trees and Fenwick Trees (BIT)?", answer: "Fenwick Trees are easier to code and use less space (O(N)), but Segment Trees are more flexible and support a wider variety of queries (like Range Minimum)." },
      { question: "What is the time complexity to build a Segment Tree?", answer: "O(N) time to construct the initial tree from an array." }
    ],
    practicalTask: {
      scenario: "Quickly compute the sum of an array within a specific range and update elements dynamically.",
      task: "Implement a Segment Tree for range sum queries and point updates.",
      solutionCode: `class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0);
    this.build(arr, 0, 0, this.n - 1);
  }

  build(arr, node, start, end) {
    if (start === end) {
      this.tree[node] = arr[start];
    } else {
      let mid = Math.floor((start + end) / 2);
      this.build(arr, 2 * node + 1, start, mid);
      this.build(arr, 2 * node + 2, mid + 1, end);
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }

  update(node, start, end, idx, val) {
    if (start === end) {
      this.tree[node] = val;
    } else {
      let mid = Math.floor((start + end) / 2);
      if (start <= idx && idx <= mid) {
        this.update(2 * node + 1, start, mid, idx, val);
      } else {
        this.update(2 * node + 2, mid + 1, end, idx, val);
      }
      this.tree[node] = this.tree[2 * node + 1] + this.tree[2 * node + 2];
    }
  }

  query(node, start, end, l, r) {
    if (r < start || end < l) return 0;
    if (l <= start && end <= r) return this.tree[node];
    let mid = Math.floor((start + end) / 2);
    let p1 = this.query(2 * node + 1, start, mid, l, r);
    let p2 = this.query(2 * node + 2, mid + 1, end, l, r);
    return p1 + p2;
  }
}`
    }
  },
  {
    slug: "topological-sort",
    title: "Topological Sort",
    order: 19,
    content: `### 1. Conceptual Overview
Topological sorting is a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v in the ordering. It is widely used in scheduling tasks with dependencies.

### 2. Architecture & Mechanics
It can only be applied to a DAG. If the graph contains a cycle, no linear ordering is possible. The classic approaches are Depth-First Search (DFS) based or Kahn's Algorithm (BFS based).

### 3. Implementation: Standard vs Optimized
Kahn's Algorithm uses an array to track in-degrees of nodes. Nodes with an in-degree of 0 are pushed to a queue. As nodes are processed, we simulate edge removal by decrementing the in-degrees of their neighbors. The DFS approach pushes a node to a stack only after all its descendants have been visited.

### 4. Trade-offs & Complexity
Both Kahn’s and DFS methods run in O(V + E) time and O(V) space. Kahn's algorithm has a slight advantage in practice because it is iterative and intrinsically detects cycles during execution (if the final sorted list size is less than V, a cycle exists).`,
    interviewQuestions: [
      { question: "What type of graph is required for Topological Sorting?", answer: "A Directed Acyclic Graph (DAG)." },
      { question: "What is an in-degree?", answer: "The number of incoming directed edges to a specific vertex in a graph." },
      { question: "How does Kahn's algorithm detect cycles?", answer: "If the number of processed elements in the topological sort is less than the total number of vertices in the graph, a cycle exists." },
      { question: "What are practical applications of topological sorting?", answer: "Build systems (like Make or npm), course prerequisite planning, and task scheduling." },
      { question: "Can a graph have multiple valid topological sorts?", answer: "Yes, if there are no direct dependencies between certain tasks, their order relative to each other doesn't matter, leading to multiple valid linear orderings." }
    ],
    practicalTask: {
      scenario: "You have a list of courses and their prerequisites. Determine if it is possible to finish all courses.",
      task: "Implement topological sorting using Kahn's Algorithm to check for cycles.",
      solutionCode: `function canFinish(numCourses, prerequisites) {
  let inDegree = new Array(numCourses).fill(0);
  let adjList = Array.from({ length: numCourses }, () => []);

  for (let [course, pre] of prerequisites) {
    adjList[pre].push(course);
    inDegree[course]++;
  }

  let queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  let count = 0;
  while (queue.length > 0) {
    let curr = queue.shift();
    count++;

    for (let neighbor of adjList[curr]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return count === numCourses;
}`
    }
  },
  {
    slug: "advanced-string-algorithms",
    title: "Advanced String Algorithms",
    order: 20,
    content: `### 1. Conceptual Overview
Advanced string algorithms deal with complex string operations, primarily pattern matching. Classic algorithms include the Knuth-Morris-Pratt (KMP) algorithm and the Rabin-Karp algorithm, which solve the substring search problem efficiently.

### 2. Architecture & Mechanics
KMP avoids redundant comparisons by precomputing a Longest Prefix Suffix (LPS) array, which dictates how much to shift the pattern on a mismatch. Rabin-Karp uses a rolling hash to compare string segments in constant time, sliding a window across the text.

### 3. Implementation: Standard vs Optimized
Standard brute-force substring matching requires resetting pointers heavily. KMP optimizes this by keeping the text pointer moving forward only. Rabin-Karp optimizes by updating a hash mathematically instead of recalculating the entire string hash from scratch (Rolling Hash).

### 4. Trade-offs & Complexity
Brute-force takes O(N * M) time. KMP and Rabin-Karp both improve this. KMP guarantees O(N + M) worst-case time but is slightly complex to implement. Rabin-Karp offers O(N + M) average time but can degrade to O(N * M) in the worst case due to hash collisions.`,
    interviewQuestions: [
      { question: "What is the time complexity of the KMP algorithm?", answer: "O(N + M), where N is the length of the text and M is the length of the pattern." },
      { question: "What is the LPS array in KMP?", answer: "It stores the length of the Longest Proper Prefix which is also a Suffix for each substring of the pattern." },
      { question: "How does the Rabin-Karp algorithm work?", answer: "It computes a hash for the pattern and then uses a sliding window (rolling hash) to compute hashes of text substrings for quick comparison." },
      { question: "What is a Rolling Hash?", answer: "A hash function where the hash of a sliding window can be computed efficiently by reusing the hash of the previous window." },
      { question: "When would you prefer Rabin-Karp over KMP?", answer: "When searching for multiple patterns simultaneously (like in plagiarism detection), Rabin-Karp's hashing mechanism scales better." }
    ],
    practicalTask: {
      scenario: "Search for a specific word inside a large document efficiently without backtracking the document pointer.",
      task: "Implement the KMP algorithm to find the starting index of a pattern in a string.",
      solutionCode: `function KMP(text, pattern) {
  if (pattern.length === 0) return 0;
  
  let lps = new Array(pattern.length).fill(0);
  let prevLPS = 0;
  let i = 1;
  
  while (i < pattern.length) {
    if (pattern[i] === pattern[prevLPS]) {
      lps[i] = prevLPS + 1;
      prevLPS++;
      i++;
    } else if (prevLPS === 0) {
      lps[i] = 0;
      i++;
    } else {
      prevLPS = lps[prevLPS - 1];
    }
  }
  
  i = 0; // ptr for text
  let j = 0; // ptr for pattern
  while (i < text.length) {
    if (text[i] === pattern[j]) {
      i++; j++;
    } else {
      if (j === 0) i++;
      else j = lps[j - 1];
    }
    if (j === pattern.length) return i - pattern.length;
  }
  return -1;
}`
    }
  }
];

appendTopics(
  'dsa',
  'Data Structures & Algorithms Masterclass',
  'Master the fundamental concepts, algorithms, and data structures crucial for coding interviews and software engineering.',
  topics
).catch(err => console.error(err));
