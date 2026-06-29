import { appendTopics } from './seeder-utils.js';

const topics = [
  {
    slug: 'postgres-constraints-relationships',
    title: 'Chapter 6: Table Relationships and Constraints',
    order: 6,
    content: `<h2>6. Table Relationships and Constraints</h2>
<p>Relational databases derive their power from the "relations" between tables and the rules governing the data within them. PostgreSQL enforces these rules strictly using Constraints.</p>
<h3>Types of Constraints</h3>
<ul>
  <li><strong>PRIMARY KEY:</strong> Uniquely identifies each row in a table. It is effectively a combination of <code>NOT NULL</code> and <code>UNIQUE</code>, but a table can only have one primary key. Under the hood, PostgreSQL automatically creates a unique B-Tree index for it.</li>
  <li><strong>FOREIGN KEY:</strong> Ensures referential integrity. It dictates that the value in a column must match a primary key (or unique key) in another table.</li>
  <li><strong>UNIQUE:</strong> Ensures all values in a column are distinct.</li>
  <li><strong>NOT NULL:</strong> Prevents null values from being inserted into a column.</li>
  <li><strong>CHECK:</strong> Validates that the value being inserted meets a specific boolean condition.</li>
</ul>
<h3>Creating Tables with Relationships</h3>
<p>Let's define a classic One-to-Many relationship between Authors and Books.</p>
<pre><code class="language-sql">
CREATE TABLE authors (
    author_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INT CHECK (age >= 18)
);

CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    published_date DATE,
    author_id INT,
    -- Define the Foreign Key
    CONSTRAINT fk_author 
      FOREIGN KEY (author_id) 
      REFERENCES authors(author_id) 
      ON DELETE CASCADE
);
</code></pre>
<h3>Foreign Key Actions</h3>
<p>When defining a Foreign Key, you must decide what happens when the referenced row is deleted or updated. The <code>ON DELETE</code> clause handles this:</p>
<ul>
  <li><code>NO ACTION / RESTRICT</code>: (Default) Throws an error and prevents the deletion of the parent row if child rows exist.</li>
  <li><code>CASCADE</code>: Automatically deletes all child rows referencing the deleted parent row.</li>
  <li><code>SET NULL</code>: Sets the foreign key column in the child rows to NULL.</li>
</ul>
<h3>Many-to-Many Relationships</h3>
<p>Relational databases cannot natively represent many-to-many relationships directly between two tables. This requires a <strong>junction table</strong> (or join table).</p>
<pre><code class="language-sql">
-- Example: Students and Courses
CREATE TABLE students (student_id SERIAL PRIMARY KEY, name VARCHAR(100));
CREATE TABLE courses (course_id SERIAL PRIMARY KEY, course_name VARCHAR(100));

-- Junction Table
CREATE TABLE student_courses (
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id) -- Composite Primary Key
);
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between a PRIMARY KEY and a UNIQUE constraint?',
        answer: 'Both enforce uniqueness, but a table can only have one PRIMARY KEY, which also strictly enforces NOT NULL. A table can have multiple UNIQUE constraints, and standard UNIQUE constraints allow NULL values.'
      },
      {
        question: 'What does ON DELETE CASCADE do?',
        answer: 'When placed on a foreign key constraint, ON DELETE CASCADE automatically deletes any child records in the dependent table when the referenced parent record is deleted, ensuring no orphaned records are left behind.'
      },
      {
        question: 'What is a composite primary key?',
        answer: 'A composite primary key is a primary key that consists of two or more columns acting together to uniquely identify a row. It is commonly used in junction tables for many-to-many relationships.'
      },
      {
        question: 'What is a CHECK constraint?',
        answer: 'A CHECK constraint allows you to define a boolean expression that data must satisfy before being inserted or updated. For example, ensuring an age column is greater than zero or a status column only contains specific string values.'
      },
      {
        question: 'How do you resolve a many-to-many relationship in PostgreSQL?',
        answer: 'A many-to-many relationship is resolved by creating a third table, known as a junction table or join table. This table contains foreign keys referencing the primary keys of the two tables being linked, typically forming a composite primary key.'
      }
    ],
    practicalTask: {
      scenario: 'You are adding an inventory system and want to ensure stock levels never drop below zero at the database level.',
      task: 'Create a table `products` with an integer `stock_level` column and a constraint to prevent negative stock.',
      solutionCode: "CREATE TABLE products (\n    id SERIAL PRIMARY KEY,\n    name VARCHAR(255) NOT NULL,\n    stock_level INT NOT NULL CHECK (stock_level >= 0)\n);"
    }
  },
  {
    slug: 'postgres-joins',
    title: 'Chapter 7: Joins in PostgreSQL',
    order: 7,
    content: `<h2>7. Connecting Data: Joins</h2>
<p>Normalization splits data across multiple tables to reduce redundancy. <strong>Joins</strong> are the mechanism to stitch that data back together for querying. Understanding how joins work logically and performance-wise is a defining skill for backend engineers.</p>
<h3>1. INNER JOIN</h3>
<p>The most common join. It returns only the rows where there is a match in <strong>both</strong> tables based on the join condition.</p>
<pre><code class="language-sql">
SELECT users.name, orders.total
FROM users
INNER JOIN orders ON users.id = orders.user_id;
</code></pre>
<p><em>Result: Users who have made an order. Users with no orders are excluded. Orders without a valid user_id (if allowed) are excluded.</em></p>

<h3>2. LEFT JOIN (Left Outer Join)</h3>
<p>Returns <strong>all</strong> rows from the "left" table (the one written first), and the matched rows from the "right" table. If there is no match, the right side will contain NULLs.</p>
<pre><code class="language-sql">
SELECT users.name, orders.total
FROM users
LEFT JOIN orders ON users.id = orders.user_id;
</code></pre>
<p><em>Result: All users are returned. If a user has not made an order, the <code>orders.total</code> column will be NULL.</em></p>

<h3>3. RIGHT JOIN (Right Outer Join)</h3>
<p>The exact opposite of LEFT JOIN. Returns all rows from the right table, and matching rows from the left. Usually, queries are just rewritten as LEFT JOINs for readability.</p>

<h3>4. FULL JOIN (Full Outer Join)</h3>
<p>Combines LEFT and RIGHT joins. Returns all rows from both tables. Where matches exist, data is combined. Where they don't, NULLs are filled in on the missing side.</p>
<pre><code class="language-sql">
SELECT employees.name, departments.dept_name
FROM employees
FULL JOIN departments ON employees.dept_id = departments.id;
</code></pre>
<p><em>Result: All employees (even those without a department) and all departments (even those without employees).</em></p>

<h3>5. CROSS JOIN</h3>
<p>Returns the Cartesian Product of the two tables. Every row in table A is paired with every row in table B. If Table A has 10 rows and Table B has 10 rows, the result is 100 rows.</p>
<pre><code class="language-sql">
SELECT sizes.size, colors.color
FROM sizes
CROSS JOIN colors;
</code></pre>

<h3>6. SELF JOIN</h3>
<p>Joining a table to itself. Useful for hierarchical data (e.g., an employee table where one employee is the manager of another).</p>
<pre><code class="language-sql">
SELECT e1.name AS employee, e2.name AS manager
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'Explain the difference between INNER JOIN and LEFT JOIN.',
        answer: 'INNER JOIN returns only rows where a match exists in both joined tables. LEFT JOIN returns all rows from the left table regardless of whether a match exists; if no match is found in the right table, NULLs are returned for the right tables columns.'
      },
      {
        question: 'What is a Cartesian Product and which join produces it?',
        answer: 'A Cartesian Product occurs when every row in the first table is paired with every row in the second table. This is produced by a CROSS JOIN (or an implicit join without a WHERE clause).'
      },
      {
        question: 'How do you find records in Table A that have NO related records in Table B?',
        answer: 'You use a LEFT JOIN from Table A to Table B, and then add a WHERE clause checking if Table Bs primary key IS NULL (e.g., `WHERE table_b.id IS NULL`).'
      },
      {
        question: 'Can you join a table to itself?',
        answer: 'Yes, this is called a Self Join. You must use table aliases to distinguish the two instances of the table within the query.'
      },
      {
        question: 'What is a FULL OUTER JOIN used for?',
        answer: 'A FULL OUTER JOIN is used when you need to merge two sets of data entirely, retaining all records from both sides, even if they lack matching counterpart records in the other table.'
      }
    ],
    practicalTask: {
      scenario: 'You want to generate a report of all customers and any orders they have placed. Customers who have not ordered anything must still appear on the report.',
      task: 'Write a LEFT JOIN query linking `customers` and `orders` on `customer_id`.',
      solutionCode: "SELECT c.name, o.order_id, o.amount\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id;"
    }
  },
  {
    slug: 'postgres-aggregations',
    title: 'Chapter 8: Aggregations and Grouping',
    order: 8,
    content: `<h2>8. Aggregations and Grouping</h2>
<p>Aggregation functions perform a calculation on a set of rows and return a single row. When combined with the <code>GROUP BY</code> clause, they allow you to perform these calculations across distinct groups of data.</p>
<h3>Common Aggregate Functions</h3>
<ul>
  <li><code>COUNT(*)</code>: Counts the total number of rows.</li>
  <li><code>COUNT(column)</code>: Counts the non-NULL values in a column.</li>
  <li><code>SUM(column)</code>: Adds up numeric values.</li>
  <li><code>AVG(column)</code>: Calculates the arithmetic mean.</li>
  <li><code>MIN(column) / MAX(column)</code>: Finds the lowest or highest value.</li>
  <li><code>STRING_AGG(column, separator)</code>: Concatenates strings from multiple rows.</li>
</ul>
<h3>Using GROUP BY</h3>
<p>The <code>GROUP BY</code> clause divides the result set into groups based on the values in one or more columns. The aggregate functions are then applied to each group.</p>
<pre><code class="language-sql">
-- Calculate total sales per department
SELECT department, SUM(salary) as total_payroll, COUNT(*) as employee_count
FROM employees
GROUP BY department;

-- Grouping by multiple columns
SELECT department, job_title, AVG(salary)
FROM employees
GROUP BY department, job_title;
</code></pre>
<p><strong>Crucial Rule:</strong> If you use a <code>GROUP BY</code>, every column in your <code>SELECT</code> statement must either be an aggregate function or be included in the <code>GROUP BY</code> clause.</p>

<h3>Filtering Groups with HAVING</h3>
<p>You cannot use the <code>WHERE</code> clause to filter based on aggregated results, because <code>WHERE</code> filters rows <em>before</em> aggregation happens. To filter <em>after</em> aggregation, use the <code>HAVING</code> clause.</p>
<pre><code class="language-sql">
-- Find departments where the average salary is greater than 80,000
SELECT department, AVG(salary) as avg_salary
FROM employees
GROUP BY department
HAVING AVG(salary) > 80000;
</code></pre>

<h3>Execution Order</h3>
<p>Understanding the order of execution is critical for writing complex queries:</p>
<ol>
  <li><code>FROM / JOIN</code>: Define the base dataset.</li>
  <li><code>WHERE</code>: Filter individual rows.</li>
  <li><code>GROUP BY</code>: Form groups.</li>
  <li><code>HAVING</code>: Filter groups based on aggregates.</li>
  <li><code>SELECT</code>: Calculate final expressions.</li>
  <li><code>ORDER BY</code>: Sort the results.</li>
  <li><code>LIMIT / OFFSET</code>: Apply pagination.</li>
</ol>
`,
    interviewQuestions: [
      {
        question: 'What is the difference between COUNT(*) and COUNT(column_name)?',
        answer: 'COUNT(*) counts the total number of rows in the result set, regardless of NULL values. COUNT(column_name) counts only the rows where the specified column is NOT NULL.'
      },
      {
        question: 'What is the difference between the WHERE clause and the HAVING clause?',
        answer: 'The WHERE clause is applied to individual rows before any grouping or aggregation takes place. The HAVING clause is applied after grouping and aggregation, allowing you to filter groups based on aggregate values (e.g., HAVING SUM(amount) > 1000).'
      },
      {
        question: 'Why does PostgreSQL throw an error if you SELECT a column that is not in the GROUP BY clause and not wrapped in an aggregate function?',
        answer: 'When grouping data, multiple rows are collapsed into one row per group. If a selected column is not grouped, the database does not know which of the multiple possible values from the collapsed rows it should return, violating relational theory.'
      },
      {
        question: 'Can you use aliases defined in the SELECT clause within a HAVING clause?',
        answer: 'In standard SQL, no. However, PostgreSQL allows the use of SELECT aliases in the GROUP BY and ORDER BY clauses, but using them in the HAVING clause is not standard and usually requires repeating the aggregate expression.'
      },
      {
        question: 'What does STRING_AGG do?',
        answer: 'STRING_AGG is a PostgreSQL-specific aggregate function that concatenates the string values of a group into a single string, separated by a specified delimiter (e.g., comma-separated tags).'
      }
    ],
    practicalTask: {
      scenario: 'You need a report showing the number of users registered per country, but only for countries with more than 50 users.',
      task: 'Write a query that groups users by country, counts them, and filters out countries with 50 or fewer users.',
      solutionCode: "SELECT country, COUNT(id) as user_count\nFROM users\nGROUP BY country\nHAVING COUNT(id) > 50;"
    }
  },
  {
    slug: 'postgres-subqueries-ctes',
    title: 'Chapter 9: Subqueries and CTEs',
    order: 9,
    content: `<h2>9. Advanced Logic: Subqueries and CTEs</h2>
<p>As business logic becomes complex, a single flat query is often insufficient. Subqueries and Common Table Expressions (CTEs) allow you to break queries into logical steps.</p>
<h3>Subqueries</h3>
<p>A subquery is simply a query nested inside another query. They can be used in the <code>SELECT</code>, <code>FROM</code>, or <code>WHERE</code> clauses.</p>
<pre><code class="language-sql">
-- Subquery in the WHERE clause (Filtering based on dynamic calculation)
SELECT name, salary 
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees);

-- Subquery in the FROM clause (Derived Table)
-- Must be given an alias!
SELECT avg_salary_per_dept.dept, avg_salary_per_dept.avg_sal
FROM (
  SELECT department as dept, AVG(salary) as avg_sal 
  FROM employees 
  GROUP BY department
) AS avg_salary_per_dept
WHERE avg_sal > 70000;
</code></pre>
<h4>Correlated Subqueries</h4>
<p>A correlated subquery references columns from the outer query. This forces the subquery to execute <strong>once for every row</strong> in the outer query, which can be disastrous for performance if not heavily indexed.</p>
<pre><code class="language-sql">
-- Find employees who earn more than the average in their specific department
SELECT e.name, e.salary, e.department
FROM employees e
WHERE e.salary > (
    SELECT AVG(salary) 
    FROM employees sub 
    WHERE sub.department = e.department -- Correlation!
);
</code></pre>

<h3>Common Table Expressions (CTEs / WITH Clause)</h3>
<p>CTEs provide a way to write named subqueries that exist only for the duration of the main query. They are vastly superior to subqueries in terms of readability and maintainability.</p>
<pre><code class="language-sql">
WITH DepartmentAverages AS (
    SELECT department, AVG(salary) as avg_salary
    FROM employees
    GROUP BY department
),
HighEarningDepts AS (
    SELECT department
    FROM DepartmentAverages
    WHERE avg_salary > 80000
)
SELECT e.name, e.department, e.salary
FROM employees e
JOIN HighEarningDepts h ON e.department = h.department;
</code></pre>
<p>CTEs make your code read top-to-bottom logically, rather than inside-out like nested subqueries.</p>
`,
    interviewQuestions: [
      {
        question: 'What is a Common Table Expression (CTE)?',
        answer: 'A CTE, defined using the WITH keyword, is a temporary, named result set that exists only during the execution of a single query. It is primarily used to improve the readability and structure of complex queries by breaking them into logical blocks.'
      },
      {
        question: 'What is the difference between a standard subquery and a correlated subquery?',
        answer: 'A standard subquery executes independently of the outer query, usually running only once. A correlated subquery references columns from the outer query, forcing it to re-evaluate for every single row processed by the outer query, which can cause significant performance degradation.'
      },
      {
        question: 'Can you use an UPDATE or DELETE statement inside a CTE?',
        answer: 'Yes, PostgreSQL supports Data-Modifying CTEs. You can run an UPDATE/DELETE/INSERT inside a CTE, use the RETURNING clause to capture the modified rows, and then SELECT from that CTE in the main query.'
      },
      {
        question: 'Why might you use a CTE instead of a subquery in the FROM clause?',
        answer: 'Primarily for readability. Deeply nested subqueries become very difficult to read ("inside-out" logic). CTEs allow you to define the logic sequentially ("top-to-bottom"). Additionally, a CTE can be referenced multiple times in the main query, whereas a subquery would have to be written out multiple times.'
      },
      {
        question: 'Does PostgreSQL materialize CTEs by default?',
        answer: 'Prior to Postgres 12, CTEs were an optimization fence and were always materialized (evaluated separately). Since Postgres 12, CTEs are "inlined" into the main query plan by default if they are referenced only once, allowing for better overall query optimization.'
      }
    ],
    practicalTask: {
      scenario: 'Find all users whose account balance is greater than the average balance of all users.',
      task: 'Write a query using a CTE to calculate the average balance, then join or filter the users table based on that CTE.',
      solutionCode: "WITH AvgBalance AS (\n  SELECT AVG(balance) AS avg_bal FROM users\n)\nSELECT u.username, u.balance\nFROM users u, AvgBalance a\nWHERE u.balance > a.avg_bal;"
    }
  },
  {
    slug: 'postgres-views',
    title: 'Chapter 10: Views and Materialized Views',
    order: 10,
    content: `<h2>10. Abstraction: Views and Materialized Views</h2>
<p>Views are essentially saved queries. They allow you to encapsulate complex logic behind a simple interface, presenting data as if it were a real table.</p>
<h3>Standard Views</h3>
<p>A standard view does not store data itself. When you query a view, PostgreSQL dynamically executes the underlying query. They are excellent for security (restricting column access) and simplifying complex joins for BI tools.</p>
<pre><code class="language-sql">
-- Creating a view to hide sensitive data (like passwords) and complex joins
CREATE VIEW user_public_profiles AS
SELECT u.id, u.username, p.bio, p.avatar_url
FROM users u
JOIN profiles p ON u.id = p.user_id
WHERE u.is_active = true;

-- Querying the view
SELECT * FROM user_public_profiles;
</code></pre>
<p><strong>Updatable Views:</strong> In PostgreSQL, simple views (usually single-table views without aggregations) can be directly INSERTed, UPDATEd, or DELETEd from, and the changes will propagate to the underlying table.</p>

<h3>Materialized Views</h3>
<p>Unlike standard views, Materialized Views <strong>actually store the result set on disk</strong>. If you have a massively complex reporting query that takes 5 minutes to run, a materialized view will run it once, store the data, and subsequent queries will be instant.</p>
<pre><code class="language-sql">
-- Creating a materialized view
CREATE MATERIALIZED VIEW monthly_sales_report AS
SELECT 
  DATE_TRUNC('month', order_date) as month,
  SUM(total_amount) as revenue
FROM orders
GROUP BY 1;

-- Creating an index on the materialized view for even faster access
CREATE UNIQUE INDEX idx_mv_sales_month ON monthly_sales_report(month);
</code></pre>
<h4>Refreshing Materialized Views</h4>
<p>Because the data is stored on disk, it becomes stale as the underlying tables change. You must manually (or via cron/pg_cron) refresh the view.</p>
<pre><code class="language-sql">
-- Blocks read access while rebuilding
REFRESH MATERIALIZED VIEW monthly_sales_report;

-- Refreshes concurrently without blocking reads! 
-- (Requires a UNIQUE index on the materialized view)
REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales_report;
</code></pre>
`,
    interviewQuestions: [
      {
        question: 'What is the main difference between a View and a Materialized View?',
        answer: 'A standard View is a saved query definition; it does not store data and re-executes the query every time it is called. A Materialized View executes the query and caches the result set physically on disk, offering much faster read performance at the cost of data staleness.'
      },
      {
        question: 'When would you use a Materialized View over a standard View?',
        answer: 'You use a Materialized View for heavy, slow, analytical or reporting queries where immediate real-time data is not strictly required, but fast read access is critical (e.g., daily dashboards). Standard views are for real-time data and logical abstraction.'
      },
      {
        question: 'How do you update the data in a Materialized View?',
        answer: 'You must execute the command REFRESH MATERIALIZED VIEW view_name;. This re-runs the underlying query and repopulates the view on disk.'
      },
      {
        question: 'What is the benefit of REFRESH MATERIALIZED VIEW CONCURRENTLY?',
        answer: 'A standard REFRESH locks the materialized view, preventing any SELECT queries from reading it until the refresh is complete. A CONCURRENTLY refresh allows reads to continue serving the old data while the new data is being generated in the background. It requires a unique index to work.'
      },
      {
        question: 'Are PostgreSQL views updatable?',
        answer: 'Yes, simple views are automatically updatable. If a view selects from a single table without using GROUP BY, DISTINCT, LIMIT, or aggregates, you can INSERT/UPDATE/DELETE directly against the view.'
      }
    ],
    practicalTask: {
      scenario: 'You want to optimize a slow dashboard that calculates total revenue per product category.',
      task: 'Create a materialized view named `category_revenue` that sums `price * quantity` from `order_items` grouped by `category_id`.',
      solutionCode: "CREATE MATERIALIZED VIEW category_revenue AS\nSELECT category_id, SUM(price * quantity) AS total_revenue\nFROM order_items\nGROUP BY category_id;"
    }
  }
];

appendTopics('postgres', 'PostgreSQL Database Engineering', 'The definitive guide.', topics);
