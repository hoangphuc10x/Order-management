import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("DATABASE_URI is not defined in environment variables.");
}

export const connectDB = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB at:", DATABASE_URI);
    await mongoose.connect(DATABASE_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully!");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
  }
};

