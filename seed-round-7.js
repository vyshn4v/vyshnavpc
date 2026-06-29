import { insertRound } from "./insertRound.js";
import { connectDb } from "./src/config/initializeDevDb.js";
import dotenv from "dotenv";

dotenv.config({ path: "./src/.env.local" });

const roundData = {
  roundId: 'round-7',
  roundName: 'Round 7: Tools, DevOps & Practical Tasks',
  order: 7,
  description: 'Deep dive into tools, DevOps concepts, version control, networking, and practical coding/configuration scenarios based on real-world situations.',
  categories: [
    {
      categoryName: 'Git & Version Control',
      questions: [
        {
          difficulty: 'Medium',
          question: 'You accidentally committed secrets to a local commit, and then realized it before pushing. How do you completely remove the secrets from the commit history without creating a new commit?',
          expectedAnswer: 'Use `git reset --soft HEAD~1` to undo the commit while keeping the changes staged, unstage the secrets file using `git reset HEAD <file>`, and then commit again. Alternatively, use `git commit --amend` after staging the corrected files, or an interactive rebase (`git rebase -i HEAD~2`) to drop or edit the problematic commit.',
          redFlags: ['Suggesting `git revert` which keeps the original commit and its secrets in the history', 'Not knowing how to modify local history before pushing'],
          bonusPoints: ['Mentions `git rm --cached`', 'Mentions using tools like BFG Repo-Cleaner or git-filter-repo for more complex scenarios']
        },
        {
          difficulty: 'Hard',
          question: 'Explain the detailed process of resolving a complex merge conflict during an interactive rebase (`git rebase -i`), where multiple commits affect the same lines.',
          expectedAnswer: 'During the rebase, Git pauses at the conflicting commit. You open the conflicting files, look for conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), manually resolve the code by picking the correct lines (or a combination), save the file, stage the resolved file using `git add`, and then run `git rebase --continue`. You do NOT run `git commit` in the middle of resolving a rebase conflict.',
          redFlags: ['Suggesting `git commit` during a rebase conflict instead of `--continue`', 'Not understanding that conflicts can happen multiple times for the same file in a single rebase'],
          bonusPoints: ['Mentions using `git rerere` (reuse recorded resolution) to automatically resolve repeated conflicts', 'Explains using visual diff tools like `kdiff3` or VSCode\'s merge editor']
        },
        {
          difficulty: 'Expert',
          question: 'A feature branch was merged into `main` using a squash merge. A developer then tries to merge `main` back into their long-running feature branch. What problems might occur, and how should they handle it?',
          expectedAnswer: 'A squash merge creates a single entirely new commit on `main` that contains all changes, but it doesn\'t share ancestor history with the original feature branch commits. Merging `main` back into the feature branch can lead to massive, confusing merge conflicts because Git doesn\'t recognize that the changes are identical. To handle it, the developer should rebase their local feature branch onto the new `main` commit, or better, recreate their local branch from `main` and cherry-pick any unmerged work.',
          redFlags: ['Believes squash merge maintains commit lineage seamlessly', 'Suggests a normal merge without understanding the conflict implications'],
          bonusPoints: ['Explains that squash merges alter history from the perspective of Git\'s common ancestor logic', 'Suggests avoiding long-running branches altogether to mitigate this']
        },
        {
          difficulty: 'Medium',
          question: 'What is a "detached HEAD" state in Git? How do you get into it, and how do you fix it to save your work?',
          expectedAnswer: 'A detached HEAD means HEAD is pointing directly to a specific commit hash rather than a branch name. You enter this state by checking out a specific commit (`git checkout <hash>`) or a remote branch without a local tracking branch. If you make commits in this state, they won\'t belong to any branch. To save the work, create a new branch from the detached state: `git checkout -b <new-branch-name>` or `git branch <new-branch-name> HEAD`.',
          redFlags: ['Thinks a detached HEAD is a corrupted repo state', 'Does not know how to save commits made in a detached HEAD state'],
          bonusPoints: ['Mentions that commits in a detached HEAD state will eventually be garbage collected by Git if not assigned to a branch or tag']
        },
        {
          difficulty: 'Hard',
          question: 'You want to move a specific commit from one branch to another, but only the changes introduced by that exact commit. Which Git command do you use, and how do you handle conflicts during this process?',
          expectedAnswer: 'You use `git cherry-pick <commit-hash>`. If a conflict occurs, Git will pause the cherry-pick. You must manually resolve the conflicts in the affected files, stage the resolved files with `git add <file>`, and then resume the process with `git cherry-pick --continue`. You can also abort with `git cherry-pick --abort`.',
          redFlags: ['Confuses cherry-pick with merge or rebase', 'Does not know how to continue or abort a cherry-pick'],
          bonusPoints: ['Mentions cherry-picking a range of commits (`git cherry-pick A..B`)']
        },
        {
          difficulty: 'Medium',
          question: 'Describe the Gitflow branching strategy versus GitHub flow (trunk-based development). When would you choose one over the other?',
          expectedAnswer: 'Gitflow uses multiple long-lived branches (main, develop, release, hotfix) and is strictly structured. It is suitable for projects with scheduled, versioned releases (like desktop software). GitHub flow (trunk-based) uses a single long-lived branch (`main`), with short-lived feature branches merged frequently via PRs. It is ideal for continuous delivery/deployment (CI/CD) environments like web applications where changes are deployed multiple times a day.',
          redFlags: ['Unable to differentiate between the two', 'Suggests Gitflow is standard for all modern web apps'],
          bonusPoints: ['Mentions feature flags/toggles as a requirement for successful trunk-based development']
        }
      ]
    },
    {
      categoryName: 'CI/CD & Automation',
      questions: [
        {
          difficulty: 'Medium',
          question: 'In a GitHub Actions workflow, what is the difference between the `on: push` and `on: pull_request` triggers? How do they behave differently regarding the code they test?',
          expectedAnswer: '`on: push` triggers the workflow whenever commits are pushed to the specified branch. It tests the exact state of that branch. `on: pull_request` triggers when a PR is opened or updated. Crucially, it usually tests the *merge commit* (the hypothetical result of merging the PR into the target branch), ensuring the changes will work *after* merging, not just on the source branch.',
          redFlags: ['Thinks they are identical triggers', 'Fails to understand that `pull_request` tests the potential merged state'],
          bonusPoints: ['Mentions using `pull_request_target` for security when dealing with forks']
        },
        {
          difficulty: 'Hard',
          question: 'Your Node.js deployment pipeline is taking 15 minutes to run `npm install` on every GitHub Actions build. How do you dramatically reduce this time?',
          expectedAnswer: 'You should implement caching for the `node_modules` directory or the global npm cache (e.g., `~/.npm`). In GitHub Actions, you use the `actions/cache` step or the built-in caching of `actions/setup-node` (e.g., `cache: "npm"`). The cache key should be based on a hash of the `package-lock.json` file. If the file doesn\'t change, the dependencies are restored from the cache instead of being downloaded.',
          redFlags: ['Suggests committing `node_modules` to the repo', 'Does not mention hashing the lockfile for cache invalidation'],
          bonusPoints: ['Mentions using `npm ci` instead of `npm install` for faster, deterministic builds in CI environments', 'Mentions multi-stage Docker builds if Docker is used']
        },
        {
          difficulty: 'Medium',
          question: 'What is a "Blue-Green deployment" strategy, and how does it prevent downtime during a release?',
          expectedAnswer: 'Blue-Green deployment involves maintaining two identical production environments (Blue and Green). At any time, one is active (serving live traffic) and the other is idle. A new release is deployed to the idle environment and thoroughly tested. To release, the router or load balancer is simply switched to point to the new environment. This means zero downtime during the switch, and instant rollback capability by switching back.',
          redFlags: ['Confuses it with Canary releases or rolling updates', 'Cannot explain how the switch happens (router/load balancer)'],
          bonusPoints: ['Contrasts Blue-Green with Canary releases (routing a small percentage of traffic to the new version first)']
        },
        {
          difficulty: 'Hard',
          question: 'You have a microservices architecture. How do you handle database migrations in a CI/CD pipeline without breaking the currently running version of the application?',
          expectedAnswer: 'Database migrations must be backward compatible. The pipeline should run migrations *before* deploying the new application code. The changes (e.g., adding a column) must not break the old code still running. The old code and new code will both run temporarily during deployment. Only in a subsequent release can you drop unused columns or tables. This is often called the "Expand and Contract" pattern.',
          redFlags: ['Suggests taking the application offline to migrate', 'Does not consider backward compatibility of database schema changes'],
          bonusPoints: ['Mentions tools like Flyway, Liquibase, or Prisma migrations', 'Explains the "Expand and Contract" (Parallel Change) pattern in detail']
        },
        {
          difficulty: 'Expert',
          question: 'In your Domain Scanner project, you used PM2 and Nginx. Describe how a CI/CD pipeline (e.g., Jenkins or GitHub Actions) would automatically deploy a new React frontend and Node backend to a VPS.',
          expectedAnswer: 'The CI pipeline runs tests and builds the frontend (generating static files) and backend. The CD phase uses SSH or tools like `rsync`/`scp` to transfer the build artifacts to the VPS. For the frontend, files are copied to the Nginx root directory (e.g., `/var/www/html`). For the backend, the new code is transferred, dependencies installed (`npm ci`), and the PM2 process is restarted seamlessly using `pm2 reload <app-name>` (which provides zero downtime). Nginx acts as a reverse proxy, routing `/api` requests to the local PM2 port and serving the React static files.',
          redFlags: ['Does not mention building the React app before deployment', 'Suggests running a development server (`npm start`) in production', 'Does not know `pm2 reload` for zero-downtime restarts'],
          bonusPoints: ['Mentions updating Nginx configurations and reloading Nginx (`systemctl reload nginx`) if proxy rules change', 'Discusses environment variable injection during the pipeline']
        },
        {
          difficulty: 'Medium',
          question: 'What is the purpose of Infrastructure as Code (IaC), and what tools are commonly used for it?',
          expectedAnswer: 'IaC involves managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. It ensures consistency, reproducibility, and version control for infrastructure. Common tools include Terraform, AWS CloudFormation, Ansible, and Pulumi.',
          redFlags: ['Confuses IaC with application configuration management like `.env` files'],
          bonusPoints: ['Mentions declarative vs. imperative approaches in IaC']
        }
      ]
    },
    {
      categoryName: 'WebSockets & Network Protocols',
      questions: [
        {
          difficulty: 'Medium',
          question: 'What is the fundamental difference between standard HTTP requests, HTTP Long Polling, and WebSockets? When would you use each?',
          expectedAnswer: 'HTTP is a stateless, request-response protocol where the client must initiate communication. Long Polling is a hack where the client makes an HTTP request, and the server holds the connection open until it has data, then responds; the client immediately connects again. WebSockets provide a persistent, full-duplex, bidirectional TCP connection where both server and client can send data independently at any time. Use HTTP for standard CRUD, Long Polling as a fallback for older browsers, and WebSockets for real-time apps like chat, live tickers, or multiplayer games.',
          redFlags: ['Thinks WebSockets use standard HTTP for the entire connection (fails to mention the initial HTTP handshake and upgrade to TCP)', 'Does not understand full-duplex communication'],
          bonusPoints: ['Mentions Server-Sent Events (SSE) as an alternative for unidirectional server-to-client real-time data']
        },
        {
          difficulty: 'Hard',
          question: 'You are using Socket.IO in a Node.js backend that is scaled horizontally across 4 servers (instances). What problem will occur, and how do you solve it?',
          expectedAnswer: 'The problem is that a client connected to Server A might need to receive a message triggered by an event on Server B, but the servers don\'t share WebSocket connections. Also, standard long-polling fallbacks will fail if the load balancer routes subsequent requests to different servers (requiring sticky sessions). To solve the cross-server communication, you must implement a Pub/Sub mechanism, specifically using the Socket.IO Redis Adapter. This allows all Node instances to publish and subscribe to events via a central Redis server.',
          redFlags: ['Does not recognize that WebSockets are stateful and bound to a specific server instance', 'Suggests a database like PostgreSQL to sync real-time events instead of an in-memory pub/sub like Redis'],
          bonusPoints: ['Mentions configuring "sticky sessions" (Session Affinity) on the Load Balancer (like Nginx or AWS ALB) to ensure the initial handshake works smoothly']
        },
        {
          difficulty: 'Medium',
          question: 'Explain CORS (Cross-Origin Resource Sharing). How does the browser enforce it, and how do you configure it in an Express.js API?',
          expectedAnswer: 'CORS is a browser security mechanism that prevents a web page from making requests to a different domain than the one that served the page. The browser enforces this by sending a preflight `OPTIONS` request for non-simple requests. The server must respond with specific headers (like `Access-Control-Allow-Origin`). In Express, you use the `cors` middleware, configuring it to allow specific origins, methods, and headers, and enabling `credentials: true` if sending cookies.',
          redFlags: ['Believes CORS is a server-side security measure that protects the server from hackers (it protects the client/browser)', 'Does not mention preflight OPTIONS requests'],
          bonusPoints: ['Explains the security risks of using a wildcard `*` for the allowed origin, especially with credentials']
        },
        {
          difficulty: 'Hard',
          question: 'What are the main improvements of HTTP/2 over HTTP/1.1, and how do they benefit modern web applications like React SPAs?',
          expectedAnswer: 'HTTP/2 introduces multiplexing (multiple requests/responses concurrently over a single TCP connection without head-of-line blocking), header compression (HPACK), and binary framing instead of plain text. For a React SPA, multiplexing is huge because it can efficiently load dozens of small JavaScript chunks or image assets simultaneously without hitting browser connection limits, rendering the page faster without needing complex asset bundling workarounds.',
          redFlags: ['Confuses HTTP/2 with HTTPS/TLS', 'Cannot explain multiplexing'],
          bonusPoints: ['Mentions Server Push (though deprecated in some contexts)', 'Mentions HTTP/3 and QUIC (UDP based)']
        },
        {
          difficulty: 'Expert',
          question: 'In a real-time collaborative editing app (like Google Docs) using WebSockets, how do you handle conflicting edits from two users modifying the same line simultaneously?',
          expectedAnswer: 'This requires conflict resolution algorithms, typically Operational Transformation (OT) or Conflict-free Replicated Data Types (CRDTs). The server acts as the source of truth. When clients send edits, they include a version number. If the server receives an edit based on an older version, it transforms the operation based on the intervening edits before applying it and broadcasting the transformed state. CRDTs handle this mathematically by ensuring all operations are commutative.',
          redFlags: ['Suggests simply locking the document or line (bad UX)', 'Suggests "last write wins" which destroys data in collaborative text editing'],
          bonusPoints: ['Can specifically differentiate between OT (relies on a central server for sequencing) and CRDTs (can be purely peer-to-peer)']
        }
      ]
    },
    {
      categoryName: 'Practical Tasks & Scenarios',
      questions: [
        {
          difficulty: 'Hard',
          question: 'Write a basic `Dockerfile` for a production-ready Node.js Express application. Optimize it for image size and security.',
          expectedAnswer: '```dockerfile\n# Use a lightweight Alpine image\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\n\n# Multi-stage build for a smaller final image\nFROM node:18-alpine\nWORKDIR /app\n# Run as non-root user for security\nUSER node\nCOPY --from=builder /app/package*.json ./\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/src ./src\nENV NODE_ENV=production\nEXPOSE 3000\nCMD ["node", "src/index.js"]\n```',
          redFlags: ['Using a heavy base image like `node:18` instead of alpine', 'Running the app as the root user', 'Using `npm install` instead of `npm ci`', 'Copying everything `COPY . .` without using `.dockerignore` or multi-stage builds'],
          bonusPoints: ['Using multi-stage builds', 'Explicitly setting `USER node`', 'Setting `ENV NODE_ENV=production`']
        },
        {
          difficulty: 'Medium',
          question: 'Write a basic Jest unit test for a React component named `LoginButton` that receives an `onClick` prop and renders the text "Login". Ensure the `onClick` function is called when clicked.',
          expectedAnswer: '```javascript\nimport { render, screen, fireEvent } from "@testing-library/react";\nimport LoginButton from "./LoginButton";\n\ntest("renders button and handles click", () => {\n  const handleClick = jest.fn();\n  render(<LoginButton onClick={handleClick} />);\n  \n  const button = screen.getByText(/login/i);\n  expect(button).toBeInTheDocument();\n  \n  fireEvent.click(button);\n  // or userEvent.click(button)\n  expect(handleClick).toHaveBeenCalledTimes(1);\n});\n```',
          redFlags: ['Does not know how to mock a function using `jest.fn()`', 'Fails to use React Testing Library methods like `render` or `screen`', 'Does not assert the mock was called'],
          bonusPoints: ['Mentions using `@testing-library/user-event` instead of `fireEvent` for more realistic interactions']
        },
        {
          difficulty: 'Hard',
          question: 'Scenario: Your Node.js backend is running out of memory (OOM) and crashing every few hours in production. How do you practically debug and identify the memory leak?',
          expectedAnswer: 'I would first monitor memory usage via PM2 or a tool like Datadog/New Relic. To find the leak, I would generate a heap snapshot of the Node.js process. I can do this by starting Node with the `--inspect` flag or using a module like `heapdump`. I take one snapshot just after startup, and another after the memory has grown significantly. I would load these snapshots into the Chrome DevTools Memory tab and use the "Comparison" view to see exactly which objects or closures are accumulating and not being garbage collected.',
          redFlags: ['Suggests just increasing the server RAM', 'Does not know what a heap snapshot is', 'Suggests using `console.log` to find a memory leak'],
          bonusPoints: ['Mentions common causes of Node.js memory leaks (e.g., global variables, uncleared intervals/timers, unclosed database connections, excessive event listeners)']
        },
        {
          difficulty: 'Expert',
          question: 'Write a basic Github Actions workflow (`.yml` file) that triggers on a push to `main`, checks out the code, sets up Node.js 18, installs dependencies, and runs `npm test`.',
          expectedAnswer: '```yaml\nname: Node.js CI\non:\n  push:\n    branches: [ "main" ]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n    - uses: actions/checkout@v3\n    - name: Use Node.js 18\n      uses: actions/setup-node@v3\n      with:\n        node-version: "18"\n        cache: "npm"\n    - run: npm ci\n    - run: npm test\n```',
          redFlags: ['Missing the `on` trigger', 'Missing `actions/checkout` (forgetting to pull the code)', 'Using arbitrary bash commands instead of standard actions like `actions/setup-node`'],
          bonusPoints: ['Includes `cache: "npm"` in the setup-node step', 'Uses `npm ci` instead of `npm install`']
        },
        {
          difficulty: 'Medium',
          question: 'You have a Linux VPS. Write the basic command-line steps to view the last 100 lines of an Nginx error log file and continuously watch for new errors in real-time.',
          expectedAnswer: 'To view and tail the log continuously: `tail -f -n 100 /var/log/nginx/error.log` (or simply `tail -100f /var/log/nginx/error.log`). To search for a specific error keyword in that log, you could use `grep "error" /var/log/nginx/error.log`.',
          redFlags: ['Suggests opening the file with `vim` or `nano` to watch it in real-time', 'Does not know the `-f` flag for `tail`'],
          bonusPoints: ['Mentions using `journalctl -u nginx -f` if Nginx is logging to systemd']
        }
      ]
    }
  ]
};

async function run() {
  try {
    await connectDb();
    await insertRound(roundData);
    console.log("Seed script completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error running seed script:", error);
    process.exit(1);
  }
}

run();
