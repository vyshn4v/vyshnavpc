import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'segment-trees-fenwick-trees',
    title: 'Segment Trees and Fenwick Trees',
    order: 36,
    content: `### 1. Conceptual Overview
Segment Trees and Fenwick Trees (Binary Indexed Trees) are specialized data structures used for efficiently answering range queries and updating elements in an array.

### 2. Architecture & Mechanics
- **Segment Tree**: A binary tree where each node represents an interval or segment of an array. It allows both range queries and point updates in O(log N) time.
- **Fenwick Tree**: Represents an array where each index is responsible for a range based on its binary representation (specifically, the least significant set bit).

### 3. Implementation: Standard vs Optimized
Standard Segment Trees use O(4N) space and are built recursively. Fenwick Trees use O(N) space and rely on bitwise operations (like \`i & -i\`) for traversal, making them much faster in practice with less overhead. Segment Trees can be optimized iteratively to use exactly 2N space.

### 4. Trade-offs & Complexity
Fenwick Trees are extremely fast and memory-efficient but are primarily limited to associative and invertible operations (like sum or XOR). Segment Trees are more flexible and can handle non-invertible operations (like RMQ - Range Minimum Query) and can be extended with Lazy Propagation for range updates.`,
    interviewQuestions: [
      { question: 'What is a Segment Tree used for?', answer: 'It is used for answering range queries (like sum, minimum, or maximum) and updating elements in O(log N) time.' },
      { question: 'How much space does a standard Segment Tree use?', answer: 'A standard recursive Segment Tree uses O(4N) space, where N is the number of elements in the array.' },
      { question: 'What is a Fenwick Tree (Binary Indexed Tree)?', answer: 'A data structure that can efficiently update elements and calculate prefix sums in an array of numbers using bitwise operations.' },
      { question: 'Can a Fenwick Tree handle Range Minimum Queries (RMQ)?', answer: 'Standard Fenwick Trees are not well-suited for RMQ because the minimum operation is not invertible, unlike addition.' },
      { question: 'What is the advantage of Fenwick Tree over Segment Tree?', answer: 'Fenwick Trees use less memory (O(N)), are easier to implement, and have a smaller constant factor in their time complexity.' }
    ],
    practicalTask: {
      scenario: 'You need to perform multiple range sum queries and point updates on an array of numbers.',
      task: 'Implement a Fenwick Tree (Binary Indexed Tree) to efficiently handle updates and prefix sum queries.',
      solutionCode: `class FenwickTree {
  constructor(size) {
    this.tree = new Array(size + 1).fill(0);
  }
  update(i, delta) {
    while (i < this.tree.length) {
      this.tree[i] += delta;
      i += i & -i;
    }
  }
  query(i) {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i;
    }
    return sum;
  }
}`
    }
  },
  {
    slug: 'heavy-light-decomposition',
    title: 'Heavy-Light Decomposition',
    order: 37,
    content: `### 1. Conceptual Overview
Heavy-Light Decomposition (HLD) is a technique used to break down a tree into a set of paths. This allows operations like path queries or updates to be answered efficiently using data structures like Segment Trees.

### 2. Architecture & Mechanics
HLD classifies each edge of a tree as either "heavy" or "light". A heavy edge goes from a node to its child with the largest subtree. All other edges are light. This ensures that any path from a node to the root passes through at most O(log N) light edges.

### 3. Implementation: Standard vs Optimized
The standard implementation requires two DFS passes: one to compute subtree sizes and identify heavy children, and a second to assign nodes to paths (chains) and build the segment tree over these paths. An optimized approach maps the tree to a 1D array using DFS discovery times, allowing a single Segment Tree to manage all heavy paths continuously.

### 4. Trade-offs & Complexity
HLD allows path queries in O(log^2 N) time (O(log N) for traversing paths, O(log N) for Segment Tree queries). It requires significant boilerplate code and memory for the segment tree and chain arrays. For some offline problems, Centroid Decomposition or Mo's Algorithm on Trees might be simpler alternatives.`,
    interviewQuestions: [
      { question: 'What is the main purpose of Heavy-Light Decomposition?', answer: 'To decompose a tree into disjoint paths so that path queries and updates can be handled efficiently, often using a Segment Tree.' },
      { question: 'What defines a "heavy" edge in HLD?', answer: 'An edge from a node to its child with the largest subtree size.' },
      { question: 'How many light edges can exist on a path from a node to the root?', answer: 'At most O(log N) light edges.' },
      { question: 'What is the time complexity of a path query using HLD and a Segment Tree?', answer: 'O(log^2 N), since there are at most O(log N) paths, and querying each takes O(log N).' },
      { question: 'Can HLD handle subtree queries?', answer: 'Yes, because nodes in a subtree are contiguous in the DFS traversal order, subtree queries can be answered in O(log N) time with the same Segment Tree.' }
    ],
    practicalTask: {
      scenario: 'You have a tree and need to find the maximum edge weight on the path between any two nodes.',
      task: 'Write the first DFS pass of HLD to calculate subtree sizes and find heavy edges.',
      solutionCode: `function dfs1(v, p, depth, adj, size, heavy, parent, depthArr) {
  size[v] = 1;
  heavy[v] = -1;
  parent[v] = p;
  depthArr[v] = depth;
  let maxSub = 0;
  
  for (let u of adj[v]) {
    if (u !== p) {
      dfs1(u, v, depth + 1, adj, size, heavy, parent, depthArr);
      size[v] += size[u];
      if (size[u] > maxSub) {
        maxSub = size[u];
        heavy[v] = u;
      }
    }
  }
}`
    }
  },
  {
    slug: 'maximum-bipartite-matching',
    title: 'Maximum Bipartite Matching',
    order: 38,
    content: `### 1. Conceptual Overview
Maximum Bipartite Matching is the problem of finding the largest set of edges in a bipartite graph such that no two edges share an endpoint. This is commonly used in job assignment or scheduling problems.

### 2. Architecture & Mechanics
The problem can be modeled as a Max Flow problem by adding a super-source and a super-sink. However, a simpler DFS-based augmenting path algorithm (Hopcroft-Karp or simple DFS matching) is often used directly on the bipartite graph.

### 3. Implementation: Standard vs Optimized
The standard DFS approach tries to find an augmenting path for each unassigned node in the left set. Hopcroft-Karp optimizes this by using BFS to find multiple shortest augmenting paths simultaneously, followed by DFS to push flow along them.

### 4. Trade-offs & Complexity
The simple DFS algorithm runs in O(V * E) time, which is fast enough for dense graphs with up to a few thousand vertices. Hopcroft-Karp runs in O(E * sqrt(V)) time, making it significantly faster and the preferred choice for large or sparse bipartite graphs.`,
    interviewQuestions: [
      { question: 'What is a Bipartite Graph?', answer: 'A graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other.' },
      { question: 'How can Maximum Bipartite Matching be solved using Max Flow?', answer: 'By connecting a super-source to all left nodes, and all right nodes to a super-sink, with all edge capacities set to 1. The max flow equals the maximum matching.' },
      { question: 'What is the time complexity of Hopcroft-Karp algorithm?', answer: 'O(E * sqrt(V)), where E is edges and V is vertices.' },
      { question: 'What is an augmenting path in the context of bipartite matching?', answer: 'A path that alternates between matched and unmatched edges, starting and ending with unmatched vertices.' },
      { question: 'State Konig\'s Theorem.', answer: 'In any bipartite graph, the number of edges in a maximum matching is equal to the number of vertices in a minimum vertex cover.' }
    ],
    practicalTask: {
      scenario: 'You need to assign N applicants to M jobs, where each applicant can only do specific jobs. Maximize the number of assignments.',
      task: 'Implement a DFS-based bipartite matching algorithm.',
      solutionCode: `function bpm(u, match, visited, adj) {
  for (let v of adj[u]) {
    if (!visited[v]) {
      visited[v] = true;
      if (match[v] === -1 || bpm(match[v], match, visited, adj)) {
        match[v] = u;
        return true;
      }
    }
  }
  return false;
}

function maxBPM(n, m, adj) {
  let match = new Array(m).fill(-1);
  let result = 0;
  for (let i = 0; i < n; i++) {
    let visited = new Array(m).fill(false);
    if (bpm(i, match, visited, adj)) result++;
  }
  return result;
}`
    }
  },
  {
    slug: 'suffix-automaton',
    title: 'Suffix Automaton',
    order: 39,
    content: `### 1. Conceptual Overview
A Suffix Automaton (Directed Acyclic Word Graph - DAWG) is a powerful deterministic finite automaton that accepts all suffixes of a given string. It is the most space-efficient structure that captures all substring information.

### 2. Architecture & Mechanics
It is a DAG where paths from the initial state represent all possible substrings. Each state corresponds to an equivalence class of substrings (endpos/right contexts). It also features "suffix links" connecting states to their longest strict suffix equivalence class.

### 3. Implementation: Standard vs Optimized
Building a Suffix Automaton is done online in O(N) time and O(N) space. Unlike Suffix Trees, which require complex algorithms like Ukkonen's, Suffix Automaton construction is relatively concise and relies on state cloning and suffix link updates.

### 4. Trade-offs & Complexity
It operates in linear time and space, providing immense power for string queries (like finding the number of distinct substrings, longest common substring, or occurrences of a pattern). The theoretical space is small (at most 2N-1 states and 3N-4 transitions), but pointer-based implementations or large alphabets can increase the memory footprint.`,
    interviewQuestions: [
      { question: 'What does a path from the initial state in a Suffix Automaton represent?', answer: 'It represents a valid substring of the original string.' },
      { question: 'What is an "endpos" or "right" set in a Suffix Automaton?', answer: 'The set of all ending positions of a particular substring in the original text. States group substrings with identical endpos sets.' },
      { question: 'What is the maximum number of states in a Suffix Automaton for a string of length N?', answer: 'At most 2N - 1 states.' },
      { question: 'How is a Suffix Automaton used to count distinct substrings?', answer: 'By summing the number of paths from the root, or by summing (length(state) - length(link(state))) for all states.' },
      { question: 'How does it compare to a Suffix Tree?', answer: 'A Suffix Automaton is generally easier to implement than a Suffix Tree (Ukkonen\'s), uses less memory in some representations, and can simulate a Suffix Tree using its suffix link tree.' }
    ],
    practicalTask: {
      scenario: 'You need to find the number of distinct substrings in a string efficiently.',
      task: 'Define the state structure for a Suffix Automaton.',
      solutionCode: `class State {
  constructor(len = 0, link = -1) {
    this.len = len;
    this.link = link;
    this.next = new Map();
  }
}`
    }
  },
  {
    slug: 'fast-fourier-transform',
    title: 'Fast Fourier Transform (FFT) in CP',
    order: 40,
    content: `### 1. Conceptual Overview
The Fast Fourier Transform (FFT) is an algorithm that computes the Discrete Fourier Transform (DFT) in O(N log N) time. In Competitive Programming, it is primarily used for multiplying polynomials efficiently.

### 2. Architecture & Mechanics
Polynomial multiplication naively takes O(N^2). FFT converts polynomials from coefficient representation to point-value representation in O(N log N). In point-value form, polynomials can be multiplied in O(N) time. Finally, Inverse FFT converts the result back to coefficient representation.

### 3. Implementation: Standard vs Optimized
Standard FFT uses complex numbers and floating-point arithmetic, which can introduce precision errors. Number Theoretic Transform (NTT) is an optimized variant that uses modular arithmetic (with a primitive root) instead of complex roots of unity, completely avoiding precision issues and working perfectly for combinatorial problems requiring answers modulo a prime.

### 4. Trade-offs & Complexity
FFT provides a massive speedup from O(N^2) to O(N log N) for polynomial multiplication and string matching with wildcards. However, it is notoriously difficult to implement from scratch without practice and has a high constant factor. Using NTT is safer for modulo problems but restricts the modulo to specific "NTT-friendly" primes (like 998244353).`,
    interviewQuestions: [
      { question: 'What is the primary use of FFT in Competitive Programming?', answer: 'Multiplying two polynomials of degree N in O(N log N) time.' },
      { question: 'What are the three steps of multiplying polynomials using FFT?', answer: '1. Convert to point-value representation (FFT). 2. Point-wise multiplication (O(N)). 3. Convert back to coefficient representation (Inverse FFT).' },
      { question: 'What is the Number Theoretic Transform (NTT)?', answer: 'An integer-based variant of FFT that performs operations modulo a prime using a primitive root instead of complex numbers, avoiding floating-point precision errors.' },
      { question: 'What is the time complexity of the Fast Fourier Transform?', answer: 'O(N log N).' },
      { question: 'Why is the prime 998244353 commonly used with NTT?', answer: 'Because it is of the form c * 2^k + 1, which provides enough roots of unity for transforms up to length 2^k.' }
    ],
    practicalTask: {
      scenario: 'You need to multiply two large numbers or polynomials.',
      task: 'Write the core bit-reversal loop used in iterative FFT implementations.',
      solutionCode: `function bitReversal(n) {
  let rev = new Array(n).fill(0);
  let log_n = Math.log2(n);
  for (let i = 0; i < n; i++) {
    let reversed = 0;
    for (let j = 0; j < log_n; j++) {
      if ((i >> j) & 1) {
        reversed |= (1 << (log_n - 1 - j));
      }
    }
    rev[i] = reversed;
  }
  return rev;
}`
    }
  }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', 'Advanced concepts including Segment Trees, HLD, Bipartite Matching, Suffix Automaton, and FFT.', topics);
