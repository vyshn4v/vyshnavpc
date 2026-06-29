import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "graphs",
    title: "Graphs & Graph Algorithms",
    order: 11,
    content: `### 1. Conceptual Overview
A Graph is a non-linear data structure consisting of nodes (vertices) and edges that connect them. Graphs are used to represent networks like social networks, city roads, etc.

### 2. Architecture & Mechanics
Graphs can be directed or undirected, weighted or unweighted. They can be represented using an Adjacency Matrix or an Adjacency List. Algorithms like Breadth-First Search (BFS) and Depth-First Search (DFS) are used to traverse them.

### 3. Implementation: Standard vs Optimized
Standard implementation often uses an adjacency list with a Map or Object in JavaScript for sparse graphs, which saves space compared to an adjacency matrix.

### 4. Trade-offs & Complexity
- Adjacency Matrix: Space O(V^2), edge lookup O(1).
- Adjacency List: Space O(V + E), edge lookup O(V).`,
    interviewQuestions: [
      { question: "What is a graph?", answer: "A non-linear data structure with nodes and edges." },
      { question: "Difference between BFS and DFS?", answer: "BFS explores level by level (uses Queue); DFS explores deeply along a branch before backtracking (uses Stack/Recursion)." },
      { question: "What is a bipartite graph?", answer: "A graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other." },
      { question: "How to detect a cycle in a directed graph?", answer: "Use DFS and keep track of visited nodes and nodes currently in the recursion stack." },
      { question: "What is Dijkstra's Algorithm?", answer: "An algorithm for finding the shortest paths between nodes in a graph with non-negative edge weights." }
    ],
    practicalTask: {
      scenario: "You need to find the shortest path in an unweighted social network graph.",
      task: "Implement BFS to find the shortest path from start to end node.",
      solutionCode: `function shortestPath(graph, start, end) {
  let queue = [[start]];
  let visited = new Set([start]);
  
  while(queue.length > 0) {
    let path = queue.shift();
    let node = path[path.length - 1];
    
    if(node === end) return path;
    
    for(let neighbor of graph[node]) {
      if(!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  return null;
}`
    }
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    order: 12,
    content: `### 1. Conceptual Overview
Dynamic Programming (DP) is an algorithmic technique for solving an optimization problem by breaking it down into simpler subproblems and utilizing the fact that the optimal solution to the overall problem depends upon the optimal solution to its subproblems.

### 2. Architecture & Mechanics
It typically involves identifying repeated subproblems, memoizing or tabulating their results, and building the solution bottom-up (tabulation) or top-down (memoization).

### 3. Implementation: Standard vs Optimized
Standard recursive solutions often have exponential time complexity. An optimized DP approach stores intermediate results to achieve polynomial time complexity. Space can often be further optimized in tabulation by keeping only necessary previous states.

### 4. Trade-offs & Complexity
DP greatly improves time complexity (e.g., O(2^n) to O(n) for Fibonacci) but can consume O(n) or O(n^2) auxiliary space.`,
    interviewQuestions: [
      { question: "What is the difference between Memoization and Tabulation?", answer: "Memoization is top-down (recursive with caching), Tabulation is bottom-up (iterative state building)." },
      { question: "When should you use DP?", answer: "When problems have overlapping subproblems and optimal substructure." },
      { question: "Explain the Knapsack problem.", answer: "A classic DP problem maximizing the total value of items placed in a knapsack of limited capacity." },
      { question: "Can all recursive problems be optimized with DP?", answer: "No, only those with overlapping subproblems." },
      { question: "What is Space Optimization in DP?", answer: "Reducing the O(n) space of tabulation to O(1) by only storing the immediately required previous states (e.g., last two values for Fibonacci)." }
    ],
    practicalTask: {
      scenario: "Calculate the nth Fibonacci number efficiently.",
      task: "Implement the Fibonacci sequence using DP (bottom-up space-optimized).",
      solutionCode: `function fib(n) {
  if(n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for(let i = 2; i <= n; i++) {
    let curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}`
    }
  },
  {
    slug: "greedy-algorithms",
    title: "Greedy Algorithms",
    order: 13,
    content: `### 1. Conceptual Overview
A greedy algorithm is a paradigm that builds up a solution piece by piece, always choosing the next piece that offers the most obvious and immediate benefit.

### 2. Architecture & Mechanics
It makes a locally optimal choice at each stage with the hope of finding a global optimum. However, greedy algorithms do not always yield the globally optimal solution.

### 3. Implementation: Standard vs Optimized
Usually involves sorting the input data based on some criteria (e.g., profit/weight ratio) and then iterating through to make choices.

### 4. Trade-offs & Complexity
Time complexity is often dominated by sorting, typically O(N log N). While generally faster and easier to conceptualize than DP, it only works if the problem exhibits the greedy-choice property.`,
    interviewQuestions: [
      { question: "What is the greedy-choice property?", answer: "The property that a global optimum can be arrived at by selecting a local optimum." },
      { question: "Difference between Greedy and DP?", answer: "Greedy makes local optimal choices without revisiting, DP solves subproblems exhaustively and combines them." },
      { question: "Give an example of a greedy algorithm.", answer: "Dijkstra's shortest path, Kruskal's MST, or fractional knapsack." },
      { question: "Does the greedy approach always work?", answer: "No, e.g., it fails on the 0-1 Knapsack problem." },
      { question: "What is the Fractional Knapsack problem?", answer: "A greedy problem where items can be broken down to maximize value per unit weight." }
    ],
    practicalTask: {
      scenario: "Give change using the fewest number of coins.",
      task: "Implement a greedy approach for coin change (assuming standard denominations).",
      solutionCode: `function coinChange(coins, amount) {
  coins.sort((a, b) => b - a);
  let count = 0;
  for (let coin of coins) {
    if (amount === 0) break;
    count += Math.floor(amount / coin);
    amount %= coin;
  }
  return amount === 0 ? count : -1;
}`
    }
  },
  {
    slug: "backtracking",
    title: "Backtracking",
    order: 14,
    content: `### 1. Conceptual Overview
Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints.

### 2. Architecture & Mechanics
It uses depth-first search to explore all potential solutions. When a partial solution cannot be completed to a valid solution, it 'backtracks' (undoes the last step) and tries another path.

### 3. Implementation: Standard vs Optimized
Usually implemented via recursion. Optimization involves 'pruning' the state space tree—stopping the exploration of paths that are guaranteed to be invalid early on.

### 4. Trade-offs & Complexity
Time complexity is often exponential (O(2^N) or O(N!)), making it suitable only for small input sizes. However, it guarantees finding all possible valid solutions.`,
    interviewQuestions: [
      { question: "What is backtracking?", answer: "A methodical way of trying out various sequences of decisions until you find one that works." },
      { question: "How does it differ from brute force?", answer: "Backtracking prunes branches that cannot possibly lead to a solution, saving time compared to naive brute force." },
      { question: "Name a classic backtracking problem.", answer: "N-Queens, Sudoku Solver, or generating permutations." },
      { question: "What is state space tree?", answer: "A tree representing all possible states (partial solutions) of a backtracking algorithm." },
      { question: "Why is time complexity usually exponential?", answer: "Because in the worst case, it might need to explore almost all possible configurations." }
    ],
    practicalTask: {
      scenario: "Generate all permutations of an array.",
      task: "Implement a backtracking function to return all permutations.",
      solutionCode: `function permute(nums) {
  let res = [];
  function backtrack(path, options) {
    if(options.length === 0) {
      res.push([...path]);
      return;
    }
    for(let i = 0; i < options.length; i++) {
      path.push(options[i]);
      let nextOptions = options.slice(0,i).concat(options.slice(i+1));
      backtrack(path, nextOptions);
      path.pop();
    }
  }
  backtrack([], nums);
  return res;
}`
    }
  },
  {
    slug: "tries",
    title: "Tries (Prefix Trees)",
    order: 15,
    content: `### 1. Conceptual Overview
A Trie is a tree-like data structure used to store a dynamic set or associative array where the keys are usually strings. It is highly efficient for prefix-based searches.

### 2. Architecture & Mechanics
Each node represents a single character. A path from the root to a node represents a prefix of the strings stored in the Trie. A boolean flag often marks the end of a complete word.

### 3. Implementation: Standard vs Optimized
Nodes are typically implemented with an array of children (e.g., 26 for English alphabet) or a Hash Map. Maps are more space-efficient if the character set is large and sparse.

### 4. Trade-offs & Complexity
Insertion and search time complexity is O(L), where L is the length of the word. While very fast for strings, Tries can consume a significant amount of memory compared to Hash Tables.`,
    interviewQuestions: [
      { question: "What is a Trie?", answer: "A specialized tree used for searching strings and prefixes efficiently." },
      { question: "What is the time complexity of searching in a Trie?", answer: "O(L) where L is the length of the string." },
      { question: "Trie vs Hash Table for string search?", answer: "Tries support prefix searching and alphabetical ordering natively, whereas Hash Tables do not, though Hash Tables are more memory efficient." },
      { question: "How to handle memory issues in Tries?", answer: "Use a compressed Trie (Radix Tree) or a Hash Map for child pointers." },
      { question: "What are common use cases?", answer: "Autocomplete, spell checking, and IP routing (Longest Prefix Match)." }
    ],
    practicalTask: {
      scenario: "Build an autocomplete engine backend structure.",
      task: "Implement a basic Trie with insert and search methods.",
      solutionCode: `class TrieNode {
  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  insert(word) {
    let node = this.root;
    for(let char of word) {
      if(!node.children[char]) node.children[char] = new TrieNode();
      node = node.children[char];
    }
    node.isWord = true;
  }
  search(word) {
    let node = this.root;
    for(let char of word) {
      if(!node.children[char]) return false;
      node = node.children[char];
    }
    return node.isWord;
  }
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
