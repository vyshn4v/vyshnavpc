import { appendDsaTopics } from "./dsa-seeder-utils.js";

const topics = [
  {
    slug: "singly-linked-lists-fundamentals",
    title: "11. Singly Linked Lists: Fundamentals & Reversal",
    order: 11,
    content: `<h2>Introduction to Singly Linked Lists</h2>
<p>A <strong>Linked List</strong> is a linear data structure where elements are not stored at contiguous memory locations. Instead, the elements are linked using pointers. In a <strong>Singly Linked List</strong>, each element (called a <em>Node</em>) contains two items: the data (or value), and a reference (or pointer) to the next node.</p>
<p>Unlike arrays, where inserting or deleting an element at the beginning requires shifting all subsequent elements (O(N) time), linked lists can achieve this in O(1) time if we have a reference to the specific node. However, accessing an element by index in a linked list takes O(N) time because we must traverse the list from the head, compared to O(1) in arrays.</p>
<h3>The Node Class</h3>
<pre><code>class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}</code></pre>

<h2>Core Mechanics and Edge Cases</h2>
<p>When manipulating linked lists, you must always be mindful of <strong>edge cases</strong>:</p>
<ul>
  <li>The list is empty (head is null).</li>
  <li>The list has only one node.</li>
  <li>Operations modifying the head of the list (e.g., deleting the first node or inserting at the beginning).</li>
</ul>
<p>To elegantly handle edge cases, especially when the head might change, the <strong>Dummy Node</strong> pattern is ubiquitous. A dummy node is an artificial node created to sit right before the actual head of the list. By doing so, the actual head becomes just a regular node (dummy.next), eliminating special conditions for head modifications.</p>
<pre><code>let dummy = new ListNode(-1);
dummy.next = head;
// ... perform operations on dummy.next ...
return dummy.next;</code></pre>

<h2>Reversing a Linked List</h2>
<p>Reversing a singly linked list is arguably the most famous interview question. The goal is to change the <code>next</code> pointers of all nodes so that they point to the previous node instead of the next one.</p>
<h3>Brute Force (or Suboptimal) Approach</h3>
<p>A brute force way would be to traverse the linked list, store all values in an array, reverse the array, and then reconstruct a new linked list. This takes O(N) Time and O(N) Space. In an interview, this is unacceptable.</p>

<h3>Optimized Iterative Approach (In-Place)</h3>
<p>We can reverse the list in-place using three pointers: <code>prev</code>, <code>curr</code>, and <code>next</code>.</p>
<pre><code>function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    let nextTemp = curr.next; // Store next node
    curr.next = prev;         // Reverse the link
    prev = curr;              // Move prev one step forward
    curr = nextTemp;          // Move curr one step forward
  }

  return prev; // prev will be the new head
}</code></pre>
<p><strong>Complexity:</strong> Time O(N) to traverse the list once. Space O(1) as we only use a few pointers.</p>

<h3>Recursive Approach</h3>
<p>The recursive approach requires a solid understanding of the call stack. The idea is to recursively reverse the rest of the list, and then fix the current node's pointer.</p>
<pre><code>function reverseListRecursive(head) {
  // Base case: empty list or last node
  if (head === null || head.next === null) {
    return head;
  }

  // Reverse the rest of the list
  let reversedListHead = reverseListRecursive(head.next);

  // head.next is the next node. We want it to point back to head.
  head.next.next = head;
  // head is now the last node of the reversed segment, so its next should be null
  head.next = null;

  return reversedListHead;
}</code></pre>
<p><strong>Complexity:</strong> Time O(N). Space O(N) due to the recursive call stack.</p>
`,
    interviewQuestions: [
      {
        question: "1. Reverse a Linked List (LeetCode 206)",
        answer: "Use the classic iterative 3-pointer approach (prev, curr, nextTemp). Keep track of `nextTemp = curr.next`, update `curr.next = prev`, then shift `prev = curr` and `curr = nextTemp`. Time O(N), Space O(1)."
      },
      {
        question: "2. Reverse Linked List II (LeetCode 92)",
        answer: "To reverse a sublist from position `left` to `right`, use a dummy node. Traverse to the node just before `left` (called `pre`). The node at `left` is `start`. Use standard reversal for `right - left` iterations, moving nodes one by one to the position after `pre`. Time O(N), Space O(1)."
      },
      {
        question: "3. Delete Node in a Linked List (LeetCode 237)",
        answer: "You are given only a reference to the node to be deleted (not the head). Copy the value of the next node into the current node (`node.val = node.next.val`), then bypass the next node (`node.next = node.next.next`). Note this doesn't work if the node to delete is the last node."
      },
      {
        question: "4. Remove Nth Node From End of List (LeetCode 19)",
        answer: "Use a two-pointer approach with a dummy node. Fast pointer moves `n` steps ahead. Then, move both slow and fast pointers until fast reaches the end. The slow pointer will be exactly before the node to be deleted. Time O(N), Space O(1)."
      },
      {
        question: "5. Palindrome Linked List (LeetCode 234)",
        answer: "Find the middle of the linked list using slow/fast pointers. Reverse the second half of the list. Compare the first half and the reversed second half node by node. Finally, (optional but polite) restore the list to its original state. Time O(N), Space O(1)."
      }
    ],
    practicalTask: {
      scenario: "You are tasked with reversing a specific segment of a linked list representing transaction steps in a rollback operation.",
      task: "Implement Reverse Linked List II. Given the head of a singly linked list and two integers left and right where left <= right, reverse the nodes of the list from position left to position right.",
      solutionCode: `function reverseBetween(head, left, right) {
  if (!head || left === right) return head;

  let dummy = new ListNode(0);
  dummy.next = head;
  let pre = dummy;

  // Move pre to the node just before the left position
  for (let i = 0; i < left - 1; i++) {
    pre = pre.next;
  }

  let start = pre.next;
  let then = start.next;

  // Reverse the sublist
  for (let i = 0; i < right - left; i++) {
    start.next = then.next;
    then.next = pre.next;
    pre.next = then;
    then = start.next;
  }

  return dummy.next;
}`
    }
  },
  {
    slug: "fast-and-slow-pointers",
    title: "12. Fast and Slow Pointers (Tortoise & Hare)",
    order: 12,
    content: `<h2>The Fast and Slow Pointers Technique</h2>
<p>The <strong>Fast and Slow Pointers</strong> technique (also known as Floyd's Cycle-Finding Algorithm or the Tortoise and Hare algorithm) is a brilliant pattern used to solve many linked list problems in O(N) time and O(1) space.</p>
<p>The core concept is to use two pointers moving at different speeds:</p>
<ul>
  <li><strong>Slow Pointer (Tortoise):</strong> Moves one step at a time (<code>slow = slow.next</code>).</li>
  <li><strong>Fast Pointer (Hare):</strong> Moves two steps at a time (<code>fast = fast.next.next</code>).</li>
</ul>

<h2>Finding the Middle of a Linked List</h2>
<p>If you have two runners, one running twice as fast as the other, when the fast runner reaches the finish line, the slow runner will be exactly halfway there. We can apply this to find the middle node of a linked list.</p>
<pre><code>function middleNode(head) {
  let slow = head;
  let fast = head;

  // Ensure fast and fast.next are not null to avoid errors
  while (fast !== null && fast.next !== null) {
    slow = slow.next;         // 1 step
    fast = fast.next.next;    // 2 steps
  }

  return slow; // slow is now at the middle
}</code></pre>
<p><strong>Edge Cases:</strong> If the list has an even number of nodes, there are two middle nodes. The condition <code>fast !== null && fast.next !== null</code> guarantees that <code>slow</code> will land on the <em>second</em> middle node. If you need the first middle node, you can adjust the loop condition to <code>fast.next !== null && fast.next.next !== null</code>.</p>

<h2>Detecting a Cycle</h2>
<p>If a linked list has a cycle, the fast pointer will eventually "lap" the slow pointer and they will meet at the exact same node. If there is no cycle, the fast pointer will simply reach the end (<code>null</code>).</p>
<pre><code>function hasCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) {
      return true; // Cycle detected!
    }
  }

  return false;
}</code></pre>

<h2>Finding the Start of a Cycle</h2>
<p>Detecting a cycle is one thing, but finding <em>where</em> the cycle begins is harder. There is a beautiful mathematical proof behind this:</p>
<ol>
  <li>Let <code>L1</code> be the distance from the head to the cycle start.</li>
  <li>Let <code>L2</code> be the distance from the cycle start to the meeting point of slow and fast.</li>
  <li>Let <code>C</code> be the length of the cycle.</li>
</ol>
<p>When they meet, the slow pointer has traveled <code>L1 + L2</code> steps. The fast pointer has traveled <code>L1 + L2 + k * C</code> steps (where k is the number of times the fast pointer looped the cycle). Since fast travels twice as fast: <code>2(L1 + L2) = L1 + L2 + k * C</code> &rArr; <code>L1 + L2 = k * C</code> &rArr; <code>L1 = k * C - L2</code>.</p>
<p>This means the distance from the head to the cycle start (<code>L1</code>) is equal to the distance from the meeting point to the cycle start. So, if we place one pointer at the head and one pointer at the meeting point, and move them both one step at a time, they will collide exactly at the cycle start!</p>
<pre><code>function detectCycle(head) {
  let slow = head;
  let fast = head;
  let hasCycle = false;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      hasCycle = true;
      break;
    }
  }

  if (!hasCycle) return null;

  // Phase 2: Find cycle start
  let p1 = head;
  let p2 = slow;
  while (p1 !== p2) {
    p1 = p1.next;
    p2 = p2.next;
  }

  return p1; // Cycle start node
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Linked List Cycle (LeetCode 141)",
        answer: "Use Floyd's Cycle Detection algorithm. A slow pointer moves 1 step, a fast pointer moves 2 steps. If they ever point to the same node, there is a cycle. Time O(N), Space O(1)."
      },
      {
        question: "2. Linked List Cycle II (LeetCode 142)",
        answer: "Find the intersection point using the slow/fast pointers. Then put one pointer at the head and keep the other at the intersection. Move both 1 step at a time. Where they meet is the start of the cycle. Time O(N), Space O(1)."
      },
      {
        question: "3. Middle of the Linked List (LeetCode 876)",
        answer: "Slow pointer moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle. For even-length lists, this returns the second middle node. Time O(N), Space O(1)."
      },
      {
        question: "4. Reorder List (LeetCode 143)",
        answer: "Given L0 -> L1 -> ... -> Ln-1 -> Ln, reorder it to L0 -> Ln -> L1 -> Ln-1 -> ... \nStep 1: Find middle using fast/slow. \nStep 2: Reverse the second half. \nStep 3: Interleave the two halves. Time O(N), Space O(1)."
      },
      {
        question: "5. Find the Duplicate Number (LeetCode 287)",
        answer: "This is a hidden Linked List problem! The array values act as 'next' pointers (next node index = array[current_node_index]). Because multiple numbers map to the same value, there's a cycle. Use cycle detection to find the start of the cycle, which represents the duplicate number. Time O(N), Space O(1)."
      }
    ],
    practicalTask: {
      scenario: "You are given an array containing n + 1 integers where each integer is in the range [1, n] inclusive. There is only one repeated number in nums.",
      task: "Implement Find the Duplicate Number without modifying the array and using only O(1) extra space.",
      solutionCode: `function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[0];

  // Phase 1: Find intersection point
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);

  // Phase 2: Find entrance to cycle
  let ptr1 = nums[0];
  let ptr2 = slow;
  
  while (ptr1 !== ptr2) {
    ptr1 = nums[ptr1];
    ptr2 = nums[ptr2];
  }

  return ptr1;
}`
    }
  },
  {
    slug: "doubly-circular-linked-lists",
    title: "13. Doubly & Circular Linked Lists",
    order: 13,
    content: `<h2>Doubly Linked Lists</h2>
<p>A <strong>Doubly Linked List (DLL)</strong> is a variation of a linked list where each node contains three items: the data, a pointer to the <em>next</em> node, and a pointer to the <em>previous</em> node.</p>
<pre><code>class DoublyListNode {
  constructor(val = 0, next = null, prev = null) {
    this.val = val;
    this.next = next;
    this.prev = prev;
  }
}</code></pre>
<h3>Advantages of DLLs</h3>
<ul>
  <li><strong>Two-way traversal:</strong> You can traverse the list backwards easily.</li>
  <li><strong>O(1) deletion:</strong> If you are given a pointer to a specific node, you can delete it in O(1) time because you have access to its <code>prev</code> node. In a Singly Linked List, you would have to traverse from the head to find the previous node (O(N) time).</li>
</ul>
<h3>Disadvantages</h3>
<ul>
  <li>Requires extra memory to store the <code>prev</code> pointer.</li>
  <li>More complex to implement because every insertion/deletion operation requires updating two sets of pointers (both next and prev).</li>
</ul>

<h3>DLL Deletion Example</h3>
<pre><code>function deleteDLLNode(node) {
  if (!node) return;
  
  // If there is a previous node, point its next to the node after the current one
  if (node.prev !== null) {
    node.prev.next = node.next;
  }
  
  // If there is a next node, point its prev to the node before the current one
  if (node.next !== null) {
    node.next.prev = node.prev;
  }
  
  // Sever the ties completely
  node.next = null;
  node.prev = null;
}</code></pre>

<h2>Circular Linked Lists</h2>
<p>A <strong>Circular Linked List</strong> is a linked list where all nodes are connected to form a circle. There is no <code>null</code> at the end. The <code>next</code> pointer of the last node points back to the first node. This can be applied to both singly and doubly linked lists.</p>
<p><strong>Use Cases:</strong> Useful for implementing round-robin scheduling algorithms, multiplayer board games where turn passes in a circle, or buffering media (circular buffers).</p>

<h3>Traversal Edge Case</h3>
<p>When traversing a circular linked list, you can't check for <code>curr !== null</code> to end the loop, or you'll loop forever. Instead, you keep a reference to the starting node (usually head) and stop when you circle back to it.</p>
<pre><code>function printCircular(head) {
  if (head === null) return;
  
  let curr = head;
  do {
    console.log(curr.val);
    curr = curr.next;
  } while (curr !== head);
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Flatten a Multilevel Doubly Linked List (LeetCode 430)",
        answer: "A DLL where nodes may have a 'child' pointer. Use DFS (using a stack or recursion) to flatten it. When a node has a child, splice the child DLL between the current node and the next node. Time O(N), Space O(N) for recursive stack."
      },
      {
        question: "2. Design Browser History (LeetCode 1472)",
        answer: "Can be implemented beautifully using a Doubly Linked List. The DLL holds URLs. You maintain a pointer to the 'current' page. `visit(url)` creates a new node, sets its `prev` to current, severs ties to any 'forward' history, and moves current. `back(steps)` moves the `prev` pointer. `forward(steps)` moves the `next` pointer."
      },
      {
        question: "3. Insert into a Sorted Circular Linked List (LeetCode 708)",
        answer: "Traverse to find the spot where `prev.val <= insertVal <= curr.val`. Edge cases are when the value is greater than the maximum or less than the minimum in the list (insert it at the crossover point between max and min), or if all elements are identical. Time O(N)."
      },
      {
        question: "4. LFU Cache implementation (LeetCode 460)",
        answer: "Advanced problem. One optimal approach O(1) uses two HashMaps. Map 1: Key -> Node. Map 2: Frequency -> Doubly Linked List of Nodes with that frequency. When a node's frequency increases, remove it from its current DLL and append it to the DLL of the new frequency."
      },
      {
        question: "5. LRU Cache implementation (LeetCode 146)",
        answer: "Classic interview question! Combine a HashMap (Key -> Node) and a Doubly Linked List. The DLL maintains the recency of usage (head = most recent, tail = least recent). When accessed, move node to head. When evicted, remove tail and delete from map. Time O(1) for both get and put."
      }
    ],
    practicalTask: {
      scenario: "You need to implement a data structure for a Least Recently Used (LRU) cache.",
      task: "Implement the LRUCache class. It should support get(key) and put(key, value) in O(1) average time complexity.",
      solutionCode: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> Node
    // Dummy head and tail
    this.head = new Node(-1, -1);
    this.tail = new Node(-1, -1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addNodeToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    let node = this.map.get(key);
    // Move to head (mark as recently used)
    this._removeNode(node);
    this._addNodeToHead(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      let node = this.map.get(key);
      node.val = value;
      this._removeNode(node);
      this._addNodeToHead(node);
    } else {
      if (this.map.size >= this.capacity) {
        // Evict LRU from tail
        let lruNode = this.tail.prev;
        this._removeNode(lruNode);
        this.map.delete(lruNode.key);
      }
      let newNode = new Node(key, value);
      this.map.set(key, newNode);
      this._addNodeToHead(newNode);
    }
  }
}`
    }
  },
  {
    slug: "merging-sorting-linked-lists",
    title: "14. Merging and Sorting Linked Lists",
    order: 14,
    content: `<h2>Merging Two Sorted Linked Lists</h2>
<p>Merging two sorted lists into a single sorted list is a fundamental operation. The technique is very similar to the merge step in Merge Sort.</p>
<p>We use a <strong>Dummy Node</strong> to anchor our new list. We iterate while both lists have nodes remaining, comparing their current values. We append the smaller node to our merged list and move its respective pointer forward.</p>
<pre><code>function mergeTwoLists(l1, l2) {
  let dummy = new ListNode(-1);
  let curr = dummy;

  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }

  // At least one list is exhausted. Append the remaining nodes of the other list.
  if (l1 !== null) curr.next = l1;
  if (l2 !== null) curr.next = l2;

  return dummy.next;
}</code></pre>
<p><strong>Complexity:</strong> Time O(N + M) where N and M are the lengths of the two lists. Space O(1) since we are just relinking existing nodes without creating new ones.</p>

<h2>Sorting a Linked List</h2>
<p>To sort an array in O(N log N) time, we typically use Quick Sort or Merge Sort. For linked lists, <strong>Merge Sort</strong> is the undisputed champion. Unlike arrays, we don't need extra space to merge linked lists, allowing us to achieve O(N log N) Time and O(log N) Space (for the recursion stack), or strictly O(1) space if we implement it bottom-up (iteratively).</p>

<h3>Merge Sort Algorithm on Linked List</h3>
<ol>
  <li><strong>Divide:</strong> Find the middle of the linked list using the Fast & Slow Pointers technique. Cut the list into two halves.</li>
  <li><strong>Conquer:</strong> Recursively sort the left half and the right half.</li>
  <li><strong>Combine:</strong> Merge the two sorted halves using <code>mergeTwoLists</code>.</li>
</ol>
<pre><code>// Main function
function sortList(head) {
  if (head === null || head.next === null) return head; // Base case

  // Step 1: Find middle and split
  let mid = getMid(head);
  let left = head;
  let right = mid.next;
  mid.next = null; // Sever the connection!

  // Step 2: Recursively sort
  left = sortList(left);
  right = sortList(right);

  // Step 3: Merge
  return mergeTwoLists(left, right);
}

// Helper: Get Middle Node
function getMid(head) {
  let slow = head;
  // fast starts at head.next so slow stops exactly before the second half
  let fast = head.next; 
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Merge Two Sorted Lists (LeetCode 21)",
        answer: "Use a dummy node. Compare l1.val and l2.val. Attach the smaller node to the dummy chain and move that pointer. Attach remaining nodes at the end. Time O(N+M), Space O(1)."
      },
      {
        question: "2. Sort List (LeetCode 148)",
        answer: "Implement Merge Sort. Find middle using fast/slow pointers. Split into two halves (important: set mid.next = null). Recursively sort, then merge. Time O(N log N), Space O(log N) recursive stack."
      },
      {
        question: "3. Merge k Sorted Lists (LeetCode 23)",
        answer: "Multiple approaches. 1) Min-Heap of size K: insert the head of each list, pop min, and push the next node. Time O(N log K). 2) Divide and Conquer: Merge lists in pairs until 1 remains. Time O(N log K). Space O(1) for iterative divide & conquer."
      },
      {
        question: "4. Partition List (LeetCode 86)",
        answer: "Given a value x, partition so all nodes < x come before nodes >= x. Keep original relative order. Create two dummy chains: one for < x, one for >= x. Traverse and append nodes to the respective chains. Connect the end of the < chain to the start of the >= chain. Ensure the last node points to null. Time O(N), Space O(1)."
      },
      {
        question: "5. Insertion Sort List (LeetCode 147)",
        answer: "Iterate through the original list. Maintain a new sorted list (started with a dummy node). For each node, iterate from the dummy node to find the correct insertion spot. Since it's insertion sort, worst-case Time is O(N^2), but Space is O(1)."
      }
    ],
    practicalTask: {
      scenario: "You are integrating data streams from k different sorted APIs.",
      task: "Implement Merge k Sorted Lists using the Divide and Conquer approach.",
      solutionCode: `function mergeKLists(lists) {
  if (!lists || lists.length === 0) return null;

  while (lists.length > 1) {
    let mergedLists = [];
    for (let i = 0; i < lists.length; i += 2) {
      let l1 = lists[i];
      let l2 = i + 1 < lists.length ? lists[i + 1] : null;
      mergedLists.push(mergeTwoLists(l1, l2));
    }
    lists = mergedLists;
  }
  
  return lists[0];
}

function mergeTwoLists(l1, l2) {
  let dummy = new ListNode(0);
  let curr = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  if (l1) curr.next = l1;
  if (l2) curr.next = l2;
  return dummy.next;
}`
    }
  },
  {
    slug: "advanced-linked-list-patterns",
    title: "15. Advanced Linked List Patterns",
    order: 15,
    content: `<h2>Reversing in K-Groups</h2>
<p>Reversing a list is simple. Reversing sub-segments of length <code>k</code> is a legendary FAANG level hard problem. The algorithm requires absolute mastery of pointer manipulation.</p>
<p>The core idea:</p>
<ol>
  <li>Check if there are at least <code>k</code> nodes left to reverse.</li>
  <li>If so, reverse exactly those <code>k</code> nodes.</li>
  <li>Reconnect the reversed segment to the previous segment and the next segment.</li>
  <li>Repeat until less than <code>k</code> nodes remain.</li>
</ol>
<pre><code>function reverseKGroup(head, k) {
  let dummy = new ListNode(0);
  dummy.next = head;
  let prevGroupEnd = dummy;

  while (true) {
    // Check if there are k nodes to reverse
    let kthNode = getKthNode(prevGroupEnd, k);
    if (!kthNode) break;

    let groupStart = prevGroupEnd.next;
    let nextGroupStart = kthNode.next;

    // Reverse the group (similar to standard reverse, but bounded)
    let prev = nextGroupStart; // Start prev at nextGroupStart to reconnect the tail
    let curr = groupStart;
    while (curr !== nextGroupStart) {
      let temp = curr.next;
      curr.next = prev;
      prev = curr;
      curr = temp;
    }

    // Reconnect the prevGroupEnd to the new start of the reversed group
    let temp = prevGroupEnd.next; 
    prevGroupEnd.next = kthNode; // kthNode is the new head of the group
    prevGroupEnd = temp; // temp is the new tail of the group
  }

  return dummy.next;
}

function getKthNode(curr, k) {
  while (curr !== null && k > 0) {
    curr = curr.next;
    k--;
  }
  return curr;
}</code></pre>

<h2>Deep Copying with Random Pointers</h2>
<p>Another classic is cloning a linked list where each node has a <code>next</code> pointer AND a <code>random</code> pointer that can point to ANY node in the list (or null).</p>
<h3>Brute Force (HashMap)</h3>
<p>Traverse the list and create a new node for each node, storing the mapping in a Hash Map <code>Map(OriginalNode -> CloneNode)</code>. Then traverse again, and wire up the <code>next</code> and <code>random</code> pointers for the clones using the map. This is O(N) Time and O(N) Space.</p>

<h3>Optimal Solution (Interweaving)</h3>
<p>We can achieve O(1) Space without a HashMap!</p>
<ol>
  <li><strong>Duplicate nodes inline:</strong> A -> A' -> B -> B' -> C -> C'.</li>
  <li><strong>Assign random pointers:</strong> A'.random = A.random.next.</li>
  <li><strong>Unweave:</strong> Separate the combined list into the original and the clone.</li>
</ol>
<pre><code>function copyRandomList(head) {
  if (!head) return null;

  // Step 1: Interweave
  let curr = head;
  while (curr) {
    let clone = new _Node(curr.val, curr.next, null);
    curr.next = clone;
    curr = clone.next;
  }

  // Step 2: Assign random pointers
  curr = head;
  while (curr) {
    if (curr.random) {
      curr.next.random = curr.random.next;
    }
    curr = curr.next.next;
  }

  // Step 3: Unweave
  curr = head;
  let cloneHead = head.next;
  while (curr) {
    let clone = curr.next;
    curr.next = clone.next;
    clone.next = clone.next ? clone.next.next : null;
    curr = curr.next;
  }

  return cloneHead;
}</code></pre>
`,
    interviewQuestions: [
      {
        question: "1. Reverse Nodes in k-Group (LeetCode 25)",
        answer: "Hard problem. Use a dummy node. Verify k nodes exist ahead. Reverse that chunk segment by maintaining pointers to `prevGroupTail`, `currentGroupHead`, and `nextGroupHead`. Reconnect and advance. Time O(N), Space O(1)."
      },
      {
        question: "2. Copy List with Random Pointer (LeetCode 138)",
        answer: "Interweave nodes to avoid O(N) map space. Clone each node immediately after itself. Next pass, `node.next.random = node.random ? node.random.next : null`. Final pass, separate the list. Time O(N), Space O(1)."
      },
      {
        question: "3. Swap Nodes in Pairs (LeetCode 24)",
        answer: "This is a special case of Reverse Nodes in k-Group where k=2. Can be done iteratively using a dummy node. `prev.next = second; first.next = second.next; second.next = first`. Then `prev = first`. Time O(N), Space O(1)."
      },
      {
        question: "4. Remove Duplicates from Sorted List II (LeetCode 82)",
        answer: "Given a sorted list, delete ALL nodes that have duplicates (leaving only distinct numbers). Use a dummy node. If `head.val === head.next.val`, skip all nodes with that value. Connect `prev.next` to the first non-duplicate node. Time O(N), Space O(1)."
      },
      {
        question: "5. Swapping Nodes in a Linked List (LeetCode 1721)",
        answer: "Swap the values of the kth node from beginning and kth node from end. Use two pointers. Move one pointer k-1 steps to find the left node. Use the fast/slow trick to find the right node. Swap their values. Time O(N), Space O(1)."
      }
    ],
    practicalTask: {
      scenario: "Your team wants to deep clone a state object history chain that contains random reference pointers.",
      task: "Implement the interweaving solution for Copy List with Random Pointer.",
      solutionCode: `function copyRandomList(head) {
  if (!head) return null;
  let curr = head;
  while (curr) {
    let nextTemp = curr.next;
    curr.next = new Node(curr.val, nextTemp, null);
    curr = nextTemp;
  }
  curr = head;
  while (curr) {
    if (curr.random) {
      curr.next.random = curr.random.next;
    }
    curr = curr.next.next;
  }
  let dummy = new Node(0, null, null);
  let copyCurr = dummy;
  curr = head;
  while (curr) {
    copyCurr.next = curr.next;
    curr.next = curr.next.next;
    copyCurr = copyCurr.next;
    curr = curr.next;
  }
  return dummy.next;
}`
    }
  }
];

appendDsaTopics(topics);
