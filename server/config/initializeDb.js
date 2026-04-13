import mongoose from "mongoose";

const initializeDb = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI, {
        dbName: "portfolio",
      })
      .then(() => {
        console.log("Connected to MongoDB");
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default initializeDb;
