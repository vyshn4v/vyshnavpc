import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: "docker-python-example",
    title: "31. Containerizing a Python App",
    order: 31,
    content: "<h2>Flask and Django</h2><p>For Python apps, you start with a `python:3.x-slim` base image. Copy `requirements.txt`, run `pip install -r requirements.txt`, then copy the app source. Ensure that you do not run Flask's or Django's built-in development server in production. Instead, use a production-ready WSGI server like Gunicorn or uWSGI inside the container.</p>",
    interviewQuestions: [
      { question: "Why shouldn't you use the Flask development server in a Docker container for production?", answer: "The development server is not designed to be secure, stable, or efficient. It cannot handle concurrent requests well. A production WSGI server like Gunicorn should be used instead." },
      { question: "What is the purpose of the `-slim` Python image variants?", answer: "They contain only the minimal packages needed to run Python, significantly reducing image size compared to the full Debian-based image." }
    ],
    practicalTask: {
      scenario: "Installing Python dependencies efficiently.",
      task: "Write the Dockerfile instruction to install dependencies without caching.",
      solutionCode: "RUN pip install --no-cache-dir -r requirements.txt"
    }
  },
  {
    slug: "docker-java-example",
    title: "32. Containerizing a Java App",
    order: 32,
    content: "<h2>Spring Boot Apps</h2><p>Java applications traditionally produced heavy artifacts (WAR/EAR) requiring Application Servers (like Tomcat). Spring Boot packages an embedded server within a fat JAR. Containerizing it involves using an OpenJDK base image, copying the JAR, and setting the entrypoint to `java -jar app.jar`. Multi-stage builds are excellent here: stage 1 runs Maven/Gradle, stage 2 runs the JAR.</p>",
    interviewQuestions: [
      { question: "How does a multi-stage build benefit a Java application?", answer: "The first stage can contain Maven/Gradle and download all dependencies to compile the code. The second stage only needs a barebones JRE (Java Runtime Environment) to run the compiled JAR, omitting the heavy build tools from the final image." },
      { question: "What is a 'fat JAR'?", answer: "A JAR file that contains both the application's compiled classes and all of its dependencies, including an embedded web server, making it directly executable." }
    ],
    practicalTask: {
      scenario: "Defining the execution command for a Java app.",
      task: "Write the ENTRYPOINT for a containerized Spring Boot app.",
      solutionCode: "ENTRYPOINT [\"java\", \"-jar\", \"/app.jar\"]"
    }
  },
  {
    slug: "docker-react-frontend",
    title: "33. Containerizing a React/Frontend App",
    order: 33,
    content: "<h2>Nginx and Multi-stage Builds</h2><p>Frontend applications (React, Angular, Vue) compile down to static HTML, CSS, and JS. You don't need Node.js to serve them in production. A best practice multi-stage build: Stage 1 uses Node to run `npm run build`. Stage 2 uses an Nginx base image, copies the static files from Stage 1 into Nginx's html directory, and serves them.</p>",
    interviewQuestions: [
      { question: "Why serve a React app with Nginx in Docker rather than Node.js?", answer: "Once built, a React app is just static files. Nginx is an extremely fast and lightweight web server optimized for serving static content, whereas a Node.js server consumes more memory and overhead." },
      { question: "How do you handle client-side routing (like React Router) with Nginx in Docker?", answer: "You must configure Nginx to route all 404 requests to `index.html`, allowing the JavaScript router to take over the URL path." }
    ],
    practicalTask: {
      scenario: "Copying build artifacts to Nginx.",
      task: "Write the Dockerfile instruction to copy from a 'build' stage to Nginx.",
      solutionCode: "COPY --from=build /app/build /usr/share/nginx/html"
    }
  },
  {
    slug: "docker-database",
    title: "34. Database Containerization",
    order: 34,
    content: "<h2>PostgreSQL and MongoDB</h2><p>Running databases in Docker is common for local development. Official images (postgres, mongo, mysql) support environment variables to initialize the database (e.g., `POSTGRES_USER`, `POSTGRES_PASSWORD`). They also support init scripts: any `.sql` or `.sh` script mounted to `/docker-entrypoint-initdb.d/` will execute automatically on the first start.</p>",
    interviewQuestions: [
      { question: "How can you automatically create a schema when a PostgreSQL container starts?", answer: "By mounting a SQL dump or creation script into the `/docker-entrypoint-initdb.d/` directory inside the container." },
      { question: "Why is data persistence crucial for database containers?", answer: "Because container file systems are ephemeral. If the container is removed or replaced, all database data is lost unless it is stored on a mounted Docker Volume." }
    ],
    practicalTask: {
      scenario: "Initialize a PostgreSQL container.",
      task: "Run Postgres setting the password via environment variable.",
      solutionCode: "docker run -e POSTGRES_PASSWORD=mysecret -d postgres"
    }
  },
  {
    slug: "docker-persistence",
    title: "35. Persistent Data Strategies",
    order: 35,
    content: "<h2>Backups and Migrations</h2><p>Volumes manage persistence, but backing up that data is a separate concern. A common strategy is to run a temporary container that mounts the database volume AND a local host directory, tars or dumps the data, and exits. Database migrations (like Flyway or Liquibase) should be run via separate temporary containers during deployment pipelines.</p>",
    interviewQuestions: [
      { question: "How do you backup a Docker volume?", answer: "Run a temporary container, mount the volume to backup, mount a host directory, and run a `tar` command to archive the volume contents into the host directory." },
      { question: "Should database migrations run inside the application container startup script?", answer: "It's generally discouraged in scaled environments, as multiple containers starting simultaneously might cause migration conflicts. Migrations are better run as a dedicated step in a CI/CD pipeline." }
    ],
    practicalTask: {
      scenario: "Database backup execution.",
      task: "Execute pg_dump against a running postgres container named 'db'.",
      solutionCode: "docker exec db pg_dump -U postgres mydb > backup.sql"
    }
  }
];

appendTopics("docker", "Docker Containerization", "The definitive guide.", topics);
