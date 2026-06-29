import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'postgres-architecture',
    title: 'Chapter 1: Introduction to PostgreSQL and Architecture',
    order: 1,
    content: `<h2>1. Understanding PostgreSQL</h2>
<p>PostgreSQL is a powerful, open-source object-relational database system with over 35 years of active development. It has earned a strong reputation for reliability, feature robustness, and performance. Unlike simple relational database systems, PostgreSQL supports advanced data types and performance optimization features commonly found in commercial database systems, like Oracle and SQL Server.</p>
<h3>Core Philosophy and Features</h3>
<p>PostgreSQL follows a monolithic, client-server architecture. It emphasizes standards compliance (SQL:2016) and extensibility. You can define your own data types, build out custom functions, and even write code from different programming languages without recompiling your database.</p>
<ul>
  <li><strong>MVCC (Multi-Version Concurrency Control):</strong> PostgreSQL ensures high performance through MVCC, which allows concurrent reading and writing without locking the database.</li>
  <li><strong>ACID Compliant:</strong> Fully supports Atomicity, Consistency, Isolation, and Durability out-of-the-box.</li>
  <li><strong>Extensibility:</strong> Allows custom data types, operators, index methods, and languages (PL/pgSQL, PL/Python, etc.).</li>
</ul>
<h3>PostgreSQL Architecture Deep Dive</h3>
<p>Understanding how PostgreSQL handles memory and processes is critical for any database engineer. When the PostgreSQL server starts, it initializes the <strong>Postmaster</strong> process, which allocates shared memory and starts various background processes.</p>
<h4>1. Shared Memory</h4>
<p>The shared memory area consists of several crucial components:</p>
<ul>
  <li><strong>Shared Buffers:</strong> This is PostgreSQL's primary cache for table and index data. When data is read or written, it passes through this buffer pool.</li>
  <li><strong>WAL (Write-Ahead Log) Buffers:</strong> Before changes are written to the actual data files, they are temporarily stored here and then written to the WAL files on disk. This guarantees durability in the event of a crash.</li>
</ul>
<h4>2. Background Processes</h4>
<p>PostgreSQL relies on several utility processes to maintain database health:</p>
<pre><code class="language-bash">
# Some important background processes you might see in htop
postgres: checkpointer
postgres: background writer
postgres: walwriter
postgres: autovacuum launcher
postgres: stats collector
</code></pre>
<p><strong>Background Writer (bgwriter):</strong> Writes dirty pages from shared buffers to disk gradually, reducing the load during checkpoints.</p>
<p><strong>Checkpointer:</strong> Ensures all dirty buffers are written to disk, creating a known good restore point in the WAL.</p>
<p><strong>Autovacuum:</strong> Clears out dead tuples (old versions of rows created by updates and deletes) to prevent table bloat.</p>
`,
    interviewQuestions: [
      {
        question: 'What is MVCC and how does PostgreSQL use it?',
        answer: 'MVCC stands for Multi-Version Concurrency Control. PostgreSQL uses it to provide concurrent access to the database. Instead of locking a row for a read when a write is happening, PostgreSQL keeps multiple versions of a row. Readers see a snapshot of the database at a specific point in time, meaning readers do not block writers, and writers do not block readers.'
      },
      {
        question: 'Explain the role of the Write-Ahead Log (WAL).',
        answer: 'The WAL ensures data integrity. Every modification to the database is first written to the WAL before being applied to the actual data files. If the server crashes, PostgreSQL can replay the WAL from the last checkpoint to restore the database to a consistent state.'
      },
      {
        question: 'What is the Autovacuum daemon?',
        answer: 'Autovacuum is a background process in PostgreSQL that automatically reclaims storage space occupied by dead tuples (rows that have been updated or deleted) and updates data statistics used by the query planner. Without it, tables would continually grow in size (table bloat) and performance would degrade.'
      },
      {
        question: 'Describe the difference between Shared Buffers and WAL Buffers.',
        answer: 'Shared Buffers cache table and index data blocks for fast reading and writing across all database sessions. WAL Buffers temporarily hold transaction log records before they are flushed to disk to guarantee transaction durability.'
      },
      {
        question: 'What is the Postmaster process?',
        answer: 'The Postmaster (or main postgres process) is the parent process that starts when PostgreSQL boots. It manages shared memory, spawns background worker processes, and listens for incoming client connections, forking a new backend process for each client.'
      }
    ],
    practicalTask: {
      scenario: 'You need to verify the version and general settings of a newly handed-over PostgreSQL instance.',
      task: 'Connect to the database and query the version, current settings for shared_buffers, and the location of the data directory.',
      solutionCode: "SELECT version();\nSHOW shared_buffers;\nSHOW data_directory;"
    }
  },
  {
    slug: 'postgres-installation-setup',
    title: 'Chapter 2: Installing, Configuring, and First Steps',
    order: 2,
    content: `<h2>2. Installing and Configuring PostgreSQL</h2>
<p>Setting up PostgreSQL correctly is the foundation of a high-performance database cluster. While basic installation on Linux or Windows takes minutes, configuring it for production requires editing configuration files carefully.</p>
<h3>Installation on Linux (Ubuntu/Debian)</h3>
<pre><code class="language-bash">
# Add the PostgreSQL repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

# Import the repository signing key
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

# Update and install
sudo apt-get update
sudo apt-get -y install postgresql-15
</code></pre>
<h3>Important Configuration Files</h3>
<p>PostgreSQL configuration is primarily driven by three files, usually located in <code>/etc/postgresql/15/main/</code> (on Ubuntu) or the data directory.</p>
<ul>
  <li><strong>postgresql.conf:</strong> The main configuration file for server settings (memory, connections, logging).</li>
  <li><strong>pg_hba.conf:</strong> Host-Based Authentication file. It controls which hosts, users, and IP addresses can connect to which databases.</li>
  <li><strong>pg_ident.conf:</strong> Used for mapping OS usernames to PostgreSQL database usernames.</li>
</ul>
<h3>Tuning postgresql.conf (Basic Production Settings)</h3>
<p>The default settings in <code>postgresql.conf</code> are highly conservative, designed to run on systems with minimal RAM. For a dedicated database server, you must adjust these:</p>
<pre><code class="language-ini">
# Listen on all interfaces, not just localhost
listen_addresses = '*'

# Max connections (balance this with your connection pooler like PgBouncer)
max_connections = 200

# Shared Buffers: Usually set to 25% of total system RAM
shared_buffers = 4GB 

# Work Mem: Memory used for sorting operations (ORDER BY, DISTINCT). Per connection!
work_mem = 32MB

# Maintenance Work Mem: Used for VACUUM, CREATE INDEX. Can be larger.
maintenance_work_mem = 512MB

# Effective Cache Size: Estimate of how much RAM the OS disk cache has. Used by query planner.
# Usually set to 50% - 75% of total system RAM.
effective_cache_size = 12GB
</code></pre>
<h3>Configuring Client Access (pg_hba.conf)</h3>
<p>By default, PostgreSQL uses <code>peer</code> authentication for local connections, meaning it trusts the OS user. To allow remote password-based access, modify <code>pg_hba.conf</code>:</p>
<pre><code class="language-plaintext">
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# Allow any user to connect from the 10.0.0.0/24 subnet using an encrypted password
host    all             all             10.0.0.0/24             scram-sha-256
</code></pre>
<h3>Using psql (The CLI Client)</h3>
<p><code>psql</code> is the interactive terminal for PostgreSQL. Essential commands include:</p>
<ul>
  <li><code>\\l</code> : List all databases.</li>
  <li><code>\\c dbname</code> : Connect to a database.</li>
  <li><code>\\dt</code> : List all tables.</li>
  <li><code>\\d tablename</code> : Describe a table.</li>
  <li><code>\\x</code> : Toggle expanded display (great for wide result sets).</li>
</ul>
`,
    interviewQuestions: [
      {
        question: 'What is the purpose of the pg_hba.conf file?',
        answer: 'The pg_hba.conf file handles client authentication. It defines the rules for who can connect (users), where they can connect from (IP addresses or CIDR blocks), which databases they can access, and the authentication method required (e.g., md5, scram-sha-256, peer, trust).'
      },
      {
        question: 'How do you calculate a reasonable value for shared_buffers?',
        answer: 'As a general rule of thumb for a dedicated PostgreSQL server, shared_buffers should be set to about 25% of the total system RAM. Setting it too high can actually degrade performance because PostgreSQL also relies heavily on the operating system cache (which needs its own memory).'
      },
      {
        question: 'What is work_mem and why is it dangerous to set it too high?',
        answer: 'work_mem specifies the amount of memory to be used by internal sort operations and hash tables before writing to temporary disk files. Because this memory is allocated PER OPERATION (and a complex query can have multiple sort operations, multiplied by concurrent connections), setting it too high can lead to the server running out of memory and crashing.'
      },
      {
        question: 'Explain the difference between peer and scram-sha-256 authentication.',
        answer: 'Peer authentication obtains the clients OS username from the kernel and uses it as the allowed database user, bypassing password prompts (usually used for local socket connections). SCRAM-SHA-256 requires the user to provide a password over the network, which is cryptographically hashed and verified.'
      },
      {
        question: 'What does effective_cache_size do?',
        answer: 'effective_cache_size is an estimate of how much memory is available for disk caching by the operating system and within PostgreSQL itself. It does NOT allocate memory; rather, it provides a hint to the query planner. A higher value makes the planner more likely to use index scans, while a lower value favors sequential scans.'
      }
    ],
    practicalTask: {
      scenario: 'You need to create a new database and a dedicated user, and assign privileges.',
      task: 'Write the SQL commands to create a user "app_user" with a password, create a database "app_db", and grant all privileges on that database to the user.',
      solutionCode: "CREATE USER app_user WITH PASSWORD 'secure_password_123';\nCREATE DATABASE app_db OWNER app_user;\nGRANT ALL PRIVILEGES ON DATABASE app_db TO app_user;"
    }
  },
  {
    slug: 'postgres-basic-crud',
    title: 'Chapter 3: Basic SQL (SELECT, INSERT, UPDATE, DELETE)',
    order: 3,
    content: `<h2>3. Data Manipulation: CRUD Operations</h2>
<p>CRUD (Create, Read, Update, Delete) forms the bedrock of interaction with any RDBMS. While PostgreSQL complies with standard SQL syntax, it offers robust extensions that make writing CRUD queries more powerful.</p>
<h3>Creating Data (INSERT)</h3>
<p>The <code>INSERT INTO</code> statement adds new rows to a table. You can insert a single row, multiple rows at once, and even use the powerful <code>RETURNING</code> clause.</p>
<pre><code class="language-sql">
-- Standard Single Insert
INSERT INTO employees (first_name, last_name, department, salary) 
VALUES ('John', 'Doe', 'Engineering', 85000.00);

-- Multi-row Insert (More efficient than multiple single inserts)
INSERT INTO employees (first_name, last_name, department, salary) 
VALUES 
  ('Jane', 'Smith', 'Marketing', 75000.00),
  ('Bob', 'Johnson', 'Sales', 65000.00);

-- Using RETURNING to get generated IDs or data back immediately
INSERT INTO orders (customer_id, order_total) 
VALUES (105, 250.50) 
RETURNING id, order_date;
</code></pre>
<h3>Reading Data (SELECT)</h3>
<p>The <code>SELECT</code> statement is arguably the most complex command due to its numerous clauses.</p>
<pre><code class="language-sql">
-- Selecting specific columns with aliases
SELECT first_name AS name, salary 
FROM employees;

-- Using string concatenation and mathematical operations
SELECT 
  first_name || ' ' || last_name AS full_name, 
  salary * 1.10 AS projected_salary 
FROM employees;

-- Using COALESCE to handle NULL values
SELECT 
  id, 
  COALESCE(phone_number, 'No phone provided') AS contact_number 
FROM users;
</code></pre>
<h3>Updating Data (UPDATE)</h3>
<p>Updating modifies existing rows. <strong>Always use a WHERE clause</strong> unless you intend to modify every row in the table.</p>
<pre><code class="language-sql">
-- Standard Update
UPDATE employees 
SET salary = 90000.00, department = 'Senior Engineering' 
WHERE id = 1;

-- Updating based on calculations
UPDATE products 
SET price = price * 0.90 
WHERE category = 'Clearance';

-- Using RETURNING
UPDATE invoices 
SET status = 'PAID', paid_at = CURRENT_TIMESTAMP 
WHERE id = 502 
RETURNING status, paid_at;
</code></pre>
<h3>Deleting Data (DELETE)</h3>
<p>Removes rows. Again, the <code>WHERE</code> clause is critical.</p>
<pre><code class="language-sql">
-- Delete specific rows
DELETE FROM audit_logs 
WHERE created_at < '2022-01-01';

-- Delete all rows (TRUNCATE is generally faster and safer for whole tables)
DELETE FROM temporary_data;

-- TRUNCATE command resets table entirely (and can reset identity sequences)
TRUNCATE TABLE temporary_data RESTART IDENTITY;
</code></pre>
<h3>UPSERT (INSERT ... ON CONFLICT)</h3>
<p>A highly powerful PostgreSQL feature is handling constraints during insertion, effectively allowing an "insert or update" operation.</p>
<pre><code class="language-sql">
INSERT INTO user_preferences (user_id, theme) 
VALUES (42, 'dark')
ON CONFLICT (user_id) 
DO UPDATE SET theme = EXCLUDED.theme;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What does the RETURNING clause do in PostgreSQL?',
        answer: 'The RETURNING clause, added to INSERT, UPDATE, or DELETE statements, causes the query to return the values of the rows that were modified or inserted. This avoids the need for a secondary SELECT query to fetch auto-generated values like serial IDs or default timestamps.'
      },
      {
        question: 'What is the difference between DELETE and TRUNCATE?',
        answer: 'DELETE is a DML command that removes rows one by one, firing row-level triggers and generating extensive WAL logs, making it slow for large tables. TRUNCATE is a DDL-like operation that quickly deallocates the data pages containing the table data, bypassing row-level triggers and completing much faster.'
      },
      {
        question: 'Explain the purpose of COALESCE.',
        answer: 'COALESCE evaluates the arguments in order and returns the first non-NULL value. It is highly useful for substituting default values when a database field contains NULL.'
      },
      {
        question: 'How do you perform an UPSERT in PostgreSQL?',
        answer: 'UPSERT is performed using the INSERT INTO ... ON CONFLICT clause. You specify a conflict target (like a unique column constraint) and an action: DO NOTHING to silently ignore the error, or DO UPDATE SET to modify the existing row with new values (using the EXCLUDED keyword).'
      },
      {
        question: 'Why is it dangerous to run an UPDATE without a WHERE clause?',
        answer: 'An UPDATE without a WHERE clause will apply the specified changes to every single row in the table, potentially destroying vast amounts of data and causing severe application downtime.'
      }
    ],
    practicalTask: {
      scenario: 'You are building a caching table for API responses. If a record for a specific URL already exists, its cache must be updated; otherwise, it must be created.',
      task: 'Write an UPSERT query for a table `api_cache(url, response, updated_at)`. Assume `url` is a UNIQUE constraint.',
      solutionCode: "INSERT INTO api_cache (url, response, updated_at)\nVALUES ('/api/v1/users', '{\"data\": []}', CURRENT_TIMESTAMP)\nON CONFLICT (url)\nDO UPDATE SET \n  response = EXCLUDED.response,\n  updated_at = EXCLUDED.updated_at;"
    }
  },
  {
    slug: 'postgres-data-types',
    title: 'Chapter 4: Data Types and Casting',
    order: 4,
    content: `<h2>4. Mastering PostgreSQL Data Types</h2>
<p>PostgreSQL has a famously rich type system. Choosing the correct data type is critical for performance, storage optimization, and data integrity.</p>
<h3>Numeric Types</h3>
<ul>
  <li><strong>smallint (2 bytes), integer (4 bytes), bigint (8 bytes):</strong> Standard whole numbers. Use <code>bigint</code> for primary keys in large tables.</li>
  <li><strong>decimal / numeric:</strong> Exact fractional numbers. Crucial for financial data where precision loss is unacceptable. (e.g., <code>NUMERIC(10, 2)</code>)</li>
  <li><strong>real, double precision:</strong> Inexact, variable-precision floating-point types. Fast, but subject to rounding errors.</li>
  <li><strong>serial / bigserial:</strong> Auto-incrementing integers (syntax sugar for creating a sequence and setting it as a default). Modern Postgres prefers <code>GENERATED ALWAYS AS IDENTITY</code>.</li>
</ul>
<h3>Character Types</h3>
<ul>
  <li><strong>varchar(n):</strong> Variable-length string with a length limit.</li>
  <li><strong>char(n):</strong> Fixed-length string, padded with spaces. (Rarely recommended).</li>
  <li><strong>text:</strong> Variable unlimited length. In PostgreSQL, there is no performance penalty for using <code>text</code> over <code>varchar(n)</code>. Under the hood, they use the same internal representation.</li>
</ul>
<h3>Date and Time Types</h3>
<p>Handling time correctly is notoriously difficult. PostgreSQL provides robust types:</p>
<ul>
  <li><strong>timestamp without time zone:</strong> Stores date and time precisely as entered. Ignorant of time zones.</li>
  <li><strong>timestamp with time zone (timestamptz):</strong> The recommended choice. It internally converts input values to UTC and stores them. When queried, it converts them back to the client's current timezone.</li>
  <li><strong>date:</strong> Only the date.</li>
  <li><strong>interval:</strong> Represents a span of time (e.g., '3 days', '2 hours 30 mins'). Useful for date math.</li>
</ul>
<pre><code class="language-sql">
SELECT CURRENT_TIMESTAMP;
SELECT NOW() + INTERVAL '3 days';
</code></pre>
<h3>Advanced Types: JSONB, Arrays, and UUIDs</h3>
<p>PostgreSQL blurs the line between SQL and NoSQL by supporting advanced structural types.</p>
<p><strong>JSONB:</strong> Stores JSON data in a decomposed binary format. It is incredibly fast to process, supports indexing (GIN indexes), and allows complex querying inside the JSON document.</p>
<pre><code class="language-sql">
-- Querying inside JSONB
SELECT id, metadata->>'browser' AS browser
FROM user_sessions
WHERE metadata @> '{"os": "Windows"}';
</code></pre>
<p><strong>Arrays:</strong> Any standard data type can be stored as an array.</p>
<pre><code class="language-sql">
CREATE TABLE posts (
  id serial,
  title text,
  tags text[]
);
INSERT INTO posts (title, tags) VALUES ('Intro to SQL', ARRAY['sql', 'database', 'tech']);
-- Or using literal syntax
INSERT INTO posts (title, tags) VALUES ('Advanced SQL', '{"sql", "advanced"}');
</code></pre>
<p><strong>UUID:</strong> Universally Unique Identifiers (128-bit). Excellent for distributed systems where generating sequential IDs centrally is a bottleneck.</p>
<h3>Type Casting</h3>
<p>Converting from one type to another is done via the <code>CAST()</code> function or the shorthand <code>::</code> operator.</p>
<pre><code class="language-sql">
SELECT '100'::integer;
SELECT CAST('2023-01-01' AS date);
SELECT '{"a": 1}'::jsonb;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between TEXT and VARCHAR(n) in PostgreSQL performance-wise?',
        answer: 'In PostgreSQL, there is no performance difference between TEXT and VARCHAR(n). They both use the same internal representation structure (varlena). The only difference is that VARCHAR(n) enforces a string length constraint, adding a microscopic check overhead on insertion.'
      },
      {
        question: 'Why should you generally prefer "timestamp with time zone" (timestamptz) over "timestamp without time zone"?',
        answer: 'timestamptz stores all timestamps internally in UTC, ensuring a single, universal source of truth. When data is queried, PostgreSQL automatically formats it to the clients local timezone, preventing timezone misalignment bugs in global applications.'
      },
      {
        question: 'What is the difference between JSON and JSONB?',
        answer: 'JSON stores an exact copy of the input text (including whitespace and duplicate keys), requiring reparsing on every execution. JSONB stores data in a decomposed binary format; insertion is slightly slower due to conversion, but processing and querying are significantly faster. JSONB also supports indexing.'
      },
      {
        question: 'How do you query a specific key inside a JSONB column?',
        answer: 'You use the JSON operators. For example, `column_name->\'key\'` returns the value as a JSON object, while `column_name->>\'key\'` returns the value extracted as a standard text string.'
      },
      {
        question: 'Why might you use a UUID as a primary key instead of a BIGSERIAL?',
        answer: 'UUIDs are highly beneficial in distributed systems and microservices because they can be generated independently across multiple servers without risking collisions. This removes the central database as a bottleneck for ID generation and makes merging databases easier.'
      }
    ],
    practicalTask: {
      scenario: 'You have a table of events with a JSONB column named `payload`. You need to extract the "status" value from the payload and cast it to an integer.',
      task: 'Write a SELECT query that extracts the "status" text from the `payload` JSONB column and casts it to an integer using the :: shorthand.',
      solutionCode: "SELECT (payload->>'status')::integer AS event_status \nFROM events;"
    }
  },
  {
    slug: 'postgres-filtering-sorting',
    title: 'Chapter 5: Filtering and Sorting Data',
    order: 5,
    content: `<h2>5. Filtering and Sorting Data</h2>
<p>Retrieving massive amounts of data is rarely useful; databases excel at returning exactly the subset of data you need in the order you need it. This is handled by the <code>WHERE</code>, <code>ORDER BY</code>, <code>LIMIT</code>, and <code>OFFSET</code> clauses.</p>
<h3>The WHERE Clause: Logic and Operators</h3>
<p>The WHERE clause uses boolean logic to filter rows. PostgreSQL supports a wide array of operators.</p>
<ul>
  <li><strong>Comparison:</strong> <code>=, <, >, <=, >=, <></code> or <code>!=</code></li>
  <li><strong>Logical:</strong> <code>AND, OR, NOT</code></li>
  <li><strong>Range:</strong> <code>BETWEEN x AND y</code></li>
  <li><strong>List Inclusion:</strong> <code>IN (val1, val2, ...)</code></li>
</ul>
<pre><code class="language-sql">
SELECT * FROM orders 
WHERE status = 'SHIPPED' 
  AND total_amount >= 1000 
  AND created_at BETWEEN '2023-01-01' AND '2023-12-31';

SELECT * FROM users
WHERE role IN ('admin', 'moderator');
</code></pre>
<h3>Pattern Matching (LIKE, ILIKE, and Regex)</h3>
<p>Filtering based on text patterns is crucial. PostgreSQL offers several methods:</p>
<ul>
  <li><strong>LIKE:</strong> Case-sensitive pattern matching using <code>%</code> (any number of characters) and <code>_</code> (single character).</li>
  <li><strong>ILIKE:</strong> A PostgreSQL-specific extension for case-insensitive pattern matching.</li>
  <li><strong>~ (Tilde):</strong> POSIX Regular Expressions.</li>
</ul>
<pre><code class="language-sql">
-- Finds users whose email ends with @gmail.com
SELECT * FROM users WHERE email LIKE '%@gmail.com';

-- Finds names containing 'smith' regardless of case
SELECT * FROM users WHERE last_name ILIKE '%smith%';

-- Regex: Name starts with A-D
SELECT * FROM users WHERE first_name ~ '^[A-D]';
</code></pre>
<h3>Sorting with ORDER BY</h3>
<p>Relational databases do not guarantee any default sorting order; data is returned in the order it happens to be read from disk. To ensure order, you must use <code>ORDER BY</code>.</p>
<pre><code class="language-sql">
-- Sort ascending (default)
SELECT name, age FROM users ORDER BY age ASC;

-- Sort descending
SELECT title, published_at FROM articles ORDER BY published_at DESC;

-- Multi-column sort
SELECT department, salary 
FROM employees 
ORDER BY department ASC, salary DESC;
</code></pre>
<h3>NULL Handling in Sorting</h3>
<p>By default, PostgreSQL considers NULL values as the "largest" value, placing them at the end of ASC sorts and the beginning of DESC sorts. You can control this with <code>NULLS FIRST</code> or <code>NULLS LAST</code>.</p>
<pre><code class="language-sql">
SELECT name, bonus FROM employees ORDER BY bonus DESC NULLS LAST;
</code></pre>
<h3>Pagination with LIMIT and OFFSET</h3>
<p>To restrict the number of rows returned, use <code>LIMIT</code>. To skip a certain number of rows, use <code>OFFSET</code>.</p>
<pre><code class="language-sql">
-- Get the top 10 most expensive products
SELECT name, price FROM products ORDER BY price DESC LIMIT 10;

-- Pagination: Get page 3 (assuming 20 items per page)
-- Skips the first 40 items, takes the next 20.
SELECT * FROM products ORDER BY id ASC LIMIT 20 OFFSET 40;
</code></pre>
<p><strong>Warning on OFFSET:</strong> High OFFSET values are inefficient because the database still has to compute and skip all the preceding rows. For large datasets, "keyset pagination" (using a WHERE clause on an indexed column like id > last_seen_id) is vastly superior.</p>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between LIKE and ILIKE?',
        answer: 'LIKE performs case-sensitive pattern matching based on standard SQL. ILIKE is a PostgreSQL-specific extension that performs case-insensitive pattern matching.'
      },
      {
        question: 'Why is it dangerous to rely on the default order of rows returned by a SELECT statement?',
        answer: 'Relational databases do not guarantee any implicit ordering. The order of returned rows depends on how the data resides physically on disk and the execution plan (e.g., seq scan vs index scan). Without an explicit ORDER BY, the order can change unpredictably.'
      },
      {
        question: 'How do you ensure that NULL values appear at the bottom of a result set when sorting descending?',
        answer: 'By default, PostgreSQL places NULLs at the top of a DESC sort. To change this, you append the `NULLS LAST` modifier to your ORDER BY clause: `ORDER BY column_name DESC NULLS LAST`.'
      },
      {
        question: 'Explain the performance problem with deep pagination using LIMIT and OFFSET.',
        answer: 'When you use a large OFFSET (e.g., OFFSET 100000), PostgreSQL must internally process, sort, and then discard the first 100,000 rows before returning the next batch. This results in heavy CPU and I/O load. Keyset pagination is a more scalable alternative.'
      },
      {
        question: 'What does the BETWEEN operator do and is it inclusive or exclusive?',
        answer: 'The BETWEEN operator filters data within a specified range. It is inclusive, meaning `WHERE age BETWEEN 20 AND 30` will match rows where age is exactly 20 or exactly 30, as well as everything in between.'
      }
    ],
    practicalTask: {
      scenario: 'You need to display a leaderboard of players, showing only the 2nd page of results (players ranked 11-20), sorted by score highest to lowest.',
      task: 'Write a query selecting player name and score, ordered by score descending, skipping the top 10 and limiting to 10 results.',
      solutionCode: "SELECT player_name, score\nFROM leaderboard\nORDER BY score DESC\nLIMIT 10 OFFSET 10;"
    }
  }
];

appendTopics('postgres', 'PostgreSQL Database Engineering', 'The definitive guide.', topics);
