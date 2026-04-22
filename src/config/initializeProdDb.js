import mongoose from "mongoose";

const db1 = await mongoose.createConnection(process.env.MONGO_URI, {
  dbName: "portfolio",
});
db1.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});
db1.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

export default db1;
