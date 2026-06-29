import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'postgres-indexes',
    title: 'Chapter 11: Introduction to Indexes',
    order: 11,
    content: `<h2>11. Speeding up Queries: Indexes</h2>
<p>Without indexes, PostgreSQL must perform a "Sequential Scan," reading every single row in a table to find a match. An index is a separate data structure that allows the database to locate rows in logarithmic time instead of linear time.</p>
<h3>1. B-Tree (Balanced Tree) Indexes</h3>
<p>The default and most common index type. It handles equality (<code>=</code>) and range queries (<code><, <=, >, >=, BETWEEN</code>). Whenever you create a <code>PRIMARY KEY</code> or <code>UNIQUE</code> constraint, Postgres automatically creates a B-Tree index.</p>
<pre><code class="language-sql">
CREATE INDEX idx_users_email ON users(email);
</code></pre>
<h3>2. Hash Indexes</h3>
<p>Used strictly for equality (<code>=</code>) comparisons. They can be slightly faster and smaller than B-Trees for simple equality, but since Postgres 10, B-Trees are heavily optimized and usually preferred.</p>
<h3>3. GIN (Generalized Inverted Index)</h3>
<p>Crucial for composite data types like arrays and JSONB, or full-text search. A GIN index maps elements (like a key inside a JSON object) back to the rows that contain them.</p>
<pre><code class="language-sql">
CREATE INDEX idx_products_tags ON products USING GIN (tags);
-- For JSONB:
CREATE INDEX idx_events_payload ON events USING GIN (payload);
</code></pre>
<h3>4. GiST (Generalized Search Tree)</h3>
<p>Used for geometric types (PostGIS spatial queries) and network address types, enabling operations like "is this point inside this polygon?".</p>

<h3>Advanced Indexing Strategies</h3>
<h4>Composite (Multi-column) Indexes</h4>
<p>Indexes can cover multiple columns. Order matters immensely. An index on <code>(last_name, first_name)</code> will help queries filtering by <code>last_name</code>, or both, but it will NOT help queries filtering ONLY by <code>first_name</code>.</p>
<pre><code class="language-sql">
CREATE INDEX idx_users_name ON users(last_name, first_name);
</code></pre>
<h4>Partial Indexes</h4>
<p>You can index a subset of a table. This saves massive amounts of disk space and memory. For example, indexing only "unprocessed" orders.</p>
<pre><code class="language-sql">
CREATE INDEX idx_orders_unprocessed ON orders(id) WHERE status = 'PENDING';
</code></pre>
<h4>Expression Indexes</h4>
<p>You can index the result of a function or calculation.</p>
<pre><code class="language-sql">
-- Indexing for case-insensitive searches
CREATE INDEX idx_users_email_lower ON users(LOWER(email));
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What is a Sequential Scan and why is it usually bad for large tables?',
        answer: 'A Sequential Scan means the database engine reads every single page and row of a table from disk into memory to check if it matches the WHERE clause. For millions of rows, this results in massive I/O bottlenecks and extremely slow queries.'
      },
      {
        question: 'What index type is used by default when you run CREATE INDEX?',
        answer: 'A B-Tree (Balanced Tree) index is created by default. It is highly versatile and supports both equality and range queries.'
      },
      {
        question: 'When would you use a GIN index?',
        answer: 'A GIN (Generalized Inverted Index) is used when indexing columns containing multiple values, such as Arrays, JSONB documents, or tsvector columns for full-text search. It maps the individual elements back to the row.'
      },
      {
        question: 'What is a Partial Index and what is its primary benefit?',
        answer: 'A Partial Index is an index built on a subset of a table, defined by a WHERE clause (e.g., indexing only active users). Its primary benefit is dramatically reducing the size of the index on disk and in memory, making it much faster to update and query.'
      },
      {
        question: 'In a composite index on (A, B, C), will the index be used for a query that only filters by column B?',
        answer: 'Generally, no. B-Tree composite indexes evaluate from left to right. To use the index efficiently, the query must provide the leftmost columns (e.g., A, or A and B). Filtering only by B prevents the database from traversing the tree efficiently.'
      }
    ],
    practicalTask: {
      scenario: 'Queries searching for users by case-insensitive email (using ILIKE or LOWER()) are performing full table scans.',
      task: 'Create an expression index on the `users` table to speed up searches matching `LOWER(email)`.',
      solutionCode: "CREATE INDEX idx_users_lower_email ON users(LOWER(email));"
    }
  },
  {
    slug: 'postgres-transactions-concurrency',
    title: 'Chapter 12: Transactions and Concurrency',
    order: 12,
    content: `<h2>12. ACID Transactions and Isolation</h2>
<p>Transactions ensure that a series of database operations either all succeed entirely, or fail entirely without leaving the database in a half-written state. This is the 'A' in ACID: Atomicity.</p>
<h3>Basic Transaction Control</h3>
<pre><code class="language-sql">
BEGIN; -- Starts the transaction
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT; -- Applies the changes permanently
-- Or use ROLLBACK; to abort the changes
</code></pre>
<h3>Concurrency Anomalies</h3>
<p>When hundreds of transactions run concurrently, issues can arise:</p>
<ul>
  <li><strong>Dirty Read:</strong> Reading uncommitted changes from another transaction. (PostgreSQL NEVER allows this).</li>
  <li><strong>Non-Repeatable Read:</strong> Reading a row twice in a transaction and getting different data because another transaction committed an UPDATE in the meantime.</li>
  <li><strong>Phantom Read:</strong> Executing a query twice and getting different numbers of rows because another transaction committed an INSERT/DELETE.</li>
</ul>
<h3>Isolation Levels</h3>
<p>PostgreSQL supports different isolation levels to prevent these anomalies, balancing strictness with performance.</p>
<ol>
  <li><strong>Read Committed (Default):</strong> Guarantees no dirty reads. A query sees only data committed before the query began. However, non-repeatable reads can occur between different queries in the same transaction.</li>
  <li><strong>Repeatable Read:</strong> All queries in the transaction see a snapshot of the database as of the start of the transaction. Prevents non-repeatable reads. If two transactions try to update the same row, the second one will throw a serialization error.</li>
  <li><strong>Serializable:</strong> The strictest level. It guarantees that the result of concurrent transactions is exactly the same as if they were executed sequentially, one after the other.</li>
</ol>
<pre><code class="language-sql">
BEGIN ISOLATION LEVEL REPEATABLE READ;
</code></pre>
<h3>Explicit Locking</h3>
<p>Sometimes you need to manually lock rows to prevent race conditions (e.g., a ticket booking system).</p>
<pre><code class="language-sql">
-- FOR UPDATE locks the selected rows. Other transactions trying to UPDATE 
-- or SELECT ... FOR UPDATE on these rows will wait until this transaction completes.
SELECT * FROM seats WHERE id = 42 FOR UPDATE;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What does ACID stand for?',
        answer: 'Atomicity (all or nothing), Consistency (valid data state), Isolation (concurrent transactions do not interfere), and Durability (committed data is saved safely to disk).'
      },
      {
        question: 'What is the default isolation level in PostgreSQL and what anomaly does it permit?',
        answer: 'The default isolation level is Read Committed. It permits Non-Repeatable Reads (and Phantom Reads), meaning if you run the exact same SELECT query twice within the same transaction, you might get different results if another transaction committed changes in between.'
      },
      {
        question: 'What happens when a serialization error occurs in Repeatable Read or Serializable isolation levels?',
        answer: 'The database aborts the transaction and throws an error indicating that concurrent updates failed. The application layer must be programmed to catch this specific error and retry the entire transaction block from the beginning.'
      },
      {
        question: 'What does SELECT ... FOR UPDATE do?',
        answer: 'It places a row-level exclusive lock on the rows returned by the query. Any other transaction attempting to update those rows, or also select them FOR UPDATE, will be blocked and forced to wait until the first transaction commits or rolls back.'
      },
      {
        question: 'Can you have a Dirty Read in PostgreSQL?',
        answer: 'No. Even if you explicitly ask for the Read Uncommitted isolation level, PostgreSQL treats it exactly like Read Committed. Its MVCC architecture fundamentally prevents dirty reads.'
      }
    ],
    practicalTask: {
      scenario: 'You are writing the logic for a bank transfer. You need to ensure the balance check and the deduction happen safely.',
      task: 'Write a transaction block that locks the sender account row using FOR UPDATE, preventing race conditions.',
      solutionCode: "BEGIN;\nSELECT balance FROM accounts WHERE id = 1 FOR UPDATE;\n-- application logic checks if balance is sufficient\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;"
    }
  },
  {
    slug: 'postgres-window-functions',
    title: 'Chapter 13: Window Functions',
    order: 13,
    content: `<h2>13. Advanced Analytics: Window Functions</h2>
<p>Window functions are game-changers for analytical queries. Unlike <code>GROUP BY</code>, which collapses multiple rows into a single row, a window function calculates an aggregate value <strong>but leaves the underlying rows intact</strong>. It looks at a "window" of rows related to the current row.</p>
<h3>The OVER() Clause</h3>
<p>The <code>OVER()</code> clause is what defines a window function. If empty, the window is the entire result set.</p>
<pre><code class="language-sql">
-- Gives every employee row a column containing the average salary of the whole company
SELECT name, salary, AVG(salary) OVER() as company_avg
FROM employees;
</code></pre>
<h3>PARTITION BY</h3>
<p>Similar to <code>GROUP BY</code>, but it divides the window into smaller partitions. The calculation resets for each partition.</p>
<pre><code class="language-sql">
-- Compare an employee's salary to the average of THEIR specific department
SELECT name, department, salary, 
       AVG(salary) OVER(PARTITION BY department) as dept_avg
FROM employees;
</code></pre>
<h3>ORDER BY within OVER()</h3>
<p>This is where window functions shine for running totals or rankings.</p>
<pre><code class="language-sql">
-- Running total of sales per month
SELECT month, sales,
       SUM(sales) OVER(ORDER BY month ASC) as running_total
FROM monthly_reports;
</code></pre>
<h3>Ranking Functions</h3>
<p>Useful for leaderboards or finding "the top N per category".</p>
<ul>
  <li><code>ROW_NUMBER()</code>: Assigns a unique sequential integer starting at 1. Ties get different numbers arbitrarily.</li>
  <li><code>RANK()</code>: Assigns the same rank to ties, but skips the next numbers (e.g., 1, 2, 2, 4).</li>
  <li><code>DENSE_RANK()</code>: Assigns the same rank to ties, but does NOT skip numbers (e.g., 1, 2, 2, 3).</li>
</ul>
<pre><code class="language-sql">
-- Rank employees by salary within their department
SELECT name, department, salary,
       RANK() OVER(PARTITION BY department ORDER BY salary DESC) as rank
FROM employees;
</code></pre>
<h3>LAG() and LEAD()</h3>
<p>Allows you to access data from the previous (LAG) or next (LEAD) row without doing a self-join. Incredible for calculating day-over-day differences.</p>
<pre><code class="language-sql">
SELECT date, revenue,
       LAG(revenue) OVER(ORDER BY date ASC) as previous_day_revenue,
       revenue - LAG(revenue) OVER(ORDER BY date ASC) as difference
FROM daily_sales;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What is the primary difference between a GROUP BY aggregate and a Window Function?',
        answer: 'GROUP BY collapses the rows it operates on into a single summary row. A Window Function performs a calculation across a set of table rows related to the current row, but it preserves the original rows in the output, adding the calculated value as an extra column.'
      },
      {
        question: 'What does the PARTITION BY clause do within an OVER() clause?',
        answer: 'PARTITION BY divides the result set into distinct partitions or groups. The window function is then calculated separately for each partition, restarting the calculation (like a rank or running total) when the partition changes.'
      },
      {
        question: 'Explain the difference between RANK() and DENSE_RANK().',
        answer: 'Both handle ties by assigning the same rank value. However, RANK() leaves gaps in the sequence following a tie (e.g., 1, 2, 2, 4), whereas DENSE_RANK() does not leave gaps (e.g., 1, 2, 2, 3).'
      },
      {
        question: 'How would you calculate a running total using a window function?',
        answer: 'You use the SUM() aggregate function paired with an OVER() clause containing an ORDER BY. For example: SUM(amount) OVER (ORDER BY date_column ASC).'
      },
      {
        question: 'What do the LAG() and LEAD() functions do?',
        answer: 'They allow a query to access data from a previous row (LAG) or a subsequent row (LEAD) within the same result set, without requiring complex self-joins. This is heavily used for calculating period-over-period differences.'
      }
    ],
    practicalTask: {
      scenario: 'You need to find the highest-paid employee in each department.',
      task: 'Use a CTE and ROW_NUMBER() partitioned by department and ordered by salary DESC, then select only rows where the row number is 1.',
      solutionCode: "WITH RankedEmployees AS (\n  SELECT name, department, salary,\n         ROW_NUMBER() OVER(PARTITION BY department ORDER BY salary DESC) as rn\n  FROM employees\n)\nSELECT name, department, salary \nFROM RankedEmployees \nWHERE rn = 1;"
    }
  },
  {
    slug: 'postgres-triggers-procedures',
    title: 'Chapter 14: Triggers and Stored Procedures',
    order: 14,
    content: `<h2>14. Server-Side Logic: PL/pgSQL</h2>
<p>Moving logic to the database layer can vastly reduce network latency and ensure absolute data consistency regardless of which application connects to the database.</p>
<h3>Stored Procedures and Functions</h3>
<p>Functions return a value. Procedures (introduced in PG 11) do not return a value but have the superpower of being able to commit or rollback transactions inside themselves.</p>
<pre><code class="language-sql">
-- Creating a Function
CREATE OR REPLACE FUNCTION get_user_full_name(u_id INT)
RETURNS TEXT AS $$
DECLARE
    full_name TEXT;
BEGIN
    SELECT first_name || ' ' || last_name INTO full_name
    FROM users WHERE id = u_id;
    
    RETURN full_name;
END;
$$ LANGUAGE plpgsql;

-- Executing
SELECT get_user_full_name(42);
</code></pre>
<h3>Triggers</h3>
<p>A Trigger is a function that executes automatically when a specific database event occurs (INSERT, UPDATE, DELETE, TRUNCATE) on a specific table.</p>
<p>Triggers can fire <code>BEFORE</code> the operation (useful for validating or modifying data before it hits the disk) or <code>AFTER</code> the operation (useful for auditing or logging).</p>
<h4>Building an Audit Trigger</h4>
<pre><code class="language-sql">
-- 1. Create the Trigger Function
CREATE OR REPLACE FUNCTION log_salary_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Only log if the salary actually changed
    IF NEW.salary <> OLD.salary THEN
        INSERT INTO salary_audit (employee_id, old_salary, new_salary, changed_at)
        VALUES (NEW.id, OLD.salary, NEW.salary, NOW());
    END IF;
    
    -- For BEFORE/AFTER row triggers, you must return the NEW record
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach the Trigger to the Table
CREATE TRIGGER trigger_log_salary
AFTER UPDATE ON employees
FOR EACH ROW
EXECUTE FUNCTION log_salary_change();
</code></pre>
<p><strong>Note on NEW and OLD:</strong> In trigger functions, <code>NEW</code> represents the row data being inserted or the new state of an updated row. <code>OLD</code> represents the data before an update or delete.</p>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between a Function and a Stored Procedure in modern PostgreSQL?',
        answer: 'A Function is designed to return a value (or set of values) and cannot manage transactions (no COMMIT/ROLLBACK inside it). A Stored Procedure (added in PG 11) is invoked using CALL, does not return a value, and can initiate, commit, or rollback transactions internally.'
      },
      {
        question: 'What is a Trigger?',
        answer: 'A Trigger is a special type of function that is automatically invoked by the database engine whenever a specified DML event (INSERT, UPDATE, DELETE) occurs on a specific table.'
      },
      {
        question: 'Explain the difference between a BEFORE trigger and an AFTER trigger.',
        answer: 'A BEFORE trigger fires before the database operation is applied to the row, allowing you to modify the NEW row data (e.g., updating an updated_at timestamp) or abort the transaction. An AFTER trigger fires after the change is written, making it ideal for auditing logs or updating summary tables.'
      },
      {
        question: 'What do the NEW and OLD variables represent in a trigger function?',
        answer: 'NEW is a record containing the new data for an INSERT or UPDATE operation. OLD is a record containing the data as it existed before an UPDATE or DELETE operation.'
      },
      {
        question: 'What happens if a BEFORE trigger returns NULL?',
        answer: 'If a BEFORE trigger returns NULL for a row-level operation, the operation for that specific row is silently skipped and will not be inserted or updated in the database.'
      }
    ],
    practicalTask: {
      scenario: 'You want to automatically maintain an `updated_at` timestamp on a users table.',
      task: 'Write a trigger function that sets `NEW.updated_at = NOW()` and attach it as a BEFORE UPDATE trigger on the `users` table.',
      solutionCode: "CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$$ LANGUAGE plpgsql;\n\nCREATE TRIGGER trigger_users_updated_at\nBEFORE UPDATE ON users\nFOR EACH ROW EXECUTE FUNCTION set_updated_at();"
    }
  },
  {
    slug: 'postgres-explain-analyze',
    title: 'Chapter 15: Query Performance and EXPLAIN',
    order: 15,
    content: `<h2>15. Performance Tuning: EXPLAIN ANALYZE</h2>
<p>When a query is slow, guessing is dangerous. PostgreSQL provides the <code>EXPLAIN</code> command, which reveals the Query Planner's execution strategy. <code>EXPLAIN ANALYZE</code> goes a step further by actually executing the query and returning the real-world timings.</p>
<h3>Reading the Output</h3>
<pre><code class="language-sql">
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
</code></pre>
<p>The output is a tree of nodes, read from the inside out (bottom up).</p>
<pre><code class="language-plaintext">
Index Scan using idx_users_email on users  (cost=0.29..8.31 rows=1 width=128) (actual time=0.015..0.016 rows=1 loops=1)
  Index Cond: ((email)::text = 'test@example.com'::text)
Planning Time: 0.123 ms
Execution Time: 0.035 ms
</code></pre>
<h3>Key Node Types to Watch For</h3>
<ul>
  <li><strong>Seq Scan (Sequential Scan):</strong> Reading the entire table. Fine for tables with 100 rows. A disaster for tables with 10,000,000 rows. You need an index.</li>
  <li><strong>Index Scan:</strong> Reads the index to find row pointers, then reads the actual table data to fetch the row. Excellent performance.</li>
  <li><strong>Index Only Scan:</strong> The Holy Grail. The query is fulfilled entirely by data present in the index itself. It doesn't even need to touch the main table data.</li>
  <li><strong>Bitmap Heap Scan / Bitmap Index Scan:</strong> Used when a query returns many rows. It reads the index, builds an in-memory bitmap of which data pages need to be fetched, and then fetches them in physical disk order to minimize disk thrashing.</li>
</ul>
<h3>Costs vs. Actual Time</h3>
<p>The output gives you estimates vs reality:</p>
<ul>
  <li><code>cost=startup_cost..total_cost</code>: This is an arbitrary unit used by the planner. It estimates how "expensive" the query is.</li>
  <li><code>actual time=startup..total</code>: (Only present with ANALYZE). The actual milliseconds spent.</li>
  <li><code>rows</code>: The planner's estimate of how many rows will be returned vs the <code>actual rows</code>. If these two numbers are wildly different (e.g., estimates 10, actual 100000), your statistics are out of date, and the planner is making bad decisions. You need to run <code>VACUUM ANALYZE</code>.</li>
</ul>
<h3>Using pg_stat_statements</h3>
<p>For production servers, the extension <code>pg_stat_statements</code> is mandatory. It logs the execution time and frequency of every query run against the server, allowing you to easily identify your top 10 slowest or most frequent queries consuming CPU.</p>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between EXPLAIN and EXPLAIN ANALYZE?',
        answer: 'EXPLAIN only shows the query plan generated by the optimizer along with estimated costs. It does not run the query. EXPLAIN ANALYZE actually executes the query (meaning UPDATEs/DELETEs will happen) and outputs the real execution times and exact row counts alongside the plan.'
      },
      {
        question: 'What does a "Seq Scan" mean in an EXPLAIN plan, and is it always bad?',
        answer: 'A Sequential Scan means the database is reading the entire table from disk. It is bad for large tables because it is O(N). However, for very small tables (e.g., a status lookup table with 5 rows), a Seq Scan is actually faster than an Index Scan because it avoids the overhead of reading the index data structure first.'
      },
      {
        question: 'What is an "Index Only Scan"?',
        answer: 'An Index Only Scan occurs when the database can satisfy the entire query (both the WHERE filtering and the SELECT column retrieval) solely from the data stored within the index, avoiding the need to read the actual table heap entirely.'
      },
      {
        question: 'In EXPLAIN output, what does it mean if the planners estimated rows are drastically different from the actual rows?',
        answer: 'It means the database statistics for that table are outdated. The planner uses these statistics to decide whether to use an index or a seq scan. If they are wrong, it makes bad plans. Running VACUUM ANALYZE on the table will update the statistics.'
      },
      {
        question: 'What is the purpose of the pg_stat_statements extension?',
        answer: 'It is a crucial monitoring extension that records performance metrics (execution time, calls, I/O usage) for all SQL statements executed on the server. It allows engineers to identify systemic performance bottlenecks over time.'
      }
    ],
    practicalTask: {
      scenario: 'You are analyzing an EXPLAIN ANALYZE output that contains an UPDATE operation, but you do not want the UPDATE to actually commit to the database.',
      task: 'How do you run EXPLAIN ANALYZE safely on an UPDATE query?',
      solutionCode: "BEGIN;\nEXPLAIN ANALYZE UPDATE accounts SET balance = balance - 10 WHERE id = 1;\nROLLBACK;"
    }
  }
];

appendTopics('postgres', 'PostgreSQL Database Engineering', 'The definitive guide.', topics);
