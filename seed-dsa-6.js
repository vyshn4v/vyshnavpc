import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'advanced-graphs',
    title: 'Advanced Graphs & Network Flow',
    order: 26,
    content: `### 1. Conceptual Overview
Graphs model pairwise relations between objects. Advanced graph topics include Network Flow, Bipartite Matching, and strongly connected components. These concepts form the backbone of many real-world applications such as transportation networks, telecommunication routes, and job assignments.

### 2. Architecture & Mechanics
Network flow models a flow network as a directed graph where each edge has a capacity and each edge receives a flow. The amount of flow on an edge cannot exceed its capacity. The sum of flows entering a node must equal the sum of flows exiting the node, except for the source and the sink.

### 3. Implementation: Standard vs Optimized
Standard implementations use the Ford-Fulkerson method which repeatedly finds augmenting paths. The optimized version, Edmonds-Karp, uses BFS to find the shortest augmenting path. Dinic's algorithm builds level graphs and finds blocking flows, offering even better performance.

### 4. Trade-offs & Complexity
Ford-Fulkerson's complexity is $O(E \cdot \text{max\_flow})$, which can be slow for large capacities. Edmonds-Karp improves this to $O(V \cdot E^2)$, while Dinic's operates in $O(V^2 \cdot E)$. The trade-off often lies in implementation complexity vs performance.`,
    interviewQuestions: [
      { question: 'What is a bipartite graph?', answer: 'A graph whose vertices can be divided into two disjoint sets such that every edge connects a vertex in one set to a vertex in the other.' },
      { question: 'Explain the max-flow min-cut theorem.', answer: 'The maximum amount of flow from the source to the sink is equal to the capacity of the minimum cut that separates the source from the sink.' },
      { question: 'What is an augmenting path?', answer: 'A path from the source to the sink in the residual network where the available capacity on all edges in the path is positive.' },
      { question: 'What is the residual capacity?', answer: 'The original capacity of an edge minus the current flow on that edge.' },
      { question: 'How do you find strongly connected components?', answer: 'Algorithms like Kosaraju\'s or Tarjan\'s can find strongly connected components in $O(V + E)$ time.' }
    ],
    practicalTask: {
      scenario: 'You are routing traffic across a city network represented as a graph where edges are roads and capacities are the max vehicles per hour.',
      task: 'Implement the Edmonds-Karp algorithm to find the maximum traffic that can flow from point A to point B without congestion.',
      solutionCode: 'function edmondsKarp(graph, source, sink) {\n  /* Implementation using BFS for augmenting paths */\n  return maxFlow;\n}'
    }
  },
  {
    slug: 'dynamic-programming-optimization',
    title: 'Dynamic Programming Optimizations',
    order: 27,
    content: `### 1. Conceptual Overview
Dynamic programming optimizations reduce the time complexity of classical DP solutions. Techniques include Convex Hull Trick, Divide and Conquer Optimization, and Knuth Optimization. These are crucial for solving complex DP problems efficiently in competitive programming and advanced systems.

### 2. Architecture & Mechanics
Optimizations generally rely on properties of the DP recurrence relation. For instance, the Convex Hull Trick is applicable when the recurrence is of the form $dp[i] = \min(dp[j] + M[j] \cdot x[i] + C[i])$. Divide and Conquer is used when the optimal transition point satisfies a monotonicity condition.

### 3. Implementation: Standard vs Optimized
A standard DP solution might run in $O(N^2)$ or $O(N^3)$. Applying optimizations like the Convex Hull Trick can reduce $O(N^2)$ transitions to $O(N \\log N)$ or even $O(N)$. Knuth optimization often reduces $O(N^3)$ interval DP to $O(N^2)$.

### 4. Trade-offs & Complexity
The primary trade-off is the significant increase in implementation complexity and potential for subtle bugs. However, the performance gains are often asymptotic, turning an otherwise computationally infeasible algorithm into a practical one.`,
    interviewQuestions: [
      { question: 'What is the Convex Hull Trick?', answer: 'An optimization technique used in DP to quickly find the minimum or maximum value of a set of linear functions at a given point.' },
      { question: 'When is Divide and Conquer optimization applicable?', answer: 'When the cost function satisfies the quadrangle inequality, meaning the optimal transition point shifts monotonically.' },
      { question: 'What is Knuth Optimization?', answer: 'An optimization for interval DP that reduces the time complexity from $O(N^3)$ to $O(N^2)$ by restricting the search space for the optimal transition point.' },
      { question: 'Explain Alien\'s Trick.', answer: 'Also known as WQS binary search, it optimizes DP problems where you must pick exactly $k$ items by penalizing each pick and binary searching on the penalty.' },
      { question: 'Why use an envelope in CHT?', answer: 'To maintain the lines forming the lower or upper envelope, allowing efficient queries for the optimal line at any point.' }
    ],
    practicalTask: {
      scenario: 'You need to partition an array of N elements into K contiguous segments to minimize a specific cost function that satisfies the quadrangle inequality.',
      task: 'Apply Divide and Conquer optimization to reduce the standard DP solution complexity.',
      solutionCode: 'function solveDP(k, left, right, optLeft, optRight) {\n  /* D&C DP implementation */\n}'
    }
  },
  {
    slug: 'string-matching-advanced',
    title: 'Advanced String Algorithms',
    order: 28,
    content: `### 1. Conceptual Overview
Advanced string algorithms solve complex text processing problems efficiently. Key structures include Suffix Arrays, Suffix Trees, and Aho-Corasick automaton. These are fundamental in bioinformatics, search engines, and data compression.

### 2. Architecture & Mechanics
A Suffix Array is a sorted array of all suffixes of a string. An Aho-Corasick automaton extends the Trie data structure with failure links, enabling multi-pattern search. Suffix Trees provide a compressed trie of all suffixes, allowing fast queries.

### 3. Implementation: Standard vs Optimized
Building a Suffix Array naively takes $O(N^2 \\log N)$, but optimized algorithms (like prefix doubling) build it in $O(N \\log N)$ or even $O(N)$ using DC3. Aho-Corasick is built in $O(M)$ where M is the sum of pattern lengths, and searches in $O(N + \\text{matches})$.

### 4. Trade-offs & Complexity
Suffix Trees are powerful but memory-heavy and complex to implement. Suffix Arrays offer a memory-efficient alternative and, combined with the LCP (Longest Common Prefix) array, can solve most Suffix Tree problems. Aho-Corasick is optimal for multi-pattern search but requires significant memory for the automaton.`,
    interviewQuestions: [
      { question: 'What is a Suffix Array?', answer: 'An array of integers giving the starting positions of suffixes of a string in lexicographical order.' },
      { question: 'Explain the LCP array.', answer: 'The Longest Common Prefix array stores the length of the longest common prefix between consecutive suffixes in a Suffix Array.' },
      { question: 'How does Aho-Corasick differ from KMP?', answer: 'KMP searches for a single pattern in a text, while Aho-Corasick searches for multiple patterns simultaneously.' },
      { question: 'What is a failure link in Aho-Corasick?', answer: 'A link pointing to the longest proper suffix of the current state that is also a valid prefix in the automaton.' },
      { question: 'Why use a Suffix Array over a Suffix Tree?', answer: 'Suffix Arrays are generally easier to implement and use much less memory while providing similar capabilities when paired with an LCP array.' }
    ],
    practicalTask: {
      scenario: 'You are building a basic plagiarism detection system that needs to find the longest common substring between two large documents.',
      task: 'Construct a Suffix Array and use the LCP array to find the longest common substring efficiently.',
      solutionCode: 'function buildSuffixArray(text) {\n  /* Implementation */\n}\n\nfunction getLongestCommonSubstring(sa, lcp) {\n  /* Implementation */\n}'
    }
  },
  {
    slug: 'computational-geometry',
    title: 'Computational Geometry',
    order: 29,
    content: `### 1. Conceptual Overview
Computational geometry involves designing efficient algorithms for solving geometric problems. Core topics include convex hull, line intersection, polygon triangulation, and closest pair of points. It is crucial for computer graphics, robotics, and geographic information systems.

### 2. Architecture & Mechanics
Algorithms often rely on geometric primitives like cross products to determine orientation (turn left/right) and distance metrics. The sweep-line technique is a common paradigm where a conceptual line moves across the plane, processing events and maintaining state to solve problems globally.

### 3. Implementation: Standard vs Optimized
Finding a convex hull naively can take $O(N^3)$, but Graham Scan and Monotone Chain algorithms compute it in $O(N \\log N)$. Finding intersecting segments naively is $O(N^2)$, but Bentley-Ottmann uses sweep-line to solve it in $O((N + K) \\log N)$, where K is the number of intersections.

### 4. Trade-offs & Complexity
Floating-point precision issues are a major challenge in computational geometry. It is often preferable to use arbitrary-precision integers or exact arithmetic libraries when possible. Sweep-line algorithms reduce time complexity but require complex data structures like balanced binary search trees to maintain the active state.`,
    interviewQuestions: [
      { question: 'What is a Convex Hull?', answer: 'The smallest convex polygon that completely contains a given set of points.' },
      { question: 'How do you check if two line segments intersect?', answer: 'By computing the cross products of the endpoints to check their relative orientations (whether they straddle each other).' },
      { question: 'Explain the sweep-line technique.', answer: 'An algorithmic paradigm that uses a conceptual line sweeping across the plane to process geometric objects in a sorted order, often reducing 2D problems to 1D operations.' },
      { question: 'What is the closest pair of points problem?', answer: 'Finding the two points in a set that have the minimum Euclidean distance between them, solvable in $O(N \\log N)$ using divide and conquer.' },
      { question: 'Why avoid floating-point arithmetic in geometry?', answer: 'Due to precision errors that can lead to incorrect geometric predicates, such as thinking three collinear points form a triangle.' }
    ],
    practicalTask: {
      scenario: 'You are developing a collision detection engine for a 2D game and need to find the boundary of a group of points representing an object.',
      task: 'Implement the Monotone Chain algorithm to find the convex hull of a given set of 2D points.',
      solutionCode: 'function convexHull(points) {\n  /* Sort points and build upper and lower hulls */\n  return hull;\n}'
    }
  },
  {
    slug: 'number-theory-combinatorics',
    title: 'Number Theory & Combinatorics',
    order: 30,
    content: `### 1. Conceptual Overview
Number theory and combinatorics deal with the properties of integers and counting structures. Key concepts include modular arithmetic, prime factorization, greatest common divisor (GCD), and combinations/permutations. They are foundational for cryptography, hashing, and probabilistic algorithms.

### 2. Architecture & Mechanics
Modular arithmetic allows computations to be kept within a finite range, preventing integer overflow. The Extended Euclidean Algorithm finds the GCD and the coefficients of Bézout's identity, essential for finding modular inverses. Combinatorics often relies on computing factorials and their modular inverses to calculate binomial coefficients.

### 3. Implementation: Standard vs Optimized
Finding primes up to N naively takes $O(N \\sqrt{N})$, but the Sieve of Eratosthenes does it in $O(N \\log \\log N)$. Computing powers can be optimized from $O(N)$ to $O(\\log N)$ using binary exponentiation. Calculating modular inverses using Fermat's Little Theorem or Extended Euclidean Algorithm runs in $O(\\log M)$.

### 4. Trade-offs & Complexity
Optimized number theory algorithms are generally very efficient but require a solid mathematical understanding to implement correctly. Precomputing values like factorials or primes trades space and an initial time overhead for $O(1)$ query times, which is highly beneficial when processing multiple queries.`,
    interviewQuestions: [
      { question: 'What is the Sieve of Eratosthenes?', answer: 'An efficient algorithm to find all prime numbers up to a specified integer.' },
      { question: 'How does binary exponentiation work?', answer: 'It calculates a^n in $O(\\log n)$ time by repeatedly squaring the base and halving the exponent.' },
      { question: 'What is a modular multiplicative inverse?', answer: 'An integer x such that the product a*x is congruent to 1 modulo m.' },
      { question: 'When can you use Fermat\'s Little Theorem to find a modular inverse?', answer: 'When the modulus m is a prime number and a is not divisible by m.' },
      { question: 'Explain the Pigeonhole Principle.', answer: 'If n items are put into m containers, with n > m, then at least one container must contain more than one item.' }
    ],
    practicalTask: {
      scenario: 'You are implementing an encryption module that requires fast modular arithmetic operations and prime verification.',
      task: 'Implement binary exponentiation to quickly compute large powers modulo a prime.',
      solutionCode: 'function powerMod(base, exp, mod) {\n  /* Binary exponentiation */\n}\n\nfunction isPrime(n) {\n  /* Miller-Rabin test */\n}'
    }
  }
];

appendTopics(
  'dsa',
  'Data Structures & Algorithms Masterclass',
  'Comprehensive guide to advanced data structures and algorithms.',
  topics
);
