import { appendDsaTopics } from "./dsa-seeder-utils.js";

const topics = [
  {
    slug: "big-o-notation-ultimate",
    title: "Big O Notation: The Ultimate Guide to Time and Space",
    order: 1,
    content: `
      <h2>The Mathematical Foundation of Efficiency</h2>
      <p>Imagine you have to search for a name in a physical phone book. If you check every single page one by one, that's incredibly slow. If you split the book in half repeatedly, you find the name much faster. Big O Notation is the language we use in computer science to formalize this concept: it describes how the runtime or space requirements of a function grow as the input size grows.</p>
      <p>We do not care about exact milliseconds because hardware varies. A supercomputer will always run a brute force algorithm faster than a smart watch. Instead, we care about the <strong>trend</strong>. What happens when the input size <code>N</code> goes from 10 to 1,000,000?</p>
      
      <h3>O(1) - Constant Time</h3>
      <p>The operation takes the same amount of time regardless of the input size. Analogy: No matter how big the house is, opening the front door takes the same amount of effort.</p>
      <pre><code>
// O(1) Time | O(1) Space
function getFirstElement(arr) {
  return arr[0];
}
      </code></pre>

      <h3>O(N) - Linear Time</h3>
      <p>The runtime grows in direct proportion to the input size. Analogy: Reading a book cover to cover. If the book is twice as long, it takes twice as long to read.</p>
      <pre><code>
// O(N) Time | O(1) Space
function printAll(arr) {
  for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
  }
}
      </code></pre>

      <h3>O(N^2) - Quadratic Time</h3>
      <p>The runtime grows as the square of the input size. This is typical when you have nested loops. Analogy: Handshaking problem. Every person in a room shakes hands with every other person.</p>
      <pre><code>
// O(N^2) Time | O(1) Space
function printAllPairs(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
      </code></pre>

      <h3>Space Complexity: The Hidden Constraint</h3>
      <p>Space complexity refers to the auxiliary (extra) space an algorithm requires. We do not count the space taken by the inputs themselves. If an algorithm requires creating a new array of size N, its space complexity is O(N).</p>
    `,
    interviewQuestions: [
      {
        question: "What is the difference between best-case, worst-case, and average-case complexity?",
        answer: "Best-case (Omega notation) is the minimum time required (e.g., finding the item on the first try). Worst-case (Big O notation) is the maximum time required (e.g., finding the item at the very end or not at all). Average-case (Theta notation) is the expected time over all possible inputs. In interviews, we primarily focus on worst-case (Big O) as it guarantees the algorithm won't exceed a certain time."
      },
      {
        question: "Why do we drop constants in Big O notation?",
        answer: "Big O describes the asymptotic growth of an algorithm. As N approaches infinity, constant factors become negligible compared to the dominant term. For instance, O(2N) and O(100N) both scale linearly, so we simplify them to O(N)."
      },
      {
        question: "Does space complexity include the space taken up by the inputs?",
        answer: "Generally, no. When we talk about space complexity in algorithmic analysis, we are referring to 'auxiliary space'—the extra memory allocated by the algorithm to do its work (e.g., creating a hash map, call stack space in recursion, new arrays)."
      },
      {
        question: "Is O(log N) better or worse than O(1)?",
        answer: "O(log N) is worse (slower) than O(1). O(1) is constant, meaning it never grows. O(log N) grows very slowly as N increases, but it still grows."
      },
      {
        question: "How does the recursion call stack impact space complexity?",
        answer: "Every time a function calls itself recursively, an execution context is added to the call stack. If the recursion goes N levels deep, it consumes O(N) auxiliary space, even if no explicit variables or arrays are created."
      }
    ],
    practicalTask: {
      scenario: "You are given an array of numbers and must determine if any number is duplicated.",
      task: "Write an O(N) time and O(N) space solution using a Set.",
      solutionCode: "function hasDuplicate(nums) {\n  const seen = new Set();\n  for (let num of nums) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}"
    }
  },
  {
    slug: "analyzing-code-big-o-practice",
    title: "Analyzing Code: Big O in Practice with Iteration and Recursion",
    order: 2,
    content: `
      <h2>Dissecting Algorithms</h2>
      <p>Knowing the theory of Big O is one thing; analyzing complex code block by block is another. The golden rule is to find the most expensive operation and identify how many times it executes relative to the input size.</p>

      <h3>Analyzing Sequential Loops</h3>
      <p>If you have multiple sequential loops, you add their complexities together. <code>O(N) + O(N) = O(2N)</code>, which simplifies to <code>O(N)</code>.</p>
      <pre><code>
function sequentialLoops(arr) {
  // Loop 1: O(N)
  for(let i=0; i < arr.length; i++) {
    console.log(arr[i]);
  }
  // Loop 2: O(N)
  for(let i=arr.length - 1; i >= 0; i--) {
    console.log(arr[i]);
  }
}
// Total Time: O(N)
      </code></pre>

      <h3>Analyzing Nested Loops with Dependent Variables</h3>
      <p>Sometimes, the inner loop depends on the outer loop. Consider a loop where <code>j</code> starts from <code>i</code>.</p>
      <pre><code>
function dependentLoops(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i; j < arr.length; j++) {
      console.log(arr[i], arr[j]);
    }
  }
}
      </code></pre>
      <p>The first time, the inner loop runs N times. Next, N-1 times. Then N-2, etc. The sum is <code>N + (N-1) + ... + 1 = N(N+1)/2</code>. Ignoring constants, this is strictly <strong>O(N^2)</strong>.</p>

      <h3>Logarithmic Time: O(log N)</h3>
      <p>Whenever you see a loop where the index is multiplied or divided by a constant at each step, you are looking at logarithmic time. The algorithm is cutting the search space in half repeatedly.</p>
      <pre><code>
function logarithmic(n) {
  let count = 0;
  for (let i = 1; i < n; i *= 2) {
    count++;
  }
  return count;
}
// Time: O(log N)
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "What is the time complexity of an algorithm with two nested loops, one iterating over array A and the other over array B?",
        answer: "The time complexity is O(A * B) or O(N * M) where N is the length of array A and M is the length of array B. You cannot say O(N^2) unless you know for a fact that both arrays are the same length."
      },
      {
        question: "How do you calculate the space complexity of a recursive Fibonacci function without memoization?",
        answer: "The space complexity is O(N). Although the time complexity is O(2^N) due to the branching recursive calls, the maximum depth of the call stack at any point in time is equal to N."
      },
      {
        question: "If an algorithm's complexity is O(N + log N), what does it simplify to?",
        answer: "It simplifies to O(N). When adding complexities, you keep the dominant term. Since N grows much faster than log N, the log N term is dropped."
      },
      {
        question: "Why is Array.prototype.unshift() O(N) time?",
        answer: "unshift() adds an element to the beginning of the array. Because arrays are contiguous blocks of memory, adding an element to the start requires shifting every other existing element one index to the right, which takes O(N) time."
      },
      {
        question: "Is sorting an array O(1) space?",
        answer: "It depends on the algorithm and the language implementation. In JavaScript, V8's Array.prototype.sort() uses TimSort, which takes O(N) auxiliary space. In-place algorithms like Quicksort take O(log N) auxiliary space due to the call stack."
      }
    ],
    practicalTask: {
      scenario: "You need to find a target value in a sorted array using Binary Search.",
      task: "Implement Binary Search with O(log N) time and O(1) space.",
      solutionCode: "function binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}"
    }
  },
  {
    slug: "problem-solving-mental-model",
    title: "Problem Solving Mental Model: The Master Framework",
    order: 3,
    content: `
      <h2>The Anatomy of a FAANG Interview</h2>
      <p>Jumping straight into code is the #1 reason candidates fail coding interviews. You need a structured mental model to dissect ambiguous problems. We use the <strong>UMPIRE</strong> or <strong>PEDAC</strong> framework. Here we will define a generalized 4-step framework: Understand, Plan, Execute, and Review.</p>

      <h3>Step 1: Understand the Problem</h3>
      <p>Ask clarifying questions. Define the exact inputs and outputs. Ask about edge cases. What happens if the array is empty? What if the string has special characters? What are the memory constraints?</p>
      <ul>
        <li><strong>Analogy:</strong> A builder does not start laying bricks until they have seen the blueprints and inspected the land.</li>
      </ul>

      <h3>Step 2: Plan (The Algorithm)</h3>
      <p>Do NOT write code yet. Write pseudo-code or step-by-step logic in plain English. Start with a <em>Brute Force</em> approach, calculate its Big O, and then ask yourself, "Can we do better?" Look for repeated work or unnecessary iterations.</p>

      <h3>Step 3: Execute (Write Code)</h3>
      <p>Translate your plan into code. Write clean, modular functions. Give variables highly descriptive names. Talk out loud while typing so the interviewer knows your thought process.</p>

      <h3>Step 4: Review and Test</h3>
      <p>Dry-run your code with the edge cases you discovered in Step 1. Do not rely on an IDE to tell you there is a bug. Be your own compiler. Track variable states manually on a whiteboard or in comments.</p>
    `,
    interviewQuestions: [
      {
        question: "Why should you state the brute force solution first?",
        answer: "Stating the brute force solution establishes a baseline, proves that you understand the fundamental problem, and guarantees you have at least a working algorithm. It also acts as a springboard; by analyzing the bottlenecks of the brute force, you naturally find ways to optimize it."
      },
      {
        question: "What is an edge case, and give examples?",
        answer: "An edge case is an extreme or unexpected input. Examples include: empty arrays [], negative numbers, very large numbers that exceed integer limits, null/undefined inputs, strings with only spaces, and arrays with duplicate elements."
      },
      {
        question: "How do you handle getting completely stuck on an interview problem?",
        answer: "First, verbalize what you are stuck on. Second, go back to a simpler example and manually trace the output. Third, think about data structures (Can a Hash Map help? Can sorting help?). If still stuck, ask the interviewer a targeted question or for a small hint."
      },
      {
        question: "Is pseudo-code mandatory?",
        answer: "While not strictly mandatory, writing pseudo-code or plain English steps is highly recommended. It decouples the logic from syntax, allowing you to catch logical flaws before getting bogged down in language-specific details like variable scope or semicolons."
      },
      {
        question: "What does it mean to 'dry run' your code?",
        answer: "Dry running means manually executing your code line-by-line using a sample input, tracking the values of all variables in your head or on paper, to verify the logic works exactly as written without a machine."
      }
    ],
    practicalTask: {
      scenario: "Reverse a string given as an array of characters in place.",
      task: "Write out the 4-step plan in comments, then write the code.",
      solutionCode: "/*\nUnderstand: Input is array of chars, must modify in-place O(1) space.\nPlan: Two pointers, left at 0, right at end. Swap, move inwards.\nExecute: Write while loop.\nReview: Works for odd and even lengths.\n*/\nfunction reverseString(s) {\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    let temp = s[left];\n    s[left] = s[right];\n    s[right] = temp;\n    left++;\n    right--;\n  }\n}"
    }
  },
  {
    slug: "frequency-counters-multiple-pointers",
    title: "Problem Solving Patterns: Frequency Counters & Multiple Pointers",
    order: 4,
    content: `
      <h2>The Frequency Counter Pattern</h2>
      <p>This pattern uses objects or Sets to collect values and their frequencies. It avoids nested loops (which would be O(N^2)) and achieves O(N) time complexity by trading time for space O(N).</p>

      <h3>Example: Valid Anagram</h3>
      <p>Given two strings, check if one is an anagram of the other. Brute force would be sorting both arrays O(N log N). Optimized uses a Hash Map O(N).</p>
      <pre><code>
// Optimized: O(N) Time | O(N) Space
function validAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;
  
  const lookup = {};
  for (let char of str1) {
    lookup[char] = (lookup[char] || 0) + 1;
  }
  
  for (let char of str2) {
    if (!lookup[char]) return false;
    lookup[char] -= 1;
  }
  return true;
}
      </code></pre>

      <h2>The Multiple Pointers Pattern</h2>
      <p>This pattern involves creating pointers or values that correspond to an index or position and move towards the beginning, end, or middle based on a certain condition. It is very efficient for solving problems with minimal space complexity (usually O(1)).</p>

      <h3>Example: Sum Zero</h3>
      <p>Find the first pair of numbers in a <strong>sorted</strong> array that sum to zero. Brute force: check every pair O(N^2). Optimized: Two Pointers O(N).</p>
      <pre><code>
// Optimized: O(N) Time | O(1) Space
function sumZero(arr) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left < right) {
    let sum = arr[left] + arr[right];
    if (sum === 0) {
      return [arr[left], arr[right]];
    } else if (sum > 0) {
      right--;
    } else {
      left++;
    }
  }
  return undefined;
}
      </code></pre>
    `,
    interviewQuestions: [
      {
        question: "When should you use a Frequency Counter?",
        answer: "Whenever you need to compare multiple pieces of data, check for subsets, or count occurrences to solve problems like anagrams, duplicate detection, or finding the most common element. It's the best tool to reduce O(N^2) time to O(N)."
      },
      {
        question: "Why does the Multiple Pointers approach for 'Sum Zero' require a sorted array?",
        answer: "Because the logic relies on the magnitude of the sum dictating which pointer to move. If sum > 0, moving the right pointer left decreases the sum. If the array wasn't sorted, moving pointers wouldn't predictably increase or decrease the sum."
      },
      {
        question: "What is a Hash Map collision and how does it relate to Frequency Counters?",
        answer: "Under the hood, JS Objects/Maps handle collisions via linked lists or open addressing. In algorithmic analysis for Frequency Counters, we assume O(1) average time for hash map lookups, but worst-case can be O(N) if many collisions occur."
      },
      {
        question: "Can multiple pointers start at the same location?",
        answer: "Yes, in algorithms like 'Slow and Fast Pointers' (Floyd's Cycle Detection) or processing contiguous sub-arrays, two pointers can start at index 0 and move at different speeds."
      },
      {
        question: "What is the difference between a JS Object and a JS Map for Frequency Counters?",
        answer: "An Object only allows string/symbol keys, whereas a Map allows any data type as a key. Map maintains insertion order and has a built-in size property. Map is often faster for frequent additions/removals."
      }
    ],
    practicalTask: {
      scenario: "Given an array of integers, count the unique values using Multiple Pointers. (Assume array is sorted).",
      task: "Write a function using two pointers moving left to right.",
      solutionCode: "function countUniqueValues(arr) {\n  if(arr.length === 0) return 0;\n  let i = 0;\n  for(let j = 1; j < arr.length; j++){\n    if(arr[i] !== arr[j]){\n      i++;\n      arr[i] = arr[j];\n    }\n  }\n  return i + 1;\n}"
    }
  },
  {
    slug: "sliding-window-divide-conquer",
    title: "Problem Solving Patterns: Sliding Window & Divide and Conquer",
    order: 5,
    content: `
      <h2>The Sliding Window Pattern</h2>
      <p>This pattern involves creating a 'window' which can either be an array or a number from one position to another. Depending on a certain condition, the window either increases or closes (and a new window is created). It is exceptionally useful for keeping track of a subset of data in an array/string.</p>

      <h3>Example: Max Subarray Sum</h3>
      <p>Given an array of integers and a number N, find the maximum sum of N consecutive elements.</p>
      <pre><code>
// Brute Force: O(N * K) Time | O(1) Space
function maxSubarraySumBrute(arr, num) {
  if (num > arr.length) return null;
  let max = -Infinity;
  for (let i = 0; i < arr.length - num + 1; i++) {
    let temp = 0;
    for (let j = 0; j < num; j++) {
      temp += arr[i + j];
    }
    if (temp > max) max = temp;
  }
  return max;
}

// Optimized (Sliding Window): O(N) Time | O(1) Space
function maxSubarraySum(arr, num) {
  if (num > arr.length) return null;
  let maxSum = 0, tempSum = 0;
  
  for (let i = 0; i < num; i++) {
    maxSum += arr[i];
  }
  tempSum = maxSum;
  
  for (let i = num; i < arr.length; i++) {
    // Slide the window: subtract the old element, add the new element
    tempSum = tempSum - arr[i - num] + arr[i];
    maxSum = Math.max(maxSum, tempSum);
  }
  return maxSum;
}
      </code></pre>

      <h2>Divide and Conquer</h2>
      <p>This pattern involves dividing a data set into smaller chunks and then repeating a process with a subset of data. This pattern tremendously decreases time complexity, often yielding O(log N) or O(N log N) runtimes.</p>
    `,
    interviewQuestions: [
      {
        question: "How do you identify a Sliding Window problem?",
        answer: "Keywords like 'contiguous', 'subarray', 'substring', 'consecutive elements', 'longest', or 'shortest' usually indicate a Sliding Window problem."
      },
      {
        question: "What is the difference between a fixed sliding window and a dynamic sliding window?",
        answer: "A fixed window stays a constant size (e.g., max sum of exactly K elements). A dynamic window grows or shrinks based on a condition (e.g., smallest subarray with a sum greater than X)."
      },
      {
        question: "Is Binary Search an example of Divide and Conquer?",
        answer: "Yes, absolutely. Binary Search repeatedly divides the sorted search space in half, conquering the problem by eliminating half the remaining elements at each step."
      },
      {
        question: "Can a Sliding Window be applied to non-contiguous elements?",
        answer: "No. The entire concept of a 'window' implies a contiguous segment of the array or string. For non-contiguous combinations, dynamic programming or backtracking is usually required."
      },
      {
        question: "Why does Sliding Window drastically improve time complexity?",
        answer: "It eliminates redundant calculations. Instead of recalculating the entire subset sum from scratch for every position, it merely applies the difference (adding the new incoming element and subtracting the old outgoing element), doing O(1) work per shift."
      }
    ],
    practicalTask: {
      scenario: "Find the longest substring with all distinct characters.",
      task: "Implement a dynamic sliding window to track the longest distinct substring.",
      solutionCode: "function findLongestSubstring(str) {\n  let longest = 0, start = 0;\n  let seen = {};\n  for (let i = 0; i < str.length; i++) {\n    let char = str[i];\n    if (seen[char]) {\n      start = Math.max(start, seen[char]);\n    }\n    longest = Math.max(longest, i - start + 1);\n    seen[char] = i + 1;\n  }\n  return longest;\n}"
    }
  }
];

appendDsaTopics(topics);
