import mongoose from "mongoose";

export let isDBConnected = false;

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/ai-answer-engine";
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
    isDBConnected = true;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    console.warn("Continuing without MongoDB. Persistence and admin analytics will be disabled.");
    isDBConnected = false;
  }
};
