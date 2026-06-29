import { appendTopics } from "./seeder-utils.js";

const topics = [
  {
    slug: "dsa-b-trees-and-b-plus-trees",
    title: "B-Trees and B+ Trees",
    order: 46,
    content: `### 1. Conceptual Overview
B-Trees and B+ Trees are self-balancing search trees specifically designed for systems that read and write large blocks of data. While BSTs are great for in-memory structures, B-Trees and B+ Trees minimize the number of disk accesses, making them ideal for database indexing.

### 2. Architecture & Mechanics
A B-Tree of order \`m\` can have up to \`m\` children and \`m-1\` keys per node. Every node (except the root) must be at least half full. B+ Trees are a variation where all data is stored only at the leaf nodes, while internal nodes store only keys to act as routing guides. The leaf nodes are typically linked together as a linked list, allowing fast sequential access.

### 3. Implementation: Standard vs Optimized
In a standard implementation, nodes hold arrays of keys and children pointers. Optimization heavily depends on the page size of the underlying disk architecture. 
\`\`\`javascript
class BTreeNode {
  constructor(leaf = false) {
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
  }
}
\`\`\`
Optimized implementations in real-world systems align node sizes strictly with 4KB or 8KB hardware pages.

### 4. Trade-offs & Complexity
- **Time Complexity:** Search, Insert, and Delete operate in \`O(log_m N)\` time.
- **Space Complexity:** \`O(N)\`.
- **Trade-offs:** B-Trees reduce disk I/O significantly compared to binary search trees at the cost of more complex implementation and higher memory overhead per node due to partially filled arrays.`,
    interviewQuestions: [
      {
        question: "Why do databases prefer B+ Trees over standard B-Trees?",
        answer: "B+ Trees store all actual data at the leaf nodes and link them together, allowing extremely fast range queries and sequential scans. Internal nodes can hold more keys since they do not store data, increasing the branching factor and reducing tree height."
      },
      {
        question: "What is the order of a B-Tree?",
        answer: "The order 'm' represents the maximum number of children a node can have. A node can have at most m-1 keys. The larger the order, the flatter the tree, minimizing disk reads."
      },
      {
        question: "How does splitting work in B-Tree insertion?",
        answer: "When a node overflows (reaches m keys), it splits into two nodes, and the median key is pushed up to the parent node. If the parent is full, the split propagates upwards, potentially creating a new root."
      },
      {
        question: "Compare B-Trees with Red-Black Trees.",
        answer: "Red-Black Trees are binary and better for in-memory operations. B-Trees are multi-way trees, optimized for disk operations by minimizing I/O operations through a large branching factor."
      },
      {
        question: "How are deletions handled in a B+ Tree?",
        answer: "Deletion in a B+ tree happens at the leaf. If underflow occurs (less than minimum required keys), the node either borrows from a sibling or merges with it. Keys in internal routing nodes may also need updating."
      }
    ],
    practicalTask: {
      scenario: "Database Engine Indexing",
      task: "Implement a simple B-Tree node split operation function for an in-memory database simulator.",
      solutionCode: `function splitChild(parent, index, child, t) {
  let newChild = new BTreeNode(child.leaf);
  // move half keys
  for (let i = 0; i < t - 1; i++) {
    newChild.keys.push(child.keys.pop());
  }
  // push median to parent
  parent.keys.splice(index, 0, child.keys.pop());
  parent.children.splice(index + 1, 0, newChild);
}`
    }
  },
  {
    slug: "dsa-advanced-graph-algorithms",
    title: "Advanced Graph Algorithms",
    order: 47,
    content: `### 1. Conceptual Overview
Beyond standard BFS/DFS and shortest paths, advanced graph algorithms tackle complex properties of graphs like connectivity, flow, and matching. Identifying Strongly Connected Components (SCCs), articulation points, and bridges helps analyze robust networks.

### 2. Architecture & Mechanics
Tarjan's and Kosaraju's algorithms find SCCs in directed graphs. Kosaraju's uses two DFS passes (one on the original, one on the reversed graph). Tarjan's uses a single DFS pass, maintaining a \`discovery time\` and a \`lowest reachable time\` along with a stack to identify components on the fly. 

### 3. Implementation: Standard vs Optimized
Kosaraju's is standard and easy to reason about but requires a graph reversal and an extra pass.
\`\`\`javascript
// Tarjan's low-link concept
let dfs_num = 0;
function dfs(u) {
  discovery[u] = low[u] = ++dfs_num;
  stack.push(u);
  // ... process neighbors ...
}
\`\`\`
Tarjan's algorithm optimizes the SCC discovery into a single DFS traversal, minimizing the overhead of data structure replication.

### 4. Trade-offs & Complexity
- **Time Complexity:** Both Tarjan's and Kosaraju's run in \`O(V + E)\`.
- **Space Complexity:** \`O(V)\` for the recursion stack and auxiliary arrays.
- **Trade-offs:** Tarjan's is faster in practice due to a single pass but its logic is harder to implement perfectly under pressure compared to Kosaraju's intuitive two-pass reverse strategy.`,
    interviewQuestions: [
      {
        question: "What is a Strongly Connected Component (SCC)?",
        answer: "A maximal subgraph in a directed graph where there is a path from any vertex to every other vertex in that subgraph."
      },
      {
        question: "Explain the difference between Kosaraju's and Tarjan's algorithm.",
        answer: "Kosaraju's requires two DFS passes and a transposed (reversed) graph. Tarjan's uses a single DFS pass and tracks low-link values using a stack."
      },
      {
        question: "What is an articulation point?",
        answer: "A vertex in an undirected graph whose removal increases the number of connected components. It acts as a single point of failure in a network."
      },
      {
        question: "How do you find a bridge in a graph?",
        answer: "A bridge can be found using DFS by keeping track of discovery times and low values. If a neighbor's low value is strictly greater than the current node's discovery time, the edge is a bridge."
      },
      {
        question: "When would you use an Eulerian Path algorithm?",
        answer: "When you need to find a trail in a finite graph that visits every edge exactly once, useful in routing, DNA sequencing, and circuit design."
      }
    ],
    practicalTask: {
      scenario: "Social Network Clusters",
      task: "Write the recursive DFS core for Tarjan's algorithm to update the 'low' value.",
      solutionCode: `function tarjanDFS(u, graph, disc, low, stack, onStack, time) {
  disc[u] = low[u] = ++time;
  stack.push(u);
  onStack[u] = true;

  for (let v of graph[u]) {
    if (!disc[v]) {
      tarjanDFS(v, graph, disc, low, stack, onStack, time);
      low[u] = Math.min(low[u], low[v]);
    } else if (onStack[v]) {
      low[u] = Math.min(low[u], disc[v]);
    }
  }
}`
    }
  },
  {
    slug: "dsa-segment-trees-fenwick",
    title: "Segment Trees & Fenwick Trees",
    order: 48,
    content: `### 1. Conceptual Overview
When dealing with array range queries (like sum, minimum, or maximum) and frequent point updates, recalculating takes \`O(N)\` and standard arrays are inefficient. Segment Trees and Fenwick Trees (Binary Indexed Trees) solve this by precomputing and dynamically updating aggregated values over intervals.

### 2. Architecture & Mechanics
A Segment Tree is a binary tree where each node represents an interval of the array. The root covers the whole array, and children split the interval in half. A Fenwick Tree uses the binary representation of indices to store partial sums, taking advantage of the Least Significant Bit (LSB) to jump between intervals.

### 3. Implementation: Standard vs Optimized
Segment trees are typically implemented using arrays (like a heap).
\`\`\`javascript
// Segment tree build
function build(node, start, end) {
  if (start === end) tree[node] = arr[start];
  else {
    let mid = Math.floor((start + end) / 2);
    build(2 * node, start, mid);
    build(2 * node + 1, mid + 1, end);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
  }
}
\`\`\`
Fenwick Trees are extremely optimized in code length and bitwise operations: \`index += index & (-index)\` is used to jump to the next interval.

### 4. Trade-offs & Complexity
- **Time Complexity:** Build Segment Tree \`O(N)\`, Query/Update \`O(log N)\`. Build Fenwick \`O(N log N)\`, Query/Update \`O(log N)\`.
- **Space Complexity:** Segment tree needs \`O(N)\` (often \`4N\`), Fenwick needs exactly \`O(N)\`.
- **Trade-offs:** Fenwick trees are much easier to code, consume less memory, and are strictly faster by a constant factor. However, Segment Trees are far more versatile (can handle range updates with lazy propagation, max/min queries) while Fenwick is mostly limited to reversible operations like prefix sums.`,
    interviewQuestions: [
      {
        question: "When should you prefer a Fenwick Tree over a Segment Tree?",
        answer: "When you only need to compute prefix sums (or reversible operations) with point updates. Fenwick trees use less memory and are easier to implement."
      },
      {
        question: "What is Lazy Propagation in a Segment Tree?",
        answer: "It is an optimization for range updates. Instead of updating all leaf nodes within a range immediately, you update the higher-level node and mark it as 'lazy', propagating the update downwards only when a future query demands it."
      },
      {
        question: "How does a Fenwick tree isolate the lowest set bit?",
        answer: "Using the two's complement bitwise operation: \`x & (-x)\` isolates the rightmost set bit of the integer x."
      },
      {
        question: "Can a Fenwick Tree be used for finding the range minimum?",
        answer: "Yes, but it is highly restricted and complex compared to a segment tree, because the minimum function is not cleanly invertible (unlike addition)."
      },
      {
        question: "What is the maximum size of the array needed for a Segment Tree?",
        answer: "If implemented as a flat array, the segment tree requires an array of size 4 * N, where N is the number of elements in the original array."
      }
    ],
    practicalTask: {
      scenario: "Real-time Dashboard Analytics",
      task: "Implement the add operation for a Fenwick tree (Binary Indexed Tree) to update frequencies.",
      solutionCode: `class FenwickTree {
  constructor(size) {
    this.tree = new Array(size + 1).fill(0);
  }
  
  add(i, delta) {
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += i & (-i); // Add least significant bit
    }
  }
}`
    }
  },
  {
    slug: "dsa-string-matching-algorithms",
    title: "String Matching Algorithms",
    order: 49,
    content: `### 1. Conceptual Overview
Finding a substring within a larger text is a fundamental computer science problem. While a naive search works, algorithms like KMP (Knuth-Morris-Pratt) and Rabin-Karp provide optimized ways to skip redundant character comparisons, heavily used in text editors, DNA sequence analysis, and search engines.

### 2. Architecture & Mechanics
Rabin-Karp uses a rolling hash. It computes the hash of the pattern, then rolls over the text, computing hashes of windows of the same length in \`O(1)\` time per shift. KMP relies on building an LPS (Longest Prefix Suffix) array. When a mismatch occurs, the LPS array tells the algorithm exactly how far to safely shift the pattern without re-evaluating matched characters.

### 3. Implementation: Standard vs Optimized
Naive takes \`O(N * M)\` where N is text length and M is pattern length.
\`\`\`javascript
// KMP LPS Array Generation
let len = 0; let i = 1;
lps[0] = 0;
while (i < M) {
  if (pat[i] === pat[len]) lps[i++] = ++len;
  else if (len !== 0) len = lps[len - 1];
  else lps[i++] = 0;
}
\`\`\`
Optimizations in Rabin-Karp involve choosing a robust prime modulus to avoid excessive hash collisions, maintaining the rolling hash seamlessly.

### 4. Trade-offs & Complexity
- **Time Complexity:** KMP is strictly \`O(N + M)\`. Rabin-Karp is \`O(N + M)\` average, but \`O(N * M)\` worst-case if hash collisions are frequent.
- **Space Complexity:** KMP requires \`O(M)\` for the LPS array. Rabin-Karp is \`O(1)\`.
- **Trade-offs:** KMP guarantees linear time but requires preprocessing space. Rabin-Karp is simpler to extend to 2D pattern matching or multiple patterns (via Bloom filters) but risks worst-case degradation on bad hashes.`,
    interviewQuestions: [
      {
        question: "Explain the purpose of the LPS array in KMP.",
        answer: "The LPS (Longest Prefix which is also Suffix) array dictates how many characters can be skipped when a mismatch occurs, preventing the algorithm from backtracking in the main text."
      },
      {
        question: "What is a rolling hash in Rabin-Karp?",
        answer: "A hash function designed so that the hash of the next window can be computed from the previous window's hash in O(1) time by removing the oldest character's influence and adding the new one."
      },
      {
        question: "Why might Rabin-Karp degrade to O(N * M)?",
        answer: "If the hash function produces many spurious hits (collisions), the algorithm must verify the match character by character, leading to O(M) work for each window."
      },
      {
        question: "When would you prefer Trie-based matching (Aho-Corasick) over KMP?",
        answer: "When searching for multiple patterns simultaneously in the same text. KMP is designed for single-pattern search."
      },
      {
        question: "How does the Z-Algorithm compare to KMP?",
        answer: "The Z-algorithm builds a Z-array representing lengths of the longest substring starting at \`i\` that matches the prefix. It operates in similar time/space complexity but is often considered more intuitive to construct than KMP's LPS array."
      }
    ],
    practicalTask: {
      scenario: "Plagiarism Checker",
      task: "Write a rolling hash update function for Rabin-Karp.",
      solutionCode: `function rollHash(oldHash, oldChar, newChar, windowLen, base, prime) {
  let newHash = (oldHash - oldChar.charCodeAt(0) * Math.pow(base, windowLen - 1)) % prime;
  newHash = (newHash * base + newChar.charCodeAt(0)) % prime;
  if (newHash < 0) newHash += prime;
  return newHash;
}`
    }
  },
  {
    slug: "dsa-p-vs-np",
    title: "P vs NP & Approximation Algorithms",
    order: 50,
    content: `### 1. Conceptual Overview
The P vs NP problem is the most famous unsolved problem in computer science. It questions whether every problem whose solution can be quickly verified (NP) can also be solved quickly (P). Since we cannot efficiently solve NP-Hard problems exactly, we rely on heuristics and approximation algorithms.

### 2. Architecture & Mechanics
- **P (Polynomial Time):** Problems solved in time \`O(N^k)\` (e.g., sorting).
- **NP (Nondeterministic Polynomial Time):** Problems where a proposed solution can be *verified* in polynomial time (e.g., Sudoku).
- **NP-Complete:** The hardest problems in NP. If one is solved in P, all are solved in P (e.g., Traveling Salesperson, Knapsack).
Approximation algorithms provide solutions that are mathematically guaranteed to be within a certain factor (e.g., 2x) of the optimal solution.

### 3. Implementation: Standard vs Optimized
Implementing exact solutions for NP-Complete problems usually relies on Backtracking or Dynamic Programming with exponential bitmasking:
\`\`\`javascript
// TSP exact recursive (Exponential)
function tsp(mask, pos) {
  if (mask === (1 << N) - 1) return dist[pos][0];
  // ... try all unvisited nodes ...
}
\`\`\`
Optimized real-world systems use approximations. For instance, a 2-approximation for Metric TSP uses a Minimum Spanning Tree (MST) and performs a pre-order traversal.

### 4. Trade-offs & Complexity
- **Time Complexity:** Exact algorithms often run in \`O(2^N)\` or \`O(N!)\`. Approximation algorithms run in \`O(N^2)\` or \`O(N log N)\`.
- **Space Complexity:** Often \`O(2^N)\` using memoization for exact algorithms.
- **Trade-offs:** We trade exactness for speed. In real-world logistics or scheduling, a solution that is 1.5x longer but computes in 1 second is infinitely better than the optimal solution that takes 3 million years to compute.`,
    interviewQuestions: [
      {
        question: "Define the difference between NP, NP-Complete, and NP-Hard.",
        answer: "NP problems can be verified in polynomial time. NP-Complete problems are the hardest problems in NP, and all NP problems reduce to them. NP-Hard problems are at least as hard as NP-Complete, but do not necessarily have to be in NP (they might not be verifiable in polynomial time)."
      },
      {
        question: "What does it mean to reduce problem A to problem B?",
        answer: "It means finding a polynomial-time algorithm to transform any instance of problem A into an instance of problem B. If B is easily solved, A is also easily solved."
      },
      {
        question: "Why do we use approximation algorithms?",
        answer: "For NP-Hard problems with large inputs, finding the exact optimal solution takes exponential time. Approximation algorithms guarantee a 'good enough' solution within a specific factor of the optimal, running in polynomial time."
      },
      {
        question: "Give an example of a greedy approximation that works well.",
        answer: "The greedy approach for the Set Cover problem or the fractional Knapsack problem. For fractional Knapsack, greedy gives the exact optimal solution."
      },
      {
        question: "Is the standard 0/1 Knapsack problem NP-Complete?",
        answer: "Yes. Though it can be solved with Dynamic Programming in O(N*W) time, W is not a polynomial of the input size (it is pseudopolynomial), meaning it scales exponentially with the number of bits required to represent W."
      }
    ],
    practicalTask: {
      scenario: "Delivery Route Optimization",
      task: "Write a function wrapper demonstrating a backtracking exact approach structure for TSP.",
      solutionCode: `function solveTSP(graph) {
  const N = graph.length;
  const memo = new Map();
  
  function dfs(mask, pos) {
    if (mask === (1 << N) - 1) return graph[pos][0];
    const key = mask + "-" + pos;
    if (memo.has(key)) return memo.get(key);
    
    let ans = Infinity;
    for (let city = 0; city < N; city++) {
      if ((mask & (1 << city)) === 0) {
        ans = Math.min(ans, graph[pos][city] + dfs(mask | (1 << city), city));
      }
    }
    memo.set(key, ans);
    return ans;
  }
  return dfs(1, 0);
}`
    }
  }
];

appendTopics(
  'dsa', 
  'Data Structures & Algorithms Masterclass', 
  'The ultimate encyclopedic curriculum for mastering DSA. Learn mental models, core data structures, algorithms, and how to ace FAANG interviews.', 
  topics
);
