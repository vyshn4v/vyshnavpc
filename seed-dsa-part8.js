import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: "dsa-ch36-intro-graphs",
    title: "Chapter 36: Introduction to Graphs",
    order: 36,
    content: `<h2>The Network Abstraction</h2>
<p>A <b>Graph</b> is a non-linear data structure consisting of <b>Vertices</b> (or Nodes) and <b>Edges</b> that connect these vertices. It is the ultimate abstraction for modeling relationships—from social networks and the internet to road maps and biological networks.</p>
<h3>Core Terminologies</h3>
<ul>
<li><b>Directed vs Undirected:</b> In a Directed Graph (Digraph), edges have a direction (A &rarr; B means A points to B, but not vice versa). In an Undirected Graph, edges are bidirectional (A &mdash; B means A and B are connected both ways).</li>
<li><b>Weighted vs Unweighted:</b> A Weighted graph assigns a cost, distance, or weight to every edge. Unweighted graphs treat all edges as having a cost of 1.</li>
<li><b>Cyclic vs Acyclic:</b> A Cyclic graph contains at least one cycle (a path that starts and ends at the same vertex). An Acyclic graph has no cycles. A Directed Acyclic Graph is commonly known as a <b>DAG</b>.</li>
</ul>
<h3>Representing Graphs in Code</h3>
<p>There are two primary ways to represent graphs in memory. Choosing the right one is critical for performance.</p>
<h4>1. Adjacency Matrix</h4>
<p>A 2D array of size <code>V x V</code> (where V is the number of vertices). <code>matrix[i][j] = 1</code> if there is an edge from <i>i</i> to <i>j</i>, otherwise 0.</p>
<ul>
<li><b>Pros:</b> <code>O(1)</code> edge lookup time. Adding/removing an edge is <code>O(1)</code>.</li>
<li><b>Cons:</b> <code>O(V^2)</code> space complexity. Very bad for sparse graphs (graphs with few edges) as it wastes a massive amount of memory storing zeros. Iterating over a vertex's neighbors takes <code>O(V)</code> time.</li>
</ul>
<h4>2. Adjacency List</h4>
<p>An Array or Hash Map where every vertex key points to a list of its neighboring vertices. In JavaScript, a <code>Map</code> or an object is commonly used.</p>
<ul>
<li><b>Pros:</b> <code>O(V + E)</code> space complexity. Highly optimal for sparse graphs. Iterating over a vertex's neighbors is extremely fast (proportional to its degree).</li>
<li><b>Cons:</b> Checking if an edge exists between A and B takes <code>O(degree(A))</code> time.</li>
</ul>
<pre><code>// Example: Undirected Graph Adjacency List in JS
const graph = {
  'A': ['B', 'C'],
  'B': ['A', 'D'],
  'C': ['A'],
  'D': ['B']
};
</code></pre>`,
    interviewQuestions: [
      { question: "When would you choose an Adjacency Matrix over an Adjacency List?", answer: "You use an Adjacency Matrix exclusively when the graph is incredibly DENSE (almost every node is connected to every other node, so E is close to V^2), or when you absolutely require O(1) edge lookup and your total vertex count (V) is very small (e.g., less than 1000) so memory is not an issue." },
      { question: "What is a Bipartite Graph?", answer: "A bipartite graph is a graph whose vertices can be divided into two disjoint sets U and V such that every edge connects a vertex in U to one in V. There are no edges connecting vertices within the same set. A graph is bipartite if and only if it does not contain any odd-length cycles." },
      { question: "How do you represent a weighted graph using an Adjacency List?", answer: "Instead of just storing the neighboring vertex ID, you store an object or an array tuple containing both the neighbor ID and the edge weight. Example: <code>graph['A'] = [{node: 'B', weight: 5}]</code>." },
      { question: "What is the difference between a Tree and a Graph?", answer: "A Tree is just a restricted type of Graph. Specifically, a Tree is an Undirected, Connected, and completely Acyclic graph. Because it has no cycles, a Tree with V vertices will always have exactly V - 1 edges." },
      { question: "How does memory scale for a completely connected (complete) graph?", answer: "In a complete graph, every node connects to every other node. The number of edges is V(V-1)/2. Therefore, both the Adjacency Matrix and Adjacency List will require O(V^2) space." }
    ],
    practicalTask: {
      scenario: "Building an Adjacency List.",
      task: "Given an array of edges (each edge is an array of two nodes), build and return an undirected Adjacency List.",
      solutionCode: `function buildGraph(edges) {
  const graph = {};
  for (let [u, v] of edges) {
    if (!graph[u]) graph[u] = [];
    if (!graph[v]) graph[v] = [];
    graph[u].push(v);
    graph[v].push(u); // Remove this line for a directed graph
  }
  return graph;
}`
    }
  },
  {
    slug: "dsa-ch37-bfs",
    title: "Chapter 37: Breadth-First Search (BFS)",
    order: 37,
    content: `<h2>Level by Level Exploration</h2>
<p><b>Breadth-First Search (BFS)</b> explores a graph layer by layer, moving outward from a starting node. It visits all immediate neighbors before moving on to the neighbors' neighbors.</p>
<h3>The Core Mechanism: The Queue</h3>
<p>BFS strictly relies on a <b>Queue</b> (First-In, First-Out). You enqueue the starting node, mark it as visited, and then loop while the queue is not empty. Dequeue a node, process it, and enqueue all of its unvisited neighbors.</p>
<p><i>Crucial Rule:</i> In graphs (unlike trees), you MUST use a <code>visited</code> set to prevent infinite loops caused by cycles.</p>
<h3>The Superpower: Shortest Path</h3>
<p>Because BFS explores outward in concentric circles, it possesses a massive superpower: <b>It guarantees finding the shortest path between two nodes in an UNWEIGHTED graph.</b> The first time BFS reaches the target node, it has taken the minimum possible number of edges.</p>
<h3>Time and Space Complexity</h3>
<ul>
<li><b>Time:</b> <code>O(V + E)</code>. You visit every vertex once and iterate through every edge once.</li>
<li><b>Space:</b> <code>O(V)</code>. In the worst case (a highly branched graph), the queue and the visited set might hold all the vertices.</li>
</ul>
<pre><code>// Standard BFS Template
function bfs(graph, startNode) {
  const queue = [startNode];
  const visited = new Set();
  visited.add(startNode);
  
  while (queue.length > 0) {
    const current = queue.shift(); // Dequeue
    console.log("Processing:", current);
    
    for (let neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor); // Mark visited BEFORE enqueuing!
        queue.push(neighbor);
      }
    }
  }
}
</code></pre>`,
    interviewQuestions: [
      { question: "Why is a Queue used for BFS instead of a Stack?", answer: "A Queue processes elements in First-In, First-Out (FIFO) order. This ensures that nodes discovered earlier (closer to the start) are processed before nodes discovered later, guaranteeing a level-by-level traversal. A Stack provides LIFO order, which results in diving deep into one path (DFS)." },
      { question: "Why must we mark a node as visited BEFORE pushing it into the queue, rather than after popping it out?", answer: "If you mark it visited after popping, multiple different nodes could 'discover' the same unvisited neighbor and push it into the queue multiple times. This bloats the queue exponentially and ruins the O(V + E) time complexity." },
      { question: "Can BFS find the shortest path in a weighted graph?", answer: "No. BFS assumes every edge has the exact same cost (1). If edges have different weights, a path with 5 edges might cost 10, while a path with 2 edges might cost 50. BFS will mistakenly claim the 2-edge path is shorter. You need Dijkstra's algorithm for weighted graphs." },
      { question: "How do you track the actual shortest path route (not just the distance) using BFS?", answer: "You maintain a <code>parent</code> hash map. Whenever you enqueue a neighbor discovered from current, you record <code>parent[neighbor] = current</code>. When you reach the target, you can trace the path backward from the target to the start using the parent map." },
      { question: "What is Multi-Source BFS?", answer: "Instead of starting BFS from a single node, you initially push multiple starting nodes into the queue. This is used to find the shortest distance from 'any' of the starting points simultaneously (e.g., finding the distance to the nearest hospital for every house in a city)." }
    ],
    practicalTask: {
      scenario: "Shortest Path in Unweighted Graph.",
      task: "Given an Adjacency List graph, a start node, and an end node, return the shortest distance (number of edges) between them. Return -1 if unreachable.",
      solutionCode: `function shortestDistance(graph, start, end) {
  if (start === end) return 0;
  
  let distance = 0;
  const queue = [start];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const levelSize = queue.length;
    // Process the entire level before incrementing distance
    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift();
      if (current === end) return distance;
      
      for (let neighbor of (graph[current] || [])) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    distance++;
  }
  return -1;
}`
    }
  },
  {
    slug: "dsa-ch38-dfs",
    title: "Chapter 38: Depth-First Search (DFS)",
    order: 38,
    content: `<h2>Diving into the Abyss</h2>
<p><b>Depth-First Search (DFS)</b> goes as deep as possible down one path before backtracking. Imagine exploring a maze by keeping your hand on the right wall until you hit a dead end, then walking back to the last intersection.</p>
<h3>The Core Mechanism: The Stack</h3>
<p>DFS relies on a <b>Stack</b> (Last-In, First-Out). Because of this, it is most beautifully and concisely implemented using <b>Recursion</b> (leveraging the system call stack).</p>
<h3>Superpowers of DFS</h3>
<p>While BFS is best for shortest paths, DFS is the champion for:</p>
<ol>
<li><b>Finding Connected Components:</b> Exploring islands of isolated nodes.</li>
<li><b>Cycle Detection:</b> Finding loops in directed and undirected graphs.</li>
<li><b>Path Finding:</b> Finding <i>any</i> valid path (like solving a maze) where shortest distance doesn't matter.</li>
</ol>
<h3>Time and Space Complexity</h3>
<ul>
<li><b>Time:</b> <code>O(V + E)</code>.</li>
<li><b>Space:</b> <code>O(V)</code> for the visited set and the recursion call stack in the worst-case scenario (a linked-list-like graph).</li>
</ul>
<pre><code>// Standard Recursive DFS Template
function dfs(graph, current, visited = new Set()) {
  if (visited.has(current)) return;
  
  console.log("Processing:", current);
  visited.add(current);
  
  for (let neighbor of graph[current]) {
    dfs(graph, neighbor, visited);
  }
}
</code></pre>`,
    interviewQuestions: [
      { question: "How do you detect a cycle in an Undirected Graph using DFS?", answer: "During DFS traversal, you keep track of the <code>parent</code> node that discovered the current node. If you encounter a neighbor that is already visited, and that neighbor is NOT the parent, then you have hit a cycle." },
      { question: "How do you detect a cycle in a Directed Graph using DFS?", answer: "A simple visited set is not enough. You must use a 'recursion stack' or a 3-color mechanism. Nodes are marked UNVISITED (white), VISITING (gray, currently in the recursive stack), or VISITED (black, fully processed). If you ever encounter a neighbor that is VISITING (gray), you have found a back-edge, meaning a cycle exists." },
      { question: "Can DFS be implemented iteratively?", answer: "Yes, by manually using an Array to act as a Stack. However, you push nodes onto the stack, and when you pop a node, you process it. To replicate exact recursive behavior, you push neighbors in reverse order. The space complexity is still O(V)." },
      { question: "When would you prefer DFS over BFS?", answer: "If memory is a massive constraint and the graph is extremely wide (high branching factor), BFS queue will consume huge memory, making DFS preferable. Also, DFS is used for backtracking (e.g., N-Queens, Sudoku), finding connected components, and topological sorting." },
      { question: "What happens if a graph is disconnected? How do you traverse it all?", answer: "Neither a single BFS nor a single DFS will visit everything if the graph has disconnected islands. You must iterate through a master list of all vertices, and if a vertex is not in the <code>visited</code> set, you launch a new DFS/BFS from it. This is how you count Connected Components." }
    ],
    practicalTask: {
      scenario: "Number of Islands.",
      task: "Given a 2D grid map of '1's (land) and '0's (water), count the number of islands. Use DFS.",
      solutionCode: `function numIslands(grid) {
  if (!grid || grid.length === 0) return 0;
  
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;
  
  const dfs = (r, c) => {
    // Bounds check and water check
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] === '0') return;
    
    // Sink the island (mark visited)
    grid[r][c] = '0';
    
    // Visit all 4 directions
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  };
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++; // Found a new island component
        dfs(r, c); // Sink the entire island component
      }
    }
  }
  return count;
}`
    }
  },
  {
    slug: "dsa-ch39-topological-sort",
    title: "Chapter 39: Topological Sorting",
    order: 39,
    content: `<h2>Ordering Dependencies</h2>
<p><b>Topological Sort</b> provides a linear ordering of vertices in a <b>Directed Acyclic Graph (DAG)</b> such that for every directed edge <code>U &rarr; V</code>, vertex <code>U</code> comes before vertex <code>V</code> in the ordering.</p>
<p>If the graph contains a cycle, topological sorting is strictly impossible (you can't install package A if it requires B, and B requires A).</p>
<h3>Approach 1: Kahn's Algorithm (BFS based)</h3>
<p>This is the most intuitive approach, based on <b>In-Degrees</b> (the number of incoming edges a node has).</p>
<ol>
<li>Calculate the in-degree of every vertex.</li>
<li>Push all vertices with an in-degree of 0 (no prerequisites) into a Queue.</li>
<li>While the Queue is not empty:
  <ul>
    <li>Dequeue a node and add it to the final sorted result.</li>
    <li>For each of its neighbors, decrement their in-degree by 1 (simulating the removal of the current node).</li>
    <li>If a neighbor's in-degree drops to 0, push it into the Queue.</li>
  </ul>
</li>
<li>If the result array length does not equal the total number of vertices, a cycle exists!</li>
</ol>
<h3>Approach 2: DFS</h3>
<p>Run a standard DFS. However, only <i>after</i> a node has fully explored all of its neighbors (at the end of the recursive function), push the node onto a Stack. When all DFS traversals are complete, popping elements off the stack will yield the topological order.</p>
<h3>Complexity</h3>
<p>Both Kahn's and DFS approaches run in <code>O(V + E)</code> time and <code>O(V)</code> space.</p>`,
    interviewQuestions: [
      { question: "What is the primary real-world use case for Topological Sorting?", answer: "Dependency resolution. Resolving package imports in NPM, compiling code files in the correct order (makefiles), scheduling tasks with prerequisites, and resolving deadlocks in databases." },
      { question: "Is the Topological Sort of a graph unique?", answer: "No. If a DAG has multiple nodes with an in-degree of 0 at any point, picking any of them is valid. Therefore, a single DAG can have many valid topological orderings." },
      { question: "How does Kahn's algorithm elegantly detect cycles?", answer: "In Kahn's algorithm, we only enqueue nodes whose in-degree drops to 0. If a cycle exists, the nodes inside the cycle will eternally depend on each other, meaning their in-degrees will never reach 0. They will never enter the queue. Consequently, the final sorted array will contain fewer nodes than the original graph, instantly signaling a cycle." },
      { question: "Why do we push nodes onto a Stack at the END of the DFS call?", answer: "Topological sort requires a node to appear before its dependencies. In DFS, a node fully explores its deepest dependencies first. By pushing to a stack AFTER the dependencies are explored, we guarantee the dependencies enter the stack first (putting them at the bottom). When we pop the stack, the independent nodes come out first." },
      { question: "Can we use Topological Sort on an Undirected Graph?", answer: "No. Topological sort requires directed edges to establish a parent-child dependency relationship. In an undirected graph, A depends on B and B depends on A simultaneously, which immediately forms a cycle." }
    ],
    practicalTask: {
      scenario: "Course Schedule.",
      task: "There are numCourses courses labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates you must take course b first if you want to take course a. Return true if you can finish all courses. (Cycle detection via Kahn's algorithm).",
      solutionCode: `function canFinish(numCourses, prerequisites) {
  const adjList = new Array(numCourses).fill(0).map(() => []);
  const inDegree = new Array(numCourses).fill(0);
  
  // Build Graph and In-Degrees
  for (let [course, prereq] of prerequisites) {
    adjList[prereq].push(course);
    inDegree[course]++;
  }
  
  const queue = [];
  // Push all courses with no prerequisites
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  let processedCourses = 0;
  
  while (queue.length > 0) {
    const current = queue.shift();
    processedCourses++;
    
    for (let neighbor of adjList[current]) {
      inDegree[neighbor]--; // Remove dependency
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }
  
  // If we processed all courses, no cycle exists
  return processedCourses === numCourses;
}`
    }
  },
  {
    slug: "dsa-ch40-dijkstra",
    title: "Chapter 40: Shortest Paths: Dijkstra's Algorithm",
    order: 40,
    content: `<h2>Navigating Weighted Terrain</h2>
<p>BFS finds the shortest path by counting edges, assuming all edges are equal. But how do you find the fastest route on a map where highway edges take 10 minutes and local roads take 45 minutes? Enter <b>Dijkstra's Algorithm</b>.</p>
<h3>The Core Logic</h3>
<p>Dijkstra is fundamentally a <b>Greedy Algorithm</b> combined with <b>BFS</b>, utilizing a <b>Min-Priority Queue</b>.</p>
<ol>
<li>Initialize an array <code>distances</code> for all nodes, setting the start node to 0 and all others to Infinity.</li>
<li>Push the start node into a Min-Priority Queue with a weight of 0.</li>
<li>While the PQ is not empty:
  <ul>
    <li>Extract the node with the absolute minimum distance from the PQ. (Greedy choice).</li>
    <li>If this node was already processed with a shorter distance earlier, skip it.</li>
    <li>For every neighbor of this node: Calculate the total distance to reach the neighbor <i>through</i> the current node.</li>
    <li>If this calculated distance is strictly LESS than the neighbor's currently known <code>distances[neighbor]</code>, update the array and push the neighbor into the PQ with the new shorter distance.</li>
  </ul>
</li>
</ol>
<h3>Complexity Analysis</h3>
<p>Extracting the minimum from a Heap takes <code>O(log V)</code>. We do this for every vertex. Pushing edges to the heap takes <code>O(log V)</code>. Total Time Complexity is <b><code>O((V + E) log V)</code></b>. Space complexity is <code>O(V + E)</code>.</p>
<h3>The Achilles Heel</h3>
<p>Dijkstra's algorithm completely breaks if the graph contains <b>Negative Weight Edges</b>. Because it is greedy, once it extracts a node from the Priority Queue, it assumes the shortest path to that node is permanently finalized. A negative edge found later could violate this assumption.</p>`,
    interviewQuestions: [
      { question: "What algorithm should you use if the graph has Negative Weights?", answer: "You must use the Bellman-Ford algorithm. It runs in O(V * E) time by relaxing all edges V-1 times. Bellman-Ford can also detect negative weight cycles." },
      { question: "Why doesn't Dijkstra's algorithm work with negative edge weights?", answer: "Dijkstra is greedy. When it pops a node from the priority queue, it permanently finalizes its shortest distance, assuming that adding more edges can only increase the total distance. A negative weight edge violates this rule, as a longer path (more edges) could theoretically result in a smaller total distance." },
      { question: "Can we just add a large positive constant to all edges to eliminate negative weights and then run Dijkstra?", answer: "No. Adding a constant C to all edges disproportionately penalizes paths with a larger number of edges. A path with 10 edges gets penalized by 10*C, while a path with 2 edges is penalized by 2*C. This completely alters the shortest path." },
      { question: "If the graph is unweighted, should we use Dijkstra or BFS?", answer: "Always use BFS. BFS guarantees O(V + E) time without the overhead of maintaining a Priority Queue. Dijkstra takes O((V + E) log V), which is mathematically and practically slower." },
      { question: "How does A* (A-Star) algorithm differ from Dijkstra?", answer: "Dijkstra searches evenly in all directions (like an expanding circle) because it only considers distance from the start. A* adds a Heuristic (an educated guess of the distance to the target). It expands nodes based on 'Distance from Start + Estimated Distance to Target', directing the search specifically towards the goal, making it vastly faster for pathfinding on maps." }
    ],
    practicalTask: {
      scenario: "Network Delay Time.",
      task: "You are given a network of n nodes, labeled from 1 to n. You are also given times, a list of travel times as directed edges times[i] = (u, v, w). We send a signal from a given node k. Return the time it takes for all the n nodes to receive the signal. Return -1 if it's impossible. (Requires a MinPriorityQueue class).",
      solutionCode: `function networkDelayTime(times, n, k) {
  // Build Adjacency List
  const graph = {};
  for (let i = 1; i <= n; i++) graph[i] = [];
  for (let [u, v, w] of times) {
    graph[u].push({node: v, weight: w});
  }
  
  // Distances Array initialized to Infinity
  const distances = new Array(n + 1).fill(Infinity);
  distances[k] = 0;
  
  // pq stores [distanceFromStart, node]
  const pq = new MinPriorityQueue((a, b) => a[0] < b[0]);
  pq.enqueue([0, k]);
  
  while (pq.heap.length > 0) {
    const [currentDist, u] = pq.dequeue();
    
    // Optimization: Skip stale higher-distance entries in PQ
    if (currentDist > distances[u]) continue;
    
    for (let neighbor of graph[u]) {
      const v = neighbor.node;
      const weight = neighbor.weight;
      
      const newDist = currentDist + weight;
      if (newDist < distances[v]) {
        distances[v] = newDist;
        pq.enqueue([newDist, v]);
      }
    }
  }
  
  let maxTime = 0;
  // Check from node 1 to n (skip index 0)
  for (let i = 1; i <= n; i++) {
    if (distances[i] === Infinity) return -1;
    maxTime = Math.max(maxTime, distances[i]);
  }
  
  return maxTime;
}`
    }
  }
];

appendDsaTopics(topics);
