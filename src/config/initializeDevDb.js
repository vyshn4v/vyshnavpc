import mongoose from "mongoose";
let connection = null;
async function connectDb() {
  console.log("Connecting to MongoDB...");
  if (connection) return connection;
  console.log("connection");
  const db1 = await mongoose.createConnection(process.env.MONGO_URI, {
    dbName: "portfolio_local",
  });
  db1.on("connected", () => {
    console.log("Connected to MongoDB successfully");
  });
  db1.on("error", (err) => {
    console.error("Error connecting to MongoDB:", err);
  });
  connection = db1;
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
