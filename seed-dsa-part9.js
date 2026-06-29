import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: "dsa-ch41-two-pointers",
    title: "Chapter 41: Advanced Two Pointers Pattern",
    order: 41,
    content: `<h2>The Core Mechanics of Two Pointers</h2>
<p>The Two Pointers pattern is a fundamental algorithmic technique where two iterators (or pointers) move through a data structure simultaneously, but under different conditions. It is predominantly used on sorted arrays or linked lists to find pairs, triplets, or sub-segments that satisfy specific constraints.</p>
<h2>Why it Works: Escaping the N^2 Trap</h2>
<p>In a naive brute-force approach, finding a pair of elements that sum to a target requires nested loops, resulting in O(N^2) time complexity. The Two Pointers approach exploits the sorted nature of the data. By starting pointers at opposite ends (index 0 and index N-1), we can narrow the search space in linear O(N) time.</p>
<h3>Example: Two Sum II - Input array is sorted</h3>
<p>Let's look at the implementation.</p>
<pre><code>// Brute Force Approach
// Time: O(N^2) | Space: O(1)
function twoSumBrute(numbers, target) {
  for (let i = 0; i < numbers.length; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[i] + numbers[j] === target) return [i + 1, j + 1];
    }
  }
  return [-1, -1];
}

// Optimized Two Pointers Approach
// Time: O(N) | Space: O(1)
function twoSumOptimized(numbers, target) {
  let left = 0, right = numbers.length - 1;
  while (left < right) {
    let sum = numbers[left] + numbers[right];
    if (sum === target) return [left + 1, right + 1];
    else if (sum < target) left++; // We need a larger sum
    else right--; // We need a smaller sum
  }
  return [-1, -1];
}</code></pre>
<h2>Opposite Direction vs. Same Direction</h2>
<p>There are two primary flavors of this pattern: opposite-directional (one pointer starts at the beginning, the other at the end) and same-directional (both pointers start at the beginning, often used for removing duplicates or partitioning arrays).</p>`,
    interviewQuestions: [
      { question: "What is the primary prerequisite for the opposite-directional Two Pointers technique?", answer: "The data structure must typically be sorted. If it's not sorted, you might need to sort it first (taking O(N log N) time), or the problem might not be suitable for this specific pattern." },
      { question: "Can the Two Pointers pattern be applied to Linked Lists?", answer: "Yes, but mostly in a same-directional manner (like Fast and Slow pointers) since singly linked lists cannot be traversed backwards." },
      { question: "How does Two Pointers handle duplicate elements when finding unique triplets (e.g., 3Sum)?", answer: "You must explicitly skip duplicates. After processing a valid triplet, you increment the left pointer while it equals the previous left value, and decrement the right pointer while it equals the previous right value." },
      { question: "What is the space complexity of a Two Pointers solution?", answer: "Almost always O(1) auxiliary space, as it only requires a few integer variables to store the pointer indices." },
      { question: "If the input array is not sorted, should you always sort it to use Two Pointers?", answer: "Not always. If the problem asks for indices (like the original Two Sum), sorting destroys the original indices. In that case, a Hash Map is better." },
      { question: "How is the Two Pointers pattern different from Sliding Window?", answer: "Two pointers usually look for a specific pair/triplet or operate on ends, whereas Sliding Window maintains a contiguous subarray or sublist between the pointers." }
    ],
    practicalTask: {
      scenario: "Remove Duplicates from Sorted Array",
      task: "Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. The relative order of the elements should be kept the same.",
      solutionCode: "function removeDuplicates(nums) {\n  if (nums.length === 0) return 0;\n  let i = 0; // Slow pointer\n  for (let j = 1; j < nums.length; j++) { // Fast pointer\n    if (nums[j] !== nums[i]) {\n      i++;\n      nums[i] = nums[j];\n    }\n  }\n  return i + 1;\n}"
    }
  },
  {
    slug: "dsa-ch42-two-pointers-hard",
    title: "Chapter 42: Two Pointers - Trapping Rain Water & Hard Constraints",
    order: 42,
    content: `<h2>Scaling Two Pointers: Hard Problems</h2>
<p>Once you master basic Two Pointers, the next step is applying them to complex constraints like 3Sum, 4Sum, or computing area/volume. A classic example is the 'Container With Most Water' and its more difficult sibling, 'Trapping Rain Water'.</p>
<h2>Example: Container With Most Water</h2>
<p>Given an array of heights, find two lines that together with the x-axis form a container that holds the most water.</p>
<pre><code>// Brute Force Approach
// Time: O(N^2) | Space: O(1)
function maxAreaBrute(height) {
  let maxArea = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      let area = Math.min(height[i], height[j]) * (j - i);
      maxArea = Math.max(maxArea, area);
    }
  }
  return maxArea;
}

// Optimized Approach
// Time: O(N) | Space: O(1)
function maxAreaOptimized(height) {
  let maxArea = 0;
  let left = 0, right = height.length - 1;
  while (left < right) {
    let area = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, area);
    // Move the pointer pointing to the shorter line
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}</code></pre>
<h2>The Logic of Moving Pointers</h2>
<p>The logic is crucial: the volume is bounded by the shorter line. If we move the pointer of the taller line, the width decreases, but the height is still bounded by the same shorter line, so the area can only decrease. Therefore, we MUST move the shorter line to potentially find a taller line.</p>`,
    interviewQuestions: [
      { question: "Why do we move the shorter pointer in Container With Most Water?", answer: "Because the area is limited by the shorter line. Moving the taller line cannot possibly increase the area since the width decreases and the height will still be bottlenecked by the shorter line." },
      { question: "How does Trapping Rain Water differ from Container With Most Water?", answer: "Container with Most Water looks for a single overarching container. Trapping Rain Water looks at the water trapped above EVERY specific block, bounded by the maximum heights to its left and right." },
      { question: "What is the time/space complexity of the optimized Trapping Rain Water solution using Two Pointers?", answer: "Time is O(N) because each element is visited once. Space is O(1) because we only keep track of maxLeft and maxRight integers, avoiding the O(N) arrays used in the Dynamic Programming approach." },
      { question: "Can 3Sum be solved in O(N)?", answer: "No, the best known time complexity for 3Sum is O(N^2). We sort the array in O(N log N) and then use a loop to fix one element, applying the O(N) Two Pointers technique on the remaining array." },
      { question: "What edge cases should you consider for Two Pointers?", answer: "Empty arrays, arrays with only 1 or 2 elements, arrays with all duplicate elements, and negative numbers (depending on the problem)." },
      { question: "In Trapping Rain Water, how do you decide which pointer to move?", answer: "You move the pointer that has the smaller 'max height' on its side. If leftMax < rightMax, the bottleneck is on the left, so we process the left pointer and move it inward." }
    ],
    practicalTask: {
      scenario: "Trapping Rain Water (Optimized)",
      task: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      solutionCode: "function trap(height) {\n  if (!height || height.length === 0) return 0;\n  let left = 0, right = height.length - 1;\n  let leftMax = height[left], rightMax = height[right];\n  let trapped = 0;\n  while (left < right) {\n    if (leftMax < rightMax) {\n      left++;\n      leftMax = Math.max(leftMax, height[left]);\n      trapped += leftMax - height[left];\n    } else {\n      right--;\n      rightMax = Math.max(rightMax, height[right]);\n      trapped += rightMax - height[right];\n    }\n  }\n  return trapped;\n}"
    }
  },
  {
    slug: "dsa-ch43-sliding-window-fixed",
    title: "Chapter 43: Sliding Window - Fixed Size Arrays",
    order: 43,
    content: `<h2>The Sliding Window Paradigm</h2>
<p>The Sliding Window pattern is a subset of the Two Pointers technique. It is used to perform operations on a specific window size of a given array or linked list, such as finding the longest subarray, the shortest subarray, or a subarray that meets specific criteria.</p>
<h2>Fixed vs. Variable Windows</h2>
<p>In a <strong>fixed-size window</strong>, the distance between the two pointers (the size of the window) remains constant. In a <strong>variable-size window</strong>, the window grows or shrinks based on specific conditions.</p>
<h2>Example: Maximum Sum Subarray of Size K</h2>
<p>Find the maximum sum of any contiguous subarray of size k.</p>
<pre><code>// Brute Force Approach
// Time: O(N * K) | Space: O(1)
function maxSumBrute(arr, k) {
  let maxSum = -Infinity;
  for (let i = 0; i <= arr.length - k; i++) {
    let windowSum = 0;
    for (let j = i; j < i + k; j++) {
      windowSum += arr[j];
    }
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// Optimized Sliding Window Approach
// Time: O(N) | Space: O(1)
function maxSumOptimized(arr, k) {
  let maxSum = 0, windowSum = 0;
  let windowStart = 0;
  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {
    windowSum += arr[windowEnd]; // add the next element
    // when we hit the window size, slide it
    if (windowEnd >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[windowStart]; // subtract the element going out
      windowStart++; // slide the window ahead
    }
  }
  return maxSum;
}</code></pre>
<p>By reusing the sum from the previous window and just adding the new element and subtracting the old element, we drop the time complexity from O(N * K) to O(N).</p>`,
    interviewQuestions: [
      { question: "What is the key optimization that Sliding Window provides over brute force?", answer: "It avoids recalculating overlapping parts of the subarrays. It simply adds the new element entering the window and subtracts the old element leaving the window." },
      { question: "How do you identify a Sliding Window problem?", answer: "Keywords like 'contiguous subarray', 'substring', 'longest', 'shortest', 'maximum', 'minimum', combined with a linear data structure like an Array or String." },
      { question: "What happens if the array size is smaller than the window size K?", answer: "The algorithm should return a default value (like 0, null, or throw an error depending on requirements), as a window of size K cannot be formed." },
      { question: "Is Sliding Window always O(N) time?", answer: "Generally, yes. Both the left and right pointers move forward at most N times, resulting in 2N operations, which simplifies to O(N)." },
      { question: "Can Sliding Window be used on negative numbers?", answer: "Fixed size sliding window can handle negative numbers just fine. Variable size sliding window looking for a specific sum CANNOT handle negative numbers easily (you'd need Prefix Sums with Hash Map instead) because the monotonicity is broken." },
      { question: "What is the space complexity of a fixed-size sliding window?", answer: "Usually O(1) unless you are required to store the actual subarray or use a Hash Map to track frequencies inside the window." }
    ],
    practicalTask: {
      scenario: "Find Averages of Subarrays of Size K",
      task: "Given an array, find the average of all contiguous subarrays of size 'K' in it.",
      solutionCode: "function findAverages(K, arr) {\n  const result = [];\n  let windowSum = 0.0, windowStart = 0;\n  for (let windowEnd = 0; windowEnd < arr.length; windowEnd++) {\n    windowSum += arr[windowEnd];\n    if (windowEnd >= K - 1) {\n      result.push(windowSum / K);\n      windowSum -= arr[windowStart];\n      windowStart += 1;\n    }\n  }\n  return result;\n}"
    }
  },
  {
    slug: "dsa-ch44-sliding-window-variable",
    title: "Chapter 44: Sliding Window - Variable Size & Hash Maps",
    order: 44,
    content: `<h2>Variable Size Windows</h2>
<p>Unlike fixed-size windows, variable-size windows expand and shrink dynamically based on problem constraints. This is often used for finding the 'longest' or 'shortest' substring/subarray.</p>
<h2>The Template</h2>
<p>Expand the window by moving the <code>right</code> pointer and adding elements to your state (e.g., a Hash Map of character counts). When the condition is violated, shrink the window by moving the <code>left</code> pointer until the condition is satisfied again.</p>
<h2>Example: Longest Substring Without Repeating Characters</h2>
<pre><code>// Brute Force Approach
// Time: O(N^3) | Space: O(min(N, M))
function lengthOfLongestSubstringBrute(s) {
  let maxLength = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (allUnique(s, i, j)) {
        maxLength = Math.max(maxLength, j - i + 1);
      }
    }
  }
  return maxLength;
}
function allUnique(s, start, end) {
  let set = new Set();
  for (let i = start; i <= end; i++) {
    if (set.has(s[i])) return false;
    set.add(s[i]);
  }
  return true;
}

// Optimized Variable Sliding Window Approach
// Time: O(N) | Space: O(min(N, M))
function lengthOfLongestSubstringOptimized(s) {
  let maxLength = 0;
  let windowStart = 0;
  let charIndexMap = new Map();
  for (let windowEnd = 0; windowEnd < s.length; windowEnd++) {
    const rightChar = s[windowEnd];
    if (charIndexMap.has(rightChar)) {
      // Shrink the window
      windowStart = Math.max(windowStart, charIndexMap.get(rightChar) + 1);
    }
    charIndexMap.set(rightChar, windowEnd);
    maxLength = Math.max(maxLength, windowEnd - windowStart + 1);
  }
  return maxLength;
}</code></pre>
<p>Using a Hash Map to store the last seen index of a character allows us to instantly jump the <code>windowStart</code> pointer ahead, skipping unnecessary iterations.</p>`,
    interviewQuestions: [
      { question: "How do you maintain state in a variable sliding window?", answer: "Usually with a Hash Map or an array of size 26/256 (for characters), keeping track of frequencies or the last seen index of elements inside the current window." },
      { question: "Why do we use Math.max for updating windowStart in the optimized longest substring algorithm?", answer: "Because the duplicate character we found might be BEFORE our current windowStart. If it's outside the current window, we shouldn't move our windowStart backward." },
      { question: "What is the time complexity of the optimized longest substring approach?", answer: "O(N). Although there's a loop and we use a map, we process each character at most twice (once entering the window, once leaving). In the optimized version, we jump indices, so each char is visited only once." },
      { question: "How does sliding window work for 'Shortest Subarray with Sum >= S'?", answer: "You expand the window (right++) until the sum is >= S. Once it is, you record the minimum length, and continuously shrink the window (left++) as long as the sum remains >= S, recording the length each time." },
      { question: "What if you need to find all anagrams of a string in another string?", answer: "Use a fixed-size sliding window equal to the length of the anagram string. Maintain a frequency map of the current window and compare it to the target frequency map. If they match, record the starting index." },
      { question: "What is the space complexity when using a character frequency map?", answer: "O(K) where K is the number of distinct characters. For ASCII, it's bounded by O(1) (or O(256))." }
    ],
    practicalTask: {
      scenario: "Minimum Size Subarray Sum",
      task: "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray of which the sum is greater than or equal to target. If there is no such subarray, return 0.",
      solutionCode: "function minSubArrayLen(target, nums) {\n  let minLength = Infinity;\n  let windowSum = 0;\n  let windowStart = 0;\n  for (let windowEnd = 0; windowEnd < nums.length; windowEnd++) {\n    windowSum += nums[windowEnd];\n    while (windowSum >= target) {\n      minLength = Math.min(minLength, windowEnd - windowStart + 1);\n      windowSum -= nums[windowStart];\n      windowStart++;\n    }\n  }\n  return minLength === Infinity ? 0 : minLength;\n}"
    }
  },
  {
    slug: "dsa-ch45-fast-slow-pointers",
    title: "Chapter 45: Fast & Slow Pointers (Tortoise and Hare)",
    order: 45,
    content: `<h2>Floyd's Cycle Finding Algorithm</h2>
<p>The Fast and Slow pointer approach, also known as the Hare and Tortoise algorithm, is an ingenious technique for detecting cycles in linked lists and arrays. By using two pointers moving at different speeds, we can confidently determine if a cycle exists without using extra memory.</p>
<h2>How it Works</h2>
<p>The slow pointer moves one step at a time, while the fast pointer moves two steps. If there is no cycle, the fast pointer will reach the end of the list. If there IS a cycle, the fast pointer will eventually loop around and catch up to the slow pointer.</p>
<h2>Example: Linked List Cycle</h2>
<pre><code>// Brute Force Approach (Using Hash Set)
// Time: O(N) | Space: O(N)
function hasCycleBrute(head) {
  let current = head;
  let visited = new Set();
  while (current !== null) {
    if (visited.has(current)) return true;
    visited.add(current);
    current = current.next;
  }
  return false;
}

// Optimized Fast & Slow Pointers
// Time: O(N) | Space: O(1)
function hasCycleOptimized(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow === fast) return true; // They met in a cycle!
  }
  return false;
}</code></pre>
<h2>Finding the Start of the Cycle</h2>
<p>Once they meet, if you move the slow pointer back to the <code>head</code>, and then move BOTH pointers one step at a time, the node where they meet again will be the exact starting node of the cycle. This is a mathematical guarantee derived from the distance formula.</p>`,
    interviewQuestions: [
      { question: "Why does the fast pointer moving 2 steps guarantee it will meet the slow pointer?", answer: "In a cycle, the distance between the fast and slow pointer decreases by exactly 1 on every iteration. Since the distance decreases by a discrete integer of 1, it will eventually hit 0, meaning they meet without 'jumping' over each other." },
      { question: "Can the fast pointer move 3 steps instead of 2?", answer: "Yes, moving 3 steps also guarantees a meeting. However, moving 2 steps is the optimal balance because it ensures the cycle is detected in the first iteration around the loop, minimizing the number of operations." },
      { question: "Explain the math behind finding the cycle's starting node.", answer: "Let distance from head to cycle start be X, and cycle start to meeting point be Y. Slow traveled X+Y. Fast traveled 2(X+Y). Fast also traveled X+Y+N*C (where C is cycle length). So 2(X+Y) = X+Y+N*C => X+Y = N*C => X = N*C - Y. This means the distance from head to cycle start (X) equals the distance from the meeting point to cycle start going forward." },
      { question: "Can Fast & Slow pointers find the middle of a Linked List?", answer: "Yes! If fast moves 2x and slow moves 1x, when fast reaches the end, slow will be exactly at the midpoint. This is heavily used in Palindrome Linked List problems." },
      { question: "How do you detect if a number is a 'Happy Number'?", answer: "Treat the number replacement process as a linked list traversal. Use fast and slow pointers. If they meet at 1, it's happy. If they meet at any other number, there's a cycle and it's not happy." },
      { question: "Is Fast & Slow pointer only for Linked Lists?", answer: "No, it can be applied to arrays where the value at an index acts as a pointer to the next index (e.g., the 'Find the Duplicate Number' problem)." }
    ],
    practicalTask: {
      scenario: "Middle of the Linked List",
      task: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
      solutionCode: "function middleNode(head) {\n  let slow = head;\n  let fast = head;\n  while (fast !== null && fast.next !== null) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}"
    }
  }
];

appendDsaTopics(topics);
