import { appendQuestions } from "./appendQuestions.js";

const categoriesArray = [
  {
    categoryName: "CAP Theorem Trade-offs",
    questions: [
      {
        difficulty: "Expert",
        question: "In a globally distributed database like Cassandra, how do you handle read repairs and hint handoffs when network partitions occur? What are the consistency implications if hinted handoff fails?",
        expectedAnswer: "During a network partition, Cassandra operates under AP. Hinted handoffs store writes on a coordinator node temporarily. If the target node remains down and hints expire (default 3 hours), the coordinator drops the hints, causing data inconsistency. Read repairs fix inconsistencies lazily when out-of-sync data is read. If handoffs fail, anti-entropy repair (Merkle trees) must run manually or on a schedule to ensure eventual consistency.",
        redFlags: ["Assumes hinted handoff guarantees consistency", "Doesn't mention read repairs or anti-entropy (Merkle trees)", "Confuses AP with CP semantics"],
        bonusPoints: ["Mentions tunable consistency levels like QUORUM vs LOCAL_QUORUM", "Explains the performance hit of read repairs on latency-sensitive reads"]
      },
      {
        difficulty: "Hard",
        question: "Explain the scenario where a system might need to dynamically switch between CP and AP during runtime, and how you would architect such a system.",
        expectedAnswer: "A system might switch between AP and CP depending on the criticality of the transaction. For example, in an e-commerce platform, adding items to a cart can be AP (high availability), but the checkout/payment phase must be CP (strong consistency). This is architected using different datastores (e.g., DynamoDB/Cassandra for carts, PostgreSQL/Spanner for payments) or by dynamically adjusting read/write consistency levels (e.g., switching from ONE to ALL in Cassandra based on request context).",
        redFlags: ["Says it's impossible to switch", "Lacks a real-world example like carts vs. payments"],
        bonusPoints: ["Mentions the PACELC theorem as an extension of CAP", "Discusses Saga pattern for cross-system consistency"]
      },
      {
        difficulty: "Expert",
        question: "How does Google Spanner claim to be effectively CA, and how does it circumvent the absolute limits of the CAP theorem?",
        expectedAnswer: "Spanner is technically CP, but it provides such high availability (five 9s) that Google claims it's effectively CA. It circumvents the absolute limits by using a highly reliable, proprietary global network that makes partitions extremely rare. It achieves strong consistency and external consistency using TrueTime (GPS and atomic clocks) to assign globally meaningful commit timestamps without requiring global communication for every read.",
        redFlags: ["Claims Spanner literally defies physics/CAP theorem", "Does not mention TrueTime", "Fails to distinguish between theoretical CAP and practical availability"],
        bonusPoints: ["Explains TrueTime's uncertainty bounds (epsilon) and commit wait", "Mentions Paxos replication under the hood"]
      }
    ]
  },
  {
    categoryName: "Consistent Hashing & Partitioning",
    questions: [
      {
        difficulty: "Hard",
        question: "In consistent hashing, how do you solve the issue of non-uniform data distribution when nodes are added or removed, especially when nodes have heterogeneous hardware?",
        expectedAnswer: "Non-uniform data distribution is solved using 'virtual nodes' (vnodes). Each physical node is mapped to multiple points (vnodes) on the hash ring. For heterogeneous hardware, stronger nodes can be assigned more vnodes proportionally to their capacity, ensuring they handle a larger slice of the hash space. When a node is added or removed, only the keys mapped to its vnodes are redistributed, spreading the load evenly across remaining nodes.",
        redFlags: ["Doesn't mention virtual nodes", "Suggests fully rehashing all data", "Fails to address heterogeneous capacity"],
        bonusPoints: ["Explains the exact mathematical mapping using a hash function (e.g., MD5/MurmurHash)", "Mentions real-world usage like in Dynamo or Cassandra"]
      },
      {
        difficulty: "Expert",
        question: "If you have a hot key problem (e.g., a viral celebrity tweet) in a partitioned database using consistent hashing, how do you mitigate it dynamically without changing the hashing algorithm?",
        expectedAnswer: "Hot keys overload a single partition. Mitigation strategies include: 1) Client-side or edge caching (e.g., Redis/Memcached) with short TTLs. 2) Key salting/appending: appending a random number (1 to N) to the key so it distributes across multiple partitions, requiring scatter-gather on reads. 3) Load-aware routing, where replicas of the hot partition temporarily serve reads, assuming the workload is read-heavy.",
        redFlags: ["Suggests rehashing the hot key", "Fails to mention caching as the primary defense", "Ignores the write-heavy vs read-heavy distinction"],
        bonusPoints: ["Discusses scatter-gather read latency penalties with key salting", "Mentions materialized views or pre-aggregations for write-heavy hot keys"]
      },
      {
        difficulty: "Hard",
        question: "Explain the difference between Hash-based partitioning and Range-based partitioning. When would you strictly prefer Range-based?",
        expectedAnswer: "Hash-based partitioning applies a hash function to the key, distributing data randomly but evenly, making it great for point lookups and preventing hotspots. Range-based partitioning stores data in contiguous ranges based on the key, maintaining sorted order. Range-based is strictly preferred when the application requires efficient range queries (e.g., 'fetch all records between time A and time B'), which would otherwise require querying all nodes in a hash-partitioned setup.",
        redFlags: ["Confuses the two concepts", "Cannot provide a concrete use case for range queries (e.g., time-series data)"],
        bonusPoints: ["Mentions the primary risk of range partitioning: severe hotspots for sequential keys (like timestamps)", "Mentions hybrid approaches like partition key + clustering key (Cassandra)"]
      }
    ]
  },
  {
    categoryName: "Rate Limiting Algorithms",
    questions: [
      {
        difficulty: "Hard",
        question: "Compare the Token Bucket algorithm with the Sliding Window Log algorithm. Why might you choose Sliding Window Log for an API despite its higher memory footprint?",
        expectedAnswer: "Token bucket is memory-efficient (stores just token count and last updated timestamp) but allows short bursts of traffic that could overwhelm backend systems if many buckets are full simultaneously. Sliding Window Log keeps a timestamp of every request. It is chosen when strict accuracy is required, absolutely preventing bursts over the limit at any rolling window boundary, which is critical for highly sensitive or computationally expensive APIs.",
        redFlags: ["Does not understand what Token Bucket is", "Fails to identify the memory overhead of Sliding Window Log (storing individual timestamps)", "Misses the 'burst' drawback of Token Bucket"],
        bonusPoints: ["Mentions Sliding Window Counter as a compromise between the two", "Discusses Redis Sorted Sets (ZSET) implementation for Sliding Window Log"]
      },
      {
        difficulty: "Expert",
        question: "How would you implement a distributed rate limiter in a multi-region microservices architecture without introducing a central point of failure or high latency?",
        expectedAnswer: "A centralized Redis cluster introduces latency for cross-region requests. To mitigate this, you can use local in-memory rate limiters on each API Gateway node that sync their state asynchronously to a global Redis cluster (eventual consistency). Alternatively, use an algorithm like Token Bucket implemented in Redis, replicated across regions, or use a geo-routed local Redis per region combined with IP-anycast. If absolute precision isn't required, local counters that gossip or periodically flush to a central store are best.",
        redFlags: ["Suggests a single global Redis without acknowledging the extreme latency", "Does not mention edge-based or localized limits"],
        bonusPoints: ["Mentions Redis concurrency issues (race conditions) and using Lua scripts for atomic increments", "Discusses the tradeoff between strict rate limiting and user latency"]
      },
      {
        difficulty: "Hard",
        question: "Explain the 'thundering herd' problem in the context of rate limiting and caching, and how to prevent it.",
        expectedAnswer: "The thundering herd problem occurs when a rate limit resets or a cache expires, and simultaneously, a massive number of waiting clients all hit the backend at the exact same time. Prevention includes: 1) Adding jitter (randomness) to the rate limit reset times or cache TTLs. 2) Using a locking mechanism (mutex) where only the first request is allowed to query the backend/rebuild the cache, while others wait. 3) Serving stale data while asynchronously updating.",
        redFlags: ["Confuses thundering herd with a DDoS attack", "Fails to mention jitter/randomness as a solution"],
        bonusPoints: ["Mentions request coalescing (collapsing identical requests)", "Discusses circuit breakers tripping due to thundering herds"]
      }
    ]
  },
  {
    categoryName: "WebRTC & Real-Time Comms",
    questions: [
      {
        difficulty: "Expert",
        question: "In WebRTC, what are STUN and TURN servers, and in what exact network scenario is a TURN server strictly required?",
        expectedAnswer: "STUN (Session Traversal Utilities for NAT) allows clients to discover their public IP address to attempt direct peer-to-peer connection. TURN (Traversal Using Relays around NAT) acts as a relay server. A TURN server is strictly required when a direct P2P connection fails, usually because one or both peers are behind a Symmetric NAT or strict corporate firewall that randomizes ports for every outgoing connection, making direct hole punching impossible.",
        redFlags: ["Confuses STUN and TURN", "Thinks TURN is used for signaling", "Does not mention Symmetric NAT or strict firewalls"],
        bonusPoints: ["Mentions ICE (Interactive Connectivity Establishment) as the framework that orchestrates STUN/TURN", "Knows that TURN introduces latency and bandwidth costs because it relays all media"]
      },
      {
        difficulty: "Hard",
        question: "How do you scale a WebRTC application for a 1-to-many broadcast (e.g., 1 presenter, 10,000 viewers)? Why is full mesh topology unfeasible here?",
        expectedAnswer: "Full mesh requires each peer to send media to every other peer (O(N^2) connections), which immediately exhausts the presenter's upstream bandwidth and CPU. For 1-to-10,000, you must use an SFU (Selective Forwarding Unit) or MCU (Multipoint Control Unit). The presenter sends one stream to the SFU, and the SFU relays it to the 10,000 viewers. For massive scale, SFUs are cascaded (tree topology) or HLS/DASH (HTTP streaming) is used for viewers with higher latency tolerance.",
        redFlags: ["Suggests keeping a P2P mesh", "Doesn't know what an SFU or MCU is", "Fails to identify the upstream bandwidth bottleneck"],
        bonusPoints: ["Explains the difference between SFU (routing streams) and MCU (mixing streams)", "Suggests falling back to HLS (Twitch style) for the 10,000 viewers if ultra-low latency isn't required"]
      },
      {
        difficulty: "Hard",
        question: "Explain the role of the Signaling Server in WebRTC. What protocols are typically used to implement it, and why doesn't WebRTC define a standard signaling protocol?",
        expectedAnswer: "The Signaling Server is used to exchange connection metadata (SDP offers/answers) and network candidates (ICE candidates) between peers before the direct connection is established. It is typically implemented using WebSockets, Server-Sent Events, or even HTTP polling. WebRTC intentionally avoids standardizing signaling to remain flexible, allowing developers to integrate it into existing infrastructure (e.g., SIP, XMPP, or custom JSON over WebSockets).",
        redFlags: ["Thinks the signaling server routes the actual audio/video data", "Does not mention SDP (Session Description Protocol) or ICE candidates"],
        bonusPoints: ["Mentions that signaling can literally be done via copy-pasting text (sneakernet) if necessary", "Discusses horizontal scaling of WebSockets for signaling using Pub/Sub (Redis)"]
      }
    ]
  },
  {
    categoryName: "Disaster Recovery & High Availability",
    questions: [
      {
        difficulty: "Expert",
        question: "Differentiate between RTO (Recovery Time Objective) and RPO (Recovery Point Objective). How would an architecture for an RPO of 0 (zero data loss) differ from an RPO of 24 hours?",
        expectedAnswer: "RTO is the maximum acceptable downtime (how fast you must recover). RPO is the maximum acceptable data loss (measured in time). An RPO of 24 hours can be achieved with daily asynchronous backups to cold storage (e.g., S3). An RPO of 0 requires synchronous replication across geographically distributed data centers, meaning a write is not acknowledged until it is safely stored in multiple regions. This introduces significant write latency and requires complex multi-region coordination.",
        redFlags: ["Confuses RTO and RPO", "Suggests asynchronous replication is sufficient for RPO 0", "Fails to mention the latency penalty of synchronous replication"],
        bonusPoints: ["Mentions two-phase commit (2PC) or distributed consensus (Raft/Paxos) for RPO 0", "Discusses Active-Active vs Active-Passive failover strategies"]
      },
      {
        difficulty: "Hard",
        question: "You have an Active-Active multi-region database setup. Region A goes offline entirely. Once Region A comes back online, how do you resolve the 'split-brain' scenario and reconcile conflicting writes?",
        expectedAnswer: "When Region A returns, it must sync the writes it missed from Region B, and vice versa. Conflicting writes to the same record are typically resolved using a conflict resolution strategy: 1) Last Write Wins (LWW) using timestamps (requires clock sync). 2) Application-level resolution (calling custom merge logic). 3) CRDTs (Conflict-free Replicated Data Types) for automatic mathematical convergence. 4) Version vectors/vector clocks to detect conflicts and ask the user to resolve them.",
        redFlags: ["Thinks a load balancer easily solves split-brain", "Assumes data will just magically sync without conflicts", "Recommends dropping all of Region A's conflicting data without a strategy"],
        bonusPoints: ["Explains Vector Clocks in detail (e.g., Dynamo)", "Mentions the risk of clock drift skewing Last Write Wins (LWW)"]
      },
      {
        difficulty: "Expert",
        question: "What is Chaos Engineering, and how would you implement a 'Game Day' for a microservices architecture running on Kubernetes?",
        expectedAnswer: "Chaos Engineering is the practice of intentionally injecting failures into a system to build confidence in its resilience. A Game Day involves cross-functional teams monitoring the system while failures are introduced. Implementation in Kubernetes involves using tools like Chaos Mesh or Gremlin to simulate pod crashes, network latency, packet loss, or entire node/AZ failures. The goal is to verify that circuit breakers trip, autoscalers trigger, and alerting works correctly without causing a full outage.",
        redFlags: ["Describes standard integration testing instead of chaos engineering", "Suggests doing it in prod without any blast radius control or baseline metrics", "Fails to mention monitoring/alerting as the primary feedback loop"],
        bonusPoints: ["Mentions starting chaos engineering in a staging environment before moving to production", "References Netflix's Chaos Monkey"]
      }
    ]
  }
];

const run = async () => {
  try {
    await appendQuestions('round-5', categoriesArray);
    console.log("Successfully ran add-more-round-5 script.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
