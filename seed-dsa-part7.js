import { appendDsaTopics } from './dsa-seeder-utils.js';

const topics = [
  {
    slug: "dsa-ch31-intro-heaps",
    title: "Chapter 31: Introduction to Heaps and Priority Queues",
    order: 31,
    content: `<h2>The Power of Heaps</h2>
<p>A <b>Heap</b> is a specialized tree-based data structure that satisfies the <i>Heap Property</i>. It is an incredibly powerful tool for problems where you need constant and immediate access to the maximum or minimum element in a dynamic dataset.</p>
<h3>Structural Property: The Complete Binary Tree</h3>
<p>A Heap is strictly a <b>Complete Binary Tree</b>. This means every level of the tree is completely filled, except possibly the last level, which is filled from left to right. This structural property ensures that the tree is always perfectly balanced, guaranteeing a height of <code>O(log N)</code>.</p>
<h3>The Heap Property</h3>
<ul>
<li><b>Max-Heap:</b> The value of every parent node is greater than or equal to the values of its children. The absolute maximum element is always at the root.</li>
<li><b>Min-Heap:</b> The value of every parent node is less than or equal to the values of its children. The absolute minimum element is always at the root.</li>
</ul>
<h3>Array Representation</h3>
<p>Because Heaps are complete binary trees, they don't require node objects with left and right pointers. They can be elegantly and efficiently represented as a flat array. This saves space and provides excellent cache locality.</p>
<p>For any element at index <code>i</code> (assuming 0-indexed array):</p>
<ul>
<li><b>Left Child Index:</b> <code>2 * i + 1</code></li>
<li><b>Right Child Index:</b> <code>2 * i + 2</code></li>
<li><b>Parent Index:</b> <code>Math.floor((i - 1) / 2)</code></li>
</ul>
<pre><code>// Example of a Min-Heap Array
const minHeap = [10, 15, 20, 17, 25];
// 10 is the root.
// Children of 10 (index 0) are at index 1 (15) and index 2 (20).
// Children of 15 (index 1) are at index 3 (17) and index 4 (25).
</code></pre>
<h3>Brute Force vs Heap</h3>
<p>If you just use a standard unsorted array to keep track of a dynamically changing minimum, inserting is <code>O(1)</code> but finding/extracting the minimum is <code>O(N)</code>. If you keep the array sorted, finding the minimum is <code>O(1)</code> but inserting a new element takes <code>O(N)</code> due to shifting elements. A Heap gives you the best of both worlds: <code>O(log N)</code> for insertion and <code>O(log N)</code> for extraction, while keeping minimum access at <code>O(1)</code>.</p>`,
    interviewQuestions: [
      { question: "What makes a Heap fundamentally different from a Binary Search Tree (BST)?", answer: "A BST guarantees a horizontal ordering (left child < parent < right child), which allows for efficient searching of any element in O(log N). A Heap only guarantees vertical ordering (parent < children in a Min-Heap) but no ordering between siblings. Therefore, searching for a specific element in a Heap takes O(N), but accessing the min/max is strictly O(1)." },
      { question: "Why do we represent Heaps using Arrays instead of Pointers?", answer: "Because Heaps are Complete Binary Trees, there are no 'gaps' in the tree. An array representation avoids the memory overhead of storing left/right pointers. Furthermore, arrays provide contiguous memory allocation, which heavily benefits CPU cache locality, making operations extremely fast in practice." },
      { question: "Can a sorted array be considered a valid Min-Heap? What about a Max-Heap?", answer: "Yes, an array sorted in ascending order is always a valid Min-Heap. The root is at index 0, and because it's sorted, any element at index `i` is guaranteed to be less than elements at `2i+1` and `2i+2`. Similarly, a descending sorted array is a valid Max-Heap." },
      { question: "How do you find the leaf nodes of a Heap represented as an array of size N?", answer: "In a complete binary tree represented by an array of size `N`, the leaf nodes are located from index `Math.floor(N/2)` up to `N - 1`. This property is crucial for algorithms like building a heap in O(N) time." },
      { question: "What is the height of a Heap containing N elements?", answer: "Since a Heap is a Complete Binary Tree, its height is exactly `floor(log2(N))`. This tightly bounds the time complexity of insertion and deletion operations." },
      { question: "Is a Heap a stable data structure?", answer: "No, Heaps are inherently unstable. If you insert multiple elements with the exact same priority, their relative extraction order is not guaranteed to be the same as their insertion order due to the bubbling up and down mechanics." }
    ],
    practicalTask: {
      scenario: "Array Representation Checking.",
      task: "Given an array of integers, write a function to check if the array represents a valid Min-Heap.",
      solutionCode: `function isMinHeap(arr) {
  // We only need to check up to the last parent node
  const lastParentIndex = Math.floor(arr.length / 2) - 1;
  
  for (let i = 0; i <= lastParentIndex; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Check left child
    if (left < arr.length && arr[i] > arr[left]) {
      return false;
    }
    // Check right child
    if (right < arr.length && arr[i] > arr[right]) {
      return false;
    }
  }
  return true;
}`
    }
  },
  {
    slug: "dsa-ch32-heap-operations",
    title: "Chapter 32: Heap Operations (Insert, Extract, Heapify)",
    order: 32,
    content: `<h2>The Mechanics of Heaps</h2>
<p>To maintain the structural and heap properties, Heaps rely on two core procedures: <b>Sift Up</b> (Bubble Up) and <b>Sift Down</b> (Bubble Down).</p>
<h3>Insertion: Sift Up</h3>
<p>When inserting a new element, you place it at the very end of the array (to maintain the Complete Binary Tree property). Then, you compare the newly inserted element with its parent. If the heap property is violated (e.g., in a Min-Heap, the new element is smaller than its parent), you swap them. You repeat this "sifting up" process until the heap property is restored or the element reaches the root.</p>
<p><b>Time Complexity:</b> <code>O(log N)</code> since you traverse up the height of the tree.</p>
<h3>Extraction: Sift Down</h3>
<p>To extract the root (the min/max element), you remove it and replace it with the very last element in the array (again, to maintain the structural property). Now, the root likely violates the heap property. You compare the new root with its children and swap it with the smaller child (in a Min-Heap) or larger child (in a Max-Heap). You continue "sifting down" until the element is smaller than both its children or it becomes a leaf node.</p>
<p><b>Time Complexity:</b> <code>O(log N)</code> since you traverse down the height of the tree.</p>
<h3>Building a Heap: The O(N) Magic</h3>
<p>If you have an unsorted array of size N and want to turn it into a heap, calling <code>Insert</code> N times would take <code>O(N log N)</code>. However, there is a better way called <b>Heapify</b> (or Floyd's algorithm).</p>
<p>Notice that leaf nodes are trivially valid heaps by themselves. By starting from the last non-leaf node (at index <code>Math.floor(N/2) - 1</code>) and iterating backwards to the root, performing a <code>Sift Down</code> on each node, you can build a heap in strictly <b>O(N) time</b>. This mathematical phenomenon occurs because most nodes in a tree are at the bottom and only sift down a short distance.</p>
<pre><code>// Sift Down Helper for Min-Heap
function siftDown(heap, i, length) {
  let smallest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < length && heap[left] < heap[smallest]) smallest = left;
  if (right < length && heap[right] < heap[smallest]) smallest = right;

  if (smallest !== i) {
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    siftDown(heap, smallest, length);
  }
}

// O(N) Heapify
function heapify(array) {
  // Start from last parent node
  const startIdx = Math.floor(array.length / 2) - 1;
  for (let i = startIdx; i >= 0; i--) {
    siftDown(array, i, array.length);
  }
}
</code></pre>`,
    interviewQuestions: [
      { question: "Why is building a heap from an array O(N) instead of O(N log N)?", answer: "Although `siftDown` takes O(log N) time, when building a heap, most of the nodes are near the bottom of the tree. The leaf nodes (N/2 elements) require 0 sift downs. Nodes one level above leaves require at most 1 swap, etc. When you mathematically sum the maximum number of operations per level across the tree, the series converges to strictly O(N)." },
      { question: "Explain the process of extracting the minimum element from a Min-Heap.", answer: "First, you store the root value (the minimum) to return it later. Then, you take the last element in the array and place it at the root position, popping the last element off the array. Finally, you run `siftDown` on the new root to bubble it down until it is smaller than both its children, restoring the Min-Heap property." },
      { question: "What happens if we insert elements in strictly descending order into a Min-Heap?", answer: "Every newly inserted element will be smaller than its parent and will have to bubble all the way up to the root. Therefore, every insertion will take the maximum O(log N) time, resulting in a total time of O(N log N)." },
      { question: "How do you decrease the key of a specific element in a Min-Heap?", answer: "You first update the value of the node at the specific index. Because you decreased the value, it can only violate the Min-Heap property with its parent. Therefore, you just call `siftUp` on that index. Time complexity is O(log N)." },
      { question: "How would you delete an arbitrary element from a Heap (not the root)?", answer: "First, locate the element (which takes O(N) time unless you maintain an auxiliary hash map of indices). Swap that element with the last element in the heap and remove the last element. Now, the swapped element might violate the heap property. Depending on its value, you must either `siftUp` or `siftDown` the element." }
    ],
    practicalTask: {
      scenario: "Implementing Sift Up.",
      task: "Implement the `siftUp` function to be used during insertion in a Min-Heap array.",
      solutionCode: `function siftUp(heap, i) {
  let currentIndex = i;
  let parentIndex = Math.floor((currentIndex - 1) / 2);

  // While not at root and current is smaller than parent
  while (currentIndex > 0 && heap[currentIndex] < heap[parentIndex]) {
    // Swap current and parent
    [heap[currentIndex], heap[parentIndex]] = [heap[parentIndex], heap[currentIndex]];
    
    // Update indices for next iteration
    currentIndex = parentIndex;
    parentIndex = Math.floor((currentIndex - 1) / 2);
  }
}`
    }
  },
  {
    slug: "dsa-ch33-priority-queues-js",
    title: "Chapter 33: Priority Queues in JavaScript",
    order: 33,
    content: `<h2>The Missing Data Structure</h2>
<p>A <b>Priority Queue (PQ)</b> is an abstract data type similar to a regular queue or stack, but every element has a "priority" associated with it. An element with high priority is served before an element with low priority.</p>
<p>Languages like Java (<code>PriorityQueue</code>) and C++ (<code>std::priority_queue</code>) have this built-in. <b>JavaScript does not.</b> As a Senior JS Engineer or interviewee, you must know how to quickly write one from scratch using a Heap, as building a PQ using a sorted array will instantly fail you on time limits.</p>
<h3>Implementing a Min-Priority Queue in JS</h3>
<p>We wrap the array and heap operations into a clean class. Note: In real interviews, try to keep it as simple as possible.</p>
<pre><code>class MinPriorityQueue {
  constructor() {
    this.heap = [];
  }

  // O(1)
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  // O(log N)
  enqueue(val) {
    this.heap.push(val);
    this._siftUp(this.heap.length - 1);
  }

  // O(log N)
  dequeue() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._siftDown(0);
    return min;
  }

  _siftUp(i) {
    let parent = Math.floor((i - 1) / 2);
    while (i > 0 && this.heap[i] < this.heap[parent]) {
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
      parent = Math.floor((i - 1) / 2);
    }
  }

  _siftDown(i) {
    let minIdx = i;
    const len = this.heap.length;
    while (true) {
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      
      if (left < len && this.heap[left] < this.heap[minIdx]) minIdx = left;
      if (right < len && this.heap[right] < this.heap[minIdx]) minIdx = right;
      
      if (minIdx !== i) {
        [this.heap[i], this.heap[minIdx]] = [this.heap[minIdx], this.heap[i]];
        i = minIdx;
      } else {
        break;
      }
    }
  }
}
</code></pre>`,
    interviewQuestions: [
      { question: "When should you use a Priority Queue instead of sorting an array?", answer: "Sorting an array is O(N log N) and provides a fully ordered sequence statically. Use a Priority Queue when the dataset is dynamically changing (streaming data) and you only need continuous access to the absolute extremum (min/max). Finding the min in a dynamically changing set using a PQ takes O(log N) per operation, whereas resorting an array takes O(N log N) every time." },
      { question: "How do you implement a Max-Priority Queue using a Min-Priority Queue implementation?", answer: "If you only have a Min-Priority Queue class, you can create a Max-PQ by simply negating the numbers before inserting them (`enqueue(-val)`). When you extract the minimum, negate it again to get the maximum (`-dequeue()`)." },
      { question: "What are the space and time complexity tradeoffs in an array-based PQ (unsorted array) vs a Heap-based PQ?", answer: "An unsorted array PQ has O(1) enqueue and O(N) dequeue, with O(N) space. A sorted array PQ has O(N) enqueue and O(1) dequeue, with O(N) space. A Heap-based PQ provides an optimal middle ground: O(log N) enqueue, O(log N) dequeue, and O(1) min-access, using O(N) space." },
      { question: "Can we use a Binary Search Tree (BST) to implement a Priority Queue? What are the tradeoffs?", answer: "Yes. A balanced BST (like an AVL or Red-Black Tree) also provides O(log N) insertions and deletions, and finding the min/max is O(log N). However, BSTs require massive overhead: storing node pointers, dynamic memory allocation per node, and complex tree rotation logic. Heaps are strictly array-based, cache-friendly, computationally lighter, and much easier to implement." },
      { question: "How do you handle elements with equal priorities in a Priority Queue?", answer: "Heaps are not stable. If you need a stable Priority Queue (where equal priorities are dequeued in FIFO order), you must store an object containing both the value and an incrementally assigned timestamp or sequence number. Modify the comparator to check the timestamp if the primary priorities are equal." }
    ],
    practicalTask: {
      scenario: "Custom Comparator Priority Queue.",
      task: "Modify the PQ logic to accept a custom comparator function, allowing it to store objects instead of just numbers.",
      solutionCode: `class PriorityQueue {
  constructor(compare) {
    this.heap = [];
    this.compare = compare; // (a, b) => a < b for Min-Heap
  }

  enqueue(val) {
    this.heap.push(val);
    let i = this.heap.length - 1;
    let parent = Math.floor((i - 1) / 2);
    while (i > 0 && this.compare(this.heap[i], this.heap[parent])) {
      [this.heap[i], this.heap[parent]] = [this.heap[parent], this.heap[i]];
      i = parent;
      parent = Math.floor((i - 1) / 2);
    }
  }
}`
    }
  },
  {
    slug: "dsa-ch34-heap-sort",
    title: "Chapter 34: Heap Sort Algorithm",
    order: 34,
    content: `<h2>In-Place Array Sorting</h2>
<p>Heap Sort is a highly efficient comparison-based sorting algorithm. It divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element and moving it to the sorted region. Best of all, it sorts <b>in-place</b> with an <code>O(1)</code> space complexity.</p>
<h3>The Algorithm Breakdown</h3>
<p>To sort an array in <b>ascending order</b>, you must use a <b>Max-Heap</b>. (This seems counter-intuitive, but it's essential for the in-place mechanics).</p>
<ol>
<li><b>Build the Max-Heap:</b> Run the O(N) <code>heapify</code> procedure on the input array to turn it into a valid Max-Heap. Now the largest element is at index 0.</li>
<li><b>Extract and Swap:</b> Swap the element at index 0 (the max) with the last element of the heap. This puts the largest element in its final sorted position at the end of the array.</li>
<li><b>Shrink and Heapify:</b> Decrease the conceptual "size" of the heap by 1 (ignoring the sorted element at the end). Call <code>siftDown</code> on index 0 to bubble the new root down and restore the Max-Heap property.</li>
<li><b>Repeat:</b> Repeat steps 2 and 3 until the heap size reaches 1.</li>
</ol>
<h3>Complexity Analysis</h3>
<ul>
<li><b>Time Complexity:</b> Building the heap takes <code>O(N)</code>. We then perform <code>N - 1</code> extractions, each taking <code>O(log N)</code>. Total time: <b><code>O(N log N)</code></b>. This is the worst-case, average-case, and best-case time complexity.</li>
<li><b>Space Complexity:</b> <b><code>O(1)</code></b> auxiliary space since all operations, swaps, and sifting occur directly within the original array without using additional arrays or deep call stacks (if implemented iteratively).</li>
</ul>
<pre><code>function heapSort(arr) {
  const n = arr.length;

  // 1. Build Max Heap in O(N)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDownMax(arr, i, n);
  }

  // 2. Extract elements one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root (max) to end
    [arr[0], arr[i]] = [arr[i], arr[0]];
    // Call max heapify on the reduced heap
    siftDownMax(arr, 0, i); 
  }
  return arr;
}

function siftDownMax(arr, i, heapSize) {
  let largest = i;
  let left = 2 * i + 1;
  let right = 2 * i + 2;

  if (left < heapSize && arr[left] > arr[largest]) largest = left;
  if (right < heapSize && arr[right] > arr[largest]) largest = right;

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    siftDownMax(arr, largest, heapSize);
  }
}
</code></pre>`,
    interviewQuestions: [
      { question: "Is Heap Sort stable? Why or why not?", answer: "Heap Sort is NOT stable. The process of building the heap and repeatedly swapping the root with the last element completely disrupts the relative ordering of elements with identical values. If stability is required, Merge Sort is the correct choice." },
      { question: "Why does Heap Sort use a Max-Heap to sort an array in ascending order?", answer: "Because Heap Sort operates in-place. If we used a Min-Heap, the smallest element would be at the root. Extracting it and putting it into a separate sorted array requires O(N) space. By using a Max-Heap, the largest element is at the root. We swap it with the very last element of the array, successfully placing it in its correct final sorted position, while ignoring it in subsequent heap operations." },
      { question: "Compare Heap Sort with Quick Sort and Merge Sort.", answer: "Quick Sort is fast in practice (good cache locality) but has O(N^2) worst-case time complexity and isn't stable. Merge Sort is stable and strictly O(N log N) but requires O(N) auxiliary space. Heap Sort is strictly O(N log N) in the worst case and requires O(1) space, but it has poor cache locality (nodes jump around the array) making it slower than Quick Sort in real-world constants." },
      { question: "What is the worst-case time complexity of Heap Sort?", answer: "The worst-case time complexity is strictly O(N log N). Unlike Quick Sort which degrades to O(N^2) on bad pivots, Heap Sort mathematically bounds the tree depth to log N, ensuring constant performance." },
      { question: "Can Heap Sort be used in environments with extremely strict memory limits (embedded systems)?", answer: "Yes, this is exactly where Heap Sort shines. Because it guarantees O(N log N) execution with an absolute O(1) memory footprint (without recursion stacks), it is heavily used in Linux kernel implementations and mission-critical embedded systems where memory constraints are tight and predictable performance is mandatory." }
    ],
    practicalTask: {
      scenario: "Kth Largest Element in an Array.",
      task: "Given an integer array nums and an integer k, return the kth largest element. Note: Don't sort the whole array. Use a Heap approach.",
      solutionCode: `function findKthLargest(nums, k) {
  // Build a Min-Heap of size K.
  const minHeap = [];
  
  const siftUp = (i) => {
    let parent = Math.floor((i - 1) / 2);
    while (i > 0 && minHeap[i] < minHeap[parent]) {
      [minHeap[i], minHeap[parent]] = [minHeap[parent], minHeap[i]];
      i = parent;
      parent = Math.floor((i - 1) / 2);
    }
  };
  
  const siftDown = (i) => {
    let minIdx = i;
    let len = minHeap.length;
    while(true) {
      let left = 2 * i + 1, right = 2 * i + 2;
      if(left < len && minHeap[left] < minHeap[minIdx]) minIdx = left;
      if(right < len && minHeap[right] < minHeap[minIdx]) minIdx = right;
      if(minIdx !== i) {
        [minHeap[i], minHeap[minIdx]] = [minHeap[minIdx], minHeap[i]];
        i = minIdx;
      } else break;
    }
  };

  for (let num of nums) {
    minHeap.push(num);
    siftUp(minHeap.length - 1);
    if (minHeap.length > k) {
      minHeap[0] = minHeap.pop();
      siftDown(0);
    }
  }
  return minHeap[0];
}`
    }
  },
  {
    slug: "dsa-ch35-advanced-heaps",
    title: "Chapter 35: Advanced Heap Patterns: Top K & Merge K",
    order: 35,
    content: `<h2>The Top K Pattern</h2>
<p>Whenever an interview question asks for the "Top K", "Kth Largest", "Kth Smallest", or "K Most Frequent" elements from a massive dataset, your brain should immediately yell <b>HEAP</b>.</p>
<h3>The Size-K Min-Heap Strategy</h3>
<p>Suppose you need the Kth largest element in an array of size N. <br/>
<b>Brute Force:</b> Sort the array in <code>O(N log N)</code> and return index <code>N-K</code>. <br/>
<b>Optimal:</b> Maintain a <b>Min-Heap</b> of exactly size K. As you iterate through the N elements, you insert the current element into the Min-Heap. If the heap size exceeds K, you pop the root (which extracts the smallest element currently in the heap). Once you finish iterating, the heap contains only the K largest elements, and because it's a Min-Heap, the root is exactly the Kth largest element.<br/>
<b>Complexity:</b> <code>O(N log K)</code> time and <code>O(K)</code> space. If K is small, this is nearly O(N).</p>

<h2>The Merge K Sorted Lists Pattern</h2>
<p>Given K linked lists, each sorted in ascending order, merge all linked lists into one sorted linked list.<br/>
<b>Optimal Solution:</b> Use a Min-Heap. Initialize a Min-Heap and insert the <b>head node</b> of each of the K lists into it. The heap will order them by their values. <br/>
Pop the minimum node from the heap, append it to your result list, and if that popped node has a <code>next</code> node in its original list, insert that <code>next</code> node into the heap. Repeat until the heap is empty.<br/>
<b>Complexity:</b> <code>O(N log K)</code> time where N is the total number of nodes across all lists, and K is the number of lists. Space complexity is <code>O(K)</code>.</p>

<h2>The Two Heaps Pattern (Continuous Median)</h2>
<p>How do you find the median of a continuous stream of numbers? <br/>
Maintain a <b>Max-Heap</b> for the lower half of the numbers, and a <b>Min-Heap</b> for the upper half. Ensure the sizes of the heaps differ by at most 1. The median is either the root of the larger heap, or the average of the two roots. Insertions take <code>O(log N)</code> and finding the median is exactly <code>O(1)</code>!</p>`,
    interviewQuestions: [
      { question: "How do you find the K most frequent elements in an array?", answer: "First, traverse the array and build a Hash Map of frequencies (Num -> Count) in O(N) time. Then, iterate through the map keys and use a Min-Heap of size K, where the comparison is based on the frequencies. The time complexity becomes O(N + M log K) where M is unique elements." },
      { question: "Why use a Min-Heap of size K instead of a Max-Heap of size N to find Top K largest elements?", answer: "If you insert all elements into a Max-Heap, building it takes O(N), and popping K times takes O(K log N). Total time: O(N + K log N) with O(N) space. However, if the dataset is an infinite streaming feed, O(N) space will crash the server. A Min-Heap of size K guarantees O(K) space and safely drops smaller numbers on the fly." },
      { question: "What is the time complexity of merging K sorted arrays (or lists) of total length N?", answer: "Inserting and extracting from a heap of size K takes O(log K). Since you must process every single element across all arrays, you do this N times. Thus, the time complexity is strictly O(N log K)." },
      { question: "Can Quickselect be used instead of a Heap for finding Top K elements? What are the tradeoffs?", answer: "Yes, Quickselect (based on Quick Sort partitioning) can find the Kth largest element in O(N) average time, which is faster than O(N log K). However, its worst-case time is O(N^2), and it requires modifying the original array (or taking O(N) space). Furthermore, Quickselect cannot be used on continuous data streams, whereas the Heap pattern works perfectly on streams." },
      { question: "Explain the balancing logic in the Two Heaps pattern for finding the Median.", answer: "Every incoming number is first added to the Max-Heap (lower half). To ensure all numbers in the Max-Heap are truly smaller than the Min-Heap, we immediately pop the Max-Heap and push it into the Min-Heap (upper half). Finally, to balance sizes, if the Min-Heap becomes larger than the Max-Heap, we pop the Min-Heap and push back to the Max-Heap. This ensures the Max-Heap always has size equal to or 1 greater than the Min-Heap." }
    ],
    practicalTask: {
      scenario: "Top K Frequent Elements.",
      task: "Given an integer array nums and an integer k, return the k most frequent elements.",
      solutionCode: `// Assuming a generic PriorityQueue class is available
function topKFrequent(nums, k) {
  const map = new Map();
  for (let num of nums) {
    map.set(num, (map.get(num) || 0) + 1);
  }
  
  // Min-Heap based on frequencies
  const pq = new PriorityQueue((a, b) => a.freq < b.freq);
  
  for (let [num, freq] of map.entries()) {
    pq.enqueue({num, freq});
    if (pq.heap.length > k) {
      pq.dequeue();
    }
  }
  
  return pq.heap.map(item => item.num);
}`
    }
  }
];

appendDsaTopics(topics);
