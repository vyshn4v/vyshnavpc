import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: 'advanced-bst-concepts',
    title: 'Advanced BST Concepts: Balancing and Iteration',
    order: 26,
    content: `
      <h2>1. The Problem with Unbalanced Trees</h2>
      <p>As we learned, the worst-case time complexity for a standard BST is O(N) when data is inserted in sorted order, creating a linear chain. To guarantee O(log N) operations, we use <strong>Self-Balancing Binary Search Trees</strong> like AVL Trees or Red-Black Trees. These structures automatically perform tree rotations upon insertion or deletion to ensure the height of the tree remains logarithmic relative to the number of nodes.</p>
      
      <h2>2. Intuition behind AVL and Red-Black Trees</h2>
      <ul>
        <li><strong>AVL Trees:</strong> Strictly balanced. The heights of the two child subtrees of any node differ by at most one. Because they are so strictly balanced, lookups are extremely fast, but insertions and deletions might require more rotations.</li>
        <li><strong>Red-Black Trees:</strong> Loosely balanced using a coloring system (nodes are red or black) and strict rules about consecutive red nodes. They guarantee a maximum height of 2 * log(N). Used in Java's TreeMap and C++'s map, because insertions and deletions are generally faster than AVL trees.</li>
      </ul>
      
      <h2>3. Tree Rotations</h2>
      <p>A <strong>Tree Rotation</strong> is a localized operation that changes the structure of a tree without interfering with the BST property (in-order sequence remains identical). A Left Rotation on node X moves its right child up to take its place, and pushes X down to become the left child of the new root.</p>

      <h2>4. Finding the In-order Successor</h2>
      <p>If a node has a right subtree, the successor is the minimum element in that right subtree. If it does not have a right subtree, its successor is the lowest ancestor whose left child is also an ancestor of the node. We can find this efficiently without maintaining parent pointers by keeping track of the last node we took a left turn at from the root.</p>

      <h2>5. Code Example: BST Iterators and Successors</h2>
      <pre><code>
// Iterative In-order Successor (assuming a root pointer is available)
// Time Complexity: O(H) where H is tree height
function inorderSuccessor(root, p) {
  let successor = null;
  let current = root;
  
  while (current !== null) {
    if (p.val < current.val) {
      // Current node could be a successor, record it and go left
      successor = current;
      current = current.left;
    } else {
      // If p.val >= current.val, successor must be in the right subtree
      current = current.right;
    }
  }
  return successor;
}

// A lazy BST Iterator using an explicit stack
// Allows us to get the 'next' smallest element in O(1) amortized time.
class BSTIterator {
  constructor(root) {
    this.stack = [];
    this._pushAllLeft(root);
  }
  
  _pushAllLeft(node) {
    while (node !== null) {
      this.stack.push(node);
      node = node.left;
    }
  }
  
  // return the next smallest number
  next() {
    const node = this.stack.pop();
    this._pushAllLeft(node.right);
    return node.val;
  }
  
  hasNext() {
    return this.stack.length > 0;
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "Why do most language standard libraries use Red-Black trees instead of AVL trees for their Map/Set implementations?",
        answer: "AVL trees provide faster lookups due to stricter balancing constraints (height difference <= 1). However, this strictness requires more frequent rotations during insertions and deletions. Red-Black trees allow a slightly looser balance (path lengths can differ by up to a factor of 2), which dramatically reduces the number of rotations needed when mutating the tree, making them better for general-purpose use where read/write ratios are mixed."
      },
      {
        question: "Explain what a Tree Rotation achieves.",
        answer: "A tree rotation changes the structure and heights of subtrees while preserving the strict Binary Search Tree ordering. A left rotation decreases the height of the right subtree and increases the height of the left subtree, effectively 'pulling up' the right side to balance the tree."
      },
      {
        question: "How would you flatten a Binary Search Tree to a sorted Doubly Linked List in-place?",
        answer: "You can perform an in-order traversal, keeping track of the previously visited node in a global or reference variable. For every current node, set previous.right = current and current.left = previous. This transforms the tree into a doubly linked list in O(N) time and O(H) space."
      },
      {
        question: "How does the BST Iterator achieve O(1) amortized time complexity for 'next()'?",
        answer: "The 'next()' method pops the top node from the stack, and then pushes all left children of the popped node's right child. While the internal push loop could take O(H) time in the worst case for a single call, across the entire iteration of N nodes, every node is pushed exactly once and popped exactly once. Thus, the average time per call is O(1)."
      },
      {
        question: "How do you find the Lowest Common Ancestor (LCA) of two nodes in a BST?",
        answer: "Because of the BST property, we start at the root. If both nodes are smaller than the root, the LCA must be in the left subtree. If both are larger, it's in the right subtree. If one is smaller and one is larger (or one equals the root), then the current node is guaranteed to be the LCA. This takes O(H) time without needing extra space."
      }
    ],
    practicalTask: {
      scenario: "Find the Kth smallest element in a BST.",
      task: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed).",
      solutionCode: "function kthSmallest(root, k) { let count = 0; let result = null; function traverse(node) { if(!node || result !== null) return; traverse(node.left); count++; if(count === k) { result = node.val; return; } traverse(node.right); } traverse(root); return result; }"
    }
  },
  {
    slug: 'intro-to-tries',
    title: 'Introduction to Tries (Prefix Trees)',
    order: 27,
    content: `
      <h2>1. The Problem with String Search</h2>
      <p>If you have a dictionary of a million words and need to find if a specific word exists, a Hash Set can do it in O(L) time, where L is the length of the word (since hashing the string takes O(L) time). But what if you need to find all words that <em>start with</em> a specific prefix, like "auto"? A Hash Set cannot help. You would have to scan the entire dataset. This is where <strong>Tries</strong> shine.</p>
      
      <h2>2. What is a Trie?</h2>
      <p>A Trie (pronounced "try"), or Prefix Tree, is a specialized N-ary tree used to store associative data structures, specifically strings. In a Trie, each node represents a single character. A path from the root down to a node represents a prefix or a complete string.</p>
      
      <h2>3. The Structure of a Trie Node</h2>
      <p>Instead of a standard <code>left</code> and <code>right</code> pointer, a Trie Node typically contains a Map or an Array of children (e.g., an array of size 26 for lowercase English letters). It also contains a boolean flag, <code>isEndOfWord</code>, to indicate if the path to this node constitutes a valid string inserted into the Trie.</p>
      
      <h2>4. Operations: Insert and Search</h2>
      <p>To insert a word, we start at the root and iterate through each character of the word. If the character path doesn't exist, we create a new node. Finally, we mark the last node's <code>isEndOfWord</code> as true. Searching follows the exact same logic.</p>

      <h2>5. Code Example: Implementing a Basic Trie</h2>
      <pre><code>
class TrieNode {
  constructor() {
    this.children = new Map(); // Using a Map allows for any character
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }
  
  // Time: O(L) where L is length of word. Space: O(L)
  insert(word) {
    let current = this.root;
    for (let char of word) {
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char);
    }
    current.isEndOfWord = true;
  }
  
  // Time: O(L). Space: O(1)
  search(word) {
    let current = this.root;
    for (let char of word) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return current.isEndOfWord;
  }
  
  // Time: O(L). Space: O(1)
  startsWith(prefix) {
    let current = this.root;
    for (let char of prefix) {
      if (!current.children.has(char)) {
        return false;
      }
      current = current.children.get(char);
    }
    return true; // We successfully traversed the prefix
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the time and space complexity of inserting a word into a Trie?",
        answer: "The time complexity is O(L), where L is the length of the word, because we process each character exactly once. The space complexity in the worst case (if the word shares no prefixes with existing words) is also O(L) because we must create L new TrieNodes."
      },
      {
        question: "Why use a Trie over a Hash Table for string storage?",
        answer: "A Hash Table is excellent for exact match lookups. However, a Trie allows for efficient Prefix matching (startsWith), alphabetical ordering (by traversing children in order), and it can sometimes use less memory than a Hash Table if many words share the same prefix (e.g., 'car', 'cart', 'card', 'care' all share the 'car' node)."
      },
      {
        question: "In what scenarios would using an Array of size 26 be better than a Map for Trie children?",
        answer: "If the dataset is strictly constrained to lowercase English letters, an Array of size 26 provides true O(1) contiguous memory access without the hashing overhead of a Map. However, a Map is vastly superior if the character set is large (e.g., Unicode) because an array for all Unicode characters at every node would cause explosive memory consumption."
      },
      {
        question: "What is the total space complexity of a Trie?",
        answer: "The total space complexity is O(N * L * C), where N is the number of words, L is the average length, and C is the alphabet size (if using arrays). In practice, because of prefix sharing, the actual space used is often much smaller than this theoretical upper bound."
      },
      {
        question: "Can Tries be used for routing algorithms?",
        answer: "Yes, specifically a variant called a Radix Tree (or Patricia Trie) is heavily used in IP routing tables to perform Longest Prefix Matching."
      }
    ],
    practicalTask: {
      scenario: "Implement an IP routing prefix match.",
      task: "Given an implementation of a Trie, write a function that takes an array of strings and returns the Longest Common Prefix amongst them.",
      solutionCode: "function longestCommonPrefix(words) { let trie = new Trie(); words.forEach(w => trie.insert(w)); let prefix = ''; let current = trie.root; while(current.children.size === 1 && !current.isEndOfWord) { let char = Array.from(current.children.keys())[0]; prefix += char; current = current.children.get(char); } return prefix; }"
    }
  },
  {
    slug: 'advanced-trie-operations',
    title: 'Advanced Trie Operations: Autocomplete and DFS Search',
    order: 28,
    content: `
      <h2>1. The Power of DFS in Tries</h2>
      <p>While basic lookups in a Trie are iterative, the true power of the Trie is unleashed when combined with Depth First Search (DFS). DFS allows us to explore all valid paths (words) originating from a specific node. This is the foundational algorithm for building an <strong>Autocomplete System</strong>.</p>
      
      <h2>2. Building Autocomplete</h2>
      <p>To implement autocomplete for a given prefix: 1) Traverse the Trie to the node representing the end of the prefix. 2) If the prefix exists, initiate a DFS starting from that node. 3) Every time you encounter a node with <code>isEndOfWord === true</code>, append the accumulated string to the results array.</p>
      
      <h2>3. Wildcard Matching (Regex-lite)</h2>
      <p>What if you need to search a dictionary for a word containing a wildcard character, e.g., <code>"b.d"</code> matching <code>"bad"</code>, <code>"bed"</code>, or <code>"bid"</code>? A Hash Map is completely useless here. But with a Trie, when we encounter the <code>"."</code> character, we recursively branch our search across <em>all</em> children of the current node.</p>
      
      <h2>4. Code Example: DFS and Wildcards</h2>
      <pre><code>
class AdvancedTrie {
  constructor() {
    this.root = { children: {}, isWord: false };
  }
  
  insert(word) {
    let node = this.root;
    for (let c of word) {
      if (!node.children[c]) node.children[c] = { children: {}, isWord: false };
      node = node.children[c];
    }
    node.isWord = true;
  }
  
  // Autocomplete functionality
  getWordsWithPrefix(prefix) {
    let node = this.root;
    for (let c of prefix) {
      if (!node.children[c]) return [];
      node = node.children[c];
    }
    
    const results = [];
    // DFS to find all words originating from this prefix node
    const dfs = (currentNode, currentString) => {
      if (currentNode.isWord) results.push(currentString);
      for (let char in currentNode.children) {
        dfs(currentNode.children[char], currentString + char);
      }
    };
    
    dfs(node, prefix);
    return results;
  }

  // Wildcard search with '.'
  searchWildcard(word) {
    const dfs = (index, node) => {
      if (index === word.length) return node.isWord;
      
      const char = word[index];
      if (char === '.') {
        // Branch to all children
        for (let key in node.children) {
          if (dfs(index + 1, node.children[key])) return true;
        }
        return false;
      } else {
        if (!node.children[char]) return false;
        return dfs(index + 1, node.children[char]);
      }
    };
    return dfs(0, this.root);
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "How does the time complexity of a Wildcard Search in a Trie compare to an exact search?",
        answer: "An exact search takes O(L) time. A wildcard search using '.' requires checking every possible child at that position. In the worst case (e.g., searching for '.....'), the search degenerates into an exhaustive DFS of the entire Trie, which takes O(N * L) time where N is the total number of words."
      },
      {
        question: "How would you optimize the Autocomplete function to quickly return the top 3 most frequently searched words?",
        answer: "To optimize autocomplete, instead of just an 'isWord' flag, each Trie node can store a cache or a Max Heap of the top 3 most frequent words that pass through that node. This trades memory for speed, allowing the system to return the top 3 words in O(L) time without needing to run a DFS."
      },
      {
        question: "Explain the process of deleting a word from a Trie.",
        answer: "Deletion requires a post-order traversal (recursive). We navigate to the end of the word and set 'isWord = false'. On the way back up, we check if the current node has no children AND 'isWord === false'. If both are true, we can safely delete that node from its parent's map to free memory. If it has children, it's part of another word and we must leave it intact."
      },
      {
        question: "What is a Radix Tree (Compact Prefix Tree)?",
        answer: "A Radix Tree optimizes standard Tries by merging nodes that have only one child. Instead of edges representing a single character, edges represent a string of characters. This drastically reduces the memory overhead for long strings with unique suffixes."
      },
      {
        question: "How would you implement a spell checker using a Trie?",
        answer: "You can populate the Trie with a dictionary. To find corrections for a misspelled word, you perform a DFS with an 'Edit Distance' limit. At each node, you calculate the Levenshtein distance. If the distance exceeds your limit (e.g., 2 typos), you prune that branch. If you reach a valid word within the limit, you add it to the suggestions."
      }
    ],
    practicalTask: {
      scenario: "Design a data structure that adds and searches words, supporting the '.' wildcard.",
      task: "Implement the WordDictionary class with 'addWord(word)' and 'search(word)' functions.",
      solutionCode: "class WordDictionary { constructor() { this.trie = new AdvancedTrie(); } addWord(word) { this.trie.insert(word); } search(word) { return this.trie.searchWildcard(word); } }"
    }
  },
  {
    slug: 'rolling-hash-rabin-karp',
    title: 'Pattern Matching and Hashing (Rabin-Karp Algorithm)',
    order: 29,
    content: `
      <h2>1. The Substring Search Problem</h2>
      <p>Given a long text of length N and a pattern of length M, how do you find the pattern in the text? The brute force approach takes O(N * M) time by comparing every character at every starting position. The <strong>Rabin-Karp Algorithm</strong> cleverly uses hashing to reduce the average time complexity to O(N + M).</p>
      
      <h2>2. The Concept of a Rolling Hash</h2>
      <p>If we hash the pattern (length M), we can slide a window of size M across the text and hash each window. If the window hash matches the pattern hash, we do a character-by-character comparison to ensure it's not a collision. But recalculating a hash for every window from scratch takes O(M) time, resulting in O(N * M) again.</p>
      <p>A <strong>Rolling Hash</strong> allows us to compute the hash of the next window in O(1) time using the hash of the previous window. We "roll" the window forward by subtracting the value of the outgoing character and adding the value of the incoming character.</p>
      
      <h2>3. Implementing the Math</h2>
      <p>The hash is calculated by treating the string as a number in a specific base (e.g., base 256 for ASCII). We use a large prime modulus to prevent integer overflow. <br><code>Hash = (C1 * B^2 + C2 * B^1 + C3 * B^0) % Modulus</code></p>
      <p>To roll the hash from "ABC" to "BCD", we subtract 'A' times B^2, multiply the remainder by B, and add 'D'.</p>

      <h2>4. Code Example: Rabin-Karp Substring Search</h2>
      <pre><code>
// Time Complexity: O(N + M) average, O(N * M) worst case (too many collisions)
// Space Complexity: O(1)
function rabinKarp(text, pattern) {
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || m > n) return -1;
  
  const BASE = 256;
  const MOD = 101; // Large prime number
  
  let patternHash = 0;
  let windowHash = 0;
  let h = 1;
  
  // The value of h would be "Math.pow(BASE, m-1) % MOD"
  for (let i = 0; i < m - 1; i++) {
    h = (h * BASE) % MOD;
  }
  
  // Calculate initial hashes for pattern and first window
  for (let i = 0; i < m; i++) {
    patternHash = (BASE * patternHash + pattern.charCodeAt(i)) % MOD;
    windowHash = (BASE * windowHash + text.charCodeAt(i)) % MOD;
  }
  
  // Slide the window over the text
  for (let i = 0; i <= n - m; i++) {
    // If hashes match, verify character by character to handle collisions
    if (patternHash === windowHash) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }
      if (match) return i; // Found match at index i
    }
    
    // Calculate hash for next window (Rolling Hash)
    if (i < n - m) {
      windowHash = (BASE * (windowHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % MOD;
      // We might get negative value of windowHash, convert it to positive
      if (windowHash < 0) {
        windowHash = (windowHash + MOD);
      }
    }
  }
  return -1; // Not found
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "Explain why Rabin-Karp is better than Brute Force string matching.",
        answer: "Brute force takes O(N * M) by strictly comparing character strings. Rabin-Karp calculates an integer hash of the pattern, and then uses a Rolling Hash to calculate the hash of the text window in O(1) time. Comparing two integers is O(1). We only do the O(M) string comparison when the hashes match, bringing the average time to O(N + M)."
      },
      {
        question: "What happens if there are many hash collisions in Rabin-Karp?",
        answer: "If the hash function produces many collisions (e.g., due to a small modulus or poor base), the algorithm will frequently trigger the O(M) character-by-character verification. In the worst-case scenario where every window causes a collision, the time complexity degrades entirely to O(N * M)."
      },
      {
        question: "Why do we use a prime number for the Modulus in hashing?",
        answer: "Using a prime number for modulo arithmetic ensures that the hashes are distributed as uniformly as possible across the integer spectrum, drastically reducing the probability of collisions (Spurious Hits) when sliding the window."
      },
      {
        question: "How is the Knuth-Morris-Pratt (KMP) algorithm different from Rabin-Karp?",
        answer: "KMP uses deterministic finite automata logic (an LPS or Longest Prefix Suffix array) to determine exactly how far to shift the window when a mismatch occurs. KMP guarantees an O(N + M) worst-case time complexity, whereas Rabin-Karp relies on mathematical hashing and can degrade to O(N * M) worst-case. However, Rabin-Karp easily extends to 2D pattern matching."
      },
      {
        question: "What is an application of a Rolling Hash outside of standard substring matching?",
        answer: "Rolling hashes are heavily used in plagiarism detection systems (like MOSS) and in finding the Longest Duplicated Substring in a document. They are also used in bioinformatics for matching DNA sequences efficiently."
      }
    ],
    practicalTask: {
      scenario: "Find if an anagram of a pattern exists in a string.",
      task: "Given two strings s1 and s2, return true if s2 contains a permutation of s1. (Hint: Use a sliding window with a frequency map, which is a conceptual cousin to the rolling hash).",
      solutionCode: "function checkInclusion(s1, s2) { let map1 = Array(26).fill(0); let map2 = Array(26).fill(0); for(let c of s1) map1[c.charCodeAt(0)-97]++; for(let i=0; i<s2.length; i++) { map2[s2.charCodeAt(i)-97]++; if(i >= s1.length) map2[s2.charCodeAt(i-s1.length)-97]--; if(map1.join() === map2.join()) return true; } return false; }"
    }
  },
  {
    slug: 'system-design-hashing-trees',
    title: 'System Design: Consistent Hashing and B-Trees',
    order: 30,
    content: `
      <h2>1. DSA Scaling to Systems</h2>
      <p>Data Structures are not just for passing algorithmic interviews; they form the bedrock of distributed system architectures. When dealing with terabytes of data across hundreds of servers, Hash Tables and Trees are evolved into distributed concepts.</p>
      
      <h2>2. The Problem with Standard Load Balancing Hashing</h2>
      <p>If you have N cache servers and you use standard hashing: <code>serverIndex = hash(key) % N</code>. What happens when a server crashes, or you scale up to N+1 servers? The modulo changes for <em>every single key</em>. Almost all cached data becomes invalidated simultaneously, causing a cache miss stampede that crushes your database. The solution is <strong>Consistent Hashing</strong>.</p>
      
      <h2>3. Consistent Hashing</h2>
      <p>Consistent Hashing maps both the servers and the keys onto an abstract Hash Ring (a circle ranging from 0 to 2^32 - 1). A key is assigned to the first server it encounters by moving clockwise on the ring. If a server is added or removed, only the keys adjacent to it on the ring are remapped. The rest of the keys (usually K/N) remain perfectly intact. We add "Virtual Nodes" to ensure even distribution of keys across servers.</p>

      <h2>4. Database Indexing: B-Trees</h2>
      <p>Why do databases (like MySQL and PostgreSQL) use B-Trees for their indexes instead of AVL or Red-Black trees? A standard BST node stores 1 value and has 2 children. Searching 1 billion records requires navigating a tree height of ~30. In RAM, traversing 30 pointers is instant. But databases store data on Hard Drives (Disk).</p>
      <p>Disk I/O is notoriously slow. A <strong>B-Tree</strong> (and its variant B+Tree) is an ultra-wide, flat N-ary tree. A single node (page) can contain hundreds of keys and children. Finding a record out of a billion might only require navigating a height of 3 or 4. Furthermore, by loading a whole disk block (page) into memory at once, we exploit spatial locality. In B+ Trees, all data is located at the leaf nodes, which are linked together in a linked list for incredibly fast range queries (e.g., <code>SELECT * WHERE age BETWEEN 20 AND 30</code>).</p>
    `,
    interviewQuestions: [
      {
        question: "Explain what Consistent Hashing solves in a distributed caching system.",
        answer: "It solves the massive cache invalidation problem that occurs when servers are added or removed dynamically. By mapping servers and keys to a Hash Ring, removing a server only shifts its specific subset of keys to the next clockwise server, leaving the rest of the cluster's cache mappings completely intact."
      },
      {
        question: "What are 'Virtual Nodes' in Consistent Hashing?",
        answer: "If you only have 3 servers on a huge Hash Ring, the distribution of keys might be highly uneven. Virtual Nodes map a single physical server to multiple points on the hash ring (e.g., Server A is hashed as A1, A2, A3). This interleaves the servers and ensures a statistically uniform distribution of the data load."
      },
      {
        question: "Why are B-Trees preferred over Binary Search Trees for Disk storage?",
        answer: "BSTs are deep and narrow, causing many individual pointer jumps. Each pointer jump to a child might require a slow Disk I/O seek. B-Trees are shallow and wide (high fan-out). A node is sized exactly to a disk block (e.g., 4KB or 8KB). A single disk read loads hundreds of keys into RAM, minimizing the number of expensive disk accesses required to reach the target."
      },
      {
        question: "What is the difference between a B-Tree and a B+Tree?",
        answer: "In a B-Tree, both internal nodes and leaf nodes can store the actual data row. In a B+Tree, internal nodes ONLY store routing keys; all actual data/pointers to disk rows are stored exclusively at the leaf level. Additionally, B+Tree leaves are connected sequentially via linked-list pointers, making range queries exceptionally fast."
      },
      {
        question: "What is a Bloom Filter?",
        answer: "A Bloom Filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It uses multiple hash functions to set bits in an array. False positives are possible (it might say an item is in the set when it isn't), but false negatives are impossible (if it says the item is NOT in the set, it is definitively not). It is used heavily in databases to prevent unnecessary disk lookups for non-existent rows."
      }
    ],
    practicalTask: {
      scenario: "Design an abstract Hash Ring logic.",
      task: "Given an array of server IDs and a key, return the server ID responsible for that key using a basic sorted array to simulate the ring.",
      solutionCode: "class HashRing { constructor(servers) { this.servers = servers.sort((a,b) => a-b); } getServer(keyHash) { for(let s of this.servers) { if(s >= keyHash) return s; } return this.servers[0]; } }"
    }
  }
];

appendDsaTopics(topics);
