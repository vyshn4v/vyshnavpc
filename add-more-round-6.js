import { appendQuestions } from './appendQuestions.js';

const categories = [
  {
    categoryName: "Tries",
    questions: [
      {
        difficulty: "Hard",
        question: "Design a Search Autocomplete System. The user can input a character, and the system should return top 3 historical hot sentences.",
        expectedAnswer: "Maintain a Trie where each node stores the sentences that pass through it and their frequencies. As the user types, traverse the Trie. When the user completes a sentence (indicated by a special character like '#'), update the frequencies and restructure the top sentences in the Trie if necessary.",
        redFlags: ["Using only a hash map for prefix matching (too slow).", "Sorting all sentences with the prefix on every keystroke (O(N*L log(N*L)) complexity)."],
        bonusPoints: ["Storing top 3 queries at each node to optimize lookup time to O(1) for autocomplete.", "Mentioning handling of dynamically updating frequencies efficiently."]
      },
      {
        difficulty: "Hard",
        question: "Given a 2D board of letters and a list of words, find all words on the board (Word Search II).",
        expectedAnswer: "Build a Trie from the list of words to efficiently check if a prefix exists on the board. Then, use backtracking (DFS) starting from each cell on the board. As we traverse, move down the Trie. If a Trie node represents the end of a word, we found a match.",
        redFlags: ["Running a separate DFS for every single word in the list (O(W * M * N * 4^L) complexity).", "Failing to mark visited cells properly in the DFS matrix."],
        bonusPoints: ["Optimizing by removing words from the Trie once they are found to prune the search tree early.", "Modifying the board directly to mark visited cells instead of using a separate visited matrix."]
      },
      {
        difficulty: "Hard",
        question: "Given an integer array, return the maximum result of num1 XOR num2, where num1 and num2 are in the array.",
        expectedAnswer: "Insert the binary representation of each number (padded to 32 bits) into a Trie. Then, for each number, try to maximize the XOR by traversing the Trie and greedily picking the opposite bit at each step (if it exists).",
        redFlags: ["Providing an O(N^2) brute force solution and getting stuck there.", "Not padding binary representations to a fixed 32-bit length."],
        bonusPoints: ["Explaining the O(N * 32) time complexity and O(N * 32) space complexity.", "Mentioning that we can stop early if we find a perfect complement."]
      },
      {
        difficulty: "Medium",
        question: "Implement a data structure that supports adding words and searching for words, where the search word can contain the dot '.' character to represent any one letter.",
        expectedAnswer: "Use a Trie. For 'addWord', perform standard Trie insertion. For 'search', if the character is a regular letter, traverse down the corresponding child. If it's a dot '.', recursively check all children of the current node.",
        redFlags: ["Failing to handle the '.' character recursively.", "Not considering edge cases like trailing '.' or consecutive dots."],
        bonusPoints: ["Discussing time complexity of search in the worst case with many dots (O(26^L) where L is the length of the word).", "Optimizing memory by pruning redundant branches."]
      }
    ]
  },
  {
    categoryName: "Graph Algorithms",
    questions: [
      {
        difficulty: "Medium",
        question: "Given 'numCourses' and a list of prerequisites pairs [course A, course B] indicating you must take B before A, return the ordering of courses to take. If impossible, return an empty array.",
        expectedAnswer: "This requires topological sorting. We can use Kahn's Algorithm (BFS with indegrees) or DFS with cycle detection (using three states: unvisited, visiting, visited). If Kahn's algorithm processes all nodes, there's no cycle. If DFS encounters a 'visiting' node, a cycle exists.",
        redFlags: ["Not realizing this is a cycle detection and topological sort problem.", "Only checking for cycles but failing to output the correct topological order."],
        bonusPoints: ["Implementing both DFS and Kahn's algorithm or articulating the differences.", "Handling disconnected graphs properly."]
      },
      {
        difficulty: "Medium",
        question: "In a network of 'N' nodes, connections are represented as edges in an undirected graph. One edge was added to a tree, creating a cycle. Find and remove that edge.",
        expectedAnswer: "Use a Disjoint Set Union (DSU) data structure. Iterate through the edges, and for each edge (u, v), find their parents. If they have the same parent, this edge creates a cycle and is the redundant one. Otherwise, union the two sets.",
        redFlags: ["Using DFS/BFS for cycle detection when DSU is cleaner and more optimal.", "Not implementing path compression or union by rank in the DSU."],
        bonusPoints: ["Explaining Inverse Ackermann function time complexity for DSU operations.", "Discussing how to adapt this if the graph was a directed graph (which becomes much harder)."]
      },
      {
        difficulty: "Hard",
        question: "How do you detect a negative-weight cycle in a directed graph representing arbitrage opportunities in currency exchange?",
        expectedAnswer: "Use the Bellman-Ford algorithm. Initialize distances to infinity (except the start node). Relax all edges V-1 times. Then, iterate through all edges one more time. If any edge can still be relaxed, the graph contains a negative-weight cycle.",
        redFlags: ["Suggesting Dijkstra's algorithm (which fails on negative weights).", "Failing to explain the \"V-1 iterations\" property of Bellman-Ford."],
        bonusPoints: ["Explaining why log transformation of exchange rates maps arbitrage to a negative weight cycle.", "Discussing the Floyd-Warshall algorithm as an alternative for dense graphs."]
      },
      {
        difficulty: "Hard",
        question: "You are given a large distributed system architecture with service dependencies. Detect if a deadlock (cyclic dependency) exists dynamically.",
        expectedAnswer: "Model the services and waits-for relationships as a directed graph. Periodically run a cycle detection algorithm (like Tarjan's SCC algorithm or DFS with recursion stack tracking) to find any cycles. Alternatively, use a distributed cycle detection protocol like Chandy-Misra-Haas.",
        redFlags: ["Suggesting a centralized DFS without considering the distributed nature or latency.", "Not handling the case where edges are added dynamically over time."],
        bonusPoints: ["Mentioning Tarjan's Strongly Connected Components algorithm for finding the exact cycle.", "Discussing distributed deadlock detection algorithms in real-world systems."]
      }
    ]
  },
  {
    categoryName: "Sliding Window",
    questions: [
      {
        difficulty: "Hard",
        question: "Given an array of integers and a window of size 'k', return an array containing the maximum value of each window as it slides from left to right.",
        expectedAnswer: "Use a Monotonic Decreasing Deque. Store indices in the deque. For each element, remove indices from the back of the deque if their corresponding values are smaller than the current element. Then, remove indices from the front if they fall outside the window of size 'k'. The front of the deque always holds the max for the current window.",
        redFlags: ["Using a naive O(N*K) approach scanning each window.", "Using a Max-Heap which results in O(N log K) time with lazy deletion, failing to mention the O(N) deque approach."],
        bonusPoints: ["Clearly explaining why elements smaller than the incoming element can be safely discarded.", "Achieving strictly O(N) time complexity."]
      },
      {
        difficulty: "Hard",
        question: "Given two strings S and T, return the minimum window substring of S such that every character in T (including duplicates) is included in the window.",
        expectedAnswer: "Use two pointers to create a sliding window. Use a hash map to keep track of character frequencies in T. Expand the right pointer to include characters until all required characters are satisfied. Then, shrink the left pointer as much as possible while maintaining the requirement, updating the minimum window seen so far.",
        redFlags: ["Failing to handle duplicate characters in T correctly.", "Not optimizing the check for 'is valid window' (e.g., iterating over the entire hash map every time instead of maintaining a 'matched' counter)."],
        bonusPoints: ["Using an array of size 128 (ASCII) instead of a hash map for better constant time performance.", "Providing a clean and bug-free implementation of the left pointer shrinkage."]
      },
      {
        difficulty: "Hard",
        question: "Given an integer array nums and an integer k, return the number of good subarrays (subarrays with exactly k different integers).",
        expectedAnswer: "Convert 'exactly K' to 'at most K' minus 'at most K - 1'. Implement a helper function `atMostK(nums, k)` using a sliding window. The window expands to include elements, keeping a frequency map. When the number of distinct elements exceeds k, shrink the window from the left. Add `right - left + 1` to the count at each step.",
        redFlags: ["Trying to solve 'exactly K' directly with a single sliding window without a complex data structure.", "O(N^2) brute force generation of subarrays."],
        bonusPoints: ["Explaining the mathematical reasoning behind why `right - left + 1` represents the number of valid subarrays ending at `right`.", "Writing highly modular code utilizing a generic `atMostK` function."]
      },
      {
        difficulty: "Hard",
        question: "Find the longest substring with at most K distinct characters.",
        expectedAnswer: "Use a sliding window. Expand the right pointer, adding characters to a frequency map. If the size of the frequency map exceeds K, increment the left pointer and decrease frequencies (removing keys if frequency drops to 0) until the map size is K or less. Keep track of the max length.",
        redFlags: ["Restarting the left pointer instead of sliding it gradually.", "Not properly deleting keys from the map when frequency hits zero, leading to an incorrect distinct character count."],
        bonusPoints: ["Suggesting an ordered dictionary or custom doubly-linked-list for O(1) eviction if the alphabet size was unbounded.", "Handling edge cases like K=0."]
      }
    ]
  },
  {
    categoryName: "Dynamic Programming on Strings",
    questions: [
      {
        difficulty: "Medium",
        question: "Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) required to convert word1 to word2 (Edit Distance).",
        expectedAnswer: "Use a 2D DP table where dp[i][j] represents the edit distance between the first i characters of word1 and first j characters of word2. If characters match, dp[i][j] = dp[i-1][j-1]. If they don't, dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for delete, insert, and replace.",
        redFlags: ["Struggling to define the recursive state or transition function.", "Not handling the base cases properly (empty string conversions)."],
        bonusPoints: ["Optimizing the space complexity from O(M*N) to O(N) by only keeping two rows in memory.", "Explaining real-world applications like spell checkers or DNA sequence alignment."]
      },
      {
        difficulty: "Hard",
        question: "Implement regular expression matching with support for '.' (matches any single character) and '*' (matches zero or more of the preceding element).",
        expectedAnswer: "Use DP. dp[i][j] is true if text[0..i-1] matches pattern[0..j-1]. Handle '*' by looking back 2 characters in the pattern (zero occurrences). Or, if the preceding character matches the current text character, look at dp[i-1][j] (one or more occurrences).",
        redFlags: ["Confusing this with wildcard matching (where '*' matches any sequence).", "Failing to handle the case where '*' matches zero occurrences."],
        bonusPoints: ["Explaining the recursive backtracking approach with memoization vs bottom-up DP.", "Writing concise and elegant transitions."]
      },
      {
        difficulty: "Medium",
        question: "Given a string s, find the longest palindromic subsequence's length in s.",
        expectedAnswer: "Use a 2D DP table. dp[i][j] is the length of LPS for substring s[i..j]. Base cases: dp[i][i] = 1. If s[i] == s[j], dp[i][j] = 2 + dp[i+1][j-1]. Otherwise, dp[i][j] = max(dp[i+1][j], dp[i][j-1]). Fill the table diagonally or backwards.",
        redFlags: ["Confusing subsequence with substring (where elements must be contiguous).", "Getting the iteration order wrong in bottom-up DP (must ensure smaller subproblems are solved first)."],
        bonusPoints: ["Noting the alternative approach: finding the Longest Common Subsequence (LCS) between the string and its reverse.", "Optimizing space complexity to O(N) using a 1D array."]
      }
    ]
  }
];

(async () => {
  try {
    await appendQuestions('round-6', categories);
    console.log("Successfully ran add-more-round-6.js");
  } catch (error) {
    console.error("Error executing script:", error);
    process.exit(1);
  }
  process.exit(0);
})();
