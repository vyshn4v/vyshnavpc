import mongoose from "mongoose";
let connection = null;
async function connectDb() {
  console.log("Connecting to MongoDB...");
  if (connection) return connection;
  console.log("connection");
  const db = await mongoose.createConnection(process.env.MONGO_URI, {
    dbName: process.env.MONGODB_DB_NAME,
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 10000,
  }).asPromise();
  db.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });
  db.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });
  connection = db;
  return connection;
}
function getDbConnection() {
  if (!connection) {
    throw new Error(
      "Database connection not established. Call connectDb() first.",
    );
  }
  return connection;
}
export { connectDb, getDbConnection };
