import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGODB_DB_NAME
    });
    console.log("Connected to MongoDB for Seeding React.");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const getDocsModel = () => {
  if (mongoose.models.Docs) {
    return mongoose.models.Docs;
  }
  const DocsSchema = new mongoose.Schema({
    technology: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    topics: [{
      slug: { type: String, required: true },
      title: { type: String, required: true },
      order: { type: Number, required: true },
      content: { type: String, required: true }
    }]
  });
  return mongoose.model("Docs", DocsSchema);
};

const reactDoc = {
  technology: "react",
  title: "React Architecture Handbook",
  description: "Enterprise React patterns, State Management, and Performance tuning.",
  topics: [
    {
      slug: "functional-components",
      title: "1. Functional Components",
      order: 1,
      content: `
        <h2>Functional Components & Props</h2>
        <p>Modern React architecture is entirely built on functional components. They act as pure functions receiving an object of arguments called props, ensuring predictable rendering and straightforward testing.</p>
        <pre><code class="language-tsx">
interface UserProfileProps {
  id: string;
  name: string;
  isActive?: boolean;
}

export const UserProfile = ({ id, name, isActive = false }: UserProfileProps) => {
  return (
    &lt;div className="profile-card"&gt;
      &lt;h3&gt;{name}&lt;/h3&gt;
      {isActive && &lt;span className="badge"&gt;Online&lt;/span&gt;}
    &lt;/div&gt;
  );
};
        </code></pre>
      `
    },
    {
      slug: "react-hooks",
      title: "2. The React Hooks API",
      order: 2,
      content: `
        <h2>The React Hooks API</h2>
        <p>Hooks allow functional components to hook into React state and lifecycle features.</p>
        <h3>useState & useEffect</h3>
        <p><code>useState</code> is for localized component state, while <code>useEffect</code> manages side-effects like fetching data or subscribing to events.</p>
        <pre><code class="language-tsx">
import { useState, useEffect } from 'react';

export const DataFetcher = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setData(data);
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; }; // Cleanup prevents memory leaks
  }, [url]);

  if (loading) return &lt;Spinner /&gt;;
  return &lt;DataDisplay data={data} /&gt;;
};
        </code></pre>
      `
    },
    {
      slug: "state-management",
      title: "3. State Management Patterns",
      order: 3,
      content: `
        <h2>State Management Patterns</h2>
        <p>Enterprise React apps require robust state management logic. Avoid prop-drilling by utilizing the Context API or robust global stores like Redux and Zustand.</p>
        <pre><code class="language-tsx">
// Zustand Store Example
import create from 'zustand';

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create&lt;AuthState&gt;((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));
        </code></pre>
      `
    },
    {
      slug: "performance-optimization",
      title: "4. Performance Optimization",
      order: 4,
      content: `
        <h2>Performance Optimization</h2>
        <p>Unnecessary re-renders are the root cause of React performance issues. Use <code>useMemo</code>, <code>useCallback</code>, and <code>React.memo</code> to cache values, functions, and components.</p>
        <pre><code class="language-tsx">
import { useMemo, useCallback } from 'react';

export const ExpensiveDashboard = ({ rawData, onProcessComplete }) => {
  // Only recalculate when rawData changes
  const processedData = useMemo(() => {
    return rawData.map(heavyProcessingFunction);
  }, [rawData]);

  // Maintain referential equality
  const handleExport = useCallback(() => {
    exportToCSV(processedData);
    onProcessComplete();
  }, [processedData, onProcessComplete]);

  return &lt;Chart data={processedData} onExport={handleExport} /&gt;;
};
        </code></pre>
      `
    }
  ]
};

const run = async () => {
  await connectDb();
  const Docs = getDocsModel();
  await Docs.findOneAndUpdate(
    { technology: reactDoc.technology },
    reactDoc,
    { upsert: true, new: true }
  );
  console.log("✅ React docs seeded successfully!");
  process.exit(0);
};

run();
