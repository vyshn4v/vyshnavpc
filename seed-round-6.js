import { insertRound } from './insertRound.js';

const roundData = {
  roundId: 'round-6',
  roundName: 'Round 6: Data Structures & Algorithms',
  order: 6,
  description: 'Evaluates the candidate\'s understanding of fundamental data structures and algorithms, tailored for JavaScript and full-stack development scenarios.',
  categories: [
    {
      categoryName: 'Arrays & HashMaps',
      questions: [
        {
          difficulty: 'Easy',
          question: 'Given an array of user objects, write a function to group them by a specific property (e.g., role) using a HashMap.',
          expectedAnswer: 'We can use `Array.prototype.reduce` to iterate and build a map (or object).\n\n```javascript\nfunction groupUsersByRole(users) {\n  return users.reduce((acc, user) => {\n    const role = user.role;\n    if (!acc[role]) acc[role] = [];\n    acc[role].push(user);\n    return acc;\n  }, {});\n}\n```\nThis operates in O(N) time and O(N) space.',
          redFlags: ['Using nested loops (O(N^2) time complexity)', 'Mutating the original array instead of returning a new object'],
          bonusPoints: ['Mentioning `Map` instead of plain object for better performance', 'Using `Object.groupBy()` if discussing modern JS']
        },
        {
          difficulty: 'Medium',
          question: 'Write a function to find the longest substring without repeating characters in a given string. How would you optimize it?',
          expectedAnswer: 'Use a sliding window approach with a Set or Map to keep track of seen characters.\n\n```javascript\nfunction lengthOfLongestSubstring(s) {\n  let set = new Set();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    while (set.has(s[right])) {\n      set.delete(s[left]);\n      left++;\n    }\n    set.add(s[right]);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}\n```\nTime complexity is O(N) as each character is visited at most twice.',
          redFlags: ['Generating all substrings (O(N^3))', 'Not handling edge cases like empty strings'],
          bonusPoints: ['Using a Map to store character indices to skip `left` pointer ahead instantly instead of moving it one by one']
        },
        {
          difficulty: 'Medium',
          question: 'Given two arrays of objects (e.g., `orders` and `customers`), write an efficient function to perform a "Left Join" based on `customerId`.',
          expectedAnswer: 'First, create a HashMap of customers for O(1) lookups, then map over the orders array.\n\n```javascript\nfunction leftJoin(orders, customers) {\n  const customerMap = new Map(customers.map(c => [c.id, c]));\n  return orders.map(order => ({\n    ...order,\n    customer: customerMap.get(order.customerId) || null\n  }));\n}\n```\nTime Complexity is O(N + M) where N and M are the lengths of the arrays.',
          redFlags: ['Using `Array.prototype.find()` inside `Array.prototype.map()` resulting in O(N*M) time complexity'],
          bonusPoints: ['Discussing memory constraints if the `customers` array is massive', 'Using `Map` rather than plain JS objects']
        },
        {
          difficulty: 'Hard',
          question: 'Implement an LRU (Least Recently Used) Cache using JavaScript. Which data structures would you use?',
          expectedAnswer: 'In JavaScript, the built-in `Map` object maintains insertion order, which makes it perfect for implementing an LRU cache without needing a separate doubly linked list.\n\n```javascript\nclass LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val); // Move to end (most recently used)\n    return val;\n  }\n\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      const firstKey = this.cache.keys().next().value;\n      this.cache.delete(firstKey); // Remove least recently used\n    }\n  }\n}\n```',
          redFlags: ['Using arrays and `splice` which causes O(N) operations', 'Not understanding that JS `Map` preserves insertion order'],
          bonusPoints: ['Mentioning how to implement it using a Doubly Linked List + HashMap for languages where Maps don\'t preserve order']
        },
        {
          difficulty: 'Hard',
          question: 'You are receiving a continuous stream of numbers. Write a class to find the median of the numbers received so far at any given time.',
          expectedAnswer: 'The optimal approach uses two priority queues (Heaps): a Max-Heap for the lower half and a Min-Heap for the upper half. Since JS doesn\'t have built-in heaps, we can implement them or use a sorted array and binary search for insertion if O(N) insertion is acceptable.\n\n```javascript\nclass MedianFinder {\n  constructor() {\n    this.arr = [];\n  }\n  addNum(num) {\n    let left = 0, right = this.arr.length;\n    while (left < right) {\n      let mid = Math.floor((left + right) / 2);\n      if (num < this.arr[mid]) right = mid;\n      else left = mid + 1;\n    }\n    this.arr.splice(left, 0, num);\n  }\n  findMedian() {\n    const len = this.arr.length;\n    if (len === 0) return null;\n    if (len % 2 !== 0) return this.arr[Math.floor(len / 2)];\n    return (this.arr[len / 2 - 1] + this.arr[len / 2]) / 2;\n  }\n}\n```',
          redFlags: ['Sorting the array every time `findMedian()` is called (O(N log N))'],
          bonusPoints: ['Discussing the two-heap approach which achieves O(log N) insertion time']
        }
      ]
    },
    {
      categoryName: 'Trees (DOM representation)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'Write a function to traverse a DOM tree and return an array of all text content, ignoring script and style tags.',
          expectedAnswer: 'We can use Depth-First Search (DFS) recursively.\n\n```javascript\nfunction getTextContent(element) {\n  let result = [];\n  for (let child of element.childNodes) {\n    if (child.nodeType === Node.TEXT_NODE) {\n      const text = child.nodeValue.trim();\n      if (text) result.push(text);\n    } else if (child.nodeType === Node.ELEMENT_NODE) {\n      if (child.tagName !== "SCRIPT" && child.tagName !== "STYLE") {\n        result.push(...getTextContent(child));\n      }\n    }\n  }\n  return result;\n}\n```',
          redFlags: ['Not checking `nodeType`', 'Using heavy operations like `element.innerText` recursively which triggers reflows'],
          bonusPoints: ['Using a TreeWalker API which is native and highly optimized for this exact use-case']
        },
        {
          difficulty: 'Medium',
          question: 'Implement a function to find the lowest common ancestor (LCA) of two DOM nodes in a webpage.',
          expectedAnswer: 'We can traverse upwards from one node, storing its ancestors in a Set, then traverse upwards from the other node until we find a match.\n\n```javascript\nfunction getLCA(node1, node2) {\n  const ancestors = new Set();\n  \n  let curr = node1;\n  while (curr) {\n    ancestors.add(curr);\n    curr = curr.parentNode;\n  }\n  \n  curr = node2;\n  while (curr) {\n    if (ancestors.has(curr)) return curr;\n    curr = curr.parentNode;\n  }\n  return null;\n}\n```',
          redFlags: ['Traversing from the root down to find paths (less efficient)'],
          bonusPoints: ['Mentioning `Node.contains()` for an alternative solution']
        },
        {
          difficulty: 'Hard',
          question: 'Given an object with deeply nested properties representing a folder structure, write a function to flatten it into an array of paths.',
          expectedAnswer: 'Use DFS to keep track of the current path and accumulate the results.\n\n```javascript\nfunction flattenStructure(obj, currentPath = "", result = []) {\n  for (let key in obj) {\n    const newPath = currentPath ? `${currentPath}/${key}` : key;\n    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {\n      flattenStructure(obj[key], newPath, result);\n    } else {\n      result.push(`${newPath}: ${obj[key]}`); // Leaf node\n    }\n  }\n  return result;\n}\n```',
          redFlags: ['Failing to handle arrays vs objects correctly in JS'],
          bonusPoints: ['Writing an iterative version using a stack to avoid call stack size limits on very deep structures']
        },
        {
          difficulty: 'Medium',
          question: 'Serialize and Deserialize a Binary Tree to/from a string format. How would you approach this in JS?',
          expectedAnswer: 'A Pre-order traversal with a special marker for null nodes is standard.\n\n```javascript\nfunction serialize(root) {\n  const res = [];\n  function dfs(node) {\n    if (!node) {\n      res.push("null");\n      return;\n    }\n    res.push(node.val);\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(root);\n  return res.join(",");\n}\n\nfunction deserialize(data) {\n  const values = data.split(",");\n  let i = 0;\n  function dfs() {\n    if (values[i] === "null") {\n      i++;\n      return null;\n    }\n    const node = { val: Number(values[i++]), left: null, right: null };\n    node.left = dfs();\n    node.right = dfs();\n    return node;\n  }\n  return dfs();\n}\n```',
          redFlags: ['Failing to correctly maintain state during deserialization (the index variable)'],
          bonusPoints: ['Discussing level-order (BFS) serialization as an alternative']
        },
        {
          difficulty: 'Easy',
          question: 'Invert a binary tree (flip it horizontally).',
          expectedAnswer: 'A classic tree traversal problem. Recursion makes this trivial.\n\n```javascript\nfunction invertTree(node) {\n  if (!node) return null;\n  \n  // Swap left and right\n  const temp = node.left;\n  node.left = node.right;\n  node.right = temp;\n  \n  // Recursively invert subtrees\n  invertTree(node.left);\n  invertTree(node.right);\n  \n  return node;\n}\n```\nTime complexity is O(N) as we visit each node once.',
          redFlags: ['Not returning the root node after inversion', 'Over-complicating with iterative BFS when not requested'],
          bonusPoints: ['Implementing the BFS iterative version using a queue as an alternative']
        }
      ]
    },
    {
      categoryName: 'Graphs (Social connections)',
      questions: [
        {
          difficulty: 'Medium',
          question: 'Given a social network represented as an adjacency list, write a function to find the shortest path (degrees of separation) between two users.',
          expectedAnswer: 'Shortest path in an unweighted graph calls for Breadth-First Search (BFS).\n\n```javascript\nfunction shortestPath(graph, start, target) {\n  if (start === target) return 0;\n  \n  const queue = [[start, 0]];\n  const visited = new Set([start]);\n  \n  while (queue.length > 0) {\n    const [node, dist] = queue.shift();\n    \n    for (let neighbor of (graph[node] || [])) {\n      if (neighbor === target) return dist + 1;\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push([neighbor, dist + 1]);\n      }\n    }\n  }\n  return -1;\n}\n```',
          redFlags: ['Using Depth-First Search (DFS), which does not guarantee the shortest path'],
          bonusPoints: ['Discussing Bidirectional BFS for optimizing search in massive social graphs']
        },
        {
          difficulty: 'Medium',
          question: 'Detect a cycle in a directed graph. (e.g., detecting cyclic dependencies in a Node.js project module graph)',
          expectedAnswer: 'We can use DFS with a recursion stack (or "visiting" state) to track the current path.\n\n```javascript\nfunction hasCycle(numCourses, prerequisites) {\n  const graph = Array.from({length: numCourses}, () => []);\n  for (let [u, v] of prerequisites) graph[v].push(u);\n  \n  const visited = new Array(numCourses).fill(0); // 0=unvisited, 1=visiting, 2=visited\n  \n  function dfs(node) {\n    if (visited[node] === 1) return true; // Cycle detected\n    if (visited[node] === 2) return false;\n    \n    visited[node] = 1;\n    for (let neighbor of graph[node]) {\n      if (dfs(neighbor)) return true;\n    }\n    visited[node] = 2;\n    return false;\n  }\n  \n  for (let i = 0; i < numCourses; i++) {\n    if (visited[i] === 0 && dfs(i)) return true;\n  }\n  return false;\n}\n```',
          redFlags: ['Treating the graph as undirected and using a simple `visited` Set'],
          bonusPoints: ["Mentioning Kahn's algorithm (Topological Sort with BFS) as an alternative approach"]
        },
        {
          difficulty: 'Hard',
          question: 'Number of Islands: Given a 2D grid of 1s (land) and 0s (water), count the number of islands.',
          expectedAnswer: 'We can iterate through the grid. When we find a 1, we increment our count and run a DFS to mark the entire island as visited.\n\n```javascript\nfunction numIslands(grid) {\n  if (!grid || grid.length === 0) return 0;\n  let count = 0;\n  \n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= grid.length || c >= grid[0].length || grid[r][c] === "0") return;\n    grid[r][c] = "0"; // Mark as visited\n    dfs(r+1, c);\n    dfs(r-1, c);\n    dfs(r, c+1);\n    dfs(r, c-1);\n  }\n  \n  for (let r = 0; r < grid.length; r++) {\n    for (let c = 0; c < grid[0].length; c++) {\n      if (grid[r][c] === "1") {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}\n```',
          redFlags: ['Failing to check grid boundaries causing Out Of Bounds errors', 'Not modifying the grid/using a visited matrix, leading to infinite loops'],
          bonusPoints: ['Analyzing space complexity (Call stack depth O(M*N) in worst case) vs BFS queue space']
        },
        {
          difficulty: 'Hard',
          question: 'Clone a Graph. Return a deep copy (clone) of a connected undirected graph.',
          expectedAnswer: 'Use a Map to keep track of already cloned nodes to avoid infinite loops and maintain relationships.\n\n```javascript\nfunction cloneGraph(node) {\n  if (!node) return null;\n  const map = new Map();\n  \n  function dfs(curr) {\n    if (map.has(curr.val)) return map.get(curr.val);\n    \n    const clone = { val: curr.val, neighbors: [] };\n    map.set(curr.val, clone);\n    \n    for (let neighbor of curr.neighbors) {\n      clone.neighbors.push(dfs(neighbor));\n    }\n    return clone;\n  }\n  \n  return dfs(node);\n}\n```',
          redFlags: ['Just cloning the top level and using references for children (shallow copy)', 'Not handling cycles correctly'],
          bonusPoints: ['Mentioning custom cloning is safer for graph structures with methods than `structuredClone()`.']
        },
        {
          difficulty: 'Medium',
          question: 'Find the "Center" of a Star Graph. An undirected star graph consists of one center node connected to all other nodes.',
          expectedAnswer: 'A star graph center must appear in every edge. We only need to check the first two edges to find the common node.\n\n```javascript\nfunction findCenter(edges) {\n  const [[u1, v1], [u2, v2]] = edges;\n  if (u1 === u2 || u1 === v2) return u1;\n  return v1;\n}\n```\nTime complexity is O(1).',
          redFlags: ['Building a full adjacency list or counting degrees for all nodes, which works but is O(N) when O(1) is possible.'],
          bonusPoints: ['Recognizing that the problem constraints allows for an O(1) solution.']
        }
      ]
    },
    {
      categoryName: 'Dynamic Programming',
      questions: [
        {
          difficulty: 'Medium',
          question: 'Write a memoized version of a function that computes the nth Fibonacci number to optimize it from O(2^N) to O(N).',
          expectedAnswer: 'We can use a closure to hold the cache, or pass it as a parameter.\n\n```javascript\nfunction fib(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 1) return n;\n  \n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}\n```\nAlternatively, a bottom-up iterative approach uses O(1) space:\n```javascript\nfunction fibIter(n) {\n  if (n <= 1) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    let temp = a + b;\n    a = b;\n    b = temp;\n  }\n  return b;\n}\n```',
          redFlags: ['Failing to understand how the call stack grows in the un-memoized version'],
          bonusPoints: ['Providing the O(1) space iterative solution after showing the memoized recursive one']
        },
        {
          difficulty: 'Medium',
          question: 'Coin Change: Given an array of coin denominations and a total amount, find the minimum number of coins needed to make that amount.',
          expectedAnswer: 'This is a classic DP problem. We build an array up to the target amount.\n\n```javascript\nfunction coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  \n  for (let i = 1; i <= amount; i++) {\n    for (let coin of coins) {\n      if (i - coin >= 0) {\n        dp[i] = Math.min(dp[i], dp[i - coin] + 1);\n      }\n    }\n  }\n  \n  return dp[amount] === Infinity ? -1 : dp[amount];\n}\n```\nTime complexity is O(amount * number of coins).',
          redFlags: ['Using a greedy approach, which fails for some coin sets like [1, 3, 4] for amount 6'],
          bonusPoints: ['Explaining the state transition equation clearly: `dp[i] = min(dp[i], dp[i-coin] + 1)`']
        },
        {
          difficulty: 'Hard',
          question: 'Longest Increasing Subsequence: Find the length of the longest strictly increasing subsequence in an array.',
          expectedAnswer: 'The standard DP approach is O(N^2).\n\n```javascript\nfunction lengthOfLIS(nums) {\n  if (!nums.length) return 0;\n  const dp = new Array(nums.length).fill(1);\n  let maxLen = 1;\n  \n  for (let i = 1; i < nums.length; i++) {\n    for (let j = 0; j < i; j++) {\n      if (nums[i] > nums[j]) {\n        dp[i] = Math.max(dp[i], dp[j] + 1);\n      }\n    }\n    maxLen = Math.max(maxLen, dp[i]);\n  }\n  return maxLen;\n}\n```',
          redFlags: ['Confusing "subsequence" (can be non-contiguous) with "subarray" (must be contiguous)'],
          bonusPoints: ['Mentioning that an O(N log N) solution exists using Binary Search and a Tails array.']
        },
        {
          difficulty: 'Medium',
          question: 'House Robber: Given an array of integers representing money in houses, determine the maximum amount you can rob tonight without robbing adjacent houses.',
          expectedAnswer: 'At each house, we choose whether to rob it (adding its value to the max from two houses ago) or skip it (taking the max from the previous house).\n\n```javascript\nfunction rob(nums) {\n  if (!nums.length) return 0;\n  if (nums.length === 1) return nums[0];\n  \n  let prev2 = nums[0];\n  let prev1 = Math.max(nums[0], nums[1]);\n  \n  for (let i = 2; i < nums.length; i++) {\n    let current = Math.max(prev1, prev2 + nums[i]);\n    prev2 = prev1;\n    prev1 = current;\n  }\n  \n  return prev1;\n}\n```',
          redFlags: ['Using O(N) space array when O(1) space is sufficient since we only need the last two states.'],
          bonusPoints: ['Correctly handling edge cases like empty arrays or length 1.']
        },
        {
          difficulty: 'Hard',
          question: 'Edit Distance: Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2 (insert, delete, replace).',
          expectedAnswer: 'Use a 2D DP matrix where `dp[i][j]` represents the edit distance between the first `i` characters of word1 and first `j` characters of word2.\n\n```javascript\nfunction minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0));\n  \n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  \n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i-1] === word2[j-1]) {\n        dp[i][j] = dp[i-1][j-1];\n      } else {\n        dp[i][j] = Math.min(\n          dp[i-1][j-1], // Replace\n          dp[i-1][j],   // Delete\n          dp[i][j-1]    // Insert\n        ) + 1;\n      }\n    }\n  }\n  return dp[m][n];\n}\n```',
          redFlags: ['Attempting a recursive approach without memoization, leading to Time Limit Exceeded (O(3^N)).'],
          bonusPoints: ['Mentioning that space can be optimized to O(min(m, n)) by only keeping the previous row.']
        }
      ]
    }
  ]
};

async function seed() {
  try {
    await insertRound(roundData);
    console.log('Seed Round 6 completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding Round 6:', error);
    process.exit(1);
  }
}

seed();
