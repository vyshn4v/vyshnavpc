import { appendDsaTopics } from "./dsa-seeder-utils.js";

const topics = [
  {
    slug: "arrays-memory-layout-dynamic",
    title: "Arrays: Memory Layout, Dynamic Resizing, and Operations Under the Hood",
    order: 6,
    content: `
      <h2>The Physical Reality of Arrays</h2>
      <p>An array is the most fundamental data structure. In low-level languages like C, an array is a contiguous block of memory. If you declare an array of 5 integers, the operating system reserves 5 adjacent memory slots. Because they are adjacent, the computer can instantly jump to any index via simple math: <code>MemoryAddress = BaseAddress + (Index * ElementSize)</code>.</p>
      
      <h3>Static vs Dynamic Arrays</h3>
      <p>JavaScript uses <strong>Dynamic Arrays</strong>. You do not need to specify a size upfront. Under the hood, JS engines (like V8) allocate a fixed block of memory. When that block gets full, the engine creates a new, larger block (usually double the size), copies the old elements over, and deletes the old block. This resizing is an O(N) operation, but because it happens rarely, appending an element is <em>Amortized O(1)</em> time.</p>

      <h3>Operation Complexities</h3>
      <ul>
        <li><strong>Read / Write (arr[i] = x):</strong> O(1) - Instant access via math.</li>
        <li><strong>Push / Pop (End of Array):</strong> O(1) Amortized - Usually instant, unless a resize occurs.</li>
        <li><strong>Shift / Unshift (Start of Array):</strong> O(N) - <em>Danger!</em> Inserting or deleting at the beginning forces every other element to shift index, costing O(N) time.</li>
        <li><strong>Splice / Middle Insertion:</strong> O(N) - Similar to shift, elements after the insertion point must be moved.</li>
      </ul>

      <pre><code>
// Under the hood representation of Unshift
function manualUnshift(arr, val) {
  // O(N) Time
  for (let i = arr.length; i > 0; i--) {
    arr[i] = arr[i - 1]; // Shift right
  }
  arr[0] = val;
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is Amortized O(1) time?",
        answer: "Amortized time averages out the cost of expensive operations over a sequence of cheap ones. In dynamic arrays, appending is usually O(1), but occasionally O(N) during a resize. Over many appends, the cost per operation averages out to O(1)."
      },
      {
        question: "Why should you avoid using Array.shift() inside a loop in JavaScript?",
        answer: "Array.shift() removes the first element and shifts all remaining elements left, taking O(N) time. Doing this in an O(N) loop results in an O(N^2) algorithm. Use a pointer or a true Queue data structure instead."
      },
      {
        question: "How does a JS engine optimize arrays containing mixed data types?",
        answer: "JS engines try to optimize arrays as dense, contiguous memory (like C++ Vectors) if elements are of the same type. If you mix types or leave holes (sparse arrays), the engine downgrades the array to a Hash Dictionary, making access slower."
      },
      {
        question: "How is an array different from a Linked List in memory?",
        answer: "Arrays are contiguous in memory, allowing O(1) index access but slow O(N) insertions/deletions. Linked Lists are scattered in memory, connected by pointers, allowing O(1) insertions/deletions but slow O(N) access because you must traverse from the head."
      },
      {
        question: "Can an array have a negative index in JavaScript?",
        answer: "In standard JS arrays, negative indices do not work as they do in Python (e.g., arr[-1]). If you assign arr[-1] = 'x', you are actually adding a string key '-1' to the underlying Array object, not a numeric index."
      }
    ],
    practicalTask: {
      scenario: "You need to empty an existing array without changing its reference in memory.",
      task: "Show the most efficient way to clear an array in JS.",
      solutionCode: "function clearArray(arr) {\n  // Setting length to 0 truncates the array instantly.\n  arr.length = 0;\n  return arr;\n}"
    }
  },
  {
    slug: "advanced-array-techniques",
    title: "Advanced Array Techniques: Prefix Sums, Kadane's Algorithm, Dutch National Flag",
    order: 7,
    content: `
      <h2>Prefix Sum Array</h2>
      <p>A Prefix Sum array allows you to answer range sum queries in O(1) time after an O(N) preprocessing step. <code>prefix[i]</code> stores the sum of all elements from index 0 to i.</p>
      <pre><code>
// Preprocessing O(N)
function buildPrefix(arr) {
  let prefix = new Array(arr.length);
  prefix[0] = arr[0];
  for(let i=1; i < arr.length; i++){
    prefix[i] = prefix[i-1] + arr[i];
  }
  return prefix;
}
// Query O(1) sum from i to j
// sum = prefix[j] - prefix[i-1]
      </code></pre>

      <h2>Kadane's Algorithm</h2>
      <p>Kadane's algorithm solves the Maximum Subarray problem (finding the contiguous subarray with the largest sum) in O(N) time and O(1) space. The mental model: At any index, do I extend the previous subarray, or start a new one here?</p>
      <pre><code>
function maxSubArray(nums) {
  let currentMax = nums[0];
  let globalMax = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // Should I add nums[i] to the existing chain, or start fresh at nums[i]?
    currentMax = Math.max(nums[i], currentMax + nums[i]);
    globalMax = Math.max(globalMax, currentMax);
  }
  return globalMax;
}
      </code></pre>

      <h2>Dutch National Flag Algorithm</h2>
      <p>Invented by Edsger Dijkstra, this algorithm sorts an array of 0s, 1s, and 2s in a single O(N) pass using O(1) space. It uses 3 pointers: low, mid, and high.</p>
      <pre><code>
function sortColors(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 1) {
      mid++;
    } else {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;
    }
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "When is a Prefix Sum array useful?",
        answer: "Prefix Sums are crucial when you need to query the sum of various subarrays multiple times. Without it, each query is O(N). With it, preprocessing takes O(N) once, and every subsequent query is O(1)."
      },
      {
        question: "Explain the intuition behind Kadane's Algorithm.",
        answer: "The intuition is that a negative subarray sum will never improve the sum of a future subarray. Therefore, if our running sum becomes less than the current element itself, we discard the running sum and start a new subarray at the current element."
      },
      {
        question: "Can Kadane's Algorithm handle an array of all negative numbers?",
        answer: "Yes, standard Kadane's handles all negatives perfectly. The currentMax will reset to the least negative number, and the globalMax will correctly record the maximum single negative element rather than 0."
      },
      {
        question: "What is the time complexity of the Dutch National Flag algorithm?",
        answer: "O(N) Time and O(1) Space. We traverse the array exactly once. The mid pointer never moves backward."
      },
      {
        question: "Why use Array destructuring for swapping variables?",
        answer: "Array destructuring `[a, b] = [b, a]` is syntactic sugar that makes swapping elegant and readable without requiring a temporary variable, though under the hood the JS engine handles the temporary storage."
      }
    ],
    practicalTask: {
      scenario: "Find the equilibrium index of an array (where sum of elements on left equals sum on right).",
      task: "Use a modified prefix sum approach in O(N) time and O(1) space.",
      solutionCode: "function pivotIndex(nums) {\n  let totalSum = nums.reduce((a, b) => a + b, 0);\n  let leftSum = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (leftSum === totalSum - leftSum - nums[i]) return i;\n    leftSum += nums[i];\n  }\n  return -1;\n}"
    }
  },
  {
    slug: "strings-encodings-immutability",
    title: "Strings: Encodings, Immutability, and Memory Footprint",
    order: 8,
    content: `
      <h2>The Illusion of Strings</h2>
      <p>Strings seem like a distinct data type, but structurally, they are just arrays of characters. However, there is one massive difference in languages like JavaScript, Java, and Python: <strong>Immutability</strong>.</p>
      
      <h3>Immutability</h3>
      <p>Once a string is created in memory, it cannot be changed. If you try to capitalize the first letter, the language allocates a completely new string in memory and garbage collects the old one. This has severe performance implications.</p>
      <pre><code>
let str = "hello";
str[0] = "H"; // FAILS silently, str is still "hello"

// To change it, a NEW string must be created: O(N) Time
str = "H" + str.slice(1);
      </code></pre>

      <h3>String Concatenation in Loops</h3>
      <p>Because strings are immutable, concatenating a string inside a loop is dangerous. In older engines or languages like Java, <code>str += "a"</code> inside an O(N) loop creates a new string every time, resulting in O(N^2) time complexity. Modern JS engines optimize this, but the best practice is to push to an array and use <code>join()</code>.</p>
      <pre><code>
// Safer, universally O(N) approach
function buildString(n) {
  let arr = [];
  for(let i=0; i<n; i++){
    arr.push("a");
  }
  return arr.join("");
}
      </code></pre>

      <h3>Encodings: ASCII vs Unicode</h3>
      <p>ASCII uses 7 bits and can represent 128 characters. Unicode (specifically UTF-16 in JavaScript) allows for emojis and international characters. Emojis often take up 2 or 4 bytes (surrogate pairs), meaning <code>"🍎".length</code> might return 2, not 1!</p>
    `,
    interviewQuestions: [
      {
        question: "Why are Strings immutable?",
        answer: "Immutability makes strings thread-safe, prevents security vulnerabilities, and allows string interning (caching identical strings in memory to save space). Since they cannot change, the engine can safely reuse the exact same memory pointer for identical strings."
      },
      {
        question: "What is string interning?",
        answer: "String interning is an optimization technique where the engine stores only one copy of a distinct string value. If you declare `let a = 'test'; let b = 'test';`, both point to the same memory address."
      },
      {
        question: "Why does an Emoji sometimes have a length of 2 in JavaScript?",
        answer: "JavaScript strings are historically UTF-16 encoded. Standard characters fit in a single 16-bit code unit (length 1). Many emojis require two 16-bit code units (a surrogate pair) to be represented, thus returning length 2."
      },
      {
        question: "How do you reverse a string efficiently in JS?",
        answer: "By splitting it into an array, reversing the array in-place, and joining it back: `str.split('').reverse().join('')`. This takes O(N) time and O(N) space."
      },
      {
        question: "What is the Big O of str.substring(i, j)?",
        answer: "Creating a substring requires allocating a new string and copying the characters over. Therefore, the time complexity is O(K), where K is the length of the substring (j - i)."
      }
    ],
    practicalTask: {
      scenario: "Safely iterate over a string that might contain emojis (Surrogate pairs).",
      task: "Use a modern JS construct to iterate over true characters, not UTF-16 code units.",
      solutionCode: "function iterateEmojis(str) {\n  // Using the iterable protocol (for...of) correctly handles surrogate pairs\n  for (let char of str) {\n    console.log(char);\n  }\n  // Alternatively, Array.from(str) converts it correctly.\n}"
    }
  },
  {
    slug: "string-algorithms-anagrams",
    title: "String Algorithms: Substrings, Anagrams, and Palindromes",
    order: 9,
    content: `
      <h2>Palindromes</h2>
      <p>A palindrome reads the same forwards and backwards. The optimal way to check for a palindrome is the <strong>Two Pointers</strong> pattern, moving from the outside in. Time: O(N), Space: O(1).</p>
      <pre><code>
function isPalindrome(str) {
  let left = 0, right = str.length - 1;
  while(left < right) {
    if(str[left] !== str[right]) return false;
    left++; right--;
  }
  return true;
}
      </code></pre>

      <h2>Anagrams</h2>
      <p>An anagram is formed by rearranging the letters of another word. The optimal way to check anagrams is using the <strong>Frequency Counter</strong> pattern. Time: O(N), Space: O(1) (since the alphabet is fixed at 26 characters).</p>
      <pre><code>
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(val => val === 0);
}
      </code></pre>

      <h2>Longest Palindromic Substring</h2>
      <p>Finding the longest palindrome within a string usually requires an "Expand From Center" approach. For every character, pretend it is the center of a palindrome and expand outwards. This takes O(N^2) time and O(1) space.</p>
      <pre><code>
function longestPalindrome(s) {
  let start = 0, maxLength = 0;
  
  function expandAroundCenter(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      let currentLength = right - left + 1;
      if (currentLength > maxLength) {
        maxLength = currentLength;
        start = left;
      }
      left--; right++;
    }
  }
  
  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i);     // Odd length palindromes
    expandAroundCenter(i, i + 1); // Even length palindromes
  }
  
  return s.substring(start, start + maxLength);
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "Why is the space complexity for checking Anagrams considered O(1) when using a Frequency Array?",
        answer: "Because the size of the array is fixed to the size of the character set (e.g., 26 for lowercase English letters). It does not grow as the input string N grows. O(26) simplifies to O(1)."
      },
      {
        question: "Why do we check both odd and even length palindromes in the 'Expand From Center' algorithm?",
        answer: "A palindrome can have a single center character (e.g., 'aba' -> center 'b') which is odd-length, or it can be mirrored between two characters (e.g., 'abba' -> center between 'b' and 'b') which is even-length. We must check both possibilities."
      },
      {
        question: "Is it possible to find the Longest Palindromic Substring in O(N) time?",
        answer: "Yes, using Manacher's Algorithm. However, it is extremely complex and rarely expected in standard FAANG interviews. The O(N^2) 'Expand From Center' approach is the expected optimal solution."
      },
      {
        question: "What is the difference between Substring and Subsequence?",
        answer: "A Substring must be contiguous (e.g., 'abc' is a substring of 'abcde'). A Subsequence does not need to be contiguous, but must maintain relative order (e.g., 'ace' is a subsequence of 'abcde')."
      },
      {
        question: "How do you handle case sensitivity and spaces when checking palindromes?",
        answer: "You typically preprocess the string by converting it to lowercase and using a Regular Expression like `str.replace(/[^a-z0-9]/g, '')` to strip out spaces and punctuation before running the two-pointer check."
      }
    ],
    practicalTask: {
      scenario: "Given a string, find the first non-repeating character and return its index.",
      task: "Use a frequency map to solve in O(N) time.",
      solutionCode: "function firstUniqChar(s) {\n  const map = {};\n  for (let char of s) {\n    map[char] = (map[char] || 0) + 1;\n  }\n  for (let i = 0; i < s.length; i++) {\n    if (map[s[i]] === 1) return i;\n  }\n  return -1;\n}"
    }
  },
  {
    slug: "multi-dimensional-arrays-matrices",
    title: "Multi-Dimensional Arrays: Matrices, Traversals, and Coordinate Geometry",
    order: 10,
    content: `
      <h2>The Matrix</h2>
      <p>A multi-dimensional array is simply an array of arrays. It is used to represent grids, boards (like Chess or Tic-Tac-Toe), and graphs. A standard 2D array is accessed via row and column coordinates: <code>matrix[row][col]</code>.</p>
      
      <h3>Traversing a Matrix</h3>
      <p>Standard traversal requires two nested loops. Time complexity is O(R * C) where R is rows and C is columns.</p>
      <pre><code>
function traverseMatrix(matrix) {
  for(let row = 0; row < matrix.length; row++) {
    for(let col = 0; col < matrix[row].length; col++) {
      console.log(matrix[row][col]);
    }
  }
}
      </code></pre>

      <h3>Coordinate Geometry and Directions</h3>
      <p>Many matrix problems (like island counting, mazes) require moving strictly Up, Down, Left, or Right. We use a directions array to keep code clean.</p>
      <pre><code>
const directions = [
  [-1, 0], // Up
  [1, 0],  // Down
  [0, -1], // Left
  [0, 1]   // Right
];

function getNeighbors(row, col, matrix) {
  let neighbors = [];
  for(let [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    // Boundary checks
    if(r >= 0 && r < matrix.length && c >= 0 && c < matrix[0].length) {
      neighbors.push(matrix[r][c]);
    }
  }
  return neighbors;
}
      </code></pre>

      <h3>Matrix Rotations</h3>
      <p>Rotating an NxN matrix 90 degrees in-place is a classic interview question. The trick is to Transpose the matrix (swap row and col) and then Reverse each row.</p>
      <pre><code>
function rotate(matrix) {
  let n = matrix.length;
  // Step 1: Transpose
  for(let i=0; i<n; i++){
    for(let j=i; j<n; j++){
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
    }
  }
  // Step 2: Reverse each row
  for(let i=0; i<n; i++){
    matrix[i].reverse();
  }
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the time complexity of rotating an NxN matrix 90 degrees?",
        answer: "The time complexity is O(N^2) where N is the number of rows/cols, because we must touch every element exactly once. Space complexity is O(1) if done in-place."
      },
      {
        question: "How do you represent a 2D matrix in a 1D array?",
        answer: "You can map a 2D index (row, col) to a 1D index using the formula: `index1D = row * numberOfCols + col`. This is how matrices are stored in linear memory in C/C++."
      },
      {
        question: "What is a Jagged Array?",
        answer: "A jagged array is an array of arrays where the inner arrays have different lengths. JavaScript naturally supports jagged arrays, whereas languages like C# require distinct syntax to differentiate them from true rectangular matrices."
      },
      {
        question: "Why do we use boundary checks (r >= 0 && r < rows) when traversing matrices?",
        answer: "Because exploring neighbors at the edges of a matrix will result in an `undefined` row or col index. Accessing `matrix[-1][0]` will throw a TypeError in JavaScript because `matrix[-1]` is undefined, and you cannot read property '0' of undefined."
      },
      {
        question: "Explain the Transpose operation.",
        answer: "Transposing a matrix means flipping it over its main diagonal. The rows become columns, and the columns become rows. Element at index [i][j] moves to [j][i]."
      }
    ],
    practicalTask: {
      scenario: "Search for a target value in an M x N matrix where rows and columns are sorted in ascending order.",
      task: "Write an O(M + N) solution starting from the top-right corner.",
      solutionCode: "function searchMatrix(matrix, target) {\n  let row = 0;\n  let col = matrix[0].length - 1;\n  while (row < matrix.length && col >= 0) {\n    if (matrix[row][col] === target) return true;\n    if (matrix[row][col] > target) col--; // Move left\n    else row++; // Move down\n  }\n  return false;\n}"
    }
  }
];

appendDsaTopics(topics);
