import { rewriteAnswers } from './rewriteAnswers.js';

const map = {
  "You accidentally committed secrets to a local commit, and then realized it before pushing. How do you completely remove the secrets from the commit history without creating a new commit?": `I'd use a soft reset. I run \`git reset --soft HEAD~1\` to undo the commit while keeping all the files staged. Then I unstage the file with the secrets using \`git restore --staged <file>\`. Once the secret is out, I commit the rest of the changes as I originally intended, and finally add the secret file to my \`.gitignore\` so it doesn't happen again.`,
  
  "Explain the detailed process of resolving a complex merge conflict during an interactive rebase (\`git rebase -i\`), where multiple commits affect the same lines.": `During an interactive rebase, if I hit a conflict, Git pauses the rebase. First, I open the conflicting files in VS Code and look for the conflict markers to manually choose the correct lines from either the current branch or the incoming commit, or sometimes write a new combination. Once the file is fixed, I run \`git add <file>\` to stage the resolution. I don't commit it; instead, I run \`git rebase --continue\`. If another commit in the rebase sequence affects the same lines, I repeat this process. If things get too messy, I know I can always run \`git rebase --abort\` to return to the state before the rebase started.`,
  
  "A feature branch was merged into \`main\` using a squash merge. A developer then tries to merge \`main\` back into their long-running feature branch. What problems might occur, and how should they handle it?": `The main problem is that a squash merge creates a brand new commit on \`main\` that contains all the changes, but doesn't preserve the individual commit history. If the developer merges \`main\` back, Git sees the original commits in their branch and the new squashed commit in \`main\` as completely different sets of changes, leading to massive merge conflicts. To fix this, instead of merging, I would fetch \`main\` and rebase my feature branch on top of it. Alternatively, if the branch is too diverged, it might be cleaner to just branch off \`main\` again and cherry-pick only the new commits I still need.`,
  
  "What is a \"detached HEAD\" state in Git? How do you get into it, and how do you fix it to save your work?": `A 'detached HEAD' means I've checked out a specific commit hash or a remote branch directly, rather than a local branch. My working directory reflects that exact point in history, but any new commits I make won't belong to any branch. I usually get into this state by running something like \`git checkout a1b2c3d\`. To fix it and save my work, I simply create a new branch from my current state using \`git switch -c new-branch-name\`, or \`git checkout -b new-branch-name\`. That attaches HEAD to the new branch and preserves my commits.`,
  
  "You want to move a specific commit from one branch to another, but only the changes introduced by that exact commit. Which Git command do you use, and how do you handle conflicts during this process?": `I use \`git cherry-pick <commit-hash>\`. I switch to the target branch first, then run the command. If there's a conflict, Git stops the process. I open my editor, resolve the conflict markers, save, and then run \`git add\` on those files. Finally, I run \`git cherry-pick --continue\` to finalize it. I can also \`--abort\` if I realize I picked the wrong commit.`,
  
  "Describe the Gitflow branching strategy versus GitHub flow (trunk-based development). When would you choose one over the other?": `Gitflow is a strict branching model with long-lived \`develop\` and \`master\` branches, plus specific branches for features, releases, and hotfixes. It's great for software with scheduled, versioned releases, like mobile apps. GitHub flow is much simpler: everything branches off a single \`main\` branch, gets reviewed via pull requests, and is merged back into \`main\` to be deployed immediately. I prefer GitHub flow for web development where continuous deployment is the goal, because it keeps the history simple and speeds up delivery.`,
  
  "In a GitHub Actions workflow, what is the difference between the \`on: push\` and \`on: pull_request\` triggers? How do they behave differently regarding the code they test?": `The \`on: push\` trigger runs the workflow whenever commits are directly pushed to the specified branch. It tests exactly what is on that branch. The \`on: pull_request\` trigger runs when a PR is opened or updated against a target branch. Crucially, it tests the hypothetical merge commit—meaning it tests what the code *will* look like after the PR is merged into the base branch, ensuring that the merge itself won't break anything.`,
  
  "Your Node.js deployment pipeline is taking 15 minutes to run \`npm install\` on every GitHub Actions build. How do you dramatically reduce this time?": `I would implement caching for the \`node_modules\` folder or the npm cache. In GitHub Actions, I can use the \`actions/setup-node\` action with \`cache: 'npm'\` enabled, or use the \`actions/cache\` step directly, keying it to the hash of my \`package-lock.json\`. If the lockfile hasn't changed, it restores the cache, and \`npm install\` (or \`npm ci\`) finishes in seconds instead of minutes.`,
  
  "What is a \"Blue-Green deployment\" strategy, and how does it prevent downtime during a release?": `Blue-Green deployment means having two identical production environments. Let's say 'Blue' is currently live serving user traffic. I deploy my new release to 'Green'. I can run all my tests and verify Green is working perfectly. Once I'm confident, I simply switch the router or load balancer to point traffic from Blue to Green. This eliminates downtime because the switch is instantaneous, and if something goes wrong, rolling back is as simple as flipping the router back to Blue.`,
  
  "You have a microservices architecture. How do you handle database migrations in a CI/CD pipeline without breaking the currently running version of the application?": `The key is to use non-breaking database migrations and a multi-step deployment process. First, my CI/CD pipeline runs a migration that only *adds* schema changes, like new columns, but doesn't delete or rename anything. Because it's backward-compatible, the currently running app version isn't broken. Then, I deploy the new application code that utilizes the new columns. Finally, in a subsequent release after all old app versions are retired, I can run a cleanup migration to drop the old columns.`,
  
  "In your Domain Scanner project, you used PM2 and Nginx. Describe how a CI/CD pipeline (e.g., Jenkins or GitHub Actions) would automatically deploy a new React frontend and Node backend to a VPS.": `For the CI/CD pipeline, I would set up a GitHub Action that triggers on push to the main branch. First, it would SSH into the VPS using secrets. For the frontend, it would pull the latest code, run \`npm run build\` to generate the React static files, and copy them to the folder Nginx serves from. For the backend, it would pull the code, run \`npm install\`, and then restart the Node app using \`pm2 restart backend-app\`. I'd also make sure Nginx is configured as a reverse proxy for the PM2 instances.`,
  
  "What is the purpose of Infrastructure as Code (IaC), and what tools are commonly used for it?": `IaC lets me manage and provision servers and infrastructure through code rather than manually clicking through a cloud provider's dashboard. This means my infrastructure is version-controlled, reproducible, and self-documenting. I typically use Terraform to define cloud resources across providers like AWS or GCP, and sometimes Ansible for configuring the servers themselves once they're spun up.`,
  
  "What is the fundamental difference between standard HTTP requests, HTTP Long Polling, and WebSockets? When would you use each?": `Standard HTTP is stateless and unidirectional: the client requests, the server responds, and the connection closes. It's for standard web browsing and CRUD APIs. Long Polling keeps the HTTP request open until the server has new data, then responds and immediately opens a new connection; it's a hack for near-real-time updates when WebSockets aren't supported. WebSockets create a persistent, full-duplex TCP connection, meaning both client and server can send messages to each other at any time with minimal overhead. I use WebSockets for highly interactive apps like chat or live stock tickers.`,
  
  "You are using Socket.IO in a Node.js backend that is scaled horizontally across 4 servers (instances). What problem will occur, and how do you solve it?": `The problem is that Socket.IO uses multiple requests to establish the connection (starting with long-polling before upgrading to WebSockets), and a client might hit Server A for the first request and Server B for the next, which breaks the connection. Also, if a client on Server A sends a chat message, Server B doesn't know about it. To solve this, I first configure sticky sessions on my load balancer (like Nginx) so a client always hits the same server. Second, I implement a Redis Adapter for Socket.IO, which acts as a pub/sub message broker so events are shared across all 4 server instances.`,
  
  "Explain CORS (Cross-Origin Resource Sharing). How does the browser enforce it, and how do you configure it in an Express.js API?": `CORS is a browser security mechanism that restricts a webpage from making requests to a different domain than the one that served the webpage. The browser enforces it by sending an HTTP OPTIONS 'preflight' request to see if the server permits the actual request. If the server's headers don't allow it, the browser blocks the response. In Express, I fix this by installing the \`cors\` middleware package and configuring it like \`app.use(cors({ origin: 'https://myfrontend.com' }))\` to explicitly allow requests from my React app's domain.`,
  
  "What are the main improvements of HTTP/2 over HTTP/1.1, and how do they benefit modern web applications like React SPAs?": `HTTP/2's biggest improvement is multiplexing, allowing multiple requests and responses to happen simultaneously over a single TCP connection, eliminating the head-of-line blocking problem in HTTP/1.1. It also introduces header compression and server push. For a React SPA, this is huge because SPAs typically request dozens of small asset files (JS chunks, CSS, images). Multiplexing means they all download concurrently on one connection, drastically speeding up the initial page load without me having to use hacks like sprite sheets or domain sharding.`,
  
  "In a real-time collaborative editing app (like Google Docs) using WebSockets, how do you handle conflicting edits from two users modifying the same line simultaneously?": `I would implement Operational Transformation (OT) or use Conflict-free Replicated Data Types (CRDTs). When two users edit at the same time, their clients send the operations (like 'insert A at index 5') to the server. The server acts as the single source of truth, ordering the operations and transforming them if necessary before broadcasting them back. For instance, if User 1 deleted a character before User 2's insertion, the server transforms User 2's insertion index to account for the deletion, ensuring both clients eventually converge on the exact same document state.`,
  
  "Write a basic \`Dockerfile\` for a production-ready Node.js Express application. Optimize it for image size and security.": `I'd use a multi-stage build. 
\`\`\`dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
\`\`\`
Using the \`alpine\` image keeps the size small. Using \`npm ci --only=production\` avoids installing devDependencies in the final image. Setting \`USER node\` prevents the app from running as the root user, which is a major security best practice.`,
  
  "Write a basic Jest unit test for a React component named \`LoginButton\` that receives an \`onClick\` prop and renders the text \"Login\". Ensure the \`onClick\` function is called when clicked.": `Here's how I'd write it using React Testing Library and Jest:
\`\`\`javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginButton from './LoginButton';

test('renders Login text and triggers onClick', async () => {
  const handleClick = jest.fn();
  render(<LoginButton onClick={handleClick} />);
  
  const button = screen.getByRole('button', { name: /login/i });
  expect(button).toBeInTheDocument();
  
  await userEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);
});
\`\`\`
I mock the function with \`jest.fn()\`, simulate the click with \`userEvent\`, and verify the mock was called.`,
  
  "Scenario: Your Node.js backend is running out of memory (OOM) and crashing every few hours in production. How do you practically debug and identify the memory leak?": `First, I'd check my APM tool or PM2 logs to confirm it's an OOM error. Then, I would start the Node process with the \`--inspect\` flag locally or in a staging environment and use Chrome DevTools to connect to it. I'd take a heap snapshot, run a load test to simulate traffic, and then take a second heap snapshot. By comparing the two snapshots, I can see exactly which objects are accumulating in memory and not being garbage collected. Common culprits I look for are unclosed database connections, global variables storing data indefinitely, or event listeners that are never removed.`,
  
  "Write a basic Github Actions workflow (\`.yml\` file) that triggers on a push to \`main\`, checks out the code, sets up Node.js 18, installs dependencies, and runs \`npm test\`.": `\`\`\`yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js 18
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    - run: npm ci
    - run: npm test
\`\`\``,
  
  "You have a Linux VPS. Write the basic command-line steps to view the last 100 lines of an Nginx error log file and continuously watch for new errors in real-time.": `I would SSH into the server and run \`tail -n 100 -f /var/log/nginx/error.log\`. The \`-n 100\` flag outputs the last 100 lines so I can see what just happened, and the \`-f\` flag (for 'follow') keeps the stream open, printing any new log entries in real-time as they occur.`
};

async function run() {
  await rewriteAnswers('round-7', map);
  console.log("Finished rewriting answers for round-7!");
  process.exit(0);
}

run();
