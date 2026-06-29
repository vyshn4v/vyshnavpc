import { appendDsaTopics } from "./dsa-seeder-utils.js";

const topics = [
  {
    slug: "stack-fundamentals-valid-parentheses",
    title: "16. Stack Fundamentals & Valid Parentheses",
    order: 16,
    content: `<h2>Stack Fundamentals</h2>
<p>A <strong>Stack</strong> is a linear data structure that follows a particular order in which operations are performed. The order is <strong>LIFO (Last In First Out)</strong>. Think of it like a stack of plates in a cafeteria: the last plate you put on top is the first one you take off.</p>
<p>Primary operations (all O(1) Time complexity):</p>
<ul>
  <li><strong>Push:</strong> Add an element to the top of the stack.</li>
  <li><strong>Pop:</strong> Remove and return the top element of the stack.</li>
  <li><strong>Peek (Top):</strong> View the top element without removing it.</li>
  <li><strong>isEmpty:</strong> Check if the stack has no elements.</li>
</ul>

<h3>Implementation in JavaScript</h3>
<p>In JavaScript, arrays natively act as stacks perfectly by using <code>push()</code> and <code>pop()</code>.</p>
<pre><code>let stack = [];
stack.push(1); // [1]
stack.push(2); // [1, 2]
let top = stack[stack.length - 1]; // peek: 2
let popped = stack.pop(); // returns 2, stack is [1]</code></pre>

<h2>The Valid Parentheses Pattern</h2>
<p>The most iconic use case for a stack in interviews is balancing symbols or parsing strings (like HTML tags or mathematical expressions). Stacks are perfect here because you must resolve the most recently opened bracket before you can resolve earlier ones (LIFO).</p>

<h3>Algorithm for Valid Parentheses:</h3>
<ol>
  <li>Iterate through the string character by character.</li>
  <li>If the character is an opening bracket <code>(</code>, <code>{</code>, or <code>[</code>, <strong>push</strong> it onto the stack.</li>
  <li>If the character is a closing bracket <code>)</code>, <code>}</code>, or <code>]</code>:
    <ul>
      <li>If the stack is empty, return false (no matching opening bracket).</li>
      <li>Pop the top element from the stack.</li>
      <li>If the popped element does not match the type of the closing bracket, return false.</li>
    </ul>
  </li>
  <li>After the loop, if the stack is empty, return true (all matched). Otherwise, false.</li>
</ol>
<pre><code>function isValid(s) {
  let stack = [];
  let map = {
    ')': '(',
    '}': '{',
    ']': '['
  };

  for (let char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0) return false;
      let topElement = stack.pop();
      if (map[char] !== topElement) return false;
    }
  }

  return stack.length === 0;
}</code></pre>
<p><strong>Complexity:</strong> Time O(N) as we traverse the string once. Space O(N) worst-case if the string is all opening brackets.</p>
`,
    interviewQuestions: [
      {
        question: "1. Valid Parentheses (LeetCode 20)",
        answer: "Use a stack. Push opening brackets. When encountering a closing bracket, pop the stack and verify it matches the corresponding opening bracket type. Time O(N), Space O(N)."
      },
      {
        question: "2. Min Stack (LeetCode 155)",
        answer: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time. Use two stacks: one for actual elements, and another stack to keep track of the minimums. When pushing, if value <= minStack.top(), push to minStack. When popping, if popped value == minStack.top(), pop from minStack."
      },
      {
        question: "3. Evaluate Reverse Polish Notation (LeetCode 150)",
        answer: "Loop through tokens. If token is a number, push to stack. If token is an operator (+, -, *, /), pop two numbers from stack, apply operator (second popped operates on first popped), and push the result back. Time O(N), Space O(N)."
      },
      {
        question: "4. Daily Temperatures (LeetCode 739)",
        answer: "Wait, this is a Monotonic Stack problem! It asks how many days until a warmer temperature. Use a stack to keep track of indices of temperatures we haven't found a warmer day for yet. Time O(N), Space O(N)."
      },
      {
        question: "5. Remove All Adjacent Duplicates In String (LeetCode 1047)",
        answer: "Use a stack. For each char, if stack is not empty and char equals stack.top(), pop the stack. Otherwise, push the char. Finally, join the stack into a string. Time O(N), Space O(N)."
      }
    ],
    practicalTask: {
      scenario: "You are building a custom linter that checks mathematical expressions.",
      task: "Implement Evaluate Reverse Polish Notation. Note that division in JS yields floats, so use Math.trunc() to truncate toward zero.",
      solutionCode: `function evalRPN(tokens) {
  let stack = [];
  for (let token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      let b = stack.pop();
      let a = stack.pop();
      if (token === '+') stack.push(a + b);
      if (token === '-') stack.push(a - b);
      if (token === '*') stack.push(a * b);
      if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`
    }
  },
  {
    slug: "monotonic-stacks",
    title: "17. Monotonic Stacks (Advanced)",
    order: 17,
    content: `<h2>The Monotonic Stack Pattern</h2>
<p>A <strong>Monotonic Stack</strong> is a regular stack whose elements are always sorted in a specific order (either strictly increasing or strictly decreasing). It is the undisputed king of solving "Next Greater Element" or "Next Smaller Element" problems in O(N) time.</p>
<p>Why use it? If you use a brute-force approach to find the next greater element for every item in an array, it takes O(N^2). A monotonic stack reduces this to O(N) because every element is pushed and popped exactly once.</p>

<h3>Monotonic Decreasing Stack</h3>
<p>Used to find the <strong>Next Greater Element</strong>. The stack stores elements in decreasing order from bottom to top. If an incoming element is <em>greater</em> than the top of the stack, it means the incoming element is the "next greater element" for the top of the stack.</p>

<pre><code>// Finding Next Greater Element for each item in an array
function nextGreaterElements(nums) {
  let res = new Array(nums.length).fill(-1);
  let stack = []; // Stores indices

  for (let i = 0; i < nums.length; i++) {
    // While stack is not empty AND current element > element at stack's top index
    while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
      let poppedIndex = stack.pop();
      res[poppedIndex] = nums[i]; // The next greater element is found!
    }
    stack.push(i);
  }
  return res;
}</code></pre>
<p><strong>Complexity:</strong> Time O(N). Space O(N).</p>

<h2>Trapping Rain Water</h2>
<p>One of the most famous FAANG hard questions. Given an array of non-negative integers representing an elevation map, compute how much water it can trap after raining.</p>
<p>There are multiple ways to solve this (Two Pointers, Dynamic Programming arrays). But the Monotonic Stack approach is beautiful. We use a decreasing stack to store indices. When we find an elevation <em>higher</em> than the stack top, it means we've found the right boundary of a potential puddle!</p>
<pre><code>function trap(height) {
  let stack = []; // Stores indices of descending heights
  let water = 0;

  for (let i = 0; i < height.length; i++) {
    // Found a right boundary that might trap water
    while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
      let bottomIndex = stack.pop();
      if (stack.length === 0) break; // No left boundary, water spills out
      
      let leftBoundaryIndex = stack[stack.length - 1];
      
      let width = i - leftBoundaryIndex - 1;
      let boundedHeight = Math.min(height[leftBoundaryIndex], height[i]) - height[bottomIndex];
      
      water += width * boundedHeight;
    }
    stack.push(i);
  }

  return water;
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Next Greater Element I (LeetCode 496)",
        answer: "Use a monotonic decreasing stack to map each number to its next greater element in O(N) time. Time O(N), Space O(N)."
      },
      {
        question: "2. Daily Temperatures (LeetCode 739)",
        answer: "Classic monotonic stack. Stack stores indices. When current temp > temp at stack top index, pop and calculate `days = current_index - popped_index`. Time O(N), Space O(N)."
      },
      {
        question: "3. Largest Rectangle in Histogram (LeetCode 84)",
        answer: "Hard! Use a monotonic increasing stack. The stack stores indices. If current height < stack top height, it means the right boundary for the rectangle at stack top is found. The left boundary is the new stack top after popping. Calculate area. Time O(N), Space O(N)."
      },
      {
        question: "4. Trapping Rain Water (LeetCode 42)",
        answer: "Can be solved with Monotonic Decreasing Stack. When current height > stack top, pop stack (this is the 'bottom' of the puddle). New stack top is left boundary. Current index is right boundary. Water added = width * (min(left, right) - bottom). Time O(N), Space O(N)."
      },
      {
        question: "5. 132 Pattern (LeetCode 456)",
        answer: "Given an array, find if there is i < j < k such that nums[i] < nums[k] < nums[j]. Iterate backwards. Maintain a stack for potential 'k' values. Keep track of the maximum 'k' value found so far (the third element). If we find an element smaller than this max 'k', we've found the pattern! Time O(N), Space O(N)."
      }
    ],
    practicalTask: {
      scenario: "You have a list of daily stock prices. You want to know, for each day, how many days you have to wait until a better (higher) price.",
      task: "Implement Daily Temperatures. Return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
      solutionCode: `function dailyTemperatures(temperatures) {
  let res = new Array(temperatures.length).fill(0);
  let stack = []; // Monotonic decreasing stack holding indices

  for (let i = 0; i < temperatures.length; i++) {
    while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      let prevIndex = stack.pop();
      res[prevIndex] = i - prevIndex;
    }
    stack.push(i);
  }

  return res;
}`
    }
  },
  {
    slug: "queue-fundamentals",
    title: "18. Queue Fundamentals & Circular Queues",
    order: 18,
    content: `<h2>Queue Fundamentals</h2>
<p>A <strong>Queue</strong> is a linear data structure that follows <strong>FIFO (First In First Out)</strong> order. Like a line of people waiting for a movie: the first person to get in line is the first person to get a ticket.</p>
<p>Primary operations:</p>
<ul>
  <li><strong>Enqueue:</strong> Add an element to the back (tail) of the queue.</li>
  <li><strong>Dequeue:</strong> Remove and return the front (head) element of the queue.</li>
  <li><strong>Front (Peek):</strong> View the front element.</li>
</ul>

<h3>The JavaScript Queue Problem</h3>
<p>In JavaScript, using an array as a queue is conceptually easy: <code>push()</code> to enqueue, <code>shift()</code> to dequeue. <strong>HOWEVER</strong>, <code>shift()</code> is an O(N) operation because shifting the first element requires moving all subsequent elements down by one index. In an interview, using <code>shift()</code> for a queue might fail large test cases due to Time Limit Exceeded (TLE).</p>
<p>To implement a true O(1) Queue in JS, you use an object (or Map) with two pointers.</p>
<pre><code>class Queue {
  constructor() {
    this.items = {};
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  enqueue(item) {
    this.items[this.tailIndex] = item;
    this.tailIndex++;
  }

  dequeue() {
    if (this.headIndex === this.tailIndex) return undefined;
    const item = this.items[this.headIndex];
    delete this.items[this.headIndex];
    this.headIndex++;
    return item;
  }

  peek() {
    return this.items[this.headIndex];
  }

  get length() {
    return this.tailIndex - this.headIndex;
  }
}</code></pre>

<h2>Circular Queues</h2>
<p>A Circular Queue is a fixed-size queue that connects the end back to the beginning to form a circle. It overcomes the limitation of a standard array-based queue where dequeued spaces cannot be reused without shifting everything.</p>
<p>When you enqueue, the tail pointer moves forward. If it hits the end of the array, it wraps around to index 0 (using the modulo <code>%</code> operator). Same for the head pointer.</p>
<pre><code>// Moving the tail pointer in a Circular Queue of capacity K
tail = (tail + 1) % K;</code></pre>
<p>Circular Queues are heavily used in operating systems for thread scheduling and in networking for packet buffers.</p>
`,
    interviewQuestions: [
      {
        question: "1. Implement Queue using Stacks (LeetCode 232)",
        answer: "Use two stacks (stack1 for enqueue, stack2 for dequeue). Push normally to stack1. When popping/peeking, if stack2 is empty, pop EVERYTHING from stack1 and push it into stack2 (this reverses the LIFO order to FIFO). Then pop from stack2. Amortized Time O(1), Space O(N)."
      },
      {
        question: "2. Design Circular Queue (LeetCode 622)",
        answer: "Use a fixed-size array and two pointers (head and tail). `tail = (tail + 1) % capacity`. Track the current `size` of the queue to easily check `isFull()` and `isEmpty()` without complex pointer arithmetic."
      },
      {
        question: "3. Design Circular Deque (LeetCode 641)",
        answer: "A Deque (Double Ended Queue) allows insertion and deletion from BOTH ends. Same logic as Circular Queue, but you must also handle `insertFront` (`head = (head - 1 + capacity) % capacity`) and `deleteLast` (`tail = (tail - 1 + capacity) % capacity`)."
      },
      {
        question: "4. Number of Recent Calls (LeetCode 933)",
        answer: "You have a `ping(t)` function. Return the number of pings within the last 3000 milliseconds. Use a Queue. Enqueue the new time `t`. Then dequeue all times from the front of the queue that are `< t - 3000`. Return queue length. Time O(1) amortized, Space O(W) where W is max pings in 3 seconds."
      },
      {
        question: "5. Moving Average from Data Stream (LeetCode 346)",
        answer: "Given a stream of integers and a window size, calculate the moving average of all integers in the sliding window. Use a Queue and maintain a running `sum`. When queue size exceeds window, dequeue, subtract from sum, and enqueue new value. Time O(1), Space O(W)."
      }
    ],
    practicalTask: {
      scenario: "You are designing a thread-pool job scheduler that accepts jobs but has a strict memory limit.",
      task: "Implement Design Circular Queue. Support enQueue, deQueue, Front, Rear, isEmpty, and isFull.",
      solutionCode: `class MyCircularQueue {
  constructor(k) {
    this.queue = new Array(k);
    this.head = -1;
    this.tail = -1;
    this.size = 0;
    this.capacity = k;
  }

  enQueue(value) {
    if (this.isFull()) return false;
    if (this.isEmpty()) this.head = 0;
    this.tail = (this.tail + 1) % this.capacity;
    this.queue[this.tail] = value;
    this.size++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    if (this.isEmpty()) {
      this.head = -1;
      this.tail = -1;
    }
    return true;
  }

  Front() {
    if (this.isEmpty()) return -1;
    return this.queue[this.head];
  }

  Rear() {
    if (this.isEmpty()) return -1;
    return this.queue[this.tail];
  }

  isEmpty() {
    return this.size === 0;
  }

  isFull() {
    return this.size === this.capacity;
  }
}`
    }
  },
  {
    slug: "sliding-window-maximum",
    title: "19. Sliding Window Maximum (Deque)",
    order: 19,
    content: `<h2>The Double-Ended Queue (Deque)</h2>
<p>A <strong>Deque</strong> (pronounced "deck") allows you to push and pop from BOTH ends in O(1) time. While JavaScript doesn't have a built-in Deque, you can simulate it with an array (using push/pop and shift/unshift, though shift/unshift are O(N)), or build a custom Doubly Linked List.</p>

<h2>Sliding Window Maximum</h2>
<p>This is arguably the most famous Deque problem (LeetCode 239). Given an array of integers and a window size <code>k</code>, find the maximum element in each sliding window.</p>
<p><strong>Brute Force:</strong> For each window, scan all <code>k</code> elements to find the max. Time O(N * k).</p>
<p><strong>Optimal: Monotonic Decreasing Deque.</strong> We can solve this in O(N) Time. The idea is to maintain a deque that stores indices, ensuring the values at those indices are strictly decreasing. This guarantees that the front of the deque is ALWAYS the index of the maximum value for the current window.</p>

<h3>Algorithm for Sliding Window Maximum</h3>
<ol>
  <li>Iterate through the array.</li>
  <li><strong>Clean the tail:</strong> Remove indices from the back of the deque if their corresponding values are smaller than the incoming element. They are useless now because they can never be the maximum (the incoming element is larger and arrives later).</li>
  <li><strong>Clean the head:</strong> Remove the index at the front of the deque if it has fallen out of the current window boundaries (<code>i - k >= deque[0]</code>).</li>
  <li><strong>Push:</strong> Add the current index <code>i</code> to the back of the deque.</li>
  <li><strong>Record answer:</strong> If the window has hit size <code>k</code> (i.e., <code>i >= k - 1</code>), the maximum is at the front of the deque. Push it to the result array.</li>
</ol>
<pre><code>function maxSlidingWindow(nums, k) {
  let res = [];
  let deque = []; // stores indices

  for (let i = 0; i < nums.length; i++) {
    // 1. Clean the tail
    while (deque.length > 0 && nums[i] >= nums[deque[deque.length - 1]]) {
      deque.pop();
    }
    
    // 2. Clean the head (remove indices out of window)
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift(); // Note: shift is O(N) in JS arrays, but amortized overall it's acceptable for many JS environments, or use a custom LinkedList for true O(1)
    }
    
    // 3. Push incoming
    deque.push(i);
    
    // 4. Record answer (if window is full)
    if (i >= k - 1) {
      res.push(nums[deque[0]]);
    }
  }

  return res;
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Sliding Window Maximum (LeetCode 239)",
        answer: "Use a Monotonic Decreasing Deque storing indices. Maintain decreasing order by popping smaller elements from the back. Remove elements out of window bounds from the front. Front is always the max. Time O(N), Space O(K)."
      },
      {
        question: "2. Shortest Subarray with Sum at Least K (LeetCode 862)",
        answer: "Very hard! Compute prefix sums. Use a Monotonic Increasing Deque of indices. If `prefix[i] - prefix[deque[0]] >= k`, we found a valid subarray; update min length and shift deque. To maintain monotonicity, pop from back if `prefix[i] <= prefix[deque.back()]`. Time O(N), Space O(N)."
      },
      {
        question: "3. Continuous Subarray Sum (LeetCode 523)",
        answer: "Not exactly a deque, but related to running sums. Keep a hash map of `prefix_sum % k` and its index. If you see the same remainder again, it means the subarray sum between those indices is a multiple of k."
      },
      {
        question: "4. Maximize the Confusion of an Exam (LeetCode 2024)",
        answer: "Standard sliding window, but can be conceptualized like a deque/queue holding the state. Keep track of counts of 'T' and 'F'. Expand window. If `min(count_T, count_F) > k`, shrink window from left. Time O(N)."
      },
      {
        question: "5. Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit (LeetCode 1438)",
        answer: "Maintain TWO deques! One monotonic increasing (to find window min), one monotonic decreasing (to find window max). If `maxDeque[0] - minDeque[0] > limit`, shrink the left pointer of the window and update deques. Time O(N), Space O(N)."
      }
    ],
    practicalTask: {
      scenario: "You are analyzing real-time trading data to find the highest spike in 5-minute rolling windows.",
      task: "Implement Sliding Window Maximum optimally.",
      solutionCode: `function maxSlidingWindow(nums, k) {
  let res = [];
  let q = []; 
  for (let i = 0; i < nums.length; i++) {
    while (q.length > 0 && nums[q[q.length - 1]] <= nums[i]) {
      q.pop();
    }
    q.push(i);
    if (q[0] === i - k) {
      q.shift();
    }
    if (i >= k - 1) {
      res.push(nums[q[0]]);
    }
  }
  return res;
}`
    }
  },
  {
    slug: "stacks-vs-queues-implementations",
    title: "20. Stacks vs Queues: Intersections",
    order: 20,
    content: `<h2>Stacks vs Queues</h2>
<p>While Stacks (LIFO) and Queues (FIFO) act in fundamentally opposite ways, they are deeply related. In fact, you can implement one using the other. These types of problems are favorite warm-up questions in FAANG interviews because they test your mastery of the data structures' properties rather than algorithmic complexity.</p>

<h2>Implementing a Queue using Stacks</h2>
<p>A Queue requires FIFO. A Stack provides LIFO. To get FIFO from LIFO, you need to reverse the order <strong>twice</strong>.</p>
<p>We use two stacks: <code>pushStack</code> and <code>popStack</code>.</p>
<ul>
  <li><strong>Enqueue:</strong> Simply push to <code>pushStack</code>.</li>
  <li><strong>Dequeue/Peek:</strong> If <code>popStack</code> is empty, we pop everything from <code>pushStack</code> and push it into <code>popStack</code>. This reverses the order, putting the oldest element right at the top of <code>popStack</code>! Then pop/peek from <code>popStack</code>.</li>
</ul>
<pre><code>class MyQueue {
  constructor() {
    this.pushStack = [];
    this.popStack = [];
  }

  push(x) {
    this.pushStack.push(x);
  }

  pop() {
    this.shiftStacks();
    return this.popStack.pop();
  }

  peek() {
    this.shiftStacks();
    return this.popStack[this.popStack.length - 1];
  }

  empty() {
    return this.pushStack.length === 0 && this.popStack.length === 0;
  }

  shiftStacks() {
    if (this.popStack.length === 0) {
      while (this.pushStack.length > 0) {
        this.popStack.push(this.pushStack.pop());
      }
    }
  }
}</code></pre>
<p><strong>Complexity:</strong> Push is O(1). Pop is Amortized O(1) (sometimes O(N) when shifting, but overall averages to O(1)). Space is O(N).</p>

<h2>Implementing a Stack using Queues</h2>
<p>You can also implement a Stack using Queues. This is slightly less efficient.</p>
<p>Using one Queue: To make it act like a Stack, whenever you push an element, you immediately dequeue all previous elements and re-enqueue them behind the new element. This puts the newly pushed element at the very front of the queue.</p>
<pre><code>class MyStack {
  constructor() {
    this.q = []; // Using array push/shift as a queue
  }

  push(x) {
    this.q.push(x);
    let size = this.q.length;
    // Rotate the queue to put new element at the front
    while (size > 1) {
      this.q.push(this.q.shift());
      size--;
    }
  }

  pop() {
    return this.q.shift();
  }

  top() {
    return this.q[0];
  }

  empty() {
    return this.q.length === 0;
  }
}</code></pre>
<p><strong>Complexity:</strong> Push is O(N). Pop is O(1). Space O(N).</p>
`,
    interviewQuestions: [
      {
        question: "1. Implement Queue using Stacks (LeetCode 232)",
        answer: "Use two stacks. Push to s1. For pop/peek, transfer all from s1 to s2 if s2 is empty. Amortized Time O(1)."
      },
      {
        question: "2. Implement Stack using Queues (LeetCode 225)",
        answer: "Use one queue. When pushing, append to queue, then rotate the queue `size - 1` times by dequeuing and enqueuing. Push Time O(N), Pop Time O(1)."
      },
      {
        question: "3. Design a Stack With Increment Operation (LeetCode 1381)",
        answer: "Use an array for the stack and a separate `inc` array of the same size to lazy-evaluate increments. When popping, add `inc[i]` to `stack[i]`, and carry over `inc[i]` to `inc[i-1]`. Time O(1) for all ops."
      },
      {
        question: "4. Asteroid Collision (LeetCode 735)",
        answer: "Use a Stack. Positive asteroids move right, negative move left. Iterate. If negative, and top of stack is positive, collision happens! Loop popping from stack if stack top < abs(current). Time O(N)."
      },
      {
        question: "5. Removing Stars From a String (LeetCode 2390)",
        answer: "Use a Stack. If char is '*', pop the stack. Else, push char. Return stack joined. Time O(N), Space O(N)."
      }
    ],
    practicalTask: {
      scenario: "You have a restrictive environment that only provides LIFO data structures, but you need FIFO behavior.",
      task: "Implement a Queue using two Stacks. All operations must have an amortized O(1) time complexity.",
      solutionCode: `class MyQueue {
  constructor() {
    this.in = [];
    this.out = [];
  }
  push(x) {
    this.in.push(x);
  }
  pop() {
    this.peek();
    return this.out.pop();
  }
  peek() {
    if (this.out.length === 0) {
      while (this.in.length > 0) {
        this.out.push(this.in.pop());
      }
    }
    return this.out[this.out.length - 1];
  }
  empty() {
    return this.in.length === 0 && this.out.length === 0;
  }
}`
    }
  }
];

appendDsaTopics(topics);
