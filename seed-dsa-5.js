import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'advanced-graph-algorithms',
    title: 'Advanced Graph Algorithms',
    order: 21,
    content: `### 1. Conceptual Overview
Advanced graph algorithms like Dijkstra's and Bellman-Ford solve the shortest path problem. They find the minimum distance from a source vertex to all other vertices.

### 2. Architecture & Mechanics
Dijkstra uses a greedy approach and a Priority Queue to always extend the shortest known path. Bellman-Ford iteratively relaxes all edges V-1 times, making it capable of handling negative weight edges.

### 3. Implementation: Standard vs Optimized
Standard Dijkstra uses an array for O(V^2), but optimized Dijkstra uses a Min-Heap for O(E log V). Bellman-Ford runs in O(V * E).

### 4. Trade-offs & Complexity
Dijkstra is faster but fails on negative weights. Bellman-Ford handles negative weights and detects negative cycles but is slower.`,
    interviewQuestions: [
      { question: "What is Dijkstra's algorithm?", answer: "A greedy algorithm to find shortest paths from a source to all other vertices in a graph with non-negative edge weights." },
      { question: "How does Bellman-Ford handle negative edges?", answer: "It relaxes all edges iteratively up to V-1 times, ensuring the shortest path is found even if negative edges exist." },
      { question: "What is a negative weight cycle?", answer: "A cycle in a graph where the sum of edge weights is negative, causing shortest path distances to potentially diverge to negative infinity." },
      { question: "Can Dijkstra handle negative weights?", answer: "No, Dijkstra assumes that once a node is visited, its shortest distance is finalized, which negative weights can violate." },
      { question: "Time complexity of optimized Dijkstra?", answer: "O(E log V) using a priority queue or min-heap." }
    ],
    practicalTask: {
      scenario: "You need to find the shortest delivery routes from a warehouse.",
      task: "Implement Dijkstra's algorithm.",
      solutionCode: "function dijkstra(graph, start) { /* Implementation */ }"
    }
  },
  {
    slug: 'minimum-spanning-trees',
    title: 'Minimum Spanning Trees',
    order: 22,
    content: `### 1. Conceptual Overview
A Minimum Spanning Tree (MST) is a subset of edges in a connected, edge-weighted graph that connects all vertices without any cycles and with the minimum possible total edge weight.

### 2. Architecture & Mechanics
Kruskal's algorithm sorts edges and adds them sequentially using Union-Find to avoid cycles. Prim's algorithm starts from a node and greedily adds the smallest edge connecting the tree to a new vertex.

### 3. Implementation: Standard vs Optimized
Kruskal relies heavily on an efficient Union-Find (Disjoint Set) with path compression. Prim relies on a Priority Queue to efficiently fetch the minimum weight edge.

### 4. Trade-offs & Complexity
Kruskal is O(E log E) due to sorting, making it great for sparse graphs. Prim is O(E log V) with a Min-Heap, typically better for dense graphs.`,
    interviewQuestions: [
      { question: "What is an MST?", answer: "A spanning tree with the minimum possible total edge weight." },
      { question: "Explain Kruskal's algorithm.", answer: "It sorts all edges by weight and adds them to the MST, skipping edges that form cycles." },
      { question: "Explain Prim's algorithm.", answer: "It builds the MST by starting with a single vertex and continually adding the smallest edge connecting the tree to an unvisited vertex." },
      { question: "What data structure does Kruskal use?", answer: "Union-Find (Disjoint Set) to detect cycles." },
      { question: "When would you prefer Prim over Kruskal?", answer: "Prim is often preferred for dense graphs when implemented with an Adjacency Matrix or Min-Heap." }
    ],
    practicalTask: {
      scenario: "You need to lay out network cables connecting several buildings with minimum cost.",
      task: "Implement Kruskal's algorithm to find the MST.",
      solutionCode: "function kruskal(graph) { /* Implementation */ }"
    }
  },
  {
    slug: 'trie-data-structure',
    title: 'Trie Data Structure',
    order: 23,
    content: `### 1. Conceptual Overview
A Trie (Prefix Tree) is a tree-like data structure that proves to be highly efficient for solving problems related to strings, particularly prefix matching.

### 2. Architecture & Mechanics
Each node represents a character. Paths down the tree represent words. A boolean flag usually indicates the end of a valid word.

### 3. Implementation: Standard vs Optimized
Standard implementation uses an array of size 26 (for lowercase English letters) or a Hash Map mapping characters to child nodes. Hash Maps save memory but have overhead.

### 4. Trade-offs & Complexity
Search and insertion take O(L) time where L is the word length. Memory footprint can be large, but it's exceptionally fast compared to Hash Tables for prefix queries.`,
    interviewQuestions: [
      { question: "What is a Trie?", answer: "A tree data structure used for efficient retrieval of a key in a large dataset of strings." },
      { question: "What is the time complexity of searching in a Trie?", answer: "O(L), where L is the length of the string." },
      { question: "How does a Trie compare to a Hash Map?", answer: "Tries use less space if many words share prefixes and allow efficient prefix matching, unlike Hash Maps." },
      { question: "How do you represent a Trie node?", answer: "Using an array of pointers (children) or a hash map mapping characters to Trie nodes, plus an isEndOfWord boolean." },
      { question: "What are common use cases for Tries?", answer: "Autocomplete, spell checking, and IP routing (Longest Prefix Match)." }
    ],
    practicalTask: {
      scenario: "You are building a search engine autocomplete feature.",
      task: "Implement a Trie with insert and startsWith methods.",
      solutionCode: "class Trie { /* Implementation */ }"
    }
  },
  {
    slug: 'disjoint-set-union-find',
    title: 'Disjoint Set (Union-Find)',
    order: 24,
    content: `### 1. Conceptual Overview
A Disjoint Set, or Union-Find data structure, keeps track of a set of elements partitioned into a number of disjoint (non-overlapping) subsets.

### 2. Architecture & Mechanics
It supports two primary operations: Find (determine which subset an element is in) and Union (join two subsets into a single subset).

### 3. Implementation: Standard vs Optimized
Standard implementations use an array to store parent pointers. Optimizations include 'Path Compression' (flattening the tree during Find) and 'Union by Rank/Size' (attaching the smaller tree to the root of the larger tree).

### 4. Trade-offs & Complexity
With both path compression and union by rank, operations take nearly O(1) amortized time, specifically O(α(N)), where α is the inverse Ackermann function.`,
    interviewQuestions: [
      { question: "What is Union-Find?", answer: "A data structure that tracks elements partitioned into disjoint sets." },
      { question: "What is Path Compression?", answer: "An optimization that flattens the tree structure during Find operations, making future queries faster." },
      { question: "What is Union by Rank?", answer: "An optimization that attaches the shorter tree under the root of the taller tree during a Union." },
      { question: "What is the time complexity of Union-Find operations?", answer: "O(α(n)), nearly constant time with path compression and union by rank." },
      { question: "When do you use Union-Find?", answer: "To detect cycles in undirected graphs or to find connected components." }
    ],
    practicalTask: {
      scenario: "You have a list of connections between people on a social network.",
      task: "Use Union-Find to determine the number of connected components.",
      solutionCode: "class UnionFind { /* Implementation */ }"
    }
  },
  {
    slug: 'segment-trees-fenwick',
    title: 'Segment Trees & Fenwick Trees',
    order: 25,
    content: `### 1. Conceptual Overview
Segment Trees and Fenwick Trees (Binary Indexed Trees) are advanced data structures used to perform range queries and updates on an array efficiently.

### 2. Architecture & Mechanics
Segment Trees represent intervals recursively in a binary tree structure. Fenwick Trees use the binary representation of indices to store partial sums in an array.

### 3. Implementation: Standard vs Optimized
Segment Trees are usually implemented using arrays and take O(N) to build. Fenwick Trees are shorter to implement and use less memory but are mainly limited to invertible operations like addition.

### 4. Trade-offs & Complexity
Both support updates and queries in O(log N). Segment Trees are more flexible (e.g., Range Minimum Query), while Fenwick Trees have smaller constants and use less space.`,
    interviewQuestions: [
      { question: "What is a Segment Tree?", answer: "A tree data structure for storing intervals, allowing querying and updating array intervals in O(log N)." },
      { question: "What is a Fenwick Tree?", answer: "Also known as a Binary Indexed Tree, it efficiently updates elements and calculates prefix sums in an array of numbers." },
      { question: "Time complexity for range queries in a Segment Tree?", answer: "O(log N)." },
      { question: "Why choose Fenwick over Segment Tree?", answer: "Fenwick Trees are easier to code, use less memory, and have smaller constant factors, though they are less versatile." },
      { question: "Can a Fenwick Tree handle Range Minimum Queries?", answer: "Generally no, because the minimum operation is not invertible like addition." }
    ],
    practicalTask: {
      scenario: "You need to frequently update elements and query the sum of a range in an array.",
      task: "Implement a Fenwick Tree (Binary Indexed Tree) for prefix sums.",
      solutionCode: "class FenwickTree { /* Implementation */ }"
    }
  }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', 'Comprehensive guide to advanced data structures and algorithms.', topics);
