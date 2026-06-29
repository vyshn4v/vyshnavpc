import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: 'hash-tables-deep-dive',
    title: 'Hash Tables Deep Dive: Mechanics, Collisions, and Complexity',
    order: 21,
    content: `
      <h2>1. The Mental Model of Hash Tables</h2>
      <p>A Hash Table (or Hash Map) is a highly efficient data structure that implements an associative array abstract data type. It maps keys to values, offering exceptional performance for lookups, insertions, and deletions. While an array uses contiguous numeric indices, a hash table uses a <strong>hash function</strong> to compute an index from a given key, directing it to a specific bucket or slot in memory.</p>
      <p>In interviews, hash tables are the silver bullet for optimizing time complexity. When you see an O(N^2) brute-force algorithm involving lookups or matching, a hash table can often reduce it to O(N).</p>
      
      <h2>2. Anatomy of a Hash Function</h2>
      <p>A hash function converts a key of varying length (like a string) into a fixed-size integer. The integer is then modulo-divided by the array size to fit within bounds. A robust hash function must be:</p>
      <ul>
        <li><strong>Deterministic:</strong> The same input must always yield the same output.</li>
        <li><strong>Uniform:</strong> Keys should be evenly distributed across all buckets.</li>
        <li><strong>Fast:</strong> Computation should be O(1).</li>
      </ul>
      
      <h2>3. The Inevitability of Collisions</h2>
      <p>Because the set of possible keys is larger than the number of buckets, two distinct keys will eventually produce the same hash code. This is known as a <strong>hash collision</strong> (Pigeonhole Principle). Hash tables handle collisions using two primary techniques:</p>
      
      <h3>Separate Chaining</h3>
      <p>Each bucket contains a linked list (or a secondary data structure like a BST). When a collision occurs, the new key-value pair is appended to the list in that bucket. While simple, heavy collisions degrade lookup performance from O(1) to O(N) where N is the chain length.</p>
      
      <h3>Open Addressing</h3>
      <p>When a bucket is occupied, the hash table probes for the next available slot sequentially (Linear Probing), quadratically (Quadratic Probing), or using a second hash function (Double Hashing). Open addressing avoids pointer overhead but suffers from clustering.</p>
      
      <h2>4. Load Factor and Rehashing</h2>
      <p>The <strong>Load Factor (α)</strong> is defined as <code>(number of entries) / (number of buckets)</code>. When the load factor exceeds a certain threshold (commonly 0.75 in Java's HashMap), the hash table dynamically resizes (usually doubling its capacity). This process is called <strong>Rehashing</strong>. Every existing key must be rehashed to its new bucket, taking O(N) time. However, this O(N) cost is amortized, maintaining the average O(1) time complexity per insertion.</p>
      
      <h2>5. Code Examples: Brute Force vs Optimized Hash Table</h2>
      <p>Here we see the underlying mechanics of a basic separate-chaining Hash Table compared to an inefficient Array-based mapping.</p>
      <pre><code>
// Brute Force: Key-Value Mapping with Arrays
// Time Complexity: O(N) for set, get, remove
// Space Complexity: O(N)
class InefficientMap {
  constructor() {
    this.pairs = [];
  }
  set(key, value) {
    for (let pair of this.pairs) {
      if (pair[0] === key) { pair[1] = value; return; }
    }
    this.pairs.push([key, value]);
  }
  get(key) {
    for (let pair of this.pairs) {
      if (pair[0] === key) return pair[1];
    }
    return undefined;
  }
}

// Optimized: Custom Hash Table with Separate Chaining
// Time Complexity: O(1) average, O(N) worst-case (all keys collide)
// Space Complexity: O(N)
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }
  
  _hash(key) {
    let total = 0;
    let WEIRD_PRIME = 31;
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      let char = key[i];
      let value = char.charCodeAt(0) - 96;
      total = (total * WEIRD_PRIME + value) % this.keyMap.length;
    }
    return Math.abs(total);
  }
  
  set(key, value) {
    let index = this._hash(key);
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    // Check if key already exists to update value
    for (let i = 0; i < this.keyMap[index].length; i++) {
      if (this.keyMap[index][i][0] === key) {
        this.keyMap[index][i][1] = value;
        return;
      }
    }
    this.keyMap[index].push([key, value]);
  }
  
  get(key) {
    let index = this._hash(key);
    if (this.keyMap[index]) {
      for (let i = 0; i < this.keyMap[index].length; i++) {
        if (this.keyMap[index][i][0] === key) {
          return this.keyMap[index][i][1];
        }
      }
    }
    return undefined;
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "Explain the difference between separate chaining and open addressing.",
        answer: "Separate chaining handles collisions by storing a secondary data structure (like a linked list) at each bucket index. Open addressing handles collisions by finding the next empty bucket within the array itself (e.g., via linear probing). Separate chaining handles high load factors gracefully, while open addressing suffers from clustering but provides better cache locality."
      },
      {
        question: "What is the worst-case time complexity for searching in a hash table and why?",
        answer: "The worst-case time complexity is O(N). This occurs when all inserted keys produce the exact same hash code (a catastrophic collision), forcing all elements into a single bucket. In separate chaining, searching that bucket degrades to an O(N) linked list traversal. In modern languages (e.g., Java), this bucket is converted into a Balanced Binary Search Tree when it grows too large, capping the worst-case at O(log N)."
      },
      {
        question: "What is a 'Load Factor' and why is it critical?",
        answer: "The Load Factor is the ratio of stored elements to the total number of buckets. It measures how full the hash table is. When it exceeds a threshold (e.g., 0.75), the table resizes to avoid excessive collisions and degradation of O(1) time complexity. Rehashing to a larger array distributes elements wider, maintaining performance."
      },
      {
        question: "Why is a prime number commonly used in hash functions and table sizes?",
        answer: "Prime numbers help to minimize collisions. When hashing or applying the modulo operator, if the table size is prime, it ensures that the hash values distribute uniformly even if there are patterns in the input keys. A prime number reduces the likelihood of common factors between the key distribution and the table size."
      },
      {
        question: "Describe 'Amortized O(1)' time complexity in the context of hash table insertions.",
        answer: "While most insertions take O(1) time, an insertion that triggers a resize (rehashing) requires O(N) time to recompute hashes for all existing elements. However, because resizing happens rarely (e.g., capacity doubles), the total cost of N insertions is roughly 2N operations. Thus, the average cost per insertion remains O(1) 'amortized'."
      },
      {
        question: "Can an object be used as a key in a hash table?",
        answer: "In JavaScript's standard Object, keys are implicitly coerced to strings. If you use two distinct objects as keys, both become '[object Object]', overwriting each other. However, in an ES6 'Map', the actual object references are hashed and retained, allowing objects to be distinct keys."
      }
    ],
    practicalTask: {
      scenario: "You are tasked with building a custom caching layer.",
      task: "Implement a basic Set method that inserts key-value pairs and handles collisions via chaining.",
      solutionCode: "class CustomCache { constructor() { this.storage = []; } set(key, val) { const idx = key.length % 10; if(!this.storage[idx]) this.storage[idx] = []; this.storage[idx].push([key, val]); } }"
    }
  },
  {
    slug: 'sets-and-maps-practical-hashing',
    title: 'Sets and Maps: Practical Hashing Applications',
    order: 22,
    content: `
      <h2>1. The Power of O(1) Lookups</h2>
      <p>Hash Maps (Dictionaries/Objects) and Hash Sets are the most ubiquitous tools in a competitive programmer's arsenal. They are the go-to solution for counting frequencies, eliminating duplicates, and caching intermediate results (Memoization).</p>
      
      <h2>2. ES6 Map and Set</h2>
      <p>JavaScript provides built-in <code>Map</code> and <code>Set</code> structures. Unlike standard JS Objects, <code>Map</code> allows keys of any type (including DOM elements or functions), maintains insertion order, and does not inherit properties from the Object prototype.</p>
      <ul>
        <li><strong>Set:</strong> A collection of unique values. Great for deduping arrays or O(1) existence checks.</li>
        <li><strong>Map:</strong> A collection of key-value pairs. Ideal for frequency counting or fast data retrieval.</li>
      </ul>

      <h2>3. Real World Interview Application: Two Sum</h2>
      <p>The legendary "Two Sum" problem is the quintessential example of using a hash map to trade space for time. The problem asks us to find two indices in an array that add up to a target sum.</p>
      
      <h2>4. Code Examples: Brute Force vs Optimized Two Sum</h2>
      <pre><code>
// Brute Force: Nested Loops
// Time Complexity: O(N^2)
// Space Complexity: O(1)
function twoSumBruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// Optimized: Hash Map Complement Lookup
// Time Complexity: O(N)
// Space Complexity: O(N)
function twoSumOptimized(nums, target) {
  const numMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    // Store the value and its index
    numMap.set(nums[i], i);
  }
  return [];
}
      </code></pre>

      <h2>5. Advanced Application: Grouping Anagrams</h2>
      <p>Hashing can be used with complex keys. To group anagrams, we can sort the string and use the sorted string as a key in a Hash Map. All anagrams will yield the exact same sorted string, effectively grouping them in O(N * K log K) time. We can further optimize it using a character count array converted to a string as the hash key.</p>
    `,
    interviewQuestions: [
      {
        question: "Explain the difference between a Map and an Object in JavaScript.",
        answer: "1) Object keys must be Strings or Symbols; Map keys can be of any type. 2) Maps guarantee insertion order of keys; Objects historically didn't, though they now follow strict chronological order for string keys. 3) Map provides a 'size' property; Object size must be calculated manually. 4) Maps are optimized for frequent additions/removals; Objects are better for static configurations."
      },
      {
        question: "How do you eliminate duplicates from an array using hashing?",
        answer: "By passing the array into a Set constructor. A Set only stores unique values based on strict equality (===). Example: 'const unique = [...new Set(array)]'. This operates in O(N) time and space."
      },
      {
        question: "If I want to check for the intersection of two large arrays, how does a Hash Set help?",
        answer: "Without a Set, iterating over array A and calling arrayB.includes(el) takes O(N * M) time. By converting array B into a Hash Set first, you reduce the time to populate the Set to O(M), and then iterating over array A doing O(1) lookups on the Set takes O(N). Total time complexity becomes O(N + M)."
      },
      {
        question: "What is the 'Complement' technique in Hashing?",
        answer: "The complement technique is a mental model where you look for the 'missing piece' required to solve the equation. Instead of checking pairs, you iterate once, storing seen elements. At each step, you calculate the required complement (e.g., target - current) and check if it already exists in your Hash Map."
      },
      {
        question: "How would you design a Hash Key to group anagrams without sorting the string?",
        answer: "Instead of sorting the string (O(K log K)), we can create an array of 26 zeros representing the alphabet count. We populate this array with character frequencies of the word. We then serialize this array into a string (e.g., '1#0#2#0...') and use that as the Hash Key. This groups anagrams in O(N * K) time."
      },
      {
        question: "What happens to memory when you remove an element from a Map vs a WeakMap?",
        answer: "A Map holds strong references to its keys, meaning even if the original key object is deleted elsewhere, the Map prevents it from being garbage collected. A WeakMap holds weak references; if there are no other references to the key object, it is garbage collected, automatically removing the entry from the WeakMap. WeakMaps only accept objects as keys."
      }
    ],
    practicalTask: {
      scenario: "Find the first non-repeating character in a string.",
      task: "Write a function using a hash map to find the first non-repeating character.",
      solutionCode: "function firstUniqChar(s) { const map = new Map(); for (let char of s) map.set(char, (map.get(char) || 0) + 1); for (let i = 0; i < s.length; i++) { if (map.get(s[i]) === 1) return i; } return -1; }"
    }
  },
  {
    slug: 'intro-to-trees',
    title: 'Introduction to Trees: Structure and Terminology',
    order: 23,
    content: `
      <h2>1. The World of Hierarchical Data</h2>
      <p>While arrays, linked lists, and hash tables are linear or flat data structures, a <strong>Tree</strong> is a hierarchical data structure consisting of nodes connected by edges. It perfectly models parent-child relationships, such as file systems, organizational charts, and the DOM (Document Object Model).</p>
      
      <h2>2. Core Terminology</h2>
      <p>To master tree algorithms, you must fluently speak the language of trees:</p>
      <ul>
        <li><strong>Root:</strong> The absolute top node of the tree. It has no parent.</li>
        <li><strong>Node:</strong> An entity containing a value and references to its children.</li>
        <li><strong>Edge:</strong> The connection between two nodes.</li>
        <li><strong>Leaf:</strong> A node with zero children. The "ends" of the branches.</li>
        <li><strong>Height of a Node:</strong> The length of the longest downward path to a leaf from that node. The height of the root is the height of the tree.</li>
        <li><strong>Depth of a Node:</strong> The length of the path to its root (i.e., its root path).</li>
      </ul>
      
      <h2>3. Types of Trees</h2>
      <p>A generic <strong>N-ary tree</strong> allows a node to have any number of children. However, the most famous variant in computer science is the <strong>Binary Tree</strong>, where every node has <em>at most two children</em> (referred to as the left child and right child).</p>
      
      <h2>4. Code Examples: Representing a Binary Tree</h2>
      <p>Creating a tree involves defining a Node class and linking them together. In an interview, you'll rarely build a tree manually; instead, you'll be given the root and asked to traverse it.</p>
      <pre><code>
// Binary Tree Node Class
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

// Manual construction of a tree:
//       1
//      / \\
//     2   3
//    / \\
//   4   5

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.right = new TreeNode(3);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);

console.log("Root value: ", root.val); // 1
console.log("Left child's right child: ", root.left.right.val); // 5
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the difference between a Tree and a Graph?",
        answer: "A Tree is a restricted form of a Graph. A Tree is an undirected, connected, acyclic graph. This means there are no cycles (no loops), and there is exactly one path between any two nodes. In a directed sense, it has a distinct root and edges point from parent to child."
      },
      {
        question: "Define 'Height' vs 'Depth' of a tree node.",
        answer: "Depth is the number of edges from the tree's root node to the node. Height is the number of edges on the longest downward path from the node to a leaf. The height of the tree itself is the height of the root node."
      },
      {
        question: "What is a 'Full' Binary Tree vs a 'Complete' Binary Tree?",
        answer: "A Full Binary Tree is a tree where every node has either 0 or 2 children. A Complete Binary Tree is a tree where every level, except possibly the last, is completely filled, and all nodes are as far left as possible. A Complete Binary Tree can be efficiently represented as an Array (used in Heaps)."
      },
      {
        question: "What constitutes a 'Perfect' Binary Tree?",
        answer: "A Perfect Binary Tree is both full and complete. All interior nodes have two children and all leaves are at the exact same depth or level. A perfect binary tree of height H has exactly 2^(H+1) - 1 nodes."
      },
      {
        question: "How many edges are in a Tree with N nodes?",
        answer: "Exactly N - 1 edges. Every node except the root has exactly one incoming edge from its parent. Since there is 1 root, there are N - 1 incoming edges, meaning N - 1 total edges."
      }
    ],
    practicalTask: {
      scenario: "Calculate the maximum depth of a binary tree.",
      task: "Given the root of a binary tree, write a recursive function to find its maximum depth.",
      solutionCode: "function maxDepth(root) { if (!root) return 0; return 1 + Math.max(maxDepth(root.left), maxDepth(root.right)); }"
    }
  },
  {
    slug: 'tree-traversals',
    title: 'Tree Traversals: DFS (Pre/In/Post) and BFS (Level Order)',
    order: 24,
    content: `
      <h2>1. The Need for Traversal</h2>
      <p>Because trees are non-linear, we can't just iterate from index 0 to N. We need deterministic algorithms to visit every node. The two overarching strategies are <strong>Depth First Search (DFS)</strong> and <strong>Breadth First Search (BFS)</strong>.</p>
      
      <h2>2. Depth First Search (DFS)</h2>
      <p>DFS dives down to the leaves before backtracking. It is elegantly implemented using Recursion (which implicitly uses the Call Stack), or iteratively using an explicit Stack. There are three variations depending on when the current node is visited relative to its children:</p>
      <ul>
        <li><strong>Pre-order (Root, Left, Right):</strong> Useful for creating a copy of the tree or serializing it.</li>
        <li><strong>In-order (Left, Root, Right):</strong> In a Binary Search Tree, this visits nodes in ascending sorted order.</li>
        <li><strong>Post-order (Left, Right, Root):</strong> Useful for deleting the tree or calculating space, as it processes children before the parent.</li>
      </ul>
      
      <h2>3. Breadth First Search (BFS)</h2>
      <p>BFS processes the tree level-by-level. It visits all nodes at depth 0, then depth 1, and so on. BFS requires a <strong>Queue</strong> (FIFO) data structure. It is the optimal strategy for finding the shortest path in an unweighted graph/tree.</p>
      
      <h2>4. Code Examples: DFS vs BFS Implementations</h2>
      <pre><code>
// Tree Setup for examples
class Node { constructor(v) { this.val=v; this.left=this.right=null; } }
const root = new Node(1); root.left = new Node(2); root.right = new Node(3);
root.left.left = new Node(4); root.left.right = new Node(5);

// 1. Recursive DFS (In-Order)
// Time: O(N), Space: O(H) where H is tree height (Call stack)
function inorderDFS(node, result = []) {
  if (!node) return result;
  inorderDFS(node.left, result);
  result.push(node.val);
  inorderDFS(node.right, result);
  return result;
}

// 2. Iterative DFS (Pre-Order using explicit Stack)
// Time: O(N), Space: O(H)
function preorderIterative(root) {
  if (!root) return [];
  const stack = [root];
  const result = [];
  while (stack.length > 0) {
    const node = stack.pop();
    result.push(node.val);
    // Push right first so left is popped first
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}

// 3. Level Order BFS (using Queue)
// Time: O(N), Space: O(W) where W is maximum width of tree
function levelOrderBFS(root) {
  if (!root) return [];
  const queue = [root]; // In production, use a proper Queue class to avoid O(N) unshift
  const result = [];
  
  while (queue.length > 0) {
    let levelSize = queue.length;
    let currentLevel = [];
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift(); // O(N) operation in JS array, abstracting away for example
      currentLevel.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }
  return result;
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "When would you prefer BFS over DFS?",
        answer: "Use BFS when looking for the shortest path between nodes or when searching for a node that is known to be close to the root. DFS is preferred when you want to exhaust all possibilities, analyze deep hierarchical paths, or if the tree is extremely wide and you want to conserve memory (since BFS space is O(Width), which can be O(N/2) for a perfect tree, while DFS space is O(Height))."
      },
      {
        question: "Explain the space complexity differences between BFS and DFS.",
        answer: "DFS has a space complexity of O(H), where H is the maximum depth of the tree, representing the recursion call stack. In a skewed tree, this is O(N). BFS has a space complexity of O(W), where W is the maximum width of the tree, representing the queue size. In a perfect binary tree, the bottom level has N/2 nodes, making BFS space complexity O(N)."
      },
      {
        question: "Why do we use an array for a Queue in JS for BFS, and what is the drawback?",
        answer: "JavaScript does not have a built-in Queue. Using an array 'push()' and 'shift()' simulates a queue. However, 'shift()' is an O(N) operation because shifting the first element requires re-indexing every subsequent element in the array. For performance-critical code, a custom Linked List or a circular buffer must be used for O(1) dequeues."
      },
      {
        question: "What is an In-order traversal useful for?",
        answer: "In a Binary Search Tree (BST), an In-order traversal visits the nodes in strictly increasing (sorted) order. It's used to flatten a BST into a sorted array or validate if a binary tree is indeed a valid BST."
      },
      {
        question: "How do you perform a Post-order traversal iteratively?",
        answer: "Iterative post-order is notoriously tricky. One method uses two stacks: push root to Stack 1, pop from Stack 1 and push to Stack 2. Then push left and right children to Stack 1. Ultimately, Stack 2 will hold the Post-order traversal. Another method uses one stack and a 'lastVisited' pointer to check if the right subtree was traversed before processing the root."
      },
      {
        question: "Is recursion always better for DFS?",
        answer: "No. Recursion is cleaner and easier to write. However, for extremely deep trees, recursion can cause a Stack Overflow Error due to limits on the call stack size. Iterative DFS using a Heap-allocated array stack bypasses this memory limitation, safely handling immense depths."
      }
    ],
    practicalTask: {
      scenario: "Invert a Binary Tree.",
      task: "Given the root of a binary tree, invert the tree (swap left and right children for every node) and return its root.",
      solutionCode: "function invertTree(root) { if(!root) return null; let temp = root.left; root.left = invertTree(root.right); root.right = invertTree(temp); return root; }"
    }
  },
  {
    slug: 'bst-fundamentals',
    title: 'Binary Search Trees (BST) Fundamentals: Search, Insert, Delete',
    order: 25,
    content: `
      <h2>1. The Magic of Binary Search in a Tree</h2>
      <p>A <strong>Binary Search Tree (BST)</strong> is a specialized binary tree that enforces a strict ordering property. For every node:</p>
      <ul>
        <li>All values in its <strong>left subtree</strong> are strictly less than the node's value.</li>
        <li>All values in its <strong>right subtree</strong> are strictly greater than the node's value.</li>
      </ul>
      <p>This property applies recursively. A valid BST enables O(log N) operations (Search, Insert, Delete) on average, bringing the power of Binary Search to dynamic data structures.</p>
      
      <h2>2. Searching and Inserting in a BST</h2>
      <p>To search or insert, we start at the root and compare the target value. If it's smaller, we traverse left. If it's larger, we traverse right. We repeat this until we find the node or hit a <code>null</code> pointer, at which point we insert the new node.</p>
      
      <h2>3. The Complexity of Deletion</h2>
      <p>Deleting a node from a BST is the most complex operation, involving three cases:</p>
      <ol>
        <li><strong>Leaf Node (0 children):</strong> Simply remove the node by updating its parent's pointer to null.</li>
        <li><strong>Node with 1 child:</strong> Bypass the node by linking its parent directly to its single child.</li>
        <li><strong>Node with 2 children:</strong> We cannot simply remove it, as it leaves two disconnected subtrees. We must find the node's <strong>In-order Successor</strong> (the smallest node in its right subtree) or <strong>In-order Predecessor</strong>, replace the target node's value with it, and recursively delete the successor.</li>
      </ol>

      <h2>4. Code Examples: Implementing a BST</h2>
      <pre><code>
class Node {
  constructor(val) {
    this.val = val;
    this.left = this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // Time Complexity: O(log N) avg, O(N) worst
  insert(val) {
    const newNode = new Node(val);
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (true) {
      if (val === current.val) return undefined; // No duplicates
      if (val < current.val) {
        if (!current.left) { current.left = newNode; return this; }
        current = current.left;
      } else {
        if (!current.right) { current.right = newNode; return this; }
        current = current.right;
      }
    }
  }
  
  // Time Complexity: O(log N) avg, O(N) worst
  search(val) {
    if (!this.root) return false;
    let current = this.root;
    while (current) {
      if (val === current.val) return true;
      if (val < current.val) current = current.left;
      else current = current.right;
    }
    return false;
  }
  
  // Recursive Deletion
  delete(val) {
    this.root = this._deleteNode(this.root, val);
  }
  
  _deleteNode(root, key) {
    if (!root) return null;
    
    if (key < root.val) {
      root.left = this._deleteNode(root.left, key);
    } else if (key > root.val) {
      root.right = this._deleteNode(root.right, key);
    } else {
      // Node found
      // Case 1 & 2: 0 or 1 child
      if (!root.left) return root.right;
      if (!root.right) return root.left;
      
      // Case 3: 2 children. Find In-order Successor (min val in right subtree)
      let minNode = this._findMin(root.right);
      root.val = minNode.val;
      root.right = this._deleteNode(root.right, minNode.val);
    }
    return root;
  }
  
  _findMin(node) {
    while (node.left) node = node.left;
    return node;
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the worst-case time complexity for searching in a BST?",
        answer: "The worst-case time complexity is O(N). This happens if elements are inserted in sorted (or reverse sorted) order, creating an unbalanced, skewed tree that essentially acts as a Linked List."
      },
      {
        question: "How do you find the minimum and maximum values in a BST?",
        answer: "To find the minimum value, traverse the left child pointers until a node has no left child. To find the maximum, traverse the right child pointers until a node has no right child. Both operations take O(H) time, where H is the height of the tree."
      },
      {
        question: "What is an In-order Successor?",
        answer: "The In-order Successor of a node is the node with the smallest value strictly greater than the target node's value. If the node has a right subtree, the successor is the minimum value in that right subtree. If it doesn't, the successor is the lowest ancestor whose left child is also an ancestor of the node."
      },
      {
        question: "Can a BST contain duplicate values?",
        answer: "Strictly speaking, the mathematical definition of a BST forbids duplicate keys. However, practically, duplicates can be allowed by either: 1) Storing a count variable inside the Node object, or 2) Defining the condition as 'left child is less than OR EQUAL TO the parent'."
      },
      {
        question: "Why do we replace a node with 2 children with its In-order Successor (or Predecessor) when deleting?",
        answer: "Replacing the target node's value with its successor guarantees the BST property is maintained. The successor is strictly larger than all elements in the left subtree and strictly smaller than the remaining elements in the right subtree. Because the successor is the minimum of the right subtree, it is guaranteed to have NO left child, reducing its own recursive deletion to a simple Case 1 or Case 2."
      },
      {
        question: "Explain the difference between a BST and a Binary Heap.",
        answer: "A BST guarantees left < parent < right, making it great for searching O(log N) and sorted iteration. A Binary Heap (Min or Max Heap) only guarantees that a parent is greater/smaller than its children, but no strict left-right ordering. Heaps are complete binary trees used specifically to quickly find the min/max element in O(1) time and extract it in O(log N)."
      }
    ],
    practicalTask: {
      scenario: "Validate if a tree is a valid Binary Search Tree.",
      task: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      solutionCode: "function isValidBST(root, min = -Infinity, max = Infinity) { if(!root) return true; if(root.val <= min || root.val >= max) return false; return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max); }"
    }
  }
];

appendDsaTopics(topics);
