import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    topic: 'Advanced Graph Algorithms (Strongly Connected Components)',
    order: 31,
    overview: 'In-depth exploration of Tarjan\'s and Kosaraju\'s algorithms for finding Strongly Connected Components in directed graphs.',
    content: `### 1. Conceptual Overview
Strongly connected components (SCCs) are maximal subgraphs in a directed graph where every node is reachable from every other node. Tarjan's and Kosaraju's algorithms provide efficient ways to identify SCCs.

### 2. Architecture & Mechanics
- **Kosaraju's Algorithm**: Relies on two DFS passes. The first pass on the original graph computes the finish times. The second pass on the transposed graph extracts SCCs in decreasing order of finish times.
- **Tarjan's Algorithm**: Uses a single DFS pass, maintaining an "id" and a "low-link" value for each node, along with a stack to track nodes in the current SCC.

### 3. Implementation: Standard vs Optimized
Kosaraju's implementation requires building a reversed graph, which takes extra space. Tarjan's avoids the transposed graph but has overhead from stack management and state tracking per node.

### 4. Trade-offs & Complexity
Both run in O(V + E) time. Kosaraju is simpler to reason about conceptually, but Tarjan's is typically faster in practice due to a single pass and better cache locality.`,
    interviewQuestions: [
      { question: 'What is a Strongly Connected Component (SCC)?', answer: 'An SCC is a maximal subset of vertices in a directed graph such that there is a path from any vertex to any other vertex in the subset.' },
      { question: 'What are the time complexities of Tarjan\'s and Kosaraju\'s algorithms?', answer: 'Both run in O(V + E) time where V is the number of vertices and E is the number of edges.' },
      { question: 'Why does Kosaraju\'s algorithm reverse the graph?', answer: 'Reversing the graph ensures that paths between SCCs are reversed, preventing DFS from bleeding into already processed SCCs during the second pass.' },
      { question: 'What is a low-link value in Tarjan\'s algorithm?', answer: 'The smallest node id reachable from that node, including itself, via the DFS traversal tree.' },
      { question: 'Which algorithm is preferred for very large sparse graphs and why?', answer: 'Tarjan\'s is often preferred because it only requires one DFS pass and avoids explicitly constructing the transposed graph.' }
    ],
    practicalTask: {
      title: 'Implement Kosaraju\'s Algorithm',
      description: 'Write a program to identify all SCCs in a directed graph.',
      steps: [
        'Perform a DFS and push nodes to a stack upon finishing.',
        'Create a transposed (reversed) graph.',
        'Pop nodes from the stack and perform DFS on the transposed graph to find SCCs.'
      ]
    }
  },
  {
    topic: 'Network Flow Algorithms (Max Flow)',
    order: 32,
    overview: 'Understanding the Max Flow Min Cut theorem and algorithms like Ford-Fulkerson and Edmonds-Karp to compute network flow.',
    content: `### 1. Conceptual Overview
Network flow models the maximum amount of "flow" that can be routed from a source to a sink in a directed graph with capacity constraints. The Max Flow Min Cut theorem states that the maximum flow is equal to the capacity of the minimum cut.

### 2. Architecture & Mechanics
- **Ford-Fulkerson**: Iteratively finds an augmenting path from source to sink in the residual graph and pushes flow along it until no such path exists.
- **Edmonds-Karp**: An implementation of Ford-Fulkerson that uses BFS to find the shortest augmenting path (in terms of number of edges), ensuring termination and polynomial time.

### 3. Implementation: Standard vs Optimized
The standard Ford-Fulkerson with DFS can take pseudo-polynomial time (O(E * max_flow)). Edmonds-Karp optimizes this to O(V * E^2). Dinic's Algorithm further optimizes this to O(V^2 * E) using level graphs and blocking flows.

### 4. Trade-offs & Complexity
Ford-Fulkerson is simple but risks worst-case scenarios with large capacities. Edmonds-Karp is safe and polynomial. For practical applications with dense graphs, Push-Relabel or Dinic's is much faster.`,
    interviewQuestions: [
      { question: 'What is an augmenting path?', answer: 'A path from the source to the sink in the residual graph where every edge has residual capacity > 0.' },
      { question: 'What is a residual graph?', answer: 'A graph that represents the remaining available capacities for flow after some flow has already been pushed through the network.' },
      { question: 'State the Max-Flow Min-Cut Theorem.', answer: 'The maximum flow passing from the source to the sink is equal to the total capacity of the minimum cut separating the source and the sink.' },
      { question: 'What is the time complexity of Edmonds-Karp?', answer: 'O(V * E^2), where V is vertices and E is edges.' },
      { question: 'How does Dinic\'s algorithm improve upon Edmonds-Karp?', answer: 'It uses BFS to build a level graph and DFS to push multiple augmenting paths simultaneously (blocking flow).' }
    ],
    practicalTask: {
      title: 'Solve Max Flow using Edmonds-Karp',
      description: 'Implement the Edmonds-Karp algorithm to find the maximum flow from a source node to a sink node.',
      steps: [
        'Initialize flow and construct the residual graph.',
        'Use BFS to repeatedly find the shortest augmenting path.',
        'Update capacities and reverse capacities along the path.'
      ]
    }
  },
  {
    topic: 'String Matching Algorithms',
    order: 33,
    overview: 'Techniques for finding a substring within a larger text efficiently using algorithms like KMP and Rabin-Karp.',
    content: `### 1. Conceptual Overview
String matching is the problem of finding occurrences of a "pattern" string within a "text" string. Naive approaches are slow; advanced algorithms use preprocessing to skip redundant comparisons.

### 2. Architecture & Mechanics
- **KMP (Knuth-Morris-Pratt)**: Precomputes an LPS (Longest Proper Prefix which is also Suffix) array to skip characters when a mismatch occurs.
- **Rabin-Karp**: Uses a rolling hash to compare the pattern against substrings of the text. If hashes match, it verifies the strings directly to handle collisions.

### 3. Implementation: Standard vs Optimized
Standard KMP uses an LPS array. Rabin-Karp requires a strong rolling hash function (like polynomial rolling hash) to minimize collisions. Z-Algorithm is an alternative that builds a Z-array of substring matches.

### 4. Trade-offs & Complexity
KMP guarantees O(N + M) worst-case time complexity, making it robust. Rabin-Karp has an average time of O(N + M) but a worst-case of O(N * M) if hash collisions are frequent. Rabin-Karp is easier to adapt for 2D pattern matching or multiple patterns.`,
    interviewQuestions: [
      { question: 'What does the LPS array in KMP represent?', answer: 'LPS[i] stores the length of the longest proper prefix of the pattern that is also a suffix of the pattern up to index i.' },
      { question: 'Why is Rabin-Karp useful for multiple pattern matching?', answer: 'You can hash multiple patterns and look them up in a hash set while rolling the hash over the text.' },
      { question: 'What is a rolling hash?', answer: 'A hash function where the hash of a window can be computed in O(1) time by sliding the window (removing the old character\'s contribution and adding the new one\'s).' },
      { question: 'What is the time complexity of the KMP algorithm?', answer: 'O(N + M) where N is the text length and M is the pattern length.' },
      { question: 'What causes the worst-case scenario in Rabin-Karp?', answer: 'Frequent hash collisions causing the algorithm to fall back to O(M) string comparisons for many windows.' }
    ],
    practicalTask: {
      title: 'Implement KMP Substring Search',
      description: 'Build the LPS array and use it to find all occurrences of a pattern in a text.',
      steps: [
        'Write a helper function to compute the LPS array for the pattern.',
        'Iterate through the text, using LPS to adjust the pattern pointer on mismatches.',
        'Record all indices where the pattern pointer reaches the end of the pattern.'
      ]
    }
  },
  {
    topic: 'Tries and Suffix Trees',
    order: 34,
    overview: 'Advanced tree-based data structures optimized for prefix and suffix string operations.',
    content: `### 1. Conceptual Overview
A Trie (Prefix Tree) is a tree where edges represent characters, useful for prefix matching. A Suffix Tree is a compressed trie containing all suffixes of a given string, highly powerful for advanced string analysis.

### 2. Architecture & Mechanics
- **Trie**: Each node represents a string prefix. A boolean flag indicates if a node completes a valid word.
- **Suffix Tree**: Edges can represent substrings rather than single characters (compression). It can be built in O(N) time using Ukkonen's algorithm.

### 3. Implementation: Standard vs Optimized
Standard Tries use arrays or hash maps for children. Arrays are faster but use more memory; maps save memory but add overhead. Suffix Arrays combined with an LCP (Longest Common Prefix) array offer a memory-efficient alternative to Suffix Trees while maintaining similar capabilities.

### 4. Trade-offs & Complexity
Tries allow O(L) insertion and search (L is word length), but suffer from high memory consumption. Suffix Trees solve problems like longest repeated substring in linear time, but Ukkonen's algorithm is complex. Suffix Arrays are preferred in competitive programming due to simpler implementation and better memory cache usage.`,
    interviewQuestions: [
      { question: 'What are the main use cases for a Trie?', answer: 'Autocomplete, spell checking, and IP routing (Longest Prefix Match).' },
      { question: 'What is the time complexity to search for a word in a Trie?', answer: 'O(L), where L is the length of the word.' },
      { question: 'What is a Suffix Tree?', answer: 'A compressed trie containing all the suffixes of a given string.' },
      { question: 'Why might you use a Suffix Array instead of a Suffix Tree?', answer: 'Suffix Arrays use much less memory and are easier to implement while solving most of the same problems when paired with an LCP array.' },
      { question: 'What does the LCP array store?', answer: 'The length of the Longest Common Prefix between consecutive suffixes in a sorted Suffix Array.' }
    ],
    practicalTask: {
      title: 'Build an Autocomplete System using a Trie',
      description: 'Implement a Trie that supports inserting words and retrieving all words sharing a given prefix.',
      steps: [
        'Define a TrieNode class with a children map and an isEndOfWord flag.',
        'Implement the insert method to add words.',
        'Implement a startsWith method that returns all words matching a given prefix using DFS.'
      ]
    }
  },
  {
    topic: 'Advanced Dynamic Programming on Trees',
    order: 35,
    overview: 'Applying DP techniques to tree structures, including rerooting techniques and binary lifting.',
    content: `### 1. Conceptual Overview
Dynamic Programming on Trees involves defining states for tree nodes and computing answers using post-order (bottom-up) or pre-order (top-down) traversals. State transitions depend on children or parent nodes.

### 2. Architecture & Mechanics
- **Subtree DP**: Computes a value for a node based on the values computed for its subtrees (e.g., size of subtree, maximum independent set).
- **Rerooting DP (In-Out DP)**: Computes the answer for all possible roots in O(N). The first pass (bottom-up) computes the answer for a fixed root. The second pass (top-down) pushes the parent\'s contribution down to the children.

### 3. Implementation: Standard vs Optimized
Standard tree DP relies heavily on recursion. Deep trees can cause stack overflows, so BFS/DFS order arrays can be used iteratively. Rerooting DP avoids O(N^2) naive recalculations by cleverly reusing overlapping subproblem results from the first pass.

### 4. Trade-offs & Complexity
Tree DP algorithms usually run in O(N) time and space. The state transitions must be associative and commutative if order of children doesn\'t matter. Managing complex states (like merging maps or arrays) can increase complexity to O(N log N) or O(N^2) depending on the merging strategy (e.g., small-to-large merging).`,
    interviewQuestions: [
      { question: 'What is Tree DP?', answer: 'A DP technique where states are defined on tree nodes, typically computed recursively from leaves to root.' },
      { question: 'What is the "rerooting" technique?', answer: 'A two-pass Tree DP technique that computes the answer for every node acting as the root in O(N) time.' },
      { question: 'How do you find the diameter of a tree using DP?', answer: 'For each node, compute the two longest paths into its subtrees. The diameter passing through that node is their sum. The tree diameter is the maximum across all nodes.' },
      { question: 'What is "small-to-large" merging on trees?', answer: 'An optimization where, when merging data structures (like sets) from children to parent, you always merge the smaller into the larger to achieve O(N log^2 N) overall time.' },
      { question: 'What is Binary Lifting?', answer: 'A technique to find the Lowest Common Ancestor (LCA) or compute associative functions on tree paths in O(log N) time after O(N log N) preprocessing.' }
    ],
    practicalTask: {
      title: 'Tree Diameter using DP',
      description: 'Find the longest path between any two nodes in a tree.',
      steps: [
        'Represent the tree as an adjacency list.',
        'Write a recursive DFS that returns the longest path from the current node down to a leaf.',
        'During DFS, keep track of the top two longest paths from children to update the global diameter.'
      ]
    }
  }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', 'Advanced concepts including Graph algorithms, Network Flow, String operations, Tries, and Tree DP.', topics)
  .then(() => console.log('Successfully seeded dsa-7 topics'))
  .catch(err => console.error('Error seeding topics:', err));
