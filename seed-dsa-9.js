import { appendTopics } from './seeder-utils.js';

const topics = [
    {
        title: "Segment Trees",
        slug: "segment-trees",
        order: 41,
        chapters: [
            {
                title: "1. Conceptual Overview",
                content: "### 1. Conceptual Overview\nA Segment Tree is a versatile data structure used for storing information about intervals or segments. It enables rapid range queries and point updates over an array."
            },
            {
                title: "2. Architecture & Mechanics",
                content: "### 2. Architecture & Mechanics\nThe tree is built recursively such that the root covers the entire array range, and each child covers half of its parent's range. Leaf nodes correspond to individual array elements."
            },
            {
                title: "3. Implementation: Standard vs Optimized",
                content: "### 3. Implementation: Standard vs Optimized\nStandard recursion uses an array of size 4N to represent the tree. An optimized bottom-up iterative approach requires only 2N size, skipping the recursion overhead entirely."
            },
            {
                title: "4. Trade-offs & Complexity",
                content: "### 4. Trade-offs & Complexity\nQuery and update operations run in O(log N) time, while the space complexity is O(N). Lazy propagation further optimizes range updates to O(log N)."
            }
        ],
        interviewQuestions: [
            {
                question: "What is the primary advantage of a Segment Tree?",
                answer: "It allows O(log N) time complexity for range queries and point/range updates."
            },
            {
                question: "What does lazy propagation achieve?",
                answer: "It postpones updates to descendants until they are explicitly needed, preserving the O(log N) time bound for range updates."
            },
            {
                question: "Why do segment trees commonly allocate an array of size 4N?",
                answer: "To ensure sufficient memory for a complete binary tree mapping of worst-case array boundaries."
            },
            {
                question: "Can Segment Trees handle dynamic array resizing?",
                answer: "Standard Segment Trees are static. A dynamic segment tree creates nodes on the fly to support infinite ranges."
            },
            {
                question: "Compare Segment Tree to Prefix Sum Arrays.",
                answer: "Prefix sum answers range queries in O(1) but takes O(N) for updates. Segment Trees balance both at O(log N)."
            }
        ],
        practicalTask: {
            title: "Range Maximum Query",
            description: "Implement a Segment Tree to return the maximum value in a given range.",
            solution: "Construct the tree recursively storing the max of children. For queries, traverse nodes overlapping the query range."
        }
    },
    {
        title: "Fenwick Trees (Binary Indexed Trees)",
        slug: "fenwick-trees",
        order: 42,
        chapters: [
            {
                title: "1. Conceptual Overview",
                content: "### 1. Conceptual Overview\nA Fenwick Tree, or Binary Indexed Tree (BIT), calculates prefix sums and updates array elements efficiently. It serves a similar purpose to Segment Trees but uses less memory and is easier to code."
            },
            {
                title: "2. Architecture & Mechanics",
                content: "### 2. Architecture & Mechanics\nElements are stored in an array indexed from 1. Each index relies on the Least Significant Bit (LSB) to determine the segment length it encompasses."
            },
            {
                title: "3. Implementation: Standard vs Optimized",
                content: "### 3. Implementation: Standard vs Optimized\nThe standard implementation relies on bitwise operations like `i & (-i)` to extract the LSB. It updates subsequent nodes by adding the LSB and queries by subtracting the LSB."
            },
            {
                title: "4. Trade-offs & Complexity",
                content: "### 4. Trade-offs & Complexity\nBoth point updates and prefix queries run in O(log N). The space complexity is precisely O(N). It is faster in practice than Segment Trees but less flexible for arbitrary range queries (e.g., range max)."
            }
        ],
        interviewQuestions: [
            {
                question: "What is the primary formula used to extract the least significant set bit?",
                answer: "The expression `x & (-x)` extracts the least significant bit in two's complement."
            },
            {
                question: "Can Fenwick Trees solve range minimum queries?",
                answer: "Not efficiently. Fenwick Trees are primarily designed for invertible operations like sum or XOR."
            },
            {
                question: "How does Fenwick space complexity compare to Segment Trees?",
                answer: "Fenwick Tree requires an array of size N+1, whereas a standard Segment Tree needs 4N."
            },
            {
                question: "Is it possible to do range updates on a Fenwick Tree?",
                answer: "Yes, by maintaining a difference array or using two Fenwick trees, range updates and queries are achievable."
            },
            {
                question: "Explain the update traversal direction.",
                answer: "To update an index, the tree traverses 'forward' by repeatedly adding the LSB to the index until reaching the maximum array size."
            }
        ],
        practicalTask: {
            title: "Inversion Counting",
            description: "Use a Fenwick Tree to count the number of inversions in an array.",
            solution: "Coordinate compress the elements, then iterate right to left, adding elements to the BIT and querying sums."
        }
    },
    {
        title: "Tries (Prefix Trees)",
        slug: "tries-prefix-trees",
        order: 43,
        chapters: [
            {
                title: "1. Conceptual Overview",
                content: "### 1. Conceptual Overview\nA Trie is a tree-like data structure that proves highly efficient for string matching operations. It stores characters at nodes, where paths down the tree represent words or prefixes."
            },
            {
                title: "2. Architecture & Mechanics",
                content: "### 2. Architecture & Mechanics\nThe root is empty. Each node maintains a mapping to its children (often an array of 26 letters or a hash map). A boolean flag indicates the end of a valid word."
            },
            {
                title: "3. Implementation: Standard vs Optimized",
                content: "### 3. Implementation: Standard vs Optimized\nA standard Trie uses arrays for children, costing high memory. Optimized models use Hash Maps or implement Radix Trees (compressed Tries) to combine nodes with single children."
            },
            {
                title: "4. Trade-offs & Complexity",
                content: "### 4. Trade-offs & Complexity\nSearch, insert, and delete operations take O(L) time, where L is the length of the string. Space complexity is O(N * L), which can be quite large if there's no prefix overlap."
            }
        ],
        interviewQuestions: [
            {
                question: "Why use a Trie instead of a Hash Table for string searches?",
                answer: "Tries support prefix-based searches and autocomplete features smoothly, which Hash Tables cannot efficiently do."
            },
            {
                question: "What does a node in a standard Trie contain?",
                answer: "A mapping to child nodes (e.g., an array of 26 pointers) and a boolean flag marking the end of a word."
            },
            {
                question: "How do you handle autocomplete with a Trie?",
                answer: "Traverse to the node corresponding to the prefix, then perform a Depth First Search (DFS) to find all valid words terminating below it."
            },
            {
                question: "What is a Radix Tree?",
                answer: "A space-optimized Trie where nodes with only one child are merged with their parents."
            },
            {
                question: "Can Tries be used for numbers?",
                answer: "Yes, Bitwise Tries store binary representations of integers and are heavily used to solve XOR-related maximization problems."
            }
        ],
        practicalTask: {
            title: "Implement an Autocomplete System",
            description: "Design a data structure that allows inserting words and searching for all words matching a given prefix.",
            solution: "Implement a Trie with a DFS traversal from the prefix node to gather all complete words."
        }
    },
    {
        title: "Disjoint Set Union (Union-Find)",
        slug: "disjoint-set-union",
        order: 44,
        chapters: [
            {
                title: "1. Conceptual Overview",
                content: "### 1. Conceptual Overview\nDisjoint Set Union (DSU) manages a collection of non-overlapping sets. It is highly optimized for two primary operations: finding the set an element belongs to, and merging two sets."
            },
            {
                title: "2. Architecture & Mechanics",
                content: "### 2. Architecture & Mechanics\nElements are represented as trees. A parent array points to the immediate ancestor. The root node of a tree represents the set's unique identifier."
            },
            {
                title: "3. Implementation: Standard vs Optimized",
                content: "### 3. Implementation: Standard vs Optimized\nA naive implementation can suffer from skewed trees O(N). Path compression and union by rank (or size) flatten the tree structures, reducing tree height dramatically."
            },
            {
                title: "4. Trade-offs & Complexity",
                content: "### 4. Trade-offs & Complexity\nWith both optimizations, operations take amortized O(alpha(N)) time, where alpha is the inverse Ackermann function (nearly O(1)). Space complexity is O(N)."
            }
        ],
        interviewQuestions: [
            {
                question: "Explain path compression in DSU.",
                answer: "During a find operation, all traversed nodes are directly attached to the root, heavily reducing future lookup times."
            },
            {
                question: "Why use Union by Rank?",
                answer: "It attaches the shorter tree under the taller tree, keeping the overall tree height logarithmic."
            },
            {
                question: "What is the time complexity of fully optimized DSU?",
                answer: "Amortized O(alpha(N)), which is practically O(1) for any reasonable input size."
            },
            {
                question: "Can DSU be used to detect cycles in directed graphs?",
                answer: "No, standard DSU detects cycles in undirected graphs. Directed graphs require DFS or Kahn's algorithm."
            },
            {
                question: "What is the inverse Ackermann function?",
                answer: "A mathematical function that grows extremely slowly, meaning DSU operations take near-constant time."
            }
        ],
        practicalTask: {
            title: "Kruskal's Algorithm",
            description: "Find the Minimum Spanning Tree of a graph using Kruskal's algorithm and DSU.",
            solution: "Sort all edges by weight, iterate through them, and use DSU to merge endpoints if they don't form a cycle."
        }
    },
    {
        title: "Advanced Graph Algorithms",
        slug: "advanced-graph-algorithms",
        order: 45,
        chapters: [
            {
                title: "1. Conceptual Overview",
                content: "### 1. Conceptual Overview\nAdvanced graph algorithms expand beyond traversals to analyze structure and connectivity. Prominent examples include Tarjan's for Strongly Connected Components (SCCs), and articulation points."
            },
            {
                title: "2. Architecture & Mechanics",
                content: "### 2. Architecture & Mechanics\nThese algorithms primarily utilize Depth First Search (DFS). They track visitation order (discovery time) and the lowest reachable ancestor (low-link value) to identify critical edges or components."
            },
            {
                title: "3. Implementation: Standard vs Optimized",
                content: "### 3. Implementation: Standard vs Optimized\nKosaraju's algorithm uses two DFS passes and a transposed graph for SCCs. Tarjan's is heavily optimized using a single DFS pass alongside a stack to group nodes."
            },
            {
                title: "4. Trade-offs & Complexity",
                content: "### 4. Trade-offs & Complexity\nTarjan's algorithm achieves O(V + E) time complexity with a single traversal, making it faster in practice than Kosaraju's, though both maintain the same asymptotic bound."
            }
        ],
        interviewQuestions: [
            {
                question: "What is a Strongly Connected Component (SCC)?",
                answer: "A subset of a directed graph where every node can reach every other node within that subset."
            },
            {
                question: "Explain the purpose of 'low-link' values in Tarjan's algorithm.",
                answer: "The low-link value represents the smallest discovery time reachable from a node, dictating whether a node is the root of an SCC."
            },
            {
                question: "What distinguishes an articulation point from a bridge?",
                answer: "An articulation point is a vertex whose removal disconnects the graph, whereas a bridge is an edge whose removal does the same."
            },
            {
                question: "Why does Kosaraju's algorithm reverse the graph edges?",
                answer: "Reversing edges restricts the second DFS traversal strictly to nodes within the same SCC."
            },
            {
                question: "Can an undirected graph have SCCs?",
                answer: "The concept of SCCs strictly applies to directed graphs. Undirected graphs simply have connected components."
            }
        ],
        practicalTask: {
            title: "Critical Connections in a Network",
            description: "Find all bridges in an undirected network of servers to identify critical points of failure.",
            solution: "Implement Tarjan's bridge-finding logic tracking discovery and low-link times during a DFS traversal."
        }
    }
];

appendTopics('dsa', 'Data Structures & Algorithms Masterclass', '...', topics)
    .then(() => console.log('Successfully seeded DSA topics 41-45'))
    .catch(err => console.error('Error seeding topics:', err));
