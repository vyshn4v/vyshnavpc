import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: "dsa-ch46-binary-search-advanced",
    title: "Chapter 46: Advanced Binary Search - Binary Search on Answer",
    order: 46,
    content: `<h2>Beyond Searching Arrays</h2>
<p>Most beginners think Binary Search is just for finding a number in a sorted array. Advanced programmers use it to <strong>search the solution space</strong>. This is known as "Binary Search on Answer" or "Parametric Search".</p>
<h2>The Monotonic Condition</h2>
<p>If you can define a condition function <code>isValid(x)</code> that returns true for a range and false otherwise (e.g., [F, F, F, T, T, T]), you can use Binary Search to find the exact boundary where the transition happens.</p>
<h2>Example: Koko Eating Bananas</h2>
<p>Koko wants to eat all bananas within H hours. Find the minimum integer eating speed K. The search space for K is from 1 to the maximum pile size.</p>
<pre><code>// Brute Force Approach
// Time: O(M * N) where M is max pile, N is length
function minEatingSpeedBrute(piles, h) {
  let maxPile = Math.max(...piles);
  for (let k = 1; k <= maxPile; k++) {
    let hours = 0;
    for (let pile of piles) {
      hours += Math.ceil(pile / k);
    }
    if (hours <= h) return k;
  }
  return maxPile;
}

// Optimized Binary Search Approach
// Time: O(N log M) | Space: O(1)
function minEatingSpeedOptimized(piles, h) {
  let left = 1;
  let right = Math.max(...piles);
  let result = right;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    let hours = 0;
    for (let pile of piles) hours += Math.ceil(pile / mid);
    
    if (hours <= h) {
      result = mid;
      right = mid - 1; // Try to find a smaller valid speed
    } else {
      left = mid + 1; // Speed too slow, must eat faster
    }
  }
  return result;
}</code></pre>
<p>By binary searching the answer space [1, max_pile], we drastically cut down the time complexity.</p>`,
    interviewQuestions: [
      { question: "How do you recognize a 'Binary Search on Answer' problem?", answer: "Look for keywords like 'minimum maximum', 'maximum minimum', 'least amount of time', or 'smallest capacity'. The problem usually asks to optimize a parameter that has a monotonic relationship with the constraint." },
      { question: "What is the hardest part of 'Binary Search on Answer'?", answer: "Writing the helper function (e.g., 'isValid(mid)') that tests if the current midpoint satisfies the constraints. The binary search template itself is always the same." },
      { question: "Why do we use Math.floor((left + right) / 2) instead of (left + right) / 2?", answer: "In languages like JavaScript, division produces floating-point numbers. Array indices and search spaces usually require integers. Also, in strongly typed languages (Java/C++), you should use 'left + (right - left) / 2' to prevent integer overflow." },
      { question: "What happens if we don't return 'result' and just return 'left'?", answer: "If your loop condition is 'left <= right', then when the loop terminates, 'left' will typically point to the smallest valid answer (the boundary). However, keeping a 'result' variable is less error-prone." },
      { question: "What is the time complexity of the 'isValid' function in these problems?", answer: "Usually O(N), because you have to iterate through the array to check if the current 'mid' value satisfies the condition." }
    ],
    practicalTask: {
      scenario: "Capacity To Ship Packages Within D Days",
      task: "A conveyor belt has packages. Find the minimum capacity of a ship to ship all packages within D days. Packages must be shipped in order.",
      solutionCode: "function shipWithinDays(weights, days) {\n  let left = Math.max(...weights);\n  let right = weights.reduce((a, b) => a + b, 0);\n  let res = right;\n  while (left <= right) {\n    let cap = Math.floor((left + right) / 2);\n    if (canShip(weights, days, cap)) {\n      res = cap;\n      right = cap - 1;\n    } else {\n      left = cap + 1;\n    }\n  }\n  return res;\n}\n\nfunction canShip(weights, days, cap) {\n  let ships = 1, currentWeight = 0;\n  for (let w of weights) {\n    if (currentWeight + w > cap) {\n      ships++;\n      currentWeight = 0;\n    }\n    currentWeight += w;\n  }\n  return ships <= days;\n}"
    }
  },
  {
    slug: "dsa-ch47-binary-search-boundaries",
    title: "Chapter 47: Advanced Binary Search - Boundaries & Rotated Arrays",
    order: 47,
    content: `<h2>Finding First and Last Occurrences</h2>
<p>When an array has duplicate elements, a standard binary search might find an element in the middle of a block of duplicates. Finding the exact first or last occurrence requires modifying the boundary conditions.</p>
<pre><code>// Find Left Boundary
function findFirst(nums, target) {
  let left = 0, right = nums.length - 1, idx = -1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] >= target) {
      if (nums[mid] === target) idx = mid;
      right = mid - 1; // Keep searching left
    } else left = mid + 1;
  }
  return idx;
}</code></pre>
<h2>Search in Rotated Sorted Array</h2>
<p>A classic interview question. The array is sorted but shifted (e.g., [4,5,6,7,0,1,2]). The trick is to realize that at any midpoint, <strong>at least one half of the array must be strictly sorted</strong>. We use this property to decide where to search.</p>
<pre><code>// Search in Rotated Sorted Array
// Time: O(log N) | Space: O(1)
function searchRotated(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    
    // Left half is sorted
    if (nums[left] <= nums[mid]) {
      if (target >= nums[left] && target < nums[mid]) {
        right = mid - 1; // Target is in the left sorted portion
      } else {
        left = mid + 1;  // Target is in the right unsorted portion
      }
    } 
    // Right half is sorted
    else {
      if (target > nums[mid] && target <= nums[right]) {
        left = mid + 1;  // Target is in the right sorted portion
      } else {
        right = mid - 1; // Target is in the left unsorted portion
      }
    }
  }
  return -1;
}</code></pre>`,
    interviewQuestions: [
      { question: "In a rotated sorted array, how do you determine which half is sorted?", answer: "Compare the left pointer value to the mid pointer value. If nums[left] <= nums[mid], the left half is sorted. Otherwise, the right half is sorted." },
      { question: "What happens if there are duplicates in the rotated sorted array?", answer: "Duplicates break the strict sorted check. If nums[left] === nums[mid] === nums[right], you cannot determine which half is sorted. You must shrink the search space by doing left++ and right--. This degrades the worst-case time complexity to O(N)." },
      { question: "How do you find the minimum element in a Rotated Sorted Array?", answer: "Use Binary Search. Compare nums[mid] with nums[right]. If nums[mid] > nums[right], the minimum is to the right. Otherwise, the minimum is to the left (including mid, so right = mid)." },
      { question: "Why do we use left <= right in the while loop instead of left < right?", answer: "Using left <= right ensures that we check the element when left and right converge on a single element. If you use left < right, you might miss the target element if it's at that exact converged index." },
      { question: "Can you binary search on a 2D matrix?", answer: "Yes, if the matrix is completely sorted row by row, you can map the 2D indices to a 1D index: row = floor(mid / COLS), col = mid % COLS, and run a standard binary search." }
    ],
    practicalTask: {
      scenario: "Find Minimum in Rotated Sorted Array",
      task: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array.",
      solutionCode: "function findMin(nums) {\n  let left = 0, right = nums.length - 1;\n  while (left < right) {\n    let mid = Math.floor((left + right) / 2);\n    if (nums[mid] > nums[right]) {\n      // Min must be in the right half\n      left = mid + 1;\n    } else {\n      // Min is in the left half, or mid is the min\n      right = mid;\n    }\n  }\n  return nums[left];\n}"
    }
  },
  {
    slug: "dsa-ch48-cyclic-sort",
    title: "Chapter 48: Cyclic Sort - The O(N) Magic",
    order: 48,
    content: `<h2>The Cyclic Sort Pattern</h2>
<p>Cyclic Sort is a unique pattern used to deal with problems involving arrays containing numbers in a given range. When you are given an array of size N containing numbers from 1 to N, you can sort it in exactly O(N) time without using O(N log N) sorting algorithms.</p>
<h2>How it Works</h2>
<p>Since we know the numbers are tightly packed from 1 to N, every number conceptually belongs at index <code>number - 1</code>. We iterate through the array, and if the current number is not at its correct index, we swap it with the number AT its correct index.</p>
<h2>Example: Find Missing Number (Range 0 to N)</h2>
<pre><code>// Brute Force Approach
// Time: O(N log N) (Sorting) | Space: O(1)
function missingNumberBrute(nums) {
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i) return i;
  }
  return nums.length;
}

// Optimized Cyclic Sort Approach
// Time: O(N) | Space: O(1)
function missingNumberOptimized(nums) {
  let i = 0;
  while (i < nums.length) {
    let correctIndex = nums[i]; // Value is the index (range 0 to N)
    if (nums[i] < nums.length && nums[i] !== nums[correctIndex]) {
      // Swap
      [nums[i], nums[correctIndex]] = [nums[correctIndex], nums[i]];
    } else {
      i++;
    }
  }
  // Find the mismatched index
  for (let j = 0; j < nums.length; j++) {
    if (nums[j] !== j) return j;
  }
  return nums.length;
}</code></pre>
<p>The beauty of this algorithm is that even though there's a while loop with swapping, each number is placed in its correct position exactly once. So the inner swap happens at most N-1 times overall, resulting in an O(N) time complexity.</p>`,
    interviewQuestions: [
      { question: "How do you identify a Cyclic Sort problem?", answer: "Look for problems involving an array of numbers in a strict range, like '1 to N' or '0 to N'. Keywords like 'missing number', 'duplicate number', or 'first missing positive'." },
      { question: "Why is Cyclic Sort O(N) and not O(N^2) given the loop structure?", answer: "Although there is a while loop, we only swap when a number is placed in its CORRECT index. Once placed, it's never swapped again. At most, we perform N-1 swaps across the entire algorithm." },
      { question: "What if there are duplicates in the array?", answer: "The algorithm naturally handles duplicates. If we try to swap a number to its correct index, and the number already at that index is identical, we just move on (i++) to avoid infinite loops." },
      { question: "How does Cyclic Sort solve the 'First Missing Positive' problem in O(N)?", answer: "You ignore negative numbers and numbers larger than N. You only swap numbers that fall within the range 1 to N into their correct index (nums[i] - 1). The first index that doesn't match its expected value holds the answer." },
      { question: "Can we use mathematical sum formulas instead of Cyclic Sort?", answer: "For a single missing number, yes (Expected Sum - Actual Sum). But if multiple numbers are missing, or there are duplicates (like 'Find All Missing Numbers'), the math formula fails, making Cyclic Sort the only O(N) space O(1) solution." }
    ],
    practicalTask: {
      scenario: "Find All Numbers Disappeared in an Array",
      task: "Given an array nums of n integers where nums[i] is in the range [1, n], return an array of all the integers in the range [1, n] that do not appear in nums.",
      solutionCode: "function findDisappearedNumbers(nums) {\n  let i = 0;\n  while (i < nums.length) {\n    let correctIdx = nums[i] - 1;\n    if (nums[i] !== nums[correctIdx]) {\n      [nums[i], nums[correctIdx]] = [nums[correctIdx], nums[i]];\n    } else {\n      i++;\n    }\n  }\n  let missing = [];\n  for (let j = 0; j < nums.length; j++) {\n    if (nums[j] !== j + 1) missing.push(j + 1);\n  }\n  return missing;\n}"
    }
  },
  {
    slug: "dsa-ch49-merge-intervals",
    title: "Chapter 49: Merge Intervals - Overlaps & Meetings",
    order: 49,
    content: `<h2>The Interval Pattern</h2>
<p>Interval problems are a classic category dealing with overlapping segments on a timeline (like meetings, tasks, or ranges). The fundamental approach relies heavily on <strong>sorting the intervals based on their start times</strong>.</p>
<h2>How to determine overlapping</h2>
<p>Two intervals <code>A</code> and <code>B</code> (where A starts before B) overlap if and only if: <code>A.end >= B.start</code>.</p>
<h2>Example: Merge Intervals</h2>
<p>Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.</p>
<pre><code>// Optimized Merge Intervals Approach
// Time: O(N log N) | Space: O(N)
function mergeIntervals(intervals) {
  if (intervals.length < 2) return intervals;
  
  // 1. Sort based on start time
  intervals.sort((a, b) => a[0] - b[0]);
  
  const merged = [intervals[0]];
  
  for (let i = 1; i < intervals.length; i++) {
    const lastMerged = merged[merged.length - 1];
    const current = intervals[i];
    
    // 2. Check for overlap
    if (current[0] <= lastMerged[1]) {
      // Merge by taking the maximum end time
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // No overlap, add to results
      merged.push(current);
    }
  }
  return merged;
}</code></pre>
<p>Sorting takes O(N log N). The linear scan takes O(N). The overall time is dominated by the sorting step.</p>`,
    interviewQuestions: [
      { question: "Why do we sort intervals by start time instead of end time?", answer: "Sorting by start time ensures that any potential overlapping intervals are adjacent to each other in the sorted array, allowing us to process overlaps with a single linear pass." },
      { question: "If the intervals are already sorted, what is the time complexity?", answer: "O(N). The sorting step is bypassed, leaving only the single linear scan to merge." },
      { question: "How does 'Meeting Rooms' differ from 'Merge Intervals'?", answer: "'Meeting Rooms' asks if a person can attend all meetings (checking if ANY overlap exists). 'Merge Intervals' requires you to actually combine the overlapping blocks." },
      { question: "How do you solve 'Meeting Rooms II' (Find minimum number of rooms required)?", answer: "You need a Min-Heap or two sorted arrays (start times and end times). If a meeting starts before the earliest ending meeting finishes, you need a new room. Otherwise, a room frees up." },
      { question: "What is the space complexity of merging intervals?", answer: "O(N) in the worst case, as no intervals might overlap, requiring us to store all N intervals in the result array. Sorting algorithms might also take O(log N) or O(N) auxiliary space." }
    ],
    practicalTask: {
      scenario: "Insert Interval",
      task: "Given a set of non-overlapping intervals, insert a new interval into the intervals (merge if necessary). You may assume that the intervals were initially sorted according to their start times.",
      solutionCode: "function insert(intervals, newInterval) {\n  let res = [];\n  let i = 0;\n  // Skip non-overlapping prior intervals\n  while (i < intervals.length && intervals[i][1] < newInterval[0]) {\n    res.push(intervals[i]);\n    i++;\n  }\n  // Merge overlapping intervals\n  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  res.push(newInterval);\n  // Add remaining intervals\n  while (i < intervals.length) {\n    res.push(intervals[i]);\n    i++;\n  }\n  return res;\n}"
    }
  },
  {
    slug: "dsa-ch50-sweep-line",
    title: "Chapter 50: Advanced Intervals - The Sweep Line Technique",
    order: 50,
    content: `<h2>The Sweep Line Algorithm</h2>
<p>When dealing with complex interval problems, such as tracking the maximum number of simultaneous overlapping intervals (like airplanes in the air, or active server loads), a pure merge algorithm can become convoluted.</p>
<h2>Event-Driven Processing</h2>
<p>The Sweep Line technique involves breaking intervals into distinct "events" (a start event and an end event). We sort all events sequentially on the timeline. As we sweep through the events, we update our active state.</p>
<h2>Example: Maximum Population Year</h2>
<pre><code>// Brute Force Array Sweep
// Time: O(N * Range) | Space: O(Range)
function maxPopulationBrute(logs) {
  let years = new Array(2051).fill(0);
  for (let [birth, death] of logs) {
    for (let y = birth; y < death; y++) {
      years[y]++;
    }
  }
  let max = 0, year = 1950;
  for (let i = 1950; i <= 2050; i++) {
    if (years[i] > max) { max = years[i]; year = i; }
  }
  return year;
}

// Optimized Sweep Line Algorithm
// Time: O(N log N) | Space: O(N)
function maxPopulationOptimized(logs) {
  let events = [];
  // 1: Birth (adds population), -1: Death (removes population)
  for (let [birth, death] of logs) {
    events.push([birth, 1]);
    events.push([death, -1]);
  }
  
  // Sort events by year. If years are equal, process deaths (-1) before births (1)
  events.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);
  
  let currentPop = 0, maxPop = 0, maxYear = 0;
  
  for (let [year, change] of events) {
    currentPop += change;
    if (currentPop > maxPop) {
      maxPop = currentPop;
      maxYear = year;
    }
  }
  return maxYear;
}</code></pre>
<p>By treating intervals as +1 and -1 events, we gracefully track the active overlap count dynamically.</p>`,
    interviewQuestions: [
      { question: "What is the key advantage of Sweep Line over standard Merge Intervals?", answer: "It easily handles tracking the count of simultaneous overlapping intervals without maintaining complex Min-Heaps or nested structures." },
      { question: "Why do we process end events (deaths) before start events (births) if they occur at the exact same time?", answer: "This is crucial for boundaries. If a meeting ends at 10:00 and another starts at 10:00, processing the end first frees up the room/resource so the start event doesn't register an invalid overlap peak." },
      { question: "What is the time complexity of the Sweep Line algorithm?", answer: "O(N log N) dominated strictly by the sorting of the events. The sweep itself is a single O(N) pass." },
      { question: "How does Sweep Line relate to the 'Skyline Problem'?", answer: "The Skyline Problem is the ultimate Sweep Line challenge. Instead of tracking counts, you track the active heights using a Max-Heap. As you encounter start events, you add heights; on end events, you remove heights." },
      { question: "Can Sweep Line be used in 2D geometry?", answer: "Yes, it's widely used in computational geometry to find intersections between line segments or computing the area of union of rectangles." }
    ],
    practicalTask: {
      scenario: "Meeting Rooms II (Sweep Line Approach)",
      task: "Given an array of meeting time intervals consisting of start and end times [[s1,e1],[s2,e2],...], find the minimum number of conference rooms required.",
      solutionCode: "function minMeetingRooms(intervals) {\n  let events = [];\n  for (let [start, end] of intervals) {\n    events.push([start, 1]);\n    events.push([end, -1]);\n  }\n  events.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\n  let rooms = 0, maxRooms = 0;\n  for (let [time, event] of events) {\n    rooms += event;\n    maxRooms = Math.max(maxRooms, rooms);\n  }\n  return maxRooms;\n}"
    }
  }
];

appendDsaTopics(topics);
